"use client";

import AddRowForm from "@/components/AddRowForm";
import TableRow from "@/components/TableRow";
import { Row } from "@/interfaces";
import Papa from "papaparse";
import { FormEventHandler, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
	const [rows, setRows] = useState<Row[]>();
	const [fetching, setFetching] = useState<boolean>(true);

	const handleFile: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		const file = formData.get("csv") as File;
		Papa.parse(file, {
			header: true,
			complete: (result) => {
				setRows(result.data as Row[]);
				setFetching(false);
				console.log(result.data);
			},
		});
	};

	return (
		<main className="container mx-auto">
			<form className="py-4 w-fit space-y-4" onSubmit={handleFile}>
				<Input required type="file" name="csv" id="csv" />
				<Button type="submit">Submit</Button>
			</form>

			<Dialog>
				<DialogTrigger asChild>
					<Button disabled={fetching} variant="outline">
						Add row
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add a new row</DialogTitle>
						{rows?.length && (
							<AddRowForm
								lastId={parseInt(rows[rows.length - 1].id) + 1}
								parentIds={rows.map((row) => row.id)}
								setRows={setRows}
							/>
						)}
					</DialogHeader>
				</DialogContent>
			</Dialog>

			{fetching ? (
				<p className="py-4">Fetching data...</p>
			) : (
				<>
					<div className="font-bold grid grid-cols-12 sticky top-0 bg-white pt-4">
						<p>id</p>
						<p>parentId</p>
						<p>title</p>
						<p>acronym</p>
						<p>institution</p>
						<p>country</p>
						<p>picture</p>
						<p>pi</p>
						<p>link</p>
						<p>bio</p>
						<p>expertise</p>
						<p>role</p>
					</div>
					{rows?.map((row) => (
						<TableRow row={row} key={row.id} />
					))}
				</>
			)}
		</main>
	);
}
