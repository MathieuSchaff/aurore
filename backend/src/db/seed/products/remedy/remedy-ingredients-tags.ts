import type { Ingredient } from '../../ingredients'
import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { REMEDY_PRODUCT_SLUGS } from './remedy'

export const REMEDY_INGREDIENTS_MAP: Record<string, Ingredient[]> = {
  [REMEDY_PRODUCT_SLUGS.DAILY_DEFENSE]: [
    {
      slug: INGREDIENT_SLUGS.THREE_O_ETHYL_ASCORBIC_ACID,
      notes: '15% Vitamin C Complex',
    },
    {
      slug: INGREDIENT_SLUGS.FERULIC_ACID,
      notes: 'Booste et stabilise les antioxydants',
    },
    {
      slug: INGREDIENT_SLUGS.ECTOIN,
      notes: 'Protecteur cellulaire, hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.PLANKTON_EXTRACT,
      notes: 'Antioxydant marin',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaisant, hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Hydratation repulpante',
    },
  ],

  [REMEDY_PRODUCT_SLUGS.DARK_SPOTS]: [
    {
      slug: INGREDIENT_SLUGS.RETINOL,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Encapsulated Retinol',
    },
    {
      slug: INGREDIENT_SLUGS.TRANEXAMIC_ACID,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Réduit les taches et l’hyperpigmentation',
    },
    {
      slug: INGREDIENT_SLUGS.MANDELIC_ACID,
      notes: 'AHA doux',
    },
    {
      slug: INGREDIENT_SLUGS.KOJIC_ACID,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Inhibiteur de tyrosinase (taches)',
    },
    {
      slug: INGREDIENT_SLUGS.GLUTATHION,
      notes: 'Antioxydant éclaircissant',
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Éclaircissant naturel',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Unifie le teint et renforce la barrière',
    },
    {
      slug: INGREDIENT_SLUGS.ACETYL_GLUCOSAMINE,
      notes: 'Hydratant et éclaircissant doux',
    },
  ],

  [REMEDY_PRODUCT_SLUGS.HEALTHY_AGING]: [
    {
      slug: INGREDIENT_SLUGS.RETINOL,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Encapsulated Retinol',
    },
    {
      slug: INGREDIENT_SLUGS.RETINAL,
      concentrationValue: 0.05,
      concentrationUnit: '%',
      notes: 'Retinaldehyde pour le smart-aging',
    },
    {
      slug: INGREDIENT_SLUGS.ARGIRELINE,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Acetyl Hexapeptide-8 (effet botox-like)',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      notes: 'AHA le plus puissant',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Régule et apaise',
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TRIPEPTIDE_1,
      notes: 'Partie du Matrixyl 3000',
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TETRAPEPTIDE_7,
      notes: 'Partie du Matrixyl 3000',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      notes: 'Renforce la barrière cutanée',
    },
    {
      slug: INGREDIENT_SLUGS.RESVERATROL,
      notes: 'Polyphénol antioxydant',
    },
    {
      slug: INGREDIENT_SLUGS.FERULIC_ACID,
      notes: 'Antioxydant stabilisateur',
    },
  ],

  [REMEDY_PRODUCT_SLUGS.GEL_CLEANSER]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Maintient l’hydratation',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Apaise et régule le sébum',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      concentrationValue: 0.5,
      concentrationUnit: '%',
      notes: 'Nettoie les pores',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant star',
    },
    {
      slug: INGREDIENT_SLUGS.GREEN_TEA,
      notes: 'Antioxydant et apaisant',
    },
  ],

  [REMEDY_PRODUCT_SLUGS.CREAM_CLEANSER]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Maintient l’intégrité de la barrière',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaise et répare',
    },
  ],

  [REMEDY_PRODUCT_SLUGS.CLEANSING_BALM]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      notes: 'Complexe aux céramides',
    },
    {
      slug: INGREDIENT_SLUGS.LINOLEIC_ACID,
      notes: 'Safflower Lipids',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Apaisant et régénérant',
    },
    {
      slug: INGREDIENT_SLUGS.CURCUMA_LONGA_ROOT_EXTRACT,
      notes: 'Turmeric, antioxydant',
    },
    {
      slug: INGREDIENT_SLUGS.GREEN_TEA,
      notes: 'Extrait de thé vert',
    },
  ],

  [REMEDY_PRODUCT_SLUGS.HAND_CREAM]: [
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      concentrationValue: 20,
      concentrationUnit: '%',
      notes: 'Nourrissant intensif',
    },
    {
      slug: INGREDIENT_SLUGS.RETINOL,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Encapsulated Retinol (anti-âge mains)',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      notes: 'Complexe Céramides (NP + AP + EOP)',
    },
  ],

  [REMEDY_PRODUCT_SLUGS.RICH_MOISTURIZER]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      notes: 'Quadruple Ceramide Complex (NP, AP, EOP, Phytosphingosine)',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant profond',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Émollient biomimétique léger',
    },
    {
      slug: INGREDIENT_SLUGS.TRIPEPTIDE_1,
      notes: 'Stimule le collagène',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Vitamine B3 apaisante',
    },
  ],

  [REMEDY_PRODUCT_SLUGS.BODY_BUMPS]: [
    {
      slug: INGREDIENT_SLUGS.RETINOL,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Encapsulated Retinol pour lisser',
    },
    {
      slug: INGREDIENT_SLUGS.UREA,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: 'Kératolytique et hydratant intense',
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'AHA doux',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      notes: 'Pour réparer après exfoliation',
    },
  ],

  [REMEDY_PRODUCT_SLUGS.DRY_LIPS]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      notes: 'Céramide NP',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Nourrit sans lourdeur',
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TRIPEPTIDE_1,
      notes: 'Repulpe les lèvres',
    },
    {
      slug: INGREDIENT_SLUGS.PETROLATUM,
      notes: 'Base occlusive puissante',
    },
    {
      slug: INGREDIENT_SLUGS.DIMETHICONE,
      notes: 'Silicone protecteur',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité',
    },
  ],

  [REMEDY_PRODUCT_SLUGS.GEL_MOISTURIZER]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Hydratation',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Émollient léger',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Régulateur et barrière',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Renfort barrière',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaisant',
    },
  ],

  [REMEDY_PRODUCT_SLUGS.PIMPLE_PATCHES]: [
    {
      slug: INGREDIENT_SLUGS.HYDROCOLLOID,
      notes: 'Agents gélifiants absorbants et protecteurs',
    },
  ],

  [REMEDY_PRODUCT_SLUGS.PORE_SIZE]: [
    {
      slug: INGREDIENT_SLUGS.RETINOL,
      concentrationValue: 0.3,
      concentrationUnit: '%',
      notes: 'Encapsulated Retinol',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Encapsulated Salicylic Acid',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Resserre les pores',
    },
    {
      slug: INGREDIENT_SLUGS.GREEN_TEA,
      notes: 'Antioxydant / Apaisant',
    },
  ],
}
