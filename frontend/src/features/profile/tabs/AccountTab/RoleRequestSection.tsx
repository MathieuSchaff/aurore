import type { SubmitRoleRequestErrorCode } from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { Button } from '../../../../component/Button/Button'
import { FormMessage } from '../../../../component/Feedback/ui/FormMessage/FormMessage'
import { FormActions } from '../../../../component/Input/FormActions/FormActions'
import { Input } from '../../../../component/Input/Input'
import { Textarea } from '../../../../component/Input/Textarea/Textarea'
import { SettingsSection } from '../../../../component/Layout/SettingsSection/SettingsSection'
import { useSession } from '../../../../lib/auth/session'
import { apiErrorMessage } from '../../../../lib/helpers/apiError'
import {
  roleRequestQueries,
  useCancelRoleRequest,
  useSubmitRoleRequest,
} from '../../../../lib/queries/role-requests'

// Maps server error codes from submitRoleRequestBodySchema to calm FR copy.
const ROLE_REQUEST_ERRORS = {
  already_pending: 'Vous avez déjà une demande en attente.',
  already_elevated: 'Vous êtes déjà modérateur ou administrateur.',
} satisfies Partial<Record<SubmitRoleRequestErrorCode, string>>

const ROLE_REQUEST_ERROR_FALLBACK = 'L’envoi a échoué. Veuillez réessayer.'

const MOTIVATION_MIN = 10
const MOTIVATION_MAX = 1000

export const RoleRequestSection = () => {
  // Section is for plain users only; it unmounts once the role flips to contributor.
  const session = useSession()
  const isUser = session.status === 'authenticated' && session.user.role === 'user'
  const { data, isLoading, isError } = useQuery({
    ...roleRequestQueries.mine(),
    enabled: isUser,
  })
  const latest = data?.latest
  const submit = useSubmitRoleRequest()
  const cancel = useCancelRoleRequest()
  const [motivation, setMotivation] = useState('')
  const [link, setLink] = useState('')
  const [showForm, setShowForm] = useState(false)

  if (!isUser) return null

  const trimmedMotivation = motivation.trim()
  const trimmedLink = link.trim()
  const linkValid = trimmedLink === '' || /^https:\/\//i.test(trimmedLink)
  const canSubmit =
    trimmedMotivation.length >= MOTIVATION_MIN &&
    trimmedMotivation.length <= MOTIVATION_MAX &&
    linkValid &&
    !submit.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    submit.mutate(
      {
        motivation: trimmedMotivation,
        // Omit the link when empty: never send '' or null (httpsUrl is optional, absent = not provided).
        ...(trimmedLink ? { motivationLink: trimmedLink } : {}),
      },
      {
        onSuccess: () => {
          setMotivation('')
          setLink('')
        },
      }
    )
  }

  const form = (
    <form onSubmit={handleSubmit} className="role-request-form">
      <div className="form-fields">
        <Textarea
          label="Votre motivation"
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          rows={4}
          required
          maxLength={MOTIVATION_MAX}
          hint={`Entre ${MOTIVATION_MIN} et ${MOTIVATION_MAX} caractères. Dites-nous pourquoi vous souhaitez aider à vérifier et enrichir le catalogue.`}
          disabled={submit.isPending}
        />
        <Input
          label="Lien (optionnel)"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://…"
          hint="Profil, portfolio ou tout lien utile. https uniquement."
          error={!linkValid ? 'Le lien doit commencer par https://' : undefined}
          disabled={submit.isPending}
        />
      </div>

      {submit.isError && (
        <FormMessage variant="error">
          {apiErrorMessage(submit.error, ROLE_REQUEST_ERRORS, ROLE_REQUEST_ERROR_FALLBACK)}
        </FormMessage>
      )}

      <FormActions
        submitLabel="Envoyer la demande"
        isPending={submit.isPending}
        disabled={!canSubmit}
        size="sm"
      />
    </form>
  )

  let body: React.ReactNode
  if (isLoading) {
    body = <p className="role-request-intro">Chargement…</p>
  } else if (isError) {
    // Don't fall through to the form on a failed load: a user with a pending request
    // would see it and submit again into an `already_pending` error.
    body = (
      <FormMessage variant="warning">
        Impossible de charger l'état de votre demande. Rechargez la page.
      </FormMessage>
    )
  } else if (latest?.status === 'pending') {
    body = (
      <div className="role-request-status">
        <p className="role-request-status-text">
          Votre demande est <strong>en attente</strong> de validation. Vous deviendrez modérateur
          dès qu'un administrateur l'aura approuvée.
        </p>
        {cancel.isError && (
          <FormMessage variant="error">L’annulation a échoué. Veuillez réessayer.</FormMessage>
        )}
        <Button
          variant="outline"
          size="sm"
          loading={cancel.isPending}
          onClick={() => cancel.mutate(latest.id)}
        >
          Annuler ma demande
        </Button>
      </div>
    )
  } else if (latest?.status === 'approved' && !data?.canApply) {
    // Welcome message. The role flips to contributor at the next token refresh (≤15 min),
    // which unmounts this section, no force-refresh needed. A demoted account also
    // carries an approved request, but the server says it can apply again, so it
    // falls through to the opt-in below
    body = (
      <FormMessage variant="success">
        Votre demande a été acceptée. Vos accès modérateur seront actifs d'ici quelques minutes, à
        la prochaine actualisation de votre session.
      </FormMessage>
    )
  } else {
    // Rejected users keep the resubmit form open (the rejection reason needs a visible next step);
    // never-asked / cancelled users get a quiet opt-in so the section is one button, not a standing
    // form, for the 99% who won't apply.
    const wasRejected = latest?.status === 'rejected'
    const formOpen = wasRejected || showForm
    body = (
      <div className="role-request-section">
        {wasRejected && (
          <FormMessage variant="warning">
            Votre demande a été refusée
            {latest.rejectionReason ? ` : ${latest.rejectionReason}` : '.'} Vous pouvez en soumettre
            une nouvelle.
          </FormMessage>
        )}
        {formOpen ? (
          <>
            <p className="role-request-intro">
              Devenir modérateur, c'est aider à vérifier et enrichir le catalogue : valider des
              fiches, lier les ingrédients, compléter les tags.
            </p>
            {form}
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            aria-expanded={false}
          >
            Je veux contribuer
          </Button>
        )}
      </div>
    )
  }

  return (
    <SettingsSection
      title="Devenir modérateur"
      description="Contribuez à la qualité du catalogue partagé."
    >
      {body}
    </SettingsSection>
  )
}
