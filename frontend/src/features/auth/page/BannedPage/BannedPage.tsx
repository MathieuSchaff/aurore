import { useNavigate } from '@tanstack/react-router'

import { Button } from '../../../../component/Button/Button'
import { useBanNotice } from '../../../../lib/auth/useBanNotice'
import { formatInstant } from '../../../../lib/dates'
import { useLogout } from '../../../../lib/queries/auth'

export const BannedPage = () => {
  const banNotice = useBanNotice()
  const logout = useLogout()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => navigate({ to: '/auth/login', search: { redirect: undefined } }),
    })
  }

  return (
    <div className="auth-page__header">
      <h1 className="auth-page__title">Compte suspendu</h1>
      <p className="auth-page__subtitle">
        {banNotice?.expiresAt
          ? `Votre compte est suspendu jusqu'au ${formatInstant(banNotice.expiresAt, 'long')}.`
          : 'Votre compte est suspendu.'}
      </p>
      {banNotice?.reason ? (
        <p className="auth-page__subtitle">{banNotice.reason}</p>
      ) : (
        <p className="auth-page__subtitle">Pour toute question, contactez le support.</p>
      )}
      <Button
        type="button"
        variant="primary"
        fullWidth
        loading={logout.isPending}
        onClick={handleLogout}
      >
        Se déconnecter
      </Button>
    </div>
  )
}
