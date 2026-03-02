import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
export const CYLA_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.ESSENCE_INITIALE]: [
    {
      slug: INGREDIENT_SLUGS.SERINE,
      notes: 'NMF biomimétique 15% – hydratation, restauration pH physiologique',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCINE,
    },
    {
      slug: INGREDIENT_SLUGS.PCA,
    },
    {
      slug: INGREDIENT_SLUGS.UREA,
    },
    {
      slug: INGREDIENT_SLUGS.ACETYL_GLUCOSAMINE,
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: 'Acide lactique – ajustement pH, hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.BIOSACCHARIDE_GUM_1,
      notes: 'Hydratant filmogène',
    },
  ],

  [allProductSlugs.GEL_PLUME]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: '50%+ glycérine – hydratation intense, nettoyant sans délipider',
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_COMPLEX,
      notes: 'TECA Centella – apaisant, réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: 'Extrait avoine kernel – calmant, anti-irritations',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],

  [allProductSlugs.CREME_FILANTE]: [
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_COMPLEX,
      notes: 'TECA Centella – apaisant dans nettoyant',
    },
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: 'Extrait avoine – calmant',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_COCOYL_ISETHIONATE,
      notes: 'Tensioactif doux – nettoyage pH acide',
    },
  ],

  [allProductSlugs.CREME_LEGERE_INITIALE]: [
    {
      slug: INGREDIENT_SLUGS.SERINE,
      notes: 'NMF biomimétique 5% – hydratation',
    },
    {
      slug: INGREDIENT_SLUGS.PCA,
    },
    {
      slug: INGREDIENT_SLUGS.UREA,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NG,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Complexe lipides 2% (céramides + cholestérol + acides gras) – barrière',
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
    {
      slug: INGREDIENT_SLUGS.LINOLEIC_ACID,
    },
  ],

  [allProductSlugs.CREME_INTENSE_INITIALE]: [
    {
      slug: INGREDIENT_SLUGS.SERINE,
      notes: 'NMF biomimétique 5% – hydratation',
    },
    {
      slug: INGREDIENT_SLUGS.PCA,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NG,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Complexe lipides 2% – nutrition intense, barrière',
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
    {
      slug: INGREDIENT_SLUGS.LINOLEIC_ACID,
    },
    {
      slug: INGREDIENT_SLUGS.OLEIC_ACID,
    },
  ],
}

// Export pour compatibilité descendante
export const CYLA_PRODUCT_INGREDIENTS = Object.entries(CYLA_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
