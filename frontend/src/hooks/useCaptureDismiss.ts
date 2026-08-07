import { type RefObject, useEffect, useEffectEvent, useRef } from 'react'

type AnyRef = RefObject<HTMLElement | null>

/**
 * Tap-blocking outside-click dismiss for portaled menus/popovers over content the tap is
 * not meant for (app body, product cards). Swallows the click in capture phase, unlike
 * `useClickOutside`'s `mousedown` which lets it reach the target underneath and cause
 * surprise navigation on mobile. Use `useClickOutside` instead inside a deliberately
 * interactive container (drawer, form). Always pass `{ enabled }` when the component
 * can be closed: a permanent capture listener would swallow every click in the app.
 */
export const useCaptureDismiss = (
  refOrRefs: AnyRef | AnyRef[],
  onDismiss: (event: MouseEvent) => void,
  options?: { enabled?: boolean }
) => {
  const enabled = options?.enabled ?? true

  // Keep refs in a ref of their own so the listener stays attached across
  // renders even when callers pass a fresh array literal each time.
  const onDismissEvent = useEffectEvent(onDismiss)
  const refsRef = useRef<AnyRef[]>([])
  // Sync in an effect, not during render: writing during render bailed the React
  // Compiler. The listener reads refsRef.current only on a user gesture, after
  // this commit-phase write has landed.
  useEffect(() => {
    refsRef.current = Array.isArray(refOrRefs) ? refOrRefs : [refOrRefs]
  }, [refOrRefs])

  useEffect(() => {
    if (!enabled) return

    const listener = (event: MouseEvent) => {
      const target = event.target as Node
      for (const r of refsRef.current) {
        if (r.current?.contains(target)) return
      }
      event.preventDefault()
      event.stopPropagation()
      onDismissEvent(event)
    }

    document.addEventListener('click', listener, true)
    return () => document.removeEventListener('click', listener, true)
  }, [enabled])
}
