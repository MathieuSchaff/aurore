# DEDUP_DROPS — produits supprimés Phase 6 + backlog

> **Rôle** : tracer les produits dégagés du seed/DB pour Phase 6 doublons,
> avec leur image CDN.
>
> **Workflow image cleanup** : batch via `bun run backend/src/db/seed/scripts/delete-bunny-images.ts`
> avec `SLUGS_FILE=output/dedup-dropped-slugs.json` (env `BUNNY_STORAGE_*` requis).
>
> **Status CDN cleanup (2026-05-04)** : Rounds initial-6 ✅ tous purgés du Bunny Storage Zone
> `aurore-images`. Sweep 1 (Rounds initial-4) : 98 deleted, 1 not-found
> (`bioderma-atoderm-huile-douche` n'avait pas d'image). Sweep 2 (Rounds 5+6) :
> 22 deleted (7 Round 5 + 1 Round 6 + 14 stragglers earlier rounds), 104 not-found, 0 failed.
> Image inheritance (2 keepers) conservée : `klorane-quinine-serum-antichute-100ml-299620.webp`,
> `klorane-quinine-edelweiss-shampoing-fortifiant-400ml-275208.webp`,
> `lazartigue-serum-anti-chute-progressive-thicker-50ml-284107.webp`.
> **Round 7** : 8 orphans ajoutés à `dedup-dropped-slugs.json`, sweep 3 à lancer. Image inheritance
> +2 (arthrodont/parodontax curés inheritent CDN du scrappé) → exclus du cleanup.

---

## Déjà supprimés (137, Phase 6)

Détail par round (slug + image CDN + image inheritance + skipped) : [`_archive/dedup-drops-rounds.md`](_archive/dedup-drops-rounds.md). Backups SQL : `backups/backup_20260504_*.sql`.

---

## Backlog — scan DB (snapshot 2026-05-04T14:05:48.886Z, 214 signaux)

Source : `bun run backend/src/db/seed/scripts/scan-db-duplicates.ts <backup.sql>`. JSON dans `output/scan-db-duplicates.json`.

### Slug typos (1)

- `prequel-half-half-fluid-moisturizer` (Prequel)

### Refill pairs résiduels (8)

Reste après batch refills J=1.0 — ces paires ont J(inci) bas (INCI scraping noise) ou des "refills" qui sont en fait des produits différents. Inspection cas par cas.

| J(inci) | Base | Refill |
|--------:|------|--------|
| 0.94 | `biarritz-spray-solaire-spf50` | `biarritz-spray-solaire-famille-spf50` |
| 0.44 | `aderma-exomega-huile-500` | `a-derma-exomega-control-huile-lavante-emolliente-anti-grattage-recharge` |
| 0.40 | `a-derma-exomega-control-huile-lavante-emolliente-anti-grattage-200ml-275091` | `a-derma-exomega-control-huile-lavante-emolliente-anti-grattage-recharge-500ml-275577` |
| 0.30 | `garancia-a-la-belle-etoile-creme-supreme-de-nuit-regeneratrice-visage-et-cou-40ml-249786` | `garancia-a-la-belle-etoile-creme-supreme-de-nuit-regeneratrice-visage-et-cou-recharge-40ml-249793` |
| 0.29 | `a-derma-exomega-control-huile-lavante-emolliente-anti-grattage-500ml-267567` | `a-derma-exomega-control-huile-lavante-emolliente-anti-grattage-recharge-500ml-275577` |
| 0.14 | `patyka-masque-lift-pro-collagene-nuit` | `patyka-recharge-masque-lift-pro-collagene` |
| 0.10 | `svr-sebiaclear-eau-micellaire` | `svr-sebiaclear-eau-micellaire-eco-recharge` |
| 0.08 | `la-rosee-stick-levres-nourrissant` | `la-rosee-recharge-stick-levres-nourrissant` |

### INCI clusters résiduels (131)

Top marques :
- **Dexeryl** : 13 paires
- **Klorane** : 12 paires
- **ISDIN** : 7 paires
- **Tepe** : 6 paires
- **Medicube** : 5 paires
- **Isispharma** : 5 paires
- **Le Comptoir du Bain** : 5 paires
- **SVR** : 4 paires
- **A-Derma** : 4 paires
- **Avène** : 4 paires
- **The Ordinary** : 4 paires
- **Laboratoires de Biarritz** : 4 paires
- **La Roche-Posay** : 4 paires
- **Embryolisse** : 4 paires
- **Medik8** : 3 paires

Patterns à attendre :
- **concentrations** (The Ordinary 5%/10%, Medik8 retinal 3/6, Dermaceutic Turn Over 10/15) → KEEP, produits distincts
- **parfums** (Klorane Cupuaçu eau-de-tiare/zeste-agrumes/etc.) → KEEP, distincts pour le consommateur
- **SPF** (Klorane Monoï SPF30/50, Biarritz spf50/famille-spf50) → KEEP
- **volume/lot/refill résiduels** → drop avec attention au flag size/concentration

<details><summary>Toutes les paires (grouped by brand)</summary>

#### Dexeryl (13)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.80 | `dexeryl-essentiel-lait-riche-nourrissant-200ml-270264` | `dexeryl-essentiel-lait-nourrissant-500ml-270265` |
| 1.00 | 0.60 | `dexeryl-essentiel-lait-riche-nourrissant-200ml-270264` | `dexeryl-essentiel-lait-nourrissant` |
| 1.00 | 0.80 | `dexeryl-essentiel-lait-riche-nourrissant-200ml-270264` | `dexeryl-essentiel-lait-riche-nourrissant` |
| 1.00 | 0.80 | `dexeryl-specific-brulures-et-coups-de-soleil-50g-265235` | `dexeryl-specific-brulures-et-coups-de-soleil` |
| 1.00 | 0.75 | `dexeryl-creme-secheresses-cutanees-500g-265240` | `dexeryl-creme-secheresses-cutanees` |
| 1.00 | 0.75 | `dexeryl-essentiel-lait-nourrissant-500ml-270265` | `dexeryl-essentiel-lait-nourrissant` |
| 1.00 | 0.60 | `dexeryl-essentiel-lait-nourrissant-500ml-270265` | `dexeryl-essentiel-lait-riche-nourrissant` |
| 1.00 | 0.80 | `dexeryl-dexeclear-gel-moussant-anti-imperfections-400ml-302056` | `dexeryl-dexeclear-gel-moussant-anti-imperfections` |
| 1.00 | 0.75 | `dexeryl-dexeclear-aquafluide-matifiant-40ml-302059` | `dexeryl-dexeclear-aquafluide-matifiant` |
| 0.96 | 1.00 | `dexeryl-dexeclear-nettoyant-hydratant-apaisant-400ml-302008` | `dexeryl-dexeclear-nettoyant-hydratant-apaisant-200ml-302032` |
| 1.00 | 0.80 | `dexeryl-dexeclear-nettoyant-hydratant-apaisant-400ml-302008` | `dexeryl-dexeclear-nettoyant-hydratant-apaisant` |
| 0.96 | 0.80 | `dexeryl-dexeclear-nettoyant-hydratant-apaisant-200ml-302032` | `dexeryl-dexeclear-nettoyant-hydratant-apaisant` |
| 1.00 | 0.75 | `dexeryl-essentiel-lait-nourrissant` | `dexeryl-essentiel-lait-riche-nourrissant` |

#### Klorane (12)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.78 | `klorane-monoi-tamanu-spray-solaire-sublime-corps-spf50-200ml-270081` | `klorane-monoi-tamanu-spray-solaire-sublime-corps-spf30-200ml-270080` |
| 1.00 | 0.60 | `klorane-beurre-de-cupuacu-gel-douche-nutritif-eau-de-tiare-200ml-275235` | `klorane-beurre-de-cupuacu-gel-douche-nutritif-ecorce-de-cedre-200ml-275237` |
| 1.00 | 0.60 | `klorane-beurre-de-cupuacu-gel-douche-nutritif-eau-de-tiare-200ml-275235` | `klorane-beurre-de-cupuacu-gel-douche-nutritif-zeste-d-agrumes-200ml-275241` |
| 1.00 | 0.60 | `klorane-beurre-de-cupuacu-gel-douche-nutritif-eau-de-tiare-200ml-275235` | `klorane-beurre-de-cupuacu-gel-douche-nutritif-feve-de-tonka-200ml-275245` |
| 1.00 | 0.60 | `klorane-beurre-de-cupuacu-gel-douche-nutritif-eau-de-tiare-200ml-275235` | `klorane-beurre-de-cupuacu-gel-douche-nutritif-feuille-de-figuier-200ml-275243` |
| 1.00 | 0.60 | `klorane-beurre-de-cupuacu-gel-douche-nutritif-ecorce-de-cedre-200ml-275237` | `klorane-beurre-de-cupuacu-gel-douche-nutritif-zeste-d-agrumes-200ml-275241` |
| 1.00 | 0.60 | `klorane-beurre-de-cupuacu-gel-douche-nutritif-ecorce-de-cedre-200ml-275237` | `klorane-beurre-de-cupuacu-gel-douche-nutritif-feve-de-tonka-200ml-275245` |
| 1.00 | 0.60 | `klorane-beurre-de-cupuacu-gel-douche-nutritif-ecorce-de-cedre-200ml-275237` | `klorane-beurre-de-cupuacu-gel-douche-nutritif-feuille-de-figuier-200ml-275243` |
| 1.00 | 0.60 | `klorane-beurre-de-cupuacu-gel-douche-nutritif-zeste-d-agrumes-200ml-275241` | `klorane-beurre-de-cupuacu-gel-douche-nutritif-feve-de-tonka-200ml-275245` |
| 1.00 | 0.60 | `klorane-beurre-de-cupuacu-gel-douche-nutritif-zeste-d-agrumes-200ml-275241` | `klorane-beurre-de-cupuacu-gel-douche-nutritif-feuille-de-figuier-200ml-275243` |
| 1.00 | 0.60 | `klorane-beurre-de-cupuacu-gel-douche-nutritif-feve-de-tonka-200ml-275245` | `klorane-beurre-de-cupuacu-gel-douche-nutritif-feuille-de-figuier-200ml-275243` |
| 1.00 | 0.67 | `klorane-beurre-de-cupuacu-creme-douche-nutritive-feuille-de-frangipanier-200ml-275231` | `klorane-beurre-de-cupuacu-creme-de-douche-nutritive-fleur-de-cupuacu-200ml-275230` |

#### ISDIN (7)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.82 | `isdin-fusion-water-color-light-creme-solaire-visage-teintee-spf50-50ml-244692` | `isdin-fusion-water-color-bronze-creme-solaire-visage-teintee-spf50-50ml-244691` |
| 0.95 | 0.75 | `isdin-fotoprotector-coverage-fond-de-teint-beige-spf50-30ml-302732` | `isdin-fotoprotector-coverage-fond-de-teint-sand-spf50-30ml-302730` |
| 0.95 | 0.75 | `isdin-fotoprotector-coverage-fond-de-teint-beige-spf50-30ml-302732` | `isdin-fotoprotector-coverage-fond-de-teint-pearl-spf50-30ml-302723` |
| 0.95 | 0.75 | `isdin-fotoprotector-coverage-fond-de-teint-sand-spf50-30ml-302730` | `isdin-fotoprotector-coverage-fond-de-teint-golden-spf50-30ml-302727` |
| 1.00 | 0.67 | `isdin-fotoprotector-compact-medium-spf50-10g-305770` | `isdin-fotoprotector-compact-bronze-spf50-10g-305781` |
| 1.00 | 0.67 | `isdin-fotoprotector-compact-medium-spf50-10g-305770` | `isdin-fotoprotector-compact-light-spf50-10g-305764` |
| 1.00 | 0.67 | `isdin-fotoprotector-compact-bronze-spf50-10g-305781` | `isdin-fotoprotector-compact-light-spf50-10g-305764` |

#### Tepe (6)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.67 | `tepe-originales-brossettes-interdentaires-jaune-0-7-mm-20-brossettes-234345` | `brossettes-interdentaires-tepe-originales-rose-0-4-mm-20-brossettes-245887` |
| 1.00 | 0.67 | `tepe-originales-brossettes-interdentaires-jaune-0-7-mm-20-brossettes-234345` | `brossettes-interdentaires-tepe-originales-vert-0-8-mm-20-brossettes-245866` |
| 1.00 | 0.67 | `tepe-originales-brossettes-interdentaires-jaune-0-7-mm-20-brossettes-234345` | `brossettes-interdentaires-tepe-originales-bleu-0-6-mm-20-brossettes-245865` |
| 1.00 | 0.67 | `brossettes-interdentaires-tepe-originales-rose-0-4-mm-20-brossettes-245887` | `brossettes-interdentaires-tepe-originales-vert-0-8-mm-20-brossettes-245866` |
| 1.00 | 0.67 | `brossettes-interdentaires-tepe-originales-rose-0-4-mm-20-brossettes-245887` | `brossettes-interdentaires-tepe-originales-bleu-0-6-mm-20-brossettes-245865` |
| 1.00 | 0.67 | `brossettes-interdentaires-tepe-originales-vert-0-8-mm-20-brossettes-245866` | `brossettes-interdentaires-tepe-originales-bleu-0-6-mm-20-brossettes-245865` |

#### Medicube (5)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.75 | `medicube-zero-pore-pad-2-0` | `medicube-zero-pore-pad-toner` |
| 1.00 | 0.75 | `medicube-zero-pore-pad-2-0` | `medicube-zero-pore-pad-2-0-bha` |
| 1.00 | 0.83 | `medicube-pdrn-pink-collagen-gel-mask-4ct` | `medicube-pdrn-pink-collagen-gel-mask-single` |
| 1.00 | 0.60 | `medicube-zero-pore-pad-toner` | `medicube-zero-pore-pad-2-0-bha` |
| 1.00 | 0.67 | `medicube-one-day-exosome-shot-2000` | `medicube-one-day-exosome-shot-7500` |

#### Isispharma (5)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.86 | `isispharma-secalia-ato-baume-relipidant-apaisant-200ml-274273` | `isispharma-secalia-ato-balm-baume-relipidant-apaisant-750ml-302136` |
| 1.00 | 0.80 | `isispharma-uveblock-fluide-invisible-spf50-40ml-252091` | `isispharma-uveblock-fluide-invisible-spf50` |
| 1.00 | 0.71 | `isispharma-neotone-gel-nettoyant-exfoliant-150ml-274241` | `isispharma-neotone-gel-nettoyant-exfoliant-taches-pigmentaires-40ml-302129` |
| 1.00 | 0.86 | `isispharma-sensylia-aqua-solution-micellaire-demaquillante-hydratante-250ml-274247` | `isispharma-sensylia-aqua-solution-micellaire-demaquillante-400ml-274258` |
| 1.00 | 0.67 | `isispharma-secalia-ato-shower-cream-soin-lavant-effet-barriere-750ml-302118` | `isispharma-secalia-soin-lavant-effet-barriere-400ml-274278` |

#### Le Comptoir du Bain (5)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.71 | `le-comptoir-du-bain-savon-de-marseille-verveine-extra-doux` | `le-comptoir-du-bain-savon-de-marseille-verveine-extra-doux-1l-249850` |
| 1.00 | 0.67 | `le-comptoir-du-bain-savon-traditionnel-de-marseille-citron-menthe-1l-263619` | `le-comptoir-du-bain-savon-traditionnel-de-marseille-citron-menthe` |
| 1.00 | 0.67 | `le-comptoir-du-bain-savon-de-marseille-aloe-vera-extra-doux-1l-249857` | `le-comptoir-du-bain-savon-de-marseille-verveine-extra-doux-1l-249850` |
| 1.00 | 0.75 | `le-comptoir-du-bain-savon-de-marseille-aloe-vera-extra-doux-1l-249857` | `le-comptoir-du-bain-savon-de-marseille-aloe-vera-extra-doux` |
| 1.00 | 0.75 | `le-comptoir-du-bain-savon-de-marseille-vanille-miel-extra-doux` | `le-comptoir-du-bain-savon-de-marseille-vanille-miel-extra-doux-1l-249855` |

#### SVR (4)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.60 | `svr-topialyse-baume-lavant` | `svr-topialyse-baume-lavant-24-heures-efficacite` |
| 1.00 | 0.67 | `svr-sun-secure-eau-solaire-spf-50-100ml` | `svr-eau-solaire-sun-secure-spf30` |
| 1.00 | 0.71 | `svr-sun-secure-easy-stick-spf50-fini-invisible` | `svr-sun-secure-easy-stick-spf50-recharge` |
| 1.00 | 0.75 | `svr-xerial-50-extreme-creme-pieds` | `svr-xerial-30-creme-pieds-quotidien` |

#### A-Derma (4)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 1.00 | `aderma-creme-douche-hydratante-3-en-1` | `aderma-creme-douche-hydratante` |
| 1.00 | 0.67 | `a-derma-exomega-control-baume-emollient-anti-grattage-400ml` | `a-derma-exomega-control-lait-emollient-anti-grattage` |
| 1.00 | 0.83 | `a-derma-les-indispensables-pain-surgras-nutritif` | `a-derma-les-indispensables-pain-surgras-nutritif-lot-de-2-x-100g-249233` |
| 1.00 | 0.86 | `a-derma-exomega-control-gel-moussant-emollient-anti-grattage` | `a-derma-exomega-control-gel-moussant-emollient-anti-grattage-lot-de-2-x-500ml-248023` |

#### Avène (4)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.60 | `avene-cleanance-eau-micellaire` | `avene-cleanance-eau-micellaire-visage-yeux` |
| 0.96 | 0.60 | `avene-fluide-solaire-spf50` | `avene-fluide-solaire-spf50-sans-parfum` |
| 1.00 | 0.67 | `avene-spray-enfant-spf50` | `avene-spray-famille-spf50` |
| 1.00 | 0.60 | `avene-poudre-compact-dore-spf50` | `avene-poudre-compact-sable-spf50` |

#### The Ordinary (4)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 1.00 | `the-ordinary-lactic-acid-5-ha` | `the-ordinary-lactic-acid-10-ha` |
| 1.00 | 1.00 | `the-ordinary-retinol-0-2-squalane` | `the-ordinary-retinol-0-5-squalane` |
| 1.00 | 1.00 | `the-ordinary-retinol-0-2-squalane` | `the-ordinary-retinol-1-squalane` |
| 1.00 | 1.00 | `the-ordinary-retinol-0-5-squalane` | `the-ordinary-retinol-1-squalane` |

#### Laboratoires de Biarritz (4)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.80 | `lab-biarritz-creme-solaire-teinte-spf50` | `lab-biarritz-creme-solaire-teinte-spf50-doree` |
| 1.00 | 0.67 | `laboratoires-de-biarritz-gel-lavant-surgras-bio` | `laboratoires-de-biarritz-gel-lavant-surgras-sans-parfum-bio` |
| 1.00 | 0.60 | `laboratoires-de-biarritz-huile-solaire-satinee-spf30` | `laboratoires-de-biarritz-huile-solaire-satinee-spf50` |
| 1.00 | 0.60 | `laboratoires-de-biarritz-lait-solaire-satinee-spf30` | `laboratoires-de-biarritz-lait-solaire-satinee-spf50` |

#### La Roche-Posay (4)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.63 | `la-roche-posay-lot-lipikar-huile-lavante-ap-relipidante-anti-grattage-2x1l-300356` | `la-roche-posay-lipikar-huile-lavante-ap-400ml-lipikar-huile-lavante-ap-ecorecharge-400ml-300582` |
| 1.00 | 0.63 | `la-roche-posay-lot-lipikar-huile-lavante-ap-relipidante-anti-grattage-2x1l-300356` | `la-roche-posay-lot-lipikar-huile-lavante-ap-relipidante-anti-grattage` |
| 1.00 | 0.67 | `la-roche-posay-lipikar-huile-lavante-ap-anti-irritation-eco-recharge-lot-2-x-400ml-301412` | `la-roche-posay-lipikar-huile-lavante-ap-anti-irritation-eco-recharge-lot-2-x` |
| 1.00 | 0.80 | `la-roche-posay-effaclar-eau-micellaire` | `la-roche-posay-effaclar-eau-micellaire-purifiante` |

#### Embryolisse (4)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.75 | `embryolisse-secret-de-maquilleurs-soin-correcteur-anti-cernes-rose-8ml-271352` | `embryolisse-secret-de-maquilleurs-soin-correcteur-anti-cernes-beige-8ml-271351` |
| 1.00 | 0.71 | `embryolisse-soin-perfecteur-de-teint-cc-cream-nude-30ml-302371` | `embryolisse-soin-perfecteur-de-teint-cc-cream-clair-30ml-302375` |
| 1.00 | 0.71 | `embryolisse-soin-perfecteur-de-teint-cc-cream-nude-30ml-302371` | `embryolisse-soin-perfecteur-de-teint-cc-cream-dore-30ml-302390` |
| 1.00 | 0.71 | `embryolisse-soin-perfecteur-de-teint-cc-cream-clair-30ml-302375` | `embryolisse-soin-perfecteur-de-teint-cc-cream-dore-30ml-302390` |

#### Medik8 (3)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.67 | `medik8-crystal-retinal-10-night-serum` | `medik8-crystal-retinal-24-age-defying-night-serum` |
| 0.96 | 0.80 | `medik8-crystal-retinal-10-night-serum` | `medik8-crystal-retinal-3-night-serum` |
| 1.00 | 1.00 | `medik8-crystal-retinal-eye-cream-ceramide-eye-6` | `medik8-crystal-retinal-ceramide-eye-3-cream` |

#### Les 3 Chênes (3)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.64 | `les-3-chenes-color-soin-coloration-permanente-n-4n-chatain-naturel-279615` | `les-3-chenes-color-soin-coloration-permanente-n-3n-chatain-fonce-278134` |
| 1.00 | 0.64 | `les-3-chenes-color-soin-coloration-permanente-n-4n-chatain-naturel-279615` | `les-3-chenes-color-soin-coloration-permanente-n-5g-chatain-clair-dore-278146` |
| 1.00 | 0.64 | `les-3-chenes-color-soin-coloration-permanente-n-3n-chatain-fonce-278134` | `les-3-chenes-color-soin-coloration-permanente-n-5g-chatain-clair-dore-278146` |

#### Petrole Hahn (3)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.67 | `petrole-hahn-creme-colorante-douce-sans-ammoniaque-n-50-chatain-clair-260686` | `petrole-hahn-creme-colorante-douce-sans-ammoniaque-n-40-chatain-naturel-260680` |
| 1.00 | 0.67 | `petrole-hahn-creme-colorante-douce-sans-ammoniaque-n-50-chatain-clair-260686` | `petrole-hahn-creme-colorante-douce-sans-ammoniaque-n-30-chatain-fonce-260677` |
| 1.00 | 0.67 | `petrole-hahn-creme-colorante-douce-sans-ammoniaque-n-40-chatain-naturel-260680` | `petrole-hahn-creme-colorante-douce-sans-ammoniaque-n-30-chatain-fonce-260677` |

#### La Rosee (3)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.80 | `la-rosee-gommage-corps-nourrissant-bio-rechargeable` | `la-rosee-recharge-gommage-corps-nourrissant-bio` |
| 1.00 | 0.75 | `la-rosee-baume-demaquillant-fondant-recharge` | `la-rosee-baume-demaquillant-fondant-rechargeable` |
| 1.00 | 0.80 | `la-rosee-recharge-stick-levres-nourrissant-teinte` | `la-rosee-stick-levres-nourrissant-teinte-framboire` |

#### Ducray (2)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.86 | `ducray-kertyol-p-s-o-baume-hydratant-quotidien-200ml-275484` | `ducray-kertyol-p-s-o-baume-hydratant-quotidien-anti-grattage-400ml-275485` |
| 1.00 | 0.60 | `ducray-sensinol-shampooing-traitant-400ml-275173` | `ducray-sensinol-shampoing-traitant-200ml-287244` |

#### Dermaceutic (2)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 1.00 | `dermaceutic-turn-over-10` | `dermaceutic-turn-over-15` |
| 1.00 | 1.00 | `dermaceutic-activ-retinol-0-5` | `dermaceutic-activ-retinol-1-0` |

#### ACM (2)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 0.96 | 0.71 | `acm-duolys-legere-soin-hydratant-anti-age` | `acm-duolys-riche-soin-hydratant-anti-age` |
| 0.95 | 1.00 | `acm-novophane-ds-shampooing-antipelliculaire` | `acm-novophane-k-shampooing-antipelliculaire` |

#### Eucerin (2)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.63 | `eucerin-anti-age-hyaluron-filler-soin-de-jour-spf30` | `eucerin-hyaluron-filler-elasticity-recharge-soin-de-jour-spf30` |
| 1.00 | 0.71 | `eucerin-anti-pigment-soin-de-jour-teinte-spf30-light` | `eucerin-anti-pigment-soin-de-jour-teinte-spf30-medium` |

#### Missha (2)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.83 | `missha-time-revolution-the-first-essence` | `missha-time-revolution-the-first-treatment-essence-rx` |
| 0.96 | 0.83 | `missha-time-revolution-night-repair-ampoule-5x` | `missha-time-revolution-night-repair-probio-ampoule` |

#### Herbatint (2)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.60 | `phytoceutic-herbatint-6n-blond-fonce-170-ml-275856` | `phytoceutic-herbatint-3n-chatain-fonce-170-ml-275853` |
| 1.00 | 0.60 | `phytoceutic-herbatint-5n-chatain-clair-170-ml-275855` | `phytoceutic-herbatint-3n-chatain-fonce-170-ml-275853` |

#### Mustela (2)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.67 | `mustela-creme-change` | `mustela-creme-pour-le-change` |
| 1.00 | 0.67 | `mustela-creme-vergetures` | `mustela-creme-vergetures-action-3-en-1` |

#### Respire (2)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.67 | `respire-bio-deodorant-stick-fleur-de-coton` | `respire-deodorant-stick-bio-fleur-de-coton` |
| 1.00 | 0.80 | `respire-deodorant-stick-bio-fleur-de-coton` | `respire-recharge-deodorant-stick-fleur-de-coton` |

#### Anua (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.83 | `anua-heartleaf-deep-pore-cleansing-foam` | `anua-heartleaf-quercetinol-pore-deep-cleansing-foam` |

#### Bioderma (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.67 | `bioderma-node-ds-shampoing-antipelliculaire-cuirs-chevelus-sensibles-125ml-259129` | `bioderma-node-a-shampoing-apaisant-cuirs-chevelus-sensibles-irrites-400ml-287181` |

#### Purito (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.60 | `purito-green-cleansing-oil` | `purito-from-green-facial-cleansing-oil` |

#### Dr. Jart+ (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 0.96 | 0.60 | `dr-jart-cryo-rubber-masque-apaisant-36g` | `dr-jart-cryo-rubber-masque-hydratant-36g` |

#### Sol de Janeiro (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.75 | `sol-de-janeiro-brazilian-bum-bum-cream` | `sol-de-janeiro-brazilian-bum-bum-cream-mini` |

#### Nooance (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 1.00 | `nooance-soin-anti-age-nuit-06-pourcent-retinol` | `nooance-soin-anti-age-nuit-1-pourcent-retinol` |

#### CeraVe (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.67 | `cerave-creme-lavante-hydratante-visage-et-corps-nettoie-et-hydrate-sp-473ml-233141` | `cerave-nettoyants-creme-lavante-hydratante-visage-corps-236ml-233136` |

#### Topicrem (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.80 | `topicrem-ultra-hydratant-huile-de-douche` | `topicrem-ultra-hydratant-huile-de-douche-1l-281616` |

#### Geek & Gorgeous (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 1.00 | `geek-gorgeous-a-game-10` | `geek-gorgeous-a-game-5` |

#### Uriage (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 0.97 | 1.00 | `uriage-xemose-c8-huile-lavante-anti-grattage-1l-253345` | `uriage-xemose-c8-huile-lavante-anti-grattage-500ml-268050` |

#### Cos De BAHA (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.75 | `cos-de-baha-azelaic-acid-10-serum` | `cos-de-baha-azelaic-acid-10-serum-jumbo` |

#### Vichy (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.67 | `vichy-capital-soleil-huile-invisible-spf50` | `vichy-capital-soleil-spf30-huile-invisible` |

#### Parogencyl (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.80 | `parogencyl-dentifrice-prevention-gencives-menthe-lot-de-2-x-75ml-248643` | `parogencyl-dentifrice-prevention-gencives-menthe` |

#### Clarification (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.88 | `clarification-la-poudre-lavante-naturelle-avoine-bio-et-acide-hyaluronique-40g-245804` | `clarification-la-poudre-lavante-naturelle-avoine-bio-et-acide-hyaluronique` |

#### Nuxe (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.67 | `nuxe-sun-shampooing-douche-apres-soleil-750ml-280424` | `nuxe-sun-shampoing-douche-apres-soleil-200ml-280174` |

#### René Furterer (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.60 | `rene-furterer-triphasic-progressive-serum-antichute-coffret-8-flac-232665` | `rene-furterer-triphasic-progressive-serum-antichute-cure-de-3-mois-lot-de-2-x-8-300158` |

#### Hyalugel (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.71 | `hyalugel-bain-de-bouche-aphtes-petites-plaies-offert` | `hyalugel-bain-de-bouche-aphtes-petites-plaies-100ml-50ml-offert-238963` |

#### Cicabiafine (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.75 | `cicabiafine-creme-mains-reparation` | `cicabiafine-creme-mains-reparation-intense` |

#### Clarins (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.75 | `clarins-extra-firming-collagen-3-creme-jour-peaux-seches` | `clarins-extra-firming-collagen-3-creme-jour-toutes-peaux` |

#### Vichy Homme (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.75 | `vichy-homme-gel-douche-corps-cheveux-hydra-mag-c-200ml-299448` | `vichy-homme-gel-douche-corps-cheveux-hydra-mag-c` |

#### Patyka (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 0.71 | `patyka-bio-glow-creme-teintee-perfectrice-claire` | `patyka-bio-glow-creme-teintee-perfectrice-doree` |

#### Novexpert (1)

| J(inci) | J(name) | A | B |
|--------:|--------:|---|---|
| 1.00 | 1.00 | `novexpert-me-pro-melanine-la-creme-au-caramel-n-1` | `novexpert-pro-melanine-la-creme-au-caramel-n-2` |

</details>

### Kit / lot markers in slug (74)

Informationnel — un `-lot-de-N-` ou `-coffret-` n'est pas auto-doublon. À examiner si match d'un produit canonique.

- **Klorane** : 12
- **Garancia** : 7
- **Weleda** : 6
- **Elmex** : 6
- **Inava** : 4
- **Fluocaril** : 4
- **Gum** : 4
- **Sensodyne** : 4
- **Ducray** : 3
- **René Furterer** : 3
- **A-Derma** : 2
- **Parodontax** : 2
- **Clarification** : 2
- **Arthrodont** : 2
- **Méridol** : 2

<details><summary>Tous les kits (slugs)</summary>

**A-Derma** : 
- `a-derma-les-indispensables-pain-surgras-nutritif-lot-de-2-x-100g-249233`
- `a-derma-exomega-control-gel-moussant-emollient-anti-grattage-lot-de-2-x-500ml-248023`

**Arthrodont** : 
- `arthrodont-classic-pate-dentifrice-lot-de-2-x-75ml-248052`
- `arthrodont-protect-dentifrice-gel-fluore-lot-de-2-x-75ml-288790`

**Avène** : 
- `avene-cold-cream-pain-surgras-lot-de-2-x-100g-278059`

**Bioderma** : 
- `bioderma-node-shampoing-doux-tous-types-de-cheveux-lot-de-2-x-400ml-300695`

**Caudalie** : 
- `caudalie-the-des-vignes-gel-douche-lot-de-3-x-200ml-301110`

**Clarification** : 
- `clarification-coffret-cheveux-mes-chouchous-edition-limitee-245802`
- `clarification-coffret-duo-poudres-lavantes-naturelles-bio-corps-et-cheveux-40g-245805`

**Dental Care Products** : 
- `bonyf-bonyplus-fixobridge-kit-pour-la-fixation-temporaire-des-protheses-dentaires-7g-278782`

**Dexeryl** : 
- `dexeryl-creme-secheresses-cutanees-lot-de-3-x-50g-301084`

**Ducray** : 
- `ducray-hidrosis-control-anti-transpirant-roll-on-lot-de-2-x-40ml-248040`
- `ducray-extra-doux-shampoing-dermo-protecteur-lot-de-2-x-400ml-300536`
- `ducray-neoptide-expert-serum-capillaire-anti-chute-croissance-lot-de-2-x-50ml-275359`

**Elgydium** : 
- `elgydium-blancheur-dentifrice-lot-de-2-x-75ml-265562`

**Elmex** : 
- `elmex-professional-dentifrice-opti-email-haute-resistance-lot-de-2-x-75ml-263795`
- `elmex-junior-dentifrice-6-12-lot-de-2-x-75ml-233347`
- `elmex-anti-caries-professional-dentifrice-lot-de-2-x-75ml-263258`
- `elmex-kids-dentifrice-3-6-ans-lot-de-2-x-50ml-263763`
- `elmex-sensitive-dentifrice-duo-pack-2x75ml-284047`
- `elmex-anti-caries-expert-orthodontie-lot-de-2-x-75ml-263856`

**Fluocaril** : 
- `fluocaril-cosmetique-bi-fluore-145mg-dentifrice-blancheur-lot-de-2-x-75ml-232594`
- `fluocaril-junior-6-12-ans-dentifrice-gel-fruits-rouges-lot-de-2-x-75ml-236789`
- `fluocaril-cosmetique-bi-fluore-145mg-dentifrice-menthe-lot-de-2-x-75ml-233411`
- `fluocaril-cosmetique-bi-fluore-145mg-dentifrice-gencives-menthe-lot-de-2-x-75ml-285055`

**Garancia** : 
- `garancia-marabout-coffret-cure-express-7-jours-249757`
- `garancia-offre-duo-pack-fee-moi-fondre-booste-fee-moi-fondre-la-nuit-299946`
- `garancia-coffret-larmes-de-fantome-10ml-patchs-en-silicone-offerts-304323`
- `garancia-coffret-mysterieux-repulpant-30ml-pschitt-magique-visage-30ml-offert-304292`
- `garancia-coffret-mysterieuses-mille-et-une-nuits-30ml-mysterieuses-mille-et-un-jour-10ml-offert-304276`
- `garancia-coffret-mysterieux-mille-et-un-jours-30ml-mysterieuses-mille-et-une-nuits-10ml-offert-304278`
- `garancia-coffret-eclair-de-lune-la-foudroyante-30ml-stick-solaire-invisible-15g-offert-305531`

**Gum** : 
- `gum-dentifrice-paroex-gencives-lot-de-3-x-75ml-248883`
- `gum-dentifrice-original-white-blancheur-lot-de-3-x-75ml-248884`
- `gum-brosse-a-dents-n-509-specifique-sensivital-ultra-souple-lot-de-2-300769`
- `gum-dentifrice-paroex-gencives-lot-de-2-x-75ml-248867`

**ISDIN** : 
- `isdin-warts-verrutop-traitement-topique-4-ampoules-lot-de-2-303820`

**Inava** : 
- `inava-brosse-a-dents-20-100-souple-lot-de-2-300770`
- `inava-brosse-a-dents-sensibilite-lot-de-2-300765`
- `inava-20-100-brosse-a-dents-souples-lot-de-4-300851`
- `inava-brosse-a-dents-15-100-chirurgicale-lot-de-2-300771`

**Klorane** : 
- `klorane-duo-spray-shampoing-sec-a-l-ortie-teinte-cheveux-gras-chatains-a-bruns-lot-de-2-x-150ml-300462`
- `klorane-duo-spray-shampoing-sec-teinte-extra-doux-avoine-ceramide-cheveux-chatains-a-bruns-lot-de-2-x-150ml-300239`
- `klorane-bleuet-lotion-florale-demaquillant-yeux-sensibles-lot-de-2-x-200ml-248043`
- `klorane-bebe-calendula-lingette-nettoyante-douce-lot-de-6-x-70-unites-300411`
- `klorane-lin-shampoing-sec-volume-lot-de-2-x-150ml-300825`
- `klorane-bebe-kit-complet-soin-et-toilette-eau-nettoyante-gel-lavant-et-eau-parfumee-303729`
- `klorane-menthe-aquatique-shampoing-sec-detox-anti-pollution-lot-de-2-x-150ml-300475`
- `klorane-quinine-edelweiss-shampoing-fortifiant-lot-de-2-x-400ml-300144`
- `klorane-pivoine-shampoing-apaisant-cuir-chevelu-sensible-lot-de-2-x-400ml-300251`
- `klorane-avoine-shampoing-extra-doux-lot-de-2-x-400ml-299930`
- `klorane-duo-spray-shampoing-sec-a-l-ortie-cheveux-gras-lot-de-2-x-150ml-300441`
- `klorane-duo-spray-shampoing-sec-extra-doux-a-l-avoine-ceramide-lot-de-2-x-150ml-300482`

**Méridol** : 
- `meridol-parodont-expert-dentifrice-lot-de-2-x-75ml-263483`
- `meridol-brosse-a-dents-souple-duo-pack-de-2-233562`

**Neutraderm** : 
- `neutraderm-shampoing-extra-doux-dermo-respect-lot-de-2-x-500ml-301117`

**Parodontax** : 
- `parodontax-dentifrice-blancheur-lot-de-2-x-75ml-274212`
- `parodontax-dentifrice-pate-gingivale-lot-de-2-x-75ml-260704`

**Parogencyl** : 
- `parogencyl-dentifrice-prevention-gencives-menthe-lot-de-2-x-75ml-248643`

**Redken** : 
- `redken-holiday-coffret-all-soft-251999`

**René Furterer** : 
- `rene-furterer-triphasic-reactional-coffret-ampoules-12x5ml-269052`
- `rene-furterer-triphasic-progressive-serum-antichute-coffret-8-flac-232665`
- `rene-furterer-triphasic-progressive-serum-antichute-cure-de-3-mois-lot-de-2-x-8-300158`

**Sensodyne** : 
- `sensodyne-dentifrice-protection-complete-lot-de-2-x-75ml-271626`
- `sensodyne-dentifrice-traitement-sensibilite-lot-de-2-x-75ml-248667`
- `sensodyne-dentifrice-rapide-action-sensibilite-dentaire-lot-de-2-x-75ml-249115`
- `sensodyne-dentifrice-repare-et-protege-menthe-fraiche-lot-de-2-x-75ml-236986`

**Uriage** : 
- `uriage-xemose-huile-lavante-apaisante-corps-peaux-seches-atopiques-1l-lot-de-2-300674`

**Weleda** : 
- `weleda-soin-bucco-dentaire-pate-dentifrice-au-ratanhia-lot-de-2-x-75ml-232076`
- `weleda-soin-bucco-dentaire-gel-dentifrice-vegetal-lot-de-2-x-75ml-232075`
- `weleda-soin-bucco-dentaire-gel-dentifrice-pour-enfant-lot-de-2-x-50ml-249231`
- `weleda-soin-bucco-dentaire-pate-dentifrice-au-calendula-lot-de-2-x-75ml-248859`
- `weleda-calendula-savon-vegetal-bio-lot-de-2-x-100g-301147`
- `weleda-soin-bucco-dentaire-pate-dentifrice-saline-lot-de-2-x-75ml-232077`

</details>
