import { createFileRoute, redirect } from '@tanstack/react-router'

import { AuthLayout } from '@/component/Layout/AuthLayout/AuthLayout'
import { resolveLoginDestination } from '@/features/auth/lib/loginDestination'
import { LoginPage } from '@/features/auth/page/LoginPage/LoginPage'
import { readClientSession } from '@/lib/auth/session'

function sanitizeRedirect(url: unknown): string | undefined {
  if (typeof url !== 'string' || !url.startsWith('/') || url.startsWith('//')) return undefined
  return url
}

export const Route = createFileRoute('/auth/login')({
  validateSearch: (search) => ({
    redirect: sanitizeRedirect(search.redirect),
  }),
  beforeLoad: ({ search }) => {
    if (readClientSession().status === 'authenticated') {
      throw redirect({ to: resolveLoginDestination(search.redirect) })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AuthLayout
      footer={{
        text: 'Pas encore de compte?',
        to: '/auth/signup',
        label: `S'enregistrer`,
      }}
    >
      <LoginPage />
    </AuthLayout>
  )
}
