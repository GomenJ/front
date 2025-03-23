export const getFee = async ({
	volume,
	months,
}: {
	volume: number;
	months: number;
}) => {
	const response = await fetch(
		// `http://127.0.0.1:5000/api/v1/gas/fee/${months}?volumen_total=${volume}`,
		`http://192.168.201.7:8080/api/v1/gas/fee/${months}?volumen_total=${volume}`,
	);
	if (!response.ok) {
		throw new Error("Failed to fetch fee");
	}
	const data = await response.json();
	return data;
};
