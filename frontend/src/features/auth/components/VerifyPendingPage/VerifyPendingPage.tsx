import { toast } from 'sonner'

import { useResendVerification } from '../../../../lib/queries/auth'

export const VerifyPendingPage = () => {
  const resend = useResendVerification()

  const handleResend = () => {
    resend.mutate(undefined, {
      onSuccess: () => toast.success('Email envoyé ! Vérifiez votre boîte mail.'),
      onError: () => toast.error("Impossible d'envoyer l'email, réessayez plus tard."),
    })
  }

  return (
    <div className="auth-page__header">
      <h1 className="auth-page__title">Vérifiez votre email</h1>
      <p className="auth-page__subtitle">
        Un lien de vérification vous a été envoyé. Cliquez dessus pour activer votre compte.
      </p>
      <p className="auth-page__subtitle">Le lien expire dans 1 heure.</p>
      <button
        type="button"
        className="auth-submit"
        onClick={handleResend}
        disabled={resend.isPending}
      >
        {resend.isPending ? 'Envoi...' : "Renvoyer l'email"}
      </button>
    </div>
  )
}
