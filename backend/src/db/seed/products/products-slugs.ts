import { ADERMA_PRODUCT_SLUGS } from './aDerma/aDerma'
import { AR_PRODUCT_SLUGS } from './anti-rougeurs/anti-rougeurs'
import { ANUA_PRODUCT_SLUGS } from './anua/anua'
import { AZ_PRODUCT_SLUGS } from './aromaZone/aromaZone'
import { AVENE_PRODUCT_SLUGS } from './avene/avene'
import { AZELAIQUE_PRODUCT_SLUGS } from './azelaique/azelaique'
import { BOJ_PDOCUT_SLUGS } from './beautyOfJoseon/beautyOfJoseon'
import { BIODERMA_PRODUCT_SLUGS } from './bioderma/bioderma'
import { COLIBRI_PRODUCT_SLUGS } from './colibri/colibri'
import { CORPS_PRODUCT_SLUGS } from './corps/corps'
import { CYLA_PRODUCT_SLUGS } from './cyla/cyla'
import { GARANCIA_PRODUCT_SLUGS } from './garancia/garancia'
import { GG_PRODUCTS_SLUGS } from './geekAndGorgeous/geekAndGorgeous'
import { ISISPHARMA_PRODUCT_SLUGS } from './isispharma/isispharma'
import { KOREAN_PRODUCT_SLUGS } from './koreanSkincare/koreanSkincare'
import { LAB_BIARRITZ_PRODUCT_SLUGS } from './labBiarritz/labBiarritz'
import { LRP_PRODUCT_SLUGS } from './laRochePosay/laRochePosay'
import { MAD_ABOUT_SKIN_PRODUCT_SLUGS } from './madAboutSkin/madAboutSkin'
import { MEME_PRODUCT_SLUGS } from './memeCancer/memeCancer'
import { MIXA_PRODUCT_SLUGS } from './mixa/mixa'
import { SEPHORA_PRODUCT_SLUGS } from './sephora/sephora'
import { SERUMS_PEPTIDES_PRODUCT_SLUGS } from './serums-peptides/serums-peptides'
import { SKIN1004_PRODUCT_SLUGS } from './skin1004/skin1004'
import { SOLAIRES_PRODUCT_SLUGS } from './solaires/solaires'
import { SVR_PRODUCT_SLUGS } from './svr/svr'
import { TO_PRODUCT_SLUGS } from './theOrdinary/theOrdinary'
// import { VICHY_PRODUCT_SLUGS } from './vichy/vichy'
import { THERAMID_PRODUCT_SLUGS } from './theramid/theramid'
import { TONERS_PRODUCT_SLUGS } from './toners/toners'
import { URIAGE_PRODUCT_SLUGS } from './uriage/uriage'
// import { PREQUEL_PRODUCT_SLUGS } from './prequel/prequel'
// import { DR_IDRISS_PRODUCT_SLUGS } from './drIdriss/drIdriss'
// import {  } from './cosrx/cosrx'
// import { CERAVE_PRODUCT_SLUGS } from './cerave/cerave'
// import { DR_SAM_PRODUCT_SLUGS } from './drSam/drSam'
// import { REMEDY_PRODUCT_SLUGS } from './remedy/remedy'

export const allProductSlugs = {
  ...ADERMA_PRODUCT_SLUGS,
  ...AR_PRODUCT_SLUGS,
  ...ANUA_PRODUCT_SLUGS,
  ...AZ_PRODUCT_SLUGS,
  ...AVENE_PRODUCT_SLUGS,
  ...AZELAIQUE_PRODUCT_SLUGS,
  ...BOJ_PDOCUT_SLUGS,
  ...BIODERMA_PRODUCT_SLUGS,
  ...COLIBRI_PRODUCT_SLUGS,
  ...CORPS_PRODUCT_SLUGS,
  ...CYLA_PRODUCT_SLUGS,
  ...GARANCIA_PRODUCT_SLUGS,
  ...GG_PRODUCTS_SLUGS,
  ...ISISPHARMA_PRODUCT_SLUGS,
  ...KOREAN_PRODUCT_SLUGS,
  ...LAB_BIARRITZ_PRODUCT_SLUGS,
  ...LRP_PRODUCT_SLUGS,
  ...MAD_ABOUT_SKIN_PRODUCT_SLUGS,
  ...MEME_PRODUCT_SLUGS,
  ...MIXA_PRODUCT_SLUGS,
  ...SEPHORA_PRODUCT_SLUGS,
  ...SERUMS_PEPTIDES_PRODUCT_SLUGS,
  ...SKIN1004_PRODUCT_SLUGS,
  ...SOLAIRES_PRODUCT_SLUGS,
  ...SVR_PRODUCT_SLUGS,
  ...TO_PRODUCT_SLUGS,
  ...TONERS_PRODUCT_SLUGS,
  ...URIAGE_PRODUCT_SLUGS,
  // ...CERAVE_PRODUCT_SLUGS,
  // ...COSRX_PRODUCT_SLUGS,
  // ...DR_IDRISS_PRODUCT_SLUGS,
  // ...DR_SAM_PRODUCT_SLUGS,
  // ...PREQUEL_PRODUCT_SLUGS,
  // ...REMEDY_PRODUCT_SLUGS,
  ...THERAMID_PRODUCT_SLUGS,
  // ...VICHY_PRODUCT_SLUGS,
} as const
