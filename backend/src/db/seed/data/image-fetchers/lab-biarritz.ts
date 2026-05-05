import type { IllicoConfig } from '../../scripts/fetch-images-illicopharma'

// Laboratoires de Biarritz first-party site (PrestaShop) — og:image works,
// reuse the generic illicopharma fetcher (it just extracts og:image from
// any URL passed in urlBySlug).

export const config: IllicoConfig = {
  urlBySlug: {
    'lab-biarritz-cica-repa-creme-reparatrice':
      'https://www.laboratoires-biarritz.com/fr/corps/213-cica-repa-creme-reparatrice-post-tatouage.html',
    'lab-biarritz-creme-nuit-anti-taches':
      'https://www.laboratoires-biarritz.com/fr/visage/681-creme-de-nuit-anti-taches.html',
    'lab-biarritz-creme-nuit-regenerante':
      'https://www.laboratoires-biarritz.com/fr/visage/234-creme-de-nuit-regenerante-visage-certifiee-bio.html',
    'lab-biarritz-creme-solaire-teinte-spf50':
      'https://www.laboratoires-biarritz.com/fr/solaire/212-creme-solaire-visage-teintee-spf50-certifiee-bio.html',
    // No "dorée" SKU on current catalog — fall back to the unteinted teintée variant
    'lab-biarritz-creme-solaire-teinte-spf50-doree':
      'https://www.laboratoires-biarritz.com/fr/solaire/72-creme-solaire-teintee-bio.html',
    'lab-biarritz-creme-solaire-visage-spf50':
      'https://www.laboratoires-biarritz.com/fr/solaire/19-creme-solaire-visage-spf50-certifiee-bio.html',
    'lab-biarritz-creme-visage':
      'https://www.laboratoires-biarritz.com/fr/visage/652-la-creme-de-biarritz.html',
    // No body sun "lait" on current catalog — closest packshot is the children's body cream
    'lab-biarritz-lait-solaire-spf50':
      'https://www.laboratoires-biarritz.com/fr/solaire/15-creme-solaire-enfant-spf50-certifiee-bio.html',
    'lab-biarritz-serum-anti-taches':
      'https://www.laboratoires-biarritz.com/fr/visage/680-serum-anti-taches.html',
    'lab-biarritz-serum-repulpant':
      'https://www.laboratoires-biarritz.com/fr/visage/232-serum-repulpant-visage-certifie-bio.html',
  },
}
