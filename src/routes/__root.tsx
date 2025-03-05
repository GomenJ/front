import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Sidebar } from "../components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
	component: () => (
		<>
			<div className="flex h-dvh w-full gap-2 overflow-hidden dark:bg-gray-900">
				<Sidebar />
				<main className="hide-scrollbar mx-10 flex-1 overflow-scroll">
					<Outlet />
					<Toaster richColors position="top-center" />
				</main>
			</div>
			<TanStackRouterDevtools />
		</>
	),
});
