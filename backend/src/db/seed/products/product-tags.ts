// 1. Imports des PRODUCT_TAGS de chaque marque/catégorie
import { ADERMA_PRODUCT_TAGS } from './aDerma/aDerma-product-tags'
import { AR_PRODUCT_TAGS } from './anti-rougeurs/anti-rougeurs-product-tags'
import { ANUA_PRODUCT_TAGS } from './anua/anua-product-tags'
import { AZ_PRODUCT_TAGS } from './aromaZone/aromaZone-product-tags'
import { AVENE_PRODUCT_TAGS } from './avene/avene-product-tags'
import { AZELAIQUE_PRODUCT_TAGS } from './azelaique/azelaique-product-tags'
import { BOJ_PRODUCT_TAGS } from './beautyOfJoseon/beautyOfJoseon-product-tags'
import { BIODERMA_PRODUCT_TAGS } from './bioderma/bioderma-product-tags'
// import { CERAVE_PRODUCT_TAGS } from './cerave/cerave-product-tags'
import { COLIBRI_PRODUCT_TAGS } from './colibri/colibri-product-tags'
import { CORPS_PRODUCT_TAGS } from './corps/corps-product-tags'
// import { COSRX_PRODUCT_TAGS } from './cosrx/cosrx-product-tags'
import { CYLA_PRODUCT_TAGS } from './cyla/cyla-product-tags'
// import { DR_IDRISS_PRODUCT_TAGS } from './drIdriss/drIdriss-product-tags'
// import { DR_SAM_PRODUCT_TAGS } from './drSam/drSam-product-tags'
import { GARANCIA_PRODUCT_TAGS } from './garancia/garancia-product-tags'
import { GG_PRODUCT_TAGS } from './geekAndGorgeous/geekAndGorgeous-product-tags'
import { ISISPHARMA_PRODUCT_TAGS } from './isispharma/isispharma-product-tags'
import { KOREAN_PRODUCT_TAGS } from './koreanSkincare/koreanSkincare-product-tags'
import { LAB_BIARRITZ_PRODUCT_TAGS } from './labBiarritz/labBiarritz-product-tags'
import { LRP_PRODUCT_TAGS } from './laRochePosay/laRochePosay-product-tags'
import { MAD_ABOUT_SKIN_PRODUCT_TAGS } from './madAboutSkin/madAboutSkin-product-tags'
import { MEME_PRODUCT_TAGS } from './memeCancer/memeCancer-product-tags'
import { MIXA_PRODUCT_TAGS } from './mixa/mixa-product-tags'
// import { PREQUEL_PRODUCT_TAGS } from './prequel/prequel-product-tags'
// import { REMEDY_PRODUCT_TAGS } from './remedy/remedy-product-tags'
import { SEPHORA_PRODUCT_TAGS } from './sephora/sephora-product-tags'
import { PEPTIDES_PRODUCT_TAGS } from './serums-peptides/serums-peptides-product-tags'
import { SKIN1004_PRODUCT_TAGS } from './skin1004/skin1004-product-tags'
import { SOLAIRES_PRODUCT_TAGS } from './solaires/solaires-product-tags'
import { SVR_PRODUCT_TAGS } from './svr/svr-product-tags'
import { TO_PRODUCT_TAGS } from './theOrdinary/theOrdinary-product-tags'
import { THERAMID_PRODUCT_TAGS } from './theramid/theramid-product-tags'
import { TONERS_PRODUCT_TAGS } from './toners/toners-product-tags'
import { URIAGE_PRODUCT_TAGS } from './uriage/uriage-product-tags'

// import { VICHY_PRODUCT_TAGS } from './vichy/vichy-product-tags'

interface ProductTagGroups {
  primary: string[]
  secondary: string[]
  avoid: string[]
}

type AllProductTags = Record<string, ProductTagGroups>

// 2. Exportation de la liste complète des PRODUCT_TAGS
export const allProductTagsMap: AllProductTags = {
  ...ADERMA_PRODUCT_TAGS,
  ...ANUA_PRODUCT_TAGS,
  ...AZ_PRODUCT_TAGS,
  ...AVENE_PRODUCT_TAGS,
  ...AZELAIQUE_PRODUCT_TAGS,
  ...BOJ_PRODUCT_TAGS,
  ...BIODERMA_PRODUCT_TAGS,
  ...COLIBRI_PRODUCT_TAGS,
  ...CORPS_PRODUCT_TAGS,
  ...CYLA_PRODUCT_TAGS,
  ...GARANCIA_PRODUCT_TAGS,
  ...GG_PRODUCT_TAGS,
  ...ISISPHARMA_PRODUCT_TAGS,
  ...KOREAN_PRODUCT_TAGS,
  ...LAB_BIARRITZ_PRODUCT_TAGS,
  ...LRP_PRODUCT_TAGS,
  ...MEME_PRODUCT_TAGS,
  ...MIXA_PRODUCT_TAGS,
  ...SEPHORA_PRODUCT_TAGS,
  ...PEPTIDES_PRODUCT_TAGS,
  ...SKIN1004_PRODUCT_TAGS,
  ...SVR_PRODUCT_TAGS,
  ...TO_PRODUCT_TAGS,
  ...TONERS_PRODUCT_TAGS,
  ...URIAGE_PRODUCT_TAGS,
  ...THERAMID_PRODUCT_TAGS,
  // ...DR_IDRISS_PRODUCT_TAGS,
  // ...CERAVE_PRODUCT_TAGS,
  // ...COSRX_PRODUCT_TAGS,
  ...AR_PRODUCT_TAGS,
  // ...DR_SAM_PRODUCT_TAGS,
  // ...PREQUEL_PRODUCT_TAGS,
  ...SOLAIRES_PRODUCT_TAGS,
  // ...VICHY_PRODUCT_TAGS,
  ...MAD_ABOUT_SKIN_PRODUCT_TAGS,
  // ...REMEDY_PRODUCT_TAGS,
} as const
