import { createFileRoute } from '@tanstack/react-router'

import { AuthLayout } from '../component/Layout/AuthLayout/AuthLayout'
import { VerifyEmailPage } from '../features/auth/components/VerifyEmailPage/VerifyEmailPage'

export const Route = createFileRoute('/verify-email')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthLayout footer={{ text: 'Retour à la connexion', to: '/login', label: 'Se connecter' }}>
      <VerifyEmailPage />
    </AuthLayout>
  )
}
