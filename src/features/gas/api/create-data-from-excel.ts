import { getDataFromExcel } from "../utils/excel-data-extractor";
import type { Values } from "../types/priceTypes";

export const createDataFromExcel = async ({
	file,
	values,
}: {
	file: File;
	values: Values;
}) => {
	const excelData = await getDataFromExcel(file, values);
	const data = await fetch("http://127.0.0.1:5000/api/v1/gas", {
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
