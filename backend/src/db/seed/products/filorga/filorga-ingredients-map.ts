import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { FILORGA_PRODUCT_SLUGS } from './filorga'

export const INGREDIENTS_MAP: Record<string, any[]> = {
  [FILORGA_PRODUCT_SLUGS.DAILY_PEEL_ANTI_RIDES]: [
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: 'Acide lactique, acide mandélique, sodium pyruvate.',
    },
    {
      slug: INGREDIENT_SLUGS.MANDELIC_ACID,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: 'Acide lactique, acide mandélique, sodium pyruvate.',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Apaise et renforce la barrière cutanée.',
    },
  ],
  [FILORGA_PRODUCT_SLUGS.DAILY_PEEL_ANTI_TACHES]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: "Mélange d'AHA pour une exfoliation quotidienne.",
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Action anti-taches et éclat.',
    },
    {
      slug: INGREDIENT_SLUGS.TRANEXAMIC_ACID,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Corrige les taches pigmentaires.',
    },
  ],
  [FILORGA_PRODUCT_SLUGS.SLEEP_PEEL_4_5]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 4.5,
      concentrationUnit: '%',
      notes: "Complexe d'hydroxy-acides pour effet peau neuve.",
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      concentrationValue: 4.5,
      concentrationUnit: '%',
      notes: "Complexe d'hydroxy-acides pour effet peau neuve.",
    },
  ],
  [FILORGA_PRODUCT_SLUGS.HYDRA_AOX_5]: [
    {
      slug: INGREDIENT_SLUGS.VITAMIN_C,
      notes: 'Antioxydant et éclat.',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Vitamine B3 protectrice.',
    },
    {
      slug: INGREDIENT_SLUGS.ASTAXANTHIN,
      notes: 'Antioxydant puissant donnant la couleur orange.',
    },
    {
      slug: INGREDIENT_SLUGS.ERGOTHIONEINE,
      notes: 'Lutte contre les radicaux libres.',
    },
  ],
}
