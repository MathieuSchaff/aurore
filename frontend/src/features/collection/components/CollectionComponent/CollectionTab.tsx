import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import clsx from 'clsx'
import { ArrowUpDown, Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'

import { calculateWeightedScore } from '../../../../lib/helpers/reviews'
import { userPreferenceQueries } from '../../../../lib/queries/user-preferences'
import type { UserProduct } from '../../../../lib/queries/user-products'
import { useUpdateUserProduct } from '../../../../lib/queries/user-products'
import type { CollectionSearch } from '../../../../routes/_authenticated/collection'
import { sortLabels, sortOptions } from '../../constants'
import { CollectionFiltersSheet } from './CollectionFiltersSheet'
import { CollectionProductCard } from './CollectionProductCard'
import { ShelfView } from './ShelfView/ShelfView'
import './CollectionTab.css'

const routeApi = getRouteApi('/_authenticated/collection')

interface CollectionTabProps {
  userProducts: UserProduct[] | undefined
}

export function CollectionTab({ userProducts }: CollectionTabProps) {
  /* ── Données propres à l'onglet Collection ── */
  const { data: prefs } = useQuery(userPreferenceQueries.get())
  const navigate = routeApi.useNavigate()
  const { q, sort, brand, kind, sentiment, repurchase, minNote, maxPrice } = routeApi.useSearch()

  /* ── État UI local (non persisté dans l'URL) ── */
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  const [showFiltersSheet, setShowFiltersSheet] = useState(false)

  const updateMutation = useUpdateUserProduct()

  /* ── Helper pour mettre à jour les search params ── */
  const setSearch = (updates: Partial<CollectionSearch>) => {
    navigate({ search: (prev) => ({ ...prev, ...updates }) })
  }

  /* ── Options dynamiques pour les selects de filtres ── */
  const filterOptions = useMemo(() => {
    if (!userProducts) return { brands: [], kinds: [] }
    const brands = Array.from(new Set(userProducts.map((p) => p.product.brand))).sort()
    const kinds = Array.from(new Set(userProducts.map((p) => p.product.kind))).sort()
    return { brands, kinds }
  }, [userProducts])

  /* ── Filtrage et tri côté client (TODO: migrer vers l'API) ── */
  const filteredAndSortedProducts = useMemo(() => {
    if (!userProducts) return []
    const result = userProducts.filter((p) => {
      const score = calculateWeightedScore(p.review, prefs?.criteriaWeights, 'out_of_20')
      const numericScore = score ? parseFloat(score) : 0

      return (
        (p.product.name.toLowerCase().includes(q.toLowerCase()) ||
          p.product.brand.toLowerCase().includes(q.toLowerCase())) &&
        (brand === 'all' || p.product.brand === brand) &&
        (kind === 'all' || p.product.kind === kind) &&
        (sentiment === 'all' || p.sentiment === sentiment) &&
        (repurchase === 'all' || p.wouldRepurchase === repurchase) &&
        numericScore >= minNote &&
        (maxPrice === '' || (p.product.priceCents || 0) / 100 <= maxPrice)
      )
    })

    result.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.product.name.localeCompare(b.product.name)
        case 'sentiment':
          return (b.sentiment || 0) - (a.sentiment || 0)
        case 'note': {
          const sA = Number.parseFloat(
            calculateWeightedScore(a.review, prefs?.criteriaWeights, prefs?.displayScale) || '0'
          )
          const sB = Number.parseFloat(
            calculateWeightedScore(b.review, prefs?.criteriaWeights, prefs?.displayScale) || '0'
          )
          return sB - sA
        }
        case 'date':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'price_asc':
          return (a.product.priceCents || 0) - (b.product.priceCents || 0)
        case 'price_desc':
          return (b.product.priceCents || 0) - (a.product.priceCents || 0)
        default:
          return 0
      }
    })

    return result
  }, [userProducts, q, sort, prefs, brand, kind, sentiment, repurchase, minNote, maxPrice])

  const hasActiveFilters =
    brand !== 'all' ||
    kind !== 'all' ||
    sentiment !== 'all' ||
    repurchase !== 'all' ||
    minNote > 0 ||
    maxPrice !== ''

  const cycleSortBy = () => {
    const idx = sortOptions.indexOf(sort)
    setSearch({ sort: sortOptions[(idx + 1) % sortOptions.length] })
  }

  const resetFilters = () => {
    setSearch({
      brand: 'all',
      kind: 'all',
      sentiment: 'all',
      repurchase: 'all',
      minNote: 0,
      maxPrice: '',
      q: '',
    })
  }

  /* ── Loading : spinner le temps que les produits arrivent ── */
  if (!userProducts) {
    return (
      <div className="coll-page-container coll-loading">
        <div className="coll-spinner" />
        <p>Récupération de vos trésors...</p>
      </div>
    )
  }

  return (
    <>
      {/* Barre de contrôle : recherche, tri, filtres */}
      <div className="coll-controls">
        <div className="coll-search-wrapper">
          <Search className="coll-search-icon" size={16} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={q}
            onChange={(e) => setSearch({ q: e.target.value })}
            className="coll-search-input"
          />
        </div>
        <button
          type="button"
          className="coll-sort-btn"
          onClick={cycleSortBy}
          aria-label={`Trier par ${sortLabels[sort]}`}
          title={`Tri : ${sortLabels[sort]}`}
        >
          <ArrowUpDown size={16} />
        </button>
        <button
          type="button"
          className={clsx('coll-filter-toggle', hasActiveFilters && 'active')}
          onClick={() => setShowFiltersSheet(true)}
          aria-label="Filtres avancés"
          title="Filtres avancés"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* Contenu : étagères (toujours affichées, même vides) */}
      <ShelfView
        products={filteredAndSortedProducts}
        onStatusChange={(productId, newStatus) => {
          updateMutation.mutate({ id: productId, input: { status: newStatus } })
        }}
        expandedCardId={expandedId}
        onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
        criteriaWeights={prefs?.criteriaWeights}
        displayScale={prefs?.displayScale}
        renderExpandedCard={(p) => (
          <CollectionProductCard
            p={p}
            prefs={prefs}
            isExpanded={true}
            onToggleExpand={() => setExpandedId(null)}
            activeTooltip={activeTooltip}
            setActiveTooltip={setActiveTooltip}
          />
        )}
      />

      {/* Panneau de filtres avancés (bottom sheet) */}
      {showFiltersSheet && (
        <CollectionFiltersSheet
          filterOptions={filterOptions}
          filterBrand={brand}
          setFilterBrand={(v) => setSearch({ brand: v })}
          filterKind={kind}
          setFilterKind={(v) => setSearch({ kind: v })}
          filterSentiment={sentiment}
          setFilterSentiment={(v) => setSearch({ sentiment: v })}
          filterRepurchase={repurchase}
          setFilterRepurchase={(v) => setSearch({ repurchase: v })}
          filterMinNote={minNote}
          setFilterMinNote={(v) => setSearch({ minNote: v })}
          filterMaxPrice={maxPrice}
          setFilterMaxPrice={(v) => setSearch({ maxPrice: v })}
          onReset={resetFilters}
          onClose={() => setShowFiltersSheet(false)}
        />
      )}
    </>
  )
}
