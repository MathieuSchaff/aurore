import type { PsdConfig } from '../../scripts/fetch-images-pharmashopdiscount'

// Weleda first-party site has no public sitemap or product URLs to scrape.
// Pull packshots from pharmashopdiscount instead.

export const config: PsdConfig = {
  origin: 'https://www.pharmashopdiscount.com',
  pathBySlug: {
    'weleda-everon-lip-balm': '/fr/beaute/weleda/weleda-everon-stick-levres-4-8g.html',
    'weleda-gentle-cleansing-milk':
      '/fr/beaute/weleda/weleda-bio-lait-nettoyant-peaux-sensibles-amande.html',
    // PSD has no separate "Body Butter" SKU — use Skin Food Body Lotion as visual proxy
    'weleda-skin-food-body-butter': '/fr/beaute/weleda/weleda-skin-food-body-lotion-250ml.html',
    // PSD has no "Light" variant — use the day cream which is the lighter facial Skin Food
    'weleda-skin-food-light-nourishing-cream':
      '/fr/beaute/weleda/weleda-bio-skin-food-creme-jour-nourrissante-40ml.html',
    'weleda-skin-food-nourishing-body-lotion':
      '/fr/beaute/weleda/weleda-skin-food-body-lotion-250ml.html',
    'weleda-skin-food-nourishing-day-cream':
      '/fr/beaute/weleda/weleda-bio-skin-food-creme-jour-nourrissante-40ml.html',
    'weleda-skin-food-nourishing-night-cream':
      '/fr/beaute/weleda/weleda-bio-skin-food-creme-nuit-nourrissante-40ml.html',
    'weleda-skin-food-original-ultra-rich-cream':
      '/fr/visage-et-corps/top-marques/patyka/creme-hydratante-nourrissante/weleda-skin-food-soin-nourrissant-75ml.html',
  },
}
