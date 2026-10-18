import type { ProductDetail } from '@aurore/shared'

import { Link } from '@tanstack/react-router'
import { Check, ChevronDown, Copy } from 'lucide-react'
import { useId, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import '@/features/products/styles/disclosure.css'
import './ProductComposition.css'

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

export function ProductComposition({
  ingredients,
  inci,
  inciCount,
}: {
  ingredients: ProductDetail['ingredients']
  inci: string | null
  inciCount: number
}) {
  const { copied, copy } = useCopyToClipboard()
  const compositionId = useId()
  const [isExpanded, setExpanded] = useState(false)
  const declaredInci = inci?.trim() ? inci : null
  const sheets = ingredients ?? []

  return (
    <section
      className="product-section product-composition"
      aria-labelledby="product-composition-title"
    >
      <div className="product-composition__heading">
        <h2 id="product-composition-title">
          {declaredInci ? `Les ${inciCount} ingrédients` : 'Composition'}
        </h2>
        {declaredInci && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void copy(declaredInci)}
            className="product-composition__copy"
            aria-label={
              copied ? 'Copié : liste des ingrédients' : 'Copier la liste des ingrédients'
            }
          >
            {copied ? (
              <Check size={14} aria-hidden="true" />
            ) : (
              <Copy size={14} aria-hidden="true" />
            )}
            <span>{copied ? 'Copié' : 'Copier la liste'}</span>
          </Button>
        )}
      </div>
      {declaredInci ? (
        <>
          <p className="product-section__intro">Liste INCI, dans l’ordre déclaré.</p>
          <div className="product-composition__declared">
            <p
              id={compositionId}
              className={`product-composition__inci${isExpanded ? ' is-expanded' : ''}`}
            >
              {inci}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="product-composition__expand"
              aria-expanded={isExpanded}
              aria-controls={compositionId}
              onClick={() => setExpanded((expanded) => !expanded)}
            >
              {isExpanded ? 'Réduire la composition' : 'Composition complète'}
              <ChevronDown size={14} aria-hidden="true" />
            </Button>
          </div>
        </>
      ) : (
        <p className="product-section__intro">Liste INCI non renseignée sur cette fiche.</p>
      )}

      <IngredientSheets sheets={sheets} />
    </section>
  )
}

function IngredientSheets({ sheets }: { sheets: ProductDetail['ingredients'] }) {
  if (sheets.length === 0) return null
  return (
    <details className="product-disclosure">
      <summary className="product-inci__summary">
        <span className="product-inci__label">Consulter les fiches ingrédients</span>
        <span className="product-disclosure__count">
          {sheets.length} {sheets.length === 1 ? 'fiche associée' : 'fiches associées'}
        </span>
        <ChevronDown size={14} className="product-inci__chevron" aria-hidden="true" />
      </summary>
      <ul role="list" className="ingredient-list">
        {sheets.map((ingredient) => {
          const concentration = formatConcentration(
            ingredient.concentrationValue,
            ingredient.concentrationUnit,
            ingredient.concentrationPer
          )
          return (
            <li key={ingredient.ingredientSlug} className="ingredient-item">
              <div className="ingredient-item__body">
                <Link
                  to="/ingredients/$slug"
                  params={{ slug: ingredient.ingredientSlug }}
                  className="ingredient-item__name"
                >
                  {ingredient.ingredientName}
                </Link>
                <div className="ingredient-item__meta">
                  {ingredient.ingredientCategory && <span>{ingredient.ingredientCategory}</span>}

                  {ingredient.notes && (
                    <span className="ingredient-item__notes">{ingredient.notes}</span>
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
    </details>
  )
}
