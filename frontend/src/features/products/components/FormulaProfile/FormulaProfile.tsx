import {
  getProductFilterDefinition,
  getProductTagLabel,
  isDisplayedProductTag,
} from '@aurore/shared'

import { Fragment } from 'react'

import { Badge } from '@/component/DataDisplay/Badge/Badge'
import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import type { ProductDetail } from '@/lib/queries/products'
import './FormulaProfile.css'

// Descriptive categories only: what is in the formula, when and where it is
// used, never suitability, concerns, or a verdict. Array order = display
// order: most formula-specific first, not META.order (filter-menu order)
const PROFILE_CATEGORIES = ['actif_class', 'skin_effect', 'routine_step_v2', 'skin_zone'] as const
const SKINCARE_FILTER_LABELS = new Map(
  getProductFilterDefinition('skincare').map(({ key, label }) => [key, label])
)

interface FormulaProfileProps {
  tags: ProductDetail['tags']
}

export function FormulaProfile({ tags }: FormulaProfileProps) {
  const groups = PROFILE_CATEGORIES.map((category) => ({
    category,
    label: SKINCARE_FILTER_LABELS.get(category) ?? category,
    tags: tags.filter(
      (t) =>
        t.tagCategory === category && t.relevance !== 'avoid' && isDisplayedProductTag(t.tagSlug)
    ),
  })).filter((g) => g.tags.length > 0)

  const sensitiveSignal = tags.find(
    (tag) => tag.tagSlug === 'peau-sensible' && tag.relevance !== 'avoid'
  )
  if (groups.length === 0 && !sensitiveSignal) return null

  return (
    <section className="product-section formula-profile">
      <SectionHeader title="Profil de la formule" as="h2" />
      <dl className="formula-profile__groups">
        {groups.map((g) => (
          <Fragment key={g.category}>
            <dt className="formula-profile__label">{g.label}</dt>
            <dd className="formula-profile__cell">
              <ul role="list" className="ui-wrap-list">
                {g.tags.map((t) => (
                  <li key={t.tagSlug}>
                    <Badge variant="chip">{t.tagName}</Badge>
                  </li>
                ))}
              </ul>
            </dd>
          </Fragment>
        ))}
      </dl>
      {sensitiveSignal && (
        <div>
          <Badge variant="chip">
            {getProductTagLabel('peau-sensible', sensitiveSignal.source)}
          </Badge>
          {sensitiveSignal.source !== 'manual' && (
            <p>Signal estimé depuis la formule. La tolérance varie selon les personnes.</p>
          )}
        </div>
      )}
    </section>
  )
}
