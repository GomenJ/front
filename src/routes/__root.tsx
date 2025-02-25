import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Sidebar } from "../components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
	component: () => (
		<>
			<div className="flex gap-2 h-dvh overflow-hidden w-full">
				<Sidebar />
				<main className="flex-1 overflow-scroll hide-scrollbar mx-10">
					<Outlet />
					<Toaster richColors position="top-center" />
				</main>
			</div>
			<TanStackRouterDevtools />
		</>
	),
});
