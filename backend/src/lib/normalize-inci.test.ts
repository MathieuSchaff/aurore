import { describe, expect, test } from 'bun:test'

import { normalizeInci } from './normalize-inci'

describe('normalizeInci', () => {
  test.each([
    '100 ppm',
    '10 mg/g',
    '< .5 PPM',
    '0,5 mg / g',
    '1e-3 ppm',
    '0.1-0.5 mg/g',
    '10 to 20 ppm',
    '≈ 1 mg/g',
  ])('retains a declared mass concentration when an alias would erase it: %s', (quantity) => {
    const raw = `Water, Niacinamide (${quantity}), Glycerin`
    const result = normalizeInci(raw)
    expect(result.value).toBe(raw)
    expect(result.guardrailTripped).toBe(true)
    expect(result.changed).toBe(false)
    expect(normalizeInci(result.value).value).toBe(raw)
  })

  test.each([
    ['Water, Niacinamide 100 ppm, Glycerin', 'Aqua, Niacinamide 100 ppm, Glycerin'],
    ['Water, Niacinamide 10 mg/g, Glycerin', 'Aqua, Niacinamide 10 mg/g, Glycerin'],
    ['Water, Fictus Extract (100 ppm), Glycerin', 'Aqua, Fictus Extract (100 ppm), Glycerin'],
    ['Water, Niacinamide (vitamin B3), Glycerin', 'Aqua, Niacinamide, Glycerin'],
  ])('keeps canonicalization when no mass concentration is lost: %s', (raw, expected) => {
    const result = normalizeInci(raw)
    expect(result.value).toBe(expected)
    expect(result.guardrailTripped).toBe(false)
  })

  test('keeps delimiter repairs while retaining mass concentrations on their ingredients', () => {
    const result = normalizeInci('Water; Niacinamide (100 ppm); Retinol (10 mg/g); Glycerin')
    expect(result.value).toBe('Water, Niacinamide (100 ppm), Retinol (10 mg/g), Glycerin')
    expect(result.guardrailTripped).toBe(true)
  })

  test('retains written alphabetical order when aliases would hide it', () => {
    const raw =
      'Alanine, Arginine, Betaine, BLUE NO. 1 (CI 42090), Butylene Glycol, Caffeine, Carbomer, Ceramide NP, Lactic Acid'
    expect(normalizeInci(raw).value).toBe(raw)
    expect(normalizeInci(raw).guardrailTripped).toBe(true)
  })

  test.each([
    '[+/- MICA, CI 77491]',
    '± MICA, CI 77491',
    'May contain: MICA, CI 77491',
    'Peut contenir: MICA, CI 77491',
  ])('retains optional ingredient declarations: %s', (tail) => {
    const raw = `Aqua, Glycerin, ${tail}`
    expect(normalizeInci(raw).value).toBe(raw)
  })

  test('retains botanical water when its canonical alias loses the preparation', () => {
    const raw = 'Oryza Sativa (Rice) Bran Water, 1,2-Hexanediol, Oryza Sativa Extract, Glycerin'
    expect(normalizeInci(raw).value).toBe(raw)
    expect(normalizeInci(raw).guardrailTripped).toBe(true)
  })

  test.each(['†', '‡', '* (organic)', '† (organic)', ' (organic)‡'])(
    'retains botanical water with a footnote or annotation: %s',
    (suffix) => {
      const raw = `Oryza Sativa (Rice) Bran Water${suffix}, 1,2-Hexanediol, Oryza Sativa Extract, Glycerin`
      const result = normalizeInci(raw)
      expect(result.value).toBe(raw)
      expect(result.guardrailTripped).toBe(true)
      expect(normalizeInci(result.value).value).toBe(raw)
    }
  )

  test('keeps canonicalization when footnoted water retains its preparation', () => {
    const result = normalizeInci('Water†, Glycerin, Niacinamide')
    expect(result.value).toBe('Aqua, Glycerin, Niacinamide')
    expect(result.guardrailTripped).toBe(false)
  })

  test('keeps normalizing a complex that only lists water as an excipient', () => {
    const raw = 'Water, poudre de vitamine K2 (saccharose, Aqua, vitamine K2), Niacinamide'
    expect(normalizeInci(raw).guardrailTripped).toBe(false)
    expect(normalizeInci(raw).value).toContain('Vitamine K2 Powder')
  })

  test('canonicalizes equivalent water names without treating optical isomers as optional', () => {
    expect(normalizeInci('Water, Glycerin, (+/-)-Alpha-Tocopherol').guardrailTripped).toBe(false)
    expect(normalizeInci('Water, Glycerin, (+/-)-Alpha-Tocopherol').value).toContain('Aqua')
  })

  test.each([
    'Aqua, phospholipides (issus du tournesol) 13 %, Niacinamide',
    'Aqua, phospholipides (issus de tournesol) 13 %, Niacinamide',
    'Aqua, phospholipides (issus de tournesol) 13 %, Niacinamide 10%, Glycerin',
  ])('preserves declared percentages when canonicalization would erase a unit: %s', (raw) => {
    const result = normalizeInci(raw)
    expect(result.value).toBe(raw)
    expect(result.guardrailTripped).toBe(true)
    expect(result.changed).toBe(false)
  })

  test.each([
    'Aqua, Niacinamide 10%, Glycerin',
    'Aqua, phospholipides (issus de tournesol) 0,5 %, Glycerin',
  ])('keeps canonicalization when declared percentages survive: %s', (raw) => {
    expect(normalizeInci(raw).guardrailTripped).toBe(false)
  })

  test.each(['\n', '\r\n', '\r'])(
    'separates newline ingredient lists without splitting compound labels: %s',
    (separator) => {
      const raw = ['Aqua', 'Niacinamide', 'Sodium Hyaluronate', 'Glycerin'].join(separator)
      const result = normalizeInci(raw)
      expect(result.value).toBe('Aqua, Niacinamide, Sodium Hyaluronate, Glycerin')
      expect(result.tokensAfter).toBe(4)
      expect(normalizeInci(result.value).value).toBe(result.value)
    }
  )

  test.each([
    [
      'Aqua\nSodium\nHyaluronate\nCamellia Sinensis\nLeaf Extract\nGlycerin',
      'Aqua, Sodium Hyaluronate, Camellia Sinensis Leaf Extract, Glycerin',
    ],
    ['Aqua, Sodium\nHyaluronate, Glycerin', 'Aqua, Sodium Hyaluronate, Glycerin'],
    ['Sodium\nHyaluronate', 'Sodium Hyaluronate'],
    ['Aqua\n\nNiacinamide\nGlycerin', 'Aqua, Niacinamide, Glycerin'],
  ])('joins wrapped compound names before splitting newline lists: %s', (raw, expected) => {
    expect(normalizeInci(raw).value).toBe(expected)
  })

  test.each([
    'Aqua\nArginine\nPCA\nGlycerin',
    'Aqua\nLanolin\nAlcohol\nGlycerin',
    'Aqua\nFictus Plantus Extract\nGlycerin',
    'Aqua\nSodium\nUnlisted Salt\nGlycerin',
    'Aqua\n(Parfum)\nGlycerin',
  ])('retains line boundaries when ingredient segmentation is ambiguous or unknown: %s', (raw) => {
    const result = normalizeInci(raw)
    expect(result.value).toBe(raw)
    expect(result.changed).toBe(false)
    expect(result.guardrailTripped).toBe(true)
  })

  test.each(['; ', ';', ' - ', ' -', ' • ', ' · '])(
    'normalizes explicit list separators before resolving ingredients: %s',
    (separator) => {
      const raw = ['Water', 'Niacinamide', 'Glycerin', 'Panthenol'].join(separator)
      const result = normalizeInci(raw)
      expect(result.value).toBe('Aqua, Niacinamide, Glycerin, Panthenol')
      expect(result.tokensAfter).toBe(4)
      expect(normalizeInci(result.value).value).toBe(result.value)
    }
  )

  test.each([
    [
      'Water; PEG-60 Hydrogenated Castor Oil; Sh-Polypeptide -9; C12 - 16 Alcohols; Glycerin',
      'Aqua, PEG-60 Hydrogenated Castor Oil, Sh-Polypeptide -9, C12 - 16 Alcohols, Glycerin',
    ],
    [
      'Water; 2-Bromo-2 -Nitropropane-1,3-Diol; Glycerin',
      'Aqua, 2-Bromo-2 -Nitropropane-1,3-Diol, Glycerin',
    ],
    ['Water; Plant &copy; Extract; Glycerin', 'Aqua, Plant &copy; Extract, Glycerin'],
  ])(
    'preserves chemical hyphens and entity semicolons during normalization: %s',
    (raw, expected) => {
      expect(normalizeInci(raw).value).toBe(expected)
    }
  )

  test('retains raw damage evidence when delimiter repairs would hide a trailing separator', () => {
    const raw = 'Aqua; Glycerin;'
    const result = normalizeInci(raw)
    expect(result.value).toBe(raw)
    expect(result.guardrailTripped).toBe(true)
    expect(result.changed).toBe(false)
  })

  test('keeps repaired delimiters when canonicalization loses source qualifiers', () => {
    const result = normalizeInci('Water; Titanium Dioxide (CI 77891) [nano]; Aroma; Glycerin')
    expect(result.value).toBe('Water, Titanium Dioxide (CI 77891) [nano], Aroma, Glycerin')
    expect(result.guardrailTripped).toBe(true)
    expect(result.changed).toBe(true)
  })

  test.each([
    'Water, Zinc Oxide [nano], Glycerin',
    'Water, Titanium Dioxide (nano), Glycerin',
    'Water, Methylene Bis-Benzotriazolyl Tetramethylbutylphenol [nano], Glycerin',
    'Water, Zinc Oxide [ NANO ], Glycerin',
    'Water, Zinc Oxide ( nano ), Glycerin',
    'Water, Zinc Oxide [nano], Fictus Extract [nano], Glycerin',
  ])('preserves the source when canonicalization loses a nano declaration: %s', (raw) => {
    // Canonical names erase particle-size declarations on recognized ingredients
    const result = normalizeInci(raw)
    expect(result.value).toBe(raw)
    expect(result.guardrailTripped).toBe(true)
    expect(result.changed).toBe(false)
    expect(normalizeInci(result.value).value).toBe(raw)
  })

  test.each([
    ['Water, Fictus Extract [nano], Glycerin', 'Aqua, Fictus Extract [nano], Glycerin'],
    ['Water, Zinc Oxide non nano, Glycerin', 'Aqua, Zinc Oxide non nano, Glycerin'],
    ['Water, Isononyl Isononanoate, Glycerin', 'Aqua, Isononyl Isononanoate, Glycerin'],
  ])('keeps canonicalization when no nano declaration is lost: %s', (raw, expected) => {
    const result = normalizeInci(raw)
    expect(result.value).toBe(expected)
    expect(result.guardrailTripped).toBe(false)
  })

  test.each([
    'CI 77891',
    'Titanium Dioxide (CI 77891)',
    'Water, Titanium Dioxide [CI 77891], Glycerin',
    'Titanium Dioxide (CI77891), Iron Oxides (CI 77491, CI 77499)',
    'Titanium Dioxide (CI 77891) [nano]',
    'Water, May Contain (+/-): Titanium Dioxide (CI 77891)',
  ])('preserves the source when canonicalization loses an explicit CI identity: %s', (raw) => {
    const result = normalizeInci(raw)
    expect(result.value).toBe(raw)
    expect(result.changed).toBe(false)
    expect(normalizeInci(result.value).value).toBe(raw)
  })

  test('keeps canonicalization when explicit CI identities survive', () => {
    const result = normalizeInci('Water, Red 7 Lake (CI 15850), Glycerin')
    expect(result.value).toBe('Aqua, Red 7 Lake (CI 15850), Glycerin')
    expect(result.guardrailTripped).toBe(false)
  })

  test('does not infer a CI declaration for unqualified titanium dioxide', () => {
    const result = normalizeInci('Water, Titanium Dioxide, Glycerin')
    expect(result.value).toBe('Aqua, Titanium Dioxide, Glycerin')
    expect(result.guardrailTripped).toBe(false)
  })

  test.each(['Aroma', 'AROMA', 'Flavor', 'Flavour', 'Flavor/Aroma'])(
    'preserves the undisclosed aromatic declaration %s',
    (marker) => {
      const raw = `Aqua, Glycerin, ${marker}`
      expect(normalizeInci(raw).value).toContain(marker)
    }
  )

  test('keeps fragrance normalization when no aromatic declaration is lost', () => {
    expect(normalizeInci('Water, Glycerin, Fragrance').value).toBe('Aqua, Glycerin, Parfum')
  })

  test('rewrites a clean list to a comma-separated canonical form', () => {
    const r = normalizeInci('Aqua, Glycerin, Niacinamide')
    expect(r.guardrailTripped).toBe(false)
    expect(r.tokensAfter).toBe(3)
    expect(r.value.split(', ')).toHaveLength(3)
  })

  test('is idempotent: same substance reads identically everywhere', () => {
    const once = normalizeInci('WATER, GLYCERIN, NIACINAMIDE, SODIUM HYALURONATE').value
    const twice = normalizeInci(once).value
    expect(twice).toBe(once)
  })

  test('passes unknown tokens through unchanged (never silently dropped)', () => {
    const r = normalizeInci('Glycerin, Fictus Plantus Extract, Niacinamide')
    expect(r.value).toContain('Fictus Plantus Extract')
    expect(r.tokensAfter).toBe(3)
  })

  test('keeps the original when cleaning yields no token', () => {
    // A punctuation-only scrape must never overwrite a stored INCI with an empty string.
    const r = normalizeInci('...')
    expect(r.guardrailTripped).toBe(true)
    expect(r.value).toBe('...')
    expect(r.changed).toBe(false)
  })

  test('a marketing tail does not trip the guardrail', () => {
    const r = normalizeInci('Aqua, Glycerin, Niacinamide, Panthenol. SANS PARABEN, SANS PARFUM.')
    expect(r.guardrailTripped).toBe(false)
    expect(r.value).toContain('Niacinamide')
    expect(r.value).toContain('Panthenol')
  })
})
