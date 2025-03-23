import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createDataFromExcel } from "../api/create-data-from-excel";
import type { UseFormReturn } from "react-hook-form";
import type { Values } from "../types/price-types";

type Form = UseFormReturn<
	{
		usuario: "Becario" | "Edgar" | "Dave" | "";
		tradeDate: string | Date;
		excel: string | File;
	},
	unknown,
	undefined
>;

export const useCreateExcelData = (form: Form) => {
	const queryClient = useQueryClient();

	const { mutate, isPending: isCreating } = useMutation({
		mutationFn: ({ file, values }: { file: File; values: Values }) =>
			createDataFromExcel({ file, values }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["excelData"],
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
