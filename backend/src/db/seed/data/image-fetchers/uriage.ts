import type { PsdConfig } from '../../scripts/fetch-images-pharmashopdiscount'

// Uriage via pharmashopdiscount (PSD reseller — no bot-block, no og:image,
// packshot at /mbFiles/images/.../thumbs/766x766/<EAN>.<ext>).

export const config: PsdConfig = {
  origin: 'https://www.pharmashopdiscount.com',
  pathBySlug: {
    // Bariederm Cica Daily Serum is the long-lived serum SKU
    'uriage-cica-daily-serum-reparateur-intense':
      '/fr/beaute/uriage/uriage-bariederm-cica-daily-serum-30ml.html',
    'uriage-depiderm-serum-anti-taches-booster-eclat':
      '/fr/beaute/uriage/uriage-depiderm-serum-anti-taches-30ml.html',
    'uriage-hyseac-serum-peau-neuve-booster-anti-imperfections':
      '/fr/beaute/uriage/uriage-hyseac-serum-peau-neuve-30ml.html',
    'uriage-roseliane-serum-lissant-correcteur-anti-rougeurs':
      '/fr/beaute/uriage/uriage-roseliane-serum-lissant-anti-rougeurs-30ml.html',
    'uriage-roseliane-soin-teinte-anti-rougeurs-spf50':
      '/fr/beaute/uriage/uriage-roseliane-cc-creme-spf50-teinte-claire-40ml.html',
    // Xemose C8+ rebrand — PSD only carries the older C8 + classic Xemose lines.
    // Map to the closest packshot in each form factor.
    'uriage-xemose-c8-plus-baume-relipidant-anti-grattage':
      '/fr/beaute/uriage/uriage-xemose-c8-baume-relipidant-huile-lavante.html',
    'uriage-xemose-c8-plus-creme-relipidante-anti-grattage':
      '/fr/beaute/uriage/soins-corps/uriage-xemose-creme-relipidante-anti-irritations-200ml.html',
    'uriage-xemose-c8-plus-huile-lavante-anti-grattage':
      '/fr/beaute/uriage/soins-corps/uriage-xemose-c8-syndet-nettoyant-doux-peau-tres-seche-500ml.html',
    'uriage-xemose-c8-plus-soin-visage-nourrissant-apaisant':
      '/fr/beaute/uriage/soins-hydratants/uriage-xemose-creme-visage-40ml.html',
  },
}
