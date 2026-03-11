import { TAG_SLUGS } from '../../tags/seed-tags'
import { AR_PRODUCT_SLUGS } from './anti-rougeurs'

interface ProductTagGroups {
  primary: string[] // Tags principaux / problématiques ciblées
  secondary: string[] // Bénéfices, textures, propriétés, labels forts
  avoid: string[] // Tags à exclure explicitement pour ce produit
}

export const AR_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ────────────────────────────────────────────────────────────────
  // Noreva Sensidiane AR+  (soin d'attaque – pigments verts + céramides)
  // ────────────────────────────────────────────────────────────────
  [AR_PRODUCT_SLUGS.NOREVA_SENSIDIANE]: {
    primary: [
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.ROSACEE,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.FLUSHS,
    ],
    secondary: [
      TAG_SLUGS.PIGMENTS_VERTS,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.REPARATEUR, // céramides AP/NS/EOP + NP
      TAG_SLUGS.HUMECTANT, // glycérine + HA
      TAG_SLUGS.NON_COMEDOGENE, // profil global assez safe
    ],
    avoid: [
      TAG_SLUGS.PEAU_SECHE, // texture plutôt légère → peut manquer de confort sur peau très sèche
      TAG_SLUGS.TEXTURE_RICHE,
      TAG_SLUGS.OCCLUSIF,
      TAG_SLUGS.PEAU_GRASSE, // même si léger, pigments + niacinamide peuvent être limite pour peaux très grasses
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // ACM Rosakalm Crème anti-rougeurs  (pigments verts + extraits végétaux)
  // ────────────────────────────────────────────────────────────────
  [AR_PRODUCT_SLUGS.ACM_ROSAKALM]: {
    primary: [
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.COUPEROSE,
      TAG_SLUGS.FLUSHS,
      TAG_SLUGS.PEAU_SENSIBLE,
    ],
    secondary: [
      TAG_SLUGS.PIGMENTS_VERTS,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.TEXTURE_RICHE, // huiles de jojoba + sésame en haut d'INCI
      TAG_SLUGS.BIO_NATUREL, // très fort en extraits végétaux
      TAG_SLUGS.HUMECTANT, // glycérine + HA
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.ANTI_OXYDANT, // thé vert, argousier, olive...
    ],
    avoid: [
      TAG_SLUGS.PEAU_GRASSE, // huiles végétales + texture riche
      TAG_SLUGS.SANS_PARFUM, // contient parfum (fin d'INCI mais présent)
      TAG_SLUGS.NON_COMEDOGENE, // profil potentiellement comédogène (huiles + cire)
      TAG_SLUGS.TEXTURE_LEGERE,
    ],
  },

  // ────────────────────────────────────────────────────────────────
  // Eucerin Anti-Rougeurs Soin Apaisant  (formule ultra-minimaliste)
  // ────────────────────────────────────────────────────────────────
  [AR_PRODUCT_SLUGS.EUCERIN_AR]: {
    primary: [
      TAG_SLUGS.ANTI_ROUGEURS,
      TAG_SLUGS.PEAU_REACTIVE,
      TAG_SLUGS.FLUSHS,
      TAG_SLUGS.PEAU_SENSIBLE,
      TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
    ],
    secondary: [
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.HYPOALLERGENIQUE,
      TAG_SLUGS.NON_COMEDOGENE,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.BARRIERE_CUTANEE,
      TAG_SLUGS.REPARATEUR, // panthenol + beurre de karité
      TAG_SLUGS.HUMECTANT, // glycérine + panthenol
      TAG_SLUGS.CREME_HYDRATANTE,
      TAG_SLUGS.TEXTURE_RICHE, // karité + corps gras marqués
    ],
    avoid: [
      TAG_SLUGS.PEAU_GRASSE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.MATIFIANT,
      TAG_SLUGS.PEAU_MIXTE, // trop nourrissant pour la plupart des mixtes
      TAG_SLUGS.PIGMENTS_VERTS, // pas de correction couleur
    ],
  },
}
