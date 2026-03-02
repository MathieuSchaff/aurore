import { TAG_SLUGS } from '../../tags/seed-tags'
import { SEPHORA_PRODUCT_SLUGS } from './sephora'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Bénéfices correctifs)
  secondary: string[] // Tags secondaires (Type de peau, Format, Texture)
  avoid: string[] // Tags à éviter/exclure
}

export const SEPHORA_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Crème Apaisante - Acide hyaluronique & Centella asiatica
  [SEPHORA_PRODUCT_SLUGS.SEPHORA_CREME_APAISANTE_CENTELLA]: {
    primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.REPARATEUR, TAG_SLUGS.APAISANT],
    secondary: [TAG_SLUGS.CREME_HYDRATANTE, TAG_SLUGS.PEAU_REACTIVE, TAG_SLUGS.PIGMENTS_VERTS],
    avoid: [],
  },

  // ── GLOW Gel-Crème Éclat Vitamine C & Acide Polyglutamique
  [SEPHORA_PRODUCT_SLUGS.SEPHORA_GLOW_GEL_CREME_VIT_C]: {
    primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.ANTI_OXYDANT],
    secondary: [
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.TEXTURE_LEGERE,
    ],
    avoid: [],
  },
}
