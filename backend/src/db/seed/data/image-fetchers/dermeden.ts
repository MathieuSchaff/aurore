import type { FetchConfig } from '../../scripts/fetch-images-shopify'

export const config: FetchConfig = {
  origin: 'https://dermeden.com',
  slugByHandle: {
    'advanced-peel': 'dermeden-advanced-peel',
    'soin-reparateur-peaux-lesees-et-irritees': 'dermeden-cicaderm-soin-reparateur',
    'le-concentre-anti-taches-5-txa': 'dermeden-concentre-anti-taches-txa-5',
    'concentre-repulpant-et-hydratant': 'dermeden-concentre-repulpant-et-hydratant-15',
    'concentre-retinoides-nuit': 'dermeden-concentre-retinoides-nuit-6',
    'creme-mains-anti-taches': 'dermeden-creme-mains-action-globale',
    'creme-de-jour-anti-age-peaux-mixtes-a-grasses':
      'dermeden-day-protocole-creme-de-jour-4-en-1-peaux-mixtes-a-grasses',
    'creme-de-jour-anti-age-peaux-seches':
      'dermeden-day-protocole-creme-de-jour-4-en-1-peaux-seches',
    // DD Cream SPF50: shopify has dd-cream-teinte-claire-trustt (DD CREAM, single tint).
    // dermeden-dd-cream-spf50 in DB likely matches this default.
    'dd-cream-teinte-claire-trustt': 'dermeden-dd-cream-spf50',
    'demaquillant-total': 'dermeden-demaquillant-total-lait-lotion-2-en-1',
    'gel-nettoyant-purifiant': 'dermeden-gel-nettoyant-purifiant',
    'lotion-micellaire-ha-like': 'dermeden-ha-like-lotion-micellaire',
    'hydra-protocole-creme-legere-matifiante': 'dermeden-hydra-protocole-creme-legere-matifiante',
    'hydra-protocole-creme-riche': 'dermeden-hydra-protocole-creme-riche',
    'lait-corps-eclat': 'dermeden-lait-corps-eclat',
    'lumixder-creme-eclaircissante': 'dermeden-lumixderm-creme-eclaircissante',
    'masque-exfoliant-detox-2-en-1': 'dermeden-masque-exfoliant-detox-2-en-1',
    'mousse-nettoyante-antioxydante': 'dermeden-mousse-nettoyante-antioxydante',
    'creme-de-nuit-anti-age-intense': 'dermeden-night-protocole-creme-de-night-intense',
    // night protocole "Sérum Intense" — anti-age variant (vs anti-taches "Sérum Intense").
    'serum-anti-age-intense': 'dermeden-night-protocole-serum-intense',
    'contour-des-yeux-anti-age-intense': 'dermeden-soin-contour-des-yeux-intense',
    'soin-vergetures-raffermissant': 'dermeden-soin-vergetures-raffermissant',
  },
}
