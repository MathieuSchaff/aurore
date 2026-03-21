import type { ProfileErrorCode } from '../types/profile'
import type { HttpStatus } from './constants'
import { HTTP_STATUS } from './constants'

/**
 * Mapping des codes d'erreur profil vers les status HTTP correspondants.
 *
 * @remarks
 * Utilisé avec {@link errorToStatus} pour résoudre le status HTTP
 * à partir d'un code d'erreur profil.
 */
export const profileErrorMapping = {
  profile_not_found: HTTP_STATUS.NOT_FOUND,
  invalid_profile_data: HTTP_STATUS.BAD_REQUEST,
  profile_update_failed: HTTP_STATUS.CONFLICT,
} as const satisfies Partial<Record<ProfileErrorCode, HttpStatus>>
