import { TAG_SLUGS } from '../../tags/seed-tags'
import { SEPHORA_PRODUCT_SLUGS } from './sephora'

interface ProductTagGroups {
  primary: string[] 
  secondary: string[] 
  avoid: string[] 
}

export const SEPHORA_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  
  [SEPHORA_PRODUCT_SLUGS.SEPHORA_CREME_APAISANTE_CENTELLA]: {
    primary: [
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.BARRIERE_CUTANEE,
    ],
    secondary: [
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.PIGMENTS_VERTS,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.EMOLLIENCE,
    ],
    avoid: [],
  },

  
  [SEPHORA_PRODUCT_SLUGS.SEPHORA_GLOW_GEL_CREME_VIT_C]: {
    primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.DESHYDRATATION],
    secondary: [
      TAG_SLUGS.GEL_CREME,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.HYDRATATION,
      TAG_SLUGS.EMOLLIENCE,
    ],
    avoid: [],
  },
}
