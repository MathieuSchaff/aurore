import type { ProductCategory } from '@habit-tracker/shared'
import { PRODUCT_KINDS } from '@habit-tracker/shared'

import type { Ingredient, ProductTagGroups, UnifiedProductSeed } from './types'

const kindToCategory: Record<string, ProductCategory> = Object.fromEntries(
  (Object.entries(PRODUCT_KINDS) as [ProductCategory, Record<string, string>][]).flatMap(
    ([cat, kinds]) => Object.values(kinds).map((k) => [k, cat])
  )
)

import { ARTHRODONT_ATIDA_SEED } from './dental/arthrodont/arthrodont.atida.seed'
// ── Dental imports ────────────────────────────────────────────────────────────
import { ARTHRODONT_SEED } from './dental/arthrodont/arthrodont.seed'
import { BAUSCH___LOMB_SEED } from './dental/bauschLomb/bauschLomb.seed'
import { BIOGAIA_SEED } from './dental/biogaia/biogaia.seed'
import { BOTOT_ATIDA_SEED } from './dental/botot/botot.atida.seed'
import { BOTOT_SEED } from './dental/botot/botot.seed'
import { CB12_ATIDA_SEED } from './dental/cb12/cb12.atida.seed'
import { CB12_SEED } from './dental/cb12/cb12.seed'
import { CRINEX_SEED } from './dental/crinex/crinex.seed'
import { DENTAL_CARE_PRODUCTS_SEED } from './dental/dentalCareProducts/dentalCareProducts.seed'
import { ELGYDIUM_ATIDA_SEED } from './dental/elgydium/elgydium.atida.seed'
import { ELGYDIUM_SEED } from './dental/elgydium/elgydium.seed'
import { ELGYDIUM_SKINCARE_ATIDA_SEED } from './dental/elgydium/elgydium-skincare.atida.seed'
import { ELMEX_ATIDA_SEED } from './dental/elmex/elmex.atida.seed'
import { ELMEX_PHARMASHOP_SEED } from './dental/elmex/elmex.pharmashop.seed'
import { ELMEX_SEED } from './dental/elmex/elmex.seed'
import { ELMEX_SOLAIRE_PHARMASHOP_SEED } from './dental/elmex/elmex-solaire.pharmashop.seed'
import { FLUOCARIL_ATIDA_SEED } from './dental/fluocaril/fluocaril.atida.seed'
import { FLUOCARIL_SEED } from './dental/fluocaril/fluocaril.seed'
import { GUM_ATIDA_SEED } from './dental/gum/gum.atida.seed'
import { GUM_SEED } from './dental/gum/gum.seed'
import { HYALUGEL_ATIDA_SEED } from './dental/hyalugel/hyalugel.atida.seed'
import { HYALUGEL_SEED } from './dental/hyalugel/hyalugel.seed'
import { INAVA_SEED } from './dental/inava/inava.seed'
import { LA_ROS_E_SEED as LA_ROSEE_DENTAL_SEED } from './dental/laRosee/laRosee.seed'
import { MEDIDENT_SEED } from './dental/medident/medident.seed'
import { MERIDOL_ATIDA_SEED } from './dental/meridol/meridol.atida.seed'
import { M_RIDOL_SEED } from './dental/meridol/meridol.seed'
import { ORAL_B_SEED } from './dental/oralB/oralB.seed'
import { PARODONTAX_ATIDA_SEED } from './dental/parodontax/parodontax.atida.seed'
import { PARODONTAX_SEED } from './dental/parodontax/parodontax.seed'
import { PAROGENCYL_ATIDA_SEED } from './dental/parogencyl/parogencyl.atida.seed'
import { PAROGENCYL_SEED } from './dental/parogencyl/parogencyl.seed'
import { POLIDENT_SEED } from './dental/polident/polident.seed'
import { RICQLES_SEED } from './dental/ricqles/ricqles.seed'
import { SANOGYL_PHARMASHOP_SEED } from './dental/sanogyl/sanogyl.pharmashop.seed'
import { SANT__SILICE_SEED } from './dental/santeSilice/santeSilice.seed'
import { SENSODYNE_ATIDA_SEED } from './dental/sensodyne/sensodyne.atida.seed'
import { SENSODYNE_SEED } from './dental/sensodyne/sensodyne.seed'
import { TEPE_SEED } from './dental/tepe/tepe.seed'
import { WATERPIK_SEED } from './dental/waterpik/waterpik.seed'
// ── Haircare imports ──────────────────────────────────────────────────────────
import { ARGILETZ_SEED } from './haircare/argiletz/argiletz.seed'
import { ARKOPHARMA_ATIDA_SEED } from './haircare/arkopharma/arkopharma.atida.seed'
import { ARKOPHARMA_SEED } from './haircare/arkopharma/arkopharma.seed'
import { BAILLEUL_SEED } from './haircare/bailleul/bailleul.seed'
import { BEAUTERRA_SEED } from './haircare/beauterra/beauterra.seed'
import { BIOCYTE_SEED } from './haircare/biocyte/biocyte.seed'
import { BIOKAP_ATIDA_SEED } from './haircare/biokap/biokap.atida.seed'
import { BIOKAP_SEED } from './haircare/biokap/biokap.seed'
import { BIORENE_SEED } from './haircare/biorene/biorene.seed'
import { CATTIER_ATIDA_SEED } from './haircare/cattier/cattier.atida.seed'
import { CATTIER_SEED } from './haircare/cattier/cattier.seed'
import { CAUDALIE_SEED } from './haircare/caudalie/caudalie.seed'
import { CINQ_SUR_CINQ_SEED } from './haircare/cinqSurCinq/cinqSurCinq.seed'
import { CLARIFICATION_SEED } from './haircare/clarification/clarification.seed'
import { COSLYS_ATIDA_SEED } from './haircare/coslys/coslys.atida.seed'
import { COSLYS_SEED } from './haircare/coslys/coslys.seed'
import { CUT_BY_FRED_SEED } from './haircare/cutByFred/cutByFred.seed'
import { CUT_BY_FRED_SKINCARE_ATIDA_SEED } from './haircare/cutByFred/cutByFred-skincare.atida.seed'
import { DERMACLAY_SEED } from './haircare/dermaclay/dermaclay.seed'
import { DR_THEISS_ATIDA_SEED } from './haircare/drTheiss/drTheiss.atida.seed'
import { DR_THEISS_SEED } from './haircare/drTheiss/drTheiss.seed'
import { DUCRAY_HAIRCARE_SEED } from './haircare/ducray/ducray.seed'
import { ESSENCE_SEED } from './haircare/essence/essence.seed'
import { EYE_CARE_ATIDA_SEED } from './haircare/eyeCare/eyeCare.atida.seed'
import { EYE_CARE_SEED } from './haircare/eyeCare/eyeCare.seed'
import { FLORAME_SEED } from './haircare/florame/florame.seed'
import { FLORAME_BODYCARE_ATIDA_SEED } from './haircare/florame/florame-bodycare.atida.seed'
import { HERBATINT_SEED } from './haircare/herbatint/herbatint.seed'
import { ITEM_ATIDA_SEED } from './haircare/item/item.atida.seed'
import { ITEM_SEED } from './haircare/item/item.seed'
import { JALDES_SEED } from './haircare/jaldes/jaldes.seed'
import { KERANOVE_ATIDA_SEED } from './haircare/keranove/keranove.atida.seed'
import { K_RANOVE_SEED } from './haircare/keranove/keranove.seed'
import { KLORANE_ATIDA_SEED } from './haircare/klorane/klorane.atida.seed'
import { KLORANE_SEED } from './haircare/klorane/klorane.seed'
import { KLORANE_BODYCARE_ATIDA_SEED } from './haircare/klorane/klorane-bodycare.atida.seed'
import { KLORANE_SKINCARE_ATIDA_SEED } from './haircare/klorane/klorane-skincare.atida.seed'
import { KLORANE_SOLAIRE_ATIDA_SEED } from './haircare/klorane/klorane-solaire.atida.seed'
import { LA_ROS_E_SEED as LA_ROSEE_HAIRCARE_SEED } from './haircare/laRosee/laRosee.seed'
import { LAZARTIGUE_ATIDA_SEED } from './haircare/lazartigue/lazartigue.atida.seed'
import { LAZARTIGUE_SEED } from './haircare/lazartigue/lazartigue.seed'
import { LED_NOREVA_ATIDA_SEED } from './haircare/ledNoreva/ledNoreva.atida.seed'
import { LED_NOREVA_SEED } from './haircare/ledNoreva/ledNoreva.seed'
import { LED_NOREVA_SKINCARE_ATIDA_SEED } from './haircare/ledNoreva/ledNoreva-skincare.atida.seed'
import { LES_3_CH_NES_SEED } from './haircare/les3Chenes/les3Chenes.seed'
import { LES_SECRETS_DE_LOLY_ATIDA_SEED } from './haircare/lesSecretsDeLoly/lesSecretsDeLoly.atida.seed'
import { LES_SECRETS_DE_LOLY_PHARMASHOP_SEED } from './haircare/lesSecretsDeLoly/lesSecretsDeLoly.pharmashop.seed'
import { LES_SECRETS_DE_LOLY_SEED } from './haircare/lesSecretsDeLoly/lesSecretsDeLoly.seed'
import { LES_SECRETS_DE_LOLY_BODYCARE_PHARMASHOP_SEED } from './haircare/lesSecretsDeLoly/lesSecretsDeLoly-bodycare.pharmashop.seed'
import { LES_SECRETS_DE_LOLY_SKINCARE_ATIDA_SEED } from './haircare/lesSecretsDeLoly/lesSecretsDeLoly-skincare.atida.seed'
import { LES_SECRETS_DE_LOLY_SKINCARE_PHARMASHOP_SEED } from './haircare/lesSecretsDeLoly/lesSecretsDeLoly-skincare.pharmashop.seed'
import { LES_SECRETS_DE_LOLY_SOLAIRE_PHARMASHOP_SEED } from './haircare/lesSecretsDeLoly/lesSecretsDeLoly-solaire.pharmashop.seed'
import { L_OREAL_PROFESSIONNEL_ATIDA_SEED } from './haircare/lOrealProfessionnel/lOrealProfessionnel.atida.seed'
import { L_OR_AL_PROFESSIONNEL_SEED } from './haircare/lOrealProfessionnel/lOrealProfessionnel.seed'
import { L_OREAL_PROFESSIONNEL_SKINCARE_ATIDA_SEED } from './haircare/lOrealProfessionnel/lOrealProfessionnel-skincare.atida.seed'
import { LUXEOL_ATIDA_SEED } from './haircare/luxeol/luxeol.atida.seed'
import { LUX_OL_SEED } from './haircare/luxeol/luxeol.seed'
import { MELVITA_ATIDA_SEED } from './haircare/melvita/melvita.atida.seed'
import { MELVITA_SEED } from './haircare/melvita/melvita.seed'
import { MKL_GREEN_NATURE_SEED } from './haircare/mklGreenNature/mklGreenNature.seed'
import { NATESSANCE_ATIDA_SEED } from './haircare/natessance/natessance.atida.seed'
import { NATESSANCE_SEED } from './haircare/natessance/natessance.seed'
import { NEUTRADERM_SEED } from './haircare/neutraderm/neutraderm.seed'
import { NEUTROGENA_ATIDA_SEED } from './haircare/neutrogena/neutrogena.atida.seed'
import { NEUTROGENA_SEED } from './haircare/neutrogena/neutrogena.seed'
import { NUXE_SEED } from './haircare/nuxe/nuxe.seed'
import { OLAPLEX_ATIDA_SEED } from './haircare/olaplex/olaplex.atida.seed'
import { OLAPLEX_SEED } from './haircare/olaplex/olaplex.seed'
import { OLAPLEX_SKINCARE_ATIDA_SEED } from './haircare/olaplex/olaplex-skincare.atida.seed'
import { PETROLE_HAHN_SEED } from './haircare/petroleHahn/petroleHahn.seed'
import { PETROLE_HAHN_SKINCARE_ATIDA_SEED } from './haircare/petroleHahn/petroleHahn-skincare.atida.seed'
import { PHYTO_SEED } from './haircare/phyto/phyto.seed'
import { PHYTO_SOLAIRE_ATIDA_SEED } from './haircare/phyto/phyto-solaire.atida.seed'
import { POUXIT_SEED } from './haircare/pouxit/pouxit.seed'
import { POUXIT_SKINCARE_ATIDA_SEED } from './haircare/pouxit/pouxit-skincare.atida.seed'
import { PRANAROM_SEED } from './haircare/pranarom/pranarom.seed'
import { PURESSENTIEL_SEED } from './haircare/puressentiel/puressentiel.seed'
import { REDKEN_ATIDA_SEED } from './haircare/redken/redken.atida.seed'
import { REDKEN_SEED } from './haircare/redken/redken.seed'
import { REDKEN_SKINCARE_ATIDA_SEED } from './haircare/redken/redken-skincare.atida.seed'
import { RENE_FURTERER_ATIDA_SEED } from './haircare/reneFurterer/reneFurterer.atida.seed'
import { RENE_FURTERER_SEED } from './haircare/reneFurterer/reneFurterer.seed'
import { RENE_FURTERER_SKINCARE_ATIDA_SEED } from './haircare/reneFurterer/reneFurterer-skincare.atida.seed'
import { SANOFLORE_SEED } from './haircare/sanoflore/sanoflore.seed'
import { SEBAMED_PHARMASHOP_SEED } from './haircare/sebamed/sebamed.pharmashop.seed'
import { SOW__SEED } from './haircare/sowe/sowe.seed'
import { STIEFEL_ATIDA_SEED } from './haircare/stiefel/stiefel.atida.seed'
import { STIEFEL_SEED } from './haircare/stiefel/stiefel.seed'
import { TOPPIK_SEED } from './haircare/toppik/toppik.seed'
import { WELLA_PROFESSIONALS_SEED } from './haircare/wellaProfessionals/wellaProfessionals.seed'
import { WELLA_PROFESSIONALS_SKINCARE_ATIDA_SEED } from './haircare/wellaProfessionals/wellaProfessionals-skincare.atida.seed'
// ── Brand imports ─────────────────────────────────────────────────────────────
import { ABIB_SEED } from './skincare/abib/abib.seed'
import { ACM_PHARMASHOP_SEED } from './skincare/acm/acm.pharmashop.seed'
import { ACM_SEED } from './skincare/acm/acm.seed'
import { ACM_HAIRCARE_PHARMASHOP_SEED } from './skincare/acm/acm-haircare.pharmashop.seed'
import { A_DERMA_ATIDA_SEED } from './skincare/aDerma/aDerma.atida.seed'
// ── Imported candidates (bulk via scripts/import-candidates.ts) ──────────────
import { A_DERMA_PHARMASHOP_SEED } from './skincare/aDerma/aDerma.pharmashop.seed'
import { ADERMA_SEED } from './skincare/aDerma/aDerma.seed'
import { AESTURA_SEED } from './skincare/aestura/aestura.seed'
import { ALLIES_OF_SKIN_SEED } from './skincare/alliesOfSkin/alliesOfSkin.seed'
import { AMLACTIN_SEED } from './skincare/amlactin/amlactin.seed'
import { ANUA_SEED } from './skincare/anua/anua.seed'
import { AROMA_ZONE_SEED } from './skincare/aromaZone/aromaZone.seed'
import { AVENE_ATIDA_SEED } from './skincare/avene/avene.atida.seed'
import { AVENE_PHARMASHOP_SEED } from './skincare/avene/avene.pharmashop.seed'
import { AVENE_SEED } from './skincare/avene/avene.seed'
import { AVRIL_PHARMASHOP_SEED } from './skincare/avril/avril.pharmashop.seed'
import { AVRIL_DENTAL_PHARMASHOP_SEED } from './skincare/avril/avril-dental.pharmashop.seed'
import { AVRIL_HAIRCARE_PHARMASHOP_SEED } from './skincare/avril/avril-haircare.pharmashop.seed'
import { AZELAIQUE_SEED } from './skincare/azelaique/azelaique.seed'
import { BEAUTERRA_ATIDA_SEED } from './skincare/beauterra/beauterra.atida.seed'
import { BEAUTERRA_HAIRCARE_ATIDA_SEED } from './skincare/beauterra/beauterra-haircare.atida.seed'
import { BEAUTY_OF_JOSEON_SEED } from './skincare/beautyOfJoseon/beautyOfJoseon.seed'
import { BIODERMA_ATIDA_SEED } from './skincare/bioderma/bioderma.atida.seed'
import { BIODERMA_SEED } from './skincare/bioderma/bioderma.seed'
import { BIODERMA_HAIRCARE_ATIDA_SEED } from './skincare/bioderma/bioderma-haircare.atida.seed'
import { BIOLANE_ATIDA_SEED } from './skincare/biolane/biolane.atida.seed'
import { BYOMA_SEED } from './skincare/byoma/byoma.seed'
import { CAUDALIE_ATIDA_SEED } from './skincare/caudalie/caudalie.atida.seed'
import { CENTIFOLIA_ATIDA_SEED } from './skincare/centifolia/centifolia.atida.seed'
import { CERAVE_ATIDA_SEED } from './skincare/cerave/cerave.atida.seed'
import { CERAVE_SEED } from './skincare/cerave/cerave.seed'
import { CICABIAFINE_PHARMASHOP_SEED } from './skincare/cicabiafine/cicabiafine.pharmashop.seed'
import { CLARIFICATION_ATIDA_SEED } from './skincare/clarification/clarification.atida.seed'
import { CLARINS_PHARMASHOP_SEED } from './skincare/clarins/clarins.pharmashop.seed'
import { CLINIQUE_PHARMASHOP_SEED } from './skincare/clinique/clinique.pharmashop.seed'
import { COLIBRI_SEED } from './skincare/colibri/colibri.seed'
import { COSRX_SEED } from './skincare/cosrx/cosrx.seed'
import { CYLA_SEED } from './skincare/cyla/cyla.seed'
import { DERMACEUTIC_PHARMASHOP_SEED } from './skincare/dermaceutic/dermaceutic.pharmashop.seed'
import { DERMACEUTIC_SEED } from './skincare/dermaceutic/dermaceutic.seed'
import { DERMALOGICA_SEED } from './skincare/dermalogica/dermalogica.seed'
import { DERMASENS_ATIDA_SEED } from './skincare/dermasens/dermasens.atida.seed'
import { DERMEDEN_SEED } from './skincare/dermeden/dermeden.seed'
import { DEXERYL_ATIDA_SEED } from './skincare/dexeryl/dexeryl.atida.seed'
import { DIEUX_SEED } from './skincare/dieux/dieux.seed'
import { DR_G_SEED } from './skincare/dr-g/dr-g.seed'
import { DR_JART_PHARMASHOP_SEED } from './skincare/dr-jart/dr-jart.pharmashop.seed'
import { DR_JART_SEED } from './skincare/dr-jart/dr-jart.seed'
import { DR_ALTHEA_SEED } from './skincare/drAlthea/drAlthea.seed'
import { DR_IDRISS_SEED } from './skincare/drIdriss/drIdriss.seed'
import { DUCRAY_ATIDA_SEED } from './skincare/ducray/ducray.atida.seed'
import { DUCRAY_SEED } from './skincare/ducray/ducray.seed'
import { DUCRAY_HAIRCARE_ATIDA_SEED } from './skincare/ducray/ducray-haircare.atida.seed'
import { DUCRAY_HAIRCARE_PHARMASHOP_SEED } from './skincare/ducray/ducray-haircare.pharmashop.seed'
import { EAU_THERMALE_JONZAC_ATIDA_SEED } from './skincare/eauThermaleJonzac/eauThermaleJonzac.atida.seed'
import { EMBRYOLISSE_ATIDA_SEED } from './skincare/embryolisse/embryolisse.atida.seed'
import { EQQUALBERRY_SEED } from './skincare/eqqualberry/eqqualberry.seed'
import { ERBORIAN_PHARMASHOP_SEED } from './skincare/erborian/erborian.pharmashop.seed'
import { ETUDE_HOUSE_SEED } from './skincare/etude-house/etude-house.seed'
import { EUCERIN_ATIDA_SEED } from './skincare/eucerin/eucerin.atida.seed'
import { EUCERIN_PHARMASHOP_SEED } from './skincare/eucerin/eucerin.pharmashop.seed'
import { EUCERIN_SEED } from './skincare/eucerin/eucerin.seed'
import { EUCERIN_HAIRCARE_ATIDA_SEED } from './skincare/eucerin/eucerin-haircare.atida.seed'
import { EUCERIN_HAIRCARE_PHARMASHOP_SEED } from './skincare/eucerin/eucerin-haircare.pharmashop.seed'
import { FILORGA_SEED } from './skincare/filorga/filorga.seed'
import { GABRIEL_COUZIAN_ATIDA_SEED } from './skincare/gabrielCouzian/gabrielCouzian.atida.seed'
import { GARANCIA_ATIDA_SEED } from './skincare/garancia/garancia.atida.seed'
import { GARANCIA_SEED } from './skincare/garancia/garancia.seed'
import { GEEK_AND_GORGEOUS_SEED } from './skincare/geekAndGorgeous/geekAndGorgeous.seed'
import { HARUHARU_SEED } from './skincare/haruharu/haruharu.seed'
import { IM_FROM_SEED } from './skincare/im-from/im-from.seed'
import { INNISFREE_SEED } from './skincare/innisfree/innisfree.seed'
import { ISDIN_ATIDA_SEED } from './skincare/isdin/isdin.atida.seed'
import { ISDIN_SEED } from './skincare/isdin/isdin.seed'
import { ISDIN_HAIRCARE_ATIDA_SEED } from './skincare/isdin/isdin-haircare.atida.seed'
import { ISISPHARMA_ATIDA_SEED } from './skincare/isispharma/isispharma.atida.seed'
import { ISISPHARMA_SEED } from './skincare/isispharma/isispharma.seed'
import { ISISPHARMA_HAIRCARE_ATIDA_SEED } from './skincare/isispharma/isispharma-haircare.atida.seed'
import { ISNTREE_SEED } from './skincare/isntree/isntree.seed'
import { IUNIK_SEED } from './skincare/iunik/iunik.seed'
import { KREME_PHARMASHOP_SEED } from './skincare/kreme/kreme.pharmashop.seed'
import { LAB_BIARRITZ_PHARMASHOP_SEED } from './skincare/labBiarritz/labBiarritz.pharmashop.seed'
import { LAB_BIARRITZ_SEED } from './skincare/labBiarritz/labBiarritz.seed'
import { LA_ROCHE_POSAY_ATIDA_SEED } from './skincare/laRochePosay/laRochePosay.atida.seed'
import { LA_ROCHE_POSAY_PHARMASHOP_SEED } from './skincare/laRochePosay/laRochePosay.pharmashop.seed'
import { LA_ROCHE_POSAY_SEED } from './skincare/laRochePosay/laRochePosay.seed'
import { LA_ROCHE_POSAY_HAIRCARE_ATIDA_SEED } from './skincare/laRochePosay/laRochePosay-haircare.atida.seed'
import { LA_ROCHE_POSAY_HAIRCARE_PHARMASHOP_SEED } from './skincare/laRochePosay/laRochePosay-haircare.pharmashop.seed'
import { LA_ROSEE_ATIDA_SEED } from './skincare/laRosee/laRosee.atida.seed'
import { LA_ROSEE_PHARMASHOP_SEED } from './skincare/laRosee/laRosee.pharmashop.seed'
import { LA_ROSEE_DENTAL_ATIDA_SEED } from './skincare/laRosee/laRosee-dental.atida.seed'
import { LA_ROSEE_DENTAL_PHARMASHOP_SEED } from './skincare/laRosee/laRosee-dental.pharmashop.seed'
import { LA_ROSEE_HAIRCARE_PHARMASHOP_SEED } from './skincare/laRosee/laRosee-haircare.pharmashop.seed'
import { LE_COMPTOIR_DU_BAIN_ATIDA_SEED } from './skincare/leComptoirDuBain/leComptoirDuBain.atida.seed'
import { LIERAC_PHARMASHOP_SEED } from './skincare/lierac/lierac.pharmashop.seed'
import { MAD_ABOUT_SKIN_SEED } from './skincare/madAboutSkin/madAboutSkin.seed'
import { MEDICUBE_SEED } from './skincare/medicube/medicube.seed'
import { MEDIK8_SEED } from './skincare/medik8/medik8.seed'
import { MEME_CANCER_SEED } from './skincare/memeCancer/memeCancer.seed'
import { MISSHA_SEED } from './skincare/missha/missha.seed'
import { MIXA_SEED } from './skincare/mixa/mixa.seed'
import { MIXSOON_SEED } from './skincare/mixsoon/mixsoon.seed'
import { MKL_GREEN_NATURE_ATIDA_SEED } from './skincare/mklGreenNature/mklGreenNature.atida.seed'
import { MKL_GREEN_NATURE_HAIRCARE_ATIDA_SEED } from './skincare/mklGreenNature/mklGreenNature-haircare.atida.seed'
import { MUSC_INTIME_ATIDA_SEED } from './skincare/muscIntime/muscIntime.atida.seed'
import { MUSTELA_PHARMASHOP_SEED } from './skincare/mustela/mustela.pharmashop.seed'
import { MUSTELA_HAIRCARE_PHARMASHOP_SEED } from './skincare/mustela/mustela-haircare.pharmashop.seed'
import { NEUTRADERM_PHARMASHOP_SEED } from './skincare/neutraderm/neutraderm.pharmashop.seed'
import { NEUTRADERM_HAIRCARE_ATIDA_SEED } from './skincare/neutraderm/neutraderm-haircare.atida.seed'
import { NEUTRADERM_HAIRCARE_PHARMASHOP_SEED } from './skincare/neutraderm/neutraderm-haircare.pharmashop.seed'
import { NINE_LESS_SEED } from './skincare/nineLess/nineLess.seed'
import { NIOD_SEED } from './skincare/niod/niod.seed'
import { NOOANCE_SEED } from './skincare/nooance/nooance.seed'
import { NOREVA_SEED } from './skincare/noreva/noreva.seed'
import { NOVEXPERT_PHARMASHOP_SEED } from './skincare/novexpert/novexpert.pharmashop.seed'
import { NUMBUZIN_SEED } from './skincare/numbuzin/numbuzin.seed'
import { NUXE_ATIDA_SEED } from './skincare/nuxe/nuxe.atida.seed'
import { NUXE_HAIRCARE_ATIDA_SEED } from './skincare/nuxe/nuxe-haircare.atida.seed'
import { OCCITANE_SEED } from './skincare/occitane/occitane.seed'
import { PAI_SEED } from './skincare/pai/pai.seed'
import { PATYKA_PHARMASHOP_SEED } from './skincare/patyka/patyka.pharmashop.seed'
import { PAULAS_CHOICE_SEED } from './skincare/paulasChoice/paulasChoice.seed'
import { PREQUEL_SEED } from './skincare/prequel/prequel.seed'
import { PUR_ALOE_ATIDA_SEED } from './skincare/purAloe/purAloe.atida.seed'
import { PURITO_SEED } from './skincare/purito/purito.seed'
import { REMEDY_SEED } from './skincare/remedy/remedy.seed'
import { RESPIRE_PHARMASHOP_SEED } from './skincare/respire/respire.pharmashop.seed'
import { RESPIRE_DENTAL_PHARMASHOP_SEED } from './skincare/respire/respire-dental.pharmashop.seed'
import { RESPIRE_HAIRCARE_PHARMASHOP_SEED } from './skincare/respire/respire-haircare.pharmashop.seed'
import { RIEMANN_SEED } from './skincare/riemann/riemann.seed'
import { ROGE_CAVAILLES_ATIDA_SEED } from './skincare/rogeCavailles/rogeCavailles.atida.seed'
import { ROUND_LAB_SEED } from './skincare/roundlab/roundlab.seed'
import { SAUGELLA_ATIDA_SEED } from './skincare/saugella/saugella.atida.seed'
import { SEPHORA_SEED } from './skincare/sephora/sephora.seed'
import { SHISEIDO_SEED } from './skincare/shiseido/shiseido.seed'
import { SK_II_SEED } from './skincare/skII/skII.seed'
import { SKIN1004_SEED } from './skincare/skin1004/skin1004.seed'
import { SKINCEUTICALS_SEED } from './skincare/skinCeuticals/skinCeuticals.seed'
import { SOL_DE_JANEIRO_SEED } from './skincare/sol-de-janeiro/sol-de-janeiro.seed'
import { SOME_BY_MI_SEED } from './skincare/somebymi/somebymi.seed'
import { SULWHASOO_SEED } from './skincare/sulwhasoo/sulwhasoo.seed'
import { SVR_ATIDA_SEED } from './skincare/svr/svr.atida.seed'
import { SVR_PHARMASHOP_SEED } from './skincare/svr/svr.pharmashop.seed'
import { SVR_SEED } from './skincare/svr/svr.seed'
import { THE_INKEY_LIST_SEED } from './skincare/theInkeyList/theInkeyList.seed'
import { THE_ORDINARY_SEED } from './skincare/theOrdinary/theOrdinary.seed'
import { THERAMID_SEED } from './skincare/theramid/theramid.seed'
import { TIRTIR_SEED } from './skincare/tirtir/tirtir.seed'
import { TOPICREM_ATIDA_SEED } from './skincare/topicrem/topicrem.atida.seed'
import { TOPICREM_SEED } from './skincare/topicrem/topicrem.seed'
import { TORRIDEN_SEED } from './skincare/torriden/torriden.seed'
import { TYPOLOGY_SEED } from './skincare/typology/typology.seed'
import { URIAGE_ATIDA_SEED } from './skincare/uriage/uriage.atida.seed'
import { URIAGE_SEED } from './skincare/uriage/uriage.seed'
import { URIAGE_HAIRCARE_ATIDA_SEED } from './skincare/uriage/uriage-haircare.atida.seed'
import { VICHY_LABORATORIES_PHARMASHOP_SEED } from './skincare/vichy-laboratories/vichy-laboratories.pharmashop.seed'
import { VICHY_LABORATORIES_SEED } from './skincare/vichy-laboratories/vichy-laboratories.seed'
import { VICHY_LABORATORIES_HAIRCARE_ATIDA_SEED } from './skincare/vichy-laboratories/vichy-laboratories-haircare.atida.seed'
import { VICHY_LABORATORIES_HAIRCARE_PHARMASHOP_SEED } from './skincare/vichy-laboratories/vichy-laboratories-haircare.pharmashop.seed'
import { VICHY_HOMME_ATIDA_SEED } from './skincare/vichyHomme/vichyHomme.atida.seed'
import { VT_SEED } from './skincare/vt/vt.seed'
import { WELEDA_SEED } from './skincare/weleda/weleda.seed'
import { WELEDA_DENTAL_ATIDA_SEED } from './skincare/weleda/weleda-dental.atida.seed'
import { WELEDA_HAIRCARE_ATIDA_SEED } from './skincare/weleda/weleda-haircare.atida.seed'

// ── Aggregation ───────────────────────────────────────────────────────────────

const allUnified: UnifiedProductSeed[] = [
  ...ABIB_SEED,
  ...ANUA_SEED,
  ...ADERMA_SEED,
  ...BIODERMA_SEED,
  ...AESTURA_SEED,
  ...TORRIDEN_SEED,
  ...PURITO_SEED,
  ...PAI_SEED,
  ...DIEUX_SEED,
  ...INNISFREE_SEED,
  ...DR_ALTHEA_SEED,
  ...DR_JART_SEED,
  ...DERMALOGICA_SEED,
  ...DERMACEUTIC_SEED,
  ...ISNTREE_SEED,
  ...MEDICUBE_SEED,
  ...NUMBUZIN_SEED,
  ...ETUDE_HOUSE_SEED,
  ...HARUHARU_SEED,
  ...DUCRAY_SEED,
  ...SK_II_SEED,
  ...ROUND_LAB_SEED,
  ...MIXSOON_SEED,
  ...PREQUEL_SEED,
  ...SULWHASOO_SEED,
  ...SOME_BY_MI_SEED,
  ...SOL_DE_JANEIRO_SEED,
  ...MEDIK8_SEED,
  ...REMEDY_SEED,
  ...COSRX_SEED,
  ...DR_G_SEED,
  ...NOREVA_SEED,
  ...ACM_SEED,
  ...EUCERIN_SEED,
  ...IM_FROM_SEED,
  ...EQQUALBERRY_SEED,
  ...THE_ORDINARY_SEED,
  ...NIOD_SEED,
  ...NOOANCE_SEED,
  ...SEPHORA_SEED,
  ...MIXA_SEED,
  ...MEME_CANCER_SEED,
  ...AROMA_ZONE_SEED,
  ...CERAVE_SEED,
  ...AMLACTIN_SEED,
  ...PAULAS_CHOICE_SEED,
  ...BYOMA_SEED,
  ...TOPICREM_SEED,
  ...SKINCEUTICALS_SEED,
  ...THE_INKEY_LIST_SEED,
  ...ISDIN_SEED,
  ...DR_IDRISS_SEED,
  ...GARANCIA_SEED,
  ...GEEK_AND_GORGEOUS_SEED,
  ...FILORGA_SEED,
  ...URIAGE_SEED,
  ...RIEMANN_SEED,
  ...THERAMID_SEED,
  ...AZELAIQUE_SEED,
  ...NINE_LESS_SEED,
  ...ALLIES_OF_SKIN_SEED,
  ...TYPOLOGY_SEED,
  ...TIRTIR_SEED,
  ...VT_SEED,
  ...AVENE_SEED,
  ...BEAUTY_OF_JOSEON_SEED,
  ...COLIBRI_SEED,
  ...CYLA_SEED,
  ...ISISPHARMA_SEED,
  ...MAD_ABOUT_SKIN_SEED,
  ...LAB_BIARRITZ_SEED,
  ...LA_ROCHE_POSAY_SEED,
  ...DERMEDEN_SEED,
  ...OCCITANE_SEED,
  ...SVR_SEED,
  ...SKIN1004_SEED,
  ...SHISEIDO_SEED,
  ...WELEDA_SEED,
  ...VICHY_LABORATORIES_SEED,
  ...IUNIK_SEED,
  ...MISSHA_SEED,
  // haircare
  ...ARGILETZ_SEED,
  ...ARKOPHARMA_SEED,
  ...BAILLEUL_SEED,
  ...BEAUTERRA_SEED,
  ...BIOCYTE_SEED,
  ...BIOKAP_SEED,
  ...BIORENE_SEED,
  ...CATTIER_SEED,
  ...CAUDALIE_SEED,
  ...CINQ_SUR_CINQ_SEED,
  ...CLARIFICATION_SEED,
  ...COSLYS_SEED,
  ...CUT_BY_FRED_SEED,
  ...DERMACLAY_SEED,
  ...DR_THEISS_SEED,
  ...DUCRAY_HAIRCARE_SEED,
  ...ESSENCE_SEED,
  ...EYE_CARE_SEED,
  ...FLORAME_SEED,
  ...HERBATINT_SEED,
  ...ITEM_SEED,
  ...JALDES_SEED,
  ...K_RANOVE_SEED,
  ...KLORANE_SEED,
  ...LA_ROSEE_HAIRCARE_SEED,
  ...LAZARTIGUE_SEED,
  ...LED_NOREVA_SEED,
  ...LES_3_CH_NES_SEED,
  ...LES_SECRETS_DE_LOLY_SEED,
  ...L_OR_AL_PROFESSIONNEL_SEED,
  ...LUX_OL_SEED,
  ...MELVITA_SEED,
  ...MKL_GREEN_NATURE_SEED,
  ...NATESSANCE_SEED,
  ...NEUTRADERM_SEED,
  ...NEUTROGENA_SEED,
  ...NUXE_SEED,
  ...OLAPLEX_SEED,
  ...PETROLE_HAHN_SEED,
  ...PHYTO_SEED,
  ...POUXIT_SEED,
  ...PRANAROM_SEED,
  ...PURESSENTIEL_SEED,
  ...REDKEN_SEED,
  ...RENE_FURTERER_SEED,
  ...SANOFLORE_SEED,
  ...SOW__SEED,
  ...STIEFEL_SEED,
  ...TOPPIK_SEED,
  ...WELLA_PROFESSIONALS_SEED,
  // dental
  ...ARTHRODONT_SEED,
  ...BAUSCH___LOMB_SEED,
  ...BIOGAIA_SEED,
  ...BOTOT_SEED,
  ...CB12_SEED,
  ...CRINEX_SEED,
  ...DENTAL_CARE_PRODUCTS_SEED,
  ...ELGYDIUM_SEED,
  ...ELMEX_SEED,
  ...FLUOCARIL_SEED,
  ...GUM_SEED,
  ...HYALUGEL_SEED,
  ...INAVA_SEED,
  ...LA_ROSEE_DENTAL_SEED,
  ...MEDIDENT_SEED,
  ...M_RIDOL_SEED,
  ...ORAL_B_SEED,
  ...PARODONTAX_SEED,
  ...PAROGENCYL_SEED,
  ...POLIDENT_SEED,
  ...RICQLES_SEED,
  ...SANT__SILICE_SEED,
  ...SENSODYNE_SEED,
  ...TEPE_SEED,
  ...WATERPIK_SEED, // imported candidates
  ...A_DERMA_PHARMASHOP_SEED,
  ...A_DERMA_ATIDA_SEED,
  ...ACM_PHARMASHOP_SEED,
  ...AVENE_PHARMASHOP_SEED,
  ...AVENE_ATIDA_SEED,
  ...AVRIL_PHARMASHOP_SEED,
  ...BEAUTERRA_ATIDA_SEED,
  ...BIODERMA_ATIDA_SEED,
  ...BIOLANE_ATIDA_SEED,
  ...CAUDALIE_ATIDA_SEED,
  ...CERAVE_ATIDA_SEED,
  ...CICABIAFINE_PHARMASHOP_SEED,
  ...CLARINS_PHARMASHOP_SEED,
  ...CLINIQUE_PHARMASHOP_SEED,
  ...DERMASENS_ATIDA_SEED,
  ...DEXERYL_ATIDA_SEED,
  ...DUCRAY_ATIDA_SEED,
  ...EAU_THERMALE_JONZAC_ATIDA_SEED,
  ...EMBRYOLISSE_ATIDA_SEED,
  ...ERBORIAN_PHARMASHOP_SEED,
  ...EUCERIN_PHARMASHOP_SEED,
  ...EUCERIN_ATIDA_SEED,
  ...FLORAME_BODYCARE_ATIDA_SEED,
  ...GABRIEL_COUZIAN_ATIDA_SEED,
  ...GARANCIA_ATIDA_SEED,
  ...ISDIN_ATIDA_SEED,
  ...ISISPHARMA_ATIDA_SEED,
  ...KLORANE_BODYCARE_ATIDA_SEED,
  ...KREME_PHARMASHOP_SEED,
  ...LA_ROCHE_POSAY_ATIDA_SEED,
  ...LA_ROSEE_PHARMASHOP_SEED,
  ...LA_ROSEE_ATIDA_SEED,
  ...LAB_BIARRITZ_PHARMASHOP_SEED,
  ...LE_COMPTOIR_DU_BAIN_ATIDA_SEED,
  ...LES_SECRETS_DE_LOLY_BODYCARE_PHARMASHOP_SEED,
  ...LIERAC_PHARMASHOP_SEED,
  ...MKL_GREEN_NATURE_ATIDA_SEED,
  ...MUSC_INTIME_ATIDA_SEED,
  ...MUSTELA_PHARMASHOP_SEED,
  ...NEUTRADERM_PHARMASHOP_SEED,
  ...NUXE_ATIDA_SEED,
  ...PATYKA_PHARMASHOP_SEED,
  ...PUR_ALOE_ATIDA_SEED,
  ...RESPIRE_PHARMASHOP_SEED,
  ...LA_ROCHE_POSAY_PHARMASHOP_SEED,
  ...ROGE_CAVAILLES_ATIDA_SEED,
  ...SAUGELLA_ATIDA_SEED,
  ...SVR_PHARMASHOP_SEED,
  ...SVR_ATIDA_SEED,
  ...TOPICREM_ATIDA_SEED,
  ...URIAGE_ATIDA_SEED,
  ...VICHY_HOMME_ATIDA_SEED,
  ...VICHY_LABORATORIES_PHARMASHOP_SEED,
  ...ARTHRODONT_ATIDA_SEED,
  ...AVRIL_DENTAL_PHARMASHOP_SEED,
  ...BOTOT_ATIDA_SEED,
  ...CB12_ATIDA_SEED,
  ...ELGYDIUM_ATIDA_SEED,
  ...ELMEX_PHARMASHOP_SEED,
  ...ELMEX_ATIDA_SEED,
  ...FLUOCARIL_ATIDA_SEED,
  ...GUM_ATIDA_SEED,
  ...HYALUGEL_ATIDA_SEED,
  ...LA_ROSEE_DENTAL_PHARMASHOP_SEED,
  ...LA_ROSEE_DENTAL_ATIDA_SEED,
  ...MERIDOL_ATIDA_SEED,
  ...PARODONTAX_ATIDA_SEED,
  ...PAROGENCYL_ATIDA_SEED,
  ...RESPIRE_DENTAL_PHARMASHOP_SEED,
  ...SANOGYL_PHARMASHOP_SEED,
  ...SENSODYNE_ATIDA_SEED,
  ...WELEDA_DENTAL_ATIDA_SEED,
  ...ACM_HAIRCARE_PHARMASHOP_SEED,
  ...ARKOPHARMA_ATIDA_SEED,
  ...AVRIL_HAIRCARE_PHARMASHOP_SEED,
  ...BEAUTERRA_HAIRCARE_ATIDA_SEED,
  ...BIODERMA_HAIRCARE_ATIDA_SEED,
  ...BIOKAP_ATIDA_SEED,
  ...CATTIER_ATIDA_SEED,
  ...COSLYS_ATIDA_SEED,
  ...DR_THEISS_ATIDA_SEED,
  ...DUCRAY_HAIRCARE_PHARMASHOP_SEED,
  ...DUCRAY_HAIRCARE_ATIDA_SEED,
  ...EUCERIN_HAIRCARE_PHARMASHOP_SEED,
  ...EUCERIN_HAIRCARE_ATIDA_SEED,
  ...EYE_CARE_ATIDA_SEED,
  ...ISDIN_HAIRCARE_ATIDA_SEED,
  ...ISISPHARMA_HAIRCARE_ATIDA_SEED,
  ...ITEM_ATIDA_SEED,
  ...KERANOVE_ATIDA_SEED,
  ...KLORANE_ATIDA_SEED,
  ...L_OREAL_PROFESSIONNEL_ATIDA_SEED,
  ...LA_ROCHE_POSAY_HAIRCARE_ATIDA_SEED,
  ...LA_ROSEE_HAIRCARE_PHARMASHOP_SEED,
  ...LAZARTIGUE_ATIDA_SEED,
  ...LED_NOREVA_ATIDA_SEED,
  ...LES_SECRETS_DE_LOLY_PHARMASHOP_SEED,
  ...LES_SECRETS_DE_LOLY_ATIDA_SEED,
  ...LUXEOL_ATIDA_SEED,
  ...MELVITA_ATIDA_SEED,
  ...MKL_GREEN_NATURE_HAIRCARE_ATIDA_SEED,
  ...MUSTELA_HAIRCARE_PHARMASHOP_SEED,
  ...NATESSANCE_ATIDA_SEED,
  ...NEUTRADERM_HAIRCARE_PHARMASHOP_SEED,
  ...NEUTRADERM_HAIRCARE_ATIDA_SEED,
  ...NEUTROGENA_ATIDA_SEED,
  ...NUXE_HAIRCARE_ATIDA_SEED,
  ...OLAPLEX_ATIDA_SEED,
  ...REDKEN_ATIDA_SEED,
  ...RENE_FURTERER_ATIDA_SEED,
  ...RESPIRE_HAIRCARE_PHARMASHOP_SEED,
  ...LA_ROCHE_POSAY_HAIRCARE_PHARMASHOP_SEED,
  ...SEBAMED_PHARMASHOP_SEED,
  ...STIEFEL_ATIDA_SEED,
  ...URIAGE_HAIRCARE_ATIDA_SEED,
  ...VICHY_LABORATORIES_HAIRCARE_PHARMASHOP_SEED,
  ...VICHY_LABORATORIES_HAIRCARE_ATIDA_SEED,
  ...WELEDA_HAIRCARE_ATIDA_SEED,
  ...CENTIFOLIA_ATIDA_SEED,
  ...CLARIFICATION_ATIDA_SEED,
  ...CUT_BY_FRED_SKINCARE_ATIDA_SEED,
  ...DERMACEUTIC_PHARMASHOP_SEED,
  ...DR_JART_PHARMASHOP_SEED,
  ...ELGYDIUM_SKINCARE_ATIDA_SEED,
  ...KLORANE_SKINCARE_ATIDA_SEED,
  ...L_OREAL_PROFESSIONNEL_SKINCARE_ATIDA_SEED,
  ...LED_NOREVA_SKINCARE_ATIDA_SEED,
  ...LES_SECRETS_DE_LOLY_SKINCARE_PHARMASHOP_SEED,
  ...LES_SECRETS_DE_LOLY_SKINCARE_ATIDA_SEED,
  ...NOVEXPERT_PHARMASHOP_SEED,
  ...OLAPLEX_SKINCARE_ATIDA_SEED,
  ...PETROLE_HAHN_SKINCARE_ATIDA_SEED,
  ...POUXIT_SKINCARE_ATIDA_SEED,
  ...REDKEN_SKINCARE_ATIDA_SEED,
  ...RENE_FURTERER_SKINCARE_ATIDA_SEED,
  ...WELLA_PROFESSIONALS_SKINCARE_ATIDA_SEED,
  ...ELMEX_SOLAIRE_PHARMASHOP_SEED,
  ...KLORANE_SOLAIRE_ATIDA_SEED,
  ...LES_SECRETS_DE_LOLY_SOLAIRE_PHARMASHOP_SEED,
  ...PHYTO_SOLAIRE_ATIDA_SEED,
]

// ── Derived exports (previously split across 4 files) ─────────────────────────

export const allProductData = allUnified.map(
  ({ tags: _tags, keyIngredients: _ki, ...product }) => ({
    category: kindToCategory[product.kind],
    ...product,
  })
)

export const allProductTagsMap: Record<string, ProductTagGroups> = Object.fromEntries(
  allUnified.map((p) => [p.slug, p.tags])
)

const allProductIngredientsMap: Record<string, Ingredient[]> = Object.fromEntries(
  allUnified.flatMap((p) =>
    p.keyIngredients && p.keyIngredients.length > 0 ? [[p.slug, p.keyIngredients] as const] : []
  )
)

export { allProductIngredientsMap as ALL_PRODUCT_INGREDIENTS_MAP }

export const allIngredientProductTags = Object.entries(allProductIngredientsMap).flatMap(
  ([productSlug, ings]) =>
    ings.map((ing) => ({
      productSlug,
      ingredientSlug: ing.slug,
      concentrationValue: ing.concentrationValue ?? ing.value ?? null,
      concentrationUnit: ing.concentrationUnit ?? ing.unit ?? null,
      notes: ing.notes ?? null,
    }))
)
