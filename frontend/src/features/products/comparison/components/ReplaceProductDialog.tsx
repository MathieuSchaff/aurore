import type { ProductSearchPage } from '@aurore/shared'

import type { InfiniteData } from '@tanstack/react-query'
import { useState } from 'react'

import { Button } from '@/component/Button/Button'
import { Modal } from '@/component/Dialog/Modal'
import { FormMessage } from '@/component/Feedback/ui/FormMessage/FormMessage'
import type { FilterOption } from '@/component/Filter/types'
import { SearchCombobox } from '@/component/Search/SearchCombobox'
import { productQueries } from '@/lib/queries/products'

import './ProductPicker.css'

type Props = {
  product: FilterOption
  selectedIds: string[]
  onReplace: (previousId: string, nextId: string) => Promise<void>
  onClose: () => void
}

export function ReplaceProductDialog({ product, selectedIds, onReplace, onClose }: Props) {
  const [candidate, setCandidate] = useState<FilterOption | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [hasError, setHasError] = useState(false)

  const save = async () => {
    if (!candidate || isPending || selectedIds.includes(candidate.value)) return
    setIsPending(true)
    setHasError(false)
    try {
      await onReplace(product.value, candidate.value)
      onClose()
    } catch {
      setHasError(true)
    }
    setIsPending(false)
  }

  return (
    <Modal
      onClose={() => {
        if (!isPending) onClose()
      }}
    >
      <div className="product-picker__replacement">
        <Modal.Title>Remplacer un produit</Modal.Title>
        <p>
          À remplacer : <strong>{product.label}</strong>
        </p>
        <p>
          Une comparaison enregistrée conserve au moins 2 produits. Choisissez un remplaçant ; la
          paire actuelle reste affichée jusqu’à l’enregistrement.
        </p>
        <fieldset disabled={isPending} className="product-picker__controls">
          <SearchCombobox
            label="Produit de remplacement"
            placeholder="Rechercher un autre produit"
            queryFn={(q) => ({
              ...productQueries.search(q),
              select: (data: InfiniteData<ProductSearchPage>) => ({
                ...data,
                pages: data.pages.map((page) => ({
                  ...page,
                  items: page.items.filter((item) => !selectedIds.includes(item.id)),
                })),
              }),
            })}
            toResult={(item) => ({
              id: item.id,
              slug: item.slug,
              label: item.name,
              sublabel: item.brand,
            })}
            onSelect={(_slug, item) => {
              if (isPending || selectedIds.includes(String(item.id))) return
              setCandidate({ value: String(item.id), label: `${item.sublabel} : ${item.label}` })
              setHasError(false)
            }}
          />
        </fieldset>
        {candidate && (
          <p role="status">
            Remplaçant choisi : <strong>{candidate.label}</strong>
          </p>
        )}
        {hasError && (
          <FormMessage variant="error">Remplacement non enregistré. Réessayez.</FormMessage>
        )}
        <div className="product-picker__actions">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Annuler
          </Button>
          <Button onClick={save} disabled={!candidate || isPending} loading={isPending}>
            Remplacer
          </Button>
        </div>
      </div>
    </Modal>
  )
}
