import { cleanInci, splitINCI, stripPreamble } from 'algo-derm'

export type InciNormalization = {
  // Normalized list, or the original string when the guardrail tripped.
  value: string
  changed: boolean
  guardrailTripped: boolean
  tokensBefore: number
  tokensAfter: number
}

// Rewrites a raw INCI declaration to canonical form: repairs the scraped string, splits, and
// maps each token to its canonical INCI name, so unknown tokens (FR / exotic) pass through
// unchanged, never dropped. Guardrail: keep the original when cleaning halves the token count
// (clean+split misreading the list as prose), since canonicalizeINCI itself is 1:1. No floor:
// mono/bi-ingredient oils are legitimate and must normalize too.
export function normalizeInci(raw: string): InciNormalization {
  const { canonical } = cleanInci(raw)
  const value = canonical.join(', ')
  const tokensBefore = splitINCI(stripPreamble(raw)).length
  const tokensAfter = canonical.length
  const guardrailTripped = tokensAfter === 0 || tokensAfter * 2 < tokensBefore
  return {
    value: guardrailTripped ? raw : value,
    changed: !guardrailTripped && value !== raw,
    guardrailTripped,
    tokensBefore,
    tokensAfter,
  }
}
