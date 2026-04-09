import { TAG_SLUGS } from '../../tags/seed-tags'
import { GARANCIA_PRODUCT_SLUGS } from './garancia'

interface ProductTagGroups {
  primary: string[]
  secondary: string[]
  avoid: string[]
}

export const GARANCIA_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  
  [GARANCIA_PRODUCT_SLUGS.GARANCIA_ROUGEURS]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.FLUSHS, TAG_SLUGS.ROSACEE],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.HYDRATATION,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },
}
