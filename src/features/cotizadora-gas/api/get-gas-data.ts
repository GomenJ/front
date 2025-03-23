import type { CotizadoraGas } from "../types/cotizadora-gas-type";

export const getGasData = async ({
	indice,
	tradeDate,
}: {
	indice: string;
	tradeDate: string | Date;
}) => {
	const response = await fetch(
		// `http://127.0.0.1:5000/api/v1/gas/${indice}/${tradeDate}`,
		`http://192.168.201.7:8080/api/v1/gas/${indice}/${tradeDate}`,
	);

	if (!response.ok) {
		console.error("Error fetching gas data:", response.statusText);
		return [] as CotizadoraGas[];
	}
	const data: CotizadoraGas[] = await response.json();
	return data;
};
