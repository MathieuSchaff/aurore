import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'

import { FormMessage } from '../../../../component/Feedback/FormMessage/FormMessage'
import { Toggle } from '../../../../component/Input/Toggle/Toggle'
import { SettingsSection } from '../../../../component/Layout/SettingsSection/SettingsSection'
import { privacySettingsQueries, useUpdatePrivacySettings } from '../../../../lib/queries/profile'
import './PrivacySettings.css'

export function PrivacySettings() {
  const { data, isLoading, isError } = useQuery(privacySettingsQueries.get())
  const updateMutation = useUpdatePrivacySettings()

  if (isError)
    return (
      <FormMessage variant="error">
        Impossible de charger les réglages. Veuillez réessayer.
      </FormMessage>
    )
  if (isLoading || !data) return <output className="privacy-loading">Chargement...</output>

  const handleToggle = (key: 'profilePublic' | 'aiConsent', value: boolean) => {
    updateMutation.mutate({ [key]: value })
  }

  return (
    <div className="privacy-settings">
      <SettingsSection
        title="Visibilité"
        description="Contrôlez ce que les autres peuvent voir de vous."
      >
        <Toggle
          label="Profil public"
          hint="Votre nom et avatar visibles par les autres utilisateurs."
          checked={data.profilePublic}
          onChange={(checked) => handleToggle('profilePublic', checked)}
          disabled={updateMutation.isPending}
        />
      </SettingsSection>

      <SettingsSection title="Analyse IA">
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
      </SettingsSection>

      <SettingsSection compact>
        <Link to="/privacy" className="privacy-policy-link">
          Lire la politique de confidentialité complète
          <ExternalLink size={14} aria-hidden="true" />
        </Link>
      </SettingsSection>

      {updateMutation.isError && (
        <FormMessage variant="error">La mise à jour a échoué. Veuillez réessayer.</FormMessage>
      )}
    </div>
  )
}
