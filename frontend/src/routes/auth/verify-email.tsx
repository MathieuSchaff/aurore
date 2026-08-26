import { createFileRoute } from '@tanstack/react-router'

import { AuthLayout } from '@/component/Layout/AuthLayout/AuthLayout'
import { VerifyEmailPage } from '@/features/auth/page/VerifyEmailPage/VerifyEmailPage'

export const Route = createFileRoute('/auth/verify-email')({
  validateSearch: (search): { token?: string } => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthLayout
      footer={{ text: 'Retour à la connexion', to: '/auth/login', label: 'Se connecter' }}
    >
      <VerifyEmailPage />
    </AuthLayout>
  )
}
