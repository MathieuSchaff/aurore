import { GOLD_SET_FOCUS_TAGS, type GoldSetFocusTag } from './fixtures'

const FOCUS_TAG_SET: ReadonlySet<string> = new Set(GOLD_SET_FOCUS_TAGS)

export function parseGoldSetSampleTags(raw: string | undefined): GoldSetFocusTag[] {
  if (raw === undefined) return [...GOLD_SET_FOCUS_TAGS]

  const tags = [
    ...new Set(
      raw
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    ),
  ]
  if (tags.length === 0) throw new Error('No gold-set sample tags')

  const unknown = tags.find((tag) => !FOCUS_TAG_SET.has(tag))
  if (unknown) throw new Error(`Unknown gold-set sample tag: ${unknown}`)
  return tags as GoldSetFocusTag[]
}
