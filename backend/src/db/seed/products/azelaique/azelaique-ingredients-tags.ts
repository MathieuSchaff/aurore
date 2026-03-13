import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { allProductSlugs } from '../products-slugs'
import { AZELAIQUE_PRODUCT_SLUGS } from './azelaique'

export const AZELAIQUE_INGREDIENTS_MAP: Record<string, any[]> = {
  [allProductSlugs.NINE_LESS_A_CONTROL_10]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: '10% acide azélaïque – anti-imperfections, anti-rougeurs, éclaircissant',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Régulateur de sébum, barrière, éclaircissant',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: '3 extraits + madecassoside, asiaticoside, etc. – apaisant puissant',
    },
    {
      slug: INGREDIENT_SLUGS.SNAIL_MUCIN,
      notes: "Mucine d'escargot – hydratant, régénérant, boost collagène",
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: 'Exfoliant doux (AHA)',
    },
    {
      slug: INGREDIENT_SLUGS.ARGIRELINE,
      notes: 'Peptide anti-âge',
    },
  ],

  [allProductSlugs.PURITO_AZELAIC_KOJIC_TEA_TREE]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: '10% acide azélaïque – signature anti-acné/marks',
    },
    {
      slug: INGREDIENT_SLUGS.KOJIC_ACID,
      notes: 'Éclaircissant puissant (pigmentation)',
    },
    {
      slug: INGREDIENT_SLUGS.TEA_TREE,
      notes: 'Tea Tree (eau + huile) – antibactérien, séborégulateur (attention irritant post-IPL)',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
    },
    {
      slug: INGREDIENT_SLUGS.GLUTATHION,
      notes: 'Antioxydant éclaircissant',
    },
    {
      slug: INGREDIENT_SLUGS.COQ10,
      notes: 'CoQ10 – anti-âge',
    },
    {
      slug: INGREDIENT_SLUGS.ADENOSINE,
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
    },
  ],

  [allProductSlugs.NOOANCE_AZELAIC_15]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: '15% acide azélaïque – concentration max cosmétique, anti-glycation/imperfections',
    },
    {
      slug: INGREDIENT_SLUGS.CARNOSINE,
      notes: 'Actif unique anti-glycation, protection avancée',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_AP,
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_EOP,
      notes: 'Complexe céramides – réparation barrière (idéal post-IPL/sensible)',
    },
    {
      slug: INGREDIENT_SLUGS.AVENA_SATIVA,
      notes: "Extrait d'avoine – apaisant",
    },
    {
      slug: INGREDIENT_SLUGS.GREEN_TEA,
      notes: 'Extrait thé vert – antioxydant',
    },
  ],

  [allProductSlugs.ALLIES_OF_SKIN_AZELAIC_KOJIC]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: '10% acide azélaïque – exfoliant doux, anti-rougeurs/pigmentation',
    },
    {
      slug: INGREDIENT_SLUGS.KOJIC_ACID,
      notes: '1% kojic acid – éclaircissant',
    },
    {
      slug: INGREDIENT_SLUGS.HEXYLRESORCINOL,
      notes: '3% hexylresorcinol – puissant anti-taches',
    },
    {
      slug: INGREDIENT_SLUGS.BAKUCHIOL,
      notes: 'Alternative douce au rétinol – anti-âge',
    },
    {
      slug: INGREDIENT_SLUGS.RIBOSE,
      notes: 'Sucre stimulant énergie cellulaire',
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Réglisse – apaisant, anti-inflammatoire',
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
    },
    {
      slug: INGREDIENT_SLUGS.BISABOLOL,
    },
  ],

  [allProductSlugs.DR_SAM_FLAWLESS_BRIGHTLY]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: '10% acide azélaïque – éclaircissant, anti-imperfections',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Multi-tâches : barrière, sébum, teint',
    },
    {
      slug: INGREDIENT_SLUGS.ASCORBYL_GLUCOSIDE,
      notes: 'Vitamine C stable – antioxydant, éclat',
    },
    {
      slug: INGREDIENT_SLUGS.BAKUCHIOL,
      notes: 'Anti-âge doux',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
    },
  ],

  [AZELAIQUE_PRODUCT_SLUGS.TYPOLOGY_AZELAIC_SERUM_L35]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes:
        "Actif principal d'origine végétale. Régule la production de sébum, propriétés antibactériennes et kératolytiques.",
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_PCA,
      notes: "Régulateur de sébum et antibactérien. Complément synergique à l'acide azélaïque.",
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: "Humectant pour maintenir l'hydratation sans alourdir la formule.",
    },
  ],

  // ─────────────────────────────────────────────
  // Q+A — Azelaic Acid Balancing Serum
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.QA_AZELAIC_ACID_BALANCING_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes:
        "Actif principal équilibrant. Régule le sébum, réduit l'hyperpigmentation et les imperfections.",
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_PCA,
      notes: "Minimise les pores et régule le sébum, en synergie avec l'acide azélaïque.",
    },
    {
      slug: INGREDIENT_SLUGS.ALOE_VERA,
      notes: "Jus de feuille d'aloe vera en tête de liste. Soothing, hydratant et calmant.",
    },
    {
      slug: INGREDIENT_SLUGS.BETAINE,
      notes: 'Osmoprotecteur et humectant doux. Renforce la tolérance cutanée.',
    },
  ],

  // ─────────────────────────────────────────────
  // THE INKEY LIST — Solution Anti-Rougeurs
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.INKEY_LIST_AZELAIC_ACID_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes:
        'Réduit les rougeurs, unifie le teint, apaise la peau. Développé avec des dermatologues.',
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
      notes: "Agent apaisant et kératolytique doux. Renforce la tolérance à l'acide azélaïque.",
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes: 'Humectant pour maintenir le confort cutané.',
    },
  ],

  // ─────────────────────────────────────────────
  // APIS — TerApis 30% Azelaic Acid
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.APIS_TERAPIS_AZELAIC_ACID_30]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      concentrationValue: 30,
      concentrationUnit: '%',
      notes:
        'Concentration professionnelle. Exfoliation, renouvellement cellulaire, anti-pigmentation et anti-sébum.',
    },
  ],

  // ─────────────────────────────────────────────
  // TIRTIR — Azelaic Acid 12% Serum
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.TIRTIR_AZELAIC_ACID_12_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      concentrationValue: 12,
      concentrationUnit: '%',
      notes: 'Régule le sébum et apaise les rougeurs. Concentration intermédiaire efficace.',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Renforce la barrière cutanée et prévient la déshydratation transépidermique.',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_PCA,
      notes: 'Complément sebum-control et antibactérien.',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes:
        "Hydratation et repulpement. Compense l'effet desséchant potentiel de l'acide azélaïque.",
    },
    {
      slug: INGREDIENT_SLUGS.CHONDRUS_CRISPUS,
      notes: "Extrait d'algue rouge. Filmogène, apaisant et riche en polysaccharides hydratants.",
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante. Protège la formule et la peau du stress oxydatif.',
    },
  ],

  // ─────────────────────────────────────────────
  // VT — Ampoule Apaisante A1
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.VT_AZELAIC_AMPOULE_A1]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      notes: 'Régule la production de sébum, calme rougeurs, affine le grain de peau.',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes:
        "Extrait de Cica sous forme d'exosomes nanoscopiques. Soin apaisant intense et réparateur.",
    },
    {
      slug: INGREDIENT_SLUGS.MADECASSOSIDE,
      notes:
        'Triterpène de Centella. Anti-inflammatoire puissant et réparateur de la barrière cutanée.',
    },
    {
      slug: INGREDIENT_SLUGS.ASIATICOSIDE,
      notes: 'Triterpène de Centella. Stimule la synthèse de collagène et apaise les irritations.',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes:
        'Complexe hyaluronique multi-poids (4 formes) pour hydratation profonde et surfacique.',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Provitamine B5. Hydratante, cicatrisante et apaisante.',
    },
    {
      slug: INGREDIENT_SLUGS.CYANOCOBALAMIN,
      notes: 'Vitamine B12. Apaise les rougeurs et régule la mélanogenèse.',
    },
    {
      slug: INGREDIENT_SLUGS.TEA_TREE,
      notes: "Antibactérien naturel. Renforce l'action anti-acné de l'acide azélaïque.",
    },
  ],

  // ─────────────────────────────────────────────
  // DUCRAY — Keracnyl Sérum
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.DUCRAY_KERACNYL_AZELAIC_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      concentrationValue: 8,
      concentrationUnit: '%',
      notes: 'Dépigmentant, anti-taches et anti-inflammatoire. Atténue les marques post-acnéiques.',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes:
        "AHA lissant. Associé à l'acide azélaïque pour exfoliier et améliorer la texture cutanée.",
    },
    {
      slug: INGREDIENT_SLUGS.MYRTUS_COMMUNIS_LEAF_EXTRACT,
      notes:
        'Myrtacine (brevetée). Propriétés antibactériennes ciblées sur P. acnes, agit en amont des boutons.',
    },
    {
      slug: INGREDIENT_SLUGS.TRIPTERYGIUM_WILFORDII_CALLUS_EXTRACT,
      notes:
        "Célastrol (Tripterygium Wilfordii). Anti-inflammatoire breveté, empêche l'aggravation en boutons enflammés.",
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_GRAINES_TOURNESOL,
      notes:
        'Huile de tournesol. Émolliente, riche en acides linoléiques pour nourrir sans comédogénicité.',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E. Antioxydant protecteur de la formule et de la peau.',
    },
  ],

  // ─────────────────────────────────────────────
  // MEDICUBE — Azelaic Acid 16 BB Calming Serum
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.MEDICUBE_AZELAIC_ACID_16_BB_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      concentrationValue: 16,
      concentrationUnit: '%',
      notes: 'Haute concentration. Régule le sébum, anti-acné et améliore la texture cutanée.',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes:
        "Anti-inflammatoire, pore-minimizing et dépigmentant. Synergie forte avec l'acide azélaïque.",
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes:
        'Acide pantothénique (B5). Régule le métabolisme des graisses cutanées, limite la production de sébum.',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDE_NP,
      notes: 'Renforce la barrière cutanée, réduit la sensibilité aux actifs concentrés.',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes:
        "Extrait de Cica apaisant pour contrer les irritations liées aux hautes concentrations d'acide azélaïque.",
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: "Émollient léger non comédogène. Maintient l'équilibre lipidique sans alourdir.",
    },
    {
      slug: INGREDIENT_SLUGS.NMN,
      notes:
        'NMN — précurseur du NAD+. Anti-âge cellulaire et amélioration de la vitalité cutanée.',
    },
  ],

  // ─────────────────────────────────────────────
  // COS DE BAHA — AZ Azelaic Acid 10
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.COS_DE_BAHA_AZELAIC_ACID_10_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: "Efface cicatrices d'acné, améliore l'hyperpigmentation et traite la rosacée.",
    },
    {
      slug: INGREDIENT_SLUGS.ALOE_VERA,
      notes: 'Base de la formule. Hydratant, apaisant et porteur naturel des actifs.',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes:
        "Dépigmentant et anti-inflammatoire. Renforce l'action anti-taches de l'acide azélaïque.",
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: "Hydratation profonde et rétention d'eau dans le derme.",
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Provitamine B5 apaisante et cicatrisante.',
    },
    {
      slug: INGREDIENT_SLUGS.GREEN_TEA,
      notes: 'Extrait de thé vert certifié bio (*). Antioxydant puissant et anti-inflammatoire.',
    },
  ],

  // ─────────────────────────────────────────────
  // ACM — Azéane Crème 15%
  // ─────────────────────────────────────────────
  [AZELAIQUE_PRODUCT_SLUGS.ACM_AZEANE_CREME_15]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      concentrationValue: 15,
      concentrationUnit: '%',
      notes:
        'Concentration dermatologique élevée. Antibactérien, kératolytique, anti-taches, anti-inflammatoire et sebum-control.',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes:
        'Niacinamide (vitamine PP). Freine le transfert de mélanine, effet dépigmentant et anti-inflammatoire.',
    },
    {
      slug: INGREDIENT_SLUGS.XYLITOL,
      notes: 'Sucre-alcool humectant. Renforce le microbiome cutané et la barrière hydrique.',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCERIN,
      notes:
        'Humectant de base. Maintient le confort cutané malgré la concentration élevée en acide azélaïque.',
    },
  ],
}

// Export pour compatibilité descendante
export const AZELAIQUE_PRODUCT_INGREDIENTS = Object.entries(AZELAIQUE_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
