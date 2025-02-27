import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UseFormReturn } from "react-hook-form";
import { createDataFromPdf } from "../api/create-data-from-pdf";

type Form = UseFormReturn<
	{
		tradeDate: string | Date;
		usuario: "" | "Becario" | "Edgar" | "Dave";
		pdf1: string | File;
		pdf2: string | File;
	},
	unknown,
	undefined
>;

export const useCreatePDFData = (form: Form) => {
	const queryClient = useQueryClient();

	const { mutate, isPending: isCreating } = useMutation({
		mutationFn: createDataFromPdf,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["pdfData"],
			});
			toast.success("Inserción de datos correcta");
			document.querySelectorAll("input").forEach((input) => {
				input.value = "";
			});
			form.reset();
		},
		onError: (err) => {
			toast.error(String(err));
		},
	});
	return {
		mutate,
		isCreating,
	};
};
