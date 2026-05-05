import type { PsdConfig } from '../../scripts/fetch-images-pharmashopdiscount'

export const config: PsdConfig = {
  origin: 'https://www.pharmashopdiscount.com',
  pathBySlug: {
    // "Que mes Rougeurs Disparaissent !" — proxy via the PSD anti-rougeurs sérum
    // (closest packshot for the Garancia anti-rougeurs line).
    'garancia-que-mes-rougeurs-disparaissent':
      '/fr/beaute/garancia/garancia-serum-concentre-anti-rougeurs-30ml.html',
  },
}
