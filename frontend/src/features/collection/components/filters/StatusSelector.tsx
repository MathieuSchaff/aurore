/**
 * StatusSelector — Barre de sélection des 6 statuts produit.
 *
 * Utilisé dans les formulaires de filtres et les modales d'ajout.
 * Les statuts sont importés depuis constants.ts (source de vérité unique).
 */

import type { UserProductStatus } from '@habit-tracker/shared'

import clsx from 'clsx'

import { statusLabels } from '../../constants'

interface StatusSelectorProps {
  value: UserProductStatus
  onChange: (status: UserProductStatus) => void
}

export function StatusSelector({ value, onChange }: StatusSelectorProps) {
  return (
    <fieldset className="status-selector">
      <legend className="sr-only">Statut du produit</legend>
      {(Object.keys(statusLabels) as UserProductStatus[]).map((s) => {
        const cfg = statusLabels[s]
        const Icon = cfg.icon
        return (
          <button
            key={s}
            type="button"
            className={clsx('status-option', value === s && 'active')}
            aria-pressed={value === s}
            onClick={() => onChange(s)}
          >
            <Icon size={18} />
            <span>{cfg.label}</span>
          </button>
        )
      })}
    </fieldset>
  )
}
