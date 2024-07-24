"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Type, Row, AddRowFormProps } from "@/interfaces";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
}): JSX.Element => {
	// Create zod form schema inferring the fields from the Row type
	const schema = z.custom<Row>();

	const form = useForm<Row>({
		resolver: zodResolver(schema),
	});

	const onSubmit = (values: Row) => {
		console.log(values);
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
											<Input
												defaultValue={lastId}
												readOnly
												placeholder="ID"
												{...field}
											/>
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
											<Input placeholder="Title" {...field} />
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
						</>
					)}

					{form.watch("type") === Type.Project && (
						<>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input placeholder="Title" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					{form.watch("type") === Type.Member && (
						<>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input placeholder="Title" {...field} />
										</FormControl>
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
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input placeholder="Title" {...field} />
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
