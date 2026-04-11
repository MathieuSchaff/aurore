import { TAG_SLUGS } from '../../tags/seed-tags'
import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import type { UnifiedProductSeed } from '../unified-types'

export const ISISPHARMA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'isispharma-ruboril-expert-s',
    name: 'Ruboril Expert S',
    brand: 'Isispharma',
    kind: 'moisturizer',
    unit: 'pump',
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 1650,
    description: 'Crème anti-rougeurs spécifiquement formulée pour les peaux sèches. Renforce les parois des capillaires et répare la barrière.',
    notes: 'Complexe β-CALM (Ruscus, Centella, Calendula, Escin). Niacinamide et Panthenol. Texture riche et confortable. Sans parfum.',
    inci: 'WATER, GLYCERIN, CAPRYLIC/CAPRIC TRIGLYCERIDE, BETAINE, BUTYLENE GLYCOL, DIMETHICONE, PENTYLENE GLYCOL, DICAPRYLYL CARBONATE, BUTYROSPERMUM PARKII (SHEA) BUTTER, MYRISTYL MYRISTATE, GLYCYRRHETINIC ACID, CETYL ALCOHOL, SODIUM POLYACRYLATE, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, TRICETEARETH-4 PHOSPHATE, GLYCOL STEARATE, PEG-2 STEARATE, ALUMINUM STARCH OCTENYLSUCCINATE, NIACINAMIDE, ACACIA DECURRENS/JOJOBA/SUNFLOWER SEED WAX POLYGLYCERYL-3 ESTERS, CARBOMER, PANTHENOL, CHLORPHENESIN, C12-16 ALCOHOLS, CAMELINA SATIVA SEED OIL, O-CYMEN-5-OL, ESCIN, SODIUM HYDROXIDE, PALMITIC ACID, HYDROGENATED LECITHIN, DISODIUM EDTA, RUSCUS ACULEATUS ROOT EXTRACT, POLYSORBATE 60, SORBITAN ISOSTEARATE, AMMONIUM GLYCYRRHIZATE, CENTELLA ASIATICA LEAF EXTRACT, HYDROLYZED YEAST PROTEIN, CALENDULA OFFICINALIS FLOWER EXTRACT, SODIUM CITRATE, TOCOPHEROL',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.COUPEROSE],
      secondary: [
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.EMOLLIENCE,
        TAG_SLUGS.BARRIERE_CUTANEE,
        TAG_SLUGS.TEXTURE_RICHE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [TAG_SLUGS.PEAU_GRASSE, TAG_SLUGS.PEAU_MIXTE],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.RUSCUS_ACULEATUS, notes: 'Complexe β-CALM (Microcirculation)',},
      { slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA, notes: 'Complexe β-CALM (Apaisant)',},
      { slug: INGREDIENT_SLUGS.ESCIN, notes: 'Complexe β-CALM (Vaisseaux)',},
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Renforce la barrière cutanée',},
      { slug: INGREDIENT_SLUGS.PANTHENOL, notes: 'Hydrate et répare',},
      { slug: INGREDIENT_SLUGS.SHEA_BUTTER, notes: 'Nourrit les peaux sèches',},
    ],
  },
  {
    slug: 'isispharma-ruboril-expert-m',
    name: 'Ruboril Expert M',
    brand: 'Isispharma',
    kind: 'moisturizer',
    unit: 'pump',
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 0,
    description: 'Gel-crème anti-rougeurs pour peaux sensibles sujettes aux rougeurs diffuses et vaisseaux visibles.',
    notes: 'Occlusion 5.5/10. Texture gel-crème légère. Complexe B-Calm breveté pour cibler les causes des rougeurs.',
    inci: 'WATER, CAPRYLIC/CAPRIC TRIGLYCERIDE, BETAINE, BUTYLENE GLYCOL, PENTYLENE GLYCOL, ACACIA DECURRENS/JOJOBA/SUNFLOWER SEED WAX POLYGLYCERYL-3 ESTERS, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, GLYCYRRHETINIC ACID, CETYL ALCOHOL, NIACINAMIDE, PANTHENOL, CHLORPHENESIN, C12-16 ALCOHOLS, CITRIC ACID, CAMELINA SATIVA SEED OIL, CARBOMER, O-CYMEN-5-OL, ESCIN, SODIUM HYDROXIDE, POLYSORBATE 60, SORBITAN ISOSTEARATE, GLYCERIN, PALMITIC ACID, HYDROGENATED LECITHIN, RUSCUS ACULEATUS ROOT EXTRACT, AMMONIUM GLYCYRRHIZATE, CENTELLA ASIATICA LEAF EXTRACT, HYDROLYZED YEAST PROTEIN, CALENDULA OFFICINALIS FLOWER EXTRACT, SODIUM CITRATE, TOCOPHEROL, ASCORBIC ACID',
    url: 'https://www.isispharma.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS, TAG_SLUGS.ROSACEE, TAG_SLUGS.COUPEROSE],
      secondary: [
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_NORMALE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [TAG_SLUGS.PEAU_SECHE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.REGLISSE,
        notes: 'Acide glycyrrhétinique — complexe B-Calm anti-rougeurs',},
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Renforce la barrière et réduit les rougeurs',},
      { slug: INGREDIENT_SLUGS.PANTHENOL, notes: 'Provitamine B5 apaisante',},
      {
        slug: INGREDIENT_SLUGS.RUSCUS_ACULEATUS,
        notes: 'Petit houx — vasoconstricteur et drainant veineux',},
      { slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA, notes: 'Extrait de centella apaisant',},
      { slug: INGREDIENT_SLUGS.ESCIN, notes: 'Escine — renforce la paroi capillaire',},
      { slug: INGREDIENT_SLUGS.TOCOPHEROL, notes: 'Vitamine E antioxydante',},
    ],
  },
  {
    slug: 'isispharma-urelia-50-baume-keratolytique',
    name: 'Urelia 50 Baume Hydratant Kératolytique',
    brand: 'Isispharma',
    kind: 'balm',
    unit: 'tube',
    totalAmount: 40,
    amountUnit: 'ml',
    priceCents: 1389,
    description: 'Baume onctueux ultra-concentré en urée pour le traitement des plaques épaissies et des zones hyperkératosiques. Texture confortable respectant les peaux fragilisées. Action combinée exfoliante et réparatrice.',
    notes: `50% d'urée + acides glycolique et lactique. Contient un extrait fermenté marin (Pseudoalteromonas) aux propriétés régénérantes. Formule non parfumée, tolérance optimale. Association recommandée avec Urelia Gel.`,
    inci: 'UREA, WATER, PARAFFINUM LIQUIDUM, GLYCERIN, CYCLOPENTASILOXANE, GLYCOLIC ACID, BUTYROSPERMUM PARKII BUTTER, DICAPRYLYL ETHER, CYCLOHEXASILOXANE, POLYGLYCERYL-4 ISOSTEARATE, CETYL PEG/PPG-10/1 DIMETHICONE, HEXYL LAURATE, BEHENOXY DIMETHICONE, PENTYLENE GLYCOL, DIMETHICONE, SODIUM CHLORIDE, PSEUDOALTEROMONAS FERMENT EXTRACT, LACTIC ACID, CHLORPHENESIN, XANTHAN GUM, CAPRYLYL GLYCOL, ETHYLHEXYLGLYCERIN, ALANINE, PROLINE, SERINE, SODIUM PHOSPHATE, SODIUM HYDROXIDE, TOCOPHEROL, GLYCINE SOJA OIL, PENTAERYTHRITYL TETRADI-T-BUTYL HYDROXYHYDROCINNAMATE, CITRIC ACID',
    url: 'https://pharmacie-citypharma.fr/fr/isispharma-urelia-50-baume-hydratant-keratolytique-40ml',
    tags: {
      primary: [TAG_SLUGS.KERATOSE_PILAIRE, TAG_SLUGS.ECZEMA],
      secondary: [
        TAG_SLUGS.BAUME,
        TAG_SLUGS.ZONE_CORPS,
        TAG_SLUGS.SOIN_LOCALISE,
        TAG_SLUGS.TEXTURE_RICHE,
        TAG_SLUGS.SANS_PARFUM,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.UREA,
        concentrationValue: 50,
        concentrationUnit: '%',
        notes: 'Urée pure à concentration maximale pour traitement intensif des plaques épaissies.',},
      {
        slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
        notes: `AHA synergique amplifiant l'effet exfoliant sur les zones hyperkératosiques.`,},
      {
        slug: INGREDIENT_SLUGS.LACTIC_ACID,
        notes: 'AHA hydratant participant à la kératolyse et au maintien du pH cutané.',},
      {
        slug: INGREDIENT_SLUGS.SHEA_BUTTER,
        notes: 'Beurre de karité nourrissant et protecteur. Texture baume confortable.',},
      {
        slug: INGREDIENT_SLUGS.PSEUDOALTEROMONAS_FERMENT,
        notes: 'Extrait marin fermenté aux propriétés régénérantes et réparatrices de la barrière cutanée.',},
      {
        slug: INGREDIENT_SLUGS.TOCOPHEROL,
        notes: 'Vitamine E antioxydante protectrice des lipides cutanés.',},
    ],
  },
]
