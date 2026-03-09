import { ChevronDown, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import './Filter.css'

export type FilterOption = { value: string; label: string }

export type FilterFieldConfig<T extends string> = {
  key: T
  label: string
  placeholder: string
  options: FilterOption[]
  variant?: 'chips' | 'search-select'
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

type SearchSelectProps = {
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
  placeholder?: string
}

function SearchSelect({ options, selected, onToggle, placeholder }: SearchSelectProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const unselectedOptions = options.filter((o) => !selected.includes(o.value))
  const filtered = query
    ? unselectedOptions.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : unselectedOptions

  const selectedOptions = options.filter((o) => selected.includes(o.value))

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="search-select" ref={containerRef}>
      {selectedOptions.length > 0 && (
        <div className="search-select__selected">
          {selectedOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className="filter-chip filter-chip--active filter-chip--removable"
              onClick={() => onToggle(opt.value)}
            >
              {opt.label}
              <X size={12} />
            </button>
          ))}
        </div>
      )}

      <input
        type="text"
        className="search-select__input"
        placeholder={placeholder ?? 'Rechercher...'}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && filtered.length > 0 && (
        <ul className="search-select__dropdown">
          {filtered.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className="search-select__option"
                onClick={() => {
                  onToggle(opt.value)
                  setQuery('')
                  setIsOpen(false)
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {isOpen && query && filtered.length === 0 && (
        <div className="search-select__empty">Aucun résultat</div>
      )}
    </div>
  )
}
type AccordionGroupProps<T extends string> = {
  field: FilterFieldConfig<T>
  selected: string[]
  onToggle: (value: string) => void
  defaultOpen?: boolean
}

function AccordionGroup<T extends string>({
  field,
  selected,
  onToggle,
  defaultOpen = false,
}: AccordionGroupProps<T>) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="filter-accordion">
      <button
        type="button"
        className="filter-accordion__trigger"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        <span className="filter-accordion__label">{field.label}</span>
        <div className="filter-accordion__meta">
          {selected.length > 0 && (
            <span className="filter-accordion__count">{selected.length}</span>
          )}
          <ChevronDown
            size={14}
            className="filter-accordion__chevron"
            style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          />
        </div>
      </button>

      <div className="filter-accordion__body" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
        <div className="filter-accordion__inner">
          <div className="filter-drawer__chips">
            {field.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`filter-chip ${selected.includes(opt.value) ? 'filter-chip--active' : ''}`}
                onClick={() => onToggle(opt.value)}
                tabIndex={isOpen ? 0 : -1}
                aria-hidden={!isOpen}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
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
      onKeyUp={(e) => {
        if (e.key === 'Escape') handleClose()
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
            const variant = field.variant ?? 'chips'

            if (variant === 'search-select') {
              return (
                <div key={field.key} className="filter-drawer__group">
                  <span className="filter-drawer__label">{field.label}</span>
                  <SearchSelect
                    options={field.options}
                    selected={selected}
                    onToggle={(value) => handleToggle(field.key as T, value)}
                    placeholder={field.placeholder}
                  />
                </div>
              )
            }

            return (
              <AccordionGroup
                key={field.key}
                field={field}
                selected={selected}
                onToggle={(value) => handleToggle(field.key as T, value)}
                defaultOpen={selected.length > 0}
              />
            )
          })}
        </div>

        <div className="filter-drawer__footer">
          <button
            type="button"
            className="filter-drawer__reset"
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
