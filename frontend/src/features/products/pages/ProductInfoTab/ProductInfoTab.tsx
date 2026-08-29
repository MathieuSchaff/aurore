import { type ProductDetail, resolveAvoidSlugs } from '@aurore/shared'

import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { Check, ChevronDown, Copy, FlaskConical, StickyNote } from 'lucide-react'
import { lazy, Suspense, useId, useMemo } from 'react'

// Defer ~50KB gzip; description is below the fold on first paint.
const Markdown = lazy(() => import('react-markdown'))

import { Button } from '@/component/Button/Button'
import { Badge } from '@/component/DataDisplay/Badge/Badge'
import { ShowMoreButton } from '@/component/DataDisplay/ShowMoreButton/ShowMoreButton'
import { FormMessage } from '@/component/Feedback/ui/FormMessage/FormMessage'
import { IconBox } from '@/component/Layout/IconBox/IconBox'
import { RichText } from '@/component/Typography/RichText/RichText'
import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import { SKIN_CONCERN_LABELS, SKIN_TYPE_LABELS } from '@/constants/skin'
import { FormulaConcentrations } from '@/features/products/components/FormulaConcentrations/FormulaConcentrations'
import { FormulaProfile } from '@/features/products/components/FormulaProfile/FormulaProfile'
import { FormulaReading } from '@/features/products/components/FormulaReading/FormulaReading'
import { ProductSummary } from '@/features/products/components/ProductSummary/ProductSummary'
import { tagLabel } from '@/features/products/filters'
import { deriveKpChips } from '@/features/products/kp-chips'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useExpandableList } from '@/hooks/useExpandableList'
import { viewerId as getSessionViewerId, useSession } from '@/lib/auth/session'
import { productQueries } from '@/lib/queries/products'
import './ProductInfoTab.css'

const route = getRouteApi('/products/$slug/')

function formatConcentration(
  value: string | null,
  unit: string | null,
  per: string | null
): string | null {
  if (!value) return null
  let result = value
  if (unit) result += ` ${unit}`
  if (per) result += ` / ${per}`
  return result
}

function profileLabel(slug: string): string {
  return (
    SKIN_TYPE_LABELS[slug as keyof typeof SKIN_TYPE_LABELS] ??
    SKIN_CONCERN_LABELS[slug as keyof typeof SKIN_CONCERN_LABELS] ??
    tagLabel(slug)
  )
}

function ProfileWarnings({ warnings }: { warnings: ProductDetail['tags'] }) {
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
          Notes
        </h3>
        <p className="product-notes-block__body">{notes}</p>
      </div>
    </aside>
  )
}

function IngredientsSection({
  ingredients,
  inci,
  productKey,
}: {
  ingredients: ProductDetail['ingredients']
  inci: string | null
  productKey: string
}) {
  const { copied, copy } = useCopyToClipboard()
  const ingredientsListId = useId()
  const {
    visible,
    hiddenCount,
    isExpanded,
    toggle: toggleExpanded,
  } = useExpandableList(ingredients ?? [], undefined, productKey)

  if (!ingredients?.length) return null

  const handleCopy = () => {
    const ingredientsText = ingredients
      .map((ingredient) => {
        const concentration = formatConcentration(
          ingredient.concentrationValue,
          ingredient.concentrationUnit,
          ingredient.concentrationPer
        )
        return concentration
          ? `${ingredient.ingredientName} (${concentration})`
          : ingredient.ingredientName
      })
      .join(', ')
    void copy(
      [ingredientsText, inci ? `Full ingredient list: ${inci}` : ''].filter(Boolean).join('\n\n')
    )
  }

  return (
    <div className="product-section">
      <SectionHeader title="Ingrédients" count={ingredients.length}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          aria-label="Copier la liste des ingrédients"
          className="ingredient-copy"
        >
          {copied ? (
            <>
              <Check size={14} aria-hidden="true" />
              <span>Copié</span>
            </>
          ) : (
            <>
              <Copy size={14} aria-hidden="true" />
              <span>Copier</span>
            </>
          )}
        </Button>
      </SectionHeader>
      <ul role="list" id={ingredientsListId} className="ingredient-list">
        {visible.map((ingredient) => {
          const concentration = formatConcentration(
            ingredient.concentrationValue,
            ingredient.concentrationUnit,
            ingredient.concentrationPer
          )
          const category = ingredient.ingredientCategory?.toLowerCase() ?? null
          return (
            <li
              key={ingredient.ingredientSlug}
              className="ingredient-item"
              data-cat={category ?? undefined}
            >
              <IconBox className="ingredient-item__icon">
                <FlaskConical size={14} />
              </IconBox>
              <div className="ingredient-item__body">
                <Link
                  to="/ingredients/$slug"
                  params={{ slug: ingredient.ingredientSlug }}
                  className="ingredient-item__name"
                >
                  {ingredient.ingredientName}
                </Link>
                <div className="ingredient-item__meta">
                  {ingredient.ingredientCategory && (
                    <span className="ingredient-item__category">
                      {ingredient.ingredientCategory}
                    </span>
                  )}
                  {ingredient.notes && (
                    <>
                      <span className="ingredient-item__sep" aria-hidden="true">
                        ·
                      </span>
                      <span className="ingredient-item__notes">{ingredient.notes}</span>
                    </>
                  )}
                </div>
              </div>
              {concentration && (
                <span className="ingredient-item__concentration">{concentration}</span>
              )}
            </li>
          )
        })}
      </ul>
      <ShowMoreButton
        className="ingredient-list__more"
        hiddenCount={hiddenCount}
        isExpanded={isExpanded}
        onToggle={toggleExpanded}
        controlsId={ingredientsListId}
      />
    </div>
  )
}

export function ProductInfoTab() {
  const { slug } = route.useParams()
  const session = useSession()
  const viewerId = getSessionViewerId(session)
  const { data: detailPage } = useSuspenseQuery(productQueries.detailPage(slug, viewerId))
  const { product, dermoProfile, assessment, preferenceTargets } = detailPage
  const profileSlugs = useMemo(() => {
    if (!viewerId || !dermoProfile) return new Set<string>()
    return new Set<string>([...(dermoProfile.skinTypes ?? []), ...dermoProfile.skinConcerns])
  }, [viewerId, dermoProfile])

  // Same bridge as listProducts: user concern vocab and product tag vocab drifted
  // apart, so a raw comparison only lights the slugs spelled the same in both.
  // `profileSlugs` stays raw: deriveKpChips and FormulaReading key on user vocab.
  const avoidSlugs = useMemo(() => new Set(resolveAvoidSlugs([...profileSlugs])), [profileSlugs])

  const warnings = useMemo(
    () => product.tags.filter((t) => t.relevance === 'avoid' && avoidSlugs.has(t.tagSlug)),
    [avoidSlugs, product.tags]
  )

  // KP bridge, the positive mirror of `warnings`: surfaced live for a declared-KP
  // profile only, derived from neutral signals, never stored as a product tag.
  const kpChips = useMemo(
    () => deriveKpChips({ profileSlugs, tags: product.tags, inci: product.inci }),
    [profileSlugs, product.tags, product.inci]
  )

  return (
    <>
      <ProfileWarnings warnings={warnings} />

      <KpProfileBridge chips={kpChips} />

      <ProductSummary
        kind={product.kind}
        categories={product.ingredients?.map((i) => i.ingredientCategory) ?? []}
      />

      <FormulaProfile tags={product.tags} />

      {product.inci && (
        <FormulaReading
          assessment={assessment}
          viewerId={viewerId}
          profileSlugs={profileSlugs}
          linkedIngredients={product.ingredients ?? []}
          preferenceTargets={preferenceTargets}
        />
      )}

      <ProductNotes notes={product.notes} />

      <IngredientsSection ingredients={product.ingredients} inci={product.inci} productKey={slug} />

      {product.inci && <FormulaConcentrations assessment={assessment} />}

      {/* Raw technical detail stays behind a closed disclosure: group-before-detail,
          the INCI wall is available on demand, never part of the first read. */}
      {product.inci && (
        <details className="product-section product-inci">
          <summary className="product-inci__summary">
            <span>Composition INCI complète</span>
            <ChevronDown size={14} className="product-inci__chevron" aria-hidden="true" />
          </summary>
          <p className="product-inci__body">{product.inci}</p>
        </details>
      )}

      {product.description && (
        <details className="product-section product-inci product-brand-copy">
          <summary className="product-inci__summary">
            <span>Texte de la marque</span>
            <ChevronDown size={14} className="product-inci__chevron" aria-hidden="true" />
          </summary>
          {/* Manufacturer copy: commercial voice, not vetted by Aurore. Keep it boxed off. */}
          <div className="product-brand-copy__body">
            <p className="product-brand-copy__note">Voix commerciale, non vérifiée par Aurore.</p>
            <RichText className="product-description">
              <Suspense fallback={<p>{product.description}</p>}>
                <Markdown>{product.description}</Markdown>
              </Suspense>
            </RichText>
          </div>
        </details>
      )}
    </>
  )
}
