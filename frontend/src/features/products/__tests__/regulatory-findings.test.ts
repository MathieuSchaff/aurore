import { describe, expect, it } from 'vitest'

import { formatRegulatoryFindings } from '../components/FormulaReading/regulatoryFindings'

// Minimal RegulatoryFinding shape the renderer reads; the lib emits richer
// records that the RPC payload carries structurally.
const finding = (over: {
  status?: 'restricted' | 'prohibited' | 'concentration_limit'
  region?: string
  subjectIngredients?: string[]
  matchedIngredients?: string[]
  maxConcentrationPct?: number
  detail?: string
  scopeId?: string
  note?: string
}) => ({
  status: over.status ?? 'restricted',
  region: over.region ?? 'EU',
  subjectIngredients: over.subjectIngredients ?? [],
  matchedIngredients: over.matchedIngredients ?? [],
  maxConcentrationPct: over.maxConcentrationPct,
  detail: over.detail,
  scopeId: over.scopeId,
  note: over.note ?? '',
})

describe('formatRegulatoryFindings', () => {
  it('groups curated EU + Canada restrictions on one line per ingredient', () => {
    const lines = formatRegulatoryFindings([
      finding({ region: 'EU', detail: 'max 2%', subjectIngredients: ['Sodium Hydroxide'] }),
      finding({ region: 'CA', subjectIngredients: ['Sodium Hydroxide'] }),
    ])
    expect(lines).toEqual([
      {
        key: 'Sodium Hydroxide',
        label: 'Sodium Hydroxide',
        text: ' — usage encadré : UE (max 2 %), Canada',
      },
    ])
  })

  it('translates leave-on/rinse-off and annex references in details', () => {
    const lines = formatRegulatoryFindings([
      finding({
        region: 'EU',
        detail: 'max 2%, 2% leave-on / 3% rinse-off per Annex III/98',
        subjectIngredients: ['Salicylic Acid'],
      }),
    ])
    // The note splits the cap by use, so the structured `max 2%` it repeats is dropped.
    expect(lines[0]?.text).toBe(
      ' — usage encadré : UE (2 % sans rinçage / 3 % à rincer, annexe III/98)'
    )
  })

  it('renders prohibitions before restrictions for the same ingredient', () => {
    const lines = formatRegulatoryFindings([
      finding({ status: 'prohibited', region: 'EU', subjectIngredients: ['Hydroquinone'] }),
      finding({ region: 'CA', detail: 'max 2%', subjectIngredients: ['Hydroquinone'] }),
    ])
    expect(lines).toEqual([
      {
        key: 'Hydroquinone',
        label: 'Hydroquinone',
        text: ' — interdit : UE · usage encadré : Canada (max 2 %)',
      },
    ])
  })

  it('folds concentration_limit into framed usage', () => {
    const lines = formatRegulatoryFindings([
      finding({
        status: 'concentration_limit',
        region: 'EU',
        maxConcentrationPct: 0.3,
        subjectIngredients: ['Retinol'],
      }),
    ])
    expect(lines[0]?.text).toBe(' — usage encadré : UE (max 0,3 %)')
  })

  it('classifies only subject ingredients, not rule conditions', () => {
    const lines = formatRegulatoryFindings([
      finding({
        region: 'EU',
        subjectIngredients: ['Kojic Acid'],
        matchedIngredients: ['Kojic Acid', 'Ascorbic Acid'],
      }),
    ])
    expect(lines).toEqual([
      { key: 'Kojic Acid', label: 'Kojic Acid', text: ' — usage encadré : UE' },
    ])
  })

  it('falls back to the raw note when no ingredient is attributable', () => {
    const lines = formatRegulatoryFindings([
      finding({ region: 'EU', subjectIngredients: ['Parfum'] }),
      finding({ subjectIngredients: [], matchedIngredients: [], note: 'Unattributable note.' }),
    ])
    expect(lines).toEqual([
      { key: 'Parfum', label: 'Parfum', text: ' — usage encadré : UE' },
      { key: 'Unattributable note.', text: 'Unattributable note.' },
    ])
  })

  // Witnesses read off /products/acm-rosakalm-creme-anti-rougeurs. The four
  // faulty lines came from curated English notes in the vendored dataset, not
  // from the borrowed cap, so the Benzyl Alcohol case must not move.
  it('keeps the borrowed cap untouched', () => {
    const lines = formatRegulatoryFindings([
      finding({ region: 'EU', detail: 'max 1%', subjectIngredients: ['Benzyl Alcohol'] }),
    ])
    expect(lines[0]?.text).toBe(' — usage encadré : UE (max 1 %)')
  })

  it('translates the short curated fragments and the decimal separator', () => {
    const lines = formatRegulatoryFindings([
      finding({
        region: 'EU',
        detail: 'max 0.6%, Annex V/13 (not in aerosol dispensers)',
        subjectIngredients: ['Dehydroacetic Acid'],
      }),
      finding({
        region: 'EU',
        detail: 'max 0.6%, Annex V/4 as sorbic acid',
        subjectIngredients: ['Potassium Sorbate'],
      }),
    ])
    // The aside is flattened: the whole detail already sits inside parentheses.
    expect(lines[0]?.text).toBe(' — usage encadré : UE (max 0,6 %, annexe V/13, pas en aérosol)')
    expect(lines[1]?.text).toBe(
      ' — usage encadré : UE (max 0,6 %, annexe V/4 exprimé en acide sorbique)'
    )
  })

  it('drops the structured cap the note already carries', () => {
    const lines = formatRegulatoryFindings([
      finding({
        region: 'EU',
        maxConcentrationPct: 2.5,
        detail: 'max 2.5%, Annex V/1, max 2.5% rinse-off, 0.5% leave-on (as acid)',
        subjectIngredients: ['Sodium Benzoate'],
      }),
    ])
    expect(lines[0]?.text).toBe(
      ' — usage encadré : UE (annexe V/1, max 2,5 % à rincer, 0,5 % sans rinçage, exprimé en acide)'
    )
  })

  it('reduces a note it cannot render to its annex references', () => {
    const lines = formatRegulatoryFindings([
      finding({
        region: 'EU',
        detail:
          'Annex VI/27 UV filter (25%); Annex III/321 limits loose-powder face products and sprayable forms (inhalable TiO2)',
        subjectIngredients: ['Titanium Dioxide'],
      }),
    ])
    expect(lines[0]?.text).toBe(' — usage encadré : UE (annexe VI/27, annexe III/321)')
  })

  it('says the region alone when nothing of the note survives', () => {
    const lines = formatRegulatoryFindings([
      finding({
        region: 'CA',
        detail: 'AHA family per HC hotlist',
        subjectIngredients: ['Glycolic Acid'],
      }),
    ])
    expect(lines[0]?.text).toBe(' — usage encadré : Canada')
  })

  // A borrowed cap the annex confines to one product family. The witness is
  // Homosalate on a sunscreen: 7,34 % governs face products, not the tube on screen.
  it('says the scope of a scoped cap alongside the number', () => {
    const lines = formatRegulatoryFindings([
      finding({
        region: 'EU',
        maxConcentrationPct: 7.34,
        detail: 'max 7.34% (face products, excluding aerosol sprays)',
        scopeId: 'face-products-excluding-aerosol-sprays',
        subjectIngredients: ['Homosalate'],
      }),
    ])
    expect(lines[0]?.text).toBe(
      ' — usage encadré : UE (max 7,34 % pour les produits visage, hors sprays aérosols)'
    )
  })

  it('drops the cap of a scope it cannot phrase', () => {
    // An upstream bump adding a scope goes quiet here rather than printing a bare
    // number that reads as this product's own limit.
    const lines = formatRegulatoryFindings([
      finding({
        region: 'EU',
        maxConcentrationPct: 7.34,
        detail: 'max 7.34% (some new branch)',
        scopeId: 'branch-added-upstream',
        subjectIngredients: ['Homosalate'],
      }),
    ])
    expect(lines[0]?.text).toBe(' — usage encadré : UE')
  })

  it('never nests brackets around a scoped cap', () => {
    const lines = formatRegulatoryFindings([
      finding({
        region: 'EU',
        maxConcentrationPct: 0.3,
        detail: 'max 0.3% (a listed set of hygiene products: toothpastes, hand and body soaps)',
        scopeId: 'listed-hygiene-products',
        subjectIngredients: ['Triclosan'],
      }),
    ])
    expect(lines[0]?.text.match(/\(/g)).toHaveLength(1)
  })

  it('keeps non-primary regions as raw codes', () => {
    const lines = formatRegulatoryFindings([
      finding({ status: 'prohibited', region: 'US', subjectIngredients: ['Mercury'] }),
    ])
    expect(lines[0]?.text).toBe(' — interdit : US')
  })
})
