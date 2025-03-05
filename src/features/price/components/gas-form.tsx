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
import { gasFormSchema, step2GasFormSchema } from "../schemas/gasFormSchema";
import { useState } from "react";
import { Modal } from "@/components/Modal";
import { PricingModal } from "./pricing-modal";
import { getDates } from "../api/get-dates";
import { getGasData } from "../api/get-gas-data";
import { GasTable } from "./gas-table";
import { disableDays } from "../utils/disable-days";

export const GasForm = () => {
	// Fetch dates when selectedField changes
	const [selectedField, setSelectedField] = useState<string | null>(null);
	const [invoiceArray, setInvoiceArray] = useState([]);

	const [gasData, setGasData] = useState<{
		indice: string;
		tradeDate: string;
	} | null>(null);

	// 1. Define your form.
	const form = useForm<z.infer<typeof gasFormSchema>>({
		resolver: zodResolver(gasFormSchema),
		defaultValues: {
			tradeDate: "",
			field: "",
		},
	});

	const step2Form = useForm<z.infer<typeof step2GasFormSchema>>({
		resolver: zodResolver(step2GasFormSchema),
		defaultValues: {
			startDate: "",
			period: "",
			volume: "",
			clientName: "",
		},
	});

	// Fetch dates when selectedField changes
	const { data: availableDates, isLoading } = useQuery({
		queryKey: ["availableDates", selectedField],
		queryFn: () => getDates(selectedField!),
		enabled: !!selectedField, // Prevents execution when null
	});

	// Fetch dates when selectedField changes
	const { data } = useQuery({
		queryKey: ["gasData", gasData],
		queryFn: () => getGasData(gasData!),
		enabled: !!gasData, // Prevents execution when null
	});

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof gasFormSchema>) {
		// ✅ This will be type-safe and validated.
		const tradeDate = format(values.tradeDate, "yyyy-MM-dd");
		console.log("values", values);
		setGasData({
			indice: values.field,
			tradeDate,
		});
	}

	function onSubmitStep2() {
		document.getElementById("modal")?.click();
	}

	return (
		<>
			<div className="mt-10 flex justify-around">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="field"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Codigo</FormLabel>
									<Select
										onValueChange={(value) => {
											field.onChange(value);
											setSelectedField(value); // Trigger fetch
										}}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="HSC" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{/* <SelectItem value="HH">Henry Hub</SelectItem> */}
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
								<FormItem className="flex flex-col">
									<FormLabel>TradeDate</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-[240px] pl-3 text-left font-normal",
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
												onSelect={field.onChange}
												className=""
												disabled={(date) => disableDays(date, availableDates)}
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit">Cargar datos</Button>
					</form>
				</Form>

				<Modal>
					<Form {...step2Form}>
						<form
							onSubmit={step2Form.handleSubmit(onSubmitStep2)}
							className="space-y-8"
						>
							<FormField
								control={step2Form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-center gap-3">
										<FormLabel className="font-semibold">
											Inicio de la cobertura:
										</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															"w-[200px] justify-between",
															!field.value && "text-muted-foreground",
														)}
														disabled={!data}
													>
														{field.value && data
															? format(
																	data.find(
																		(data) => data.flow_date === field.value,
																	)?.flow_date,
																	"MMM-yy",
																)
															: "Elige una fecha"}
														<ChevronsUpDown className="opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-[200px] p-0">
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
																		value={dattum.flow_date}
																		onSelect={() => {
																			step2Form.setValue(
																				"startDate",
																				dattum.flow_date,
																			);
																			step2Form.setValue("period", "");

																			const index = data.findIndex(
																				(data) =>
																					data.flow_date ===
																					step2Form.getValues("startDate"),
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
								control={step2Form.control}
								name="period"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-center gap-3">
										<FormLabel className="font-semibold">
											Periodo de la cobertura:
										</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															"w-[200px] justify-between",
															!field.value && "text-muted-foreground",
														)}
														disabled={invoiceArray.length === 0}
													>
														{field.value && invoiceArray.length > 0
															? Number(field?.value) + 1
															: "Elige el periodo"}
														<ChevronsUpDown className="opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-[200px] p-0">
												<Command>
													<CommandInput
														placeholder="Busca los periodos..."
														className="h-9"
													/>
													<CommandList>
														<CommandEmpty>
															No se puede seleccionar un periodo para esta fecha
														</CommandEmpty>
														<CommandGroup>
															{invoiceArray &&
																invoiceArray.map((invoice, index) => {
																	if (
																		index === 5 ||
																		index === 11 ||
																		index === 17 ||
																		index === 23
																	) {
																		return (
																			<CommandItem
																				value={invoice.flow_date}
																				onSelect={() => {
																					step2Form.setValue(
																						"period",
																						String(index),
																					);
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
								control={step2Form.control}
								name="volume"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-center gap-3">
										<FormLabel className="font-semibold">Volumen:</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="50,000 MMBTu/mes"
												{...field}
												disabled={!data}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={step2Form.control}
								name="clientName"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-center gap-3">
										<FormLabel className="font-semibold">
											Nombre del cliente:
										</FormLabel>
										<FormControl>
											<Input
												disabled={!data}
												type="text"
												placeholder="Carolina Performance"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit">Calcular</Button>

							<Modal.Open opens="pdf">
								<Button type="submit" className="hidden" id="modal">
									Calcular
								</Button>
							</Modal.Open>
							<Modal.Window
								name="pdf"
								render={() => {
									return (
										<PricingModal
											invoice={invoiceArray}
											formValues={step2Form.getValues()}
										/>
									);
								}}
							/>
						</form>
					</Form>
				</Modal>
			</div>

			{data && data.length > 0 ? <GasTable data={data} /> : null}
		</>
	);
};
