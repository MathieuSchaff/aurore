import { TAG_SLUGS } from '../../tags/seed-tags'
import { GARANCIA_PRODUCT_SLUGS } from './garancia'

interface ProductTagGroups {
  primary: string[] // Problématiques cibles (Flushs, Rougeurs)
  secondary: string[] // Texture, Type de peau, Naturalité
  avoid: string[] // Contre-indications ou exclusions
}

export const GARANCIA_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Que mes Rougeurs Disparaissent : Sérum concentré anti-rougeurs & flushs
  [GARANCIA_PRODUCT_SLUGS.GARANCIA_ROUGEURS]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.FLUSHS, TAG_SLUGS.ROSACEE, TAG_SLUGS.COUPEROSE],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.BIO_NATUREL, // Basé sur les ingrédients d'origine naturelle (INCI*)
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.TEXTURE_LEGERE,
    ],
    avoid: [
      TAG_SLUGS.SANS_PARFUM, // Le produit contient du parfum (Fragrance dans l'INCI)
    ],
  },
}
