import { getProductKindLabel } from '@aurore/shared'

import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import {
  getRouteApi,
  Link,
  Outlet,
  useCanGoBack,
  useNavigate,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import { ExternalLink, MessageSquare, Pencil } from 'lucide-react'
import { useCallback } from 'react'

import { CatalogQualityBadge } from '@/component/DataDisplay/CatalogQualityBadge/CatalogQualityBadge'
import { DetailPageLayout } from '@/component/Layout/PageLayout/DetailPageLayout'
import { PageTopActions } from '@/component/Layout/PageLayout/PageTopActions'
import { type TabOption, Tabs } from '@/component/Tabs/Tabs'
import { ReportContentButton } from '@/features/discussions/components/ReportContentButton'
import { SuggestEditButton } from '@/features/discussions/components/SuggestEditButton'
import { ProductCollectionAction } from '@/features/products/components/ProductCollectionAction/ProductCollectionAction'
import { authQueries } from '@/lib/queries/auth'
import { productQueries } from '@/lib/queries/products'
import { sanitizeUrl } from '@/lib/url'
import { useAuthStore } from '@/store/auth'
import '@/features/products/styles/kinds.css'
import '@/features/products/pages/ProductInfoTab/ProductInfoTab.css'
import './ProductLayout.css'

import { BackButton } from '@/component/Button/BackButton'
import { ButtonLink } from '@/component/Button/Button'
import { ProductImage } from '@/features/products/components/ProductImage/ProductImage'

const route = getRouteApi('/products/$slug')
const eurFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

type ProductTab = 'infos' | 'discussions'

const TAB_OPTIONS: TabOption<ProductTab>[] = [
  { id: 'infos', label: 'Infos' },
  { id: 'discussions', label: 'Discussions', icon: <MessageSquare size={14} /> },
]

function getDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

export function ProductLayout() {
  const { slug } = route.useParams()
  const { data: product } = useSuspenseQuery(productQueries.bySlug(slug))
  const storeUser = useAuthStore((s) => s.user)
  const { data: bootSession } = useQuery({ ...authQueries.session(), enabled: false })
  const hasUser = !!storeUser || bootSession?.authenticated === true
  const navigate = useNavigate()
  const router = useRouter()
  const canGoBack = useCanGoBack()
  // Subscribe to a boolean, not the whole location, to skip renders
  const isDiscussions = useRouterState({
    select: (s) => s.location.pathname.includes('/discussions'),
  })
  const activeTab: ProductTab = isDiscussions ? 'discussions' : 'infos'

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

  const handleTabChange = useCallback(
    (id: ProductTab) => {
      // replace: tabs are same-page sections, not history steps. Pushing them would strand
      // the back button on the previous tab instead of returning to the list.
      if (id === 'infos') {
        navigate({ to: '/products/$slug', params: { slug }, replace: true })
      } else {
        navigate({ to: '/products/$slug/discussions', params: { slug }, replace: true })
      }
    },
    [navigate, slug]
  )

  // Go back in history so the list's search params (filters) survive; fall back to a bare
  // /products when the detail page was reached directly (deep link, no in-app history).
  const handleBack = useCallback(() => {
    if (canGoBack) {
      router.history.back()
    } else {
      navigate({ to: '/products' })
    }
  }, [canGoBack, router, navigate])

  return (
    <DetailPageLayout banner={true} contentClassName="product-detail">
      <PageTopActions>
        <BackButton onClick={handleBack} prominence="strong">
          Retour aux produits
        </BackButton>
      </PageTopActions>

      <div className="product-detail__grid">
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
            className="product-hero__title"
            style={{ viewTransitionName: `product-name-${slug}` }}
          >
            {product.name}
          </h1>
          <div className="product-hero__chips">
            <CatalogQualityBadge quality={product.catalogQuality} />
          </div>
        </header>

        <aside className="product-rail" aria-label="Fiche produit">
          <div className="product-rail__card">
            <div className="product-rail__media">
              <ProductImage
                kind={product.kind}
                unit={product.unit}
                imageUrl={product.imageUrl}
                fill
              />
            </div>
            {(priceFormatted || amountFormatted) && (
              <p className="product-rail__facts">
                {priceFormatted && <span className="product-rail__price">{priceFormatted}</span>}
                {amountFormatted && <span className="product-rail__amount">{amountFormatted}</span>}
              </p>
            )}
            <div className="product-rail__actions">
              <ProductCollectionAction
                product={{
                  id: product.id,
                  name: product.name,
                  brand: product.brand,
                  priceCents: product.priceCents,
                }}
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
                <span>Voir le produit</span>
                {externalDomain && <span className="product-link__domain">{externalDomain}</span>}
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
        </aside>

        <div className="product-detail__body">
          <Tabs
            options={TAB_OPTIONS}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            variant="underline"
            ariaLabel="Sections du produit"
            hasPanels={false}
          />

          <div style={{ viewTransitionName: 'tab-content' }}>
            <Outlet />
          </div>
        </div>
      </div>
    </DetailPageLayout>
  )
}
