import { createRootRoute, Outlet, Link } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Sidebar } from "../components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

export const Route = createRootRoute({
	notFoundComponent: () => (
		<>
			<div className="grid h-full w-full place-content-center">
				<h1 className="text-4xl">Página no encontrada</h1>
				<Link to="/" className="m-10">
					<Button>Click aquí para regresar al inicio </Button>
				</Link>
			</div>
		</>
	),
	component: () => (
		<>
			<div className="flex h-dvh w-full gap-2 overflow-hidden bg-white dark:bg-gray-900">
				<Sidebar />
				<main className="hide-scrollbar flex-1 overflow-scroll md:mx-10">
					<Outlet />
					<Toaster richColors position="top-center" />
				</main>
			</div>
			<TanStackRouterDevtools />
		</>
	),
});
