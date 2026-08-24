import type { ApiData, api } from '../api'

export const CREDENTIAL_VALIDATION_FRESH_MS = 1000 * 60 * 5

export type CredentialValidation = ApiData<typeof api.auth.session.$get>

export function credentialValidationQueryKey(viewerId: string | null) {
  return ['auth', 'credential-validation', viewerId] as const
}
