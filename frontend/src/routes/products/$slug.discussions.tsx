import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/products/$slug/discussions')({
  component: () => <Outlet />,
})
