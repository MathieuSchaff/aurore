import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

import './Filter.css'

import { useState } from 'react'

export type FilterOption = { value: string; label: string }

export type FilterFieldConfig<T extends string> = {
  key: T
  label: string
  placeholder: string
  options: FilterOption[]
}
export type FilterValues<T extends string> = Record<T, string[]>

type FilterDialogProps<T extends string> = {
  open: boolean
  onClose: () => void
  fields: FilterFieldConfig<T>[]
  currentFilters: FilterValues<T>
  onApply: (filters: FilterValues<T>) => void
  onReset: () => void
  initial_filters: FilterValues<T>
}

export function FilterDialog<T extends string>({
  open,
  onClose,
  fields,
  currentFilters,
  onApply,
  onReset,
  initial_filters,
}: FilterDialogProps<T>) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // 1. État local pour "stocker" les clics avant de valider
  const [localFilters, setLocalFilters] = useState<FilterValues<T>>(currentFilters)

  useEffect(() => {
    if (open) {
      setLocalFilters(currentFilters)
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [open, currentFilters])

  const handleToggle = (key: T, value: string) => {
    setLocalFilters((prev) => {
      const current = prev[key] ?? []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [key]: next }
    })
  }

  const handleClose = () => {
    onApply(localFilters)
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="filter-drawer"
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose()
      }}
      onCancel={handleClose}
    >
      <div className="filter-drawer__panel">
        <div className="filter-drawer__header">
          <h2 className="filter-drawer__title">Filtres</h2>
          <button type="button" className="filter-drawer__close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="filter-drawer__body">
          {fields.map((field) => {
            const selected = localFilters[field.key as T] ?? []
            return (
              <div key={field.key} className="filter-drawer__group">
                <span className="filter-drawer__label">{field.label}</span>
                <div className="filter-drawer__chips">
                  {field.options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`filter-chip ${selected.includes(opt.value) ? 'filter-chip--active' : ''}`}
                      onClick={() => handleToggle(field.key as T, opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <div className="filter-drawer__footer">
          <button
            type="button"
            onClick={() => {
              setLocalFilters(initial_filters)
              onReset()
            }}
          >
            Réinitialiser
          </button>
          <button type="button" className="filter-drawer__apply" onClick={handleClose}>
            Appliquer
          </button>
        </div>
      </div>
    </dialog>
  )
}
