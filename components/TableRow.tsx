import { TableRowProps } from "@/interfaces";

const TableRow: React.FC<TableRowProps> = ({ type, row }): JSX.Element => {
	switch (row.type) {
		case "group":
			return (
				<div className="">
					{row.id} {row.type}
				</div>
			);
		case "project":
			return (
				<div className="">
					{row.id} {row.type}
				</div>
			);
		case "member":
			return (
				<div className="">
					{row.id} {row.type}
				</div>
			);
		case "info":
			return (
				<div className="">
					{row.id} {row.type}
				</div>
			);
	}
};
export default TableRow;
