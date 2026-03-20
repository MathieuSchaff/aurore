import { createFileRoute } from '@tanstack/react-router'

import { AuthLayout } from '../component/Layout/AuthLayout/AuthLayout'
import { VerifyPendingPage } from '../features/auth/components/VerifyPendingPage/VerifyPendingPage'

export const Route = createFileRoute('/verify-pending')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthLayout footer={{ text: 'Retour à la connexion', to: '/login', label: 'Se connecter' }}>
      <VerifyPendingPage />
    </AuthLayout>
  )
}
