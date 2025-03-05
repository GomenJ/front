import { z } from "zod";

export const cotizadoraInvoiceFormSchema = z.object({
	index: z
		.enum(["EP", "HSC", "SCL", "WAH", "HH", ""])
		.refine((field) => field.length > 0),
	volume: z.string().nonempty(),
	period: z.string().nonempty(),
	totalVolume: z.string().nonempty(),
	average: z.string().nonempty(),
	guaranty: z.string().nonempty(),
	tradeDate: z.string().nonempty(),
});
