import { authSchema } from '@aurore/shared'

import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '@/component/Button/Button'
import { FormMessage } from '@/component/Feedback/ui/FormMessage/FormMessage'
import { Input } from '@/component/Input/Input'
import { apiErrorMessage } from '@/lib/helpers/apiError'
import { usePrivacyDelete, usePrivacyExport } from '@/lib/queries/privacy-access'

export function PrivacyAccessForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const download = usePrivacyExport()
  const deletion = usePrivacyDelete()
  const navigate = useNavigate()
  const credentials = authSchema.safeParse({ email, password })
  const pending = download.isPending || deletion.isPending
  const error = deletion.error ?? download.error
  const message = apiErrorMessage(
    error,
    {
      invalid_credentials: 'Email ou mot de passe incorrect.',
      rate_limit_exceeded: 'Patientez cinq minutes avant un nouvel export.',
    },
    'Opération impossible. Réessayez.'
  )

  return (
    <section aria-labelledby="privacy-access-title">
      <h2 id="privacy-access-title">Vos données</h2>
      <p>
        Vous pouvez exporter vos données ou supprimer votre compte pendant sa suspension. Confirmez
        votre identité avec votre mot de passe.
      </p>
      <Input
        label="Adresse email"
        type="email"
        autoComplete="username"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={pending}
      />
      <Input
        label="Mot de passe"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={pending}
      />
      <Link to="/auth/forgot-password">Définir ou réinitialiser mon mot de passe</Link>
      {error && <FormMessage variant="error">{message}</FormMessage>}
      <Button
        type="button"
        disabled={!credentials.success || pending}
        loading={download.isPending}
        onClick={() => {
          if (credentials.success) download.mutate(credentials.data)
        }}
      >
        Exporter mes données
      </Button>
      {confirmDelete ? (
        <fieldset aria-label="Confirmation de suppression">
          <p>Cette suppression est définitive. Vos données personnelles seront effacées.</p>
          <Button type="button" disabled={pending} onClick={() => setConfirmDelete(false)}>
            Annuler
          </Button>
          <Button
            type="button"
            disabled={!credentials.success || pending}
            loading={deletion.isPending}
            onClick={() => {
              if (credentials.success)
                deletion.mutate(credentials.data, {
                  onSuccess: () => navigate({ to: '/auth/login', search: { redirect: undefined } }),
                })
            }}
          >
            Confirmer la suppression
          </Button>
        </fieldset>
      ) : (
        <Button
          type="button"
          disabled={!credentials.success || pending}
          onClick={() => setConfirmDelete(true)}
        >
          Supprimer mon compte
        </Button>
      )}
    </section>
  )
}
