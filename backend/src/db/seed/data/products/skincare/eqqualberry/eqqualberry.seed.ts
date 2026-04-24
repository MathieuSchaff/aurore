import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const EQQUALBERRY_SEED: UnifiedProductSeed[] = [
  {
    slug: 'eqqualberry-swimming-pool-daily-facial-toner',
    name: 'Swimming Pool Daily Facial Toner',
    brand: 'EQQUALBERRY',
    kind: 'toner',
    unit: 'pump',
    totalAmount: 300,
    amountUnit: 'ml',
    priceCents: 1517,
    description:
      'Tonique quotidien hypoallergénique exfolie doucement (protéase), hydrate (8 HA), apaise avec 5 baies antioxydantes.',
    notes:
      'EWG green, sans alcool/parabènes/benzène. Texture légère, tous types (idéal sensible/texturée).',
    inci: 'WATER, BUTYLENE GLYCOL, GLYCERIN, PROPANEDIOL, 1,2-HEXANEDIOL, PROTEASE, BETAINE, PANTHENOL, XANTHAN GUM, ALLANTOIN, EUTERPE OLERACEA FRUIT EXTRACT, SODIUM HYALURONATE, BETA-GLUCAN, RUBUS FRUTICOSUS (BLACKBERRY) FRUIT, VACCINIUM MACROCARPON (CRANBERRY) FRUIT, VACCINIUM ANGUSTIFOLIUM (BLUEBERRY) FRUIT, RUBUS IDAEUS (RASPBERRY) FRUIT EXTRACT, SAMBUCUS NIGRA FRUIT EXTRACT, PENTYLENE GLYCOL, CAPRYLYL GLYCOL, FRUCTAN, STYRENE/VP COPOLYMER',
    url: 'https://eqqualberryglobal.com',
    tags: {
      primary: [TAG_SLUGS.EXFOLIATION, TAG_SLUGS.PORES_DILATES],
      secondary: [
        TAG_SLUGS.TONIQUE,
        TAG_SLUGS.HYPOALLERGENIQUE,
        TAG_SLUGS.PEAU_TOUS_TYPES,
        TAG_SLUGS.PREPARATION,
        TAG_SLUGS.TEXTURE_LEGERE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.PROTEASE,
        notes: 'Enzyme protéase — exfoliation douce sans irritation (alternative AHA/BHA)',
      },
      { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE, notes: '8 formes HA — hydratation profonde' },
      { slug: INGREDIENT_SLUGS.PANTHENOL },
      { slug: INGREDIENT_SLUGS.ALLANTOIN },
      { slug: INGREDIENT_SLUGS.BETA_GLUCAN },
    ],
  },
  {
    slug: 'eqqualberry-vitamin-illuminating-serum',
    name: 'Vitamin Illuminating Serum',
    brand: 'EQQUALBERRY',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1560,
    description:
      'Sérum illuminateur à la vitamine C (acérola), niacinamide et arbutine pour unifier, estomper les taches et raviver l’éclat sans irriter.',
    notes:
      'Système de contrôle de la mélanine en 3 étapes. Contient 5 céramides et 8 poids moléculaires d’acide hyaluronique pour renforcer la barrière cutanée.',
    inci: 'Malpighia Glabra (Acerola) Fruit Water, Water, Butylene Glycol, Glycerin, Cetyl Ethylhexanoate, Niacinamide, 1,2-Hexanediol, Arbutin, Hydrogenated Lecithin, Pentaerythrityl Tetrabehenate, Diethoxyethyl Succinate, Betaine, Ceramide NP, Hydroxyethyl Urea, Caprylic/Capric Triglyceride, Melia Azadirachta Leaf Extract, Cetearyl Alcohol, Squalane, Melia Azadirachta Flower Extract, Panthenol, Curcuma Longa (Turmeric) Root Extract, Tocopherol, Carbomer, Butyrospermum Parkii (Shea) Butter, Tromethamine, Xanthan Gum, Allantoin, Ethylhexylglycerin, 2,3-Butanediol, Adenosine, Ocimum Sanctum Leaf Extract, Disodium Edta, Sodium Hyaluronate, Sodium Carboxymethyl Beta-Glucan, Corallina Officinalis Extract, Malpighia Glabra (Acerola) Fruit Extract, Glyceryl Stearate, Hydrolyzed Hyaluronic Acid, Hydrolyzed Sodium Hyaluronate, Hyaluronic Acid, Hydroxypropyltrimonium Hyaluronate, Potassium Hyaluronate, Rubus Fruticosus (Blackberry) Fruit Extract, Vaccinium Macrocarpon (Cranberry) Fruit Extract, Vaccinium Angustifolium (Blueberry) Fruit Extract, Rubus Idaeus (Raspberry) Fruit Extract, Sambucus Nigra Fruit Extract, Ceramide NS, Ceramide AS, Ceramide AP, Cholesterol, Ferulic Acid, Glutathione, Tranexamic Acid, 3-O-Ethyl Ascorbic Acid, Pentylene Glycol, Sodium Hyaluronate Crosspolymer, Sodium Acetylated Hyaluronate, Ceramide EOP',
    url: 'https://eqqualberryglobal.com',
    tags: {
      primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.ANTI_TACHES, TAG_SLUGS.TEINT_TERNE],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
        TAG_SLUGS.HYDRATATION,
        TAG_SLUGS.ANTI_OXYDANT,
        TAG_SLUGS.PEAU_SENSIBLE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.VITAMINE_C,
        notes: '40% eau d’acérola + acide 3-O-éthyl ascorbique',
      },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE },
      { slug: INGREDIENT_SLUGS.ALPHA_ARBUTIN },
      { slug: INGREDIENT_SLUGS.HYALURONIC_ACID, notes: '8 poids moléculaires' },
      { slug: INGREDIENT_SLUGS.CERAMIDES, notes: 'Complexe de 5 céramides' },
    ],
  },
]
