import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
export const TONERS_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.HARUHARU_BLACK_RICE_HYALURONIC_FF]: [
    {
      slug: INGREDIENT_SLUGS.ORYZA_SATIVA,
      notes: 'Extrait de riz noir fermenté (2000 ppm) – antioxydant, régénérant, illumine',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Hydratation intense, repulpe la peau',
    },
    {
      slug: INGREDIENT_SLUGS.BETA_GLUCAN,
      notes: 'Apaisant, hydratant, renforce barrière',
    },
    {
      slug: INGREDIENT_SLUGS.PANAX_GINSENG,
      notes: 'Extrait de ginseng – revitalisant',
    },
  ],

  [allProductSlugs.IM_FROM_RICE_TONER]: [
    {
      slug: INGREDIENT_SLUGS.ORYZA_SATIVA,
      notes: '77.78% extrait de riz Goami – hydratant, anti-rides, illumine',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Éclaircissant, barrière, régulateur sébum',
    },
    {
      slug: INGREDIENT_SLUGS.PORTULACA_OLERACEA,
      notes: 'Extrait de pourpier – apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.AMARANTHUS_CAUDATUS,
      notes: "Graines d'amarante – nourrissant",
    },
    {
      slug: INGREDIENT_SLUGS.ADENOSINE,
      notes: 'Anti-âge',
    },
  ],

  [allProductSlugs.EQQUALBERRY_SWIMMING_POOL]: [
    {
      slug: INGREDIENT_SLUGS.PROTEASE,
      notes: 'Enzyme protéase – exfoliation douce sans irritation (alternative AHA/BHA)',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: '8 formes HA – hydratation profonde',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
    },
    {
      slug: INGREDIENT_SLUGS.BETA_GLUCAN,
    },
  ],

  [allProductSlugs.MIXSOON_CENTELLA_ASIATICA]: [
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes:
        '100% extrait Centella Asiatica – apaisant ultra-minimaliste, réparateur, anti-irritations',
    },
    // Produit très simple → focus unique sur Centella
  ],

  [allProductSlugs.NUMBUZIN_NO9_NAD_PDRN_GLOW]: [
    {
      slug: INGREDIENT_SLUGS.NICOTINAMIDE_ADENINE_DINUCLEOTIDE,
      notes: 'NAD+ – anti-âge, boost turnover cellulaire, énergie',
    },
    {
      slug: INGREDIENT_SLUGS.PDRN,
      notes: 'PDRN saumon (1000 ppm) – régénérant, barrière, éclat',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
    {
      slug: INGREDIENT_SLUGS.CYANOCOBALAMIN,
      notes: 'Vitamine B12 – teinte violette, boost éclat',
    },
    // 50 peptides → trop pour lister tous, focus sur les signature (ex. peptides anti-âge)
  ],

  [allProductSlugs.NUMBUZIN_NO1_PURE_FULL_CALMING]: [
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: '39% Centella – apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.HEARTLEAF,
      notes: '28% Heartleaf – anti-inflammatoire',
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: '25% Réglisse – calmant rougeurs',
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
    },
  ],

  [allProductSlugs.NUMBUZIN_NO5_GLUTATHIONE_VITAMIN]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: '50 000 ppm – éclaircissant puissant',
    },
    {
      slug: INGREDIENT_SLUGS.GLUTATHION,
      notes: 'Antioxydant, anti-taches',
    },
    {
      slug: INGREDIENT_SLUGS.THREE_O_ETHYL_ASCORBIC_ACID,
      notes: 'Vitamine C stable – éclat',
    },
    {
      slug: INGREDIENT_SLUGS.ALPHA_ARBUTIN,
    },
    {
      slug: INGREDIENT_SLUGS.BISABOLOL,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
  ],

  [allProductSlugs.ROUND_LAB_1025_DOKDO]: [
    {
      slug: INGREDIENT_SLUGS.PROTEASE,
      notes: 'Exfoliation douce enzymatique',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
    },
    {
      slug: INGREDIENT_SLUGS.BETAINE,
    },
  ],
}

// Export pour compatibilité descendante
export const TONERS_PRODUCT_INGREDIENTS = Object.entries(TONERS_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
