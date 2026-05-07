import { describe, expect, test } from 'bun:test'

import { SKINCARE_PRODUCT_TAG_SLUGS } from '@habit-tracker/shared'
import { detectActifClasses } from '../utils/actif-class-detection'

describe('actif-class-detection', () => {
  test('empty/null/whitespace INCI returns []', () => {
    expect(detectActifClasses(null)).toEqual([])
    expect(detectActifClasses(undefined)).toEqual([])
    expect(detectActifClasses('')).toEqual([])
    expect(detectActifClasses('   ')).toEqual([])
  })

  test('detects retinoids cluster from canonical INCI', () => {
    const inci = 'Aqua, Retinol, Glycerin, Tocopherol'
    const classes = detectActifClasses(inci)
    expect(classes).toContain(SKINCARE_PRODUCT_TAG_SLUGS.RETINOIDS)
    expect(classes).toContain(SKINCARE_PRODUCT_TAG_SLUGS.VITAMIN_E)
  })

  test('detects vitamin C variants (different esters)', () => {
    const inci = 'Aqua, Ascorbyl Glucoside, Sodium Ascorbyl Phosphate, Glycerin'
    expect(detectActifClasses(inci)).toContain(SKINCARE_PRODUCT_TAG_SLUGS.VITAMIN_C)
  })

  test('detects multiple clusters in the same product', () => {
    const inci = 'Aqua, Niacinamide, Salicylic Acid, Hyaluronic Acid, Ceramide NP'
    const classes = detectActifClasses(inci)
    expect(classes).toEqual(
      expect.arrayContaining([
        SKINCARE_PRODUCT_TAG_SLUGS.NIACINAMIDE,
        SKINCARE_PRODUCT_TAG_SLUGS.BHA,
        SKINCARE_PRODUCT_TAG_SLUGS.HYALURONIC_ACID,
        SKINCARE_PRODUCT_TAG_SLUGS.CERAMIDES,
      ])
    )
  })

  test('bakuchiol is retinol-alternatives, NOT retinoids', () => {
    const inci = 'Aqua, Bakuchiol, Glycerin'
    const classes = detectActifClasses(inci)
    expect(classes).toContain(SKINCARE_PRODUCT_TAG_SLUGS.RETINOL_ALTERNATIVES)
    expect(classes).not.toContain(SKINCARE_PRODUCT_TAG_SLUGS.RETINOIDS)
  })

  test('AHA family detection (glycolic, lactic, mandelic)', () => {
    expect(detectActifClasses('Aqua, Glycolic Acid')).toContain(SKINCARE_PRODUCT_TAG_SLUGS.AHA)
    expect(detectActifClasses('Aqua, Lactic Acid')).toContain(SKINCARE_PRODUCT_TAG_SLUGS.AHA)
    expect(detectActifClasses('Aqua, Mandelic Acid')).toContain(SKINCARE_PRODUCT_TAG_SLUGS.AHA)
  })

  test('no false positive: pure hydration product gets no exfoliant clusters', () => {
    const inci = 'Aqua, Glycerin, Sodium Hyaluronate, Panthenol'
    const classes = detectActifClasses(inci)
    expect(classes).toContain(SKINCARE_PRODUCT_TAG_SLUGS.HYALURONIC_ACID)
    expect(classes).not.toContain(SKINCARE_PRODUCT_TAG_SLUGS.AHA)
    expect(classes).not.toContain(SKINCARE_PRODUCT_TAG_SLUGS.BHA)
    expect(classes).not.toContain(SKINCARE_PRODUCT_TAG_SLUGS.RETINOIDS)
  })

  test('peptides cluster catches several peptide families', () => {
    expect(detectActifClasses('Aqua, Matrixyl 3000')).toContain(SKINCARE_PRODUCT_TAG_SLUGS.PEPTIDES)
    expect(detectActifClasses('Aqua, Argireline')).toContain(SKINCARE_PRODUCT_TAG_SLUGS.PEPTIDES)
    expect(detectActifClasses('Aqua, Acetyl Hexapeptide-8')).toContain(
      SKINCARE_PRODUCT_TAG_SLUGS.PEPTIDES
    )
  })

  test('centella derivatives all map to centella cluster', () => {
    const inci = 'Aqua, Centella Asiatica Extract, Madecassoside, Asiaticoside'
    expect(detectActifClasses(inci)).toContain(SKINCARE_PRODUCT_TAG_SLUGS.CENTELLA)
  })

  test('case-insensitive (algo-derm normalize handles casing)', () => {
    expect(detectActifClasses('AQUA, RETINOL, GLYCERIN')).toContain(
      SKINCARE_PRODUCT_TAG_SLUGS.RETINOIDS
    )
    expect(detectActifClasses('aqua, retinol, glycerin')).toContain(
      SKINCARE_PRODUCT_TAG_SLUGS.RETINOIDS
    )
  })

  test('no duplicates in result', () => {
    // Two retinoids in the same INCI → cluster appears once
    const inci = 'Aqua, Retinol, Retinyl Palmitate'
    const classes = detectActifClasses(inci)
    const retinoidCount = classes.filter((c) => c === SKINCARE_PRODUCT_TAG_SLUGS.RETINOIDS).length
    expect(retinoidCount).toBe(1)
  })
})
