import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

// Editorial guard against regressions. This is the one place Aurore talks about a
// formula, and the vision forbids verdicts and medical claims there, but the
// wording can drift across several files with nothing else checking it.
// Any match fails, in a string or a comment, unless listed in ALLOWED with a
// reason. Comments count too, so the guard cannot be defeated by accident.

const ROOT = path.resolve(__dirname, '../../../..')

const GUARDED_PATHS = [
  'src/constants/derm.ts',
  'src/constants/preferences.ts',
  'src/features/products/components/FormulaReading',
  'src/features/products/components/FormulaProfile',
  'src/features/products/components/FormulaConcentrations',
  'src/features/products/components/FormulaPreview',
  'src/features/ingredients/components/IngredientInfoTab',
]

// Each term is a claim the INCI list cannot support, or one the vision rules out
// outright. `interdit` is absent on purpose: an Annex II ban is a legal fact the
// regulatory block must be able to state.
const FORBIDDEN: ReadonlyArray<{ term: RegExp; why: string }> = [
  { term: /toxiques?\b/i, why: 'toxicity cannot be read off an INCI list' },
  { term: /canc[ée]r(?:ig|og)[èe]ne/i, why: 'no carcinogenicity claim' },
  { term: /sans danger/i, why: 'false reassurance; safety depends on dose and use' },
  { term: /inoffensi(?:f|ve)/i, why: 'false reassurance' },
  { term: /dangereu(?:x|se)/i, why: 'verdict, not a signal' },
  { term: /nocif|nocive/i, why: 'verdict, not a signal' },
  {
    term: /perturbateur[s]? endocrinien/i,
    why: 'an ingredient assessed for endocrine concern is not a proven disruptor',
  },
  {
    term: /microplastique/i,
    why: 'an INCI name cannot establish the REACH microplastic qualification',
  },
  { term: /gu[ée]ri(?:r|t|ssent|ssant)/i, why: 'medical claim' },
  { term: /diagnostic/i, why: 'medical claim' },
  { term: /garanti[es]?\b/i, why: 'absolute claim' },
]

// Occurrences that deny the claim instead of making it. Matched as exact
// substrings and removed before scanning, so the sentence around them still is.
const ALLOWED: ReadonlyArray<{ phrase: string; why: string }> = [
  {
    phrase: 'pas à poser un diagnostic',
    why: 'IngredientInfoTab disclaimer — states the limit rather than crossing it',
  },
]

const walk = (target: string): string[] => {
  const stat = fs.statSync(target)
  if (stat.isFile()) return /\.tsx?$/.test(target) ? [target] : []
  return fs
    .readdirSync(target)
    .flatMap((entry) =>
      entry === '__tests__' || /\.test\.tsx?$/.test(entry) ? [] : walk(path.join(target, entry))
    )
}

const guardedFiles = GUARDED_PATHS.flatMap((p) => walk(path.join(ROOT, p)))

describe('formula wording', () => {
  it('guards every file of the formula-reading surface', () => {
    // A guarded path that resolves to nothing would make the whole suite pass on
    // an empty set after a rename.
    expect(guardedFiles.length).toBeGreaterThanOrEqual(GUARDED_PATHS.length)
  })

  it.each(guardedFiles.map((file) => [path.relative(ROOT, file), file]))(
    '%s makes no verdict or medical claim',
    (relative, file) => {
      const source = ALLOWED.reduce(
        (text, { phrase }) => text.split(phrase).join(' '),
        fs.readFileSync(file, 'utf8')
      )
      const found = FORBIDDEN.filter(({ term }) => term.test(source)).map(
        ({ term, why }) => `${term.source} — ${why}`
      )
      expect(found, `${relative} uses forbidden wording`).toEqual([])
    }
  )

  it('keeps every allowed negation live', () => {
    // A stale entry silently widens the guard's blind spot.
    const all = guardedFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n')
    for (const { phrase } of ALLOWED) {
      expect(all, `allowed negation is gone: "${phrase}"`).toContain(phrase)
    }
  })
})
