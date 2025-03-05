import { BlobProvider, PDFViewer } from "@react-pdf/renderer";
import { GasInvoice } from "./gas-invoice";
import { es } from "date-fns/locale";
import { format } from "date-fns";

type PricingModalProps = {
	formValues: FormValues;
	invoice: Invoice[];
};
type Invoice = {
	trade_date: string;
	flow_date: string;
	selected_indice: string;
	total_precio: string;
};

type FormValues = {
	clientName: string;
	period: string;
	startDate: string;
	volume: string;
};

export const PricingModal = ({ formValues, invoice }: PricingModalProps) => {
	const endIndex = Number(formValues.period) + 1;
	const array = invoice.slice(0, endIndex);
	const endDate = format(
		new Date(array[array.length - 1].flow_date),
		"MMMM yyyy",
		{ locale: es },
	);
	const month = Number(formValues.period) + 1;
	const total = array.reduce(
		(acc, array) => acc + Number(array.total_precio),
		0,
	);
	const volume = Number(formValues.volume.replace(/,/g, ""));
	const average = total / array.length;
	const totalVolume = volume * month;
	const guaranty = totalVolume * Number(average.toFixed(4)) * 0.22;
	const holgura = volume * Number(average.toFixed(2)) * month * 0.22;
	const tradeDate = new Date(invoice[0].trade_date);
	const fixTradeDate = new Date(tradeDate.setDate(tradeDate.getDate() + 1));
	const startDate = format(new Date(formValues.startDate), "MMMM yyyy", {
		locale: es,
	});

	return (
		<>
			<div className="w-[1000px] h-[600px]">
				<p>Precio: $ {average.toFixed(2)} USD/MMTBu</p>
				<p>
					Plazo: {month} {month === 1 ? "mes" : "meses"}
				</p>
				<p>Volumen Total: {totalVolume.toLocaleString()} MMBtu/periodo</p>
				<p className="mb-5">
					Valor de la garantía: $ {guaranty.toLocaleString()}{" "}
				</p>
				<p>Precio Precio real: $ {guaranty} USD/MMTBtu</p>
				<p>Precio holgura: ${holgura}</p>

				<BlobProvider
					document={
						<GasInvoice
							period={String(month)}
							volume={volume}
							endDate={endDate}
							clientName={formValues.clientName}
							index={invoice[0].selected_indice}
							startDate={startDate}
							price={guaranty.toFixed(3)}
							averagePrice={average.toFixed(3)}
							tradeDate={new Date(fixTradeDate)}
						/>
					}
				>
					{({ url }) => {
						return (
							<a
								href={url || ""}
								target="_blank"
								className="bg-red-300 py-2 px-4 mt-2 rounded-2xl mx-auto"
							>
								Open in new tab
							</a>
						);
					}}
				</BlobProvider>
				<PDFViewer className="w-full h-9/10">
					<GasInvoice
						period={String(month)}
						volume={volume}
						endDate={endDate}
						clientName={formValues.clientName}
						index={invoice[0].selected_indice}
						startDate={startDate}
						price={guaranty.toFixed(3)}
						averagePrice={average.toFixed(3)}
						tradeDate={fixTradeDate}
					/>
				</PDFViewer>
			</div>
		</>
	);
};
