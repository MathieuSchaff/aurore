import type { EnrichedComparisonProduct, RepurchaseFlag } from '@aurore/shared'

import { useQuery } from '@tanstack/react-query'
import { lazy, Suspense, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { FormMessage } from '@/component/Feedback/ui/FormMessage/FormMessage'
import { statusLabels } from '@/features/collection/constants'
import { isAvailableUserProduct, userProductQueries } from '@/lib/queries/user-products'

import './PersonalExperienceSection.css'

const ProductDetailSheet = lazy(() =>
  import(
    '@/features/collection/components/tabs/CollectionTab/ProductViews/Detailed/ProductDetailSheet'
  ).then((module) => ({ default: module.ProductDetailSheet }))
)
const AddToCollectionModal = lazy(() =>
  import('@/features/products/components/AddToCollectionModal/AddToCollectionModal').then(
    (module) => ({ default: module.AddToCollectionModal })
  )
)

const repurchaseLabels: Record<RepurchaseFlag, string> = {
  yes: 'Oui',
  no: 'Non',
  unsure: 'Peut-être',
}

type Props = { products: EnrichedComparisonProduct[] }
type OpenPanel = { productId: string; kind: 'add' | 'edit' } | null

function formatPersonalNote(comment: string | null | undefined): string {
  const note = comment?.trim()
  if (!note) return 'Aucune note personnelle'
  return note.length > 280 ? `${note.slice(0, 280)}…` : note
}

export function PersonalExperienceSection({ products }: Props) {
  const collection = useQuery(userProductQueries.list())
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null)
  const selectedProduct = products.find((product) => product.id === openPanel?.productId)
  const selectedEntry = collection.data?.find((entry) => entry.productId === selectedProduct?.id)

  return (
    <section className="cmp-experience" aria-labelledby="cmp-experience-title">
      <h2 id="cmp-experience-title" className="ui-display-heading">
        Votre expérience
      </h2>
      <p className="cmp-experience__intro">
        Vos notes et décisions personnelles, distinctes des faits de formule. Visibles seulement par
        vous.
      </p>
      {collection.isPending ? (
        <p role="status">Chargement de votre collection…</p>
      ) : collection.isError ? (
        <>
          <FormMessage variant="error">
            Impossible de charger votre expérience personnelle.
          </FormMessage>
          <Button
            variant="outline"
            size="sm"
            onClick={() => collection.refetch()}
            disabled={collection.isFetching}
          >
            Réessayer
          </Button>
        </>
      ) : (
        <div className="cmp-experience__grid">
          {products.map((product) => {
            const entry = collection.data.find((item) => item.productId === product.id)
            const productLabel = `${product.brand} : ${product.name}`
            const actionLabel = entry ? 'Mes notes et décisions' : 'Ajouter à ma collection'
            return (
              <article
                key={product.id}
                className="cmp-experience__product"
                aria-label={productLabel}
              >
                <h3>{productLabel}</h3>
                <dl className="cmp-experience__facts">
                  <div>
                    <dt>Votre collection</dt>
                    <dd>
                      {entry ? statusLabels[entry.status].label : 'Absent de votre collection'}
                    </dd>
                  </div>
                  <div>
                    <dt>Votre intention de rachat</dt>
                    <dd>
                      {entry?.wouldRepurchase
                        ? repurchaseLabels[entry.wouldRepurchase]
                        : 'Non renseignée'}
                    </dd>
                  </div>
                </dl>
                <p className="cmp-experience__label">Votre note personnelle</p>
                <p className="cmp-experience__note">{formatPersonalNote(entry?.comment)}</p>
                {!entry && (
                  <p className="cmp-experience__hint">
                    Pas encore essayé ? Vous pourrez noter votre expérience après usage.
                  </p>
                )}
                {entry && !isAvailableUserProduct(entry) ? (
                  <p>Fiche de collection indisponible.</p>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setOpenPanel({ productId: product.id, kind: entry ? 'edit' : 'add' })
                    }
                    aria-label={`${actionLabel} : ${productLabel}`}
                  >
                    {actionLabel}
                  </Button>
                )}
              </article>
            )
          })}
        </div>
      )}
      <Suspense fallback={<p role="status">Chargement de votre fiche…</p>}>
        {!collection.isError && selectedProduct && openPanel?.kind === 'add' && (
          <AddToCollectionModal product={selectedProduct} onClose={() => setOpenPanel(null)} />
        )}
        {!collection.isError &&
          selectedProduct &&
          openPanel?.kind === 'edit' &&
          selectedEntry &&
          isAvailableUserProduct(selectedEntry) && (
            <ProductDetailSheet
              key={selectedEntry.id}
              p={selectedEntry}
              onClose={() => setOpenPanel(null)}
            />
          )}
      </Suspense>
    </section>
  )
}
