import { useEffect } from 'react'

// Traps focus inside the container so Tab wraps around
// instead of going to the page behind the dialog.
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      // requery every time so we pick up accordion open/close changes
      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === last) {
          first?.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    const firstElement = container.querySelector<HTMLElement>(FOCUSABLE)
    firstElement?.focus()

    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [isActive, containerRef])
}
