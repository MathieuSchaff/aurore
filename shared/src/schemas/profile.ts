import { z } from 'zod'

// ─── Constants ───────────────────────────────────────────

/** Longueur maximale du username. */
export const USERNAME_MAX_LENGTH = 32

/** Longueur maximale de la bio. */
export const BIO_MAX_LENGTH = 500

export const SKIN_TYPES = ['dry', 'oily', 'combination', 'normal', 'sensitive'] as const
export type SkinType = (typeof SKIN_TYPES)[number]

export const SKIN_CONCERNS = [
  'acne',
  'blackheads',
  'enlarged_pores',
  'hyperpigmentation',
  'dark_spots',
  'uneven_skin_tone',
  'dullness',
  'dehydration',
  'fine_lines',
  'wrinkles',
  'loss_of_firmness',
  'dark_circles',
  'puffiness',
  'rosacea',
  'atopic_dermatitis',
  'perioral_dermatitis',
  'seborrheic_dermatitis',
  'eczema',
  'psoriasis',
  'acne_vulgaris',
  'acne_cystic',
  'keratosis_pilaris',
  'vitiligo',
  'melasma',
  'contact_dermatitis',
  'couperose',
] as const
export type SkinConcern = (typeof SKIN_CONCERNS)[number]

// ─── Link Schema ─────────────────────────────────────────

export const profileLinkSchema = z.object({
  label: z.string().min(1).max(50),
  url: z.url(),
})

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
  avatarUrl: z.url().nullable().optional(),
  links: profileLinkSchema.array().optional().default([]),
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
 * - **links** : max 5 liens, optionnel
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
    links: profileLinkSchema.array().max(5).optional(),
  })
  .strict()

// ─── Dermo Profile Schemas ───────────────────────────────

export const userDermoProfileSchema = z.object({
  userId: z.uuid(),
  skinTypes: z.array(z.enum(SKIN_TYPES)).max(3).nullable(),
  fitzpatrickType: z.number().int().min(1).max(6).nullable(),
  // no upper bound — user can select any combination of concerns from the list
  skinConcerns: z.array(z.enum(SKIN_CONCERNS)),
  privateNotes: z.string().max(2000).nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const userDermoProfileUpdateSchema = z
  .object({
    skinTypes: z.array(z.enum(SKIN_TYPES)).max(3).optional(),
    fitzpatrickType: z.number().int().min(1).max(6).nullable().optional(),
    skinConcerns: z.array(z.enum(SKIN_CONCERNS)).optional(),
    privateNotes: z.string().max(2000).nullable().optional(),
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

export type ProfileLink = z.infer<typeof profileLinkSchema>
export type UserDermoProfile = z.infer<typeof userDermoProfileSchema>
export type UserDermoProfileUpdateInput = z.infer<typeof userDermoProfileUpdateSchema>
