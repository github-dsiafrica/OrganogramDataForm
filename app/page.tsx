"use client";

import { useState, useRef } from "react";
import Image from "next/image";

import { Download, FileUp, Plus, Upload } from "lucide-react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Row } from "@/interfaces";
import OrganogramForm from "../components/OrganogramForm";

export default function Home() {
	const [rows, setRows] = useState<Row[] | undefined>();
	const [error, setError] = useState<string | null>(null);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

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
		link.setAttribute("download", "organogram_data.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// CSV Parser
	const parseCSV = (csvText: string): Row[] => {
		const lines = csvText.split("\n");
		const headers = lines[0].split(",");

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
					row[header] = index < cleanValues.length ? cleanValues[index] : "";
				});

				return row as Row;
			});
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
				// Escape commas in values
				return value.includes(",") ? `"${value}"` : value;
			});
			csvLines.push(values.join(","));
		});

		return csvLines.join("\n");
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
									className="flex items-center gap-2 ml-auto"
								>
									<Plus className="h-4 w-4" />
									Add Row
								</Button>
							</>
						)}
					</div>
				</div>
				<OrganogramForm
					rows={rows}
					setRows={setRows}
					error={error}
					isAddDialogOpen={isAddDialogOpen}
					setIsAddDialogOpen={setIsAddDialogOpen}
					isImportDialogOpen={isImportDialogOpen}
					setIsImportDialogOpen={setIsImportDialogOpen}
				/>
			</main>
		</>
	);
}
