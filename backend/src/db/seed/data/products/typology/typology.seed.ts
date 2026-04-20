import { TAG_SLUGS } from '../../../data/tags'
import { INGREDIENT_SLUGS } from '../../../data/ingredients/ingredient-slugs'
import type { UnifiedProductSeed } from '../types'

export const TYPOLOGY_SEED: UnifiedProductSeed[] = [
  {
    slug: 'typology-azelaic-serum-l35',
    name: 'Sérum Matifiant L35',
    brand: 'Typology',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 3300,
    description: `Sérum matifiant concentré en acide azélaïque 10% d'origine végétale et extrait de bambou bio. Réduit l'excès de sébum, matifie les peaux grasses et régule la production de sébum sans dessécher.`,
    notes: `97% d'ingrédients d'origine naturelle. 10 ingrédients. Formule minimaliste ciblée peaux mixtes à grasses et tendance acnéique.`,
    inci: 'WATER, AZELAIC ACID, GLYCERIN, BAMBUSA ARUNDINACEA JUICE, 1,2-HEXANEDIOL, XANTHAN GUM, ZINC PCA, SODIUM BENZOATE, CITRIC ACID, SODIUM HYDROXIDE',
    url: 'https://www.typology.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.BRILLANCE, TAG_SLUGS.PORES_DILATES],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.MATIFIANT,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.BIO_NATUREL,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.AZELAIC_ACID,
        notes: `Actif principal d'origine végétale. Régule la production de sébum, propriétés antibactériennes et kératolytiques.`,},
      {
        slug: INGREDIENT_SLUGS.ZINC_PCA,
        notes: `Régulateur de sébum et antibactérien. Complément synergique à l'acide azélaïque.`,},
      {
        slug: INGREDIENT_SLUGS.GLYCERIN,
        notes: `Humectant pour maintenir l'hydratation sans alourdir la formule.`,},
    ],
  },
]
