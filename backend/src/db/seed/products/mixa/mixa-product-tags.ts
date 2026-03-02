import { TAG_SLUGS } from '../../tags/seed-tags'
import { MIXA_PRODUCT_SLUGS } from './mixa'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Bénéfices correctifs)
  secondary: string[] // Tags secondaires (Type de peau, Format, Texture)
  avoid: string[] // Tags à éviter/exclure
}

export const MIXA_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Crème Niacinamide Correction Éclat
  [MIXA_PRODUCT_SLUGS.NIACINAMIDE_CORRECTION_ECLAT]: {
    primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.HYPERPIGMENTATION, TAG_SLUGS.ECLAT],
    secondary: [TAG_SLUGS.PEAU_SECHE],
    avoid: [],
  },

  // ── Crème Fraîche et Fondante à l'Acide Hyaluronique
  [MIXA_PRODUCT_SLUGS.ACIDE_HYALURONIQUE_FRAICHE]: {
    primary: [TAG_SLUGS.DESHYDRATATION],
    secondary: [TAG_SLUGS.HUMECTANT, TAG_SLUGS.CREME_HYDRATANTE],
    avoid: [],
  },

  // ── Crème pour Peaux Sèches et Sensibles
  [MIXA_PRODUCT_SLUGS.PEAUX_SECHES_SENSIBLES]: {
    primary: [TAG_SLUGS.PEAU_SENSIBLE],
    secondary: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.EMOLLIENT],
    avoid: [],
  },

  // ── Crème Panthénol Confort
  [MIXA_PRODUCT_SLUGS.PANTHENOL_CONFORT]: {
    primary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.PEAU_REACTIVE],
    secondary: [TAG_SLUGS.PEAU_ATOPIQUE, TAG_SLUGS.SANS_PARFUM],
    avoid: [],
  },

  // ── Crème Céramide Protection
  [MIXA_PRODUCT_SLUGS.CERAMIDE_PROTECTION]: {
    primary: [TAG_SLUGS.BARRIERE_CUTANEE],
    secondary: [TAG_SLUGS.PEAU_ATOPIQUE, TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.SANS_PARFUM],
    avoid: [],
  },

  // ── Crème Cica Réparation (Urée)
  [MIXA_PRODUCT_SLUGS.CICA_REPARATION]: {
    primary: [TAG_SLUGS.REPARATEUR, TAG_SLUGS.KERATOLYTIQUE],
    secondary: [TAG_SLUGS.EXFOLIANT, TAG_SLUGS.PEAU_SECHE],
    avoid: [],
  },

  // ── Crème des Peaux Très Sèches et Ternes (Cacao)
  [MIXA_PRODUCT_SLUGS.PEAUX_TRES_SECHES_TERNES]: {
    primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.PEAU_SECHE],
    secondary: [TAG_SLUGS.OCCLUSIF],
    avoid: [],
  },
}
