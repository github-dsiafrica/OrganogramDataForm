import { TableRowProps } from "@/interfaces";

const TableRow: React.FC<TableRowProps> = ({ type, row }): JSX.Element => {
	return <div className="">{row.id}</div>;
};
export default TableRow;
