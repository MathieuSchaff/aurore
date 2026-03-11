import { TAG_SLUGS } from '../../tags/seed-tags'
import { CYLA_PRODUCT_SLUGS } from './cyla'

interface ProductTagGroups {
  primary: string[] // Actions biomimétiques et cibles principales
  secondary: string[] // Routine, types de peau et attributs
  avoid: string[] // Contre-indications ou exclusions de texture
}

export const CYLA_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Essence Initiale : Concentré NMF biomimétique à 15%
  [CYLA_PRODUCT_SLUGS.ESSENCE_INITIALE]: {
    primary: [
      TAG_SLUGS.BIOMIMETIQUE,
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.HUMECTANT,
    ],
    secondary: [
      TAG_SLUGS.ESSENCE,
      TAG_SLUGS.PREPARATION,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_TOUS_TYPES,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.ECLAT,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ── Gel Plume : Nettoyant/Démaquillant haute glycérine (1ère étape)
  [CYLA_PRODUCT_SLUGS.GEL_PLUME]: {
    primary: [
      TAG_SLUGS.HUILE_DEMAQUILLANTE,
      TAG_SLUGS.DOUBLE_NETTOYAGE_1,
      TAG_SLUGS.BARRIERE_CUTANEE,
    ],
    secondary: [
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_TOUS_TYPES,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [
      TAG_SLUGS.ZONE_YEUX, // Déconseillé pour les cils
    ],
  },

  // ── Crème Filante : Nettoyant doux pH acide (2e étape)
  [CYLA_PRODUCT_SLUGS.CREME_FILANTE]: {
    primary: [
      TAG_SLUGS.GEL_NETTOYANT,
      TAG_SLUGS.DOUBLE_NETTOYAGE_2,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.APAISANT,
    ],
    secondary: [
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.SANS_SAVON,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.PEAU_TOUS_TYPES,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [],
  },

  // ── Crème Légère Initiale : Nutrition légère peaux mixtes/grasses
  [CYLA_PRODUCT_SLUGS.CREME_LEGERE_INITIALE]: {
    primary: [TAG_SLUGS.BIOMIMETIQUE, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.DESHYDRATATION],
    secondary: [
      TAG_SLUGS.GEL_CREME,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [TAG_SLUGS.PEAU_SECHE, TAG_SLUGS.TEXTURE_RICHE],
  },

  // ── Crème Intense Initiale : Nutrition riche peaux sèches
  [CYLA_PRODUCT_SLUGS.CREME_INTENSE_INITIALE]: {
    primary: [TAG_SLUGS.BIOMIMETIQUE, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.REPULPANT],
    secondary: [
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.TEXTURE_RICHE,
      TAG_SLUGS.EMOLLIENT,
      TAG_SLUGS.OCCLUSIF,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.EMOLLIENCE,
      TAG_SLUGS.OCCLUSION,
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.ZONE_VISAGE,
    ],
    avoid: [TAG_SLUGS.PEAU_GRASSE, TAG_SLUGS.PEAU_MIXTE, TAG_SLUGS.TEXTURE_LEGERE],
  },
}
