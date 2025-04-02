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

				if (char === '"') {
					// Check if this is an escaped quote (double quote) inside a quoted field
					if (insideQuotes && i + 1 < line.length && line[i + 1] === '"') {
						// Add a single quote to the value and skip the next quote
						currentValue += '"';
						i++;
					} else {
						// Toggle the insideQuotes flag
						insideQuotes = !insideQuotes;
					}
				} else if (char === "," && !insideQuotes) {
					// End of field
					values.push(currentValue.trim());
					currentValue = "";
				} else {
					currentValue += char;
				}
			}

			// Add the last value
			values.push(currentValue.trim());

			const row: any = {};

			headers.forEach((header, index) => {
				if (header) {
					// Skip empty headers
					row[header] = index < values.length ? values[index] : "";
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

// Add this helper function to map role strings to Role enum values
function mapRoleString(roleString: string): Role {
	// First try exact match
	if (Object.values(Role).includes(roleString as Role)) {
		return roleString as Role;
	}

	// Try case-insensitive match
	const normalizedRoleString = roleString.toLowerCase().trim();

	for (const role of Object.values(Role)) {
		if (role.toLowerCase() === normalizedRoleString) {
			return role;
		}
	}

	// Try to find a close match
	for (const role of Object.values(Role)) {
		// Remove spaces and special characters for comparison
		const simplifiedRole = role.toLowerCase().replace(/[^a-z0-9]/g, "");
		const simplifiedInput = normalizedRoleString.replace(/[^a-z0-9]/g, "");

		if (simplifiedRole === simplifiedInput) {
			return role;
		}
	}

	// If no match found, return a default role
	return Role.Researcher;
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
		const mappedRole: Role = mapRoleString(externalRow.project_role);

		let memberId: string;

		if (existingMember) {
			// Update the existing member
			const updatedMember = {
				...existingMember,
				title: externalRow.full_name,
				institution: externalRow.institution,
				country: externalRow.country_residence,
				expertise: externalRow.expertise || (existingMember as any).expertise,
				role: mappedRole,
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
				role: mappedRole,
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
