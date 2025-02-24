import { z } from "zod";

export const gasFormSchema = z.object({
	tradeDate: z.union([z.string().date(), z.date()], {
		message: "Ingrese una fecha valida",
	}),
	field: z
		.enum(["EP", "HSC", "SCL", "WAH", "HH", ""])
		.refine((field) => field.length > 0),
});

export const step2GasFormSchema = z.object({
	// startDate: z.union([z.string().date(), z.date()]),
	startDate: z.string(),
	period: z.string().refine((volume) => !isNaN(Number(volume)), {
		message: "Ingrese un numero valido",
	}),
	volume: z
		.string()
		.refine((period) => period.length > 0, {
			message: "Ingrese un número",
		})
		.refine(
			(period) => {
				const newNumber = period.replace(/,/g, "");
				return !isNaN(Number(newNumber));
			},
			{
				message: "Ingrese un numero valido",
			},
		),
	clientName: z.string().refine((client) => client.length > 0),
});
