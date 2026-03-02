import { TAG_SLUGS } from '../../tags/seed-tags'
import { AZ_PRODUCT_SLUGS } from './aromaZone'

interface ProductTagGroups {
  primary: string[] // Actions ciblées (Acné, Anti-âge, Taches)
  secondary: string[] // Naturel, Routine, Labels
  avoid: string[] // Précautions (Peaux sèches, Grossesse, etc.)
}

export const AZ_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Sérum Concentré Acide Azélaïque 10% : Focus Imperfections & Matité
  [AZ_PRODUCT_SLUGS.AROMA_ZONE_CONCENTRE_AZELAIC_10]: {
    primary: [
      TAG_SLUGS.ANTI_ACNE,
      TAG_SLUGS.SEBO_REGULATEUR,
      TAG_SLUGS.MATIFIANT,
      TAG_SLUGS.BRILLANCE,
    ],
    secondary: [
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.ASTRINGENT, // Contient de l'extrait de saule (BHA naturel)
    ],
    avoid: [
      TAG_SLUGS.PEAU_SECHE, // Formule notée comme "très asséchante"
      TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
    ],
  },

  // ── Sérum Concentré Vitamine C 10% & Astaxanthine : Glow & Antioxydant
  [AZ_PRODUCT_SLUGS.AZ_SERUM_VITAMINE_C_10_ASTAXANTHINE]: {
    primary: [TAG_SLUGS.ANTI_OXYDANT, TAG_SLUGS.ECLAT, TAG_SLUGS.ANTI_TACHES],
    secondary: [
      TAG_SLUGS.ANTI_AGE,
      TAG_SLUGS.SERUM,
      TAG_SLUGS.VEGAN,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.HUMECTANT,
    ],
    avoid: [],
  },

  // ── Sérum Bakuchiol : Alternative naturelle au Rétinol
  [AZ_PRODUCT_SLUGS.AZ_SERUM_BAKUCHIOL]: {
    primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.CICATRISATION],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.HUILE,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.VEGAN,
      TAG_SLUGS.SANS_PARFUM,
    ],
    avoid: [
      TAG_SLUGS.GROSSESSE_COMPATIBLE, // Par précaution sur le Bakuchiol (souvent débattu)
      TAG_SLUGS.PEAU_GRASSE, // Texture huileuse pouvant être lourde
    ],
  },

  // ── Sérum Acide Hyaluronique 3,5% : Hydratation intense
  [AZ_PRODUCT_SLUGS.AZ_SERUM_HYALURONIQUE_3_5]: {
    primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.REPULPANT, TAG_SLUGS.HUMECTANT],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.BIO_NATUREL,
      TAG_SLUGS.VEGAN,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.PEAU_SENSIBLE,
    ],
    avoid: [],
  },
}
