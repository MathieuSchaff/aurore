import { TAG_SLUGS } from '../../tags/seed-tags'
import { LAB_BIARRITZ_PRODUCT_SLUGS } from './labBiarritz'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Bénéfices correctifs, Types de protection)
  secondary: string[] // Tags secondaires (Format, Labels, Type de peau)
  avoid: string[] // Tags à éviter/exclure
}

export const LAB_BIARRITZ_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  [LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_CREME_SOLAIRE_TEINTEE_SPF50]: {
    primary: [TAG_SLUGS.PROTECTION_SOLAIRE, TAG_SLUGS.SOLAIRE_TEINTE],
    secondary: [
      TAG_SLUGS.SOLAIRE_VISAGE,
      TAG_SLUGS.FILTRES_MINERAUX,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.ANTI_OXYDANT,
      TAG_SLUGS.PHOTO_VIEILLISSEMENT,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.ECLAT,
    ],
    avoid: [],
  },
  // ── Crème solaire visage SPF50
  [LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_CREME_SOLAIRE_VISAGE_SPF50]: {
    primary: [TAG_SLUGS.PROTECTION_SOLAIRE, TAG_SLUGS.FILTRES_MINERAUX],
    secondary: [TAG_SLUGS.SOLAIRE_VISAGE, TAG_SLUGS.SANS_PARFUM, TAG_SLUGS.PEAU_SENSIBLE],
    avoid: [],
  },

  // ── Crème solaire teintée SPF50 (Dorée et Classique)
  [LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_CREME_SOLAIRE_TEINTEE_SPF50_DOREE]: {
    primary: [
      TAG_SLUGS.PROTECTION_SOLAIRE,
      TAG_SLUGS.SOLAIRE_TEINTE,
      TAG_SLUGS.PROTECTION_LUMIERE_BLEUE,
    ],
    secondary: [TAG_SLUGS.SOLAIRE_VISAGE, TAG_SLUGS.NON_COMEDOGENE],
    avoid: [],
  },

  // ── Lait solaire SPF50 (Corps et Visage)
  [LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_LAIT_SOLAIRE_SPF50]: {
    primary: [TAG_SLUGS.PROTECTION_SOLAIRE, TAG_SLUGS.FILTRES_MINERAUX],
    secondary: [TAG_SLUGS.SOLAIRE_CORPS, TAG_SLUGS.SANS_PARFUM, TAG_SLUGS.PEAU_ATOPIQUE],
    avoid: [],
  },

  // ── CICA REPA Crème réparatrice
  [LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_CICA_REPA_CREME_REPARATRICE]: {
    primary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.BARRIERE_CUTANEE],
    secondary: [TAG_SLUGS.SANS_PARFUM],
    avoid: [],
  },

  // ── Crème de nuit régénérante
  [LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_CREME_NUIT_REGENERANTE]: {
    primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.DESHYDRATATION],
    secondary: [TAG_SLUGS.SOIN_DE_NUIT],
    avoid: [],
  },

  // ── La crème de Biarritz (Visage)
  [LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_CREME_VISAGE]: {
    primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.ECLAT],
    secondary: [TAG_SLUGS.CREME_HYDRATANTE],
    avoid: [],
  },

  // ── Sérum anti-taches & Crème de nuit anti-taches
  [LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_SERUM_ANTI_TACHES]: {
    primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.HYPERPIGMENTATION],
    secondary: [TAG_SLUGS.SERUM],
    avoid: [],
  },
  [LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_CREME_NUIT_ANTI_TACHES]: {
    primary: [TAG_SLUGS.ANTI_TACHES],
    secondary: [TAG_SLUGS.SOIN_DE_NUIT],
    avoid: [],
  },

  // ── Sérum repulpant
  [LAB_BIARRITZ_PRODUCT_SLUGS.LABORATOIRES_BIARRITZ_SERUM_REPULPANT]: {
    primary: [TAG_SLUGS.REPULPANT, TAG_SLUGS.DESHYDRATATION],
    secondary: [TAG_SLUGS.SERUM, TAG_SLUGS.HUMECTANT],
    avoid: [],
  },
}
