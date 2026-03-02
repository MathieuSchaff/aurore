import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
export const SOLAIRES_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.ACTINICA_LOTION_SPF50_LOT3]: [
    {
      slug: INGREDIENT_SLUGS.BIS_ETHYLHEXYLOXYPHENOL_METHOXYPHENYL_TRIAZINE,
      notes: 'Tinosorb S – large spectre UVA/UVB stable',
    },
    {
      slug: INGREDIENT_SLUGS.ETHYLHEXYL_TRIAZONE,
      notes: 'Uvinul T 150 – UVB fort',
    },
    // {
    //   slug: INGREDIENT_SLUGS.ISOAMYL_P_METHOXYCINNAMATE,
    // },
    // {
    //   slug: INGREDIENT_SLUGS.ETHYLHEXYL_METHOXYCINNAMATE,
    //   notes: 'Octinoxate – UVB',
    // },
    // {
    //   slug: INGREDIENT_SLUGS.METHYLENE_BIS_BENZOTRIAZOLYL_TETRAMETHYLBUTYLPHENOL,
    //   notes: 'Tinosorb M – UVA/UVB + minéral-like',
    // },
    {
      slug: INGREDIENT_SLUGS.BUTYL_METHOXYDIBENZOYLMETHANE,
      notes: 'Avobenzone – UVA',
    },
    // Focus filtres chimiques large spectre (prévention kératoses/cancers cutanés)
  ],

  [allProductSlugs.EUCERIN_PHOTOAGING_CONTROL_FLUIDE_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.BUTYL_METHOXYDIBENZOYLMETHANE,
      notes: 'Avobenzone – UVA',
    },
    {
      slug: INGREDIENT_SLUGS.BIS_ETHYLHEXYLOXYPHENOL_METHOXYPHENYL_TRIAZINE,
      notes: 'Tinosorb S – large spectre',
    },
    {
      slug: INGREDIENT_SLUGS.ETHYLHEXYL_TRIAZONE,
      notes: 'Uvinul T 150 – UVB',
    },
    {
      slug: INGREDIENT_SLUGS.DIETHYLAMINO_HYDROXYBENZOYL_HEXYL_BENZOATE,
      notes: 'Uvinul A Plus – UVA fort',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'HA – hydratation anti-âge',
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Apaisant, anti-inflammatoire',
    },
  ],

  [allProductSlugs.EUCERIN_LEB_PROTECT_CREME_GEL_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.BUTYL_METHOXYDIBENZOYLMETHANE,
    },
    {
      slug: INGREDIENT_SLUGS.BIS_ETHYLHEXYLOXYPHENOL_METHOXYPHENYL_TRIAZINE,
    },
    {
      slug: INGREDIENT_SLUGS.DIETHYLAMINO_HYDROXYBENZOYL_HEXYL_BENZOATE,
    },
    {
      slug: INGREDIENT_SLUGS.ETHYLHEXYL_TRIAZONE,
    },
    // {
    //   slug: INGREDIENT_SLUGS.DIETHYLHEXYL_BUTAMIDO_TRIAZONE,
    //   notes: 'Uvasorb HEB – UVB/UVA',
    // },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Réglisse – apaisant sensitive',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E – antioxydant',
    },
  ],

  [allProductSlugs.RIEMANN_P20_SENSITIVE_FACE_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.DIETHYLAMINO_HYDROXYBENZOYL_HEXYL_BENZOATE,
      notes: 'Uvinul A Plus – UVA',
    },
    {
      slug: INGREDIENT_SLUGS.BIS_ETHYLHEXYLOXYPHENOL_METHOXYPHENYL_TRIAZINE,
    },
    {
      slug: INGREDIENT_SLUGS.ETHYLHEXYL_TRIAZONE,
    },
    // {
    //   slug: INGREDIENT_SLUGS.TRIS_BIPHENYL_TRIAZINE,
    //   notes: 'Tinosorb A2B (nano) – large spectre',
    // },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaisant, hydratant sensitive',
    },
    {
      slug: INGREDIENT_SLUGS.TREHALOSE,
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHERYL_ACETATE,
      notes: 'Vitamine E',
    },
  ],

  [allProductSlugs.RIEMANN_P20_URBAN_SHIELD_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.DIETHYLAMINO_HYDROXYBENZOYL_HEXYL_BENZOATE,
    },
    {
      slug: INGREDIENT_SLUGS.BIS_ETHYLHEXYLOXYPHENOL_METHOXYPHENYL_TRIAZINE,
    },
    {
      slug: INGREDIENT_SLUGS.ETHYLHEXYL_TRIAZONE,
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    // {
    //   slug: INGREDIENT_SLUGS.SPINACIA_OLERACEA,
    //   notes: 'Extrait épinard – antioxydant anti-pollution',
    // },
    // {
    //   slug: INGREDIENT_SLUGS.TARAXACUM_OFFICINALE,
    //   notes: 'Pissenlit – détox',
    // },
    // {
    //   slug: INGREDIENT_SLUGS.ARISTOTELIA_CHILENSIS,
    //   notes: 'Maqui berry – antioxydant',
    // },
    // {
    //   slug: INGREDIENT_SLUGS.TEPHROSIA_PURPUREA,
    //   notes: 'Anti-pollution urbaine',
    // },
  ],

  [allProductSlugs.RIEMANN_P20_SENSITIVE_SKIN_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.DIETHYLAMINO_HYDROXYBENZOYL_HEXYL_BENZOATE,
    },
    {
      slug: INGREDIENT_SLUGS.BIS_ETHYLHEXYLOXYPHENOL_METHOXYPHENYL_TRIAZINE,
    },
    {
      slug: INGREDIENT_SLUGS.ETHYLHEXYL_TRIAZONE,
    },
    // {
    //   slug: INGREDIENT_SLUGS.TRIS_BIPHENYL_TRIAZINE,
    //   notes: 'Tinosorb A2B (nano)',
    // },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL, // implicite sensitive, souvent présent
    },
  ],
}

// Export pour compatibilité descendante
export const SOLAIRES_PRODUCT_INGREDIENTS = Object.entries(SOLAIRES_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
