import type { RepurchaseFlag, UserProductStatus } from '@habit-tracker/shared'

import clsx from 'clsx'
import { X } from 'lucide-react'

import type { CollectionFilters, SortOption } from '../../../../utils/collectionFilters'
import { getSentimentEmoji } from '../../../../utils/sentimentMap'
import { statusConfig } from './StatusSelector'

interface FilterPanelProps {
  filters: CollectionFilters
  sortBy: SortOption
  brands: string[]
  kinds: string[]
  onChange: (filters: CollectionFilters) => void
  onSortChange: (sort: SortOption) => void
  onReset: () => void
}

export function FilterPanel({
  filters,
  sortBy,
  brands,
  kinds,
  onChange,
  onSortChange,
  onReset,
}: FilterPanelProps) {
  const activeFilterCount = [
    filters.status !== 'all',
    filters.brand !== 'all',
    filters.kind !== 'all',
    filters.sentiment !== 'all',
    filters.repurchase !== 'all',
    filters.minNote > 0,
    filters.maxPriceEuros !== '',
  ].filter(Boolean).length

  const update = (patch: Partial<CollectionFilters>) => onChange({ ...filters, ...patch })

  return (
    <section className="filter-panel" aria-label="Panneau de filtres">
      <div className="filter-panel__header">
        <span>Filtres</span>
        {activeFilterCount > 0 && (
          <span className="filter-panel__badge">
            <span className="sr-only">{activeFilterCount} filtre(s) actif(s)</span>
            {activeFilterCount}
          </span>
        )}
      </div>

      <div className="filter-panel__grid">
        <div className="filter-panel__group">
          <label htmlFor="filter-status">Statut</label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(e) => update({ status: e.target.value as UserProductStatus | 'all' })}
          >
            <option value="all">Tous</option>
            {(Object.keys(statusConfig) as UserProductStatus[]).map((s) => (
              <option key={s} value={s}>
                {statusConfig[s].label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-panel__group">
          <label htmlFor="filter-brand">Marque</label>
          <select
            id="filter-brand"
            value={filters.brand}
            onChange={(e) => update({ brand: e.target.value })}
          >
            <option value="all">Toutes</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-panel__group">
          <label htmlFor="filter-kind">Type</label>
          <select
            id="filter-kind"
            value={filters.kind}
            onChange={(e) => update({ kind: e.target.value })}
          >
            <option value="all">Tous</option>
            {kinds.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-panel__group">
          <label htmlFor="filter-sentiment">Ressenti</label>
          <select
            id="filter-sentiment"
            value={filters.sentiment}
            onChange={(e) =>
              update({ sentiment: e.target.value === 'all' ? 'all' : parseInt(e.target.value) })
            }
          >
            <option value="all">Tous</option>
            {[5, 4, 3, 2, 1].map((s) => (
              <option key={s} value={s}>
                {getSentimentEmoji(s)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-panel__group">
          <label htmlFor="filter-repurchase">Rachat ?</label>
          <select
            id="filter-repurchase"
            value={filters.repurchase}
            onChange={(e) => update({ repurchase: e.target.value as RepurchaseFlag | 'all' })}
          >
            <option value="all">Indifférent</option>
            <option value="yes">Oui</option>
            <option value="unsure">Peut-être</option>
            <option value="no">Non</option>
          </select>
        </div>

        <div className="filter-panel__group">
          <label htmlFor="filter-note">Note min.</label>
          <input
            id="filter-note"
            type="range"
            min={0}
            max={20}
            value={filters.minNote}
            onChange={(e) => update({ minNote: parseInt(e.target.value) })}
          />
          <span>{filters.minNote}</span>
        </div>

        <div className="filter-panel__group">
          <label htmlFor="filter-price">Prix max (€)</label>
          <input
            id="filter-price"
            type="number"
            placeholder="Sans limite"
            value={filters.maxPriceEuros}
            onChange={(e) =>
              update({ maxPriceEuros: e.target.value === '' ? '' : parseFloat(e.target.value) })
            }
          />
        </div>

        <div className="filter-panel__group">
          <label htmlFor="sort-by">Trier par</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            <option value="name">Nom</option>
            <option value="note">Note</option>
            <option value="sentiment">Sentiment</option>
            <option value="date">Date</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        className={clsx('filter-panel__reset', activeFilterCount === 0 && 'disabled')}
        onClick={onReset}
        disabled={activeFilterCount === 0}
        aria-label="Réinitialiser les filtres"
      >
        <X size={14} />
        Réinitialiser
      </button>
    </section>
  )
}
