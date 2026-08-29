import type {
  AuthErrorCode,
  ChangePasswordInput,
  LoginErrorCode,
  ResetPasswordErrorCode,
  VerifyEmailErrorCode,
} from '@aurore/shared'

import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '../api'
import {
  CREDENTIAL_VALIDATION_FRESH_MS,
  type CredentialValidation,
  credentialValidationQueryKey,
} from '../auth/credentialValidation'
import { endSession, installSession, readClientSession, updateSessionUser } from '../auth/session'
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

async function requestEmailVerification(token: string) {
  const res = await api.auth['verify-email'].$post({ json: { token } })
  return unwrapData(res)
}

const inflightEmailVerifications = new Map<string, ReturnType<typeof requestEmailVerification>>()

function verifyEmailOnce(token: string): ReturnType<typeof requestEmailVerification> {
  const existing = inflightEmailVerifications.get(token)
  if (existing) return existing

  // StrictMode can replay mount effects, but a one-use token must share its in-flight request
  const request = requestEmailVerification(token)
  inflightEmailVerifications.set(token, request)
  const clear = () => {
    if (inflightEmailVerifications.get(token) === request) {
      inflightEmailVerifications.delete(token)
    }
  }
  void request.then(clear, clear)
  return request
}

export const authQueries = {
  validation: (viewerId: string | null) =>
    queryOptions<CredentialValidation>({
      queryKey: credentialValidationQueryKey(viewerId),
      queryFn: async () => {
        const res = await api.auth.session.$get()
        if (!res.ok) throw new Error('Not authenticated')
        const json = await res.json()
        return json.data
      },
      retry: false,
      gcTime: CREDENTIAL_VALIDATION_FRESH_MS,
      staleTime: CREDENTIAL_VALIDATION_FRESH_MS,
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
      installSession(qc, data)
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
      endSession(qc, 'logout')
    },
  })
}

export function useVerifyEmail() {
  return useMutation({
    mutationKey: ['auth', 'verify-email'],
    meta: { handledErrorCodes: VERIFY_EMAIL_HANDLED_ERROR_CODES },
    mutationFn: verifyEmailOnce,
    onSuccess: () => {
      const session = readClientSession()
      if (session.status === 'authenticated') {
        updateSessionUser({ ...session.user, emailVerified: true })
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

export function useResendVerificationFromToken() {
  return useMutation({
    mutationKey: ['auth', 'resend-verification-token'],
    mutationFn: async (token: string) => {
      const res = await api.auth['resend-verification-token'].$post({ json: { token } })
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
      installSession(qc, data)
    },
  })
}
