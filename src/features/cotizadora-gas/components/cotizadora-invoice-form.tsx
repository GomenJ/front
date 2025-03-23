import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { cotizadoraInvoiceFormSchema } from "../schemas/cotizadora-invoice-form-schema";
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

	// const guarantyTotal =
	// 	guaranty.toLocaleString() !== undefined ? guaranty.toLocaleString() : 0;
	const pdfName = `${cotizadoraValues.clientName.replaceAll(" ", "_")}_${format(cotizadoraValues.tradeDate, "yyyy-MM-dd")}.pdf`;

	// 1. Define your form.
	const form = useForm<z.infer<typeof cotizadoraInvoiceFormSchema>>({
		resolver: zodResolver(cotizadoraInvoiceFormSchema),
		defaultValues: {},
	});

	function onSubmit(values: z.infer<typeof cotizadoraInvoiceFormSchema>) {
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mx-auto grid w-1/3 space-y-4 md:min-w-40"
				>
					<FormField
						control={form.control}
						name="index"
						render={() => (
							<FormItem>
								<FormLabel className="font-semibold">Indice</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="50,000 MMBTu/mes"
										readOnly
										defaultValue={cotizadoraValues.index}
										className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="tradeDate"
						render={() => (
							<FormItem>
								<FormLabel className="font-semibold">Trade date</FormLabel>
								<FormControl>
									<Input
										type="text"
										readOnly
										defaultValue={tradeDate}
										className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="volume"
						render={() => (
							<FormItem>
								<FormLabel className="font-semibold">Volumen</FormLabel>
								<FormControl>
									<Input
										type="text"
										readOnly
										defaultValue={cotizadoraValues.volume}
										className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="period"
						render={() => (
							<FormItem>
								<FormLabel className="font-semibold">Periodo</FormLabel>
								<FormControl>
									<Input
										type="text"
										readOnly
										defaultValue={period}
										className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{user?.role === "admin" ? (
						<div>
							<Label>Precio de curva forward</Label>
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
							<Label>Precio de fee</Label>
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
							<Label>Comisión fee</Label>
							<Input
								type="text"
								defaultValue={`$${comisionFee}`}
								readOnly
								className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							/>
						</div>
					) : null}

					<FormField
						control={form.control}
						name="average"
						render={() => (
							<FormItem>
								<FormLabel className="font-semibold">
									{user?.role === "admin"
										? "Precio final"
										: "Precio fijo a contratar"}
								</FormLabel>
								<FormControl>
									<Input
										type="text"
										defaultValue={`$${averagePrice} USD`}
										readOnly
										className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="totalVolume"
						render={() => (
							<FormItem>
								<FormLabel className="font-semibold">Volumen total</FormLabel>
								<FormControl>
									<Input
										type="text"
										readOnly
										defaultValue={`${totalVolume.toLocaleString()} MMBTu`}
										className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="guaranty"
						render={() => (
							<FormItem>
								<FormLabel className="font-semibold">
									Precio de garantía
								</FormLabel>
								<FormControl>
									<Input
										type="text"
										readOnly
										defaultValue={`$${guaranty.toLocaleString()} USD`}
										className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* <div>CotizadoraInvoiceForm</div> */}
					{/* <button onClick={handleBackStep}>Button</button> */}
					<div className="mb-10">
						<Button onClick={handleBackStep}>Regresar</Button>
						{/* <button */}
						{/* 	onClick={handleBackStep} */}
						{/* 	className="ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-md px-1 py-1.5 text-sm font-medium whitespace-nowrap shadow-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 aria-invalid:focus-visible:ring-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4" */}
						{/* > */}
						{/* 	Crear nueva oferta */}
						{/* </button> */}

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

						{/* <button className="ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-md px-1 py-1.5 text-sm font-medium whitespace-nowrap shadow-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 aria-invalid:focus-visible:ring-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"> */}
						{/* 	<PDFDownloadLink */}
						{/* 		fileName={`${pdfName}`} */}
						{/* 		document={ */}
						{/* 			<CotizadoraGasInvoice */}
						{/* 				startDate={startDate} */}
						{/* 				endDate={endDate} */}
						{/* 				tradeDate={tradeDate} */}
						{/* 				guarantyPrice={String(guaranty)} */}
						{/* 				volume={volume} */}
						{/* 				period={String(period)} */}
						{/* 				index={cotizadoraValues.index} */}
						{/* 				clientName={cotizadoraValues.clientName} */}
						{/* 				averagePrice={String(averagePrice)} */}
						{/* 			/> */}
						{/* 		} */}
						{/* 	> */}
						{/* 		{({ loading }) => */}
						{/* 			loading ? "Cargando documento" : "Descargar PDF" */}
						{/* 		} */}
						{/* 	</PDFDownloadLink> */}
						{/* </button> */}

						{/* <Button onClick={handleBackStep}></Button> */}
					</div>
				</form>
			</Form>
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
