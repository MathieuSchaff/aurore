import { TAG_SLUGS } from '../../tags/seed-tags'
import { MAD_ABOUT_SKIN_PRODUCT_SLUGS } from './madAboutSkin'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Bénéfices correctifs)
  secondary: string[] // Tags secondaires (Type de peau, Format, Texture)
  avoid: string[] // Tags à éviter/exclure
}

export const MAD_ABOUT_SKIN_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Sérum Copper Peptide : Anti-âge réparateur multi-peptides
  [MAD_ABOUT_SKIN_PRODUCT_SLUGS.MAD_ABOUT_SKIN_COPPER_PEPTIDE]: {
    primary: [
      TAG_SLUGS.ANTI_AGE,
      TAG_SLUGS.REPARATEUR,
      TAG_SLUGS.REPULPANT,
      TAG_SLUGS.BARRIERE_CUTANEE,
    ],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.MATIN,
      TAG_SLUGS.SOIR,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.TEXTURE_LEGERE,
      TAG_SLUGS.SANS_PARFUM,
      TAG_SLUGS.TRAITEMENT,
      TAG_SLUGS.APAISANT,
      TAG_SLUGS.ECLAT,
    ],
    avoid: [],
  },
}
