import { getProductKindLabel } from '@aurore/shared'

import { useSuspenseQuery } from '@tanstack/react-query'
import {
  getRouteApi,
  Link,
  Outlet,
  useCanGoBack,
  useNavigate,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import { ExternalLink, Pencil } from 'lucide-react'
import { useCallback } from 'react'

import { DetailPageLayout } from '@/component/Layout/PageLayout/DetailPageLayout'
import { PageTopActions } from '@/component/Layout/PageLayout/PageTopActions'
import { ReportContentButton } from '@/features/discussions/components/ReportContentButton'
import { SuggestEditButton } from '@/features/discussions/components/SuggestEditButton'
import { ProductCollectionAction } from '@/features/products/components/ProductCollectionAction/ProductCollectionAction'
import { ProductFormulaSummary } from '@/features/products/components/ProductSummary/ProductFormulaSummary'
import { viewerId as getSessionViewerId, useSession } from '@/lib/auth/session'
import { productQueries } from '@/lib/queries/products'
import { sanitizeUrl } from '@/lib/url'
import '@/features/products/styles/kinds.css'
import '@/features/products/pages/ProductInfoTab/ProductInfoTab.css'
import './ProductLayout.css'

import { BackButton } from '@/component/Button/BackButton'
import { ButtonLink } from '@/component/Button/Button'
import { ProductImage } from '@/features/products/components/ProductImage/ProductImage'

const route = getRouteApi('/products/$slug')
const eurFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

function getDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

export function ProductLayout() {
  const { slug } = route.useParams()
  const session = useSession()
  const viewerId = getSessionViewerId(session)
  const { data: detailPage } = useSuspenseQuery(productQueries.detailPage(slug, viewerId))
  const product = detailPage.product
  const hasUser = viewerId !== null
  const navigate = useNavigate()
  const router = useRouter()
  const canGoBack = useCanGoBack()
  // Subscribe to a boolean, not the whole location, to skip renders
  const isDiscussions = useRouterState({
    select: (s) => s.location.pathname.includes('/discussions'),
  })

  const priceFormatted =
    product.priceCents != null && product.priceCents > 0
      ? eurFormatter.format(product.priceCents / 100)
      : null
  const amountFormatted =
    product.totalAmount != null && product.totalAmount > 0
      ? `${product.totalAmount} ${product.amountUnit ?? product.unit}`
      : null
  const safeUrl = sanitizeUrl(product.url)
  const externalDomain = safeUrl ? getDomain(safeUrl) : null

  // History keeps the catalogue filters when returning from a product
  const handleBack = useCallback(() => {
    if (canGoBack) {
      router.history.back()
    } else {
      navigate({ to: '/products' })
    }
  }, [canGoBack, router, navigate])

  return (
    <DetailPageLayout banner={false} contentClassName="product-detail">
      <PageTopActions>
        <BackButton onClick={handleBack} prominence="strong">
          Retour aux produits
        </BackButton>
      </PageTopActions>

      <div className="product-detail__grid">
        <section className="product-overview" aria-labelledby="product-title">
          <div className="product-rail__media">
            <ProductImage
              kind={product.kind}
              unit={product.unit}
              imageUrl={product.imageUrl}
              fill
            />
          </div>
          <div className="product-overview__content">
            <header className="product-hero">
              <p className="product-hero__eyebrow">
                <Link
                  to="/products"
                  search={{ brand: [product.brand] }}
                  aria-label={`Voir tous les produits ${product.brand}`}
                >
                  {product.brand}
                </Link>
                <span className="product-hero__dot" aria-hidden="true" />
                <span>{getProductKindLabel(product.kind)}</span>
              </p>
              <h1
                id="product-title"
                className="product-hero__title"
                style={{ viewTransitionName: `product-name-${slug}` }}
              >
                {product.name}
              </h1>
              {(priceFormatted || amountFormatted) && (
                <p className="product-rail__facts">
                  {priceFormatted && <span className="product-rail__price">{priceFormatted}</span>}
                  {amountFormatted && (
                    <span className="product-rail__amount">{amountFormatted}</span>
                  )}
                </p>
              )}
            </header>
            <ProductFormulaSummary product={product} assessment={detailPage.assessment} />
            <div className="product-rail__actions">
              <ProductCollectionAction
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  brand: product.brand,
                  priceCents: product.priceCents,
                }}
                userStatus={detailPage.userStatus}
              />
              {hasUser && (
                <ButtonLink
                  to="/products/$slug/edit"
                  params={{ slug }}
                  variant="secondary"
                  aria-label="Modifier ce produit"
                >
                  <Pencil size={14} />
                  <span>Modifier</span>
                </ButtonLink>
              )}
            </div>
            {safeUrl !== null && (
              <a href={safeUrl} target="_blank" rel="noopener noreferrer" className="product-link">
                <ExternalLink size={14} aria-hidden="true" />
                <span>Voir chez {externalDomain ?? product.brand}</span>
                <span className="sr-only"> (nouvel onglet)</span>
              </a>
            )}
            {hasUser && (
              <div className="product-rail__meta">
                <SuggestEditButton targetType="product" targetId={product.id} />
                <ReportContentButton targetType="product" targetId={product.id} />
              </div>
            )}
          </div>
        </section>

        <div className="product-detail__body">
          {isDiscussions && (
            <Link to="/products/$slug" params={{ slug }} replace className="product-detail__return">
              Revenir à la fiche produit
            </Link>
          )}

          <div style={{ viewTransitionName: 'tab-content' }}>
            <Outlet />
          </div>
        </div>
      </div>
    </DetailPageLayout>
  )
}
