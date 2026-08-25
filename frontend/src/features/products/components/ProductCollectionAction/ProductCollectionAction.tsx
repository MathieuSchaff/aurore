import type { UserProductStatus } from '@aurore/shared'

import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { Bookmark, Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/component/Button/Button'
import { statusLabels } from '@/features/collection/constants'
import { awaitBootRefresh } from '@/lib/auth/awaitBootRefresh'
import { readClientSession, useSession, viewerId } from '@/lib/auth/session'
import { isApiError } from '@/lib/helpers/apiError'
import { captureFrontendError } from '@/lib/observability/faro'
import { type ProductDetailPageData, productQueries } from '@/lib/queries/products'
import { useCreateUserProduct } from '@/lib/queries/user-products'
import { AddToCollectionModal } from '../AddToCollectionModal/AddToCollectionModal'
import './ProductCollectionAction.css'

interface ProductCollectionActionProps {
  product: {
    id: string
    slug: string
    name: string
    brand: string
    priceCents?: number | null
  }
  userStatus: UserProductStatus | null
}

export function ProductCollectionAction({ product, userStatus }: ProductCollectionActionProps) {
  const session = useSession()
  const currentViewerId = viewerId(session)
  const [showDetails, setShowDetails] = useState(false)
  const navigate = useNavigate()
  const currentHref = useRouterState({ select: (state) => state.location.href })
  const queryClient = useQueryClient()
  const addUserProduct = useCreateUserProduct()

  const currentStatus = currentViewerId ? userStatus : null
  const isCredentialPending =
    session.status === 'authenticated' && session.credential === 'restoring'

  const redirectToLogin = () => {
    navigate({ to: '/auth/login', search: { redirect: currentHref } })
  }

  const openDetails = () => {
    if (session.status !== 'authenticated') {
      redirectToLogin()
      return
    }
    setShowDetails(true)
  }

  const saveForLater = async () => {
    if (session.status !== 'authenticated') {
      redirectToLogin()
      return
    }
    const actionViewerId = session.user.id

    try {
      if (session.credential === 'restoring') {
        await awaitBootRefresh(queryClient)
        const refreshedSession = readClientSession()
        if (
          refreshedSession.status !== 'authenticated' ||
          refreshedSession.credential !== 'present'
        ) {
          redirectToLogin()
          return
        }
      }
      await addUserProduct.mutateAsync({ productId: product.id, status: 'watched' })
      queryClient.setQueryData<ProductDetailPageData>(
        productQueries.detailPage(product.slug, actionViewerId).queryKey,
        (previous) => (previous ? { ...previous, userStatus: 'watched' } : previous)
      )
      toast.success('Sauvegardé dans « Garde un œil »')
    } catch (error) {
      if (!isApiError(error)) {
        captureFrontendError(error, { flow: 'product-detail-quick-save', productId: product.id })
      }
      toast.error("Impossible de sauvegarder ce produit pour l'instant.")
    }
  }

  const statusConfig = currentStatus ? statusLabels[currentStatus] : null
  const isResolvingStatus = session.status === 'pending'

  return (
    <>
      {isResolvingStatus ? (
        <Button variant="accent" loading aria-label="Chargement de votre collection">
          Chargement
        </Button>
      ) : statusConfig ? (
        <Button
          variant="secondary"
          onClick={openDetails}
          disabled={isCredentialPending}
          className="product-collection-action__current"
          aria-label={`Dans votre collection : ${statusConfig.label}. Modifier ce produit dans ma collection.`}
        >
          <Check size={16} aria-hidden="true" />
          <span>{statusConfig.label}</span>
          <ChevronDown size={14} aria-hidden="true" />
        </Button>
      ) : (
        <div className="product-collection-action">
          <Button
            variant="accent"
            onClick={saveForLater}
            loading={addUserProduct.isPending || isCredentialPending}
            className="product-collection-action__save"
            aria-label="Sauvegarder ce produit dans Garde un œil"
          >
            <Bookmark size={16} aria-hidden="true" />
            <span>Sauvegarder</span>
          </Button>
          <Button
            variant="accent"
            onClick={openDetails}
            disabled={addUserProduct.isPending || isCredentialPending}
            className="product-collection-action__details"
            aria-label="Ajouter avec un statut ou un achat"
            title="Choisir un statut ou enregistrer un achat"
          >
            <ChevronDown size={16} aria-hidden="true" />
          </Button>
        </div>
      )}

      {showDetails ? (
        <AddToCollectionModal
          product={product}
          currentStatus={currentStatus}
          onClose={() => setShowDetails(false)}
          onSuccess={() => setShowDetails(false)}
        />
      ) : null}
    </>
  )
}
