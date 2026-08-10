import { execFileSync } from 'node:child_process'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { formatRegulatoryFindings } from '../components/FormulaReading/regulatoryFindings'

// Corpus guard. Unit tests pin a few witnesses; this one runs every curated
// regulatory note of the vendored pin through the renderer, so a vendor bump
// that adds an English turn of phrase is caught here, not on the product page.
// It reads the committed tarball itself, so it cannot pass against a stale copy.

const TARBALL = path.resolve(__dirname, '../../../../..', 'vendor/algo-derm.tgz')
const DATASET = 'package/data/ingredients/ingredients.jsonl'

// Every word the FR renderer is allowed to emit. Listed here rather than imported
// so that widening the translation table forces a deliberate edit on this side too.
const FR_WORDS = new Set(
  [
    'max',
    'annexe',
    'sans',
    'rinçage',
    'à',
    'rincer',
    'uniquement',
    'pas',
    'en',
    'aérosol',
    'spray',
    'étiquetage',
    'au-delà',
    'de',
    'indice',
    'peroxyde',
    'inférieur',
    'exprimé',
    'acide',
    'sorbique',
    'benzoïque',
    'filtre',
    'UV',
    'ou',
  ].map((word) => word.toLowerCase())
)

// Mirrors algo-derm's `formatRegulatoryDetail`: the backend hands the frontend the
// already-joined string, so the corpus has to be assembled the same way.
const buildDetail = (entry: {
  maxConcentrationPct?: number
  leaveOnOnly?: boolean
  rinseOffOnly?: boolean
  notes?: string
}): string | undefined => {
  const bits: string[] = []
  if (entry.maxConcentrationPct != null) bits.push(`max ${entry.maxConcentrationPct}%`)
  if (entry.leaveOnOnly) bits.push('leave-on only')
  if (entry.rinseOffOnly) bits.push('rinse-off only')
  if (entry.notes) bits.push(entry.notes)
  return bits.length ? bits.join(', ') : undefined
}

interface Rendered {
  inci: string
  region: string
  notes: string
  detail: string
}

const renderCorpus = (): Rendered[] => {
  const jsonl = execFileSync('tar', ['-xzOf', TARBALL, DATASET], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })

  const rendered: Rendered[] = []
  for (const line of jsonl.split('\n')) {
    if (!line) continue
    const record = JSON.parse(line)
    for (const [region, entry] of Object.entries<Record<string, never>>(record.regulatory ?? {})) {
      if (!entry?.notes) continue
      const [line0] = formatRegulatoryFindings([
        {
          status: 'restricted',
          region,
          subjectIngredients: [record.inci],
          matchedIngredients: [],
          maxConcentrationPct: entry.maxConcentrationPct,
          detail: buildDetail(entry),
          note: '',
        },
      ])
      rendered.push({
        inci: record.inci,
        region,
        notes: entry.notes,
        detail: (line0?.text ?? '').match(/\(([\s\S]*)\)$/)?.[1] ?? '',
      })
    }
  }
  return rendered
}

const corpus = renderCorpus()
const words = (text: string): string[] =>
  text.replace(/annexe [IVX]+\/[\dA-Za-z.]+/g, ' ').match(/\p{L}[\p{L}'’-]*/gu) ?? []

describe('regulatory wording over the vendored corpus', () => {
  it('reads a corpus at all', () => {
    // A tarball layout change would otherwise make every assertion below vacuous.
    expect(corpus.length).toBeGreaterThan(50)
  })

  it('leaks no untranslated word onto the page', () => {
    const leaks = corpus
      .filter(({ detail }) => words(detail).some((w) => !FR_WORDS.has(w.toLowerCase())))
      .map(({ inci, region, detail }) => `${inci} [${region}] — ${detail}`)
    expect(leaks).toEqual([])
  })

  it('never nests parentheses', () => {
    const nested = corpus.filter(({ detail }) => detail.includes('(')).map((r) => r.detail)
    expect(nested).toEqual([])
  })

  it('keeps translating the prose it used to translate', () => {
    // Falling back to annex references is safe but lossy, so a bump that silently
    // widens the fallback should fail here even though nothing leaks. Measured as
    // a share, not a count: adding ingredients upstream moves the total, and an
    // absolute floor would read that as a regression.
    const translated = corpus.filter(({ detail }) =>
      words(detail).some((w) => !['max', 'annexe'].includes(w.toLowerCase()))
    )
    const share = translated.length / corpus.length
    expect(
      share,
      `${translated.length}/${corpus.length} notes keep translated prose (was 34/97)`
    ).toBeGreaterThanOrEqual(0.3)
  })
})
