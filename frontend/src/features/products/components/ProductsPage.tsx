import { useQuery } from '@tanstack/react-query'
import { getRouteApi, Link, useNavigate } from '@tanstack/react-router'
import { Package, Plus, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/component/Button/Button'
import { ListPagination } from '@/component/DataDisplay/Pagination/ListPagination'
import { EmptyState } from '@/component/Feedback/EmptyState/EmptyState'
import { ActiveFiltersBar } from '@/component/Filter/ActiveFiltersBar'
import {
  type FilterGroupConfig,
  type FilterOption,
  type FilterValues,
  GroupedFilterDialog,
} from '@/component/Filter/Filter'
import { PageHeader } from '@/component/Layout/PageHeader/PageHeader'
import { SearchCombobox } from '@/component/search/SearchCombobox'
import { useListFilters } from '@/hooks/useListFilters'
import { ProductIcon } from '../../../assets/product-icons'
import { ingredientQueries } from '../../../lib/queries/ingredients'
import { type ListProductsFilters, productQueries } from '../../../lib/queries/products'
import { AddToCollectionModal } from './AddToCollectionModal'

import './ListPage.css'
import './ProductsPage.css'
import '@/features/products/styles/kinds.css'

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

const TAG_CATEGORY_TO_KEY: Record<string, FilterKey> = {
  routine_step: 'routine_step',
  attribute: 'attribute',
  skin_type: 'skin_type',
  skin_zone: 'skin_zone',
  product_type: 'product_type',
  concern: 'concern',
}

const LABEL_OVERRIDES: Record<string, string> = {
  humectant: 'Hydratant',
  emollient: 'Nourrissant',
  'sebo-regulateur': 'Anti-sébum',
  'barriere-alteree': 'Peau sensibilisée',
}

const ATTRIBUTE_SUBGROUPS = [
  {
    label: 'Formulation',
    slugs: [
      'bio-naturel',
      'vegan',
      'cruelty-free',
      'sans-parfum',
      'sans-savon',
      'hypoallergenique',
      'non-comedogene',
      'grossesse-compatible',
    ],
    maxVisible: 6,
  },
  {
    label: 'Texture',
    slugs: ['texture-legere', 'texture-riche'],
  },
  {
    label: 'Action',
    slugs: [
      'apaisant',
      'humectant',
      'anti-oxydant',
      'matifiant',
      'sebo-regulateur',
      'reparateur',
      'protection-cutanee',
      'prebiotique',
    ],
    maxVisible: 6,
  },
  {
    label: 'Technique',
    slugs: [
      'keratolytique',
      'astringent',
      'antiseptique',
      'anti-bacterien',
      'biomimetique',
      'emollient',
      'barriere-alteree',
      'filtres-chimiques',
      'filtres-mineraux',
      'pigments-verts',
      'comedogene',
    ],
    maxVisible: 4,
  },
]

const GROUP_LABELS: Record<FilterKey, string> = {
  skin_type: 'Peau',
  skin_zone: 'Zone',
  concern: 'Objectif',
  kind: 'Catégorie',
  product_type: 'Type',
  routine_step: 'Étape',
  attribute: 'Préf.',
  brand: 'Marque',
  ingredient: 'Ingr.',
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

  const { filterCount, activeTags, applyFilters, resetFilters, goToPage, toggleSingleFilter } =
    useListFilters({
      from: '/products/',
      filters,
      emptyFilters: EMPTY_FILTERS,
      filterKeys,
    })

  const hasFilters = filterCount > 0

  const { data: filterOptions } = useQuery(productQueries.filterOptions())
  const { data: allIngredients } = useQuery(ingredientQueries.options())

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
    : { sort: 'random', limit: 12 }

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...productQueries.list(apiFilters),
    placeholderData: hasFilters ? (prev) => prev : undefined,
    staleTime: hasFilters ? 5 * 60 * 1000 : 0,
  })

  const filterGroups = useMemo<FilterGroupConfig<FilterKey>[]>(() => {
    if (!filterOptions) return []

    const tagsByKey = new Map<FilterKey, FilterOption[]>()
    for (const [category, tagList] of Object.entries(filterOptions.tags)) {
      const key = TAG_CATEGORY_TO_KEY[category]
      if (!key) continue
      tagsByKey.set(
        key,
        tagList.map((tag) => ({
          value: tag.slug,
          label: LABEL_OVERRIDES[tag.slug] ?? tag.name,
        }))
      )
    }

    const getOpts = (key: FilterKey): FilterOption[] => tagsByKey.get(key) ?? []

    return [
      {
        id: 'skin',
        label: 'Ma peau',
        defaultOpen: true,
        tier: 'essential',
        subFilters: [
          {
            key: 'skin_type',
            label: 'Type de peau',
            placeholder: 'Tous',
            options: getOpts('skin_type'),
          },
          { key: 'skin_zone', label: 'Zone', placeholder: 'Toutes', options: getOpts('skin_zone') },
        ],
      },
      {
        id: 'objective',
        label: 'Objectif',
        defaultOpen: true,
        tier: 'essential',
        subFilters: [
          { key: 'concern', label: 'Cibles', placeholder: 'Tous', options: getOpts('concern') },
        ],
      },
      {
        id: 'product',
        label: 'Type de produit',
        defaultOpen: false,
        tier: 'advanced',
        subFilters: [
          {
            key: 'kind',
            label: 'Catégorie',
            placeholder: 'Toutes',
            options: filterOptions.kinds.map((k) => ({ value: k, label: k })),
          },
          {
            key: 'product_type',
            label: 'Format',
            placeholder: 'Tous',
            options: getOpts('product_type'),
          },
          {
            key: 'routine_step',
            label: 'Étape routine',
            placeholder: 'Toutes',
            options: getOpts('routine_step'),
          },
        ],
      },
      {
        id: 'preferences',
        label: 'Préférences',
        defaultOpen: false,
        tier: 'advanced',
        subFilters: [
          {
            key: 'attribute',
            label: 'Caractéristiques',
            placeholder: 'Tous',
            options: getOpts('attribute'),
            subGroups: ATTRIBUTE_SUBGROUPS,
          },
        ],
      },
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
  }, [filterOptions, allIngredients])

  const getFilterLabel = (key: FilterKey, value: string): string => {
    for (const group of filterGroups) {
      for (const sf of group.subFilters) {
        if (sf.key === key) {
          return sf.options.find((o) => o.value === value)?.label ?? value
        }
      }
    }
    return value
  }

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil((total ?? 0) / 20) // only used when hasFilters (limit: 20)

  return (
    <>
      <div className={`list-page products-page${isPlaceholderData ? ' is-syncing' : ''}`}>
        <PageHeader
          title="Produits"
          isLoading={isPlaceholderData}
          meta={hasFilters ? `${total} produit${total > 1 ? 's' : ''}` : 'Découverte'}
          actions={
            <>
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
              <div className="list-header__actions-group">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => setDrawerOpen(true)}
                  className="list-filter-btn"
                >
                  <SlidersHorizontal size={14} />
                  <span>Filtrer</span>
                  {filterCount > 0 && <span className="list-filter-btn__count">{filterCount}</span>}
                </Button>
                <Button to="/products/new" variant="primary" size="md" className="list-filter-btn">
                  <Plus size={14} />
                  <span>Créer</span>
                </Button>
              </div>
            </>
          }
        />

        <ActiveFiltersBar
          activeTags={activeTags}
          groupLabels={GROUP_LABELS}
          getFilterLabel={getFilterLabel}
          onRemoveTag={toggleSingleFilter}
          onClearAll={resetFilters}
        />

        <GroupedFilterDialog
          open={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
          groups={filterGroups}
          currentFilters={filters}
          initialFilters={EMPTY_FILTERS}
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
              <div className="list-grid">
                {items.map((product) => (
                  <div
                    key={product.id}
                    className={`list-card list-card--product ${kindClass(product.kind)} ${unitClass(product.unit)}`}
                  >
                    <div className="list-card__bar" />
                    <div className="list-card__inner">
                      <Link
                        to="/products/$slug"
                        params={{ slug: product.slug }}
                        className="list-card__header"
                      >
                        <div className="list-card__header-top">
                          <span className="list-card__kind">{product.kind}</span>
                          <div className="list-card__icon-wrap">
                            <ProductIcon unit={product.unit} kind={product.kind} size={18} />
                          </div>
                        </div>
                        <span className="list-card__brand">{product.brand}</span>
                        <p className="list-card__name">{product.name}</p>
                      </Link>

                      <div className="list-card__footer">
                        <div className="list-card__price-wrap">
                          {product.priceCents != null && (
                            <span className="list-card__price">
                              {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'EUR',
                              }).format(product.priceCents / 100)}
                            </span>
                          )}
                          {product.unit && (
                            <span className="list-card__unit-chip">{product.unit}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          className="list-card__add-btn"
                          aria-label={`Ajouter ${product.name} à la collection`}
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
                          <span>Ajouter</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasFilters && (
                <ListPagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              )}
            </>
          )}
        </main>
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
