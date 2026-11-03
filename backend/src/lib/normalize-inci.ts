import { cleanInci, colorIndexLookupKey, splitINCI, stripPreamble } from 'algo-derm'

import { foldScraperDelimiters } from './inci-delimiters'
import { UNDISCLOSED_AROMA_PATTERN } from './inci-facts'
import { qualifyInciInput } from './inci-input-quality'
import { foldKnownInciLines } from './inci-line-breaks'
import { isAlphabeticalINCI } from './inci-order'

const undisclosedAroma = new RegExp(UNDISCLOSED_AROMA_PATTERN, 'i')
const nanoDeclaration = /\[\s*nano\s*\]|\(\s*nano\s*\)/i
// Keep the engine's optical-isomer exclusions when recognizing optional declarations
const optionalDeclaration =
  /(?:\(\s*(?:\+\s*\/\s*-|±)\s*\)(?!\s*-)|(?:\+\s*\/\s*-|±)(?!\s*\)\s*-)|\(\s*(?:may\s+contain|peut\s+contenir)\s*\)|\b(?:may\s+contain|peut\s+contenir)\b)/i
const waterPreparation = /\b(?:water|aqua|eau)\s*[*†‡™®]*(?:\s*\([^)]*\))?\s*[*†‡™®]*$/i
const percentageValues = (label: string) =>
  [...label.matchAll(/\d+(?:[.,]\d+)?\s*%/g)].map((match) =>
    Number(match[0].replace('%', '').replace(',', '.').trim())
  )

export type InciNormalization = {
  // Canonical list, or the source with safe delimiter repairs when canonicalization is blocked
  value: string
  changed: boolean
  guardrailTripped: boolean
  tokensBefore: number
  tokensAfter: number
}

// Keep damage evidence so later reads cannot mistake a cleaned fragment for a complete list
export function normalizeInci(raw: string): InciNormalization {
  const inputQuality = qualifyInciInput(raw)
  const foldedLines = foldKnownInciLines(foldScraperDelimiters(raw))
  const unresolvedLineBreaks = foldedLines === null
  const prepared = foldedLines ?? raw
  const { ingredients, canonical } = cleanInci(prepared)
  const value = canonical.join(', ')
  const normalizedQuality = qualifyInciInput(value)
  const losesDamageEvidence = inputQuality.reasons.some(
    (reason) => !normalizedQuality.reasons.includes(reason)
  )
  // Aroma aliases to Parfum, which would erase the uncertainty used by absence tags
  const losesAromaticDeclaration = undisclosedAroma.test(raw) && !undisclosedAroma.test(value)
  // Losing CI 77891 would turn a declared pigment into unqualified titanium dioxide
  const losesColorIdentity = ingredients.some((ingredient, index) => {
    const key = colorIndexLookupKey(ingredient)
    return key !== null && key !== colorIndexLookupKey(canonical[index] ?? '')
  })
  // Canonical names omit particle size, but the stored declaration must keep it
  const losesNanoDeclaration = ingredients.some(
    (ingredient, index) =>
      nanoDeclaration.test(ingredient) && !nanoDeclaration.test(canonical[index] ?? '')
  )
  // A missing percent sign turns a declared quantity into part of the ingredient name
  const losesDeclaredPercentage = ingredients.some((ingredient, index) => {
    const before = percentageValues(ingredient)
    const after = percentageValues(canonical[index] ?? '')
    return before.some((value, position) => value !== after[position])
  })
  // Optional pigments and written order cannot be recovered from flattened canonical names
  const losesOptionalDeclaration =
    optionalDeclaration.test(prepared) && !optionalDeclaration.test(value)
  const losesWrittenOrder =
    isAlphabeticalINCI([], prepared) &&
    !isAlphabeticalINCI(canonical.map((ingredient) => ingredient.trim().toLowerCase()))
  // A botanical water must not become an unspecified plant identity
  const losesWaterPreparation = ingredients.some(
    (ingredient, index) =>
      waterPreparation.test(ingredient) && !waterPreparation.test(canonical[index] ?? '')
  )
  const tokensBefore = splitINCI(stripPreamble(prepared)).length
  const tokensAfter = canonical.length
  const guardrailTripped =
    unresolvedLineBreaks ||
    losesDamageEvidence ||
    losesAromaticDeclaration ||
    losesColorIdentity ||
    losesNanoDeclaration ||
    losesDeclaredPercentage ||
    losesOptionalDeclaration ||
    losesWrittenOrder ||
    losesWaterPreparation ||
    tokensAfter === 0 ||
    tokensAfter * 2 < tokensBefore
  // Keep delimiter repairs when aliases lose qualifiers, but retain raw damage evidence
  const retained = losesDamageEvidence ? raw : prepared
  const result = guardrailTripped ? retained : value
  return {
    value: result,
    changed: result !== raw,
    guardrailTripped,
    tokensBefore,
    tokensAfter,
  }
}
