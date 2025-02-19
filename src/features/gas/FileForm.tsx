import { gasFormSchema } from "@/schemas/gasFormSchema"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

export const FileForm = () => {
    // 1. Define your form
    const form = useForm<z.infer<typeof gasFormSchema>>({
        resolver: zodResolver(gasFormSchema),
        defaultValues: {
            pd1: '',
            pd2: '',
            excel: '',
        },
    })

    // 2. Define a submit handler.
    function onSubmit(data: z.infer<typeof gasFormSchema>) {
        // ✅ This will be type-safe and validated.
        console.log(data)
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="pd1"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>pdf1</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="pd2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pdf 2</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="excel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pdf 2</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </>
    )
}
