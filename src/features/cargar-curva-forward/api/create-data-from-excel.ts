import { getDataFromExcel } from "../utils/excel-data-extractor";
import type { Values } from "../types/price-types";

export const createDataFromExcel = async ({
	file,
	values,
}: {
	file: File;
	values: Values;
}) => {
	const excelData = await getDataFromExcel(file, values);
	// Get the base URL from the environment variable
	const baseUrl = import.meta.env.VITE_API_URL;

	const data = await fetch(`${baseUrl}/api/v1/gas`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(excelData),
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
