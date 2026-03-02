import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
export const ADERMA_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.ADERMA_LAIT_CORPS_72H]: [
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Hydratation 72h',
    },
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: 'Avoine Rhealba® bio – sprout oil',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant principal',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHERYL_ACETATE,
      notes: 'Vitamine E – antioxydant',
    },
  ],

  [allProductSlugs.ADERMA_EXOMEGA_HUILE_500]: [
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: "Extrait de plantules d'Avoine Rhealba®",
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_ONAGRE,
      notes: "Huile d'onagre – riche en acides gras essentiels",
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E',
    },
    {
      slug: INGREDIENT_SLUGS.COCO_GLUCOSIDE,
      notes: 'Tensioactif doux principal',
    },
  ],

  [allProductSlugs.ADERMA_GEL_DOUCHE_SURGRAS]: [
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: "Lait d'Avoine Rhealba®",
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.DECYL_GLUCOSIDE,
      notes: 'Tensioactif doux',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_LAUROYL_METHYL_ISETHIONATE,
      notes: 'Tensioactif doux',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],

  [allProductSlugs.ADERMA_EXOMEGA_LAIT_EMOLLIENT]: [
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: "Extrait de plantules d'Avoine Rhealba®",
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Apaisant – renforce la barrière cutanée',
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_ONAGRE,
      notes: "Huile d'onagre",
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHERYL_ACETATE,
      notes: 'Vitamine E',
    },
  ],

  [allProductSlugs.ADERMA_BIOLOGY_AR]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.PENTYLENE_GLYCOL,
    },
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: 'Avoine Rhealba® — actif breveté A-Derma, apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
    {
      slug: INGREDIENT_SLUGS.ALOE_VERA,
      notes: 'Aloe vera – apaisant et hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_GRAINES_TOURNESOL,
      notes: 'Huile de tournesol bio',
    },
    {
      slug: INGREDIENT_SLUGS.CITRUS_AURANTIUM_DULCIS,
      notes: "Eau d'orange bio",
    },
  ],
}

// Export original pour compatibilité descendante
export const ADERMA_PRODUCT_INGREDIENTS = Object.entries(ADERMA_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
