import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'

export const SERUMS_PEPTIDES_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.NIOD_COPPER_AMINO_ISOLATE_LIPID_1]: [
    {
      slug: INGREDIENT_SLUGS.COPPER_TRIPEPTIDE_1_PALMITAMIDE,
      notes: '1% GHK-Cu lipophile (Pal-GHK-Cu) – réparation profonde, anti-âge, collagène/élastine',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Base lipophile – occlusion, hydratation intense',
    },
    {
      slug: INGREDIENT_SLUGS.VETIVERIA_ZIZANOIDES,
      notes: 'Extrait racine vétiver – antioxydant, régénérant',
    },
    {
      slug: INGREDIENT_SLUGS.APHANIZOMENON_FLOS_AQUAE,
      notes: 'Extrait algue bleue – antioxydant, protection cellulaire',
    },
    {
      slug: INGREDIENT_SLUGS.BISABOLOL,
    },
    {
      slug: INGREDIENT_SLUGS.BIOSACCHARIDE_GUM_1,
      notes: 'Hydratant filmogène',
    },
  ],

  [allProductSlugs.NOOANCE_PEPTIDES_CUIVRE_2]: [
    {
      slug: INGREDIENT_SLUGS.COPPER_PEPTIDES,
      notes: '2% GHK-Cu (Copper Tripeptide-1) – réparation, anti-âge, barrière, collagène',
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TRIPEPTIDE_1,
      notes: 'Matrixyl 3000 (avec Pal-Tetrapeptide-7)',
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TETRAPEPTIDE_7,
    },
    {
      slug: INGREDIENT_SLUGS.TRIFLUOROACETYL_TRIPEPTIDE_2,
      notes: '2% Trifluoroacetyl Tripeptide-2 – anti-relâchement, fermeté (Progeline-like)',
    },
    {
      slug: INGREDIENT_SLUGS.TRIPEPTIDE_1,
      notes: '2% Tripeptide-1 – stimulation collagène',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaisant, hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
    },
    {
      slug: INGREDIENT_SLUGS.ALPHA_GLUCAN_OLIGOSACCHARIDE,
      notes: 'Prébiotique – équilibre microbiome',
    },
    {
      slug: INGREDIENT_SLUGS.BETA_GLUCAN,
    },
  ],
}

// Export pour compatibilité descendante
export const SERUMS_PEPTIDES_PRODUCT_INGREDIENTS = Object.entries(
  SERUMS_PEPTIDES_INGREDIENTS_MAP
).flatMap(([productSlug, ingredients]) =>
  ingredients.map((ing: any) => ({
    productSlug,
    ingredientSlug: ing.slug,
    concentrationValue: ing.value || null,
    concentrationUnit: ing.unit || null,
    notes: ing.notes || '',
  }))
)
