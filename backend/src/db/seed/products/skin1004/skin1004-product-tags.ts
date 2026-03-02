import { TAG_SLUGS } from '../../tags/seed-tags'
import { SKIN1004_PRODUCT_SLUGS } from './skin1004'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Actions, Problématiques)
  secondary: string[] // Tags secondaires (Type de peau, Format, Propriétés)
  avoid: string[] // Tags à éviter/exclure
}

export const SKIN1004_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Madagascar Centella Probio-Cica Enrich Cream
  [SKIN1004_PRODUCT_SLUGS.SKIN1004_MADAGASCAR_CENTELLA_PROBIO_CICA]: {
    primary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.REPARATEUR],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.OCCLUSIF,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.PEAU_SECHE,
    ],
    avoid: [],
  },

  // ── Madagascar Centella Soothing Cream
  [SKIN1004_PRODUCT_SLUGS.SKIN1004_MADAGASCAR_CENTELLA_SOOTHING_CREAM]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.APAISANT],
    secondary: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.CREME_HYDRATANTE, TAG_SLUGS.PEAU_MIXTE],
    avoid: [],
  },

  // ── Tea-Trica Relief Ampoule Mini
  [SKIN1004_PRODUCT_SLUGS.SKIN1004_TEA_TRICA_RELIEF_MINI]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.ANTISEPTIQUE],
    secondary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.SERUM],
    avoid: [],
  },

  // ── Madagascar Centella Asiatica 100 Ampoule
  [SKIN1004_PRODUCT_SLUGS.SKIN1004_MADAGASCAR_CENTELLA_100]: {
    primary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.PEAU_SENSIBLE],
    secondary: [TAG_SLUGS.SERUM, TAG_SLUGS.SANS_PARFUM],
    avoid: [],
  },

  // ── Spot Cover Patch
  [SKIN1004_PRODUCT_SLUGS.SKIN1004_SPOT_COVER_PATCH]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.PROTECTION_CUTANEE],
    secondary: [TAG_SLUGS.PROTECTION_SOLAIRE],
    avoid: [],
  },

  // ── Madagascar Centella Probio-Cica Essence Toner
  [SKIN1004_PRODUCT_SLUGS.SKIN1004_CENTELLA_PROBIO_CICA_ESSENCE]: {
    primary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.DESHYDRATATION],
    secondary: [TAG_SLUGS.TONIQUE, TAG_SLUGS.ESSENCE, TAG_SLUGS.SANS_PARFUM],
    avoid: [],
  },

  // ── Madagascar Centella Toning Toner
  [SKIN1004_PRODUCT_SLUGS.SKIN1004_MADAGASCAR_CENTELLA_TONING]: {
    primary: [TAG_SLUGS.EXFOLIANT, TAG_SLUGS.ECLAT],
    secondary: [TAG_SLUGS.TONIQUE, TAG_SLUGS.PEAU_SENSIBLE],
    avoid: [],
  },
}
