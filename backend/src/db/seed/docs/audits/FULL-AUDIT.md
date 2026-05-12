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
Cependant, un **drift manuel** (tags présents en DB mais non détectés par l'algo) subsiste :
- **BHA** : 22 produits.
- **AHA** : 13 produits.
- **Polyphenols** : 14 produits.

### 5.2 Overrides AHA/BHA/PHA
111 produits présentent des tags manuels pour des acides situés **au-delà du cap de concentration** (index 10+ dans l'INCI).
- **AHA** (48 overrides) : Principalement `Lactic Acid`.
- **BHA** (44 overrides) : Principalement `Salicylic Acid`.
- **PHA** (19 overrides) : `Gluconolactone`.

**Action** : Décider si ces ingrédients à faible concentration justifient un tag (ex: acide salicylique comme conservateur vs actif).

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
