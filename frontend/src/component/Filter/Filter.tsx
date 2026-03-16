import { ChevronDown, X } from 'lucide-react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import './Filter.css'

import { useScrollLock } from '@/hooks/useScrollLock'

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
  label: string
  'aria-labelledby'?: string
}

// Hook qui permet de rester dans le filtre.
// Quand on est sur le dernier élément > on tab > on va sur prem!ier élément et inversement.
function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [isActive, containerRef])
}

function SearchSelect({
  options,
  selected,
  onToggle,
  placeholder,
  label,
  'aria-labelledby': ariaLabelledBy,
}: SearchSelectProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const clickOutsideContainer = useRef<HTMLDivElement>(null)
  const PAGE_SIZE = 50
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  useEffect(() => setVisibleCount(PAGE_SIZE), [query])

  const inputRef = useRef<HTMLInputElement>(null)
  // pour lier l'input a la liste
  const listboxId = useId()
  //  Les options, je veux pas celle sélectionnés fdéjà
  const unselectedOptions = options.filter((o) => !selected.includes(o.value))
  // si l'utilisateur a taper quelque chose => on prend les options qui sont pas déjà selectionnés
  const filtered = useMemo(() => {
    const unselected = options.filter((o) => !selected.includes(o.value))
    const result = query
      ? unselected.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
      : unselected
    return result.slice(0, visibleCount)
  }, [options, selected, query, visibleCount])

  const selectedOptions = options.filter((o) => selected.includes(o.value))
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setVisibleCount((prev) => prev + PAGE_SIZE)
    }
  }
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault() // empeche le scroll de la page
          if (!isOpen) {
            // ouvre liste
            setIsOpen(true)
            setActiveIndex(0)
          } else {
            // on descend, mais on fait gaff si on es sur le dernier élément.
            setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev))
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          // on monte, mais on fait gaff si on es sur le premier élément.
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1))
          if (activeIndex === 0) {
            inputRef.current?.focus()
          }
          break
        case 'Enter':
          e.preventDefault()
          if (isOpen && activeIndex >= 0 && filtered[activeIndex]) {
            onToggle(filtered[activeIndex].value)
            setQuery('')
            setActiveIndex(-1)
          } else {
            setIsOpen(true)
          }
          break
        case 'Escape':
          // si double escape > on ferme le dialog. Le escape est propagé au parent.
          if (isOpen) {
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(false)
            setActiveIndex(-1)
            inputRef.current?.focus()
          }
          break
        case 'Tab':
          // on sort du select : est-ce que c'est aria accessibel? A voir....
          setIsOpen(false)
          setActiveIndex(-1)
          break
      }
    },
    [isOpen, activeIndex, filtered, onToggle]
  )
  // ferme la liste si on clique ailleurs
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        clickOutsideContainer.current &&
        !clickOutsideContainer.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
        setQuery('')
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  // scroll vers l'options surlignée: pas forcément nécessaire
  useEffect(() => {
    if (activeIndex >= 0 && isOpen) {
      const element = document.getElementById(`${listboxId}-option-${activeIndex}`)
      element?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex, isOpen, listboxId])

  // const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  //   const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
  //   console.log('scrollTop', scrollTop)
  //   console.log('scrollHeight', scrollHeight)
  //   console.log('clientHeight', clientHeight)
  //   if (scrollTop + clientHeight >= scrollHeight) {
  //     // On est en bas, charger plus d'options
  //     console.log('the end')
  //     // loadMoreOptions();
  //   }
  // }
  return (
    <div className="search-select">
      {selectedOptions.length > 0 && (
        <div className="search-select__selected">
          {selectedOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className="filter-chip filter-chip--active filter-chip--removable"
              onClick={() => onToggle(opt.value)}
              aria-label={`Retirer ${opt.label}`}
            >
              {opt.label}
              <X size={12} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
      <div ref={clickOutsideContainer}>
        <div className="search-select__input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="search-select__input"
            placeholder={placeholder ?? 'Rechercher...'}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
              setActiveIndex(-1)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls={isOpen ? listboxId : undefined}
            aria-activedescendant={
              activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
            }
            aria-labelledby={ariaLabelledBy}
          />
          {isOpen && (
            <button
              type="button"
              className="search-select__dismiss"
              onMouseDown={(e) => {
                // onMouseDown + preventDefault pour ne pas blur l'input avant le clic
                e.preventDefault()
                setIsOpen(false)
                setQuery('')
                setActiveIndex(-1)
                inputRef.current?.focus()
              }}
              tabIndex={-1}
              aria-label="Fermer la liste"
            >
              <ChevronDown size={14} aria-hidden="true" style={{ transform: 'rotate(180deg)' }} />
            </button>
          )}
        </div>

        {isOpen && filtered.length > 0 && (
          <div
            id={listboxId}
            className="search-select__dropdown"
            role="listbox"
            aria-label={`Suggestions pour ${label}`}
            onScroll={handleScroll}
          >
            {filtered.map((opt, index) => (
              <div
                key={opt.value}
                role="option"
                id={`${listboxId}-option-${index}`}
                aria-selected={index === activeIndex} // Dit si c'est l'élément surligné
                tabIndex={-1} // Pas focusable par Tab (on gère avec les flèches)
                className={`search-select__option-wrapper ${index === activeIndex ? 'search-select__option--active' : ''}`}
                onClick={() => {
                  onToggle(opt.value)
                  setQuery('')
                  setIsOpen(false)
                  setActiveIndex(-1)
                  inputRef.current?.focus() // On remet le focus sur l'input pour continuer à taper.
                  // Ca permet de pas etre sorti du input si on veut sélectionner d'autres trucs.
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onToggle(opt.value)
                    setQuery('')
                    setIsOpen(false)
                    setActiveIndex(-1)
                    inputRef.current?.focus()
                  }
                }}
              >
                <span className="search-select__option">{opt.label}</span>
              </div>
            ))}
          </div>
        )}

        {isOpen && query && filtered.length === 0 && (
          <output className="search-select__empty">Aucun résultat</output>
        )}
      </div>
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
  const buttonAccordion = useRef<HTMLButtonElement>(null)
  const contentId = useId()
  const headerId = useId()
  const escapeOnOptions = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      e.preventDefault()
      setIsOpen(false)
      buttonAccordion.current?.focus()
    }
  }
  return (
    <div className="filter-accordion">
      <button
        type="button"
        id={headerId}
        className="filter-accordion__trigger"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen} // Dit aux lecteurs d'écran si c'est ouvert
        aria-controls={contentId} // Dit quel élément est contrôlé (le contenu en dessous)
        ref={buttonAccordion}
      >
        <span className="filter-accordion__label">{field.label}</span>
        <div className="filter-accordion__meta">
          {selected.length > 0 && (
            <span className="filter-accordion__count" title={`${selected.length} filtres actifs`}>
              {selected.length}
            </span>
          )}
          <ChevronDown
            size={14}
            className="filter-accordion__chevron"
            style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
            aria-hidden="true"
          />
        </div>
      </button>
      <section
        id={contentId}
        className="filter-accordion__body"
        aria-labelledby={headerId} // Lie le contenu au bouton (accessibilité)
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
        aria-hidden={!isOpen}
      >
        <div className="filter-accordion__inner">
          <fieldset className="filter-drawer__chips">
            <legend className="sr-only">Options pour {field.label}</legend>
            {field.options.map((opt) => {
              const isSelected = selected.includes(opt.value) // Est-ce que c'est déjà sélectionné ?
              return (
                <button
                  key={opt.value}
                  type="button"
                  className={`filter-chip ${isSelected ? 'filter-chip--active' : ''}`}
                  onClick={() => onToggle(opt.value)}
                  aria-pressed={isSelected}
                  onKeyDown={escapeOnOptions}
                  tabIndex={isOpen ? 0 : -1}
                >
                  {opt.label}
                </button>
              )
            })}
          </fieldset>
        </div>
      </section>
    </div>
  )
}

// Composant pour éviter d'appeler useId dans une boucle
type FilterFieldItemProps<T extends string> = {
  field: FilterFieldConfig<T>
  selected: string[]
  onToggle: (value: string) => void
  labelId: string
}

function FilterFieldItem<T extends string>({
  field,
  selected,
  onToggle,
  labelId,
}: FilterFieldItemProps<T>) {
  const variant = field.variant ?? 'chips'

  if (variant === 'search-select') {
    return (
      <div className="filter-drawer__group">
        <span id={labelId} className="filter-drawer__label">
          {field.label}
        </span>
        <SearchSelect
          options={field.options}
          selected={selected}
          onToggle={(value) => onToggle(value)}
          placeholder={field.placeholder}
          label={field.label}
          aria-labelledby={labelId}
        />
      </div>
    )
  }

  return (
    <AccordionGroup
      field={field}
      selected={selected}
      onToggle={(value) => onToggle(value)}
      defaultOpen={selected.length > 0}
    />
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
  const panelRef = useRef<HTMLDivElement>(null)
  const [localFilters, setLocalFilters] = useState<FilterValues<T>>(currentFilters)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useScrollLock(open)
  useFocusTrap(open, panelRef)

  // Générer tous les IDs avant le render
  const labelIds = useMemo(() => {
    return fields.map(() => Math.random().toString(36).substr(2, 9))
  }, [fields])
  // on set l'élément qui était focus avant comme étant le previousRef (le filter bouton)
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }
  }, [open])

  const handleClose = useCallback(() => {
    onApply(localFilters)
    onClose()
    setTimeout(
      () =>
        // focus sur le bouton qui avait permit d'ouvrir la modale
        previousFocusRef.current?.focus(),
      0
    )
  }, [localFilters, onApply, onClose])

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
  // Intercepte le cancel natif du dialogue
  // on remplace par handleClose
  const handleCancel = (e: React.UIEvent<HTMLDialogElement>) => {
    e.preventDefault()
    handleClose()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose()
    }
  }
  const handleArrowNav = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return

    const target = e.target as HTMLElement

    // Trouve le trigger : soit c'est le target, soit on remonte au parent accordéon
    const accordion = target.closest('.filter-accordion')
    if (!accordion) return

    const trigger = accordion.querySelector<HTMLElement>('.filter-accordion__trigger')
    if (!trigger) return

    e.preventDefault()

    const form = e.currentTarget as HTMLElement
    const triggers = Array.from(form.querySelectorAll<HTMLElement>('.filter-accordion__trigger'))

    const currentIndex = triggers.indexOf(trigger)
    if (currentIndex === -1) return

    let nextIndex: number
    if (e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % triggers.length
    } else {
      nextIndex = (currentIndex - 1 + triggers.length) % triggers.length
    }

    triggers[nextIndex]?.focus()
  }
  const titleId = useId()
  // A l'attention de moi plus tard. Si je désactive le lint c'est parceque:
  // ca sert a rien de rajouter un onKeyUp ou down...
  // il veut que je rajoute ça car si on met un onCLick su run élément non-interactif ( div,  span)
  //  il faut un event handle alcvier pour l'accéssibilité
  // mais ici c'est un dialogue. Le clic sur le backdrop n'est pas une élément accessible
  // Le backdrop n'est pas focusable, donc un handle clavier sur le backdrop n'a pas de sens
  // CQFD
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: le backdrop peut pas être focus.
    <dialog
      ref={dialogRef}
      className="filter-drawer"
      aria-labelledby={titleId}
      aria-modal="true"
      onClick={handleBackdropClick}
      onCancel={handleCancel}
    >
      <div className="filter-drawer__panel" ref={panelRef}>
        <div className="filter-drawer__header">
          <h2 id={titleId} className="filter-drawer__title">
            Filtres
          </h2>
          <button
            type="button"
            className="filter-drawer__close"
            onClick={handleClose}
            aria-label="Fermer les filtres"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <form
          className="filter-drawer__body"
          onSubmit={(e) => e.preventDefault()}
          onKeyDown={handleArrowNav}
        >
          {fields.map((field, index) => {
            const selected = localFilters[field.key as T] ?? []
            return (
              <FilterFieldItem
                key={field.key}
                field={field}
                selected={selected}
                onToggle={(value) => handleToggle(field.key as T, value)}
                labelId={`filter-label-${labelIds[index]}`}
              />
            )
          })}
        </form>

        <div className="filter-drawer__footer">
          <button
            type="button"
            className="filter-drawer__reset"
            onClick={() => {
              setLocalFilters(initial_filters)
              onReset()
            }}
            aria-label="Réinitialiser tous les filtres"
          >
            Réinitialiser
          </button>
          <button
            type="button"
            className="filter-drawer__apply"
            onClick={handleClose}
            aria-label="Appliquer les filtres sélectionnés"
          >
            Appliquer
          </button>
        </div>
      </div>
    </dialog>
  )
}
