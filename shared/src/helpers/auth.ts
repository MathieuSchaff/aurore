import type { HttpStatus } from '../types/api'
import type { AuthErrorCode } from '../types/auth'
import { HTTP_STATUS } from './constants'

// POUR L'INSTANT je redéclare, car y'a un soucis dans les imports......
// TODO: gérer ce prob
// type HttpStatus2 = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]
/**
 * Mapping des codes d'erreur auth vers les status HTTP correspondants.
 *
 * @remarks
 * Utilisé avec {@link errorToStatus} pour résoudre le status HTTP
 * à partir d'un code d'erreur.
 */
export const authErrorMapping = {
  invalid_credentials: HTTP_STATUS.UNAUTHORIZED,
  email_exists: HTTP_STATUS.CONFLICT,
  invalid_token: HTTP_STATUS.UNAUTHORIZED,
  missing_refresh_token: HTTP_STATUS.BAD_REQUEST,
  session_expired: HTTP_STATUS.UNAUTHORIZED,
  invalid_session: HTTP_STATUS.UNAUTHORIZED,
  email_not_verified: HTTP_STATUS.FORBIDDEN,
  token_expired: HTTP_STATUS.BAD_REQUEST,
  too_many_requests: HTTP_STATUS.RATE_LIMIT_EXCEEDED,
} as const satisfies Partial<Record<AuthErrorCode, HttpStatus>>
