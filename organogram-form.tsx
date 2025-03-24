"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Download, FileUp, Plus, Trash } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types
export enum Type {
	Group = "group",
	Project = "project",
	Member = "member",
	Info = "info",
}

export enum Role {
	ContactPI = "Contact PI",
	MPI = "MPI",
	PI = "PI",
	CoPI = "Co-PI",
	ProgramManager = "Program Manager",
	ProjectManagerCoordinator = "Project Manager/Coordinator",
	ProjectCoordinator = "Project Coordinator",
	Administrator = "Administrator",
	AdministrativeAssistant = "Administrative Assistant",
	Collaborator = "Collaborator",
	Collaboration = "Collaboration",
	Consultant = "Consultant",
	CoInvestigator = "Co-Investigator",
	DMACLeadMember = "DMAC Lead/Member",
	DataAnalyst = "Data Analyst",
	DataCurator = "Data curator",
	DataManager = "Data Manager",
	DataScientist = "Data scientist",
	eLwaziUgandaNodeBioinformaticianDataScientist = "eLwazi Uganda Node Bioinformatician/Data Scientist",
	HubDeputyDirector = "Hub Deputy Director",
	MastersStudent = "Master's student",
	MemberAndCoChairIWG = "Member and co-chair I-WG",
	MemberCollaborator = "Member/Collaborator",
	PhDStudent = "PhD Student",
	PhDTrainee = "PhD Trainee",
	PostDoc = "Post-Doc",
	PreDoc = "Pre-Doc",
	ProjectTeamMember = "Project Team Member",
	REDCapAdministrator = "REDCap Administrator",
	REDCapDatabaseDeveloper = "REDCap Database Developer",
	ResearchAssistant = "Research Assistant",
	ResearchFellow = "Research Fellow",
	Researcher = "Researcher",
	Sequencing = "Sequencing",
	SiteInvestigator = "Site Investigator",
	SitePI = "Site PI",
	SoftwareDeveloper = "Software Developer",
	SoftwareEngineer = "Software Engineer",
	SystemAdminDataScientist = "System Admin | Data Scientist",
	SystemsAdministrator = "Systems Administrator",
	TrainingAndOutreachCoordinator = "Training And Outreach Coordinator",
	TrainingCoordinator = "Training Coordinator",
	WebDeveloper = "Web Developer",
}

type Group = {
	id: string;
	title: string;
	parentId?: string;
	acronym: string;
	type: "group";
	link: string;
	institution?: string;
	country?: string;
	picture?: string;
	pi?: string;
	bio?: string;
	expertise?: string;
	role?: string;
};

type Project = {
	id: string;
	parentId: string;
	title: string;
	acronym?: string;
	institution: string;
	country: string;
	picture: string;
	pi: string;
	type: "project";
	link?: string;
	bio?: string;
	expertise?: string;
	role?: string;
};

type Member = {
	id: string;
	parentId: string;
	title: string;
	picture?: string;
	type: "member";
	role: Role;
	institution?: string;
	country?: string;
	acronym?: string;
	pi?: string;
	link?: string;
	bio?: string;
	expertise?: string;
};

type Info = {
	id: string;
	parentId: string;
	type: "info";
	link: string;
	bio: string;
	expertise?: string;
	title?: string;
	acronym?: string;
	institution?: string;
	country?: string;
	picture?: string;
	pi?: string;
	role?: string;
};

export type Row = Group | Project | Member | Info;

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
			const value = (row as any)[header] || "";
			// Escape commas in values
			return value.includes(",") ? `"${value}"` : value;
		});
		csvLines.push(values.join(","));
	});

	return csvLines.join("\n");
};

export default function OrganogramForm() {
	const [rows, setRows] = useState<Row[] | undefined>();
	const [editingRow, setEditingRow] = useState<Row | null>(null);
	const [deletingRowId, setDeletingRowId] = useState<string | null>(null);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);
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

	const getLastId = (): number => {
		if (!rows || rows.length === 0) return 0;
		return Math.max(...rows.map((row) => Number.parseInt(row.id)));
	};

	const getParentIds = (): string[] => {
		if (!rows) return [];
		return rows.map((row) => row.id);
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

		if (field === "role") {
			if (row.type === "member") return (row as Member).role || "-";
			if (row.type === "group") return (row as Group).role || "-";
			if (row.type === "project") return (row as Project).role || "-";
			if (row.type === "info") return (row as Info).role || "-";
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
		<div className="container mx-auto py-8">
			<Card className="mb-8 w-full">
				<CardHeader>
					<CardTitle>DS-I Africa Organogram Data Manager</CardTitle>
					<CardDescription>
						Upload, edit, and manage the data for the DS-I Africa organogram
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-4 mb-6">
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
							<Button
								onClick={handleDownloadCSV}
								variant="outline"
								className="flex items-center gap-2"
							>
								<Download className="h-4 w-4" />
								Download CSV
							</Button>
						)}
						{rows && (
							<Button
								onClick={() => setIsAddDialogOpen(true)}
								variant="default"
								className="flex items-center gap-2 ml-auto"
							>
								<Plus className="h-4 w-4" />
								Add Row
							</Button>
						)}
					</div>

					{error && (
						<Alert variant="destructive" className="mb-6">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
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
															src={
																getFieldValue(row, "picture") ||
																"/placeholder.svg"
															}
															alt={`${row.title} picture`}
															className="object-cover"
															onError={(e) => {
																(e.target as HTMLImageElement).src =
																	"/placeholder.svg?height=32&width=32";
															}}
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
							parentIds={getParentIds().filter((id) => id !== editingRow.id)}
							setRows={setRows}
							setOpen={setIsEditDialogOpen}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
		</div>
	);
}

interface AddRowFormProps {
	lastId: number;
	parentIds: string[];
	setRows: React.Dispatch<React.SetStateAction<Row[] | undefined>>;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddRowForm({ lastId, parentIds, setRows, setOpen }: AddRowFormProps) {
	const [selectedType, setSelectedType] = useState<Type>(Type.Group);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const newRow: any = {
			id: (lastId + 1).toString(),
			type: selectedType,
		};

		// Add all form fields to the row
		for (const [key, value] of formData.entries()) {
			if (key === "parentId" && value === "no-parent") {
				// Skip parentId for "no-parent" value
				continue;
			}
			newRow[key] = value;
		}

		setRows((prev) => (prev ? [...prev, newRow as Row] : [newRow as Row]));
		setOpen(false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Tabs
				defaultValue={Type.Group}
				onValueChange={(value) => setSelectedType(value as Type)}
			>
				<TabsList className="grid grid-cols-4 mb-4">
					<TabsTrigger value={Type.Group}>Group</TabsTrigger>
					<TabsTrigger value={Type.Project}>Project</TabsTrigger>
					<TabsTrigger value={Type.Member}>Member</TabsTrigger>
					<TabsTrigger value={Type.Info}>Info</TabsTrigger>
				</TabsList>

				<div className="space-y-4 mb-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="parentId">Parent ID</Label>
							<Select name="parentId">
								<SelectTrigger>
									<SelectValue placeholder="Select a parent" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="no-parent">No Parent</SelectItem>
									{parentIds.map((id) => (
										<SelectItem key={id} value={id}>
											{id}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input id="title" name="title" />
						</div>
					</div>

					<TabsContent value={Type.Group} className="space-y-4 mt-0">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="acronym">Acronym</Label>
								<Input id="acronym" name="acronym" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="link">Link</Label>
								<Input id="link" name="link" />
							</div>
						</div>
					</TabsContent>

					<TabsContent value={Type.Project} className="space-y-4 mt-0">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="acronym">Acronym</Label>
								<Input id="acronym" name="acronym" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="institution">Institution</Label>
								<Input id="institution" name="institution" required />
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="country">Country</Label>
								<Input id="country" name="country" required />
							</div>
							<div className="space-y-2">
								<Label htmlFor="pi">PI</Label>
								<Input id="pi" name="pi" required />
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="picture">Picture URL</Label>
								<Input id="picture" name="picture" required />
							</div>
							<div className="space-y-2">
								<Label htmlFor="link">Link</Label>
								<Input id="link" name="link" />
							</div>
						</div>
					</TabsContent>

					<TabsContent value={Type.Member} className="space-y-4 mt-0">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="picture">Picture URL</Label>
								<Input id="picture" name="picture" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="role">Role</Label>
								<Select name="role" required>
									<SelectTrigger>
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
									<SelectContent>
										{Object.values(Role).map((role) => (
											<SelectItem key={role} value={role}>
												{role}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</TabsContent>

					<TabsContent value={Type.Info} className="space-y-4 mt-0">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="link">Link</Label>
								<Input id="link" name="link" required />
							</div>
							<div className="space-y-2">
								<Label htmlFor="expertise">Expertise</Label>
								<Input id="expertise" name="expertise" />
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="bio">Bio</Label>
							<Textarea id="bio" name="bio" required />
						</div>
					</TabsContent>
				</div>
			</Tabs>

			<DialogFooter>
				<Button type="button" variant="outline" onClick={() => setOpen(false)}>
					Cancel
				</Button>
				<Button type="submit">Add Row</Button>
			</DialogFooter>
		</form>
	);
}

interface EditRowFormProps {
	row: Row;
	parentIds: string[];
	setRows: React.Dispatch<React.SetStateAction<Row[] | undefined>>;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditRowForm({ row, parentIds, setRows, setOpen }: EditRowFormProps) {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const updatedRow: any = {
			...row,
		};

		// Update all form fields in the row
		for (const [key, value] of formData.entries()) {
			if (key === "parentId" && value === "no-parent") {
				// Handle "no-parent" value
				updatedRow.parentId = undefined;
			} else {
				updatedRow[key] = value;
			}
		}

		setRows((prev) =>
			prev
				? prev.map((r) => (r.id === row.id ? (updatedRow as Row) : r))
				: [updatedRow as Row]
		);
		setOpen(false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="space-y-4 mb-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="id">ID</Label>
						<Input id="id" name="id" value={row.id} readOnly />
					</div>

					<div className="space-y-2">
						<Label htmlFor="parentId">Parent ID</Label>
						<Select name="parentId" defaultValue={row.parentId || "no-parent"}>
							<SelectTrigger>
								<SelectValue placeholder="Select a parent" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="no-parent">No Parent</SelectItem>
								{parentIds.map((id) => (
									<SelectItem key={id} value={id}>
										{id}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input id="title" name="title" defaultValue={row.title || ""} />
					</div>

					<div className="space-y-2">
						<Label htmlFor="type">Type</Label>
						<Input id="type" name="type" value={row.type} readOnly />
					</div>
				</div>

				{/* Conditional fields based on row type */}
				{row.type === Type.Group && (
					<>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="acronym">Acronym</Label>
								<Input
									id="acronym"
									name="acronym"
									defaultValue={(row as Group).acronym || ""}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="link">Link</Label>
								<Input
									id="link"
									name="link"
									defaultValue={(row as Group).link || ""}
								/>
							</div>
						</div>
					</>
				)}

				{row.type === Type.Project && (
					<>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="acronym">Acronym</Label>
								<Input
									id="acronym"
									name="acronym"
									defaultValue={(row as Project).acronym || ""}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="institution">Institution</Label>
								<Input
									id="institution"
									name="institution"
									defaultValue={(row as Project).institution || ""}
									required
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="country">Country</Label>
								<Input
									id="country"
									name="country"
									defaultValue={(row as Project).country || ""}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="pi">PI</Label>
								<Input
									id="pi"
									name="pi"
									defaultValue={(row as Project).pi || ""}
									required
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="picture">Picture URL</Label>
								<Input
									id="picture"
									name="picture"
									defaultValue={(row as Project).picture || ""}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="link">Link</Label>
								<Input
									id="link"
									name="link"
									defaultValue={(row as Project).link || ""}
								/>
							</div>
						</div>
					</>
				)}

				{row.type === Type.Member && (
					<>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="picture">Picture URL</Label>
								<Input
									id="picture"
									name="picture"
									defaultValue={(row as Member).picture || ""}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="role">Role</Label>
								<Select
									name="role"
									defaultValue={(row as Member).role}
									required
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
									<SelectContent>
										{Object.values(Role).map((role) => (
											<SelectItem key={role} value={role}>
												{role}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</>
				)}

				{row.type === Type.Info && (
					<>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="link">Link</Label>
								<Input
									id="link"
									name="link"
									defaultValue={(row as Info).link || ""}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="expertise">Expertise</Label>
								<Input
									id="expertise"
									name="expertise"
									defaultValue={(row as Info).expertise || ""}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="bio">Bio</Label>
							<Textarea
								id="bio"
								name="bio"
								defaultValue={(row as Info).bio || ""}
								required
							/>
						</div>
					</>
				)}
			</div>

			<DialogFooter>
				<Button type="button" variant="outline" onClick={() => setOpen(false)}>
					Cancel
				</Button>
				<Button type="submit">Save Changes</Button>
			</DialogFooter>
		</form>
	);
}
