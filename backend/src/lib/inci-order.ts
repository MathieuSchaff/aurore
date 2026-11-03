import { splitINCI, stripPreamble } from 'algo-derm'

// Alias renaming must not turn written alphabetical order into a concentration order
const ALPHA_DETECT_WINDOW = 8
const ALPHA_DETECT_MIN_TOKENS = 5
const ALPHA_DETECT_MIN_DISTINCT_LETTERS = 3

function pickLetterTokens(ingredients: readonly string[]): string[] {
  const out: string[] = []
  for (const ingredient of ingredients) {
    if (out.length >= ALPHA_DETECT_WINDOW) break
    if (/^[a-z]/.test(ingredient)) out.push(ingredient)
  }
  return out
}

function isNonDecreasing(tokens: readonly string[]): boolean {
  for (let i = 1; i < tokens.length; i++) {
    if (tokens[i] < tokens[i - 1]) return false
  }
  return true
}

export function isAlphabeticalINCI(
  ingredients: readonly string[],
  rawInci?: string | null
): boolean {
  if (
    rawInci &&
    isAlphabeticalINCI(splitINCI(stripPreamble(rawInci)).map((token) => token.trim().toLowerCase()))
  ) {
    return true
  }
  const tokens = pickLetterTokens(ingredients)
  if (tokens.length < ALPHA_DETECT_MIN_TOKENS) return false
  if (!isNonDecreasing(tokens)) return false
  return new Set(tokens.map((t) => t[0])).size >= ALPHA_DETECT_MIN_DISTINCT_LETTERS
}
