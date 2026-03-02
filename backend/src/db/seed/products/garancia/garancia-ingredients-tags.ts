import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
export const GARANCIA_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.GARANCIA_ROUGEURS]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Anti-inflammatoire — réglisse',
    },
    {
      slug: INGREDIENT_SLUGS.VACCINIUM_MYRTILLUS,
      notes: 'Antioxydant, renforce les capillaires',
    },
    {
      slug: INGREDIENT_SLUGS.PLANKTON_EXTRACT,
      notes: 'Extrait marin apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
    },
    {
      slug: INGREDIENT_SLUGS.ESCIN,
      notes: "Veinotonique — marronnier d'Inde",
    },
    {
      slug: INGREDIENT_SLUGS.RUSCUS_ACULEATUS,
      notes: 'Veinotonique — petit-houx',
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Deuxième dérivé de réglisse anti-inflammatoire',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Cicatrisant et apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.CALENDULA,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],
}

// Export original pour compatibilité descendante
export const GARANCIA_PRODUCT_INGREDIENTS = Object.entries(GARANCIA_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
