import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  parsePharmashopDescription,
  extractSlugFromUrl,
  parseRefLine,
  parseFormat,
  parseEuroToCents,
  extractSections,
  extractInciFromComposition,
} from '../scripts/lib/pharmashop-parser'

const FIXTURES_DIR = join(import.meta.dir, '..', 'output', 'product-details')

describe('extractSlugFromUrl', () => {
  it('strips trailing .html', () => {
    expect(
      extractSlugFromUrl('https://www.pharmashopdiscount.com/fr/beaute/eucerin/eucerin-atopi-control-creme-visage-apaisant-50ml.html'),
    ).toBe('eucerin-atopi-control-creme-visage-apaisant-50ml')
  })

  it('handles query strings', () => {
    expect(extractSlugFromUrl('https://example.com/x/y/foo-bar.html?ref=1')).toBe('foo-bar')
  })

  it('returns empty when no .html found', () => {
    expect(extractSlugFromUrl('https://example.com/x/')).toBe('')
  })
})

describe('parseRefLine', () => {
  it('parses Ref / format / price-per-L', () => {
    const r = parseRefLine('Ref : 4005800350504 -  Tube 50ml -  Prix au kg/L : 293,25 €')
    expect(r.ref).toBe('4005800350504')
    expect(r.formatText).toBe('Tube 50ml')
  })

  it('parses Ref without trailing price block', () => {
    const r = parseRefLine('Ref : 3574661618869 -  Flacon Pompe 1L - ')
    expect(r.ref).toBe('3574661618869')
    expect(r.formatText).toBe('Flacon Pompe 1L')
  })

  it('parses Ref with bare amount (no container word)', () => {
    const r = parseRefLine('Ref : 3662361000043 -  50 ml -  Prix au kg/L : 205,63 €')
    expect(r.ref).toBe('3662361000043')
    expect(r.formatText).toBe('50 ml')
  })
})

describe('parseFormat', () => {
  it('reads amount + unit + tube hint', () => {
    expect(parseFormat('Tube 50ml')).toEqual({ totalAmount: 50, amountUnit: 'ml', unitHint: 'tube' })
  })

  it('reads bottle hint from "Flacon"', () => {
    expect(parseFormat('Flacon 125ml').unitHint).toBe('bottle')
  })

  it('reads dropper hint from "Flacon compte-gouttes"', () => {
    expect(parseFormat('Flacon compte-gouttes de 30ml').unitHint).toBe('dropper')
  })

  it('reads roller hint from "Roll-on"', () => {
    expect(parseFormat('Roll-on 50 ml').unitHint).toBe('roller')
  })

  it('reads spray from "Pulvérisateur"', () => {
    expect(parseFormat('Pulvérisateur 300 ml').unitHint).toBe('spray')
  })

  it('returns empty hint when no container word', () => {
    expect(parseFormat('50 ml').unitHint).toBe('')
    expect(parseFormat('50 ml').totalAmount).toBe(50)
  })

  it('handles 1L (without "ml")', () => {
    const r = parseFormat('Flacon Pompe 1L')
    expect(r.totalAmount).toBe(1)
    expect(r.amountUnit).toBe('l')
    expect(r.unitHint).toBe('bottle')
  })
})

describe('parseEuroToCents', () => {
  it('parses comma decimals', () => {
    expect(parseEuroToCents('14,66')).toBe(1466)
  })

  it('parses spaced thousand separator', () => {
    expect(parseEuroToCents('1 260,83')).toBe(126083)
  })

  it('parses dot decimals', () => {
    expect(parseEuroToCents('12.85')).toBe(1285)
  })

  it('returns 0 for non-numeric', () => {
    expect(parseEuroToCents('abc')).toBe(0)
  })
})

describe('extractSections', () => {
  it('splits known section headers', () => {
    const lines = [
      'preamble',
      '',
      'DESCRIPTION',
      '',
      'desc body',
      '',
      'COMPOSITION',
      '',
      'inci body',
      '',
      "CONSEILS D'UTILISATION",
      '',
      'use body',
      '',
      'LA MARQUE EUCERIN',
      '',
      'brand body',
    ]
    const s = extractSections(lines)
    expect(s.DESCRIPTION).toBe('desc body')
    expect(s.COMPOSITION).toBe('inci body')
    expect(s.CONSEILS).toBe('use body')
    expect(s.MARQUE).toBe('brand body')
  })
})

describe('extractInciFromComposition', () => {
  it('returns empty when only a placeholder paragraph is present', () => {
    const block = "Pour la composition et les ingrédients, merci de vous référer à l'emballage ou la notice du produit"
    expect(extractInciFromComposition(block)).toBe('')
  })

  it('extracts the real INCI paragraph after a placeholder paragraph', () => {
    const block = [
      "Pour la composition et les ingrédients, merci de vous référer à l'emballage",
      '',
      'Aqua, Glycerin, Helianthus Annuus Seed Oil, Butyrospermum Parkii Butter, Caprylic/Capric Triglyceride',
    ].join('\n')
    const result = extractInciFromComposition(block)
    expect(result.startsWith('Aqua,')).toBe(true)
    expect(result).toContain('Helianthus')
  })

  it('extracts INCI when sandwiched between vegan claim and bio %', () => {
    const block = [
      "Testée sous contrôle dermatologique. Vegan, sans ingrédients d'origine animale.",
      '',
      'Helianthus Annuus Seed Oil, Dicaprylyl Carbonate, Triethyl Citrate, Triheptanoin',
      '',
      "84% du total des ingrédients sont d'origine naturelle. 33% du total des ingrédients sont issus de l'Agriculture Biologique.",
      '',
      "La liste des ingrédients peut être soumise à des modifications, nous vous conseillons de vérifier",
    ].join('\n')
    const result = extractInciFromComposition(block)
    expect(result.startsWith('Helianthus')).toBe(true)
  })

  it('keeps the single-paragraph INCI as-is', () => {
    const block = 'Aqua, Glycerin, Cetearyl Alcohol, Phenoxyethanol, Tocopherol'
    expect(extractInciFromComposition(block)).toBe(block)
  })

  it('extracts INCI when ingredients are dash-separated', () => {
    // Erborian uses " - " between tokens instead of commas.
    const block = [
      'Aqua/water - butylene glycol - polymethyl methacrylate - glycerin - pentylene glycol - sodium acrylates crosspolymer-2 - betaine',
      '',
      "Pour la composition et les ingrédients, merci de vous référer à l'emballage",
    ].join('\n')
    const r = extractInciFromComposition(block)
    expect(r.startsWith('Aqua/water')).toBe(true)
  })

  it('extracts INCI when ingredients are period-separated', () => {
    // Lierac uses ". " between tokens.
    const block = [
      "95% d'ingrédients d'origine naturelle",
      '',
      'Aqua / water / eau. Caprylic/capric triglyceride. Pentaerythrityl tetraisostearate. Glycerin. Cetearyl alcohol. Niacinamide. Tocopherol.',
    ].join('\n')
    const r = extractInciFromComposition(block)
    expect(r.startsWith('Aqua')).toBe(true)
    expect(r).toContain('Niacinamide')
  })
})

describe('parsePharmashopDescription — full file', () => {
  it('parses an SVR sample (single INCI paragraph)', () => {
    const text = readFileSync(
      join(FIXTURES_DIR, '003_fr_beaute_svr_soins_specifiques_svr_ak_secure_dm_protect_50_ml_prevention_des_cancers_cutanes_html.txt'),
      'utf-8',
    )
    const p = parsePharmashopDescription(text)
    expect(p).not.toBeNull()
    if (!p) return

    expect(p.url).toBe('https://www.pharmashopdiscount.com/fr/beaute/svr/soins-specifiques/svr-ak-secure-dm-protect-50-ml-prevention-des-cancers-cutanes.html')
    expect(p.slug).toBe('svr-ak-secure-dm-protect-50-ml-prevention-des-cancers-cutanes')
    expect(p.title).toBe('SVR AK SECURE DM PROTECT 50 ML PREVENTION DES CANCERS CUTANES')
    expect(p.ref).toBe('3662361000043')
    expect(p.formatText).toBe('50 ml')
    expect(p.totalAmount).toBe(50)
    expect(p.amountUnit).toBe('ml')
    expect(p.priceCentsList).toBe(1285)
    expect(p.priceCents).toBe(1028)
    expect(p.brand).toBe('SVR')
    expect(p.inciRaw.startsWith('Aqua')).toBe(true)
    expect(p.inciRaw).toContain('Phenoxyethanol')
  })

  it('parses an Eucerin sample (placeholder + real INCI)', () => {
    const text = readFileSync(
      join(FIXTURES_DIR, 'fr_beaute_eucerin_eucerin_atopi_control_creme_visage_apaisant_50ml_html', 'description.txt'),
      'utf-8',
    )
    const p = parsePharmashopDescription(text)
    expect(p).not.toBeNull()
    if (!p) return

    expect(p.slug).toBe('eucerin-atopi-control-creme-visage-apaisant-50ml')
    expect(p.totalAmount).toBe(50)
    expect(p.amountUnit).toBe('ml')
    expect(p.unitHint).toBe('tube')
    expect(p.priceCents).toBe(1466)
    expect(p.priceCentsList).toBe(1955)
    expect(p.brand).toBe('EUCERIN')
    expect(p.inciRaw.startsWith('Aqua,')).toBe(true)
    // Should NOT keep the French placeholder paragraph that lives above the real INCI.
    expect(p.inciRaw.toLowerCase()).not.toContain('merci de vous référer')
  })

  it('does not pick up lowercase "La marque X propose..." prose as the brand heading', () => {
    // Regression: a description-block sentence "La marque Biarritz propose cette crème…" used
    // to be picked up as the "LA MARQUE" section heading because the regex was case-insensitive.
    const text = readFileSync(
      join(FIXTURES_DIR, 'fr_beaute_biarritz_biarritz_creme_solaire_sfp50_bebe_enfants_100ml_html', 'description.txt'),
      'utf-8',
    )
    const p = parsePharmashopDescription(text)
    expect(p).not.toBeNull()
    if (!p) return
    expect(p.brand).toBe('LABORATOIRES DE BIARRITZ')
  })

  it('parses a Biarritz sample (vegan claim + INCI + bio % + warning)', () => {
    const text = readFileSync(
      join(FIXTURES_DIR, 'fr_beaute_biarritz_laboratoires_de_biarritz_huile_solaire_satinee_spf30_125ml_html', 'description.txt'),
      'utf-8',
    )
    const p = parsePharmashopDescription(text)
    expect(p).not.toBeNull()
    if (!p) return

    expect(p.slug).toBe('laboratoires-de-biarritz-huile-solaire-satinee-spf30-125ml')
    expect(p.totalAmount).toBe(125)
    expect(p.amountUnit).toBe('ml')
    expect(p.unitHint).toBe('bottle')
    expect(p.brand).toBe('LABORATOIRES DE BIARRITZ')
    expect(p.inciRaw.startsWith('Helianthus Annuus Seed Oil')).toBe(true)
    expect(p.inciRaw.toLowerCase()).not.toContain("vegan")
    expect(p.inciRaw.toLowerCase()).not.toContain("84% du total")
    expect(p.inciRaw.toLowerCase()).not.toContain('la liste des ingrédients peut')
  })
})
