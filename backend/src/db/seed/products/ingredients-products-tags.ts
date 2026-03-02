import { ADERMA_INGREDIENTS_MAP } from './aDerma/aDerma-ingredients-tags'
import { ANTI_ROUGEURS_INGREDIENTS_MAP } from './anti-rougeurs/anti-rougeurs-ingredients-tags'
import { ANUA_INGREDIENTS_MAP } from './anua/anua-ingredients-tags'
import { AZ_INGREDIENTS_MAP } from './aromaZone/aromaZone-ingredients-tags'
import { AVENE_INGREDIENTS_MAP } from './avene/avene-ingredients-tags'
import { AZELAIQUE_INGREDIENTS_MAP } from './azelaique/azelaique-ingredients-tags'
import { BOJ_INGREDIENTS_MAP } from './beautyOfJoseon/beautyOfJoseon-ingredients-tags'
import { BIODERMA_INGREDIENTS_MAP } from './bioderma/bioderma-ingredients-tags'
import { COLIBRI_INGREDIENTS_MAP } from './colibri/colibri-ingredients-tags'
import { CORPS_INGREDIENTS_MAP } from './corps/corps-ingredients-tags'
import { CYLA_INGREDIENTS_MAP } from './cyla/cyla-ingredients-tags'
import { GARANCIA_INGREDIENTS_MAP } from './garancia/garancia-ingredients-tags'
import { GG_INGREDIENTS_MAP } from './geekAndGorgeous/geekAndGorgeous-ingredients-tags'
import { ISISPHARMA_INGREDIENTS_MAP } from './isispharma/isispharma-ingredients-tags'
import { KOREAN_INGREDIENTS_MAP } from './koreanSkincare/koreanSkincare-ingredients-tags'
import { LABBIARRITZ_INGREDIENTS_MAP } from './labBiarritz/labBiarritz-ingredients-tags'
import { LRP_INGREDIENTS_MAP } from './laRochePosay/laRochePosay-ingredients-tags'
import { MAD_ABOUT_SKIN_INGREDIENTS_MAP } from './madAboutSkin/madAboutSkin-ingredients-tags'
import { MEMECANCER_INGREDIENTS_MAP } from './memeCancer/memeCancer-ingredients-tags'
import { MIXA_INGREDIENTS_MAP } from './mixa/mixa-ingredients-tags'
import { SEPHORA_INGREDIENTS_MAP } from './sephora/sephora-ingredient-tags'
import { SERUMS_PEPTIDES_INGREDIENTS_MAP } from './serums-peptides/serums-peptides-ingredients-tags'
import { SKIN1004_INGREDIENTS_MAP } from './skin1004/skin1004-ingredients-tags'
import { SOLAIRES_INGREDIENTS_MAP } from './solaires/solaires-ingredients-tags'
import { SVR_INGREDIENTS_MAP } from './svr/svr-ingredients-tags'
import { TO_INGREDIENTS_MAP } from './theOrdinary/theOrdinary-ingredients-tags'
import { THERAMID_INGREDIENTS_MAP } from './theramid/theramid-ingredients-tags'
import { TONERS_INGREDIENTS_MAP } from './toners/toners-ingredients-tags'
import { URIAGE_INGREDIENTS_MAP } from './uriage/uriage-ingredients-tags'

export const ALL_PRODUCT_INGREDIENTS_MAP = {
  ...ADERMA_INGREDIENTS_MAP,
  ...ANTI_ROUGEURS_INGREDIENTS_MAP,
  ...ANUA_INGREDIENTS_MAP,
  ...AVENE_INGREDIENTS_MAP,
  ...AZELAIQUE_INGREDIENTS_MAP,
  ...AZ_INGREDIENTS_MAP,
  ...BIODERMA_INGREDIENTS_MAP,
  ...BOJ_INGREDIENTS_MAP,
  ...COLIBRI_INGREDIENTS_MAP,
  ...CORPS_INGREDIENTS_MAP,
  ...CYLA_INGREDIENTS_MAP,
  ...GARANCIA_INGREDIENTS_MAP,
  ...GG_INGREDIENTS_MAP,
  ...ISISPHARMA_INGREDIENTS_MAP,
  ...KOREAN_INGREDIENTS_MAP,
  ...LABBIARRITZ_INGREDIENTS_MAP,
  ...LRP_INGREDIENTS_MAP,
  ...MAD_ABOUT_SKIN_INGREDIENTS_MAP,
  ...MEMECANCER_INGREDIENTS_MAP,
  ...MIXA_INGREDIENTS_MAP,
  ...SERUMS_PEPTIDES_INGREDIENTS_MAP,
  ...SKIN1004_INGREDIENTS_MAP,
  ...SOLAIRES_INGREDIENTS_MAP,
  ...SVR_INGREDIENTS_MAP,
  ...THERAMID_INGREDIENTS_MAP,
  ...TONERS_INGREDIENTS_MAP,
  ...TO_INGREDIENTS_MAP,
  ...URIAGE_INGREDIENTS_MAP,
  ...SEPHORA_INGREDIENTS_MAP,
}
/**
 * Version aplatie pour le seeding de la base de données
 */
export const allIngredientProductTags = Object.entries(ALL_PRODUCT_INGREDIENTS_MAP).flatMap(
  ([productSlug, ingredients]) =>
    ingredients.map((ing: any) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.value || null,
      concentrationUnit: ing.unit || null,
      notes: ing.notes || '',
    }))
)
