import type { ApiError, ApiResponse, ApiSuccess, CommonErrorCode } from '../types/api'
import {
  baseErrorMapping,
  type ContentfulHttpStatus,
  HTTP_STATUS,
  type HttpStatus,
} from './constants'
// ─── Response Factories ──────────────────────────────────

/**
 * Crée une réponse success typée.
 *
 * @remarks
 * Toujours utiliser ce helper plutôt que de construire l'objet manuellement
 * pour garantir la cohérence du format de réponse.
 * @example
 * return c.json(ok(user), HTTP_STATUS.CREATED)
 * return c.json(ok(null, 'Disconnected'), HTTP_STATUS.OK)
 */
export const ok = <T>(data: T, message?: string): ApiSuccess<T> => ({
  success: true,
  data,
  message,
})

/**
 * Crée une réponse erreur typée.
 *
 * @remarks
 * Toujours utiliser ce helper plutôt que de construire l'objet manuellement
 * pour garantir la cohérence du format de réponse.
 * @example
 * return c.json(err('invalid_credentials'), HTTP_STATUS.UNAUTHORIZED)
 * return c.json(err('invalid_input', zodError.flatten()), HTTP_STATUS.BAD_REQUEST)
 */
export const err = <E extends string>(error: E, details?: unknown): ApiError<E> => ({
  success: false,
  error,
  details,
})

/**
 * Convertit un code d'erreur en status HTTP.
 *
 * @remarks
 * Fusionne le mapping de base avec un mapping spécifique au domaine.
 * Si le code est absent des deux mappings, retourne 500 par défaut.
 * @example
 * // Dans un handler Hono :
 * const status = errorToStatus(error, authErrorMapping)
 * return c.json(err(error), status)
 */
export const errorToStatus = <E extends string>(
  error: E,
  customMapping: Record<Exclude<E, CommonErrorCode>, HttpStatus>
): ContentfulHttpStatus => {
  const mapping = { ...baseErrorMapping, ...customMapping }
  const status = mapping[error as keyof typeof mapping] ?? HTTP_STATUS.INTERNAL_SERVER_ERROR
  return status as ContentfulHttpStatus
}

// ─── Type Guards ─────────────────────────────────────────

/**
 * Type guard — narrowe `ApiResponse<T, E>` vers `ApiSuccess<T>`.
 * @example
 * if (isApiSuccess(response)) {
 *   console.log(response.data) // T
 * }
 */
export const isApiSuccess = <T, E extends string>(
  response: ApiResponse<T, E>
): response is ApiSuccess<T> => {
  return response.success === true
}

/**
 * Type guard — narrowe `ApiResponse<T, E>` vers `ApiError<E>`.
 * @example
 * if (isApiError(response)) {
 *   console.log(response.error) // E
 * }
 */
export const isApiError = <T, E extends string>(
  response: ApiResponse<T, E>
): response is ApiError<E> => {
  return response.success === false
}
