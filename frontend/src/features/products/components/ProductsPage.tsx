import { SKINCARE_PRODUCT_TAG_CATEGORY_META } from '@habit-tracker/shared'

import { useQuery } from '@tanstack/react-query'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { Package, Plus, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { Card } from '@/component/Card/Card'
import { ListPagination } from '@/component/DataDisplay/Pagination/ListPagination'
import { EmptyState } from '@/component/Feedback/ui/EmptyState/EmptyState'
import {
  ActiveFiltersBar,
  emptyFilters,
  FilterDrawer,
  type FilterGroupConfig,
  type FilterValues,
  getFilterLabel,
} from '@/component/Filter'
import { Toggle } from '@/component/Input/Toggle/Toggle'
import { PageHeader } from '@/component/Layout/PageHeader/PageHeader'
import { SearchCombobox } from '@/component/Search/SearchCombobox'
import { useListFilters } from '@/hooks/useListFilters'
import { useTagFilterGroups } from '@/hooks/useTagFilterGroups'
import { ProductIcon } from '../../../assets/product-icons'
import { ingredientQueries } from '../../../lib/queries/ingredients'
import { type ListProductsFilters, productQueries } from '../../../lib/queries/products'
import { profileQueries } from '../../../lib/queries/profile'
import { useAuthStore } from '../../../store/auth'
import {
  FILTER_KEYS,
  type FilterKey,
  GROUP_LABELS,
  LABEL_OVERRIDES,
  TAG_FILTER_KEYS,
} from '../filters'
import { AddToCollectionModal } from './AddToCollectionModal/AddToCollectionModal'

import '@/component/Layout/PageLayout/ListPage.css'
import './ProductsPage.css'
import '@/features/products/styles/kinds.css'

const routeApi = getRouteApi('/products/')

function kindClass(kind: string): string {
  switch (kind) {
    case 'complément':
      return 'kind--complement'
    case 'skincare':
      return 'kind--skincare'
    case 'huile':
      return 'kind--huile'
    case 'vitamine':
      return 'kind--vitamine'
    default:
      return 'kind--default'
  }
}

function unitClass(unit: string | null | undefined): string {
  const u = unit?.toLowerCase().trim() ?? ''
  if (u === 'pump' || u === 'pompe') return 'unit--pump'
  if (u === 'dropper' || u === 'pipette' || u === 'compte-gouttes') return 'unit--dropper'
  if (u === 'jar' || u === 'pot' || u === 'crème' || u === 'cream') return 'unit--jar'
  if (u === 'tube') return 'unit--tube'
  if (u === 'spray' || u === 'brume' || u === 'brumisateur') return 'unit--spray'
  if (u === 'spf' || u === 'sunscreen' || u === 'solaire') return 'unit--spf'
  return ''
}

const eurFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

const EMPTY_FILTERS = emptyFilters(FILTER_KEYS)

export function ProductsPage() {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [modalProduct, setModalProduct] = useState<{
    id: string
    name: string
    brand: string
    priceCents?: number | null
  } | null>(null)

  const search = routeApi.useSearch()
  const { page, profile_filter } = search
  const navigate = useNavigate({ from: '/products/' })

  const user = useAuthStore((s) => s.user)

  const { data: dermoProfile } = useQuery({
    ...profileQueries.dermo(),
    enabled: !!user && profile_filter,
  })

  const avoidFor =
    profile_filter && dermoProfile
      ? [...(dermoProfile.skinTypes ?? []), ...dermoProfile.skinConcerns]
      : []

  const filters: FilterValues<FilterKey> = Object.fromEntries(
    FILTER_KEYS.map((k) => [k, search[k] ?? []])
  ) as FilterValues<FilterKey>

  const { filterCount, activeTags, applyFilters, resetFilters, goToPage, toggleSingleFilter } =
    useListFilters({
      from: '/products/',
      filters,
      emptyFilters: EMPTY_FILTERS,
      filterKeys: FILTER_KEYS,
    })

  const effectiveFilterCount = filterCount + (profile_filter ? 1 : 0)

  const handleReset = () => {
    resetFilters()
    navigate({ search: (prev) => ({ ...prev, profile_filter: false }), replace: true })
  }

  const hasFilters = filterCount > 0

  const { data: filterOptions } = useQuery(productQueries.filterOptions())
  const { data: allIngredients } = useQuery(ingredientQueries.options())

  const apiFilters: ListProductsFilters = hasFilters
    ? {
        ...(Object.fromEntries(
          FILTER_KEYS.map((k) => [k, filters[k].length > 0 ? filters[k] : undefined])
        ) as Partial<ListProductsFilters>),
        avoid_for: avoidFor.length > 0 ? avoidFor : undefined,
        page,
        limit: 20,
      }
    : {
        sort: 'random',
        limit: 12,
        avoid_for: avoidFor.length > 0 ? avoidFor : undefined,
      }

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...productQueries.list(apiFilters),
    placeholderData: (prev) => prev,
    staleTime: hasFilters ? 5 * 60 * 1000 : 0,
  })

  const tagGroups = useTagFilterGroups(
    TAG_FILTER_KEYS,
    filterOptions?.tags,
    SKINCARE_PRODUCT_TAG_CATEGORY_META,
    LABEL_OVERRIDES
  )

  const filterGroups = useMemo<FilterGroupConfig<FilterKey>[]>(() => {
    if (!filterOptions) return []
    return [
      ...(tagGroups as FilterGroupConfig<FilterKey>[]),
      {
        id: 'search',
        label: 'Recherche précise',
        defaultOpen: false,
        tier: 'advanced',
        subFilters: [
          {
            key: 'brand',
            label: 'Marque',
            placeholder: 'Rechercher une marque...',
            variant: 'search-select',
            options: filterOptions.brands.map((b) => ({ value: b, label: b })),
          },
          {
            key: 'ingredient',
            label: 'Ingrédient',
            placeholder: 'Rechercher un ingrédient...',
            variant: 'search-select',
            options: allIngredients?.map((i) => ({ value: i.slug, label: i.name })) ?? [],
          },
        ],
      },
    ]
  }, [filterOptions, allIngredients, tagGroups])

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / 20)

  const profileToggle = user ? (
    <Toggle
      label="Selon mon profil"
      hint="Masque les produits contre-indiqués pour votre type de peau"
      checked={profile_filter}
      onChange={(checked) =>
        navigate({ search: (prev) => ({ ...prev, profile_filter: checked, page: 1 }) })
      }
      size="sm"
    />
  ) : null

  return (
    <>
      <div className="list-page products-page">
        <PageHeader
          title="Produits"
          isLoading={isPlaceholderData}
          meta={hasFilters ? `${total} produit${total > 1 ? 's' : ''}` : 'Découverte'}
          actions={
            <>
              <SearchCombobox
                label="Rechercher un produit"
                queryFn={productQueries.search}
                toResult={(item) => ({
                  id: item.id,
                  slug: item.slug,
                  label: item.name,
                  sublabel: item.brand,
                })}
                onSelect={(slug) => navigate({ to: '/products/$slug', params: { slug } })}
              />
              <div className="list-header__actions-group">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => setDrawerOpen(true)}
                  className="list-filter-btn"
                  aria-label={
                    effectiveFilterCount > 0
                      ? `Filtrer (${effectiveFilterCount} actif${effectiveFilterCount > 1 ? 's' : ''})`
                      : 'Filtrer'
                  }
                >
                  <SlidersHorizontal size={14} aria-hidden="true" />
                  <span>Filtrer</span>
                  {effectiveFilterCount > 0 && (
                    <span className="list-filter-btn__count" aria-hidden="true">
                      {effectiveFilterCount}
                    </span>
                  )}
                </Button>
                <Button to="/products/new" variant="primary" size="md" className="list-filter-btn">
                  <Plus size={14} aria-hidden="true" />
                  <span>Créer</span>
                </Button>
              </div>
            </>
          }
        />

        <ActiveFiltersBar
          activeTags={activeTags}
          groupLabels={GROUP_LABELS}
          getFilterLabel={(key, value) => getFilterLabel(filterGroups, key, value)}
          onRemoveTag={toggleSingleFilter}
          onClearAll={resetFilters}
        />

        <FilterDrawer
          open={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
          groups={filterGroups}
          currentFilters={filters}
          initialFilters={EMPTY_FILTERS}
          onApply={applyFilters}
          onReset={handleReset}
        >
          {profileToggle}
        </FilterDrawer>

        <section
          className={`list-main${isPlaceholderData ? ' list-main--syncing' : ''}`}
          aria-label="Liste des produits"
        >
          {isLoading && !isPlaceholderData ? (
            <EmptyState icon={<Package size={24} />} subtitle="Chargement..." />
          ) : items.length === 0 ? (
            <EmptyState
              icon={<Package size={24} />}
              title="Aucun produit trouvé"
              subtitle="Essayez de modifier vos filtres pour trouver des produits."
            />
          ) : (
            <>
              <ul className="list-grid">
                {items.map((product) => (
                  <Card
                    as="li"
                    key={product.id}
                    interactive
                    accent="var(--_kind-color)"
                    className={`list-card list-card--product ${kindClass(product.kind)} ${unitClass(product.unit)}`}
                  >
                    <div className="list-card__inner">
                      <Link
                        to="/products/$slug"
                        params={{ slug: product.slug }}
                        className="list-card__header"
                      >
                        <div className="list-card__header-top">
                          <span className="list-card__kind">{product.kind}</span>
                          <div className="list-card__icon-wrap" aria-hidden="true">
                            <ProductIcon unit={product.unit} kind={product.kind} size={18} />
                          </div>
                        </div>
                        <span className="list-card__brand">{product.brand}</span>
                        <Card.Title
                          as="p"
                          className="list-card__name"
                          style={{ viewTransitionName: `product-name-${product.slug}` }}
                        >
                          {product.name}
                        </Card.Title>
                      </Link>

                      <Card.Footer>
                        <div className="list-card__price-wrap">
                          {product.priceCents != null ? (
                            <span className="list-card__price">
                              {eurFormatter.format(product.priceCents / 100)}
                            </span>
                          ) : (
                            <>
                              <span
                                className="list-card__price list-card__price--empty"
                                aria-hidden="true"
                              >
                                —
                              </span>
                              <span className="sr-only">Prix non renseigné</span>
                            </>
                          )}
                          {product.totalAmount && (
                            <span className="list-card__unit-chip">
                              {product.totalAmount} {product.amountUnit ?? product.unit}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          aria-label={`Ajouter ${product.name} à la collection`}
                          onClick={() => {
                            setModalProduct({
                              id: product.id,
                              name: product.name,
                              brand: product.brand,
                              priceCents: product.priceCents,
                            })
                          }}
                        >
                          <Plus size={14} aria-hidden="true" />
                          <span>Ajouter</span>
                        </Button>
                      </Card.Footer>
                    </div>
                  </Card>
                ))}
              </ul>

              {hasFilters && (
                <ListPagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              )}
            </>
          )}
        </section>
      </div>
      {modalProduct && (
        <AddToCollectionModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onSuccess={() => setModalProduct(null)}
        />
      )}
    </>
  )
}
