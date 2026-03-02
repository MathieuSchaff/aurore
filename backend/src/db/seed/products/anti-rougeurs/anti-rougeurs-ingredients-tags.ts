import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
export const ANTI_ROUGEURS_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.ACM_ROSAKALM]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.RUSCUS_ACULEATUS,
      notes: 'Veinotonique — petit-houx',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Hydratant en profondeur',
    },
    {
      slug: INGREDIENT_SLUGS.GREEN_TEA,
      notes: 'Thé vert — antioxydant',
    },
    {
      slug: INGREDIENT_SLUGS.HIPPOPHAE_RHAMNOIDES,
      notes: 'Argousier — régénérant riche en vitamine C',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],
  [allProductSlugs.EUCERIN_AR]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
    },
    {
      slug: INGREDIENT_SLUGS.PENTYLENE_GLYCOL,
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Licochalcone A — actif signature Eucerin, anti-inflammatoire',
    },
  ],
  [allProductSlugs.NOREVA_SENSIDIANE]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.PENTYLENE_GLYCOL,
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Forme purifiée de Centella — stimule le collagène',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Complexe céramides complet (NP + NS + EOP + AP)',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],
}

// Export original pour compatibilité descendante
export const AR_PRODUCT_INGREDIENTS = Object.entries(ANTI_ROUGEURS_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
