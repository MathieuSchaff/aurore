import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { CORPS_PRODUCT_SLUGS } from './corps'
export const CORPS_INGREDIENTS_MAP: Record<string, any[]> = {
  [CORPS_PRODUCT_SLUGS.CERAVE_SA_ANTI_RUGOSITES]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      notes: 'Urée 10% – exfolie, hydrate kératose pilaire',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      notes: 'Acide salicylique – lisse rugosités',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
      notes: '3 céramides essentiels – restauration barrière',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Niacinamide – apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
  ],

  [CORPS_PRODUCT_SLUGS.CERAVE_BAUME_HYDRATANT]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
      notes: '3 céramides + MVE – hydratation 48h, barrière',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
    },
  ],

  [CORPS_PRODUCT_SLUGS.CERAVE_CREME_HYDRATANTE]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
      notes: '3 céramides + MVE – hydratation 24h',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
  ],

  [CORPS_PRODUCT_SLUGS.CERAVE_LAIT_HYDRATANT]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
      notes: '3 céramides + MVE – hydratation légère 24h',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Niacinamide – apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
    },
  ],

  [CORPS_PRODUCT_SLUGS.EUCERIN_UREAREPAIR_LOTION_10]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      notes: 'Urée 10% – exfolie, hydrate intensif',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Céramide NP – barrière',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_PCA,
      notes: 'NMF (lactate, PCA, etc.) – hydratation',
    },
    {
      slug: INGREDIENT_SLUGS.ARGININE,
    },
  ],

  [CORPS_PRODUCT_SLUGS.EUCERIN_UREAREPAIR_CREME_5]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      notes: 'Urée 5% – hydrate, lisse',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
  ],

  [CORPS_PRODUCT_SLUGS.EUCERIN_ATOPICONTROL_BAUME]: [
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Panthénol – apaisant démangeaisons',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Licochalcone A – anti-inflammatoire',
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_ONAGRE,
      notes: "Huile d'onagre – oméga-6",
    },
    {
      slug: INGREDIENT_SLUGS.BOURRACHE,
      notes: 'Huile de bourrache – oméga-6',
    },
  ],
}

// Export pour compatibilité descendante
export const CORPS_PRODUCT_INGREDIENTS = Object.entries(CORPS_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
