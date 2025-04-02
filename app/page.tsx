"use client";

import { useState, useRef } from "react";
import Image from "next/image";

import { Database, Download, FileUp, Plus, Save, Upload } from "lucide-react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Role, Row } from "@/interfaces";
import OrganogramForm from "../components/OrganogramForm";

export default function Home() {
	const [rows, setRows] = useState<Row[] | undefined>();
	const [error, setError] = useState<string | null>(null);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
	const [isClearStorageDialogOpen, setIsClearStorageDialogOpen] =
		useState(false);
	const [storageAvailable, setStorageAvailable] = useState(false);
	const [lastSaved, setLastSaved] = useState<Date | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const csvText = e.target?.result as string;
				const parsedRows = parseCSV(csvText);
				setRows(parsedRows);
				setError(null);
			} catch (err) {
				setError("Failed to parse CSV file. Please check the format.");
				console.error(err);
			}
		};
		reader.readAsText(file);
	};

	const handleDownloadCSV = () => {
		if (!rows) return;

		const csvContent = generateCSV(rows);
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", "data.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Helper function to map role strings to Role enum values
	const mapRoleValue = (roleString: string): Role | undefined => {
		if (!roleString) {
			return Role.Researcher;
		}

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

		// Try to find a partial match
		for (const role of Object.values(Role)) {
			if (
				role.toLowerCase().includes(normalizedRoleString) ||
				normalizedRoleString.includes(role.toLowerCase())
			) {
				return role;
			}
		}

		// If no match found, return the first role as a fallback
		return Role.Researcher;
	};

	// CSV Parser
	const parseCSV = (csvText: string): Row[] => {
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

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const row: any = {};

				headers.forEach((header, index) => {
					const headerKey = header.trim();
					if (headerKey) {
						row[headerKey] = index < values.length ? values[index].trim() : "";
					}
				});

				// Special handling for role field if this is a member type
				if (row.type === "member") {
					// Make sure role exists, even if empty
					if (!row.role) {
						row.role = "";
					}

					// Try to map the role string to a valid Role enum value
					const roleValue = mapRoleValue(row.role);
					if (roleValue) {
						row.role = roleValue;
					}
				}

				return row as Row;
			});
	};

	// Helper function to properly escape CSV values
	const escapeCSVValue = (value: string): string => {
		// If the value contains commas, quotes, or newlines, it needs to be quoted
		if (
			value.includes(",") ||
			value.includes('"') ||
			value.includes("\n") ||
			value.includes("\r")
		) {
			// Double up any quotes in the value
			const escapedValue = value.replace(/"/g, '""');
			return `"${escapedValue}"`;
		}
		return value;
	};

	// CSV Generator
	const generateCSV = (rows: Row[]): string => {
		const headers = [
			"id",
			"parentId",
			"title",
			"acronym",
			"institution",
			"country",
			"picture",
			"pi",
			"type",
			"link",
			"bio",
			"expertise",
			"role",
		];

		const csvLines = [headers.join(",")];

		rows.forEach((row) => {
			const values = headers.map((header) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const value = (row as any)[header] || "";
				return escapeCSVValue(value);
			});
			csvLines.push(values.join(","));
		});

		return csvLines.join("\n");
	};

	const formatLastSaved = (date: Date): string => {
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

	return (
		<>
			<nav className="flex py-4 gap-8 justify-between items-center container mx-auto">
				<Image
					src="https://dsi-africa.org/sites/default/files/Logo%20-%20primary%20on%20white-%20transparent.png"
					width={300}
					height={200}
					alt="DS-I Africa Logo"
				/>
				<h1 className="text-3xl font-bold">
					DS-I Africa Organogram Data Generator
				</h1>
			</nav>
			<main className="min-h-screen bg-background w-full overflow-x-auto">
				<div className="container mx-auto relative">
					<Card>
						<CardHeader>
							<CardTitle>DS-I Africa Organogram Data Manager</CardTitle>
							<CardDescription>
								Upload, edit, and manage the data for the DS-I Africa organogram
							</CardDescription>
						</CardHeader>
					</Card>
					<div className="my-4 flex items-center gap-4 sticky left-0 right-0 top-0 bg-background z-10">
						<Button
							onClick={() => fileInputRef.current?.click()}
							className="flex items-center gap-2"
						>
							<FileUp className="h-4 w-4" />
							Upload CSV
						</Button>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileUpload}
							accept=".csv"
							className="hidden"
						/>

						{rows && (
							<>
								<Button
									onClick={() => setIsImportDialogOpen(true)}
									variant="outline"
									className="flex items-center gap-2"
								>
									<Upload className="h-4 w-4" />
									Import Additional Data
								</Button>

								<Button
									onClick={handleDownloadCSV}
									variant="outline"
									className="flex items-center gap-2"
								>
									<Download className="h-4 w-4" />
									Download CSV
								</Button>

								<Button
									onClick={() => setIsAddDialogOpen(true)}
									variant="default"
									className="flex items-center gap-2"
								>
									<Plus className="h-4 w-4" />
									Add Row
								</Button>

								{storageAvailable && (
									<Button
										onClick={() => setIsClearStorageDialogOpen(true)}
										variant="outline"
										className="flex items-center gap-2 ml-auto"
									>
										<Database className="h-4 w-4" />
										Clear Saved Data
									</Button>
								)}
							</>
						)}
					</div>

					{storageAvailable && lastSaved && (
						<div className="flex items-center text-sm text-muted-foreground mb-4">
							<Save className="h-3 w-3 mr-1" />
							<span>Auto-saved at {formatLastSaved(lastSaved)}</span>
						</div>
					)}
				</div>
				<OrganogramForm
					rows={rows}
					setRows={setRows}
					error={error}
					isAddDialogOpen={isAddDialogOpen}
					setIsAddDialogOpen={setIsAddDialogOpen}
					isImportDialogOpen={isImportDialogOpen}
					setIsImportDialogOpen={setIsImportDialogOpen}
					isClearStorageDialogOpen={isClearStorageDialogOpen}
					setIsClearStorageDialogOpen={setIsClearStorageDialogOpen}
					storageAvailable={storageAvailable}
					setStorageAvailable={setStorageAvailable}
					setLastSaved={setLastSaved}
				/>
			</main>
		</>
	);
}
