import { USER_CONCERN_TO_PRODUCT_TAGS } from '../products/user-concern-bridge'
import type { SkinConcern } from '../profile'

// People search is aware of concern buckets: searching "rosacée" must also find people who
// named the same condition "couperose" or "flushs". We expand the searched
// concern to every user concern that shares at least one clinical bucket, so the
// SQL array overlap filter matches the whole family
// This reads the similarity drift table without using avoidance rules
export function concernsSharingBucket(concern: SkinConcern): SkinConcern[] {
  const targetBuckets = new Set(USER_CONCERN_TO_PRODUCT_TAGS[concern] ?? [])
  if (targetBuckets.size === 0) return [concern]

  return (Object.keys(USER_CONCERN_TO_PRODUCT_TAGS) as SkinConcern[]).filter((candidate) =>
    USER_CONCERN_TO_PRODUCT_TAGS[candidate].some((bucket) => targetBuckets.has(bucket))
  )
}
