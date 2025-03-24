import { create } from "zustand";
import { z } from "zod";
import { cotizadoraGasFormSchema } from "../schemas/cotizadora-gas-form-schema";
import type { CotizadoraGas } from "../types/cotizadora-gas-type";

type CotizadoraState = z.infer<typeof cotizadoraGasFormSchema> & {
	data: CotizadoraGas[];
	fee: { fee: number } | null;
	setFee: (fee: number) => void;
};

type CotizadoraAction = {
	setCotizadoraValues: (values: CotizadoraState) => void;
	reset: () => void;
};

export const useCotizadoraStore = create<CotizadoraState & CotizadoraAction>()(
	(set) => ({
		index: "",
		tradeDate: "",
		startDate: "",
		period: "",
		volume: "",
		clientName: "",
		percantage: "",
		fee: null,
		data: [],

		setCotizadoraValues: (values) => set(() => ({ ...values })),
		setFee: (fee) => set({ fee: { fee } }),
		reset: () =>
			set(() => ({
				index: "",
				tradeDate: "",
				startDate: "",
				period: "",
				volume: "",
				clientName: "",
				percantage: "",
				fee: null,
				data: [],
			})),
	}),
);
