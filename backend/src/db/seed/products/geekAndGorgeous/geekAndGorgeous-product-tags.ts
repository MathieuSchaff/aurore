import { TAG_SLUGS } from '../../tags/seed-tags'
import { GG_PRODUCTS_SLUGS } from './geekAndGorgeous'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Actions ciblées)
  secondary: string[] // Tags secondaires (Types de peau, labels, routine)
  avoid: string[] // Tags à exclure/contre-indications
}

export const GG_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Power Peptides Serum : Focus fermeté et boost collagène
  [GG_PRODUCTS_SLUGS.GEEK_GORGEOUS_POWER_PEPTIDES]: {
    primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.REPULPANT, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.ECLAT],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.APAISANT,
    ],
    avoid: [],
  },

  // ── A-Game 20 : Rétinal haute puissance (0.2%)
  [GG_PRODUCTS_SLUGS.GG_A_GAME_20]: {
    primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.ECLAT, TAG_SLUGS.PORES_DILATES, TAG_SLUGS.POST_ACNE],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.SOIN_DE_NUIT,
    ],
    avoid: [
      TAG_SLUGS.GROSSESSE_COMPATIBLE, // Les rétinoïdes sont contre-indiqués
      TAG_SLUGS.PEAU_REACTIVE, // Concentration trop élevée pour peaux novices/réactives
      TAG_SLUGS.ECZEMA,
    ],
  },

  // ── Hydration Station : Hydratation légère et barrière cutanée
  [GG_PRODUCTS_SLUGS.GG_HYDRATION_STATION]: {
    primary: [TAG_SLUGS.DESHYDRATATION, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.PREBIOTIQUE],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.VEGAN,
    ],
    avoid: [
      TAG_SLUGS.PEAU_SECHE, // Texture gel-crème souvent insuffisante pour peaux très sèches
      TAG_SLUGS.TEXTURE_RICHE,
    ],
  },
}
