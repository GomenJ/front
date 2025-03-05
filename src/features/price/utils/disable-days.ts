import { format } from "date-fns";

export const disableDays = (day: Date, availableDates: string[]) => {
	if (availableDates.length === 0 && !availableDates) return false;
	const date = format(day.toLocaleDateString(), "yyyy-MM-dd");
	return !availableDates.includes(date);
};
