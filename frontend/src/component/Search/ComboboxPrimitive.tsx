import { type ReactNode, useEffect, useEffectEvent, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useCaptureDismiss } from '@/hooks/useCaptureDismiss'
import { useFlipPlacement } from '@/hooks/useFlipPlacement'
import { useRetryCountdown } from '@/hooks/useRetryCountdown'
import { useScrollActiveOptionIntoView } from '@/hooks/useScrollActiveOptionIntoView'
import type { ComboboxController } from './useCombobox'
import './ComboboxPrimitive.css'

export type { ComboboxSection, ComboboxSectionItem } from './useCombobox'

interface ComboboxAriaProps {
  listboxId: string
  activeDescendant: string | undefined
}

interface ComboboxPrimitiveProps<T> {
  combobox: ComboboxController<T>
  renderItem: (item: T, index: number, isActive: boolean) => ReactNode
  inputValue: string
  /** Stale (placeholder) results shown while a newer query is in flight. */
  isUpdating?: boolean
  onRetry?: () => void
  /** Raw seconds from a 429; absent for any other error, which stays retryable at once. */
  retryAfter?: number
  retryAfterAt?: number
  errorMessage?: string
  emptyMessage?: string
  keyExtractor: (item: T, index: number) => string | number
  footer?: ReactNode
  /** Infinite scroll: sentinel intersection triggers onLoadMore. */
  hasMore?: boolean
  onLoadMore?: () => void
  isLoadingMore?: boolean
  children: (ariaProps: ComboboxAriaProps) => ReactNode
}

export function ComboboxPrimitive<T>({
  combobox,
  renderItem,
  inputValue,
  isUpdating,
  onRetry,
  retryAfter,
  retryAfterAt,
  errorMessage = 'Erreur de recherche',
  emptyMessage = 'Aucun résultat',
  keyExtractor,
  footer,
  hasMore,
  onLoadMore,
  isLoadingMore,
  children,
}: ComboboxPrimitiveProps<T>) {
  const {
    items,
    sections,
    sectionEntries,
    totalEntries,
    isOpen,
    isLoading,
    isError,
    listboxRendered,
    highlightedIndex,
    dismiss,
    onSelect,
    handleKeyDown,
  } = combobox

  const remaining = useRetryCountdown(retryAfter ?? null, retryAfterAt)
  const listboxId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Use body immediately so an open right after hydration can render.
  // Dialog comboboxes move into the top layer once the container ref is available.
  const [portalTarget, setPortalTarget] = useState<Element | null>(() =>
    typeof document === 'undefined' ? null : document.body
  )
  useEffect(() => {
    setPortalTarget(containerRef.current?.closest('dialog') ?? document.body)
  }, [])

  // totalEntries in deps so flip recalculates as async results stream in.
  useFlipPlacement(containerRef, dropdownRef, isOpen, [totalEntries])

  // useCaptureDismiss (not useClickOutside): portaled dropdown sits over real click targets.
  // Two refs: both the trigger container and the portaled dropdown count as "inside".
  useCaptureDismiss([containerRef, dropdownRef], dismiss, { enabled: isOpen })

  useScrollActiveOptionIntoView(highlightedIndex, isOpen, listboxId)

  // useEffectEvent: read onLoadMore fresh without subscribing the observer again on every
  // parent render (caller passes an inline arrow whose identity changes each render).
  const loadMore = useEffectEvent(() => onLoadMore?.())
  useEffect(() => {
    if (!isOpen || !hasMore) return
    const sentinel = sentinelRef.current
    const root = itemsRef.current
    if (!sentinel || !root) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            loadMore()
          }
        }
      },
      { root, rootMargin: '40px', threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [isOpen, hasMore])

  // Flat keyboard index offset of each section (sections precede main items).
  let sectionOffset = 0
  const sectionOffsets = (sections ?? []).map((s) => {
    const offset = sectionOffset
    sectionOffset += s.items.length
    return offset
  })

  const activeDescendant =
    listboxRendered && highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: wrapper for input navigation
    <div className="combobox-primitive" ref={containerRef} onKeyDown={handleKeyDown}>
      {children({ listboxId, activeDescendant })}

      {isOpen &&
        portalTarget &&
        createPortal(
          <div ref={dropdownRef} className="combobox-primitive__dropdown">
            {isError ? (
              <div className="combobox-primitive__error" role="alert">
                <span>{errorMessage}</span>
                {onRetry && (
                  <button
                    type="button"
                    className="combobox-primitive__retry ui-combobox-retry"
                    onClick={onRetry}
                    disabled={remaining > 0}
                  >
                    Réessayer
                    {/* Hidden from the reader: this container is role="alert", so a ticking
                        number inside it would fire the announcement again every second. */}
                    {remaining > 0 && <span aria-hidden="true"> ({remaining} s)</span>}
                  </button>
                )}
              </div>
            ) : isLoading ? (
              <output className="combobox-primitive__status ui-combobox-empty">Chargement…</output>
            ) : (
              <>
                <div
                  id={listboxId}
                  ref={itemsRef}
                  role="listbox"
                  className={`combobox-primitive__items${isUpdating ? ' combobox-primitive__items--updating' : ''}`}
                  aria-label="Suggestions"
                  aria-busy={isUpdating || undefined}
                >
                  {sections?.map((section, sIdx) => {
                    const baseIdx = sectionOffsets[sIdx] ?? 0
                    const labelId = `${listboxId}-section-${section.id}`
                    return (
                      // biome-ignore lint/a11y/useSemanticElements: ARIA listbox group pattern needs role=group; <fieldset> is form-only
                      <div
                        key={section.id}
                        role="group"
                        aria-labelledby={labelId}
                        className="combobox-primitive__section"
                      >
                        <div id={labelId} className="combobox-primitive__section-label">
                          {section.label}
                        </div>
                        {section.items.map((entry, i) => {
                          const globalIdx = baseIdx + i
                          const isActive = globalIdx === highlightedIndex
                          return (
                            // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard nav handled on container
                            <div
                              key={entry.id}
                              id={`${listboxId}-option-${globalIdx}`}
                              role="option"
                              aria-selected={isActive}
                              className={`combobox-primitive__option ${isActive ? 'combobox-primitive__option--active' : ''}`}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => entry.onSelect()}
                              tabIndex={-1}
                            >
                              {entry.render}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                  {items.map((item, index) => {
                    const globalIdx = sectionEntries.length + index
                    const isActive = globalIdx === highlightedIndex
                    const key = keyExtractor(item, index)
                    return (
                      // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard nav handled on container
                      <div
                        key={key}
                        id={`${listboxId}-option-${globalIdx}`}
                        role="option"
                        aria-selected={isActive}
                        className={`combobox-primitive__option ${isActive ? 'combobox-primitive__option--active' : ''}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => onSelect(item)}
                        tabIndex={-1}
                      >
                        {renderItem(item, index, isActive)}
                      </div>
                    )
                  })}
                  {hasMore && (
                    <>
                      <div
                        ref={sentinelRef}
                        className="combobox-primitive__sentinel"
                        aria-hidden="true"
                      />
                      {/* Outside the aria-hidden sentinel so its role=status announces. */}
                      {isLoadingMore && (
                        <output className="combobox-primitive__status ui-combobox-empty">
                          Chargement…
                        </output>
                      )}
                    </>
                  )}
                  {totalEntries === 0 && !footer && inputValue.trim() !== '' && (
                    <output className="combobox-primitive__empty ui-combobox-empty">
                      {emptyMessage}
                    </output>
                  )}
                </div>
                {footer && <div className="combobox-primitive__footer">{footer}</div>}
              </>
            )}
          </div>,
          portalTarget
        )}

      {/* role="alert" (error), the loading role=status and the empty-state output already
          announce; stay silent in those states to avoid double or contradictory reads,
          and don't advertise arrow keys when there is nothing to navigate. */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {isOpen && !isError && !isLoading && totalEntries > 0
          ? `${totalEntries} résultats disponibles. Utilisez les flèches pour naviguer.`
          : ''}
      </span>
    </div>
  )
}
