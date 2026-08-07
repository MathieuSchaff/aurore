import { useState } from 'react'

const DEFAULT_LIMIT = 8

export function useExpandableList<T>(list: T[], limit = DEFAULT_LIMIT, resetKey?: string) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [prevKey, setPrevKey] = useState(resetKey)

  // Render-time reset: collapse when another dataset swaps into the same
  // component instance (e.g. a comparison product replaced via the picker).
  if (resetKey !== prevKey) {
    setPrevKey(resetKey)
    setIsExpanded(false)
  }

  const hiddenCount = Math.max(0, list.length - limit)
  const visible = isExpanded ? list : list.slice(0, limit)

  return {
    visible,
    hiddenCount,
    isExpanded,
    toggle: () => setIsExpanded((v) => !v),
  }
}
