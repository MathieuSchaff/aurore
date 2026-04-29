import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const EUCERIN_HAIRCARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'eucerin-dermo-capillaire-shampoing-calmant-5-uree-cuir-chevelu-irrite',
    name: 'Dermo Capillaire Shampoing Calmant 5% Urée Cuir Chevelu Irrité',
    brand: 'Eucerin',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 250,
    amountUnit: 'ml',
    priceCents: 950,
    description: '',
    notes: '',
    inci: 'ACIDE LACTIQUE, COCO-GLUCOSIDE, COCOAMPHOACÉTATE DE SODIUM, GLUCOSIDE DÉCYLIQUE, OLÉATE GLYCÉRYLIQUE, PALMATE GLYCÉRYLIQUE HYDROGÉNÉ PEG-200, PANTHÉNOL, POLYQUATERNIUM-10, SALICYLATE DE SODIUM, SODIUM BENZOATE, SULFATE DE MYRETH SODIQUE, URÉE',
    url: 'https://www.atida.fr/eucerin-dermo-capillaire-shampooing-calmant-5-uree-250ml.html',
    imageUrl:
      'https://assets.atida.com/transform/89f9e4ed-baa2-41d6-8a22-336340d04b5d/Eucerin-Dermo-Capillaire-Shampoing-Calmant-5-Uree-Cuir-Chevelu-Irrite-250ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.PANTHENOL }],
  },
  {
    slug: 'eucerin-dermo-capillaire-soin-calmant-traitant-cuir-chevelu-irrite',
    name: 'Dermo Capillaire Soin Calmant Traitant Cuir Chevelu Irrité',
    brand: 'Eucerin',
    kind: 'hair-serum',
    unit: 'bottle',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 1275,
    description: '',
    notes: '',
    inci: 'AQUA, UREE, METHYLPROPANEDIOL, SODIUM LACTATE, LAURETH-9, GLYCYRRHIZA INFLATA ROOT EXTRACT, GLYCERINE, LACTIC ACID, ARGININE HCL, HYDROXYETHYLCELLULOSE, PEG-40 HYDROGENATED CASTOR OIL, CETRIMONIUM CHLORIDE, PHENOXYETHANOL',
    url: 'https://www.atida.fr/eucerin-dermo-capillaire-soin-calmant-traitant-5-uree-100ml.html',
    imageUrl:
      'https://assets.atida.com/transform/07aca02e-35c4-42f1-81b1-0be7f87dab13/Eucerin-Dermo-Capillaire-Soin-Calmant-Traitant-Cuir-Chevelu-Irrite-100ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['serum-capillaire'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SODIUM_LACTATE },
      { slug: INGREDIENT_SLUGS.LICOCHALCONE_A },
      { slug: INGREDIENT_SLUGS.LACTIC_ACID },
      { slug: INGREDIENT_SLUGS.CETRIMONIUM_CHLORIDE },
    ],
  },
  {
    slug: 'eucerin-dermo-capillaire-shampoing-haute-tolerance-extra-doux',
    name: 'Dermo Capillaire Shampoing Haute Tolérance Extra-doux',
    brand: 'Eucerin',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 250,
    amountUnit: 'ml',
    priceCents: 794,
    description: '',
    notes: '',
    inci: 'AQUA, DECYL GLUCOSIDE, SODIUM MYRETH SULFATE, PEG-80 SORBITAN LAURATE, PEG-200 HYDROGENATED GLYCERYL PALMATE, DISODIUM PEG-5 LAURYLCITRATE SULFOSUCCINATE, PEG-90 GLYCERYL ISOSTEARATE, BISABOLOL, POLYQUATERNIUM-10, CITRIC ACID, LAURETH-2, SODIUM LAURETH SULFATE, SODIUM BENZOATE, SODIUM SALICYLATE',
    url: 'https://www.atida.fr/eucerin-dermo-capillaire-shampooing-haute-tolerance-250ml.html',
    imageUrl:
      'https://assets.atida.com/transform/d7a881f0-8946-4c60-a650-840d5d0c4789/Eucerin-Dermo-Capillaire-Shampoing-Haute-Tolerance-Extra-Doux-250ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['shampooing'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.BISABOLOL }, { slug: INGREDIENT_SLUGS.SLES_HAIR }],
  },
]
