import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Sidebar } from "../components/Sidebar";

export const Route = createRootRoute({
	component: () => (
		<>
			<div className="flex gap-2 h-dvh overflow-hidden w-full">
				<Sidebar />
				<main className="flex-1 overflow-scroll hide-scrollbar mx-10">
					<Outlet />
				</main>
			</div>
			<TanStackRouterDevtools />
		</>
	),
});

// id: "c9257888-82f9-4dd3-b10a-09b7039ceb81"
// {
// tradeDate: "2025-02-21"
// flowDate: "2025-03-1"
// indice: "HH"
// fuente: "NGI"
// precio: 0.008
// usuario: "Becario"
// fechaActualizacion: "2025-03-12 23:59:12"
// fechaCreacion: "2025-03-12 23:59:12"
// }
