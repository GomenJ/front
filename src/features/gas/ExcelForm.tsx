import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { excelFormSchema } from './excelFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format, type Match } from "date-fns"
import { getExcelData } from '../dave/excel'

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

export const ExcelForm = () => {

    // 1. Define your form.
    const form = useForm<z.infer<typeof excelFormSchema>>({
        resolver: zodResolver(excelFormSchema),
        defaultValues: {
            usuario: 'Becario',
            // tradeDate: '',
            tradeDate: new Date().toDateString(),
            excel: ''
        },
    })
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof excelFormSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        const tradeDate = format(values.tradeDate, 'dd/MM/yyyy')
        const excel = values.excel as File

        const newValues = {
            usuario: values.usuario,
            tradeDate: tradeDate.replaceAll('/', '-'),
        }

        getExcelData(excel, newValues)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="usuario"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                                        selected={field.value as Match}
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
                    name="excel"
                    render={() => (
                        <FormItem>
                            <FormLabel>trade date</FormLabel>
                            <FormControl>
                                <Input type="file"
                                    onChange={(e) => {
                                        const files = e.target.files
                                        if (files) {
                                            form.setValue("excel", files[0])
                                        }
                                    }}
                                />
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
