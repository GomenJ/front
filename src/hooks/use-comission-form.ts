import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCommissionStore } from "@/stores/comission-store";
import { useEffect } from "react";

const schema = z.object({
	hidden: z.boolean(),
	percentage: z.coerce
		.number()
		.min(0, "Must be 0 or greater")
		.max(100, "Cannot exceed 100"),
});

type CommissionForm = z.infer<typeof schema>;

export const useCommissionForm = () => {
	const { hidden, percentage, setHidden, setPercentage } = useCommissionStore();

	const form = useForm<CommissionForm>({
		resolver: zodResolver(schema),
		defaultValues: {
			hidden,
			percentage,
		},
	});

	useEffect(() => {
		form.reset({ hidden, percentage });
	}, [hidden, percentage, form]);

	const submit = (data: CommissionForm) => {
		setHidden(data.hidden);
		setPercentage(data.percentage);
	};

	return { form, submit };
};
