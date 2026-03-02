import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
export const TO_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.TO_CAFFEINE_5_EGCG]: [
    {
      slug: INGREDIENT_SLUGS.CAFFEINE,
      notes: '5% caféine – décongestionne, réduit poches et cernes',
    },
    {
      slug: INGREDIENT_SLUGS.GREEN_TEA,
      notes: 'EGCG (dérivé thé vert) – antioxydant puissant, éclaircit cernes',
    },
    {
      slug: INGREDIENT_SLUGS.GALLYL_GLUCOSIDE,
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Hydratation contour yeux',
    },
  ],

  [allProductSlugs.TO_NIACINAMIDE_10_ZINC_1]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: '10% niacinamide – régule sébum, réduit imperfections, éclaircit, renforce barrière',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_PCA,
      notes: '1% zinc PCA – anti-imperfections, matifiant',
    },
    // Produit iconique minimaliste → focus sur le duo signature
  ],

  [allProductSlugs.TO_HYALURONIC_ACID_2_B5]: [
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Multi-moléculaire HA (2% total) – hydratation multi-couches',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Pro-vitamine B5 – répare barrière, hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.AHNFELTIA_CONCINNA,
      notes: "Extrait d'algue rouge – boost hydratation",
    },
  ],

  [allProductSlugs.TO_AZELAIC_ACID_10]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: '10% acide azélaïque – anti-imperfections, anti-rougeurs, éclaircissant, texture',
    },
    // Minimaliste → focus unique sur l'actif principal
  ],

  [allProductSlugs.THE_ORDINARY_MULTI_PEPTIDE_COPPER_1]: [
    {
      slug: INGREDIENT_SLUGS.COPPER_PEPTIDES,
      notes: '1% GHK-Cu (Copper Tripeptide-1) – réparation, anti-âge, antioxydant puissant',
    },
    {
      slug: INGREDIENT_SLUGS.ARGIRELINE,
      notes: "Argireline – anti-rides d'expression",
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TRIPEPTIDE_1,
    },
    {
      slug: INGREDIENT_SLUGS.MATRIXYL_3000,
      notes: 'Matrixyl 3000',
    },
    {
      slug: INGREDIENT_SLUGS.SYN_AKE,
      notes: 'SYN-AKE – effet botox-like',
    },
  ],

  [allProductSlugs.THE_ORDINARY_MULTI_PEPTIDES_HA_EX_BUFFET]: [
    {
      slug: INGREDIENT_SLUGS.ARGIRELINE,
      notes: 'Argireline',
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TRIPEPTIDE_1,
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TETRAPEPTIDE_7,
      notes: 'Matrixyl 3000',
    },
    {
      slug: INGREDIENT_SLUGS.SYN_AKE,
      notes: 'SYN-AKE',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'HA multi-moléculaire',
    },
  ],

  [allProductSlugs.THE_ORDINARY_MULTI_PEPTIDES_YEUX]: [
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TRIPEPTIDE_38,
      notes: "Matrixyl synthe'6",
    },
    {
      slug: INGREDIENT_SLUGS.ACETYL_TETRAPEPTIDE_5,
      notes: 'Réduit poches',
    },
    {
      slug: INGREDIENT_SLUGS.MYRISTOYL_NONAPEPTIDE_3,
    },
    {
      slug: INGREDIENT_SLUGS.CAFFEINE,
    },
    {
      slug: INGREDIENT_SLUGS.GREEN_TEA,
      notes: 'EGCG – antioxydant contour yeux',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
    },
  ],

  [allProductSlugs.THE_ORDINARY_ECLAT_MULTI_ANTIOXYDANT]: [
    {
      slug: INGREDIENT_SLUGS.ASCORBYL_GLUCOSIDE,
      notes: 'Vitamine C stable – éclat, anti-taches',
    },
    {
      slug: INGREDIENT_SLUGS.ERGOTHIONEINE,
      notes: 'Antioxydant puissant',
    },
    {
      slug: INGREDIENT_SLUGS.GREEN_TEA,
      notes: 'EGCG',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Forme avancée vitamine E',
    },
    {
      slug: INGREDIENT_SLUGS.ACETYL_TETRAPEPTIDE_2,
    },
  ],

  [allProductSlugs.THE_ORDINARY_SOLUTION_GF_15]: [
    {
      slug: INGREDIENT_SLUGS.NICOTIANA_BENTHAMIANA_HEXAPEPTIDE_40_SH_OLIGOPEPTIDE_1,
      notes: 'EGF mimic – facteurs de croissance',
    },
    {
      slug: INGREDIENT_SLUGS.NICOTIANA_BENTHAMIANA_HEXAPEPTIDE_40_SH_POLYPEPTIDE_76,
      notes: 'IGF mimic',
    },
    {
      slug: INGREDIENT_SLUGS.NICOTIANA_BENTHAMIANA_OCTAPEPTIDE_30_SH_OLIGOPEPTIDE_2,
      notes: 'TGF mimic – réparation, fermeté (15% total)',
    },
  ],

  [allProductSlugs.THE_ORDINARY_MATRIXYL_10_HA]: [
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TRIPEPTIDE_1,
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TETRAPEPTIDE_7,
      notes: 'Matrixyl 3000 – anti-rides',
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TRIPEPTIDE_38,
      notes: "Matrixyl synthe'6 – synthèse collagène",
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'HA pour hydratation',
    },
  ],
}

// Export pour compatibilité descendante
export const TO_PRODUCT_INGREDIENTS = Object.entries(TO_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
