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
				rows?.map((row) => <TableRow type={row.type} row={row} key={row.id} />)
			)}
		</main>
	);
}
