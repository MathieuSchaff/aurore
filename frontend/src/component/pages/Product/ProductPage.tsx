import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink, FlaskConical, Package, Plus } from 'lucide-react'
import { useState } from 'react'
import Markdown from 'react-markdown'

import { productQueries } from '../../../lib/queries/products'

import './ProductPage.css'

import { Button } from '@/component/Button/Button'
import { AddToInventoryModal } from '../../stock/AddToInventoryModal'

const route = getRouteApi('/products/$slug')

/** Retourne la classe modificatrice `.kind--*` (kinds-shared.css). */
function kindClass(kind: string): string {
  switch (kind) {
    case 'complément':
      return 'kind--complement'
    case 'skincare':
      return 'kind--skincare'
    case 'huile':
      return 'kind--huile'
    case 'vitamine':
      return 'kind--vitamine'
    default:
      return 'kind--default'
  }
}

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

export function ProductPage() {
  const { slug } = route.useParams()
  const { data: product } = useSuspenseQuery(productQueries.bySlug(slug))
  const [showAddModal, setShowAddModal] = useState(false)

  const priceFormatted =
    product.priceCents != null
      ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
          product.priceCents / 100
        )
      : null

  const hasIngredients = product.ingredients && product.ingredients.length > 0

  return (
    <div className="product-page">
      <div className="product-page__banner" />

      <div className="product-page__content">
        <div className="product-page__top-actions">
          <Button
            type="button"
            onClick={() => window.history.back()}
            className="btn-pill product-page__back"
          >
            <ArrowLeft size={16} />
            Produits
          </Button>
          <button
            type="button"
            className="product-page__add-btn"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            Ajouter au stock
          </button>
        </div>
        <div className="product-hero">
          <div className={`product-hero__icon kind-icon ${kindClass(product.kind)}`}>
            <Package size={28} />
          </div>
          <div className="product-hero__info">
            <h1 className="product-hero__name">{product.name}</h1>
            <Link
              to="/products"
              search={{
                brand: [product.brand],
              }}
            >
              {product.brand}
            </Link>
            <div className="product-hero__tags">
              <span className={`product-hero__kind kind-badge ${kindClass(product.kind)}`}>
                {product.kind}
              </span>
              <span className="product-hero__tag">{product.unit}</span>
            </div>
          </div>
          {priceFormatted && <span className="product-price">{priceFormatted}</span>}
        </div>

        <div className="product-section">
          <h2 className="section-label">Informations</h2>
          <div className="product-details">
            {product.totalAmount != null && (
              <div className="product-detail">
                <div className="product-detail__label">Contenance</div>
                <div className="product-detail__value">
                  {product.totalAmount} {product.amountUnit ?? product.unit}
                </div>
              </div>
            )}
            {product.expiresAt && (
              <div className="product-detail">
                <div className="product-detail__label">Expiration</div>
                <div className="product-detail__value">{product.expiresAt}</div>
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
          <div className="product-section">
            <h2 className="section-label">Description</h2>
            <div className="product-notes rich-text">
              <Markdown>{product.description}</Markdown>
            </div>
          </div>
        )}

        {hasIngredients && (
          <div className="product-section">
            <h2 className="section-label section-label--flex">
              Ingrédients
              <span className="section-label__count">{product.ingredients.length}</span>
            </h2>
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
                          <span className="ingredient-item__category">
                            {ing.ingredientCategory}
                          </span>
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
            <h2 className="section-label">Notes</h2>
            <div className="product-notes">{product.notes}</div>
          </div>
        )}

        {product.url && (
          <div className="product-section">
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="product-link"
            >
              <ExternalLink size={16} />
              Voir le produit
            </a>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddToInventoryModal
          product={{
            id: product.id,
            name: product.name,
            brand: product.brand,
            priceCents: product.priceCents,
          }}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
