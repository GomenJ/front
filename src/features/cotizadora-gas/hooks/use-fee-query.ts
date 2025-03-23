import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCotizadoraStore } from "../stores/cotizadora-store";
import { getFee } from "../api/get-fee";
import { toast } from "sonner";

export const useFeeQuery = () => {
	const setFee = useCotizadoraStore((state) => state.setFee); // Zustand store
	const queryClient = useQueryClient();

	const { mutate, isPending: isGettingFee } = useMutation({
		mutationFn: ({ volume, months }: { volume: number; months: number }) =>
			getFee({ volume, months }),
		onSuccess: (fee: { fee: number }) => {
			queryClient.invalidateQueries({
				queryKey: ["fee"],
			});
			setFee(fee.fee);
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
