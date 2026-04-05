import { X } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { useScrollLock } from '@/hooks/useScrollLock'
import { GroupedAccordion } from './GroupedAccordion'
import type { FilterGroupConfig, FilterValues } from './types'
import { useFocusTrap } from './useFocusTrap'

type GroupedFilterDialogProps<T extends string> = {
  open: boolean
  onClose: () => void
  groups: FilterGroupConfig<T>[]
  currentFilters: FilterValues<T>
  onApply: (filters: FilterValues<T>) => void
  onReset: () => void
  initialFilters: FilterValues<T>
}

export function GroupedFilterDialog<T extends string>({
  open,
  onClose,
  groups,
  currentFilters,
  onApply,
  onReset,
  initialFilters,
}: GroupedFilterDialogProps<T>) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [localFilters, setLocalFilters] = useState<FilterValues<T>>(currentFilters)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useScrollLock(open)
  useFocusTrap(open, panelRef)

  // remember which button opened the dialog so we can restore focus on close
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }
  }, [open])

  const handleClose = useCallback(() => {
    onApply(localFilters)
    onClose()
    setTimeout(() => previousFocusRef.current?.focus(), 0)
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

  const handleCancel = (e: React.UIEvent<HTMLDialogElement>) => {
    e.preventDefault()
    handleClose()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose()
    }
  }

  // arrow keys move focus between accordion triggers,
  // but only when the trigger itself is focused — we don't want
  // to hijack arrows inside a SearchSelect or other inputs
  const handleArrowNav = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    const target = e.target as HTMLElement
    if (!target.classList.contains('filter-accordion__trigger')) return
    e.preventDefault()
    const form = e.currentTarget as HTMLElement
    const triggers = Array.from(form.querySelectorAll<HTMLElement>('.filter-accordion__trigger'))
    const currentIndex = triggers.indexOf(target)
    if (currentIndex === -1) return
    const nextIndex =
      e.key === 'ArrowDown'
        ? (currentIndex + 1) % triggers.length
        : (currentIndex - 1 + triggers.length) % triggers.length
    triggers[nextIndex]?.focus()
  }

  const titleId = useId()
  const essentialGroups = groups.filter((g) => g.tier === 'essential')
  const advancedGroups = groups.filter((g) => g.tier === 'advanced')

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop is not focusable, keyboard handler would do nothing
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
          {essentialGroups.map((group) => (
            <GroupedAccordion
              key={group.id}
              group={group}
              localFilters={localFilters}
              onToggle={handleToggle}
            />
          ))}

          {advancedGroups.length > 0 && (
            <div className="filter-drawer__separator">
              <span className="filter-drawer__separator-label">Avancé</span>
            </div>
          )}

          {advancedGroups.map((group) => (
            <GroupedAccordion
              key={group.id}
              group={group}
              localFilters={localFilters}
              onToggle={handleToggle}
            />
          ))}
        </form>

        <div className="filter-drawer__footer">
          <button
            type="button"
            className="filter-drawer__reset"
            onClick={() => {
              setLocalFilters(initialFilters)
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
