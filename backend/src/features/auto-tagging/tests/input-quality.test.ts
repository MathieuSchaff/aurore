import { describe, expect, test } from 'bun:test'

import { normalizeInci } from '../../../lib/normalize-inci'
import { explainInci } from '../explain'
import { detectAllAutoTags } from '../orchestrator'
import { detectAutoTags } from '../passes/algo-derm-detection'
import { detectSansSavon } from '../passes/formula/sans-savon'

describe('INCI quality before absence inference', () => {
  test.each([
    'Aqua, Glycerin, Niacinamide, ...',
    'Aqua, Glycerin, Niacinamide,',
    'Aqua, Glycerin, Niacinamide, Appliquer matin et soir',
    'Le maquillage contient des filtres gras, seule une formule grasse peut les dissoudre',
    'Les cellules mortes obstruent la surface de la peau, cette mousse révèle son éclat',
    'The cleanser feels gentle, my skin felt fresh, I would recommend it',
  ])('withholds inferred absences from damaged text: %s', (inci) => {
    const tags = detectAllAutoTags({ inci, kind: 'cleanser', category: 'skincare' })
    expect(tags.filter((tag) => tag.tagSlug.startsWith('sans-'))).toEqual([])
    expect(tags.some((tag) => tag.tagSlug === 'non-irritant')).toBe(false)
    expect(detectSansSavon(inci, 'cleanser')).toEqual([])
    expect(
      detectAutoTags(inci, 'cleanser').filter((tag) => tag.source === 'detected_absence')
    ).toEqual([])
  })

  test('preserves an explicit claim after withholding its inferred candidate', () => {
    const trace = explainInci({
      inci: 'Aqua, Glycerin, Niacinamide, ...',
      kind: 'serum',
      category: 'skincare',
      name: 'Serum sans parfum',
    })
    expect(trace.final).toContainEqual({
      tagSlug: 'sans-parfum',
      relevance: 'secondary',
      source: 'formula',
    })
    expect(
      trace.layers.find((layer) => layer.name === 'formula:absence-claims-text')?.proposals
    ).toContainEqual(expect.objectContaining({ tagSlug: 'sans-parfum', outcome: 'won' }))
    expect(trace.drops).toContainEqual(
      expect.objectContaining({ candidateId: 'sans-parfum', reason: 'input_quality' })
    )
    expect(trace.final.some((tag) => tag.tagSlug === 'type-serum')).toBe(true)
  })

  test('keeps the ingredient veto on an explicit claim with damaged input', () => {
    const tags = detectAllAutoTags({
      inci: 'Aqua, Parfum, ...',
      kind: 'serum',
      category: 'skincare',
      name: 'Serum sans parfum',
    })
    expect(tags.some((tag) => tag.tagSlug === 'sans-parfum')).toBe(false)
  })

  test.each([
    'Squalane',
    'Artemisia Princeps Extract',
    'Aqua, Glycerin',
    'Aqua, Glycerin, CI 77491, CI 77492, CI 77499, Titanium Dioxide [nano]',
    'Aqua, Butylene Glycol, Glycerin, Niacinamide, Panthenol, Phenoxyethanol, Sodium Hyaluronate',
    'Aqua, Glycerin, Fictus Plantus Extract, Niacinamide, Panthenol',
    'Ingredients: Aqua, Glycerin, Niacinamide',
  ])('keeps absence inference without damage evidence: %s', (inci) => {
    const tags = detectAllAutoTags({ inci, kind: 'serum', category: 'skincare' })
    expect(tags).toContainEqual({
      tagSlug: 'sans-parfum',
      relevance: 'secondary',
      source: 'algo-derm',
    })
  })

  test.each(['Aqua, Glycerin, ...', 'Aqua, Glycerin,'])(
    'retains damage evidence through intake normalization: %s',
    (inci) => {
      const normalized = normalizeInci(inci)
      expect(normalized.value).toBe(inci)
      expect(normalized.guardrailTripped).toBe(true)
      expect(
        detectAllAutoTags({ inci: normalized.value, kind: 'serum', category: 'skincare' }).filter(
          (tag) => tag.tagSlug.startsWith('sans-')
        )
      ).toEqual([])
    }
  )
})
