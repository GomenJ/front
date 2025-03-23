import { FeeType } from "../types/fees-type";

export const getFees = async () => {
	// Get the base URL from the environment variable
	const baseUrl = import.meta.env.VITE_API_URL;

	const response = await fetch(`${baseUrl}/api/v1/gas/fee`);
	if (!response.ok) {
		throw new Error("Failed to fetch fees");
	}
	const data = await response.json();
	return data as FeeType;
};
