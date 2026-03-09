import { useQuery } from '@tanstack/react-query'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Package, Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'

import { ingredientQueries } from '../../../lib/queries/ingredients'
import { type ListProductsFilters, productQueries } from '../../../lib/queries/products'
import { FilterDialog, type FilterFieldConfig, type FilterValues } from '../../Filter/Filter'

import './ProductsPage.css'

import { ProductSearch } from '../../search/ProductSearch/ProductSearch'

const routeApi = getRouteApi('/products/')

type FilterKey =
  | 'kind'
  | 'brand'
  | 'concern'
  | 'skin_type'
  | 'skin_zone'
  | 'product_type'
  | 'routine_step'
  | 'attribute'
  | 'ingredient'

function kindIconClass(kind: string): string {
  switch (kind) {
    case 'complément':
      return 'product-card__icon--complement'
    case 'skincare':
      return 'product-card__icon--skincare'
    case 'huile':
      return 'product-card__icon--huile'
    case 'vitamine':
      return 'product-card__icon--vitamine'
    default:
      return 'product-card__icon--default'
  }
}

function kindBadgeClass(kind: string): string {
  switch (kind) {
    case 'complément':
      return 'product-card__kind--complement'
    case 'skincare':
      return 'product-card__kind--skincare'
    case 'huile':
      return 'product-card__kind--huile'
    case 'vitamine':
      return 'product-card__kind--vitamine'
    default:
      return 'product-card__kind--default'
  }
}

function kindCardClass(kind: string): string {
  switch (kind) {
    case 'complément':
      return 'product-card--complement'
    case 'skincare':
      return 'product-card--skincare'
    case 'huile':
      return 'product-card--huile'
    case 'vitamine':
      return 'product-card--vitamine'
    default:
      return ''
  }
}

const CATEGORY_LABELS: Record<string, { label: string; key: FilterKey }> = {
  routine_step: { label: 'Étape routine', key: 'routine_step' },
  attribute: { label: 'Caractéristiques', key: 'attribute' },
  skin_type: { label: 'Type de peau', key: 'skin_type' },
  skin_zone: { label: 'Zone', key: 'skin_zone' },
  product_type: { label: 'Type de produit', key: 'product_type' },
  concern: { label: 'Cibles', key: 'concern' },
}
const EMPTY_FILTERS = {
  kind: [] as string[],
  brand: [] as string[],
  routine_step: [] as string[],
  attribute: [] as string[],
  skin_type: [] as string[],
  skin_zone: [] as string[],
  product_type: [] as string[],
  concern: [] as string[],
  ingredient: [] as string[],
} satisfies FilterValues<FilterKey>

export function ProductsPage() {
  const [isDrawerOpen, setDrawerOpen] = useState(false)

  const {
    kind,
    brand,
    routine_step,
    attribute,
    skin_type,
    skin_zone,
    product_type,
    concern,
    ingredient,
  } = routeApi.useSearch()
  const navigate = useNavigate({ from: '/products/' })

  const filters: FilterValues<FilterKey> = {
    kind,
    brand,
    routine_step,
    attribute,
    skin_type,
    skin_zone,
    product_type,
    concern,
    ingredient,
  }

  const filterKeys: FilterKey[] = [
    'kind',
    'brand',
    'routine_step',
    'attribute',
    'skin_type',
    'skin_zone',
    'product_type',
    'concern',
    'ingredient',
  ]

  const filterCount =
    kind.length +
    brand.length +
    routine_step.length +
    attribute.length +
    skin_type.length +
    skin_zone.length +
    product_type.length +
    concern.length +
    ingredient.length

  const hasFilters = filterCount > 0

  const { data: filterOptions } = useQuery(productQueries.filterOptions())

  // Charge tous les ingrédients une fois — SearchSelect fait le filtre local
  const { data: allIngredients } = useQuery(ingredientQueries.all())

  const apiFilters: ListProductsFilters = hasFilters
    ? {
        kind: kind.length > 0 ? kind : undefined,
        brand: brand.length > 0 ? brand : undefined,
        concern: concern.length > 0 ? concern : undefined,
        skin_type: skin_type.length > 0 ? skin_type : undefined,
        skin_zone: skin_zone.length > 0 ? skin_zone : undefined,
        product_type: product_type.length > 0 ? product_type : undefined,
        attribute: attribute.length > 0 ? attribute : undefined,
        routine_step: routine_step.length > 0 ? routine_step : undefined,
        ingredient: ingredient.length > 0 ? ingredient : undefined,
        page: 1,
        limit: 20,
      }
    : {}

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...productQueries.list(apiFilters),
    placeholderData: (prev) => prev,
    enabled: hasFilters,
  })

  const filterFields = useMemo<FilterFieldConfig<FilterKey>[]>(() => {
    if (!filterOptions) return []

    const tagsByCategory = new Map<FilterKey, { value: string; label: string }[]>()

    for (const [category, tagList] of Object.entries(filterOptions.tags)) {
      const config = CATEGORY_LABELS[category]
      if (!config) continue
      tagsByCategory.set(
        config.key,
        tagList.map((tag) => ({ value: tag.slug, label: tag.name }))
      )
    }

    return [
      {
        key: 'kind',
        label: 'Catégorie',
        placeholder: 'Toutes',
        options: filterOptions.kinds.map((k) => ({ value: k, label: k })),
      },
      {
        key: 'brand',
        label: 'Marque',
        placeholder: 'Rechercher une marque...',
        variant: 'search-select',
        options: filterOptions.brands.map((b) => ({ value: b, label: b })),
      },
      ...Array.from(tagsByCategory.entries()).map(([key, options]) => ({
        key,
        // biome-ignore lint: sera là
        label: CATEGORY_LABELS[key]!.label,
        placeholder: 'Tous',
        options,
      })),
      {
        key: 'ingredient' as FilterKey,
        label: 'Ingrédient',
        placeholder: 'Rechercher un ingrédient...',
        variant: 'search-select',
        options: allIngredients?.map((i) => ({ value: i.slug, label: i.name })) ?? [],
      },
    ]
  }, [filterOptions, allIngredients])

  function applyFilters(newFilters: FilterValues<FilterKey>) {
    navigate({
      search: (prev) => ({ ...prev, ...newFilters }),
      replace: true,
    })
  }

  function toggleSingleFilter(key: FilterKey, value: string) {
    const current = filters[key]
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    applyFilters({ ...filters, [key]: next })
  }

  function resetFilters() {
    navigate({ search: EMPTY_FILTERS, replace: true })
  }

  const activeTags = filterKeys.flatMap((key) => filters[key].map((value) => ({ key, value })))

  const getFilterLabel = (key: FilterKey, value: string): string => {
    const field = filterFields.find((f) => f.key === key)
    return field?.options.find((o) => o.value === value)?.label ?? value
  }

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil((total ?? 0) / 20)

  return (
    <div className={`products-page ${isPlaceholderData ? 'is-syncing' : ''}`}>
      <header className="products-header">
        <div className="products-header__banner" />

        <div className="products-header__top">
          <div className="products-header__search">
            <ProductSearch />
          </div>
          <h1 className="products-header__title">
            Produits
            {isPlaceholderData && <span className="loader-mini">...</span>}
          </h1>
          <button type="button" className="products-filter-btn" onClick={() => setDrawerOpen(true)}>
            <SlidersHorizontal size={16} />
            Filtrer
            {filterCount > 0 && <span className="products-filter-btn__count">{filterCount}</span>}
          </button>
        </div>

        {activeTags.length > 0 && (
          <div className="products-active-filters">
            {activeTags.map(({ key, value }) => (
              <button
                key={`${key}-${value}`}
                type="button"
                className="active-filter-tag"
                onClick={() => toggleSingleFilter(key, value)}
              >
                {getFilterLabel(key, value)}
                <span className="active-filter-tag__x">&times;</span>
              </button>
            ))}
            <button type="button" className="products-clear-all" onClick={resetFilters}>
              Tout effacer
            </button>
          </div>
        )}
      </header>

      <FilterDialog
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        fields={filterFields}
        currentFilters={filters}
        initial_filters={EMPTY_FILTERS}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      <main
        className="products-main"
        style={{
          opacity: isPlaceholderData ? 0.6 : 1,
          transition: 'opacity 0.2s ease-in-out',
          pointerEvents: isPlaceholderData ? 'none' : 'auto',
        }}
      >
        {!hasFilters ? (
          <div className="products-browse">
            <div className="products-browse__icon">
              <Search size={24} />
            </div>
            <h2 className="products-browse__title">Explorez les produits</h2>
            <p className="products-browse__subtitle">
              Utilisez le bouton Filtrer pour sélectionner une catégorie, une marque ou un concern.
            </p>
          </div>
        ) : isLoading && !isPlaceholderData ? (
          <div className="products-browse">
            <div className="products-browse__icon">
              <Package size={24} />
            </div>
            <p className="products-browse__subtitle">Chargement...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="products-browse">
            <div className="products-browse__icon">
              <Package size={24} />
            </div>
            <h2 className="products-browse__title">Aucun produit trouvé</h2>
            <p className="products-browse__subtitle">
              Essayez de modifier vos filtres pour trouver des produits.
            </p>
          </div>
        ) : (
          <>
            <div className="products-results-info">
              <span className="products-results-count">
                {total} produit{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
              </span>
            </div>

            <div className="products-grid">
              {items.map((product) => (
                <Link
                  key={product.id}
                  to="/products/$slug"
                  params={{ slug: product.slug }}
                  className={`product-card ${kindCardClass(product.kind)}`}
                >
                  <div className={`product-card__icon ${kindIconClass(product.kind)}`}>
                    <Package size={20} />
                  </div>
                  <div className="product-card__body">
                    <div className="product-card__name">{product.name}</div>
                    <div className="product-card__brand">{product.brand}</div>
                    <div className="product-card__meta">
                      <span className={`product-card__kind ${kindBadgeClass(product.kind)}`}>
                        {product.kind}
                      </span>
                      {product.unit && <span className="product-card__tag">{product.unit}</span>}
                    </div>
                  </div>
                  {product.priceCents != null && (
                    <span className="product-card__price">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(product.priceCents / 100)}
                    </span>
                  )}
                  <ChevronRight size={18} className="product-card__arrow" />
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="products-pagination">
                <button
                  type="button"
                  className="products-pagination__btn"
                  disabled={true}
                  onClick={() => {}}
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="products-pagination__info">1 / {totalPages}</span>
                <button
                  type="button"
                  className="products-pagination__btn"
                  disabled={true}
                  onClick={() => {}}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
