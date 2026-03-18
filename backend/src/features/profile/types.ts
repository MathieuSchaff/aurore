import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { profiles } from '../../db/schema/users'

// Re-exported from shared
export {
  type MeResponse,
  type ProfileErrorCode,
  type ProfilePublic,
  type ProfileUpdateResponse,
  profileErrorMapping,
} from '@habit-tracker/shared'

// Backend-only types (inferred from Drizzle schema)

/** Profil complet tel que retourné par la base de données. */
export type Profile = InferSelectModel<typeof profiles>

/** Données nécessaires pour insérer un nouveau profil. */
export type NewProfile = InferInsertModel<typeof profiles>

