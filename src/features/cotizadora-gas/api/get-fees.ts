import { FeeType } from "../types/fees-type";

export const getFees = async () => {
	// const response = await fetch(`http://127.0.0.1:5000/api/v1/gas/fee`);
	const response = await fetch(`http://192.168.201.7:8080/api/v1/gas/fee`);
	if (!response.ok) {
		throw new Error("Failed to fetch fees");
	}
	const data = await response.json();
	return data as FeeType;
};
