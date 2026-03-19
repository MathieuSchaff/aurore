import { createFileRoute } from '@tanstack/react-router'

import { AuthLayout } from '../component/Layout/AuthLayout/AuthLayout'
import { LoginPage } from '../features/auth/components/LoginPage/LoginPage'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthLayout
      footer={{
        text: 'Pas encore de compte?',
        to: '/signup',
        label: `S'enregistrer`,
      }}
    >
      <LoginPage />
    </AuthLayout>
  )
}
