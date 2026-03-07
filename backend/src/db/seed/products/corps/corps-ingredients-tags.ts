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

    {
      slug: INGREDIENT_SLUGS.PCA,
    },
    {
      slug: INGREDIENT_SLUGS.SERINE,
    },
    {
      slug: INGREDIENT_SLUGS.LYSINE_HCL,
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERYL_GLUCOSIDE,
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
  // ─── AmLactin ──────────────────────────────────────────────────────────────

  [CORPS_PRODUCT_SLUGS.AMLACTIN_DAILY_NOURISH_12_AHA]: [
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: 'Ammonium lactate 12% – AHA exfoliant + humectant',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Glycérine – humectant',
    },
  ],

  [CORPS_PRODUCT_SLUGS.PAULAS_CHOICE_LAIT_CORPS_10_AHA]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
    },
    {
      slug: INGREDIENT_SLUGS.GREEN_TEA,
    },

    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
    },

    {
      slug: INGREDIENT_SLUGS.THD_ASCORBATE,
    },
    {
      slug: INGREDIENT_SLUGS.DIMETHICONE,
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHERYL_ACETATE,
    },

    {
      slug: INGREDIENT_SLUGS.HUILE_DE_PEPINS_DE_RAISIN,
    },

    {
      slug: INGREDIENT_SLUGS.EXTRAIT_CAMOMILLE,
    },
    {
      slug: INGREDIENT_SLUGS.BUTYLENE_GLYCOL,
    },
    {
      slug: INGREDIENT_SLUGS.EXTRAIT_EPILOBE,
    },
  ],
  // ─── Remedy Science ────────────────────────────────────────────────────────

  [CORPS_PRODUCT_SLUGS.REMEDY_KP_BODY_MOISTURIZER]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      notes: 'Urée 10% – kératolytique + hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: 'Acide lactique 5% – AHA exfoliant',
    },
    {
      slug: INGREDIENT_SLUGS.RETINOL,
      notes: 'Rétinol encapsulé 0.1% – renouvellement cellulaire',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Céramide NP – barrière cutanée',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Squalane – émollient biomimétique',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
  ],

  // ─── BYOMA ─────────────────────────────────────────────────────────────────

  [CORPS_PRODUCT_SLUGS.BYOMA_BLEMISH_CONTROL_BODY_LOTION]: [
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      notes: 'BHA – désobstrue pores, anti-acné corporelle',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Céramide NP – renforce barrière cutanée',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
      notes: 'Lipide biomimétique – soutien barrière',
    },
    {
      slug: INGREDIENT_SLUGS.BAKUCHIOL,
      notes: 'Bakuchiol – rétinol-like, anti-imperfections',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E – antioxydant',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
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
