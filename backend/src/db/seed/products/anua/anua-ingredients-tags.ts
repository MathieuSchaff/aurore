import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'

export const ANUA_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.ANUA_HEARTLEAF_77_SOOTHING]: [
    {
      slug: INGREDIENT_SLUGS.HEARTLEAF,
      notes: '77% extrait de Heartleaf – apaisant, anti-inflammatoire, signature du produit',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Hydratant et réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Extrait de Centella – calmant et renforçant la barrière',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.BETAINE,
    },
    {
      slug: INGREDIENT_SLUGS.PORTULACA_OLERACEA,
      notes: 'Extrait de pourpier – anti-irritation',
    },
  ],

  [allProductSlugs.ANUA_RICE_70_GLOW_MILKY]: [
    {
      slug: INGREDIENT_SLUGS.ORYZA_SATIVA,
      notes: '70%+ eau de riz / extraits de riz – éclaircissant, hydratant, équilibrant sébum',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Éclaircissant, régulateur de sébum, barrière',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Renforce la barrière cutanée',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Multi-moléculaire HA – hydratation profonde',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
    },
  ],

  [allProductSlugs.ANUA_AZELAIC_10_HYDRATING_REDNESS]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: '10% acide azélaïque – anti-imperfections, anti-rougeurs, post-IPL',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Réparation barrière – crucial post-IPL',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: '7 dérivés Centella (madecassoside, asiaticoside, etc.) – apaisant puissant',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Hydratation longue durée',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
    },
    {
      slug: INGREDIENT_SLUGS.BETA_GLUCAN,
      notes: 'Apaisant et hydratant',
    },
  ],

  [allProductSlugs.ANUA_AZELAIC_3_CICA_TONER]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: '3% acide azélaïque – clarifiant doux',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: '7 types Cica + madecassoside – apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      notes: 'Exfoliant doux (BHA)',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_PCA,
      notes: 'Régulateur de sébum',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
  ],

  [allProductSlugs.AROMA_ZONE_CONCENTRE_AZELAIC_10]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: '10% acide azélaïque – matifiant, anti-imperfections, équilibrant sébum',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Hydratation',
    },
    {
      slug: INGREDIENT_SLUGS.SALIX_NIGRA,
      notes: "Extrait d'écorce de saule noir – effet purifiant naturel",
    },
    {
      slug: INGREDIENT_SLUGS.SILICA,
      notes: 'Absorbant sébum, matifiant instantané',
    },
  ],
}

// Export pour compatibilité descendante (comme dans A-Derma)
export const ANUA_PRODUCT_INGREDIENTS = Object.entries(ANUA_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
