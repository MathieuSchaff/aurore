/**
 * migration-helpers.ts — Pure normalization helpers shared by scrapper-import scripts.
 *
 * Consumers:
 *   - migrate-output.ts        (Atida pre-processed seeds)
 *   - migrate-pharmashop.ts    (Pharmashop description.txt)
 *
 * Nothing here touches data/products/ directly. Helpers are pure functions and
 * static keyword lists. The wrapping `normalize()` lives in each consumer because
 * raw input shapes differ.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// ─── Out-of-scope detection ──────────────────────────────────────────────────

export const DEVICE_KEYWORDS = [
  'brosse à dents', 'brosse a dents', 'brossette', 'fil dentaire', 'soie dentaire',
  'embout', 'recharge brossette', 'manche', 'jet dentaire', 'hydropulseur',
  'lingette', 'lingettes',
  'bande de cire', 'bandelette', 'patch dentaire',
  'pastilles à sucer', 'pastille à sucer',
  'gomme à mâcher', 'gommes à mâcher', 'chewing-gum',
  'peigne', 'peigne anti-poux',
  'goupillon', 'porte-fil', 'porte fil',
  'gant de toilette', 'gant de soie', 'gant de crin', 'gant exfoliant', 'gant de beauté',
  'pastille', 'wash glove', 'cure-dents', 'cure dents',
  'recharge power', 'tête de brossette', 'manche brosse',
] as const

export const OUT_OF_SCOPE_KEYWORDS = [
  'coloration', 'shampoing colorant', 'shampooing colorant', 'crème colorante', 'soin coloration',
  'masque colorant', 'crayon coloration',
  'dépilatoire', 'depilatoire', 'cire froide', 'cire chaude', 'épilation', 'epilation',
  'anti-poux', 'anti poux',
  'fond de teint', 'mascara', 'rouge à lèvres', 'rouge a lèvres', 'fard', 'eyeliner',
  'crayon yeux', 'blush', 'highlighter', 'illuminateur', 'soin de teint',
  'durcisseur d\'ongles', 'soin ongles', 'vernis', 'verrutop', 'verrue',
  'eau parfumée', 'eau fraîche parfumée', 'eau fraiche parfumee', 'eau de toilette', 'eau de parfum',
  'kit ', 'coffret', 'duo ', 'trio ', 'pack ', 'éco-recharge', 'eco-recharge',
  'trousse', 'routine ', 'rituel coffret', 'calendrier de l\'avent',
  'anti-chute', 'anti chute', 'antichute', 'anticarie expert orthodontie',
  'herbatint', 'fibre chatain', 'fibre châtain', 'fibre blond', 'fibre brun',
] as const

export const DENTURE_KEYWORDS = [
  'prothèse dentaire', 'prothèses dentaires', 'fixation dentier', 'fixation prothèse',
  'colle dentaire', 'dentier', 'adhésif prothèse', 'reparfix', 'fixobridge', 'nitradine',
] as const

// ─── Kind inference rules ─────────────────────────────────────────────────────
// Order matters: more specific (multi-word) rules first, broad single-word last.

export const KIND_RULES: Array<{ keywords: string[]; kind: string }> = [
  { keywords: ['après-shampooing', 'apres-shampooing', 'conditionneur', 'après shampooing', 'apres shampooing', 'démêlant', 'demelant'], kind: 'conditioner' },
  { keywords: ['soin sans rinçage', 'sans-rinçage', 'sans rinçage', 'leave-in', 'leave in', 'crème sans rinçage', 'lait sans rinçage', 'baume sans rinçage', 'hair perfector'], kind: 'conditioner' },
  { keywords: ['masque capillaire', 'masque cheveux', 'masque soin cheveux', 'masque gloss', 'masque réparateur cheveux'], kind: 'hair-mask' },
  { keywords: ['sérum capillaire', 'serum capillaire', 'sérum cheveux', 'serum cheveux'], kind: 'hair-serum' },
  { keywords: ['huile capillaire', 'huile cheveux', 'huile pour cheveux', 'huile végétale cheveux', 'huile brillance', 'huile d\'argan'], kind: 'hair-oil' },
  { keywords: ['shampooing', 'shampoing', 'shampoo', 't/gel', 'démangeaisons sévères', 'antipelliculaire'], kind: 'shampoo' },
  { keywords: ['pommade coiffante', 'cire coiffante', 'gel coiffant', 'mousse coiffante', 'spray coiffant', 'pâte coiffante', 'pate coiffante', 'laque', 'fixateur', 'crème coiffante', 'gelée coiffante', 'lotion coiffante', 'pâte de définition', 'pate de definition', 'gel sculptant', 'gel de définition', 'gel definition', 'poudre densifiante', 'spray multi-bénéfices', 'spray multi-benefices', 'curl stylers', 'cheveux bouclés', 'cheveux boucles'], kind: 'styling' },
  { keywords: ['concentré cuir chevelu', 'concentré cuirs chevelus', 'concentré soin cuir', 'soin cuir chevelu', 'head spa', 'soin capillaire', 'traitement brillance', 'soin calmant cuir', 'lotion capillaire', 'cuir chevelu', 'cuirs chevelus', 'concentré corps et cuir', 'soin apaisant cuir'], kind: 'hair-serum' },
  { keywords: ['dentifrice', 'gel dentifrice', 'pâte dentifrice', 'cosmétique bi-fluoré', 'bi-fluoré', 'réparation gencives', 'gencives bitube', 'soin gencives', 'anti-caries expert'], kind: 'toothpaste' },
  { keywords: ['bain de bouche', 'bain bouche', 'rince-bouche', 'rince bouche', 'spray buccal', 'eau de bouche', 'solution dentaire', 'solution buccale'], kind: 'mouthwash' },
  { keywords: ['gel buccal', 'aphtes', 'gel aphtes', 'lésions buccales'], kind: 'spot-treatment' },
  { keywords: ['blanchiment dentaire', 'blanchissant', 'whitening', 'éclat dent'], kind: 'teeth-whitening' },
  { keywords: ['fil dentaire', 'soie dentaire'], kind: 'floss' },
  { keywords: ['après-soleil', 'apres soleil', 'après soleil', 'after sun', 'after-sun', 'brûlure', 'brulure', 'coup de soleil', 'coups de soleil'], kind: 'after-sun' },
  { keywords: ['autobronzant', 'self-tanner', 'self tanner', 'poudre de soleil', 'poudre bonne mine'], kind: 'self-tanner' },
  { keywords: ['spf', 'solaire', 'écran solaire', 'ecran solaire', 'sunscreen', 'protect', 'fluide solaire', 'lait solaire', 'crème solaire', 'spray solaire', 'stick solaire', 'photoprotect'], kind: 'sunscreen' },
  { keywords: ['gummies', 'gummy', 'gomme à mâcher complément'], kind: 'gummy' },
  { keywords: ['ampoule buvable', 'ampoule nutritive', 'ampoule complément'], kind: 'ampoule' },
  { keywords: ['poudre protéinée', 'poudre nutritive', 'poudre minceur', 'poudre complément'], kind: 'poudre' },
  { keywords: ['gélule', 'gelule', 'comprimé', 'complément alimentaire', 'complement alimentaire', 'capsule complément', 'anacaps', 'reactiv chute', 'expert chute'], kind: 'gelule' },
  { keywords: ['déodorant', 'deodorant', 'anti-transpirant', 'anti transpirant'], kind: 'deodorant' },
  { keywords: ['gommage corps', 'gommage corporel', 'scrub corps', 'exfoliant corps'], kind: 'body-scrub' },
  { keywords: ['huile corps', 'huile sèche corps', 'huile corporelle', 'huile pour le corps', 'huile de massage', 'huile prodigieuse'], kind: 'body-oil' },
  { keywords: ['lait corps', 'crème corps', 'baume corps', 'lotion corps', 'crème pour le corps', 'crème corporelle', 'baume sécheresses', 'crème sécheresses', 'spray émollient', 'lait émollient', 'mousse anti-capitons', 'anti-capitons', 'crème minceur'], kind: 'body-lotion' },
  { keywords: ['huile de douche', 'huile lavante', 'gel douche', 'crème de douche', 'crème douche', 'crème lavante corps', 'savon liquide', 'bain douche', 'douche bain', 'nettoyant corps', 'douche crème', 'syndet', 'huile bain et douche', 'shower gel', 'shower oil'], kind: 'body-wash' },
  { keywords: ['savon surgras', 'pain dermatologique', 'pain surgras', 'pain de toilette', 'savon de marseille', 'savon d\'alep', 'savon traditionnel', 'gel surgras', 'gel sensitive', 'déo douche', 'deo douche'], kind: 'body-wash' },
  { keywords: ['gel lavant', 'crème lavante', 'soin lavant', 'solution lavante', 'lait lavant'], kind: 'body-wash' },
  { keywords: ['crème mains', 'soin mains', 'soin main', 'crème pour les mains', 'baume mains'], kind: 'hand-cream' },
  { keywords: ['crème pieds', 'soin pieds', 'soin pied', 'crème pour les pieds', 'baume pieds'], kind: 'foot-cream' },
  { keywords: ['contour yeux', 'contour des yeux', 'crème yeux', 'soin yeux', 'soin regard', 'crème regard', 'sérum yeux', 'palpébral', 'palpebral', 'eczéma des paupières', 'eczema des paupieres'], kind: 'eye-cream' },
  { keywords: ['démaquillant yeux', 'démaquillant lèvres', 'démaquillant', 'demaquillant', 'lait démaquillant', 'eau démaquillante', 'lotion démaquillante'], kind: 'cleanser' },
  { keywords: ['eau micellaire', 'solution micellaire'], kind: 'cleanser' },
  { keywords: ['gel nettoyant', 'mousse nettoyante', 'lait nettoyant', 'crème nettoyante', 'huile nettoyante', 'huile démaquillante', 'nettoyant visage', 'gel moussant', 'gel lavant visage', 'gel purifiant', 'crème lavante visage', 'mousse lavante', 'foamer nettoyant', 'nettoyant hydratant', 'nettoyant apaisant', 'cleansing balm', 'cleansing gel', 'cleansing oil'], kind: 'cleanser' },
  { keywords: ['masque visage', 'masque purifiant', 'masque hydratant', 'masque exfoliant', 'masque peeling', 'masque tissu', 'masque crème', 'masque nuit', 'masque autobronzant', 'masque nourrissant visage', 'pâte argile', 'pate argile', 'argile ghassoul', 'masque high-tech', 'hydratation mask', 'hydration mask', 'poudre magique'], kind: 'mask' },
  { keywords: ['peeling', 'exfoliant', 'gommage visage'], kind: 'exfoliant' },
  { keywords: ['lotion tonique', 'toner', 'tonique', 'lotion équilibrante', 'lotion florale', 'eau florale', 'eau de beauté', 'eau pour le visage', 'rituel peau neuve'], kind: 'toner' },
  { keywords: ['essence', 'eau de soin', 'lotion essence'], kind: 'essence' },
  { keywords: ['patch'], kind: 'patch' },
  { keywords: ['baume lèvres', 'soin lèvres', 'baume levres', 'baume couleur', 'stick lèvres', 'stick à lèvres', 'beurre de lèvres', 'huile lèvres', 'gloss lèvres'], kind: 'lip-care' },
  { keywords: ['baume nettoyant', 'baume démaquillant'], kind: 'cleanser' },
  { keywords: ['baume réparateur', 'baume apaisant', 'baume hydratant', 'baume nourrissant', 'baume cica'], kind: 'balm' },
  { keywords: ['sérum', 'serum'], kind: 'serum' },
  { keywords: ['huile visage', 'huile sèche visage', 'huile de soin visage', 'huile pour le visage'], kind: 'oil' },
  { keywords: ['primer', 'base de teint', 'base lissante'], kind: 'primer' },
  { keywords: ['brume', 'mist', 'spray hydratant', 'eau de soin spray'], kind: 'mist' },
  { keywords: ['soin ciblé', 'soin anti-imperfections', 'crème anti-imperfections', 'crème anti imperfections', 'gel anti-imperfections', 'correcteur', 'soin imperfections', 'spot treatment', 'on the spot', 'concentré antitaches', 'concentré anti-taches', 'concentré anti-tâches', 'concentré anti tâches', 'concentré anti-imperfections', 'concentré éclat', 'concentré eclat', 'concentré jeunesse', 'soin antitaches', 'soin perfecteur', 'soin localisé', 'roll-on imperfections', 'roll-on s.o.s', 'roll on s.o.s', 'roll-on sos', 'gel asséchant', 'stop bouton', 'stop boutons', 'spray anti-imperfections', 'lotion purifiante', 'soin sos', 'soin booster', 's.o.s imperfections', 'sos imperfections', 'crème lactée anti-tâches'], kind: 'spot-treatment' },
  { keywords: ['crème de jour', 'crème de nuit', 'crème jour', 'crème nuit', 'soin jour', 'soin nuit', 'soin nourrissant visage'], kind: 'moisturizer' },
  { keywords: ['fluide', 'gel-crème', 'gel crème', 'crème hydratante', 'crème visage', 'crème de soin', 'émulsion', 'soin hydratant', 'crème réparatrice', 'crème apaisante', 'crème nourrissante', 'crème confort', 'crème nutritive', 'crème suprême', 'crème riche', 'crème émolliente', 'crème lift', 'crème anti-âge', 'crème anti age', 'soin anti-âge', 'soin anti-rides', 'lait hydratant', 'lait visage', 'baume', 'soin visage', 'lait crème', 'crème barrière', 'crème anti-rugosités', 'crème surgras', 'crème dépigmentante', 'crème éclat', 'crème médicale', 'soin intense', 'soin nourrissante', 'soin concentré', 'soin réparateur', 'soin vergetures', 'soin fraîcheur', 'crème soin', 'pommade', 'rituel anti-âge', 'rituel hydratation visage', 'rituel jour', 'rituel nuit', 'rituel régénérateur', 'rituel volumateur', 'crème lumière', 'crème d\'eau', 'gelée évanescente', 'gelée cristalline', 'gelée hydratante', 'gelée fraîche', 'gel humectant', 'shower gel hydratant', 'cream hydratant', 'cream 10', 'cream 20', 'cream 30', 'lait nourrissant', 'lait riche', 'lait apaisant', 'lait concentré', 'beurre de karité', 'bain d\'hydratation'], kind: 'moisturizer' },
  { keywords: ['spray haleine', 'spray buccal'], kind: 'mouthwash' },
  { keywords: ['spray brushing', 'spray illumine', 'spray activateur', 'spray fixant', 'spray volume', 'spray lissant'], kind: 'styling' },
  { keywords: ['savon végétal', 'savon alep', 'savon laurier', 'pain de toilette', 'gelée de douche', 'gelée douche'], kind: 'body-wash' },
  { keywords: ['pâte purifiante', 'pate purifiante', 'pâte nettoyante', 'pate nettoyante', 'mousse lavante visage'], kind: 'cleanser' },
  { keywords: ['poudre lavante'], kind: 'cleanser' },
  { keywords: ['gommage'], kind: 'exfoliant' },
]

export const KIND_TO_CATEGORY: Record<string, string> = {
  serum: 'skincare', moisturizer: 'skincare', cleanser: 'skincare',
  toner: 'skincare', exfoliant: 'skincare', 'eye-cream': 'skincare',
  mask: 'skincare', mist: 'skincare', essence: 'skincare',
  'spot-treatment': 'skincare', 'lip-care': 'skincare', balm: 'skincare',
  oil: 'skincare', primer: 'skincare', patch: 'skincare',
  sunscreen: 'solaire', 'after-sun': 'solaire', 'self-tanner': 'solaire',
  gelule: 'complement', capsule: 'complement', ampoule: 'complement',
  poudre: 'complement', sirop: 'complement', gummy: 'complement', huile: 'complement',
  shampoo: 'haircare', conditioner: 'haircare', 'hair-mask': 'haircare',
  'hair-serum': 'haircare', 'hair-oil': 'haircare', styling: 'haircare',
  'body-lotion': 'bodycare', 'body-oil': 'bodycare', 'body-scrub': 'bodycare',
  'body-wash': 'bodycare', deodorant: 'bodycare', 'hand-cream': 'bodycare',
  'foot-cream': 'bodycare',
  toothpaste: 'dental', mouthwash: 'dental', 'teeth-whitening': 'dental', floss: 'dental',
}

export const UNIT_NAME_RULES: Array<{ keywords: string[]; unit: string }> = [
  { keywords: ['solide', 'pain de savon', 'savon dur'], unit: 'bar' },
  { keywords: ['roll-on', 'roller', 'bille'], unit: 'roller' },
  { keywords: ['spray', 'brume', 'mist'], unit: 'spray' },
  { keywords: ['stick'], unit: 'stick' },
  { keywords: ['aérosol', 'aerosol'], unit: 'aerosol' },
  { keywords: ['sachet'], unit: 'sachet' },
  { keywords: ['gélule', 'gelule'], unit: 'capsule' },
  { keywords: ['comprimé', 'tablet'], unit: 'tablet' },
  { keywords: ['gummies', 'gummy'], unit: 'gummy' },
  { keywords: ['ampoule'], unit: 'ampoule' },
  { keywords: ['poudre'], unit: 'powder' },
  { keywords: ['tube'], unit: 'tube' },
  { keywords: ['pompe', 'pump'], unit: 'pump' },
  { keywords: ['compte-gouttes', 'pipette', 'dropper'], unit: 'dropper' },
]

export const KIND_TO_DEFAULT_UNIT: Record<string, string> = {
  serum: 'dropper', moisturizer: 'jar', cleanser: 'bottle', toner: 'bottle',
  exfoliant: 'tube', 'eye-cream': 'tube', mask: 'jar', mist: 'spray',
  essence: 'bottle', 'spot-treatment': 'dropper', 'lip-care': 'tube',
  balm: 'jar', oil: 'dropper', primer: 'tube', patch: 'pack',
  sunscreen: 'tube', 'after-sun': 'bottle', 'self-tanner': 'bottle',
  gelule: 'capsule', capsule: 'capsule', ampoule: 'ampoule', poudre: 'powder',
  sirop: 'bottle', gummy: 'gummy', huile: 'bottle',
  shampoo: 'bottle', conditioner: 'bottle', 'hair-mask': 'jar',
  'hair-serum': 'bottle', 'hair-oil': 'bottle', styling: 'jar',
  'body-lotion': 'bottle', 'body-oil': 'bottle', 'body-scrub': 'jar',
  'body-wash': 'bottle', deodorant: 'spray', 'hand-cream': 'tube', 'foot-cream': 'tube',
  toothpaste: 'tube', mouthwash: 'bottle', 'teeth-whitening': 'tube', floss: 'pack',
}

// ─── Amount / slug / name normalization ──────────────────────────────────────

export const STANDARD_AMOUNT_UNITS = ['ml', 'cl', 'l', 'g', 'mg', 'kg', 'oz']

// When a source sets totalAmount=1/amountUnit="unité" or similar, parse the real
// volume from the product name as fallback.
export function parseAmountFromName(name: string): { amount: number; unit: string } | null {
  const m = name.match(/(\d+(?:[.,]\d+)?)\s*(ml|cl|kg|mg|oz|g|l)\b/i)
  if (!m) return null
  const amount = parseFloat(m[1].replace(',', '.'))
  if (!isFinite(amount) || amount <= 0) return null
  return { amount, unit: m[2].toLowerCase() }
}

export function cleanSlug(slug: string, totalAmount: number, amountUnit: string): string {
  let s = slug.replace(/-\d{4,}$/, '')
  if (totalAmount > 0 && STANDARD_AMOUNT_UNITS.includes(amountUnit.toLowerCase())) {
    const amountStr = String(totalAmount).replace('.', '-?')
    const pattern = new RegExp(`-${amountStr}[-_]?${amountUnit}s?$`, 'i')
    s = s.replace(pattern, '')
  }
  s = s.replace(/-\d+(?:-?\d+)?[-_]?(?:ml|cl|kg|mg|oz|g|l)s?$/i, '')
  s = s.replace(/-(?:lot|pack|duo|trio)-de-\d+(?:-x)?$/i, '')
  return s.trim()
}

export function cleanName(name: string, brand: string, totalAmount: number, amountUnit: string): string {
  const brandEscaped = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  let n = name.replace(new RegExp(`^${brandEscaped}\\s+`, 'i'), '').trim()
  const UNIT_TOKEN = '(?:ml|cl|l|kg|g|mg|oz|capsules?|comprim[eé]s?|g[eé]lules?|sachets?|ampoules?|unit[eé]s?|caps?|gummies?)'
  n = n.replace(/\s+lot\s+de\s+\d+.*/i, '').trim()
  n = n.replace(new RegExp(`\\s+\\d+\\s*x\\s*\\d+(?:[.,]\\d+)?\\s*${UNIT_TOKEN}\\b.*`, 'i'), '').trim()
  n = n.replace(new RegExp(`\\s+\\d+(?:[.,]\\d+)?\\s*${UNIT_TOKEN}\\b.*`, 'i'), '').trim()
  // 'totalAmount/amountUnit' kept for API parity with cleanSlug; the unit token regex
  // above already covers all supported units.
  void totalAmount; void amountUnit
  return n
}

// ─── INCI cleanup ────────────────────────────────────────────────────────────

const INCI_PREFIX = /^(?:ingr[eé]di[eé]?n?ts?\s*:\s*|ingredients?\s*:\s*)/i
// Atida sometimes prepends an internal lab/batch code or product name before the INGREDIENTS: header.
const INCI_LAB_PREFIX = /^[A-Z0-9][A-Z0-9.\/\s\-’']*\s*[-–:]\s*ingr[eé]di[eé]?n?ts?\s*:\s*/i
// Apostrophe class covers ASCII ', curly ’, and back-tick `
const APO = "[' ’‘`]?"
const INCI_MARKETING_TAIL = new RegExp(
  '(?:' +
    `\\d+(?:[.,]\\d+)?\\s*%\\s*(?:D${APO}\\s*)?(?:INGR[EÉ]DIENTS|ORIGINE\\s+NATUR|DU\\s+TOTAL)` +
    '|ORIGINE\\s+NATUREL[A-Z]*\\s+\\d+(?:[.,]\\d+)?\\s*%' +
    '|\\*\\s*ORIGINE\\s+NATUREL' +
    '|FABRIQU[EÉ]\\s+EN\\s' +
    '|IL\\s+EST\\s+RECOMMAND[EÉ]' +
    '|ACTIF\\s+(?:CONNU|QUI|HYDRATANT|APAISANT|EXFOLIANT)' +
    '|AVANT\\s+SON\\s+ACHAT' +
    '|COMPOSITION\\s+SUSCEPTIBLE' +
    `|CONSEILS?\\s+D${APO}\\s*UTILISATION` +
    `|MODE\\s+D${APO}\\s*EMPLOI` +
    '|PR[EÉ]CAUTIONS?\\s*[:\\s]' +
    '|CARACT[EÉ]RISTIQUES?\\s*[:\\s]' +
    '|EMBALLAGE\\s+(?:COMPORTANT|NON|RECYCLABLE|EN\\s+PLASTIQUE)' +
    '|TECHNOLOGIE\\s+[A-Z][A-Z\\-]+\\s*:' +
    `|HUILE\\s+ESSENTIELLE\\s+D${APO}` +
    '|EXTRAIT\\s+DE\\s+CELLULES?\\s+SOUCHES?' +
    '|AGENT[\\s-]HYDRATANT' +
    '|FIGUIER\\s+DE\\s+BARBARIE\\s*:' +
    '|BIOMIM[ÉE]TIQUE' +
    '|RECHARGEABLE' +
    '|FORMULE\\s+(?:UNIQUE|CONCENTR[EÉ]E?)' +
    '|R[EÉ]SULTATS?\\s+CLINIQUES?' +
    `|POUR\\s+PLUS\\s+D${APO}\\s*INFORMATION` +
    `|LES\\s+LISTES\\s+D${APO}` +
    `|VEUILLEZ\\s+LIRE` +
    `|ASSURE(?:NT)?\\s+(?:LA|UNE)\\s+BONNE` +
    `|FACILITE\\s+LA\\s+P[EÉ]N[EÉ]TRATION` +
    `|STABILISE\\s+LA\\s+FORMULE` +
    `|AJUSTEUR\\s+DE\\s+PH` +
    `|\\*+\\s*INGR[EÉ]DIENTS?\\s+(?:ISSUS|TRANSFORM[EÉ]S|D${APO}\\s*ORIGINE)` +
    `|\\*+\\s*TRANSFORM[EÉ]S` +
    `|\\*+\\s*COMPOSANTS?\\s+NATUREL` +
  ').*$',
  'i'
)

const INCI_PLACEHOLDER = /^(?:voir\s+(?:la|le)\s+(?:composition|liste).*emballage|composition\s+sur\s+l[' ]emballage|consulter\s+l[' ]emballage|disponible\s+sur\s+l[' ]emballage|composition\s+susceptible\s+d[' ]ajustement|pour\s+la\s+composition\s+et\s+les\s+ingr[eé]dients,?\s+merci)/i

export function cleanInci(inci: string): string {
  if (!inci) return ''
  let s = inci.trim()
  if (INCI_PLACEHOLDER.test(s)) return ''
  s = s.replace(INCI_LAB_PREFIX, '')
  s = s.replace(INCI_PREFIX, '').trim()
  s = s.replace(/[\r\n]+/g, ' ')
  s = s.toUpperCase()
  s = s.replace(/\s*•\s*/g, ', ')
  s = s.replace(/\.\s+(?=[A-Z0-9])/g, ', ')
  const INCI_STARTER = /\b(?:AQUA|WATER|EAU|AQUA\/WATER|WATER\/AQUA|GLYCERIN|ALCOHOL\s+DENAT|HYDROGENATED|SODIUM\s+LAURET|SODIUM\s+LAURYL|SODIUM\s+COCOATE|SODIUM\s+OLIVATE|CETEARYL\s+ALCOHOL|CAPRYLIC\/CAPRIC|RICINUS\s+COMMUNIS|BUTYROSPERMUM|HELIANTHUS\s+ANNUUS|PRUNUS\s+AMYGDALUS|COCOS\s+NUCIFERA|OLEA\s+EUROPAEA|PARAFFINUM\s+LIQUIDUM|TRITICUM\s+VULGARE|DIMETHICONE)\b/

  const stripped = s.replace(INCI_MARKETING_TAIL, '')
  if (stripped.replace(/[.,;:*\s]+$/, '').length >= 50) {
    s = stripped
  } else {
    const m = s.match(INCI_STARTER)
    s = m && m.index !== undefined && m.index > 0 ? s.slice(m.index).replace(INCI_MARKETING_TAIL, '') : s
  }
  const hasPreamble = /^(?:CONTIENT\s+\d|AVANT\s+D|VEUILLEZ\s+LIRE|LES\s+LISTES\s+D|\d+\s*%)/i.test(s)
  if (hasPreamble) {
    const m = s.match(INCI_STARTER)
    if (m && m.index !== undefined && m.index > 30) s = s.slice(m.index)
  }
  s = s.replace(/\s{2,}/g, ' ').replace(/[.,;:*\s]+$/, '').trim()
  return s
}

// ─── Kind / unit / scope inference ──────────────────────────────────────────

// Pharmashop CAPS titles often drop accents ("CREME EMOLLIENTE", "RECONFORTANTE") while
// our KIND_RULES keywords use the proper French spellings ("crème émolliente"). Match
// accent-insensitively so the same keyword list works for both Atida and Pharmashop input.
function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/\p{Mn}/gu, '')
}

const KIND_RULES_NORM: Array<{ keywords: string[]; kind: string }> = KIND_RULES.map((r) => ({
  keywords: r.keywords.map((k) => stripAccents(k.toLowerCase())),
  kind: r.kind,
}))

const UNIT_NAME_RULES_NORM: Array<{ keywords: string[]; unit: string }> = UNIT_NAME_RULES.map((r) => ({
  keywords: r.keywords.map((k) => stripAccents(k.toLowerCase())),
  unit: r.unit,
}))

const DEVICE_KEYWORDS_NORM: string[] = DEVICE_KEYWORDS.map((k) => stripAccents(k.toLowerCase()))
const OUT_OF_SCOPE_KEYWORDS_NORM: string[] = OUT_OF_SCOPE_KEYWORDS.map((k) => stripAccents(k.toLowerCase()))
const DENTURE_KEYWORDS_NORM: string[] = DENTURE_KEYWORDS.map((k) => stripAccents(k.toLowerCase()))

export function inferKind(name: string): string {
  const n = stripAccents(name.toLowerCase())
  for (const { keywords, kind } of KIND_RULES_NORM) {
    if (keywords.some((kw) => n.includes(kw))) return kind
  }
  return ''
}

export function inferKindFallback(name: string): string {
  // Accent-stripped input + ASCII regex so the same fallback works on Atida ("crème")
  // and Pharmashop CAPS titles ("CREME").
  const n = stripAccents(name.toLowerCase())
  const hasCorps = /\bcorps\b/.test(n) || /\bcorporel(?:le)?\b/.test(n)
  const hasVisage = /\bvisage\b/.test(n) || /\bjoues\b/.test(n) || /\bfacial\b/.test(n)
  const hasCheveux = /\bcheveux\b/.test(n) || /\bcuir\s+chevelu\b/.test(n) || /\bcapillaire\b/.test(n)
  const hasMains = /\bmains?\b/.test(n)
  const hasPieds = /\bpieds?\b/.test(n)

  if (hasCorps) {
    if (/\b(gel|huile|creme|lait)\s+(?:de\s+)?(?:douche|lavant|nettoyant)\b/.test(n)) return 'body-wash'
    if (/\bhuile\b/.test(n)) return 'body-oil'
    if (/\bgommage\b/.test(n)) return 'body-scrub'
    if (/\b(creme|lait|baume|gelee|fluide|emulsion|mousse|rituel|soin|hydratation|nutrition|gel)\b/.test(n)) return 'body-lotion'
  }
  if (hasMains && /\b(creme|baume|soin|gel)\b/.test(n)) return 'hand-cream'
  if (hasPieds && /\b(creme|baume|soin|gel)\b/.test(n)) return 'foot-cream'
  if (hasCheveux) {
    if (/\bmasque\b/.test(n)) return 'hair-mask'
    if (/\bserum\b|\belixir\b/.test(n)) return 'hair-serum'
    if (/\bhuile\b/.test(n)) return 'hair-oil'
    if (/\b(soin|creme|baume|gelee)\b/.test(n)) return 'conditioner'
  }
  if (hasVisage || (!hasCorps && !hasCheveux)) {
    if (/\bgommage\b/.test(n)) return 'exfoliant'
    if (/\bmasque\b|\bmask\b/.test(n)) return 'mask'
    if (/\b(creme|fluide|emulsion|gelee|gel-creme|hydratant|hydrogel)\b/.test(n)) return 'moisturizer'
    if (/\b(baume|balm)\b/.test(n)) return 'balm'
    if (/\bserum\b/.test(n)) return 'serum'
    if (/\blotion\b/.test(n)) return 'toner'
    if (/\bhuile\b/.test(n)) return 'oil'
    if (/\bnettoyant\b/.test(n)) return 'cleanser'
    if (/\blait\b/.test(n)) return 'moisturizer'
  }
  return ''
}

export function detectOutOfScope(name: string): string | null {
  const n = stripAccents(name.toLowerCase())
  if (DEVICE_KEYWORDS_NORM.some((kw) => n.includes(kw))) return 'Device/accessory (no formulation)'
  if (DENTURE_KEYWORDS_NORM.some((kw) => n.includes(kw))) return 'Denture care (out of scope)'
  if (OUT_OF_SCOPE_KEYWORDS_NORM.some((kw) => n.includes(kw))) return 'Out-of-scope category (color, depilatory, lice, bundle)'
  return null
}

export function inferUnit(name: string, kind: string): string {
  const n = stripAccents(name.toLowerCase())
  for (const { keywords, unit } of UNIT_NAME_RULES_NORM) {
    if (keywords.some((kw) => n.includes(kw))) return unit
  }
  return KIND_TO_DEFAULT_UNIT[kind] ?? ''
}

// ─── Brand / candidate writers ──────────────────────────────────────────────

export function brandToSlug(brand: string): string {
  return brand
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function toBrandConst(brand: string): string {
  return brand
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

export function escapeStr(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
}

// ─── Shared product / migration shape ───────────────────────────────────────

export interface NormalizedProduct {
  slug: string
  name: string
  brand: string
  kind: string
  unit: string
  totalAmount: number
  amountUnit: string
  priceCents: number
  description: string
  notes: string
  inci: string
  url: string
  imageUrl: string
  brandSlug: string
  category: string
  originalSlug: string
  originalName: string
  sourceFile: string
}

export type MigrationAction = 'enrich' | 'create' | 'skip'

export interface MigrationEntry {
  action: MigrationAction
  slug: string
  brand: string
  name: string
  category: string
  sourceFile: string
  existingProductFile?: string
  enrichableFields?: string[]
  skipReason?: string
}

export function getEnrichableFields(p: NormalizedProduct): string[] {
  const fields: string[] = []
  if (p.inci) fields.push('inci')
  if (p.imageUrl) fields.push('imageUrl')
  if (p.url) fields.push('url')
  if (p.priceCents > 0) fields.push('priceCents')
  if (p.description) fields.push('description')
  return fields
}

interface CandidateFileOptions {
  /** Constant suffix used in the export name. Default: 'SEED'. */
  exportSuffix?: string
  /** Free-form note inserted between the import and the export. */
  headerNote?: string
}

export function generateCandidateFile(
  products: NormalizedProduct[],
  brandSlug: string,
  options: CandidateFileOptions = {}
): string {
  if (products.length === 0) return ''

  const exportSuffix = options.exportSuffix ?? 'SEED'
  const brandConst = toBrandConst(products[0].brand || brandSlug)

  const blocks = products
    .map((p) => {
      const kindVal = p.kind ? `'${p.kind}'` : `'' // TODO: choose kind`
      const unitVal = p.unit ? `'${p.unit}'` : `'' // TODO: choose unit`
      return `  {
    slug: '${escapeStr(p.slug)}',
    name: '${escapeStr(p.name)}',
    brand: '${escapeStr(p.brand)}',
    kind: ${kindVal},
    unit: ${unitVal},
    totalAmount: ${p.totalAmount},
    amountUnit: '${p.amountUnit}',
    priceCents: ${p.priceCents},
    description: '', // TODO
    notes: '',
    inci: '${escapeStr(p.inci)}',
    url: '${escapeStr(p.url)}',
    imageUrl: '${escapeStr(p.imageUrl)}',
    tags: {
      primary: [], // TODO — slugs from data/tags/ only
      secondary: [], // TODO
      avoid: [], // TODO
    },
    keyIngredients: [], // TODO — slugs from INGREDIENT_SLUGS only
  }`
    })
    .join(',\n')

  const headerNote = options.headerNote ? `\n// ${options.headerNote}\n` : ''

  // Import path '../../types' resolves both in candidates (output/types.ts stub) and in
  // the final location (data/products/types.ts) — typecheck works pre- and post-move.
  return `import type { UnifiedProductSeed } from '../../types'

// Generated by migrate-* — review before moving to data/products/${headerNote}
// Steps:
//   1. Fill kind/unit TODOs
//   2. Fill tags (slugs from data/tags/ only — never invent)
//   3. Fill keyIngredients (slugs from INGREDIENT_SLUGS only — never invent)
//   4. Move to: data/products/{category}/${brandSlug}/
//   5. Register in domain index

export const ${brandConst}_${exportSuffix}: UnifiedProductSeed[] = [
${blocks},
]
`
}

// ─── Existing slug index ────────────────────────────────────────────────────

const SLUG_RE = /\bslug:\s*['"]([^'"]+)['"]/g

/**
 * Scan all `*.seed.ts` under {productsDir} and return slug → relative path.
 * Used to detect which scrapped products already exist in the seed (action=enrich).
 */
export async function loadExistingSlugs(productsDir: string): Promise<Map<string, string>> {
  const result = new Map<string, string>()
  const glob = new Bun.Glob('**/*.seed.ts')

  for await (const rel of glob.scan({ cwd: productsDir })) {
    const absPath = join(productsDir, rel)
    const text = readFileSync(absPath, 'utf-8')
    for (const m of text.matchAll(SLUG_RE)) {
      result.set(m[1], rel)
    }
  }
  return result
}
