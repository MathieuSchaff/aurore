import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { SEPHORA_PRODUCT_SLUGS } from './sephora'
export const SEPHORA_INGREDIENTS_MAP: Record<string, any[]> = {
  [SEPHORA_PRODUCT_SLUGS.SEPHORA_CREME_APAISANTE_CENTELLA]: [
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Extrait de centella apaisant anti-rougeurs',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Acide hyaluronique hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité nourrissant',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
  ],

  [SEPHORA_PRODUCT_SLUGS.SEPHORA_GLOW_GEL_CREME_VIT_C]: [
    {
      slug: INGREDIENT_SLUGS.THREE_O_ETHYL_ASCORBIC_ACID,
      notes: '3-O-Ethyl Ascorbic Acid — vitamine C stable éclat',
    },
    {
      slug: INGREDIENT_SLUGS.POLYGLUTAMIC_ACID,
      notes: 'Acide polyglutamique — hydratation intense',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
  ],
}
