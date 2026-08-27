import {
  readCredentialBearerState,
  readCredentialExpirationState,
  useCredentialExpirationState,
} from './sessionState'

export function readBearerForTransport(): string | null {
  return readCredentialBearerState()
}

export function readCredentialExpiration(): number | null {
  return readCredentialExpirationState()
}

export function useCredentialExpiration(): number | null {
  return useCredentialExpirationState()
}
