import { type RefObject, useEffect } from 'react'

const GAP = 4
// Drawer body owns its own scroll context; recompute coords when it scrolls.
const SCROLLABLE_SELECTOR = '.filter-drawer__body'

// Position a fixed-element dropdown under (or above) a trigger. Flips when not
// enough space below. Listens for window resize and drawer-body scroll so the
// dropdown follows its trigger.
export function useFlipPlacement(
  triggerRef: RefObject<HTMLElement | null>,
  dropdownRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  extraDeps: unknown[] = []
) {
  useEffect(() => {
    if (!isOpen) return
    const trigger = triggerRef.current
    const dropdown = dropdownRef.current
    if (!trigger || !dropdown) return

    const updatePosition = () => {
      const rect = trigger.getBoundingClientRect()
      const dropdownHeight = dropdown.offsetHeight
      const spaceBelow = window.innerHeight - rect.bottom - GAP
      const spaceAbove = rect.top - GAP
      const placeAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow

      dropdown.style.position = 'fixed'
      dropdown.style.left = `${rect.left}px`
      dropdown.style.width = `${rect.width}px`

      const MAX_HEIGHT = Math.min(window.innerHeight * 0.6, 520)

      if (placeAbove) {
        dropdown.style.top = 'auto'
        dropdown.style.bottom = `${window.innerHeight - rect.top + GAP}px`
        dropdown.style.maxHeight = `${Math.min(spaceAbove, MAX_HEIGHT)}px`
      } else {
        dropdown.style.top = `${rect.bottom + GAP}px`
        dropdown.style.bottom = 'auto'
        dropdown.style.maxHeight = `${Math.min(spaceBelow, MAX_HEIGHT)}px`
      }
    }

    updatePosition()

    const scrollable = trigger.closest(SCROLLABLE_SELECTOR)
    scrollable?.addEventListener('scroll', updatePosition)
    window.addEventListener('scroll', updatePosition, { passive: true })
    window.addEventListener('resize', updatePosition, { passive: true })

    return () => {
      scrollable?.removeEventListener('scroll', updatePosition)
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen, triggerRef, dropdownRef, ...extraDeps])
}
