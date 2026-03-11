import { TAG_SLUGS } from '../../tags/seed-tags'
import { BOJ_PDOCUT_SLUGS } from './beautyOfJoseon'

interface ProductTagGroups {
  primary: string[] // Actions principales (Éclat, Protection, Hydratation, etc.)
  secondary: string[] // Routine, types de peau, galénique, zone
  avoid: string[] // Contre-indications ou exclusions de texture / type de peau
}

export const BOJ_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Dynasty Cream : Crème hydratante équilibrante Ginseng & Riz
  [BOJ_PDOCUT_SLUGS.BEAUTY_OF_JOSEON_DYNASTY_CREAM]: {
    primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.REPULPANT],
    secondary: [
      // type de produit / galénique
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.TEXTURE_RICHE,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.OCCLUSIF,
      TAG_SLUGS.HUMECTANT,
      // types de peau
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_SENSIBLE,
      // routine
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.OCCLUSION,
      // zone
      TAG_SLUGS.ZONE_VISAGE,
      // labels
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.GROSSESSE_COMPATIBLE,
    ],
    avoid: [
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_MIXTE, // texture assez occlusive, peut être trop riche
      TAG_SLUGS.COMEDOGENE,
    ],
  },

  // ── Ginseng Essence Water : Essence/tonique hydratant à 80 % d'eau de ginseng
  [BOJ_PDOCUT_SLUGS.BOJ_GINSENG_ESSENCE_WATER]: {
    primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.ANTI_OXYDANT, TAG_SLUGS.ECLAT],
    secondary: [
      // type de produit / galénique
      TAG_SLUGS.ESSENCE,
      TAG_SLUGS.TONIQUE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.TEXTURE_LEGERE,
      // types de peau
      TAG_SLUGS.PEAU_TOUS_TYPES,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      // routine
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.PREPARATION,
      TAG_SLUGS.HYDRATATION,
      // zone
      TAG_SLUGS.ZONE_VISAGE,
      // labels
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.GROSSESSE_COMPATIBLE,
    ],
    avoid: [],
  },

  // ── Glow Replenishing Rice Milk : Lait de riz matifiant et lissant
  [BOJ_PDOCUT_SLUGS.BEAUTY_OF_JOSEON_GLOW_RICE_MILK]: {
    primary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.BRILLANCE, TAG_SLUGS.MATIFIANT],
    secondary: [
      // type de produit / galénique
      TAG_SLUGS.LOTION,
      TAG_SLUGS.TONIQUE,
      TAG_SLUGS.ASTRINGENT,
      TAG_SLUGS.SEBO_REGULATEUR,
      TAG_SLUGS.TEXTURE_LEGERE,
      // types de peau
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_SENSIBLE,
      // routine
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.PREPARATION,
      // zone
      TAG_SLUGS.ZONE_VISAGE,
      // labels
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.GROSSESSE_COMPATIBLE,
    ],
    avoid: [
      TAG_SLUGS.PEAU_SECHE, // kaolin + sébo-régulation
      TAG_SLUGS.PEAU_RUGUEUSE,
    ],
  },

  // ── Relief Sun Aqua-fresh : Protection solaire hydratante légère SPF50+
  [BOJ_PDOCUT_SLUGS.BOJ_RELIEF_SUN_AQUA_FRESH]: {
    primary: [TAG_SLUGS.CREME_SOLAIRE, TAG_SLUGS.PROTECTION_SOLAIRE, TAG_SLUGS.DESHYDRATATION],
    secondary: [
      // type de produit / galénique
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.FILTRES_CHIMIQUES,
      // types de peau
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.PEAU_SENSIBLE,
      // routine
      TAG_SLUGS.MATIN,
      // zone
      TAG_SLUGS.ZONE_VISAGE,
      // labels
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.GROSSESSE_COMPATIBLE,
    ],
    avoid: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.TEXTURE_RICHE, TAG_SLUGS.FILTRES_MINERAUX],
  },
}
