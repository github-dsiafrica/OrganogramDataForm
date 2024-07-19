import { TableRowProps } from "@/interfaces";
import Image from "next/image";

const TableRow: React.FC<TableRowProps> = ({ row }): JSX.Element => {
	switch (row.type) {
		case "group":
			return (
				<div className="bg-slate-200 grid grid-cols-12 py-2">
					<p id={`id-${row.id}`}>{row.id}</p>
					<a href={`#id-${row.parentId}`}>{row.parentId}</a>
					<p>{row.title}</p>
					<p>{row.acronym}</p>
					<p></p>
					<p></p>
					<p></p>
					<p></p>
					<a href={row.link}>{row.link}</a>
					<p></p>
					<p></p>
					<p></p>
				</div>
			);
		case "project":
			return (
				<div className="bg-red-200 grid grid-cols-12 py-2">
					<p id={`id-${row.id}`}>{row.id}</p>
					<a href={`#id-${row.parentId}`}>{row.parentId}</a>
					<p>{row.title}</p>
					<p>{row?.acronym}</p>
					<p>{row.institution}</p>
					<p>{row.country}</p>

					{row.picture ? (
						<Image src={row?.picture} alt="picture" height={50} width={50} />
					) : (
						<p></p>
					)}

					<p>{row.pi}</p>
					<a href={row.link}>{row.link}</a>
					<p></p>
					<p></p>
					<p></p>
				</div>
			);
		case "member":
			return (
				<div className="bg-green-200 grid grid-cols-12 py-2">
					<p id={`id-${row.id}`}>{row.id}</p>
					<a href={`#id-${row.parentId}`}>{row.parentId}</a>
					<p>{row.title}</p>
					<p></p>
					<p></p>
					<p></p>

					{row.picture ? (
						<Image src={row?.picture} alt="picture" height={50} width={50} />
					) : (
						<p></p>
					)}

					<p></p>
					<p></p>
					<p></p>
					<p></p>
					<p>{row.role}</p>
				</div>
			);
		case "info":
			return (
				<div className="bg-blue-200 grid grid-cols-12 py-2">
					<p id={`id-${row.id}`}>{row.id}</p>
					<a href={`#id-${row.parentId}`}>{row.parentId}</a>
					<p></p>
					<p></p>
					<p></p>
					<p></p>
					<p></p>
					<p></p>
					<a href={row.link}>{row.link}</a>
					<p>{row.bio}</p>
					<p>{row.expertise}</p>
					<p></p>
				</div>
			);
	}
};
export default TableRow;
