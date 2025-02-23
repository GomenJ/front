import { z } from "zod";

export const gasFormSchema = z.object({
	tradeDate: z.union([z.string().date(), z.date()], {
		message: "Ingrese una fecha valida",
	}),
	field: z
		.enum(["EP", "HSC", "SCL", "WAH", ""])
		.refine((field) => field.length > 0),
});
