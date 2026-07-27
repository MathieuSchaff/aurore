import type { Database } from '../../db'
import {
  type ModerationActionDetailsByAction,
  type ModerationActionName,
  moderationActions,
} from '../../db/schema/monitoring/moderation-actions'
import { logger } from '../../lib/logger'

type ModerationAuditInput = {
  [Action in ModerationActionName]: {
    actorId: string
    targetUserId: string
    action: Action
    details: ModerationActionDetailsByAction[Action]
  }
}[ModerationActionName]

// Best-effort like logSecurityEvent, and for the same reason it takes the base pool
// rather than a request connection: swallowing a failed insert on the request tx would
// commit an aborted tx. Verified the hard way, a missing table here rolled back the ban
// DELETE that had just succeeded. A failure warns because the trail just lost an entry,
// which is the one thing this table exists to prevent.
export async function logModerationAction(
  basePool: Database,
  action: ModerationAuditInput
): Promise<void> {
  try {
    await basePool.insert(moderationActions).values(action)
  } catch (e) {
    logger.warn({ err: e, action: action.action }, 'Moderation audit write failed')
  }
}
