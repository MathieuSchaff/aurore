import { TAG_SLUGS } from '../../tags/seed-tags'
import { ADERMA_PRODUCT_SLUGS } from './aDerma'

interface ProductTagGroups {
  primary: string[] // Actions prioritaires (Atopie, Anti-rougeurs, Anti-grattage)
  secondary: string[] // Labels, Types de peau, Routine
  avoid: string[] // Exclusions (Parfum pour peaux réactives, etc.)
}

export const ADERMA_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Biology AR : Soin dermatologique certifié Bio anti-rougeurs
  [ADERMA_PRODUCT_SLUGS.ADERMA_BIOLOGY_AR]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.BIO_NATUREL],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.VEGAN,
      TAG_SLUGS.TEXTURE_LEGERE,
    ],
    avoid: [],
  },

  // ── Exomega Control Lait Émollient : Anti-grattage peaux atopiques
  [ADERMA_PRODUCT_SLUGS.ADERMA_EXOMEGA_LAIT_EMOLLIENT]: {
    primary: [TAG_SLUGS.PEAU_ATOPIQUE, TAG_SLUGS.REPARATEUR, TAG_SLUGS.APAISANT],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.BARRIERE_CUTANEE,
    ],
    avoid: [TAG_SLUGS.PEAU_GRASSE],
  },

  // ── Exomega Control Huile Lavante : Nettoyage doux dès la naissance
  [ADERMA_PRODUCT_SLUGS.ADERMA_EXOMEGA_HUILE_500]: {
    primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.PEAU_ATOPIQUE, TAG_SLUGS.APAISANT],
    secondary: [
      TAG_SLUGS.HUILE,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.SANS_SAVON,
    ],
    avoid: [],
  },

  // ── Gel Douche Surgras : Hygiène quotidienne peaux fragiles
  [ADERMA_PRODUCT_SLUGS.ADERMA_GEL_DOUCHE_SURGRAS]: {
    primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.PEAU_SENSIBLE],
    secondary: [TAG_SLUGS.EMOLLIENT, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.PEAU_SECHE],
    avoid: [
      TAG_SLUGS.SANS_PARFUM, // Ce gel douche contient du parfum
    ],
  },

  // ── Lait Corps Hydratant 72h : Hydratation universelle
  [ADERMA_PRODUCT_SLUGS.ADERMA_LAIT_CORPS_72H]: {
    primary: [TAG_SLUGS.DESHYDRATATION],
    secondary: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.VEGAN, TAG_SLUGS.TEXTURE_LEGERE],
    avoid: [],
  },
}
