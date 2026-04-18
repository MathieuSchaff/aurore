import { TAG_SLUGS } from '../../tags/seed-tags'
import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import type { UnifiedProductSeed } from '../unified-types'

export const VT_SEED: UnifiedProductSeed[] = [
  {
    slug: 'vt-azelaic-ampoule-a1',
    name: 'Ampoule Apaisante A1',
    brand: 'VT',
    kind: 'serum',
    unit: 'bottle',
    totalAmount: 30,
    amountUnit: 'ml',
    priceCents: 1905,
    description: `Ampoule apaisante à l'acide azélaïque(20%) enrichie en exosomes de Centella Asiatica. Régule la production de sébum, calme les rougeurs et affine le grain de peau. Formule légèrement acide pour équilibrer le pH, sans fragrance artificielle.`,
    notes: 'Contient de la Cyanocobalamine (B12) et un complexe hyaluronique multi-poids (sodium hyaluronate, acide hyaluronique hydrolysé, sodium hyaluronate crosspolymer). Idéal peaux sensibles et acnéiques.',
    inci: 'WATER, PROPYLENE GLYCOL, AZELAIC ACID, TROMETHAMINE, 1,2-HEXANEDIOL, PANTHENOL, POLYGLYCERYL-10 LAURATE, ETHYLHEXYLGLYCERIN, XANTHAN GUM, CYANOCOBALAMIN, DIPOTASSIUM GLYCYRRHIZATE, LACTOBACILLUS/SOYMILK FERMENT FILTRATE, BUTYLENE GLYCOL, SODIUM HYALURONATE, XYLITYLGLUCOSIDE, ANHYDROXYLITOL, PENTYLENE GLYCOL, XYLITOL, MELALEUCA ALTERNIFOLIA (TEA TREE) LEAF EXTRACT, HYDROXYPROPYLTRIMONIUM HYALURONATE, HOUTTUYNIA CORDATA EXTRACT, CENTELLA ASIATICA EXTRACT, TOCOPHEROL, MADECASSOSIDE, HYDROLYZED HYALURONIC ACID, SODIUM ACETYLATED HYALURONATE, DEXTRIN, HYALURONIC ACID, ASIATICOSIDE, HYDROLYZED SODIUM HYALURONATE, SODIUM HYALURONATE CROSSPOLYMER, POTASSIUM HYALURONATE',
    url:"https://www.yesstyle.com/fr/tcuc.EUR/coc.FR/info.html/pid.1134366027?utm_source=GoogleAds&utm_campaign=1432964344&utm_term=&utm_content=61606046332_275208218560&utm_medium=Shopping&bac=J1ZE5O8M&mcg=paidsearch&gad_source=1&gad_campaignid=1432964344&gbraid=0AAAAAD3WTkkpBonIFgUbA8-3YKJlF8y5y&gclid=CjwKCAjw14zPBhAuEiwAP3-EbzJlAPZVo5iM0gstmvB2prSvmF_kdNYixKnrGJBW3-z7OCS3EAPsCBoCbO0QAvD_BwE",
    tags: {
      primary: [TAG_SLUGS.ANTI_ACNE, TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.ANTI_ROUGEURS],
      secondary: [
        TAG_SLUGS.AMPOULE,
        TAG_SLUGS.PEAU_REACTIVE,
        TAG_SLUGS.CICATRISATION,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.TRAITEMENT,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.AZELAIC_ACID,
        concentrationValue: 20,
        concentrationUnit: "%",
        notes: 'Régule la production de sébum, calme rougeurs, affine le grain de peau.',},
      {
        slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA,
        notes: `Extrait de Cica sous forme d'exosomes nanoscopiques. Soin apaisant intense et réparateur.`,},
      {
        slug: INGREDIENT_SLUGS.MADECASSOSIDE,
        notes: 'Triterpène de Centella. Anti-inflammatoire puissant et réparateur de la barrière cutanée.',},
      {
        slug: INGREDIENT_SLUGS.ASIATICOSIDE,
        notes: 'Triterpène de Centella. Stimule la synthèse de collagène et apaise les irritations.',},
      {
        slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE,
        notes: 'Complexe hyaluronique multi-poids (4 formes) pour hydratation profonde et surfacique.',},
      { slug: INGREDIENT_SLUGS.PANTHENOL, notes: 'Provitamine B5. Hydratante, cicatrisante et apaisante.',},
      {
        slug: INGREDIENT_SLUGS.CYANOCOBALAMIN,
        notes: 'Vitamine B12. Apaise les rougeurs et régule la mélanogenèse.',},
      {
        slug: INGREDIENT_SLUGS.TEA_TREE,
        notes: `Antibactérien naturel. Renforce l'action anti-acné de l'acide azélaïque.`,},
    ],
  },
]
