/**
 * ShelfView — Vue "étagère" de la collection avec drag-and-drop.
 *
 * Regroupe les produits par statut (SHELF_ORDER) et permet de
 * changer le statut d'un produit en le glissant d'une section à l'autre.
 *
 * Architecture :
 * - ShelfView (DndContext) → orchestre le drag & drop global
 * - ShelfSection (Droppable) → une étagère par statut
 * - ShelfProductCard (Draggable) → carte produit déplaçable
 * - ShelfProductCardUI (pur) → utilisé dans le DragOverlay sans hook dnd
 */

import type { UserProductStatus } from '@habit-tracker/shared'

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useCallback, useMemo, useState } from 'react'

import type { UserProduct } from '../../../../../lib/queries/user-products'
import { SHELF_ORDER } from '../../../constants'
import { ShelfProductCardUI } from './ShelfProductCardUI'
import { ShelfSection } from './ShelfSection'

import './ShelfView.css'

interface ShelfViewProps {
  products: UserProduct[]
  onStatusChange: (productId: string, newStatus: UserProductStatus) => void
  expandedCardId?: string | null
  onToggleExpand?: (productId: string) => void
  renderExpandedCard?: (product: UserProduct) => React.ReactNode
}

export function ShelfView({
  products,
  onStatusChange,
  expandedCardId,
  onToggleExpand,
  renderExpandedCard,
}: ShelfViewProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<UserProductStatus>>(new Set())
  const [activeProduct, setActiveProduct] = useState<UserProduct | null>(null)

  // Contrainte de distance (8px) pour différencier un clic d'un début de drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  // Regroupement des produits par statut (recalculé si la liste change)
  const grouped = useMemo(() => {
    const groups: Record<string, UserProduct[]> = {}
    for (const product of products) {
      if (!groups[product.status]) groups[product.status] = []
      groups[product.status].push(product)
    }
    return groups
  }, [products])

  const toggleCollapse = useCallback((status: UserProductStatus) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(status)) next.delete(status)
      else next.add(status)
      return next
    })
  }, [])

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const product = products.find((p) => p.id === event.active.id)
      setActiveProduct(product ?? null)
    },
    [products]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveProduct(null)
      const { active, over } = event
      if (!over) return

      const productId = active.id as string
      const targetStatus = over.data.current?.status as UserProductStatus | undefined
      if (!targetStatus) return

      // Pas de mutation si le statut n'a pas changé
      const product = products.find((p) => p.id === productId)
      if (!product || product.status === targetStatus) return

      onStatusChange(productId, targetStatus)
    },
    [products, onStatusChange]
  )

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="shelf-view">
        {SHELF_ORDER.map((status) => (
          <ShelfSection
            key={status}
            status={status}
            products={grouped[status] ?? []}
            isCollapsed={collapsedSections.has(status)}
            onToggleCollapse={() => toggleCollapse(status)}
            onProductClick={(id) => onToggleExpand?.(id)}
            expandedCardId={expandedCardId}
            renderExpandedCard={renderExpandedCard}
          />
        ))}
      </div>

      {/* Overlay : copie visuelle de la carte pendant le drag (sans hook dnd) */}
      <DragOverlay dropAnimation={null}>
        {activeProduct && <ShelfProductCardUI product={activeProduct} />}
      </DragOverlay>
    </DndContext>
  )
}
