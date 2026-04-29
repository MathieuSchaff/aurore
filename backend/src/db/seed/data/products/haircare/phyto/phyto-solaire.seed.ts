import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const PHYTO_SOLAIRE_SEED: UnifiedProductSeed[] = [
  {
    slug: 'phyto-reparation-spray-thermo-protecteur-230-anti-casse',
    name: 'Réparation Spray Thermo-Protecteur 230° Anti-Casse',
    brand: 'Phyto',
    kind: 'sunscreen',
    unit: 'spray',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 1212,
    description: '',
    notes: '',
    inci: 'AQUA / WATER / EAU, PROPANEDIOL, ISODECYL NEOPENTANOATE, CETEARYL ALCOHOL, DISTEAROYLETHYL DIMONIUM CHLORIDE, POLYQUATERNIUM-37, PARFUM / FRAGRANCE, PANTHENOL, CHLORPHENESIN, MALTODEXTRIN, BEHENTRIMONIUM CHLORIDE, GLYCERIN, SODIUM BENZOATE, CITRIC ACID, ALTHAEA OFFICINALIS ROOT EXTRACT, HYDROLYZED LUPINE PROTEIN, AVENA STRIGOSA SEED EXTRACT, CAESALPINIA SPINOSA FRUIT EXTRACT, LECITHIN, HELIANTHUS ANNUUS (SUNFLOWER) SPROUT EXTRACT, POTASSIUM SORBATE, 4143A',
    url: 'https://www.atida.fr/phyto-reparation-spray-thermo-protecteur-230-anti-casse-150ml.html',
    imageUrl:
      'https://assets.atida.com/transform/dafc1bb3-7806-4167-9172-7ccb33aedfd2/Phyto-Reparation-Spray-Thermo-Protecteur-230-Anti-Casse-150ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['apaisant', 'barriere-cutanee', 'hydratation', 'cicatrisation'],
      secondary: ['reparateur', 'creme-solaire', 'protection-solaire', 'matin', 'zone-visage'],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PROPANEDIOL },
      { slug: INGREDIENT_SLUGS.PANTHENOL },
      { slug: INGREDIENT_SLUGS.HYDROLYZED_LUPINE_PROTEIN },
    ],
  },
]
