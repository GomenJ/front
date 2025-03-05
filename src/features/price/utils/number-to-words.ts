const unidades = [
	"",
	"uno",
	"dos",
	"tres",
	"cuatro",
	"cinco",
	"seis",
	"siete",
	"ocho",
	"nueve",
];
const especiales = [
	"diez",
	"once",
	"doce",
	"trece",
	"catorce",
	"quince",
	"dieciséis",
	"diecisiete",
	"dieciocho",
	"diecinueve",
];

export const numberToWords = (num: number): string => {
	if (num === 0) return "cero";
	if (num < 10) return unidades[num];
	if (num < 20) return especiales[num - 10];
	if (num < 30) return num === 20 ? "veinte" : "veinti" + unidades[num % 10];
	if (num < 31)
		return num === 30 ? "treinta" : "treinta y uno" + unidades[num % 10];

	return num.toString(); // For simplicity, handle only up to 60
};
