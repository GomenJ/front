import { z } from 'zod';

export const gasFormSchema = z.union([
    z.object({
        pd1: z.union([
            z.instanceof(File, { message: 'Please upload a PDF file' }).refine((file) => file.type === 'application/pdf', { message: 'Please upload a PDF file' }),
            z.string().refine((file) => file.includes('.pdf'), { message: 'Please upload a PDF file' })
        ]),
        pd2: z.union([
            z.instanceof(File, { message: 'Please upload a PDF file' }).refine((file) => file.type === 'application/pdf', { message: 'Please upload a PDF file' }),
            z.string().refine((file) => file.includes('.pdf'), { message: 'Please upload a PDF file' })
        ]),
    }),
    z.object({
        excel: z.union([z.instanceof(File, { message: 'Please upload an Excel file' }).refine((file) => file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel', { message: 'Please upload an Excel file' }),
        z.string().refine((file) => file.includes('.xlsx') || file.includes('.xls'), { message: 'Please upload an Excel file' })]),
    })
])