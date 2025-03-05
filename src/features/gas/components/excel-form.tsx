import { z } from "zod";
import { useForm } from "react-hook-form";
import { excelFormSchema } from "../schemas/excelFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
import { useCreateExcelData } from "../hooks/useCreateExcelData";

export const ExcelForm = () => {
	// 1. Define your form.
	const form = useForm<z.infer<typeof excelFormSchema>>({
		resolver: zodResolver(excelFormSchema),
		defaultValues: {
			usuario: "",
			tradeDate: "",
			excel: "",
		},
	});

	const { mutate, isCreating } = useCreateExcelData(form);

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof excelFormSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		const tradeDate = format(values.tradeDate, "yyyy-MM-dd");
		const file = values.excel as File;

		const newValues = {
			usuario: values.usuario,
			tradeDate: tradeDate,
		};

		mutate({ file, values: newValues });
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="usuario"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Usuario</FormLabel>
							<FormControl>
								<Input
									placeholder="Mario Santome"
									{...field}
									disabled={isCreating}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="tradeDate"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Trade date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"w-[240px] pl-3 text-left font-normal",
												!field.value && "text-muted-foreground",
											)}
											disabled={isCreating}
										>
											{field.value ? (
												format(field.value, "dd/MM/yyyy")
											) : (
												<span>{format(new Date(), "dd/MM/yyyy")}</span>
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
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="excel"
					render={() => (
						<FormItem>
							<FormLabel>Archivo Excel</FormLabel>
							<FormControl>
								<Input
									type="file"
									disabled={isCreating}
									onChange={(e) => {
										const files = e.target.files;
										if (files) {
											form.setValue("excel", files[0]);
										}
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={isCreating}>
					Submit
				</Button>
			</form>
		</Form>
	);
};
