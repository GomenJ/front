import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { pdfFormSchema } from "../schemas/pdfFormSchema";
import { pdfParser } from "../utils/pdf-data-extractor";
import { formatStringtoDate } from "../utils/format-string-to-date";
import { Data } from "../utils/excel-data-extractor";
import { useCreatePDFData } from "../hooks/useCreatePDFData";

export const PdfForm = () => {
	// 1. Define your form.
	const form = useForm<z.infer<typeof pdfFormSchema>>({
		resolver: zodResolver(pdfFormSchema),
		defaultValues: {
			usuario: "",
			tradeDate: "",
			pdf1: "",
			pdf2: "",
		},
	});

	const [isProcessing, setIsProcessing] = useState(false);
	const { mutate, isCreating } = useCreatePDFData(form);
	const isLoading = isCreating || isProcessing;

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof pdfFormSchema>) {
		const data: Data[] = [];
		const date = format(new Date().toLocaleString(), "yyyy-MM-dd HH:mm:ss");
		const tradeDate = format(values.tradeDate, "yyyy-MM-dd");
		setIsProcessing(true);

		const [pdf1, pdf2] = await Promise.all([
			pdfParser(values.pdf1 as File),
			pdfParser(values.pdf2 as File),
		]);
		// const pdf1 = await pdfParser(values.pdf1 as File);
		// const pdf2 = await pdfParser(values.pdf2 as File);
		pdf1.forEach((item) => {
			const flowDate = formatStringtoDate(item.MONTH);
			data.push({
				tradeDate,
				flowDate,
				indice: item.NAME,
				precio: Number(item.PRICE),
				fuente: "ICE",
				fechaCreacion: date,
				fechaActualizacion: date,
				usuario: values.usuario,
			});
		});

		pdf2.forEach((item) => {
			const flowDate = formatStringtoDate(item.MONTH);
			data.push({
				tradeDate,
				flowDate,
				indice: item.NAME,
				precio: Number(item.PRICE),
				fuente: "ICE",
				fechaCreacion: date,
				fechaActualizacion: date,
				usuario: values.usuario,
			});
		});
		mutate(data, {
			onSettled: () => setIsProcessing(false), // Reset when finished
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{/* TradeDate*/}
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
											disabled={isLoading}
										>
											{field.value ? (
												format(field.value, "dd/MM/yyyy")
											) : (
												<span>Pick a date</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										captionLayout="dropdown"
										mode="single"
										selected={field.value as Date}
										onSelect={field.onChange}
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="pdf1"
					render={() => (
						<FormItem>
							<FormLabel>Pdf 1</FormLabel>
							<FormControl>
								<Input
									type="file"
									disabled={isLoading}
									placeholder=""
									onChange={(e) => {
										const files = e.target.files;
										if (files && files.length) {
											form.setValue("pdf1", files[0]);
										}
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="pdf2"
					render={() => (
						<FormItem>
							<FormLabel>Pdf 2</FormLabel>
							<FormControl>
								<Input
									type="file"
									disabled={isLoading}
									placeholder=""
									onChange={(e) => {
										const files = e.target.files;
										if (files && files.length) {
											form.setValue("pdf2", files[0]);
										}
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="usuario"
					render={({ field }) => (
						<FormItem>
							<FormLabel>usuario</FormLabel>
							<FormControl>
								<Input placeholder="Becario" {...field} disabled={isLoading} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isLoading}>
					Submit
				</Button>
			</form>
		</Form>
	);
};
