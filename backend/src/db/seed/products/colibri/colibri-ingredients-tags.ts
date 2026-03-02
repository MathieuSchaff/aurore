import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { COLIBRI_PRODUCT_SLUGS } from './colibri'

export const COLIBRI_INGREDIENTS_MAP: Record<string, any[]> = {
  [COLIBRI_PRODUCT_SLUGS.COLIBRI_BRIGHTENING_BOOSTER]: [
    {
      slug: INGREDIENT_SLUGS.AZELAIC_ACID,
      value: 10,
      unit: '%',
      notes: 'Anti-taches, anti-rougeurs et kératolytique',
    },
    {
      slug: INGREDIENT_SLUGS.MANDELIC_ACID, // à créer si absent
      notes: 'AHA doux exfoliant et uniformisant',
    },
    {
      slug: INGREDIENT_SLUGS.REGLISSE,
      notes: 'Extrait de réglisse anti-inflammatoire',
    },
    {
      slug: INGREDIENT_SLUGS.THREE_O_ETHYL_ASCORBIC_ACID, // à créer si absent — 3-O-Ethyl Ascorbic Acid
      notes: 'Dérivé vitamine C stable éclat',
    },
    {
      slug: INGREDIENT_SLUGS.HUILE_DE_JOJOBA,
      notes: 'Émollient céramide-like',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Lipide occlusif doux',
    },
  ],

  [COLIBRI_PRODUCT_SLUGS.PORE_CONTROL_BOOSTER]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      value: 8,
      unit: '%',
      notes: 'Resserre pores et régule sébum',
    },
    // {
    //   slug: INGREDIENT_SLUGS.nico, // à créer — Nicotinamide Mononucleotide
    //   value: 4,
    //   unit: '%',
    //   notes: 'NMN précurseur NAD+ anti-âge cellulaire',
    // },
    {
      slug: INGREDIENT_SLUGS.POLYGLUTAMIC_ACID,
      notes: 'Super-hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Acide hyaluronique hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.SPHINGOMONAS_FERMENT,
      notes: 'Postbiotique rééquilibrant microbiome',
    },
  ],

  [COLIBRI_PRODUCT_SLUGS.CALMING_MOISTURIZER]: [
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Asiaticoside + acides madécassique et asiatique',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Provitamine B5 hydratante',
    },
    {
      slug: INGREDIENT_SLUGS.SQUALANE,
      notes: 'Lipide émollient biomimétique',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES, // = CERAMIDE NP dans l'INCI
      notes: 'Céramide NP barrière cutanée',
    },
    {
      slug: INGREDIENT_SLUGS.PRUNUS_AMYGDALUS_DULCIS_OIL,
      notes: 'Huile d amande douce émolliente',
    },
    {
      slug: INGREDIENT_SLUGS.SHEA_BUTTER,
      notes: 'Beurre de karité nourrissant',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Acide hyaluronique hydratant',
    },
  ],

  [COLIBRI_PRODUCT_SLUGS.VITAMIN_C_20_BOOSTER]: [
    {
      slug: INGREDIENT_SLUGS.THREE_O_ETHYL_ASCORBIC_ACID,
      notes: '3-O-Ethyl Ascorbic Acid — vitamine C stable',
    },
    {
      slug: INGREDIENT_SLUGS.THD_ASCORBATE,
      notes: 'THD Ascorbate — vitamine C liposoluble stable',
    },
    // {
    //   slug: INGREDIENT_SLUGS.glyceryl, // à créer — 3-Glyceryl Ascorbate
    //   notes: '3ème forme de vitamine C stable',
    // },
    {
      slug: INGREDIENT_SLUGS.HEXYLRESORCINOL, // à créer si absent
      notes: 'Dépigmentant et antioxydant',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E synergique',
    },
  ],

  [COLIBRI_PRODUCT_SLUGS.VITAMIN_C15_BOOSTER]: [
    {
      slug: INGREDIENT_SLUGS.THREE_O_ETHYL_ASCORBIC_ACID,
      value: 15,
      unit: '%',
      notes: '3-O-Ethyl Ascorbic Acid — vitamine C stable',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Acide hyaluronique hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.ARGININE, // à créer — complexe antioxydant
      notes: 'Complexe plancton/arginine ferulate antioxydant',
    },
  ],

  [COLIBRI_PRODUCT_SLUGS.BARRIER_BOOSTER]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDES, // NP + AP + AS + NS + EOP
      notes: '5 céramides biomimétiques (NP/AP/AS/NS/EOP)',
    },
    {
      slug: INGREDIENT_SLUGS.ECTOIN, // à créer si absent
      notes: 'Ectoine — osmoprotecteur anti-stress cutané',
    },
    {
      slug: INGREDIENT_SLUGS.PANTHENOL,
      notes: 'Provitamine B5 réparatrice',
    },
    {
      slug: INGREDIENT_SLUGS.CHOLESTEROL,
      notes: 'Lipide barrière biomimétique',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Renforce la barrière',
    },
    {
      slug: INGREDIENT_SLUGS.ALLANTOIN,
      notes: 'Apaisant et cicatrisant',
    },
    {
      slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
      notes: 'Acide hyaluronique hydratant',
    },
    {
      slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
      notes: 'Asiaticoside + acides madécassique et asiatique',
    },
  ],

  [COLIBRI_PRODUCT_SLUGS.ANTIOXIDANT_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.RESVERATROL,
      notes: 'Polyphénol antioxydant puissant',
    },
    // {
    //   slug: INGREDIENT_SLUGS.SUPEROXIDE_DISMUTASE, // à créer
    //   notes: 'Enzyme antioxydante endogène',
    // },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Antioxydant et protecteur barrière',
    },
    {
      slug: INGREDIENT_SLUGS.TOCOPHEROL,
      notes: 'Vitamine E antioxydante',
    },
    // {
    //   slug: INGREDIENT_SLUGS.CAROTENOIDS, // à créer
    //   notes: 'Caroténoïdes antioxydants',
    // },
    {
      slug: INGREDIENT_SLUGS.GREEN_TEA, // = CAMELLIA SINENSIS
      notes: 'Extrait thé vert polyphénols',
    },
  ],
}
