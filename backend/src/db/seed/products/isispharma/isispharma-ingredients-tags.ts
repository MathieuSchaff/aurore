import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { ISISPHARMA_PRODUCT_SLUGS } from './isispharma'
export const ISISPHARMA_INGREDIENTS_MAP: Record<string, any[]> = {
  [ISISPHARMA_PRODUCT_SLUGS.ISISPHARMA_RUBORIL_EXPERT_S]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.PENTYLENE_GLYCOL,
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Anti-inflammatoire — réglisse',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
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
      notes: 'Deuxième dérivé de réglisse',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'CENTELLA ASIATICA LEAF EXTRACT',
    },
    {
      slug: INGREDIENT_SLUGS.CALENDULA,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],

  [ISISPHARMA_PRODUCT_SLUGS.ISISPHARMA_RUBORIL_EXPERT_M]: [
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Acide glycyrrhétinique — complexe B-Calm anti-rougeurs',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Renforce la barrière et réduit les rougeurs',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Provitamine B5 apaisante',
    },
    {
      slug: INGREDIENT_SLUGS.RUSCUS_ACULEATUS,
      notes: 'Petit houx — vasoconstricteur et drainant veineux',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Extrait de centella apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.ESCIN, // à créer si absent — extrait de marron d'Inde
      notes: 'Escine — renforce la paroi capillaire',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
  ],
}

// Export original pour compatibilité descendante
export const ISISPHARMA_PRODUCT_INGREDIENTS = Object.entries(ISISPHARMA_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
