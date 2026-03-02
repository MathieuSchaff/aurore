import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'

export const GG_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.GEEK_GORGEOUS_POWER_PEPTIDES]: [
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TRIPEPTIDE_1,
      notes: 'Matrixyl 3000 (avec Palmitoyl Tetrapeptide-7) – réduction rides, collagène',
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TETRAPEPTIDE_7,
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TRIPEPTIDE_38,
      notes: "Matrixyl synthe'6 – boost 6 composants matrice extracellulaire",
    },
    {
      slug: INGREDIENT_SLUGS.TETRAPEPTIDE_21,
      notes: 'TEGO PEP 4-17 – boost collagène, HA, fibronectine (haute performance)',
    },
    {
      slug: INGREDIENT_SLUGS.COPPER_PALMITOYL_HEPTAPEPTIDE_14,
      notes: 'Copper peptide – réparation, anti-âge',
    },
    {
      slug: INGREDIENT_SLUGS.HEPTAPEPTIDE_15_PALMITATE,
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaisant, hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
    },
  ],

  [allProductSlugs.GG_A_GAME_20]: [
    {
      slug: INGREDIENT_SLUGS.RETINAL,
      notes: '0.2% retinal stabilisé (sustained-delivery) – anti-âge puissant, rides/texture/éclat',
    },
    {
      slug: INGREDIENT_SLUGS.ECTOIN,
      notes: '1% ectoin – protecteur, apaisant, barrière (minimise irritations rétinoides)',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaisant, hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E – antioxydant',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHERYL_ACETATE,
    },
  ],

  [allProductSlugs.GG_HYDRATION_STATION]: [
    {
      slug: INGREDIENT_SLUGS.ECTOIN,
      notes:
        '1% ectoin – hydratant, protecteur environnemental (pollution, lumière bleue), apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.XYLITYLGLUCOSIDE,
      notes: 'Prébiotique xylitol derivatives – hydratation, équilibre microbiome',
    },
    {
      slug: INGREDIENT_SLUGS.ANYDROXYLITOL,
    },
    {
      slug: INGREDIENT_SLUGS.XYLITOL,
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
      notes: 'Apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.BISABOLOL,
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: '5% glycérine – hydratation gold standard',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],
}

// Export pour compatibilité descendante
export const GG_PRODUCT_INGREDIENTS = Object.entries(GG_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
