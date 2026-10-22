import { useNavigate } from '@tanstack/react-router'

import { Button } from '@/component/Button/Button'
import { useSession } from '../../../../lib/auth/session'
import { useLogout } from '../../../../lib/queries/auth'
import './DemoBanner.css'

export const demoBannerLabels = {
  notice: 'Mode démo : ses données seront effacées. Votre nouveau compte sera vide.',
  signup: 'Quitter la démo et créer un compte',
} as const

export function DemoBanner() {
  const session = useSession()
  const navigate = useNavigate()
  const logout = useLogout(() => {
    void navigate({ to: '/auth/signup' })
  })
  const isDemo = session.status === 'authenticated' && session.user.isDemo
  if (!isDemo) return null
  return (
    <div className="demo-banner" role="status">
      <span>{demoBannerLabels.notice}</span>{' '}
      <Button
        type="button"
        variant="bare"
        className="demo-banner__cta"
        loading={logout.isPending}
        onClick={() => logout.mutate()}
      >
        {demoBannerLabels.signup}
      </Button>
    </div>
  )
}
