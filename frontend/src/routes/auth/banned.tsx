import { createFileRoute } from '@tanstack/react-router'

import { AuthLayout } from '@/component/Layout/AuthLayout/AuthLayout'
import { BannedPage } from '@/features/auth/page/BannedPage/BannedPage'

export const Route = createFileRoute('/auth/banned')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthLayout>
      <BannedPage />
    </AuthLayout>
  )
}
