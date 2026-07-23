import { describe, expect, it } from 'bun:test'

import {
  buildInciIndex,
  EXCIPIENT_BLOCKLIST,
  foldScraperDelimiters,
  normalizeInciToken,
  parseInciFromContent,
  parseInciFromSlugLine,
  stripInciArtefacts,
} from '.'

describe('stripInciArtefacts', () => {
  it('drops organic-certification markers', () => {
    expect(stripInciArtefacts('Centaurea Cyanus Flower Water*')).toBe(
      'Centaurea Cyanus Flower Water'
    )
  })

  it('drops a paren opened but never closed, keeping balanced glosses', () => {
    expect(stripInciArtefacts('Iron Oxides (CI 77491')).toBe('Iron Oxides')
    expect(stripInciArtefacts('Phenoxyethanol (F.i.l')).toBe('Phenoxyethanol')
    expect(stripInciArtefacts('Citrus Limon (Lemon) Fruit Water')).toBe(
      'Citrus Limon (Lemon) Fruit Water'
    )
  })

  it('drops supplier bracket notes, nano tag included', () => {
    expect(stripInciArtefacts('Geraniol [n5107/A]')).toBe('Geraniol')
    expect(stripInciArtefacts('Kaolin [02-012-1.09]')).toBe('Kaolin')
    expect(stripInciArtefacts('Zinc Oxide [nano]')).toBe('Zinc Oxide')
  })

  it('drops percentage doses without touching digits that name the substance', () => {
    expect(stripInciArtefacts('Niacinamide 5%')).toBe('Niacinamide')
    expect(stripInciArtefacts('Salicylic Acid 2.0%')).toBe('Salicylic Acid')
    expect(stripInciArtefacts('1% Bakuchiol')).toBe('Bakuchiol')
    expect(stripInciArtefacts('Madecassoside 7.5 ppm')).toBe('Madecassoside')
    expect(stripInciArtefacts('Centella Asiatica Extract 10,350 ppm')).toBe(
      'Centella Asiatica Extract'
    )
    expect(stripInciArtefacts('C12-15 Alkyl Benzoate')).toBe('C12-15 Alkyl Benzoate')
    expect(stripInciArtefacts('Ci 77491')).toBe('Ci 77491')
  })

  it('drops trailing punctuation left by the bracket strip, keeping inner hyphens', () => {
    expect(stripInciArtefacts('Tocopherol. [v4240a]')).toBe('Tocopherol')
    expect(stripInciArtefacts('Citric Acid -')).toBe('Citric Acid')
    expect(stripInciArtefacts('PEG-100 Stearate')).toBe('PEG-100 Stearate')
  })
})

describe('normalizeInciToken', () => {
  it('uppercases, strips accents, collapses whitespace', () => {
    expect(normalizeInciToken('  Bétaïne  ')).toBe('BETAINE')
    expect(normalizeInciToken('Sodium   Lauryl  Sulfate')).toBe('SODIUM LAURYL SULFATE')
  })

  it('folds scraper artefacts onto the clean spelling', () => {
    expect(normalizeInciToken('centaurea cyanus flower water*')).toBe(
      'CENTAUREA CYANUS FLOWER WATER'
    )
    expect(normalizeInciToken('Iron Oxides (CI 77491')).toBe('IRON OXIDES')
    expect(normalizeInciToken('Zinc Oxide [nano]')).toBe('ZINC OXIDE')
    expect(normalizeInciToken('Salicylic Acid 2.0%')).toBe('SALICYLIC ACID')
  })

  it('strips parenthetical fragments', () => {
    expect(normalizeInciToken("Glycerin (D'origine végétale)")).toBe('GLYCERIN')
    expect(normalizeInciToken('Citrus Limon (Lemon) Fruit Water')).toBe(
      'CITRUS LIMON  FRUIT WATER'.replace(/\s+/g, ' ')
    )
  })
})

describe('foldScraperDelimiters', () => {
  it('folds spaced-dash bullet separators to commas', () => {
    expect(foldScraperDelimiters('AQUA/WATER -SODIUM METHYL COCOYL TAURATE -GLYCERIN')).toBe(
      'AQUA/WATER, SODIUM METHYL COCOYL TAURATE, GLYCERIN'
    )
    expect(foldScraperDelimiters('TITANIUM DIOXIDE - CI 77491')).toBe('TITANIUM DIOXIDE, CI 77491')
  })

  it('folds semicolons to commas', () => {
    expect(foldScraperDelimiters('MALTODEXTRIN ; MAGNESIUM HYDROXIDE')).toBe(
      'MALTODEXTRIN, MAGNESIUM HYDROXIDE'
    )
  })

  it('keeps real hyphens and digit-adjacent mangled hyphens intact', () => {
    expect(foldScraperDelimiters('PEG-60 HYDROGENATED CASTOR OIL')).toBe(
      'PEG-60 HYDROGENATED CASTOR OIL'
    )
    expect(foldScraperDelimiters('2-BROMO-2 -NITROPROPANE-1,3-DIOL')).toBe(
      '2-BROMO-2 -NITROPROPANE-1,3-DIOL'
    )
    expect(foldScraperDelimiters('C12 - 16 ALCOHOLS')).toBe('C12 - 16 ALCOHOLS')
    expect(foldScraperDelimiters('Sh-Polypeptide -9')).toBe('Sh-Polypeptide -9')
  })

  it('keeps chemical single-letter prefixes and may-contain markers', () => {
    expect(foldScraperDelimiters('P - fenilendiammina')).toBe('P - fenilendiammina')
    expect(foldScraperDelimiters('PARFUM [+/- CI 77891]')).toBe('PARFUM [+/- CI 77891]')
  })

  it('folds after asterisked organic markers', () => {
    expect(foldScraperDelimiters('LAVANDULA OIL** - CYAMOPSIS GUM')).toBe(
      'LAVANDULA OIL**, CYAMOPSIS GUM'
    )
  })

  it('decodes html entities before folding (entity semicolon is not a separator)', () => {
    expect(foldScraperDelimiters('XYLISHINE&trade; - XYLITOL')).toBe('XYLISHINE™, XYLITOL')
    expect(foldScraperDelimiters('&lt;h2&gt;')).toBe('<h2>')
    expect(foldScraperDelimiters('AQUA&nbsp;PARFUM &amp; MENTHA')).toBe('AQUA PARFUM & MENTHA')
    expect(foldScraperDelimiters('CAF&Eacute; &egrave; L’AGRUME')).toBe('CAFÉ è L’AGRUME')
  })

  it('keeps a nested or unknown entity intact instead of folding its semicolon', () => {
    expect(foldScraperDelimiters('&amp;lt;h2&amp;gt;')).toBe('&lt;h2&gt;')
    expect(foldScraperDelimiters('AQUA &copy;; GLYCERIN')).toBe('AQUA &copy;, GLYCERIN')
  })

  it('can decode entities without folding list separators', () => {
    expect(
      foldScraperDelimiters('AQUA; Extrait de Camomille - Acide ascorbique', {
        foldListSeparators: false,
      })
    ).toBe('AQUA; Extrait de Camomille - Acide ascorbique')
  })
})

describe('parseInciFromContent', () => {
  it('extracts a single bold token', () => {
    const md = '# Mannitol\n\n## INCI\n**MANNITOL**\n\n## Points forts\n- foo'
    expect(parseInciFromContent(md)).toEqual(['MANNITOL'])
  })

  it('extracts multiple tokens separated by " ou "', () => {
    const md =
      '## INCI\n**CITRUS LIMON FRUIT WATER** ou **CITRUS LIMON FRUIT EXTRACT**\n(CAS: 92346-89-9)\n## Composition'
    expect(parseInciFromContent(md)).toEqual([
      'CITRUS LIMON FRUIT WATER',
      'CITRUS LIMON FRUIT EXTRACT',
    ])
  })

  it('extracts raw uppercase line when no bold', () => {
    const md = '## INCI\nSODIUM HYALURONATE\n## Other'
    expect(parseInciFromContent(md)).toEqual(['SODIUM HYALURONATE'])
  })

  it('handles indented INCI block', () => {
    const md = '    ## INCI\n\n    **Collagen Amino Acids**\n\n    ## Other'
    expect(parseInciFromContent(md)).toEqual(['Collagen Amino Acids'])
  })

  it('stops block at next ## heading or ---', () => {
    const md = '## INCI\n**FOO**\n---\n## Next\n**BAR**'
    expect(parseInciFromContent(md)).toEqual(['FOO'])
  })

  it('returns empty array when no INCI section', () => {
    expect(parseInciFromContent('# Title\nNo inci here')).toEqual([])
  })
})

describe('parseInciFromSlugLine', () => {
  it('parses skincare-style "// INCI: Token | desc"', () => {
    const r = parseInciFromSlugLine(`  MANNITOL: 'mannitol', // INCI: Mannitol | humectant sucre`)
    expect(r).toEqual({ slug: 'mannitol', tokens: ['Mannitol'] })
  })

  it('parses haircare-style "// Token | desc" without INCI: prefix', () => {
    const r = parseInciFromSlugLine(
      `  SLS_HAIR: 'sls-hair', // Sodium Lauryl Sulfate | tensioactif anionique`
    )
    expect(r).toEqual({ slug: 'sls-hair', tokens: ['Sodium Lauryl Sulfate'] })
  })

  it('splits multi-name comments on slash and "ou"', () => {
    const r = parseInciFromSlugLine(
      `  CLOVE: 'clove', // INCI: Eugenia Caryophyllus Bud Oil / Eugenol | analgésique`
    )
    expect(r?.tokens).toEqual(['Eugenia Caryophyllus Bud Oil', 'Eugenol'])
  })

  it('rejects descriptor-style French comments (apostrophes, lowercase words)', () => {
    expect(
      parseInciFromSlugLine(
        `  ESTER_ACIDE_MALIQUE: 'ester-acide-malique', // Ester d'acide malique | AHA doux`
      )
    ).toBeNull()
    expect(
      parseInciFromSlugLine(`  FOO: 'foo', // dérivé acide salicylique | exfoliant doux`)
    ).toBeNull()
  })

  it('returns null on non-slug lines', () => {
    expect(parseInciFromSlugLine('  // a comment')).toBeNull()
    expect(parseInciFromSlugLine('export const FOO = {')).toBeNull()
  })

  // The descriptor guard used to read an English gloss as a French description and drop the
  // whole declaration, so 23 slugs never reached the index at all.
  it('keeps a name carrying a parenthesised gloss or a dashed note', () => {
    expect(
      parseInciFromSlugLine(
        `  RUSCUS: 'ruscus-aculeatus', // INCI: Ruscus Aculeatus Root Extract (butcher's broom)`
      )
    ).toEqual({ slug: 'ruscus-aculeatus', tokens: ['Ruscus Aculeatus Root Extract'] })
    expect(
      parseInciFromSlugLine(
        `  CERAMIDE_NS: 'ceramide-ns', // INCI: Ceramide NS (Ceramide 2) – rare`
      )
    ).toEqual({ slug: 'ceramide-ns', tokens: ['Ceramide NS'] })
  })

  it('keeps a name led by a digit or a lowercase locant', () => {
    expect(
      parseInciFromSlugLine(
        `  EAA: '3-o-ethyl-ascorbic-acid', // INCI: 3-O-Ethyl Ascorbic Acid | x`
      )
    ).toEqual({ slug: '3-o-ethyl-ascorbic-acid', tokens: ['3-O-Ethyl Ascorbic Acid'] })
    expect(
      parseInciFromSlugLine(
        `  CYMEN: 'o-cymen-5-ol', // INCI: o-Cymen-5-ol (Biosol) | preservative`
      )
    ).toEqual({ slug: 'o-cymen-5-ol', tokens: ['o-Cymen-5-ol'] })
  })

  it('does not split a name on a comma or a plus it owns', () => {
    expect(
      parseInciFromSlugLine(`  OLEAMIDO: 'oleamido', // INCI: 2-Oleamido-1,3-Octadecanediol | y`)
        ?.tokens
    ).toEqual(['2-Oleamido-1,3-Octadecanediol'])
    expect(
      parseInciFromSlugLine(`  AZECO: 'azecoglycine', // INCI: Azelaic Acid + Glycine | complex`)
        ?.tokens
    ).toEqual(['Azelaic Acid + Glycine'])
  })
})

describe('buildInciIndex (integration)', () => {
  it('builds a non-empty index from real ingredient data', () => {
    const idx = buildInciIndex()
    expect(idx.size).toBeGreaterThan(50)
  })

  it('contains common skincare actives', () => {
    const idx = buildInciIndex()
    expect(idx.has('NIACINAMIDE')).toBe(true)
    expect(idx.has('SODIUM HYALURONATE')).toBe(true)
  })

  it('does not index excipients (blocklist effective)', () => {
    const idx = buildInciIndex()
    expect(idx.has('AQUA')).toBe(false)
    expect(idx.has('GLYCERIN')).toBe(false)
  })

  // An artefact-carrying spelling used to slip past the blocklist and get linked as a
  // key ingredient while its clean spelling was dropped.
  it('blocklists an excipient whatever artefact its spelling carries', () => {
    expect(EXCIPIENT_BLOCKLIST.has(normalizeInciToken('Xanthan Gum*'))).toBe(true)
    expect(EXCIPIENT_BLOCKLIST.has(normalizeInciToken('Lauryl Glucoside*'))).toBe(true)
    expect(EXCIPIENT_BLOCKLIST.has(normalizeInciToken('Phenoxyethanol (F.i.l'))).toBe(true)
  })

  it('indexes names led by a digit', () => {
    const idx = buildInciIndex()
    expect(idx.get('3-O-ETHYL ASCORBIC ACID')?.slug).toBe('3-o-ethyl-ascorbic-acid')
    expect(idx.get('1-METHYLHYDANTOIN-2-IMIDE')?.slug).toBe('methylhydantoin-imide')
  })

  // A `/` in a declaration used to mint a key out of the nomenclature noun alone, and every
  // product token spelled `Extract` linked to whichever slug claimed it first.
  it('never indexes a bare nomenclature noun', () => {
    const idx = buildInciIndex()
    expect(idx.has('EXTRACT')).toBe(false)
    expect(idx.has('OIL')).toBe(false)
    expect(idx.has('LEAF')).toBe(false)
  })
})
