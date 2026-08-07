import {
  concernsSharingBucket,
  type SimilarityBand,
  type SkinConcern,
  type SkinSimilarityInput,
  similarityBand,
  skinSimilarityScore,
} from '@aurore/shared'

import { and, arrayOverlaps, eq, ne } from 'drizzle-orm'

import type { DatabaseTransaction } from '../../db'
import { profiles, userDermoProfiles } from '../../db/schema/auth/users'

export type SimilarProfile = { username: string; band: SimilarityBand }

// Shared core of both passive ranking and active concern search. Ranks the discoverable
// cohort by skin similarity, surfacing only the ordinal band, never the score. RLS gates
// cross-user reads, but the master gate (discoverable + profile_public + not force-privated)
// is also filtered explicitly, same as getPublicProfileByUsername. The viewer's own row
// passes tenant_isolation (self-sim = 1.0) and must be excluded explicitly.
async function rankDiscoverableCohort(
  db: DatabaseTransaction,
  viewerUserId: string,
  opts: { concerns?: SkinConcern[] } = {}
): Promise<SimilarProfile[]> {
  const [viewer] = await db
    .select({
      skinConcerns: userDermoProfiles.skinConcerns,
      skinTypes: userDermoProfiles.skinTypes,
      fitzpatrickType: userDermoProfiles.fitzpatrickType,
    })
    .from(userDermoProfiles)
    .where(eq(userDermoProfiles.userId, viewerUserId))
    .limit(1)

  // No skin profile, so there is nothing to rank against.
  if (!viewer) return []

  const viewerInput: SkinSimilarityInput = {
    skinConcerns: viewer.skinConcerns ?? [],
    skinTypes: viewer.skinTypes,
    fitzpatrickType: viewer.fitzpatrickType,
  }

  const filters = [
    eq(userDermoProfiles.discoverable, true),
    eq(profiles.profilePublic, true),
    eq(profiles.forcedPrivateByAdmin, false),
    ne(userDermoProfiles.userId, viewerUserId),
  ]
  if (opts.concerns) {
    filters.push(arrayOverlaps(userDermoProfiles.skinConcerns, opts.concerns))
  }

  const candidates = await db
    .select({
      username: profiles.username,
      skinConcerns: userDermoProfiles.skinConcerns,
      skinTypes: userDermoProfiles.skinTypes,
      fitzpatrickType: userDermoProfiles.fitzpatrickType,
    })
    .from(userDermoProfiles)
    .innerJoin(profiles, eq(profiles.userId, userDermoProfiles.userId))
    .where(and(...filters))

  return (
    candidates
      .flatMap((candidate) => {
        if (!candidate.username) return []
        const score = skinSimilarityScore(viewerInput, {
          skinConcerns: candidate.skinConcerns ?? [],
          skinTypes: candidate.skinTypes,
          fitzpatrickType: candidate.fitzpatrickType,
        })
        return [{ username: candidate.username, score }]
      })
      // Username tiebreak keeps equal-score peers in a stable, deterministic
      // order (otherwise heap order leaks into the response). Code-point compare,
      // not localeCompare, so the order never depends on the server locale.
      .sort((a, b) => b.score - a.score || (a.username < b.username ? -1 : 1))
      .map(({ username, score }) => ({ username, band: similarityBand(score) }))
      // éloigné never surfaces; a diverse cohort is mostly éloigné by design.
      .filter((profile) => profile.band !== 'eloigne')
  )
}

// Passive lens: everyone like the viewer, ranked by similarity.
export function rankSimilarProfiles(
  db: DatabaseTransaction,
  viewerUserId: string
): Promise<SimilarProfile[]> {
  return rankDiscoverableCohort(db, viewerUserId)
}

// Active lens: people who share the searched concern's clinical bucket,
// still ranked by similarity to the viewer.
export function searchProfilesByConcern(
  db: DatabaseTransaction,
  concern: SkinConcern,
  viewerUserId: string
): Promise<SimilarProfile[]> {
  return rankDiscoverableCohort(db, viewerUserId, { concerns: concernsSharingBucket(concern) })
}
