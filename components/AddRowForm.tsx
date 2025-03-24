import { useState } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { AddRowFormProps, Role, Row, Type } from "@/interfaces";

export function AddRowForm({
	lastId,
	parentIds,
	setRows,
	setOpen,
}: AddRowFormProps) {
	const [selectedType, setSelectedType] = useState<Type>(Type.Group);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const newRow = {
			id: (lastId + 1).toString(),
			type: selectedType,
		};

		// Add all form fields to the row
		for (const [key, value] of formData.entries()) {
			if (key === "parentId" && value === "no-parent") {
				// Skip parentId for "no-parent" value
				continue;
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(newRow as any)[key] = value;
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
									{parentIds.map((parent) => (
										<SelectItem key={parent.id} value={parent.id}>
											{parent.title} (ID: {parent.id})
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
