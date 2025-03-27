/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Row, Type, Role, ExternalCSVRow } from "../interfaces";

export async function fetchExternalCSV(url: string): Promise<ExternalCSVRow[]> {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch CSV: ${response.statusText}`);
		}

		const csvText = await response.text();
		return parseExternalCSV(csvText);
	} catch (error) {
		console.error("Error fetching external CSV:", error);
		throw error;
	}
}

export function parseExternalCSV(csvText: string): ExternalCSVRow[] {
	const lines = csvText.split("\n");
	const headers = lines[0].split(",").map((h) => h.trim());

	return lines
		.slice(1)
		.filter((line) => line.trim())
		.map((line) => {
			// Handle quoted values with commas inside
			const values: string[] = [];
			let currentValue = "";
			let insideQuotes = false;

			for (let i = 0; i < line.length; i++) {
				const char = line[i];

				if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
					insideQuotes = !insideQuotes;
				} else if (char === "," && !insideQuotes) {
					values.push(currentValue.trim());
					currentValue = "";
				} else {
					currentValue += char;
				}
			}

			// Add the last value
			values.push(currentValue.trim());

			// Remove quotes from values
			const cleanValues = values.map((val) => {
				if (val.startsWith('"') && val.endsWith('"')) {
					return val.substring(1, val.length - 1);
				}
				return val;
			});

			const row: any = {};

			headers.forEach((header, index) => {
				if (header) {
					// Skip empty headers
					row[header] = index < cleanValues.length ? cleanValues[index] : "";
				}
			});

			return row as ExternalCSVRow;
		});
}

// Function to find matching members in existing data
export function findMatchingMember(
	externalRow: ExternalCSVRow,
	existingRows: Row[]
): Row | undefined {
	// Normalize strings for comparison
	const normalizeString = (str: string) =>
		str.toLowerCase().trim().replace(/\s+/g, " ");

	const normalizedName = normalizeString(externalRow.full_name);

	// First try to find an exact match by name and institution
	const exactMatch = existingRows.find(
		(row) =>
			row.type === "member" &&
			normalizeString(row.title) === normalizedName &&
			(row as any).institution &&
			normalizeString((row as any).institution) ===
				normalizeString(externalRow.institution)
	);

	if (exactMatch) return exactMatch;

	// If no exact match, try just by name
	const nameMatch = existingRows.find(
		(row) =>
			row.type === "member" && normalizeString(row.title) === normalizedName
	);

	return nameMatch;
}

// Function to find info rows associated with a member
export function findAssociatedInfoRow(
	memberId: string,
	existingRows: Row[]
): Row | undefined {
	return existingRows.find(
		(row) => row.type === "info" && row.parentId === memberId
	);
}

export function mapExternalRowsToOrganogramRows(
	externalRows: ExternalCSVRow[],
	existingRows: Row[],
	lastId: number,
	parentId?: string
): {
	newRows: Row[];
	updatedRows: Row[];
	newInfoRows: Row[];
	updatedInfoRows: Row[];
} {
	const newRows: Row[] = [];
	const updatedRows: Row[] = [];
	const newInfoRows: Row[] = [];
	const updatedInfoRows: Row[] = [];
	let idCounter = lastId;

	externalRows.forEach((externalRow) => {
		// Check if this member already exists
		const existingMember = findMatchingMember(externalRow, existingRows);

		// Map the role from external format to our Role enum if possible
		let mappedRole: Role | string = externalRow.project_role;

		// Try to find a matching role in our enum
		const roleMatch = Object.values(Role).find(
			(role) => role.toLowerCase() === externalRow.project_role.toLowerCase()
		);

		if (roleMatch) {
			mappedRole = roleMatch;
		}

		let memberId: string;

		if (existingMember) {
			// Update the existing member
			const updatedMember = {
				...existingMember,
				title: externalRow.full_name,
				institution: externalRow.institution,
				country: externalRow.country_residence,
				expertise: externalRow.expertise || (existingMember as any).expertise,
				role: mappedRole as Role,
			};

			updatedRows.push(updatedMember as Row);
			memberId = existingMember.id;
		} else {
			// Create a new member
			idCounter++;
			const newMember: Row = {
				id: idCounter.toString(),
				parentId: parentId || undefined,
				title: externalRow.full_name,
				type: Type.Member,
				role: mappedRole as Role,
				institution: externalRow.institution,
				country: externalRow.country_residence,
				expertise: externalRow.expertise,
			} as Row;

			newRows.push(newMember);
			memberId = idCounter.toString();
		}

		// Now handle the info row for this member
		const associatedInfoRow = findAssociatedInfoRow(memberId, existingRows);

		if (associatedInfoRow) {
			// Update the existing info row
			const updatedInfoRow = {
				...associatedInfoRow,
				expertise:
					externalRow.expertise || (associatedInfoRow as any).expertise,
			};
			updatedInfoRows.push(updatedInfoRow as Row);
		} else if (externalRow.expertise) {
			// Create a new info row if expertise exists
			idCounter++;
			const newInfoRow: Row = {
				id: idCounter.toString(),
				parentId: memberId,
				type: Type.Info,
				link: "", // Required field for info type
				bio: "", // Required field for info type
				expertise: externalRow.expertise,
			} as Row;

			newInfoRows.push(newInfoRow);
		}
	});

	return { newRows, updatedRows, newInfoRows, updatedInfoRows };
}
