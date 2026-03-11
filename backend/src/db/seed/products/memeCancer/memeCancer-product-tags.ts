import { TAG_SLUGS } from '../../tags/seed-tags'
import { MEME_PRODUCT_SLUGS } from './memeCancer'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Bénéfices thérapeutiques & Actions)
  secondary: string[] // Tags secondaires (Type de peau, Routine, Labels)
  avoid: string[] // Tags à éviter/exclure
}

export const MEME_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Crème pour le Visage
  [MEME_PRODUCT_SLUGS.MEME_CREME_VISAGE]: {
    primary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.REPARATEUR, TAG_SLUGS.DESHYDRATATION],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.MATIN, // Remplacé SOIN_DE_JOUR
      TAG_SLUGS.SOIR, // Remplacé SOIN_DE_NUIT
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.BIO_NATUREL,
    ],
    avoid: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.BRILLANCE],
  },

  // ── Gelée Fondante Démaquillante
  [MEME_PRODUCT_SLUGS.MEME_GELEE_DEMAQUILLANTE]: {
    primary: [
      TAG_SLUGS.DOUBLE_NETTOYAGE_1, // Étape de démaquillage huileux
      TAG_SLUGS.PEAU_REACTIVE,
    ],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.BAUME_DEMAQUILLANT, // Format le plus proche de la gelée fondante
    ],
    avoid: [],
  },

  // ── Huile Lavante Visage et Corps
  [MEME_PRODUCT_SLUGS.MEME_HUILE_LAVANTE]: {
    primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.BARRIERE_CUTANEE],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.SANS_SAVON,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.HUILE_NETTOYANTE,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.ZONE_CORPS,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ── Baume Multi-Usages
  [MEME_PRODUCT_SLUGS.MEME_BAUME_MULTI_USAGES]: {
    primary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.CICATRISATION],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.BAUME, // Plus précis que CREME_HYDRATANTE
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.GROSSESSE_COMPATIBLE,
    ],
    avoid: [TAG_SLUGS.PEAU_GRASSE],
  },
}
