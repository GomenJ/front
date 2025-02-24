import { GasInvoice } from "@/features/gas/GasInvoice";
import { BlobProvider, PDFViewer } from "@react-pdf/renderer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="p-2 text-center">
			{/* <h3 className="">Algo del mapa</h3> */}
			<div className="h-screen">
				<BlobProvider document={<GasInvoice />}>
					{({ url }) => {
						return (
							<a href={url || "#"} target="_blank">
								Open in new tab
							</a>
						);
					}}
				</BlobProvider>
				<PDFViewer>
					<GasInvoice />
				</PDFViewer>
			</div>
		</div>
	);
}
