import { z } from "zod";

export const loginFormScheme = z.object({
	username: z.string().min(3),
	password: z.string().min(8),
});
