import { MainNav } from "./MainNav";

export const Sidebar = () => {
	// const src = "../../public/luxem_blanco.png"
	// const src = "/luxem_blanco.png";
	const src = "/luxem_energia_color.png";
	return (
		<aside className="flex w-1/5 min-w-60 flex-col gap-8 border-r border-solid border-r-gray-200 bg-gray-100 px-6 py-8 dark:border-gray-800 dark:bg-[#18212f]">
			<div>
				<img src={src} alt="Logo" className="h-24 w-auto object-contain" />
			</div>

			<MainNav />
		</aside>
	);
};
