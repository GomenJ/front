type AvailableDates = string[];
export const getDates = async (fieldValue: string) => {
	// Get the base URL from the environment variable
	const baseUrl = import.meta.env.VITE_API_URL;
	if (!fieldValue) return []; // Prevent unnecessary requests

	const response = await fetch(`${baseUrl}/api/v1/gas/${fieldValue}`);

	if (!response.ok) {
		console.error(
			"Error fetching dates:",
			response.status,
			response.statusText,
		);
		return []; // Return empty array to prevent crashes
	}

	const data = await response.json();
	const { availableDates } = data;
	return availableDates as AvailableDates;
};
