/**
 * inci-index.ts: INCI-token → slug index for auto-filling candidate keyIngredients.
 *
 * Two parsing sources, first-write wins on collisions:
 *   1. ingredientData[].content markdown: `## INCI\n**Token**` block
 *   2. data/ingredients/*&#47;ingredient-slugs.ts: inline `// [INCI:] Token | desc` comments
 *
 * Excipient blocklist filters out tokens that are too common to be informative
 * (water, glycerin, denat. alcohol, EDTA…). buildInciIndex drops them at construction;
 * buildExcipientSlugs rebuilds with includeExcipients to collect the slugs they resolve to.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ingredientData } from '../data/ingredients'
import { INGREDIENT_SLUGS } from '../data/ingredients/ingredient-slugs'

// Entries are normalised at module load via normalizeInciToken to match real
// INCI conventions (dashes, slashes, parens, accents). Source list keeps the
// original INCI orthography so it stays grep-friendly.
const EXCIPIENT_BLOCKLIST_SOURCE: string[] = [
  // Solvents / pH adjusters
  'Aqua',
  'Water',
  'Eau',
  'Glycerin',
  'Glycerine',
  'Alcohol',
  'Alcohol Denat',
  'Denatured Alcohol',
  'Ethanol',
  'Butylene Glycol',
  'Propylene Glycol',
  'Pentylene Glycol',
  'Parfum',
  'Fragrance',
  'Phenoxyethanol',
  'Benzyl Alcohol',
  'Ethylhexylglycerin',
  'Citric Acid',
  'Sodium Hydroxide',
  'Triethanolamine',
  'Disodium EDTA',
  'EDTA',
  'Tetrasodium EDTA',
  'Trisodium EDTA',
  'BHT',
  'BHA',
  'Sodium Chloride',
  'Potassium Sorbate',
  'Sodium Benzoate',
  // Texture / rheology polymers
  'Xanthan Gum',
  'Carbomer',
  'Sclerotium Gum',
  'Hydroxyethylcellulose',
  'Hydroxypropyl Methylcellulose',
  'Hydroxypropyl Cellulose',
  'Acrylates Copolymer',
  'Acrylates/C10-30 Alkyl Acrylate Crosspolymer',
  'Ammonium Acryloyldimethyltaurate/VP Copolymer',
  // Silicones
  'Dimethicone',
  'Dimethiconol',
  'Cyclomethicone',
  'Cyclopentasiloxane',
  'Cyclohexasiloxane',
  'Phenyl Trimethicone',
  // Fatty alcohols / emulsifying waxes
  'Cetearyl Alcohol',
  'Cetyl Alcohol',
  'Stearyl Alcohol',
  'Behenyl Alcohol',
  'Arachidyl Alcohol',
  // Common emulsifiers
  'Glyceryl Stearate',
  'Glyceryl Stearate SE',
  'PEG-100 Stearate',
  'PEG-40 Stearate',
  'PEG-40 Hydrogenated Castor Oil',
  'PEG-60 Hydrogenated Castor Oil',
  'Cetearyl Glucoside',
  'Arachidyl Glucoside',
  'Polysorbate 20',
  'Polysorbate 60',
  'Polysorbate 80',
  'Sorbitan Stearate',
  'Sorbitan Olivate',
  // Bland emollient oils / esters
  'Mineral Oil',
  'Paraffinum Liquidum',
  'Petrolatum',
  'Ethylhexyl Palmitate',
  'Isopropyl Myristate',
  'Isopropyl Palmitate',
  'Caprylic/Capric Triglyceride',
  'Coco-Caprylate',
  'Coco-Caprylate/Caprate',
  'Octyldodecanol',
  'C12-15 Alkyl Benzoate',
  'C13-14 Isoparaffin',
  // Mild surfactants present in nearly every wash/shampoo
  'Cocamidopropyl Betaine',
  'Sodium Cocoamphoacetate',
  'Disodium Cocoamphodiacetate',
  'Decyl Glucoside',
  'Coco-Glucoside',
  'Lauryl Glucoside',
  'Caprylyl/Capryl Glucoside',
  // Generic shampoo conditioning polymers (cationic)
  'Polyquaternium-10',
  'Polyquaternium-7',
  'Polyquaternium-4',
  'Polyquaternium-22',
  'Guar Hydroxypropyltrimonium Chloride',
  // Vitamin E derivatives are almost always trace-level stabilisers.
  'Tocopherol',
  'Tocopheryl Acetate',
  'Tocopheryl Glucoside',
  // Below: first sweep of the token-coverage audit. Every entry appeared in >=10 corpus
  // products with no resolvable slug, so blocklisting them changes no existing link. It only
  // keeps them out of the "to decide" bucket of future runs.
  // Colorants and pigments
  'CI 77492',
  'CI 77499',
  'CI 19140',
  'CI 42090',
  'CI 17200',
  'CI 77288',
  'Caramel',
  'Blue 1 Lake (CI 42090)',
  'Red 7 Lake (CI 15850)',
  'Yellow 5 Lake (CI 19140)',
  'Red 28 Lake (CI 45410)',
  'CI 14700 / Red 4',
  'CI 61570 / Green 5',
  'CI 15985/Yellow 6',
  'CI 60730 / Ext. Violet 2',
  'Green 3 (CI 42053)',
  'Red 6 (CI 15850)',
  'Red 4 (CI 14700)',
  'Violet 2 (CI 60730)',
  'CI 15850 (Red 6 Lake)',
  'CI 77163 (Bismuth Oxychloride)',
  // Chelators and preservative boosters
  'Sodium Phytate',
  'Trisodium Ethylenediamine Disuccinate',
  'Tetrasodium Glutamate Diacetate',
  'Caprylhydroxamic Acid',
  'Cyclodextrin',
  // Mineral fillers, abrasives and texturising clays
  'Disteardimonium Hectorite',
  'Stearalkonium Hectorite',
  'Synthetic Fluorphlogopite',
  'Magnesium Aluminum Silicate',
  'Montmorillonite',
  'Alumina',
  'Tin Oxide',
  // Starches and carbohydrate film formers
  'Microcrystalline Cellulose',
  'Cellulose',
  'Tapioca Starch',
  'Hydroxypropyl Starch Phosphate',
  'Aluminum Starch Octenylsuccinate',
  'Pullulan',
  'Dextrin',
  // Acrylate, vinyl and silicone rheology polymers
  'Hydroxyethyl Acrylate/Sodium Acryloyldimethyl Taurate Copolymer',
  'Sodium Acrylate/Sodium Acryloyldimethyl Taurate Copolymer',
  'Acrylamide/Sodium Acryloyldimethyltaurate Copolymer',
  'Sodium Acrylates Copolymer',
  'Styrene/Acrylates Copolymer',
  'Polyacrylate Crosspolymer-6',
  'Polyacrylate-13',
  'Polyacrylamide',
  'Methyl Methacrylate Crosspolymer',
  'Polymethyl Methacrylate',
  'Glyceryl Polymethacrylate',
  'HDI/Trimethylol Hexyllactone Crosspolymer',
  'VP/Eicosene Copolymer',
  'Vinyl Dimethicone/Methicone Silsesquioxane Crosspolymer',
  'Polymethylsilsesquioxane',
  'Polysilicone-11',
  'Polyisobutene',
  'Polyethylene',
  'Polyvinyl Alcohol',
  'Nylon-12',
  // Ethoxylated and polyglyceryl emulsifiers
  'Sorbitan Isostearate',
  'Sorbitan Oleate',
  'Sorbitan Sesquioleate',
  'Polyglyceryl-3 Methylglucose Distearate',
  'Polyglyceryl-3 Distearate',
  'Polyglyceryl-3 Diisostearate',
  'Polyglyceryl-4 Caprate',
  'Polyglyceryl-4 Isostearate',
  'Polyglyceryl-6 Behenate',
  'PEG-6 Caprylic/Capric Glycerides',
  'PEG-7 Glyceryl Cocoate',
  'PEG-30 Dipolyhydroxystearate',
  'PEG-200 Hydrogenated Glyceryl Palmate',
  'PPG-5-Ceteth-20',
  'Steareth-2',
  'Steareth-20',
  'Steareth-21',
  'Laureth-3',
  'Laureth-7',
  'Laureth-23',
  'Ceteth-20',
  'Ceteareth-25',
  'Ceteareth-60 Myristyl Glycol',
  'Trideceth-6',
  'C12-14 Pareth-12',
  // Anionic and glucoside wash surfactants
  'Potassium Cetyl Phosphate',
  'Sodium Methyl Cocoyl Taurate',
  'Sodium Polyacryloyldimethyl Taurate',
  'Sodium Lauroyl Lactylate',
  'Zinc Coceth Sulfate',
  'C12-20 Alkyl Glucoside',
  // Fatty acids and bland esters
  'Lauric Acid',
  'Arachidic Acid',
  'Isostearic Acid',
  'Polyhydroxystearic Acid',
  'Maleic Acid',
  'C14-22 Alcohols',
  'Methylpropanediol',
  'Isopentyldiol',
  'Benzyl Glycol',
  'Dimethyl Isosorbide',
  'Propylene Carbonate',
  'Triethoxycaprylylsilane',
  // Mineral salts and buffers
  'Magnesium Sulfate',
  'Magnesium Chloride',
  'Sodium Phosphate',
  // Below: second sweep. Same >=10-products / no-resolvable-slug rule as above,
  // but the read/skip call comes from algo-derm's risk and benefit axes rather than its prose
  // note: every entry here is *measured* under 2 on all twelve axes. Tokens algo-derm leaves
  // unscored are deliberately absent: unmeasured is not inert.
  // The "no resolvable slug" half of the rule swallowed three actives whose slug the declaration
  // parser was hiding (hamamelis, ruscus); re-check that half before adding a botanical here.
  // Re-check it through the algo-derm bridge too, not only through buildInciIndex: resolveToken
  // returns null on a blocklisted token before ever trying the bridge, so an organ synonym that
  // stripBotanicalParts would fold onto a graded record (Avena Sativa Seed Extract onto Avena
  // Sativa Kernel Extract) looks unresolvable here and still loses real links.
  // Preservative boosters and solvent humectants
  '1,2-Hexanediol',
  'Caprylyl Glycol',
  'Dipropylene Glycol',
  'Dehydroacetic Acid',
  'Hexylene Glycol',
  'Levulinic Acid',
  'Phenethyl Alcohol',
  'Diisopropyl Sebacate',
  'Diisopropyl Adipate',
  'Ethoxydiglycol',
  // Sugars, polyols and ferment carriers
  'Inulin',
  'Sucrose',
  'Lysine',
  'Hydrogenated Starch Hydrolysate',
  'Bacillus Ferment',
  'Candida Ferment',
  'Aspergillus Ferment',
  'Lactococcus Ferment Lysate',
  'Lactobacillus Ferment Lysate',
  // Mild emulsifiers and solubilisers
  'Sodium Stearoyl Glutamate',
  'Polyglyceryl-2 Dipolyhydroxystearate',
  'Polyglyceryl-10 Laurate',
  'Polyglyceryl-10 Myristate',
  'Polyglyceryl-10 Oleate',
  'Polyglyceryl-10 Stearate',
  'Hydrogenated Palm Glycerides Citrate',
  'Hydrogenated Vegetable Glycerides Citrate',
  'Glyceryl Behenate',
  'Isononyl Isononanoate',
  'Cetearyl Isononanoate',
  'Octyldodecyl Stearoyl Stearate',
  // Silicones and synthetic film formers
  'Caprylyl Methicone',
  'Glyceryl Acrylate/Acrylic Acid Copolymer',
  'Silica Dimethyl Silylate',
  'Paraffin',
  // Inert emollient esters and hydrocarbons
  'Jojoba Esters',
  'Cetyl Ethylhexanoate',
  'Dibutyl Adipate',
  'Diisostearyl Malate',
  'Synthetic Wax',
  'Hydrogenated Poly(C6-14 Olefin)',
  'Pentaerythrityl Tetraethylhexanoate',
  'Isodecyl Neopentanoate',
  'Euphorbia Cerifera Cera',
  'Trihydroxystearin',
  'Myristyl Alcohol',
  'C12-16 Alcohols',
  'T-Butyl Alcohol',
  // Mineral salts and buffers
  'Sodium Dehydroacetate',
  'Sodium Salicylate',
  // Botanical extracts and waters measured flat on every axis
  'Coccinia Indica Fruit Extract',
  'Theobroma Grandiflorum Seed Butter',
  'Salix Alba Bark Extract',
  'Melaleuca Alternifolia Leaf Extract',
  'Melaleuca Alternifolia Leaf Water',
  'Citrus Limon Fruit Extract',
  'Citrus Aurantium Dulcis Fruit Extract',
  'Citrus Junos Fruit Extract',
  'Coptis Japonica Root Extract',
  'Coptis Chinensis Root Extract',
  'Oenothera Biennis Flower Extract',
  'Althaea Rosea Flower Extract',
  'Marrubium Vulgare Extract',
  'Dioscorea Japonica Root Extract',
  'Avena Sativa Leaf/Stem Extract',
  'Pyrus Communis Fruit Extract',
  'Brassica Oleracea Italica Extract',
  'Furcellaria Lumbricalis Extract',
  'Lapsana Communis Flower Leaf Stem Extract',
  'Salvia Officinalis Leaf Extract',
  'Hibiscus Esculentus Fruit Extract',
  'Chamaecyparis Obtusa Water',
  'Phellodendron Amurense Bark Extract',
  'Camellia Japonica Flower Extract',
  'Lavandula Angustifolia Flower Water',
  'Kalanchoe Pinnata Leaf Extract',
  'Prunus Amygdalus Dulcis (Sweet Almond) Seed Extract',
  // Other formulation aids measured flat
  'Benzoic Acid',
  'Sorbic Acid',
  'p-Anisic Acid',
  'Glutamic Acid',
  'Pantolactone',
  'Phospholipids',
  'Triethylhexanoin',
  'Lauryl Betaine',
  'Butyloctyl Salicylate',
  'Pentaerythrityl Tetra-Di-T-Butyl Hydroxyhydrocinnamate',
  'Palmitoyl Tripeptide-5',
  'Palmitoyl Hexapeptide-12',
  'Methylparaben',
  'Propylparaben',
  'Pyridoxine HCl',
  // Below: third sweep. These carry no graded axis at all, so the call rests on
  // algo-derm's prose plus a purely constructional function set, a weaker basis than the two
  // sweeps above, and deliberately limited to entries where both agree. Ungraded botanicals
  // whose note claims a benefit are NOT here: see the algo-derm gradation request in bugs.md.
  // Humectants and polyol conditioners
  'Glucose',
  'Glycereth-26',
  'Inositol',
  'Diglycerin',
  'Erythritol',
  'Methyl Gluceth-10',
  'Methyl Gluceth-20',
  'PEG-8',
  'Sea Water',
  'Mel',
  'Honey Extract',
  'Pyrus Malus Fruit Extract',
  'Cucumis Melo Fruit Extract',
  // Mild emulsifiers and conditioning esters
  'Hydrogenated Lecithin',
  'Cetearyl Olivate',
  'Methyl Glucose Sesquistearate',
  'Polyglyceryl-6 Stearate',
  'Lauroyl Lysine',
  'Isoleucine',
  'Beta-Sitosterol',
  'Sodium Levulinate',
  // Silicone elastomers, emulsifiers and film formers
  'Dimethicone/Vinyl Dimethicone Crosspolymer',
  'Dimethicone Crosspolymer',
  'Methyl Trimethicone',
  'Trimethylsiloxysilicate',
  'Silanetriol',
  'PEG-10 Dimethicone',
  'Lauryl PEG-9 Polydimethylsiloxyethyl Dimethicone',
  'Lauryl Polyglyceryl-3 Polydimethylsiloxyethyl Dimethicone',
  // Mineral powders and buffering salts
  'Sodium Anisate',
  'Calcium Gluconate',
  'Disodium Phosphate',
  'Boron Nitride',
  'Potassium Benzoate',
  // Carbohydrate carriers and protein hydrolysates
  'Maltodextrin',
  'Acacia Senegal Gum',
  'Hydrolyzed Corn Protein',
  'Hydrolyzed Elastin',
  // Botanical extracts algo-derm graded on nothing and describes as conditioning only
  'Ficus Carica Fruit Extract',
  'Prunus Persica Fruit Extract',
  'Prunus Persica Leaf Extract',
  'Prunus Armeniaca Fruit Extract',
]

export const EXCIPIENT_BLOCKLIST = new Set<string>(
  EXCIPIENT_BLOCKLIST_SOURCE.map((s) => normalizeInciToken(s))
)

export type IngredientDomain = 'skincare' | 'haircare' | 'dental' | 'supplements'

export interface InciIndexEntry {
  slug: string
}

export type InciIndex = Map<string, InciIndexEntry>

const INGREDIENTS_ROOT = join(import.meta.dir, '..', 'data', 'ingredients')

const SLUG_FILES: Array<{ rel: string; domain: IngredientDomain }> = [
  { rel: 'skincare/ingredient-slugs.ts', domain: 'skincare' },
  { rel: 'haircare/ingredient-slugs.ts', domain: 'haircare' },
  { rel: 'dental/ingredient-slugs.ts', domain: 'dental' },
  { rel: 'supplements/ingredient-slugs.ts', domain: 'supplements' },
]

/**
 * For a given product category, which ingredient domains should be considered when
 * inferring keyIngredients. Skincare is a generic base included for non-skincare
 * categories so shared actives (vitamins, soothing extracts) still match. Bodycare and
 * solaire ride the skincare ingredient taxonomy; their candidates only match skincare slugs.
 */
const CATEGORY_DOMAIN_ALLOWLIST: Record<string, IngredientDomain[]> = {
  skincare: ['skincare'],
  bodycare: ['skincare'],
  solaire: ['skincare'],
  haircare: ['haircare', 'skincare'],
  dental: ['dental', 'skincare'],
  complement: ['supplements', 'skincare'],
}

// Repair scraper-mangled delimiters before splitINCI (which only splits on commas).
// Entities decode first: the `;` inside `&lt;` must not become a comma.
// `&amp;` decodes last so `&amp;lt;` cannot cascade into a real `<`.
const HTML_ENTITY_DECODES: Array<[RegExp, string]> = [
  [/&lt;/gi, '<'],
  [/&gt;/gi, '>'],
  [/&nbsp;/gi, ' '],
  [/&trade;/gi, '™'],
  [/&reg;/gi, '®'],
  [/&Eacute;/g, 'É'],
  [/&eacute;/g, 'é'],
  [/&Egrave;/g, 'È'],
  [/&egrave;/g, 'è'],
  [/&Agrave;/g, 'À'],
  [/&agrave;/g, 'à'],
  [/&rsquo;/gi, '’'],
  [/&amp;/gi, '&'],
]

const HTML_ENTITY_OR_SEMICOLON = /&(?:#[0-9]+|#x[0-9a-f]+|[a-z][a-z0-9]+);|\s*;\s*/gi

// The dash fold requires two letters on each side (trademark/asterisk markers may
// trail the left side): a digit neighbour is a mangled hyphen (`2-BROMO-2 -NITRO`,
// `C12 - 16`), a single letter a chemical prefix (`P - fenilendiammina`), `[+/-` a
// may-contain marker. Real INCI names never carry a space before a hyphen (`PEG-60`,
// `C10-30`). `repair-and-fold-inci-delimiters-v2.sql` mirrors this for the stored
// column. Keep both in sync.
export interface FoldScraperDelimiterOptions {
  foldListSeparators?: boolean
}

export function foldScraperDelimiters(
  inci: string,
  { foldListSeparators = true }: FoldScraperDelimiterOptions = {}
): string {
  const decoded = HTML_ENTITY_DECODES.reduce((acc, [rx, sub]) => acc.replace(rx, sub), inci)
  if (!foldListSeparators) return decoded

  return decoded
    .replace(HTML_ENTITY_OR_SEMICOLON, (match) => (match.startsWith('&') ? match : ', '))
    .replace(/([A-Za-zÀ-ÿ]{2}[™®*]{0,2})\s+-\s*(?=[A-Za-zÀ-ÿ]{2})/g, '$1, ')
}

// Scraper/label artefacts that hide a substance we already resolve: organic markers, supplier
// bracket notes, a paren the split cut open, formulation doses. `[nano]` folds onto the plain
// name on purpose: the two are regulatorily distinct but share one `ingredients` row today.
// Slashes are deliberately left alone: `Phytosteryl/Isostearyl/Cetyl Dimer Dilinoleate` is one
// compound name, not a double nomenclature, and splitting on them fabricates links.
// Applied before BOTH lookup paths, so keep it out of normalizeInciToken's uppercasing.
export function stripInciArtefacts(s: string): string {
  return s
    .replace(/[*†‡•]+/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\([^)]*$/, ' ')
    .replace(/\d[\d.,]*\s*(%|ppm\b)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.,;:-]+$/, '')
    .trim()
}

export function normalizeInciToken(s: string): string {
  return stripInciArtefacts(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()
}

/** Pull tokens out of a `## INCI` markdown section. Returns raw (non-normalized) strings. */
export function parseInciFromContent(content: string): string[] {
  const lines = content.split('\n')
  const blockLines: string[] = []
  let inBlock = false
  for (const line of lines) {
    const trim = line.trim()
    if (/^##\s+INCI\b/i.test(trim)) {
      inBlock = true
      continue
    }
    if (!inBlock) continue
    if (/^##\s/.test(trim) || trim === '---') break
    blockLines.push(line)
  }
  if (blockLines.length === 0) return []

  const block = blockLines.join('\n')
  const boldTokens = [...block.matchAll(/\*\*([^*\n]+?)\*\*/g)].map((m) => m[1])

  let candidates: string[]
  if (boldTokens.length > 0) {
    candidates = boldTokens
  } else {
    const firstLine = blockLines.map((l) => l.trim().replace(/[`,]/g, '')).find(Boolean)
    candidates = firstLine ? [firstLine] : []
  }

  return candidates
    .flatMap((c) => c.split(/\s+ou\s+|\s*\/\s*|,/i))
    .map((t) => t.trim())
    .filter(Boolean)
}

// Preparations, never a substance on their own. Used to expand the `Juice / Extract` shorthand
// of a declaration, and to refuse the key when the expansion cannot apply.
const NOMENCLATURE_NOUNS = new Set(['EXTRACT', 'OIL', 'JUICE', 'WATER', 'POLYSACCHARIDE'])

// The plant parts an organ list enumerates (`Flower/Leaf/Stem Water`). Same rule as above: they
// qualify a species, they never name one.
const ORGAN_NOUNS = new Set([
  'BARK',
  'BUD',
  'FLOWER',
  'FRUIT',
  'KERNEL',
  'LEAF',
  'PEEL',
  'RHIZOME',
  'ROOT',
  'SEED',
  'SPROUT',
  'STEM',
])

// Never a substance: every word only qualifies one. `Stem Water` and `Leaf` are what an organ
// list leaves behind once the species name has been consumed by the head segment.
function isPartOnlyPhrase(s: string): boolean {
  const words = s.toUpperCase().split(/\s+/).filter(Boolean)
  return words.length > 0 && words.every((w) => ORGAN_NOUNS.has(w) || NOMENCLATURE_NOUNS.has(w))
}

// Grammar words an INCI name never carries. Checked casing-blind because the guard that rejects
// all-lowercase words cannot see a French note written in Title Case.
// `a` is deliberately absent: `Vitamin A` is a real declaration.
const FRENCH_GRAMMAR_WORDS = new Set([
  'au',
  'aux',
  'avec',
  'dans',
  'de',
  'des',
  'du',
  'en',
  'la',
  'le',
  'les',
  'par',
  'pour',
  'que',
  'qui',
  'sans',
  'sur',
  'un',
  'une',
])

/** Parse `SLUG_KEY: 'slug-value', // [INCI:] Token / Token | desc`. Returns null when format unfamiliar. */
export function parseInciFromSlugLine(line: string): { slug: string; tokens: string[] } | null {
  const m = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*:\s*['"]([^'"]+)['"]\s*,\s*\/\/\s*(.+?)\s*$/)
  if (!m) return null

  const slug = m[2]
  const comment = m[3]

  let inciSegment = comment
  if (/^INCI:\s*/i.test(comment)) {
    inciSegment = comment.replace(/^INCI:\s*/i, '')
  }
  const pipe = inciSegment.indexOf('|')
  if (pipe >= 0) inciSegment = inciSegment.slice(0, pipe)
  // A parenthesised gloss (`(butcher's broom)`, `(Biosol)`) and a dashed trailing note are
  // English prose the descriptor guard below reads as a French description, which drops the
  // whole declaration. `normalizeInciToken` erases parentheses at lookup time anyway, so
  // cutting them here changes no key.
  inciSegment = inciSegment
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s[–—-]\s.*$/, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!inciSegment) return null
  if (/['']/.test(inciSegment)) return null
  // INCI nomenclature is plain ASCII, so an accent means the comment is a French description.
  // Catches a Title-Case one the word-level guard below would wave through.
  if (/[À-ÿ]/.test(inciSegment)) return null

  // Reject French descriptors. An INCI name capitalises its substance words, but a locant can
  // be lowercase (`o-Cymen-5-ol`, `p-Cresol`) or numeric (`3-O-Ethyl Ascorbic Acid`), so the
  // test is "the word carries an uppercase letter somewhere", not "it starts with one".
  // Capitalisation alone is too weak: a French note written in Title Case passes it, which is
  // how `Category` and `Variable INCI` reached the index. Grammar words are checked casing-blind.
  const allowedLowercase = new Set(['or', 'and'])
  const words = inciSegment.split(/\s+/).filter(Boolean)
  for (const w of words) {
    const cleaned = w.replace(/[(),./&-]/g, '')
    if (!cleaned) continue
    if (FRENCH_GRAMMAR_WORDS.has(cleaned.toLowerCase())) return null
    if (!/[a-z]/i.test(cleaned)) continue
    if (/[A-Z]/.test(cleaned)) continue
    if (!allowedLowercase.has(cleaned.toLowerCase())) return null
  }

  // Split on aliases only: a comma inside a declared name belongs to it
  // (`2-Oleamido-1,3-Octadecanediol`), it never separates two names.
  const [head, ...rest] = inciSegment
    .split(/\s+ou\s+|\s*\/\s*/i)
    .map((t) => t.trim())
    .filter(Boolean)
  if (!head) return null

  const headWords = head.split(/\s+/)
  const tokens = [head]
  for (const seg of rest) {
    // `Aloe Barbadensis Leaf Juice / Extract` is a shorthand for two names sharing a stem, not
    // a name followed by a bare noun. Split literally it minted an `EXTRACT` key that captured
    // every product token spelled that way, and lost `Aloe Barbadensis Leaf Extract` itself.
    // A three-organ list (`Flower/Leaf/Stem Water`) leaves a two-word tail the same way, so the
    // test is "this segment only qualifies a species", not "this segment is one known noun".
    if (headWords.length > 1 && isPartOnlyPhrase(seg))
      tokens.push([...headWords.slice(0, -1), seg].join(' '))
    else tokens.push(seg)
  }

  return { slug, tokens }
}

// Editorial markers (`// Alias`, `// Category - variable INCI`). They name no substance, and a
// short key captures every product token spelled that way.
const NON_SUBSTANCE_KEYS = new Set(['ALIAS', 'CATEGORY', 'VARIABLE INCI'])

export function buildInciIndex(options: { includeExcipients?: boolean } = {}): InciIndex {
  const index: InciIndex = new Map()
  const validSlugs = new Set<string>(Object.values(INGREDIENT_SLUGS))

  const add = (rawToken: string, slug: string): void => {
    if (!validSlugs.has(slug)) return
    const norm = normalizeInciToken(rawToken)
    if (norm.length < 2) return
    // Digits lead real INCI names (`3-O-Ethyl Ascorbic Acid`); only punctuation is junk.
    if (!/^[A-Z0-9]/.test(norm)) return
    if (NON_SUBSTANCE_KEYS.has(norm) || isPartOnlyPhrase(norm)) return
    if (!options.includeExcipients && EXCIPIENT_BLOCKLIST.has(norm)) return
    if (!index.has(norm)) index.set(norm, { slug })
  }

  // Source 1: slug-file inline comments first. The explicit `INCI:` prefix is the most
  // predictable signal, and the file order (skincare → haircare → dental → supplements)
  // resolves shared tokens like NIACINAMIDE to the canonical skincare slug rather than
  // a domain-suffixed variant (niacinamide-hair, etc.).
  for (const { rel } of SLUG_FILES) {
    const path = join(INGREDIENTS_ROOT, rel)
    let text: string
    try {
      text = readFileSync(path, 'utf-8')
    } catch {
      continue
    }
    for (const line of text.split('\n')) {
      const parsed = parseInciFromSlugLine(line)
      if (!parsed) continue
      for (const tok of parsed.tokens) add(tok, parsed.slug)
    }
  }

  // Source 2: markdown `## INCI` blocks fill any token the slug-file pass missed.
  for (const ing of ingredientData) {
    for (const tok of parseInciFromContent(ing.content)) add(tok, ing.slug)
  }

  return index
}

/**
 * Slugs whose canonical INCI token sits on EXCIPIENT_BLOCKLIST. Lets a *resolved* slug be
 * dropped even when the raw token that produced it was a non-blocklisted synonym (e.g.
 * `Polydimethylsiloxane` → dimethicone, `Gomme Xanthane` → xanthan-gum). buildInciIndex drops
 * blocklisted tokens at construction, so we rebuild the index keeping them and collect their slugs.
 */
export function buildExcipientSlugs(): Set<string> {
  const full = buildInciIndex({ includeExcipients: true })
  const slugs = new Set<string>()
  for (const [token, entry] of full) {
    if (EXCIPIENT_BLOCKLIST.has(token)) slugs.add(entry.slug)
  }
  return slugs
}

/**
 * Every ingredient slug → its source-file domain. Unlike the inci index (which only carries
 * slugs that expose an INCI token), this covers the full slug set, so a slug reached by the
 * humanised-word bridge still gets domain-filtered. First file wins on cross-domain collision.
 */
export function buildSlugDomainMap(): Map<string, IngredientDomain> {
  const validSlugs = new Set<string>(Object.values(INGREDIENT_SLUGS))
  const map = new Map<string, IngredientDomain>()
  for (const { rel, domain } of SLUG_FILES) {
    // Fail loud: a swallowed read would silently drop this domain's slugs, letting them
    // bypass the category filter (cross-domain leak). A missing seed file is a bug, not a skip.
    const text = readFileSync(join(INGREDIENTS_ROOT, rel), 'utf-8')
    for (const m of text.matchAll(/^\s*[A-Z][A-Z0-9_]*\s*:\s*['"]([^'"]+)['"]/gm)) {
      const slug = m[1]
      if (validSlugs.has(slug) && !map.has(slug)) map.set(slug, domain)
    }
  }
  return map
}

export function getDomainAllowlist(category: string | undefined): Set<IngredientDomain> | null {
  if (!category) return null
  const list = CATEGORY_DOMAIN_ALLOWLIST[category]
  return list ? new Set(list) : null
}
