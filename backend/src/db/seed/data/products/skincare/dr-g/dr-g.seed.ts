import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const DR_G_SEED: UnifiedProductSeed[] = [
  {
    slug: 'drg-red-blemish-cica-soothing-cream',
    name: 'R.E.D Blemish Cica Soothing Cream',
    brand: 'Dr.G',
    kind: 'moisturizer',
    unit: 'pump',
    totalAmount: 70,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Crème apaisante Cica pour peaux sensibles, irritées ou à imperfections (rougeurs, boutons).',
    notes:
      'Occlusion 6.5/10. Texture crème légère. 5-Cica Complex (centella multi-formes) + niacinamide + panthenol.',
    inci: 'WATER, GLYCERIN, BUTYLENE GLYCOL, C13-16 ISOPARAFFIN, NIACINAMIDE, C12-14 ISOPARAFFIN, 1,2-HEXANEDIOL, HYDROGENATED POLYDECENE, PENTYLENE GLYCOL, VINYL DIMETHICONE, CAPRYLYL METHICONE, HYDROXYETHYL ACRYLATE/SODIUM ACRYLOYLDIMETHYL TAURATE COPOLYMER, PANTHENOL, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, DIMETHICONOL, POLYMETHYLSILSESQUIOXANE, TROMETHAMINE, DIPOTASSIUM GLYCYRRHIZATE, GLYCERYL ACRYLATE/ACRYLIC ACID COPOLYMER, ETHYLHEXYLGLYCERIN, XANTHAN GUM, DISODIUM EDTA, BETA-GLUCAN, CENTELLA ASIATICA EXTRACT, MADECASSOSIDE, PYRUS MALUS (APPLE) FRUIT EXTRACT, EPIGALLOCATECHIN GALLATE, ASIATICOSIDE, ASIATIC ACID, MADECASSIC ACID',
    url: 'https://dr-g.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS],
      secondary: [
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.EMOLLIENCE,
        TAG_SLUGS.NON_COMEDOGENE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.HYPOALLERGENIQUE,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.CENTELLA_COMPLEX,
        notes: '5-Cica Complex pour apaiser les inflammations',
      },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: 'Éclat et régulation du sébum' },
      {
        slug: INGREDIENT_SLUGS.BETA_GLUCAN,
        notes: 'Hydratation supérieure à l’acide hyaluronique',
      },
      { slug: INGREDIENT_SLUGS.PANTHENOL, notes: 'Apaisant (Vitamine B5)' },
    ],
  },
  {
    slug: 'drg-red-blemish-clear-soothing-active-essence',
    name: 'R.E.D Blemish Clear Soothing Active Essence',
    brand: 'Dr.G',
    kind: 'essence',
    unit: 'bottle',
    totalAmount: 80,
    amountUnit: 'ml',
    priceCents: 3067,
    description:
      'Essence apaisante légère pour peaux irritées et sensibles — refroidit, calme les rougeurs et renforce la barrière.',
    notes:
      "5-CICA-RX Complex + ectoin + beta-glucan + ceramide NP + squalane. Texture aqueuse à absorption rapide. Test d'irritation cutanée complété.",
    inci: 'Houttuynia Cordata Extract, Centella Asiatica Extract, Water, Propanediol, Dipropylene Glycol, Glycerin, Aloe Ferox Leaf Extract, Niacinamide, 1,2-Hexanediol, Pentylene Glycol, Ectoin, Allantoin, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Madecassoside, Butylene Glycol, Panthenol, Caprylyl Glycol, Tromethamine, Ilex Aquifolium (Holly) Leaf Extract, Disodium EDTA, Caprylic/Capric Triglyceride, Olea Europaea (Olive) Fruit Oil, Butyrospermum Parkii (Shea) Butter, Hydrogenated Lecithin, Squalane, Portulaca Oleracea Extract, Pinus Densiflora Leaf Extract, Citrus Junos Fruit Extract, Beta-Glucan, Artemisia Annua Extract, Eryngium Maritimum Extract, Achillea Millefolium Flower Extract, Ethylhexylglycerin, Cholesterol, Ceramide NP, Phytosphingosine, Asiaticoside, Asiatic Acid, Madecassic Acid',
    url: 'https://dr-g.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_ROUGEURS],
      secondary: [
        TAG_SLUGS.ESSENCE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.NON_COMEDOGENE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.HYPOALLERGENIQUE,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.CENTELLA_COMPLEX,
        notes: '5-CICA-RX Complex pour apaiser et réduire le sébum',
      },
      {
        slug: INGREDIENT_SLUGS.ECTOIN,
        notes: 'Effet refroidissant, protège des agressions externes',
      },
      { slug: INGREDIENT_SLUGS.BETA_GLUCAN, notes: 'Hydratation intense et apaisement' },
      { slug: INGREDIENT_SLUGS.PANTHENOL, notes: 'Apaisant (Vitamine B5)' },
      { slug: INGREDIENT_SLUGS.CERAMIDE_NP, notes: 'Renforce la barrière cutanée' },
      { slug: INGREDIENT_SLUGS.ALLANTOIN, notes: 'Apaisant, cicatrisant' },
    ],
  },
  {
    slug: 'drg-red-blemish-tranexamic-acid-repair-serum',
    name: 'R.E.D Blemish Tranexamic Acid 21.5 Repair Serum',
    brand: 'Dr.G',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 2319,
    description:
      "Sérum anti-taches concentré en acide tranexamique (5%), acide azélaïque (2%) et niacinamide (14,5%) pour uniformiser le teint et réduire l'hyperpigmentation.",
    notes:
      'TXA 5% + acide azélaïque 2% + niacinamide 14,5%. Texture légère non collante. Convient aux peaux à tendance acnéique.',
    inci: 'Water, Niacinamide, Propanediol, Tranexamic Acid, Glycerin, Dipropylene Glycol, Methylpropanediol, 1,2-Hexanediol, Azelaic Acid, Guanidine Carbonate, Pentylene Glycol, Butylene Glycol, Boron Nitride, Polyacrylate Crosspolymer-11, Chlorella Vulgaris Extract, Glucose, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Allantoin, Ammonium Acryloyldimethyltaurate/VP Copolymer, C12-14 Alketh-12, Fructooligosaccharides, Fructose, Sucrose Palmitate, Hydrogenated Lecithin, Tromethamine, Sodium Hyaluronate, Cetyl Hydroxyethylcellulose, Xanthan Gum, Ethylhexylglycerin, Adenosine, Macadamia Integrifolia Seed Oil, Olea Europaea (Olive) Fruit Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Vitis Vinifera (Grape) Seed Oil, Melia Azadirachta Flower Extract, Ocimum Sanctum Leaf Extract, Hydroxyethylcellulose, Saccharide Isomerate, Melia Azadirachta Leaf Extract, Curcuma Longa (Turmeric) Root Extract, Corallina Officinalis Extract, Tocopherol, Octyldodecanol, Polyglyceryl-10 Laurate, Phosphatidylcholine, Asiaticoside, Asiatic Acid, Glycolipids, Madecassic Acid, Caprylyl Glycol, Centella Asiatica Extract, Acetyl Hexapeptide-1, Pantothenic Acid',
    url: 'https://dr-g.com',
    tags: {
      primary: [TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.HYPERPIGMENTATION],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_GRASSE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.ECLAT,
        TAG_SLUGS.NON_COMEDOGENE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.HYPOALLERGENIQUE,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.TRANEXAMIC_ACID,
        notes: '5% — inhibe la mélanine, réduit les taches',
      },
      { slug: INGREDIENT_SLUGS.AZELAIC_ACID, notes: '2% — anti-inflammatoire, éclaircissant' },
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: '14,5% — unifie le teint, renforce la barrière',
      },
      { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE, notes: 'Hydratation légère' },
      {
        slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
        notes: 'Apaise les irritations post-traitement',
      },
    ],
  },
]
