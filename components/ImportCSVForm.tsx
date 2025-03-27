import { useRef, useState } from "react";

import { AlertCircle, FileUp, RefreshCw } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ExternalCSVRow, ImportCSVFormProps, Row } from "@/interfaces";
import {
	fetchExternalCSV,
	findAssociatedInfoRow,
	findMatchingMember,
	mapExternalRowsToOrganogramRows,
	parseExternalCSV,
} from "@/lib/csv-importer";

export default function ImportCSVForm({
	rows,
	setRows,
	getLastId,
	isImportDialogOpen,
	setIsImportDialogOpen,
}: ImportCSVFormProps) {
	const [importUrl, setImportUrl] = useState("");
	const [importParentId, setImportParentId] = useState<string>("");
	const [importPreview, setImportPreview] = useState<ExternalCSVRow[]>([]);
	const [isImporting, setIsImporting] = useState(false);
	const [importError, setImportError] = useState<string | null>(null);
	const [importStats, setImportStats] = useState<{
		newCount: number;
		updateCount: number;
		newInfoCount: number;
		updateInfoCount: number;
	} | null>(null);

	const importFileInputRef = useRef<HTMLInputElement>(null);

	const handleImportUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setImportUrl(e.target.value);
	};

	const handleImportFileUpload = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const csvText = e.target?.result as string;
				// Use the imported function directly instead of require
				const parsedRows = parseExternalCSV(csvText);
				setImportPreview(parsedRows.slice(0, 5)); // Show first 5 rows as preview
				setImportError(null);
			} catch (err) {
				setImportError(
					"Failed to parse external CSV file. Please check the format."
				);
				console.error(err);
			}
		};
		reader.readAsText(file);
	};

	const fetchPreview = async () => {
		if (!importUrl && !importFileInputRef.current?.files?.length) {
			setImportError("Please enter a URL or select a file");
			return;
		}

		setIsImporting(true);
		setImportError(null);

		try {
			let externalRows: ExternalCSVRow[];

			if (importUrl) {
				externalRows = await fetchExternalCSV(importUrl);
			} else if (importFileInputRef.current?.files?.length) {
				const file = importFileInputRef.current.files[0];
				const csvText = await file.text();
				externalRows = parseExternalCSV(csvText);
			} else {
				throw new Error("No import source specified");
			}

			setImportPreview(externalRows.slice(0, 5)); // Show first 5 rows as preview

			// Calculate import statistics if we have existing rows
			if (rows) {
				let updateCount = 0;
				let newCount = 0;
				let newInfoCount = 0;
				let updateInfoCount = 0;

				externalRows.forEach((externalRow) => {
					const existingMember = findMatchingMember(externalRow, rows);

					if (existingMember) {
						updateCount++;
						// Check if there's an associated info row
						const infoRow = findAssociatedInfoRow(existingMember.id, rows);
						if (infoRow) {
							updateInfoCount++;
						} else if (externalRow.expertise) {
							newInfoCount++;
						}
					} else {
						newCount++;
						if (externalRow.expertise) {
							newInfoCount++;
						}
					}
				});

				setImportStats({
					newCount,
					updateCount,
					newInfoCount,
					updateInfoCount,
				});
			}
		} catch (error) {
			setImportError(`Failed to fetch or parse the CSV: ${error}`);
		} finally {
			setIsImporting(false);
		}
	};

	const confirmImport = async () => {
		if (!rows) return;

		setIsImporting(true);
		setImportError(null);

		try {
			let externalRows: ExternalCSVRow[];

			if (importUrl) {
				externalRows = await fetchExternalCSV(importUrl);
			} else if (importFileInputRef.current?.files?.length) {
				const file = importFileInputRef.current.files[0];
				const csvText = await file.text();
				externalRows = parseExternalCSV(csvText);
			} else {
				throw new Error("No import source specified");
			}

			// Map external rows to our format, checking for existing members and info rows
			const { newRows, updatedRows, newInfoRows, updatedInfoRows } =
				mapExternalRowsToOrganogramRows(
					externalRows,
					rows,
					getLastId(),
					importParentId === "no-parent" ? undefined : importParentId
				);

			// Create a new array with updated rows
			const updatedRowsMap = new Map<string, Row>();

			// Add member updates to the map
			updatedRows.forEach((row) => {
				updatedRowsMap.set(row.id, row);
			});

			// Add info row updates to the map
			updatedInfoRows.forEach((row) => {
				updatedRowsMap.set(row.id, row);
			});

			const updatedRowsArray = rows.map((row) =>
				updatedRowsMap.has(row.id) ? updatedRowsMap.get(row.id)! : row
			) as Row[];

			// Add new rows (both members and info rows)
			setRows([...updatedRowsArray, ...newRows, ...newInfoRows]);

			setIsImportDialogOpen(false);
			setImportUrl("");
			setImportParentId("");
			setImportPreview([]);

			if (importFileInputRef.current) {
				importFileInputRef.current.value = "";
			}
		} catch (error) {
			setImportError(`Failed to import the CSV: ${error}`);
		} finally {
			setIsImporting(false);
		}
	};

	return (
		<Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Import Additional Data</DialogTitle>
					<DialogDescription>
						Import data from an external CSV format and add it to your
						organogram
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<Tabs defaultValue="file" className="w-full">
						<TabsList className="grid grid-cols-2 mb-4">
							<TabsTrigger value="file">Upload File</TabsTrigger>
							<TabsTrigger value="url">From URL</TabsTrigger>
						</TabsList>

						<div className="space-y-2">
							<Label htmlFor="importParentId">
								Assign Parent ID (Optional)
							</Label>
							<Select value={importParentId} onValueChange={setImportParentId}>
								<SelectTrigger>
									<SelectValue placeholder="Select a parent ID" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="no-parent">No Parent</SelectItem>
									{rows &&
										rows.map((row) => (
											<SelectItem key={row.id} value={row.id}>
												{row.id} - {row.title}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
							<p className="text-sm text-muted-foreground">
								All imported rows will be assigned to this parent. Leave empty
								to import without a parent.
							</p>
						</div>

						<TabsContent value="file" className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="importFile">Upload External CSV File</Label>
								<div className="flex items-center gap-2">
									<Button
										onClick={() => importFileInputRef.current?.click()}
										variant="outline"
										className="w-full"
									>
										<FileUp className="h-4 w-4 mr-2" />
										Select File
									</Button>
									<input
										type="file"
										id="importFile"
										ref={importFileInputRef}
										onChange={handleImportFileUpload}
										accept=".csv"
										className="hidden"
									/>
								</div>
							</div>
							{importFileInputRef.current &&
								importFileInputRef.current.files &&
								importFileInputRef.current.files.length > 0 && (
									<Button
										onClick={fetchPreview}
										disabled={isImporting}
										variant="outline"
										className="w-full mt-2"
									>
										<RefreshCw
											className={`h-4 w-4 mr-2 ${
												isImporting ? "animate-spin" : ""
											}`}
										/>
										Generate Preview
									</Button>
								)}
						</TabsContent>

						<TabsContent value="url" className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="importUrl">External CSV URL</Label>
								<div className="flex items-center gap-2">
									<Input
										id="importUrl"
										value={importUrl}
										onChange={handleImportUrlChange}
										placeholder="https://example.com/data.csv"
									/>

									<Button
										onClick={fetchPreview}
										disabled={isImporting}
										variant="outline"
									>
										<RefreshCw
											className={`h-4 w-4 ${isImporting ? "animate-spin" : ""}`}
										/>
										Fetch Preview
									</Button>
								</div>
							</div>
						</TabsContent>
					</Tabs>

					{importError && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{importError}</AlertDescription>
						</Alert>
					)}

					{importPreview.length > 0 && (
						<div className="space-y-2">
							<h3 className="text-lg font-medium">Preview (First 5 rows)</h3>
							<div className="border rounded-md overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Country</TableHead>
											<TableHead>Institution</TableHead>
											<TableHead>Role</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{importPreview.map((row, index) => (
											<TableRow key={index}>
												<TableCell>{row.full_name}</TableCell>
												<TableCell>{row.country_residence}</TableCell>
												<TableCell>{row.institution}</TableCell>
												<TableCell>{row.project_role}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
							<p className="text-sm text-muted-foreground">
								These rows will be imported as Member type entries.
							</p>

							{importStats && (
								<div className="flex items-center gap-2">
									<RefreshCw className="h-4 w-4" />
									<small>
										Import will add {importStats.newCount} new members and
										update {importStats.updateCount} existing members.
										Additionally, {importStats.newInfoCount} new info rows will
										be created and {importStats.updateInfoCount} existing info
										rows will be updated.
									</small>
								</div>
							)}
						</div>
					)}
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsImportDialogOpen(false)}
					>
						Cancel
					</Button>
					<Button
						onClick={confirmImport}
						disabled={isImporting || importPreview.length === 0}
					>
						{isImporting ? "Importing..." : "Import Data"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
