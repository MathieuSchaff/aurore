import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
export const AZ_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.AROMA_ZONE_CONCENTRE_AZELAIC_10]: [
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      value: 3.5,
      unit: '%',
      notes: '10% acide azélaïque – séborégulateur, matifiant, anti-imperfections',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Acide hyaluronique – hydratation',
    },
    {
      slug: INGREDIENT_SLUGS.SALIX_NIGRA,
      notes: 'Extrait écorce de saule noir – BHA naturel, purifiant',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
  ],

  [allProductSlugs.AROMA_ZONE_CONCENTRE_AZELAIC_10]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: '10% acide azélaïque – séborégulateur, matifiant, anti-imperfections',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Acide hyaluronique – hydratation',
    },
    {
      slug: INGREDIENT_SLUGS.SALIX_NIGRA,
      notes: 'Extrait écorce de saule noir – BHA naturel, purifiant',
    },
    {
      slug: INGREDIENT_SLUGS.SILICA,
      notes: 'Silice – matifiant instantané, absorbe sébum',
    },
  ],

  [allProductSlugs.AZ_SERUM_VITAMINE_C_10_ASTAXANTHINE]: [
    {
      slug: INGREDIENT_SLUGS.ASCORBYL_GLUCOSIDE,
      notes: '10% ascorbyl glucoside (vitamine C stable) – éclat, antioxydant, anti-taches',
    },
    {
      slug: INGREDIENT_SLUGS.HAEMATOCOCCUS_PLUVIALIS,
      notes: 'Astaxanthine (extrait Haematococcus pluvialis) – antioxydant puissant',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Acide hyaluronique – hydratation',
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_DE_JOJOBA,
      notes: 'Huile de jojoba – émollient, barrière',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E – antioxydant',
    },
    {
      slug: INGREDIENT_SLUGS.SALIX_NIGRA,
      notes: 'Extrait saule noir – purifiant',
    },
  ],

  [allProductSlugs.AZ_SERUM_BAKUCHIOL]: [
    {
      slug: INGREDIENT_SLUGS.BAKUCHIOL,
      notes: 'Bakuchiol – alternative douce au rétinol, anti-âge, collagène',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Squalane – hydratant, barrière (base minimaliste)',
    },
    {
      slug: INGREDIENT_SLUGS.ISOSORBIDE_DICAPRYLATE,
      notes: 'Émollient léger',
    },
  ],
}

// Export pour compatibilité descendante
export const AZ_PRODUCT_INGREDIENTS = Object.entries(AZ_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
