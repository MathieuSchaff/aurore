import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'

export const MAD_ABOUT_SKIN_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.MAD_ABOUT_SKIN_COPPER_PEPTIDE]: [
    {
      slug: INGREDIENT_SLUGS.COPPER_PEPTIDES,
      value: 3, // Complète le complexe cuivre à 3%
      unit: '%',
      notes: 'GHK-Cu : Régénération intense et synthèse de collagène',
    },
    {
      slug: INGREDIENT_SLUGS.PEPTIDES, // Regroupe Palmitoyl Tripeptide-1, 7, 38, etc.
      value: 4, // Basé sur ta note "4 peptides"
      unit: 'peptides', // Ou laisser à null si tu préfères juste le compte
      notes: 'Complexe raffermissant type Matrixyl (4 formes différentes)',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      value: 1, // Dosage standard pour l'hydratation
      unit: '%',
      notes: 'Hydratation profonde et effet repulpant',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      value: 1, // Concentration classique apaisante
      unit: '%',
      notes: 'Vitamine B5 : Répare la barrière cutanée',
    },
  ],
}

// Mise à jour de l'export pour inclure les concentrations
export const MAD_ABOUT_SKIN_PRODUCT_INGREDIENTS = Object.entries(
  MAD_ABOUT_SKIN_INGREDIENTS_MAP
).flatMap(([productSlug, ingredients]) =>
  ingredients.map((ing: any) => ({
    productSlug,
    ingredientSlug: ing.slug,
    concentrationValue: ing.value || null, // Ici on récupère le 1, 2, ou 4
    concentrationUnit: ing.unit || null, // Ici le '%'
    notes: ing.notes || '',
  }))
)
