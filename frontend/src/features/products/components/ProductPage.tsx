import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { ExternalLink, FlaskConical } from 'lucide-react'
import Markdown from 'react-markdown'

import { RichText } from '@/component/Typography/RichText/RichText'
import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import { productQueries } from '../../../lib/queries/products'
import './ProductPage.css'

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

export function ProductInfoTab() {
  const { slug } = route.useParams()
  const { data: product } = useSuspenseQuery(productQueries.bySlug(slug))
  const hasIngredients = product.ingredients && product.ingredients.length > 0

  return (
    <>
      <div className="product-section">
        <SectionHeader title="Informations" variant="primary" />
        <div className="product-details">
          {product.totalAmount != null && (
            <div className="product-detail">
              <div className="product-detail__label">Contenance</div>
              <div className="product-detail__value">
                {product.totalAmount} {product.amountUnit ?? product.unit}
              </div>
            </div>
          )}
          {product.inci && (
            <div className="product-detail product-detail--full">
              <div className="product-detail__label">INCI</div>
              <div className="product-detail__value product-detail__value--inci">
                {product.inci}
              </div>
            </div>
          )}
        </div>
      </div>

      {product.description && (
        <div className="product-info-section">
          <SectionHeader title="Description" variant="primary" />
          <RichText className="product-notes">
            <Markdown>{product.description}</Markdown>
          </RichText>
        </div>
      )}

      {hasIngredients && (
        <div className="product-section">
          <SectionHeader title="Ingrédients" count={product.ingredients.length} variant="primary" />
          <ul className="ingredient-list">
            {product.ingredients.map((ing) => {
              const concentration = formatConcentration(
                ing.concentrationValue,
                ing.concentrationUnit,
                ing.concentrationPer
              )
              return (
                <li key={ing.ingredientName} className="ingredient-item">
                  <div className="ingredient-item__icon">
                    <FlaskConical size={14} />
                  </div>
                  <div className="ingredient-item__body">
                    <div className="ingredient-item__top">
                      <Link
                        to="/ingredients/$slug"
                        params={{ slug: ing.ingredientSlug }}
                        className="ingredient-item__name"
                      >
                        {ing.ingredientName}
                      </Link>
                      {concentration && (
                        <span className="ingredient-item__concentration">{concentration}</span>
                      )}
                    </div>
                    <div className="ingredient-item__meta">
                      {ing.ingredientCategory && (
                        <span className="ingredient-item__category">{ing.ingredientCategory}</span>
                      )}
                      {ing.notes && <span className="ingredient-item__notes">{ing.notes}</span>}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {product.notes && (
        <div className="product-section">
          <SectionHeader title="Notes" variant="primary" />
          <div className="product-notes">{product.notes}</div>
        </div>
      )}

      {product.url && (
        <div className="product-section">
          <a href={product.url} target="_blank" rel="noopener noreferrer" className="product-link">
            <ExternalLink size={16} />
            Voir le produit
          </a>
        </div>
      )}
    </>
  )
}
