import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/ingredients/$slug/discussions')({
  component: () => <Outlet />,
})
