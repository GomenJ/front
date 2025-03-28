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
import { Loader } from "@/components/loader";

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
		return <Loader />;
	}

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="">volumen</TableHead>
						<TableHead>meses</TableHead>
						<TableHead>fee</TableHead>
						{Number(percantage) > 0 ? (
							<TableHead>comisión de {percantage}%</TableHead>
						) : null}
						<TableHead>Version</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.fees.map((rowData) => (
						<TableRow key={Number(rowData.fee) + Math.random()}>
							<TableCell>{rowData.volumen}</TableCell>
							<TableCell>{rowData.meses}</TableCell>
							<TableCell>{rowData.fee}</TableCell>
							{Number(percantage) > 0 ? (
								<TableCell>
									{Number(
										Number(`0.${percantage}`) * Number(rowData.fee),
									).toFixed(4)}
								</TableCell>
							) : null}
							<TableCell>{rowData.fee_version}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
};
