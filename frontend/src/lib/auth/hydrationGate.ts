import { useEffect } from 'react'

// Router redirects during hydration replace server matches and cause React #418/#422
// This window lasts from the hydrate hook to root mount; Suspense can hydrate later,
// so guards leave the document instead of assuming the root means fully hydrated
// SPA navigation, SSR and unit tests never open this window
let hydrating = false

export function markHydrationStarted(): void {
  hydrating = true
}

export function markHydrationSettled(): void {
  hydrating = false
}

export function isHydrating(): boolean {
  return hydrating
}

export function useMarkHydrationSettled(): void {
  useEffect(() => {
    markHydrationSettled()
  }, [])
}
