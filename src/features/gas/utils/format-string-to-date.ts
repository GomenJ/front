import { format } from "date-fns";

export const formatStringtoDate = (dateString: string): string => {
	let month = "";
	let year = "";

	if (dateString.includes("-")) {
		[month, year] = dateString.split("-");
	}

	month = dateString.slice(0, 3);
	year = dateString.slice(3);

	if (month.length === 0 || year.length === 0) return "";
	const date = new Date(`2 ${month} ${year}`);
	return format(date, "yyyy-MM-dd");
};
