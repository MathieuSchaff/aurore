import { TAG_SLUGS } from '../../tags/seed-tags'
import { ISISPHARMA_PRODUCT_SLUGS } from './isispharma'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Cible thérapeutique/Problématique)
  secondary: string[] // Tags secondaires (Texture, Routine, Labels)
  avoid: string[] // Tags à éviter/exclure
}

export const ISISPHARMA_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Ruboril Expert S – Crème anti-rougeurs riche pour peaux sèches/sensibles
  [ISISPHARMA_PRODUCT_SLUGS.ISISPHARMA_RUBORIL_EXPERT_S]: {
    primary: [
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.ROSACEE,
      TAG_SLUGS.COUPEROSE,
      TAG_SLUGS.BARRIERE_CUTANEE,
    ],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.SOIN_DE_JOUR,
      TAG_SLUGS.SOIN_DE_NUIT,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.TEXTURE_RICHE,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.APAISANT,
    ],
    avoid: [TAG_SLUGS.PEAU_GRASSE, TAG_SLUGS.PEAU_MIXTE, TAG_SLUGS.MATIFIANT],
  },

  // ── Ruboril Expert M – Gel-crème anti-rougeurs léger pour peaux mixtes/sensibles
  [ISISPHARMA_PRODUCT_SLUGS.ISISPHARMA_RUBORIL_EXPERT_M]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.COUPEROSE],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.SOIN_DE_JOUR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.APAISANT,
    ],
    avoid: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.TEXTURE_RICHE, TAG_SLUGS.OCCLUSIF],
  },
}
