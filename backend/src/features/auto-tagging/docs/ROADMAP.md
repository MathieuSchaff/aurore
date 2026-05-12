# Auto-tagging — Roadmap

> **À propos :** dette ouverte du sous-système `features/auto-tagging/`. Pour
> l'architecture (6 passes + orchestrator + runners), voir [`AUTO-TAGS.md`](./AUTO-TAGS.md).
> Pour le contexte général du seed, voir [`../../../db/seed/docs/ROADMAP.md`](../../../db/seed/docs/ROADMAP.md).

**Principe directeur (2026-05-12)** : le tagging produit est **100 % automatique**. Aucune curation manuelle de tags marque par marque. Toute couverture insuffisante = défaut du pipeline auto-tag, pas tâche de saisie.

---

## 1. Couverture `primary` — 1101 produits sans tag primary

Audit DB 2026-05-12 (après re-run `runners/backfill/main.ts --write`, 12 494 lignes secondary/avoid insérées) :

| category | no_primary | total |
|---|---|---|
| skincare | 1052 | 2850 |
| bodycare | 41 | 385 |
| haircare | 8 | 377 |
| dental / complement / solaire | 0 | 590 |
| **Total** | **1101 / 4202** | |

Top marques sans primary (K-beauty scrappée, jamais curée dans `productTagData`) : Pyunkang Yul 78, MISSHA 72, SOME BY MI 69, Dr. Ceuracle 66, MIXSOON 49, COSRX 48, Mary&May 41, SKINFOOD 41, ISNTREE 40, SKIN1004 40, Anua 39, Purito 38…

**Cause racine archi** : `primary` vient uniquement de `productTagData.groups.primary` curé manuellement dans les `*.seed.ts`. Le runner `runners/backfill/main.ts` ne génère que secondary/avoid.

**Direction** : étendre `runners/backfill/main.ts` (et `orchestrator.ts`) pour générer `primary` automatiquement depuis les signaux algo-derm (top concern / category / actif-class détectés). Définir règles de promotion `secondary → primary` (ex: confiance algo-derm > seuil, premier tag par axe, etc.).

- [ ] **Spec règles de promotion `primary` auto** (concern dominant, actif-class principal, category par kind/INCI).
- [ ] **Implémenter** dans `orchestrator.ts` + `runners/backfill/main.ts`.
- [ ] **Re-run `WRITE=1 just backfill-auto-tags`**, vérifier no_primary → 0 sur skincare/bodycare/haircare.
- [ ] **Tests** seed-data-integrity + audit gold-set inchangé.

---

## 2. Couverture autres axes

Une fois `primary` auto livré, points ouverts :
- [ ] `skin_type` peu rempli — algo-derm donne signal, vérifier seuils.
- [ ] Labels absents (`sans-parfum`, etc.) — pipeline formula manque overrides.
- [x] Concentration INCI — passe 5x `percent-claim` livrée (`passes/percent-claim-detection.ts`).

---

## 3. Dette résiduelle ex-§8

Historique : [`../../../db/seed/docs/_archive/auto-tags-roadmap.md`](../../../db/seed/docs/_archive/auto-tags-roadmap.md). Comment ça marche : [`AUTO-TAGS.md`](./AUTO-TAGS.md).

- [x] **O3** — audit déduit `actif-class` livré : `runners/audit/actif-class.ts` (stats hit/agree/new par cluster, `just audit-actif-class`).
- [ ] **F5** — pipeline Brier/ECE pour passe 1 (concerns / skin types / absence) si on calibre les seuils algo-derm un jour. Defer sinon. Effort XS.
- [x] **`texture-stick`** — livré via `detectTextureStickFromName` (name-based, pas de dépendance `products.texture`).
- [ ] **`texture-mousse`** — livré via `detectTextureFromField` uniquement quand `products.texture = 'mousse'`. Pas de fallback nom/INCI (foaming surfactants ambigus). Bloqué par `products.texture = NULL` — nécessite curation admin ou parser description/notes.
- [ ] **`peau-mixte`** — Tier 3, débloqué par `products.texture` populé (pattern : T-zone gel-cream + niacinamide top 8).
- [ ] **Drift BHA/AHA/PHA pos-cap** — 42 tags manuels manqués par algo (21 BHA, 13 AHA, 8 PHA), acide past position cap. Décision pendante (relax cap / accepter / case-by-case). État 2026-05-13 : 0 false-pos, 0 parse-fail, tyrosinase 100 % agree. Cf. FULL-AUDIT §5.2 + `docs/algo/algo-derm-aurore-integration.md` §3.6.

---

## 4. Problèmes connus pipeline filtres

| ID | Sévérité | Problème | Piste |
|----|---|---|---|
| P2 | 🔴 Bloquant | `products.kind` : 25 valeurs hétérogènes → inutilisable en filtre. | Remplacer par `product_type` tag (auto-derivé). |
| P5 | 🟡 Moyen | Recherche texte incohérente : fuzzy (produits, pg_trgm) vs simple ILIKE (ingrédients). | Harmoniser. |
| P6 | 🟢 Faible | Tri popularité absent. `price_asc`/`price_desc`/`newest`/`name`/`random` livrés. | Ajouter tri popularité si métrique disponible. |

---

## 5. Cas spécifiques tag — solaires absents

- [ ] **Solaires** (Actinica Lotion, Colibri Daily SPF50) — quand ajoutés, l'auto-tag doit poser `grossesse-compatible` (avoid) sur filtres chimiques. Vérifier que la passe filtres chimiques couvre ces produits.

Règles de rattrapage `avoid` (rappel, doivent être dans le pipeline auto) :
- Rétinoïde → `peau-reactive` + `barriere-cutanee-alteree` + `grossesse-compatible`
- AHA fort (>8%) → `peau-reactive` + `barriere-cutanee-alteree`
- BHA 2% → `peau-sensible`
- Acide azélaïque 10%+ → `peau-reactive` + `barriere-cutanee-alteree` (sauf rosacée validée cliniquement)
- Filtres chimiques → `grossesse-compatible` (solaires)

---

## 6. Politique concentration AHA/BHA/PHA (111 overrides)

> Source : `audits/FULL-AUDIT.md` §5.2 (audit 2026-05-12).

111 produits avec tags manuels pour acides au-delà du cap de concentration (index INCI ≥ 10) :
- **AHA** (48) : principalement `Lactic Acid`.
- **BHA** (44) : principalement `Salicylic Acid`.
- **PHA** (19) : `Gluconolactone`.

- [ ] **Décider la politique** : acide conservateur (< 0.5%) → pas de tag actif, ou conserver avec flag `low-conc` ?
- [ ] **Implémenter** dans `orchestrator.ts` une fois la politique arrêtée (ajuster cap-index ou règle d'override explicite).
