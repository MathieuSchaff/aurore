import { ExternalLink } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { privacySettingsQueries, useUpdatePrivacySettings } from '../../../../lib/queries/profile'
import './PrivacySettings.css'

export function PrivacySettings() {
  const { data, isLoading } = useQuery(privacySettingsQueries.get())
  const updateMutation = useUpdatePrivacySettings()

  if (isLoading || !data) return <div className="privacy-loading">Chargement...</div>

  const handleToggle = (key: 'profilePublic' | 'aiConsent', value: boolean) => {
    updateMutation.mutate({ [key]: value })
  }

  return (
    <div className="privacy-settings">
      <section className="privacy-section">
        <h3 className="privacy-section-title">Visibilité</h3>
        <p className="privacy-section-desc">Contrôlez ce que les autres peuvent voir de vous.</p>

        <label className="privacy-toggle">
          <div className="privacy-toggle__info">
            <span className="privacy-toggle__label">Profil public</span>
            <span className="privacy-toggle__hint">
              Votre nom et avatar visibles par les autres utilisateurs.
            </span>
          </div>
          <input
            type="checkbox"
            className="privacy-toggle__input sr-only"
            checked={data.profilePublic}
            onChange={(e) => handleToggle('profilePublic', e.target.checked)}
          />
          <span className="privacy-toggle__switch" aria-hidden="true" />
        </label>
      </section>

      <section className="privacy-section">
        <h3 className="privacy-section-title">Analyse IA</h3>
        <p className="privacy-section-desc">
          Autoriser Aurore à analyser votre routine avec Mistral AI — hébergé en France, vos données
          ne quittent pas l'Europe.{' '}
          <span className="privacy-badge">Fonctionnalité à venir</span>
        </p>

        <label className="privacy-toggle">
          <div className="privacy-toggle__info">
            <span className="privacy-toggle__label">Activer l'analyse IA</span>
            <span className="privacy-toggle__hint">
              Peut être révoqué à tout moment. Aucune donnée envoyée sans ce consentement.
            </span>
          </div>
          <input
            type="checkbox"
            className="privacy-toggle__input sr-only"
            checked={data.aiConsent}
            onChange={(e) => handleToggle('aiConsent', e.target.checked)}
          />
          <span className="privacy-toggle__switch" aria-hidden="true" />
        </label>
      </section>

      <section className="privacy-section privacy-section--link">
        <a href="/privacy" className="privacy-policy-link">
          Lire la politique de confidentialité complète
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </section>
    </div>
  )
}
