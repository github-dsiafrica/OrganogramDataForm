import {
	EditRowFormProps,
	Group,
	Info,
	Member,
	Project,
	Role,
	Row,
	Type,
} from "@/interfaces";
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

export function EditRowForm({
	row,
	parentIds,
	setRows,
	setOpen,
}: EditRowFormProps) {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
								{parentIds.map((parent) => (
									<SelectItem key={parent.id} value={parent.id}>
										{parent.title} (ID: {parent.id})
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
