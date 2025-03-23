export const getFee = async ({
	volume,
	months,
}: {
	volume: number;
	months: number;
}) => {
	// Get the base URL from the environment variable
	const baseUrl = import.meta.env.VITE_API_URL;

	const response = await fetch(
		`${baseUrl}/api/v1/gas/fee/${months}?volumen_total=${volume}`,
	);
	if (!response.ok) {
		throw new Error("Failed to fetch fee");
	}
	const data = await response.json();
	return data;
};
