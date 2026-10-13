import { useNavigate } from '@tanstack/react-router'

import { Button } from '@/component/Button/Button'
import { FormMessage } from '@/component/Feedback/ui/FormMessage/FormMessage'
import { apiErrorMessage } from '@/lib/helpers/apiError'
import {
  useGooglePrivacyAccess,
  useGooglePrivacyDelete,
  useGooglePrivacyExport,
  useStartGooglePrivacyAccess,
} from '@/lib/queries/privacy-access'

export function GooglePrivacyAccess() {
  const access = useGooglePrivacyAccess()
  const start = useStartGooglePrivacyAccess()
  const download = useGooglePrivacyExport()
  const deletion = useGooglePrivacyDelete()
  const navigate = useNavigate()
  const grant = access.data
  const pending = start.isPending || download.isPending || deletion.isPending
  const error = start.error ?? deletion.error ?? download.error ?? access.error
  const message = apiErrorMessage(
    error,
    {
      invalid_credentials:
        'La confirmation Google a échoué ou a expiré. Recommencez avec le compte Google lié à Aurore.',
      rate_limit_exceeded: 'Veuillez patienter avant de réessayer.',
      too_many_requests: 'Trop de tentatives. Veuillez patienter avant de réessayer.',
    },
    'Opération impossible. Réessayez.'
  )

  return (
    <fieldset>
      <legend>Compte Google</legend>
      <p>Confirmez votre identité avec le compte Google lié à Aurore pour accéder à vos données.</p>
      {error && <FormMessage variant="error">{message}</FormMessage>}
      {download.isSuccess && (
        <FormMessage variant="success">Votre export a été téléchargé.</FormMessage>
      )}
      {grant && (
        <>
          <p>Compte confirmé : {grant.email}</p>
          <p>Cette autorisation est valable cinq minutes, uniquement pour l’opération choisie.</p>
          {grant.operation === 'export' ? (
            <Button
              type="button"
              disabled={pending}
              loading={download.isPending}
              onClick={() => download.mutate(grant.userId)}
            >
              Télécharger mes données Google
            </Button>
          ) : (
            <>
              <p>
                Cette suppression est définitive. Les données personnelles de ce compte seront
                effacées.
              </p>
              <Button
                type="button"
                disabled={pending}
                loading={deletion.isPending}
                onClick={() =>
                  deletion.mutate(grant.userId, {
                    onSuccess: () =>
                      navigate({ to: '/auth/login', search: { redirect: undefined } }),
                  })
                }
              >
                Confirmer la suppression du compte Google
              </Button>
            </>
          )}
        </>
      )}
      <Button
        type="button"
        disabled={pending || access.isLoading}
        onClick={() => start.mutate('export')}
      >
        Exporter avec Google
      </Button>
      <Button
        type="button"
        disabled={pending || access.isLoading}
        onClick={() => start.mutate('delete-account')}
      >
        Supprimer avec Google
      </Button>
    </fieldset>
  )
}
