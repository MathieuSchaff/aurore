import { TAG_SLUGS } from '../../../data/tags'
import { INGREDIENT_SLUGS } from '../../../data/ingredients/ingredient-slugs'
import type { UnifiedProductSeed } from '../types'

export const ADERMA_SEED: UnifiedProductSeed[] = [
  // ... (A-Derma seed data)
]

export const AESTURA_SEED: UnifiedProductSeed[] = [
  // ── CLEANSERS ───────────────────────────────────────────────────────────────

  {
    slug: 'aestura-atobarrier-365-bubble-cleanser-160-ml',
    name: 'Atobarrier 365 Bubble Cleanser',
    brand: 'Aestura',
    kind: 'cleanser',
    unit: 'bottle',
    totalAmount: 160,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Nettoyant mousse doux en format pompe moussante pour minimiser les frottements et apaiser les peaux sensibles lors du nettoyage.`,
    notes: `Threonine + Arginine + Glycérine + Serine — Idéal pour peaux sèches et sensibles. pH équilibré pour respecter la barrière cutanée.`,
    inci: '1,2-HEXANEDIOL, ARGININE, ASPARTIC ACID, BUTYLENE GLYCOL, COCAMIDOPROPYL BETAINE, DISODIUM EDTA, ETHYLHEXYLGLYCERIN, GLYCERIN, GLUTAMIC ACID, POTASSIUM COCOYL GLYCINATE, SODIUM COCOYL ALANINATE, SODIUM HYALURONATE, WATER',
    url: 'https://www.skinsafeproducts.com/aestura-atobarrier-365-bubble-cleanser-160-ml',
    imageUrl: 'https://cdn1.skinsafeproducts.com/photo/C0912EA499D1FA/large_1744621021.png?1744621021',
    tags: {
      primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.PEAU_SENSIBLE],
      secondary: [TAG_SLUGS.MOUSSE_NETTOYANTE, TAG_SLUGS.MATIN, TAG_SLUGS.SOIR, TAG_SLUGS.ZONE_VISAGE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.ARGININE, notes: 'Acide aminé hydratant et réparateur',},
      { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE, notes: 'Hydratant en profondeur',},
    ],
  },

  // ── TONERS & MISTS ──────────────────────────────────────────────────────────

  {
    slug: 'aestura-atobarrier-365-moisturizing-cream-mist-120-ml',
    name: 'Atobarrier 365 Moisturizing Cream Mist',
    brand: 'Aestura',
    kind: 'mist',
    unit: 'bottle',
    totalAmount: 120,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Brume crème hydratante en format spray qui enveloppe la peau d'un film protecteur et nourrissant.`,
    notes: `Cholestérol + Caprylic/Capric Triglyceride + Glycérine + Tocophérol — Idéal pour peaux sèches nécessitant une hydratation légère tout au long de la journée.`,
    inci: '1,2-HEXANEDIOL, BEHENIC ACID, BUTYLENE GLYCOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, CETYL ETHYLHEXANOATE, CHOLESTEROL, DIMETHICONE, DISODIUM EDTA, ETHYLHEXYLGLYCERIN, GLYCERIN, GLYCERYL CAPRYLATE, HYDROGENATED POLY(C6-14 OLEFIN), HYDROXYPROPYL BISLAURAMIDE MEA, SODIUM SURFACTIN, TOCOPHEROL, WATER',
    url: 'https://www.skinsafeproducts.com/aestura-atobarrier-365-moisturizing-cream-mist-120-ml',
    imageUrl: 'https://cdn1.skinsafeproducts.com/photo/86334E0D400606/large_1744620698.png?1744620698',
    tags: {
      primary: [TAG_SLUGS.HYDRATATION, TAG_SLUGS.PEAU_SECHE],
      secondary: [TAG_SLUGS.BRUME, TAG_SLUGS.MATIN, TAG_SLUGS.ZONE_VISAGE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.CHOLESTEROL, notes: 'Lipide essentiel pour la barrière cutanée',},
      { slug: INGREDIENT_SLUGS.CAPRYLIC_CAPRIC_TRIGLYCERIDE, notes: 'Émollient léger et efficace',},
    ],
  },

  // ── MOISTURIZERS ────────────────────────────────────────────────────────────

  {
    slug: 'aestura-atobarrier-365-cream-80-ml',
    name: 'Atobarrier 365 Cream',
    brand: 'Aestura',
    kind: 'moisturizer',
    unit: 'tube',
    totalAmount: 80,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Crème hydratante intensive pour peaux très sèches et sensibles, formulée pour renforcer durablement la barrière cutanée.`,
    notes: `Allantoin + Glycérine + Tocophérol — Idéal pour peaux très sèches souffrant de tiraillements chroniques.`,
    inci: '1,2-HEXANEDIOL, ALLANTOIN, ARACHIDIC ACID, BEHENIC ACID, BUTYLENE GLYCOL, C12-20 ALKYL GLUCOSIDE, C14-22 ALCOHOLS, CAPRYLIC/CAPRIC TRIGLYCERIDE, CHOLESTEROL, CYCLOPENTASILOXANE, DIMETHICONE, DIMETHICONOL, DISODIUM EDTA, ETHYLHEXYLGLYCERIN, GLYCERIN, GLYCERYL CAPRYLATE, HYDROGENATED POLY(C6-14 OLEFIN), HYDROXYPROPYL BISLAURAMIDE MEA, MANNITOL, MYRISTIC ACID, OLEIC ACID, PALMITIC ACID, PHENOXYETHANOL, POLYACRYLATE-13, POLYISOBUTENE, POLYSORBATE 20, SORBITAN ISOSTEARATE, STEARIC ACID, TOCOPHEROL, WATER',
    url: 'https://www.skinsafeproducts.com/aestura-atobarrier-365-cream-80-ml',
    imageUrl: 'https://cdn1.skinsafeproducts.com/photo/D56D38670C8A4B/large_1744620573.png?1744620573',
    tags: {
      primary: [TAG_SLUGS.HYDRATATION, TAG_SLUGS.PEAU_TRES_SECHE],
      secondary: [TAG_SLUGS.TEXTURE_RICHE, TAG_SLUGS.MATIN, TAG_SLUGS.SOIR, TAG_SLUGS.ZONE_VISAGE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.ALLANTOIN, notes: 'Apaisant et régénérant',},
      { slug: INGREDIENT_SLUGS.MANNITOL, notes: 'Hydratant protecteur',},
    ],
  },

  {
    slug: 'aestura-atobarrier-365-hydro-soothing-cream-60-ml',
    name: 'Atobarrier 365 Hydro Soothing Cream',
    brand: 'Aestura',
    kind: 'moisturizer',
    unit: 'tube',
    totalAmount: 60,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Crème hydratante apaisante à la texture légère, idéale pour hydrater les peaux mixtes à grasses sans laisser de fini gras.`,
    notes: `Arginine + Allantoin + Glycérine + Hyaluronate de Sodium — Parfait pour peaux déshydratées cherchant de la légèreté.`,
    inci: '1,2-HEXANEDIOL, ALLANTOIN, ARACHIDIC ACID, ARGININE, BEHENIC ACID, BUTYLENE GLYCOL, C12-20 ALKYL GLUCOSIDE, C14-22 ALCOHOLS, CAPRYLIC/CAPRIC TRIGLYCERIDE, CARBOMER, CETYL ETHYLHEXANOATE, CHOLESTEROL, DICAPRYLYL CARBONATE, DISODIUM EDTA, ETHYLHEXYLGLYCERIN, GLYCERIN, GLYCERYL CAPRYLATE, HYDROGENATED POLY(C6-14 OLEFIN), HYDROXYPROPYL BISLAURAMIDE MEA, MYRISTIC ACID, OLEIC ACID, PALMITIC ACID, PROPANEDIOL, SODIUM HYALURONATE, STEARIC ACID, TOCOPHEROL, WATER',
    url: 'https://www.skinsafeproducts.com/aestura-atobarrier-365-hydro-soothing-cream-60-ml',
    imageUrl: 'https://cdn1.skinsafeproducts.com/photo/29C74E08D1E6BB/large_1744620531.png?1744620531',
    tags: {
      primary: [TAG_SLUGS.HYDRATATION, TAG_SLUGS.PEAU_MIXTE],
      secondary: [TAG_SLUGS.TEXTURE_LEGERE, TAG_SLUGS.MATIN, TAG_SLUGS.SOIR, TAG_SLUGS.ZONE_VISAGE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.ALLANTOIN, notes: 'Apaisant et régénérant',},
      { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE, notes: 'Hydratant puissant',},
    ],
  },

  {
    slug: 'aestura-atobarrier-365-lotion-150-ml',
    name: 'Atobarrier 365 Lotion',
    brand: 'Aestura',
    kind: 'moisturizer',
    unit: 'bottle',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Lotion hydratante fluide pour le visage et le corps, idéale pour un usage quotidien sur peaux sèches et sensibles.`,
    notes: `Allantoin + Cholestérol + Glycérine + Tocophérol — Convient à toute la famille pour une barrière cutanée renforcée.`,
    inci: '1,2-HEXANEDIOL, ALLANTOIN, ARACHIDIC ACID, BEHENIC ACID, BUTYLENE GLYCOL, C12-20 ALKYL GLUCOSIDE, C14-22 ALCOHOLS, CAPRYLIC/CAPRIC TRIGLYCERIDE, CHOLESTEROL, CYCLOPENTASILOXANE, DIMETHICONE, DIMETHICONOL, DISODIUM EDTA, ETHYLHEXYLGLYCERIN, GLYCERIN, GLYCERYL CAPRYLATE, HYDROGENATED POLY(C6-14 OLEFIN), HYDROXYPROPYL BISLAURAMIDE MEA, MYRISTIC ACID, OLEIC ACID, PALMITIC ACID, PHENOXYETHANOL, POLYACRYLATE-13, POLYISOBUTENE, POLYSORBATE 20, SORBITAN ISOSTEARATE, STEARIC ACID, TOCOPHEROL, WATER',
    url: 'https://www.skinsafeproducts.com/aestura-atobarrier-365-lotion-150-ml',
    imageUrl: 'https://cdn1.skinsafeproducts.com/photo/82A6E999E15525/large_1744620478.png?1744620478',
    tags: {
      primary: [TAG_SLUGS.HYDRATATION, TAG_SLUGS.PEAU_SECHE],
      secondary: [TAG_SLUGS.LOTION_VISAGE, TAG_SLUGS.MATIN, TAG_SLUGS.SOIR, TAG_SLUGS.ZONE_VISAGE, TAG_SLUGS.ZONE_CORPS],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.ALLANTOIN, notes: 'Apaise et régénère',},
      { slug: INGREDIENT_SLUGS.CHOLESTEROL, notes: 'Renforce les lipides barrière',},
    ],
  },
]
