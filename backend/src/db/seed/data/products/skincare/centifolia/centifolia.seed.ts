import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const CENTIFOLIA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'centifolia-neutre-gel-moussant-3-en-1-bio-5l-284471',
    name: 'Centifolia Neutre Gel Moussant 3 en 1 Bio 5L',
    brand: 'Centifolia',
    kind: 'cleanser',
    unit: 'pump',
    totalAmount: 5,
    amountUnit: 'l',
    priceCents: 5699,
    description: '',
    notes: '',
    inci: "Aqua, lauryl glucoside, coco-betaine, sodium chloride, coco-glucoside, aloe barbadensis leaf juice powder*, alpha-glucan oligosaccharide, disodium cocoyl glutamate, sodium cocoyl glutamate, propanediol, rhamnose, glucose, glucuronic acid, citric acid, sodium benzoate.\n*ingrédients issus de l'agriculture biologique.",
    url: 'https://www.atida.fr/centifolia-gel-lavant-neutre-3en1-5l.html',
    imageUrl:
      'https://assets.atida.com/transform/30b128a0-b89a-428f-b70c-bc625c7c6817/Centifolia-Neutre-Gel-Moussant-3-en-1-Bio-5L?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.APAISANT, TAG_SLUGS.HYDRATATION],
      secondary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.DOUBLE_NETTOYAGE_2, TAG_SLUGS.ZONE_VISAGE],
      avoid: [],
    },
    keyIngredients: [],
  },
]
