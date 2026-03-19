import type { ApiResponse, CommonErrorCode } from './api'

// ─── Public Types ────────────────────────────────────────

/**
 * Représentation publique d'un utilisateur.
 *
 * @remarks
 * Ce type est le pendant TS de {@link userPublicSchema} (Zod).
 * Utilisé quand on a besoin du type sans la validation runtime.
 */
export type UserPublic = {
  id: string
  email: string
  createdAt: Date | string
  emailVerified: boolean
}

// ─── Token Types ─────────────────────────────────────────

/** Paire de tokens JWT (access + refresh). */
export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

/**
 * Résultat complet d'une authentification réussie (côté service).
 *
 * @remarks
 * Contient les deux tokens + l'utilisateur.
 * Le service renvoie toujours cette forme — c'est le handler
 * qui décide quoi exposer (body vs cookie) selon la plateforme.
 */
export type AuthenticatedResult = AuthTokens & {
  user: UserPublic
}

/**
 * Résultat d'authentification exposé au navigateur.
 *
 * @remarks
 * Le `refreshToken` est transmis via cookie httpOnly,
 * il n'apparaît donc pas dans le body de la réponse.
 */
export type BrowserAuthResult = {
  user: UserPublic
  accessToken: string
}

/**
 * Résultat d'authentification exposé au mobile.
 *
 * @remarks
 * Le `refreshToken` est inclus dans le body pour stockage
 * dans le Secure Storage natif.
 */
export type MobileAuthResult = AuthenticatedResult

// ─── Error Codes ─────────────────────────────────────────

/**
 * Codes d'erreur spécifiques au domaine auth.
 *
 * @remarks
 * Étend {@link CommonErrorCode} avec les erreurs propres
 * à l'authentification et la gestion de session.
 */
export type AuthErrorCode =
  | CommonErrorCode
  | 'invalid_credentials'
  | 'email_exists'
  | 'invalid_token'
  | 'missing_refresh_token'
  | 'session_expired'
  | 'invalid_session'
  | 'email_not_verified'
  | 'token_expired'
  | 'too_many_requests'

// ─── Service Result Types ────────────────────────────────

/**
 * Résultat possible de l'opération signup.
 * @see {@link ApiResponse}
 */
export type SignupResult = ApiResponse<AuthenticatedResult, 'email_exists' | 'server_error'>

/**
 * Résultat possible de l'opération login.
 * @see {@link ApiResponse}
 */
export type LoginResult = ApiResponse<AuthenticatedResult, 'invalid_credentials' | 'email_not_verified' | 'server_error'>

/**
 * Résultat possible de l'opération refresh.
 * @see {@link ApiResponse}
 */
export type RefreshResult = ApiResponse<
  AuthenticatedResult,
  'invalid_token' | 'session_expired' | 'missing_refresh_token' | 'email_not_verified' | 'server_error'
>

/**
 * Résultat possible de l'opération logout.
 *
 * @remarks
 * Toujours succès côté client — les erreurs serveur
 * sont loggées mais non propagées.
 */
export type LogoutResult = ApiResponse<null>

// ─── JWT Payloads ────────────────────────────────────────

/**
 * Payload du JWT access token.
 *
 * @remarks
 * Durée de vie courte (ex: 15 min). Contient le `sub` (userId)
 * et un `jti` unique pour la révocation.
 */
export interface AccessTokenPayload {
  sub: string
  type: 'access'
  jti: string
  iat: number
  exp: number
}

/**
 * Payload du JWT refresh token.
 *
 * @remarks
 * Durée de vie longue (ex: 7-30 jours). Stocké en base
 * pour permettre la révocation et la rotation.
 */
export interface RefreshTokenPayload {
  sub: string
  type: 'refresh'
  jti: string
  iat: number
  exp: number
}

// ─── Database Types ──────────────────────────────────────

/** Arguments pour créer un refresh token en base de données. */
export interface CreateRefreshTokenArgs {
  userId: string
  jti: string
  expiresAt: Date
  ip?: string | null
  userAgent?: string | null
}
