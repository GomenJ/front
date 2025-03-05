import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableHead,
	TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import type { Gas } from "../types/gasType";

export const GasTable = ({ data }: { data: Gas[] }) => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">tradeDate</TableHead>
					<TableHead>FlowDate</TableHead>
					<TableHead>Indice</TableHead>
					<TableHead>Price</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((rowData) => (
					<TableRow key={crypto.randomUUID()}>
						<TableCell className="font-medium">
							{format(rowData.trade_date, "dd/MM/yy")}
						</TableCell>
						<TableCell>{format(rowData.flow_date, "MMM-yy")}</TableCell>
						<TableCell>{`${rowData.selected_indice}`}</TableCell>
						<TableCell>{rowData.total_precio}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
