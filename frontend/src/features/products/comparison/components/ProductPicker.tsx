import {
  COMPARISON_MAX_PRODUCTS,
  COMPARISON_MIN_PRODUCTS,
  type EnrichedComparisonProduct,
} from '@aurore/shared'

import { useState } from 'react'

import { Button } from '@/component/Button/Button'
import type { FilterOption } from '@/component/Filter/types'
import { ReplaceProductDialog } from './ReplaceProductDialog'
import './ProductPicker.css'

import { AsyncSearchSelect } from '@/component/Filter/AsyncSearchSelect/AsyncSearchSelect'
import { productQueries } from '@/lib/queries/products'

type Props = {
  selectedIds: string[]
  selectedProducts?: Pick<EnrichedComparisonProduct, 'id' | 'brand' | 'name'>[]
  onChange: (ids: string[]) => void
  onReplace?: (previousId: string, nextId: string) => Promise<void>
  isPending?: boolean
}

const formatLabel = (p: { brand: string; name: string }) => `${p.brand} — ${p.name}`

export function ProductPicker({
  selectedIds,
  selectedProducts,
  onChange,
  onReplace,
  isPending = false,
}: Props) {
  const [replacement, setReplacement] = useState<FilterOption | null>(null)
  const canReplace = !!onReplace && selectedIds.length === COMPARISON_MIN_PRODUCTS
  const atCap = selectedIds.length >= COMPARISON_MAX_PRODUCTS

  // Cap enforced here, not in AsyncSearchSelect, to stay correct if it ever adds optimistic UI.
  const handleToggle = (id: string) => {
    if (isPending) return
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id))
      return
    }
    if (atCap) return
    onChange([...selectedIds, id])
  }

  return (
    <>
      <fieldset
        className="product-picker__controls"
        disabled={isPending}
        aria-label="Sélection des produits"
      >
        <AsyncSearchSelect
          renderSelected={
            canReplace
              ? (options) => (
                  <div className="product-picker__selected">
                    {options.map((option) => (
                      <Button
                        key={option.value}
                        className="product-picker__replace"
                        variant="outline"
                        size="sm"
                        onClick={() => setReplacement(option)}
                      >
                        Remplacer {option.label}
                      </Button>
                    ))}
                  </div>
                )
              : undefined
          }
          selected={selectedIds}
          selectedLabels={
            selectedProducts &&
            Object.fromEntries(
              selectedProducts.map((product) => [product.id, formatLabel(product)])
            )
          }
          onToggle={handleToggle}
          label="Produits à comparer"
          placeholder={atCap ? 'Limite atteinte' : 'Rechercher un produit'}
          loadOptionsQuery={(q: string) => ({
            ...productQueries.searchFlat(q),
            select: (items: { id: string; name: string; brand: string }[]) =>
              items.map((p) => ({ value: p.id, label: formatLabel(p) })),
          })}
          resolveValuesQuery={(ids: string[]) => ({
            ...productQueries.byIds(ids),
            select: (items: { id: string; name: string; brand: string }[]) =>
              items.map((p) => ({ value: p.id, label: formatLabel(p) })),
          })}
        />
      </fieldset>
      {replacement && onReplace && selectedIds.includes(replacement.value) && (
        <ReplaceProductDialog
          product={replacement}
          selectedIds={selectedIds}
          onReplace={onReplace}
          onClose={() => setReplacement(null)}
        />
      )}
    </>
  )
}
