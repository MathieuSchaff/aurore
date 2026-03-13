import { useQuery } from '@tanstack/react-query'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  FlaskConical,
  Leaf,
  Package,
  Pill,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Sun,
} from 'lucide-react'
import { useMemo, useState } from 'react'

const KIND_ICONS: Record<string, React.ElementType> = {
  skincare: Sparkles,
  complément: Pill,
  huile: Droplets,
  vitamine: Sun,
  sérum: FlaskConical,
  masque: Leaf,
  // fallback
  default: Package,
}

function KindIcon({ kind, size = 18 }: { kind: string; size?: number }) {
  const Icon = KIND_ICONS[kind] ?? KIND_ICONS.default
  return <Icon size={size} />
}

import { ingredientQueries } from '../../../lib/queries/ingredients'
import { type ListProductsFilters, productQueries } from '../../../lib/queries/products'
import { FilterDialog, type FilterFieldConfig, type FilterValues } from '../../Filter/Filter'

import './ProductsPage.css'

import { SearchCombobox } from '@/component/search/SearchCombobox'
import { AddToInventoryModal } from '../../stock/AddToInventoryModal'

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

/** Retourne la classe modificatrice `.kind--*` (kinds-shared.css). */
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
  const [modalProduct, setModalProduct] = useState<{
    id: string
    name: string
    brand: string
    priceCents?: number | null
  } | null>(null)

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
    page,
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
        page,
        limit: 20,
      }
    : {}

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...productQueries.list(apiFilters),
    placeholderData: hasFilters ? (prev) => prev : undefined,
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
    const desiredOrder: FilterKey[] = [
      'skin_zone', // Zone
      'attribute', // Caractéristiques
      'product_type', // Type de produit
      'concern', // Cibles
      'routine_step', // Étape routine
      'skin_type', // Type de peau
      //
    ]
    const orderedEntries = Array.from(tagsByCategory.entries())
      .sort(([keyA], [keyB]) => {
        const indexA = desiredOrder.indexOf(keyA)
        const indexB = desiredOrder.indexOf(keyB)

        // Si un des deux n'est pas dans l'ordre désiré =>  on le met à la fin
        if (indexA === -1 && indexB === -1) return 0
        if (indexA === -1) return 1 // keyA inconnu => après
        if (indexB === -1) return -1 // keyB inconnu => après

        return indexA - indexB
      })
      .map(([key, options]) => ({
        key,
        // biome-ignore lint: la clé sera là!!
        label: CATEGORY_LABELS[key]!.label,
        placeholder: 'Tous',
        options,
      }))
    return [
      {
        key: 'brand',
        label: 'Marque',
        placeholder: 'Rechercher une marque...',
        variant: 'search-select',
        options: filterOptions.brands.map((b) => ({ value: b, label: b })),
      },
      ...orderedEntries,
      {
        key: 'ingredient' as FilterKey,
        label: 'Ingrédient',
        placeholder: 'Rechercher un ingrédient...',
        variant: 'search-select',
        options: allIngredients?.items.map((i) => ({ value: i.slug, label: i.name })) ?? [],
      },

      {
        key: 'kind',
        label: 'Catégorie',
        placeholder: 'Toutes',
        options: filterOptions.kinds.map((k) => ({ value: k, label: k })),
      },
    ]
  }, [filterOptions, allIngredients])

  function applyFilters(newFilters: FilterValues<FilterKey>) {
    navigate({
      search: (prev) => ({ ...prev, ...newFilters, page: 1 }),
      // replace: true,
    })
  }

  function goToPage(newPage: number) {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) })
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
    <>
    <div className={`list-page${isPlaceholderData ? ' is-syncing' : ''}`}>
      <header className="list-header">
        <div className="page-banner" />

        <div className="list-header__top">
          <div className="list-header__search">
            <SearchCombobox
              queryFn={productQueries.search}
              toResult={(item) => ({
                id: item.id,
                slug: item.slug,
                label: item.name,
                sublabel: item.brand,
              })}
              onSelect={(slug) => navigate({ to: '/products/$slug', params: { slug } })}
            />
          </div>
          <h1 className="list-header__title">
            Produits
            {isPlaceholderData && <span className="loader-mini">...</span>}
          </h1>
          <button type="button" className="list-filter-btn" onClick={() => setDrawerOpen(true)}>
            <SlidersHorizontal size={16} />
            Filtrer
            {filterCount > 0 && <span className="list-filter-btn__count">{filterCount}</span>}
          </button>
        </div>

        {activeTags.length > 0 && (
          <div className="list-active-filters">
            {activeTags.map(({ key, value }) => (
              <button
                key={`${key}-${value}`}
                type="button"
                className="list-active-filter-tag"
                onClick={() => toggleSingleFilter(key, value)}
              >
                {getFilterLabel(key, value)}
                <span className="list-active-filter-tag__x">&times;</span>
              </button>
            ))}
            <button type="button" className="list-clear-all" onClick={resetFilters}>
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
        className="list-main"
        style={{
          opacity: isPlaceholderData ? 0.6 : 1,
          transition: 'opacity 0.2s ease-in-out',
          pointerEvents: isPlaceholderData ? 'none' : 'auto',
        }}
      >
        {!hasFilters ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <Search size={24} />
            </div>
            <h2 className="empty-state__title">Explorez les produits</h2>
            <p className="empty-state__subtitle">
              Utilisez le bouton Filtrer pour sélectionner une catégorie, une marque ou un concern.
            </p>
          </div>
        ) : isLoading && !isPlaceholderData ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <Package size={24} />
            </div>
            <p className="empty-state__subtitle">Chargement...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <Package size={24} />
            </div>
            <h2 className="empty-state__title">Aucun produit trouvé</h2>
            <p className="empty-state__subtitle">
              Essayez de modifier vos filtres pour trouver des produits.
            </p>
          </div>
        ) : (
          <>
            <div className="list-results-info">
              <span className="list-results-count">
                {total} produit{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
              </span>
            </div>

            <div className="list-grid">
              {items.map((product) => (
                <Link
                  key={product.id}
                  to="/products/$slug"
                  params={{ slug: product.slug }}
                  className={`list-card kind-border ${kindClass(product.kind)}`}
                >
                  <div className={`list-card__icon icon-box kind-icon ${kindClass(product.kind)}`}>
                    <KindIcon kind={product.kind} size={18} />
                  </div>
                  <div className="list-card__body">
                    <div className="list-card__name">{product.name}</div>
                    <div className="product-card__brand">{product.brand}</div>
                    <div className="product-card__meta">
                      <span className={`product-card__kind kind-badge ${kindClass(product.kind)}`}>
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
                  <button
                    type="button"
                    className="list-card__add-btn"
                    aria-label={`Ajouter ${product.name} à l'inventaire`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setModalProduct({
                        id: product.id,
                        name: product.name,
                        brand: product.brand,
                        priceCents: product.priceCents,
                      })
                    }}
                  >
                    <Plus size={14} />
                  </button>
                  <ChevronRight size={18} className="nav-arrow" />
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="list-pagination">
                <button
                  type="button"
                  className="list-pagination__btn"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="list-pagination__info">
                  {page} / {totalPages}
                </span>

                <button
                  type="button"
                  className="list-pagination__btn"
                  disabled={page >= totalPages}
                  onClick={() => goToPage(page + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>

    {modalProduct && (
      <AddToInventoryModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
        onSuccess={() => setModalProduct(null)}
      />
    )}
    </>
  )
}
