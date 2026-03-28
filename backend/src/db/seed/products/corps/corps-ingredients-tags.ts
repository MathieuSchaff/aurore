import type { Ingredient } from '../../ingredients'
import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { CORPS_PRODUCT_SLUGS } from './corps'
export const CORPS_INGREDIENTS_MAP: Record<string, Ingredient[]> = {
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

  'xerolys-50-soin-callosites': [
    {
      slug: INGREDIENT_SLUGS.UREA,
      concentrationValue: 50,
      concentrationUnit: '%',
      notes:
        'Actif kératolytique principal à très haute concentration. Exfolie intensément les callosités et hyperkératoses localisées.',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      notes:
        "AHA complémentaire renforçant l'action kératolytique de l'urée pour une exfoliation chimique optimale.",
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes:
        'AHA hydratant et exfoliant doux, participe à la synergie kératolytique et maintient le pH.',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes:
        "Beurre de karité émollient nourrissant. Compense le dessèchement potentiel de l'urée à haute dose.",
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
      notes:
        "Agent apaisant et régénérant cutané. Limite l'irritation liée à la forte concentration en urée.",
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: "Humectant classique attirant l'eau vers la peau pour compléter l'hydratation.",
    },
  ],

  // ── Uriage Keratosane 30 ─────────────────────────────────────────────────────
  [CORPS_PRODUCT_SLUGS.URIAGE_KERATOSANE_30]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      concentrationValue: 30,
      concentrationUnit: '%',
      notes:
        'Concentration élevée pour action kératolytique puissante sur zones rugueuses et épaissies.',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCINE,
      notes:
        "Acide aminé apaisant de l'Eau Thermale d'Uriage. Propriétés calmantes et réparatrices.",
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes:
        'Émollient léger mimétique du sébum. Nourrit sans occlusivité excessive, texture agréable.',
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
      notes:
        "Lipide réparateur de la barrière cutanée. Complète l'action de l'urée en préservant l'intégrité cutanée.",
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_DEXTRAN_SULFATE,
      notes:
        'Agent apaisant complémentaire. Propriétés anti-inflammatoires pour zones sensibilisées.',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: "Humectant support maintenant l'hydratation cutanée pendant l'exfoliation.",
    },
  ],

  // ── Isispharma Urelia 50 ──────────────────────────────────────────────────────

  [CORPS_PRODUCT_SLUGS.ISISPHARMA_URELIA_50]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      concentrationValue: 50,
      concentrationUnit: '%',
      notes: 'Urée pure à concentration maximale pour traitement intensif des plaques épaissies.',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      notes: "AHA synergique amplifiant l'effet exfoliant sur les zones hyperkératosiques.",
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: 'AHA hydratant participant à la kératolyse et au maintien du pH cutané.',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité nourrissant et protecteur. Texture baume confortable.',
    },
    {
      slug: INGREDIENT_SLUGS.PSEUDOALTEROMONAS_FERMENT,
      notes:
        'Extrait marin fermenté aux propriétés régénérantes et réparatrices de la barrière cutanée.',
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
      notes:
        "Agent apaisant et cicatrisant. Contre-balance l'agressivité potentielle de la formule.",
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante protectrice des lipides cutanés.',
    },
  ],

  // ── Topicrem UR-10 ────────────────────────────────────────────────────────────

  [CORPS_PRODUCT_SLUGS.TOPICREM_UR_10]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes:
        "Concentration modérée adaptée à l'usage corporel quotidien. Exfoliation douce + hydratation.",
    },
    {
      slug: INGREDIENT_SLUGS.CIRE_ABEILLE,
      notes:
        "Cire d'abeille émolliente et protectrice. Restaure le film hydrolipidique des peaux extra-sèches.",
    },
    {
      slug: INGREDIENT_SLUGS.CETEARYL_ALCOHOL,
      notes: 'Alcool gras émollient et émulsifiant. Contribue à la texture riche et nourrissante.',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERYL_STEARATE,
      notes: 'Émulsifiant et agent émollient. Stabilise la formule tout en apportant douceur.',
    },
  ],

  // ── Topicrem Ultra Hydratant Crème Riche ──────────────────────────────────────
  [CORPS_PRODUCT_SLUGS.TOPICREM_ULTRA_HYDRATANT_RICHE]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      notes:
        'Urée à concentration modérée (non précisée, probablement 5-10%). Hydratation et exfoliation douce visage.',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes:
        'Beurre de karité nourrissant intense. Adapté aux peaux sensibles sèches à très sèches.',
    },
    {
      slug: INGREDIENT_SLUGS.CIRE_ABEILLE,
      notes: "Cire d'abeille protectrice et émolliente. Renforce la barrière cutanée.",
    },
    {
      slug: INGREDIENT_SLUGS.CAPRYLIC_CAPRIC_TRIGLYCERIDE,
      notes: 'Triglycérides neutres émolients légers. Texture non grasse malgré la richesse.',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: "Humectant principal attirant l'eau et maintenant l'hydratation 24h.",
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante. Protège des agressions extérieures (anti-pollution).',
    },
  ],

  // ── SkinCeuticals Lip Repair ───────────────────────────────────────────────────

  [CORPS_PRODUCT_SLUGS.SKINCEUTICALS_LIP_REPAIR]: [
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes:
        'Vitamine E pure antioxydante et nourrissante. Protège les lèvres des dommages environnementaux.',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHERYL_ACETATE,
      notes: 'Forme stable de Vitamine E. Libération progressive pour action prolongée.',
    },
    {
      slug: INGREDIENT_SLUGS.CHARDON_MARIE,
      notes:
        'Extrait de chardon-Marie antioxydant puissant. Neutralise radicaux libres, prévient vieillissement.',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes:
        "Sel d'acide hyaluronique à bas poids moléculaire. Hydratation profonde et repulpante.",
    },
    {
      slug: INGREDIENT_SLUGS.HYDROXYETHYL_UREA,
      notes: "Dérivé de l'urée aux propriétés hydratantes supérieures. Capture et retient l'eau.",
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
      notes: 'Agent apaisant végétal. Prévient et calme les irritations des lèvres sensibles.',
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_OLIGOPEPTIDE,
      notes:
        'Peptide régénérant stimulant le collagène. Action anti-âge sur le contour des lèvres.',
    },
    {
      slug: INGREDIENT_SLUGS.GLUCOSAMINE_HCL,
      notes: "Précurseur de l'acide hyaluronique. Supporte l'hydratation et la densité cutanée.",
    },
  ],

  // ── The Inkey List Urea 10% ────────────────────────────────────────────────────
  [CORPS_PRODUCT_SLUGS.THE_INKEY_LIST_UREA_10]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: 'Concentration optimale pour visage: hydrate et exfolie délicatement sans agresser.',
    },
    {
      slug: INGREDIENT_SLUGS.COLLOIDAL_OATMEAL,
      notes: "Farine d'avoine colloïdale apaisante. Idéale pour peaux sensibles et réactives.",
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Squalane végétal émollient léger. Renforce barrière sans effet gras.',
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_CARTHAME,
      notes: 'Huile de carthame riche en acide linoléique. Nourrissante et réparatrice.',
    },
    {
      slug: INGREDIENT_SLUGS.CAPRYLIC_CAPRIC_TRIGLYCERIDE,
      notes: 'Triglycérides légers émolients. Texture fluide et absorption rapide.',
    },
    {
      slug: INGREDIENT_SLUGS.CETEARYL_ALCOHOL,
      notes: 'Alcool gras émollient et stabilisant. Texture crème confortable.',
    },
  ],

  // ── ISDIN Ureadin Ultra 20 ─────────────────────────────────────────────────────

  [CORPS_PRODUCT_SLUGS.ISDIN_UREADIN_ULTRA_20]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      concentrationValue: 20,
      concentrationUnit: '%',
      notes:
        'Urée ISDIN 20% - concentration équilibrée pour traitement et entretien des peaux très sèches.',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes:
        'Provitamine B5 (Dexpanthénol). Réparatrice et apaisante, favorise régénération cutanée.',
    },
    {
      slug: INGREDIENT_SLUGS.AVOCADO_OIL,
      notes: "Huile d'avocat riche en acides gras essentiels. Nourrissante et régénérante.",
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
      notes: "Agent apaisant et protecteur. Complète l'action de la provitamine B5.",
    },
    {
      slug: INGREDIENT_SLUGS.GLYCINE,
      notes: "Acide aminé composant du NMF. Maintient l'hydratation naturelle.",
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: "AHA et composant du NMF. Maintient le pH et participe à l'hydratation.",
    },
  ],

  // ── ISDIN Ureadin Ultra 30 ─────────────────────────────────────────────────────
  [CORPS_PRODUCT_SLUGS.ISDIN_UREADIN_ULTRA_30]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      concentrationValue: 30,
      concentrationUnit: '%',
      notes:
        'Urée ISDIN 30% - concentration élevée pour traitement localisé des zones épaissies et durillons.',
    },
    {
      slug: INGREDIENT_SLUGS.ARGININE,
      notes:
        'Acide aminé basique régulateur de pH et hydratant. Améliore la pénétration des actifs.',
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: 'AHA complémentaire pour synergie kératolytique. Exfoliation chimique renforcée.',
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
      notes:
        'Agent apaisant contre les sensations de picotements potentielles à cette concentration.',
    },
    {
      slug: INGREDIENT_SLUGS.DIMETHICONE,
      notes: 'Silicone émollient et protecteur. Texture non grasse et confortable.',
    },
  ],

  // ── ISDIN Ureadin Ultra 10 Lotion Plus ─────────────────────────────────────────

  [CORPS_PRODUCT_SLUGS.ISDIN_UREADIN_ULTRA_10_LOTION]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: 'Urée ISDIN 10% - concentration adaptée pour hydratation quotidienne corps entier.',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Dexpanthénol réparateur et apaisant. Restauration de la barrière cutanée.',
    },
    {
      slug: INGREDIENT_SLUGS.AVOCADO_OIL,
      notes: "Huile d'avocat nourrissante. Enrichit la lotion pour peaux très sèches.",
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER, // Shorea Stenoptera = Illipe = Beurre végétal proche karité
      notes: 'Beurre de graines Shorea (Illipe). Émollient riche pour peaux desséchées.',
    },
    {
      slug: INGREDIENT_SLUGS.DIMETHICONE,
      notes: 'Silicone protecteur. Texture légère non grasse et absorption rapide.',
    },
  ],

  // ── Eucerin UreaRepair 30 ──────────────────────────────────────────────────────
  [CORPS_PRODUCT_SLUGS.EUCERIN_UREAREPAIR_30]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      concentrationValue: 30,
      concentrationUnit: '%',
      notes:
        'Urée hautement concentrée pour exfoliation douce des zones extrêmement sèches et squameuses.',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes:
        'Céramide 3 essentiel pour réparation de la barrière cutanée. Cœur de la technologie Eucerin.',
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
      notes: "Lipide barrière complémentaire des céramides. Restauration de l'intégrité cutanée.",
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_LACTATE,
      notes: "Sel d'acide lactique, composant majeur du NMF. Hydratation naturelle et pH cutané.",
    },
    {
      slug: INGREDIENT_SLUGS.ARGININE,
      notes: 'Acide aminé du NMF. Propriétés hydratantes et régénérantes.',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_PCA,
      notes: "Dérivé pyrrolidone carboxylique, composant NMF. Retention d'eau cutanée.",
    },
    {
      slug: INGREDIENT_SLUGS.ALANINE,
      notes: "Acide aminé du NMF. Maintien de l'hydratation naturelle.",
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_GRAINES_TOURNESOL,
      notes: 'Huile de tournesol riche en acide linoléique. Émolliente et apaisante.',
    },
  ],
}

// Export pour compatibilité descendante
export const CORPS_PRODUCT_INGREDIENTS = Object.entries(CORPS_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
