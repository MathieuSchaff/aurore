import { INGREDIENT_SLUGS } from '../../../../data/ingredients/ingredient-slugs'
import { TAG_SLUGS } from '../../../../data/tags'
import type { UnifiedProductSeed } from '../../types'

export const ISNTREE_SEED: UnifiedProductSeed[] = [
  {
    name: 'Aloe Fresh Type Soothing Gel',
    brand: 'IsNtree',
    kind: 'body-lotion',
    unit: 'tube',
    slug: 'isntree-aloe-fresh-type-soothing-gel',
    totalAmount: 300,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Un gel apaisant ultra-frais conçu pour calmer instantanément les irritations et hydrater le corps sans fini collant.',
    notes: `Enrichi en extrait d'Aloe Vera et Panthénol, il convient parfaitement à toutes les peaux échauffées ou déshydratées.`,
    inci: '1,2-HEXANEDIOL, ALLANTOIN, ALOE BARBADENSIS LEAF EXTRACT, ARGININE, BETAINE, CARBOMER, DIPOTASSIUM GLYCYRRHIZATE, ETHYHEXYLGLYCERIN, GLYCERIN, PANTHENOL, PROPANEDIOL, SODIUM HYALURONATE',
    url: 'https://www.skinsafeproducts.com/isntree-aloe-fresh-type-soothing-gel-10-14-fl-oz-300-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/EC7A9C83DBA97C/large_1732606113.pngpng?1732606113',
    tags: {
      primary: [TAG_SLUGS.HYDRATATION, TAG_SLUGS.APAISANT, TAG_SLUGS.ZONE_CORPS],
      secondary: [TAG_SLUGS.SANS_PARFUM],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.PANTHENOL }],
  },
  {
    name: 'Moisture Soothing Gel Aloe',
    brand: 'IsNtree',
    kind: 'moisturizer',
    unit: 'tube',
    slug: 'isntree-moisture-soothing-gel-aloe',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Ce gel visage polyvalent désaltère la peau en profondeur tout en apportant une sensation de fraîcheur immédiate.',
    notes: `Contient de l'Aloe Vera, de la Centella Asiatica et de l'Acide Hyaluronique, idéal pour apaiser les peaux sensibles.`,
    inci: '1,2-HEXANEDIOL, ALLANTOIN, ALOE BARBADENSIS LEAF EXTRACT, ALOE BARBADENSIS LEAF JUICE, ARGININE, BENZYL GLYCOL, BETAINE, BUTYLENE GLYCOL, CAMELLIA SINENSIS LEAF EXTRACT, CAPRYLYL GLYCOL, CARBOMER, CENTELLA ASIATICA EXTRACT, CITRIC ACID, DIPOTASSIUM GLYCYRRHIZATE, DIPROPYLENE GLYCOL, ETHYLHEXYLGLYCERIN, FICUS CARICA (FIG) FRUIT EXTRACT, GINKGO BILOBA NUT EXTRACT, GLYCERIN, GLYCYRRHIZA GLABRA (LICORICE) ROOT EXTRACT, HYALURONIC ACID, HYDROLYZED HYALURONIC ACID, HYDROXYACETOPHENONE, HYDROXYPROPYLTRIMONIUM HYALURONATE, LUFFA CYLINDRICA FRUIT EXTRACT, METHYLPROPANEDIOL, MORUS ALBA FRUIT EXTRACT, PANTHENOL, POLYGLUTAMIC ACID, PUNICA GRANATUM FRUIT EXTRACT, RASPBERRY KETONE, SODIUM HYALURONATE, SODIUM HYALURONATE CROSSPOLYMER, TREHALOSE, WATER',
    url: 'https://www.skinsafeproducts.com/isntree-moisture-soothing-gel-aloe-5-07-fl-oz-150-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/554E1A01D479A4/large_1729183740.jpeg?1729183740',
    tags: {
      primary: [TAG_SLUGS.HYDRATATION, TAG_SLUGS.APAISANT],
      secondary: [TAG_SLUGS.PEAU_SENSIBLE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.HYALURONIC_ACID },
      { slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA },
    ],
  },
  {
    name: 'Hyaluronic Acid Moist Cream',
    brand: 'IsNtree',
    kind: 'moisturizer',
    unit: 'tube',
    slug: 'isntree-hyaluronic-acid-moist-cream',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Crème hydratante intense avec 5 types d'acide hyaluronique + huiles botaniques pour peaux sèches à mixtes.`,
    notes:
      'Occlusion 6.5/10. Texture crème légère non grasse. Équilibre huile/eau, renforce élasticité, sans parfum.',
    inci: '1,2-HEXANEDIOL, AMMONIUM ACRYLOYLDIMETHYLTAURATE/VP COPOLYMER, ARGANIA SPINOSA KERNEL OIL, AVENA SATIVA (OAT) KERNEL EXTRACT, BEHENYL ALCOHOL, BETA-GLUCAN, BETAINE, BUTYLENE GLYCOL, BUTYROSPERMUM PARKII (SHEA) BUTTER, CAMELLIA SINENSIS LEAF WATER, CAPRYLIC/CAPRIC TRIGLYCERIDE, CARTHAMUS TINCTORIUS (SAFFLOWER) SEED OIL, CETYL ALCOHOL, CYCLOHEXASILOXANE, CYNARA SCOLYMUS (ARTICHOKE) LEAF EXTRACT, DIMETHYLSILANOL, DIMETHYLSILANOL HYALURONATE, DIPROPYLENE GLYCOL, DISODIUM EDTA, ECLIPTA PROSTRATA LEAF EXTRACT, ETHYLHEXYLGLYCERIN, FRUCTOOLIGOSACCHARIDES, GLYCERETH-26, GLYCERIN, GLYCERYL CAPRYLATE, GLYCERYL STEARATE, HYALURONIC ACID, HYDROGENATED LECITHIN, HYDROGENATED POLYDECENE, HYDROLYZED HYALURONIC ACID, HYDROLYZED SODIUM HYALURONATE, HYDROXYACETOPHENONE, HYDROXYPROPYLTRIMONIUM HYALURONATE, LAMINARIA JAPONICA EXTRACT, METHYLPROPANEDIOL, PENTAERYTHRITYL DISTEARATE, PENTYLENE GLYCOL, POLYGLYCERYL-10 LAURATE, POLYGLYCERYL-3 METHYLGLUCOSE DISTEARATE, POLYQUATERNIUM-51, POTASSIUM HYALURONATE, PRUNUS ARMENIACA (APRICOT) KERNEL OIL, SODIUM ACETYLATED HYALURONATE, SODIUM HYALURONATE, SODIUM HYALURONATE CROSSPOLYMER, SODIUM HYALURONATE DIMETHYLSILANOL, SODIUM STEAROYL GLUTAMATE, VINYL DIMETHICONE, WATER',
    url: 'https://www.skinsafeproducts.com/isntree-hyaluronic-acid-moist-cream-3-38-fl-oz-100-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/337883D508C71C/large_1722847973.pngpng?1722847973',
    tags: {
      primary: [TAG_SLUGS.DESHYDRATATION],
      secondary: [
        TAG_SLUGS.CREME_HYDRATANTE,
        TAG_SLUGS.PEAU_NORMALE,
        TAG_SLUGS.PEAU_MIXTE,
        TAG_SLUGS.PEAU_SECHE,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.EMOLLIENCE,
        TAG_SLUGS.SANS_PARFUM,
        TAG_SLUGS.HYPOALLERGENIQUE,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [TAG_SLUGS.PEAU_GRASSE, TAG_SLUGS.BRILLANCE],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
        notes: '5 types de différents poids moléculaires pour une hydratation multi-couches',
      },
      { slug: INGREDIENT_SLUGS.SHEA_BUTTER, notes: 'Nourrissant et protecteur' },
      { slug: INGREDIENT_SLUGS.CERAMIDE_NP, notes: 'Restaure la barrière lipidique' },
    ],
  },
  {
    name: 'Onion Newpair Essence Toner',
    brand: 'IsNtree',
    kind: 'toner',
    unit: 'bottle',
    slug: 'isntree-onion-newpair-essence-toner',
    totalAmount: 200,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Un toner essence hautement concentré qui aide à apaiser les imperfections et à unifier le teint irrégulier.',
    notes: `Contient de l'extrait d'Oignon Rouge et de l'Acide Tranexamique, idéal pour les peaux sujettes aux taches et cicatrices.`,
    inci: '1,2-HEXANEDIOL, ADENOSINE, ALLANTOIN, ALLIUM CEPA (ONION) BULB EXTRACT, AMMONIUM POLYACRYLOYLDIMETHYL TAURATE, BETAINE, BIOSACCHARIDE GUM-1, BUTYLENE GLYCOL, CARBOMER, CITRIC ACID, COCCINIA INDICA FRUIT EXTRACT, CORALLINA OFFICINALIS EXTRACT, CURCUMA LONGA (TURMERIC) ROOT EXTRACT, DISODIUM EDTA, ETHYLHEXYLGLYCERIN, GLYCERETH-26, GLYCERIN, HOUTTUYNIA CORDATA EXTRACT, HYALURONIC ACID, HYDROLYZED HYALURONIC ACID, HYDROXY- ETHYLCELLULOSE, HYDROXYACETOPHENONE, MELIA AZADIRACHTA FLOWER EXTRACT, MELIA AZADIRACHTA LEAF EXTRACT, METHYLPROPANEDIOL, NIACINAMIDE, OCIMUM SANCTUM LEAF EXTRACT, PANTHENOL, PROPANEDIOL, SODIUM ASCORBYL PHOSPHATE, SODIUM CITRATE, SODIUM HEPARIN, SODIUM HYALURONATE, SOLANUM MELONGENA (EGGPLANT) FRUIT EXTRACT, TRANEXAMIC ACID, TROMETHAMINE, WATER',
    url: 'https://www.skinsafeproducts.com/isntree-essence-toner-onion-newpair-6-76-fl-oz-200-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/9522B8FF4B1A6E/large_1717023206.jpeg?1717023206',
    tags: {
      primary: [TAG_SLUGS.TONIQUE, TAG_SLUGS.ECLAT, TAG_SLUGS.TRAITEMENT],
      secondary: [TAG_SLUGS.SANS_PARFUM],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.TRANEXAMIC_ACID },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE },
    ],
  },
  {
    name: 'Hyaluronic Acid Low-Ph Cleansing Foam',
    brand: 'IsNtree',
    kind: 'cleanser',
    unit: 'tube',
    slug: 'isntree-hyaluronic-acid-low-ph-cleansing-foam',
    totalAmount: 150,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Un nettoyant moussant doux au pH acide qui élimine les impuretés sans perturber l'équilibre naturel de la peau.`,
    notes: `Formulé avec 8 types d'Acide Hyaluronique, il convient parfaitement aux peaux sensibles cherchant un nettoyage hydratant.`,
    inci: '1,2-HEXANEDIOL, ALANINE, ALLANTOIN, AMARANTHUS CAUDATUS SEED EXTRACT, ARGININE, ASPARTIC ACID, BETA- GLUCAN, BUTYLENE GLYCOL, CAPRYLYL/CAPRYL GLUCOSIDE, CENTELLA ASIATICA EXTRACT, CERAMIDE NP, CITRIC ACID, CYSTEINE, DECYLENE GLYCOL, DIPOTASSIUM GLYCYRRHIZATE, DISODIUM EDTA, ECLIPTA PROSTRATA LEAF EXTRACT, ETHYLHEXYLGLYCERIN, FICUS CARICA (FIG) FRUIT EXTRACT, FRUCTOOLIGOSACCHARIDES, GLUTAMIC ACID, GLYCERIN, GLYCINE, GLYCOL DISTEARATE, HISTIDINE, HYALURONIC ACID, HYDROGENATED LECITHIN, HYDROLYZED HYALURONIC ACID, HYDROLYZED SODIUM HYALURONATE, HYDROXYACETOPHENONE, HYDROXYPROPYLTRIMONIUM HYALURONATE, ISOLEUCINE, LAMINARIA JAPONICA EXTRACT, LEUCINE, LYSINE, METHIONINE, ORYZA SATIVA (RICE) BRAN EXTRACT, PANTHENOL, PENTYLENE GLYCOL, PHENYLALANINE, POLYQUATERNIUM-39, POTASSIUM COCOATE, POTASSIUM COCOYL GLYCINATE, POTASSIUM HYALURONATE, PROLINE, SERINE, SODIUM ACETYLATED HYALURONATE, SODIUM CHLORIDE, SODIUM COCOYL ISETHIONATE, SODIUM HYALURONATE, SODIUM HYALURONATE CROSSPOLYMER, SODIUM METHYL COCOYL TAURATE, THREONINE, TYROSINE, ULMUS DAVIDIANA ROOT EXTRACT, VALINE, WATER',
    url: 'https://www.skinsafeproducts.com/isntree-low-ph-cleansing-foam-hyaluronic-acid-5-07-fl-oz-150ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/624A06EAE00C19/large_1715970806.jpeg?1715970806',
    tags: {
      primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.DOUBLE_NETTOYAGE_2],
      secondary: [TAG_SLUGS.SANS_PARFUM, TAG_SLUGS.PEAU_SENSIBLE],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.HYALURONIC_ACID },
      { slug: INGREDIENT_SLUGS.CERAMIDE_NP },
    ],
  },
  {
    name: 'Chestnut AHA Clear Essence',
    brand: 'IsNtree',
    kind: 'exfoliant',
    unit: 'bottle',
    slug: 'isntree-chestnut-aha-clear-essence',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Une essence exfoliante douce qui utilise des acides de fruits pour affiner le grain de peau et resserrer les pores.',
    notes: `Contient de l'Acide Glycolique, de l'Acide Lactique et de l'extrait de Châtaigne, idéal pour les peaux ternes et mixtes.`,
    inci: '1,2-HEXANEDIOL, ALLANTOIN, ASIATIC ACID, ASIATICOSIDE, BUTYLENE GLYCOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, CASTANEA CRENATA (CHESTNUT) SHELL EXTRACT, CENTELLA ASIATICA EXTRACT, CETEARYL ALCOHOL, ETHYLHEXYLGLYCERIN, GLYCERIN, GLYCERYL CAPRYLATE, GLYCOLIC ACID, HYDROGENATED PHOSPHATIDYLCHOLINE, HYDROXYETHYLCELLULOSE, LACTIC ACID, MADECASSIC ACID, MADECASSOSIDE, PAEONIA SUFFRUTICOSA ROOT EXTRACT, PANTHENOL, PORTULACA OLERACEA EXTRACT, POTASSIUM HYDROXIDE, SODIUM HYALURONATE, SUCROSE STEARATE, WATER',
    url: 'https://www.skinsafeproducts.com/isntree-mild-exfoliant-chestnut-aha-clear-essence-3-38-fl-oz-100-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/7293F4C832B390/large_1716008764.pngpng?1716008764',
    tags: {
      primary: [TAG_SLUGS.EXFOLIANT_CHIMIQUE, TAG_SLUGS.EXFOLIATION, TAG_SLUGS.ECLAT],
      secondary: [TAG_SLUGS.SANS_PARFUM],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.GLYCOLIC_ACID },
      { slug: INGREDIENT_SLUGS.CENTELLA_ASIATICA },
    ],
  },
  {
    name: 'Yam Root Vegan Milk Cleanser',
    brand: 'IsNtree',
    kind: 'cleanser',
    unit: 'bottle',
    slug: 'isntree-yam-root-vegan-milk-cleanser',
    totalAmount: 220,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Un lait nettoyant végétalien onctueux qui dissout le maquillage et les impuretés tout en hydratant intensément.',
    notes: `À base de racine d'Igname et de complexe de lait végétal, idéal pour les peaux sèches et sensibles.`,
    inci: '1,2- HEXANEDIOL, ARACHIDYL ALCOHOL, ARACHIDYL GLUCOSIDE, AVENA SATIVA (OAT) MEAL EXTRACT, BEHENYL ALCOHOL, BUTYLENE GLYCOL, CETEARYL ALCOHOL, CITRIC ACID, COCO-GLUCOSIDE, COCOS NUCIFERA (COCONUT) FRUIT EXTRACT, DIOSCOREA JAPONICA ROOT EXTRACT, ETHYLHEXYL PALMITATE, GLUCOSE, GLYCERIN, GLYCERYL STEARATE, GLYCINE MAX (SOYBEAN) SEED EXTRACT, HELIANTHUS ANNUUS (SUNFLOWER) SEED OIL, HIBISCUS ESCULENTUS FRUIT EXTRACT, LAMINARIA JAPONICA EXTRACT, NELUMBO NUCIFERA ROOT EXTRACT, ORYZA SATIVA (RICE) EXTRACT, POLYGLYCERYL-10 MYRISTATE, PRUNUS AMYGDALUS DULCIS (SWEET ALMOND) SEED EXTRACT, SODIUM POLYACRYLATE, UNDARIA PINNATIFIDA EXTRACT, WATER, XANTHAN GUM',
    url: 'https://www.skinsafeproducts.com/isntree-vegan-milk-cleanser-yam-root-7-43-fl-oz-220-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/6167BB9946FE13/large_1715716690.jpeg?1715716690',
    tags: {
      primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.LAIT_NETTOYANT, TAG_SLUGS.DOUBLE_NETTOYAGE_2],
      secondary: [TAG_SLUGS.SANS_PARFUM],
      avoid: [],
    },
    keyIngredients: [],
  },
  {
    name: 'Onion Newpair B5 Ampoule',
    brand: 'IsNtree',
    kind: 'serum',
    unit: 'bottle',
    slug: 'isntree-onion-newpair-b5-ampoule',
    totalAmount: 50,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Un sérum concentré apaisant qui aide à réparer la barrière cutanée et à calmer les inflammations.',
    notes: `Formulé avec du Panthénol (B5) et de l'extrait d'Oignon, idéal pour les peaux sensibilisées ou sujettes aux imperfections.`,
    inci: '1,2-HEXANEDIOL, ACETYL GLUCOSAMINE, ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER, ADENOSINE, ALLANTOIN, ALLIUM CEPA (ONION) BULB EXTRACT, AMMONIUM ACRYLOYLDIMETHYLTAURATE/VP COPOLYMER, ARGININE, BETAINE, BUTYLENE GLYCOL, CAFFEINE, CAPRYLYL GLYCOL, COCCINIA INDICA FRUIT EXTRACT, DISODIUM EDTA, FERULIC ACID, HYDROLYZED HYALURONIC ACID, HYDROXYACETOPHENONE, MELIA AZADIRACHTA FLOWER EXTRACT, NIACINAMIDE, PANTHENOL, PENTYLENE GLYCOL, SODIUM ACETYLATED HYALURONATE, SODIUM HYALURONATE, TRANEXAMIC ACID, TREHALOSE, WATER',
    url: 'https://www.skinsafeproducts.com/isntree-onion-newpair-b5-ampoule-1-69-fl-oz-50-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/4FC4DF1748C434/large_1707012010.jpeg?1707012010',
    tags: {
      primary: [TAG_SLUGS.TRAITEMENT, TAG_SLUGS.ECLAT, TAG_SLUGS.APAISANT],
      secondary: [TAG_SLUGS.SANS_PARFUM],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.PANTHENOL },
      { slug: INGREDIENT_SLUGS.TRANEXAMIC_ACID },
      { slug: INGREDIENT_SLUGS.NIACINAMIDE },
    ],
  },
  {
    name: 'Hyper Retinol Ex 1.0 Serum',
    brand: 'IsNtree',
    kind: 'serum',
    unit: 'bottle',
    slug: 'isntree-hyper-retinol-ex-1-0-serum',
    totalAmount: 20,
    amountUnit: 'ml',
    priceCents: 0,
    description: `Un sérum anti-âge puissant qui combine rétinol et peptides pour réduire l'apparence des rides et améliorer la fermeté.`,
    notes:
      'Contient du Rétinol, du Bakuchiol et des Céramides pour limiter les irritations, idéal pour prévenir le vieillissement cutané.',
    inci: '1,2-HEXANEDIOL, ACETYL HEXAPEPTIDE-8, ADENOSINE, ALLANTOIN, AMMONIUM ACRYLOYLDIMETHYLTAURATE/VP COPOLYMER, ASIATIC ACID, ASIATICOSIDE, BAKUCHIOL, BETAINE, BUTYLENE GLYCOL, CAPRYLIC/CAPRIC TRIGLYCERIDE, CERAMIDE AP, CERAMIDE AS, CERAMIDE EOP, CERAMIDE NP, CERAMIDE NS, CETEARYL ALCOHOL, CHOLESTEROL, COPPER TRIPEPTIDE-1, DIBUTYL ADIPATE, DIPROPYLENE GLYCOL, DISODIUM EDTA, FERULIC ACID, GLYCERIN, HYDROGENATED LECITHIN, HYDROXYACETOPHENONE, HYDROXYPROPYL CYCLODEXTRIN, MADECASSIC ACID, NIACINAMIDE, PALMITOYL PENTAPEPTIDE-4, PALMITOYL TETRAPEPTIDE-7, PALMITOYL TRIPEPTIDE-1, PANTHENOL, PHYTOSPHINGOSINE, POLYDEXTROSE, POLYSORBATE 20, RETINOL, RETINYL PALMITATE, SODIUM STEAROYL GLUTAMATE, STEARIC ACID, TOCOPHEROL, WATER',
    url: 'https://www.skinsafeproducts.com/isntree-hyper-retinol-ex-1-0-serum-0-67-fl-oz-20-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/2D6ED742363B1E/large_1736793279.jpeg?1736793279',
    tags: {
      primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.TRAITEMENT],
      secondary: [TAG_SLUGS.SANS_PARFUM],
      avoid: [TAG_SLUGS.GROSSESSE_COMPATIBLE],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.RETINOL },
      { slug: INGREDIENT_SLUGS.BAKUCHIOL },
      { slug: INGREDIENT_SLUGS.CERAMIDE_NP },
      { slug: INGREDIENT_SLUGS.COPPER_PEPTIDES },
    ],
  },
  {
    name: 'Hyaluronic Acid Aqua Gel Cream',
    brand: 'IsNtree',
    kind: 'moisturizer',
    unit: 'jar',
    slug: 'isntree-hyaluronic-acid-aqua-gel-cream',
    totalAmount: 100,
    amountUnit: 'ml',
    priceCents: 0,
    description:
      'Un gel-crème léger qui apporte une hydratation intense longue durée sans alourdir la peau.',
    notes: `Riche en 5 types d'Acide Hyaluronique et Squalane, c'est le soin parfait pour les peaux mixtes à grasses.`,
    inci: '1,2-HEXANEDIOL, ALLANTOIN, AMMONIUM ACRYLOYLDIMETHYLTAURATE/VP COPOLYMER, BETAINE, BIOSACCHARIDE GUM-1, BUTYLENE GLYCOL, BUTYLENE GLYCOL COCOATE, CAMELLIA SINENSIS LEAF EXTRACT, CENTELLA ASIATICA EXTRACT, CETEARYL OLIVATE, CHAMOMILA RECUTITA (MATRICARIA) FLOWER EXTRACT, COCO CAPRYLATE/CAPRATE, ETHYLCELLULOSE, ETHYLHEXYLGLYCERIN, GLYCERIN, GLYCYNHIZA GLABRA (LICORICE) ROOT EXTRACT, HOUTTUYNIA CORDATA EXTRACT, HYALURONIC ACID, HYDROGENATED OLIVE OIL UNSAPONIFIABLES, HYDROLYZED HYALURONIC ACID, HYDROLYZED JOJOBA ESTERS, HYDROLYZED SODIUM HYALURONATE, ISOSTEARYL ALCOHOL, METHYLPROPANEDIOL, PENTYLENE GLYCOL, PHENYL TRIMETHICONE, POLYGONUM CUSPIDATUM ROOT EXTRACT, PORTULACA OLERACEA EXTRACT, PROPANEDIOL, ROSMARINUS OFFICINALIS (ROSEMARY) LEAF EXTRACT, SCUTELLARIA BALCALENSIS ROOT EXTRACT, SODIUM HYALURONATE, SODIUM HYALURONATE CROSSPOLYMER, SODIUM PCA, SORBITAN OLIVATE, SQUALANE, TREHALOSE, WATER, XANTHAN GUM',
    url: 'https://www.skinsafeproducts.com/isntree-hyaluronic-acid-aqua-gel-cream-3-38-fl-oz-100-ml',
    imageUrl:
      'https://cdn1.skinsafeproducts.com/photo/F65975F7A3C689/large_1640077862.pngpng?1640077862',
    tags: {
      primary: [TAG_SLUGS.HYDRATATION, TAG_SLUGS.CREME_HYDRATANTE],
      secondary: [TAG_SLUGS.SANS_PARFUM],
      avoid: [],
    },
    keyIngredients: [
      { slug: INGREDIENT_SLUGS.HYALURONIC_ACID },
      { slug: INGREDIENT_SLUGS.SQUALANE },
    ],
  },
]
