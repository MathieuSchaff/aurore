import { describe, expect, it } from 'bun:test'

import { resolveFormulaPreviewTokens } from '../formula-preview-tokens'

describe('resolveFormulaPreviewTokens', () => {
  it.each([
    ['Arginine\nPCA', [null]],
    ['Lanolin\r\nAlcohol', [null]],
    ['Fictus Plantus Extract\nNiacinamide', [null]],
    ['Niacinamide\nPanthenol', ['Niacinamide', 'Panthenol']],
    ['Sodium\rHyaluronate', ['Sodium Hyaluronate']],
    ['Niacinamide,\nPanthenol', ['Niacinamide', 'Panthenol']],
    ['Niacinamide\nPanthenol, [+/- Retinol\nSalicylic Acid]', ['Niacinamide', 'Panthenol', null]],
  ])('resolves only uniquely readable line boundaries: %s', (raw, expected) => {
    const tokens = resolveFormulaPreviewTokens(raw)
    expect(tokens.map((token) => token.canonicalKey)).toEqual(expected)
    for (const token of tokens.filter((entry) => entry.canonicalKey === null)) {
      expect(token.allowNameFallback).toBe(false)
      expect(token.raw).toContain('\n')
    }
  })

  it('keeps certain pigments on both sides of an optional pigment', () => {
    const tokens = resolveFormulaPreviewTokens('CI 77491, [+/- CI 77492], CI 77499')
    expect(tokens.map((token) => token.canonicalKey)).toEqual(['CI 77491', null, 'CI 77499'])
  })

  it.each([
    '[± Retinol]',
    '[May contain: Retinol]',
    '[(May contain) Retinol]',
    '[+/- (MAY CONTAIN) Retinol]',
    '[Peut contenir: Retinol]',
  ])('keeps an optional block unresolved while resuming after it: %s', (raw) => {
    const tokens = resolveFormulaPreviewTokens(`Niacinamide, ${raw}, Salicylic Acid`)
    expect(tokens.map((token) => token.canonicalKey)).toEqual([
      'Niacinamide',
      null,
      'Salicylic Acid',
    ])
    expect(tokens[1]).toMatchObject({ raw, allowNameFallback: false })
  })

  it('retains certain repeated ingredients and distinguishes optical isomers', () => {
    expect(
      resolveFormulaPreviewTokens('Retinol, [+/- Retinol]').map((token) => token.canonicalKey)
    ).toEqual(['Retinol', null])
    const optical = resolveFormulaPreviewTokens('(+/-)-Alpha-Tocopherol')
    expect(optical[0].canonicalKey).toBe('Tocopherol')
    expect(optical[0].allowNameFallback).toBe(true)
  })

  it('refuses a single optional pigment without suppressing the surrounding certain ingredients', () => {
    const tokens = resolveFormulaPreviewTokens('Niacinamide, [+/- CI 77491], Retinol')
    expect(tokens.map((token) => token.canonicalKey)).toEqual(['Niacinamide', null, 'Retinol'])
    expect(tokens[1]).toMatchObject({ raw: '[+/- CI 77491]', allowNameFallback: false })
  })

  it.each(['*', '**', ' *'])(
    'preserves annotated group provenance while resolving every CI: %s',
    (suffix) => {
      // The annotation must not hide a closed group or disappear from its source
      const raw = `Iron Oxides (CI 77491, CI 77492, CI 77499)${suffix}`
      const tokens = resolveFormulaPreviewTokens(raw)
      expect(tokens.map((token) => token.canonicalKey)).toEqual([
        'CI 77491',
        'CI 77492',
        'CI 77499',
      ])
      expect(tokens.map((token) => token.raw)).toEqual([raw, raw, raw])
      expect(tokens.every((token) => !token.allowNameFallback)).toBe(true)
    }
  )

  it.each([
    'Iron Oxides (CI 77491, 77492, 77499)',
    'iron oxide (CI77491 / 77492 / CI 77499 / 77491)',
  ])('recognizes exact members with implicit CI prefixes and deduplicates the group: %s', (raw) => {
    const tokens = resolveFormulaPreviewTokens(raw)
    expect(tokens.map((token) => token.canonicalKey)).toEqual(['CI 77491', 'CI 77492', 'CI 77499'])
    expect(tokens.every((token) => !token.allowNameFallback)).toBe(true)
  })

  it.each([
    'Iron Oxides (CI 77491, CI 99999)',
    'Iron Oxides (CI 77491, CI 99999)*',
    'Iron Oxides (CI 77491, CI 77499)* (nano)',
    'Iron Oxides (CI 77491, CI 77499) (nano)*',
    'Iron Oxides (CI 77491, CI 77499)* text',
    '+/- Iron Oxides (CI 77491, CI 77499)*',
    'Iron Oxides (CI 77491, CI 77891)',
    'Iron Oxides (CI 77491, CI 77492) [nano]',
    'Iron Oxides (CI 77491, CI 77492) 1%',
    'Iron Oxides [CI 77491, CI 77492]',
    'Iron Oxides (CI 77491',
    'Iron Oxides (CI 77491, 77492',
  ])('refuses incomplete or qualified identities without name fallback: %s', (raw) => {
    const tokens = resolveFormulaPreviewTokens(raw)
    expect(tokens.length).toBe(1)
    expect(tokens[0]).toMatchObject({ raw, canonicalKey: null, allowNameFallback: false })
  })

  it('keeps optional groups unresolved because catalogue links cannot encode optional presence', () => {
    const tokens = resolveFormulaPreviewTokens('Aqua, +/- Iron Oxides (CI 77491, CI 77499)')
    expect(tokens.map((token) => token.canonicalKey)).toEqual(['Aqua', null])
    expect(tokens[1].allowNameFallback).toBe(false)
  })

  it('does not resolve pigments from an asterisk inside the group', () => {
    const tokens = resolveFormulaPreviewTokens('Iron Oxides (CI 77491, CI 77499*)')
    expect(tokens.every((token) => token.canonicalKey === null)).toBe(true)
    expect(tokens[0].allowNameFallback).toBe(false)
  })

  it('preserves single identities, duplicate entries and ordinary name fallback', () => {
    const tokens = resolveFormulaPreviewTokens(
      'CI 77891, Niacinamide, Niacinamide, Acide hyaluronique'
    )
    expect(tokens.map((token) => token.canonicalKey)).toEqual([
      'CI 77891',
      'Niacinamide',
      'Niacinamide',
      'Hyaluronic Acid',
    ])
    expect(tokens.every((token) => token.allowNameFallback)).toBe(true)
  })

  it('holds an open group even when a later ingredient has its own parentheses', () => {
    const raw = 'Iron Oxides (CI 77491, CI 77492, CI 77499'
    const tokens = resolveFormulaPreviewTokens(
      `Aqua, ${raw}, Isopropyl Myristate, Tocopherol (Vitamin E)`
    )
    expect(tokens.map((token) => token.canonicalKey)).toEqual([
      'Aqua',
      null,
      'Isopropyl Myristate',
      'Tocopherol',
    ])
    expect(tokens[1]).toMatchObject({ raw, allowNameFallback: false })
  })

  it('refuses an open group atomically while preserving the next independent ingredient', () => {
    const raw = 'Iron Oxides (CI 77491, CI 77492, CI 77499'
    const tokens = resolveFormulaPreviewTokens(`Aqua, ${raw}, Glycerin`)

    expect(tokens.map((token) => token.canonicalKey)).toEqual(['Aqua', null, 'Glycerin'])
    expect(tokens[1]).toMatchObject({ raw, allowNameFallback: false })
  })
  it('recognizes every member of a closed CI group in declaration order', () => {
    const raw = 'Iron Oxides (CI 77499, CI 77491, CI 77492)'
    const tokens = resolveFormulaPreviewTokens(`Aqua, ${raw}, Glycerin`)

    expect(tokens.map((token) => token.canonicalKey)).toEqual([
      'Aqua',
      'CI 77499',
      'CI 77491',
      'CI 77492',
      'Glycerin',
    ])
    expect(tokens.slice(1, 4).map((token) => token.raw)).toEqual([raw, raw, raw])
  })
})
