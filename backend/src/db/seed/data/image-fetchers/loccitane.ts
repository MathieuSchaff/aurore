import type { LoccitaneConfig } from '../../scripts/fetch-images-loccitane'

// L'Occitane Demandware CDN. Hash refreshed from web.archive.org snapshot of
// /creme-jeunesse-immortelle-divine-27DC050I23.html (2025-12-08).

export const config: LoccitaneConfig = {
  cdnBase:
    'https://fr.loccitane.com/dw/image/v2/BCDQ_PRD/on/demandware.static/-/Sites-occ_master/default/dw52a35c4e/RECT',
  skuBySlug: {
    'loccitane-immortelle-baume-corps-pro-jeunesse-200ml': '27CCJ200IK26',
    'loccitane-immortelle-baume-demaquillant-60g': '27BD060I23',
    'loccitane-immortelle-baume-regard-15ml': '27DB015I20',
    'loccitane-immortelle-contour-yeux-levres-15ml': '27DE015I21',
    'loccitane-immortelle-creme-cou-lissante-50ml': '27NC050IK26',
    'loccitane-immortelle-creme-jeunesse-50ml': '27DC050I23',
    'loccitane-immortelle-creme-visage-precieuse-50ml': '27CP050I22',
    'loccitane-immortelle-eau-essentielle-precieuse-200ml': '27EV200I22',
    'loccitane-immortelle-huile-corps-raffermissante-100ml': '27HC100IK26',
    'loccitane-immortelle-huile-demaquillante-200ml': '27HD200I23',
    'loccitane-immortelle-huile-jeunesse-30ml': '27DH030I22',
    'loccitane-immortelle-mousse-nettoyante-125ml': '27MC125I23',
    'loccitane-immortelle-serum-creme-mains-75ml': '27CMJ075IK26',
    'loccitane-immortelle-serum-pro-fermete-30ml': '27DS030I24',
    'loccitane-immortelle-serum-reset-nuit-50ml': '27OR050I24',
    'loccitane-immortelle-triphase-essence-reset-150ml': '27ER150I25',
  },
}
