// Shared helper for detectors that need a normalized INCI ingredient array.
//
// `hoisted` allows the orchestrator to share a single splitINCI result across
// all passes. When omitted, falls back to splitting locally
// for test/runner callers that don't hoist.

import { normalize, splitINCI, stripPreamble } from 'algo-derm'

// Legacy alias: algo-derm `stripPreamble` is the source of truth; Aurore used to duplicate it.
export const stripMarketingPreamble = stripPreamble

export function resolveIngredients(
  inci: string | null | undefined,
  hoisted?: readonly string[]
): readonly string[] {
  if (hoisted !== undefined) return hoisted
  if (!inci?.trim()) return []
  return splitINCI(stripPreamble(inci)).map(normalize)
}

export { isAlphabeticalINCI } from '../../../lib/inci-order'
