import { SKINCARE_PRODUCT_TAG_SLUGS, type SkinConcern } from '@aurore/shared'

// KP bridge: chips derived live on the product page, never stored as a product tag
// (storing "KP" would be a medical verdict; cf. the killed P=0.154 INCI gate). Niacinamide
// is read live from INCI since it has no own tag. 'avoid' relevance tags are excluded so
// a chip can't contradict the avoid notice.

const T = SKINCARE_PRODUCT_TAG_SLUGS
const KP_CONCERN: SkinConcern = 'keratose-pilaire'
const BUMPS_TAGS: readonly string[] = [T.UREA, T.AHA, T.BHA]
const RED_TAGS: readonly string[] = [T.APAISANT, T.ROUGEURS_VASCULAIRES]

export interface KpChipTag {
  tagSlug: string
  relevance: 'primary' | 'secondary' | 'avoid'
}

export interface KpChips {
  bumps: boolean
  red: boolean
}

export function deriveKpChips(args: {
  profileSlugs: ReadonlySet<string>
  tags: readonly KpChipTag[]
  inci: string | null
}): KpChips {
  if (!args.profileSlugs.has(KP_CONCERN)) return { bumps: false, red: false }

  const present = new Set(args.tags.filter((t) => t.relevance !== 'avoid').map((t) => t.tagSlug))
  const niacinamide = (args.inci ?? '').toLowerCase().includes('niacinamide')

  return {
    bumps: BUMPS_TAGS.some((s) => present.has(s)),
    red: niacinamide || RED_TAGS.some((s) => present.has(s)),
  }
}
