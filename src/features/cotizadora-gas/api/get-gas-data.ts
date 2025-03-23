import type { CotizadoraGas } from "../types/cotizadora-gas-type";

export const getGasData = async ({
	indice,
	tradeDate,
}: {
	indice: string;
	tradeDate: string | Date;
}) => {
	// Get the base URL from the environment variable
	const baseUrl = import.meta.env.VITE_API_URL;

	const response = await fetch(`${baseUrl}/api/v1/gas/${indice}/${tradeDate}`);

	if (!response.ok) {
		console.error("Error fetching gas data:", response.statusText);
		return [] as CotizadoraGas[];
	}
	const data: CotizadoraGas[] = await response.json();
	return data;
};
