import type { User } from "@/stores/auth-store";
import { format } from "date-fns";

export const disableDays = (
	day: Date,
	availableDates: string[],
	user: Omit<User, "password"> | null,
) => {
	const todayDate = format(new Date(), "yyyy-MM-dd");
	const date = format(day.toLocaleDateString(), "yyyy-MM-dd");

	if (user?.role === "admin") {
		return !availableDates.includes(date);
	}

	if (availableDates.length === 0 && !availableDates) return false;
	// return !availableDates.includes(todayDate) && date === todayDate;

	if (availableDates.includes(date) && date === todayDate) {
		return false;
	}

	return true;
};
