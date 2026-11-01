import { cleanInci, splitINCI, stripPreamble } from 'algo-derm'

import { qualifyInciInput } from './inci-input-quality'

export type InciNormalization = {
  // Normalized list, or the original string when the guardrail tripped.
  value: string
  changed: boolean
  guardrailTripped: boolean
  tokensBefore: number
  tokensAfter: number
}

// Keep damage evidence so later reads cannot mistake a cleaned fragment for a complete list
export function normalizeInci(raw: string): InciNormalization {
  const inputQuality = qualifyInciInput(raw)
  const { canonical } = cleanInci(raw)
  const value = canonical.join(', ')
  const normalizedQuality = qualifyInciInput(value)
  const losesDamageEvidence = inputQuality.reasons.some(
    (reason) => !normalizedQuality.reasons.includes(reason)
  )
  const tokensBefore = splitINCI(stripPreamble(raw)).length
  const tokensAfter = canonical.length
  const guardrailTripped =
    losesDamageEvidence || tokensAfter === 0 || tokensAfter * 2 < tokensBefore
  return {
    value: guardrailTripped ? raw : value,
    changed: !guardrailTripped && value !== raw,
    guardrailTripped,
    tokensBefore,
    tokensAfter,
  }
}
