import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const MUSC_INTIME_SEED: UnifiedProductSeed[] = [
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
      'https://aurore-cdn.b-cdn.net/products/musc-intime-rituel-douceur-rose-mystik-deo-douche-et-lait-corps.webp',
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
  {
    slug: 'musc-intime-rituel-douceur-rose-mystik-deo-douche-200ml-et-lait-corps-200ml-303834',
    name: 'Musc Intime Rituel douceur Rose Mystik Déo douche 200ml et Lait corps 200ml',
    brand: 'Musc Intime',
    kind: 'deodorant',
    unit: 'aerosol',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 3298,
    description: '',
    notes: '',
    inci: 'Musc Intime Rose Mystik - Deo Douche 3 en 1 - 200ml : AQUA/WATER/EAU, SODIUM LAURETH SULFATE, PARFUM/FRAGRANCE, COCO-BETAINE, ISOPENTANE, PEG-7 GLYCERYL COCOATE, PEG-120 METHYL GLUCOSE DIOLEATE, ISOBUTANE, 1,2-HEXANEDIOL, PROPANEDIOL, ETHYLHEXYLGLYCERIN, DIMETHYL PHENYLPROPANOL, PENTYLENE GLYCOL, GLYCERYL CAPRYLATE, LACTIC ACID, LACTOCOCCUS FERMENT EXTRACT, DECYL GLUCOSIDE, TOCOPHEROL​ Musc Intime Rose Mystik - Lait Corps en spray 200ml : AQUA, GLYCERIN, ISOPROPYL MYRISTATE, PARFUM, CETEARYL GLUCOSIDE, ZEA MAYS (CORN) STARCH, SORBITAN OLIVATE, MICROCRYSTALLINE CELLULOSE, BUTYROSPERMUM PARKII BUTTER, PHENOXYETHANOL, CETEARYL ALCOHOL, ALOE BARBADENSIS LEAF JUICE POWDER, ETHYLHEXYLGLYCERIN, SCLEROTIUM GUM, XANTHAN GUM, CELLULOSE GUM, CITRIC ACID, ALPHA-ISOMETHYL IONONE, COUMARIN, GERANIOL​',
    url: 'https://www.atida.fr/musc-intime-rituel-douceur-rose-mystik-deo-douche-200ml-et-lait-corps-200ml.html',
    imageUrl:
      'https://aurore-cdn.b-cdn.net/products/musc-intime-rituel-douceur-rose-mystik-deo-douche-200ml-et-lait-corps-200ml-303834.webp',
    tags: {
      primary: [TAG_SLUGS.EXFOLIATION, TAG_SLUGS.APAISANT, TAG_SLUGS.ANTI_OXYDANT],
      secondary: [
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.KERATOLYTIQUE,
        TAG_SLUGS.REPARATEUR,
        TAG_SLUGS.DEODORANT,
        TAG_SLUGS.EXFOLIANT_CHIMIQUE,
      ],
      avoid: [],
    },
    keyIngredients: [],
  },
]
