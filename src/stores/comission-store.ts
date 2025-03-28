import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CommissionState {
	hidden: boolean;
	percentage: number;
	setHidden: (hidden: boolean) => void;
	setPercentage: (percentage: number) => void;
}

export const useCommissionStore = create<CommissionState>()(
	persist(
		(set) => ({
			hidden: false,
			percentage: 0,
			setHidden: (hidden) => set({ hidden }),
			setPercentage: (percentage) => set({ percentage }),
		}),
		{ name: "commission-store" },
	),
);
