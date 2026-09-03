import { createFileRoute, redirect } from '@tanstack/react-router'

import { AuthLayout } from '@/component/Layout/AuthLayout/AuthLayout'
import { SignupPage } from '@/features/auth/page/SignupPage/SignupPage'
import { readClientSession } from '@/lib/auth/session'

export const Route = createFileRoute('/auth/signup')({
  beforeLoad: () => {
    if (readClientSession().status === 'authenticated') {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthLayout
      footer={{
        text: 'Déjà un compte ?',
        to: '/auth/login',
        label: 'Se connecter',
      }}
    >
      <SignupPage />
    </AuthLayout>
  )
}
