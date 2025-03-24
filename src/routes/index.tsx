import { createFileRoute } from "@tanstack/react-router";
// import { useEffect } from "react";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="grid h-full w-full place-content-center p-2 text-center">
			<h3 className="text-5xl font-semibold">Pantalla de inició</h3>
		</div>
	);
}
