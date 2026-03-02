import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'

export const LABBIARRITZ_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.LABORATOIRES_BIARRITZ_CREME_SOLAIRE_VISAGE_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.ZINC_OXIDE,
      notes: 'Écrans minéraux',
    },
    {
      slug: INGREDIENT_SLUGS.TITANIUM_DIOXIDE,
      notes: 'Écrans minéraux',
    },
    {
      slug: INGREDIENT_SLUGS.ALOE_VERA,
      notes: 'Hydrate et apaise',
    },
    {
      slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL,
      notes: 'Nourrit et protège',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_OXIDE,
      notes: 'Écrans minéraux',
    },
    {
      slug: INGREDIENT_SLUGS.TITANIUM_DIOXIDE,
      notes: 'Écrans minéraux',
    },
    {
      slug: INGREDIENT_SLUGS.ALOE_VERA,
      notes: 'Hydrate et apaise',
    },
    {
      slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL,
      notes: 'Nourrit et protège',
    },
  ],
  [allProductSlugs.LABORATOIRES_BIARRITZ_CREME_SOLAIRE_TEINTEE_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.ZINC_OXIDE,
      notes: 'Écrans minéraux',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_OXIDE,
      notes: 'Écrans minéraux',
    },
    {
      slug: INGREDIENT_SLUGS.TITANIUM_DIOXIDE,
      notes: 'Écrans minéraux',
    },
    {
      slug: INGREDIENT_SLUGS.ALOE_VERA,
      notes: 'Hydrate et apaise',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Hydrate',
    },
  ],
  [allProductSlugs.LABORATOIRES_BIARRITZ_CREME_SOLAIRE_TEINTEE_SPF50_DOREE]: [
    {
      slug: INGREDIENT_SLUGS.TITANIUM_DIOXIDE,
      notes: 'Écrans minéraux',
    },
    {
      slug: INGREDIENT_SLUGS.ALOE_VERA,
      notes: 'Hydrate et apaise',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Hydrate',
    },
  ],
  [allProductSlugs.LABORATOIRES_BIARRITZ_LAIT_SOLAIRE_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.ZINC_OXIDE,
      notes: 'Écrans minéraux',
    },
    {
      slug: INGREDIENT_SLUGS.TITANIUM_DIOXIDE,
      notes: 'Écrans minéraux',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Nourrit',
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_DE_COCO,
      notes: 'Hydrate et apporte confort',
    },
  ],
  [allProductSlugs.LABORATOIRES_BIARRITZ_CICA_REPA_CREME_REPARATRICE]: [
    {
      slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL,
      notes: 'Nourrit',
    },
    {
      slug: INGREDIENT_SLUGS.ALOE_VERA,
      notes: 'Hydrate, apaise et protège',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: "Hydrate comme réservoir d'eau",
    },
  ],
  [allProductSlugs.LABORATOIRES_BIARRITZ_CREME_NUIT_REGENERANTE]: [
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: "Hydrate comme réservoir d'eau",
    },
    {
      slug: INGREDIENT_SLUGS.ALOE_VERA,
      notes: 'Hydrate et apaise',
    },
  ],
  [allProductSlugs.LABORATOIRES_BIARRITZ_CREME_VISAGE]: [
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Hydrate en profondeur',
    },
  ],
  [allProductSlugs.LABORATOIRES_BIARRITZ_CREME_NUIT_ANTI_TACHES]: [
    {
      slug: INGREDIENT_SLUGS.PHA,
      notes: 'Exfoliant doux, stimule renouvellement cellulaire',
    },
  ],
  [allProductSlugs.LABORATOIRES_BIARRITZ_SERUM_REPULPANT]: [
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: "Hydrate comme réservoir d'eau",
    },
    {
      slug: INGREDIENT_SLUGS.ECTOIN,
      notes: 'Anti-pollution, protecteur lumière bleue',
    },
  ],
  [allProductSlugs.LABORATOIRES_BIARRITZ_SERUM_ANTI_TACHES]: [
    {
      slug: INGREDIENT_SLUGS.ASCORBYL_GLUCOSIDE,
      notes: 'Redonne éclat et illumine',
    },
  ],
}

// Export original pour compatibilité descendante
export const LAB_BIARRITZ_PRODUCT_INGREDIENTS = Object.entries(LABBIARRITZ_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
