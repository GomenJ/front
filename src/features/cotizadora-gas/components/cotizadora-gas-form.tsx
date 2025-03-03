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
	// CommandItem,
	CommandList,
} from "@/components/ui/command";

import { Input } from "@/components/ui/input";
// import { useState } from "react";
// import { Modal } from "@/components/Modal";
// import { PricingModal } from "./pricing-modal";
// import { disableDays } from "../utils/disable-days";

import { cotizadoraGasFormSchema } from "../schemas/cotizadora-gas-form-schema";
import { useCotizadoraStore } from "../stores/cotizadora-store";

export const CotizadoraGasForm = () => {
	const formValues = useCotizadoraStore((state) => state);
	const setCotizadoraValues = useCotizadoraStore(
		(state) => state.setCotizadoraValues,
	);

	// 1. Define your form.
	const form = useForm<z.infer<typeof cotizadoraGasFormSchema>>({
		resolver: zodResolver(cotizadoraGasFormSchema),
		defaultValues: {
			index: formValues.index,
			tradeDate: formValues.tradeDate,
			startDate: formValues.startDate,
			period: formValues.period,
			volume: formValues.volume,
			clientName: formValues.clientName,
		},
	});

	console.log("formValues", formValues);
	function onSubmit(values: z.infer<typeof cotizadoraGasFormSchema>) {
		// ✅ This will be type-safe and validated.
		console.log("values", values);
		setCotizadoraValues(values);
		console.log("formValues after submit", formValues);
	}

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="grid place-content-center space-y-8"
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
										// setSelectedField(value); // Trigger fetch
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
												// disabled={!selectedField || isLoading} // Disable when fetching
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
											// disabled={(date) => disableDays(date, availableDates)}
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
												// disabled={!data}
											>
												{/* {field.value && data */}
												{/* 	? format( */}
												{/* 			data.find( */}
												{/* 				(data) => data.flow_date === field.value, */}
												{/* 			)?.flow_date, */}
												{/* 			"MMM-yy", */}
												{/* 		) */}
												{/* 	: "Elige una fecha"} */}
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
													{/* {data && */}
													{/* 	data.map((dattum) => ( */}
													{/* 		<CommandItem */}
													{/* 			value={dattum.flow_date} */}
													{/* 			onSelect={() => { */}
													{/* 				form.setValue( */}
													{/* 					"startDate", */}
													{/* 					dattum.flow_date, */}
													{/* 				); */}
													{/* 				form.setValue("period", ""); */}
													{/**/}
													{/* 				const index = data.findIndex( */}
													{/* 					(data) => */}
													{/* 						data.flow_date === */}
													{/* 						step2Form.getValues("startDate"), */}
													{/* 				); */}
													{/**/}
													{/* 				setInvoiceArray([...data.slice(index)]); */}
													{/* 			}} */}
													{/* 		> */}
													{/* 			{format(dattum.flow_date, "MMM-yy")} */}
													{/* 			<Check */}
													{/* 				className={cn( */}
													{/* 					"ml-auto", */}
													{/* 					dattum.flow_date === field.value */}
													{/* 						? "opacity-100" */}
													{/* 						: "opacity-0", */}
													{/* 				)} */}
													{/* 			/> */}
													{/* 		</CommandItem> */}
													{/* 	))} */}
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
												// disabled={invoiceArray.length === 0}
											>
												{/* {field.value && invoiceArray.length > 0 */}
												{/* 	? Number(field?.value) + 1 */}
												{/* 	: "Elige el periodo"} */}
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
													No existe un periodo para esta fecha
												</CommandEmpty>
												<CommandGroup>
													{/* {invoiceArray && */}
													{/* 	invoiceArray.map((invoice, index) => { */}
													{/* 		if ( */}
													{/* 			index === 5 || */}
													{/* 			index === 11 || */}
													{/* 			index === 17 || */}
													{/* 			index === 23 */}
													{/* 		) { */}
													{/* 			return ( */}
													{/* 				<CommandItem */}
													{/* 					value={invoice.flow_date} */}
													{/* 					onSelect={() => { */}
													{/* 						step2Form.setValue( */}
													{/* 							"period", */}
													{/* 							String(index), */}
													{/* 						); */}
													{/* 					}} */}
													{/* 				> */}
													{/* 					{index + 1} */}
													{/* 					<Check */}
													{/* 						className={cn( */}
													{/* 							"ml-auto", */}
													{/* 							String(index) === field.value */}
													{/* 								? "opacity-100" */}
													{/* 								: "opacity-0", */}
													{/* 						)} */}
													{/* 					/> */}
													{/* 				</CommandItem> */}
													{/* 			); */}
													{/* 		} */}
													{/* 	})} */}
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
							<FormItem className="flex flex-row items-center justify-center gap-3">
								<FormLabel className="font-semibold">Volumen:</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="50,000 MMBTu/mes"
										{...field}
										// disabled={!data}
										className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
							<FormItem className="flex flex-row items-center justify-center gap-3">
								<FormLabel className="font-semibold">
									Nombre del cliente:
								</FormLabel>
								<FormControl>
									<Input
										// disabled={!data}
										type="text"
										placeholder="Carolina Performance"
										{...field}
										className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">Calcular</Button>
				</form>
			</Form>
		</>
	);
};
