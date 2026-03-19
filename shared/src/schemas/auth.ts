import { z } from 'zod'

export const accessTokenPayloadSchema = z.object({
    sub: z.string(),
    type: z.literal('access'),
    jti: z.string(),
    iat: z.number(),
    exp: z.number(),
})

export const refreshTokenPayloadSchema = z.object({
    sub: z.string(),
    type: z.literal('refresh'),
    jti: z.string(),
    iat: z.number(),
    exp: z.number(),
})
// ─── Branded Types ───────────────────────────────────────

/**
 * Email validé et normalisé (trimmed + lowercase).
 *
 * @remarks
 * Branded type — empêche l'utilisation de strings non validées
 * là où un email est attendu.
 * @see {@link emailSchema} pour la validation runtime.
 */
export type Email = string & z.BRAND<'Email'>

/**
 * Mot de passe brut avant hachage.
 *
 * @remarks
 * Garanti conforme aux règles de complexité par {@link passwordSchema}.
 * Ne doit jamais être stocké tel quel — toujours hasher avant persistance.
 */
export type RawPassword = string & z.BRAND<'RawPassword'>

/**
 * Mot de passe haché (bcrypt/argon2).
 *
 * @remarks
 * Branded manuellement (pas via Zod) car le hachage se fait côté serveur,
 * pas via un schema de validation.
 * Ne doit jamais être exposé côté client.
 */
export type HashedPassword = string & { readonly __brand: 'HashedPassword' }

// ─── Field Schemas ────────────────────────────────────────

/**
 * Schema de validation d'un email.
 *
 * @remarks
 * Applique `trim()` + `toLowerCase()` avant validation via `z.email()`,
 * puis brand le résultat pour empêcher l'utilisation de strings non validées.
 *
 * @see https://zod.dev/api#pipes
 */
export const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    // .email("Format d'email invalide")
    .pipe(z.email("Format d'email invalide"))
    .brand<'Email'>()

/**
 * Schema de validation d'un mot de passe.
 *
 * @remarks
 * Règles de complexité :
 * - 8 à 128 caractères
 * - Au moins une minuscule, une majuscule, un chiffre, un caractère spécial
 */
export const passwordSchema = z
    .string()
    .min(8, 'Minimum 8 caractères')
    .max(128, 'Maximum 128 caractères')
    .regex(/[a-z]/, 'Au moins une minuscule')
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre')
    .regex(/[^a-zA-Z0-9]/, 'Caractère spécial requis')
    .brand<'RawPassword'>()

// ─── Auth Body Schemas ────────────────────────────────────

/**
 * Schema combiné email + password, utilisé pour login et signup.
 *
 * @example
 * ```ts
 * const input = authSchema.parse({ email: 'User@Mail.COM', password: 'S3cure!pwd' })
 * // input.email → 'user@mail.com' (Email branded)
 * ```
 */
export const authSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})

/** Alias sémantique — identique à {@link authSchema}. */
export const loginSchema = authSchema

/** Alias sémantique — identique à {@link authSchema}. */
export const signupSchema = authSchema

// ─── Entity Schemas ──────────────────────────────────────

/**
 * Représentation publique d'un utilisateur (safe pour le client).
 *
 * @remarks
 * Ne contient jamais le mot de passe ou données sensibles.
 * Utilisé dans les réponses auth et les schemas OpenAPI.
 */
export const userPublicSchema = z.object({
    id: z.string(),
    email: z.email(),
    createdAt: z.union([z.date(), z.string()]),
    emailVerified: z.boolean(),
})

// ─── Auth Result Schemas (OpenAPI) ───────────────────────

/**
 * Résultat d'authentification côté navigateur.
 *
 * @remarks
 * Le `refreshToken` n'est **pas** inclus dans le body — il est transmis
 * uniquement via un cookie httpOnly sécurisé.
 */
export const browserAuthResultSchema = z.object({
    user: userPublicSchema,
    accessToken: z.string(),
})

/**
 * Résultat d'authentification côté mobile.
 *
 * @remarks
 * Le `refreshToken` est inclus dans le body pour stockage
 * dans le Secure Storage natif (Keychain iOS / Keystore Android).
 */
export const mobileAuthResultSchema = z.object({
    user: userPublicSchema,
    accessToken: z.string(),
    refreshToken: z.string(),
})

/**
 * Résultat d'un refresh mobile.
 *
 * @remarks
 * Ne contient pas le `user` — juste les nouveaux tokens
 * après rotation du refresh token.
 */
export const mobileRefreshResultSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
})

/** Résultat du check de session (`GET /api/auth/session`). */
export const sessionResultSchema = z.object({
    authenticated: z.literal(true),
    userId: z.string(),
})

/**
 * Body attendu pour les endpoints mobile qui nécessitent un refresh token
 * (`POST /api/auth/mobile/refresh`, `POST /api/auth/mobile/logout`).
 */
export const refreshTokenBodySchema = z.object({
    refreshToken: z.string().optional(),
})

export const verifyEmailBodySchema = z.object({
    token: z.string().min(1),
})

// ─── Inferred Types ──────────────────────────────────────

/** Input typé pour login/signup, inféré depuis {@link authSchema}. */
export type AuthInput = z.infer<typeof authSchema>

// ─── Validation Error Types ──────────────────────────────

/** Erreurs de validation par champ pour les formulaires auth côté client. */
export type AuthFieldErrors = {
    email?: string[]
    password?: string[]
}
