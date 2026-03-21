import type { ApiResponse, CommonErrorCode } from './api'
import type { AuthErrorCode } from './auth'

// ─── Public Types ────────────────────────────────────────

/**
 * Représentation publique d'un profil utilisateur.
 *
 * @remarks
 * Ce type est le pendant TS de {@link profilePublicSchema} (Zod).
 * Ne contient aucune donnée sensible — utilisable côté client.
 * Relation 1:1 avec `users` via `userId`.
 */
export type ProfilePublic = {
  userId: string
  username?: string | null
  bio?: string | null
  avatarUrl?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

/**
 * Statistiques d'utilisation d'un utilisateur.
 */
export type ProfileStats = {
  totalHabits: number
  totalChecks: number
  bestStreak: number
  totalProducts: number
}

// ─── Error Codes ─────────────────────────────────────────

/**
 * Codes d'erreur spécifiques au domaine profil.
 *
 * @remarks
 * Étend {@link CommonErrorCode} avec les erreurs propres
 * à la gestion des profils utilisateur.
 */
export type ProfileErrorCode =
  | CommonErrorCode
  | 'profile_not_found'
  | 'invalid_profile_data'
  | 'profile_update_failed'

// ─── API Response Types ──────────────────────────────────

/**
 * Résultat possible de l'opération GET /api/profile.
 *
 * @remarks
 * Combine les erreurs auth (token invalide, session expirée)
 * et profil (profil introuvable) car la route requiert un JWT valide.
 *
 * @see {@link ApiResponse}
 */
export type MeResponse = ApiResponse<ProfilePublic, AuthErrorCode | ProfileErrorCode>

/**
 * Résultat possible de l'opération PATCH /api/profile.
 *
 * @see {@link ApiResponse}
 */
export type ProfileUpdateResponse = ApiResponse<ProfilePublic, AuthErrorCode | ProfileErrorCode>

/**
 * Résultat possible de l'opération GET /api/profile/stats.
 *
 * @see {@link ApiResponse}
 */
export type ProfileStatsResponse = ApiResponse<ProfileStats, AuthErrorCode | ProfileErrorCode>
