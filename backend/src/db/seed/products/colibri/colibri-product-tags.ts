import { TAG_SLUGS } from '../../tags/seed-tags'
import { COLIBRI_PRODUCT_SLUGS } from './colibri'

interface ProductTagGroups {
  primary: string[] // Actions correctives et problématiques cibles
  secondary: string[] // Routine, type de peau et labels
  avoid: string[] // Contre-indications ou exclusions de texture
}

export const COLIBRI_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Brightening Booster : Azélaïque 10% + Mandélique
  [COLIBRI_PRODUCT_SLUGS.COLIBRI_BRIGHTENING_BOOSTER]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ECLAT],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.REPARATEUR, // Contient des céramides-like
      TAG_SLUGS.APAISANT,
    ],
    avoid: [],
  },

  // ── Pore Control Booster : Niacinamide 8% + NMN 4%
  [COLIBRI_PRODUCT_SLUGS.PORE_CONTROL_BOOSTER]: {
    primary: [
      TAG_SLUGS.PORES_DILATES,
      TAG_SLUGS.BRILLANCE,
      TAG_SLUGS.SEBO_REGULATEUR,
      TAG_SLUGS.ANTI_ACNE,
    ],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.TEXTURE_LEGERE,
    ],
    avoid: [TAG_SLUGS.PEAU_SECHE],
  },

  // ── Calming Moisturizer : Centella + HA + Céramides
  [COLIBRI_PRODUCT_SLUGS.CALMING_MOISTURIZER]: {
    primary: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.APAISANT],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.SOIN_DE_JOUR,
      TAG_SLUGS.SOIN_DE_NUIT,
    ],
    avoid: [],
  },

  // ── Vitamin C 20 Booster : 3 dérivés de Vitamine C stables
  [COLIBRI_PRODUCT_SLUGS.VITAMIN_C_20_BOOSTER]: {
    primary: [TAG_SLUGS.ANTI_OXYDANT, TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ANTI_AGE, TAG_SLUGS.ECLAT],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.TEXTURE_LEGERE, // Texture huileuse légère
    ],
    avoid: [
      TAG_SLUGS.PEAU_REACTIVE, // Concentration 20% très élevée
    ],
  },

  // ── Vitamin C15 Booster : Formule aqueuse légère
  [COLIBRI_PRODUCT_SLUGS.VITAMIN_C15_BOOSTER]: {
    primary: [TAG_SLUGS.ANTI_OXYDANT, TAG_SLUGS.ECLAT],
    secondary: [
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.TEXTURE_LEGERE,
    ],
    avoid: [],
  },

  // ── Barrier Booster : Complexe 5 céramides + Ectoïne
  [COLIBRI_PRODUCT_SLUGS.BARRIER_BOOSTER]: {
    primary: [TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.REPARATEUR, TAG_SLUGS.PEAU_ATOPIQUE],
    secondary: [
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.TEXTURE_RICHE,
      TAG_SLUGS.APAISANT,
    ],
    avoid: [TAG_SLUGS.PEAU_GRASSE],
  },

  // ── Antioxidant Serum : Resvératrol + SOD
  [COLIBRI_PRODUCT_SLUGS.ANTIOXIDANT_SERUM]: {
    primary: [TAG_SLUGS.ANTI_OXYDANT, TAG_SLUGS.ANTI_AGE, TAG_SLUGS.ECLAT],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.SOIN_DE_JOUR,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.PROTECTION_CUTANEE,
    ],
    avoid: [],
  },
}
