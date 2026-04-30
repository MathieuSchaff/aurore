import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const EUCERIN_HAIRCARE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'eucerin-dermo-capillaire-calmant-soin-trait',
    name: 'Dermo Capillaire Calmant Soin Trait',
    brand: 'Eucerin',
    kind: 'conditioner',
    unit: 'bottle',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 1252,
    description:
      "Le soin traitant calmant Dermo Capillaire d'EUCERIN dans votre parapharmacie en ligne à prix discount, s’utilise en complément des traitements contre le psoriasis pour protéger et apaiser les cuirs chevelus secs et qui ont des démangeaisons. Il peut s’utiliser chez les enfants de plus de 3 ans.\n\nIl protège des agressions extérieures avec ses propriétés anti oxydantes, hydrate intensément le cuir chevelu et diminue les irritations en calmant rapidement grâce au Licochalcone A, à l’Urée, à l’Acide Lactique ainsi qu’au Poldocanol. Sa texture non collante en fait un soin agréable. Après le soin, les cheveux retrouvent brillance et souplesse, le cuir chevelu est calme.",
    notes: '',
    inci: 'AQUA, UREA, METHYLPROPANEDIOL, SODIUM LACTATE, LAURETH-9, GLYCYRRHIZA INFLATA ROOT EXTRACT, GLYCERIN, LACTID ACID, ARGININE HCL, HYDROXYETHYLCELLULOSE, PEG-40 HYDROGENATED CASTOR OIL, CETRIMONIUM CHLORIDE, PHENOXYETHANOL',
    url: 'https://www.pharmashopdiscount.com/fr/beaute/eucerin/eucerin-dermo-capillaire-calmant-soin-trait-100ml.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/eucerin-dermo-capillaire-calmant-soin-trait.webp',
    tags: {
      primary: ['apres-shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.UREA },
      { slug: INGREDIENT_SLUGS.SODIUM_LACTATE },
      { slug: INGREDIENT_SLUGS.LICOCHALCONE_A },
      { slug: INGREDIENT_SLUGS.CETRIMONIUM_CHLORIDE },
    ],
  },
  {
    slug: 'eucerin-dermo-capillaire-shampooing',
    name: 'Dermo Capillaire Shampooing',
    brand: 'Eucerin',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 250,
    amountUnit: 'ml',
    priceCents: 790,
    description:
      'Le shampooing Haute Tolérance Dermo Capillaire d’EUCERIN à prix discount dans votre parapharmacie en ligne, s’utilise tous les jours pour protéger et apaiser les cuirs chevelus hypersensibles à problèmes et irrités.\n\nLa gamme DermoCapillaire du laboratoire EUCERIN est composée de soins et shampooings destinés aux cuirs chevelus sensibles et/ou irrités pour soulager les inconforts et redonner toute la beauté aux cheveux. Le shampooing Haute Tolérance d’EUCERIN sans savon alcaline aux agents nettoyants très doux pour nettoyer tout en douceur les cheveux, prend soin du cuir chevelu hypersensible et irrité. Il élimine toutes les impuretés, protège de la sècheresse et des irritations, diminue les échauffements et tiraillement du cuir chevelu, et apaise des démangeaisons et irritations, grâce au bisabolol apaisant. Après le shampooing, les cheveux retrouvent brillance et souplesse, et sont facile à coiffer. Jour après jour, le cuir chevelu est sain et retrouve son équilibre. Sans savon alcalin, sans parfum.',
    notes: '',
    inci: 'AQUA, DECYL GLUCOSIDE, SODIUM MYRETH SULFATE, PEG-80 SORBITAN LAURATE, PEG-200 HYDROGENATED GLYCERYL PALMATE, DISODIUM PEG-5 LAURYLCITRATE SULFOSUCCINATE, PEG-90 GLYCERYL ISOSTEARATE; BISABOLOL, POLYQUATERNIUM-10, CITRIC ACID, LAURETH-2, SIODIUM LAURETH SULFATE, SODIUM BENZOATE, SODIUM SALICYLATE',
    url: 'https://www.pharmashopdiscount.com/fr/beaute/eucerin/soins-corps/eucerin-dermo-capillaire-shampooing-250ml.html',
    imageUrl: 'https://aurore-cdn.b-cdn.net/products/eucerin-dermo-capillaire-shampooing.webp',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.BISABOLOL }],
  },
]
