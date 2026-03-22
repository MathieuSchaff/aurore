import type { ChangePasswordInput } from '@habit-tracker/shared'

import { Check, Eye, EyeOff, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../../../../component/Button/Button'
import { Input } from '../../../../component/Input/Input'
import { useChangePassword } from '../../../../lib/queries/auth'

type ChangePasswordFormProps = {
  onSuccess: () => void
  onCancel: () => void
}

export const ChangePasswordForm = ({ onSuccess, onCancel }: ChangePasswordFormProps) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)

  const changePassword = useChangePassword()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      // Basic validation handled by Zod on backend, but this is UX
      return
    }

    changePassword.mutate({ currentPassword, newPassword } as ChangePasswordInput, {
      onSuccess: () => {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        onSuccess()
      },
    })
  }

  const isMatching = newPassword === confirmPassword || confirmPassword === ''
  const canSubmit =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    newPassword === confirmPassword &&
    !changePassword.isPending

  return (
    <form onSubmit={handleSubmit} className="change-password-form">
      <div className="form-header">
        <h4 className="form-title">Changer le mot de passe</h4>
        <button
          type="button"
          onClick={() => setShowPasswords(!showPasswords)}
          className="show-passwords-btn"
        >
          {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="form-fields">
        <Input
          label="Mot de passe actuel"
          type={showPasswords ? 'text' : 'password'}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          disabled={changePassword.isPending}
        />

        <Input
          label="Nouveau mot de passe"
          type={showPasswords ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={changePassword.isPending}
          hint="Min. 8 caractères, 1 majuscule, 1 chiffre, 1 spécial"
        />

        <Input
          label="Confirmer le nouveau mot de passe"
          type={showPasswords ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={changePassword.isPending}
          error={!isMatching ? 'Les mots de passe ne correspondent pas' : undefined}
        />
      </div>

      {changePassword.isError && (
        <p className="form-error">
          {changePassword.error.message === 'invalid_credentials'
            ? 'Mot de passe actuel incorrect'
            : changePassword.error.message}
        </p>
      )}

      {changePassword.isSuccess && (
        <p className="form-success">Mot de passe mis à jour avec succès !</p>
      )}

      <div className="form-actions">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={changePassword.isPending}
        >
          <X size={14} />
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={changePassword.isPending}
          disabled={!canSubmit}
        >
          <Check size={14} />
          Confirmer
        </Button>
      </div>
    </form>
  )
}
