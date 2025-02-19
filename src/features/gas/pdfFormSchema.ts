import { z } from 'zod';

export const pdfFormSchema = z.object({
    tradeDate: z.union([z.string().date(), z.date()]),
    usuario: z.enum(["David", "Juan", "Edgar", "Becario"]).optional(),
    pdf1: z.union([
        z.instanceof(File, { message: 'Please upload a PDF file' }).refine((file) => file.type === 'application/pdf', { message: 'Please upload a PDF file' }),
        z.string().refine((file) => file.includes('.pdf'), { message: 'Please upload a PDF file' })
    ]),
    pdf2: z.union([
        z.instanceof(File, { message: 'Please upload a PDF file' }).refine((file) => file.type === 'application/pdf', { message: 'Please upload a PDF file' }),
        z.string().refine((file) => file.includes('.pdf'), { message: 'Please upload a PDF file' })
    ]),
}).superRefine((data, ctx) => {
    if (data.pdf1 === typeof 'File' && data.pdf2 === typeof 'File' && data.pdf1 === data.pdf2) {
        ctx.addIssue({
            code: "custom",
            message: "Pdf 1 and Pdf 2 must be different",
            path: ["pdf1", "pdf2"]
        })
    }
})