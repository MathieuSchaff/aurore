import type {
  AuthErrorCode,
  ChangePasswordInput,
  LoginErrorCode,
  ResetPasswordErrorCode,
  VerifyEmailErrorCode,
  UserPublic,
} from '@aurore/shared'

import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from '../../store/auth'
import { api } from '../api'
import { unwrapData } from '../helpers/apiError'

const LOGIN_HANDLED_ERROR_CODES = [
  'invalid_credentials',
  'email_not_verified',
] as const satisfies readonly LoginErrorCode[]
const VERIFY_EMAIL_HANDLED_ERROR_CODES = [
  'token_expired',
] as const satisfies readonly VerifyEmailErrorCode[]
const RESET_PASSWORD_HANDLED_ERROR_CODES = [
  'invalid_token',
  'token_expired',
] as const satisfies readonly ResetPasswordErrorCode[]
const CHANGE_PASSWORD_HANDLED_ERROR_CODES = [
  'invalid_credentials',
] as const satisfies readonly AuthErrorCode[]

export interface AuthSessionCache {
  authenticated: boolean
  userId?: string
  role?: UserPublic['role']
  user?: UserPublic
}

export const authQueries = {
  session: () =>
    queryOptions<AuthSessionCache>({
      queryKey: ['session'],
      queryFn: async () => {
        const res = await api.auth.session.$get()
        if (!res.ok) throw new Error('Not authenticated')
        const json = await res.json()
        return json.data
      },
      retry: false,
      staleTime: 1000 * 60 * 5,
    }),

  me: () =>
    queryOptions({
      queryKey: ['auth', 'me'],
      queryFn: async () => {
        const res = await api.profile.$get()
        if (!res.ok) throw new Error('Failed to fetch profile')
        const json = await res.json()
        return json.data
      },
      retry: false,
    }),

  health: () =>
    queryOptions({
      queryKey: ['health'],
      queryFn: async () => {
        const res = await api.health.$get()
        if (!res.ok) throw new Error('Health check failed')
        const json = await res.json()
        return json.data
      },
      retry: false,
    }),
}

export function useLogin() {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ['auth', 'login'],
    meta: { handledErrorCodes: LOGIN_HANDLED_ERROR_CODES },
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.auth.login.$post({ json: data })
      return unwrapData(res)
    },
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.accessToken, data.user)
      qc.setQueryData(['session'], { authenticated: true, userId: data.user.id })
    },
  })
}

export function useSignup() {
  return useMutation({
    mutationKey: ['auth', 'signup'],
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.auth.signup.$post({ json: data })
      // Neutral response (ADR 0009): { pending: true }, no session. The user
      // activates the account from the verification email.
      return unwrapData(res)
    },
  })
}

export function useLogout() {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ['auth', 'logout'],
    meta: { errorMessage: 'Déconnexion impossible. Réessayez.' },
    mutationFn: async () => {
      const res = await api.auth.logout.$post()
      return unwrapData(res)
    },
    onSuccess: () => {
      useAuthStore.getState().clearAuth()
      // Nuke cache to drop every user-scoped query without a per-feature allowlist.
      qc.clear()
    },
  })
}

export function useVerifyEmail() {
  return useMutation({
    mutationKey: ['auth', 'verify-email'],
    meta: { handledErrorCodes: VERIFY_EMAIL_HANDLED_ERROR_CODES },
    mutationFn: async (token: string) => {
      const res = await api.auth['verify-email'].$post({ json: { token } })
      return unwrapData(res)
    },
    onSuccess: () => {
      const { accessToken, user } = useAuthStore.getState()
      if (accessToken && user) {
        useAuthStore.getState().setAuth(accessToken, { ...user, emailVerified: true })
      }
    },
  })
}

export function useResendVerification() {
  return useMutation({
    mutationKey: ['auth', 'resend-verification'],
    mutationFn: async () => {
      const res = await api.auth['resend-verification'].$post()
      return unwrapData(res)
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationKey: ['auth', 'forgot-password'],
    mutationFn: async (data: { email: string }) => {
      const res = await api.auth['forgot-password'].$post({ json: data })
      // Neutral response (ADR 0010): { pending: true }, no session. A reset link is
      // sent only if the account exists.
      return unwrapData(res)
    },
  })
}

export function useResetPassword() {
  return useMutation({
    mutationKey: ['auth', 'reset-password'],
    meta: { handledErrorCodes: RESET_PASSWORD_HANDLED_ERROR_CODES },
    mutationFn: async (data: { token: string; password: string }) => {
      const res = await api.auth['reset-password'].$post({ json: data })
      return unwrapData(res)
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationKey: ['auth', 'change-password'],
    meta: { handledErrorCodes: CHANGE_PASSWORD_HANDLED_ERROR_CODES },
    mutationFn: async (data: ChangePasswordInput) => {
      const res = await api.auth['change-password'].$post({ json: data })
      return unwrapData(res)
    },
  })
}

export function useDemo() {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['auth', 'demo'],
    meta: { errorMessage: 'Connexion à la démo impossible. Réessayez.' },
    mutationFn: async () => {
      const res = await api.auth.demo.$post()
      return unwrapData(res)
    },
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(data.accessToken, data.user)
      qc.setQueryData(['session'], { authenticated: true, userId: data.user.id })
    },
  })
}
