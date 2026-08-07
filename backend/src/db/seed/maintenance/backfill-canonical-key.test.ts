import { describe, expect, it } from 'bun:test'

import { MERGED_EVIDENCE_DB } from 'algo-derm/engine'

import {
  CANONICAL_KEY_OVERRIDES,
  CATALOG_CANONICAL_KEY_OVERRIDES,
  resolveCanonicalKey,
} from './backfill-canonical-key'

describe('resolveCanonicalKey', () => {
  // A key on the French `secondClass` stub reaches no dermo-score driver and no INCI link,
  // and the catalogue names are French, so the first ladder rung lands on one by default.
  it('skips the French spelling stub for the graded record', () => {
    expect(resolveCanonicalKey('Rutine (Rutin)', 'rutin')).toBe('Rutin')
    expect(resolveCanonicalKey('Urée', 'urea')).toBe('Urea')
    expect(resolveCanonicalKey('Phospholipides (Phospholipids)', 'phospholipids-hair')).toBe(
      'Phospholipids'
    )
  })

  // `inuline` held its key by hand-written override until the fiche was renamed after the
  // substance instead of its source: the parenthesised rung now reaches the graded record on its
  // own. Naming it back after the extract silently hands it the ungraded French stub.
  it('reaches the graded record from the parenthesised English name', () => {
    expect(resolveCanonicalKey('Inuline (Inulin)', 'inuline')).toBe('Inulin')
  })

  it('overrides the slugs whose every rung is a stub', () => {
    expect(resolveCanonicalKey('Coenzyme Q10', 'coq10')).toBe('Ubiquinone')
    expect(
      resolveCanonicalKey('Astaxanthine (Haematococcus Pluvialis Extract)', 'astaxanthine')
    ).toBe('Astaxanthin')
  })

  it('keeps the exact INCI record when the display name resolves to a broader alias', () => {
    const cases = [
      ['Acide hyaluronique (Sodium Hyaluronate)', 'sodium-hyaluronate', 'Sodium Hyaluronate'],
      ['Acides Aminés de Riz (Rice Amino Acids)', 'rice-amino-acids', 'Rice Amino Acids'],
      ['Acides Aminés de Soie (Silk Amino Acids)', 'silk-amino-acids', 'Silk Amino Acids'],
      ['Acides Aminés de Blé (Wheat Amino Acids)', 'wheat-amino-acids', 'Wheat Amino Acids'],
    ] as const

    for (const [name, slug, expected] of cases) {
      expect(resolveCanonicalKey(name, slug)).toBe(expected)
    }
  })

  it('keeps catalogue identities that the vendor merges or does not know', () => {
    const cases = [
      ['Angiopausine™ (Extrait de Silybum marianum)', 'angiopausine', 'Angiopausine'],
      ['Comedoclastin™ (Extrait de Silybum marianum)', 'comedoclastin', 'Comedoclastin'],
      [
        'Extrait de chardon-marie (Silybum Marianum Seed Extract)',
        'chardon-marie',
        'SILYBUM MARIANUM SEED EXTRACT',
      ],
      [
        'Extrait de chardon-marie (Silybum Marianum Extract)',
        'silybum-marianum-extract',
        'SILYBUM MARIANUM EXTRACT',
      ],
      [
        'Extrait de fruit de chardon-marie (Silybum Marianum Fruit Extract)',
        'silybum-marianum-fruit-extract',
        'SILYBUM MARIANUM FRUIT EXTRACT',
      ],
      [
        'Huile de graines de chardon-marie (Silybum Marianum Seed Oil)',
        'silybum-marianum-seed-oil',
        'SILYBUM MARIANUM SEED OIL',
      ],
      [
        'Ester éthylique de chardon-marie (Silybum Marianum Ethyl Ester)',
        'silybum-marianum-ethyl-ester',
        'SILYBUM MARIANUM ETHYL ESTER',
      ],
    ] as const

    for (const [name, slug, expected] of cases) {
      expect(resolveCanonicalKey(name, slug)).toBe(expected)
    }
  })

  it('keeps the stub when no rung reaches a graded record', () => {
    expect(resolveCanonicalKey('Glucosylrutine', 'glucosylrutin')).toBe('Glucosylrutin')
  })

  it('leaves a slug whose alias resolution conflates two substances unkeyed', () => {
    expect(resolveCanonicalKey('Céramide NG', 'ceramide-ng')).toBeNull()
  })

  it('leaves Tetrasodium EDTA unkeyed while the vendor resolves it as Disodium EDTA', () => {
    expect(resolveCanonicalKey('Tetrasodium EDTA', 'tetrasodium-edta')).toBeNull()
  })

  // The ladder resolves the name to `Aqua`, which would give one brand's fiche the identity of
  // plain water. A `.db-fixes` had already nulled it; the generator used to hand it straight back.
  it('never keys a branded thermal spring water on Aqua', () => {
    expect(resolveCanonicalKey("Eau Thermale d'Avène", 'avene-thermal-spring-water')).toBeNull()
  })

  // Flower and Bud extract are declared as distinct forms; the ladder resolves both
  // onto the same Flower evidence record, which would conflate them.
  it('never keys the Eugenia extract fiche on either the Flower or Bud form', () => {
    expect(
      resolveCanonicalKey('Eugenia Caryophyllus Flower Extract', 'eugenia-caryophyllus-extract')
    ).toBeNull()
    expect(
      resolveCanonicalKey('Eugenia Caryophyllus Bud Extract', 'eugenia-caryophyllus-extract')
    ).toBeNull()
  })

  // The overrides are maintained by hand; a bump renaming or dropping a target would
  // otherwise write dangling canonical keys no consumer can reach.
  it('keeps every override target present in the evidence DB', () => {
    const keys = new Set(Object.values(MERGED_EVIDENCE_DB).map((r) => r.inci))
    for (const target of Object.values(CANONICAL_KEY_OVERRIDES)) {
      expect(keys.has(target)).toBe(true)
    }
  })

  it('keeps local catalogue identity keys unique', () => {
    const keys = Object.values(CATALOG_CANONICAL_KEY_OVERRIDES)
    expect(new Set(keys).size).toBe(keys.length)
  })
})
