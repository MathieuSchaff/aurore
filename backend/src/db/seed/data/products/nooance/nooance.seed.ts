import { TAG_SLUGS } from '../../../data/tags';
import { INGREDIENT_SLUGS } from '../../../data/ingredients/ingredient-slugs';
import type { UnifiedProductSeed } from '../types';

export const NOOANCE_SEED: UnifiedProductSeed[] = [
  {
    slug: "nooance-serum-peptides-cuivre-2-pourcent",
    name: 'Sérum Peptides de Cuivre 2%',
    brand: 'Nooance',
    kind: 'serum',
    unit: "pump",
    totalAmount: 20,
    amountUnit: "ml",
    priceCents: 7800,
    description: 'Sérum concentré 11% peptides dont 2% GHK-Cu. Lisse rides/ridules, raffermit, stimule collagène et renforce barrière.',
    notes: 'GHK-Cu 2% + Matrixyl 3000 3% + Trifluoroacetyl Tripeptide-2 2% + Tripeptide-1 2% + prébiotiques/hydratants. Texture aqueuse légère, jour/nuit.',
    inci: 'WATER, PENTYLENE GLYCOL, METHYLPROPANEDIOL, GLYCERIN, COPPER TRIPEPTIDE-1, BUTYLENE GLYCOL, 1,2-HEXANEDIOL, PANTHENOL, ALPHA-GLUCAN OLIGOSACCHARIDE, SODIUM HYALURONATE, CARBOMER, HYDROLYZED BETA-GLUCAN, SODIUM LACTATE, SODIUM CARBOXYMETHYL BETA-GLUCAN, POLYSORBATE 20, CITRIC ACID, SODIUM BENZOATE, POTASSIUM SORBATE, DEXTRAN, TRIFLUOROACETYL TRIPEPTIDE-2, PALMITOYL TRIPEPTIDE-1, TRIPEPTIDE-1, PALMITOYL TETRAPEPTIDE-7, SODIUM HYDROXIDE',
    url: 'https://nooance-paris.com',
    tags: {
      primary: [
        TAG_SLUGS.ANTI_AGE,
        TAG_SLUGS.BARRIERE_CUTANEE,
        TAG_SLUGS.REPULPANT,
      ],
      secondary: [
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.SERUM,
        TAG_SLUGS.NON_COMEDOGENE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_NORMALE,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.COPPER_PEPTIDES,
        notes: '2% GHK-Cu (Copper Tripeptide-1) – réparation, anti-âge, barrière, collagène',},
      {
        slug: INGREDIENT_SLUGS.PALMITOYL_TRIPEPTIDE_1,
        notes: 'Matrixyl 3000 (avec Pal-Tetrapeptide-7)',},
      {
        slug: INGREDIENT_SLUGS.PALMITOYL_TETRAPEPTIDE_7,
      },
      {
        slug: INGREDIENT_SLUGS.TRIFLUOROACETYL_TRIPEPTIDE_2,
        notes: '2% Trifluoroacetyl Tripeptide-2 – anti-relâchement, fermeté (Progeline-like)',},
      {
        slug: INGREDIENT_SLUGS.TRIPEPTIDE_1,
        notes: '2% Tripeptide-1 – stimulation collagène',},
      {
        slug: INGREDIENT_SLUGS.PANTHENOL,
        notes: 'Apaisant, hydratant',},
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      },
      {
        slug: INGREDIENT_SLUGS.ALPHA_GLUCAN_OLIGOSACCHARIDE,
        notes: 'Prébiotique – équilibre microbiome',},
      {
        slug: INGREDIENT_SLUGS.BETA_GLUCAN,
      },
    ],
  },

  {
    slug: "nooance-serum-acide-azelaique-15-pourcent",
    name: 'Sérum Acide Azélaïque 15%',
    brand: 'Nooance',
    kind: 'serum',
    unit: "bottle",
    totalAmount: 30,
    amountUnit: "ml",
    priceCents: 6500,
    description: 'Sérum premium 15% acide azélaïque + carnosine + céramides. Concentration max, anti-glycation, réparation barrière.',
    notes: '15% azélaïque (max cosmétique) + carnosine unique anti-glycation + céramides + EGCG. Texture laiteuse agréable, adapté peaux sensibles/post-IPL.',
    inci: 'WATER, AZELAIC ACID (15%), CARNOSINE, CERAMIDE NP, CERAMIDE AP, CERAMIDE EOP, EGCG, AVENA SATIVA (OAT) KERNEL EXTRACT, PERSEA GRATISSIMA (AVOCADO) OIL ESTERS, GLYCERIN, BUTYLENE GLYCOL, PENTYLENE GLYCOL, SODIUM HYDROXIDE, XANTHAN GUM, ETHYLHEXYLGLYCERIN, PHENOXYETHANOL',
    url: 'https://nooance-paris.com',
    tags: {
      primary: [TAG_SLUGS.ROSACEE, TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.PEAU_SENSIBLE],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.BARRIERE_CUTANEE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.HYPOALLERGENIQUE,
      ],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.AZELAIC_ACID, notes: '15% acide azélaïque – concentration max cosmétique, anti-glycation/imperfections',},
      { slug: INGREDIENT_SLUGS.CARNOSINE, notes: 'Actif unique anti-glycation, protection avancée',},
      { slug: INGREDIENT_SLUGS.CERAMIDE_NP },
      { slug: INGREDIENT_SLUGS.CERAMIDE_AP },
      { slug: INGREDIENT_SLUGS.CERAMIDE_EOP, notes: 'Complexe céramides – réparation barrière (idéal post-IPL/sensible)',},
      { slug: INGREDIENT_SLUGS.AVENA_SATIVA, notes: `Extrait d'avoine – apaisant`,},
      { slug: INGREDIENT_SLUGS.GREEN_TEA, notes: 'EGCG – antioxydant',},
      { slug: INGREDIENT_SLUGS.AVOCADO_OIL, notes: `Esters d'avocat – séborégulateur`,},
    ],
  },
];
