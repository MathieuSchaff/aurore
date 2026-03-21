import type { baseErrorMapping } from '../helpers/constants'

// ─── API Response Types ──────────────────────────────────

/**
 * Réponse success générique de l'API.
 *
 * @template T - Type des données retournées
 * @example
 * const response: ApiSuccess<UserPublic> = {
 *   success: true,
 *   data: { id: 'uuid', email: 'user@example.com' }
 * }
 */
export type ApiSuccess<T> = {
  success: true
  data: T
  message?: string
}

/**
 * Réponse erreur générique de l'API.
 *
 * @template E - Union des codes d'erreur possibles pour cet endpoint.
 * Utiliser un union type précis plutôt que `string` pour bénéficier
 * de l'exhaustivité TypeScript.
 * @example
 * const response: ApiError<'invalid_credentials' | 'server_error'> = {
 *   success: false,
 *   error: 'invalid_credentials'
 * }
 */
export type ApiError<E extends string = string> = {
  success: false
  error: E
  details?: unknown
}

/**
 * Union type représentant toute réponse possible d'un endpoint.
 *
 * @remarks
 * Ne pas accéder à `data` ou `error` directement sans narrowing —
 * toujours utiliser les type guards `isApiSuccess` / `isApiError`
 * ou une vérification sur `response.success`.
 *
 * @template T - Type des données en cas de succès
 * @template E - Union des codes d'erreur possibles
 */
export type ApiResponse<T, E extends string = string> = ApiSuccess<T> | ApiError<E>

export type CommonErrorCode = keyof typeof baseErrorMapping
