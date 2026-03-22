import type { DisplayScale, UserProductStatus } from '@habit-tracker/shared'

import { Archive, Ban, Eye, Heart, Package, ShoppingBag } from 'lucide-react'
import type React from 'react'

import type { CriteriaWeights, ReviewCriteria } from '../../../../lib/helpers/reviews'
import { calculateWeightedScore } from '../../../../lib/helpers/reviews'
import { getSentimentEmoji } from '../../../../utils/sentimentMap'

const statusConfig: Record<
  UserProductStatus,
  { label: string; icon: React.ComponentType<{ size?: number }>; color: string }
> = {
  in_stock: { label: 'En stock', icon: Package, color: '#10b981' },
  wishlist: { label: 'Wishlist', icon: ShoppingBag, color: '#3b82f6' },
  watched: { label: 'Surveille', icon: Eye, color: '#f59e0b' },
  holy_grail: { label: 'Saint Graal', icon: Heart, color: '#ef4444' },
  archived: { label: 'Archivé', icon: Archive, color: '#6b7280' },
  avoided: { label: 'À éviter', icon: Ban, color: '#000000' },
}

export interface CollectionCardProduct {
  id: string
  status: UserProductStatus
  qty: number
  sentiment: number | null
  comment: string | null
  updatedAt: string
  review: ReviewCriteria | null
  product: {
    name: string
    brand: string
    kind: string
    priceCents: number | null
    unit: string
  }
}

interface CollectionCardProps {
  item: CollectionCardProduct
  weights?: CriteriaWeights
  displayScale?: DisplayScale
}

export function CollectionCard({ item, weights, displayScale }: CollectionCardProps) {
  const score = calculateWeightedScore(item.review, weights, displayScale)
  const emoji = getSentimentEmoji(item.sentiment)
  const cfg = statusConfig[item.status]
  const StatusIcon = cfg.icon

  return (
    <article className="collection-card">
      <div className="collection-card__header">
        <div className="collection-card__info">
          <h3 className="collection-card__name">{item.product.name}</h3>
          <p className="collection-card__brand">{item.product.brand}</p>
        </div>
        {score && (
          <output className="collection-card__score" aria-label={`Note : ${score}`}>
            {score}
          </output>
        )}
      </div>

      <div className="collection-card__badges">
        <span className="collection-card__status-badge">
          <span className="sr-only">Statut : </span>
          <StatusIcon size={12} aria-hidden="true" />
          {cfg.label}
        </span>

        {item.qty > 0 && (
          <span className="collection-card__qty-badge">
            <span className="sr-only">Quantité : </span>
            <Package size={12} aria-hidden="true" />
            {item.qty} {item.product.unit}
          </span>
        )}

        {emoji && (
          <span
            className="collection-card__sentiment-badge"
            role="img"
            aria-label={`Ressenti : ${emoji}`}
          >
            {emoji}
          </span>
        )}

        {item.product.priceCents && (
          <span className="collection-card__price-badge">
            {(item.product.priceCents / 100).toFixed(2)}€
          </span>
        )}
      </div>
    </article>
  )
}
