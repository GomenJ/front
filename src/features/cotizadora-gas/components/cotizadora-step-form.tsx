import { useState } from "react";
import { CotizadoraGasForm } from "./cotizadora-gas-form";
import { CotizadoraInvoiceForm } from "./cotizadora-invoice-form";

export const CotizadoraStepForm = () => {
	const [step, setStep] = useState(1);

	function handleBackStep() {
		setStep(1);
	}

	const handleNextStep = function () {
		setStep(2);
	};

	return (
		<>
			{step === 1 && <CotizadoraGasForm handleNextStep={handleNextStep} />}
			{step === 2 && <CotizadoraInvoiceForm handleBackStep={handleBackStep} />}
		</>
	);
};
