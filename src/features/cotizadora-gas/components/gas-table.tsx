import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableHead,
	TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import type { CotizadoraGas } from "../types/cotizadora-gas-type";

export const GasTable = ({ data }: { data: CotizadoraGas[] }) => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>TradeDate</TableHead>
					<TableHead>FlowDate</TableHead>
					<TableHead>Indice</TableHead>
					<TableHead>Precio</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((rowData) => (
					<TableRow key={crypto.randomUUID()}>
						<TableCell className="font-medium">
							{format(rowData.trade_date, "dd/MM/yy")}
						</TableCell>
						<TableCell>{format(rowData.flow_date, "MMM-yy")}</TableCell>
						<TableCell>{rowData.indice}</TableCell>
						<TableCell>{rowData.precio}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
