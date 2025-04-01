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
import { useState, useEffect } from "react";
import { Loader } from "@/components/loader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cotizadoraInvoiceFormSchema } from "../schemas/cotizadora-invoice-form-schema";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

import { useFeeQuery } from "../hooks/use-fee-query";

type CotizadoraInvoiceFormProps = {
	handleBackStep: () => void;
};

export const CotizadoraInvoiceForm = ({
	handleBackStep,
}: CotizadoraInvoiceFormProps) => {
	const [isLoadingForm, setIsLoadingForm] = useState(true);
	const cotizadoraValues = useCotizadoraStore((state) => state);
	const reset = useCotizadoraStore((state) => state.reset);
	const user = useAuthStore((state) => state.user);
	const period = Number(cotizadoraValues.period) + 1;
	const { mutate, isGettingFee } = useFeeQuery();
	const setCotizadoraValues = useCotizadoraStore(
		(state) => state.setCotizadoraValues,
	);

	// 1. Define your form.
	const form = useForm<z.infer<typeof cotizadoraInvoiceFormSchema>>({
		resolver: zodResolver(cotizadoraInvoiceFormSchema),
		defaultValues: {
			clientName: cotizadoraValues.clientName,
			period: cotizadoraValues.period,
			volume: cotizadoraValues.volume,
		},
	});

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
		.toFixed(3);

	const average = Number(Number(total) / array.length).toFixed(3);
	const fee = Number(cotizadoraValues.fee?.fee).toFixed(3);
	const percentage = Number(`0.${cotizadoraValues.percantage}`);
	const comisionFee = Number(Number(fee) * percentage).toFixed(3);
	const totalVolume = volume * period;
	const totalAverage = Number(comisionFee) + Number(average) + Number(fee!);
	const averagePrice = Number(totalAverage.toFixed(3));
	const guaranty = totalVolume * Number(averagePrice) * 0.22;

	const pdfName = `${cotizadoraValues.clientName.replaceAll(" ", "_")}_${format(cotizadoraValues.tradeDate, "yyyy-MM-dd")}.pdf`;
	useEffect(() => {
		setTimeout(() => {
			setIsLoadingForm(false);
		}, 1500);
	}, [isLoadingForm]);

	function onSubmit(values: z.infer<typeof cotizadoraInvoiceFormSchema>) {
		const meses = Number(values.period) + 1;

		// ✅ This will be type-safe and validated.
		setCotizadoraValues({
			...cotizadoraValues,
			...values,
			// chartData: [cotizadoraValues.data, array],
		});
		// const meses = Number(values.period) + 1;
		setIsLoadingForm(true);

		mutate({ volume: Number(values.volume.replaceAll(",", "")), meses });
	}

	if (isLoadingForm) {
		return (
			<>
				<Loader size={200} />
			</>
		);
	}

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mx-auto grid w-[45%] space-y-4 md:min-w-40"
				>
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

					<FormField
						control={form.control}
						name="volume"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-semibold">
									Volumen mensual (MMBTu)
								</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="15,000 MMBTu/mes"
										{...field}
										className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
										autoComplete="off"
									/>
								</FormControl>
								<FormDescription>Este campo se puede editar</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* <div> */}
					{/* 	<Label className="font-semibold">Volumen mensual</Label> */}
					{/* 	<Input */}
					{/* 		type="text" */}
					{/* 		readOnly */}
					{/* 		defaultValue={cotizadoraValues.volume} */}
					{/* 		className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50" */}
					{/* 	/> */}
					{/* </div> */}

					{/* <div> */}
					{/* 	<Label className="font-semibold">Nombre del cliente</Label> */}
					{/* 	<Input */}
					{/* 		type="text" */}
					{/* 		readOnly */}
					{/* 		defaultValue={cotizadoraValues.clientName} */}
					{/* 		className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50" */}
					{/* 	/> */}
					{/* </div> */}
					<FormField
						control={form.control}
						name="clientName"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-semibold">
									Nombre del cliente
								</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="Luxem Energía"
										{...field}
										className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
										autoComplete="off"
									/>
								</FormControl>
								<FormDescription>Este campo se puede editar</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* <div> */}
					{/* 	<Label className="font-semibold">Periodo del contrato</Label> */}
					{/* 	<Input */}
					{/* 		type="text" */}
					{/* 		readOnly */}
					{/* 		defaultValue={period} */}
					{/* 		className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50" */}
					{/* 	/> */}
					{/* </div> */}
					<FormField
						control={form.control}
						name="period"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-semibold">
									Periodo de la cobertura (meses)
								</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												role="combobox"
												className={cn(
													"justify-between",
													!field.value && "text-muted-foreground",
												)}
											>
												{field.value && cotizadoraValues.data.length > 0
													? Number(field?.value) + 1
													: "Elige el periodo de meses"}
												<ChevronsUpDown className="opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="p-0">
										<Command>
											<CommandInput
												placeholder="Busca los periodos..."
												className="h-9"
											/>
											<CommandList className="hide-scrollbar">
												<CommandEmpty>
													No existe un periodo para esta fecha
												</CommandEmpty>
												<CommandGroup>
													{cotizadoraValues.data &&
														cotizadoraValues.data.map((invoice, index) => {
															if (index <= 23) {
																return (
																	<CommandItem
																		key={invoice.id}
																		value={String(index + 1)}
																		onSelect={() => {
																			form.setValue("period", String(index));
																		}}
																	>
																		{index + 1}
																		<Check
																			className={cn(
																				"ml-auto",
																				String(index) === field.value
																					? "opacity-100"
																					: "opacity-0",
																			)}
																		/>
																	</CommandItem>
																);
															}
														})}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
								<FormDescription>Este campo se puede editar</FormDescription>

								<FormMessage />
							</FormItem>
						)}
					/>

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
							defaultValue={`${totalVolume.toLocaleString("es-MX")} MMBTu`}
							className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>

					<div>
						<Label className="font-semibold">Precio de garantía</Label>
						<Input
							type="text"
							readOnly
							defaultValue={`${guaranty.toLocaleString("es-MX", { style: "currency", currency: "MXN" })} USD`}
							className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>

					<div className="mb-10 flex justify-between">
						<Button
							disabled={isGettingFee}
							onClick={() => {
								// setIsLoadingForm(true);
							}}
						>
							<PDFDownloadLink
								fileName={`${pdfName}`}
								document={
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
								}
							>
								{({ loading }) =>
									loading ? "Cargando documento" : "Descargar PDF"
								}
							</PDFDownloadLink>
						</Button>
						<Button
							type="submit"
							disabled={isGettingFee}
							onClick={() => {
								// setIsLoadingForm(true);
								onSubmit(form.getValues());
							}}
						>
							Recalcular oferta
						</Button>

						<Button
							disabled={isGettingFee}
							onClick={() => {
								reset();
								handleBackStep();
							}}
						>
							Crear nueva oferta
						</Button>
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
