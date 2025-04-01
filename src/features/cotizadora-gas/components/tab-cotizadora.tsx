import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCotizadoraStore } from "../stores/cotizadora-store";
import { GasTable } from "./gas-table";
import { useAuthStore } from "@/stores/auth-store";
import { PDFViewer } from "@react-pdf/renderer";
import { CotizadoraGasInvoice } from "./cotizadora-invoice";
import { FeeTable } from "./fee-table";
import { LineChartCotizadora } from "./line-chart-cotizadora";

type TabCotizadoraProps = {
	startDate: string;
	endDate: string;
	period: number;
	tradeDate: string;
	guaranty: number;
	volume: number;
	averagePrice: number;
};

export const TabCotizadora = ({
	startDate,
	endDate,
	period,
	guaranty,
	volume,
	averagePrice,
}: TabCotizadoraProps) => {
	const user = useAuthStore((state) => state.user);
	const cotizadoraValues = useCotizadoraStore((state) => state);
	const months = Number(cotizadoraValues.period) + 1;
	const data = cotizadoraValues.data.slice(0, months);

	return (
		<Tabs defaultValue="statistics" className="mx-auto mb-10 w-[1/2] px-28">
			<TabsList className="mx-auto">
				<TabsTrigger value="statistics">Line chart</TabsTrigger>
				<TabsTrigger value="curva">Tabla curva forward</TabsTrigger>
				<TabsTrigger value="preview_pdf">PDF Preview</TabsTrigger>
				{user?.role === "admin" ? (
					<TabsTrigger value="fee">Tabla de Fee</TabsTrigger>
				) : null}
			</TabsList>
			<TabsContent value="statistics">
				<LineChartCotizadora />
			</TabsContent>

			<TabsContent value="curva">
				{cotizadoraValues.data.length > 0 ? <GasTable data={data} /> : null}
			</TabsContent>
			<TabsContent value="preview_pdf">
				<PDFViewer className="h-[700px] w-full">
					<CotizadoraGasInvoice
						startDate={startDate}
						endDate={endDate}
						guarantyPrice={String(guaranty)}
						volume={volume}
						period={String(period)}
						index={cotizadoraValues.index}
						clientName={cotizadoraValues.clientName}
						averagePrice={String(averagePrice)}
					/>
				</PDFViewer>
			</TabsContent>
			{user?.role === "admin" ? (
				<TabsContent value="fee">
					<FeeTable />
				</TabsContent>
			) : null}
		</Tabs>
	);
};
