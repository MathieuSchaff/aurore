import { useNavigate } from '@tanstack/react-router'
import { LogOut, Pencil, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../../../../component/Button/Button'
import { useLogout } from '../../../../lib/queries/auth'
import { ChangePasswordForm } from './ChangePasswordForm'
import './AccountSettings.css'

interface AccountSettingsProps {
  onEditProfile: () => void
}

export const AccountSettings = ({ onEditProfile }: AccountSettingsProps) => {
  const navigate = useNavigate()
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate({ to: '/login' }),
      onError: () => navigate({ to: '/login' }),
    })
  }

  return (
    <div className="account-settings">
      <section className="account-section">
        <h3 className="account-section-title">Profil</h3>
        <p className="account-section-desc">
          Modifie tes informations publiques, ta bio et ton avatar.
        </p>

        <div className="account-actions">
          <Button
            type="button"
            variant="outline"
            className="account-action-btn"
            onClick={onEditProfile}
          >
            <Pencil size={18} />
            Modifier mes informations
          </Button>
        </div>
      </section>

      <section className="account-section">
        <h3 className="account-section-title">Sécurité</h3>
        <p className="account-section-desc">
          Gère l'accès à ton compte et tes données personnelles.
        </p>

        <div className="account-actions">
          {!showPasswordForm ? (
            <Button
              type="button"
              variant="outline"
              className="account-action-btn"
              onClick={() => setShowPasswordForm(true)}
            >
              <ShieldCheck size={18} />
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
      </section>

      <section className="account-section">
        <h3 className="account-section-title">Session</h3>
        <p className="account-section-desc">Déconnecte-toi de cet appareil.</p>

        <div className="account-actions">
          <Button
            type="button"
            variant="outline"
            className="account-action-btn logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Se déconnecter
          </Button>
        </div>
      </section>

      <section className="account-section danger-zone">
        <h3 className="account-section-title danger">Zone de danger</h3>
        <p className="account-section-desc">Actions irréversibles sur ton compte.</p>

        <div className="account-actions">
          <Button
            type="button"
            variant="outline"
            className="account-action-btn delete-btn"
            disabled
          >
            Supprimer mon compte
          </Button>
        </div>
      </section>
    </div>
  )
}
