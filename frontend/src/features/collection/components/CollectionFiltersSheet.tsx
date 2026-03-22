import type { RepurchaseFlag } from '@habit-tracker/shared'

import { X } from 'lucide-react'
import { useEffect } from 'react'

import { useScrollLock } from '../../../hooks/useScrollLock'
import { sentimentEmojis } from '../constants'

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

export function CollectionFiltersSheet({
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
                onChange={(e) =>
                  setFilterRepurchase(e.target.value as RepurchaseFlag | 'all')
                }
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
