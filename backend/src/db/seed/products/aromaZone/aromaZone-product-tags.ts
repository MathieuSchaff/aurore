import { TAG_SLUGS } from '../../tags/seed-tags'
import { AZ_PRODUCT_SLUGS } from './aromaZone'

interface ProductTagGroups {
  primary: string[] 
  secondary: string[] 
  avoid: string[] 
}

export const AZ_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  
  
  [AZ_PRODUCT_SLUGS.AROMA_ZONE_CONCENTRE_AZELAIC_10]: {
    primary: [
      TAG_SLUGS.ANTI_ACNE,
      TAG_SLUGS.MATIFIANT,
      TAG_SLUGS.BRILLANCE,
      TAG_SLUGS.ANTI_ROUGEURS,
    ],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.TRAITEMENT,
    ],
    avoid: [
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
      TAG_SLUGS.PEAU_REACTIVE,
    ],
  },

  
  
  [AZ_PRODUCT_SLUGS.AZ_SERUM_VITAMINE_C_10_ASTAXANTHINE]: {
    primary: [
      TAG_SLUGS.ECLAT,
      TAG_SLUGS.ANTI_TACHES,
      TAG_SLUGS.PHOTO_VIEILLISSEMENT,
    ],
    secondary: [
      TAG_SLUGS.ANTI_AGE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.VEGAN,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.MATIN,
    ],
    avoid: [],
  },

  
  
  [AZ_PRODUCT_SLUGS.AZ_SERUM_BAKUCHIOL]: {
    primary: [
      TAG_SLUGS.ANTI_AGE,
      TAG_SLUGS.REPULPANT,
      TAG_SLUGS.POST_ACNE,
      TAG_SLUGS.CICATRISATION,
    ],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.HUILE_VISAGE,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.VEGAN,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.TRAITEMENT,
    ],
    avoid: [
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.BRILLANCE,
    ],
  },

  
  
  [AZ_PRODUCT_SLUGS.AZ_SERUM_HYALURONIQUE_3_5]: {
    primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.REPULPANT],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.VEGAN,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_ATOPIQUE,
      TAG_SLUGS.HYDRATATION,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
    ],
    avoid: [],
  },
}
