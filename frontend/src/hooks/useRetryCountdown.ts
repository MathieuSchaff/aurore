import { useEffect, useState } from 'react'

// Beyond an hour the value is malformed, not a window: clamping keeps a bad payload from
// disabling the button for good.
const MAX_SECONDS = 3600

// A 429's Retry-After has no page-level clock to read, so this is the frontend's only ticker.
// Counts down from a deadline, not by decrement, so a throttled tab does not drift. `startedAt`
// is the reset key: repeat 429s often carry the same Retry-After, and keying the restart on the
// value alone would leave the previous timer running. Pass the query's `errorUpdatedAt`.
export function useRetryCountdown(seconds: number | null, startedAt?: number): number {
  const initial = seconds && seconds > 0 ? Math.min(Math.ceil(seconds), MAX_SECONDS) : 0
  const [remaining, setRemaining] = useState(initial)

  // biome-ignore lint/correctness/useExhaustiveDependencies: startedAt is a reset key, never read here; dropping it leaves a repeat 429 with the same delay on the old countdown.
  useEffect(() => {
    setRemaining(initial)
    if (initial === 0) return

    const deadline = Date.now() + initial * 1000
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setRemaining(left)
      if (left === 0) clearInterval(id)
    }, 1000)

    return () => {
      clearInterval(id)
    }
  }, [initial, startedAt])

  return remaining
}
