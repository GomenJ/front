// import { LineChart } from "lucide-react"
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
	// Transform the data
	const newData = data.map((item) => ({
		flow_date: format(new Date(item.flow_date), "yyyy-MM-dd"), // Format date
		total_precio: Number(item.total_precio), // Convert to number
	}));

	return (
		<LineChart
			width={730}
			height={250}
			data={newData}
			margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
			title="Line chart"
		>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="flow_date" />
			<YAxis
				tickFormatter={(value) => `$${value.toFixed(2)}`} // Format Y-axis values
			/>
			{/* <Tooltip /> */}
			<Tooltip
				formatter={(value) => `$${Number(value).toFixed(2)}`} // Format Tooltip price
				labelFormatter={(label) => `Date: ${label}`} // Format Tooltip date
			/>
			<Legend />
			<Line type="monotone" dataKey="total_precio" stroke="#8884d8" />
		</LineChart>
	);
};
