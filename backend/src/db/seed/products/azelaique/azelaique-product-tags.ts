import { TAG_SLUGS } from '../../tags/seed-tags'
import { AZELAIQUE_PRODUCT_SLUGS } from './azelaique'

interface ProductTagGroups {
  primary: string[]
  secondary: string[]
  avoid: string[]
}

export const AZELAIQUE_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Nine Less
  [AZELAIQUE_PRODUCT_SLUGS.NINE_LESS_A_CONTROL_10]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.POST_ACNE],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.TEXTURE_LEGERE,
    ],
    avoid: [],
  },

  // ── Purito
  [AZELAIQUE_PRODUCT_SLUGS.PURITO_AZELAIC_KOJIC_TEA_TREE]: {
    primary: [TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ANTI_ACNE],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.SEBO_REGULATEUR,
      TAG_SLUGS.ECLAT,
      TAG_SLUGS.SANS_PARFUM,
    ],
    avoid: [TAG_SLUGS.PEAU_REACTIVE],
  },

  // ── Nooance
  [AZELAIQUE_PRODUCT_SLUGS.NOOANCE_AZELAIC_15]: {
    primary: [TAG_SLUGS.ROSACEE, TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.PEAU_SENSIBLE],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
    ],
    avoid: [],
  },

  // ── Allies of Skin
  [AZELAIQUE_PRODUCT_SLUGS.ALLIES_OF_SKIN_AZELAIC_KOJIC]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ANTI_TACHES],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.ECLAT,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.SANS_PARFUM,
    ],
    avoid: [TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.GROSSESSE_COMPATIBLE],
  },

  // ── Dr Sam
  [AZELAIQUE_PRODUCT_SLUGS.DR_SAM_FLAWLESS_BRIGHTLY]: {
    primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.POST_ACNE],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.SANS_PARFUM,
    ],
    avoid: [],
  },
  [AZELAIQUE_PRODUCT_SLUGS.TYPOLOGY_AZELAIC_SERUM_L35]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.BRILLANCE, TAG_SLUGS.PORES_DILATES],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.SEBO_REGULATEUR,
      TAG_SLUGS.MATIFIANT,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ZONE_VISAGE,
      TAG_SLUGS.BIO_NATUREL,
    ],
    avoid: [],
  },

  // ─────────────────────────────────────────────
  // Q+A — Azelaic Acid Balancing Serum
  // Cible : pores, acné, équilibre
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.QA_AZELAIC_ACID_BALANCING_SERUM]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.PORES_DILATES],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.SEBO_REGULATEUR,
      TAG_SLUGS.ANTI_OXYDANT,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ─────────────────────────────────────────────
  // THE INKEY LIST — Solution Anti-Rougeurs 10%
  // Cible : rougeurs, rosacée, teint inégal
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.INKEY_LIST_AZELAIC_ACID_SERUM]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.ECLAT],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.PIGMENTS_VERTS,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ─────────────────────────────────────────────
  // APIS — TerApis 30% Azelaic Acid
  // Cible : hyperpigmentation sévère, rosacée, usage expert
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.APIS_TERAPIS_AZELAIC_ACID_30]: {
    primary: [TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ANTI_ACNE],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.EXFOLIANT_CHIMIQUE,
      TAG_SLUGS.ROSACEE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.SEBO_REGULATEUR,
      TAG_SLUGS.GRAIN_PEAU,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [
      TAG_SLUGS.PEAU_SENSIBLE, // concentration 30% — contre-indiqué peaux très réactives
    ],
  },

  // ─────────────────────────────────────────────
  // TIRTIR — Azelaic Acid 12% Serum
  // Cible : acné + rougeurs + renforcement barrière
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.TIRTIR_AZELAIC_ACID_12_SERUM]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.BARRIERE_CUTANEE],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.SEBO_REGULATEUR,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.ANTI_OXYDANT,
      TAG_SLUGS.BIOMIMETIQUE, // céramide NP
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ─────────────────────────────────────────────
  // VT — Ampoule Apaisante A1
  // Cible : acné + peaux sensibles + cica
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.VT_AZELAIC_AMPOULE_A1]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.ANTI_ROUGEURS],
    secondary: [
      TAG_SLUGS.AMPOULE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.SEBO_REGULATEUR,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.CICATRISATION,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ─────────────────────────────────────────────
  // DUCRAY — Keracnyl Sérum (AzA 8% + AHA 3%)
  // Cible : acné hormonale + marques post-acné
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.DUCRAY_KERACNYL_AZELAIC_SERUM]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.POST_ACNE, TAG_SLUGS.ANTI_TACHES],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.ANTI_BACTERIEN,
      TAG_SLUGS.GRAIN_PEAU,
      TAG_SLUGS.ECLAT,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [
      TAG_SLUGS.SANS_PARFUM, // contient Fragrance (Parfum)
      TAG_SLUGS.PEAU_SENSIBLE, // AHA + AzA — déconseillé peaux très réactives
    ],
  },

  // ─────────────────────────────────────────────
  // MEDICUBE — Azelaic Acid 16 BB Calming Serum
  // Cible : acné + sébum + imperfections
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.MEDICUBE_AZELAIC_ACID_16_BB_SERUM]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.BRILLANCE, TAG_SLUGS.GRAIN_PEAU],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.SEBO_REGULATEUR,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.BIOMIMETIQUE, // céramide NP + squalane
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ─────────────────────────────────────────────
  // COS DE BAHA — AZ Azelaic Acid 10 Serum
  // Cible : hyperpigmentation + rosacée + acné
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.COS_DE_BAHA_AZELAIC_ACID_10_SERUM]: {
    primary: [TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.ANTI_ACNE],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.ROSACEE,
      TAG_SLUGS.PEAU_TOUS_TYPES,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.ECLAT,
      TAG_SLUGS.POST_ACNE,
      TAG_SLUGS.ANTI_OXYDANT, // extraits bio certifiés
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ─────────────────────────────────────────────
  // ACM — Azéane Crème 15%
  // Cible : taches + rougeurs + teint terne
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.ACM_AZEANE_CREME_15]: {
    primary: [TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.TEINT_TERNE],
    secondary: [
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.PEAU_TOUS_TYPES,
      TAG_SLUGS.SEBO_REGULATEUR,
      TAG_SLUGS.MATIFIANT,
      TAG_SLUGS.ANTI_TACHES,
      TAG_SLUGS.ECLAT,
      TAG_SLUGS.GROSSESSE_COMPATIBLE,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },
}
