import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Sidebar } from '../components/Sidebar'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex gap-2 h-dvh overflow-hidden w-full">
        <Sidebar />
        <main className='flex-1 overflow-scroll hide-scrollbar mx-10'>
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools />
    </>
  ),
})
