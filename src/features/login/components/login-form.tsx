import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { loginFormScheme } from "../schemas/login-form-scheme";
import { useNavigate } from "@tanstack/react-router";

export const LoginForm = () => {
	const login = useAuthStore((state) => state.login);
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof loginFormScheme>>({
		resolver: zodResolver(loginFormScheme),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	async function handleSubmit(values: z.infer<typeof loginFormScheme>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		// login(values);
		if (!login(values.username, values.password)) {
			return alert("Invalid credentials!");
		}
		navigate({
			to: "/",
			replace: true,
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
				{/* email */}
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="flex flex-col items-start gap-3">
							<FormLabel className="text-left">Nombre de usuario</FormLabel>
							<FormControl>
								<Input
									type="text"
									// This makes this form better for password managers
									autoComplete="username"
									// disabled={isPending}
									placeholder="Pablito123"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* password */}
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem className="flex flex-col items-start gap-3">
							<FormLabel className="text-left">contraseña</FormLabel>
							<FormControl>
								<Input type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* {isPending ? ( */}
				{/*   <Button size="lg" disabled className="w-full"> */}
				{/*     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
				{/*   </Button> */}
				{/* ) : ( */}
				<Button size="lg" className="w-full" type="submit">
					Login
				</Button>
				{/* )} */}
			</form>
		</Form>
	);
};
