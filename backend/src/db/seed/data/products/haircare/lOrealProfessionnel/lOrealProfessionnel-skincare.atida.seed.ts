import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const L_OREAL_PROFESSIONNEL_SKINCARE_ATIDA_SEED: UnifiedProductSeed[] = [
  {
    slug: 'l-oreal-professionnel-serie-expert-absolut-repair-masque',
    name: 'Serie Expert Absolut Repair Masque',
    brand: "L'Oréal Professionnel",
    kind: 'mask',
    unit: 'jar',
    totalAmount: 250,
    amountUnit: 'ml',
    priceCents: 2540,
    description: '',
    notes: '',
    inci: 'AQUA / WATER / EAU, CETEARYL ALCOHOL, BEHENTRIMONIUM CHLORIDE, CANDELILLA CERA / CANDELILLA WAX / CIRE DE CANDELILLA, AMODIMETHICONE, CETYL ESTERS, ISOPROPYL ALCOHOL, GLYCERIN, PHENOXYETHANOL, TRIDECETH-6, LINALOOL, LACTIC ACID, HEXYL CINNAMAL, CHLORHEXIDINE DIGLUCONATE, CETRIMONIUM CHLORIDE, LIMONENE, SODIUM HYDROXIDE, CHENOPODIUM QUINOA SEED EXTRACT, HYDROXYPROPYLTRIMONIUM HYDROLYZED WHEAT PROTEIN, CI 19140 / YELLOW 5, CI 15985 / YELLOW 6, PARFUM / FRAGRANCE (F.I.L, C228927/1)',
    url: 'https://www.atida.fr/l-oreal-professionnel-serie-expert-absolut-repair-masque-250ml.html',
    imageUrl:
      'https://assets.atida.com/transform/0783634a-9414-4186-a3c2-92bcd6c34df8/L-Oreal-Professionnel-Serie-Expert-Absolut-Repair-Masque-250ml?io=transform:extend,width:600,height:600',
    tags: {
      primary: ['hydratation'],
      secondary: ['masque-hebdo', 'zone-visage'],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.LACTIC_ACID }],
  },
]
