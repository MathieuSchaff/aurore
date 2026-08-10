// FR wording for algo-derm's typed regulatoryFindings (region, status, limit).
// The lib emits structured rules, not English prose, so phrasing stays a frontend
// concern. `note` is the passthrough when no ingredient is attributable.

import { REGULATORY_SCOPE_PHRASE } from '@/constants/derm'

type RegStatus = 'restricted' | 'prohibited' | 'concentration_limit'

// Structural subset of algo-derm's RegulatoryFinding: backend-only vendored dep,
// so the type reaches the frontend via the RPC payload, not an import.
interface RegulatoryFindingLike {
  status: RegStatus
  region: string
  subjectIngredients: string[]
  matchedIngredients: string[]
  maxConcentrationPct?: number
  detail?: string
  scopeId?: string
  note: string
}

export interface RegulatoryLine {
  key: string
  label?: string
  text: string
}

const REGION_FR: Record<string, string> = {
  EU: 'UE',
  'the EU': 'UE',
  CA: 'Canada',
  Canada: 'Canada',
}

const regionFr = (region: string): string => REGION_FR[region] ?? region

// Ordered: a pattern that contains a shorter one must come first.
const DETAIL_FR: ReadonlyArray<readonly [RegExp, string]> = [
  [/leave-on only/g, 'sans rinçage uniquement'],
  [/rinse-off only/g, 'à rincer uniquement'],
  [/leave-on/g, 'sans rinçage'],
  [/rinse-off/g, 'à rincer'],
  [/ per Annex /g, ', annexe '],
  [/\bAnnex /g, 'annexe '],
  [/not in aerosol dispensers/g, 'pas en aérosol'],
  [/not in sprays/g, 'pas en spray'],
  [/label above/g, 'étiquetage au-delà de'],
  [/peroxide value below/g, 'indice de peroxyde inférieur à'],
  [/as sorbic acid/g, 'exprimé en acide sorbique'],
  [/as benzoic acid/g, 'exprimé en acide benzoïque'],
  [/as acid/g, 'exprimé en acide'],
  [/UV filter/g, 'filtre UV'],
  [/ or /g, ' ou '],
]

const HEAD_BIT = /^(?:max \d+(?:\.\d+)?%|leave-on only|rinse-off only)$/
const ANNEX_REF = /annexe [IVX]+\/[\dA-Za-z.]+/g

const words = (text: string): string[] => text.match(/\p{L}[\p{L}'’-]*/gu) ?? []

// Derived from the table so a new phrase widens the vocabulary in one place;
// `max` is the only word this file emits without going through it.
const FR_VOCABULARY = new Set(
  ['max', ...DETAIL_FR.flatMap(([, fr]) => words(fr))].map((word) => word.toLowerCase())
)

// Annex references are dropped first: their Roman numerals read as words and
// would mark every annexed note as untranslated.
const isFrench = (text: string): boolean =>
  words(text.replace(ANNEX_REF, ' ')).every((word) => FR_VOCABULARY.has(word.toLowerCase()))

const frenchNumbers = (text: string): string =>
  text.replace(/(\d)\.(\d)/g, '$1,$2').replace(/(\d)%/g, '$1 %')

const translate = (text: string): string =>
  DETAIL_FR.reduce((acc, [pattern, fr]) => acc.replace(pattern, fr), frenchNumbers(text))

// The lib glues its structured bits and the curated note into one string
// (`formatRegulatoryDetail`), notes last, so the note is the tail after the
// leading structured segments.
const splitDetail = (detail: string): { head: string[]; note: string } => {
  const segments = detail.split(', ')
  let cut = 0
  while (cut < segments.length && HEAD_BIT.test(segments[cut] as string)) cut += 1
  return { head: segments.slice(0, cut), note: segments.slice(cut).join(', ') }
}

// Curated notes are English prose the vendored dataset writes by hand. Silence
// beats leaking them onto the page: a note we cannot render in French falls back
// to its annex references, which carry the legal anchor without the prose.
const noteFr = (note: string): string | undefined => {
  const translated = translate(note)
  // The whole detail is already printed inside parentheses, so a parenthesised
  // aside in the note closed the line on a double bracket.
  if (isFrench(translated)) return translated.replace(/\s*\(([^)]*)\)/g, ', $1')
  return translated.match(ANNEX_REF)?.join(', ')
}

// A scoped cap is the lib saying "this number governs that product family". It
// is composed from the structured fields, not from `detail`, which repeats the
// scope in English. An id with no phrase drops the number: a bare cap would read
// as the displayed product's own limit.
const scopedDetailFr = (scopeId: string, max: number | undefined): string | undefined => {
  const phrase = REGULATORY_SCOPE_PHRASE[scopeId]
  if (!phrase || max == null) return undefined
  return `${frenchNumbers(`max ${max}%`)} ${phrase}`
}

const detailFr = (detail: string): string | undefined => {
  const { head, note } = splitDetail(detail)
  const noteText = note ? noteFr(note) : undefined
  // A note carrying its own percentages is the finer statement (rinse-off vs
  // leave-on); printing the structured cap alongside repeated the same number.
  const bits = noteText?.includes('%') ? head.filter((bit) => !bit.startsWith('max ')) : head
  const parts = [...bits.map(translate), ...(noteText ? [noteText] : [])]
  return parts.length ? parts.join(', ') : undefined
}

interface Buckets {
  prohibited: string[]
  framed: string[]
}

// One line per ingredient, e.g. "Salicylic Acid — usage encadré : UE (max 2 %), Canada".
export function formatRegulatoryFindings(findings: RegulatoryFindingLike[]): RegulatoryLine[] {
  const grouped = new Map<string, Buckets>()
  const passthrough: string[] = []

  for (const finding of findings) {
    // Only subjects carry an ingredient-level treatment; other matched
    // ingredients are rule conditions. Fall back to matched, then to the note.
    const subjects =
      finding.subjectIngredients.length > 0
        ? finding.subjectIngredients
        : finding.matchedIngredients
    if (subjects.length === 0) {
      passthrough.push(finding.note)
      continue
    }

    const region = regionFr(finding.region)
    const detail =
      finding.detail ??
      (finding.maxConcentrationPct != null ? `max ${finding.maxConcentrationPct}%` : undefined)
    // concentration_limit is a framed usage with a number, not a distinct verdict.
    const framed = finding.scopeId
      ? scopedDetailFr(finding.scopeId, finding.maxConcentrationPct)
      : detail
        ? detailFr(detail)
        : undefined
    const framedText = framed ? `${region} (${framed})` : region

    for (const subject of subjects) {
      const bucket = grouped.get(subject) ?? { prohibited: [], framed: [] }
      if (finding.status === 'prohibited') {
        if (!bucket.prohibited.includes(region)) bucket.prohibited.push(region)
      } else if (!bucket.framed.includes(framedText)) {
        bucket.framed.push(framedText)
      }
      grouped.set(subject, bucket)
    }
  }

  const lines: RegulatoryLine[] = []
  for (const [ingredient, { prohibited, framed }] of grouped) {
    const segments: string[] = []
    if (prohibited.length > 0) segments.push(`interdit : ${prohibited.join(', ')}`)
    if (framed.length > 0) segments.push(`usage encadré : ${framed.join(', ')}`)
    if (segments.length === 0) continue
    lines.push({ key: ingredient, label: ingredient, text: ` — ${segments.join(' · ')}` })
  }

  for (const note of passthrough) lines.push({ key: note, text: note })

  return lines
}
