import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/gas')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <h1 className="text-center mt-10 text-3xl">Cotizadora de gas</h1>

        </>
    )
}
