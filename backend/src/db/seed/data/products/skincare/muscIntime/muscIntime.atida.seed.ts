import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const MUSC_INTIME_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'musc-intime-rituel-douceur-rose-mystik-deo-douche-et-lait-corps',
    name: 'Rituel Douceur Rose Mystik Déo Douche',
    brand: 'Musc Intime',
    kind: 'body-wash',
    unit: 'bottle',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 3298,
    description: '',
    notes: '',
    inci: 'MUSC INTIME ROSE MYSTIK - DEO DOUCHE 3 EN 1 - 200ML : AQUA/WATER/EAU, SODIUM LAURETH SULFATE, PARFUM/FRAGRANCE, COCO-BETAINE, ISOPENTANE, PEG-7 GLYCERYL COCOATE, PEG-120 METHYL GLUCOSE DIOLEATE, ISOBUTANE, 1,2-HEXANEDIOL, PROPANEDIOL, ETHYLHEXYLGLYCERIN, DIMETHYL PHENYLPROPANOL, PENTYLENE GLYCOL, GLYCERYL CAPRYLATE, LACTIC ACID, LACTOCOCCUS FERMENT EXTRACT, DECYL GLUCOSIDE, TOCOPHEROL​ MUSC INTIME ROSE MYSTIK - LAIT CORPS EN SPRAY 200ML : AQUA, GLYCERIN, ISOPROPYL MYRISTATE, PARFUM, CETEARYL GLUCOSIDE, ZEA MAYS (CORN) STARCH, SORBITAN OLIVATE, MICROCRYSTALLINE CELLULOSE, BUTYROSPERMUM PARKII BUTTER, PHENOXYETHANOL, CETEARYL ALCOHOL, ALOE BARBADENSIS LEAF JUICE POWDER, ETHYLHEXYLGLYCERIN, SCLEROTIUM GUM, XANTHAN GUM, CELLULOSE GUM, CITRIC ACID, ALPHA-ISOMETHYL IONONE, COUMARIN, GERANIOL​',
    url: 'https://www.atida.fr/musc-intime-rituel-douceur-rose-mystik-deo-douche-200ml-et-lait-corps-200ml.html',
    imageUrl:
      'https://assets.atida.com/transform/e7e6d8f8-41f9-4415-b4f6-40312957c0f4/Generated-image?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['hydratation', 'apaisant', 'anti-oxydant'],
      secondary: ['reparateur', 'nettoyant-corps', 'zone-corps'],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PROPANEDIOL },
      { slug: INGREDIENT_SLUGS.GLYCERYL_CAPRYLATE_CAPRATE },
      { slug: INGREDIENT_SLUGS.LACTIC_ACID },
      { slug: INGREDIENT_SLUGS.ZEA_MAYS_STARCH },
      { slug: INGREDIENT_SLUGS.SHEA_BUTTER },
    ],
  },
]
