import { TAG_SLUGS } from '../../tags/seed-tags'
import { KOREAN_PRODUCT_SLUGS } from './koreanSkincare'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Actions correctives & Bénéfices cibles)
  secondary: string[] // Tags secondaires (Format, Type de peau, Caractéristiques techniques)
  avoid: string[] // Tags à éviter/exclure
}

export const KOREAN_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── COSRX - Advanced Snail 96 Mucin Essence
  [KOREAN_PRODUCT_SLUGS.COSRX_ADVANCED_SNAIL_96]: {
    primary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.ECLAT],
    secondary: [TAG_SLUGS.ESSENCE, TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.SANS_PARFUM],
    avoid: [],
  },

  // ── SOME BY MI - 30 Days Miracle Clear Spot Patch
  [KOREAN_PRODUCT_SLUGS.SOME_BY_MI_30_DAYS_MIRACLE_PATCH]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.REPARATEUR],
    secondary: [
      TAG_SLUGS.PROTECTION_CUTANEE, // Ajouté pour le format patch "pansement"
    ],
    avoid: [],
  },

  // ── Dr.G - R.E.D Blemish Cica Soothing Cream
  [KOREAN_PRODUCT_SLUGS.DRG_RED_BLEMISH_CICA_SOOTHING]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.REPARATEUR, TAG_SLUGS.APAISANT],
    secondary: [TAG_SLUGS.CREME_HYDRATANTE, TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.NON_COMEDOGENE],
    avoid: [],
  },

  // ── Purito SEOUL - Oat-In Calming Gel Cream
  [KOREAN_PRODUCT_SLUGS.PURITO_OAT_IN_CALMING_GEL]: {
    primary: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.APAISANT],
    secondary: [
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.VEGAN,
      TAG_SLUGS.TEXTURE_LEGERE,
    ],
    avoid: [],
  },

  // ── COSRX - Advanced Snail 92 All In One Cream
  [KOREAN_PRODUCT_SLUGS.COSRX_ADVANCED_SNAIL_92]: {
    primary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.ANTI_AGE],
    secondary: [TAG_SLUGS.CREME_HYDRATANTE, TAG_SLUGS.SANS_PARFUM],
    avoid: [],
  },

  // ── Isntree - Hyaluronic Acid Moist Cream
  [KOREAN_PRODUCT_SLUGS.ISNTREE_HYALURONIC_ACID_MOIST]: {
    primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.HUMECTANT],
    secondary: [TAG_SLUGS.CREME_HYDRATANTE, TAG_SLUGS.PEAU_NORMALE, TAG_SLUGS.SANS_PARFUM],
    avoid: [],
  },
}
