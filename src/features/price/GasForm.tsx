import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";

import { CalendarIcon } from "lucide-react";

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
	Table,
	TableBody,
	TableCell,
	TableCaption,
	TableHeader,
	TableHead,
	TableRow,
} from "@/components/ui/table";

// import { Input } from "@/components/ui/input";
import { gasFormSchema } from "./gasFormSchema";
import { useState } from "react";

const fetchDates = async (fieldValue: string) => {
	if (!fieldValue) return []; // Prevent unnecessary requests

	const response = await fetch(
		`http://127.0.0.1:5000/api/v1/gas/${fieldValue}`,
	);

	if (!response.ok) {
		console.error(
			"Error fetching dates:",
			response.status,
			response.statusText,
		);
		return []; // Return empty array to prevent crashes
	}

	const data = await response.json();
	const { availableDates } = data;
	return availableDates;
};

const fetchGasData = async ({
	indice,
	tradeDate,
}: {
	indice: string;
	tradeDate: string;
}) => {
	const response = await fetch(
		`http://127.0.0.1:5000/api/v1/gas/${indice}/${tradeDate}`,
	);
	console.log(response);
	console.log(indice, tradeDate);
	if (!response.ok) {
		console.error("Error fetching gas data:", response.statusText);
		return [];
	}
	const data = await response.json();
	console.log("Gas Data:", data);
	return data;
};

export const GasForm = () => {
	// Fetch dates when selectedField changes
	const [selectedField, setSelectedField] = useState<string | null>(null);
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

	// Fetch dates when selectedField changes
	const { data: availableDates, isLoading } = useQuery({
		queryKey: ["availableDates", selectedField],
		queryFn: () => fetchDates(selectedField!),
		enabled: !!selectedField, // Prevents execution when null
	});

	// Fetch dates when selectedField changes
	const { data } = useQuery({
		queryKey: ["gasData", gasData],
		queryFn: () => fetchGasData(gasData!),
		enabled: !!gasData, // Prevents execution when null
	});
	console.log(data);

	const disableDays = (day: Date) => {
		if (!availableDates && availableDates.length === 0) return false;
		const date = format(day.toLocaleDateString(), "yyyy-MM-dd");
		return !availableDates.includes(date);
	};

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof gasFormSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values.tradeDate);
		const tradeDate = format(values.tradeDate, "yyyy-MM-dd");
		console.log(tradeDate);
		setGasData({
			indice: values.field,
			tradeDate,
		});
	}

	return (
		<>
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
										<SelectItem value="H">Henry Hub</SelectItem>
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
											selected={field.value}
											onSelect={field.onChange}
											className=""
											disabled={disableDays}
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit">Calcular</Button>
				</form>
			</Form>
			{data && data.length > 0 ? (
				<Table>
					<TableCaption>A list of your recent invoices.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">tradeDate</TableHead>
							<TableHead>FlowDate</TableHead>
							<TableHead>Indice</TableHead>
							<TableHead>Price</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((data) => (
							<TableRow key={crypto.randomUUID()}>
								<TableCell className="font-medium">
									{format(data.trade_date, "dd/MM/yy")}
								</TableCell>
								<TableCell>{format(data.flow_date, "MMM-yy")}</TableCell>
								<TableCell>{`${data.hh_indice}x${data.selected_indice}`}</TableCell>
								<TableCell>{data.total_precio}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : null}
		</>
	);
};
