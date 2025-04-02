"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { AlertCircle, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AddRowForm } from "./AddRowForm";
import { EditRowForm } from "./EditRowForm";
import {
	Group,
	Info,
	Member,
	OrganogramFormProps,
	Project,
	Row,
} from "../interfaces";
import ImportCSVForm from "./ImportCSVForm";
import {
	clearLocalStorage,
	isLocalStorageAvailable,
	loadFromLocalStorage,
	saveToLocalStorage,
} from "@/lib/storage";

export default function OrganogramForm({
	rows,
	setRows,
	error,
	isAddDialogOpen,
	setIsAddDialogOpen,
	isImportDialogOpen,
	setIsImportDialogOpen,
	setIsClearStorageDialogOpen,
	isClearStorageDialogOpen,
	storageAvailable,
	setStorageAvailable,
	setLastSaved,
}: OrganogramFormProps) {
	const [editingRow, setEditingRow] = useState<Row | null>(null);
	const [deletingRowId, setDeletingRowId] = useState<string | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	// Check if localStorage is available and load saved data on mount
	useEffect(() => {
		const available = isLocalStorageAvailable();
		setStorageAvailable(available);

		if (available) {
			const savedData = loadFromLocalStorage();
			if (savedData && savedData.length > 0) {
				setRows(savedData);
			}
		}
	}, []);

	// Save data to localStorage whenever rows change
	useEffect(() => {
		if (storageAvailable && rows) {
			saveToLocalStorage(rows);
			setLastSaved(new Date());
		}
	}, [rows, storageAvailable]);

	const handleClearStorage = () => {
		clearLocalStorage();
		setRows(undefined);
		setIsClearStorageDialogOpen(false);
	};

	// Gets the highest ID from the rows array to ensure new IDs are unique.
	const getLastId = (): number => {
		if (!rows || rows.length === 0) return 0;

		// Parse IDs as numbers and find the maximum
		const ids = rows.map((row) => {
			const parsed = parseInt(row.id, 10);
			return isNaN(parsed) ? 0 : parsed;
		});
		return Math.max(...ids);
	};

	const getParentIds = (): { id: string; title: string }[] => {
		if (!rows) return [];
		return rows.map((row) => ({ id: row.id, title: row.title || "" }));
	};

	const handleRowClick = (row: Row) => {
		setEditingRow(row);
		setIsEditDialogOpen(true);
	};

	const confirmDelete = (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		setDeletingRowId(id);
		setIsDeleteDialogOpen(true);
	};

	const handleDeleteRow = () => {
		if (!rows || !deletingRowId) return;
		setRows(rows.filter((row) => row.id !== deletingRowId));
		setIsDeleteDialogOpen(false);
		setDeletingRowId(null);
	};

	// Helper function to safely get field values
	const getFieldValue = (row: Row, field: string): string => {
		if (field === "role") {
			if (row.type === "member") {
				const roleValue = (row as Member).role;
				if (roleValue) {
					return roleValue;
				} else {
					return "-";
				}
			}
			if (row.type === "group") return (row as Group).role || "-";
			if (row.type === "project") return (row as Project).role || "-";
			if (row.type === "info") return (row as Info).role || "-";
		}

		if (field === "acronym") {
			if (row.type === "group") return (row as Group).acronym || "-";
			if (row.type === "project") return (row as Project).acronym || "-";
			if (row.type === "member") return (row as Member).acronym || "-";
			if (row.type === "info") return (row as Info).acronym || "-";
		}

		if (field === "institution") {
			if (row.type === "group") return (row as Group).institution || "-";
			if (row.type === "project") return (row as Project).institution || "-";
			if (row.type === "member") return (row as Member).institution || "-";
			if (row.type === "info") return (row as Info).institution || "-";
		}

		if (field === "country") {
			if (row.type === "group") return (row as Group).country || "-";
			if (row.type === "project") return (row as Project).country || "-";
			if (row.type === "member") return (row as Member).country || "-";
			if (row.type === "info") return (row as Info).country || "-";
		}

		if (field === "pi") {
			if (row.type === "group") return (row as Group).pi || "-";
			if (row.type === "project") return (row as Project).pi || "-";
			if (row.type === "member") return (row as Member).pi || "-";
			if (row.type === "info") return (row as Info).pi || "-";
		}

		if (field === "picture") {
			if (row.type === "group") return (row as Group).picture || "";
			if (row.type === "project") return (row as Project).picture || "";
			if (row.type === "member") return (row as Member).picture || "";
			if (row.type === "info") return (row as Info).picture || "";
		}

		if (field === "link") {
			if (row.type === "group") return (row as Group).link || "";
			if (row.type === "project") return (row as Project).link || "";
			if (row.type === "member") return (row as Member).link || "";
			if (row.type === "info") return (row as Info).link || "";
		}

		return "-";
	};

	return (
		<div className="container mx-auto pb-8">
			<Card className="mb-8 w-full">
				<CardContent>
					{error && (
						<Alert variant="destructive" className="mb-6">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{!storageAvailable && (
						<Alert className="mb-6">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								Local storage is not available in your browser. Your data will
								not be saved between sessions.
							</AlertDescription>
						</Alert>
					)}

					{rows ? (
						<div className="border rounded-md overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[80px]">ID</TableHead>
										<TableHead className="w-[80px]">Parent ID</TableHead>
										<TableHead className="min-w-[200px]">Title</TableHead>
										<TableHead className="w-[100px]">Type</TableHead>
										<TableHead className="w-[100px]">Acronym</TableHead>
										<TableHead className="min-w-[150px]">Institution</TableHead>
										<TableHead className="w-[120px]">Country</TableHead>
										<TableHead className="w-[100px]">PI</TableHead>
										<TableHead className="w-[100px]">Role</TableHead>
										<TableHead className="w-[120px]">Picture</TableHead>
										<TableHead className="min-w-[150px]">Link</TableHead>
										<TableHead className="w-[80px]">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{rows.map((row) => (
										<TableRow
											key={row.id}
											onClick={() => handleRowClick(row)}
											className="cursor-pointer hover:bg-muted"
										>
											<TableCell>{row.id}</TableCell>
											<TableCell>{row.parentId || "-"}</TableCell>
											<TableCell className="font-medium">{row.title}</TableCell>
											<TableCell>{row.type}</TableCell>
											<TableCell>{getFieldValue(row, "acronym")}</TableCell>
											<TableCell>{getFieldValue(row, "institution")}</TableCell>
											<TableCell>{getFieldValue(row, "country")}</TableCell>
											<TableCell>{getFieldValue(row, "pi")}</TableCell>
											<TableCell>{getFieldValue(row, "role")}</TableCell>
											<TableCell>
												{getFieldValue(row, "picture") ? (
													<div className="relative h-8 w-8 overflow-hidden rounded-full">
														<img
															src={getFieldValue(row, "picture")}
															alt={`${row.title} picture`}
															className="object-cover"
														/>
													</div>
												) : (
													"-"
												)}
											</TableCell>
											<TableCell>
												{getFieldValue(row, "link") ? (
													<a
														href={getFieldValue(row, "link")}
														target="_blank"
														rel="noopener noreferrer"
														onClick={(e) => e.stopPropagation()}
														className="text-blue-500 hover:underline truncate block max-w-[150px]"
													>
														{getFieldValue(row, "link")}
													</a>
												) : (
													"-"
												)}
											</TableCell>
											<TableCell>
												<Button
													variant="ghost"
													size="icon"
													onClick={(e) => confirmDelete(row.id, e)}
												>
													<Trash className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					) : (
						<div className="text-center py-12 border rounded-md bg-muted/20">
							<p className="text-muted-foreground">
								Upload a CSV file to get started
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Add Row Dialog */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Add New Row</DialogTitle>
						<DialogDescription>
							Fill in the details for the new row
						</DialogDescription>
					</DialogHeader>

					{rows && (
						<AddRowForm
							lastId={getLastId()}
							parentIds={getParentIds()}
							setRows={setRows}
							setOpen={setIsAddDialogOpen}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* Edit Row Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Edit Row</DialogTitle>
						<DialogDescription>
							Update the details for this row
						</DialogDescription>
					</DialogHeader>

					{editingRow && rows && (
						<EditRowForm
							row={editingRow}
							parentIds={getParentIds().filter(
								(parent) => parent.id !== editingRow.id
							)}
							setRows={setRows}
							setOpen={setIsEditDialogOpen}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={isDeleteDialogOpen}
				onOpenChange={() => setIsDeleteDialogOpen(false)}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this row? This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex space-x-2 pt-4">
						<Button
							variant="outline"
							onClick={() => setIsDeleteDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDeleteRow}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Clear Storage Confirmation Dialog */}
			<Dialog
				open={isClearStorageDialogOpen}
				onOpenChange={setIsClearStorageDialogOpen}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Clear Saved Data</DialogTitle>
						<DialogDescription>
							Are you sure you want to clear all saved data? This will remove
							all data from your browser&apos;s storage and cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex space-x-2 pt-4">
						<Button
							variant="outline"
							onClick={() => setIsClearStorageDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleClearStorage}>
							Clear Data
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<ImportCSVForm
				setRows={setRows}
				rows={rows}
				getLastId={getLastId}
				isImportDialogOpen={isImportDialogOpen}
				setIsImportDialogOpen={setIsImportDialogOpen}
			/>
		</div>
	);
}
