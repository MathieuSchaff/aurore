import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'

export const AZELAIQUE_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.NINE_LESS_A_CONTROL_10]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: '10% acide azélaïque – anti-imperfections, anti-rougeurs, éclaircissant',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Régulateur de sébum, barrière, éclaircissant',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: '3 extraits + madecassoside, asiaticoside, etc. – apaisant puissant',
    },
    {
      slug: INGREDIENT_SLUGS.SNAIL_MUCIN,
      notes: "Mucine d'escargot – hydratant, régénérant, boost collagène",
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: 'Exfoliant doux (AHA)',
    },
    {
      slug: INGREDIENT_SLUGS.ARGIRELINE,
      notes: 'Peptide anti-âge',
    },
  ],

  [allProductSlugs.PURITO_AZELAIC_KOJIC_TEA_TREE]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: '10% acide azélaïque – signature anti-acné/marks',
    },
    {
      slug: INGREDIENT_SLUGS.KOJIC_ACID,
      notes: 'Éclaircissant puissant (pigmentation)',
    },
    {
      slug: INGREDIENT_SLUGS.TEA_TREE,
      notes: 'Tea Tree (eau + huile) – antibactérien, séborégulateur (attention irritant post-IPL)',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
    },
    {
      slug: INGREDIENT_SLUGS.GLUTATHION,
      notes: 'Antioxydant éclaircissant',
    },
    {
      slug: INGREDIENT_SLUGS.COQ10,
      notes: 'CoQ10 – anti-âge',
    },
    {
      slug: INGREDIENT_SLUGS.ADENOSINE,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],

  [allProductSlugs.NOOANCE_AZELAIC_15]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: '15% acide azélaïque – concentration max cosmétique, anti-glycation/imperfections',
    },
    {
      slug: INGREDIENT_SLUGS.CARNOSINE,
      notes: 'Actif unique anti-glycation, protection avancée',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
      notes: 'Complexe céramides – réparation barrière (idéal post-IPL/sensible)',
    },
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: "Extrait d'avoine – apaisant",
    },
    {
      slug: INGREDIENT_SLUGS.GREEN_TEA,
      notes: 'Extrait thé vert – antioxydant',
    },
  ],

  [allProductSlugs.ALLIES_OF_SKIN_AZELAIC_KOJIC]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: '10% acide azélaïque – exfoliant doux, anti-rougeurs/pigmentation',
    },
    {
      slug: INGREDIENT_SLUGS.KOJIC_ACID,
      notes: '1% kojic acid – éclaircissant',
    },
    {
      slug: INGREDIENT_SLUGS.HEXYLRESORCINOL,
      notes: '3% hexylresorcinol – puissant anti-taches',
    },
    {
      slug: INGREDIENT_SLUGS.BAKUCHIOL,
      notes: 'Alternative douce au rétinol – anti-âge',
    },
    {
      slug: INGREDIENT_SLUGS.RIBOSE,
      notes: 'Sucre stimulant énergie cellulaire',
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Réglisse – apaisant, anti-inflammatoire',
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
    },
    {
      slug: INGREDIENT_SLUGS.BISABOLOL,
    },
  ],

  [allProductSlugs.DR_SAM_FLAWLESS_BRIGHTLY]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: '10% acide azélaïque – éclaircissant, anti-imperfections',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Multi-tâches : barrière, sébum, teint',
    },
    {
      slug: INGREDIENT_SLUGS.ASCORBYL_GLUCOSIDE,
      notes: 'Vitamine C stable – antioxydant, éclat',
    },
    {
      slug: INGREDIENT_SLUGS.BAKUCHIOL,
      notes: 'Anti-âge doux',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
  ],
}

// Export pour compatibilité descendante
export const AZELAIQUE_PRODUCT_INGREDIENTS = Object.entries(AZELAIQUE_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
