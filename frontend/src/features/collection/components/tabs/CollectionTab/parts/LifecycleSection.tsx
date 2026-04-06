import { useQuery } from '@tanstack/react-query'
import { Calendar, CheckCircle2, FlaskConical, History, PlayCircle, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { Badge } from '@/component/DataDisplay/Badge/Badge'
import { purchaseQueries, useFinishPurchase, useOpenPurchase } from '@/lib/queries/purchases'
import type { UserProduct } from '@/lib/queries/user-products'
import { AddPurchaseDialog, type PurchaseToEdit } from './AddPurchaseDialog'

import './LifecycleSection.css'

interface LifecycleSectionProps {
  p: UserProduct
  onAddPurchase: () => void
}

export function LifecycleSection({ p, onAddPurchase }: LifecycleSectionProps) {
  const { data: purchases } = useQuery(purchaseQueries.byUserProduct(p.id))

  const openPurchase = useMemo(() => {
    if (!purchases) return null
    return purchases.find((purch) => purch.openedAt && !purch.finishedAt)
  }, [purchases])

  const sortedPurchases = useMemo(() => {
    if (!purchases) return []
    return [...purchases].sort(
      (a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
    )
  }, [purchases])

  const openMutation = useOpenPurchase()
  const finishMutation = useFinishPurchase()

  const [editingPurchaseId, setEditingPurchaseId] = useState<string | null>(null)

  return (
    <div className="pds-card pds-lifecycle-card">
      <div className="pds-card-header">
        <FlaskConical size={16} />
        <h3>Cycle de vie</h3>
      </div>

      <div className="pds-lifecycle-actions">
        {openPurchase ? (
          <Button
            className="pds-lifecycle-btn finish"
            fullWidth
            onClick={() =>
              finishMutation.mutate({
                userProductId: p.id,
                input: { finishedAt: new Date().toISOString() },
              })
            }
          >
            <CheckCircle2 size={16} />
            <span>Terminer le flacon</span>
          </Button>
        ) : (
          <Button
            className="pds-lifecycle-btn start"
            fullWidth
            disabled={!purchases || purchases.every((purch) => purch.finishedAt)}
            onClick={() => {
              const nextToOpen = purchases?.find((purch) => !purch.openedAt)
              if (nextToOpen) {
                openMutation.mutate({
                  userProductId: p.id,
                  purchaseId: nextToOpen.id,
                  input: { openedAt: new Date().toISOString() },
                })
              }
            }}
          >
            <PlayCircle size={16} />
            <span>Entamer un flacon</span>
          </Button>
        )}
      </div>

      <div className="pds-purchases-history">
        <div className="pds-history-header">
          <History size={14} />
          <h4>Historique des achats</h4>
        </div>

        {sortedPurchases.length > 0 ? (
          <div className="pds-purchase-list">
            {sortedPurchases.map((purch) => (
              <div key={purch.id} className="pds-purchase-item">
                <div className="pds-purch-main">
                  <div className="pds-purch-dates">
                    <span className="pds-purch-date" title="Date d'achat">
                      <Calendar size={12} />
                      {new Date(purch.purchasedAt).toLocaleDateString()}
                    </span>
                    {purch.pricePaidCents && (
                      <span className="pds-purch-price">
                        {(purch.pricePaidCents / 100).toFixed(2)}€
                      </span>
                    )}
                  </div>
                  <div className="pds-purch-status">
                    {purch.finishedAt ? (
                      <Badge className="pds-badge-finished">Terminé</Badge>
                    ) : purch.openedAt ? (
                      <Badge className="pds-badge-opened">En cours</Badge>
                    ) : (
                      <Badge className="pds-badge-stock">En stock</Badge>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setEditingPurchaseId(purch.id)}>
                  Modifier
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="pds-empty-history">Aucun achat enregistré</p>
        )}

        <Button variant="ghost" fullWidth className="pds-add-purchase-btn" onClick={onAddPurchase}>
          <Plus size={14} />
          Enregistrer un achat
        </Button>
      </div>

      {editingPurchaseId && (
        <AddPurchaseDialog
          userProductId={p.id}
          purchase={
            purchases?.find((purch) => purch.id === editingPurchaseId) as PurchaseToEdit | undefined
          }
          onClose={() => setEditingPurchaseId(null)}
        />
      )}
    </div>
  )
}
