import { describe, expect, test } from 'bun:test'

import { SKINCARE_PRODUCT_TAG_SLUGS } from '@habit-tracker/shared'

import {
  detectCernesPoches,
  detectEczemaAtopie,
  detectEffetProtecteur,
  detectFiniGlowy,
  detectFiniMat,
  detectGrossesseAvoid,
  detectKeratosePilaire,
  detectNonGrasAbsorption,
  detectOcclusifTags,
  detectPeauNormale,
  detectPigmentsVerts,
  detectPrebiotique,
  detectReparationCutanee,
  detectRepulpant,
  detectSemiOcclusif,
  detectSolaireTags,
  detectStepNettoyage1,
  detectTextureFromField,
  detectTextureGelInci,
  detectTextureLegere,
  detectTextureRiche,
  detectVegan,
} from '../utils/formula-detection'

const S = SKINCARE_PRODUCT_TAG_SLUGS

describe('detectOcclusifTags', () => {
  test('petrolatum in top 8 → occlusif tags', () => {
    const tags = detectOcclusifTags('Aqua, Petrolatum, Glycerin')
    expect(tags.length).toBeGreaterThan(0)
  })

  test('petrolatum past position 8 → not flagged (texture emollient)', () => {
    const filler = Array.from({ length: 8 }, (_, i) => `Filler${i + 1}`).join(', ')
    expect(detectOcclusifTags(`Aqua, ${filler}, Petrolatum`)).toEqual([])
  })
})

describe('detectSemiOcclusif', () => {
  test('squalane top 5 leave-on → semi-occlusif', () => {
    const tags = detectSemiOcclusif('Aqua, Glycerin, Squalane, Niacinamide', 'moisturizer')
    expect(tags).toEqual([S.SEMI_OCCLUSIF])
  })

  test('dimethicone top 5 leave-on → semi-occlusif', () => {
    const tags = detectSemiOcclusif('Aqua, Glycerin, Dimethicone, Tocopherol', 'serum')
    expect(tags).toEqual([S.SEMI_OCCLUSIF])
  })

  test('isohexadecane top 5 leave-on → semi-occlusif', () => {
    const tags = detectSemiOcclusif('Aqua, Isohexadecane, Glycerin, Niacinamide', 'moisturizer')
    expect(tags).toEqual([S.SEMI_OCCLUSIF])
  })

  test('squalane past position 5 → not flagged', () => {
    const filler = Array.from({ length: 5 }, (_, i) => `Filler${i + 1}`).join(', ')
    expect(detectSemiOcclusif(`Aqua, ${filler}, Squalane`, 'moisturizer')).toEqual([])
  })

  test('rinse-off cleanser with dimethicone → not flagged', () => {
    expect(detectSemiOcclusif('Aqua, Dimethicone, Sodium Cocoyl Isethionate', 'cleanser')).toEqual(
      []
    )
  })

  test('mutex with occlusif: petrolatum top 8 + squalane top 5 → not semi-occlusif', () => {
    // True film-former wins. Petrolatum at pos 2, squalane at pos 4: occlusif
    // is functionally accurate, semi-occlusif would dilute the distinction.
    const tags = detectSemiOcclusif(
      'Aqua, Petrolatum, Glycerin, Squalane, Tocopherol',
      'moisturizer'
    )
    expect(tags).toEqual([])
  })

  test('squalene (animal sebum lipid) does not match squalane substring', () => {
    // Cosmetic-grade `squalane` is the saturated form; `squalene` is animal-
    // derived. Pattern keys on the trailing 'ne' so substring lookup stays
    // tight.
    expect(detectSemiOcclusif('Aqua, Glycerin, Squalene, Niacinamide', 'serum')).toEqual([])
  })

  test('cyclomethicone (volatile silicone) does not match dimethicone', () => {
    // Cyclic silicones evaporate from skin and don't reduce TEWL.
    expect(detectSemiOcclusif('Aqua, Cyclomethicone, Glycerin', 'serum')).toEqual([])
  })

  test('dimethiconol top 5 leave-on → semi-occlusif (separate pattern)', () => {
    // `dimethiconol` substring does not contain `dimethicone` (different
    // trailing letter); explicit pattern needed.
    const tags = detectSemiOcclusif('Aqua, Dimethiconol, Glycerin, Tocopherol', 'serum')
    expect(tags).toEqual([S.SEMI_OCCLUSIF])
  })
})

describe('detectGrossesseAvoid — tier 1', () => {
  test('retinol → avoid', () => {
    expect(detectGrossesseAvoid('Aqua, Retinol, Glycerin', 'serum')).toBe(true)
  })

  test('hydroquinone → avoid', () => {
    expect(detectGrossesseAvoid('Aqua, Hydroquinone, Glycerin', 'serum')).toBe(true)
  })

  test('formaldehyde donor (DMDM hydantoin) → avoid, any kind', () => {
    expect(detectGrossesseAvoid('Aqua, Glycerin, DMDM Hydantoin', 'moisturizer')).toBe(true)
    expect(detectGrossesseAvoid('Aqua, Glycerin, DMDM Hydantoin', 'cleanser')).toBe(true)
  })

  test('formaldehyde donor variants — quaternium-15, imidazolidinyl urea, bronopol', () => {
    expect(detectGrossesseAvoid('Aqua, Quaternium-15', 'serum')).toBe(true)
    expect(detectGrossesseAvoid('Aqua, Imidazolidinyl Urea', 'serum')).toBe(true)
    expect(detectGrossesseAvoid('Aqua, Diazolidinyl Urea', 'serum')).toBe(true)
    expect(detectGrossesseAvoid('Aqua, Bronopol', 'serum')).toBe(true)
  })

  test('formaldehyde donor at trailing position still flagged (preservative slot)', () => {
    const filler = Array.from({ length: 18 }, (_, i) => `Filler${i + 1}`).join(', ')
    expect(detectGrossesseAvoid(`Aqua, ${filler}, DMDM Hydantoin`, 'moisturizer')).toBe(true)
  })
})

describe('detectGrossesseAvoid — homosalate (sunscreen only)', () => {
  test('homosalate in sunscreen → avoid', () => {
    expect(detectGrossesseAvoid('Aqua, Homosalate, Octocrylene', 'sunscreen')).toBe(true)
  })

  test('homosalate in non-sunscreen → not flagged via this path', () => {
    // Off-label appearance (e.g. tinted balm) — out of pregnancy-safety scope here.
    expect(detectGrossesseAvoid('Aqua, Homosalate, Glycerin', 'lip-care')).toBe(false)
  })
})

describe('detectGrossesseAvoid — risky essential oils', () => {
  test('peppermint oil in top 8 → avoid', () => {
    expect(detectGrossesseAvoid('Aqua, Glycerin, Mentha Piperita Oil', 'serum')).toBe(true)
  })

  test('clary sage oil in top 8 → avoid', () => {
    expect(detectGrossesseAvoid('Aqua, Glycerin, Salvia Sclarea (Clary) Oil', 'serum')).toBe(true)
  })

  test('rosemary essential oil (verbenone CT) in top 8 → avoid', () => {
    expect(
      detectGrossesseAvoid('Aqua, Glycerin, Rosmarinus Officinalis (Rosemary) Leaf Oil', 'serum')
    ).toBe(true)
  })

  test('rosemary leaf extract (polyphenol CO2, no "oil") → not flagged', () => {
    expect(
      detectGrossesseAvoid('Aqua, Glycerin, Rosmarinus Officinalis Leaf Extract', 'serum')
    ).toBe(false)
  })

  test('peppermint leaf extract (no "oil") → not flagged', () => {
    expect(detectGrossesseAvoid('Aqua, Glycerin, Mentha Piperita Leaf Extract', 'serum')).toBe(
      false
    )
  })

  test('peppermint oil past position 8 (perfume trace) → not flagged', () => {
    const filler = Array.from({ length: 8 }, (_, i) => `Filler${i + 1}`).join(', ')
    expect(detectGrossesseAvoid(`Aqua, ${filler}, Mentha Piperita Oil`, 'serum')).toBe(false)
  })
})

describe('detectGrossesseAvoid — preserves prior behavior', () => {
  test('clean INCI → not flagged', () => {
    expect(detectGrossesseAvoid('Aqua, Glycerin, Niacinamide, Panthenol', 'serum')).toBe(false)
  })

  test('salicylic acid in cleanser (rinse-off) → not flagged', () => {
    expect(detectGrossesseAvoid('Aqua, Salicylic Acid, Glycerin', 'cleanser')).toBe(false)
  })
})

describe('detectSolaireTags — sanity', () => {
  test('avobenzone in sunscreen → chemical filter', () => {
    const tags = detectSolaireTags('Aqua, Avobenzone, Octocrylene', 'sunscreen', 'solaire')
    expect(tags.length).toBeGreaterThan(0)
  })

  test('zinc oxide in cica cream (skincare) → not flagged', () => {
    expect(detectSolaireTags('Aqua, Zinc Oxide, Centella', 'moisturizer', 'skincare')).toEqual([])
  })
})

describe('detectPrebiotique — sanity', () => {
  test('inulin → prebiotique', () => {
    expect(detectPrebiotique('Aqua, Inulin, Glycerin').length).toBeGreaterThan(0)
  })
})

describe('detectStepNettoyage1', () => {
  test('oil cleanser (mineral oil pos 1) → step-nettoyage-1', () => {
    expect(
      detectStepNettoyage1(
        'Mineral Oil, Ethylhexyl Palmitate, PEG-20 Glyceryl Triisostearate, Tocopherol',
        'cleanser'
      )
    ).toContain(S.STEP_NETTOYAGE_1)
  })

  test('balm cleanser (shea butter pos 1) → step-nettoyage-1', () => {
    expect(
      detectStepNettoyage1(
        'Butyrospermum Parkii Butter, Caprylic/Capric Triglyceride, Tocopherol',
        'cleanser'
      )
    ).toContain(S.STEP_NETTOYAGE_1)
  })

  test('cleanser with oil pos 2 (water-based hybrid) → step-nettoyage-1', () => {
    expect(
      detectStepNettoyage1(
        'Aqua, Caprylic/Capric Triglyceride, Glycerin, Polysorbate 20',
        'cleanser'
      )
    ).toContain(S.STEP_NETTOYAGE_1)
  })

  test('foaming gel cleanser (SLS top 5) → not flagged', () => {
    expect(
      detectStepNettoyage1(
        'Aqua, Caprylic/Capric Triglyceride, Glycerin, Sodium Lauryl Sulfate, Cocamidopropyl Betaine',
        'cleanser'
      )
    ).toEqual([])
  })

  test('SLES variant in top 5 → not flagged', () => {
    expect(
      detectStepNettoyage1(
        'Aqua, Caprylic/Capric Triglyceride, Sodium Laureth Sulfate, Glycerin, Cocamide DEA',
        'cleanser'
      )
    ).toEqual([])
  })

  test('cleanser without oil in top 3 → not flagged', () => {
    expect(
      detectStepNettoyage1(
        'Aqua, Glycerin, Cocamidopropyl Betaine, Decyl Glucoside, Caprylic/Capric Triglyceride',
        'cleanser'
      )
    ).toEqual([])
  })

  test('non-cleanser kind (moisturizer) → not flagged', () => {
    expect(
      detectStepNettoyage1('Caprylic/Capric Triglyceride, Glycerin, Aqua', 'moisturizer')
    ).toEqual([])
  })

  test('null/empty INCI → []', () => {
    expect(detectStepNettoyage1(null, 'cleanser')).toEqual([])
    expect(detectStepNettoyage1('', 'cleanser')).toEqual([])
  })
})

describe('detectCernesPoches', () => {
  test('eye-cream + caffeine → cernes-poches', () => {
    expect(detectCernesPoches('Aqua, Glycerin, Caffeine, Niacinamide', 'eye-cream')).toContain(
      S.CERNES_POCHES
    )
  })

  test('eye-cream + peptide pattern → cernes-poches', () => {
    expect(
      detectCernesPoches('Aqua, Glycerin, Acetyl Hexapeptide-8, Tocopherol', 'eye-cream')
    ).toContain(S.CERNES_POCHES)
  })

  test('eye-cream + matrixyl → cernes-poches', () => {
    expect(detectCernesPoches('Aqua, Glycerin, Matrixyl 3000', 'eye-cream')).toContain(
      S.CERNES_POCHES
    )
  })

  test('caffeine in serum (not eye-cream) → not flagged', () => {
    expect(detectCernesPoches('Aqua, Glycerin, Caffeine, Niacinamide', 'serum')).toEqual([])
  })

  test('caffeine past position 12 → not flagged', () => {
    const filler = Array.from({ length: 12 }, (_, i) => `Filler${i + 1}`).join(', ')
    expect(detectCernesPoches(`Aqua, ${filler}, Caffeine`, 'eye-cream')).toEqual([])
  })

  test('eye-cream without caffeine/peptides → not flagged', () => {
    expect(detectCernesPoches('Aqua, Glycerin, Niacinamide, Hyaluronic Acid', 'eye-cream')).toEqual(
      []
    )
  })

  test('null/empty INCI → []', () => {
    expect(detectCernesPoches(null, 'eye-cream')).toEqual([])
    expect(detectCernesPoches('', 'eye-cream')).toEqual([])
  })
})

describe('detectKeratosePilaire', () => {
  test('urea in top 8 + body-lotion → keratose-pilaire', () => {
    expect(
      detectKeratosePilaire('Aqua, Urea, Glycerin, Petrolatum', 'body-lotion')
    ).toContain(S.KERATOSE_PILAIRE)
  })

  test('urea + body-oil → keratose-pilaire', () => {
    expect(detectKeratosePilaire('Caprylic/Capric Triglyceride, Urea', 'body-oil')).toContain(
      S.KERATOSE_PILAIRE
    )
  })

  test('urea past position 8 (humectant trace) → not flagged', () => {
    const filler = Array.from({ length: 8 }, (_, i) => `Filler${i + 1}`).join(', ')
    expect(detectKeratosePilaire(`Aqua, ${filler}, Urea`, 'body-lotion')).toEqual([])
  })

  test('lactic acid + ammonium lactate combo → keratose-pilaire (AmLactin pattern)', () => {
    expect(
      detectKeratosePilaire(
        'Aqua, Ammonium Lactate, Lactic Acid, Glycerin',
        'body-lotion'
      )
    ).toContain(S.KERATOSE_PILAIRE)
  })

  test('lactic acid alone (no ammonium lactate) → not flagged (pH adjuster vs buffered)', () => {
    expect(
      detectKeratosePilaire('Aqua, Glycerin, Lactic Acid, Petrolatum', 'body-lotion')
    ).toEqual([])
  })

  test('urea in non-eligible kind (body-wash) → not flagged (rinse-off)', () => {
    expect(detectKeratosePilaire('Aqua, Urea, Sodium Laureth Sulfate', 'body-wash')).toEqual([])
  })

  test('urea in hand-cream → not flagged (different concern domain)', () => {
    expect(detectKeratosePilaire('Aqua, Urea, Glycerin', 'hand-cream')).toEqual([])
  })

  test('urea in face moisturizer → not flagged (not body kind)', () => {
    expect(detectKeratosePilaire('Aqua, Urea, Glycerin', 'moisturizer')).toEqual([])
  })

  test('null/empty INCI → []', () => {
    expect(detectKeratosePilaire(null, 'body-lotion')).toEqual([])
    expect(detectKeratosePilaire('', 'body-lotion')).toEqual([])
  })
})

describe('detectReparationCutanee', () => {
  test('panthenol in top 12 → reparation-cutanee', () => {
    expect(detectReparationCutanee('Aqua, Glycerin, Panthenol')).toContain(S.REPARATION)
  })

  test('allantoin → reparation-cutanee', () => {
    expect(detectReparationCutanee('Aqua, Allantoin, Glycerin')).toContain(S.REPARATION)
  })

  test('centella asiatica extract → reparation-cutanee', () => {
    expect(
      detectReparationCutanee('Aqua, Glycerin, Centella Asiatica Leaf Extract')
    ).toContain(S.REPARATION)
  })

  test('madecassoside (centella isolate) → reparation-cutanee', () => {
    expect(detectReparationCutanee('Aqua, Madecassoside, Glycerin')).toContain(S.REPARATION)
  })

  test('bisabolol → reparation-cutanee', () => {
    expect(detectReparationCutanee('Aqua, Glycerin, Bisabolol')).toContain(S.REPARATION)
  })

  test('actif past position 12 (texture polish trace) → not flagged', () => {
    const filler = Array.from({ length: 12 }, (_, i) => `Filler${i + 1}`).join(', ')
    expect(detectReparationCutanee(`Aqua, ${filler}, Panthenol`)).toEqual([])
  })

  test('clean INCI without repair actifs → not flagged', () => {
    expect(detectReparationCutanee('Aqua, Glycerin, Niacinamide, Hyaluronic Acid')).toEqual([])
  })

  test('null/empty INCI → []', () => {
    expect(detectReparationCutanee(null)).toEqual([])
    expect(detectReparationCutanee('')).toEqual([])
  })
})

describe('detectEczemaAtopie', () => {
  test('avena sativa kernel flour (colloidal oatmeal) on body-lotion → eczema-atopie', () => {
    expect(
      detectEczemaAtopie('Aqua, Glycerin, Avena Sativa Kernel Flour', 'body-lotion')
    ).toContain(S.ECZEMA_ATOPIE)
  })

  test('avena sativa anywhere on serum → eczema-atopie (oat = OTC skin protectant)', () => {
    const filler = Array.from({ length: 15 }, (_, i) => `Filler${i + 1}`).join(', ')
    expect(detectEczemaAtopie(`Aqua, ${filler}, Avena Sativa Kernel Extract`, 'serum')).toContain(
      S.ECZEMA_ATOPIE
    )
  })

  test('avena sativa on cleanser (rinse-off) → not flagged', () => {
    expect(
      detectEczemaAtopie('Aqua, Avena Sativa Kernel Flour, Glycerin', 'cleanser')
    ).toEqual([])
  })

  test('≥2 ceramides top 12 + no fragrance + no sulfate → eczema-atopie', () => {
    expect(
      detectEczemaAtopie(
        'Aqua, Glycerin, Cetearyl Alcohol, Ceramide NP, Ceramide AP, Cholesterol',
        'moisturizer'
      )
    ).toContain(S.ECZEMA_ATOPIE)
  })

  test('1 ceramide only → not flagged (≥2 required)', () => {
    expect(
      detectEczemaAtopie('Aqua, Glycerin, Cetearyl Alcohol, Ceramide NP', 'moisturizer')
    ).toEqual([])
  })

  test('≥2 ceramides + parfum → not flagged (fragrance disqualifies)', () => {
    expect(
      detectEczemaAtopie(
        'Aqua, Glycerin, Ceramide NP, Ceramide AP, Cholesterol, Parfum',
        'moisturizer'
      )
    ).toEqual([])
  })

  test('≥2 ceramides + fragrance keyword → not flagged', () => {
    expect(
      detectEczemaAtopie(
        'Aqua, Glycerin, Ceramide NP, Ceramide AP, Cholesterol, Fragrance',
        'moisturizer'
      )
    ).toEqual([])
  })

  test('ceramides past position 12 → not counted (functional concentration cap)', () => {
    const filler = Array.from({ length: 12 }, (_, i) => `Filler${i + 1}`).join(', ')
    expect(
      detectEczemaAtopie(`Aqua, ${filler}, Ceramide NP, Ceramide AP`, 'moisturizer')
    ).toEqual([])
  })

  test('ceramide combo + sodium lauryl sulfate top 5 → not flagged (sulfate disqualifies)', () => {
    expect(
      detectEczemaAtopie(
        'Aqua, Sodium Lauryl Sulfate, Ceramide NP, Ceramide AP, Cholesterol',
        'body-lotion'
      )
    ).toEqual([])
  })

  test('null/empty INCI → []', () => {
    expect(detectEczemaAtopie(null, 'moisturizer')).toEqual([])
    expect(detectEczemaAtopie('', 'moisturizer')).toEqual([])
  })

  test('avena sativa kernel + parfum on leave-on → still flagged via oat trigger', () => {
    expect(
      detectEczemaAtopie('Aqua, Avena Sativa Kernel Flour, Glycerin, Parfum', 'body-lotion')
    ).toContain(S.ECZEMA_ATOPIE)
  })

  test('≥2 ceramides + PARFUM/FRAGRANCE slash-form → not flagged (slash→space normalize)', () => {
    expect(
      detectEczemaAtopie(
        'Aqua, Glycerin, Ceramide NP, Ceramide AP, Cholesterol, Parfum/Fragrance',
        'moisturizer'
      )
    ).toEqual([])
  })

  test('avena sativa flower/leaf/stem juice (not kernel) → not flagged', () => {
    expect(
      detectEczemaAtopie(
        'Aqua, Avena Sativa Flower/Leaf/Stem Juice, Glycerin',
        'serum'
      )
    ).toEqual([])
  })
})

describe('detectEffetProtecteur', () => {
  test('lanolin in top 8 → effet-protecteur (Aquaphor-style)', () => {
    expect(
      detectEffetProtecteur('Aqua, Petrolatum, Lanolin, Cetyl Alcohol', 'balm')
    ).toContain(S.EFFET_PROTECTEUR)
  })

  test('lanolin alcohol variant → effet-protecteur', () => {
    expect(
      detectEffetProtecteur('Aqua, Glycerin, Lanolin Alcohol, Cetyl Alcohol', 'moisturizer')
    ).toContain(S.EFFET_PROTECTEUR)
  })

  test('lanolin past position 8 (trace) → not flagged', () => {
    const filler = Array.from({ length: 8 }, (_, i) => `Filler${i + 1}`).join(', ')
    expect(detectEffetProtecteur(`Aqua, ${filler}, Lanolin`, 'balm')).toEqual([])
  })

  test('≥2 butters/waxes top 8 → effet-protecteur (heavy balm)', () => {
    expect(
      detectEffetProtecteur(
        'Aqua, Butyrospermum Parkii Butter, Cera Alba, Glycerin',
        'balm'
      )
    ).toContain(S.EFFET_PROTECTEUR)
  })

  test('1 butter only → not flagged (≥2 required, single butter = texture polish)', () => {
    expect(
      detectEffetProtecteur('Aqua, Glycerin, Butyrospermum Parkii Butter, Cetyl Alcohol', 'moisturizer')
    ).toEqual([])
  })

  test('shea + cocoa butter top 8 → effet-protecteur', () => {
    expect(
      detectEffetProtecteur(
        'Aqua, Shea Butter, Cocoa Butter, Glycerin',
        'body-lotion'
      )
    ).toContain(S.EFFET_PROTECTEUR)
  })

  test('shea synonym dedup: shea-butter + butyrospermum parkii (same ingredient) → not flagged alone', () => {
    expect(
      detectEffetProtecteur(
        'Aqua, Butyrospermum Parkii (Shea) Butter, Glycerin',
        'moisturizer'
      )
    ).toEqual([])
  })

  test('cleanser (rinse-off) with butters → not flagged (leave-on only)', () => {
    expect(
      detectEffetProtecteur(
        'Aqua, Butyrospermum Parkii Butter, Cera Alba, Sodium Lauryl Sulfate',
        'cleanser'
      )
    ).toEqual([])
  })

  test('null/empty INCI → []', () => {
    expect(detectEffetProtecteur(null, 'balm')).toEqual([])
    expect(detectEffetProtecteur('', 'balm')).toEqual([])
  })
})

describe('detectRepulpant', () => {
  test('HA top 3 + glycerin top 5 + acetyl hexapeptide-8 → repulpant', () => {
    expect(
      detectRepulpant(
        'Aqua, Sodium Hyaluronate, Glycerin, Pentylene Glycol, Niacinamide, Acetyl Hexapeptide-8',
        'serum'
      )
    ).toContain(S.REPULPANT)
  })

  test('HA top 3 + glycerin top 5 + palmitoyl tripeptide-1 → repulpant', () => {
    expect(
      detectRepulpant(
        'Aqua, Hyaluronic Acid, Glycerin, Pentylene Glycol, Palmitoyl Tripeptide-1',
        'serum'
      )
    ).toContain(S.REPULPANT)
  })

  test('HA at pos 7 (Matrixyl-style, peptide as headline actif) → repulpant', () => {
    expect(
      detectRepulpant(
        'Water, Glycerin, Butylene Glycol, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Palmitoyl Tripeptide-38, Sodium Hyaluronate',
        'serum'
      )
    ).toContain(S.REPULPANT)
  })

  test('HA past position 8 (trace dosing) → not flagged', () => {
    const filler = Array.from({ length: 8 }, (_, i) => `Filler${i + 1}`).join(', ')
    expect(
      detectRepulpant(
        `Aqua, Glycerin, ${filler}, Sodium Hyaluronate, Acetyl Hexapeptide-8`,
        'serum'
      )
    ).toEqual([])
  })

  test('glycerin past position 5 → not flagged (humectant trace)', () => {
    const filler = Array.from({ length: 5 }, (_, i) => `Filler${i + 1}`).join(', ')
    expect(
      detectRepulpant(
        `Aqua, Sodium Hyaluronate, Niacinamide, ${filler}, Glycerin, Acetyl Hexapeptide-8`,
        'serum'
      )
    ).toEqual([])
  })

  test('no plumping peptide → not flagged (HA + glycerin alone = generic hydrator)', () => {
    expect(
      detectRepulpant(
        'Aqua, Sodium Hyaluronate, Glycerin, Pentylene Glycol, Niacinamide',
        'serum'
      )
    ).toEqual([])
  })

  test('glyceryl stearate (not pure glycerin) does not satisfy glycerin requirement', () => {
    expect(
      detectRepulpant(
        'Aqua, Sodium Hyaluronate, Glyceryl Stearate, Niacinamide, Acetyl Hexapeptide-8',
        'serum'
      )
    ).toEqual([])
  })

  test('cleanser (rinse-off) → not flagged (leave-on only)', () => {
    expect(
      detectRepulpant(
        'Aqua, Sodium Hyaluronate, Glycerin, Pentylene Glycol, Acetyl Hexapeptide-8',
        'cleanser'
      )
    ).toEqual([])
  })

  test('null/empty INCI → []', () => {
    expect(detectRepulpant(null, 'serum')).toEqual([])
    expect(detectRepulpant('', 'serum')).toEqual([])
  })
})

// ─── T1.1 — fini-mat / matifiant ────────────────────────────────────────────
describe('detectFiniMat', () => {
  test('silica in top 8 → fini-mat + matifiant', () => {
    const tags = detectFiniMat('Aqua, Glycerin, Silica, Niacinamide')
    expect(tags).toContain(S.FINI_MAT)
    expect(tags).toContain(S.MATIFIANT)
  })

  test('kaolin → emits both', () => {
    const tags = detectFiniMat('Aqua, Kaolin, Glycerin')
    expect(tags).toContain(S.FINI_MAT)
    expect(tags).toContain(S.MATIFIANT)
  })

  test('corn starch → flagged', () => {
    expect(detectFiniMat('Aqua, Glycerin, Zea Mays Starch')).toContain(S.FINI_MAT)
  })

  test('absorbent past position 8 (texture polish trace) → not flagged', () => {
    const filler = Array.from({ length: 8 }, (_, i) => `Filler${i + 1}`).join(', ')
    expect(detectFiniMat(`Aqua, ${filler}, Silica`)).toEqual([])
  })

  test('null/empty INCI → []', () => {
    expect(detectFiniMat(null)).toEqual([])
    expect(detectFiniMat('')).toEqual([])
  })
})

// ─── T1.2 — texture-riche ───────────────────────────────────────────────────
describe('detectTextureRiche', () => {
  test('shea + cocoa butter top 8 → texture-riche', () => {
    expect(
      detectTextureRiche('Aqua, Butyrospermum Parkii Butter, Theobroma Cacao Seed Butter, Glycerin')
    ).toContain(S.TEXTURE_RICHE)
  })

  test('shea butter alone → not flagged (one butter is just polish)', () => {
    expect(
      detectTextureRiche('Aqua, Glycerin, Butyrospermum Parkii Butter, Niacinamide')
    ).toEqual([])
  })

  test('shea + beeswax → texture-riche', () => {
    expect(
      detectTextureRiche('Aqua, Butyrospermum Parkii Butter, Cera Alba, Glycerin')
    ).toContain(S.TEXTURE_RICHE)
  })

  test('shea synonyms (parkii + shea butter same ingredient) ≠ 2 butters', () => {
    // Same ingredient listed once with both substrings — should count as 1 group
    expect(
      detectTextureRiche('Aqua, Butyrospermum Parkii (Shea Butter), Glycerin, Niacinamide')
    ).toEqual([])
  })

  test('butters past position 8 → not flagged', () => {
    const filler = Array.from({ length: 8 }, (_, i) => `Filler${i + 1}`).join(', ')
    expect(
      detectTextureRiche(`Aqua, ${filler}, Butyrospermum Parkii Butter, Theobroma Cacao Butter`)
    ).toEqual([])
  })

  test('euphorbia cerifera (candelilla wax INCI name) + shea → texture-riche', () => {
    expect(
      detectTextureRiche('Polyglyceryl-2 Triisostearate, Octyldodecanol, Beurre de Butyrospermum Parkii, Cire d Euphorbia Cerifera, Huile Coco')
    ).toContain(S.TEXTURE_RICHE)
  })

  test('null/empty INCI → []', () => {
    expect(detectTextureRiche(null)).toEqual([])
  })
})

// ─── T1.3 — texture-legere ──────────────────────────────────────────────────
describe('detectTextureLegere', () => {
  test('aqua top 1 + no butter → texture-legere on serum', () => {
    expect(
      detectTextureLegere('Aqua, Glycerin, Niacinamide, Hyaluronic Acid', 'serum')
    ).toContain(S.TEXTURE_LEGERE)
  })

  test('water-based moisturizer with petrolatum top 8 → not flagged', () => {
    expect(
      detectTextureLegere('Aqua, Glycerin, Petrolatum, Niacinamide', 'moisturizer')
    ).toEqual([])
  })

  test('shea butter top 5 → not flagged', () => {
    expect(
      detectTextureLegere(
        'Aqua, Glycerin, Caprylic/Capric Triglyceride, Butyrospermum Parkii Butter, Niacinamide',
        'moisturizer'
      )
    ).toEqual([])
  })

  test('cleanser → never flagged (rinse-off)', () => {
    expect(detectTextureLegere('Aqua, Glycerin, Niacinamide', 'cleanser')).toEqual([])
  })

  test('body-wash → never flagged', () => {
    expect(detectTextureLegere('Aqua, Glycerin, Niacinamide', 'body-wash')).toEqual([])
  })

  test('balm → never flagged (inherently rich)', () => {
    expect(detectTextureLegere('Aqua, Glycerin, Niacinamide', 'balm')).toEqual([])
  })

  test('serum with glycerin top 1, no aqua → flagged via glycerin', () => {
    expect(
      detectTextureLegere('Glycerin, Propanediol, Niacinamide, Tocopherol', 'serum')
    ).toContain(S.TEXTURE_LEGERE)
  })

  test('null/empty INCI → []', () => {
    expect(detectTextureLegere(null, 'serum')).toEqual([])
    expect(detectTextureLegere('', 'serum')).toEqual([])
  })
})

// ─── T1.4 — fini-glowy ──────────────────────────────────────────────────────
describe('detectFiniGlowy', () => {
  test('glycerin top 3 + sodium hyaluronate top 5 + no powder → fini-glowy', () => {
    expect(
      detectFiniGlowy('Aqua, Glycerin, Propanediol, Sodium Hyaluronate, Niacinamide')
    ).toContain(S.FINI_GLOWY)
  })

  test('glycerin top 3 + HA top 5 + silica top 8 → not flagged (mattified)', () => {
    expect(
      detectFiniGlowy('Aqua, Glycerin, Sodium Hyaluronate, Silica, Niacinamide')
    ).toEqual([])
  })

  test('glycerin past top 3 → not flagged', () => {
    expect(
      detectFiniGlowy('Aqua, Cetyl Alcohol, Stearic Acid, Glycerin, Sodium Hyaluronate')
    ).toEqual([])
  })

  test('no HA → not flagged', () => {
    expect(detectFiniGlowy('Aqua, Glycerin, Niacinamide, Tocopherol')).toEqual([])
  })

  test('null/empty INCI → []', () => {
    expect(detectFiniGlowy(null)).toEqual([])
  })
})

// ─── T1.5 — non-gras + absorption-rapide ────────────────────────────────────
describe('detectNonGrasAbsorption', () => {
  test('serum + dimethicone top 5 + no oil → emits pair', () => {
    const tags = detectNonGrasAbsorption(
      'Aqua, Glycerin, Dimethicone, Niacinamide, Tocopherol',
      'serum'
    )
    expect(tags).toContain(S.NON_GRAS)
    expect(tags).toContain(S.ABSORPTION_RAPIDE)
  })

  test('eye-cream + cyclopentasiloxane → emits pair', () => {
    const tags = detectNonGrasAbsorption(
      'Aqua, Cyclopentasiloxane, Glycerin, Caffeine',
      'eye-cream'
    )
    expect(tags).toContain(S.NON_GRAS)
    expect(tags).toContain(S.ABSORPTION_RAPIDE)
  })

  test('serum + dimethicone + jojoba oil top 5 → not flagged', () => {
    expect(
      detectNonGrasAbsorption(
        'Aqua, Glycerin, Dimethicone, Simmondsia Chinensis Seed Oil, Niacinamide',
        'serum'
      )
    ).toEqual([])
  })

  test('moisturizer (not in eligible kinds) → not flagged', () => {
    expect(
      detectNonGrasAbsorption('Aqua, Dimethicone, Glycerin, Niacinamide', 'moisturizer')
    ).toEqual([])
  })

  test('serum without any silicone top 5 → not flagged', () => {
    expect(
      detectNonGrasAbsorption('Aqua, Glycerin, Niacinamide, Hyaluronic Acid, Tocopherol', 'serum')
    ).toEqual([])
  })

  test('null INCI → []', () => {
    expect(detectNonGrasAbsorption(null, 'serum')).toEqual([])
  })
})

// ─── T1.6 — pigments-verts ──────────────────────────────────────────────────
describe('detectPigmentsVerts', () => {
  test('CI 77288 → pigments-verts', () => {
    expect(detectPigmentsVerts('Aqua, Glycerin, CI 77288')).toContain(S.PIGMENTS_VERTS)
  })

  test('no-space variant CI77288 → flagged', () => {
    expect(detectPigmentsVerts('Aqua, Glycerin, CI77288')).toContain(S.PIGMENTS_VERTS)
  })

  test('chromium oxide green spelled out → flagged', () => {
    expect(detectPigmentsVerts('Aqua, Glycerin, Chromium Oxide Green')).toContain(
      S.PIGMENTS_VERTS
    )
  })

  test('clean INCI without green pigment → not flagged', () => {
    expect(detectPigmentsVerts('Aqua, Glycerin, Niacinamide, Centella Asiatica')).toEqual([])
  })

  test('null/empty INCI → []', () => {
    expect(detectPigmentsVerts(null)).toEqual([])
  })
})

// ─── T1.7 — vegan ───────────────────────────────────────────────────────────
describe('detectVegan', () => {
  test('clean plant-based INCI ≥ 5 ingredients → vegan', () => {
    expect(
      detectVegan(
        'Aqua, Glycerin, Niacinamide, Hyaluronic Acid, Panthenol, Tocopherol'
      )
    ).toContain(S.VEGAN)
  })

  test('beeswax (cera alba) → not flagged', () => {
    expect(
      detectVegan('Aqua, Glycerin, Cera Alba, Tocopherol, Panthenol, Niacinamide')
    ).toEqual([])
  })

  test('lanolin → not flagged', () => {
    expect(
      detectVegan('Aqua, Glycerin, Lanolin, Tocopherol, Panthenol, Niacinamide')
    ).toEqual([])
  })

  test('snail mucin → not flagged', () => {
    expect(
      detectVegan(
        'Aqua, Snail Secretion Filtrate, Glycerin, Niacinamide, Panthenol, Tocopherol'
      )
    ).toEqual([])
  })

  test('carmine / CI 75470 → not flagged', () => {
    expect(
      detectVegan('Aqua, Glycerin, Niacinamide, Panthenol, CI 75470, Tocopherol')
    ).toEqual([])
  })

  test('hydrolyzed collagen → not flagged', () => {
    expect(
      detectVegan(
        'Aqua, Glycerin, Hydrolyzed Collagen, Niacinamide, Panthenol, Tocopherol'
      )
    ).toEqual([])
  })

  test('squalane (plant-derived saturated form) → vegan ok', () => {
    expect(
      detectVegan(
        'Aqua, Glycerin, Squalane, Niacinamide, Panthenol, Tocopherol'
      )
    ).toContain(S.VEGAN)
  })

  test('squalene (animal-derived unsaturated form) → not flagged', () => {
    expect(
      detectVegan(
        'Aqua, Glycerin, Squalene, Niacinamide, Panthenol, Tocopherol'
      )
    ).toEqual([])
  })

  test('short INCI < 5 ingredients → abstain', () => {
    expect(detectVegan('Aqua, Glycerin, Niacinamide')).toEqual([])
  })

  test('null INCI → []', () => {
    expect(detectVegan(null)).toEqual([])
  })

  // ── B.7 corpus spot-check fixes (2026-05-08) ─────────────────────────
  // Audit revealed 8 vegan-tagged products with `pearl powder` and 1 with
  // `pearl extract` (mollusk shell), plus 2 with `lactoperoxidase` (milk
  // enzyme). Patterns added to ANIMAL_PATTERNS — these tests pin the fix.

  test('pearl powder → not flagged', () => {
    expect(
      detectVegan('Aqua, Glycerin, Pearl Powder, Niacinamide, Panthenol, Tocopherol')
    ).toEqual([])
  })

  test('pearl extract → not flagged', () => {
    expect(
      detectVegan('Aqua, Glycerin, Pearl Extract, Niacinamide, Panthenol, Tocopherol')
    ).toEqual([])
  })

  test('hydrolyzed pearl protein → not flagged', () => {
    expect(
      detectVegan('Aqua, Glycerin, Hydrolyzed Pearl Protein, Niacinamide, Panthenol, Tocopherol')
    ).toEqual([])
  })

  test('lactoperoxidase → not flagged', () => {
    expect(
      detectVegan('Aqua, Glycerin, Lactoperoxidase, Niacinamide, Panthenol, Tocopherol')
    ).toEqual([])
  })
})

// ─── T1.8 — peau-normale heuristic ──────────────────────────────────────────
describe('detectPeauNormale', () => {
  test('moisturizer + clean INCI + no other skin_type → peau-normale', () => {
    expect(
      detectPeauNormale(
        'Aqua, Glycerin, Cetyl Alcohol, Niacinamide, Panthenol, Tocopherol',
        'moisturizer',
        new Set<string>()
      )
    ).toContain(S.PEAU_NORMALE)
  })

  test('peau-grasse already proposed → abstain', () => {
    expect(
      detectPeauNormale(
        'Aqua, Glycerin, Cetyl Alcohol, Niacinamide, Panthenol, Tocopherol',
        'moisturizer',
        new Set([S.PEAU_GRASSE])
      )
    ).toEqual([])
  })

  test('peau-sensible already proposed → abstain', () => {
    expect(
      detectPeauNormale(
        'Aqua, Glycerin, Cetyl Alcohol, Niacinamide, Panthenol, Tocopherol',
        'moisturizer',
        new Set([S.PEAU_SENSIBLE])
      )
    ).toEqual([])
  })

  test('strong actif (retinol) → abstain', () => {
    expect(
      detectPeauNormale(
        'Aqua, Glycerin, Retinol, Niacinamide, Panthenol, Tocopherol',
        'serum',
        new Set<string>()
      )
    ).toEqual([])
  })

  test('AHA → abstain', () => {
    expect(
      detectPeauNormale(
        'Aqua, Glycerin, Glycolic Acid, Niacinamide, Panthenol, Tocopherol',
        'moisturizer',
        new Set<string>()
      )
    ).toEqual([])
  })

  test('non-eligible kind (serum) → abstain', () => {
    expect(
      detectPeauNormale(
        'Aqua, Glycerin, Niacinamide, Panthenol, Tocopherol',
        'serum',
        new Set<string>()
      )
    ).toEqual([])
  })

  test('eye-cream + clean → peau-normale', () => {
    expect(
      detectPeauNormale(
        'Aqua, Glycerin, Caffeine, Niacinamide, Panthenol, Tocopherol',
        'eye-cream',
        new Set<string>()
      )
    ).toContain(S.PEAU_NORMALE)
  })

  test('short INCI < 5 → abstain', () => {
    expect(
      detectPeauNormale('Aqua, Glycerin, Niacinamide', 'moisturizer', new Set<string>())
    ).toEqual([])
  })

  test('null INCI → []', () => {
    expect(detectPeauNormale(null, 'moisturizer', new Set<string>())).toEqual([])
  })
})

// ─── D.1 audit fixes (2026-05-08) ─────────────────────────────────────────────
// Coverage for the recall and mutex gaps closed in commit
// `fix(seed/auto-tags): close recall and mutex gaps in formula detectors`.

describe('detectGrossesseAvoid — sodium retinoyl hyaluronate', () => {
  test('retinyl ester on hyaluronate backbone → avoid', () => {
    expect(
      detectGrossesseAvoid('Aqua, Glycerin, Sodium Retinoyl Hyaluronate, Niacinamide', 'serum')
    ).toBe(true)
  })
})

describe('detectStepNettoyage1 — extended sulfate variants', () => {
  test('coco-sulfate in top 5 → not flagged (foaming gel cleanser)', () => {
    expect(
      detectStepNettoyage1(
        'Aqua, Caprylic/Capric Triglyceride, Sodium Coco-Sulfate, Glycerin, Cocamidopropyl Betaine',
        'cleanser'
      )
    ).toEqual([])
  })

  test('coceth sulfate in top 5 → not flagged', () => {
    expect(
      detectStepNettoyage1(
        'Aqua, Caprylic/Capric Triglyceride, Disodium Coceth Sulfate, Glycerin',
        'cleanser'
      )
    ).toEqual([])
  })

  test('myreth sulfate in top 5 → not flagged', () => {
    expect(
      detectStepNettoyage1(
        'Aqua, Caprylic/Capric Triglyceride, Sodium Myreth Sulfate, Glycerin',
        'cleanser'
      )
    ).toEqual([])
  })
})

describe('detectNonGrasAbsorption — extended silicone patterns', () => {
  test('dimethiconol in top 5 (no vegetable oil) → non-gras + absorption-rapide', () => {
    const tags = detectNonGrasAbsorption('Aqua, Glycerin, Dimethiconol, Niacinamide', 'serum')
    expect(tags).toContain(S.NON_GRAS)
    expect(tags).toContain(S.ABSORPTION_RAPIDE)
  })

  test('trimethylsiloxysilicate (film former) in top 5 → non-gras', () => {
    const tags = detectNonGrasAbsorption(
      'Aqua, Glycerin, Trimethylsiloxysilicate, Cyclopentasiloxane',
      'serum'
    )
    expect(tags).toContain(S.NON_GRAS)
  })

  test('dimethiconol + olea europaea oil top 5 → not flagged (vegetable oil exclusion)', () => {
    expect(
      detectNonGrasAbsorption(
        'Aqua, Glycerin, Olea Europaea Fruit Oil, Dimethiconol, Niacinamide',
        'serum'
      )
    ).toEqual([])
  })
})

describe('detectFiniGlowy — extended HA salts', () => {
  test('hydroxypropyltrimonium hyaluronate in top 5 → fini-glowy', () => {
    expect(
      detectFiniGlowy(
        'Glycerin, Aqua, Niacinamide, Hydroxypropyltrimonium Hyaluronate, Panthenol'
      )
    ).toContain(S.FINI_GLOWY)
  })

  test('potassium hyaluronate in top 5 → fini-glowy', () => {
    expect(
      detectFiniGlowy('Glycerin, Aqua, Niacinamide, Potassium Hyaluronate, Panthenol')
    ).toContain(S.FINI_GLOWY)
  })

  test('sodium hyaluronate crosspolymer in top 5 → fini-glowy', () => {
    expect(
      detectFiniGlowy('Glycerin, Aqua, Niacinamide, Sodium Hyaluronate Crosspolymer, Panthenol')
    ).toContain(S.FINI_GLOWY)
  })
})

describe('detectFiniGlowy — heavy formula exclusion (mutex with texture-riche)', () => {
  test('shea butter top 5 (heavy formula) → not flagged even with glycerin + HA', () => {
    expect(
      detectFiniGlowy(
        'Glycerin, Aqua, Butyrospermum Parkii Butter, Sodium Hyaluronate, Niacinamide'
      )
    ).toEqual([])
  })

  test('petrolatum top 8 → not flagged', () => {
    expect(
      detectFiniGlowy(
        'Glycerin, Aqua, Niacinamide, Sodium Hyaluronate, Panthenol, Tocopherol, Petrolatum'
      )
    ).toEqual([])
  })

  test('beeswax top 8 → not flagged', () => {
    expect(
      detectFiniGlowy('Glycerin, Aqua, Niacinamide, Sodium Hyaluronate, Tocopherol, Beeswax')
    ).toEqual([])
  })
})

// ─── Mutex invariants ─────────────────────────────────────────────────────────
// Pairs of slugs that are sensoriel-mutually-exclusive must never co-fire on
// the same INCI. Asserted on canonical fixtures that previously triggered
// double-emit (cf AUTO-TAGS.md §T1 cleanup post-WRITE).

describe('mutex invariants — sensoriel slugs cannot co-fire', () => {
  test('texture-riche / texture-legere (heavy butter formula)', () => {
    const inci = 'Aqua, Glycerin, Butyrospermum Parkii Butter, Theobroma Cacao Seed Butter, Beeswax'
    const riche = detectTextureRiche(inci)
    const legere = detectTextureLegere(inci, 'moisturizer')
    expect(riche.length > 0 && legere.length > 0).toBe(false)
  })

  test('texture-riche / texture-legere (light water-glycerin formula)', () => {
    const inci = 'Aqua, Glycerin, Niacinamide, Sodium Hyaluronate'
    const riche = detectTextureRiche(inci)
    const legere = detectTextureLegere(inci, 'serum')
    expect(riche.length > 0 && legere.length > 0).toBe(false)
  })

  test('fini-mat / fini-glowy (silica formula)', () => {
    const inci = 'Glycerin, Aqua, Sodium Hyaluronate, Silica, Niacinamide'
    const mat = detectFiniMat(inci)
    const glowy = detectFiniGlowy(inci)
    expect(mat.length > 0 && glowy.length > 0).toBe(false)
  })

  test('fini-mat / fini-glowy (HA-glycerin formula)', () => {
    const inci = 'Glycerin, Aqua, Sodium Hyaluronate, Niacinamide, Panthenol'
    const mat = detectFiniMat(inci)
    const glowy = detectFiniGlowy(inci)
    expect(mat.length > 0 && glowy.length > 0).toBe(false)
  })

  test('non-gras / texture-riche (silicone serum)', () => {
    const inci = 'Aqua, Glycerin, Cyclopentasiloxane, Niacinamide, Dimethicone'
    const riche = detectTextureRiche(inci)
    const nonGras = detectNonGrasAbsorption(inci, 'serum')
    expect(riche.length > 0 && nonGras.length > 0).toBe(false)
  })

  test('fini-glowy / texture-riche (heavy butter + glycerin + HA)', () => {
    const inci = 'Glycerin, Aqua, Butyrospermum Parkii Butter, Sodium Hyaluronate, Theobroma Cacao Seed Butter'
    const glowy = detectFiniGlowy(inci)
    const riche = detectTextureRiche(inci)
    expect(glowy.length > 0 && riche.length > 0).toBe(false)
  })
})

describe('detectTextureFromField (S5 — products.texture pass-through)', () => {
  test('null/undefined → no tag', () => {
    expect(detectTextureFromField(null)).toEqual([])
    expect(detectTextureFromField(undefined)).toEqual([])
  })

  test('gel → texture-gel', () => {
    expect(detectTextureFromField('gel')).toEqual([S.TEXTURE_GEL])
  })

  test('mousse → texture-mousse', () => {
    expect(detectTextureFromField('mousse')).toEqual([S.TEXTURE_MOUSSE])
  })

  test('stick → texture-stick', () => {
    expect(detectTextureFromField('stick')).toEqual([S.TEXTURE_STICK])
  })

  test('creme/huile/lait/eau/baume/patch → matching slug (admin override)', () => {
    expect(detectTextureFromField('creme')).toEqual([S.TEXTURE_CREME])
    expect(detectTextureFromField('huile')).toEqual([S.TEXTURE_HUILE])
    expect(detectTextureFromField('lait')).toEqual([S.TEXTURE_LAIT])
    expect(detectTextureFromField('eau')).toEqual([S.TEXTURE_EAU])
    expect(detectTextureFromField('baume')).toEqual([S.TEXTURE_BAUME])
    expect(detectTextureFromField('patch')).toEqual([S.TEXTURE_PATCH])
  })
})

describe('detectTextureGelInci (S5 INCI fallback)', () => {
  test('carbomer top 5 + aqueous serum → texture-gel', () => {
    const inci = 'Aqua, Glycerin, Carbomer, Niacinamide, Sodium Hyaluronate'
    expect(detectTextureGelInci(inci, 'serum', null)).toEqual([S.TEXTURE_GEL])
  })

  test('xanthan gum top 5 + moisturizer → texture-gel', () => {
    const inci = 'Aqua, Glycerin, Xanthan Gum, Panthenol, Allantoin'
    expect(detectTextureGelInci(inci, 'moisturizer', null)).toEqual([S.TEXTURE_GEL])
  })

  test('hydroxyethyl cellulose top 5 → texture-gel', () => {
    const inci = 'Aqua, Glycerin, Hydroxyethyl Cellulose, Niacinamide'
    expect(detectTextureGelInci(inci, 'serum', null)).toEqual([S.TEXTURE_GEL])
  })

  test('field set (any value) → fallback skipped (admin wins)', () => {
    const inci = 'Aqua, Carbomer, Glycerin'
    expect(detectTextureGelInci(inci, 'serum', 'creme')).toEqual([])
    expect(detectTextureGelInci(inci, 'serum', 'gel')).toEqual([])
  })

  test('rinse-off cleanser → skipped (gel-cleanser is rinsed)', () => {
    const inci = 'Aqua, Carbomer, Sodium Lauroyl Sarcosinate'
    expect(detectTextureGelInci(inci, 'cleanser', null)).toEqual([])
  })

  test('balm → skipped (chemistry contradicts gel)', () => {
    const inci = 'Aqua, Carbomer, Glycerin'
    expect(detectTextureGelInci(inci, 'balm', null)).toEqual([])
  })

  test('vegetable oil top 5 → skipped (not aqueous)', () => {
    const inci = 'Aqua, Glycerin, Carbomer, Argania Spinosa Kernel Oil, Tocopherol'
    expect(detectTextureGelInci(inci, 'serum', null)).toEqual([])
  })

  test('shea butter top 8 → skipped (rich emulsion)', () => {
    const inci = 'Aqua, Carbomer, Glycerin, Niacinamide, Panthenol, Butyrospermum Parkii Butter, Tocopherol'
    expect(detectTextureGelInci(inci, 'moisturizer', null)).toEqual([])
  })

  test('silicone-led gel-cream → skipped (covered by non-gras/semi-occlusif)', () => {
    const inci = 'Aqua, Carbomer, Dimethicone, Glycerin, Niacinamide'
    expect(detectTextureGelInci(inci, 'serum', null)).toEqual([])
  })

  test('no gel-former in top 5 → no tag', () => {
    const inci = 'Aqua, Glycerin, Niacinamide, Panthenol, Tocopherol, Carbomer'
    expect(detectTextureGelInci(inci, 'serum', null)).toEqual([])
  })

  test('null INCI → no tag', () => {
    expect(detectTextureGelInci(null, 'serum', null)).toEqual([])
  })
})
