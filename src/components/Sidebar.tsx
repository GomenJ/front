import { useAuthStore } from "@/stores/auth-store";
import { MainNav } from "./MainNav";
import { NavUser } from "./nav-user";

export const Sidebar = () => {
	// const src = "../../public/luxem_blanco.png"
	// const src = "/luxem_blanco.png";
	const user = useAuthStore((state) => state.user);
	const userName = user?.username ? user?.username : "Generico";

	const src = "/luxem_energia_color.png";
	return (
		<aside className="relative flex w-1/5 min-w-60 flex-col gap-8 border-r border-solid border-r-gray-200 bg-gray-100 px-6 py-8 dark:border-gray-800 dark:bg-[#18212f]">
			<div>
				<img src={src} alt="Logo" className="h-24 w-auto object-contain" />
			</div>

			<MainNav />

			<div className="absolute bottom-0 mb-4 flex w-full gap-8">
				<NavUser
					user={{
						name: userName,
						avatar:
							"https://avatars.dicebear.com/api/avataaars/carlos-nava.svg",
					}}
				/>
			</div>

			{/* <div className="absolute bottom-0 mb-4"> */}
			{/* 	<DropdownMenu> */}
			{/* 		<DropdownMenuTrigger> */}
			{/* 			<Button variant="outline" className="link w-full"> */}
			{/* 				Open */}
			{/* 			</Button> */}
			{/* 		</DropdownMenuTrigger> */}
			{/* 		<DropdownMenuContent> */}
			{/* 			<DropdownMenuLabel>My Account</DropdownMenuLabel> */}
			{/* 			<DropdownMenuSeparator /> */}
			{/* 			<DropdownMenuItem>Profile</DropdownMenuItem> */}
			{/* 			<DropdownMenuItem>Billing</DropdownMenuItem> */}
			{/* 			<DropdownMenuItem>Team</DropdownMenuItem> */}
			{/* 			<DropdownMenuItem>Subscription</DropdownMenuItem> */}
			{/* 		</DropdownMenuContent> */}
			{/* 	</DropdownMenu> */}
			{/* </div> */}
		</aside>
	);
};
