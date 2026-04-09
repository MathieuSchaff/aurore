import { TAG_SLUGS } from '../../tags/seed-tags'
import { SERUMS_PEPTIDES_PRODUCT_SLUGS } from './serums-peptides'

interface ProductTagGroups {
  primary: string[] 
  secondary: string[] 
  avoid: string[] 
}

export const PEPTIDES_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  
  [SERUMS_PEPTIDES_PRODUCT_SLUGS.NIOD_COPPER_AMINO_ISOLATE_LIPID_1]: {
    primary: [
      TAG_SLUGS.ANTI_AGE,
      TAG_SLUGS.REPULPANT,
      TAG_SLUGS.BARRIERE_CUTANEE,
    ],
    secondary: [
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.TEXTURE_RICHE,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.OCCLUSION,
    ],
    avoid: [
      TAG_SLUGS.PEAU_GRASSE,
    ],
  },

  
  [SERUMS_PEPTIDES_PRODUCT_SLUGS.NOOANCE_PEPTIDES_CUIVRE_2]: {
    primary: [
      TAG_SLUGS.ANTI_AGE,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.REPULPANT,
    ],
    secondary: [
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.TRAITEMENT,
    ],
    avoid: [],
  },
}
