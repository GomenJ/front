export const getFee = async ({
	volume,
	months,
}: {
	volume: number;
	months: number;
}) => {
	const response = await fetch(
		`http://127.0.0.1:5000/api/v1/gas/fee/${months}?volumen_total=${volume}`,
	);
	if (!response.ok) {
		throw new Error("Failed to fetch fee");
	}
	console.log("response", response);
	const data = await response.json();
	console.log("data", data);
	return data;
	// return data.fee; // Assuming the API returns { "fee": 0.389 }
};
