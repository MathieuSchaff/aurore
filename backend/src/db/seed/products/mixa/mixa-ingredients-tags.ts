import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
export const MIXA_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.NIACINAMIDE_CORRECTION_ECLAT]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Niacinamide – unifie teint, atténue taches post-acné, barrière',
    },
    {
      slug: INGREDIENT_SLUGS.ASCORBYL_GLUCOSIDE,
      notes: 'Vitamine C stable (Ascorbyl Glucoside) – éclat, anti-taches',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité – nourrissant 48h',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      notes: 'Acide salicylique doux – exfoliation légère, anti-imperfections',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E – antioxydant',
    },
  ],

  [allProductSlugs.ACIDE_HYALURONIQUE_FRAICHE]: [
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Acide hyaluronique – hydratation 24h, sensation fraîche',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité – nourrissant',
    },
    {
      slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL,
      notes: "Huile d'amande douce – émollient",
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_SOJA,
      notes: 'Huile de soja – nourrissante',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],

  [allProductSlugs.PEAUX_SECHES_SENSIBLES]: [
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité – nourrissant intense',
    },
    {
      slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL,
      notes: "Huile d'amande douce – apaisant",
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_SOJA,
      notes: 'Huile de soja – émollient',
    },
    {
      slug: INGREDIENT_SLUGS.CAPRYLIC_CAPRIC_TRIGLYCERIDE,
      notes: 'Triglycérides – hydratation légère',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],

  [allProductSlugs.PANTHENOL_CONFORT]: [
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Panthénol – apaisant, anti-démangeaisons, réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.BEURRE_CACAO,
      notes: 'Niacinamide – barrière, anti-irritations',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité – confort',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E – antioxydant',
    },
  ],

  [allProductSlugs.CERAMIDE_PROTECTION]: [
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Squalane – renforce barrière, protection pollution',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité – nourrissant',
    },
    {
      slug: INGREDIENT_SLUGS.TWO_OLEAMIDO_1_3_OCTADECANEDIOL,
      notes: 'Céramide synthétique (2-Oleamido-1,3-Octadecanediol) – barrière',
    },
    {
      slug: INGREDIENT_SLUGS.HYDROXYPALMITOYL_SPHINGANINE,
      notes: 'Céramide-like – protection atopique',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],

  [allProductSlugs.CICA_REPARATION]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      notes: 'Urée haute concentration – exfolie, hydrate, répare kératose/squames',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Niacinamide – apaisant, barrière',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Panthénol – réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCINE,
      notes: 'Glycine – hydratant, apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHERYL_ACETATE,
    },
  ],

  [allProductSlugs.PEAUX_TRES_SECHES_TERNES]: [
    {
      slug: INGREDIENT_SLUGS.BEURRE_CACAO,
      notes: 'Beurre de cacao pur – nutrition intense, anti-terne',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité – nourrissant 48h',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Glycérine – hydratant',
    },
  ],
}

// Export pour compatibilité descendante
export const MIXA_PRODUCT_INGREDIENTS = Object.entries(MIXA_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
