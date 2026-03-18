import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { OCCITANE_PRODUCT_SLUGS } from './occitane'

export const OCCITANE_INGREDIENTS_MAP: Record<
  string,
  {
    slug: string
    concentrationValue?: number
    concentrationUnit?: string
    concentrationPer?: string
    notes: string
  }[]
> = {
  // ── CLEANSERS ──────────────────────────────────────────────────────────────

  [OCCITANE_PRODUCT_SLUGS.IMMORTELLE_MOUSSE_NETTOYANTE]: [
    {
      slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
      notes:
        "Extrait aqueux d'Immortelle bio de Corse aux propriétés antioxydantes et anti-âge, ainsi que HE",
    },
    {
      slug: INGREDIENT_SLUGS.LACTIC_ACID,
      notes: "AHA exfoliant doux qui améliore le grain de peau et l'éclat",
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHERYL_ACETATE,
      notes: 'Vitamine E antioxydante, protège la peau lors du nettoyage',
    },
  ],

  [OCCITANE_PRODUCT_SLUGS.IMMORTELLE_BAUME_DEMAQUILLANT]: [
    {
      slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
      notes: "Huile essentielle d'Immortelle bio, antioxydante et anti-âge",
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_GRAINES_TOURNESOL,
      notes: 'Huile de tournesol, solvant démaquillant et nourrissant riche en oméga-6',
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_DE_COCO,
      notes: 'Huile de coco, aide à dissoudre le maquillage et nourrit la peau',
    },
    {
      slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL,
      notes: 'Huile douce émolliente et nourrissante pour peaux sensibles',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité, apport de douceur et nutrition intense',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E naturelle, antioxydante et protectrice',
    },
  ],

  [OCCITANE_PRODUCT_SLUGS.IMMORTELLE_HUILE_DEMAQUILLANTE]: [
    {
      slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
      notes:
        "Extrait d'Immortelle bio, antioxydant et protecteur. Huile essentielle d'Immortelle bio de Corse",
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_DE_RICIN,
      notes:
        "Huile de ricin : démaquillante et rétentrice d'hydratation, réduit la visibilité des pores",
    },
    {
      slug: INGREDIENT_SLUGS.APRICOT_KERNEL_OIL,
      notes: "Huile d'abricot légère, adoucissante et nourrissante",
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_ARGOUSIER,
      notes: "Huile d'argousier riche en caroténoïdes, protège et illumine",
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E naturelle antioxydante',
    },
  ],

  // ── TONER / ESSENCE ────────────────────────────────────────────────────────

  [OCCITANE_PRODUCT_SLUGS.IMMORTELLE_EAU_ESSENTIELLE]: [
    {
      slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
      notes: "Super extrait aqueux d'Immortelle bio aux polyphénols antioxydants",
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Acide hyaluronique : hydratation immédiate et lissage du grain de peau',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_PCA,
      notes: "Facteur naturel d'hydratation (NMF), retient l'eau dans l'épiderme",
    },
  ],

  [OCCITANE_PRODUCT_SLUGS.IMMORTELLE_TRIPHASE_ESSENCE_RESET]: [
    {
      slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
      notes: "Extrait d'Immortelle bio pour l'éclat et l'antioxydation",
    },
    {
      slug: INGREDIENT_SLUGS.BEET_ROOT_EXTRACT,
      notes: 'Extrait de betterave, soutient le microbiome cutané',
    },
    {
      slug: INGREDIENT_SLUGS.INULINE,
      notes: 'Extrait de chicorée, prébiotique pour le microbiome',
    },
    {
      slug: INGREDIENT_SLUGS.FRUCTOOLIGOSACCHARIDES,
      notes: 'Prébiotiques qui équilibrent le microbiome de la peau',
    },
    {
      slug: INGREDIENT_SLUGS.BISABOLOL,
      notes: "Bisabolol apaisant, réduit les sensations d'inconfort de -54%",
    },
    {
      slug: INGREDIENT_SLUGS.ADENOSINE,
      notes: 'Anti-âge et apaisant, renforce la barrière cutanée',
    },
  ],

  // ── SERUMS ────────────────────────────────────────────────────────────────

  [OCCITANE_PRODUCT_SLUGS.IMMORTELLE_SERUM_PRO_FERMETE]: [
    {
      slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
      notes:
        "Super extrait d'Immortelle : alternative naturelle au rétinol, raffermi et lisse les rides",
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Acide hyaluronique acétylé, hydratation durable et lissage',
    },
    {
      slug: INGREDIENT_SLUGS.GLEDITSIA_TRIACANTHOS_SEED_EXTRACT,
      notes: 'Extrait botanique tenseur de Gleditsia, effet lifting immédiat',
    },
    {
      slug: INGREDIENT_SLUGS.ASCORBYL_GLUCOSIDE,
      notes: 'Vitamine C stable, éclat et action anti-taches',
    },
    {
      slug: INGREDIENT_SLUGS.ADENOSINE,
      notes: 'Anti-âge, lisse les rides et soutient la fermeté',
    },
  ],

  [OCCITANE_PRODUCT_SLUGS.IMMORTELLE_SERUM_RESET_NUIT]: [
    {
      slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
      notes:
        "Extrait pro-sève d'Immortelle (technologie Bio-inspiration végétale), apaise et régénère",
    },

    {
      slug: INGREDIENT_SLUGS.GARDENIA_FRUIT_EXTRACT,
      notes: 'Extrait de gardénia, aide la peau à se rétablir la nuit pour un teint lissé',
    },
    {
      slug: INGREDIENT_SLUGS.ACMELLA_OLERACEA_EXTRACT,
      notes: "Extrait d'Acmella Oleracea, lisse instantanément la peau",
    },
    {
      slug: INGREDIENT_SLUGS.ADENOSINE,
      notes: 'Anti-âge, lisse et régénère pendant le sommeil',
    },
  ],

  [OCCITANE_PRODUCT_SLUGS.IMMORTELLE_HUILE_JEUNESSE]: [
    {
      slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
      notes: "Super extrait d'Immortelle bio : alternative naturelle au rétinol, anti-âge global",
    },

    {
      slug: INGREDIENT_SLUGS.BOURRACHE,
      notes: 'Huile de bourrache riche en GLA (oméga-6), nourrit et régénère',
    },
    {
      slug: INGREDIENT_SLUGS.CAMELINA_SEED_OIL,
      notes: 'Huile de caméline riche en oméga-3 et vitamine E',
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_ONAGRE,
      notes: "Huile d'onagre, richesse en oméga-6, équilibre et fermeté",
    },
    {
      slug: INGREDIENT_SLUGS.ROSEHIP_SEED_OIL,
      notes: 'Huile de rose musquée rénovatrice, lisse et unifie',
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_ARGOUSIER,
      notes: "Huile d'argousier, éclat et protection",
    },
  ],

  // ── MOISTURISERS ──────────────────────────────────────────────────────────

  [OCCITANE_PRODUCT_SLUGS.IMMORTELLE_CREME_JEUNESSE]: [
    {
      slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
      notes: "Super extrait d'Immortelle bio, combat les 7 signes visibles de l'âge",
    },

    {
      slug: INGREDIENT_SLUGS.ASCORBYL_GLUCOSIDE,
      notes: 'Vitamine C stable, uniformité du teint et action anti-taches brunes',
    },
    {
      slug: INGREDIENT_SLUGS.PAQUERETTE,
      notes: 'Extrait de pâquerette, atténue les taches et uniformise le teint',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Acide hyaluronique, hydratation intense',
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_ONAGRE,
      notes: "Huile d'onagre, nourrit et améliore l'élasticité",
    },
    {
      slug: INGREDIENT_SLUGS.ADENOSINE,
      notes: 'Anti-rides et anti-âge, améliore la fermeté',
    },
  ],

  [OCCITANE_PRODUCT_SLUGS.IMMORTELLE_CREME_VISAGE_PRECIEUSE]: [
    {
      slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
      notes: "Huile essentielle d'Immortelle bio, antioxydante et anti-âge",
    },
    {
      slug: INGREDIENT_SLUGS.LENS_ESCULENTA_SEED_EXTRACT,
      notes: "Extrait de lentille, renforce la résistance cutanée et améliore l'éclat",
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Acide hyaluronique, repulpe et hydrate 24h',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité, nourrit et protège les peaux normales à sèches',
    },
    {
      slug: INGREDIENT_SLUGS.ADENOSINE,
      notes: 'Anti-âge, -39% de ridules',
    },
  ],

  // ── EYE / LIP CARE ────────────────────────────────────────────────────────

  [OCCITANE_PRODUCT_SLUGS.IMMORTELLE_BAUME_REGARD]: [
    {
      slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
      notes: "HE d'Immortelle bio : agit contre la perte de fermeté et l'apparence des rides",
    },

    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: "Beurre de karité, nourrit et réconforte le contour délicat de l'œil",
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Acide hyaluronique, comble les rides et ridules',
    },
    {
      slug: INGREDIENT_SLUGS.ESCIN,
      notes: 'Escine décongestionnante pour réduire poches et cernes',
    },
    {
      slug: INGREDIENT_SLUGS.ADENOSINE,
      notes: "Anti-âge, améliore la fermeté du contour de l'œil",
    },
  ],

  [OCCITANE_PRODUCT_SLUGS.IMMORTELLE_CONTOUR_YEUX_LEVRES]: [
    {
      slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
      notes: "HE d'Immortelle bio, antioxydante et anti-âge",
    },

    {
      slug: INGREDIENT_SLUGS.HUILE_ONAGRE,
      notes: "Huile d'onagre riche en oméga-6, nourrit et renforce la barrière",
    },
    {
      slug: INGREDIENT_SLUGS.ACMELLA_OLERACEA_EXTRACT,
      notes: 'Lissant immédiat du contour des yeux et des lèvres',
    },
    {
      slug: INGREDIENT_SLUGS.ESCIN,
      notes: 'Décongestionnant pour les poches sous les yeux',
    },
    {
      slug: INGREDIENT_SLUGS.ADENOSINE,
      notes: 'Anti-âge pour le contour des yeux et des lèvres',
    },
  ],

  // ── NECK ─────────────────────────────────────────────────────────────────

  [OCCITANE_PRODUCT_SLUGS.IMMORTELLE_CREME_COU]: [
    {
      slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
      notes: "Extrait d'Immortelle bio, antioxydant et anti-âge",
    },

    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TRIPEPTIDE_1,
      notes: 'Peptide de matrikine qui favorise le lissage et renforce la fermeté',
    },
    {
      slug: INGREDIENT_SLUGS.PALMITOYL_TETRAPEPTIDE_7,
      notes: 'Peptide de matrikine qui améliore la densité de la peau du cou',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Acide hyaluronique, hydrate et repulpe les plis du cou',
    },
    {
      slug: INGREDIENT_SLUGS.COLLOIDAL_OATMEAL,
      notes: "Extrait d'avoine, apaisant et nourrissant",
    },
  ],

  // ── BODY ──────────────────────────────────────────────────────────────────

  [OCCITANE_PRODUCT_SLUGS.IMMORTELLE_HUILE_CORPS_RAFFERMISSANTE]: [
    {
      slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
      notes: "Super extrait d'Immortelle, alternative naturelle au rétinol pour le corps",
    },

    {
      slug: INGREDIENT_SLUGS.ROSEHIP_SEED_OIL,
      notes: 'Huile de rose musquée, régénérante, améliore la fermeté et la texture',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Huile de karité, nourrit et protège la barrière cutanée',
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_ARGOUSIER,
      notes: "Huile d'argousier, riche en caroténoïdes, éclat et tonus",
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Squalane, hydratant et émollient léger sans film gras',
    },
  ],

  [OCCITANE_PRODUCT_SLUGS.IMMORTELLE_BAUME_CORPS_PRO_JEUNESSE]: [
    {
      slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
      notes: "Super extrait d'Immortelle, anti-âge pour le corps",
    },

    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité, nutrition intense et confort',
    },
    {
      slug: INGREDIENT_SLUGS.PEA_EXTRACT,
      notes: "Extrait de pois, améliore la fermeté et l'élasticité du corps",
    },
    {
      slug: INGREDIENT_SLUGS.ADENOSINE,
      notes: 'Anti-âge, réduit les irrégularités de texture',
    },
    {
      slug: INGREDIENT_SLUGS.HEXYLRESORCINOL,
      notes: 'Uniformise le teint et atténue les taches sur le corps',
    },
  ],

  // ── HANDS ────────────────────────────────────────────────────────────────

  [OCCITANE_PRODUCT_SLUGS.IMMORTELLE_SERUM_CREME_MAINS]: [
    {
      slug: INGREDIENT_SLUGS.HELICHRYSE_IMMORTELLE,
      notes: "HE d'Immortelle bio, antioxydante et pro-jeunesse",
    },

    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité, nourrit intensément les mains sèches',
    },
    {
      slug: INGREDIENT_SLUGS.ADENOSINE,
      notes: "Anti-âge, améliore la texture et l'élasticité des mains",
    },
    {
      slug: INGREDIENT_SLUGS.HEXYLRESORCINOL,
      notes: 'Atténue les taches de vieillesse et uniformise le teint des mains',
    },
    {
      slug: INGREDIENT_SLUGS.HIBISCUS_SABDARIFFA,
      notes: "Extrait d'hibiscus, riche en acides de fruits AHA naturels",
    },
  ],
}
