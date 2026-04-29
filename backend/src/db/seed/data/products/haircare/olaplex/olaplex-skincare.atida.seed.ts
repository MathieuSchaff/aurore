import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const OLAPLEX_SKINCARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'olaplex-masque-hydratant-4-en-1',
    name: 'Masque Hydratant 4 En 1',
    brand: 'Olaplex',
    kind: 'mask',
    unit: 'jar',
    totalAmount: 370,
    amountUnit: 'ml',
    priceCents: 5999,
    description: '',
    notes: '',
    inci: 'WATER (AQUA/EAU), DIMETHICONE, CETYL ALCOHOL, PERSEA GRATISSIMA (AVOCADO) OIL, GLYCERIN, STEARYL ALCOHOL, ETHYLHEXYL OLIVATE, BEHENTRIMONIUM CHLORIDE, CETRIMONIUM BROMIDE, LIMNANTHES ALBA (MEADOWFOAM) SEED OIL, ORYZA SALIVA (RICE) BRAN OIL, QUATERNIURN-80, SODIUM HYALURONATE, SODIUM PCA, CERAMIDE AP, CERAMIDE NP, BIS-AMINOPROPYL DIGLYCOL DIMALEATE, CANNABIS SALIVA (HEMP) SEED OIL, ROSA GANINA (ROSE HIP) SEED EXTRACT, HYDROLYZED JOJOBA ESTERS, ARGININE, JOJOBA ESTERS, PANTHENOL, SQUALANE, CARTHAMUS TINCTORIUS (SAFFLOWER) SEED OIL, GLYCINE, ALANINE, SERINE, VALINE, LSOLEUCINE, PRALINE, THREONINE, GUAR HYDROXYPROPYLTRIMONIUM CHLORIDE, HISTIDINE, HYDROXYETHYLCELLULOSE, PHENYLALANINE, ASPARTIC ACID, PCA, PHOSPHATIDYLCHOLINE, CITRIC ACID, SODIUM LACTATE, ETHYLHEXYLGLYCERIN, SODIUM BENZOATE, PHENOXYETHANOL, BIS-CETEARYL AMODIMETHICONE, PROPYLENE GLYCOL, LSOPROPYL ALCOHOL, SODIUM NITRATE, TOCOPHEROL, FRAGRANCE (PARFUM), CITRAL, HEXYL CINNAMAL, LIMONENE',
    url: 'https://www.atida.fr/olaplex-masque-reparateur-4en1-370ml.html',
    imageUrl:
      'https://assets.atida.com/transform/617b1e3a-070f-40d7-807a-147092f528da/Olaplex-Masque-Hydratant-4-en-1-370ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['barriere-cutanee', 'hydratation', 'apaisant'],
      secondary: ['emollience', 'reparateur', 'texture-legere', 'masque-hebdo', 'zone-visage'],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.AVOCADO_OIL },
      { slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE },
      { slug: INGREDIENT_SLUGS.SODIUM_PCA },
      { slug: INGREDIENT_SLUGS.CERAMIDE_AP },
      { slug: INGREDIENT_SLUGS.CERAMIDE_NP },
      { slug: INGREDIENT_SLUGS.ARGININE },
      { slug: INGREDIENT_SLUGS.PANTHENOL },
      { slug: INGREDIENT_SLUGS.SQUALANE },
    ],
  },
]
