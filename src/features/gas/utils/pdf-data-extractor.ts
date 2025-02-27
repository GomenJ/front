import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs?url";

type ColumnType = "NAME" | "MONTH" | "PRICE";

type Coordinates = {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
};

type StructureData = {
	NAME: string;
	MONTH: string;
	PRICE: string;
};

interface TextItemI {
	str: string;
	width: number;
	height: number;
	transform: number[];
}

const getCoordinates = (
	items: TextItemI[],
	columnType: ColumnType,
): Coordinates | null => {
	const footerColumn = "Totals for";
	const headerIndex = items.findIndex((item) => item.str === columnType);
	const footerIndex = items.findIndex((item) =>
		item.str.includes(footerColumn),
	);

	// Column header not found
	if (headerIndex === -1) return null;

	// Determine X boundaries
	const header = items[headerIndex];
	const prevItem = items[headerIndex - 1];
	const nextItem = items[headerIndex + 1];

	if (
		!header?.transform[4] ||
		!header?.transform[5] ||
		!prevItem?.transform[4] ||
		!nextItem?.transform[4]
	) {
		return null;
	}
	// Coordinates in axis x1
	const x1 =
		prevItem && prevItem?.transform[4] + prevItem.width < header?.transform[4]!
			? header.transform[4]
			: prevItem?.transform[4] || header.transform[4];

	// Coordinates in axis x2
	const x2 =
		nextItem && header.transform[4]! + header.width > nextItem.transform[4]!
			? nextItem.transform[4]! + nextItem.width
			: header.transform[4]! + header.width;

	// Y boundaries
	const y1 = header.transform[5];

	// Coordinates in axis y2 if exists footer
	const y2 =
		footerIndex !== -1 && items[footerIndex]?.transform[5]
			? items[footerIndex]?.transform[5]
			: 0;

	return { x1, x2, y1, y2 };
};

const getColumnValues = (
	items: TextItemI[],
	columnType: ColumnType,
): TextItemI[] => {
	const coords = getCoordinates(items, columnType);
	if (!coords) return []; // No valid coordinates found
	return items.filter((item) => {
		if (!item.transform[4] || !item.transform[5]) return [];
		const x = item.transform[4];
		const y = item.transform[5];

		const isWithinX = x > coords.x1 && x < coords.x2;
		const isWithinY =
			coords.y2 !== 0 ? y < coords.y1 && y > coords.y2 : y < coords.y1;

		return isWithinX && isWithinY && item.str.length > 0 && item.str !== " ";
	});
};

export const pdfParser = async (file: File): Promise<StructureData[]> => {
	const structureData: StructureData[] = [];
	const reader = new FileReader();

	return new Promise((resolve, reject) => {
		reader.onload = async () => {
			try {
				const typedArray = new Uint8Array(reader.result as ArrayBuffer);

				pdfjs.GlobalWorkerOptions.workerSrc = new URL(
					"pdfjs-dist/build/pdf.worker.min.mjs",
					import.meta.url,
				).toString();

				const pdf = await pdfjs.getDocument({ data: typedArray }).promise;
				for (let i = 0; i < pdf.numPages; i++) {
					const page = await pdf.getPage(i + 1);
					const textContent = await page.getTextContent();
					const items = textContent.items as TextItemI[];

					const nameStructure = getColumnValues(items, "NAME");
					const monthStructure = getColumnValues(items, "MONTH");
					const priceStructure = getColumnValues(items, "PRICE");

					if (
						nameStructure.length !== monthStructure.length ||
						nameStructure.length !== priceStructure.length
					) {
						throw new Error("Columns do not have the same length");
					}

					for (let i = 0; i < nameStructure.length; i++) {
						structureData.push({
							NAME: nameStructure[i]!.str!,
							MONTH: monthStructure[i]!.str!,
							PRICE: priceStructure[i]!.str!,
						});
					}
				}

				resolve(structureData);
			} catch (error) {
				reject(error);
			}
		};
		reader.onerror = reject;
		reader.readAsArrayBuffer(file);
	});
};

// export const comparedPdfData = async (pdf1: File, pdf2: File) => {
//     const data1 = await pdfParser(pdf1);
//     const data2 = await pdfParser(pdf2);
//     const results = [];
//     const shortestDataLenght = Math.min(data1.length, data2.length);

//     for (let i = 0; i < shortestDataLenght; i++) {
//         if (data1[i]!.MONTH === data2[i]!.MONTH) {
//             results.push({
//                 value1: data1[i]!.PRICE!,
//                 value2: data2[i]!.PRICE!,
//                 result: Number(data1[i]!.PRICE) + Number(data2[i]!.PRICE)!,
//             });
//         }
//     }

//     return results;
// };
