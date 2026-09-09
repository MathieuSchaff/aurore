import { useEffect } from 'react'

// True from the router's hydrate hook to the root component's mount effect
// A guard that throws a router redirect inside that window makes the router swap the
// matches while React still hydrates the server document, so the guarded route's
// pending skeleton is reconciled against the login shell and React reports #418/#422
// Suspense boundaries hydrate after the root commit, so nothing in the app can say
// "fully hydrated": guards leave the document instead of routing
// Stays false everywhere else, SPA navigations, the server and unit tests never set it
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
