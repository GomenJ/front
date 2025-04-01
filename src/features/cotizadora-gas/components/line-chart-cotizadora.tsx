import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts";
import { useCotizadoraStore } from "../stores/cotizadora-store";
import { format } from "date-fns";

export const LineChartCotizadora = () => {
	const data = useCotizadoraStore((state) => state.data);
	const percentage = useCotizadoraStore((state) => state.percantage);
	// const fee = useCotizadoraStore((state) => state.fee);
	const chartData = useCotizadoraStore((state) => state.chartData);
	const newData: Record<string, string | number>[] = [];
	data.forEach((item) => {
		newData.push({
			flow_date: format(new Date(item.flow_date), "MMM-yy"), // Format date
		});
	});

	chartData.forEach((item, index) => {
		const fee = Number(item.fee).toFixed(3);
		newData.forEach((newItem, i) => {
			const number = String(index + 1);
			const comission = (Number(`0.${percentage}`) * Number(fee)).toFixed(3);
			const price = (
				Number(data[i].precio) +
				(Number(fee) || 0) +
				Number(comission)
			).toFixed(3);
			newItem[`price-${number}`] = Number(price);
		});
	});

	// Grab all keys that start with 'price-' from the first row
	// (assuming at least one row is guaranteed)
	const lineKeys = Object.keys(newData[0] ?? {}).filter((key) =>
		key.startsWith("price-"),
	);
	const strokeColors = ["#8884d8", "#82ca9d", "#ff7300", "#ff4872"];
	const lineChartData = newData.slice(0, 24);
	return (
		<LineChart
			width={750}
			className="w-full"
			height={600}
			data={lineChartData}
			margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
			title="Line chart"
		>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="flow_date" />
			{/* <YAxis */}
			{/* 	tickFormatter={(value) => `$${value.toFixed(2)}`} // Format Y-axis values */}
			{/* /> */}
			{/* <YAxis */}
			{/*   tickFormatter={(value) => `$${value.toFixed(2)}`} */}
			{/*   domain={["dataMin - 1", "dataMax + 1"]} */}
			{/* /> */}
			<YAxis
				tickFormatter={(value) => `$${value.toFixed(2)}`}
				domain={["dataMin / 0.5", "dataMax / 0.5"]}
			/>
			{/* <YAxis */}
			{/* 	tickFormatter={(value) => `$${value.toFixed(2)}`} */}
			{/* 	domain={["auto", "auto"]} */}
			{/* /> */}
			{/* <Tooltip /> */}
			<Tooltip
				formatter={(value) => `$${Number(value).toFixed(2)}`} // Format Tooltip price
				labelFormatter={(label) => `Date: ${label}`} // Format Tooltip date
			/>
			<Legend />
			{lineKeys.map((lineKey, idx) => (
				<Line
					key={lineKey}
					type="monotone"
					dataKey={lineKey}
					// stroke="#8884d8"
					stroke={strokeColors[idx % strokeColors.length]}
				/>
			))}
		</LineChart>
	);
};
