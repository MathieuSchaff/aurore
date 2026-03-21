import { z } from 'zod'

// ─── Constants ───────────────────────────────────────────

/** Longueur maximale du username. */
export const USERNAME_MAX_LENGTH = 32

/** Longueur maximale de la bio. */
export const BIO_MAX_LENGTH = 500

// ─── Entity Schemas ──────────────────────────────────────

/**
 * Représentation publique d'un profil (safe pour le client).
 *
 * @remarks
 * Ne contient jamais de données sensibles.
 * Utilisé dans les réponses API et les schemas OpenAPI.
 *
 * @see {@link ProfilePublic} pour le type TS équivalent.
 */
export const profilePublicSchema = z.object({
  userId: z.uuid(),
  username: z.string().max(USERNAME_MAX_LENGTH).nullable().optional(),
  bio: z.string().max(BIO_MAX_LENGTH).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
})

// ─── Input Schemas ───────────────────────────────────────

/**
 * Schema de validation pour la mise à jour d'un profil.
 *
 * @remarks
 * Mode strict — rejette tout champ non déclaré.
 * Tous les champs sont optionnels (delta update).
 *
 * Règles de validation :
 * - **username** : 1–{@link USERNAME_MAX_LENGTH} caractères, optionnel
 * - **bio** : max {@link BIO_MAX_LENGTH} caractères, optionnel
 * - **avatarUrl** : URL valide, optionnel
 *
 * @example
 * ```ts
 * const input = profileUpdateSchema.parse({ username: 'alice' })
 * // input.username → 'alice'
 * ```
 */
export const profileUpdateSchema = z
  .object({
    username: z.string().min(1).max(USERNAME_MAX_LENGTH).optional(),
    bio: z.string().max(BIO_MAX_LENGTH).optional(),
    avatarUrl: z.url().optional(),
  })
  .strict()

// ─── Output Schemas ─────────────────────────────────────

/**
 * Statistiques d'utilisation d'un utilisateur.
 */
export const profileStatsSchema = z.object({
  totalHabits: z.number(),
  totalChecks: z.number(),
  bestStreak: z.number(),
  totalProducts: z.number(),
})

// ─── Inferred Types ──────────────────────────────────────

/** Input typé pour la mise à jour d'un profil, inféré depuis {@link profileUpdateSchema}. */
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>

/** Statistiques d'un profil, inférées depuis {@link profileStatsSchema}. */
export type ProfileStats = z.infer<typeof profileStatsSchema>
