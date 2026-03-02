import { TAG_SLUGS } from '../../tags/seed-tags'
import { BOJ_PDOCUT_SLUGS } from './beautyOfJoseon'

interface ProductTagGroups {
  primary: string[] // Actions principales (Eclat, Protection, Hydratation)
  secondary: string[] // Routine, types de peau et galénique
  avoid: string[] // Contre-indications ou exclusions de texture
}

export const BOJ_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Dynasty Cream : Crème hydratante équilibrante Ginseng & Riz
  [BOJ_PDOCUT_SLUGS.BEAUTY_OF_JOSEON_DYNASTY_CREAM]: {
    primary: [TAG_SLUGS.ECLAT, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.REPULPANT],
    secondary: [
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.OCCLUSIF,
      TAG_SLUGS.SOIN_DE_JOUR,
      TAG_SLUGS.SOIN_DE_NUIT,
    ],
    avoid: [
      TAG_SLUGS.PEAU_GRASSE, // Texture riche à 6/10 d'occlusion
    ],
  },

  // ── Ginseng Essence Water : Tonique revitalisant à 80% d'eau de ginseng
  [BOJ_PDOCUT_SLUGS.BOJ_GINSENG_ESSENCE_WATER]: {
    primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.ANTI_OXYDANT, TAG_SLUGS.ECLAT],
    secondary: [
      TAG_SLUGS.TONIQUE,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.TEXTURE_LEGERE,
    ],
    avoid: [],
  },

  // ── Glow Replenishing Rice Milk : Lait de riz matifiant et lissant
  [BOJ_PDOCUT_SLUGS.BEAUTY_OF_JOSEON_GLOW_RICE_MILK]: {
    primary: [TAG_SLUGS.PORES_DILATES, TAG_SLUGS.BRILLANCE, TAG_SLUGS.MATIFIANT],
    secondary: [
      TAG_SLUGS.TONIQUE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.ASTRINGENT,
    ],
    avoid: [
      TAG_SLUGS.PEAU_SECHE, // Propriétés sébo-régulatrices/kaolin non adaptées
    ],
  },

  // ── Relief Sun Aqua-fresh : Protection solaire hydratante légère SPF50+
  [BOJ_PDOCUT_SLUGS.BOJ_RELIEF_SUN_AQUA_FRESH]: {
    primary: [TAG_SLUGS.PROTECTION_SOLAIRE, TAG_SLUGS.SOLAIRE_VISAGE, TAG_SLUGS.DESHYDRATATION],
    secondary: [
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.FILTRES_CHIMIQUES,
      TAG_SLUGS.APAISANT,
    ],
    avoid: [TAG_SLUGS.TEXTURE_RICHE],
  },
}
