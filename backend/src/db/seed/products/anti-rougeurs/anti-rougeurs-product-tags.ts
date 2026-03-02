import { TAG_SLUGS } from '../../tags/seed-tags'
import { AR_PRODUCT_SLUGS } from './anti-rougeurs'

interface ProductTagGroups {
  primary: string[] // Pathologies cibles (Rosacée, Couperose, Flushs)
  secondary: string[] // Actifs, texture et bénéfices secondaires
  avoid: string[] // Tags à exclure
}

export const AR_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Noreva - Sensidiane AR+ : Soin d'attaque avec pigments verts
  [AR_PRODUCT_SLUGS.NOREVA_SENSIDIANE]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.PEAU_REACTIVE],
    secondary: [
      TAG_SLUGS.PIGMENTS_VERTS,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.TEXTURE_LEGERE,
    ],
    avoid: [
      TAG_SLUGS.PEAU_SECHE, // Texture notée comme légère, risque d'inconfort si peau très sèche
    ],
  },

  // ── ACM - Rosakalm : Crème anti-rougeurs apaisante & masquante
  [AR_PRODUCT_SLUGS.ACM_ROSAKALM]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.COUPEROSE],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PIGMENTS_VERTS,
      TAG_SLUGS.BIO_NATUREL, // Contient de nombreux extraits végétaux (Ruscus, Sureau, etc.)
      TAG_SLUGS.TEXTURE_RICHE, // Contient des huiles de jojoba et sésame en tête d'INCI
      TAG_SLUGS.CREME_HYDRATANTE,
    ],
    avoid: [
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.SANS_PARFUM, // Contient du parfum en fin d'INCI
    ],
  },

  // ── Eucerin - Anti-Rougeurs Soin Apaisant : Formule haute tolérance 0%
  [AR_PRODUCT_SLUGS.EUCERIN_AR]: {
    primary: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.FLUSHS, TAG_SLUGS.ANTI_ROUGEURS],
    secondary: [
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.CREME_HYDRATANTE,
    ],
    avoid: [],
  },
}
