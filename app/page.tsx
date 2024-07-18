"use client";

import Papa from "papaparse";
import { FormEventHandler } from "react";

export default function Home() {
	const handleFile: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		const file = formData.get("csv") as File;
		Papa.parse(file, {
			header: true,
			complete: (result) => {
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
		</main>
	);
}
