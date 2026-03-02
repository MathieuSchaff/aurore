import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
export const MEMECANCER_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.MEME_CREME_VISAGE]: [
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Nourrit en profondeur',
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
      notes: 'Apaisant et adoucissant',
    },
    {
      slug: INGREDIENT_SLUGS.ALOE_VERA,
      notes: 'Apaisant et protecteur',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Hydratant humectant',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Apaisante, vitamine B',
    },
  ],
  [allProductSlugs.MEME_GELEE_DEMAQUILLANTE]: [
    { slug: INGREDIENT_SLUGS.ALOE_VERA, notes: 'Apaisant et protecteur' },
    { slug: INGREDIENT_SLUGS.GLYCERIN, notes: 'Hydratant' },
    { slug: INGREDIENT_SLUGS.HUILE_GRAINES_TOURNESOL, notes: 'Dissout le maquillage en douceur' },
  ],
  [allProductSlugs.MEME_HUILE_LAVANTE]: [
    { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Apaisante, vitamine B3' },
    { slug: INGREDIENT_SLUGS.GLYCERIN, notes: 'Agent hydratant' },
    { slug: INGREDIENT_SLUGS.CUCUMBER_EXTRACT, notes: 'Rafraîchissant et apaisant' },
  ],
  [allProductSlugs.MEME_BAUME_MULTI_USAGES]: [
    { slug: INGREDIENT_SLUGS.SHEA_BUTTER, notes: 'Réparateur et protecteur' },
    { slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL, notes: 'Adoucissante et assouplissante' },
    // { slug: INGREDIENT_SLUGS., notes: 'Effet pansement protecteur' },
  ],
}

// Export original pour compatibilité descendante
export const MEME_PRODUCT_INGREDIENTS = Object.entries(MEMECANCER_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
