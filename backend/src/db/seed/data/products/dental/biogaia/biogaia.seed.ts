import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const BIOGAIA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'biogaia-prodentis-arome-menthe-30-pastilles-a-sucer-248102',
    name: 'BioGaia® Prodentis® arome Menthe 30 pastilles à sucer',
    brand: 'BioGaia',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 0,
    amountUnit: '',
    priceCents: 1406,
    description: '',
    notes: '',
    inci: "L. reuteri Prodentis® (L. reuteri DSM 17938 et L. reuteri ATCC PTA 5289)\nAgent de charge (isomalt), édulcorant (xylitol*), arôme Menthe.\nChaque comprimé contient au minimum 200 millions d'UFC* de L. reuteri Prodentis®vivants.\n*Unité Formant Colonie",
    url: 'https://www.atida.fr/biogaia-prodentis-pastilles-probiotiques-menthe-30-pastilles.html',
    imageUrl:
      'https://assets.atida.com/transform/c747eeec-097e-4d97-b50d-1be1297a139d/Generated-image?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.DENTIFRICE],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: 'xylitol-dental' }],
  },
]
