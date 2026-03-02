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
      TAG_SLUGS.SERUM,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.ECLAT,
      TAG_SLUGS.HYPOALLERGENIQUE,
    ],
    avoid: [],
  },

  // ── Gel Plume : Nettoyant/Démaquillant haute glycérine (1ère étape)
  [CYLA_PRODUCT_SLUGS.GEL_PLUME]: {
    primary: [TAG_SLUGS.DEMAQUILLANT, TAG_SLUGS.NETTOYANT, TAG_SLUGS.BARRIERE_CUTANEE],
    secondary: [
      TAG_SLUGS.HUILE, // Pour son rôle de corps gras en 1ère étape
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.APAISANT,
    ],
    avoid: [
      TAG_SLUGS.CONTOUR_YEUX, // Déconseillé pour les cils
    ],
  },

  // ── Crème Filante : Nettoyant doux pH acide (2e étape)
  [CYLA_PRODUCT_SLUGS.CREME_FILANTE]: {
    primary: [TAG_SLUGS.NETTOYANT, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.APAISANT],
    secondary: [TAG_SLUGS.SANS_PARFUM, TAG_SLUGS.PEAU_SENSIBLE, TAG_SLUGS.REPARATEUR],
    avoid: [],
  },

  // ── Crème Légère Initiale : Nutrition légère peaux mixtes/grasses
  [CYLA_PRODUCT_SLUGS.CREME_LEGERE_INITIALE]: {
    primary: [TAG_SLUGS.BIOMIMETIQUE, TAG_SLUGS.BARRIERE_CUTANEE, TAG_SLUGS.DESHYDRATATION],
    secondary: [
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.SOIN_DE_JOUR,
      TAG_SLUGS.SOIN_DE_NUIT,
      TAG_SLUGS.REPARATEUR,
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
      TAG_SLUGS.SOIN_DE_JOUR,
      TAG_SLUGS.SOIN_DE_NUIT,
      TAG_SLUGS.DESHYDRATATION,
      TAG_SLUGS.REPARATEUR,
    ],
    avoid: [TAG_SLUGS.PEAU_GRASSE, TAG_SLUGS.TEXTURE_LEGERE],
  },
}
