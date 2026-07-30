import type { TagEvidence } from '../../lib/pass-types'

// Top-N INCI window, clamped to the list length. Names the repeated
// `slice(0, Math.min(length, n))` idiom shared across the formula passes.
export const inciWindow = (ingredients: readonly string[], n: number): readonly string[] =>
  ingredients.slice(0, Math.min(ingredients.length, n))

// First sentence of a marketing description — the lead positioning claim.
// Abbreviation dots ("Dr.") cut early: the window narrows, which only trades
// recall, never precision. No sentence punctuation = whole description.
export const leadSentence = (description: string): string => {
  const m = /[.!?](?:\s|$)/.exec(description)
  return m ? description.slice(0, m.index + 1) : description
}

export interface NamePositioningOptions {
  // Restrict the description side of the haystack to its first sentence.
  // A concern named in the lead is the product's positioning; the same word
  // buried mid-description is an incidental benefit mention (the FP source
  // that put rougeurs-vasculaires at P=0.550).
  leadWindowOnly?: boolean
}

// Name/claim positioning gate shared by formula concern detectors:
// normalize name+description into one whitespace-collapsed haystack, require the
// positioning regex, optionally veto via an exclusion regex. Returns the matched
// substring + which field carried it (audit evidence) or null. `matchesNamePositioning`
// is the boolean view used by the detectors; emit behavior is unchanged.
export function matchNamePositioning(
  name: string | null | undefined,
  description: string | null | undefined,
  positionRe: RegExp,
  exclusionRe?: RegExp,
  opts?: NamePositioningOptions
): TagEvidence | null {
  const desc = opts?.leadWindowOnly && description ? leadSentence(description) : description
  const hay = `${name ?? ''} ${desc ?? ''}`.replace(/\s+/g, ' ')
  const m = positionRe.exec(hay)
  if (!m) return null
  if (exclusionRe?.test(hay)) return null
  // Attribute to the field that carries the match; fall back to description when the
  // hit only appears across the join (rare). Regexes are case-insensitive, not global,
  // so exec/test share no lastIndex state.
  const inName = name ? positionRe.test(name.replace(/\s+/g, ' ')) : false
  return {
    matchedToken: m[0],
    sourceField: inName ? 'name' : 'description',
    rule: 'name-positioning',
  }
}

export function matchesNamePositioning(
  name: string | null | undefined,
  description: string | null | undefined,
  positionRe: RegExp,
  exclusionRe?: RegExp,
  opts?: NamePositioningOptions
): boolean {
  return matchNamePositioning(name, description, positionRe, exclusionRe, opts) !== null
}
