import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableHead,
	TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getFees } from "../api/get-fees";
import { useCotizadoraStore } from "../stores/cotizadora-store";

export const FeeTable = () => {
	const percantage = useCotizadoraStore((state) => state.percantage);
	const { data } = useQuery({
		queryKey: ["fees"],
		queryFn: () => getFees(),
		refetchOnWindowFocus: false, // Prevents refetching when the tab is focused
		refetchOnReconnect: false, // Prevents refetching when the internet reconnects
		refetchOnMount: false, // Prevents refetching when the component mounts
	});

	if (!data) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="">volumen</TableHead>
						<TableHead>meses</TableHead>
						<TableHead>fee</TableHead>
						{Number(percantage) > 0 ? <TableHead>comisión</TableHead> : null}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.availableDates.map((rowData) => (
						<TableRow key={crypto.randomUUID()}>
							<TableCell>{rowData.volumen_total}</TableCell>
							<TableCell>{rowData.months}</TableCell>
							<TableCell>{rowData.fee}</TableCell>
							{Number(percantage) > 0 ? (
								<TableCell>
									{Number(percantage) * Number(rowData.fee)}
								</TableCell>
							) : null}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
};
