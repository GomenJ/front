import { BlobProvider, PDFViewer } from "@react-pdf/renderer";
import { GasInvoice } from "./GasInvoice";

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
	console.log("formValues", formValues);
	console.log("invoice", invoice);

	const endIndex = Number(formValues.period) + 1;
	const array = invoice.slice(0, endIndex);
	const month = Number(formValues.period) + 1;
	const total = array.reduce(
		(acc, array) => acc + Number(array.total_precio),
		0,
	);
	const volume = Number(formValues.volume.replace(/,/g, ""));
	console.log(total);
	const average = total / array.length;
	const totalVolume = volume * month;
	// console.log(average);
	// const averagePrice = average.toFixed(2);
	// console.log(averagePrice);
	const guaranty = totalVolume * Number(average) * 0.22;
	// 3.19
	// 175,175

	console.log(array);
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

				<BlobProvider
					document={
						<GasInvoice
							period={String(month)}
							volume={volume}
							clientName={formValues.clientName}
							index={invoice[0].selected_indice}
							startDate={formValues.startDate}
							endDate={formValues.startDate}
							price={guaranty.toFixed(2)}
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
						clientName={formValues.clientName}
						index={invoice[0].selected_indice}
						startDate={formValues.startDate}
						endDate={formValues.startDate}
						price={guaranty.toFixed(2)}
					/>
				</PDFViewer>
			</div>
		</>
	);
};
