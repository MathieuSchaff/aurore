import { TAG_SLUGS } from '../../tags/seed-tags'
import { MEME_PRODUCT_SLUGS } from './memeCancer'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Bénéfices thérapeutiques & Actions)
  secondary: string[] // Tags secondaires (Type de peau, Routine, Labels)
  avoid: string[] // Tags à éviter/exclure
}

export const MEME_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Crème pour le Visage – Hydratant/nourrissant quotidien pour peaux très sèches/fragilisées
  [MEME_PRODUCT_SLUGS.MEME_CREME_VISAGE]: {
    primary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.REPARATEUR, TAG_SLUGS.DESHYDRATATION],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.SOIN_DE_JOUR,
      TAG_SLUGS.SOIN_DE_NUIT,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.BIO_NATUREL,
    ],
    avoid: [],
  },

  // ── Gelée Fondante Démaquillante – Démaquillant haute tolérance, transformation gelée → huile
  [MEME_PRODUCT_SLUGS.MEME_GELEE_DEMAQUILLANTE]: {
    primary: [
      TAG_SLUGS.DEMAQUILLANT, // Ajouté pour précision
      TAG_SLUGS.PEAU_REACTIVE, // Déduit du contexte haute tolérance
    ],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.HUILE,
    ],
    avoid: [],
  },

  // ── Huile Lavante Visage et Corps – Nettoyant surgras sans savon, pH physiologique
  [MEME_PRODUCT_SLUGS.MEME_HUILE_LAVANTE]: {
    primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.BARRIERE_CUTANEE],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.SANS_SAVON,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.HUILE,
      TAG_SLUGS.HYPOALLERGENIQUE,
    ],
    avoid: [],
  },

  // ── Baume Multi-Usages – Réparateur effet pansement pour zones sèches/irritées/cicatrices
  [MEME_PRODUCT_SLUGS.MEME_BAUME_MULTI_USAGES]: {
    primary: [
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.CICATRISATION, // Ajouté pour l'effet "pansement"
    ],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.HYPOALLERGENIQUE,
    ],
    avoid: [],
  },
}
