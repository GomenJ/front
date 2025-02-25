import { format } from "date-fns";
import * as XLSX from "xlsx";
import type { Values } from "../types/priceTypes.ts";

type RowInfo = {
	name: RowName;
	sheetName: string;
	index: string;
};
type Data = {
	tradeDate: string;
	flowDate: string;
	indice: string;
	precio: number;
	fuente: string;
	usuario: string;
	fechaCreacion: string;
	fechaActualizacion: string;
};

type RowName =
	| "Henry Hub"
	| "El Paso Permian"
	| "Houston Ship Channel"
	| "SoCal Border Avg."
	| "Waha";

type ExceltoJson = {
	[key: string]: string | number;
};

const LOCATION_COLUMN = "Location";
const SHEET_NOT_FOUND_ERROR = "No sheet found";
const DATA_NOT_FOUND_ERROR = "No data found";

const findRowByColumn = (
	workbook: XLSX.WorkBook,
	rowInfo: RowInfo,
	columName = LOCATION_COLUMN,
) => {
	const workSheet = workbook.Sheets[rowInfo.sheetName];
	if (!workSheet) {
		throw new Error(SHEET_NOT_FOUND_ERROR);
	}

	const jsonData = XLSX.utils.sheet_to_json<ExceltoJson>(workSheet);

	for (const row of jsonData) {
		if (
			typeof row[columName] === "string" &&
			row[columName].includes(rowInfo.name)
		) {
			return row;
		}
	}
	return null;
};

export const getDataFromExcel = async (file: File, values: Values) => {
	const data = await file.arrayBuffer();
	const dataBaseData: Data[] = [];
	/* data is an ArrayBuffer */
	const workbook = XLSX.read(data);
	if (workbook.SheetNames.length === 0) {
		throw new Error("No sheet found");
	}

	const rowsToExtract: RowInfo[] = [
		{
			name: "Henry Hub",
			sheetName: "Fixed Price",
			index: "HH",
		},
		{
			name: "El Paso Permian",
			sheetName: "Basis Price",
			index: "EP",
		},
		{
			name: "Houston Ship Channel",
			sheetName: "Basis Price",
			index: "HSC",
		},
		{
			name: "SoCal Border Avg.",
			sheetName: "Basis Price",
			index: "SCL",
		},
		{
			name: "Waha",
			sheetName: "Basis Price",
			index: "WAH",
		},
	];

	rowsToExtract.forEach((row) => {
		const rowInfo = findRowByColumn(workbook, row);
		if (!rowInfo) throw new Error(DATA_NOT_FOUND_ERROR);
		dataBaseData.push(...createExcelData(row.index, values, rowInfo));
	});
	return dataBaseData;
};

const formatStringtoDate = (dateString: string): string => {
	const [month, year] = dateString.split("-");
	if (!month || !year) return "";
	const date = new Date(`1 ${month} ${year}`);
	return format(date, "yyyy-MM-dd");
};

const createExcelData = (
	indice: string,
	values: Values,
	rowInfo: ExceltoJson,
) => {
	const data = [];

	const date = format(new Date().toLocaleString(), "yyyy-MM-dd HH:mm:ss");
	for (const row in rowInfo) {
		if (row !== "Location") {
			const flowDate = formatStringtoDate(row);
			data.push({
				tradeDate: values.tradeDate,
				flowDate,
				indice: indice,
				precio: Number(rowInfo[row]),
				fuente: "NGI",
				usuario: values.usuario,
				fechaCreacion: date,
				fechaActualizacion: date,
			});
		}
	}
	return data;
};
