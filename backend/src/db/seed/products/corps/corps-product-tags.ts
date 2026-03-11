import { TAG_SLUGS } from '../../tags/seed-tags'
import { CORPS_PRODUCT_SLUGS } from './corps'

interface ProductTagGroups {
  primary: string[] // Préoccupations majeures + actions clés
  secondary: string[] // Type de produit, étapes routine, propriétés, labels
  avoid: string[] // Exclusions (incompatibilités avec le produit)
}

export const CORPS_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ─── CeraVe SA Anti-Rugosités : Exfoliation + hydratation barrière
  [CORPS_PRODUCT_SLUGS.CERAVE_SA_ANTI_RUGOSITES]: {
    primary: [
      TAG_SLUGS.PEAU_RUGUEUSE,
      TAG_SLUGS.KERATOSE_PILAIRE,
      TAG_SLUGS.EXFOLIATION,
      TAG_SLUGS.KERATOLYTIQUE,
    ],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.CREME_CORPS,
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.BIOMIMETIQUE,
      TAG_SLUGS.ZONE_CORPS,
    ],
    avoid: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
    ],
  },

  // ─── CeraVe Baume Hydratant : Occlusion intensive barrière, très riche
  [CORPS_PRODUCT_SLUGS.CERAVE_BAUME_HYDRATANT]: {
    primary: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.REPARATEUR],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.BAUME,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.OCCLUSIF,
      TAG_SLUGS.TEXTURE_RICHE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.BIOMIMETIQUE,
      TAG_SLUGS.GROSSESSE_COMPATIBLE,
      TAG_SLUGS.ZONE_CORPS,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [TAG_SLUGS.PEAU_GRASSE, TAG_SLUGS.PEAU_MIXTE],
  },

  // ─── CeraVe Crème Hydratante : Hydratation quotidienne équilibrée
  [CORPS_PRODUCT_SLUGS.CERAVE_CREME_HYDRATANTE]: {
    primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.BARRIERE_CUTANEE],
    secondary: [
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.CREME_CORPS,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.BIOMIMETIQUE,
      TAG_SLUGS.GROSSESSE_COMPATIBLE,
      TAG_SLUGS.ZONE_CORPS,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [TAG_SLUGS.PEAU_GRASSE],
  },

  // ─── CeraVe Lait Hydratant : Texture légère absorption rapide
  [CORPS_PRODUCT_SLUGS.CERAVE_LAIT_HYDRATANT]: {
    primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.BARRIERE_CUTANEE],
    secondary: [
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.LAIT_CORPS,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.BIOMIMETIQUE,
      TAG_SLUGS.GROSSESSE_COMPATIBLE,
      TAG_SLUGS.ZONE_CORPS,
    ],
    avoid: [TAG_SLUGS.PEAU_GRASSE],
  },

  // ─── Eucerin UreaRepair PLUS Lotion 10% : Urée kératolytique + exfoliation douce
  [CORPS_PRODUCT_SLUGS.EUCERIN_UREAREPAIR_LOTION_10]: {
    primary: [
      TAG_SLUGS.PEAU_RUGUEUSE,
      TAG_SLUGS.KERATOSE_PILAIRE,
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.KERATOLYTIQUE,
    ],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.EXFOLIATION,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.BIOMIMETIQUE,
      TAG_SLUGS.ZONE_CORPS,
    ],
    avoid: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
    ],
  },

  // ─── Eucerin UreaRepair PLUS Crème 5% : Urée douce + hydratation équilibrée
  [CORPS_PRODUCT_SLUGS.EUCERIN_UREAREPAIR_CREME_5]: {
    primary: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.BARRIERE_CUTANEE],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.CREME_CORPS,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.BIOMIMETIQUE,
      TAG_SLUGS.ZONE_CORPS,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE],
  },

  // ─── Eucerin AtopiControl Baume : Eczéma + atopie, occlusion apaisante
  [CORPS_PRODUCT_SLUGS.EUCERIN_ATOPICONTROL_BAUME]: {
    primary: [
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.ECZEMA,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.APAISANT,
    ],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.BAUME,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.OCCLUSIF,
      TAG_SLUGS.TEXTURE_RICHE,
      TAG_SLUGS.ANTI_OXYDANT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.BIOMIMETIQUE,
      TAG_SLUGS.GROSSESSE_COMPATIBLE,
      TAG_SLUGS.ZONE_CORPS,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [TAG_SLUGS.PEAU_GRASSE, TAG_SLUGS.PEAU_MIXTE],
  },

  // ─── AmLactin Daily Nourish 12% AHA : Acide lactique humectant + exfoliation
  [CORPS_PRODUCT_SLUGS.AMLACTIN_DAILY_NOURISH_12_AHA]: {
    primary: [
      TAG_SLUGS.PEAU_RUGUEUSE,
      TAG_SLUGS.KERATOSE_PILAIRE,
      TAG_SLUGS.EXFOLIATION,
      TAG_SLUGS.DESHYDRATATION,
    ],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.LAIT_CORPS,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.ZONE_CORPS,
    ],
    avoid: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
    ],
  },

  // ─── Paula's Choice Lait Corps 10% AHA : Glycolic acid exfoliation intensif
  [CORPS_PRODUCT_SLUGS.PAULAS_CHOICE_LAIT_CORPS_10_AHA]: {
    primary: [
      TAG_SLUGS.PEAU_RUGUEUSE,
      TAG_SLUGS.KERATOSE_PILAIRE,
      TAG_SLUGS.EXFOLIATION,
      TAG_SLUGS.ANTI_TACHES,
    ],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.LAIT_CORPS,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ANTI_OXYDANT,
      TAG_SLUGS.ZONE_CORPS,
    ],
    avoid: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
    ],
  },

  // ─── Remedy Science KP Body Moisturizer : Urée + acide lactique + rétinol
  [CORPS_PRODUCT_SLUGS.REMEDY_KP_BODY_MOISTURIZER]: {
    primary: [
      TAG_SLUGS.PEAU_RUGUEUSE,
      TAG_SLUGS.KERATOSE_PILAIRE,
      TAG_SLUGS.EXFOLIATION,
      TAG_SLUGS.ANTI_AGE,
    ],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.LAIT_CORPS,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.ZONE_CORPS,
    ],
    avoid: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
      TAG_SLUGS.GROSSESSE_COMPATIBLE,
    ],
  },

  // ─── BYOMA Blemish Control Body Lotion : BHA anti-imperfections légère
  [CORPS_PRODUCT_SLUGS.BYOMA_BLEMISH_CONTROL_BODY_LOTION]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.PORES_DILATES, TAG_SLUGS.BRILLANCE],
    secondary: [
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.LAIT_CORPS,
      TAG_SLUGS.EXFOLIATION,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.ZONE_CORPS,
    ],
    avoid: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
    ],
  },

  [CORPS_PRODUCT_SLUGS.XEROLYS_50]: {
    primary: [
      TAG_SLUGS.KERATOSE_PILAIRE, // Zones épaissies
      TAG_SLUGS.GRAIN_PEAU, // Texture irrégulière
    ],
    secondary: [
      TAG_SLUGS.CREME_CORPS, // Format crème corps
      TAG_SLUGS.ZONE_MAINS, // Zone mains
      TAG_SLUGS.ZONE_CORPS, // Zone corps (coudes, pieds)
      TAG_SLUGS.SOIN_LOCALISE, // Application ciblée
      TAG_SLUGS.KERATOLYTIQUE, // Action exfoliante chimique
      TAG_SLUGS.HUMECTANT, // Propriété hydratante urée
      TAG_SLUGS.EMOLLIENT, // Beurre de karité
      TAG_SLUGS.REPARATEUR, // Restauration barrière
      TAG_SLUGS.TEXTURE_RICHE, // Émulsion Eau dans Huile
      TAG_SLUGS.OCCLUSIF, // Effet filmogène
    ],
    avoid: [
      TAG_SLUGS.PEAU_SENSIBLE, // 50% urée trop forte
      TAG_SLUGS.ZONE_VISAGE, // Non pour visage
      TAG_SLUGS.ZONE_YEUX, // Éviter contour yeux
    ],
  },

  // ── Uriage Keratosane 30 ─────────────────────────────────────────────────────
  [CORPS_PRODUCT_SLUGS.URIAGE_KERATOSANE_30]: {
    primary: [TAG_SLUGS.KERATOSE_PILAIRE, TAG_SLUGS.GRAIN_PEAU],
    secondary: [
      TAG_SLUGS.GEL_CREME, // Format gel-crème
      TAG_SLUGS.ZONE_CORPS,
      TAG_SLUGS.SOIN_LOCALISE,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.APAISANT, // Eau thermale Uriage
      TAG_SLUGS.PROTECTION_CUTANEE, // Barrière cutanée
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.TEXTURE_LEGERE, // Gel plus léger
    ],
    avoid: [
      TAG_SLUGS.ZONE_VISAGE, // Éviter visage sauf zones très localisées
    ],
  },

  // ── Isispharma Urelia 50 ──────────────────────────────────────────────────────
  [CORPS_PRODUCT_SLUGS.ISISPHARMA_URELIA_50]: {
    primary: [
      TAG_SLUGS.KERATOSE_PILAIRE,
      TAG_SLUGS.ECZEMA, // Peaux fragilisées
    ],
    secondary: [
      TAG_SLUGS.BAUME, // Format baume
      TAG_SLUGS.ZONE_CORPS,
      TAG_SLUGS.SOIN_LOCALISE,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.EMOLLIENT, // Beurre de karité
      TAG_SLUGS.REPARATEUR, // Extrait marin régénérant
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.TEXTURE_RICHE,
      TAG_SLUGS.SANS_PARFUM,
    ],
    avoid: [TAG_SLUGS.ZONE_VISAGE],
  },

  // ── Topicrem UR-10 ───────────────────────────────────────────────────────────
  [CORPS_PRODUCT_SLUGS.TOPICREM_UR_10]: {
    primary: [
      TAG_SLUGS.DESHYDRATATION, // Hydratation intense
      TAG_SLUGS.GRAIN_PEAU, // Peau de croco
    ],
    secondary: [
      TAG_SLUGS.CREME_CORPS,
      TAG_SLUGS.LAIT_CORPS, // Grand format type lait
      TAG_SLUGS.ZONE_CORPS,
      TAG_SLUGS.HYDRATATION, // Routine étape hydratation
      TAG_SLUGS.EMOLLIENCE, // Cire d'abeille émolliente
      TAG_SLUGS.HUMECTANT, // 10% urée
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.TEXTURE_RICHE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_ATOPIQUE, // Extra-sèches
    ],
    avoid: [
      TAG_SLUGS.ZONE_VISAGE, // Contre-indiqué visage
      TAG_SLUGS.ZONE_YEUX,
      TAG_SLUGS.PEAU_GRASSE, // Trop riche
    ],
  },

  // ── Topicrem Ultra Hydratant Crème Riche ─────────────────────────────────────
  [CORPS_PRODUCT_SLUGS.TOPICREM_ULTRA_HYDRATANT_RICHE]: {
    primary: [
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.TEINT_TERNE, // Éclat du teint
    ],
    secondary: [
      TAG_SLUGS.CREME_HYDRATANTE, // Format crème visage
      TAG_SLUGS.ZONE_VISAGE,
      TAG_SLUGS.MATIN, // 24h hydratation
      TAG_SLUGS.SOIR,
      TAG_SLUGS.HYDRATATION,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.ANTI_OXYDANT, // Anti-pollution
      TAG_SLUGS.ECLAT, // Teint éclatant
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.TEXTURE_RICHE,
    ],
    avoid: [],
  },

  // ── SkinCeuticals Lip Repair ─────────────────────────────────────────────────
  [CORPS_PRODUCT_SLUGS.SKINCEUTICALS_LIP_REPAIR]: {
    primary: [
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.ANTI_AGE, // Anti-âge lèvres
    ],
    secondary: [
      TAG_SLUGS.SOIN_LEVRES, // Format soin lèvres
      TAG_SLUGS.ZONE_LEVRES,
      TAG_SLUGS.SERUM, // Sérum gel
      TAG_SLUGS.SOIN_LOCALISE,
      TAG_SLUGS.ANTI_OXYDANT, // Silymarine, Vit E
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.HUMECTANT, // Acide hyaluronique
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.APAISANT, // Allantoïne
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
    ],
    avoid: [
      TAG_SLUGS.ZONE_VISAGE, // Spécifique lèvres
      TAG_SLUGS.KERATOLYTIQUE, // Pas d'action exfoliante
    ],
  },

  // ── The Inkey List Urea 10% ──────────────────────────────────────────────────
  [CORPS_PRODUCT_SLUGS.THE_INKEY_LIST_UREA_10]: {
    primary: [
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.GRAIN_PEAU, // Exfoliation douce
    ],
    secondary: [
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.ZONE_VISAGE, // Spécialement visage
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.HYDRATATION,
      TAG_SLUGS.KERATOLYTIQUE, // Exfoliation douce 10%
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.EMOLLIENT, // Squalane
      TAG_SLUGS.APAISANT, // Avoine
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.TEXTURE_LEGERE,
    ],
    avoid: [
      TAG_SLUGS.PEAU_GRASSE, // Peut être riche
    ],
  },

  // ── ISDIN Ureadin Ultra 20 ───────────────────────────────────────────────────

  [CORPS_PRODUCT_SLUGS.ISDIN_UREADIN_ULTRA_20]: {
    primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.GRAIN_PEAU],
    secondary: [
      TAG_SLUGS.CREME_CORPS,
      TAG_SLUGS.ZONE_CORPS,
      TAG_SLUGS.ZONE_MAINS,
      TAG_SLUGS.HYDRATATION,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.EMOLLIENT, // Huile d'avocat
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.PROTECTION_CUTANEE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.TEXTURE_LEGERE, // Non grasse
    ],
    avoid: [
      TAG_SLUGS.ZONE_VISAGE, // Préférable éviter visage
      TAG_SLUGS.PEAU_GRASSE,
    ],
  },

  // ── ISDIN Ureadin Ultra 30 ───────────────────────────────────────────────────
  [CORPS_PRODUCT_SLUGS.ISDIN_UREADIN_ULTRA_30]: {
    primary: [
      TAG_SLUGS.KERATOSE_PILAIRE, // Zones épaissies
      TAG_SLUGS.GRAIN_PEAU,
    ],
    secondary: [
      TAG_SLUGS.CREME_CORPS,
      TAG_SLUGS.ZONE_CORPS,
      TAG_SLUGS.ZONE_MAINS,
      TAG_SLUGS.SOIN_LOCALISE, // Durillons
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.TEXTURE_LEGERE,
    ],
    avoid: [
      TAG_SLUGS.ZONE_VISAGE,
      TAG_SLUGS.PEAU_SENSIBLE, // 30% peut piquer
    ],
  },

  // ── ISDIN Ureadin Ultra 10 Lotion Plus ───────────────────────────────────────

  [CORPS_PRODUCT_SLUGS.ISDIN_UREADIN_ULTRA_10_LOTION]: {
    primary: [
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.BARRIERE_CUTANEE, // Restauration barrière
    ],
    secondary: [
      TAG_SLUGS.LAIT_CORPS, // Format lotion fluide
      TAG_SLUGS.ZONE_CORPS,
      TAG_SLUGS.MATIN, // Usage quotidien
      TAG_SLUGS.SOIR,
      TAG_SLUGS.HYDRATATION,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.REPARATEUR, // Dexpanthénol
      TAG_SLUGS.PROTECTION_CUTANEE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.TEXTURE_LEGERE, // Légère et rapide
      TAG_SLUGS.PEAU_ATOPIQUE, // Xérose
    ],
    avoid: [],
  },

  // ── Eucerin UreaRepair 30 ────────────────────────────────────────────────────

  [CORPS_PRODUCT_SLUGS.EUCERIN_UREAREPAIR_30]: {
    primary: [
      TAG_SLUGS.KERATOSE_PILAIRE,
      TAG_SLUGS.BARRIERE_CUTANEE, // Céramides réparateurs
    ],
    secondary: [
      TAG_SLUGS.CREME_CORPS,
      TAG_SLUGS.ZONE_CORPS,
      TAG_SLUGS.ZONE_MAINS,
      TAG_SLUGS.SOIN_LOCALISE,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.PROTECTION_CUTANEE, // Céramides + NMF
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE, // Eucerin standard
      TAG_SLUGS.PEAU_ATOPIQUE, // Psoriasis compatible
    ],
    avoid: [
      TAG_SLUGS.ZONE_VISAGE, // Trop fort pour visage
      TAG_SLUGS.PEAU_SENSIBLE, // 30% urée
    ],
  },
}
