import type {
  ReactableType,
  ReactionInput,
  ReactionKind,
  ReactionListView,
  Reactor,
} from '@aurore/shared'

import { and, eq } from 'drizzle-orm'

import type { DatabaseTransaction, DbOrTransaction } from '../../db'
import { profiles } from '../../db/schema/auth/users'
import { socialReactions } from '../../db/schema/social/reactions'
import {
  isPolymorphicTargetVisible,
  lockVisiblePolymorphicTarget,
} from '../../lib/polymorphic-target'
import { SocialReactionError } from './social-reaction-error'

// Missing or hidden parent both give uniform not-found, so neither can be told apart, mirroring
// posts.service's reject-on-hidden.
async function assertReactableVisible(
  db: DbOrTransaction,
  reactableType: ReactableType,
  reactableId: string
): Promise<void> {
  if (!(await isPolymorphicTargetVisible(db, reactableType, reactableId)))
    throw new SocialReactionError('reactable_not_found')
}

// Ensure-on: idempotent insert. Reacting the same kind again is a no-op, never a
// second row: the UNIQUE key makes a tally unrepresentable (ADR-0013).
export async function react(
  userId: string,
  input: ReactionInput,
  db: DatabaseTransaction
): Promise<ReactionListView> {
  if (!(await lockVisiblePolymorphicTarget(db, input.reactableType, input.reactableId))) {
    throw new SocialReactionError('reactable_not_found')
  }
  await db
    .insert(socialReactions)
    .values({
      reactableType: input.reactableType,
      reactableId: input.reactableId,
      userId,
      kind: input.kind,
    })
    // Explicit target = the idempotency key only; never silently swallow a future
    // unrelated constraint.
    .onConflictDoNothing({
      target: [
        socialReactions.reactableType,
        socialReactions.reactableId,
        socialReactions.userId,
        socialReactions.kind,
      ],
    })
  // No second check: lockVisiblePolymorphicTarget already ran above. Asserting again inside the
  // read would, if a moderator hides the parent inside the transaction, throw 404 and roll
  // back the just-committed insert, a false failure for a valid action.
  return buildReactionList(db, input.reactableType, input.reactableId, userId)
}

// Ensure-off: idempotent delete. The client picks the verb from viewerKinds, so
// "react the same kind again = remove" is a DELETE on an already-pressed button.
export async function unreact(
  userId: string,
  input: ReactionInput,
  db: DatabaseTransaction
): Promise<ReactionListView> {
  await assertReactableVisible(db, input.reactableType, input.reactableId)
  await db
    .delete(socialReactions)
    .where(
      and(
        eq(socialReactions.reactableType, input.reactableType),
        eq(socialReactions.reactableId, input.reactableId),
        eq(socialReactions.userId, userId),
        eq(socialReactions.kind, input.kind)
      )
    )
  return buildReactionList(db, input.reactableType, input.reactableId, userId)
}

// The signed read for the GET route: gate parent visibility (the same 404 on
// missing/hidden), then build the list. react/unreact skip the gate (they already
// asserted before the write) by calling buildReactionList directly.
export async function listReactions(
  db: DbOrTransaction,
  reactableType: ReactableType,
  reactableId: string,
  viewerUserId: string | null
): Promise<ReactionListView> {
  await assertReactableVisible(db, reactableType, reactableId)
  return buildReactionList(db, reactableType, reactableId, viewerUserId)
}

// Who reacted, grouped by kind, plus the viewer's own kinds for button pressed-
// state. Never a count (ADR-0013). innerJoin drops anonymized (null-author) rows;
// force-privated authors are excluded (mirror posts.service), and the RLS policy
// profiles_select_for_reaction makes reactors that are signed in but not public
// visible to app_runtime in production.
async function buildReactionList(
  db: DbOrTransaction,
  reactableType: ReactableType,
  reactableId: string,
  viewerUserId: string | null
): Promise<ReactionListView> {
  const rows = await db
    .select({
      kind: socialReactions.kind,
      userId: socialReactions.userId,
      username: profiles.username,
      profilePublic: profiles.profilePublic,
    })
    .from(socialReactions)
    .innerJoin(profiles, eq(profiles.userId, socialReactions.userId))
    .where(
      and(
        eq(socialReactions.reactableType, reactableType),
        eq(socialReactions.reactableId, reactableId),
        eq(profiles.forcedPrivateByAdmin, false)
      )
    )
    .orderBy(socialReactions.createdAt)

  // Explicit literal (not Object.fromEntries): the Record type forces every kind to
  // be present, so adding a kind is a compile error here until handled.
  const reactions: Record<ReactionKind, Reactor[]> = { merci: [], 'moi-aussi': [], soutien: [] }
  const viewerKinds: ReactionKind[] = []
  for (const row of rows) {
    if (!row.username) continue // unsigned (username never set), never shown
    reactions[row.kind].push({ username: row.username, profilePublic: row.profilePublic })
    if (viewerUserId && row.userId === viewerUserId) viewerKinds.push(row.kind)
  }
  return { reactableType, reactableId, reactions, viewerKinds }
}
