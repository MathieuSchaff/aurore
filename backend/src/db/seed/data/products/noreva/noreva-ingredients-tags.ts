import { INGREDIENT_SLUGS } from '../../ingredients/ingredient-slugs'
import { NOREVA_PRODUCT_SLUGS } from './noreva'

export const INGREDIENTS_MAP: Record<string, any[]> = {
  [NOREVA_PRODUCT_SLUGS.SENSIDIANE_HUILE_DEMAQUILLANTE]: [
    {
      slug: INGREDIENT_SLUGS.NEUTRAZEN,
      notes: 'Peptide biomimétique apaisant qui limite les rougeurs.',
    },
    {
      slug: INGREDIENT_SLUGS.EVENING_PRIMROSE_OIL,
      notes: 'Riche en Oméga 6, nourrit et régénère.',
    },
  ],

  [NOREVA_PRODUCT_SLUGS.SENSIDIANE_AR_PLUS_SOIN_CONCENTRE]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 4,
      concentrationUnit: '%',
      notes: 'Propriétés hydratantes et protectrices, réduit la taille des pores.',
    },
    {
      slug: INGREDIENT_SLUGS.AZELOCALM,
      notes: 'Dérivé d’acide azélaïque, antibactérien et séborégulateur.',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Acide hyaluronique 450 kDa pour renforcer les défenses naturelles.',
    },
  ],

  [NOREVA_PRODUCT_SLUGS.ALPHA_KM_PLUS_SOIN_CORPS]: [
    {
      slug: INGREDIENT_SLUGS.AMMONIUM_LACTATE,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: 'Sel d’AHA exfoliant qui booste l’hydratation.',
    },
    {
      slug: INGREDIENT_SLUGS.GLYCOLIC_ACID,
      notes: 'AHA stimulant le renouvellement cellulaire et le collagène.',
    },
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      notes: 'Favorisent le renouvellement cellulaire.',
    },
  ],

  [NOREVA_PRODUCT_SLUGS.ALPHA_KM_PLUS_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.PHA,
      notes: 'Retient l’hydratation et booste l’acide hyaluronique naturel.',
    },
    {
      slug: INGREDIENT_SLUGS.MATRIXYL,
      notes: 'Peptide anti-âge haute tolérance.',
    },
    {
      slug: INGREDIENT_SLUGS.IRIS_EXTRACT,
      notes: 'Fortifie le derme et limite la dégradation du collagène.',
    },
  ],

  [NOREVA_PRODUCT_SLUGS.EXFOLIAC_GLOBAL_X_PRO]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 4,
      concentrationUnit: '%',
      notes: 'Réduit le sébum et renforce la barrière épidermique.',
    },
    {
      slug: INGREDIENT_SLUGS.AZECOGLYCINE,
      notes: 'Dérivé d’acide azélaïque pour une action anti-marques radicale.',
    },
    {
      slug: INGREDIENT_SLUGS.ACNESYL_X_PRO,
      notes: 'Extrait de grenade et postbiotique pour rééquilibrer le microbiote.',
    },
  ],

  [NOREVA_PRODUCT_SLUGS.TRIO_WHITE_MELA_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.VITAMIN_C,
      notes: 'Bloque l’apparition des taches et unifie le teint.',
    },
    {
      slug: INGREDIENT_SLUGS.MELABIOME_XP,
      notes: 'Stimule le pouvoir photo-protecteur du microbiote.',
    },
    {
      slug: INGREDIENT_SLUGS.RED_ALGAE,
      notes: 'Action épigénétique protégeant l’épigénome du mélanocyte.',
    },
  ],

  [NOREVA_PRODUCT_SLUGS.ACTIPUR_PEEL_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      notes: 'Action peeling-like et apaisante.',
    },
    {
      slug: INGREDIENT_SLUGS.PAPAINE,
      notes: 'Exfoliant puissant pour affiner le grain de peau.',
    },
  ],

  [NOREVA_PRODUCT_SLUGS.IKLEN_PURE_C_REVERSE_SERUM]: [
    {
      slug: INGREDIENT_SLUGS.VITAMIN_C_PURE,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: 'Action immédiate sur l’éclat et les taches.',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 3,
      concentrationUnit: '%',
      notes: 'Unifie le teint et protège du stress oxydatif.',
    },
    {
      slug: INGREDIENT_SLUGS.BUTYLRESORCINOL,
      notes: 'Dépigmentant puissant contre les irrégularités.',
    },
  ],

  [NOREVA_PRODUCT_SLUGS.PSORIANE_CREME_VISAGE]: [
    {
      slug: INGREDIENT_SLUGS.ESTER_ACIDE_MALIQUE,
      concentrationValue: 5,
      concentrationUnit: '%',
      notes:
        'Esters d’acide malique (AHA) à la composition proche du film hydrolipidique naturel. Ils exfolient en douceur pour éliminer les cellules mortes et les squames tout en stimulant le renouvellement cellulaire et l’hydratation.',
    },
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Renforce la barrière et régule l’hyperkératinisation.',
    },
    {
      slug: INGREDIENT_SLUGS.BISABOLOL,
      concentrationValue: 1,
      concentrationUnit: '%',
      notes: 'Propriétés cicatrisantes et anti-inflammatoires.',
    },
  ],

  [NOREVA_PRODUCT_SLUGS.STRIVADIANE_ANTI_VERGETURES]: [
    {
      slug: INGREDIENT_SLUGS.VITAMIN_C,
      notes: 'Stimule la production de collagène et répare l’épiderme.',
    },
    {
      slug: INGREDIENT_SLUGS.HYALURONIC_ACID,
      notes: 'Forme biomimétique pour l’élasticité.',
    },
  ],

  [NOREVA_PRODUCT_SLUGS.XERODIANE_CERA_PLUS_BAUME]: [
    {
      slug: INGREDIENT_SLUGS.CERAMIDES,
      notes: 'Céramides, lipides et phytosphingosine pour la barrière cutanée.',
    },
    {
      slug: INGREDIENT_SLUGS.AQUABIOME,
      notes: 'Prébiotique rééquilibrant le microbiote cutané.',
    },
  ],
}
