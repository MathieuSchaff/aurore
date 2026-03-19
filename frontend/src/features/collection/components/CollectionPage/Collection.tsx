import type { RepurchaseFlag, UserProductStatus } from '@habit-tracker/shared'

import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import {
  Archive,
  ArrowUpDown,
  Ban,
  BarChart3,
  ChevronDown,
  Eye,
  Heart,
  History,
  Package,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { useScrollLock } from '../../../../hooks/useScrollLock'
import { calculateWeightedScore } from '../../../../lib/helpers/reviews'
import { productStockQueries, useAddStockEntry } from '../../../../lib/queries/stock'
import { userPreferenceQueries } from '../../../../lib/queries/user-preferences'
import {
  useDeleteUserProduct,
  userProductQueries,
  useUpdateUserProduct,
  useUpsertUserProductReview,
} from '../../../../lib/queries/user-products'
import { CollectionInsights } from './CollectionInsights'
import { QuickAddModal } from '../QuickAddModal/QuickAddModal'

import './Collection.css'

type Tab = 'collection' | 'history' | 'insights'
type SortOption = 'name' | 'note' | 'sentiment' | 'qty' | 'date' | 'price_asc' | 'price_desc'

const statusLabels: Record<UserProductStatus, { label: string; icon: any; color: string }> = {
  in_stock: { label: 'En stock', icon: Package, color: '#10b981' },
  wishlist: { label: 'Wishlist', icon: ShoppingBag, color: '#3b82f6' },
  watched: { label: 'Surveille', icon: Eye, color: '#f59e0b' },
  holy_grail: { label: 'Saint Graal', icon: Heart, color: '#ef4444' },
  archived: { label: 'Archivé', icon: Archive, color: '#6b7280' },
  avoided: { label: 'À éviter', icon: Ban, color: '#000000' },
}

const sentimentEmojis: Record<number, string> = { 1: '🤢', 2: '👎', 3: '😐', 4: '👍', 5: '😍' }

const criteriaLabels: Record<string, string> = {
  tolerance: 'Tolérance',
  efficacy: 'Efficacité',
  sensoriality: 'Sensorialité',
  stability: 'Stabilité',
  mixability: 'Mixabilité',
  valueForMoney: 'Rapport Q/P',
}

const sortOptions: SortOption[] = [
  'name',
  'note',
  'sentiment',
  'qty',
  'date',
  'price_asc',
  'price_desc',
]
const sortLabels: Record<SortOption, string> = {
  name: 'Nom',
  note: 'Note',
  sentiment: 'Ressenti',
  qty: 'Quantité',
  date: 'Date',
  price_asc: 'Prix ↑',
  price_desc: 'Prix ↓',
}

// Advanced filters bottom sheet
interface FiltersSheetProps {
  filterOptions: { brands: string[]; kinds: string[] }
  filterBrand: string
  setFilterBrand: (v: string) => void
  filterKind: string
  setFilterKind: (v: string) => void
  filterSentiment: number | 'all'
  setFilterSentiment: (v: number | 'all') => void
  filterRepurchase: RepurchaseFlag | 'all'
  setFilterRepurchase: (v: RepurchaseFlag | 'all') => void
  filterMinNote: number
  setFilterMinNote: (v: number) => void
  filterMaxPrice: number | ''
  setFilterMaxPrice: (v: number | '') => void
  onReset: () => void
  onClose: () => void
}

function CollectionFiltersSheet({
  filterOptions,
  filterBrand,
  setFilterBrand,
  filterKind,
  setFilterKind,
  filterSentiment,
  setFilterSentiment,
  filterRepurchase,
  setFilterRepurchase,
  filterMinNote,
  setFilterMinNote,
  filterMaxPrice,
  setFilterMaxPrice,
  onReset,
  onClose,
}: FiltersSheetProps) {
  useScrollLock(true)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="coll-sheet-overlay">
      <button
        type="button"
        className="coll-sheet-backdrop"
        onClick={onClose}
        aria-label="Fermer les filtres"
      />
      <div className="coll-sheet" role="dialog" aria-modal="true" aria-label="Filtres avancés">
        <div className="coll-sheet-handle" aria-hidden="true" />
        <div className="coll-sheet-header">
          <h3>FILTRES</h3>
          <button
            type="button"
            className="coll-sheet-close"
            onClick={onClose}
            aria-label="Fermer les filtres"
            // biome-ignore lint/a11y/noAutofocus: intentional focus on open
            autoFocus
          >
            <X size={18} />
          </button>
        </div>

        <div className="coll-sheet-body">
          <div className="coll-adv-grid">
            <div className="coll-adv-group">
              <label htmlFor="sheet-filter-brand">Marque</label>
              <select
                id="sheet-filter-brand"
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
              >
                <option value="all">Toutes</option>
                {filterOptions.brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="coll-adv-group">
              <label htmlFor="sheet-filter-kind">Type</label>
              <select
                id="sheet-filter-kind"
                value={filterKind}
                onChange={(e) => setFilterKind(e.target.value)}
              >
                <option value="all">Tous</option>
                {filterOptions.kinds.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div className="coll-adv-group">
              <label htmlFor="sheet-filter-sentiment">Ressenti</label>
              <select
                id="sheet-filter-sentiment"
                value={filterSentiment}
                onChange={(e) =>
                  setFilterSentiment(
                    e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10)
                  )
                }
              >
                <option value="all">Tous</option>
                {[5, 4, 3, 2, 1].map((s) => (
                  <option key={s} value={s}>
                    {sentimentEmojis[s]}
                  </option>
                ))}
              </select>
            </div>

            <div className="coll-adv-group">
              <label htmlFor="sheet-filter-repurchase">Rachat ?</label>
              <select
                id="sheet-filter-repurchase"
                value={filterRepurchase}
                onChange={(e) => setFilterRepurchase(e.target.value as any)}
              >
                <option value="all">Indifférent</option>
                <option value="yes">Oui</option>
                <option value="unsure">Peut-être</option>
                <option value="no">Non</option>
              </select>
            </div>

            <div className="coll-adv-group">
              <label htmlFor="sheet-filter-note">Note min. (/20)</label>
              <input
                id="sheet-filter-note"
                type="range"
                min="0"
                max="20"
                value={filterMinNote}
                onChange={(e) => setFilterMinNote(parseInt(e.target.value, 10))}
              />
              <span className="coll-range-val">{filterMinNote}</span>
            </div>

            <div className="coll-adv-group">
              <label htmlFor="sheet-filter-price">Prix max (€)</label>
              <input
                id="sheet-filter-price"
                type="number"
                placeholder="Sans limite"
                value={filterMaxPrice}
                onChange={(e) =>
                  setFilterMaxPrice(e.target.value === '' ? '' : parseFloat(e.target.value))
                }
              />
            </div>
          </div>
        </div>

        <div className="coll-sheet-footer">
          <button type="button" className="coll-reset-btn" onClick={onReset}>
            <X size={14} />
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  )
}

export const CollectionPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('collection')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showFiltersSheet, setShowFiltersSheet] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [pendingPurchaseId, setPendingPurchaseId] = useState<string | null>(null)
  const [purchaseDate, setPurchaseDate] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<UserProductStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [filterBrand, setFilterBrand] = useState<string>('all')
  const [filterKind, setFilterKind] = useState<string>('all')
  const [filterSentiment, setFilterSentiment] = useState<number | 'all'>('all')
  const [filterRepurchase, setFilterRepurchase] = useState<RepurchaseFlag | 'all'>('all')
  const [filterMinNote, setFilterMinNote] = useState<number>(0)
  const [filterMaxPrice, setFilterMaxPrice] = useState<number | ''>('')

  const { data: prefs } = useQuery(userPreferenceQueries.get())
  const { data: userProducts, isLoading: isLoadingCollection } = useQuery(userProductQueries.list())
  const { data: entries, isLoading: isLoadingEntries } = useQuery({
    ...productStockQueries.entries(),
    enabled: activeTab === 'history',
  })

  const updateMutation = useUpdateUserProduct()
  const deleteMutation = useDeleteUserProduct()
  const reviewMutation = useUpsertUserProductReview()
  const addStockMutation = useAddStockEntry()

  const filterOptions = useMemo(() => {
    if (!userProducts) return { brands: [], kinds: [] }
    const brands = Array.from(new Set(userProducts.map((p) => p.product.brand))).sort()
    const kinds = Array.from(new Set(userProducts.map((p) => p.product.kind))).sort()
    return { brands, kinds }
  }, [userProducts])

  const hasActiveFilters =
    filterBrand !== 'all' ||
    filterKind !== 'all' ||
    filterSentiment !== 'all' ||
    filterRepurchase !== 'all' ||
    filterMinNote > 0 ||
    filterMaxPrice !== ''

  const cycleSortBy = () => {
    const idx = sortOptions.indexOf(sortBy)
    setSortBy(sortOptions[(idx + 1) % sortOptions.length])
  }

  const resetFilters = () => {
    setSelectedStatus('all')
    setFilterBrand('all')
    setFilterKind('all')
    setFilterSentiment('all')
    setFilterRepurchase('all')
    setFilterMinNote(0)
    setFilterMaxPrice('')
    setSearchQuery('')
  }

  // Memoizing this because the filter logic is getting heavy
  // TODO: Move filtering to API
  const filteredAndSortedProducts = useMemo(() => {
    if (!userProducts) return []

    const result = userProducts.filter((p) => {
      const score = calculateWeightedScore(p.review, prefs?.criteriaWeights, 'out_of_20')
      const numericScore = score ? parseFloat(score) : 0

      return (
        (selectedStatus === 'all' || p.status === selectedStatus) &&
        (p.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.product.brand.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterBrand === 'all' || p.product.brand === filterBrand) &&
        (filterKind === 'all' || p.product.kind === filterKind) &&
        (filterSentiment === 'all' || p.sentiment === filterSentiment) &&
        (filterRepurchase === 'all' || p.wouldRepurchase === filterRepurchase) &&
        numericScore >= filterMinNote &&
        (filterMaxPrice === '' || (p.product.priceCents || 0) / 100 <= filterMaxPrice)
      )
    })

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.product.name.localeCompare(b.product.name)
        case 'qty':
          return b.qty - a.qty
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
  }, [
    userProducts,
    selectedStatus,
    searchQuery,
    sortBy,
    prefs,
    filterBrand,
    filterKind,
    filterSentiment,
    filterRepurchase,
    filterMinNote,
    filterMaxPrice,
  ])

  const isLoading =
    activeTab === 'collection'
      ? isLoadingCollection
      : activeTab === 'history'
        ? isLoadingEntries
        : false

  if (isLoading) {
    return (
      <div className="coll-page-container coll-loading">
        <div className="coll-spinner" />
        <p>Récupération de vos trésors...</p>
      </div>
    )
  }

  return (
    <div className="coll-page-wrapper">
      <div className="coll-topbar">
        <span className="coll-topbar-title">Ma Collection</span>
        <button
          type="button"
          className="coll-topbar-add"
          onClick={() => setShowAddModal(true)}
          aria-label="Ajouter un produit"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="coll-icon-tabs">
        <button
          type="button"
          className={clsx('coll-icon-tab', activeTab === 'collection' && 'coll-icon-tab-active')}
          onClick={() => setActiveTab('collection')}
        >
          <Package size={18} />
          <span>Collection</span>
          {userProducts && <span className="coll-tab-badge">{userProducts.length}</span>}
        </button>
        <button
          type="button"
          className={clsx('coll-icon-tab', activeTab === 'insights' && 'coll-icon-tab-active')}
          onClick={() => setActiveTab('insights')}
        >
          <BarChart3 size={18} />
          <span>Analyses</span>
        </button>
        <button
          type="button"
          className={clsx('coll-icon-tab', activeTab === 'history' && 'coll-icon-tab-active')}
          onClick={() => setActiveTab('history')}
        >
          <History size={18} />
          <span>Achats</span>
        </button>
      </div>

      <div className="coll-page-container">
        {activeTab === 'collection' && (
          <>
            <div className="coll-controls">
              <div className="coll-search-wrapper">
                <Search className="coll-search-icon" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="coll-search-input"
                />
              </div>
              <button
                type="button"
                className="coll-sort-btn"
                onClick={cycleSortBy}
                aria-label={`Trier par ${sortLabels[sortBy]}`}
                title={`Tri : ${sortLabels[sortBy]}`}
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

            <div className="coll-filters">
              <button
                type="button"
                className={clsx('coll-filter-btn', selectedStatus === 'all' && 'active')}
                onClick={() => setSelectedStatus('all')}
              >
                Tout voir
              </button>
              {(Object.keys(statusLabels) as UserProductStatus[]).map((status) => {
                const cfg = statusLabels[status]
                const Icon = cfg.icon
                return (
                  <button
                    type="button"
                    key={status}
                    className={clsx('coll-filter-btn', selectedStatus === status && 'active')}
                    onClick={() => setSelectedStatus(status)}
                  >
                    <Icon size={12} />
                    {cfg.label}
                  </button>
                )
              })}
            </div>

            {filteredAndSortedProducts.length === 0 ? (
              <div className="coll-empty-state">
                <Package size={44} className="coll-empty-icon" />
                <h3>Aucun produit trouvé</h3>
                <p>Essayez d'ajuster vos filtres ou votre recherche.</p>
              </div>
            ) : (
              <div className="coll-grid">
                {filteredAndSortedProducts.map((p) => {
                  const statusConfig = statusLabels[p.status]
                  const StatusIcon = statusConfig.icon
                  const score = calculateWeightedScore(
                    p.review,
                    prefs?.criteriaWeights,
                    prefs?.displayScale
                  )

                  return (
                    <div
                      key={p.id}
                      className={clsx('coll-card', expandedId === p.id && 'expanded')}
                    >
                      <button
                        type="button"
                        className="coll-card-header"
                        onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                      >
                        <div className="coll-card-row">
                          <span
                            className="coll-status-dot"
                            style={{ '--dot-color': statusConfig.color } as React.CSSProperties}
                          />
                          <div className="coll-card-main">
                            <h3 className="coll-product-name">{p.product.name}</h3>
                            <p className="coll-product-brand">{p.product.brand}</p>
                          </div>
                          <div className="coll-card-aside">
                            {score && (
                              <div className="coll-score-badge">
                                <span className="coll-score-val">{score}</span>
                                {prefs?.displayScale !== 'percentage' && (
                                  <span className="coll-score-max">
                                    {prefs?.displayScale === 'out_of_5'
                                      ? '/5'
                                      : prefs?.displayScale === 'out_of_10'
                                        ? '/10'
                                        : '/20'}
                                  </span>
                                )}
                              </div>
                            )}
                            <span className="coll-status-tag" style={{ color: statusConfig.color }}>
                              <StatusIcon size={10} />
                              {statusConfig.label}
                            </span>
                          </div>
                          <ChevronDown className="coll-expand-icon" size={16} />
                        </div>
                      </button>

                      {expandedId === p.id && (
                        <div className="coll-card-details">
                          <section className="coll-status-section">
                            <h4 className="coll-section-title">STATUT DU PRODUIT</h4>
                            <div className="coll-status-picker">
                              {(Object.keys(statusLabels) as UserProductStatus[]).map((s) => {
                                const cfg = statusLabels[s]
                                const Icon = cfg.icon
                                return (
                                  <button
                                    key={s}
                                    type="button"
                                    className={clsx(
                                      'coll-status-option',
                                      p.status === s && 'active'
                                    )}
                                    onClick={() => {
                                      updateMutation.mutate({ id: p.id, input: { status: s } })
                                      if (s === 'in_stock' && p.status !== 'in_stock') {
                                        setPendingPurchaseId(p.id)
                                        setPurchaseDate(new Date().toISOString().split('T')[0])
                                        setPurchasePrice('')
                                      } else if (pendingPurchaseId === p.id) {
                                        setPendingPurchaseId(null)
                                      }
                                    }}
                                    title={cfg.label}
                                  >
                                    <Icon
                                      size={18}
                                      style={{ color: p.status === s ? 'white' : cfg.color }}
                                    />
                                    <span className="coll-status-opt-label">{cfg.label}</span>
                                  </button>
                                )
                              })}
                            </div>

                            {pendingPurchaseId === p.id && (
                              <div className="coll-purchase-form">
                                <h4 className="coll-section-title">ENREGISTRER L'ACHAT</h4>
                                <div className="coll-purchase-fields">
                                  <div className="coll-purchase-field">
                                    <label htmlFor={`purchase-date-${p.id}`}>Date d'achat</label>
                                    <input
                                      id={`purchase-date-${p.id}`}
                                      type="date"
                                      value={purchaseDate}
                                      onChange={(e) => setPurchaseDate(e.target.value)}
                                    />
                                  </div>
                                  <div className="coll-purchase-field">
                                    <label htmlFor={`purchase-price-${p.id}`}>Prix payé (€) — optionnel</label>
                                    <input
                                      id={`purchase-price-${p.id}`}
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      placeholder="0.00"
                                      value={purchasePrice}
                                      onChange={(e) => setPurchasePrice(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="coll-purchase-actions">
                                  <button
                                    type="button"
                                    className="coll-purchase-save"
                                    disabled={!purchaseDate || addStockMutation.isPending}
                                    onClick={() =>
                                      addStockMutation.mutate(
                                        {
                                          productId: p.productId,
                                          qty: 1,
                                          purchasedAt: purchaseDate,
                                          pricePaidCents: purchasePrice
                                            ? Math.round(parseFloat(purchasePrice) * 100)
                                            : undefined,
                                        },
                                        { onSuccess: () => setPendingPurchaseId(null) }
                                      )
                                    }
                                  >
                                    {addStockMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                                  </button>
                                  <button
                                    type="button"
                                    className="coll-purchase-skip"
                                    onClick={() => setPendingPurchaseId(null)}
                                  >
                                    Ignorer
                                  </button>
                                </div>
                              </div>
                            )}
                          </section>

                          <div className="coll-details-grid">
                            <section className="coll-details-section">
                              <h4 className="coll-section-title">RESSENTI RAPIDE</h4>
                              <div className="coll-quick-feeling-box">
                                <div className="coll-sentiment-selector">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                      key={s}
                                      type="button"
                                      className={clsx(
                                        'coll-sentiment-option',
                                        p.sentiment === s && 'active'
                                      )}
                                      onClick={() =>
                                        updateMutation.mutate({ id: p.id, input: { sentiment: s } })
                                      }
                                    >
                                      <span>{sentimentEmojis[s]}</span>
                                    </button>
                                  ))}
                                </div>

                                <div className="coll-repurchase-row">
                                  <span className="coll-repurchase-label">Rachat ?</span>
                                  <div className="coll-repurchase-options">
                                    {(['yes', 'unsure', 'no'] as const).map((v) => (
                                      <button
                                        key={v}
                                        type="button"
                                        className={clsx(
                                          'coll-repurchase-btn',
                                          p.wouldRepurchase === v && `active-${v}`
                                        )}
                                        onClick={() =>
                                          updateMutation.mutate({
                                            id: p.id,
                                            input: { wouldRepurchase: v },
                                          })
                                        }
                                      >
                                        {v === 'yes' ? 'Oui' : v === 'unsure' ? 'Peut-être' : 'Non'}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <textarea
                                  className="coll-quick-comment"
                                  placeholder="Un petit mot sur ce produit..."
                                  defaultValue={p.comment || ''}
                                  onBlur={(e) =>
                                    updateMutation.mutate({
                                      id: p.id,
                                      input: { comment: e.target.value },
                                    })
                                  }
                                />
                              </div>
                            </section>

                            <section className="coll-details-section">
                              <h4 className="coll-section-title">ÉVALUATION DÉTAILLÉE</h4>
                              <div className="coll-criteria-list">
                                {Object.entries(criteriaLabels).map(([key, label]) => (
                                  <div key={key} className="coll-criterion">
                                    <span className="coll-criterion-label">{label}</span>
                                    <div className="coll-criterion-stars">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          key={star}
                                          type="button"
                                          className="coll-star-btn"
                                          onClick={() =>
                                            reviewMutation.mutate({
                                              id: p.id,
                                              input: { [key]: star },
                                            })
                                          }
                                        >
                                          <Star
                                            size={16}
                                            className={clsx(
                                              'coll-star-icon',
                                              (p.review as any)?.[key] >= star && 'filled'
                                            )}
                                          />
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </section>
                          </div>

                          <div className="coll-card-footer">
                            <span className="coll-updated-at">
                              Mis à jour le {new Date(p.updatedAt).toLocaleDateString()}
                            </span>
                            <button
                              type="button"
                              className="coll-delete-btn"
                              onClick={() => {
                                if (confirm('Retirer ce produit de votre collection ?')) {
                                  deleteMutation.mutate(p.id)
                                }
                              }}
                            >
                              <Trash2 size={14} />
                              Retirer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'insights' && userProducts && (
          <CollectionInsights userProducts={userProducts} />
        )}

        {activeTab === 'history' && (
          <div className="coll-history-view">
            {!entries || entries.length === 0 ? (
              <div className="coll-empty-state">
                <History size={44} className="coll-empty-icon" />
                <h3>Aucun achat enregistré</h3>
                <p>Vos entrées de stock apparaîtront ici.</p>
              </div>
            ) : (
              <div className="coll-history-table">
                <div className="coll-history-head">
                  <span>Date</span>
                  <span>Produit</span>
                  <span>Qté</span>
                  <span>Prix</span>
                </div>
                {entries.map((entry) => (
                  <div key={entry.id} className="coll-history-row">
                    <div className="coll-hist-row-top">
                      <span className="coll-hist-date">
                        {new Date(entry.purchasedAt).toLocaleDateString()}
                      </span>
                      <div className="coll-hist-prod">
                        <span className="coll-hist-name">{entry.product.name}</span>
                        <span className="coll-hist-brand">{entry.product.brand}</span>
                      </div>
                    </div>
                    <div className="coll-hist-row-bottom">
                      <span className="coll-hist-qty">+{entry.qty}</span>
                      <span className="coll-hist-price">
                        {entry.pricePaidCents ? `${(entry.pricePaidCents / 100).toFixed(2)}€` : '—'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showFiltersSheet && (
        <CollectionFiltersSheet
          filterOptions={filterOptions}
          filterBrand={filterBrand}
          setFilterBrand={setFilterBrand}
          filterKind={filterKind}
          setFilterKind={setFilterKind}
          filterSentiment={filterSentiment}
          setFilterSentiment={setFilterSentiment}
          filterRepurchase={filterRepurchase}
          setFilterRepurchase={setFilterRepurchase}
          filterMinNote={filterMinNote}
          setFilterMinNote={setFilterMinNote}
          filterMaxPrice={filterMaxPrice}
          setFilterMaxPrice={setFilterMaxPrice}
          onReset={() => {
            resetFilters()
            setShowFiltersSheet(false)
          }}
          onClose={() => setShowFiltersSheet(false)}
        />
      )}

      {showAddModal && <QuickAddModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
