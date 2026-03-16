import { type AuthInput, authSchema } from '@habit-tracker/shared'

import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Check, Eye, EyeOff, Lock, Mail, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import z from 'zod'

import { useSignup } from '../../../lib/queries/auth'

type FieldErrors = Partial<Record<keyof AuthInput | 'confirmPassword' | 'form', string>>

const PASSWORD_RULES = [
  { key: 'length', label: '8 caractères minimum', test: (v: string) => v.length >= 8 },
  { key: 'number', label: 'Un chiffre (0-9) ou symbole', test: (v: string) => /[\d\W]/.test(v) },
  {
    key: 'case',
    label: 'Minuscule (a-z) et majuscule (A-Z)',
    test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v),
  },
] as const

export const SignupPage = () => {
  const [errors, setErrors] = useState<FieldErrors>({})
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [touched, setTouched] = useState(false)

  const navigate = useNavigate()
  const signup = useSignup()
  const queryClient = useQueryClient()

  const passwordChecks = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, valid: rule.test(password) })),
    [password]
  )

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Check confirm password match
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Les mots de passe ne correspondent pas' })
      return
    }

    const formData = Object.fromEntries(new FormData(e.currentTarget))
    const result = authSchema.safeParse(formData)

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error)
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      })
      return
    }
    setErrors({})
    signup.mutate(result.data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['session'] })
        navigate({ to: '/dashboard' })
      },
      onError: (error) => {
        setErrors({ form: error.message })
      },
    })
  }

  return (
    <>
      <div className="auth-page__header">
        <h1 className="auth-page__title">Créer un compte</h1>
        <p className="auth-page__subtitle">Commencez à suivre vos habitudes</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <p className="auth-error-banner" role="alert">
            {errors.form}
          </p>
        )}

        <div className={`auth-field ${errors.email ? 'auth-field--error' : ''}`}>
          <Mail size={18} className="auth-field__icon" aria-hidden="true" />
          <div className="auth-field__body">
            <label htmlFor="signup-email" className="auth-field__label">
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              className="auth-field__input"
              placeholder="nom@exemple.com"
              required
              autoComplete="email"
            />
          </div>
        </div>
        {errors.email && <p className="auth-field__error">{errors.email}</p>}

        <div className={`auth-field ${errors.password ? 'auth-field--error' : ''}`}>
          <Lock size={18} className="auth-field__icon" aria-hidden="true" />
          <div className="auth-field__body">
            <label htmlFor="signup-password" className="auth-field__label">
              Mot de passe
            </label>
            <input
              id="signup-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="auth-field__input"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              value={password}
              onFocus={() => setTouched(true)}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="auth-field__toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="auth-field__error">{errors.password}</p>}

        {touched && (
          <ul className="signup__rules" aria-label="Règles du mot de passe">
            {passwordChecks.map(({ key, label, valid }) => (
              <li key={key} className={`signup__rule ${valid ? 'signup__rule--valid' : ''}`}>
                {valid ? (
                  <Check size={14} className="signup__rule-icon" />
                ) : (
                  <X size={14} className="signup__rule-icon" />
                )}
                {label}
              </li>
            ))}
          </ul>
        )}

        <div className={`auth-field ${errors.confirmPassword ? 'auth-field--error' : ''}`}>
          <Lock size={18} className="auth-field__icon" aria-hidden="true" />
          <div className="auth-field__body">
            <label htmlFor="signup-confirm" className="auth-field__label">
              Confirmer le mot de passe
            </label>
            <input
              id="signup-confirm"
              type={showConfirm ? 'text' : 'password'}
              className="auth-field__input"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="auth-field__toggle"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? 'Masquer la confirmation' : 'Afficher la confirmation'}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="auth-field__error">{errors.confirmPassword}</p>}

        {confirmPassword.length > 0 && (
          <div
            className={`signup__rule ${password === confirmPassword ? 'signup__rule--valid' : ''}`}
          >
            {password === confirmPassword ? (
              <Check size={14} className="signup__rule-icon" />
            ) : (
              <X size={14} className="signup__rule-icon" />
            )}
            Les mots de passe correspondent
          </div>
        )}

        <button type="submit" className="auth-submit" disabled={signup.isPending}>
          {signup.isPending ? 'Création...' : 'Créer mon compte'}
        </button>
      </form>
    </>
  )
}
