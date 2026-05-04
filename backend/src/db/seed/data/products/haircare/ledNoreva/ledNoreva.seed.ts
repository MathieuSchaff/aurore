import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const LED_NOREVA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'noreva-psoriane-shampoing-quotidien-apaisant-125ml-278707',
    name: 'Noreva Psoriane Shampoing Quotidien Apaisant 125ml',
    brand: 'LED NOREVA',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 125,
    amountUnit: 'ml',
    priceCents: 1100,
    description: '',
    notes: '',
    inci: 'Aqua (Water), Propylene Glycol, Sodium Laureth Sulfate, Decyl Glucoside, Ceteareth-60 Myristyl Glycol, Sodium Cocoamphoacetate, Glycolic Acid, Sodium Hydroxide, Salicylic Acid, PEG/PPG-22/24 Dimethicone, Sodium Chloride, Piroctone Olamine, Laureth-2, Parfum (Fragrance), Oxirane, Citric Acid, Dipotassium Glycyrrhizate, Sodium Sulfate.',
    url: 'https://www.atida.fr/noreva-psoriane-shampooing-apaisant-125ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/noreva-psoriane-shampoing-quotidien-apaisant-125ml-278707.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [
        HAIRCARE_PRODUCT_TAG_SLUGS.CUIR_CHEVELU_IRRITE,
        HAIRCARE_PRODUCT_TAG_SLUGS.PELLICULES,
        HAIRCARE_PRODUCT_TAG_SLUGS.LAVAGE,
        HAIRCARE_PRODUCT_TAG_SLUGS.TRAITEMENT_CUIR_CHEVELU,
      ],
      avoid: [],
    },
    keyIngredients: [{ slug: 'salicylic-acid-hair' }, { slug: 'piroctone-olamine' }],
  },
  {
    slug: 'noreva-psoriane-shampoing-intensif-apaisant-125ml-263640',
    name: 'Noreva Psoriane Shampoing Intensif Apaisant 125ml',
    brand: 'LED NOREVA',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 125,
    amountUnit: 'ml',
    priceCents: 1454,
    description: '',
    notes: '',
    inci: 'Aqua (water), sodium trideceth sulfate, vitis vinifera (grape) seed oil, sodium chloride, sodium lauroamphoacetate, prunus amygdalus dulcis (sweet almond) oil, myristyl lactate, salicylic acid, cocamide mea, undecylenamidopropyl betaine, citric acid, sodium hydroxide, di-ppg-2 myreth-10 adipate, parfum (fragrance), hydroxypropyl guar, dipropylene glycol, oleyl alcohol, guar hydroxypropyltrimonium chloride, tetrasodium edta, zanthoxylum bungeanum fruit extract, boswellia serrata gum, tocopheryl acetate, alpha-isomethyl ionone, limonene, hydroxycitronellal, silanediol salicylate, linalool, limonene, tocopherol, methyl eugenol',
    url: 'https://www.atida.fr/noreva-psoriane-shampooing-intensif-apaisant-125ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/noreva-psoriane-shampoing-intensif-apaisant-125ml-263640.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING],
      secondary: [
        HAIRCARE_PRODUCT_TAG_SLUGS.CUIR_CHEVELU_IRRITE,
        HAIRCARE_PRODUCT_TAG_SLUGS.PELLICULES,
        HAIRCARE_PRODUCT_TAG_SLUGS.LAVAGE,
        HAIRCARE_PRODUCT_TAG_SLUGS.TRAITEMENT_CUIR_CHEVELU,
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: 'salicylic-acid-hair' },
      { slug: 'almond-oil-hair' },
      { slug: 'guar-hydroxypropyltrimonium-chloride' },
      { slug: 'tetrasodium-edta' },
      { slug: 'tocopherol-hair' },
    ],
  },
  {
    slug: 'noreva-sebodiane-ds-serum-lp-seboregulateur-8ml-259742',
    name: 'Noreva Sebodiane DS Sérum LP Séborégulateur 8ml',
    brand: 'LED NOREVA',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 8,
    amountUnit: 'ml',
    priceCents: 1248,
    description: '',
    notes: '',
    inci: 'Caprylic/Capric Triglyceride • Isopropylidene Glycerol • Alcohol • Linoleic Acid • Phytosphingosine HCl • Tocopheryl Acetate • BHT.',
    url: 'https://www.atida.fr/noreva-sebodiane-ds-serum-lp-seboregulateur-8ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/noreva-sebodiane-ds-serum-lp-seboregulateur-8ml-259742.webp',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.SERUM_CAPILLAIRE],
      secondary: [
        HAIRCARE_PRODUCT_TAG_SLUGS.RACINES_GRASSES,
        HAIRCARE_PRODUCT_TAG_SLUGS.CHEVEUX_GRAS,
        HAIRCARE_PRODUCT_TAG_SLUGS.TRAITEMENT_CUIR_CHEVELU,
      ],
      avoid: [],
    },
    keyIngredients: [{ slug: 'linoleic-acid-hair' }, { slug: 'phytosphingosine-hair' }],
  },
]
