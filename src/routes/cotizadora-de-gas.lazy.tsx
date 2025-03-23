// import { CotizadoraGasForm } from "@/features/cotizadora-gas/components/cotizadora-gas-form";
import { CotizadoraStepForm } from "@/features/cotizadora-gas/components/cotizadora-step-form";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/cotizadora-de-gas")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<h1 className="my-10 text-center text-3xl font-semibold">
				Cotizadora de gas
			</h1>
			<CotizadoraStepForm />
		</>
	);
}
