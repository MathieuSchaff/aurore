import { History } from 'lucide-react'

import type { UserProduct } from '../../../lib/queries/user-products'

interface PurchaseHistoryTabProps {
  userProducts: UserProduct[]
}

export function PurchaseHistoryTab({ userProducts }: PurchaseHistoryTabProps) {
  const allPurchases = userProducts
    .flatMap((up) =>
      (up.purchases ?? []).map((purchase) => ({
        ...purchase,
        product: up.product,
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.purchasedAt ?? 0).getTime() - new Date(a.purchasedAt ?? 0).getTime()
    )

  if (allPurchases.length === 0) {
    return (
      <div className="coll-empty-state">
        <History size={44} className="coll-empty-icon" />
        <h3>Aucun achat enregistré</h3>
        <p>Vos achats apparaîtront ici.</p>
      </div>
    )
  }

  return (
    <div className="coll-history-view">
      <div className="coll-history-table">
        <div className="coll-history-head">
          <span>Date</span>
          <span>Produit</span>
          <span>Prix</span>
        </div>
        {allPurchases.map((entry) => (
          <div key={entry.id} className="coll-history-row">
            <div className="coll-hist-row-top">
              <span className="coll-hist-date">
                {new Date(entry.purchasedAt ?? '').toLocaleDateString()}
              </span>
              <div className="coll-hist-prod">
                <span className="coll-hist-name">{entry.product.name}</span>
                <span className="coll-hist-brand">{entry.product.brand}</span>
              </div>
            </div>
            <div className="coll-hist-row-bottom">
              <span className="coll-hist-price">
                {entry.pricePaidCents
                  ? `${(entry.pricePaidCents / 100).toFixed(2)}€`
                  : '—'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
