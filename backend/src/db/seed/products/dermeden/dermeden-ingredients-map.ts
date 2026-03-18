import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { DERMEDEN_PRODUCT_SLUGS } from './dermeden'

export const INGREDIENTS_MAP: Record<string, any[]> = {
  [DERMEDEN_PRODUCT_SLUGS.ADVANCED_PEEL]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 20,
      concentrationUnit: '%',
      notes: 'Acide Glycolique encapsulé (Etape PEEL). [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 0.2,
      concentrationUnit: '%',
      notes: 'Acide Glycolique encapsulé (Etape PRE-PEEL). [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      concentrationValue: 0.5,
      concentrationUnit: '%',
      notes: 'Pro-vitamine B5 apaisante. [cite: 11]',
    },
  ],
  [DERMEDEN_PRODUCT_SLUGS.CONCENTRE_ANTI_TACHES_TXA_5]: [
    {
      slug: INGREDIENT_SLUGS.TRANEXAMIC_ACID,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: "Traite l'hyperpigmentation. [cite: 11]",
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: 'Bloque le transfert de mélanine. [cite: 11]',
    },
  ],
  [DERMEDEN_PRODUCT_SLUGS.LUMIXDERM_CREME_ECLAIRCISSANTE]: [
    {
      slug: INGREDIENT_SLUGS.DIOIC_ACID,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Actif dépigmentant. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.GLUTATHIONE,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Antioxydant puissant. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Hydratation intense. [cite: 11]',
    },
  ],
  [DERMEDEN_PRODUCT_SLUGS.DAY_PROTOCOLE_MIXTE_GRASSE]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Grade S. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.DIOIC_ACID,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Traite les taches. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Haut poids moléculaire. [cite: 11]',
    },
  ],
  [DERMEDEN_PRODUCT_SLUGS.DAY_PROTOCOLE_SECHE]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Régule et apaise. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.AVOCADO_OIL,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Nourrit les peaux sèches. [cite: 11]',
    },
  ],
  [DERMEDEN_PRODUCT_SLUGS.NIGHT_PROTOCOLE_CREME_NUIT_INTENSE]: [
    {
      slug: INGREDIENT_SLUGS.RETINOL,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Rétinol encapsulé. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 4,
      concentrationUnit: '%',
      notes: 'Action exfoliante. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Désincruste les pores. [cite: 11]',
    },
  ],
  [DERMEDEN_PRODUCT_SLUGS.NIGHT_PROTOCOLE_SERUM_INTENSE]: [
    {
      slug: INGREDIENT_SLUGS.RETINOL,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Encapsulé. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.MATRIXYL_PEPTIDES,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Peptides Matrikines. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.VITAMIN_C,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Vitamine C encapsulée. [cite: 11]',
    },
  ],
  [DERMEDEN_PRODUCT_SLUGS.CONTOUR_YEUX_INTENSE]: [
    {
      slug: INGREDIENT_SLUGS.VITAMIN_C,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Stabilisée. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 4,
      concentrationUnit: '%',
      notes: 'Lisse les ridules. [cite: 11]',
    },
  ],
  [DERMEDEN_PRODUCT_SLUGS.CICADERM_SOIN_REPARATEUR]: [
    {
      slug: INGREDIENT_SLUGS.ARNICA_MONTANA,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Anti-inflammatoire. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.MIMOSA_TENUIFLORA,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Cicatrisant. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_CHLORHEXIDINE,
      concentrationValue: 1.2,
      concentrationUnit: '%',
      notes: 'Assainissant. [cite: 11]',
    },
  ],
  [DERMEDEN_PRODUCT_SLUGS.CREME_MAINS_ACTION_GLOBALE]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Prévient les taches. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.CHLORHEXIDINE_ZINC,
      concentrationValue: 1.2,
      concentrationUnit: '%',
      notes: 'Antibactérien. [cite: 11]',
    },
  ],
  [DERMEDEN_PRODUCT_SLUGS.LAIT_CORPS_ECLAT]: [
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Nourrissant. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Hydratant. [cite: 11]',
    },
  ],
  [DERMEDEN_PRODUCT_SLUGS.SOIN_VERGETURES_RAFFERMISSANT]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Améliore la texture. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.MACADAMIA_OIL,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Assouplit la peau. [cite: 11]',
    },
  ],
  [DERMEDEN_PRODUCT_SLUGS.HYDRA_PROTOCOLE_CREME_LEGERE]: [
    {
      slug: INGREDIENT_SLUGS.GLUCONOLACTONE,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'PHA antioxydant. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.SILICA,
      concentrationValue: 4,
      concentrationUnit: '%',
      notes: 'Effet matifiant. [cite: 11]',
    },
  ],
  [DERMEDEN_PRODUCT_SLUGS.HYDRA_PROTOCOLE_CREME_RICHE]: [
    {
      slug: INGREDIENT_SLUGS.PHYTOSQUALANE,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Renforce le film hydrolipidique. [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Haut poids moléculaire. [cite: 11]',
    },
  ],
  [DERMEDEN_PRODUCT_SLUGS.DD_CREAM]: [
    {
      slug: INGREDIENT_SLUGS.VITAMIN_D_LIKE,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Vederine. [cite: 11]',
    },
  ],
  [DERMEDEN_PRODUCT_SLUGS.CONCENTRE_REPULPANT_15]: [
    {
      slug: INGREDIENT_SLUGS.ANTI_HYALURONIDASE,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: "Protège l'acide hyaluronique naturel. [cite: 11]",
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      concentrationValue: 5.2,
      concentrationUnit: '%',
      notes: 'Multi-moléculaire. [cite: 11]',
    },
  ],
  [DERMEDEN_PRODUCT_SLUGS.CONCENTRE_RETINOIDES_6]: [
    {
      slug: INGREDIENT_SLUGS.RETINAL,
      concentrationValue: 4,
      concentrationUnit: '%',
      notes: 'Rétinal Stabilisé (complexe). [cite: 11]',
    },
    {
      slug: INGREDIENT_SLUGS.RETINOL,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Rétinol Encapsulé (complexe). [cite: 11]',
    },
  ],
}
