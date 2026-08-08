import { type RefObject, useEffect, useEffectEvent, useRef } from 'react'

type AnyRef = RefObject<HTMLElement | null>

/**
 * Click-through outside detection on `mousedown` + `touchstart` (bubble phase,
 * passive). The underlying `click` event is NOT blocked: the target the user
 * tapped still receives its native click. Use this when the component lives
 * inside a deliberately interactive container (drawer, form) and the outside
 * tap should still activate its target. Use `useCaptureDismiss` instead for
 * portaled menus/popovers over content the tap is not meant for.
 */
export const useClickOutside = (
  refOrRefs: AnyRef | AnyRef[],
  handleOnClickOutside: (event: MouseEvent | TouchEvent) => void,
  options?: { enabled?: boolean }
) => {
  const enabled = options?.enabled ?? true

  // Keep refs in a ref of their own so the listener stays attached across
  // renders even when callers pass a fresh array literal each time (the common
  // case for `useClickOutside([wrapperRef, contentRef], …)`).
  const onClickOutside = useEffectEvent(handleOnClickOutside)
  const refsRef = useRef<AnyRef[]>([])
  // Sync in an effect, not during render: the listener only reads refsRef.current
  // on a user gesture (after paint), so the commit-phase write is always in place
  // first. Writing during render bailed the React Compiler on the whole hook.
  useEffect(() => {
    refsRef.current = Array.isArray(refOrRefs) ? refOrRefs : [refOrRefs]
  }, [refOrRefs])

  useEffect(() => {
    if (!enabled) return

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      for (const r of refsRef.current) {
        if (r.current?.contains(target)) return
      }
      onClickOutside(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener, { passive: true })

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [enabled])
}
