import { TAG_SLUGS } from '../../tags/seed-tags'
import { ANUA_PRODUCT_SLUGS } from './anua'

interface ProductTagGroups {
  primary: string[]
  secondary: string[]
  avoid: string[]
}

export const ANUA_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Heartleaf 77% Soothing Toner (apaisant, houttuynia cordata, pH doux, tous types idéal sensible/acnéique)
  [ANUA_PRODUCT_SLUGS.ANUA_HEARTLEAF_77_SOOTHING]: {
    primary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.TONIQUE,
      TAG_SLUGS.SANS_PARFUM,
    ],
    secondary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.PEAU_ATOPIQUE, TAG_SLUGS.APAISANT],
    avoid: [],
  },

  // ── Rice 70 Glow Milky Toner (riz 70% + niacinamide, éclaircissant, céramides, hydratant léger, sans parfum)
  [ANUA_PRODUCT_SLUGS.ANUA_RICE_70_GLOW_MILKY]: {
    primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.TONIQUE, TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.SANS_PARFUM],
    secondary: [
      TAG_SLUGS.ANTI_TACHES,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.SEBO_REGULATEUR,
    ],
    avoid: [],
  },

  // ── Azelaic Acid 10% Hyaluron Redness Soothing Serum (TOP : céramide NP, 7x centella, betaine salicylate doux, post-IPL compatible)
  [ANUA_PRODUCT_SLUGS.ANUA_AZELAIC_10_HYDRATING_REDNESS]: {
    primary: [
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.ANTI_ACNE,
      TAG_SLUGS.HYPERPIGMENTATION,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.SANS_PARFUM,
    ],
    secondary: [
      TAG_SLUGS.ROSACEE,
      TAG_SLUGS.ANTI_TACHES,
      TAG_SLUGS.POST_ACNE,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.NON_COMEDOGENE,
    ],
    avoid: [],
  },

  // ── Azelaic Acid 3% Cica Skin Clarifying Toner (3% azélaïque + cica + multi-acides — concentration faible, HE irritantes, incompatible rétinal/post-IPL)
  [ANUA_PRODUCT_SLUGS.ANUA_AZELAIC_3_CICA_TONER]: {
    primary: [
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.ANTI_ACNE,
      TAG_SLUGS.TONIQUE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.SANS_PARFUM,
    ],
    secondary: [TAG_SLUGS.BRILLANCE, TAG_SLUGS.EXFOLIANT],
    avoid: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.PEAU_REACTIVE],
  },
}
