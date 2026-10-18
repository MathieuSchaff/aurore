import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { StickyNote } from 'lucide-react'
import { useMemo } from 'react'

import { Badge } from '@/component/DataDisplay/Badge/Badge'
import { IconBox } from '@/component/Layout/IconBox/IconBox'
import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import { FormulaReading } from '@/features/products/components/FormulaReading/FormulaReading'
import { ProductComposition } from '@/features/products/components/ProductComposition/ProductComposition'
import { ProductPostsSection } from '@/features/products/components/ProductPostsSection/ProductPostsSection'
import { ProductSources } from '@/features/products/components/ProductSources/ProductSources'
import {
  deriveProfileWarnings,
  ProfileWarnings,
  profileLabel,
} from '@/features/products/components/ProfileWarnings/ProfileWarnings'
import { PublicReviewsSection } from '@/features/products/components/PublicReviewsSection/PublicReviewsSection'
import { deriveKpChips } from '@/features/products/kp-chips'
import { portraitSlugs } from '@/features/profile/portrait-slugs'
import { viewerId as getSessionViewerId, useSession } from '@/lib/auth/session'
import { productQueries } from '@/lib/queries/products'
import './ProductInfoTab.css'

const route = getRouteApi('/products/$slug/')

function KpProfileBridge({ chips }: { chips: ReturnType<typeof deriveKpChips> }) {
  if (!chips.bumps && !chips.red) return null
  return (
    <div className="product-kp-bridge">
      <span className="product-kp-bridge__intro">
        Pour votre profil {profileLabel('keratose-pilaire').toLowerCase()}, peut aider :
      </span>
      {chips.bumps && <Badge variant="chip">texture</Badge>}
      {chips.red && <Badge variant="chip">rougeurs</Badge>}
    </div>
  )
}

function ProductNotes({ notes }: { notes: string | null }) {
  if (!notes) return null
  return (
    <aside className="product-section product-notes-block" aria-labelledby="product-notes-title">
      <IconBox className="product-notes-block__icon">
        <StickyNote size={14} />
      </IconBox>
      <div>
        <h3 id="product-notes-title" className="product-notes-block__title">
          Note de la fiche
        </h3>
        <p className="product-notes-block__body">{notes}</p>
      </div>
    </aside>
  )
}

export function ProductInfoTab() {
  const { slug } = route.useParams()
  const session = useSession()
  const viewerId = getSessionViewerId(session)
  const { data: detailPage } = useSuspenseQuery(productQueries.detailPage(slug, viewerId))
  const { product, dermoProfile, assessment, preferenceTargets } = detailPage
  const hasDeclaredInci = Boolean(product.inci?.trim())
  const profileSlugs = useMemo(
    () => new Set<string>(viewerId ? portraitSlugs(dermoProfile) : []),
    [viewerId, dermoProfile]
  )

  // FormulaReading and deriveKpChips expect the profile's original slugs
  const warnings = useMemo(
    () => deriveProfileWarnings(product.tags, profileSlugs),
    [product.tags, profileSlugs]
  )

  // These hints depend on the viewer's declared KP, so they are not product tags
  const kpChips = useMemo(
    () => deriveKpChips({ profileSlugs, tags: product.tags, inci: product.inci }),
    [profileSlugs, product.tags, product.inci]
  )

  return (
    <>
      <ProfileWarnings warnings={warnings} />

      <KpProfileBridge chips={kpChips} />

      {hasDeclaredInci && (
        <FormulaReading
          className="product-section product-formula-reading"
          title="Comprendre la formule"
          foldRegulatory
          assessment={assessment}
          viewerId={viewerId}
          profileSlugs={profileSlugs}
          linkedIngredients={product.ingredients ?? []}
          preferenceTargets={preferenceTargets}
        />
      )}

      {(!hasDeclaredInci || !assessment) && (
        <section className="product-section">
          <SectionHeader title="Comprendre la formule" />
          <p className="product-section__intro">
            {hasDeclaredInci
              ? 'La lecture détaillée de cette formule n’est pas disponible pour le moment.'
              : 'La liste INCI n’est pas encore renseignée sur cette fiche.'}
          </p>
        </section>
      )}

      <ProductNotes notes={product.notes} />

      <ProductComposition
        ingredients={product.ingredients}
        inci={product.inci}
        inciCount={product.inciCount}
      />

      <ProductSources product={product} assessment={assessment} />

      <section
        className="product-section product-community"
        aria-labelledby="product-community-title"
      >
        <div className="product-community__heading">
          <h2 id="product-community-title">Retours et discussions</h2>
          <Link
            to="/products/$slug/discussions"
            params={{ slug }}
            replace
            className="product-community__link"
          >
            Voir les discussions
          </Link>
        </div>
        <div className="product-community__sections">
          <PublicReviewsSection slug={slug} messageVariant="plain" />
          <ProductPostsSection slug={slug} />
        </div>
      </section>
    </>
  )
}
