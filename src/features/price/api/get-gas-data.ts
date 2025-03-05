import type { Gas } from "../types/gasType";

export const getGasData = async ({
	indice,
	tradeDate,
}: {
	indice: string;
	tradeDate: string;
}) => {
	const response = await fetch(
		`http://127.0.0.1:5000/api/v1/gas/${indice}/${tradeDate}`,
	);

	if (!response.ok) {
		console.error("Error fetching gas data:", response.statusText);
		return [];
	}
	const data: Gas = await response.json();
	return data;
};
