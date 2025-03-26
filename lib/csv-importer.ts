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

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export function mapExternalRowsToOrganogramRows(
	externalRows: ExternalCSVRow[],
	lastId: number,
	parentId?: string
): Row[] {
	return externalRows.map((externalRow, index) => {
		// Map the role from external format to our Role enum if possible
		let mappedRole: Role | string = externalRow.project_role;

		// Try to find a matching role in our enum
		const roleMatch = Object.values(Role).find(
			(role) => role.toLowerCase() === externalRow.project_role.toLowerCase()
		);

		if (roleMatch) {
			mappedRole = roleMatch;
		}

		// Create a new row with mapped fields
		return {
			id: (lastId + index + 1).toString(),
			parentId: parentId || undefined,
			title: externalRow.full_name,
			type: Type.Member,
			role: mappedRole as Role,
			institution: externalRow.institution,
			country: externalRow.country_residence,
			expertise: externalRow.expertise,
			// Additional fields could be added to bio as structured text
			bio: `Email: ${externalRow.email}
ORCID: ${externalRow.orcid}
Qualification: ${externalRow.highest_qualification}
Start Date: ${externalRow.start_date}
Initial Position: ${externalRow.initial_position}
Current Position: ${externalRow.current_position}
WGS: ${externalRow.wgs}`,
		} as Row;
	});
}
