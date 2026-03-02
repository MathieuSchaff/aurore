import { INGREDIENT_SLUGS } from '../ingredients/seed-ingredients'
import { allProductSlugs } from './products-slugs'

export const PRODUCT_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.URIAGE_XEMOSE_C8_PLUS_VISAGE]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      value: 10,
      unit: '%',
      notes: 'Beurre de karité 10%',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Émollient occlusif',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
      notes: 'Précurseur de céramides, apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
      notes: 'Composant lipidique de la barrière cutanée',
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Centella Asiatica réparatrice',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
  ],
  [allProductSlugs.URIAGE_ROSELIANE]: [
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Émollient apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Nourrissant, renforce la barrière',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Apaisant, réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
    {
      slug: INGREDIENT_SLUGS.ASCOPHYLLUM_NODOSUM_EXTRACT,
      notes: 'Algue brune, complexe SK5R anti-rougeurs',
    },
    {
      slug: INGREDIENT_SLUGS.DIMETHICONE,
      notes: 'Émollient, protège la barrière',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
  ],
  [allProductSlugs.URIAGE_HYSEAC_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      notes: '5,8% AHA purs (glycolique + malique + lactique)',
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: 'AHA pur, exfoliant doux',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      notes: 'Sébum-régulateur, anti-imperfections',
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
      notes: 'Apaisant, anti-bactérien',
    },
    {
      slug: INGREDIENT_SLUGS.RHAMNOSE,
      notes: 'Technologie NEUROBIOX anti-stress',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCYRRHIZA_INFLATA,
      notes: 'Anti-inflammatoire, apaisant',
    },
  ],
  [allProductSlugs.URIAGE_CICA_DAILY_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Réparateur, régénérant',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Hydratant, repulpant',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Vitamine B5, apaisant et unifiant',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      notes: 'Anti-imperfections, purifiant',
    },
  ],
  [allProductSlugs.URIAGE_ROSELIANE_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Anti-inflammatoire, anti-rougeurs, unifiant',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCYRRHETINIC_ACID,
      notes: 'Enoxolone — anti-inflammatoire, apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Émollient apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
    {
      slug: INGREDIENT_SLUGS.ASCOPHYLLUM_NODOSUM_EXTRACT,
      notes: 'Algue brune, complexe SK5R anti-rougeurs',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Antioxydant',
    },
  ],
  [allProductSlugs.URIAGE_DEPIDERM_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.THD_ASCORBATE,
      notes: 'Complexe 20% Vitamine C (ascorbyl tetraisopalmitate), unifiant et éclatant',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Anti-taches, unifiant',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCYRRHETINIC_ACID,
      notes: 'Enoxolone — anti-inflammatoire, prévention des taches post-acnéiques',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      notes: 'AHA exfoliant, éclat',
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: 'AHA doux, unifiant',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Émollient',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
  ],
  [allProductSlugs.URIAGE_XEMOSE_HUILE_LAVANTE]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Relipidant, nourrissant',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Antioxydant',
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
  ],
  [allProductSlugs.URIAGE_XEMOSE_BAUME]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
      notes: '8 céramides biomimétiques C8+',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      value: 10,
      unit: '%',
      notes: 'Relipidant majeur',
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Apaisant, réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Antioxydant',
    },
  ],
  [allProductSlugs.URIAGE_GEL_SURGRAS]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant, améliore le confort cutané',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
  ],
  [allProductSlugs.URIAGE_ROSELIANE_CREME]: [
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Nourrissant',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Apaisant, réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.ASCOPHYLLUM_NODOSUM_EXTRACT,
      notes: 'Algue brune, complexe SK5R anti-rougeurs',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
    {
      slug: INGREDIENT_SLUGS.DIMETHICONE,
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
  ],
  [allProductSlugs.URIAGE_ROSELIANE_TEINTE]: [
    {
      slug: INGREDIENT_SLUGS.BIS_ETHYLHEXYLOXYPHENOL_METHOXYPHENYL_TRIAZINE,
      notes: 'Filtre UV large spectre (Tinosorb S)',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.PHYTOSPHINGOSINE,
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
    },
    {
      slug: INGREDIENT_SLUGS.ASCOPHYLLUM_NODOSUM_EXTRACT,
      notes: 'Algue brune, complexe SK5R anti-rougeurs',
    },
  ],
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
      slug: INGREDIENT_SLUGS.AMMONIUM_GLYCYRRHIZATE,
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
  [allProductSlugs.ESSENCE_INITIALE]: [
    {
      slug: INGREDIENT_SLUGS.SERINE,
      notes: 'Acide aminé principal du complexe NMF biomimétique (15%)',
    },
    {
      slug: INGREDIENT_SLUGS.UREA,
      notes: "Facteur naturel d'hydratation",
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: 'Humectant et régulateur de pH',
    },
  ],
  [allProductSlugs.GEL_PLUME]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      value: 50,
      unit: '%',
      notes: 'Base glycérinée >50%',
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Complexe apaisant Centella (3 molécules)',
    },
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: "Extrait d'avoine titré en avenanthramides",
    },
  ],
  [allProductSlugs.CREME_FILANTE]: [
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Complexe apaisant Centella (3 molécules)',
    },
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: "Extrait d'avoine titré en avenanthramides",
    },
  ],
  [allProductSlugs.CREME_LEGERE_INITIALE]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      value: 1,
      unit: '%',
      notes: 'Complexe lipidique biomimétique 2% (>1% céramides)',
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
      notes: 'Complexe lipidique : 25% cholestérol',
    },
    {
      slug: INGREDIENT_SLUGS.SERINE,
      notes: 'Complexe hydratant NMF biomimétique 5%',
    },
  ],
  [allProductSlugs.CREME_INTENSE_INITIALE]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      value: 1,
      unit: '%',
      notes: 'Complexe lipidique biomimétique 2% (>1% céramides)',
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
      notes: 'Complexe lipidique : 25% cholestérol',
    },
    {
      slug: INGREDIENT_SLUGS.SERINE,
      notes: 'Complexe hydratant NMF biomimétique 5%',
    },
  ],
  [allProductSlugs.GARANCIA_ROUGEURS]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.GLYCYRRHETINIC_ACID,
      notes: 'Anti-inflammatoire — réglisse',
    },
    {
      slug: INGREDIENT_SLUGS.VACCINIUM_MYRTILLUS,
      notes: 'Antioxydant, renforce les capillaires',
    },
    {
      slug: INGREDIENT_SLUGS.PLANKTON_EXTRACT,
      notes: 'Extrait marin apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
    },
    {
      slug: INGREDIENT_SLUGS.ESCIN,
      notes: "Veinotonique — marronnier d'Inde",
    },
    {
      slug: INGREDIENT_SLUGS.RUSCUS_ACULEATUS,
      notes: 'Veinotonique — petit-houx',
    },
    {
      slug: INGREDIENT_SLUGS.AMMONIUM_GLYCYRRHIZATE,
      notes: 'Deuxième dérivé de réglisse anti-inflammatoire',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Cicatrisant et apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.CALENDULA,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],
  [allProductSlugs.ISISPHARMA_RUBORIL]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.PENTYLENE_GLYCOL,
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
    },
    {
      slug: INGREDIENT_SLUGS.GLYCYRRHETINIC_ACID,
      notes: 'Anti-inflammatoire — réglisse',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
    },
    {
      slug: INGREDIENT_SLUGS.ESCIN,
      notes: "Veinotonique — marronnier d'Inde",
    },
    {
      slug: INGREDIENT_SLUGS.RUSCUS_ACULEATUS,
      notes: 'Veinotonique — petit-houx',
    },
    {
      slug: INGREDIENT_SLUGS.AMMONIUM_GLYCYRRHIZATE,
      notes: 'Deuxième dérivé de réglisse',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'CENTELLA ASIATICA LEAF EXTRACT',
    },
    {
      slug: INGREDIENT_SLUGS.CALENDULA,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],
  [allProductSlugs.HYALU_B5_CREME]: [
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Acide hyaluronique haut & bas PM',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Vitamine B5 réparatrice',
    },
  ],
  [allProductSlugs.CICAPLAST_B5_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaisant réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Réparation épidermique',
    },
  ],
  [allProductSlugs.HYALU_B5_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Acide hyaluronique multi-poids',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Vitamine B5 réparatrice',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Apaisant',
    },
  ],
  [allProductSlugs.EFFACLAR_DUO_M]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Anti-inflammatoire, régule sébum',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_PCA,
      notes: 'Régule sébum, antibactérien',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      notes: 'Exfoliant kératolytique',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      notes: 'LHA micro-exfoliant',
    },
  ],
  [allProductSlugs.ROSALIAC_AR]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
    },
    {
      slug: INGREDIENT_SLUGS.PENTYLENE_GLYCOL,
    },
    {
      slug: INGREDIENT_SLUGS.SCHISANDRA,
      notes: 'Antioxydant — actif clé de la formule Rosaliac',
    },
    {
      slug: INGREDIENT_SLUGS.SPHINGOMONAS_FERMENT,
      notes: 'Postbiotique microbiome',
    },
  ],
  [allProductSlugs.MEME_HUILE_LAVANTE]: [
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Nourrit en profondeur',
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
      notes: 'Apaisant et adoucissant',
    },
    {
      slug: INGREDIENT_SLUGS.ALOE_VERA,
      notes: 'Apaisant et protecteur',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Hydratant humectant',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Apaisante, vitamine B',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Nourrit et hydrate',
    },
  ],
  [allProductSlugs.AVENE_CLEANANCE_COMEDOMED_SERUM_INTENSIF]: [
    {
      slug: INGREDIENT_SLUGS.SYLIBUM_MARIANUM_FRUIT_EXTRACT,
      value: 25,
      unit: '%',
      notes: 'Comedoclastin™ : actif breveté issu du Chardon-marie',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      notes: 'Exfoliant AHA pour lisser le grain de peau',
    },
    {
      slug: INGREDIENT_SLUGS.BAKUCHIOL,
      notes: 'Alternative végétale au rétinol',
    },
  ],
  [allProductSlugs.AVENE_HYALURON_ACTIV_PROCEDURE_CREME_LIFTING]: [
    {
      slug: INGREDIENT_SLUGS.RETINAL,
      value: 0.1,
      unit: '%',
      notes: "Précurseur direct de l'acide rétinoïque",
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      value: 2,
      unit: '%',
      notes: 'Stimule la régénération cellulaire',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Action lissante et hydratante',
    },
  ],
  [allProductSlugs.AVENE_XERACALM_AD_CREME_RELIPIDANTE]: [
    {
      slug: INGREDIENT_SLUGS.AQUAPHILUS_DOLOMIAE_EXTRACT,
      notes: 'I-modulia® : actif biotechnologique anti-démangeaisons',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      notes: 'CER-OMEGA : lipides semblables à ceux de la peau',
    },
  ],
  [allProductSlugs.AVENE_CLEANANCE_GEL_NETTOYANT]: [
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      notes: 'Action matifiante et anti-irritante',
    },
    {
      slug: INGREDIENT_SLUGS.SYLIBUM_MARIANUM_FRUIT_EXTRACT,
      notes: 'Comedoclastin™ : aide à réduire les imperfections',
    },
  ],
  [allProductSlugs.AVENE_HYDRANCE_RICHE_CREME_HYDRATANTE]: [
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Nourrit intensément',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Hydratation des couches supérieures de la peau',
    },
  ],
  [allProductSlugs.AVENE_HYDRANCE_LIGHT_CREME_HYDRATANTE]: [
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Restaure la souplesse de la peau',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Hydratation durable',
    },
  ],
  [allProductSlugs.AVENE_CICALFATE_CREME_REPARATRICE]: [
    {
      slug: INGREDIENT_SLUGS.AQUAPHILUS_DOLOMIAE_FERMENT_FILTRATE,
      notes: '[C+ Restore]™ : actif postbiotique breveté',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_SULFATE,
      notes: 'Complexe purifiant Cuivre-Zinc',
    },
    {
      slug: INGREDIENT_SLUGS.COPPER_SULFATE,
      notes: 'Complexe purifiant Cuivre-Zinc',
    },
  ],
  [allProductSlugs.AVENE_HYALURON_ACTIV_B3_CREME_REGENERATION]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      value: 6,
      unit: '%',
      notes: 'Stimule la régénération cellulaire',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      value: 0.2,
      unit: '%',
      notes: 'Acide hyaluronique pur et naturel',
    },
    {
      slug: INGREDIENT_SLUGS.ADENOSINE,
      notes: 'Actif anti-rides',
    },
  ],
  [allProductSlugs.AVENE_XERACALM_AD_HUILE_LAVANTE_RELIPIDANTE]: [
    {
      slug: INGREDIENT_SLUGS.AQUAPHILUS_DOLOMIAE_EXTRACT,
      notes: 'I-modulia® : réduit les sensations de démangeaisons',
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_ONAGRE,
      notes: 'CER-OMEGA : relipide la peau',
    },
  ],
  [allProductSlugs.AVENE_VITAMIN_ACTIV_C_SERUM_ECLAT]: [
    {
      slug: INGREDIENT_SLUGS.ASCORBYL_GLUCOSIDE,
      notes: 'Vitamine Cg : forme stable de vitamine C',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Réduit les taches et lisse les rides',
    },
    {
      slug: INGREDIENT_SLUGS.BAKUCHIOL,
      notes: 'Alternative végétale au rétinol',
    },
  ],
  [allProductSlugs.AVENE_CLEANANCE_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      notes: 'Action sébo-régulatrice',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHERYL_GLUCOSIDE,
      notes: 'Pré-tocophéryl : antioxydant',
    },
  ],
  [allProductSlugs.AVENE_FLUIDE_ANTI_IMPERFECTION_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.TRIASORB,
      notes: 'Filtre solaire breveté contre les UV et la lumière bleue haute énergie',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
      notes: 'Régule le sébum et limite les imperfections',
    },
  ],
  [allProductSlugs.AVENE_SUNSIMED_KA_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.TOCOPHERYL_GLUCOSIDE,
      notes: 'Pré-tocophéryl : puissant antioxydant',
    },
  ],
  [allProductSlugs.AVENE_TEINTEE_ANTI_LUMIERE_BLEUE_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.TRIASORB,
      notes: 'Protection ultra-large spectre contre la lumière bleue',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Hydratation 24h',
    },
  ],
  [allProductSlugs.AVENE_ULTRA_FLUID_OIL_CONTROL_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.TRIASORB,
      notes: 'Protection lumière bleue et UV',
    },
    {
      slug: INGREDIENT_SLUGS.LENS_ESCULENTA_SEED_EXTRACT,
      notes: 'Extrait de lentille pour réduire les pores et matifier',
    },
  ],
  [allProductSlugs.AVENE_ULTRA_FLUID_ECLAT_RADIANCE_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.TRIASORB,
      notes: 'Protection solaire invisible et large spectre',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: "Antioxydant pour l'éclat du teint",
    },
  ],
  [allProductSlugs.AVENE_ULTRA_FLUID_PERFECTEUR_SPF50]: [
    {
      slug: INGREDIENT_SLUGS.TRIASORB,
      notes: 'Protection contre le photovieillissement',
    },
    {
      notes: 'Pigments pour unifier le teint',
    },
  ],
  [allProductSlugs.AVENE_TOLERANCE_CONTROL_CREME]: [
    {
      slug: INGREDIENT_SLUGS.AQUAPHILUS_DOLOMIAE_EXTRACT,
      notes: 'D-Sensinose™ : actif postbiotique ultra-calmant breveté',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Restaure la barrière cutanée',
    },
  ],
  [allProductSlugs.AVENE_XERACALM_AD_BAUME]: [
    {
      slug: INGREDIENT_SLUGS.AQUAPHILUS_DOLOMIAE_EXTRACT,
      notes: 'I-modulia® : réduit les sensations de démangeaisons',
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_ONAGRE,
      notes: 'Cer-Omega : nourrit et renforce le film protecteur',
    },
  ],
  [allProductSlugs.AVENE_ROSAMED]: [
    {
      slug: INGREDIENT_SLUGS.SYLIBUM_MARIANUM_FRUIT_EXTRACT,
      notes: "Angiopausine™ : réduit l'hypervascularisation cutanée",
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.PENTYLENE_GLYCOL,
    },
    {
      slug: INGREDIENT_SLUGS.SILYBUM_MARIANUM,
      notes: "Actif phare — composant clé de l'Angiopausine™",
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],
  [allProductSlugs.ACM_ROSAKALM]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.RUSCUS_ACULEATUS,
      notes: 'Veinotonique — petit-houx',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Hydratant en profondeur',
    },
    {
      slug: INGREDIENT_SLUGS.GREEN_TEA,
      notes: 'Thé vert — antioxydant',
    },
    {
      slug: INGREDIENT_SLUGS.HIPPOPHAE_RHAMNOIDES,
      notes: 'Argousier — régénérant riche en vitamine C',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],
  [allProductSlugs.EUCERIN_AR]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
    },
    {
      slug: INGREDIENT_SLUGS.PENTYLENE_GLYCOL,
    },
    {
      slug: INGREDIENT_SLUGS.GLYCYRRHIZA_INFLATA,
      notes: 'Licochalcone A — actif signature Eucerin, anti-inflammatoire',
    },
  ],
  [allProductSlugs.NOREVA_SENSIDIANE]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.PENTYLENE_GLYCOL,
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Forme purifiée de Centella — stimule le collagène',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Complexe céramides complet (NP + NS + EOP + AP)',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],
  [allProductSlugs.ADERMA_LAIT_CORPS_72H]: [
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Hydratation 72h',
    },
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: 'Avoine Rhealba® bio',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
    },
  ],
  [allProductSlugs.ADERMA_EXOMEGA_HUILE_500]: [
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: "Extrait de plantules d'Avoine Rhealba®",
    },
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: "Extrait de plantules d'Avoine Rhealba®",
    },
  ],
  [allProductSlugs.ADERMA_GEL_DOUCHE_SURGRAS]: [
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: "Lait d'Avoine Rhealba®",
    },
  ],
  [allProductSlugs.ADERMA_EXOMEGA_LAIT_EMOLLIENT]: [
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: "Extrait de plantules d'Avoine Rhealba®",
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
    },
  ],
  [allProductSlugs.ADERMA_BIOLOGY_AR]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
    {
      slug: INGREDIENT_SLUGS.PENTYLENE_GLYCOL,
    },
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: 'Avoine Rhealba® — actif breveté A-Derma, apaisant',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
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
      slug: INGREDIENT_SLUGS.GLYCYRRHIZA_INFLATA,
      notes: 'Apaise et réduit le grattage',
    },
  ],
  [allProductSlugs.BIODERMA_ATODERM_INTENSIVE_EYE]: [
    {
      slug: INGREDIENT_SLUGS.GLYCYRRHETINIC_ACID,
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
      slug: INGREDIENT_SLUGS.GLYCYRRHETINIC_ACID,
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
      slug: INGREDIENT_SLUGS.GLYCYRRHETINIC_ACID,
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
      slug: INGREDIENT_SLUGS.GLYCYRRHETINIC_ACID,
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

export const allIngredientProductTags = Object.entries(PRODUCT_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
