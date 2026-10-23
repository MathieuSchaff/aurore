import { COMPARISON_MAX_PRODUCTS, COMPARISON_MIN_PRODUCTS } from '@aurore/shared'

import { useSuspenseQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { FormMessage } from '@/component/Feedback/ui/FormMessage/FormMessage'
import { PageHeader } from '@/component/Layout/PageHeader/PageHeader'
import { useAnnounce } from '@/hooks/useAnnounce'
import {
  comparisonQueries,
  useCreateComparison,
  useUpdateComparison,
} from '@/lib/queries/comparisons'
import { ComparisonBody } from '../components/ComparisonBody'
import { ComparisonHeader } from '../components/ComparisonHeader'
import { ComparisonNameEditor } from '../components/ComparisonNameEditor'
import { ComparisonPreview } from '../components/ComparisonPreview'
import { EmptyComparisonState } from '../components/EmptyComparisonState'
import { ProductPicker } from '../components/ProductPicker'
import { useComparisonDraft } from '../hooks/useComparisonDraft'
import './ComparisonBuilderPage.css'

type Props =
  | { mode: 'new'; id?: never; seedProductId?: string }
  | { mode: 'edit'; id: string; seedProductId?: never }

export function ComparisonBuilderPage(props: Props) {
  if (props.mode === 'new') return <NewComparisonBuilder seedProductId={props.seedProductId} />
  return <EditComparisonBuilder id={props.id} />
}

function NewComparisonBuilder({ seedProductId }: { seedProductId?: string }) {
  const navigate = useNavigate()
  const create = useCreateComparison()
  const entryKey = useLocation({
    select: (location) => location.state.__TSR_key ?? location.state.key ?? location.href,
  })
  const { productIds, setProductIds, name, setName, clearDraft } = useComparisonDraft(
    `${entryKey}:${seedProductId ?? ''}`,
    seedProductId
  )

  const isDirty = productIds.length > 0 || name.trim().length > 0

  // Guard the native back/close path; in-app cancel is the FormActions button below.
  useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  const onSave = async () => {
    if (productIds.length < COMPARISON_MIN_PRODUCTS || create.isPending) return
    const created = await create.mutateAsync({
      name: name.trim() || undefined,
      productIds,
    })
    clearDraft()
    void navigate({ to: '/products/compare/$id', params: { id: created.id } })
  }

  return (
    <section>
      <PageHeader
        title="Comparer des produits"
        maxWidth="72rem"
        meta="Comparez dès deux produits. Enregistrez pour retrouver cette sélection."
      />
      <ComparisonHeader
        name={name}
        onNameChange={setName}
        count={productIds.length}
        onSave={onSave}
        onCancel={
          isDirty
            ? () => {
                clearDraft()
                void navigate({ to: '/products/compare' })
              }
            : undefined
        }
        canSave={productIds.length >= COMPARISON_MIN_PRODUCTS}
        isPending={create.isPending}
      />
      {create.error && (
        <FormMessage variant="error">Impossible de créer la comparaison. Réessayez.</FormMessage>
      )}
      <div className="comparison-builder-page">
        <div className="comparison-builder-page__picker">
          <ProductPicker
            selectedIds={productIds}
            onChange={setProductIds}
            isPending={create.isPending}
          />
        </div>
        {productIds.length >= COMPARISON_MIN_PRODUCTS ? (
          <ComparisonPreview productIds={productIds} />
        ) : (
          <EmptyComparisonState count={productIds.length} />
        )}
      </div>
    </section>
  )
}

function EditComparisonBuilder({ id }: { id: string }) {
  const { data: comparison } = useSuspenseQuery(comparisonQueries.detail(id))
  const update = useUpdateComparison({ inlineError: true })
  const replacement = useUpdateComparison({ inlineError: true })
  const announce = useAnnounce()

  // Schema rejects out-of-bounds counts; useMutation swallows the 400 and desyncs the picker.
  const setProductIds = (productIds: string[]) => {
    if (
      productIds.length < COMPARISON_MIN_PRODUCTS ||
      productIds.length > COMPARISON_MAX_PRODUCTS
    ) {
      return
    }
    update.mutate(
      { id, input: { productIds } },
      { onSuccess: () => announce('Comparaison mise à jour') }
    )
  }

  return (
    <section>
      <ComparisonNameEditor
        key={id}
        id={id}
        savedName={comparison.name}
        count={comparison.products.length}
      />
      {update.error && (
        <FormMessage variant="error">
          Impossible d&apos;enregistrer la modification. Réessayez.
        </FormMessage>
      )}
      <div className="comparison-builder-page">
        <div className="comparison-builder-page__picker">
          <ProductPicker
            selectedIds={comparison.products.map((p) => p.id)}
            selectedProducts={comparison.products}
            onChange={setProductIds}
            isPending={update.isPending || replacement.isPending}
            onReplace={async (previousId, nextId) => {
              update.reset()
              await replacement.mutateAsync({
                id,
                input: {
                  productIds: comparison.products.map((p) => (p.id === previousId ? nextId : p.id)),
                },
              })
              announce('Produit remplacé dans la comparaison')
            }}
          />
        </div>
        {comparison.products.length < COMPARISON_MIN_PRODUCTS ? (
          <EmptyComparisonState count={comparison.products.length} />
        ) : (
          <ComparisonBody products={comparison.products} comparisonName={comparison.name} />
        )}
      </div>
    </section>
  )
}
