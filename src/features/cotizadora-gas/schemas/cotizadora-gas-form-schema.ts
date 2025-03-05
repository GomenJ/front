import { z } from "zod";

export const cotizadoraGasFormSchema = z.object({
	index: z
		.enum(["EP", "HSC", "SCL", "WAH", "HH", ""])
		.refine((field) => field.length > 0),
	tradeDate: z.union([z.string().date(), z.date()], {
		message: "Ingrese una fecha valida",
	}),
	startDate: z.union([
		z.date(),
		z.string().refine((startDate) => startDate.length > 0),
	]),
	period: z
		.string()
		.refine((period) => !isNaN(Number(period)), {
			message: "Ingrese un numero valido",
		})
		.refine((period) => period.length > 0),
	volume: z
		.string()
		// .refine(
		// 	(volume) => {
		// 		const newNumber = Number(volume.replace(/,/g, ""));
		// 		return newNumber > 0;
		// 	},
		// 	{
		// 		message: "Ingrese un número mayor a 5_000",
		// 	},
		// )
		.refine(
			(volume) => {
				const newNumber = Number(volume.replace(/,/g, ""));
				return newNumber >= 5_000 && newNumber <= 15_000;
			},
			{
				message:
					"Solo se puede ingresar numeros mayores a 5000 y menores a 15,000",
			},
		)
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
	comision: z.boolean().default(false).optional(),
	percantage: z
		.string()
		.default("0")
		.refine((fee) => fee.length > 0)
		.refine(
			(volume) => {
				const newNumber = volume.replace(/,/g, "");
				return (
					Number(newNumber) >= 0 &&
					Number(newNumber) < 100 &&
					!isNaN(Number(newNumber))
				);
			},
			{
				message: "Ingrese un número mayor a 0",
			},
		),
});
