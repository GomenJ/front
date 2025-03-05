import { MainNav } from "./MainNav";

export const Sidebar = () => {
	// const src = "../../public/luxem_blanco.png"
	const src = "/luxem_blanco.png";
	return (
		<aside className="flex w-1/5 min-w-60 flex-col gap-8 border border-solid border-r-gray-100 bg-indigo-300 px-6 py-8 dark:border-gray-800 dark:bg-[#18212f]">
			<div>
				<img src={src} alt="Logo" className="h-24 w-auto object-contain" />
			</div>

			<MainNav />
		</aside>
	);
};
