import { LoginForm } from '@/features/login/components/login-form'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <main className="grid min-h-screen place-content-center content-center justify-center gap-8 bg-gray-50 dark:bg-gray-900">
        {/* <img */}
        {/*   src="/logo-light.png" */}
        {/*   alt="Logo" */}
        {/*   className="h-24 justify-self-center" */}
        {/* /> */}
        {/* <Heading variant={"h4"}>Log in to your account</Heading> */}
        <LoginForm />
      </main>
    </>
  )
}
