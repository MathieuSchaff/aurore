import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
export const BOJ_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.BEAUTY_OF_JOSEON_DYNASTY_CREAM]: [
    {
      slug: INGREDIENT_SLUGS.ORYZA_SATIVA,
      notes: 'Eau de riz (bran water) + extraits – hydratation glowy, signature BoJ',
    },
    {
      slug: INGREDIENT_SLUGS.PANAX_GINSENG,
      notes: 'Eau de racine de ginseng – revitalisant, anti-âge',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Niacinamide – barrière, éclat, sébum',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Squalane – hydratation légère, non gras',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Céramide NP – renforce barrière',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'HA multi-moléculaire – hydratation profonde',
    },
  ],

  [allProductSlugs.BOJ_GINSENG_ESSENCE_WATER]: [
    {
      slug: INGREDIENT_SLUGS.PANAX_GINSENG,
      notes:
        'Eau de racine de ginseng + callus culture + ferment + extraits – revitalisant, éclat, barrière',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Niacinamide – éclat, barrière',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Panthénol – apaisant, hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
    },
    {
      slug: INGREDIENT_SLUGS.ADENOSINE,
      notes: 'Anti-âge',
    },
  ],

  [allProductSlugs.BEAUTY_OF_JOSEON_GLOW_RICE_MILK]: [
    {
      slug: INGREDIENT_SLUGS.ORYZA_SATIVA,
      notes: 'Extrait de riz + eau de riz – hydratation glowy, équilibre sébum',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Centella – apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Céramide NP – barrière',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
    },
    {
      slug: INGREDIENT_SLUGS.RICE_AMINO_ACIDS,
      notes: 'Acides aminés riz – hydratation, glow',
    },
  ],

  [allProductSlugs.BOJ_RELIEF_SUN_AQUA_FRESH]: [
    {
      slug: INGREDIENT_SLUGS.ORYZA_SATIVA,
      notes: 'Eau de riz + huile de riz – hydratation glowy',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Panthénol – apaisant post-UV',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Céramide NP – barrière',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
    },
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: 'Extrait avoine – calmant',
    },
    {
      slug: INGREDIENT_SLUGS.BETA_GLUCAN,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E – antioxydant',
    },
  ],
}

// Export pour compatibilité descendante
export const BOJ_PRODUCT_INGREDIENTS = Object.entries(BOJ_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
