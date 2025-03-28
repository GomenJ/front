import { useState } from "react";
import { Loader } from "@/components/loader";
import { createLazyFileRoute } from "@tanstack/react-router";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ExcelForm } from "@/features/cargar-curva-forward/components/excel-form";
import { PdfForm } from "@/features/cargar-curva-forward/components/pdf-form";

export const Route = createLazyFileRoute("/_auth/cargar-curva-forward")({
	pendingComponent: Loader,
	component: RouteComponent,
});

function RouteComponent() {
	const [selectForm, setSelectForm] = useState("excel");

	return (
		<>
			<h1 className="my-5 text-center text-4xl">Cotizadora de Gas</h1>
			<Select value={selectForm} onValueChange={setSelectForm}>
				<SelectTrigger className="mb-10 w-[180px]">
					<SelectValue placeholder="File" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="pdf">PDF</SelectItem>
					<SelectItem value="excel">Excel</SelectItem>
				</SelectContent>
			</Select>

			{selectForm === "pdf" ? <PdfForm /> : <ExcelForm />}
		</>
	);
}
