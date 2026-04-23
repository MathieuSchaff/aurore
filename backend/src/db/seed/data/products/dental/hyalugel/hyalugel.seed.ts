import { TAG_SLUGS } from '../../../tags'
import type { UnifiedProductSeed } from '../../types'

export const HYALUGEL_SEED: UnifiedProductSeed[] = [
  {
    slug: 'hyalugel-gel-buccal-aphtes-petites-plaies-20ml-258888',
    name: 'Hyalugel Gel Buccal Aphtes Petites Plaies 20ml',
    brand: 'Hyalugel',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 0,
    amountUnit: '',
    priceCents: 969,
    description: '',
    notes: '',
    inci: "Composant principal : hyaluronate de sodium. Autres composants : eau, xylitol, carboxyméthylcellulose sodique, alcool, huile de ricin hydrogénée PEG40, alcool polyvinylique, carbomère (polycarbophile), alcool dichlorobenzylique, arôme, hydroxyde de sodium, acid blue 9 (CI 42090). Peut contenir de l'acide citrique.",
    url: 'https://www.atida.fr/hyalugel-gel-buccal-20ml.html',
    imageUrl:
      'https://assets.atida.com/transform/dab87242-699e-41e4-9a7e-1c298be6321a/Hyalugel-Gel-Buccal-Aphtes-Petites-Plaies-20ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.DENTIFRICE],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: 'xylitol-dental' }],
  },
  {
    slug: 'hyalugel-bain-de-bouche-aphtes-petites-plaies-100ml-50ml-offert-238963',
    name: 'Hyalugel Bain de Bouche Aphtes Petites Plaies 100ml + 50ml Offert',
    brand: 'Hyalugel',
    kind: 'mouthwash',
    unit: 'bottle',
    totalAmount: 0,
    amountUnit: '',
    priceCents: 1021,
    description: '',
    notes: '',
    inci: 'Composant principal : hyaluronate de sodium. Autres composants : eau, xylitol, alcool, polysorbate-20, huile de ricin hydrogénée PEG40, carbomère (polycarbophile), alcool dichlorobenzylique, arôme, acide citrique, hydroxyde de sodium, acid blue 9 (CI 42090).',
    url: 'https://www.atida.fr/hyalugel-bain-de-bouche-150ml-1000405.html',
    imageUrl:
      'https://assets.atida.com/transform/ba26066c-30ce-4d51-b9a2-65ac193d609b/Hyalugel-Bain-de-Bouche-Aphtes-Petites-Plaies-100ml-50ml-Offert?io=transform:extend,width:600,height:600',
    tags: {
      primary: [TAG_SLUGS.BAIN_DE_BOUCHE],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [{ slug: 'xylitol-dental' }],
  },
]
