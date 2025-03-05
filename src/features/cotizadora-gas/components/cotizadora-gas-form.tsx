import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";

import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

import { Input } from "@/components/ui/input";
import { useState } from "react";

import { cotizadoraGasFormSchema } from "../schemas/cotizadora-gas-form-schema";
import { useCotizadoraStore } from "../stores/cotizadora-store";
import { getDates } from "../api/get-dates";
import { disableDays } from "../utils/disable-days";
import { getGasData } from "../api/get-gas-data";
import { CotizadoraGas } from "../types/cotizadora-gas-type";
import { useAuthStore } from "@/stores/auth-store";
import { Checkbox } from "@/components/ui/checkbox";
import { useFeeQuery } from "../hooks/useFeeQuery";

type CotizadoraGasFormProps = {
	handleNextStep: () => void;
};

export const CotizadoraGasForm = ({
	handleNextStep,
}: CotizadoraGasFormProps) => {
	const [selectedField, setSelectedField] = useState<string | null>(null);
	const formValues = useCotizadoraStore((state) => state);
	const [comision, setComision] = useState(false);
	const user = useAuthStore((state) => state.user);
	// const [fee, setFee] = useState<number | null>(formValues?.fee?.fee);
	const [invoiceArray, setInvoiceArray] = useState<CotizadoraGas[]>(
		formValues.data || [],
	);
	const { mutate, isGettingFee } = useFeeQuery();
	const [gasData, setGasData] = useState<{
		indice: string;
		tradeDate: string;
	} | null>(null);

	const setCotizadoraValues = useCotizadoraStore(
		(state) => state.setCotizadoraValues,
	);

	// 1. Define your form.
	const form = useForm<z.infer<typeof cotizadoraGasFormSchema>>({
		resolver: zodResolver(cotizadoraGasFormSchema),
		defaultValues: {
			index: formValues.index,
			tradeDate: formValues.tradeDate,
			startDate: formValues.startDate || "",
			period: formValues.period,
			volume: formValues.volume,
			clientName: formValues.clientName,
			comision: false,
			percantage: "0",
		},
	});

	// Fetch dates when selectedField changes
	const { data: availableDates, isLoading } = useQuery({
		queryKey: ["availableDates", selectedField],
		queryFn: () => getDates(selectedField!),
		enabled: !!selectedField, // Prevents execution when null
		refetchOnWindowFocus: false, // Prevents refetching when the tab is focused
		refetchOnReconnect: false, // Prevents refetching when the internet reconnects
		refetchOnMount: false, // Prevents refetching when the component mounts
	});

	const { data } = useQuery({
		queryKey: ["gasData"],
		queryFn: () => getGasData(gasData!),
		enabled: !!gasData,
		refetchOnWindowFocus: false, // Prevents refetching when the tab is focused
		refetchOnReconnect: false, // Prevents refetching when the internet reconnects
		refetchOnMount: false, // Prevents refetching when the component mounts
	});

	function onSubmit(values: z.infer<typeof cotizadoraGasFormSchema>) {
		// ✅ This will be type-safe and validated.
		setCotizadoraValues({ ...formValues, ...values, data: invoiceArray });
		const months = Number(values.period) + 1;

		mutate(
			{ volume: Number(values.volume.replaceAll(",", "")), months },
			{
				onSuccess: () => {
					handleNextStep();
				},
			},
		);
		// if (!isGettingFee) {
		// 	handleNextStep();
		// }
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
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Indice</FormLabel>
								<Select
									onValueChange={(value) => {
										field.onChange(value);
										setSelectedField(value); // Trigger fetch
										form.setValue("tradeDate", "");
										form.setValue("startDate", "");
										form.setValue("period", "");
										form.setValue("volume", "");
										form.setValue("clientName", "");
										setGasData(null);
									}}
								>
									<FormControl>
										<SelectTrigger className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
											<SelectValue placeholder="HSC" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="EP">El Paso Permian</SelectItem>
										<SelectItem value="HSC">Houston Ship Channel</SelectItem>
										<SelectItem value="SCL">SoCal Border Avg.</SelectItem>
										<SelectItem value="WAH">Waha</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="tradeDate"
						render={({ field }) => (
							<FormItem className="">
								<FormLabel>TradeDate</FormLabel>
								<Popover>
									<PopoverTrigger asChild className="">
										<FormControl className="">
											<Button
												variant={"outline"}
												className={cn(
													"pl-3 text-left font-normal",
													!field.value && "text-muted-foreground",
												)}
												disabled={!selectedField || isLoading} // Disable when fetching
											>
												{field.value ? (
													format(field.value, "dd/MM/yyyy")
												) : (
													<span>Elige una fecha</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											locale={es}
											mode="single"
											selected={field.value as Date}
											onSelect={(e) => {
												field.onChange(e);
												setGasData({
													indice: form.getValues("index"),
													tradeDate: format(e as Date, "yyyy-MM-dd"),
												});
											}}
											className=""
											disabled={(date) =>
												disableDays(date, availableDates, user)
											}
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="startDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-semibold">
									Inicio de la cobertura
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
												disabled={!form.getValues("tradeDate")}
											>
												{field.value && data
													? format(
															data.find(
																(data) =>
																	data.flow_date ===
																	(field.value as unknown as Date),
															)?.flow_date || "",
															"MMM-yy",
														)
													: "Elige una fecha"}
												<ChevronsUpDown className="opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="p-0">
										<Command>
											<CommandInput
												placeholder="Search framework..."
												className="h-9"
											/>
											<CommandList>
												<CommandEmpty>Fecha no encontrada</CommandEmpty>
												<CommandGroup>
													{data &&
														data.map((dattum) => (
															<CommandItem
																key={crypto.randomUUID()}
																value={dattum.flow_date as unknown as string}
																onSelect={() => {
																	form.setValue("startDate", dattum.flow_date);
																	form.setValue("period", "");

																	const index = data.findIndex(
																		(data) =>
																			data.flow_date ===
																			form.getValues("startDate"),
																	);

																	setInvoiceArray([...data.slice(index)]);
																}}
															>
																{format(dattum.flow_date, "MMM-yy")}
																<Check
																	className={cn(
																		"ml-auto",
																		dattum.flow_date === field.value
																			? "opacity-100"
																			: "opacity-0",
																	)}
																/>
															</CommandItem>
														))}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

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
												disabled={!form.getValues("tradeDate")}
											>
												{field.value && invoiceArray.length > 0
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
													{invoiceArray &&
														invoiceArray.map((_, index) => {
															// if (
															// 	index === 5 ||
															// 	index === 11 ||
															// 	index === 17 ||
															// 	index === 23
															// ) {
															if (index <= 23) {
																return (
																	<CommandItem
																		key={crypto.randomUUID()}
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
								<FormMessage />
							</FormItem>
						)}
					/>

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
										placeholder="50,000 MMBTu/mes"
										{...field}
										disabled={!form.getValues("tradeDate")}
										className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
										autoComplete="off"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

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
										disabled={!form.getValues("tradeDate")}
										type="text"
										placeholder="Luxem Energía"
										{...field}
										className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
										autoComplete="off"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="comision"
						render={({ field }) => (
							<FormItem className="flex items-center gap-4">
								<FormLabel className="font-semibold">
									¿Requiere comisión?
								</FormLabel>
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={(e) => {
											field.onChange(e);
											setComision(e as boolean);
										}}
										className="peer border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-4 h-5 w-4 w-5 shrink-0 rounded-sm border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="percantage"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-semibold">
									Porcentaje de comisión
								</FormLabel>
								<FormControl>
									<Input
										type="text"
										disabled={!comision}
										placeholder="0"
										{...field}
										className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="mb-10 inline self-start"
						disabled={isGettingFee}
					>
						Calcular
					</Button>
				</form>
			</Form>
		</>
	);
};
