// Shared helper for detectors that need a normalized INCI ingredient array.
//
// `detectAllAutoTags` (auto-tag-orchestrator.ts) hoists `splitINCI(inci).map(normalize)`
// once per product so the 6 detection passes share the same array (audit
// O3 D.3 — avoid splitINCI × N when many detectors fire on the same product).
//
// Each detector accepts an optional `hoisted` array as last argument:
//   - When provided (orchestrator path), reuse it directly.
//   - When omitted (direct call from tests / runners that don't hoist),
//     fall back to splitting locally — backward compatible.

import { normalize, splitINCI } from 'algo-derm'

export function resolveIngredients(
  inci: string | null | undefined,
  hoisted?: readonly string[]
): readonly string[] {
  if (hoisted !== undefined) return hoisted
  if (!inci?.trim()) return []
  return splitINCI(inci).map(normalize)
}
