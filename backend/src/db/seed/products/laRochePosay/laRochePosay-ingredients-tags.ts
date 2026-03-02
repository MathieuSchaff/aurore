import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { LRP_PRODUCT_SLUGS } from './laRochePosay'
export const LRP_INGREDIENTS_MAP: Record<string, any[]> = {
  [LRP_PRODUCT_SLUGS.LIPIKAR_HUILE_LAVANTE_AP_PLUS]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Apaise les démangeaisons',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER, // = PEG-75 SHEA BUTTER GLYCERIDES
      notes: 'Beurre de karité relipidant',
    },
    {
      slug: INGREDIENT_SLUGS.VITREOSCILLA_FERMENT, // à créer — = Aqua Posae Filiformis
      notes: 'Aqua Posae Filiformis — équilibre microbiome cutané',
    },
  ],

  [LRP_PRODUCT_SLUGS.LRP_LIPIKAR_LAIT]: [
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      value: 20,
      unit: '%',
      notes: 'Beurre de karité relipidant',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Renforce la barrière et apaise',
    },
    {
      slug: INGREDIENT_SLUGS.DIMETHICONE,
      notes: 'Film occlusif protecteur',
    },
    {
      slug: INGREDIENT_SLUGS.VITREOSCILLA_FERMENT,
      notes: 'Équilibre du microbiome cutané',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant',
    },
  ],
  [LRP_PRODUCT_SLUGS.ANTHELIOS_XL_BRUME_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.BUTYL_METHOXYDIBENZOYLMETHANE,
      notes: 'Avobenzone – UVA',
    },
    {
      slug: INGREDIENT_SLUGS.DROMETRIZOLE_TRISILOXANE,
      notes: 'Mexoryl XL – UVA/UVB stable signature La Roche-Posay',
    },
    {
      slug: INGREDIENT_SLUGS.ETHYLHEXYL_TRIAZONE,
      notes: 'Uvinul T 150 – UVB',
    },
    {
      slug: INGREDIENT_SLUGS.OCTOCRYLENE,
    },
    {
      slug: INGREDIENT_SLUGS.HOMOSALATE,
    },
    {
      slug: INGREDIENT_SLUGS.ETHYLHEXYL_SALICYLATE,
      notes: 'Octisalate – UVB',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E – antioxydant',
    },
  ],

  [LRP_PRODUCT_SLUGS.HYALU_B5_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Sodium Hyaluronate – hydratation',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'HA hydrolysé – pénétration profonde',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Vitamine B5 – réparateur, apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.MADECASSOSIDE,
      notes: 'Madecassoside – anti-âge, réparateur',
    },
  ],

  [LRP_PRODUCT_SLUGS.EFFACLAR_DUO_M]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Niacinamide – anti-imperfections, barrière',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_PCA,
      notes: 'Zinc PCA – séborégulateur',
    },
    {
      slug: INGREDIENT_SLUGS.CAPRYLOYL_SALICYLIC_ACID,
      notes: 'LHA – exfoliant doux',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      notes: 'Acide salicylique – anti-boutons',
    },
    {
      slug: INGREDIENT_SLUGS.VITREOSCILLA_FERMENT,
      notes: 'Phylobioma – microbiome',
    },
  ],

  [LRP_PRODUCT_SLUGS.CICAPLAST_B5_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Panthénol (B5) – réparateur, apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.MADECASSOSIDE,
      notes: 'Madecassoside – cicatrisation',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      notes: 'Zinc gluconate – purifiant',
    },
    {
      slug: INGREDIENT_SLUGS.MANGANESE_GLUCONATE,
    },
    {
      slug: INGREDIENT_SLUGS.COPPER_GLUCONATE,
    },
  ],

  [LRP_PRODUCT_SLUGS.ROSALIAC_AR]: [
    {
      slug: INGREDIENT_SLUGS.ACETYL_DIPEPTIDE_1_CETYL_ESTER,
      notes: 'Neurosensine – apaisant rougeurs',
    },
    {
      slug: INGREDIENT_SLUGS.SCHISANDRA,
      notes: 'Extrait schisandra – anti-rougeurs',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité – hydratant',
    },
  ],

  [LRP_PRODUCT_SLUGS.EFFACLAR_H_ISO_BIOME]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Niacinamide – répare barrière',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Panthénol – apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Squalane – hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.VITREOSCILLA_FERMENT,
      notes: 'Phylobioma – microbiome',
    },
  ],

  [LRP_PRODUCT_SLUGS.CICAPLAST_BAUME_B5_PLUS]: [
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Panthénol (B5) – réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.MADECASSOSIDE,
      notes: 'Madecassoside – cicatrisation',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Centella – apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.ALPHA_GLUCAN_OLIGOSACCHARIDE,
      notes: 'Prébiotique – microbiome',
    },
  ],

  [LRP_PRODUCT_SLUGS.HYALU_B5_CREME]: [
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'HA haut PM – hydratation surface',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'HA bas PM – pénétration profonde',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Vitamine B5 – repulpant',
    },
  ],

  [LRP_PRODUCT_SLUGS.EFFACLAR_MAT]: [
    {
      slug: INGREDIENT_SLUGS.SILICA,
      notes: 'Silica/Perlite – matifiant, absorbe sébum',
    },
    {
      slug: INGREDIENT_SLUGS.CAPRYLOYL_SALICYLIC_ACID,
      notes: 'LHA – exfoliant doux',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
    },
  ],

  [LRP_PRODUCT_SLUGS.TOLERIANE_SENSITIVE]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Niacinamide – apaisant, barrière',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Céramide NP – renforce barrière',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
    },
  ],

  [LRP_PRODUCT_SLUGS.PURE_VITAMIN_C12]: [
    {
      slug: INGREDIENT_SLUGS.VITAMIN_C,
      notes: '12% Acide ascorbique pur – éclat, anti-taches',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      notes: 'Acide salicylique – texture',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
    },
  ],

  [LRP_PRODUCT_SLUGS.LIPIKAR_HUILE_LAVANTE_AP_PLUS]: [
    // Huile lavante → focus douceur, pas d'actifs listés en détail
    // Peut-être ajouter si INCI fourni plus tard
  ],

  [LRP_PRODUCT_SLUGS.LIPIKAR_BAUME_AP_M]: [
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: '20% beurre de karité – nutrition intense',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Niacinamide – apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.VITREOSCILLA_FERMENT,
      notes: 'Aqua Posae Filiformis – prébiotique microbiome',
    },
  ],

  [LRP_PRODUCT_SLUGS.EFFACLAR_GEL_NETTOYANT]: [
    {
      slug: INGREDIENT_SLUGS.ZINC_PCA,
      notes: 'Zinc PCA – purifiant',
    },
    {
      slug: INGREDIENT_SLUGS.PUNICA_GRANATUM,
      notes: 'Extrait grenade – apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.VITREOSCILLA_FERMENT,
      notes: 'Phylobioma – microbiome',
    },
  ],

  [LRP_PRODUCT_SLUGS.SERUM_B3_RETINOL]: [
    {
      slug: INGREDIENT_SLUGS.RETINOL,
      notes: 'Rétinol pur + libération graduelle – anti-rides',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Niacinamide – apaisant, tolérance',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
    },
  ],

  [LRP_PRODUCT_SLUGS.SERUM_MELA_B3]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: '10% Niacinamide – anti-taches, barrière',
    },
    {
      slug: INGREDIENT_SLUGS.MELASYL, // ou CYSTOSEIRA_TAMARISCIFOLIA si Melasyl est dérivé
      notes: 'Melasyl™ multibreveté – corrige taches persistantes',
    },
    {
      slug: INGREDIENT_SLUGS.CAPRYLOYL_SALICYLIC_ACID,
    },
  ],
}

// Export pour compatibilité descendante
export const LRP_PRODUCT_INGREDIENTS = Object.entries(LRP_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
