export const BRAND_NAMES = [
  'Avène',
  'La Roche-Posay',
  'La Roche Posay',
  'CeraVe',
  'cerave',
  'Bioderma',
  'Eucerin',
  'Uriage',
  'Vichy',
  'SVR',
  'Ducray',
  'A-Derma',
  'Embryolisse',
  'Filorga',
  'Noreva',
  'Isispharma',
  'ACM Laboratoire Dermatologique',
  'Topicrem',
  'Dexeryl',
  'Rogé Cavaillès',
  'Altruist',
  'Heliocare',
  'The Ordinary',
  'NIOD',
  'The Inkey List',
  "Paula's Choice",
  'Geek & Gorgeous',
  'Typology',
  'Minimalist',
  'Medik8',
  'Allies of Skin',
  'SkinBetter Science',
  'SkinCeuticals',
  'Dr Dennis Gross',
  'Perricone MD',
  'Sunday Riley',
  'Drunk Elephant',
  'Tatcha',
  'Fresh',
  'Glow Recipe',
  'Summer Fridays',
  'Youth to the People',
  'Ole Henriksen',
  'Herbivore Botanicals',
  'Farmacy',
  "Kiehl's",
  'Charlotte Tilbury',
  'Augustinus Bader',
  'La Mer',
  'Sisley',
  'Estée Lauder',
  'Clinique',
  'Shiseido',
  'Lancôme',
  'Dior',
  'Chanel',

  'COSRX',
  'Laneige',
  'Beauty of Joseon',
  'Innisfree',
  'Etude House',
  'Sulwhasoo',
  'Dr Jart+',
  'Some By Mi',
  'Missha',
  'Round Lab',
  'Pyunkang Yul',
  'Benton',
  "I'm From",
  'Isntree',
  'Banila Co',
  'Skinfood',
  'Mediheal',
  'AHC',
  'Amorepacific',
  'Holika Holika',

  'Hada Labo',
  'DHC',
  'SK-II',
  'Kose',
  'Sekkisei',
  'Curel',
  'Minon',
  'Bioré',
  'Senka',
  'Kanebo',
  'Rohto',
  'Caudalie',
  'Nuxe',
  'Weleda',
  'Dr Hauschka',
  'Pai Skincare',
  'Tata Harper',
  'REN Clean Skincare',
  'Mad Hippie',
  'Biossance',
  'Osea',
  'True Botanicals',
  'Indie Lee',

  'Neutrogena',
  'Nivea',
  'Garnier',
  'Olay',
  "L'Oréal Paris",
  'Simple',
  'Cetaphil',
  'Dove',
  'Aveeno',
  "Pond's",
  'St Ives',
  'Clean & Clear',

  'Obagi',
  'ZO Skin Health',
  'Revision Skincare',
  'EltaMD',
  'PCA Skin',
  'Dermalogica',
  'Murad',
  'iS Clinical',
  'SkinMedica',
  'Jan Marini',

  'Byoma',
  'Krave Beauty',
  'Naturium',
  'Versed',
  'Bubble Skincare',
  'Dieux Skin',
  'Rhode',
  'Fenty Skin',
  'Selfless by Hyram',
  'Peace Out Skincare',
]

type BrandConfig = {
  name: string
  searchTerms: string[]
  slugPrefix: string
}

function normalize(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function createBrandConfig(name: string): BrandConfig {
  const normalized = normalize(name)

  const slugPrefix = normalized
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_+/g, '_')

  const capitalized = normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase()

  return {
    name,
    searchTerms: [...new Set([name, normalized, normalized.toLowerCase(), capitalized])],
    slugPrefix,
  }
}

export const BRANDS_CONFIG: BrandConfig[] = Object.values(BRAND_NAMES).flat().map(createBrandConfig)
