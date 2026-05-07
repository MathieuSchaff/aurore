<!-- SEEDED 2026-05-08 — 22 produits (roller + 21 ci-dessous) via QUICK_SQL_INSERT workflow -->

https://drsambunting.com/en-eu/products/flawless-body-cleanser
https://drsambunting.com/en-eu/products/flawless-cleanser
https://drsambunting.com/en-eu/products/flawless-moisturiser-intense
https://drsambunting.com/en-eu/products/flawless-moisturiser
https://drsambunting.com/en-eu/products/flawless-neutralising-gel
https://drsambunting.com/en-eu/products/flawless-nightly-serum
https://drsambunting.com/en-eu/products/flawless-brightly-serum
https://drsambunting.com/en-eu/products/flawless-daily-sunscreen
https://drsambunting.com/en-eu/products/flawless-gossamer-tint-spf-50
https://drsambunting.com/en-eu/products/flawless-nightly-pro-serum
https://drsambunting.com/en-eu/products/flawless-nightly-eye-serum
https://drsambunting.com/en-eu/products/flawless-body-therapy
https://drsambunting.com/en-eu/products/flawless-vitamin-c-nad-serum
https://drsambunting.com/en-eu/products/flawless-revival-mask
https://drsambunting.com/en-eu/products/flawless-brightly-eye-serum
https://drsambunting.com/en-eu/products/flawless-cleansing-water
https://drsambunting.com/en-eu/products/flawless-hand-therapy
https://drsambunting.com/en-eu/products/flawless-lip
https://drsambunting.com/en-eu/products/flawless-lip-tint
https://drsambunting.com/en-eu/products/flawless-brightly-pro-serum
https://drsambunting.com/en-eu/products/flawless-moisturiser-light

---

## Problèmes / ingrédients skippés

### INCI incomplètes (site)
- **Flawless Lip** : seulement 2 ingrédients affichés (Lanolin, Ceramide NP). Page indique liste en cours de MAJ.
- **Flawless Lip Tint** : 4 ingrédients seulement (Lanolin, Mica, Ceramide NP, CI 77491). Probablement incomplet. `total_amount`/`amount_unit` non indiqués → NULL.

### Ingrédients non seedés (slug absent en DB)
| INCI | Produits concernés | Note |
|------|--------------------|------|
| Mica (skincare) | Lip Tint, Brightly Eye Serum | Seul `mica-hair` existe |
| Mangifera Indica (Mango) Seed Butter | Brightly Eye Serum, Hand Therapy | Seul `mango-butter-hair` existe |
| Glucosyl Hesperidin | Brightly Eye Serum | ≠ `hesperidin-methyl-chalcone`, molécule différente |
| Helianthus Annuus Sprout Extract | Moisturiser Intense, Vitamin C NAD Serum, Brightly Eye Serum | `helianthus-annuus-seed-wax` ≠ sprout extract |
| Sodium Polyacryloyldimethyl Taurate | Vitamin C NAD Serum | ≠ `ammonium-polyacryloyldimethyl-taurate` (contre-ion différent) |
| Dimethicone Kojic Dipalmitate | Brightly Pro Serum | Kojic Dipalmitate ≠ `kojic-acid` |

### Excipients courants absents (non critiques, non seedés)
Poloxamer 184/188, PEG-6/7, Tapioca Starch, Phenoxyethanol, Ethylhexylglycerin,
Dehydroacetic Acid, Sodium Stearoyl Glutamate, Benzyl Alcohol, Stearic Acid,
Sodium Lauroyl Lactylate, Polysilicone-11, Polymethylsilsesquioxane, BHT.
