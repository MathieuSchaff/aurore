import { TAG_SLUGS } from '../../tags/seed-tags'
import { ANUA_PRODUCT_SLUGS } from './anua'

interface ProductTagGroups {
  primary: string[] // Préoccupations majeures + actions clés
  secondary: string[] // Type de produit, étapes routine, propriétés, labels
  avoid: string[] // Exclusions (incompatibilités avec le produit)
}

export const ANUA_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Heartleaf 77% Soothing Toner : Apaisement doux tous types, idéal sensible/acnéique
  [ANUA_PRODUCT_SLUGS.ANUA_HEARTLEAF_77_SOOTHING]: {
    primary: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.APAISANT],
    secondary: [
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.TONIQUE,
      TAG_SLUGS.PREPARATION,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.PEAU_TOUS_TYPES,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ── Rice 70 Glow Milky Toner : Éclat + hydratation légère, équilibre sébum
  [ANUA_PRODUCT_SLUGS.ANUA_RICE_70_GLOW_MILKY]: {
    primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.BARRIERE_CUTANEE],
    secondary: [
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.TONIQUE,
      TAG_SLUGS.PREPARATION,
      TAG_SLUGS.HYDRATATION,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.SEBO_REGULATEUR,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.ANTI_TACHES,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ── Azelaic Acid 10% Hyaluron Redness Soothing Serum : TOP recommandé post-IPL, céramides essentiels
  [ANUA_PRODUCT_SLUGS.ANUA_AZELAIC_10_HYDRATING_REDNESS]: {
    primary: [
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.HYPERPIGMENTATION,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.REPARATEUR,
    ],
    secondary: [
      TAG_SLUGS.ROSACEE,
      TAG_SLUGS.COUPEROSE,
      TAG_SLUGS.ANTI_ACNE,
      TAG_SLUGS.POST_ACNE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ── Azelaic Acid 3% Cica Skin Clarifying Toner : Concentration faible, multi-acides + HE irritantes
  [ANUA_PRODUCT_SLUGS.ANUA_AZELAIC_3_CICA_TONER]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.ECLAT, TAG_SLUGS.PEAU_GRASSE],
    secondary: [
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.BRILLANCE,
      TAG_SLUGS.TONIQUE,
      TAG_SLUGS.EXFOLIATION,
      TAG_SLUGS.PREPARATION,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.ROSACEE,
      TAG_SLUGS.COUPEROSE,
      // Incompatible post-IPL et rétinal (HE irritantes + concentration faible + multi-acides)
    ],
  },
}
