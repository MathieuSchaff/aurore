import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { DERMACEUTIC_PRODUCTS_SLUG } from './dermaceutic'

export const INGREDIENTS_MAP: Record<string, any[]> = {
  [DERMACEUTIC_PRODUCTS_SLUG.MASK_15]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 15,
      concentrationUnit: '%',
      notes: 'AHA pour stimuler le renouvellement cellulaire.',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'BHA lipophile pour libérer les pores.',
    },
    {
      slug: INGREDIENT_SLUGS.BENTONITE,
      notes: 'Argile absorbante pour resserrer les pores.',
    },
  ],
  [DERMACEUTIC_PRODUCTS_SLUG.OXYBIOME]: [
    {
      slug: INGREDIENT_SLUGS.MICROBIOTA_REGULATOR,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Mélange de nutriments pour soutenir le microbiote.',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      notes: 'Agent sébo-régulateur et antiseptique.',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Actif apaisant et anti-séborrhéique.',
    },
  ],
  [DERMACEUTIC_PRODUCTS_SLUG.FOAMER_5]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Exfoliation douce pour le renouvellement cellulaire.',
    },
    {
      slug: INGREDIENT_SLUGS.ENOXOLONE,
      notes: 'Agent anti-inflammatoire puissant et apaisant.',
    },
  ],
  [DERMACEUTIC_PRODUCTS_SLUG.FOAMER_15]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 15,
      concentrationUnit: '%',
      notes: 'Exfoliation intense pour purifier la peau.',
    },
    {
      slug: INGREDIENT_SLUGS.ENOXOLONE,
      notes: 'Propriétés apaisantes et calmantes.',
    },
  ],
  [DERMACEUTIC_PRODUCTS_SLUG.ACTIVABIOME]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 7,
      concentrationUnit: '%',
      notes: 'Action kératolytique pour affiner le grain de peau.',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Action comédolytique pour désobstruer les pores.',
    },
    {
      slug: INGREDIENT_SLUGS.MICROBIOTA_REGULATOR,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Réduit les rougeurs et l’inflammation.',
    },
  ],
  [DERMACEUTIC_PRODUCTS_SLUG.LIGHT_CEUTIC]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 8,
      concentrationUnit: '%',
      notes: 'Solution AHA pour stimuler le renouvellement.',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTIC_ACID,
      concentrationValue: 4,
      concentrationUnit: '%',
      notes: 'Agent éclaircissant et antioxydant.',
    },
    {
      slug: INGREDIENT_SLUGS.VITAMIN_C,
      notes: 'Protection contre les radicaux libres.',
    },
  ],
  [DERMACEUTIC_PRODUCTS_SLUG.TURN_OVER_10]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 10.5,
      concentrationUnit: '%',
      notes: 'Élimine les cellules mortes et réduit les rides.',
    },
  ],
  [DERMACEUTIC_PRODUCTS_SLUG.TURN_OVER_15]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 15,
      concentrationUnit: '%',
      notes: 'Action exfoliante intensive (pH 3.0 – 3.5).',
    },
  ],
  [DERMACEUTIC_PRODUCTS_SLUG.HYAL_CEUTIC]: [
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      concentrationValue: 5.5,
      concentrationUnit: '%',
      notes: 'Combinaison de hauts et bas poids moléculaires.',
    },
    {
      slug: INGREDIENT_SLUGS.ALOE_VERA,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: 'Gel hydratant, cicatrisant et apaisant.',
    },
  ],
  [DERMACEUTIC_PRODUCTS_SLUG.C25_CREAM]: [
    {
      slug: INGREDIENT_SLUGS.VITAMIN_C,
      concentrationValue: 25,
      concentrationUnit: '%',
      notes: 'Protection contre le photovieillissement.',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Agent hydratant et calmant.',
    },
    {
      slug: INGREDIENT_SLUGS.RETINYL_PALMITATE,
      notes: 'Ester de vitamine A pour améliorer la texture.',
    },
  ],
  [DERMACEUTIC_PRODUCTS_SLUG.ACTIV_RETINOL_0_5]: [
    {
      slug: INGREDIENT_SLUGS.RETINOL,
      concentrationValue: 0.2,
      concentrationUnit: '%',
      notes: 'Rétinol pur pour stimuler le collagène.',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Renforce la fonction barrière.',
    },
  ],
  [DERMACEUTIC_PRODUCTS_SLUG.ACTIV_RETINOL_1_0]: [
    {
      slug: INGREDIENT_SLUGS.RETINOL,
      concentrationValue: 0.3,
      concentrationUnit: '%',
      notes: 'Sérum intense pour rides avancées.',
    },
  ],
  [DERMACEUTIC_PRODUCTS_SLUG.DERMA_LIFT_5_0]: [
    {
      slug: INGREDIENT_SLUGS.PEPTIDE_COMPLEX,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Stimule la synthèse du collagène.',
    },
    {
      slug: INGREDIENT_SLUGS.BAKUCHIOL,
      concentrationValue: 0.5,
      concentrationUnit: '%',
      notes: 'Alternative végétale au rétinol.',
    },
  ],
  [DERMACEUTIC_PRODUCTS_SLUG.REVEAL_4X]: [
    {
      slug: INGREDIENT_SLUGS.CX_COMPLEX,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Cible les signes de fatigue et de vieillissement.',
    },
    {
      slug: INGREDIENT_SLUGS.CAFFEINE,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Propriétés drainantes pour les poches.',
    },
  ],
  [DERMACEUTIC_PRODUCTS_SLUG.PANTHENOL_CEUTIC]: [
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Effet calmant immédiat sur peau irritée.',
    },
    {
      slug: INGREDIENT_SLUGS.BISABOLOL,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Actif cicatrisant et anti-inflammatoire.',
    },
  ],
}
