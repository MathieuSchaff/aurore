import type { PrivacySettings } from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { Download, ExternalLink, LogOut, ShieldCheck, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '../../../../component/Button/Button'
import { FormMessage } from '../../../../component/Feedback/ui/FormMessage/FormMessage'
import { Toggle } from '../../../../component/Input/Toggle/Toggle'
import { SettingsSection } from '../../../../component/Layout/SettingsSection/SettingsSection'
import { useSession } from '../../../../lib/auth/session'
import { rateLimitMessage } from '../../../../lib/helpers/apiError'
import { useLogout } from '../../../../lib/queries/auth'
import {
  privacySettingsQueries,
  useDeleteUser,
  useDownloadDataExport,
  useUpdatePrivacySettings,
} from '../../../../lib/queries/profile'
import { ChangePasswordForm } from './ChangePasswordForm'
import { RoleRequestSection } from './RoleRequestSection'
import './AccountSettings.css'

type PrivacyKey =
  | 'profilePublic'
  | 'bioPublic'
  | 'avatarPublic'
  | 'linksPublic'
  | 'skinTypesPublic'
  | 'fitzpatrickPublic'
  | 'skinConcernsPublic'
  | 'discoverable'
  | 'aiConsent'

function profileFieldDisabled(
  profilePublic: boolean,
  pendingKey: PrivacyKey | undefined,
  field: PrivacyKey
) {
  if (!profilePublic) return true
  return pendingKey === field
}

function PrivacySettingsSection({
  privacy,
  isLoading,
  pendingKey,
  hasError,
  onToggle,
}: {
  privacy: PrivacySettings | undefined
  isLoading: boolean
  pendingKey: PrivacyKey | undefined
  hasError: boolean
  onToggle: (key: PrivacyKey, value: boolean) => void
}) {
  const hash = useLocation({ select: (location) => location.hash })
  const scrolledToToggle = useRef(false)
  useEffect(() => {
    if (scrolledToToggle.current || hash !== 'discoverable' || !privacy) return
    scrolledToToggle.current = true
    requestAnimationFrame(() => {
      document
        .getElementById('privacy-discoverable')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }, [hash, privacy])

  return (
    <SettingsSection
      title="Confidentialité"
      description="Contrôlez ce que les autres peuvent voir de vous."
    >
      {isLoading ? (
        <p className="privacy-loading">Chargement…</p>
      ) : privacy ? (
        <div className="privacy-toggles">
          <Toggle
            label="Profil public"
            hint="Si activé, votre nom d'utilisateur peut apparaître sur les pages publiques. Choisissez ensuite ce que vous souhaitez partager."
            checked={privacy.profilePublic}
            onChange={(checked) => onToggle('profilePublic', checked)}
            disabled={pendingKey === 'profilePublic'}
          />

          <div className="privacy-subgroup">
            <p className="privacy-subgroup-title">Informations à partager</p>
            <Toggle
              label="Bio"
              checked={privacy.bioPublic}
              onChange={(checked) => onToggle('bioPublic', checked)}
              disabled={profileFieldDisabled(privacy.profilePublic, pendingKey, 'bioPublic')}
            />
            <Toggle
              label="Avatar"
              checked={privacy.avatarPublic}
              onChange={(checked) => onToggle('avatarPublic', checked)}
              disabled={profileFieldDisabled(privacy.profilePublic, pendingKey, 'avatarPublic')}
            />
            <Toggle
              label="Liens"
              checked={privacy.linksPublic}
              onChange={(checked) => onToggle('linksPublic', checked)}
              disabled={profileFieldDisabled(privacy.profilePublic, pendingKey, 'linksPublic')}
            />
          </div>

          <div className="privacy-subgroup">
            <p className="privacy-subgroup-title">Profil de peau</p>
            <Toggle
              label="Types de peau"
              checked={privacy.skinTypesPublic}
              onChange={(checked) => onToggle('skinTypesPublic', checked)}
              disabled={profileFieldDisabled(privacy.profilePublic, pendingKey, 'skinTypesPublic')}
            />
            <Toggle
              label="Phototype"
              checked={privacy.fitzpatrickPublic}
              onChange={(checked) => onToggle('fitzpatrickPublic', checked)}
              disabled={profileFieldDisabled(
                privacy.profilePublic,
                pendingKey,
                'fitzpatrickPublic'
              )}
            />
            <Toggle
              label="Préoccupations"
              checked={privacy.skinConcernsPublic}
              onChange={(checked) => onToggle('skinConcernsPublic', checked)}
              disabled={profileFieldDisabled(
                privacy.profilePublic,
                pendingKey,
                'skinConcernsPublic'
              )}
            />
          </div>

          <div id="privacy-discoverable" className="privacy-subgroup">
            <p className="privacy-subgroup-title">Rencontres de peau</p>
            <Toggle
              label="Être trouvable par des peaux similaires"
              hint="Aurore peut vous proposer à des personnes dont la peau ressemble à la vôtre. La problématique par laquelle on vous trouve peut être déduite ; vos autres informations restent privées."
              checked={privacy.discoverable}
              onChange={(checked) => onToggle('discoverable', checked)}
              disabled={profileFieldDisabled(privacy.profilePublic, pendingKey, 'discoverable')}
            />
          </div>

          <div className="privacy-ai-section">
            <p className="privacy-section-desc">
              Autoriser Aurore à analyser des produits en fonction de votre profil avec Mistral AI —
              hébergé en France, vos données ne quittent pas l'Europe.{' '}
              <span className="privacy-badge">Fonctionnalité à venir</span>
            </p>
            <Toggle
              label="Activer l'analyse IA"
              hint="Peut être révoqué à tout moment. Aucune donnée envoyée sans ce consentement."
              checked={privacy.aiConsent}
              onChange={(checked) => onToggle('aiConsent', checked)}
              disabled={pendingKey === 'aiConsent'}
            />
          </div>

          <Link to="/privacy" className="privacy-policy-link">
            Lire la politique de confidentialité complète
            <ExternalLink size={14} aria-hidden="true" />
          </Link>

          {hasError && (
            <FormMessage variant="error">La mise à jour a échoué. Veuillez réessayer.</FormMessage>
          )}
        </div>
      ) : null}
    </SettingsSection>
  )
}

export const AccountSettings = () => {
  const navigate = useNavigate()
  const session = useSession()
  const hasViewer = session.status === 'authenticated'
  const isDemo = hasViewer && session.user.isDemo
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const logout = useLogout()
  const deleteUser = useDeleteUser()
  const downloadExport = useDownloadDataExport()

  // Logout clears the query cache while this tab is still mounted: without the guard
  // the observer rebuilds the query and refetches without a token (401 in the console)
  const { data: privacy, isLoading: privacyLoading } = useQuery({
    ...privacySettingsQueries.get(),
    enabled: hasViewer,
  })
  const updatePrivacy = useUpdatePrivacySettings()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate({ to: '/auth/login', search: { redirect: undefined } }),
      onError: () => navigate({ to: '/auth/login', search: { redirect: undefined } }),
    })
  }

  const handlePrivacyToggle = (key: PrivacyKey, value: boolean) => {
    updatePrivacy.mutate({ [key]: value })
  }

  // Disable only the toggle whose request is in flight, not the whole group. Optimistic updates
  // make the flip instant; this just blocks a double-fire on the same control until it settles.
  const pendingKey = updatePrivacy.isPending
    ? (Object.keys(updatePrivacy.variables ?? {})[0] as PrivacyKey | undefined)
    : undefined

  return (
    <div className="account-settings">
      <SettingsSection
        title="Sécurité"
        description="Gérez l'accès à votre compte et vos données personnelles."
      >
        <div className="account-actions">
          {!showPasswordForm ? (
            <Button
              type="button"
              variant="outline"
              className="account-action-btn"
              onClick={() => setShowPasswordForm(true)}
            >
              <ShieldCheck size={18} aria-hidden="true" />
              Changer le mot de passe
            </Button>
          ) : (
            <ChangePasswordForm
              onSuccess={() => {
                setTimeout(() => setShowPasswordForm(false), 2000)
              }}
              onCancel={() => setShowPasswordForm(false)}
            />
          )}
        </div>
      </SettingsSection>

      <PrivacySettingsSection
        privacy={privacy}
        isLoading={privacyLoading}
        pendingKey={pendingKey}
        hasError={updatePrivacy.isError}
        onToggle={handlePrivacyToggle}
      />

      <RoleRequestSection />

      {isDemo ? (
        // The export route refuses demo accounts (403): no button, so no "retry" that never works
        <SettingsSection
          title="Mes données"
          description="Indisponible en mode démo : un compte temporaire n'a aucune donnée à exporter."
        />
      ) : (
        <SettingsSection
          title="Mes données"
          description="Téléchargez une copie complète de vos données au format JSON (droit à la portabilité, RGPD article 20)."
        >
          <div className="account-actions">
            <Button
              type="button"
              variant="outline"
              className="account-action-btn"
              onClick={() => downloadExport.mutate()}
              disabled={downloadExport.isPending}
            >
              <Download size={18} aria-hidden="true" />
              {downloadExport.isPending ? 'Préparation…' : 'Télécharger mes données'}
            </Button>
            {downloadExport.isError && (
              <FormMessage variant="error">
                {rateLimitMessage(downloadExport.error) ??
                  'Le téléchargement a échoué. Veuillez réessayer.'}
              </FormMessage>
            )}
          </div>
        </SettingsSection>
      )}

      <SettingsSection title="Session" description="Déconnectez-vous de cet appareil.">
        <div className="account-actions">
          <Button
            type="button"
            variant="outline"
            className="account-action-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} aria-hidden="true" />
            Se déconnecter
          </Button>
        </div>
      </SettingsSection>

      {isDemo ? (
        <SettingsSection
          title="Compte temporaire"
          description="Vous explorez Aurore en mode démo. Vos données disparaîtront à la déconnexion — rien à supprimer."
        />
      ) : (
        <SettingsSection
          title="Zone de danger"
          description="Actions irréversibles sur votre compte."
          variant="danger"
        >
          <div className="account-actions">
            {!confirmDelete ? (
              <Button
                type="button"
                variant="outline"
                className="account-action-btn delete-btn"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={18} aria-hidden="true" />
                Supprimer mon compte
              </Button>
            ) : (
              <output className="delete-confirm">
                <p className="delete-confirm-text">
                  Cette action est irréversible. Toutes vos données seront supprimées.
                </p>
                <div className="delete-confirm-actions">
                  <Button
                    type="button"
                    variant="outline"
                    className="account-action-btn"
                    onClick={() => setConfirmDelete(false)}
                    disabled={deleteUser.isPending}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="account-action-btn delete-btn"
                    onClick={() =>
                      deleteUser.mutate(undefined, {
                        onSuccess: () =>
                          navigate({ to: '/auth/login', search: { redirect: undefined } }),
                      })
                    }
                    disabled={deleteUser.isPending}
                  >
                    <Trash2 size={18} aria-hidden="true" />
                    {deleteUser.isPending ? 'Suppression…' : 'Confirmer la suppression'}
                  </Button>
                </div>
              </output>
            )}
          </div>
        </SettingsSection>
      )}
    </div>
  )
}
