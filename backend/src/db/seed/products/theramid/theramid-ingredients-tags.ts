import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { THERAMID_PRODUCT_SLUGS } from './theramid'

export const THERAMID_INGREDIENTS_MAP: Record<string, any[]> = {
  // ── THERAMID_EVEN_IN ────────────────────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_EVEN_IN]: [
    {
      slug: INGREDIENT_SLUGS.TRANEXAMIC_ACID,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Partie du complexe TXA-Kojic 4%',
    },
    {
      slug: INGREDIENT_SLUGS.KOJIC_ACID,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Partie du complexe TXA-Kojic 4%',
    },
    {
      slug: INGREDIENT_SLUGS.ALPHA_ARBUTIN,
      concentrationValue: 2,
      concentrationUnit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.ACETYL_GLUCOSAMINE,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'NAG Amino Monosaccharide',
    },
  ],

  // ── THERAMID_TETRAMID_CEF ───────────────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_TETRAMID_CEF]: [
    {
      slug: INGREDIENT_SLUGS.VITAMIN_C,
      concentrationValue: 20,
      concentrationUnit: '%',
      notes: 'Vitamine C Tetra (liposoluble), Ascorbosilane et Ascorbyl Glucoside',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      concentrationValue: 1,
      concentrationUnit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.FERULIC_ACID,
      concentrationValue: 0.5,
      concentrationUnit: '%',
    },
  ],

  // ── THERAMID_A_RETINYL_RETINOATE ─────────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_A_RETINYL_RETINOATE]: [
    {
      slug: INGREDIENT_SLUGS.RETINAL,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Pur encapsulé liposomal',
    },
    {
      slug: INGREDIENT_SLUGS.RETINYL_RETINOATE,
      concentrationValue: 0.06,
      concentrationUnit: '%',
      notes: 'Encapsulé liposomal',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_RETINOYL_HYALURONATE,
      concentrationValue: 0.06,
      concentrationUnit: '%',
      notes: 'HyRetin TM',
    },
  ],

  // ── THERAMID_COPPER_PEPTIDE ─────────────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_COPPER_PEPTIDE]: [
    {
      slug: INGREDIENT_SLUGS.COPPER_PEPTIDES,
      concentrationValue: 3,
      concentrationUnit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.PEPTIDE_COMPLEX,
      concentrationValue: 13,
      concentrationUnit: '%',
      notes: 'Munapsys, Peptides Bio, NeoclairPro et Progeline',
    },
  ],

  // ── THERAMID_CERAMIDE_TREATMENT ─────────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_CERAMIDE_TREATMENT]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Céramides purs (NG, NP, AP, AS, NS, EOP)',
    },

    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NS,
      notes: 'Céramides purs (NG, NP, AP, AS, NS, EOP)',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
      notes: 'Céramides purs (NG, NP, AP, AS, NS, EOP)',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
      notes: 'Céramides purs (NG, NP, AP, AS, NS, EOP)',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NG,
      notes: 'Céramides purs (NG, NP, AP, AS, NS, EOP)',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Céramides purs (NG, NP, AP, AS, NS, EOP)',
    },
    {
      slug: INGREDIENT_SLUGS.ECTOIN,
      concentrationValue: 1,
      concentrationUnit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'CICA',
    },
  ],

  // ── THERAMID_CLINICAL_VITAMIN_A ──────────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_CLINICAL_VITAMIN_A]: [
    {
      slug: INGREDIENT_SLUGS.GRANACTIVE_RETINOID,
      concentrationValue: 5,
      concentrationUnit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.RETINOL,
      concentrationValue: 0.3,
      concentrationUnit: '%',
      notes: 'Encapsulé',
    },
    {
      slug: INGREDIENT_SLUGS.RETINAL,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Pur encapsulé liposomal',
    },
  ],

  // ── THERAMID_AZID ───────────────────────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_AZID]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      concentrationValue: 15,
      concentrationUnit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.COLLOIDAL_OATMEAL,
      concentrationValue: 1,
      concentrationUnit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.CARNOSINE,
      concentrationValue: 1,
      concentrationUnit: '%',
    },
  ],

  // ── THERAMID_LINO_8 ─────────────────────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_LINO_8]: [
    {
      slug: INGREDIENT_SLUGS.LINOLEIC_ACID,
      concentrationValue: 8,
      concentrationUnit: '%',
      notes: 'Acides Linoléique et Linolénique',
    },
    {
      slug: INGREDIENT_SLUGS.VITAMIN_K1,
      concentrationValue: 1,
      concentrationUnit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.COQ10,
      concentrationValue: 1,
      concentrationUnit: '%',
    },
  ],

  // ── THERAMID_SMOOTHING_TREATMENT ────────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_SMOOTHING_TREATMENT]: [
    {
      slug: INGREDIENT_SLUGS.PHA,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: 'PHA',
    },
    {
      slug: INGREDIENT_SLUGS.MANDELIC_ACID,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: 'AHA',
    },
    {
      slug: INGREDIENT_SLUGS.PEPTIDE_COMPLEX,
      concentrationValue: 5,
      concentrationUnit: '%',
    },
  ],

  // ── THERAMID_DERMA_PEPTIDES ─────────────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_DERMA_PEPTIDES]: [
    {
      slug: INGREDIENT_SLUGS.PEPTIDE_COMPLEX,
      concentrationValue: 35,
      concentrationUnit: '%',
      notes: 'Mélange de 9 peptides biomimétiques (Matrixyl, Munapsys, etc.)',
    },
  ],

  // ── THERAMID_HAPCA_FILLER ───────────────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_HAPCA_FILLER]: [
    {
      slug: INGREDIENT_SLUGS.SODIUM_PCA,
      concentrationValue: 5,
      concentrationUnit: '%',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Inclut Primalhyal Ultrafiller (1%) et Primalhyal 3K (2%)',
    },
  ],

  // ── THERAMID_BAKUCHIOL_FIRMING_CREAM ────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_BAKUCHIOL_FIRMING_CREAM]: [
    {
      slug: INGREDIENT_SLUGS.BAKUCHIOL,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Alternative végétale au rétinol, réduit rides et ridules, stimule fermeté',
    },
    {
      slug: INGREDIENT_SLUGS.PEPTIDE_COMPLEX,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Combat perte de fermeté, stimule synthèse collagène',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Cellules souches, hydratation, apaisement cutané',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      notes: 'Restaure barrière cutanée, améliore hydratation',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Hydratation en profondeur, repulpant immédiat',
    },
  ],

  // ── THERAMID_TIME_REVERSE_BEAUTY_SLEEP_MASK ──────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_TIME_REVERSE_BEAUTY_SLEEP_MASK]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Vitamine B3, éclat et apaisement cutané',
    },
    {
      slug: INGREDIENT_SLUGS.VITAMIN_C,
      notes: 'Vitamines A, C, E antioxydantes pour nuit anti-âge',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamines A, C, E antioxydantes pour nuit anti-âge',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Encapsulé, hydratation profonde, 0,02% pur',
    },
    {
      slug: INGREDIENT_SLUGS.RETINOL,
      concentrationValue: 0.2,
      concentrationUnit: '%',
      notes: 'Régénération cellulaire, production collagène',
    },
  ],

  // ── THERAMID_RETINAL_AGE_REVERSE_CREAM ───────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_RETINAL_AGE_REVERSE_CREAM]: [
    {
      slug: INGREDIENT_SLUGS.RETINAL,
      concentrationValue: 0.03,
      concentrationUnit: '%',
      notes: 'Encapsulé, forme la plus puissante de vit. A, effet régénérant maximal',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Complexe hautement pénétrant, 0,06% pur',
    },
    {
      slug: INGREDIENT_SLUGS.PEPTIDE_COMPLEX,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Anti-âge multi-peptides, stimule collagène et élastine',
    },
    {
      slug: INGREDIENT_SLUGS.BAKUCHIOL,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Complément rétinal, sans irritation additionnelle',
    },
  ],

  // ── THERAMID_NIACINAMIDE_GLOW_CREAM ──────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_NIACINAMIDE_GLOW_CREAM]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Vitamine B3 pur, éclat, réduction imperfections, uniformité teint',
    },
    {
      slug: INGREDIENT_SLUGS.COLLAGEN_AMINO_ACIDS,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Stimule production collagène, lisse rides et ridules',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Fortifie barrière lipidique, prévient déshydratation',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant puissant, rétention hydratation naturelle',
    },
  ],

  // ── THERAMID_PROTEO_REPAIR_CREAM ────────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_PROTEO_REPAIR_CREAM]: [
    {
      slug: INGREDIENT_SLUGS.COLLAGEN_AMINO_ACIDS,
      concentrationValue: 4,
      concentrationUnit: '%',
      notes: 'Fragments collagène bio petits (haute pénétration), blocs construction derme',
    },
    {
      slug: INGREDIENT_SLUGS.PROTEOGLYCAN_COMPLEX,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Renforce derme, stimule synthèse collagène naturelle, densité cutanée',
    },

    {
      slug: INGREDIENT_SLUGS.CARNOSINE,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Peptide anti-glycation, protège collagène et élastine',
    },
  ],

  // ── THERAMID_ZITBACK ────────────────────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_ZITBACK]: [
    {
      slug: INGREDIENT_SLUGS.CITRUS_LIMON_FRUIT_WATER,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: 'Exfoliant naturel, réduit formation points noirs',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 2.8,
      concentrationUnit: '%',
      notes: 'AHA exfoliant, assèche boutons sans irritation',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Apaisement, sebo-régulation, confort cutané',
    },
    {
      slug: INGREDIENT_SLUGS.BOSWELLIA_SERRATA,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Propriétés purifiantes et apaisantes',
    },
    {
      slug: INGREDIENT_SLUGS.ZINGIBER_OFFICINALE,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Gingembre, propriétés anti-inflammatoires et purifiantes',
    },
  ],

  // ── THERAMID_PURE_GLYCERIN_FACE_SERUM ───────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_PURE_GLYCERIN_FACE_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      concentrationValue: 15,
      concentrationUnit: '%',
      notes: 'Humectant puissant, empêche perte eau transépidermique, hydratation durable',
    },
    {
      slug: INGREDIENT_SLUGS.COLLAGEN_AMINO_ACIDS,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Stimule production collagène, lisse rides et ridules visiblement',
    },
  ],

  // ── THERAMID_BARRIER_RESTORING_HYDRATING_CREAM ──────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_BARRIER_RESTORING_HYDRATING_CREAM]: [
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Encapsulé haute pénétration, 0,1% pur, hydratation multi-couches',
    },
    {
      slug: INGREDIENT_SLUGS.VITAMIN_C,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Vitamines A, C, E antioxydantes protection contre vieillissement',
    },

    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamines A, C, E antioxydantes protection contre vieillissement',
    },
    {
      slug: INGREDIENT_SLUGS.MADECASSOSIDE,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Centella Asiatica, apaisement et régénération barrière',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Restaure film hydrolipidique, prévient irritation',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Complexe Centella Asiatica, réparation cutanée avancée',
    },
  ],

  // ── THERAMID_CERAMIDE_REPAIR_MOISTURIZER ────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_CERAMIDE_REPAIR_MOISTURIZER]: [
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Encapsulé nanovésicules, 0,06% pur, hydratation interne',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Complexe céramides multi (NP, NG, EOP, NS, As, AP), restaure hydration naturelle',
    },
    {
      slug: INGREDIENT_SLUGS.ECTOIN,
      concentrationValue: 0.5,
      concentrationUnit: '%',
      notes: 'Osmoprotecteur, renforce barrière lipidique',
    },
    {
      slug: INGREDIENT_SLUGS.MADECASSOSIDE,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Centella Asiatica, apaisement et régénération',
    },
  ],

  // ── THERAMID_ZITCALM_CREAM ──────────────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_ZITCALM_CREAM]: [
    {
      slug: INGREDIENT_SLUGS.MORINDA_CITRIFOLIA,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Quora Noni, propriétés apaisantes et antioxydantes',
    },
    {
      slug: INGREDIENT_SLUGS.LINOLEIC_ACID,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Acides gras essentiels (linoléique, linolénique), restaure barrière',
    },
    {
      slug: INGREDIENT_SLUGS.BISABOLOL,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Apaisement puissant, réduit rougeurs et irritations',
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Cicatrisant et apaisant, hydrate et apaise tiraillement',
    },
  ],

  // ── THERAMID_ZITCONTROL ─────────────────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_ZITCONTROL]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Sebo-régulation, pores dilatés',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_PCA,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Matifiant puissant, assainit',
    },
    {
      slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
      concentrationValue: 0.5,
      concentrationUnit: '%',
      notes: 'BHA, exfolie pores en profondeur',
    },
    {
      slug: INGREDIENT_SLUGS.TEA_TREE,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Propriétés antibactériennes naturelles',
    },
  ],

  // ── THERAMID_ZI_K_CICA_REPAIRING_BALM ────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_ZI_K_CICA_REPAIRING_BALM]: [
    {
      slug: INGREDIENT_SLUGS.CENTELLA_COMPLEX,
      concentrationValue: 0.2,
      concentrationUnit: '%',
      notes: 'Complexe Centella Asiatica triactif, réparation efficace',
    },
    {
      slug: INGREDIENT_SLUGS.MADECASSOSIDE,
      concentrationValue: 0.1,
      concentrationUnit: '%',
      notes: 'Centella Asiatica, apaisement et cicatrisation',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Extrait Centella Asiatica complet, synérgie réparatrice',
    },
  ],

  // ── THERAMID_C4_HYDRATING_MILKY_TONER ────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_C4_HYDRATING_MILKY_TONER]: [
    {
      slug: INGREDIENT_SLUGS.SODIUM_PCA,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Hydratant naturel puissant, osmolyte',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Provitamine B5, hydration et apaisement',
    },
    {
      slug: INGREDIENT_SLUGS.PEPTIDE_COMPLEX,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Soutien barrière cutanée',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Complexe céramides multi, restaure barrière',
    },
    {
      slug: INGREDIENT_SLUGS.BETA_GLUCAN,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Antioxydant et protecteur barrière',
    },
  ],

  // ── THERAMID_ASCORBIC_C15 ────────────────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_ASCORBIC_C15]: [
    {
      slug: INGREDIENT_SLUGS.VITAMIN_C,
      concentrationValue: 15,
      concentrationUnit: '%',
      notes: 'Acide L-ascorbique pur, antioxydant le plus puissant',
    },
    {
      slug: INGREDIENT_SLUGS.GLUTATHION,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Antioxydant maître, stabilise et amplifie vitamine C',
    },
    {
      slug: INGREDIENT_SLUGS.GREEN_TEA,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'EGCG, antioxydant supplémentaire',
    },
  ],

  // ── THERAMID_ZI_K_CICA_REPAIRING_GEL ─────────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_ZI_K_CICA_REPAIRING_GEL]: [
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      concentrationValue: 2,
      concentrationUnit: '%',
      notes: 'Extrait complet, puissant réparateur',
    },
    {
      slug: INGREDIENT_SLUGS.MADECASSOSIDE,
      concentrationValue: 0.5,
      concentrationUnit: '%',
      notes: 'Centella isolée, cicatrisation accélérée',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes: 'Hydration et apaisement',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_PCA,
      concentrationValue: 0.2,
      concentrationUnit: '%',
      notes: 'Minéral de cicatrisation',
    },
  ],

  // ── THERAMID_VITAMIN_ENRICHED_BODY_LOTION ───────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_VITAMIN_ENRICHED_BODY_LOTION]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 4,
      concentrationUnit: '%',
      notes: 'Vitamine B3, renouvellement cellulaire et uniformité teint',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Tocophéryl acétate, protection antioxydante contre radicaux libres',
    },
    {
      slug: INGREDIENT_SLUGS.RETINAL,
      concentrationValue: 0.06,
      concentrationUnit: '%',
      notes: 'Liposomé encapsulé, stimule synthèse collagène, réduit rides',
    },
  ],

  // ── THERAMID_AHA_SMOOTHING_BODY_LOTION ──────────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_AHA_SMOOTHING_BODY_LOTION]: [
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: 'AHA puissant, exfolie et lisse texture, élimine cellules mortes',
    },
    {
      slug: INGREDIENT_SLUGS.PEPTIDE_COMPLEX,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Peptides apaisants (Palmitoyl Tripeptide-8), calme irritation post-exfoliation',
    },
    {
      slug: INGREDIENT_SLUGS.ECTOIN,
      concentrationValue: 0.5,
      concentrationUnit: '%',
      notes: 'Apaisement et renforcement barrière après exfoliation chimique',
    },
  ],

  // ── THERAMID_CERAMIDE_BARRIER_BODY_TREATMENT ────────────────────────
  [THERAMID_PRODUCT_SLUGS.THERAMID_CERAMIDE_BARRIER_BODY_TREATMENT]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Complexe céramides multi-types, restaure barrière lipidique',
    },
    {
      slug: INGREDIENT_SLUGS.POSTBIOTICS,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Pré et probiotiques (Bifida Ferment, Lactobacillus), équilibre microbiome',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant, maintient hydratation durable',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Apaisement et soutien barrière cutanée',
    },
  ],
}
