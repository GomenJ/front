import { Input } from "@/components/ui/input";
import { useCotizadoraStore } from "../stores/cotizadora-store";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CotizadoraGasInvoice } from "./cotizadora-invoice";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuthStore } from "@/stores/auth-store";
import { Label } from "@/components/ui/label";
import { TabCotizadora } from "./tab-cotizadora";

type CotizadoraInvoiceFormProps = {
	handleBackStep: () => void;
};

export const CotizadoraInvoiceForm = ({
	handleBackStep,
}: CotizadoraInvoiceFormProps) => {
	const cotizadoraValues = useCotizadoraStore((state) => state);
	const reset = useCotizadoraStore((state) => state.reset);
	const user = useAuthStore((state) => state.user);
	const period = Number(cotizadoraValues.period) + 1;
	const tradeDate = format(
		cotizadoraValues.tradeDate,
		"dd 'de' MMMM 'de' yyyy",
		{ locale: es },
	);
	const startDate = format(cotizadoraValues.startDate, "MMMM yyyy", {
		locale: es,
	});
	const array = cotizadoraValues.data.slice(0, period);
	const endDate = format(
		new Date(array[array.length - 1].flow_date),
		"MMMM yyyy",
		{ locale: es },
	);
	const volume = Number(cotizadoraValues.volume.replace(/,/g, ""));
	const total = array
		.reduce((acc, array) => acc + Number(array.precio), 0)
		.toFixed(4);

	const average = Number(Number(total) / array.length).toFixed(4);
	const fee = Number(cotizadoraValues.fee?.fee).toFixed(4);
	const percentage = Number(`0.${cotizadoraValues.percantage}`);
	const comisionFee = Number(Number(fee) * percentage).toFixed(4);
	const totalVolume = volume * period;
	const totalAverage = Number(comisionFee) + Number(average) + Number(fee!);
	const averagePrice = Number(totalAverage.toFixed(4));

	const guaranty = totalVolume * Number(averagePrice) * 0.22;

	const pdfName = `${cotizadoraValues.clientName.replaceAll(" ", "_")}_${format(cotizadoraValues.tradeDate, "yyyy-MM-dd")}.pdf`;

	return (
		<>
			<form className="mx-auto grid w-1/3 space-y-4 md:min-w-40">
				<div>
					<Label className="font-semibold">Indice</Label>
					<Input
						type="text"
						placeholder="50,000 MMBTu/mes"
						readOnly
						defaultValue={cotizadoraValues.index}
						className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>

				<div>
					<Label className="font-semibold">Inicio de contrato</Label>
					<Input
						type="text"
						placeholder="50,000 MMBTu/mes"
						readOnly
						defaultValue={format(array[0].flow_date, "MMMM 'de' yyyy", {
							locale: es,
						})}
						className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>

				<div>
					<Label className="font-semibold">Trade date</Label>
					<Input
						type="text"
						readOnly
						defaultValue={tradeDate}
						className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>

				<div>
					<Label className="font-semibold">Volumen mensual</Label>
					<Input
						type="text"
						readOnly
						defaultValue={cotizadoraValues.volume}
						className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>

				<div>
					<Label className="font-semibold">Periodo del contrato</Label>
					<Input
						type="text"
						readOnly
						defaultValue={period}
						className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>

				{user?.role === "admin" ? (
					<div>
						<Label className="font-semibold">Precio de curva forward</Label>
						<Input
							type="text"
							defaultValue={`$${average}`}
							readOnly
							className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
				) : null}

				{user?.role === "admin" ? (
					<div>
						<Label className="font-semibold">Precio de fee</Label>
						<Input
							type="text"
							defaultValue={`$${fee}`}
							readOnly
							className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
				) : null}

				{user?.role === "admin" && Number(comisionFee) > 0 ? (
					<div>
						<Label className="font-semibold">Comisión fee</Label>
						<Input
							type="text"
							defaultValue={`$${comisionFee}`}
							readOnly
							className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
				) : null}

				<div>
					<Label className="font-semibold">
						{user?.role === "admin"
							? "Precio final"
							: "Precio fijo a contratar"}
						{/* Precio de curva forward */}
					</Label>
					<Input
						type="text"
						defaultValue={`$${averagePrice} USD`}
						readOnly
						className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>

				<div>
					<Label className="font-semibold">Volumen total del contrato</Label>
					<Input
						type="text"
						readOnly
						defaultValue={`${totalVolume.toLocaleString()} MMBTu`}
						className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>

				<div>
					<Label className="font-semibold">Precio de garantía</Label>
					<Input
						type="text"
						readOnly
						defaultValue={`$${guaranty.toLocaleString()} USD`}
						className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>

				<div className="mb-10 flex justify-between">
					<Button>
						<PDFDownloadLink
							fileName={`${pdfName}`}
							document={
								<CotizadoraGasInvoice
									startDate={startDate}
									endDate={endDate}
									tradeDate={tradeDate}
									guarantyPrice={String(guaranty)}
									volume={volume}
									period={String(period)}
									index={cotizadoraValues.index}
									clientName={cotizadoraValues.clientName}
									averagePrice={String(averagePrice)}
								/>
							}
						>
							{({ loading }) =>
								loading ? "Cargando documento" : "Descargar PDF"
							}
						</PDFDownloadLink>
					</Button>

					<Button
						onClick={() => {
							reset();
							handleBackStep();
						}}
					>
						Crear nueva oferta
					</Button>
				</div>
			</form>
			<TabCotizadora
				startDate={startDate}
				endDate={endDate}
				period={period}
				volume={volume}
				guaranty={guaranty}
				tradeDate={tradeDate}
				averagePrice={averagePrice}
			/>
		</>
	);
};
