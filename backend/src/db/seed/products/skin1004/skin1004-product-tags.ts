import { TAG_SLUGS } from '../../tags/seed-tags'
import { SKIN1004_PRODUCT_SLUGS } from './skin1004'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Actions, Problématiques)
  secondary: string[] // Tags secondaires (Type de peau, Format, Propriétés)
  avoid: string[] // Tags à éviter/exclure
}

export const SKIN1004_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Madagascar Centella Probio-Cica Enrich Cream : Occlusion riche + probiotiques
  [SKIN1004_PRODUCT_SLUGS.SKIN1004_MADAGASCAR_CENTELLA_PROBIO_CICA]: {
    primary: [
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.DESHYDRATATION,
    ],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.OCCLUSIF,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.OCCLUSION,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.TEXTURE_RICHE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.PREBIOTIQUE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.BIOMIMETIQUE,
    ],
    avoid: [
      TAG_SLUGS.PEAU_GRASSE, // Texture trop riche
    ],
  },

  // ── Madagascar Centella Soothing Cream : Gel-crème léger apaisant
  [SKIN1004_PRODUCT_SLUGS.SKIN1004_MADAGASCAR_CENTELLA_SOOTHING_CREAM]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.APAISANT, TAG_SLUGS.BARRIERE_CUTANEE],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.GEL_CREME,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.EMOLLIENCE,
    ],
    avoid: [],
  },

  // ── Tea-Trica Relief Ampoule Mini : Anti-acné + antiseptique
  [SKIN1004_PRODUCT_SLUGS.SKIN1004_TEA_TRICA_RELIEF_MINI]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.ANTISEPTIQUE, TAG_SLUGS.ANTI_ROUGEURS],
    secondary: [
      TAG_SLUGS.AMPOULE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.TRAITEMENT,
    ],
    avoid: [],
  },

  // ── Madagascar Centella Asiatica 100 Ampoule : Minimaliste ultra-apaisant
  [SKIN1004_PRODUCT_SLUGS.SKIN1004_MADAGASCAR_CENTELLA_100]: {
    primary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.APAISANT],
    secondary: [
      TAG_SLUGS.AMPOULE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.HYDRATATION,
    ],
    avoid: [],
  },

  // ── Spot Cover Patch : Patchs hydrocolloïdes couvrants
  [SKIN1004_PRODUCT_SLUGS.SKIN1004_SPOT_COVER_PATCH]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.PROTECTION_CUTANEE, TAG_SLUGS.CICATRISATION],
    secondary: [
      TAG_SLUGS.PATCH,
      TAG_SLUGS.SOIN_LOCALISE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
    ],
    avoid: [],
  },

  // ── Madagascar Centella Probio-Cica Essence Toner : Hydratation + barrière
  [SKIN1004_PRODUCT_SLUGS.SKIN1004_CENTELLA_PROBIO_CICA_ESSENCE]: {
    primary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.APAISANT],
    secondary: [
      TAG_SLUGS.ESSENCE,
      TAG_SLUGS.TONIQUE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.PEAU_TOUS_TYPES,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.PREBIOTIQUE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.PREPARATION,
    ],
    avoid: [],
  },

  // ── Madagascar Centella Toning Toner : Exfoliant doux PHA
  [SKIN1004_PRODUCT_SLUGS.SKIN1004_MADAGASCAR_CENTELLA_TONING]: {
    primary: [TAG_SLUGS.EXFOLIANT_CHIMIQUE, TAG_SLUGS.ECLAT, TAG_SLUGS.APAISANT],
    secondary: [
      TAG_SLUGS.TONIQUE,
      TAG_SLUGS.ESSENCE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.PEAU_TOUS_TYPES,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.EXFOLIATION,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.PREPARATION,
    ],
    avoid: [],
  },
}
