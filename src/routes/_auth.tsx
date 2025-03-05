import { useAuthStore } from "@/stores/auth-store";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const user = useAuthStore((state) => state.user);
	if (user === null) {
		navigate({
			to: "/",
			replace: true,
		});
	}

	return <Outlet />;
}
