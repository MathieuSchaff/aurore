import type { BiodermaConfig } from '../../scripts/fetch-images-bioderma'

// Bioderma.fr (Naos AEM + Magento). Several DB slugs do not exist as standalone
// pages on bioderma.fr because the site groups variants (e.g. Crème vs Crème+
// Spf50) on a single /p/<gamme> page. Map to the closest live URL — the
// pack-shot returned is the gamme's lead variant, which is the right packshot
// for the family in those cases.

export const config: BiodermaConfig = {
  origin: 'https://www.bioderma.fr',
  pathBySlug: {
    'bioderma-atoderm-creme-ultra': '/p/atoderm-creme-ultra',
    'bioderma-atoderm-intensive-baume': '/p/atoderm-intensive-baume',
    'bioderma-atoderm-intensive-eye': '/p/atoderm-intensive-eye',
    'bioderma-atoderm-intensive-gel-creme': '/p/atoderm-intensive-gel-creme',
    'bioderma-atoderm-pp-baume': '/p/atoderm-pp-baume',
    'bioderma-cicabio-arnica': '/p/cicabio-arnica',
    'bioderma-cicabio-baume-lavant': '/p/cicabio-baume-lavant',
    'bioderma-cicabio-creme': '/p/cicabio-creme',
    // "Crème+" is the lead variant on /p/cicabio-creme — same packshot family
    'bioderma-cicabio-creme-plus': '/p/cicabio-creme',
    'bioderma-cicabio-creme-plus-spf50': '/p/cicabio-creme-spf50',
    'bioderma-cicabio-restor': '/p/cicabio-restor',
    'bioderma-crealine-defensive': '/p/crealine-defensive',
    'bioderma-crealine-defensive-riche': '/p/crealine-defensive-riche',
    // Bioderma rebranded "ar plus" / "ds plus" -> "ar creme" / "ds creme"
    'bioderma-crealine-ar-plus': '/p/crealine-ar-creme',
    'bioderma-crealine-ds-plus': '/p/crealine-ds-creme',
    'bioderma-crealine-fort': '/p/crealine-fort',
    'bioderma-crealine-gel-moussant': '/p/crealine-gel-moussant',
    'bioderma-crealine-h2o': '/p/crealine-h2o',
    'bioderma-crealine-huile-micellaire': '/p/crealine-huile-micellaire',
    'bioderma-photoderm-xdefense-spf50': '/p/photoderm-xdefense-ultra-fluid-spf50-invisible',
    'bioderma-pigmentbio-sensitive-areas': '/p/pigmentbio-sensitive-areas',
    'bioderma-sebium-gel-moussant': '/p/sebium-gel-moussant',
    'bioderma-sebium-h2o': '/p/sebium-h2o',
    'bioderma-sebium-hydra': '/p/sebium-hydra',
    'bioderma-sebium-hydra-cleanser': '/p/sebium-hydra-cleanser',
    'bioderma-sebium-kerato-plus': '/p/sebium-kerato',
    'bioderma-sebium-sensitive': '/p/sebium-sensitive',
    // Sensibio is the legacy (rest-of-world) name for Crealine in France
    'bioderma-sensibio-ar-plus': '/p/crealine-ar-creme',
  },
}
