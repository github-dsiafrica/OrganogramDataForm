"use client";

import TableRow from "@/components/TableRow";
import { Row } from "@/interfaces";
import Papa from "papaparse";
import { FormEventHandler, useState } from "react";

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
				console.log(result);
			},
		});
	};

	return (
		<main>
			<form onSubmit={handleFile}>
				<input type="file" name="csv" id="csv" />
				<button type="submit">Submit</button>
			</form>

			{fetching ? (
				<p>Fetching data...</p>
			) : (
				<>
					<div className="font-bold grid grid-cols-12">
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
