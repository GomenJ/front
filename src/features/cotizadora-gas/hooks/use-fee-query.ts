import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCotizadoraStore } from "../stores/cotizadora-store";
import { getFee } from "../api/get-fee";
import { toast } from "sonner";

import type { FeeType } from "../types/fees-type";

type Fee = {
	fee: FeeType;
};

export const useFeeQuery = () => {
	const setFee = useCotizadoraStore((state) => state.setFee); // Zustand store
	const addChartData = useCotizadoraStore((state) => state.addChartData); // Zustand store
	const queryClient = useQueryClient();

	const { mutate, isPending: isGettingFee } = useMutation({
		mutationFn: ({ volume, meses }: { volume: number; meses: number }) =>
			getFee({ volume, meses }),
		onSuccess: (fee: Fee) => {
			queryClient.invalidateQueries({
				queryKey: ["fee"],
			});
			setFee(fee);
			addChartData(fee);
		},
		onError: (err) => {
			toast.error(String(err));
		},
	});
	return {
		mutate,
		isGettingFee,
	};
};
