import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const SULWHASOO_SEED: UnifiedProductSeed[] = [
  // ── CLEANSERS ───────────────────────────────────────────────────────────────

  {
    slug: 'sulwhasoo-gentle-cleansing-oil-200ml',
    name: 'Gentle Cleansing Oil',
    brand: 'Sulwhasoo',
    kind: 'cleanser',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 4500,
    description: `Huile démaquillante luxueuse qui dissout en douceur le maquillage et les impuretés tout en laissant la peau fraîche et hydratée.`,
    notes: `Contient de l'huile de pépins de Coix Lacryma-Jobi et de l'extrait d'écorce de mandarine. Texture légère, fini non gras.`,
    inci: 'ISOPROPYL PALMITATE, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, SORBETH-30 TETRAOLEATE, CAPRYLIC/CAPRIC TRIGLYCERIDE, CETYL ETHYLHEXANOATE, COIX LACRYMA-JOBI MA-YUEN SEED OIL, CARTHAMUS TINCTORIUS (SAFFLOWER) SEED OIL, PRUNUS ARMENIACA (APRICOT) KERNEL OIL, PINUS KORAIENSIS SEED OIL, SESAMUM INDICUM (SESAME) SEED OIL, CAMELLIA JAPONICA SEED OIL, CITRUS UNSHIU PEEL EXTRACT, CASTANEA SATIVA (CHESTNUT) SHELL EXTRACT, SPIRODELA POLYRHIZA EXTRACT, PRUNUS MUME NUT EXTRACT, PRUNUS MUME FLOWER EXTRACT, SQUALANE, NELUMBO NUCIFERA GERM EXTRACT, REHMANNIA GLUTINOSA ROOT EXTRACT, PAEONIA ALBIFLORA ROOT EXTRACT, LILIUM CANDIDUM BULB EXTRACT, POLYGONATUM OFFICINALE RHIZOME/ROOT EXTRACT, NELUMBO NUCIFERA FLOWER EXTRACT, THEOBROMA CACAO (COCOA) EXTRACT, DEXTRIN, FRAGRANCE',
    url: 'https://www.sulwhasoo.com/int/en/products/gentle-cleansing-oil.html',
    tags: {
      primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.ANTI_AGE],
      secondary: [
        TAG_SLUGS.DOUBLE_NETTOYAGE_1,
        TAG_SLUGS.HUILE_DEMAQUILLANTE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.HUILE_GRAINES_TOURNESOL, notes: 'Base huileuse riche en oméga-6' },
      { slug: INGREDIENT_SLUGS.APRICOT_KERNEL_OIL, notes: 'Huile adoucissante et nourrissante' },
      { slug: INGREDIENT_SLUGS.SQUALANE, notes: 'Émollient stable protecteur' },
    ],
  },

  {
    slug: 'sulwhasoo-gentle-cleansing-foam-200ml',
    name: 'Gentle Cleansing Foam',
    brand: 'Sulwhasoo',
    kind: 'cleanser',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 3800,
    description: `Mousse nettoyante douce qui élimine les impuretés tout en maintenant l'hydratation de la peau grâce à sa formule riche en extraits botaniques.`,
    notes: `pH équilibré, mousse onctueuse, parfum signature herbal. Idéal pour un nettoyage quotidien respectueux.`,
    inci: 'WATER, POTASSIUM COCOYL GLYCINATE, DISODIUM COCOAMPHODIACETATE, COCAMIDOPROPYL BETAINE, ACRYLATES/BEHENETH-25 METHACRYLATE COPOLYMER, SODIUM CHLORIDE, SPIRODELA POLYRHIZA EXTRACT, CITRUS UNSHIU PEEL EXTRACT, CASTANEA SATIVA (CHESTNUT) SHELL EXTRACT, COIX LACRYMA-JOBI MA-YUEN SEED EXTRACT, REHMANNIA GLUTINOSA ROOT EXTRACT, PAEONIA ALBIFLORA ROOT EXTRACT, LILIUM CANDIDUM BULB EXTRACT, POLYGONATUM OFFICINALE RHIZOME/ROOT EXTRACT, NELUMBO NUCIFERA FLOWER EXTRACT, GLYCERIN, BUTYLENE GLYCOL, DISODIUM EDTA, POTASSIUM HYDROXIDE, MAGNESIUM NITRATE, METHYLCHLOROISOTHIAZOLINONE, MAGNESIUM CHLORIDE, METHYLISOTHIAZOLINONE, PHENOXYETHANOL, FRAGRANCE',
    url: 'https://www.sulwhasoo.com/int/en/products/gentle-cleansing-foam.html',
    tags: {
      primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.HYDRATATION],
      secondary: [
        TAG_SLUGS.DOUBLE_NETTOYAGE_2,
        TAG_SLUGS.MOUSSE_NETTOYANTE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.GLYCERIN, notes: 'Humectant essentiel' }],
  },

  // ── ESSENCES & SERUMS ───────────────────────────────────────────────────────

  {
    slug: 'sulwhasoo-first-care-activating-serum-60ml',
    name: 'First Care Activating Serum',
    brand: 'Sulwhasoo',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 60,
    amountUnit: 'ml',
    priceCents: 8500,
    description: `Sérum activateur de première étape, pilier de la routine Sulwhasoo, conçu pour booster l'absorption des soins suivants et améliorer l'éclat.`,
    notes: `JAUM Activating Care™ (mélange de 5 herbes précieuses). À utiliser immédiatement après le nettoyage.`,
    inci: 'WATER, BUTYLENE GLYCOL, GLYCERIN, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, SQUALANE, REHMANNIA GLUTINOSA ROOT EXTRACT, PAEONIA ALBIFLORA ROOT EXTRACT, LILIUM CANDIDUM BULB EXTRACT, POLYGONATUM OFFICINALE RHIZOME/ROOT EXTRACT, NELUMBO NUCIFERA FLOWER EXTRACT, JUGLANS REGIA (WALNUT) SEED EXTRACT, ZIZIPHUS JUJUBA FRUIT EXTRACT, GLYCYRRHIZA URALENSIS (LICORICE) ROOT EXTRACT, OPHIOPOGON JAPONICUS ROOT EXTRACT, CAMELLIA SINENSIS LEAF EXTRACT, BIOSACCHARIDE GUM-1, SODIUM HYALURONATE, BETA-GLUCAN, HONEY, TOCOPHEROL, ADENOSINE, ETHYLHEXYLGLYCERIN, PROPANEDIOL, 1,2-HEXANEDIOL, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, TROMETHAMINE, PEG-60 HYDROGENATED CASTOR OIL, DISODIUM EDTA, FRAGRANCE',
    url: 'https://www.sulwhasoo.com/int/en/products/first-care-activating-serum.html',
    tags: {
      primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.ANTI_AGE, TAG_SLUGS.HYDRATATION],
      secondary: [TAG_SLUGS.SERUM, TAG_SLUGS.MATIN, TAG_SLUGS.SOIR, TAG_SLUGS.ZONE_VISAGE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.ADENOSINE, notes: 'Actif anti-âge énergisant' },
      { slug: INGREDIENT_SLUGS.BETA_GLUCAN, notes: 'Apaisant et hydratant puissant' },
      { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE, notes: 'Hydratation profonde' },
      { slug: INGREDIENT_SLUGS.SQUALANE, notes: 'Protection barrière' },
    ],
  },

  {
    slug: 'sulwhasoo-concen-ginseng-renewing-serum-50ml',
    name: 'Concentrated Ginseng Renewing Serum',
    brand: 'Sulwhasoo',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 19000,
    description: `Sérum anti-âge puissant au Ginseng qui améliore visiblement la fermeté et l'élasticité de la peau grâce à sa technologie micro-capsules.`,
    notes: `Ginsenomics™ (concentré de saponines de ginseng). Fini soyeux, absorption rapide. Haut de gamme.`,
    inci: 'WATER, BUTYLENE GLYCOL, GLYCERIN, CETYL ETHYLHEXANOATE, METHYL GLUCETH-20, BEHENYL ALCOHOL, BETAINE, 1,2-HEXANEDIOL, NIACINAMIDE, PANAX GINSENG ROOT EXTRACT, PANAX GINSENG ROOT WATER, PANAX GINSENG FLOWER EXTRACT, ADENOSINE, SODIUM HYALURONATE, GLYCYRRHIZA URALENSIS (LICORICE) ROOT EXTRACT, REHMANNIA GLUTINOSA ROOT EXTRACT, PAEONIA ALBIFLORA ROOT EXTRACT, LILIUM CANDIDUM BULB EXTRACT, POLYGONATUM OFFICINALE RHIZOME/ROOT EXTRACT, NELUMBO NUCIFERA FLOWER EXTRACT, SQUALANE, HYDROGENATED LECITHIN, DIMETHICONE, TOCOPHEROL, ETHYLHEXYLGLYCERIN, DEXTRIN, THEOBROMA CACAO (COCOA) EXTRACT, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, TROMETHAMINE, DISODIUM EDTA, FRAGRANCE',
    url: 'https://www.sulwhasoo.com/int/en/products/concentrated-ginseng-renewing-serum.html',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE],
      secondary: [TAG_SLUGS.SERUM, TAG_SLUGS.MATIN, TAG_SLUGS.SOIR, TAG_SLUGS.ZONE_VISAGE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Barrière et éclat' },
      { slug: INGREDIENT_SLUGS.ADENOSINE, notes: 'Lutte contre les rides' },
      { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE, notes: 'Humectant' },
      { slug: INGREDIENT_SLUGS.SQUALANE, notes: 'Émollient' },
    ],
  },

  // ── MOISTURIZERS ────────────────────────────────────────────────────────────

  {
    slug: 'sulwhasoo-concen-ginseng-renewing-cream-60ml',
    name: 'Concentrated Ginseng Renewing Cream',
    brand: 'Sulwhasoo',
    kind: 'moisturizer',
    unit: 'jar',
    totalAmount: 60,
    amountUnit: 'ml',
    priceCents: 24000,
    description: `Crème anti-âge emblématique qui exploite la puissance du Ginseng pour revitaliser la peau et combattre les signes visibles du vieillissement.`,
    notes: `Texture riche et onctueuse. Parfum terreux de ginseng. Existe aussi en version 'Classic' (plus riche) et 'Soft' (plus légère).`,
    inci: 'WATER, GLYCERIN, SQUALANE, BUTYLENE GLYCOL, CYCLOPENTASILOXANE, TREHALOSE, LIMNANTHES ALBA (MEADOWFOAM) SEED OIL, GLYCERYL STEARATE, PHYTROSTERYL ISOSTEARYL DIMER DILINOLEATE, OCTYLDODECYL MYRISTATE, CYCLOHEXASILOXANE, PEG-40 STEARATE, PANAX GINSENG ROOT EXTRACT, ADENOSINE, SODIUM HYALURONATE, GLYCYRRHIZA URALENSIS (LICORICE) ROOT EXTRACT, REHMANNIA GLUTINOSA ROOT EXTRACT, PAEONIA ALBIFLORA ROOT EXTRACT, LILIUM CANDIDUM BULB EXTRACT, POLYGONATUM OFFICINALE RHIZOME/ROOT EXTRACT, NELUMBO NUCIFERA FLOWER EXTRACT, HYDROGENATED LECITHIN, STEARIC ACID, PALMITIC ACID, CETEARYL ALCOHOL, PROPANEDIOL, 1,2-HEXANEDIOL, DEXTRIN, THEOBROMA CACAO (COCOA) EXTRACT, ETHYLHEXYLGLYCERIN, DISODIUM EDTA, FRAGRANCE',
    url: 'https://www.sulwhasoo.com/int/en/products/concentrated-ginseng-renewing-cream.html',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.HYDRATATION],
      secondary: [TAG_SLUGS.TEXTURE_RICHE, TAG_SLUGS.MATIN, TAG_SLUGS.SOIR, TAG_SLUGS.ZONE_VISAGE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SQUALANE, notes: 'Nutrition intense' },
      { slug: INGREDIENT_SLUGS.TREHALOSE, notes: 'Protection contre la déshydratation' },
      { slug: INGREDIENT_SLUGS.ADENOSINE, notes: 'Réparation tissulaire' },
      { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE, notes: 'Hydratation' },
    ],
  },

  // ── MASKS ──────────────────────────────────────────────────────────────────

  {
    slug: 'sulwhasoo-overnight-vitalizing-mask-120ml',
    name: 'Overnight Vitalizing Mask',
    brand: 'Sulwhasoo',
    kind: 'mask',
    unit: 'tube',
    totalAmount: 120,
    amountUnit: 'ml',
    priceCents: 5200,
    description: `Masque de nuit revitalisant qui nourrit la peau pendant le sommeil pour révéler un teint éclatant et reposé au réveil.`,
    notes: `Nutritive Vermillion™ (mélange de jujube et grenade). À appliquer en dernière étape de la routine soir.`,
    inci: 'WATER, BUTYLENE GLYCOL, GLYCERIN, CETYL ETHYLHEXANOATE, SQUALANE, BUTYROSPERMUM PARKII (SHEA) BUTTER, DI-C12-13 ALKYL MALATE, CYCLOPENTASILOXANE, PANAX GINSENG ROOT EXTRACT, REHMANNIA GLUTINOSA ROOT EXTRACT, PAEONIA ALBIFLORA ROOT EXTRACT, LILIUM CANDIDUM BULB EXTRACT, POLYGONATUM OFFICINALE RHIZOME/ROOT EXTRACT, NELUMBO NUCIFERA FLOWER EXTRACT, JUGLANS REGIA (WALNUT) SEED EXTRACT, ZIZIPHUS JUJUBA FRUIT EXTRACT, PUNICA GRANATUM FRUIT EXTRACT, CAMELLIA SINENSIS LEAF EXTRACT, BIOSACCHARIDE GUM-1, SODIUM HYALURONATE, BETA-GLUCAN, TREHALOSE, ADENOSINE, ETHYLHEXYLGLYCERIN, PROPANEDIOL, 1,2-HEXANEDIOL, CYCLOHEXASILOXANE, GLYCERYL STEARATE, STEARIC ACID, PALMITIC ACID, CETEARYL ALCOHOL, PEG-100 STEARATE, PEG-40 STEARATE, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, TROMETHAMINE, DISODIUM EDTA, FRAGRANCE',
    url: 'https://www.sulwhasoo.com/int/en/products/overnight-vitalizing-mask.html',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.ECLAT, TAG_SLUGS.HYDRATATION],
      secondary: [
        TAG_SLUGS.SLEEPING_MASK,
        TAG_SLUGS.MASQUE_HEBDO,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SQUALANE, notes: `Émollient, scelle l'hydratation pendant la nuit` },
      { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE, notes: 'Hydratation réparatrice nocturne' },
      { slug: INGREDIENT_SLUGS.BETA_GLUCAN, notes: 'Apaisant et renforce la barrière' },
      {
        slug: INGREDIENT_SLUGS.TREHALOSE,
        notes: `Osmolyte protecteur, stabilise l'hydratation cellulaire`,
      },
    ],
  },
]
