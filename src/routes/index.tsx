import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2 text-center">
      <h3 className=''>Algo del mapa</h3>
    </div>
  )
}
