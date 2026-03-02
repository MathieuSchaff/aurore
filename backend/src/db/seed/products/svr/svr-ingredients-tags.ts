import { INGREDIENT_SLUGS } from '../../ingredients/seed-ingredients'
import { SVR_PRODUCT_SLUGS } from './svr'

export const SVR_PRODUCT_INGREDIENTS = [
  // Clairial Ampoule
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CLAIRIAL_AMPOULE,
    ingredientSlug: INGREDIENT_SLUGS.THD_ASCORBATE,
    concentrationValue: 2,
    concentrationUnit: '%',
    notes: 'Vitamine C optimisée',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CLAIRIAL_AMPOULE,
    ingredientSlug: INGREDIENT_SLUGS.DIACETYL_BOLDINE,
    notes: 'Complexe dépigmentant',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CLAIRIAL_AMPOULE,
    ingredientSlug: INGREDIENT_SLUGS.ASCOPHYLLUM_NODOSUM_EXTRACT,
    notes: 'Extrait d algue brune anti-pollution',
  },

  // Clairial Sérum
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CLAIRIAL_SERUM,
    ingredientSlug: INGREDIENT_SLUGS.THD_ASCORBATE,
    concentrationValue: 2,
    concentrationUnit: '%',
    notes: 'Vitamine C optimisée',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CLAIRIAL_SERUM,
    ingredientSlug: INGREDIENT_SLUGS.SEPIWHITE,
    notes: 'Inhibiteur de mélanine',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CLAIRIAL_SERUM,
    ingredientSlug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
    notes: 'Acide hyaluronique HPM',
  },

  // Clairial Night Peel
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CLAIRIAL_NIGHT_PEEL,
    ingredientSlug: INGREDIENT_SLUGS.PAPAIN,
    notes: 'Enzyme de papaye exfoliante',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CLAIRIAL_NIGHT_PEEL,
    ingredientSlug: INGREDIENT_SLUGS.NIACINAMIDE,
    notes: 'Renouvellement cutané',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CLAIRIAL_NIGHT_PEEL,
    ingredientSlug: INGREDIENT_SLUGS.SEPIWHITE,
    notes: 'Action dépigmentante Sepiwhite',
  },

  // Densitium Bi-Sérum
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_DENSITIUM_BI_SERUM,
    ingredientSlug: INGREDIENT_SLUGS.CALCIUM_PCA,
    notes: 'Bio-calcium restructurant',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_DENSITIUM_BI_SERUM,
    ingredientSlug: INGREDIENT_SLUGS.HYALURONIC_ACID,
    notes: 'Acide hyaluronique ultra-fragmenté',
  },

  // Densitium Crème
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_DENSITIUM_CREME,
    ingredientSlug: INGREDIENT_SLUGS.CALCIUM_PCA,
    notes: 'Bio-calcium',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_DENSITIUM_CREME,
    ingredientSlug: INGREDIENT_SLUGS.ARGININE_PCA,
    notes: 'Duo d acides aminés anti-jaunissement',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_DENSITIUM_CREME,
    ingredientSlug: INGREDIENT_SLUGS.PALMITOYL_TRIPEPTIDE_1,
    notes: 'Peptide lissant',
  },

  // Cicavit Crème HPPI
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_PLUS_CREME_HPPI,
    ingredientSlug: INGREDIENT_SLUGS.CURCUMA_LONGA_ROOT_EXTRACT,
    notes: 'Dérivé de curcuma régénérant',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_PLUS_CREME_HPPI,
    ingredientSlug: INGREDIENT_SLUGS.HYALURONIC_ACID,
    notes: 'Hydrate et favorise la réépithélialisation',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_PLUS_CREME_HPPI,
    ingredientSlug: INGREDIENT_SLUGS.NIACINAMIDE,
    notes: 'Renforce la barrière cutanée',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_PLUS_CREME_HPPI,
    ingredientSlug: INGREDIENT_SLUGS.ALPHA_GLUCAN_OLIGOSACCHARIDE,
    notes: 'Polysaccharides pour l équilibre du microbiote',
  },

  // Cicavit+ Gel Moussant
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_GEL_MOUSSANT,
    ingredientSlug: INGREDIENT_SLUGS.RHAMNOSE,
    notes: 'Polysaccharide protecteur',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_GEL_MOUSSANT,
    ingredientSlug: INGREDIENT_SLUGS.ALPHA_GLUCAN_OLIGOSACCHARIDE,
    notes: 'Sucre prébiotique',
  },

  // Cicavit+ Crème Mains
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_CREME_MAINS,
    ingredientSlug: INGREDIENT_SLUGS.HUILE_DE_COCO,
    notes: 'Nourrit intensément',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_CREME_MAINS,
    ingredientSlug: INGREDIENT_SLUGS.SHEA_BUTTER,
    notes: 'Beurre végétal nourrissant',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_CREME_MAINS,
    ingredientSlug: INGREDIENT_SLUGS.ALPHA_GLUCAN_OLIGOSACCHARIDE,
    notes: 'Sucre prébiotique',
  },

  // Cicavit+ Crème SPF50+
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_CREME_SPF50,
    ingredientSlug: INGREDIENT_SLUGS.NIACINAMIDE,
    notes: 'Apaisant et anti-marques',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_CREME_SPF50,
    ingredientSlug: INGREDIENT_SLUGS.ALPHA_GLUCAN_OLIGOSACCHARIDE,
    notes: 'Sucre prébiotique',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_CREME_SPF50,
    ingredientSlug: INGREDIENT_SLUGS.RHAMNOSE,
    notes: 'Réduit rougeurs et échauffements',
  },

  // Cicavit+ Baume Lèvres
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_BAUME_LEVRES,
    ingredientSlug: INGREDIENT_SLUGS.RICINUS_COMMUNIS_SEED_OIL,
    notes: 'Huile de ricin protectrice',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_BAUME_LEVRES,
    ingredientSlug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL,
    notes: 'Huile d amande douce',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_BAUME_LEVRES,
    ingredientSlug: INGREDIENT_SLUGS.SHEA_BUTTER,
    notes: 'Beurre de karité nourrissant',
  },

  // Cicavit+ SOS Grattage
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_SOS_GRATTAGE,
    ingredientSlug: INGREDIENT_SLUGS.NIACINAMIDE,
    notes: 'Complexe anti-irritations',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_SOS_GRATTAGE,
    ingredientSlug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
    notes: 'Réparation épidermique sans marque',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_SOS_GRATTAGE,
    ingredientSlug: INGREDIENT_SLUGS.PANTHENOL,
    notes: 'Provitamine B5 apaisante',
  },

  // Cicavit DM+ Cicatrices
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_CICAVIT_DM_PLUS,
    ingredientSlug: INGREDIENT_SLUGS.DIMETHICONE,
    concentrationValue: 53,
    concentrationUnit: '%',
    notes: 'Complexe silicone barrière',
  },

  // SVR [C] Eye Biotic
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_C_EYE_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.THD_ASCORBATE,
    concentrationValue: 5,
    concentrationUnit: '%',
    notes: 'Vitamine C optimisée',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_C_EYE_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.ARGIRELINE,
    notes: 'Peptide lissant',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_C_EYE_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.PROBIOTICS,
    notes: 'Probiotiques pasteurisés',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_C_EYE_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.HYALURONIC_ACID,
    notes: 'Acide hyaluronique bas poids moléculaire',
  },

  // [COLLAGEN] Biotic
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_COLLAGEN_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.COLLAGEN_AMINO_ACIDS,
    concentrationValue: 2,
    concentrationUnit: '%',
    notes: 'Collagène végétal',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_COLLAGEN_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.THD_ASCORBATE,
    notes: 'Vitamine C optimisée',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_COLLAGEN_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.PROBIOTICS,
    notes: 'Probiotiques pasteurisés',
  },

  // [FILLER] Biotic
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_FILLER_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.MELITANE,
    notes: 'Peptide liftant',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_FILLER_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.THD_ASCORBATE,
    notes: 'Vitamine C optimisée',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_FILLER_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.PROBIOTICS,
    notes: 'Probiotiques pasteurisés',
  },

  // [PEPTI] BIOTIC
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_PEPTI_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.SYN_AKE,
    notes: 'Peptides lissants',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_PEPTI_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.THD_ASCORBATE,
    notes: 'Vitamine C optimisée',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_PEPTI_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.PROBIOTICS,
    notes: 'Probiotiques pasteurisés',
  },

  // [C20] BIOTIC
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_C20_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.THD_ASCORBATE,
    concentrationValue: 20,
    concentrationUnit: '%',
    notes: 'Vitamine C optimisée',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_C20_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.PROBIOTICS,
    notes: 'Probiotiques pasteurisés',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_C20_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.HYALURONIC_ACID,
    notes: 'Acide hyaluronique',
  },

  // [HYALU] Biotic
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_HYALU_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
    notes: 'Moyen poids moléculaire',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_HYALU_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.HYALURONIC_ACID,
    notes: 'Bas poids moléculaire',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_HYALU_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.THD_ASCORBATE,
    notes: 'Vitamine C optimisée',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_HYALU_BIOTIC,
    ingredientSlug: INGREDIENT_SLUGS.PROBIOTICS,
    notes: 'Probiotiques pasteurisés',
  },

  // [C20] Fluide
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_C20_FLUIDE,
    ingredientSlug: INGREDIENT_SLUGS.THD_ASCORBATE,
    concentrationValue: 20,
    concentrationUnit: '%',
    notes: 'Vitamine C optimisée',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_C20_FLUIDE,
    ingredientSlug: INGREDIENT_SLUGS.GLYCERYL_GLUCOSIDE,
    notes: 'Booster d aquaporines',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_C20_FLUIDE,
    ingredientSlug: INGREDIENT_SLUGS.PROBIOTICS,
    notes: 'Probiotiques pasteurisés',
  },

  // Sebiaclear Ampoule Flash
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_FLASH_15,
    ingredientSlug: INGREDIENT_SLUGS.AZELAIC_ACID,
    concentrationValue: 15,
    concentrationUnit: '%',
    notes: 'Régule le sébum et réduit les imperfections',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_FLASH_15,
    ingredientSlug: INGREDIENT_SLUGS.NIACINAMIDE,
    concentrationValue: 2,
    concentrationUnit: '%',
    notes: 'Hydrate et apaise',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_FLASH_15,
    ingredientSlug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
    concentrationValue: 2,
    concentrationUnit: '%',
    notes: "Régule l'excès de sébum",
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_FLASH_15,
    ingredientSlug: INGREDIENT_SLUGS.SALICYLIC_ACID,
    notes: 'Purifie et lisse le grain de peau',
  },

  // Sebiaclear Gel Flash 4H
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_GEL_FLASH_4H,
    ingredientSlug: INGREDIENT_SLUGS.AZELAIC_ACID,
    concentrationValue: 5,
    concentrationUnit: '%',
    notes: 'Réduit les imperfections et rougeurs',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_GEL_FLASH_4H,
    ingredientSlug: INGREDIENT_SLUGS.NIACINAMIDE,
    concentrationValue: 5,
    concentrationUnit: '%',
    notes: 'Apaise les irritations et limite les marques',
  },

  // Sebiaclear Spray Corps
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_SPRAY_CORPS,
    ingredientSlug: INGREDIENT_SLUGS.PHA,
    concentrationValue: 8,
    concentrationUnit: '%',
    notes: 'Purifie et lisse la peau',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_SPRAY_CORPS,
    ingredientSlug: INGREDIENT_SLUGS.NIACINAMIDE,
    concentrationValue: 5,
    concentrationUnit: '%',
    notes: 'Diminue la production de sébum',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_SPRAY_CORPS,
    ingredientSlug: INGREDIENT_SLUGS.LACTIC_ACID,
    concentrationValue: 2,
    concentrationUnit: '%',
    notes: 'Affine et lisse le grain de peau',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_SPRAY_CORPS,
    ingredientSlug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
    concentrationValue: 1,
    concentrationUnit: '%',
    notes: "Régule l'excès de sébum",
  },

  // Sebiaclear Micro-Peel
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_MICRO_PEEL,
    ingredientSlug: INGREDIENT_SLUGS.LACTIC_ACID,
    notes: "Duo d'acides exfoliant",
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_MICRO_PEEL,
    ingredientSlug: INGREDIENT_SLUGS.SALICYLIC_ACID,
    notes: "Duo d'acides exfoliant",
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_MICRO_PEEL,
    ingredientSlug: INGREDIENT_SLUGS.NIACINAMIDE,
    concentrationValue: 4,
    concentrationUnit: '%',
    notes: 'Apaise et élimine les imperfections',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_MICRO_PEEL,
    ingredientSlug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
    concentrationValue: 1,
    concentrationUnit: '%',
    notes: "Régule l'excès de sébum",
  },

  // Sebiaclear Gel Moussant
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_GEL_MOUSSANT,
    ingredientSlug: INGREDIENT_SLUGS.PHA,
    concentrationValue: 4,
    concentrationUnit: '%',
    notes: 'Purifie et désincruste les pores',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_GEL_MOUSSANT,
    ingredientSlug: INGREDIENT_SLUGS.SALICYLIC_ACID,
    notes: 'Exfolie et resserre les pores',
  },

  // Sebiaclear Sérum
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_SERUM,
    ingredientSlug: INGREDIENT_SLUGS.PHA,
    concentrationValue: 14,
    concentrationUnit: '%',
    notes: 'PHA affine le grain de peau',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_SERUM,
    ingredientSlug: INGREDIENT_SLUGS.NIACINAMIDE,
    concentrationValue: 4,
    concentrationUnit: '%',
    notes: 'Limite la prolifération bactérienne',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_SERUM,
    ingredientSlug: INGREDIENT_SLUGS.HYALURONIC_ACID,
    notes: 'Protège et repulpe',
  },

  // Sebiaclear Crème Lavante
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_CREME_LAVANTE,
    ingredientSlug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
    notes: "Régule l'excès de sébum",
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_CREME_LAVANTE,
    ingredientSlug: INGREDIENT_SLUGS.NIACINAMIDE,
    notes: "Hydrate et favorise l'équilibre barrière",
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_CREME_LAVANTE,
    ingredientSlug: INGREDIENT_SLUGS.GLYCERIN,
    notes: 'Hydratation complémentaire',
  },

  // Sebiaclear Hydra
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_HYDRA,
    ingredientSlug: INGREDIENT_SLUGS.NIACINAMIDE,
    concentrationValue: 5,
    concentrationUnit: '%',
    notes: 'Apaise les irritations et prévient les marques',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_HYDRA,
    ingredientSlug: INGREDIENT_SLUGS.HYALURONIC_ACID,
    notes: 'Hydrate en profondeur',
  },

  // Sebiaclear Active Gel
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_ACTIVE_GEL,
    ingredientSlug: INGREDIENT_SLUGS.PHA,
    concentrationValue: 14,
    concentrationUnit: '%',
    notes: 'Libère les pores obstrués',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_ACTIVE_GEL,
    ingredientSlug: INGREDIENT_SLUGS.NIACINAMIDE,
    concentrationValue: 4,
    concentrationUnit: '%',
    notes: 'Limite la prolifération bactérienne',
  },

  // Sebiaclear Mat+Pores
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_MAT_PORES,
    ingredientSlug: INGREDIENT_SLUGS.PHA,
    concentrationValue: 4,
    concentrationUnit: '%',
    notes: 'Purifie et désincruste',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_MAT_PORES,
    ingredientSlug: INGREDIENT_SLUGS.NIACINAMIDE,
    concentrationValue: 4,
    concentrationUnit: '%',
    notes: 'Réduit les imperfections',
  },

  // Sebiaclear Crème SPF50+
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_CREME_SPF50,
    ingredientSlug: INGREDIENT_SLUGS.NIACINAMIDE,
    concentrationValue: 4,
    concentrationUnit: '%',
    notes: 'Régule le sébum et limite les marques UV',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SEBIACLEAR_CREME_SPF50,
    ingredientSlug: INGREDIENT_SLUGS.SALICYLIC_ACID,
    notes: 'Lisse le grain de peau',
  },

  // Sensifine Hydra-Crème
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_HYDRA_CREME,
    ingredientSlug: INGREDIENT_SLUGS.PANTHENOL,
    concentrationValue: 5,
    concentrationUnit: '%',
    notes: 'Apaise et hydrate intensément',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_HYDRA_CREME,
    ingredientSlug: INGREDIENT_SLUGS.HUILE_DE_PEPINS_DE_RAISIN,
    notes: 'Huile végétale protectrice',
  },

  // Xerial 10 Lait
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_XERIAL_10_LAIT,
    ingredientSlug: INGREDIENT_SLUGS.UREA,
    concentrationValue: 10,
    concentrationUnit: '%',
    notes: 'Urée pure brevetée',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_XERIAL_10_LAIT,
    ingredientSlug: INGREDIENT_SLUGS.PANTHENOL,
    notes: 'Apaise et hydrate',
  },

  // Ampoule [A] Lift
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_AMPOULE_A_LIFT,
    ingredientSlug: INGREDIENT_SLUGS.RETINOL,
    concentrationValue: 0.3,
    concentrationUnit: '%',
    notes: 'Rétinol pur',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_AMPOULE_A_LIFT,
    ingredientSlug: INGREDIENT_SLUGS.NIACINAMIDE,
    notes: 'Protège la barrière',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_AR_SPF50,
    ingredientSlug: INGREDIENT_SLUGS.ENDOTHELYOL,
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_AR_SPF50,
    ingredientSlug: INGREDIENT_SLUGS.AMMONIUM_GLYCYRRHIZATE,
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_AR_SPF50,
    ingredientSlug: INGREDIENT_SLUGS.DIETHYLAMINO_HYDROXYBENZOYL_HEXYL_BENZOATE,
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_AR_SPF50,
    ingredientSlug: INGREDIENT_SLUGS.ETHYLHEXYL_TRIAZONE,
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_AR_SPF50,
    ingredientSlug: INGREDIENT_SLUGS.ARGININE,
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_AR_SPF50,
    ingredientSlug: INGREDIENT_SLUGS.TOCOPHEROL,
  },
  // ═══════════════════════════════════════════════════
  // SVR Sensifine AR Crème
  // ═══════════════════════════════════════════════════
  { productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_AR, ingredientSlug: INGREDIENT_SLUGS.GLYCERIN },
  { productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_AR, ingredientSlug: INGREDIENT_SLUGS.SHEA_BUTTER },
  { productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_AR, ingredientSlug: INGREDIENT_SLUGS.SQUALANE },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_AR,
    ingredientSlug: INGREDIENT_SLUGS.PENTYLENE_GLYCOL,
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_AR,
    ingredientSlug: INGREDIENT_SLUGS.OPHIOPOGON_JAPONICUS,
    notes: 'Actif thermorégulateur anti-flush',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_AR,
    ingredientSlug: INGREDIENT_SLUGS.SPHINGOMONAS_FERMENT,
    notes: 'Postbiotique rééquilibrant le microbiome',
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_AR,
    ingredientSlug: INGREDIENT_SLUGS.GLYCOSPHINGOLIPIDS,
  },
  {
    productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_AR,
    ingredientSlug: INGREDIENT_SLUGS.RHAMNOSE,
    notes: 'Anti-inflammatoire et stimulant du collagène',
  },
  { productSlug: SVR_PRODUCT_SLUGS.SVR_SENSIFINE_AR, ingredientSlug: INGREDIENT_SLUGS.TOCOPHEROL },
]
