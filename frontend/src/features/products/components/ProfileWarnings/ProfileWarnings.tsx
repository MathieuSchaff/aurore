import { type ProductDetail, resolveAvoidSlugs } from '@aurore/shared'

import { FormMessage } from '@/component/Feedback/ui/FormMessage/FormMessage'
import { SKIN_CONCERN_LABELS, SKIN_TYPE_LABELS } from '@/constants/skin'
import { tagLabel } from '@/features/products/filters'

export function profileLabel(slug: string): string {
  return (
    SKIN_TYPE_LABELS[slug as keyof typeof SKIN_TYPE_LABELS] ??
    SKIN_CONCERN_LABELS[slug as keyof typeof SKIN_CONCERN_LABELS] ??
    tagLabel(slug)
  )
}

// Same bridge as listProducts: user concern vocab and product tag vocab drifted
// apart, so a raw comparison only lights the slugs spelled the same in both
// Shared by the catalogue page and the shelf sheet so the two cannot drift
export function deriveProfileWarnings(
  tags: ProductDetail['tags'],
  profileSlugs: ReadonlySet<string>
): ProductDetail['tags'] {
  const avoidSlugs = new Set(resolveAvoidSlugs([...profileSlugs]))
  return tags.filter((t) => t.relevance === 'avoid' && avoidSlugs.has(t.tagSlug))
}

// A note the reader weighs, never a verdict: the product keeps the status the
// user gave it
export function ProfileWarnings({ warnings }: { warnings: ProductDetail['tags'] }) {
  if (warnings.length === 0) return null
  return (
    <FormMessage variant="warning">
      <strong>Peut ne pas convenir à votre profil cutané.</strong>{' '}
      <span>
        Concerne :{' '}
        {warnings.map((warning, index) => (
          <span key={warning.tagSlug}>
            {index > 0 && ', '}
            {profileLabel(warning.tagSlug)}
          </span>
        ))}
        .
      </span>
    </FormMessage>
  )
}
