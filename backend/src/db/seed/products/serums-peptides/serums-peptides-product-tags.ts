import { TAG_SLUGS } from '../../tags/seed-tags'
import { SERUMS_PEPTIDES_PRODUCT_SLUGS } from './serums-peptides'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Bénéfices correctifs)
  secondary: string[] // Tags secondaires (Routine, Format, Texture)
  avoid: string[] // Tags à éviter/exclure
}

export const PEPTIDES_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── NIOD Copper Amino Isolate Lipid 1% : Régénération intense de nuit
  [SERUMS_PEPTIDES_PRODUCT_SLUGS.NIOD_COPPER_AMINO_ISOLATE_LIPID_1]: {
    primary: [
      TAG_SLUGS.ANTI_AGE,
      TAG_SLUGS.REPULPANT,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.ANTI_OXYDANT,
    ],
    secondary: [
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.TEXTURE_RICHE,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.OCCLUSION,
    ],
    avoid: [
      TAG_SLUGS.PEAU_GRASSE, // Texture trop riche pour peaux grasses
    ],
  },

  // ── NOOANCE Sérum aux Peptides de Cuivre 2% : Multi-peptides jour/nuit
  [SERUMS_PEPTIDES_PRODUCT_SLUGS.NOOANCE_PEPTIDES_CUIVRE_2]: {
    primary: [
      TAG_SLUGS.ANTI_AGE,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.REPULPANT,
    ],
    secondary: [
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.APAISANT,
    ],
    avoid: [],
  },
}
