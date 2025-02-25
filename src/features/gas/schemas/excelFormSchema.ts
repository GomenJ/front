import { z } from 'zod';

export const excelFormSchema = z.object({
    usuario: z.string().nonempty(),
    tradeDate: z.union([z.string().date(), z.date()]),
    excel: z.union([z.instanceof(File, {
        message: 'Please upload an Excel file'
    }).refine(file => file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel', {
        message: 'Please upload an Excel file'
    }), z.string().refine(file => file.includes('xlsx') || file.includes('xls'), {
        message: 'Please upload a sheet file'
    })]),
});