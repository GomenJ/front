import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createData } from "../api/create-data";
import type { UseFormReturn } from "react-hook-form";
import type { Values } from "../types/priceTypes";

type Form = UseFormReturn<
	{
		usuario: string;
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
			createData({ file, values }),
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
