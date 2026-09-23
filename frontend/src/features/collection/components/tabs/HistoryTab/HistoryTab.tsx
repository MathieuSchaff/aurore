import { Link } from '@tanstack/react-router'
import { ArrowRight, History, MoreHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { Time } from '@/component/DataDisplay/Time/Time'
import { DropdownMenu } from '@/component/DropdownMenu/DropdownMenu'
import { compareInstant, nowInstant } from '@/lib/dates'
import { useDeletePurchase } from '@/lib/queries/purchases'
import type { UserProductEntry } from '@/lib/queries/user-products'
import { AddPurchaseDialog } from '../CollectionTab/parts/AddPurchaseDialog'
import { DeleteConfirmDialog } from '../CollectionTab/parts/DeleteConfirmDialog'

import './HistoryTab.css'

const UNAVAILABLE_PRODUCT_NAME = 'Produit indisponible'

interface HistoryTabProps {
  userProducts: UserProductEntry[]
}

type PurchaseEntry = {
  id: string
  userProductId: string
  purchasedAt: string | null
  pricePaidCents: number | null
  product: UserProductEntry['product']
}

function purchaseProductName({ product }: PurchaseEntry): string {
  return product?.name ?? UNAVAILABLE_PRODUCT_NAME
}

function PurchaseHistoryRow({
  entry,
  onEdit,
  onDelete,
}: {
  entry: PurchaseEntry
  onEdit: (entry: PurchaseEntry) => void
  onDelete: (entry: PurchaseEntry) => void
}) {
  const productName = purchaseProductName(entry)
  const menuLabel = `Options pour l'achat de ${productName}`

  return (
    <tr className="coll-history-row">
      <td className="coll-hist-date">
        {entry.purchasedAt ? <Time iso={entry.purchasedAt} style="short" /> : '—'}
      </td>
      <td className="coll-hist-prod">
        <span className="coll-hist-name">{productName}</span>
        {entry.product && <span className="coll-hist-brand">{entry.product.brand}</span>}
      </td>
      <td className="coll-hist-price">
        {entry.pricePaidCents != null ? `${(entry.pricePaidCents / 100).toFixed(2)}€` : '—'}
      </td>
      <td className="coll-hist-actions">
        <DropdownMenu>
          <DropdownMenu.Trigger>
            <Button variant="bare" className="coll-hist-menu-btn" aria-label={menuLabel}>
              <MoreHorizontal size={16} aria-hidden="true" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" ariaLabel={menuLabel}>
            <DropdownMenu.Item onSelect={() => onEdit(entry)}>
              <Button variant="bare">Modifier</Button>
            </DropdownMenu.Item>
            <DropdownMenu.Item variant="danger" onSelect={() => onDelete(entry)}>
              <Button variant="bare">Supprimer</Button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </td>
    </tr>
  )
}

export function HistoryTab({ userProducts }: HistoryTabProps) {
  const deletePurchaseMutation = useDeletePurchase()

  const [editingPurchase, setEditingPurchase] = useState<PurchaseEntry | null>(null)
  const [deletingPurchase, setDeletingPurchase] = useState<PurchaseEntry | null>(null)

  const allPurchases: PurchaseEntry[] = useMemo(
    () =>
      userProducts
        .flatMap((up) =>
          (up.purchases ?? []).map((purchase) => ({
            ...purchase,
            product: up.product,
          }))
        )
        .sort((a, b) => compareInstant(b.purchasedAt ?? '', a.purchasedAt ?? '')),
    [userProducts]
  )

  if (allPurchases.length === 0) {
    return (
      <div className="coll-empty-state">
        <History size={44} className="coll-empty-icon" />
        <h3>Aucun achat enregistré</h3>
        <p>Vos achats apparaîtront ici dès que vous en saisirez un depuis une fiche produit.</p>
        <Link to="/collection" className="coll-empty-link">
          <span>Aller à ma collection</span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    )
  }

  return (
    <div>
      <table className="coll-history-table" aria-label="Historique des achats">
        <thead className="coll-history-head">
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Produit</th>
            <th scope="col">Prix</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allPurchases.map((entry) => (
            <PurchaseHistoryRow
              key={entry.id}
              entry={entry}
              onEdit={setEditingPurchase}
              onDelete={setDeletingPurchase}
            />
          ))}
        </tbody>
      </table>

      {editingPurchase && (
        <AddPurchaseDialog
          userProductId={editingPurchase.userProductId}
          purchase={{
            id: editingPurchase.id,
            purchasedAt: editingPurchase.purchasedAt ?? nowInstant(),
            pricePaidCents: editingPurchase.pricePaidCents,
          }}
          onClose={() => setEditingPurchase(null)}
        />
      )}

      {deletingPurchase && (
        <DeleteConfirmDialog
          message={`Voulez-vous vraiment supprimer cet achat de ${purchaseProductName(deletingPurchase)} ?`}
          confirmLabel="Supprimer"
          isPending={deletePurchaseMutation.isPending}
          onClose={() => setDeletingPurchase(null)}
          onConfirm={() =>
            deletePurchaseMutation.mutate(
              { userProductId: deletingPurchase.userProductId, purchaseId: deletingPurchase.id },
              { onSuccess: () => setDeletingPurchase(null) }
            )
          }
        />
      )}
    </div>
  )
}
