import type { PsdConfig } from '../../scripts/fetch-images-pharmashopdiscount'

// Avène via pharmashopdiscount (PSD reseller — no bot-block, no og:image,
// packshot at /mbFiles/images/.../thumbs/766x766/<EAN>.<ext>).

export const config: PsdConfig = {
  origin: 'https://www.pharmashopdiscount.com',
  pathBySlug: {
    'avene-antirougeurs-rosamed':
      '/fr/beaute/avene/avene-rosamed-antirougeurs-concentre-30-ml.html',
    'avene-cleanance-comedomed-serum-intensif':
      '/fr/beaute/avene/avene-cleanance-serum-intensif-30ml.html',
    'avene-cleanance-comedomed-soin-anti-imperfection':
      '/fr/beaute/avene/avene-cleanance-comedomed-soin-intensif-anti-imperfections-30ml.html',
    'avene-hyaluron-activ-procedure-creme-lifting-0-1-retinal':
      '/fr/beaute/avene/avene-hyaluron-activ-procedure-creme-lifting-30ml.html',
    'avene-hyaluron-activ-procedure-creme-micro-lift-yeux-levres':
      '/fr/beaute/avene/avene-hyaluron-activ-procedure-creme-yeux-levres-15ml.html',
    'avene-hydrance-boost-serum-hydratant':
      '/fr/beaute/avene/avene-hydrance-boost-serum-concentre-hydratant-30ml.html',
    'avene-hydrance-riche-creme-hydratante':
      '/fr/beaute/avene/cremes-hydratantes/avene-hydrance-creme-peaux-sensibles-a-seches-40-ml.html',
    'avene-solaire-cleanance-solaire-spf50-plus':
      '/fr/beaute/avene/avene-cleanance-spf50-ultra-leger-anti-imperfections-50ml.html',
    // No "anti-lumiere-bleue" SKU on PSD — closest is sunsimed pigment blue light
    'avene-solaires-creme-teinte-anti-lumiere-bleue-spf50-plus':
      '/fr/beaute/avene/avene-sunsimed-pigment-blue-light-80ml.html',
    'avene-solaire-sunsimed-ka-spf50-plus':
      '/fr/beaute/avene/avene-sunsimed-ka-blue-light-80ml-spf50.html',
    // "Tolérance Control Baume Relipidant" appears as "Baume Apaisant" on PSD
    'avene-tolerance-control-baume-relipidant':
      '/fr/beaute/avene/avene-tolerance-control-baume-apaisant-40ml.html',
    'avene-ultra-fluid-eclat-radiance-spf50-plus':
      '/fr/beaute/avene/avene-ultra-fluid-eclat-radiance-spf50-50ml.html',
    'avene-ultra-fluid-invisible-spf50-plus':
      '/fr/beaute/avene/avene-ultra-fluid-invisible-peaux-sensibles-spf50-50ml.html',
    'avene-ultra-fluid-perfecteur-spf50-plus':
      '/fr/beaute/avene/avene-perfecteur-ultra-fluid-peaux-sensibles-spf50-50ml.html',
    'avene-vitamin-activ-c-serum-eclat':
      '/fr/beaute/avene/avene-vitamin-activ-cg-serum-correcteur-elat-30-ml.html',
    'avene-xeracalm-ad-baume-relipidant':
      '/fr/beaute/avene/avene-baume-relipidant-xeracalm-a-d-400ml.html',
  },
}
