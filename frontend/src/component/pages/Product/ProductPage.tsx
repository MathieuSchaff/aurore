import { useSuspenseQuery } from '@tanstack/react-query'
import { getRouteApi, Link } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink, Package } from 'lucide-react'

import { productQueries } from '../../../lib/queries/products'

import './ProductPage.css'

const route = getRouteApi('/products/$slug')

function kindIconClass(kind: string): string {
  switch (kind) {
    case 'complément':
      return 'product-hero__icon--complement'
    case 'skincare':
      return 'product-hero__icon--skincare'
    case 'huile':
      return 'product-hero__icon--huile'
    case 'vitamine':
      return 'product-hero__icon--vitamine'
    default:
      return 'product-hero__icon--default'
  }
}

function kindBadgeClass(kind: string): string {
  switch (kind) {
    case 'complément':
      return 'product-hero__kind--complement'
    case 'skincare':
      return 'product-hero__kind--skincare'
    case 'huile':
      return 'product-hero__kind--huile'
    case 'vitamine':
      return 'product-hero__kind--vitamine'
    default:
      return 'product-hero__kind--default'
  }
}

export function ProductPage() {
  const { slug } = route.useParams()
  const { data: product } = useSuspenseQuery(productQueries.bySlug(slug))

  const priceFormatted =
    product.priceCents != null
      ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
          product.priceCents / 100
        )
      : null

  return (
    <div className="product-page">
      <div className="product-page__banner" />

      <div className="product-page__content">
        <Link to="/products" className="product-page__back">
          <ArrowLeft size={16} />
          Produits
        </Link>

        <div className="product-hero">
          <div className={`product-hero__icon ${kindIconClass(product.kind)}`}>
            <Package size={28} />
          </div>
          <div className="product-hero__info">
            <h1 className="product-hero__name">{product.name}</h1>
            <p className="product-hero__brand">{product.brand}</p>
            <div className="product-hero__tags">
              <span className={`product-hero__kind ${kindBadgeClass(product.kind)}`}>
                {product.kind}
              </span>
              <span className="product-hero__tag">{product.unit}</span>
            </div>
          </div>
          {priceFormatted && <span className="product-price">{priceFormatted}</span>}
        </div>

        <div className="product-section">
          <h2 className="product-section__title">Informations</h2>
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
                <div className="product-detail__value">{product.inci}</div>
              </div>
            )}
          </div>
        </div>

        {product.description && (
          <div className="product-section">
            <h2 className="product-section__title">Description</h2>
            <div className="product-notes">{product.description}</div>
          </div>
        )}

        {product.notes && (
          <div className="product-section">
            <h2 className="product-section__title">Notes</h2>
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
    </div>
  )
}
