import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
export const SVR_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.SVR_CLAIRIAL_AMPOULE]: [
    {
      slug: INGREDIENT_SLUGS.THD_ASCORBATE,
      value: 2,
      unit: '%',
      notes: 'Vitamine C optimisée',
    },
    {
      slug: INGREDIENT_SLUGS.DIACETYL_BOLDINE,
      notes: 'Complexe dépigmentant',
    },
    {
      slug: INGREDIENT_SLUGS.ASCOPHYLLUM_NODOSUM_EXTRACT,
      notes: 'Extrait d algue brune anti-pollution',
    },
  ],
  [allProductSlugs.SVR_CLAIRIAL_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.THD_ASCORBATE,
      value: 2,
      unit: '%',
      notes: 'Vitamine C optimisée',
    },
    {
      slug: INGREDIENT_SLUGS.SEPIWHITE,
      notes: 'Inhibiteur de mélanine',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Acide hyaluronique HPM',
    },
  ],
  [allProductSlugs.SVR_CLAIRIAL_NIGHT_PEEL]: [
    {
      slug: INGREDIENT_SLUGS.PAPAIN,
      notes: 'Enzyme de papaye exfoliante',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Renouvellement cutané',
    },
    {
      slug: INGREDIENT_SLUGS.SEPIWHITE,
      notes: 'Action dépigmentante Sepiwhite',
    },
  ],
  [allProductSlugs.SVR_DENSITIUM_BI_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.CALCIUM_PCA,
      notes: 'Bio-calcium restructurant',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Acide hyaluronique ultra-fragmenté',
    },
  ],
  [allProductSlugs.SVR_DENSITIUM_CREME]: [
    {
      slug: INGREDIENT_SLUGS.CALCIUM_PCA,
      notes: 'Bio-calcium',
    },
    {
      slug: INGREDIENT_SLUGS.ARGININE_PCA,
      notes: 'Duo d acides aminés anti-jaunissement',
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TRIPEPTIDE_1,
      notes: 'Peptide lissant',
    },
  ],
  [allProductSlugs.SVR_CICAVIT_PLUS_CREME_HPPI]: [
    {
      slug: INGREDIENT_SLUGS.CURCUMA_LONGA_ROOT_EXTRACT,
      notes: 'Dérivé de curcuma régénérant',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Hydrate et favorise la réépithélialisation',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Renforce la barrière cutanée',
    },
    {
      slug: INGREDIENT_SLUGS.ALPHA_GLUCAN_OLIGOSACCHARIDE,
      notes: 'Polysaccharides pour l équilibre du microbiote',
    },
  ],
  [allProductSlugs.SVR_CICAVIT_GEL_MOUSSANT]: [
    {
      slug: INGREDIENT_SLUGS.RHAMNOSE,
      notes: 'Polysaccharide protecteur',
    },
    {
      slug: INGREDIENT_SLUGS.ALPHA_GLUCAN_OLIGOSACCHARIDE,
      notes: 'Sucre prébiotique',
    },
  ],
  [allProductSlugs.SVR_CICAVIT_CREME_MAINS]: [
    {
      slug: INGREDIENT_SLUGS.HUILE_DE_COCO,
      notes: 'Nourrit intensément',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre végétal nourrissant',
    },
    {
      slug: INGREDIENT_SLUGS.ALPHA_GLUCAN_OLIGOSACCHARIDE,
      notes: 'Sucre prébiotique',
    },
  ],
  [allProductSlugs.SVR_CICAVIT_CREME_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Apaisant et anti-marques',
    },
    {
      slug: INGREDIENT_SLUGS.ALPHA_GLUCAN_OLIGOSACCHARIDE,
      notes: 'Sucre prébiotique',
    },
    {
      slug: INGREDIENT_SLUGS.RHAMNOSE,
      notes: 'Réduit rougeurs et échauffements',
    },
  ],
  [allProductSlugs.SVR_CICAVIT_BAUME_LEVRES]: [
    {
      slug: INGREDIENT_SLUGS.RICINUS_COMMUNIS_SEED_OIL,
      notes: 'Huile de ricin protectrice',
    },
    {
      slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL,
      notes: 'Huile d amande douce',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité nourrissant',
    },
  ],
  [allProductSlugs.SVR_CICAVIT_SOS_GRATTAGE]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Complexe anti-irritations',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Réparation épidermique sans marque',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Provitamine B5 apaisante',
    },
  ],
  [allProductSlugs.SVR_CICAVIT_DM_PLUS]: [
    {
      slug: INGREDIENT_SLUGS.DIMETHICONE,
      value: 53,
      unit: '%',
      notes: 'Complexe silicone barrière',
    },
  ],
  [allProductSlugs.SVR_C_EYE_BIOTIC]: [
    {
      slug: INGREDIENT_SLUGS.THD_ASCORBATE,
      value: 5,
      unit: '%',
      notes: 'Vitamine C optimisée',
    },
    {
      slug: INGREDIENT_SLUGS.ARGIRELINE,
      notes: 'Peptide lissant',
    },
    {
      slug: INGREDIENT_SLUGS.PROBIOTICS,
      notes: 'Probiotiques pasteurisés',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Acide hyaluronique bas poids moléculaire',
    },
  ],
  [allProductSlugs.SVR_COLLAGEN_BIOTIC]: [
    {
      slug: INGREDIENT_SLUGS.COLLAGEN_AMINO_ACIDS,
      value: 2,
      unit: '%',
      notes: 'Collagène végétal',
    },
    {
      slug: INGREDIENT_SLUGS.THD_ASCORBATE,
      notes: 'Vitamine C optimisée',
    },
    {
      slug: INGREDIENT_SLUGS.PROBIOTICS,
      notes: 'Probiotiques pasteurisés',
    },
  ],
  [allProductSlugs.SVR_FILLER_BIOTIC]: [
    {
      slug: INGREDIENT_SLUGS.MELITANE,
      notes: 'Peptide liftant',
    },
    {
      slug: INGREDIENT_SLUGS.THD_ASCORBATE,
      notes: 'Vitamine C optimisée',
    },
    {
      slug: INGREDIENT_SLUGS.PROBIOTICS,
      notes: 'Probiotiques pasteurisés',
    },
  ],
  [allProductSlugs.SVR_PEPTI_BIOTIC]: [
    {
      slug: INGREDIENT_SLUGS.SYN_AKE,
      notes: 'Peptides lissants',
    },
    {
      slug: INGREDIENT_SLUGS.THD_ASCORBATE,
      notes: 'Vitamine C optimisée',
    },
    {
      slug: INGREDIENT_SLUGS.PROBIOTICS,
      notes: 'Probiotiques pasteurisés',
    },
  ],
  [allProductSlugs.SVR_C20_BIOTIC]: [
    {
      slug: INGREDIENT_SLUGS.THD_ASCORBATE,
      value: 20,
      unit: '%',
      notes: 'Vitamine C optimisée',
    },
    {
      slug: INGREDIENT_SLUGS.PROBIOTICS,
      notes: 'Probiotiques pasteurisés',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Acide hyaluronique',
    },
  ],
  [allProductSlugs.SVR_HYALU_BIOTIC]: [
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Moyen poids moléculaire',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Bas poids moléculaire',
    },
    {
      slug: INGREDIENT_SLUGS.THD_ASCORBATE,
      notes: 'Vitamine C optimisée',
    },
    {
      slug: INGREDIENT_SLUGS.PROBIOTICS,
      notes: 'Probiotiques pasteurisés',
    },
  ],
  [allProductSlugs.SVR_C20_FLUIDE]: [
    {
      slug: INGREDIENT_SLUGS.THD_ASCORBATE,
      value: 20,
      unit: '%',
      notes: 'Vitamine C optimisée',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERYL_GLUCOSIDE,
      notes: 'Booster d aquaporines',
    },
    {
      slug: INGREDIENT_SLUGS.PROBIOTICS,
      notes: 'Probiotiques pasteurisés',
    },
  ],
  [allProductSlugs.SVR_SEBIACLEAR_FLASH_15]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      value: 15,
      unit: '%',
      notes: 'Régule le sébum et réduit les imperfections',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      value: 2,
      unit: '%',
      notes: 'Hydrate et apaise',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      value: 2,
      unit: '%',
      notes: "Régule l'excès de sébum",
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      notes: 'Purifie et lisse le grain de peau',
    },
  ],
  [allProductSlugs.SVR_SEBIACLEAR_GEL_FLASH_4H]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      value: 5,
      unit: '%',
      notes: 'Réduit les imperfections et rougeurs',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      value: 5,
      unit: '%',
      notes: 'Apaise les irritations et limite les marques',
    },
  ],
  [allProductSlugs.SVR_SEBIACLEAR_SPRAY_CORPS]: [
    {
      slug: INGREDIENT_SLUGS.PHA,
      value: 8,
      unit: '%',
      notes: 'Purifie et lisse la peau',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      value: 5,
      unit: '%',
      notes: 'Diminue la production de sébum',
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      value: 2,
      unit: '%',
      notes: 'Affine et lisse le grain de peau',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      value: 1,
      unit: '%',
      notes: "Régule l'excès de sébum",
    },
  ],
  [allProductSlugs.SVR_SEBIACLEAR_MICRO_PEEL]: [
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: "Duo d'acides exfoliant",
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      notes: "Duo d'acides exfoliant",
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      value: 4,
      unit: '%',
      notes: 'Apaise et élimine les imperfections',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      value: 1,
      unit: '%',
      notes: "Régule l'excès de sébum",
    },
  ],
  [allProductSlugs.SVR_SEBIACLEAR_GEL_MOUSSANT]: [
    {
      slug: INGREDIENT_SLUGS.PHA,
      value: 4,
      unit: '%',
      notes: 'Purifie et désincruste les pores',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      notes: 'Exfolie et resserre les pores',
    },
  ],
  [allProductSlugs.SVR_SEBIACLEAR_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.PHA,
      value: 14,
      unit: '%',
      notes: 'PHA affine le grain de peau',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      value: 4,
      unit: '%',
      notes: 'Limite la prolifération bactérienne',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Protège et repulpe',
    },
  ],
  [allProductSlugs.SVR_SEBIACLEAR_CREME_LAVANTE]: [
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      notes: "Régule l'excès de sébum",
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: "Hydrate et favorise l'équilibre barrière",
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Hydratation complémentaire',
    },
  ],
  [allProductSlugs.SVR_SEBIACLEAR_HYDRA]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      value: 5,
      unit: '%',
      notes: 'Apaise les irritations et prévient les marques',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Hydrate en profondeur',
    },
  ],
  [allProductSlugs.SVR_SEBIACLEAR_ACTIVE_GEL]: [
    {
      slug: INGREDIENT_SLUGS.PHA,
      value: 14,
      unit: '%',
      notes: 'Libère les pores obstrués',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      value: 4,
      unit: '%',
      notes: 'Limite la prolifération bactérienne',
    },
  ],
  [allProductSlugs.SVR_SEBIACLEAR_MAT_PORES]: [
    {
      slug: INGREDIENT_SLUGS.PHA,
      value: 4,
      unit: '%',
      notes: 'Purifie et désincruste',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      value: 4,
      unit: '%',
      notes: 'Réduit les imperfections',
    },
  ],
  [allProductSlugs.SVR_SEBIACLEAR_CREME_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      value: 4,
      unit: '%',
      notes: 'Régule le sébum et limite les marques UV',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      notes: 'Lisse le grain de peau',
    },
  ],
  [allProductSlugs.SVR_SENSIFINE_HYDRA_CREME]: [
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      value: 5,
      unit: '%',
      notes: 'Apaise et hydrate intensément',
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_DE_PEPINS_DE_RAISIN,
      notes: 'Huile végétale protectrice',
    },
  ],
  [allProductSlugs.SVR_XERIAL_10_LAIT]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      value: 10,
      unit: '%',
      notes: 'Urée pure brevetée',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaise et hydrate',
    },
  ],
  [allProductSlugs.SVR_AMPOULE_A_LIFT]: [
    {
      slug: INGREDIENT_SLUGS.RETINOL,
      value: 0.3,
      unit: '%',
      notes: 'Rétinol pur',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Protège la barrière',
    },
  ],
  [allProductSlugs.SVR_SENSIFINE_AR_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.ENDOTHELYOL,
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
    },
    {
      slug: INGREDIENT_SLUGS.DIETHYLAMINO_HYDROXYBENZOYL_HEXYL_BENZOATE,
    },
    {
      slug: INGREDIENT_SLUGS.ETHYLHEXYL_TRIAZONE,
    },
    {
      slug: INGREDIENT_SLUGS.ARGININE,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],
  [allProductSlugs.SVR_SENSIFINE_AR]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
    },
    {
      slug: INGREDIENT_SLUGS.PENTYLENE_GLYCOL,
    },
    {
      slug: INGREDIENT_SLUGS.OPHIOPOGON_JAPONICUS,
      notes: 'Actif thermorégulateur anti-flush',
    },
    {
      slug: INGREDIENT_SLUGS.SPHINGOMONAS_FERMENT,
      notes: 'Postbiotique rééquilibrant le microbiome',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCOSPHINGOLIPIDS,
    },
    {
      slug: INGREDIENT_SLUGS.RHAMNOSE,
      notes: 'Anti-inflammatoire et stimulant du collagène',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],

  [allProductSlugs.SVR_SENSIFINE_EXTREME]: [
    {
      slug: INGREDIENT_SLUGS.HUILE_DE_JOJOBA,
      notes: 'Huile de jojoba apaisante',
    },
    // {
    //   slug: INGREDIENT_SLUGS.MINERAL_SALTS,
    //   notes: 'Eau ionisée brevetée minéralisante',
    // },
  ],

  [allProductSlugs.SVR_SENSIFINE_HUILE_NUIT]: [
    {
      slug: INGREDIENT_SLUGS.HUILE_DE_JOJOBA,
      notes: 'Huile de jojoba apaisante',
    },
    // {
    //   slug: INGREDIENT_SLUGS.rape, // à créer si absent
    //   notes: 'Huile de colza nourrissante',
    // },
    // {
    //   slug: INGREDIENT_SLUGS.HEMP_OIL, // à créer si absent
    //   notes: 'Huile de chanvre réparatrice',
    // },
  ],

  [allProductSlugs.SVR_SENSIFINE_MASQUE_SOS]: [
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Provitamine B5 apaisante',
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN, // à créer si absent
      notes: 'Apaisant et réparateur',
    },
  ],

  [allProductSlugs.SVR_SENSIFINE_NUTRI_BAUME]: [
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité nourrissant',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Squalane végétal lipidique',
    },
  ],

  [allProductSlugs.SVR_SENSIFINE_BAUME_DEMAQUILLANT]: [
    {
      slug: INGREDIENT_SLUGS.HUILE_DE_JOJOBA,
      notes: 'Huile de jojoba démaquillante',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité fondant',
    },
  ],

  [allProductSlugs.SVR_SENSIFINE_AQUA_GEL]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant de base',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaise et hydrate',
    },
  ],

  [allProductSlugs.SVR_SENSIFINE_DERMO_NETTOYANT]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Préserve le film hydrolipidique',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaise pendant le nettoyage',
    },
  ],

  [allProductSlugs.SVR_TOPIALYSE_BAUME_PROTECT]: [
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité protecteur',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      notes: 'Restaure la barrière cutanée',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Anti-irritant barrière',
    },
  ],

  [allProductSlugs.SVR_TOPIALYSE_CREME]: [
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité nourrissant',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      notes: 'Lipides barrière',
    },
  ],

  [allProductSlugs.SVR_TOPIALYSE_HUILE_LAVANTE]: [
    {
      slug: INGREDIENT_SLUGS.HUILE_GRAINES_TOURNESOL, // à créer si absent
      notes: 'Huile de tournesol relipidante',
    },
    {
      slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL, // = PRUNUS_AMYGDALUS_DULCIS_OIL
      notes: 'Huile d amande douce',
    },
  ],

  [allProductSlugs.SVR_TOPIALYSE_GEL_LAVANT]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Préserve l hydratation',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaise et adoucit',
    },
  ],

  [allProductSlugs.SVR_TOPIALYSE_BAUME_LAVANT]: [
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant protecteur',
    },
  ],

  [allProductSlugs.SVR_TOPIALYSE_CONCENTRE_LAVANT]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Maintient l hydratation post-lavage',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      notes: 'Restaure la barrière',
    },
  ],

  [allProductSlugs.SVR_TOPIALYSE_BARRIERE]: [
    {
      slug: INGREDIENT_SLUGS.DIMETHICONE,
      notes: 'Film occlusif barrière',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      notes: 'Lipides restructurants',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_OXIDE, // à créer si absent
      notes: 'Protège des irritants externes',
    },
  ],

  [allProductSlugs.SVR_TOPIALYSE_MAINS]: [
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Nourrissant intense',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      notes: 'Réparation de la barrière',
    },
  ],

  [allProductSlugs.SVR_XERIAL_50_EXTREME_PIEDS]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      value: 50,
      unit: '%',
      notes: 'Urée kératolytique ultra-concentrée',
    },
  ],

  [allProductSlugs.SVR_XERIAL_FISSURES_CREVASSES]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      value: 40,
      unit: '%',
      notes: 'Urée réparatrice haute concentration',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Cicatrisation et apaisement',
    },
  ],

  [allProductSlugs.SVR_XERIAL_30_GEL_CREME]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      value: 30,
      unit: '%',
      notes: 'Urée lissante',
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: 'Exfoliation douce',
    },
  ],

  [allProductSlugs.SVR_XERIAL_DM_PSORIASIS]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      value: 10,
      unit: '%',
      notes: 'Urée kératolytique',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      notes: 'Exfoliant kératolytique',
    },
  ],

  [allProductSlugs.SVR_XERIAL_30_PIEDS]: [
    {
      slug: INGREDIENT_SLUGS.UREA,
      value: 30,
      unit: '%',
      notes: 'Urée adoucissante et lissante',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaise et hydrate',
    },
  ],

  [allProductSlugs.SVR_SEBIACLEAR_EAU_MICELLAIRE]: [
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      notes: 'Régule le sébum',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Limite les marques post-acné',
    },
  ],

  [allProductSlugs.SVR_SEBIACLEAR_ACTIVE_TEINTE]: [
    {
      slug: INGREDIENT_SLUGS.PHA,
      value: 14,
      unit: '%',
      notes: 'PHA exfoliant doux',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      value: 4,
      unit: '%',
      notes: 'Anti-imperfections et anti-marques',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      notes: 'Purifie les pores',
    },
  ],

  [allProductSlugs.SVR_CLAIRIAL_CREME_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Anti-taches et protecteur barrière',
    },
    {
      slug: INGREDIENT_SLUGS.DIETHYLAMINO_HYDROXYBENZOYL_HEXYL_BENZOATE,
      notes: 'Filtre UVA liposoluble haute protection',
    },
    {
      slug: INGREDIENT_SLUGS.ETHYLHEXYL_TRIAZONE,
      notes: 'Filtre UVB haute protection',
    },
    {
      slug: INGREDIENT_SLUGS.DIACETYL_BOLDINE,
      notes: 'Complexe dépigmentant',
    },
  ],

  [allProductSlugs.SVR_CLAIRIAL_DAY]: [
    {
      slug: INGREDIENT_SLUGS.DIACETYL_BOLDINE,
      notes: 'Complexe dépigmentant Duo White',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Acide hyaluronique hydratant',
    },
    // {
    //   slug: INGREDIENT_SLUGS., // à créer si absent
    //   notes: 'Dérivé de férulate antioxydant',
    // },
  ],

  [allProductSlugs.SVR_DENSITIUM_YEUX]: [
    {
      slug: INGREDIENT_SLUGS.CALCIUM_PCA,
      notes: 'Bio-calcium redensifiant',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Acide hyaluronique ultra-fragmenté',
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TETRAPEPTIDE_7, // à créer si absent
      notes: 'Tétrapeptide anti-poches et cernes',
    },
    {
      slug: INGREDIENT_SLUGS.ARGININE_PCA,
      notes: 'Duo d acides aminés anti-jaunissement',
    },
  ],
}

// Export original pour compatibilité descendante
export const SVR_PRODUCT_INGREDIENTS = Object.entries(SVR_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
