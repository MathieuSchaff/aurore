import { toast } from 'sonner'

import { useResendVerification } from '../../../../lib/queries/auth'

export const VerifyPendingPage = () => {
  const resend = useResendVerification()

  const handleResend = () => {
    resend.mutate(undefined, {
      onSuccess: () => toast.success('Email envoyé ! Vérifie ta boîte mail.'),
      onError: () => toast.error("Impossible d'envoyer l'email, réessaie plus tard."),
    })
  }

  return (
    <div className="auth-page__header">
      <h1 className="auth-page__title">Vérifie ton email</h1>
      <p className="auth-page__subtitle">
        Un lien de vérification t'a été envoyé. Clique dessus pour activer ton compte.
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
