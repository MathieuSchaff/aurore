import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const MKL_GREEN_NATURE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'mkl-green-nature-gel-douche-surgras-lait-d-anesse-bio',
    name: "Gel Douche Surgras Lait D'ânesse Bio",
    brand: 'MKL Green Nature',
    kind: 'body-wash',
    unit: 'bottle',
    totalAmount: 1,
    amountUnit: 'l',
    priceCents: 639,
    description: '',
    notes: '',
    inci: 'AQUA, COCO-GLUCOSIDE, SODIUM COCO-SULFATE, COCO-BETAINE, DONKEY MILK*, ALOE BARBADENSIS LEAF JUICE POWDER*, ARGAN OIL POLYGLYCERYL-6 ESTERS**, GLYCERIN, GLYCERYL OLEATE, PARFUM, CITRIC ACID, SODIUM BENZOATE, SODIUM GLUCONATE, POTASSIUM SORBATE',
    url: 'https://www.atida.fr/mkl-green-nature-gel-douche-surgras-lait-d-anesse-bio-1l.html',
    imageUrl:
      'https://assets.atida.com/transform/17ca2df2-f8db-410b-ae03-3d7f73cebf2b/MKL-Green-Nature-Gel-Douche-Surgras-Lait-d-Anesse-Bio-1L?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['apaisant', 'hydratation'],
      secondary: ['nettoyant-corps', 'zone-corps'],
      avoid: [],
    },
  },
  {
    slug: 'mkl-green-nature-cosm-ethik-gel-douche-monoi-de-tahiti',
    name: "Cosm'ethik Gel Douche Monoï De Tahiti",
    brand: 'MKL Green Nature',
    kind: 'body-wash',
    unit: 'bottle',
    totalAmount: 1,
    amountUnit: 'l',
    priceCents: 585,
    description: '',
    notes: '',
    inci: 'AQUA (WATER), SODIUM LAURETH SULFATE, COCAMIDE DEA, COCAMIDOPROPYL, BETAINE, GLYCERIN, HYDROLIZED WHEAT PROTEIN, POLYQUATERNIUM-22, TOCOPHEROL, GARDENIA TAHITENSIS FLOWER EXTRACT, SODIUM CHLORIDE, PARFUM (FRAGRANCE), BENZYL ALCOHOL, SODIUM BENZOATE, COCOS NUCIFERA (COCONUT) OIL, POTASSIUM SORBATE, CITRIC ACID, BENZOPHENONE-4, BENZYL SALICYLATE, GERANIOL, LINALOOL, CI 19140, CI 15985',
    url: 'https://www.atida.fr/mkl-green-nature-gel-douche-monoi-de-tahiti-1l.html',
    imageUrl:
      'https://assets.atida.com/transform/7bdacbd0-e44c-4679-bdec-762f0066c697/MKL-Green-Nature-Cosm-Ethik-Gel-Douche-Monoi-de-Tahiti-1L?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['hydratation', 'anti-oxydant'],
      secondary: ['reparateur', 'nettoyant-corps', 'zone-corps'],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.BETAINE }, { slug: INGREDIENT_SLUGS.HUILE_DE_COCO }],
  },
]
