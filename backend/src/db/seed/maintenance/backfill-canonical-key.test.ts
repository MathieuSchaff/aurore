import { describe, expect, it } from 'bun:test'

import { MERGED_EVIDENCE_DB } from 'algo-derm/engine'

import { CANONICAL_KEY_OVERRIDES, resolveCanonicalKey } from './backfill-canonical-key'

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

  it('keeps the stub when no rung reaches a graded record', () => {
    expect(resolveCanonicalKey('Glucosylrutine', 'glucosylrutin')).toBe('Glucosylrutin')
  })

  it('leaves a slug whose alias resolution conflates two substances unkeyed', () => {
    expect(resolveCanonicalKey('Céramide NG', 'ceramide-ng')).toBeNull()
  })

  // The ladder resolves the name to `Aqua`, which would give one brand's fiche the identity of
  // plain water. A `.db-fixes` had already nulled it; the generator used to hand it straight back.
  it('never keys a branded thermal spring water on Aqua', () => {
    expect(resolveCanonicalKey("Eau Thermale d'Avène", 'avene-thermal-spring-water')).toBeNull()
  })

  // The overrides are maintained by hand; a bump renaming or dropping a target would
  // otherwise write dangling canonical keys no consumer can reach.
  it('keeps every override target present in the evidence DB', () => {
    const keys = new Set(Object.values(MERGED_EVIDENCE_DB).map((r) => r.inci))
    for (const target of Object.values(CANONICAL_KEY_OVERRIDES)) {
      expect(keys.has(target)).toBe(true)
    }
  })
})
