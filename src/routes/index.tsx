import { createFileRoute, redirect } from "@tanstack/react-router";
// import { useEffect } from "react";

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({ to: "/cotizadora-de-gas" });
	},
	component: Index,
});

function Index() {
	return (
		<div className="p-2 text-center">
			<h3 className="">Algo del mapa</h3>
			<div className="h-screen"></div>
		</div>
	);
}
