import { TAG_SLUGS } from '../../tags/seed-tags'
import { MAD_ABOUT_SKIN_PRODUCT_SLUGS } from './madAboutSkin'

interface ProductTagGroups {
  primary: string[] // Tags principaux (Bénéfices correctifs)
  secondary: string[] // Tags secondaires (Type de peau, Format, Texture)
  avoid: string[] // Tags à éviter/exclure
}

export const MAD_ABOUT_SKIN_PRODUCT_TAGS: Record<string, ProductTagGroups> = {
  // ── Sérum Copper Peptide
  [MAD_ABOUT_SKIN_PRODUCT_SLUGS.MAD_ABOUT_SKIN_COPPER_PEPTIDE]: {
    primary: [TAG_SLUGS.ANTI_AGE, TAG_SLUGS.REPARATEUR, TAG_SLUGS.REPULPANT],
    secondary: [
      TAG_SLUGS.SERUM,
      TAG_SLUGS.HUMECTANT,
      TAG_SLUGS.SOIN_DE_JOUR,
      TAG_SLUGS.SOIN_DE_NUIT,
      TAG_SLUGS.PEAU_NORMALE,
      TAG_SLUGS.PEAU_MIXTE,
      TAG_SLUGS.PEAU_SECHE,
      TAG_SLUGS.TEXTURE_LEGERE,
    ],
    avoid: [],
  },
}
