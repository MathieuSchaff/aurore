import type { VerifyEmailErrorCode } from '@aurore/shared'

import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

import { Button } from '../../../../component/Button/Button'
import { readClientSession } from '../../../../lib/auth/session'
import { apiErrorMessage, isApiErrorCode } from '../../../../lib/helpers/apiError'
import { useResendVerification, useVerifyEmail } from '../../../../lib/queries/auth'

/* Exhaustive map: TS errors if a VerifyEmailErrorCode is added without a label here.
   Exported so tests assert the same string the user sees. */
export const VERIFY_EMAIL_ERRORS: Record<VerifyEmailErrorCode, string> = {
  invalid_token: 'Ce lien de vérification est invalide.',
  token_expired: 'Ce lien de vérification a expiré.',
  server_error: 'Ce lien de vérification est invalide.',
}

export const VerifyEmailPage = () => {
  const { token = '' } = useSearch({ from: '/auth/verify-email' })
  const navigate = useNavigate()
  const verify = useVerifyEmail()
  const resend = useResendVerification()

  useEffect(() => {
    if (!token) return
    verify.mutate(token, {
      onSuccess: () => {
        // Neutral signup leaves no session, so verifying just activates the account.
        // Send the user to login, unless they're already authenticated (verifying
        // during the legacy grace period), in which case go straight to the app.
        const session = readClientSession()
        if (session.status === 'authenticated' && session.credential === 'present') {
          navigate({ to: '/collection' })
        } else {
          toast.success('Email vérifié. Connectez-vous pour continuer.')
          navigate({ to: '/auth/login', search: { redirect: undefined } })
        }
      },
    })
  }, [token, navigate, verify.mutate])

  if (!token) {
    return (
      <div className="auth-page__header">
        <h1 className="auth-page__title">Lien invalide</h1>
        <p className="auth-page__subtitle">{VERIFY_EMAIL_ERRORS.invalid_token}</p>
      </div>
    )
  }

  if (verify.isPending) {
    return (
      <div className="auth-page__header">
        <output className="auth-page__subtitle">Vérification en cours…</output>
      </div>
    )
  }

  if (verify.isSuccess) return null

  if (isApiErrorCode(verify.error, 'token_expired')) {
    return (
      <div className="auth-page__header">
        <h1 className="auth-page__title">Lien expiré</h1>
        <p className="auth-page__subtitle">{VERIFY_EMAIL_ERRORS.token_expired}</p>
        <Button
          type="button"
          variant="primary"
          fullWidth
          loading={resend.isPending}
          onClick={() =>
            resend.mutate(undefined, {
              onSuccess: () => toast.success('Email envoyé ! Vérifiez votre boîte mail.'),
              onError: () => toast.error("Impossible d'envoyer l'email, réessayez plus tard."),
            })
          }
        >
          Demander un nouveau lien
        </Button>
      </div>
    )
  }

  if (verify.isError) {
    return (
      <div className="auth-page__header">
        <h1 className="auth-page__title">Lien invalide</h1>
        <p className="auth-page__subtitle">
          {apiErrorMessage(verify.error, VERIFY_EMAIL_ERRORS, VERIFY_EMAIL_ERRORS.server_error)}
        </p>
      </div>
    )
  }

  return (
    <div className="auth-page__header">
      <output className="auth-page__subtitle">Vérification en cours…</output>
    </div>
  )
}
