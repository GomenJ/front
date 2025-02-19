import { useState } from "react";
// import { Loader } from '@/components/Loader'
import { PdfForm } from "@/features/gas/PdfForm";
import { createFileRoute } from "@tanstack/react-router";

// import { z } from 'zod'
// import { pdfFormSchema } from '@/features/gas/pdfFormSchema'
// import { format } from "date-fns"

// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { pdfParser } from '@/features/dave/pdf'

// type Values = z.infer<typeof pdfFormSchema>
// type DataTable = {
//   id: string
//   tradeDate: string
//   flowDate: string
//   precio: number
//   indice: string
//   fuente: string
//   fechaCreacion: Date | string
//   fechaActualizacion: Date | string
//   usuario: 'David' | 'Juan' | 'Edgar' | 'Becario' | undefined
// }

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ExcelForm } from "@/features/gas/ExcelForm";

export const Route = createFileRoute("/price")({
	component: RouteComponent,
});

function RouteComponent() {
	// const [showTable, setShowTable] = useState(false)
	const [selectForm, setSelectForm] = useState("pdf");

	return (
		<>
			<h1 className="text-center text-4xl my-5">Cotizadora de Gas</h1>
			<Select value={selectForm} onValueChange={setSelectForm}>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="File" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="pdf">PDF</SelectItem>
					<SelectItem value="excel">Excel</SelectItem>
				</SelectContent>
			</Select>

			{selectForm === "pdf" ? <PdfForm /> : <ExcelForm />}

			{/* {showTable
        ?
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">tradeDate</TableHead>
              <TableHead>FlowDate</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Indice</TableHead>
              <TableHead>Fuente</TableHead>
              <TableHead>FechaCreacion</TableHead>
              <TableHead>FechaActualizacion</TableHead>
              <TableHead>Usuario</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataTable.map((data) => (
              <TableRow key={data.id}>
                <TableCell className="font-medium">{data.tradeDate}</TableCell>
                <TableCell>{data.flowDate}</TableCell>
                <TableCell>{data.precio}</TableCell>
                <TableCell>{data.indice}</TableCell>
                <TableCell>{data.fuente}</TableCell>
                <TableCell>{JSON.stringify(data.fechaCreacion)}</TableCell>
                <TableCell>{JSON.stringify(data.fechaActualizacion)}</TableCell>
                <TableCell className="text-right">{data.usuario}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        : null
      } */}
		</>
	);
}
