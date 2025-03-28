import { ChevronsUpDown, LogOut, LogIn, EyeOff } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
	DropdownMenu,
	DropdownMenuContent,
	// DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";
import { HideComission } from "./hide-comission";

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email?: string;
		avatar: string;
	};
}) {
	const navigate = useNavigate();
	const logout = useAuthStore((state) => state.logout);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="flex gap-10 border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-100">
					{/*   size="lg" */}
					{/*   className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" */}
					{/* > */}
					<Avatar className="h-8 w-8 rounded-lg">
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback className="rounded-lg">CN</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold text-gray-800">
							{user.name}
						</span>
						{/* <span className="truncate text-xs text-gray-800">{user.email}</span> */}
					</div>
					<ChevronsUpDown className="ml-auto size-4 text-gray-800" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
				// side={isMobile ? "bottom" : "right"}
				align="end"
				sideOffset={4}
			>
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback className="rounded-lg">CN</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">{user.name}</span>
							<span className="truncate text-xs">{user.email}</span>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<EyeOff />
					<HideComission />
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				{user.name !== "Generico" ? (
					<DropdownMenuItem
						onClick={() => {
							logout();
						}}
					>
						<LogOut />
						Log out
					</DropdownMenuItem>
				) : (
					<DropdownMenuItem
						onClick={() => {
							navigate({ to: "/login" });
						}}
					>
						<LogIn />
						Log in
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
