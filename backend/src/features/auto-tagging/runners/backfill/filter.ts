import type { Candidate, ClassifyResult } from './classify'

export function filterBackfillPlan(
  result: ClassifyResult,
  filters: { tag: string | null; excludeTag: string | null }
): ClassifyResult {
  const keep = (candidate: Candidate): boolean =>
    (filters.tag === null || candidate.tagSlug === filters.tag) &&
    (filters.excludeTag === null || candidate.tagSlug !== filters.excludeTag)
  const toInsert = result.toInsert.filter(keep)
  const toUpsert = result.toUpsert.filter(keep)

  return {
    toInsert,
    toUpsert,
    skipped: result.skipped,
    primaryInserts: toInsert.filter((candidate) => candidate.relevance === 'primary').length,
    primaryUpserts: toUpsert.filter((candidate) => candidate.relevance === 'primary').length,
  }
}
