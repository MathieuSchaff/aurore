import { TAG_SLUGS } from '../../tags/seed-tags'
import { TONERS_PRODUCT_SLUGS } from './toners'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Actions & Bénéfices clés)
  secondary: string[] // Tags secondaires (Type de peau, textures, attributs)
  avoid: string[] // Tags à éviter/exclure
}

export const TONERS_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Haruharu Wonder
  [TONERS_PRODUCT_SLUGS.HARUHARU_BLACK_RICE_HYALURONIC_FF]: {
    primary: [TAG_SLUGS.TONIQUE, TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.ECLAT],
    secondary: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.SANS_PARFUM, TAG_SLUGS.HUMECTANT],
    avoid: [],
  },

  // ── I'm from
  [TONERS_PRODUCT_SLUGS.IM_FROM_RICE_TONER]: {
    primary: [TAG_SLUGS.TONIQUE, TAG_SLUGS.ECLAT, TAG_SLUGS.ANTI_AGE],
    secondary: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.EMOLLIENT],
    avoid: [],
  },

  // ── EQQUALBERRY
  [TONERS_PRODUCT_SLUGS.EQQUALBERRY_SWIMMING_POOL]: {
    primary: [TAG_SLUGS.TONIQUE, TAG_SLUGS.EXFOLIANT, TAG_SLUGS.PORES_DILATES],
    secondary: [TAG_SLUGS.HYPOALLERGENIQUE, TAG_SLUGS.ANTI_OXYDANT],
    avoid: [],
  },

  // ── Mixsoon
  [TONERS_PRODUCT_SLUGS.MIXSOON_CENTELLA_ASIATICA]: {
    primary: [TAG_SLUGS.TONIQUE, TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.REPARATEUR],
    secondary: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.SANS_PARFUM],
    avoid: [],
  },

  // ── Numbuzin No.9 NAD+ PDRN Glow
  [TONERS_PRODUCT_SLUGS.NUMBUZIN_NO9_NAD_PDRN_GLOW]: {
    primary: [TAG_SLUGS.TONIQUE, TAG_SLUGS.ANTI_AGE, TAG_SLUGS.ECLAT],
    secondary: [TAG_SLUGS.NON_COMEDOGENE, TAG_SLUGS.REPULPANT],
    avoid: [],
  },

  // ── Numbuzin No.1 Pure-Full Calming
  [TONERS_PRODUCT_SLUGS.NUMBUZIN_NO1_PURE_FULL_CALMING]: {
    primary: [TAG_SLUGS.TONIQUE, TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.ANTI_ROUGEURS],
    secondary: [TAG_SLUGS.NON_COMEDOGENE, TAG_SLUGS.APAISANT],
    avoid: [],
  },

  // ── Numbuzin No.5+ Glutathione Vitamin
  [TONERS_PRODUCT_SLUGS.NUMBUZIN_NO5_GLUTATHIONE_VITAMIN]: {
    primary: [
      TAG_SLUGS.TONIQUE,
      TAG_SLUGS.ANTI_TACHES,
      TAG_SLUGS.HYPERPIGMENTATION,
      TAG_SLUGS.ECLAT,
    ],
    secondary: [TAG_SLUGS.NON_COMEDOGENE],
    avoid: [],
  },

  // ── Round Lab 1025 Dokdo
  [TONERS_PRODUCT_SLUGS.ROUND_LAB_1025_DOKDO]: {
    primary: [TAG_SLUGS.TONIQUE, TAG_SLUGS.EXFOLIANT, TAG_SLUGS.DESHYDRATATION],
    secondary: [TAG_SLUGS.TEXTURE_LEGERE, TAG_SLUGS.APAISANT],
    avoid: [],
  },
}
