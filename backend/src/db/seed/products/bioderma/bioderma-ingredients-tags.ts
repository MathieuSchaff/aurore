import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
export const BIODERMA_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.BIODERMA_ATODERM_CREME_ULTRA]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Renforce la barrière et apaise',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant',
    },
    {
      slug: INGREDIENT_SLUGS.RHAMNOSE,
      notes: 'Polysaccharide prébiotique microbiome',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
  ],

  [allProductSlugs.BIODERMA_ATODERM_PP_BAUME]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Régule sébum et apaise',
    },
    {
      slug: INGREDIENT_SLUGS.DIMETHICONE,
      notes: 'Film occlusif protecteur',
    },
    {
      slug: INGREDIENT_SLUGS.RHAMNOSE,
      notes: 'Prébiotique microbiome',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant',
    },
  ],

  [allProductSlugs.BIODERMA_CREALINE_DEFENSIVE_LEGERE]: [
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Lipide émollient biomimétique',
    },
    {
      slug: INGREDIENT_SLUGS.CARNOSINE, // à créer si absent
      notes: 'Dipeptide antioxydant — Technologie Défensive',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
    {
      slug: INGREDIENT_SLUGS.RHAMNOSE,
      notes: 'Prébiotique microbiome',
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TETRAPEPTIDE_7, // = PALMITOYL_TETRAPEPTIDE-10 ici
      notes: 'Peptide anti-inflammatoire et restructurant',
    },
  ],

  [allProductSlugs.BIODERMA_SENSIBIO_AR]: [
    {
      slug: INGREDIENT_SLUGS.REGLISSE, // à créer si absent
      notes: 'Acide glycyrrhétinique anti-rougeurs',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
      notes: 'Lipide barrière anti-inflammatoire',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Lipide occlusif apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.RHAMNOSE,
      notes: 'Prébiotique microbiome',
    },
  ],
  [allProductSlugs.BIODERMA_ATODERM_HUILE_DOUCHE]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Relipidant',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Agent hydratant',
    },
  ],
  [allProductSlugs.BIODERMA_CREALINE_HUILE_MICELLAIRE]: [
    {
      slug: INGREDIENT_SLUGS.SODIUM_PCA,
      notes: 'Aide à la synthèse des lipides',
    },
  ],
  [allProductSlugs.BIODERMA_PHOTODERM_XDEFENSE_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.ECTOIN,
      notes: 'Action détoxifiante',
    },
  ],
  [allProductSlugs.BIODERMA_CREALINE_H2O]: [
    {
      slug: INGREDIENT_SLUGS.RHAMNOSE,
      notes: 'Complexe D.A.F.',
    },
  ],
  [allProductSlugs.BIODERMA_CICABIO_CREME]: [
    {
      slug: INGREDIENT_SLUGS.COPPER_SULFATE,
      notes: 'Complexe cuivre-zinc',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_SULFATE,
      notes: 'Complexe cuivre-zinc',
    },
    {
      slug: INGREDIENT_SLUGS.ACETYL_DIPEPTIDE_1_CETYL_ESTER,
      notes: 'Technologie Antalgicine',
    },
  ],
  [allProductSlugs.BIODERMA_SEBIUM_GEL_MOUSSANT]: [
    {
      slug: INGREDIENT_SLUGS.ZINC_SULFATE,
      notes: 'Régulateur de sébum',
    },
    {
      slug: INGREDIENT_SLUGS.COPPER_SULFATE,
      notes: 'Régulateur de sébum',
    },
  ],
  [allProductSlugs.BIODERMA_ATODERM_INTENSIVE_GEL_CREME]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Stimule la production de lipides',
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Apaise et réduit le grattage',
    },
  ],
  [allProductSlugs.BIODERMA_ATODERM_INTENSIVE_EYE]: [
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Enoxolone apaisante',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Complexe Lipigenium',
    },
  ],
  [allProductSlugs.BIODERMA_ATODERM_INTENSIVE_BAUME]: [
    {
      slug: INGREDIENT_SLUGS.PALMITAMIDE_MEA,
      notes: 'Actif PEA apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Lipides biomimétiques Lipigenium',
    },
  ],
  [allProductSlugs.BIODERMA_PIGMENTBIO_SENSITIVE_AREAS]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: 'Efficacité éclaircissante',
    },
  ],
  [allProductSlugs.BIODERMA_SEBIUM_KERATO_PLUS]: [
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      value: 1.8,
      unit: '%',
      notes: 'BHA exfoliant',
    },
    {
      slug: INGREDIENT_SLUGS.MALIC_ACID_ESTER,
      value: 10,
      unit: '%',
      notes: "Ester d'acide malique (AHA)",
    },
  ],
  [allProductSlugs.BIODERMA_SEBIUM_HYDRA_CLEANSER]: [
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Huile de karité nourrissante',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant',
    },
  ],
  [allProductSlugs.BIODERMA_SEBIUM_H2O]: [
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      notes: 'Assainissant',
    },
    {
      slug: INGREDIENT_SLUGS.COPPER_SULFATE,
      notes: 'Assainissant',
    },
  ],
  [allProductSlugs.BIODERMA_SEBIUM_HYDRA]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      notes: 'Relipidant',
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
      notes: 'Apaisant',
    },
  ],
  [allProductSlugs.BIODERMA_SEBIUM_SENSITIVE]: [
    {
      slug: INGREDIENT_SLUGS.BAKUCHIOL,
      notes: 'Technologie Seborestore',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      notes: 'Séborégulateur',
    },
  ],
  [allProductSlugs.BIODERMA_CICABIO_CREME_PLUS_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.POLYGLUTAMIC_ACID,
      notes: 'Acide polyglutamique hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Hydratant biomimétique',
    },
  ],
  [allProductSlugs.BIODERMA_CICABIO_BAUME_LAVANT]: [
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      notes: 'Prévient les infections',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Protection lipidique',
    },
  ],
  [allProductSlugs.BIODERMA_CICABIO_RESTOR]: [
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaisant et réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Hydratation',
    },
  ],
  [allProductSlugs.BIODERMA_CICABIO_ARNICA]: [
    {
      slug: INGREDIENT_SLUGS.ARNICA,
      notes: "Apaise l'inconfort",
    },
    {
      slug: INGREDIENT_SLUGS.ACETYL_DIPEPTIDE_1_CETYL_ESTER,
      notes: 'Technologie Antalgicine',
    },
  ],
  [allProductSlugs.BIODERMA_CICABIO_CREME_PLUS]: [
    {
      slug: INGREDIENT_SLUGS.POLYGLUTAMIC_ACID,
      notes: 'Complexe Réparation optimale',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Actif biomimétique',
    },
    {
      slug: INGREDIENT_SLUGS.ACETYL_DIPEPTIDE_1_CETYL_ESTER,
      notes: 'Technologie Antalgicine',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Lipide biomimétique',
    },
  ],
  [allProductSlugs.BIODERMA_CREALINE_GEL_MOUSSANT]: [
    {
      slug: INGREDIENT_SLUGS.RHAMNOSE,
      notes: 'Complexe breveté D.A.F.',
    },
  ],
  [allProductSlugs.BIODERMA_CREALINE_FORT]: [
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Enoxolone action rapide',
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
      notes: 'Apaisant',
    },
  ],
  [allProductSlugs.BIODERMA_CREALINE_DS_PLUS]: [
    {
      slug: INGREDIENT_SLUGS.PIROCTONE_OLAMINE,
      notes: 'Action anti-fongique',
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Apaisant',
    },
  ],
  [allProductSlugs.BIODERMA_CREALINE_DEFENSIVE]: [
    {
      slug: INGREDIENT_SLUGS.CARNOSINE,
      notes: 'Technologie défensive anti-oxydante',
    },
    {
      slug: INGREDIENT_SLUGS.SALVIA_MILTIORRHIZA,
      notes: 'Polyphénols de Sauge Rouge',
    },
  ],
  [allProductSlugs.BIODERMA_CREALINE_AR_PLUS]: [
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Actif neuro-apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
      notes: 'Lipide biomimétique',
    },
  ],
  [allProductSlugs.BIODERMA_CREALINE_DEFENSIVE_RICHE]: [
    {
      slug: INGREDIENT_SLUGS.CARNOSINE,
      notes: 'Technologie défensive',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Nourrissant',
    },
  ],
  [allProductSlugs.BIODERMA_CICABIO_SOIN_ISOLANT]: [
    {
      slug: INGREDIENT_SLUGS.RESVERATROL,
      notes: 'Synergie avec le cuivre',
    },
    {
      slug: INGREDIENT_SLUGS.COPPER_SULFATE,
      notes: 'Assainissant',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_SULFATE,
      notes: 'Assainissant',
    },
  ],
}

// Export original pour compatibilité descendante
export const BIODERMA_PRODUCT_INGREDIENTS = Object.entries(BIODERMA_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
