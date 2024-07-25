"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Type, Row, AddRowFormProps, Role } from "@/interfaces";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const AddRowForm: React.FC<AddRowFormProps> = ({
	lastId,
	parentIds,
	setRows,
	setOpen,
}): JSX.Element => {
	// Create zod form schema inferring the fields from the Row type
	const schema = z.custom<Row>();

	const form = useForm<Row>({
		resolver: zodResolver(schema),
		defaultValues: {
			id: lastId.toString(),
		},
	});

	const onSubmit = (values: Row) => {
		setRows((prev) => [values, ...(prev ?? [])]);
		setOpen(false);
	};

	return (
		<div className="">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Type</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
									required
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Type" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Object.values(Type).map((type) => (
											<SelectItem key={type} value={type}>
												{type}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* Render different fields based on type */}
					{form.watch("type") === Type.Group && (
						<>
							<FormField
								control={form.control}
								name="id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>ID</FormLabel>
										<FormControl>
											<Input readOnly required placeholder="ID" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="parentId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Parent ID</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Parent ID" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{parentIds.map((type) => (
													<SelectItem key={type} value={type}>
														{type}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input required placeholder="Title" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="acronym"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Acronym</FormLabel>
										<FormControl>
											<Input required placeholder="Acronym" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="link"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Link</FormLabel>
										<FormControl>
											<Input required placeholder="Link" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					{form.watch("type") === Type.Project && (
						<div className="grid grid-cols-2 gap-8">
							<FormField
								control={form.control}
								name="id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>ID</FormLabel>
										<FormControl>
											<Input readOnly required placeholder="ID" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="parentId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Parent ID</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											required
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Parent ID" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{parentIds.map((type) => (
													<SelectItem key={type} value={type}>
														{type}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input required placeholder="Title" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="acronym"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Acronym</FormLabel>
										<FormControl>
											<Input placeholder="Acronym" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="institution"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Institution</FormLabel>
										<FormControl>
											<Input required placeholder="Institution" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="country"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Country</FormLabel>
										<FormControl>
											<Input required placeholder="Country" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="picture"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Picture</FormLabel>
										<FormControl>
											<Input
												required
												type="file"
												placeholder="Picture"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="pi"
								render={({ field }) => (
									<FormItem>
										<FormLabel>PI</FormLabel>
										<FormControl>
											<Input required placeholder="PI" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="link"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Link</FormLabel>
										<FormControl>
											<Input placeholder="Link" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}

					{form.watch("type") === Type.Member && (
						<>
							<FormField
								control={form.control}
								name="id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>ID</FormLabel>
										<FormControl>
											<Input readOnly required placeholder="ID" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="parentId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Parent ID</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											required
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Parent ID" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{parentIds.map((type) => (
													<SelectItem key={type} value={type}>
														{type}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input required placeholder="Title" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="picture"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Picture</FormLabel>
										<FormControl>
											<Input type="file" placeholder="Picture" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											required
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Role" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(Role).map((role) => (
													<SelectItem key={role} value={role}>
														{role}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					{form.watch("type") === Type.Info && (
						<>
							<FormField
								control={form.control}
								name="id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>ID</FormLabel>
										<FormControl>
											<Input readOnly required placeholder="ID" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="parentId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Parent ID</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											required
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Parent ID" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{parentIds.map((type) => (
													<SelectItem key={type} value={type}>
														{type}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="link"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Link</FormLabel>
										<FormControl>
											<Input
												type="url"
												required
												placeholder="Link"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="bio"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Bio</FormLabel>
										<FormControl>
											<Textarea required placeholder="Bio" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="expertise"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Expertise</FormLabel>
										<FormControl>
											<Textarea placeholder="Expertise" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</div>
	);
};
export default AddRowForm;
