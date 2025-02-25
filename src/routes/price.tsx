import { useState } from "react";
import { Loader } from "@/components/Loader";
import { PdfForm } from "@/features/gas/PdfForm";
import { createFileRoute } from "@tanstack/react-router";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ExcelForm } from "@/features/gas/components/ExcelForm";

export const Route = createFileRoute("/price")({
	pendingComponent: Loader,
	component: RouteComponent,
});

function RouteComponent() {
	const [selectForm, setSelectForm] = useState("excel");

	return (
		<>
			<h1 className="text-center text-4xl my-5">Cotizadora de Gas</h1>
			<Select value={selectForm} onValueChange={setSelectForm}>
				<SelectTrigger className="w-[180px] mb-10">
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
