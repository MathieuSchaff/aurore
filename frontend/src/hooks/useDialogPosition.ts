import { type RefObject, useLayoutEffect, useState } from 'react'

export function useDialogPosition(ref: RefObject<HTMLElement | null>) {
  const [position, setPosition] = useState<'top' | 'bottom'>('top')

  useLayoutEffect(() => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    // If the dialog goes above the screen, we move it to the bottom so we can see it.
    if (rect.top < 0) {
      setPosition('bottom')
    } else {
      setPosition('top')
    }
  }, [ref])

  return position
}
