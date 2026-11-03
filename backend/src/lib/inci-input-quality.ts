import { cleanInciString } from 'algo-derm'

import { foldScraperDelimiters } from './inci-delimiters'

export type InciInputQuality = {
  status: 'missing' | 'suspect' | 'unknown'
  reasons: readonly ('truncated-list' | 'non-formula-text')[]
}

const NON_FORMULA_TEXT = [
  /\b(?:la|une|les|votre|vos)\s+(?:peau|peaux|mains|cellules)\b/,
  /\b(?:ce|cette)\s+(?:serum|creme|mousse|gommage)\b/,
  /\b(?:appliquer|appliquez|utilisez)\b/,
  /\b(?:my|your)\s+(?:skin|face|routine)\b/,
  /\b(?:this|the)\s+(?:cleanser|cream|serum)\b/,
  /\bskin\s+(?:types?|consultation)\b/,
  /\best\s+(?:classe|prouve)\b/,
  /\b(?:contient|contiennent)\s+(?:des|du|de la)\b/,
  /\b(?:vnr|valeur nutritionnelle|nutrition facts)\b/,
  /(?:^|[,;])\s*(?:sans|without|free from)\s+/,
]

export function qualifyInciInput(inci: string | null | undefined): InciInputQuality {
  const raw = inci?.trim() ?? ''
  // An HTML entity's terminator is not a trailing list separator
  const decoded = foldScraperDelimiters(raw, { foldListSeparators: false }).trim()
  if (!decoded) return { status: 'missing', reasons: [] }

  const reasons: InciInputQuality['reasons'][number][] = []
  if (/(?:\.{3}|…|[,;])$/.test(decoded)) reasons.push('truncated-list')

  // Known removable headings and marketing tails should not disqualify the remaining list
  const cleaned = cleanInciString(raw).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
  if (NON_FORMULA_TEXT.some((pattern) => pattern.test(cleaned))) reasons.push('non-formula-text')

  // Neither dictionary coverage nor clean syntax proves that the source is complete
  return { status: reasons.length ? 'suspect' : 'unknown', reasons }
}
