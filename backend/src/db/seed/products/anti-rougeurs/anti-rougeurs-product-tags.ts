import { TAG_SLUGS } from '../../tags/seed-tags'
import { AR_PRODUCT_SLUGS } from './anti-rougeurs'

interface ProductTagGroups {
  primary: string[] 
  secondary: string[] 
  avoid: string[] 
}

export const AR_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  
  
  
  [AR_PRODUCT_SLUGS.NOREVA_SENSIDIANE]: {
    primary: [
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.ROSACEE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.FLUSHS,
    ],
    secondary: [
      TAG_SLUGS.PIGMENTS_VERTS,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.NON_COMEDOGENE,
    ],
    avoid: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_GRASSE,
    ],
  },

  
  
  
  [AR_PRODUCT_SLUGS.ACM_ROSAKALM]: {
    primary: [
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.COUPEROSE,
      TAG_SLUGS.FLUSHS,
      TAG_SLUGS.PEAU_SENSIBLE,
    ],
    secondary: [
      TAG_SLUGS.PIGMENTS_VERTS,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.TEXTURE_RICHE,
      TAG_SLUGS.BIO_NATUREL,
    ],
    avoid: [
      TAG_SLUGS.PEAU_GRASSE,
    ],
  },

  
  
  
  [AR_PRODUCT_SLUGS.EUCERIN_AR]: {
    primary: [
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.FLUSHS,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
    ],
    secondary: [
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.TEXTURE_RICHE,
    ],
    avoid: [
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_MIXTE,
    ],
  },
}
