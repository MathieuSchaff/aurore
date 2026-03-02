import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
export const SKIN1004_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.SKIN1004_MADAGASCAR_CENTELLA_PROBIO_CICA]: [
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Centella fermentée (ProBio-Cica) + extrait – apaisant, barrière',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Ferment Centella – renforce barrière, probiotique',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Céramide NP – réparation barrière',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },

    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
    },
    {
      slug: INGREDIENT_SLUGS.ASIATIC_ACID,
      notes: 'TECA (madecassic + asiaticoside + asiatic acid) – apaisant signature',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Barrière, anti-imperfections',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
    },
  ],

  [allProductSlugs.SKIN1004_MADAGASCAR_CENTELLA_SOOTHING_CREAM]: [
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: '72% extrait Centella Madagascar – apaisant intense, signature produit',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
      notes: '4 céramides – renforce barrière cutanée',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
    },
    {
      slug: INGREDIENT_SLUGS.BETA_GLUCAN,
      notes: 'Hydratant apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.TREHALOSE,
    },
  ],

  [allProductSlugs.SKIN1004_TEA_TRICA_RELIEF_MINI]: [
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: '55% extrait Centella – apaisant, réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.TEA_TREE,
      notes: 'Eau de tea tree 9.4% + huile 200 ppm – anti-inflammatoire, anti-imperfections',
    },
    {
      slug: INGREDIENT_SLUGS.PINUS_PALUSTRIS,
      notes: 'Extrait pin – antibactérien, soulage irritations',
    },
    {
      slug: INGREDIENT_SLUGS.CYPRES,
      notes: 'Eau de cyprès – apaisant',
    },
  ],

  [allProductSlugs.SKIN1004_MADAGASCAR_CENTELLA_100]: [
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: '100% extrait Centella Madagascar – ultra-minimaliste, apaisant pur',
    },
    // Produit très simple (7 ingrédients) → focus unique sur Centella
  ],

  [allProductSlugs.SKIN1004_SPOT_COVER_PATCH]: [
    // Patch hydrocolloïde → pas d'INCI actifs, focus mécanique (protection/absorption)
    // Pas d'ingrédients clés listés → on peut laisser vide ou ajouter note si besoin
  ],

  [allProductSlugs.SKIN1004_CENTELLA_PROBIO_CICA_ESSENCE]: [
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Centella fermentée (ProBio-Cica) – apaisant, barrière',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Ferment probiotique – renforce barrière',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Céramide NP – réparation',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaisant, hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.TREHALOSE,
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'HA cross-linked – hydratation longue durée',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
    },
    {
      slug: INGREDIENT_SLUGS.ASIATIC_ACID,
      notes: 'TECA complet',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
  ],

  [allProductSlugs.SKIN1004_MADAGASCAR_CENTELLA_TONING]: [
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: '84% extrait Centella – apaisant, hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.PHA,
      notes: 'PHA doux – exfoliation légère, hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Éclaircissant, barrière',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'HA – hydratation',
    },
    {
      slug: INGREDIENT_SLUGS.BETAINE,
    },
  ],
}

// Export pour compatibilité descendante
export const SKIN1004_PRODUCT_INGREDIENTS = Object.entries(SKIN1004_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
