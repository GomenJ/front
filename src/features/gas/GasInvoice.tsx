import {
	Page,
	Text,
	View,
	Document,
	StyleSheet,
	Font,
	Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";

type GasInvoiceProps = {
	period: string;
	volume: number;
	clientName: string;
	startDate: Date | string;
	endDate: Date | string;
	index: string;
	price: string;
};

Font.register({
	family: "Open Sans",
	fonts: [
		{
			src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
		},
		{
			src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
			fontWeight: 600,
		},
	],
});

// Create styles
const styles = StyleSheet.create({
	page: {
		backgroundColor: "white",
		fontSize: 13,
		fontFamily: "Open Sans",
	},
	section: {
		margin: 10,
		padding: 35,
		textAlign: "justify",
		flexGrow: 1,
		lineHeight: 1.2,
		marginTop: 30,
		paddingHorizontal: 110,
		gap: 15,
	},
	date: {
		textAlign: "right",
	},
	subject: {
		textAlign: "right",
		fontWeight: "bold",
	},
});

const unidades = [
	"",
	"uno",
	"dos",
	"tres",
	"cuatro",
	"cinco",
	"seis",
	"siete",
	"ocho",
	"nueve",
];
const especiales = [
	"diez",
	"once",
	"doce",
	"trece",
	"catorce",
	"quince",
	"dieciséis",
	"diecisiete",
	"dieciocho",
	"diecinueve",
];
const decenas = [
	"",
	"diez",
	"veinte",
	"treinta",
	"cuarenta",
	"cincuenta",
	"sesenta",
];

function numberToWords(num: number): string {
	if (num === 0) return "cero";
	if (num < 10) return unidades[num];
	if (num < 20) return especiales[num - 10];
	if (num < 30) return num === 20 ? "veinte" : "veinti" + unidades[num % 10];
	if (num < 60)
		return (
			decenas[Math.floor(num / 10)] +
			(num % 10 !== 0 ? " y " + unidades[num % 10] : "")
		);
	return num.toString(); // For simplicity, handle only up to 60
}

// Create Document Component
export const GasInvoice = ({
	period,
	volume,
	clientName,
	// startDate,
	// endDate,
	index,
	price = "81244",
}: GasInvoiceProps) => (
	<Document>
		<Page size="A3" style={styles.page}>
			<View style={styles.section}>
				<Image
					src={"./LUXEM_ENERGIA_COLOR.png"}
					style={{
						height: 25,
						width: 200,
					}}
				/>
				<Text style={styles.date}>
					Ciudad de México,{" "}
					{format(new Date(), "dd 'de' MMMM 'de' yyyy", {
						locale: es,
					})}
				</Text>
				<Text style={styles.subject}>
					Asunto: Propuesta de venta de cobertura de gas natural
				</Text>
				<Text>
					A quien corresponda de la empresa{" "}
					<Text style={{ fontWeight: "bold" }}>{clientName}</Text>, por medio
					del presente <Text style={{ fontWeight: "bold" }}>Luxem Energía</Text>{" "}
					oferta la siguiente propuest{" "}
					<Text style={{ textTransform: "uppercase", fontWeight: "bold" }}>
						no vinculante
					</Text>{" "}
					para la venta de cobertura de gas natural, de conformidad con lo
					siguiente:
				</Text>

				<Text style={{ fontWeight: "bold", textDecoration: "underline" }}>
					Oferta.
				</Text>

				<ListItem
					indentation="20"
					label="Tipo de oferta:"
					listItem="a."
					spacing="15"
				>
					Fijo.
				</ListItem>

				<ListItem indentation="20" label="Producto:" listItem="b." spacing="15">
					Cobertura financiera de precio de gas natural.
				</ListItem>

				<ListItem
					indentation="20"
					label="Volumen de cobertura:"
					listItem="c."
					spacing="15"
				>
					{volume.toLocaleString()} MMBtu mensuales.
				</ListItem>

				<ListItem indentation="20" label="Plazo" listItem="d." spacing="15">
					Un periodo de {period} ({numberToWords(Number(period))}) meses.
				</ListItem>

				<ListItem
					indentation="20"
					label={`Precio promedio a ${period} meses.`}
					listItem="e."
					spacing="15"
				>
					Índice {index} diario. Precio fijo durante la vigencia del contrato.
				</ListItem>

				<Text style={{ paddingLeft: 20, fontWeight: "bold" }}>
					Condiciones generales.
				</Text>

				<Text>
					<Text style={{ fontWeight: "bold" }}>a. Vigencia de la oferta: </Text>
					1 (un) día hábil a partir de la recepción de la oferta. Esta oferta
					está sujeta a las variaciones del mercado y al momento de cierre de la
					transacción.
				</Text>

				<Text>
					<Text style={{ fontWeight: "bold" }}>
						b. Precio fijo de cobertura:{" "}
					</Text>
					El precio final fijo se determina al momento del cierre de la
					transacción. El precio fijo de la presente oferta económica es
					indicativo con fines informativos.
				</Text>

				<Text>
					<Text style={{ fontWeight: "bold" }}>c. Condiciones: </Text>
					Las condiciones de pago se establecerán en el contrato
					correspondiente, así como el monto y plazo de entrega del depósito en
					garantía.
				</Text>

				<Text>
					<Text style={{ fontWeight: "bold" }}>d. Garantía: </Text>
					Los montos de garantía son indicativos, siendo asignados en función
					del volumen contratado.
				</Text>

				<Text>
					<Text style={{ fontWeight: "bold" }}>
						e. Monto de garantía por un periodo de {period} meses:{" "}
					</Text>
					${Number(price).toLocaleString()} dólares americanos. La determinación
					del monto de la garantía está sujeto a las variaciones del mercado y
					al momento de cierre de la transacción. La garantía se deberá
					constituir en efectivo de conformidad con los términos estipulados en
					el contrato.
				</Text>

				<View style={{ textAlign: "center" }}>
					<Text style={{ marginBottom: 10 }}>Atentamente,</Text>
					<Text>Luxem Energía</Text>
				</View>
			</View>
		</Page>
	</Document>
);

type ListItemProps = {
	children: React.ReactNode;
	indentation: string;
	spacing?: string;
	label?: string;
	listItem: string;
};

function ListItem({
	children,
	indentation,
	spacing = "0",
	label,
	listItem,
}: ListItemProps) {
	return (
		<>
			<View
				style={{
					paddingLeft: indentation,
					flexDirection: "row",
					textOverflow: "ellipsis",
				}}
			>
				<Text
					style={{
						fontWeight: "bold",
					}}
				>
					{listItem}
				</Text>
				<Text
					style={{
						fontWeight: "bold",
						paddingLeft: spacing,
					}}
				>
					{label}
				</Text>
				<Text> {children}</Text>
			</View>
		</>
	);
}
