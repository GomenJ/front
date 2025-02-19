import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { pdfFormSchema } from './pdfFormSchema'
import { pdfParser } from '../dave/pdf'

export const PdfForm = () => {

    // 1. Define your form.
    const form = useForm<z.infer<typeof pdfFormSchema>>({
        resolver: zodResolver(pdfFormSchema),
        defaultValues: {
            usuario: 'Becario',
            tradeDate: '',
            pdf1: '',
            pdf2: '',
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof pdfFormSchema>) {
        handleTable(values)
        const data = []
        const tradeDate = format(values.tradeDate, 'dd/MM/yyyy')
        const pdf1 = await pdfParser(values.pdf1 as File)
        const pdf2 = await pdfParser(values.pdf2 as File)
        pdf1.forEach((item) => {
            data.push({
                id: crypto.randomUUID(),
                tradeDate: format(values.tradeDate, 'dd/MM/yyyy'),
                flowDate: item.MONTH,
                indice: item.NAME,
                precio: item.PRICE,
                fuente: 'ice',
                fechaCreacion: new Date().toLocaleString(),
                fechaActualizacion: new Date().toLocaleString(),
                usuario: values.usuario,
            })
        })
        pdf2.forEach((item) => {
            data.push({
                id: crypto.randomUUID(),
                tradeDate: format(values.tradeDate, 'dd/MM/yyyy'),
                flowDate: item.MONTH,
                indice: item.NAME,
                precio: item.PRICE,
                fuente: 'ice',
                fechaCreacion: new Date().toLocaleString(),
                fechaActualizacion: new Date().toLocaleString(),
                usuario: values.usuario,
            })
        })

        console.log(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* TradeDate*/}
                <FormField
                    control={form.control}
                    name="tradeDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>TradeDate</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        hideNavigation
                                        captionLayout="dropdown"
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="pdf1"
                    render={() => (
                        <FormItem>
                            <FormLabel>Pdf 1</FormLabel>
                            <FormControl>
                                <Input type="file" placeholder=""
                                    onChange={(e) => {
                                        const files = e.target.files
                                        if (files && files.length) {
                                            form.setValue("pdf1", files[0])
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="pdf2"
                    render={() => (
                        <FormItem>
                            <FormLabel>Pdf 2</FormLabel>
                            <FormControl>
                                <Input type="file" placeholder=""
                                    onChange={(e) => {
                                        const files = e.target.files
                                        if (files && files.length) {
                                            form.setValue("pdf2", files[0])
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="usuario"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>usuario</FormLabel>
                            <FormControl>
                                <Input placeholder="Becario" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
