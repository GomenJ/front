type AvailableDates = string[];
export const getDates = async (fieldValue: string) => {
	if (!fieldValue) return []; // Prevent unnecessary requests

	const response = await fetch(
		// `http://127.0.0.1:5000/api/v1/gas/${fieldValue}`,
		`http://192.168.201.7:8080/api/v1/gas/${fieldValue}`,
		// `http://127.0.0.1:5000/api/v1/gas/${fieldValue}`,
		// `http://192.168.202.48:5000/api/v1/gas/${fieldValue}`,
	);

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
