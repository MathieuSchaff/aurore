import { type AuthInput, authSchema } from '@habit-tracker/shared'

import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import z from 'zod'

import { useLogin } from '../../../lib/queries/auth'

type FieldErrors = Partial<Record<keyof AuthInput | 'form', string>>

export const LoginPage = () => {
  const [errors, setErrors] = useState<FieldErrors>({})
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const login = useLogin()
  const queryClient = useQueryClient()

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

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

    login.mutate(result.data, {
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
    <div className="login">
      <div className="auth-page__header">
        <h1 className="auth-page__title">Connexion</h1>
        <p className="auth-page__subtitle">Content de vous revoir sur Aurore</p>
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
            <label htmlFor="login-email" className="auth-field__label">
              Email
            </label>
            <input
              id="login-email"
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
            <label htmlFor="login-password" className="auth-field__label">
              Mot de passe
            </label>
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="auth-field__input"
              placeholder="••••••••"
              required
              autoComplete="current-password"
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

        <button type="submit" className="auth-submit" disabled={login.isPending}>
          {login.isPending ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
