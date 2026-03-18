import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
import { GG_PRODUCTS_SLUGS } from './geekAndGorgeous'

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
  [GG_PRODUCTS_SLUGS.CALM_DOWN]: [
    {
      slug: INGREDIENT_SLUGS.PHA,
      concentrationValue: 3.2,
      concentrationUnit: '%',
      notes: 'Acide PHA doux qui exfolie et hydrate[cite: 13].',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      concentrationValue: 0.8,
      concentrationUnit: '%',
      notes: 'BHA à faible dose pour une action anti-inflammatoire douce[cite: 13].',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaise et protège la barrière cutanée[cite: 13].',
    },
  ],
  [GG_PRODUCTS_SLUGS.CHEER_UP]: [
    {
      slug: INGREDIENT_SLUGS.MANDELIC_ACID,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'AHA antibactérien idéal pour les imperfections[cite: 14].',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Nettoie l’intérieur des pores[cite: 14].',
    },
    {
      slug: INGREDIENT_SLUGS.SARCOSINE,
      notes: 'Aide à normaliser la production de sébum[cite: 14].',
    },
  ],
  [GG_PRODUCTS_SLUGS.SMOOTH_OUT]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: 'AHA le plus puissant pour booster le collagène[cite: 14].',
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'AHA doux et humectant[cite: 14].',
    },
  ],
  [GG_PRODUCTS_SLUGS.LIQUID_HYDRATION]: [
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Pro-vitamine B5 pour apaiser et réparer[cite: 15].',
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
      notes: 'Ingrédient classique protecteur et apaisant[cite: 15].',
    },
  ],
  [GG_PRODUCTS_SLUGS.HAPPIER_BARRIER]: [
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      concentrationValue: 7,
      concentrationUnit: '%',
      notes: 'Maintient l’hydratation sans fini gras[cite: 15].',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NG,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Céramide pur pour une barrière forte[cite: 15].',
    },
  ],
  [GG_PRODUCTS_SLUGS.A_GAME_10]: [
    {
      slug: INGREDIENT_SLUGS.RETINAL,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Rétinaldéhyde hautement dosé pour le smart-aging[cite: 16].',
    },
  ],
  [GG_PRODUCTS_SLUGS.A_GAME_5]: [
    {
      slug: INGREDIENT_SLUGS.RETINAL,
      concentrationValue: 0.05,
      concentrationUnit: '%',
      notes: 'Dosage moyen pour habituer la peau aux rétinoïdes[cite: 16].',
    },
  ],
  [GG_PRODUCTS_SLUGS.C_GLOW]: [
    {
      slug: INGREDIENT_SLUGS.VITAMIN_C,
      concentrationValue: 15,
      concentrationUnit: '%',
      notes: 'Vitamine C pure pour l’éclat et le collagène[cite: 17].',
    },
    {
      slug: INGREDIENT_SLUGS.FERULIC_ACID,
      notes: 'Stabilise la Vitamine C et booste son action antioxydante[cite: 17].',
    },
  ],
  [GG_PRODUCTS_SLUGS.STRESS_LESS]: [
    {
      slug: INGREDIENT_SLUGS.MADECASSOSIDE,
      concentrationValue: 0.3,
      concentrationUnit: '%',
      notes: 'Molécule de Centella Asiatica pour la cicatrisation[cite: 17].',
    },
    {
      slug: INGREDIENT_SLUGS.BETA_GLUCAN,
      concentrationValue: 0.2,
      concentrationUnit: '%',
      notes: 'Extrait d’avoine réparateur et hydratant[cite: 17].',
    },
  ],
  [GG_PRODUCTS_SLUGS.APAD]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      concentrationValue: 20,
      concentrationUnit: '%',
      notes: 'Solution contenant 6% de PAD pur pour les rougeurs[cite: 18].',
    },
  ],
  [GG_PRODUCTS_SLUGS.B_BOMB]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: 'Vitamine B3 multi-fonctions pour les pores et barrière[cite: 18].',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_PCA,
      notes: 'Antibactérien et régulateur de sébum[cite: 18].',
    },
  ],
  [GG_PRODUCTS_SLUGS.POREFECTLY_CLEAR]: [
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Dose maximale de BHA pour purifier les pores[cite: 19].',
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
