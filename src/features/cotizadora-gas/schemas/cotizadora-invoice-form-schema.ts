import { z } from "zod";

export const cotizadoraInvoiceFormSchema = z.object({
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
		.refine(
			(volume) => {
				const newNumber = Number(volume.replace(/,/g, ""));
				return Number.isInteger(newNumber);
			},
			{ message: "No puede haber volumenes con decimales" },
		)
		.refine(
			(volume) => {
				const newNumber = Number(volume.replace(/,/g, ""));
				return newNumber >= 5_000 && newNumber <= 30_000;
			},
			{
				message:
					"Solo se puede ingresar numeros mayores a 5000 y menores a 30,000",
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
});
