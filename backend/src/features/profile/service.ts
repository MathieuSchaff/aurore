import type {
  CriteriaWeights,
  IngredientPreference,
  PreferenceTargets,
  PrivacySettings,
  ProfilePublic,
  ProfileStats,
  ProfileUpdateInput,
  PublicProfileView,
  TagPreference,
  UpdatePrivacySettingsInput,
  UpdateUserPreferencesInput,
  UpsertIngredientPreferenceInput,
  UpsertTagPreferenceInput,
  UserDermoProfile,
  UserDermoProfileUpdateInput,
} from '@aurore/shared'

import { and, count, eq, inArray } from 'drizzle-orm'

import type { DatabaseTransaction, DbOrTransaction } from '../../db'
import { userPreferences } from '../../db/schema/auth/user-preferences'
import { ingredients } from '../../db/schema/ingredients/ingredients'
import { userIngredientPreferences } from '../../db/schema/ingredients/user-ingredient-preferences'
import { productTagTypes } from '../../db/schema/tags/tags'
import { userTagPreferences } from '../../db/schema/tags/user-tag-preferences'
import { userProducts } from '../../db/schema/user-products'
import {
  type Profile,
  profiles,
  type UserDermoProfileRow,
  userDermoProfiles,
} from '../../db/schema/users'
import { isUniqueViolation } from '../../lib/helpers'
import { normalizeInstant, nowISO } from '../../utils/dates'
import { ProfileError } from './profile-error'

const DEFAULT_CRITERIA_WEIGHTS: CriteriaWeights = {
  tolerance: 1,
  efficacy: 1,
  sensoriality: 1,
  stability: 1,
  mixability: 1,
  valueForMoney: 1,
}

function toProfilePublic(profile: Profile): ProfilePublic {
  return {
    userId: profile.userId,
    username: profile.username,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    links: profile.links,
    createdAt: normalizeInstant(profile.createdAt),
    updatedAt: normalizeInstant(profile.updatedAt),
  }
}

export async function getProfile(
  db: DatabaseTransaction,
  userId: string
): Promise<ProfilePublic | null> {
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)

  return profile ? toProfilePublic(profile) : null
}

// Explicit whitelist, never spread `data` straight into the UPDATE. RLS lets
// the owner write any column of their own profile row (tenant_isolation), so
// the API layer is the only thing between an attacker and the moderation
// columns (forcedPrivateByAdmin, forcedPrivateBy, forcedPrivateAt, …). profileUpdateSchema is
// .strict() today but a future loosen-up must not become a silent escalation.
export async function updateProfile(
  db: DatabaseTransaction,
  userId: string,
  data: ProfileUpdateInput
): Promise<ProfilePublic | null> {
  const updates: Partial<Pick<Profile, 'username' | 'bio' | 'avatarUrl' | 'links'>> = {}
  if (data.username !== undefined) updates.username = data.username
  if (data.bio !== undefined) updates.bio = data.bio
  if (data.avatarUrl !== undefined) updates.avatarUrl = data.avatarUrl
  if (data.links !== undefined) updates.links = data.links

  if (Object.keys(updates).length === 0) {
    const [current] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
    return current ? toProfilePublic(current) : null
  }

  let profile: Profile | undefined
  try {
    ;[profile] = await db
      .update(profiles)
      .set({ ...updates, updatedAt: nowISO() })
      .where(eq(profiles.userId, userId))
      .returning()
  } catch (e) {
    // Translate the username unique-violation to a domain error; rethrow so the
    // global handler maps it (409) and withRlsContext rolls back the aborted tx.
    if (isUniqueViolation(e)) throw new ProfileError('username_taken')
    throw e
  }
  return profile ? toProfilePublic(profile) : null
}

function toDermoProfile(row: UserDermoProfileRow): UserDermoProfile {
  return {
    userId: row.userId,
    skinTypes: row.skinTypes as UserDermoProfile['skinTypes'],
    fitzpatrickType: row.fitzpatrickType,
    skinConcerns: (row.skinConcerns ?? []) as UserDermoProfile['skinConcerns'],
    privateNotes: row.privateNotes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export async function getDermoProfile(
  db: DatabaseTransaction,
  userId: string
): Promise<UserDermoProfile | null> {
  const [row] = await db
    .select()
    .from(userDermoProfiles)
    .where(eq(userDermoProfiles.userId, userId))
    .limit(1)

  return row ? toDermoProfile(row) : null
}

export async function upsertDermoProfile(
  db: DatabaseTransaction,
  userId: string,
  data: UserDermoProfileUpdateInput
): Promise<UserDermoProfile> {
  const [row] = await db
    .insert(userDermoProfiles)
    .values({
      userId,
      skinTypes: data.skinTypes ?? null,
      fitzpatrickType: data.fitzpatrickType ?? null,
      skinConcerns: data.skinConcerns ?? [],
      privateNotes: data.privateNotes ?? null,
    })
    .onConflictDoUpdate({
      target: userDermoProfiles.userId,
      set: {
        ...(data.skinTypes !== undefined ? { skinTypes: data.skinTypes } : {}),
        ...(data.fitzpatrickType !== undefined ? { fitzpatrickType: data.fitzpatrickType } : {}),
        ...(data.skinConcerns !== undefined ? { skinConcerns: data.skinConcerns } : {}),
        ...(data.privateNotes !== undefined ? { privateNotes: data.privateNotes } : {}),
        updatedAt: nowISO(),
      },
    })
    .returning()

  return toDermoProfile(row)
}

export async function getUserPreferences(db: DatabaseTransaction, userId: string) {
  const [row] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1)

  if (!row) {
    return {
      criteriaWeights: DEFAULT_CRITERIA_WEIGHTS,
      updatedAt: nowISO(),
    }
  }

  return {
    criteriaWeights: row.criteriaWeights,
    updatedAt: row.updatedAt,
  }
}

export async function updateUserPreferences(
  db: DatabaseTransaction,
  userId: string,
  data: UpdateUserPreferencesInput
) {
  const [existing] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1)

  // Merge to preserve criteria not included in the partial update.
  const currentWeights = existing?.criteriaWeights ?? DEFAULT_CRITERIA_WEIGHTS
  const mergedWeights = data.criteriaWeights
    ? { ...currentWeights, ...data.criteriaWeights }
    : currentWeights

  const [row] = await db
    .insert(userPreferences)
    .values({
      userId,
      criteriaWeights: mergedWeights,
    })
    .onConflictDoUpdate({
      target: userPreferences.userId,
      set: {
        criteriaWeights: mergedWeights,
        updatedAt: nowISO(),
      },
    })
    .returning()

  return {
    criteriaWeights: row.criteriaWeights,
    updatedAt: row.updatedAt,
  }
}

export async function getProfileStats(
  db: DatabaseTransaction,
  userId: string
): Promise<ProfileStats> {
  const [productCount] = await db
    .select({ count: count() })
    .from(userProducts)
    .where(eq(userProducts.userId, userId))

  return {
    totalProducts: productCount?.count ?? 0,
  }
}

const PROFILE_FLAG_KEYS = ['profilePublic', 'bioPublic', 'avatarPublic', 'linksPublic'] as const
const DERMO_FLAG_KEYS = [
  'skinTypesPublic',
  'fitzpatrickPublic',
  'skinConcernsPublic',
  'discoverable',
] as const

export async function getPrivacySettings(
  db: DatabaseTransaction,
  userId: string
): Promise<PrivacySettings> {
  const [profile] = await db
    .select({
      profilePublic: profiles.profilePublic,
      bioPublic: profiles.bioPublic,
      avatarPublic: profiles.avatarPublic,
      linksPublic: profiles.linksPublic,
    })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1)

  const [dermo] = await db
    .select({
      skinTypesPublic: userDermoProfiles.skinTypesPublic,
      fitzpatrickPublic: userDermoProfiles.fitzpatrickPublic,
      skinConcernsPublic: userDermoProfiles.skinConcernsPublic,
      discoverable: userDermoProfiles.discoverable,
    })
    .from(userDermoProfiles)
    .where(eq(userDermoProfiles.userId, userId))
    .limit(1)

  const [prefs] = await db
    .select({ aiConsent: userPreferences.aiConsent })
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1)

  return {
    profilePublic: profile?.profilePublic ?? false,
    bioPublic: profile?.bioPublic ?? false,
    avatarPublic: profile?.avatarPublic ?? false,
    linksPublic: profile?.linksPublic ?? false,
    skinTypesPublic: dermo?.skinTypesPublic ?? false,
    fitzpatrickPublic: dermo?.fitzpatrickPublic ?? false,
    skinConcernsPublic: dermo?.skinConcernsPublic ?? false,
    discoverable: dermo?.discoverable ?? false,
    aiConsent: prefs?.aiConsent ?? false,
  }
}

export async function updatePrivacySettings(
  db: DatabaseTransaction,
  userId: string,
  data: UpdatePrivacySettingsInput
): Promise<PrivacySettings | null> {
  const profileUpdates: Record<string, boolean> = {}
  for (const key of PROFILE_FLAG_KEYS) {
    if (data[key] !== undefined) profileUpdates[key] = data[key] as boolean
  }

  if (Object.keys(profileUpdates).length > 0) {
    const [updated] = await db
      .update(profiles)
      .set({ ...profileUpdates, updatedAt: nowISO() })
      .where(eq(profiles.userId, userId))
      .returning({ userId: profiles.userId })

    if (!updated) return null
  }

  const dermoUpdates: Record<string, boolean> = {}
  for (const key of DERMO_FLAG_KEYS) {
    if (data[key] !== undefined) dermoUpdates[key] = data[key] as boolean
  }

  if (Object.keys(dermoUpdates).length > 0) {
    // Upsert: dermo row may not exist yet (user hasn't filled skin profile).
    // Store the visibility intent now; actual data fields stay null until the
    // user fills them. Projection in getPublicProfile already handles null.
    await db
      .insert(userDermoProfiles)
      .values({ userId, ...dermoUpdates })
      .onConflictDoUpdate({
        target: userDermoProfiles.userId,
        set: { ...dermoUpdates, updatedAt: nowISO() },
      })
  }

  if (data.aiConsent !== undefined) {
    const [existing] = await db
      .select({
        criteriaWeights: userPreferences.criteriaWeights,
      })
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1)

    await db
      .insert(userPreferences)
      .values({
        userId,
        criteriaWeights: existing?.criteriaWeights ?? DEFAULT_CRITERIA_WEIGHTS,
        aiConsent: data.aiConsent,
      })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: { aiConsent: data.aiConsent, updatedAt: nowISO() },
      })
  }

  return getPrivacySettings(db, userId)
}

// Projects a public profile view by username, masking each field whose
// `*_public` flag is false. The master gate is the explicit profilePublic +
// not-forced WHERE below, NOT RLS: the social `_for_*` policies widen
// app_runtime to rows that are not public but reacted/posted, so dropping it leaks them.
// Returns null when the username is unknown or the profile is not public.
export async function getPublicProfileByUsername(
  db: DbOrTransaction,
  username: string
): Promise<PublicProfileView | null> {
  const [row] = await db
    .select({
      username: profiles.username,
      bio: profiles.bio,
      bioPublic: profiles.bioPublic,
      avatarUrl: profiles.avatarUrl,
      avatarPublic: profiles.avatarPublic,
      links: profiles.links,
      linksPublic: profiles.linksPublic,
      skinTypes: userDermoProfiles.skinTypes,
      skinTypesPublic: userDermoProfiles.skinTypesPublic,
      fitzpatrickType: userDermoProfiles.fitzpatrickType,
      fitzpatrickPublic: userDermoProfiles.fitzpatrickPublic,
      skinConcerns: userDermoProfiles.skinConcerns,
      skinConcernsPublic: userDermoProfiles.skinConcernsPublic,
    })
    .from(profiles)
    .leftJoin(userDermoProfiles, eq(profiles.userId, userDermoProfiles.userId))
    .where(
      and(
        eq(profiles.username, username),
        eq(profiles.profilePublic, true),
        eq(profiles.forcedPrivateByAdmin, false)
      )
    )
    .limit(1)

  if (!row?.username) return null

  return {
    username: row.username,
    bio: row.bioPublic ? row.bio : null,
    avatarUrl: row.avatarPublic ? row.avatarUrl : null,
    links: row.linksPublic ? row.links : null,
    skinTypes: row.skinTypesPublic
      ? ((row.skinTypes ?? []) as PublicProfileView['skinTypes'])
      : null,
    fitzpatrickType: row.fitzpatrickPublic ? row.fitzpatrickType : null,
    skinConcerns: row.skinConcernsPublic
      ? ((row.skinConcerns ?? []) as PublicProfileView['skinConcerns'])
      : null,
  }
}

export async function listPreferenceTargets(
  db: DatabaseTransaction,
  userId: string
): Promise<PreferenceTargets> {
  // Sequential on purpose: see exportUserData on bun-sql pipelining mis-binds.
  const ingredientRows = await db
    .select({
      canonicalKey: userIngredientPreferences.canonicalKey,
      stance: userIngredientPreferences.stance,
      createdAt: userIngredientPreferences.createdAt,
    })
    .from(userIngredientPreferences)
    .where(eq(userIngredientPreferences.userId, userId))
    .orderBy(userIngredientPreferences.createdAt)

  // Separate lookup, not a JOIN: canonical_key is not unique on ingredients,
  // a join would duplicate preference rows. First name wins.
  const nameByKey = new Map<string, string>()
  if (ingredientRows.length > 0) {
    const nameRows = await db
      .select({ canonicalKey: ingredients.canonicalKey, name: ingredients.name })
      .from(ingredients)
      .where(
        inArray(
          ingredients.canonicalKey,
          ingredientRows.map((r) => r.canonicalKey)
        )
      )
    for (const row of nameRows) {
      if (row.canonicalKey !== null && !nameByKey.has(row.canonicalKey)) {
        nameByKey.set(row.canonicalKey, row.name)
      }
    }
  }

  const tagRows = await db
    .select({
      tagId: userTagPreferences.tagId,
      slug: productTagTypes.slug,
      label: productTagTypes.label,
      stance: userTagPreferences.stance,
      createdAt: userTagPreferences.createdAt,
    })
    .from(userTagPreferences)
    .innerJoin(productTagTypes, eq(productTagTypes.id, userTagPreferences.tagId))
    .where(eq(userTagPreferences.userId, userId))
    .orderBy(userTagPreferences.createdAt)

  return {
    ingredients: ingredientRows.map((r) => ({ ...r, name: nameByKey.get(r.canonicalKey) ?? null })),
    tags: tagRows,
  }
}

export async function upsertIngredientPreference(
  db: DatabaseTransaction,
  userId: string,
  data: UpsertIngredientPreferenceInput
): Promise<IngredientPreference | null> {
  // A preference must point at a substance the catalogue knows, otherwise a
  // typoed key becomes an orphan no screen can ever display or exclude on.
  const [known] = await db
    .select({ name: ingredients.name })
    .from(ingredients)
    .where(eq(ingredients.canonicalKey, data.canonicalKey))
    .limit(1)
  if (!known) return null

  const [row] = await db
    .insert(userIngredientPreferences)
    .values({ userId, canonicalKey: data.canonicalKey, stance: data.stance })
    .onConflictDoUpdate({
      target: [userIngredientPreferences.userId, userIngredientPreferences.canonicalKey],
      set: { stance: data.stance, updatedAt: nowISO() },
    })
    .returning()

  return {
    canonicalKey: row.canonicalKey,
    name: known.name,
    stance: row.stance,
    createdAt: row.createdAt,
  }
}

export async function deleteIngredientPreference(
  db: DatabaseTransaction,
  userId: string,
  canonicalKey: string
): Promise<void> {
  await db
    .delete(userIngredientPreferences)
    .where(
      and(
        eq(userIngredientPreferences.userId, userId),
        eq(userIngredientPreferences.canonicalKey, canonicalKey)
      )
    )
}

export async function upsertTagPreference(
  db: DatabaseTransaction,
  userId: string,
  data: UpsertTagPreferenceInput
): Promise<TagPreference | null> {
  const [tag] = await db
    .select({ slug: productTagTypes.slug, label: productTagTypes.label })
    .from(productTagTypes)
    .where(eq(productTagTypes.id, data.tagId))
    .limit(1)
  if (!tag) return null

  const [row] = await db
    .insert(userTagPreferences)
    .values({ userId, tagId: data.tagId, stance: data.stance })
    .onConflictDoUpdate({
      target: [userTagPreferences.userId, userTagPreferences.tagId],
      set: { stance: data.stance, updatedAt: nowISO() },
    })
    .returning()

  return {
    tagId: row.tagId,
    slug: tag.slug,
    label: tag.label,
    stance: row.stance,
    createdAt: row.createdAt,
  }
}

export async function deleteTagPreference(
  db: DatabaseTransaction,
  userId: string,
  tagId: string
): Promise<void> {
  await db
    .delete(userTagPreferences)
    .where(and(eq(userTagPreferences.userId, userId), eq(userTagPreferences.tagId, tagId)))
}
