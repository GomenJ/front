import { Controller } from "react-hook-form";
import { useCommissionForm } from "@/hooks/use-comission-form";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export const HideComission = () => {
	const [openDialog, setOpenDialog] = useState(false);

	const { form, submit } = useCommissionForm();
	const {
		handleSubmit,
		register,
		control,
		formState: { errors },
	} = form;

	return (
		<Dialog open={openDialog} onOpenChange={setOpenDialog}>
			<DialogTrigger asChild>
				<p
					onClick={(e) => {
						e.stopPropagation();
						setOpenDialog(true);
					}}
					className="w-full"
				>
					Comisión
				</p>
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-[425px]"
				onClick={(e) => e.stopPropagation()}
			>
				<DialogHeader>
					<DialogTitle>Ocultar comisión</DialogTitle>
					<DialogDescription>
						Oculta y personaliza la comisión aquí
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(submit)} className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="hidden" className="col-span-2 text-right">
							Ocultar comisión
						</Label>
						<Controller
							control={control}
							name="hidden"
							render={({ field }) => (
								<Checkbox
									checked={field.value}
									onClick={(e) => {
										e.stopPropagation();
									}}
									onCheckedChange={(e) => {
										field.onChange(e);
									}}
									className="peer border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5 shrink-0 rounded-sm border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								/>
							)}
						/>
					</div>

					<div className="grid grid-cols-4 items-center gap-1">
						<Label htmlFor="percentage" className="col-span-2 text-right">
							Porcentaje de comisión
						</Label>
						<Input
							id="percentage"
							type="number"
							{...register("percentage", { valueAsNumber: true })}
							className="col-span-2"
							onFocus={(e) => e.stopPropagation()}
							onClick={(e) => e.stopPropagation()}
						/>
						{errors.percentage && (
							<span className="col-span-4 text-right text-xs text-red-500">
								{errors.percentage.message}
							</span>
						)}
					</div>

					<DialogFooter>
						<Button
							type="button"
							onClick={() => {
								setOpenDialog(false);
							}}
						>
							Cancelar
						</Button>
						<Button type="submit" onClick={() => setOpenDialog(false)}>
							Guardar Cambios
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
