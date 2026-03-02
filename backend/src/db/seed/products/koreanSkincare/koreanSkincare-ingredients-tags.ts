import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
export const KOREAN_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.SOME_BY_MI_30_DAYS_MIRACLE_PATCH]: [
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      notes: 'Exfoliant comedolytique ciblé',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Apaisant post-imperfection',
    },
    {
      slug: INGREDIENT_SLUGS.TEA_TREE, // à créer si absent
      notes: 'Antibactérien naturel',
    },
  ],
  // COSRX - Essence 96
  [allProductSlugs.COSRX_ADVANCED_SNAIL_96]: [
    {
      slug: INGREDIENT_SLUGS.SNAIL_MUCIN,
      value: 96,
      unit: '%',
      notes: 'Filtrat de sécrétion d’escargot ultra-concentré pour la réparation',
    },
    { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE, notes: 'Hydratation repulpante' },
    { slug: INGREDIENT_SLUGS.PANTHENOL, notes: 'Apaisant (Vitamine B5)' },
  ],

  // PURITO - Oat-In Gel Cream
  [allProductSlugs.PURITO_OAT_IN_CALMING_GEL]: [
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      value: 77,
      unit: '%',
      notes: "Eau d'avoine apaisante pour réduire les rougeurs",
    },
    { slug: INGREDIENT_SLUGS.SQUALANE, notes: 'Hydratation légère non grasse' },
    { slug: INGREDIENT_SLUGS.PANTHENOL, notes: 'Renforce la barrière cutanée' },
  ],

  // COSRX - Cream 92
  [allProductSlugs.COSRX_ADVANCED_SNAIL_92]: [
    {
      slug: INGREDIENT_SLUGS.SNAIL_MUCIN,
      value: 92,
      unit: '%',
      notes: 'Hydratation et cicatrisation intense',
    },
    { slug: INGREDIENT_SLUGS.ADENOSINE, notes: 'Actif anti-âge et lissant' },
  ],

  // DR.G - Red Blemish Cica
  [allProductSlugs.DRG_RED_BLEMISH_CICA_SOOTHING]: [
    {
      slug: INGREDIENT_SLUGS.CENTELLA_COMPLEX, // Regroupe Madecassoside, Asiaticoside, etc.
      notes: '5-Cica Complex pour apaiser les inflammations',
    },
    { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Éclat et régulation du sébum' },
    { slug: INGREDIENT_SLUGS.BETA_GLUCAN, notes: 'Hydratation supérieure à l’acide hyaluronique' },
  ],

  // ISNTREE - Hyaluronic Acid Moist Cream
  [allProductSlugs.ISNTREE_HYALURONIC_ACID_MOIST]: [
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      value: 5,
      unit: 'types',
      notes: 'Différents poids moléculaires pour une hydratation multi-couches',
    },
    { slug: INGREDIENT_SLUGS.SHEA_BUTTER, notes: 'Nourrissant et protecteur' },
    { slug: INGREDIENT_SLUGS.CERAMIDE_NP, notes: 'Restaure la barrière lipidique' },
  ],
}

// Export pour l'agrégation
export const KOREAN_PRODUCT_INGREDIENTS = Object.entries(KOREAN_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
