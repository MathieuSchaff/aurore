import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'

import { Toggle } from '../../../../component/Input/Toggle/Toggle'
import { privacySettingsQueries, useUpdatePrivacySettings } from '../../../../lib/queries/profile'
import './PrivacySettings.css'

export function PrivacySettings() {
  const { data, isLoading, isError } = useQuery(privacySettingsQueries.get())
  const updateMutation = useUpdatePrivacySettings()

  if (isError)
    return (
      <p className="privacy-error" role="alert">
        Impossible de charger les réglages. Veuillez réessayer.
      </p>
    )
  if (isLoading || !data) return <div className="privacy-loading">Chargement...</div>

  const handleToggle = (key: 'profilePublic' | 'aiConsent', value: boolean) => {
    updateMutation.mutate({ [key]: value })
  }

  return (
    <div className="privacy-settings">
      <section className="privacy-section">
        <h3 className="privacy-section-title">Visibilité</h3>
        <p className="privacy-section-desc">Contrôlez ce que les autres peuvent voir de vous.</p>

        <Toggle
          label="Profil public"
          hint="Votre nom et avatar visibles par les autres utilisateurs."
          checked={data.profilePublic}
          onChange={(checked) => handleToggle('profilePublic', checked)}
          disabled={updateMutation.isPending}
        />
      </section>

      <section className="privacy-section">
        <h3 className="privacy-section-title">Analyse IA</h3>
        <p className="privacy-section-desc">
          Autoriser Aurore à analyser votre routine avec Mistral AI — hébergé en France, vos données
          ne quittent pas l'Europe. <span className="privacy-badge">Fonctionnalité à venir</span>
        </p>

        <Toggle
          label="Activer l'analyse IA"
          hint="Peut être révoqué à tout moment. Aucune donnée envoyée sans ce consentement."
          checked={data.aiConsent}
          onChange={(checked) => handleToggle('aiConsent', checked)}
          disabled={updateMutation.isPending}
        />
      </section>

      <section className="privacy-section privacy-section--link">
        <Link to="/privacy" className="privacy-policy-link">
          Lire la politique de confidentialité complète
          <ExternalLink size={14} aria-hidden="true" />
        </Link>
      </section>

      {updateMutation.isError && (
        <p className="privacy-error" role="alert">
          La mise à jour a échoué. Veuillez réessayer.
        </p>
      )}
    </div>
  )
}
