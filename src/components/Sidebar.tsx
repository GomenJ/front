import { MainNav } from './MainNav'

export const Sidebar = () => {
  return (
    <div className="bg-indigo-300 max-w-1/5 w-1/6 flex flex-col gap-8 border border-solid border-r-gray-100 items-center justify-center min-w-20">
      <MainNav />
    </div>
  )
}
// flex flex-col gap-8 overflow-scroll border border-solid border-gray-100 bg-white px-6 py-8 dark:border-gray-800 dark:bg-[#18212f]