# Audit complet de la base de données — Aurore

> **Date de l'audit** : 2026-05-12
> **Statut** : Critique (779 violations de cohérence détectées)
> **Baseline** : `backend/src/db/seed/docs/STATE.md` (Architecture)

Ce document fournit un état des lieux exhaustif de la base de données, couvrant les statistiques de volume, l'intégrité relationnelle, la qualité des données INCI et la taxonomie.

---

## 1. Résumé exécutif (TL;DR)

La base de données est structurellement saine mais souffre d'une dérive importante de la **cohérence domaine-tagging** suite à l'expansion multi-domaines (Skincare → Haircare/Dental).

| Métrique | Valeur | État |
|---|---|---|
| **Produits** | 4 202 | 🟢 Volume robuste (2 850 skincare) |
| **Ingrédients** | 688 | 🟢 Bien structuré (665 avec tags) |
| **Cohérence relationnelle** | **0 violations** | 🟢 **Résolu** (2026-05-12) |
| **Couverture INCI** | 55.4 % | 🟡 Moyen (2 327 / 4 202 produits) |
| **Qualité INCI** | 78.8 %/75.4 %/80.3 % | 🟢 Plateau définitif (2026-05-12) — 55 single-token / 56 no-comma restants irréductibles |
| **Doublons** | 150 paires | ✅ Résolu 2026-05-12 (0 vrai doublon — tout = variantes légitimes) |
| **Utilisateurs** | 1 | ⚪ Environnement de développement |

~~**Priorité 1** : Nettoyer les 779 violations de tagging~~ ✅ Résolu 2026-05-12.
~~**Priorité 1** : Résoudre les 150 paires de doublons intra-source.~~ ✅ Résolu 2026-05-12 (0 vrai doublon).
~~**Priorité 2** : Améliorer la couverture INCI et fixer les pathologies de formatage.~~ ✅ Plateau atteint 2026-05-12.
**Priorité 2** : Auto-tagging primary — 1 101 produits sans tag primary (voir `features/auto-tagging/docs/ROADMAP.md`).

---

## 2. Statistiques de volume (Inventaire)

### 2.1 Produits par domaine

Total : **4 202** produits.

| Catégorie | Quantité | Top Kind |
|---|---|---|
| **Skincare** | 2 850 | `moisturizer` (918), `serum` (495) |
| **Solaire** | 427 | `sunscreen` (399) |
| **Bodycare** | 385 | `body-wash` (182) |
| **Haircare** | 377 | `shampoo` (276) |
| **Dental** | 147 | `toothpaste` (96) |
| **Complement** | 16 | `gelule` (6) |

**Observation** : Le catalogue est dominé par la pharmacie FR (SVR, La Roche-Posay, Avène) et la K-Beauty (COSRX, Anua). L'audit `audit-product-kinds` confirme une classification 100% cohérente (0 drift détecté).

### 2.2 Ingrédients & Tags

- **Ingrédients** : 688 au total.
  - Skincare : 447
  - Haircare : 183
  - Dental : 32
- **Tags (Définitions)** :
  - Produits : 230 définitions (69 339 assignations).
  - Ingrédients : 187 définitions (3 324 assignations).

---

## 3. Audit de cohérence (Qualité & Intégrité)

### 3.1 ~~Violation majeure : `tag-product-domain-consistency` (779 cas)~~ ✅ Résolu 2026-05-12

779 `tag_products` cross-domaine supprimés (bidirectionnel : skincare tags sur haircare + haircare tags sur skincare). Pipeline auto-tag patché (`write.ts` + `backfill/main.ts`) — garde `DOMAIN_PRODUCT_FILTER_CATEGORIES` avant tout insert. `just audit-db` → 0 violation.

---

## 4. Qualité INCI & Data Ingest

### 4.1 État du corpus

- **Produits avec INCI** : 4 077 produits analysés via `audit-inci-quality`.
- **Match-rate moyen (algo-derm)** : **78.8 %** (FR skincare) | **75.4 %** (FR other) | **80.3 %** (non-FR) — plateau définitif (2026-05-12).

### 4.2 Pathologies de formatage
- **very-short** (39 produits) : Souvent des objets non-cosmétiques (brossettes) ou INCI minimalistes (sticks).
- **single-token** (~~65~~ → **55** produits) : `resplit-single-token.ts` livré 2026-05-12, 10 récupérés. Restant irréductibles.
- **no-comma** (~~66~~ → **56** produits) : Idem resplit. Restant irréductibles.

### 4.3 Opportunités de Match (Top Unmatched)
✅ **Résolu 2026-05-12** — 38 tokens ajoutés à `algo-derm/curated.generated.json` (30 batch evidence + 8 FR restants). Plus aucun token FR ≥ 12 occ non matché. Tokens irréductibles restants : ≤ 11 occ, ROI < 0.02 pt/token.

---

## 5. Audit des Actifs (Auto-tagging)

### 5.1 Agreement et Drift
L'audit `audit-actif-class` montre un accord de **100%** sur les clusters majeurs (Vitamine E, Acide Hyaluronique, Polyphenols).

**Drift initial (2026-05-12)** : 82 cas (manual_only across 11 clusters). Classifié par `runners/audit/drift-classify.ts` en 3 buckets :

| Bucket | Count | Action |
|---|---|---|
| `pos-cap` — actif présent INCI mais past position cap | 42 | À traiter séparément (décision : relax cap ou accepter drift) |
| `false-pos` mistags manuels — actif absent INCI | 17 | ✅ DELETE 2026-05-12 (`drift-cleanup.ts`) |
| `false-pos` bug algo (FR translate, `lactobacillus/X ferment` substrate strip, `INGREDIENT (ALIAS)` parens strip) | ~21 | Tickets #16-#19 dans [`docs/algo/algo-derm-aurore-integration.md`](../../../../../../docs/algo/algo-derm-aurore-integration.md) §3.6 |
| `parse-fail` — INCI manquant/cassé | 2 | Data quality |

**État post-cleanup (2026-05-12)** : drift = 63 (21 false-pos = bugs algo + 42 pos-cap).

**État post-#16/#17/#18/#19 (2026-05-13)** : drift = 48 (6 false-pos + 42 pos-cap). Tickets fermés :
- **#16 livré** — parser algo-derm : `acide <stem>ic de <mod>` → `<mod> <stem>ic acid` (regex `RE_ACIDE_DE_MOD` avant `RE_ACIDE`, stem restreint au suffixe `-ic`). Recovered `jumiso-waterfull-hyaluronic-acid-cleansing-foam` (BHA).
- **#17 livré** — parser algo-derm : bare `[mod] ascorbique` + trailing-mod `acide ascorbique [mod]` → `[mod] ascorbic acid`. Recovered `anua-peach-70-niacin-serum`.
- **#18 livré** — aliases Aurore parens-stripped : `green tea` (polyphenols) + `vitamin e` / `vitamine-e` (vitamin-e). Recovered deliverance-serum, beauty-of-joseon-red-bean-water-gel, isispharma-xerolan-spray. Aliases `cocoa`/`cacao`/`theobroma cacao*` rejetés par audit precision (cocoa butter emollient ubiquitaire).
- **#19 livré** — Aurore raw-INCI scan : `RAW_SCAN_SLUGS = {polyphenols}` re-scanne la chaîne raw lowercased contre les patterns du cluster, contourne le substrate-strip d'`applyCompositeFerment` côté algo-derm. Recovered 10 produits polyphenols (mixsoon ×2, missha ×3, garancia ×2, numbuzin, respire, dr-ceuracle). agree% polyphenols maintenu à 100 % (+10 recall, 0 over-tag).

**État post-azelaic + FR ascorbic (2026-05-13 part 1)** : drift = 42 (0 false-pos + 42 pos-cap + 2 parse-fail). 6 FP résiduels fermés via :
- Cluster tyrosinase-inhibitors : `azelaic acid` + `acide azélaïque` ajoutés (Skinoren, Anua, Ducray, ACM, Ordinary…). Recovered anua-soothing-pad-azelaic-10-hyaluron. +45 new auto-tags (manual sous-tagué).
- Cluster vit-C : `acide ascorbic` (forme post-normalize FR résiduelle). Recovered mary-may-glutathione-eye-cream-special-set.
- drift-cleanup +4 entries APPLIED : cosrx-retinol-01-cream (marketing lie), garancia-trousse-voyage-2025-303627 (coffret tagué avec union contenus).

**État post-parse-fail + baseline (2026-05-13 part 2)** : drift = 42 (0 FP + 42 pos-cap + 0 parse-fail), tyrosinase 100 %. Items fermés :
- **Parse-fail 2 → 0** : mary-may-blackberry-complex-glow-wash-off-pack avait INCI vide en DB → re-scrape INCIDecoder (EN canonique) → UPDATE products.inci. 2 cluster flags (vit-e + hyaluronic-acid) = même SKU double-comptage. Tocopherol + Hydrolyzed Hyaluronic Acid présents en INCI → manual tags légit.
- **Tyrosinase 76 % → 100 %** : 45 azelaic-line products promus en baseline manuel (acm-azeane, ducray melascreen/keracnyl, ordinary, dr-sams, anua, cos-de-baha, nine-less, theramid azid, colibri, svr sebiaclear, bioderma pigmentbio, isispharma teen-derm/ruboril, inkey, typology, tirtir, vt, medicube…). Tous ont AZELAIC ACID en INCI. Décision : algo trust > manual missing.

**État post-pos-cap cleanup (2026-05-13 part 3)** : drift = 35 (0 FP + 35 pos-cap + 0 parse-fail). Cleanup overrides AHA/BHA/PHA cap-10 §5.2 livré :
- 40 paires (productSlug, tagSlug) supprimées via `aha-bha-pha-overrides.ts APPLY=1`. Politique : `keep` = marketed exfoliant (slug/name carrying acid marker), acne/pigmentation product à pos ≤ 19, `delete` = body-wash/hair/cleanser rinse-off ou pos ≥ 20 ou pos 15-19 hors acné/pigmentation. Borderline (pos 11-14 hors marketing/acné) revue manuelle.
- 7 pos-cap retirés du drift (cleanser/oil/mask/eye-cream/essence où l'acide est inert past cap), 35 résiduels = produits gardés (Sebiaclear, Acniben, Keracnyl, Sebium, Dermaceutic, Medicube exosome, Lierac stop-boutons, Filorga Sleep&Peel, Dermalogica Superfoliant, Medik8 Surface Radiance, etc.) où le marketing/positionnement acne-pigmentation justifie le tag malgré la chimie.

### 5.2 Overrides AHA/BHA/PHA — RÉSOLU (2026-05-13)
État post-cleanup : 70 overrides résiduels (AHA 21 / BHA 36 / PHA 13) — tous classés `keep` par la politique :
- Marketed exfoliant (`MARKET_MARKERS` : aha/bha/pha/salicylic/glycolic/mandelic/peel/foliant/exfoliant…) → tag conservé même past cap.
- Anti-acne (`ACNE_MARKERS` : sebium/sebiaclear/acniben/keracnyl/normaderm/effaclar/blemish/anti-imperfection/pore-…) + pos ≤ 19 → tag adjunct conservé.
- Anti-pigmentation (`PIGMENTATION_MARKERS` : depiwhite/melaclear/dark-spot/brightening/eclaircissant/neotone/meno-5…) + pos ≤ 19 → idem.

Implémentation : `runners/audit/aha-bha-pha-overrides.ts` (`CSV_DIR=` split auto delete/keep/borderline, `APPLY=1 APPLY_FROM_CSV=` destructive). Cleanup historique : 110 overrides → 40 supprimés (29 auto-delete + 11 borderline-promoted, moins 4 false-deletes reclassés keep : cerave-sa ×2 / acm-boreade / numbuzin No.5 pad).

---

## 6. Audit des Doublons

Le script `audit-imported-products` détecte **150 paires de doublons intra-source**.
Review manuelle 2026-05-12 : **0 vrai doublon**. Les 150 paires sont toutes des faux positifs :
- 119 paires flaggées (`num-diff`, `color-diff`, `size-mm`, `model-variant`, `tint-diff`) = variantes quantité/couleur/taille/modèle légitimes.
- 31 paires sans flag = faux positifs INCI (ex : Klorane gels douche à formula identique mais fragrances distinctes, elmex blancheur vs formule base, cire froide visage vs corps).

---

## 7. Gaps architecturaux identifiés

1. **Contraintes DB** : Pas de `CHECK CONSTRAINT` au niveau PostgreSQL pour `products.category`, `products.kind` ou `products.unit`.
2. **Taxonomie Haircare** : Encore pauvre. L'usage de tags "doubles" (ex: `hydratant` peau vs `hydratant` cheveux) n'est pas encore totalement unifié.

---

## 8. Recommandations & Roadmap

### Court terme (Immédiat)
1. ~~**Remapping des tags Haircare**~~ ✅ Résolu (suppression systématique).
2. ~~**Traitement des Doublons** : Investiguer les 150 paires intra-source via `just dedupe-product-variants`.~~ ✅ Résolu.
3. **Fix formatage INCI** : Utiliser `resplit-single-token.ts` pour les 65 produits SVR/Bioderma.

### Moyen terme
1. **Enrichir Evidence DB** : Ajouter les top unmatched (`malachite extract`, `dimethyl isosorbide`) à `algo-derm`.
2. **Arbitrer les Overrides** : Revoir la politique de tagging des acides à faible concentration (< 1%).

---
*Audit généré par Gemini CLI. Références : `audit-db.ts`, `stats-db.ts`, `INCI-QUALITY-AUDIT.md`.*
