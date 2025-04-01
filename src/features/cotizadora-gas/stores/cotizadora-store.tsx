import { create } from "zustand";
import { z } from "zod";
import { cotizadoraGasFormSchema } from "../schemas/cotizadora-gas-form-schema";
import type { CotizadoraGas } from "../types/cotizadora-gas-type";
import type { FeeType } from "../types/fees-type";

type CotizadoraState = z.infer<typeof cotizadoraGasFormSchema> & {
	data: CotizadoraGas[];
	fee: { fee: FeeType } | null;
	setFee: (fee: { fee: FeeType }) => void;
	chartData: { fee: FeeType }[];
	addChartData: (newData: { fee: FeeType }) => void;
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
		chartData: [],

		setCotizadoraValues: (values) => set(() => ({ ...values })),
		setFee: (fee) => set(() => ({ fee })),
		addChartData: (newData: { fee: FeeType }) =>
			set((state) => ({
				chartData: [...state.chartData, newData],
			})),
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
				chartData: [],
			})),
	}),
);
