import { TAG_SLUGS } from '../../tags/seed-tags'
import { URIAGE_PRODUCT_SLUGS } from './uriage'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Problématiques cibles)
  secondary: string[] // Tags secondaires (Étapes, formats, propriétés)
  avoid: string[] // Tags à éviter/exclure
}

export const URIAGE_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  [URIAGE_PRODUCT_SLUGS.URIAGE_XEMOSE_C8_PLUS_CORPS]: {
    primary: [TAG_SLUGS.PEAU_ATOPIQUE, TAG_SLUGS.ECZEMA],
    secondary: [
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.BIOMIMETIQUE,
      TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
      TAG_SLUGS.TEXTURE_RICHE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
    ],
    avoid: [],
  },
  // ── Xémose C8+ Soin Visage ──────────────────────────────────────────────
  [URIAGE_PRODUCT_SLUGS.URIAGE_XEMOSE_C8_PLUS_VISAGE]: {
    primary: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.PEAU_ATOPIQUE, TAG_SLUGS.BARRIERE_CUTANEE],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.SOIN_DE_JOUR,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
    ],
    avoid: [],
  },

  // ── Roséliane Soin Anti-Rougeurs (fluide) ──────────────────────────────
  [URIAGE_PRODUCT_SLUGS.URIAGE_ROSELIANE]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.COUPEROSE],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.SOIN_DE_JOUR,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.PIGMENTS_VERTS,
    ],
    avoid: [],
  },

  // ── HYSEAC Sérum ────────────────────────────────────────────────────────
  [URIAGE_PRODUCT_SLUGS.URIAGE_HYSEAC_SERUM]: {
    primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.PORES_DILATES, TAG_SLUGS.BRILLANCE],
    secondary: [
      TAG_SLUGS.POST_ACNE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.SEBO_REGULATEUR,
      TAG_SLUGS.NON_COMEDOGENE,
    ],
    avoid: [],
  },

  // ── Cica Daily Sérum ────────────────────────────────────────────────────
  [URIAGE_PRODUCT_SLUGS.URIAGE_CICA_DAILY_SERUM]: {
    primary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.DESHYDRATATION],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.SANS_PARFUM,
    ],
    avoid: [],
  },

  // ── Roséliane Sérum ─────────────────────────────────────────────────────
  [URIAGE_PRODUCT_SLUGS.URIAGE_ROSELIANE_SERUM]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.COUPEROSE],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.ANTI_AGE,
      TAG_SLUGS.PIGMENTS_VERTS,
      TAG_SLUGS.SANS_PARFUM,
    ],
    avoid: [],
  },

  // ── Dépiderm Sérum ──────────────────────────────────────────────────────
  [URIAGE_PRODUCT_SLUGS.URIAGE_DEPIDERM_SERUM]: {
    primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ECLAT],
    secondary: [
      TAG_SLUGS.POST_ACNE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.ANTI_OXYDANT,
      TAG_SLUGS.KERATOLYTIQUE,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.SANS_PARFUM,
    ],
    avoid: [],
  },

  // ── Xémose C8+ Huile Lavante ────────────────────────────────────────────
  [URIAGE_PRODUCT_SLUGS.URIAGE_XEMOSE_HUILE_LAVANTE]: {
    primary: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.PEAU_ATOPIQUE],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.NETTOYANT,
      TAG_SLUGS.HUILE,
      TAG_SLUGS.SANS_SAVON,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
    ],
    avoid: [],
  },

  // ── Xémose C8+ Baume Relipidant ─────────────────────────────────────────
  [URIAGE_PRODUCT_SLUGS.URIAGE_XEMOSE_BAUME]: {
    primary: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.PEAU_ATOPIQUE, TAG_SLUGS.REPARATEUR],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.OCCLUSIF,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
    ],
    avoid: [],
  },

  // ── Gel Surgras Dermatologique ──────────────────────────────────────────
  [URIAGE_PRODUCT_SLUGS.URIAGE_GEL_SURGRAS]: {
    primary: [TAG_SLUGS.PEAU_SENSIBLE],
    secondary: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.NETTOYANT,
      TAG_SLUGS.SANS_SAVON,
      TAG_SLUGS.EMOLLIENT,
    ],
    avoid: [],
  },

  // ── Roséliane Soin Anti-Rougeurs Crème ──────────────────────────────────
  [URIAGE_PRODUCT_SLUGS.URIAGE_ROSELIANE_CREME]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.COUPEROSE],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.SOIN_DE_JOUR,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.PIGMENTS_VERTS,
    ],
    avoid: [],
  },

  // ── Roséliane Soin Teinté SPF50+ ────────────────────────────────────────
  [URIAGE_PRODUCT_SLUGS.URIAGE_ROSELIANE_TEINTE]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.PROTECTION_SOLAIRE],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.SOIN_DE_JOUR,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.PIGMENTS_VERTS,
    ],
    avoid: [],
  },
}
