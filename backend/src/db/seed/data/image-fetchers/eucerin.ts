import type { PsdConfig } from '../../scripts/fetch-images-pharmashopdiscount'

export const config: PsdConfig = {
  origin: 'https://www.pharmashopdiscount.com',
  pathBySlug: {
    'eucerin-atopicontrol-baume':
      '/fr/beaute/eucerin/soins-corps/eucerin-atopi-control-baume-400-ml.html',
    'eucerin-sun-protection-leb-protect-creme-gel-visage-corps-spf50':
      '/fr/beaute/eucerin/solaires/eucerin-spf50-sun-leb-protection-creme-gel-150ml.html',
    'eucerin-sun-protection-photoaging-control-fluide-anti-age-spf50':
      '/fr/visage-et-corps/solaires/visage/eucerin-sun-fluid-anti-age-visage-spf50-50ml.html',
    'eucerin-urearepair-plus-lotion-10':
      '/fr/beaute/eucerin/soins-corps/eucerin-emollient-reparateur-10-uree-250ml.html',
  },
}

// urearepair 30 % crème corps — sourced via cocooncenter (not on PSD).
// Use fetch-images-cocooncenter.ts directly with this URL:
//   https://www.cocooncenter.com/eucerin-urearepair-plus-creme-30-uree-75-ml/39179.html
