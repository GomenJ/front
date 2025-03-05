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
import { useAuthStore } from "@/stores/auth-store";

export const GasTable = ({ data }: { data: CotizadoraGas[] }) => {
	const user = useAuthStore((state) => state.user);

	// console.log(data);
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">tradeDate</TableHead>
					<TableHead>FlowDate</TableHead>
					{user?.role === "admin" ? <TableHead>Indice</TableHead> : null}
					{user?.role === "admin" ? <TableHead>Precio</TableHead> : null}
					<TableHead>Indice</TableHead>
					{user?.role === "admin" ? <TableHead>Precio</TableHead> : null}
					{user?.role === "admin" ? <TableHead>curva forward</TableHead> : null}
					{user?.role === "admin" ? (
						<TableHead>Precio final</TableHead>
					) : (
						<TableHead>Precio</TableHead>
					)}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((rowData) => (
					<TableRow key={crypto.randomUUID()}>
						<TableCell className="font-medium">
							{format(rowData.trade_date, "dd/MM/yy")}
						</TableCell>

						<TableCell>{format(rowData.flow_date, "MMM-yy")}</TableCell>
						{user?.role === "admin" ? (
							<TableCell>{rowData.hh_indice}</TableCell>
						) : null}
						{user?.role === "admin" ? (
							<TableCell>{rowData.hh_precio}</TableCell>
						) : null}
						<TableCell>{rowData.selected_indice}</TableCell>
						{user?.role === "admin" ? (
							<TableCell>{rowData.selected_precio}</TableCell>
						) : null}
						{user?.role === "admin" ? (
							<TableCell>{`${rowData.hh_indice}x${rowData.selected_indice}`}</TableCell>
						) : null}
						<TableCell>{rowData.total_precio}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
