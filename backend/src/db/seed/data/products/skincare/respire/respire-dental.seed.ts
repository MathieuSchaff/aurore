import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'

export const RESPIRE_DENTAL_SEED: UnifiedProductSeed[] = [
  {
    slug: 'respire-dentifrice-soin-complet',
    name: 'Dentifrice Soin Complet',
    brand: 'Respire',
    kind: 'toothpaste',
    unit: 'tube',
    totalAmount: 75,
    amountUnit: 'ml',
    priceCents: 699,
    description:
      "RESPIRE DENTIFRICE SOIN COMPLET 75ML, un dentifrice innovant qui prend soin de votre bouche tout en vous offrant une fraîcheur durable, est en vente en ligne sur le site de votre parapharmacie à prix discount.\n\nLe dentifrice RESPIRE est élaboré par une marque engagée pour une hygiène bucco-dentaire naturelle et respectueuse de l'environnement. Ce soin complet est formulé avec des ingrédients soigneusement sélectionnés, qui contribuent à un nettoyage efficace tout en préservant l'émail des dents. Sa texture agréable et son goût frais font de chaque brossage un véritable moment de plaisir, vous laissant une sensation de propreté et de confort. En intégrant ce dentifrice dans votre routine quotidienne, vous bénéficierez d'une haleine fraîche et d'un sourire éclatant. \n\nDécouvrez le plaisir d'une bouche saine et d'une sensation de bien-être au quotidien grâce à RESPIRE.",
    notes: '',
    inci: 'GLYCERIN, AQUA, SORBITOL, HYDRATED SILICA, SODIUM COCOYL ISETHIONATE, AROMA, LAURYL GLUCOSIDE, HYDROXYAPATITE, CARRAGEENAN, SODIUM BICARBONATE, BETULA ALBA LEAF EXTRACT, XANTHAN GUM, STEVIA REBAUDIANA EXTRACT, POTASSIUM SORBATE, SORBIC ACID',
    url: 'https://www.pharmashopdiscount.com/fr/beaute/respire/respire-dentifrice-soin-complet-75ml.html',
    imageUrl: '',
    tags: {
      primary: ['dentifrice'],
      secondary: [],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.SORBITOL_DENTAL },
      { slug: INGREDIENT_SLUGS.HYDRATED_SILICA },
      { slug: INGREDIENT_SLUGS.SODIUM_COCOYL_ISETHIONATE },
      { slug: INGREDIENT_SLUGS.HYDROXYAPATITE },
      { slug: INGREDIENT_SLUGS.CARRAGEENAN_DENTAL },
      { slug: INGREDIENT_SLUGS.SODIUM_BICARBONATE_DENTAL },
    ],
  },
]
