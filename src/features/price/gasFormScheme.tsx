import { z } from 'zod'

export const gasFormSchema = z.object({
    periodo: z.string(),
    inicio: z.string(),
    volumen: z.string(),
})
