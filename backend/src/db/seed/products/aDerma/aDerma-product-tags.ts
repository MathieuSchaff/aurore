import { TAG_SLUGS } from '../../tags/seed-tags'
import { ADERMA_PRODUCT_SLUGS } from './aDerma'

interface ProductTagGroups {
  primary: string[] // Préoccupations majeures + actions clés
  secondary: string[] // Type de produit, étapes routine, propriétés, labels
  avoid: string[] // Exclusions (incompatibilités avec le produit)
}

export const ADERMA_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Biology AR : Soin appaisant certifié Bio pour peaux réactives
  [ADERMA_PRODUCT_SLUGS.ADERMA_BIOLOGY_AR]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.APAISANT],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.VEGAN,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ── Exomega Control Lait Émollient : Anti-grattage pour peaux atopiques
  [ADERMA_PRODUCT_SLUGS.ADERMA_EXOMEGA_LAIT_EMOLLIENT]: {
    primary: [
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.REPARATEUR,
    ],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.ZONE_VISAGE,
      TAG_SLUGS.ZONE_CORPS,
      TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
    ],
    avoid: [TAG_SLUGS.PEAU_GRASSE],
  },

  // ── Exomega Control Huile Lavante : Nettoyage doux et apaisant dès la naissance
  [ADERMA_PRODUCT_SLUGS.ADERMA_EXOMEGA_HUILE_500]: {
    primary: [TAG_SLUGS.PEAU_ATOPIQUE, TAG_SLUGS.NETTOYANT, TAG_SLUGS.APAISANT],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.HUILE_NETTOYANTE,
      TAG_SLUGS.HUILE_VISAGE,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.SANS_SAVON,
      TAG_SLUGS.DOUBLE_NETTOYAGE_1,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ZONE_VISAGE,
      TAG_SLUGS.ZONE_CORPS,
      TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
    ],
    avoid: [],
  },

  // ── Gel Douche Surgras : Hygiène douce peaux sèches et fragiles
  [ADERMA_PRODUCT_SLUGS.ADERMA_GEL_DOUCHE_SURGRAS]: {
    primary: [TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.NETTOYANT, TAG_SLUGS.BARRIERE_CUTANEE],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.GEL_NETTOYANT,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.SANS_SAVON,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ZONE_CORPS,
      TAG_SLUGS.ZONE_VISAGE,
      TAG_SLUGS.BIO_NATUREL,
    ],
    avoid: [
      TAG_SLUGS.SANS_PARFUM, // Contient du parfum (fragrance dans l'INCI)
    ],
  },

  // ── Lait Corps Hydratant 72h : Hydratation légère universelle
  [ADERMA_PRODUCT_SLUGS.ADERMA_LAIT_CORPS_72H]: {
    primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.PEAU_SENSIBLE],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.LAIT_CORPS,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.VEGAN,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.ZONE_CORPS,
      TAG_SLUGS.PEAU_TOUS_TYPES,
    ],
    avoid: [],
  },
}
