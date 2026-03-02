import { TAG_SLUGS } from '../../tags/seed-tags'
import { SERUMS_PEPTIDES_PRODUCT_SLUGS } from './serums-peptides'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Bénéfices correctifs)
  secondary: string[] // Tags secondaires (Routine, Format, Texture)
  avoid: string[] // Tags à éviter/exclure
}

export const PEPTIDES_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── NIOD Copper Amino Isolate Lipid 1%
  [SERUMS_PEPTIDES_PRODUCT_SLUGS.NIOD_COPPER_AMINO_ISOLATE_LIPID_1]: {
    primary: [
      TAG_SLUGS.ANTI_AGE,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.ANTI_OXYDANT,
    ],
    secondary: [
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.SOIN_DE_NUIT,
      TAG_SLUGS.SERUM,
    ],
    avoid: [],
  },

  // ── NOOANCE Sérum aux Peptides de Cuivre 2%
  [SERUMS_PEPTIDES_PRODUCT_SLUGS.NOOANCE_PEPTIDES_CUIVRE_2]: {
    primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.REPARATEUR, TAG_SLUGS.BARRIERE_CUTANEE],
    secondary: [
      TAG_SLUGS.SOIN_DE_JOUR,
      TAG_SLUGS.SOIN_DE_NUIT,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.NON_COMEDOGENE,
    ],
    avoid: [],
  },
}
