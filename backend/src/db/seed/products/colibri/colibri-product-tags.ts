import { TAG_SLUGS } from '../../tags/seed-tags'
import { COLIBRI_PRODUCT_SLUGS } from './colibri'

interface ProductTagGroups {
  primary: string[] // Préoccupations majeures + actions clés
  secondary: string[] // Type de produit, étapes routine, propriétés, labels
  avoid: string[] // Exclusions (incompatibilités avec le produit)
}

export const COLIBRI_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Brightening Booster : Azélaïque 10% + Mandélique, post-IPL compatible
  [COLIBRI_PRODUCT_SLUGS.COLIBRI_BRIGHTENING_BOOSTER]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ECLAT],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.ZONE_VISAGE,
      TAG_SLUGS.NON_COMEDOGENE,
    ],
    avoid: [],
  },

  // ── Pore Control Booster : Niacinamide 8% + NMN 4%, régulation sébum
  [COLIBRI_PRODUCT_SLUGS.PORE_CONTROL_BOOSTER]: {
    primary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.BRILLANCE, TAG_SLUGS.SEBO_REGULATEUR],
    secondary: [
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.ANTI_ACNE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [TAG_SLUGS.PEAU_SECHE],
  },

  // ── Calming Moisturizer : Centella + HA + Céramide NP, apaisement barrière
  [COLIBRI_PRODUCT_SLUGS.CALMING_MOISTURIZER]: {
    primary: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.APAISANT],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ── Vitamin C 20 Booster : 3 dérivés stables 20%, anti-âge intensif
  [COLIBRI_PRODUCT_SLUGS.VITAMIN_C_20_BOOSTER]: {
    primary: [TAG_SLUGS.ANTI_OXYDANT, TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ANTI_AGE],
    secondary: [
      TAG_SLUGS.ECLAT,
      TAG_SLUGS.HYPERPIGMENTATION,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.PHOTO_VIEILLISSEMENT,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [
      TAG_SLUGS.PEAU_REACTIVE, // Concentration 20% très élevée
      TAG_SLUGS.PEAU_SENSIBLE,
    ],
  },

  // ── Vitamin C15 Booster : Formule aqueuse légère 15%, accessible
  [COLIBRI_PRODUCT_SLUGS.VITAMIN_C15_BOOSTER]: {
    primary: [TAG_SLUGS.ANTI_OXYDANT, TAG_SLUGS.ECLAT],
    secondary: [
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.ANTI_TACHES,
      TAG_SLUGS.ANTI_AGE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.PHOTO_VIEILLISSEMENT,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ── Barrier Booster : 5 céramides + Ectoine, réparation intensive barrière
  [COLIBRI_PRODUCT_SLUGS.BARRIER_BOOSTER]: {
    primary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.REPARATEUR, TAG_SLUGS.PEAU_ATOPIQUE],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.OCCLUSIF,
      TAG_SLUGS.TEXTURE_RICHE,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [TAG_SLUGS.PEAU_GRASSE],
  },

  // ── Antioxidant Serum : Resvératrol + SOD, protection vieillissement photo
  [COLIBRI_PRODUCT_SLUGS.ANTIOXIDANT_SERUM]: {
    primary: [TAG_SLUGS.ANTI_OXYDANT, TAG_SLUGS.ANTI_AGE, TAG_SLUGS.PHOTO_VIEILLISSEMENT],
    secondary: [
      TAG_SLUGS.ECLAT,
      TAG_SLUGS.PROTECTION_CUTANEE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },
}
