import type { Data } from "../utils/excel-data-extractor";

export const createDataFromPdf = async (pdfData: Data[]) => {
	// Get the base URL from the environment variable
	const baseUrl = import.meta.env.VITE_API_URL;

	const data = await fetch(`${baseUrl}/api/v1/gas`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(pdfData),
	});

	if (!data.ok) {
		throw new Error("Fallo al crear nuevos datos");
	}

	const response = await data.json();

	if (!response) {
		throw new Error("Fallo al crear nuevos datos");
	}

	return response;
};
