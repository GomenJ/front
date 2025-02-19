import * as XLSX from "xlsx"

type RowName = "Henry Hub" | "El Paso Permian" | "Houston Ship Channel" | "SoCal Border Avg." | "Waha"

type ExceltoJson = {
    [key: string]: string | number
}

// const rowAcronym = {
//     "Henry Hub": "HH",
//     "El Paso Permian": "EP",
//     "Houston Ship Channel": "HSC",
//     "SoCal Border Avg.": "SCL",
//     "Waha": "WAH"
// }

const findRowByFirstColumn = (workbook: XLSX.WorkBook, sheetNumber: number, rowName: RowName, columName = "Location") => {

    const sheetName = workbook.SheetNames[sheetNumber]
    if (!sheetName) {
        throw new Error("No sheet found")
    }

    const workSheet = workbook.Sheets[sheetName]
    if (!workSheet) {
        throw new Error("No sheet found")
    }


    const jsonData = XLSX.utils.sheet_to_json<ExceltoJson>(workSheet)

    for (const row of jsonData) {
        if (typeof row[columName] === 'string' && row[columName].includes(rowName)) {
            return row
        }
    }
    return null
}
type Values = {
    tradeDate: string
    usuario: string
}

export const getExcelData = async (file: File, values: Values) => {
    const data = await file.arrayBuffer();
    /* data is an ArrayBuffer */
    const workbook = XLSX.read(data);
    console.log("sheets", workbook.SheetNames)
    if (workbook.SheetNames.length === 0) {
        throw new Error("No sheet found")
    }
    const dataBaseData = []

    const henryHub = 'Henry Hub'
    // const sheetRows = ["El Paso Permian", "Houston Ship Channel", "SoCal Border Avg.", "Waha"]
    const elPasoPermian = findRowByFirstColumn(workbook, 0, 'El Paso Permian')
    const houstonShipChannel = findRowByFirstColumn(workbook, 1, 'Houston Ship Channel')
    const soCalBorderAvg = findRowByFirstColumn(workbook, 1, 'SoCal Border Avg.')
    const waha = findRowByFirstColumn(workbook, 1, 'Waha')
    const henryHubRow = findRowByFirstColumn(workbook, 1, henryHub)

    if (!henryHubRow) {
        throw new Error("No data found")
    }
    if (!elPasoPermian || !houstonShipChannel || !soCalBorderAvg || !waha) {
        throw new Error("No data found")
    }
    const date = new Date().toLocaleDateString()
    dataBaseData.push(...createExcelData('HH', values, date, henryHubRow),
        ...createExcelData('EP', values, date, elPasoPermian),
        ...createExcelData('HSC', values, date, houstonShipChannel),
        ...createExcelData('SCL', values, date, soCalBorderAvg),
        ...createExcelData('WAH', values, date, waha)
    )
    console.log(dataBaseData)
}

const createExcelData = (indice: string, values: Values, date: string, nameRow: ExceltoJson) => {
    const data = []
    for (const row in nameRow) {
        if (row !== "Location") {
            data.push({
                id: crypto.randomUUID(),
                tradeDate: values.tradeDate,
                flowDate: row,
                indice: indice,
                precio: nameRow[row],
                fuente: 'NGI',
                fechaCreacion: date,
                fechaActualizacion: date,
                usuario: values.usuario,
            })
        }
    }
    return data
}

// export const comparedExcelData = (path: string) => {
//     const filePath = path
//     const workbook = XLSX.readFile(filePath)
//     const structureData = []

//     const henryHub = findRowByFirstColumn(workbook, 0, "Henry Hub")
//     const otherExcel = findRowByFirstColumn(workbook, 1, "Waha")
//     if (!henryHub || !otherExcel) {
//         throw new Error("No data found")
//     }

//     // console.log(otherExcel)
//     if (typeof henryHub['Location'] === 'string' && typeof otherExcel['Location'] === 'string') {
//         structureData.push({
//             Location: henryHub['Location'] + " " + otherExcel['Location'],
//         })
//     }
//     for (const row in henryHub) {
//         if (row in otherExcel && row !== "Location") {
//             structureData.push({
//                 month: row,
//                 data1: henryHub[row],
//                 data2: otherExcel[row],
//                 result: Number(henryHub[row]) + Number(otherExcel[row])
//             })
//         }
//     }
// }

