import { type ReactNode, useEffect, useId, useRef } from 'react'
import './ComboboxPrimitive.css'

interface ComboboxPrimitiveProps<T> {
  items: T[]
  isOpen: boolean
  onClose: () => void
  onSelect: (item: T) => void
  renderItem: (item: T, index: number, isActive: boolean) => ReactNode
  highlightedIndex: number
  setHighlightedIndex: (index: number) => void
  inputValue: string
  onKeyDown?: (e: React.KeyboardEvent) => void
  isLoading?: boolean
  emptyMessage?: string
  children: ReactNode // L'input sera passé ici
}

/**
 * Une primitive de Combobox accessible qui gère la liste déroulante et la navigation clavier.
 * Suit le pattern WAI-ARIA Combobox (Listbox version).
 */
export function ComboboxPrimitive<T>({
  items,
  isOpen,
  onClose,
  onSelect,
  renderItem,
  highlightedIndex,
  setHighlightedIndex,
  inputValue,
  onKeyDown,
  isLoading,
  emptyMessage = 'Aucun résultat',
  children,
}: ComboboxPrimitiveProps<T>) {
  const listboxId = useId()
  const containerRef = useRef<HTMLDivElement>(null)

  // Fermeture au clic à l'extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Scroll automatique vers l'élément actif
  useEffect(() => {
    if (highlightedIndex >= 0 && isOpen) {
      const element = document.getElementById(`${listboxId}-option-${highlightedIndex}`)
      element?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex, isOpen, listboxId])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // On laisse d'abord le parent gérer ses propres touches (ex: Tab spécial dans BrandCombobox)
    onKeyDown?.(e)
    if (e.defaultPrevented) return

    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(highlightedIndex < items.length - 1 ? highlightedIndex + 1 : 0)
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(highlightedIndex > 0 ? highlightedIndex - 1 : items.length - 1)
        break
      case 'Enter':
        if (highlightedIndex >= 0 && items[highlightedIndex]) {
          e.preventDefault()
          onSelect(items[highlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }

  return (
    <div className="combobox-primitive" ref={containerRef} onKeyDown={handleKeyDown}>
      {/* 
        On injecte les attributs ARIA sur l'input (l'enfant unique passé via children)
        Note: On assume que l'enfant est un input ou un wrapper contenant un input.
      */}
      {children}

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className="combobox-primitive__dropdown"
          aria-label="Suggestions"
        >
          {isLoading ? (
            <div className="combobox-primitive__status" role="status">
              Chargement...
            </div>
          ) : items.length === 0 ? (
            inputValue.trim() !== '' && (
              <div className="combobox-primitive__empty">{emptyMessage}</div>
            )
          ) : (
            items.map((item, index) => {
              const isActive = index === highlightedIndex
              return (
                <div
                  key={index}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={isActive}
                  className={`combobox-primitive__option ${isActive ? 'combobox-primitive__option--active' : ''}`}
                  onMouseDown={(e) => e.preventDefault()} // Empêche le blur de l'input
                  onClick={() => onSelect(item)}
                >
                  {renderItem(item, index, isActive)}
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Annonce Live pour les lecteurs d'écran */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {isOpen ? `${items.length} résultats disponibles. Utilisez les flèches pour naviguer.` : ''}
      </span>
    </div>
  )
}
