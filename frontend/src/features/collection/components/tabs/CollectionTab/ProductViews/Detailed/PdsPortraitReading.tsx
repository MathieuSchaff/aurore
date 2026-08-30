import { Sparkles } from 'lucide-react'
import { useMemo } from 'react'

import { FormulaReading } from '@/features/products/components/FormulaReading/FormulaReading'
import {
  deriveProfileWarnings,
  ProfileWarnings,
} from '@/features/products/components/ProfileWarnings/ProfileWarnings'
import { portraitSlugs } from '@/features/profile/portrait-slugs'
import type { ProductDetailPageData } from '@/lib/queries/products'

import './PdsFormulaSection.css'

interface PdsPortraitReadingProps {
  page: ProductDetailPageData
  viewerId: string | null
}

// Everything the portrait says about this formula, grouped: the same reading
// the catalogue page gives, on a product the user owns
export function PdsPortraitReading({ page, viewerId }: PdsPortraitReadingProps) {
  const { product, dermoProfile } = page
  const profileSlugs = useMemo(
    () => new Set<string>(viewerId ? portraitSlugs(dermoProfile) : []),
    [viewerId, dermoProfile]
  )
  const warnings = useMemo(
    () => deriveProfileWarnings(product.tags, profileSlugs),
    [product.tags, profileSlugs]
  )
  const fragranceNote = dermoProfile?.skinTypes?.includes('peau-sensible') && product.hasFragrance

  return (
    <>
      <ProfileWarnings warnings={warnings} />

      {product.inci && (
        <FormulaReading
          headingLevel="h3"
          assessment={page.assessment}
          viewerId={viewerId}
          profileSlugs={profileSlugs}
          linkedIngredients={product.ingredients}
          preferenceTargets={page.preferenceTargets}
        />
      )}

      {fragranceNote && (
        <div className="pds-note" role="note">
          <Sparkles size={14} className="pds-note-icon" aria-hidden="true" />
          <div>
            <strong>Composants parfumants</strong> — vous suivez souvent les parfums sur peau
            sensible.
          </div>
        </div>
      )}
    </>
  )
}
