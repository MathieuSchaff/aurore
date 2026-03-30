import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { ExternalLink, FlaskConical, Package, Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import Markdown from 'react-markdown'

import { productQueries } from '../../../lib/queries/products'

import './ListPage.css'
import './ProductPage.css'
import '@/features/products/styles/kinds.css'

import { BackButton } from '@/component/Button/BackButton'
import { PillButton } from '@/component/Button/PillButton'
import { Badge, type BadgeVariant } from '@/component/DataDisplay/Badge/Badge'
import { DetailPageLayout } from '@/component/Layout/PageLayout/DetailPageLayout'
import { PageTopActions, PageTopActionsRight } from '@/component/Layout/PageLayout/PageTopActions'
import { RichText } from '@/component/Typography/RichText/RichText'
import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import { AddToInventoryModal } from './AddToInventoryModal'

const route = getRouteApi('/products/$slug')

function getBadgeVariant(kind: string): BadgeVariant {
  switch (kind) {
    case 'complement':
      return 'complement'
    case 'skincare':
      return 'skincare'
    case 'huile':
      return 'huile'
    case 'vitamine':
      return 'vitamine'
    default:
      return 'default'
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
    <DetailPageLayout banner={true}>
      <PageTopActions>
        <BackButton onClick={() => window.history.back()}>Produits</BackButton>
        <PageTopActionsRight>
          <PillButton to="/products/$slug/edit" params={{ slug }} variant="primary">
            <Pencil size={14} />
            Modifier
          </PillButton>
          <PillButton onClick={() => setShowAddModal(true)} variant="accent">
            <Plus size={16} />
            Ajouter au stock
          </PillButton>
        </PageTopActionsRight>
      </PageTopActions>

      <div className="product-hero">
        <div className={`product-hero__icon kind-icon kind--${getBadgeVariant(product.kind)}`}>
          <Package size={28} />
        </div>
        <div className="product-hero__info">
          <h1 className="product-hero__name">{product.name}</h1>
          <Link
            to="/products"
            search={{
              brand: [product.brand],
            }}
            className="product-hero__brand"
          >
            {product.brand}
          </Link>
          <div className="product-hero__tags">
            <Badge variant={getBadgeVariant(product.kind)} className="product-hero__kind">
              {product.kind}
            </Badge>
            <span className="product-hero__tag">{product.unit}</span>
          </div>
        </div>
        {priceFormatted && <span className="product-price">{priceFormatted}</span>}
      </div>

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
    </DetailPageLayout>
  )
}
