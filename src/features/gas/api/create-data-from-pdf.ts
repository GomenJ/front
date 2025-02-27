import type { Data } from "../utils/excel-data-extractor";

export const createDataFromPdf = async (pdfData: Data[]) => {
	const data = await fetch("http://127.0.0.1:5000/api/v1/gas", {
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
