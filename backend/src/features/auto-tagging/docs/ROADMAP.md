# Auto-tagging — Roadmap

> **À propos :** dette ouverte du sous-système `features/auto-tagging/`. Pour
> l'architecture (6 passes + orchestrator + runners), voir [`AUTO-TAGS.md`](./AUTO-TAGS.md).
> Pour le contexte général du seed, voir [`../../../db/seed/docs/ROADMAP.md`](../../../db/seed/docs/ROADMAP.md).

**Principe directeur (2026-05-12)** : le tagging produit est **100 % automatique**. Aucune curation manuelle de tags marque par marque. Toute couverture insuffisante = défaut du pipeline auto-tag, pas tâche de saisie.

---

## 1. Couverture `primary` — 1101 produits sans tag primary

Audit DB 2026-05-12 (après re-run `runners/backfill.ts --write`, 12 494 lignes secondary/avoid insérées) :

| category | no_primary | total |
|---|---|---|
| skincare | 1052 | 2850 |
| bodycare | 41 | 385 |
| haircare | 8 | 377 |
| dental / complement / solaire | 0 | 590 |
| **Total** | **1101 / 4202** | |

Top marques sans primary (K-beauty scrappée, jamais curée dans `productTagData`) : Pyunkang Yul 78, MISSHA 72, SOME BY MI 69, Dr. Ceuracle 66, MIXSOON 49, COSRX 48, Mary&May 41, SKINFOOD 41, ISNTREE 40, SKIN1004 40, Anua 39, Purito 38…

**Cause racine archi** : `primary` vient uniquement de `productTagData.groups.primary` curé manuellement dans les `*.seed.ts`. Le runner `runners/backfill.ts` ne génère que secondary/avoid.

**Direction** : étendre `runners/backfill.ts` (et `orchestrator.ts`) pour générer `primary` automatiquement depuis les signaux algo-derm (top concern / category / actif-class détectés). Définir règles de promotion `secondary → primary` (ex: confiance algo-derm > seuil, premier tag par axe, etc.).

- [ ] **Spec règles de promotion `primary` auto** (concern dominant, actif-class principal, category par kind/INCI).
- [ ] **Implémenter** dans `orchestrator.ts` + `runners/backfill.ts`.
- [ ] **Re-run backfill --write**, vérifier no_primary → 0 sur skincare/bodycare/haircare.
- [ ] **Tests** seed-data-integrity + audit gold-set inchangé.

---

## 2. Couverture autres axes

Une fois `primary` auto livré, points ouverts :
- [ ] `skin_type` peu rempli — algo-derm donne signal, vérifier seuils.
- [ ] Labels absents (`sans-parfum`, etc.) — pipeline formula manque overrides.
- [ ] Concentration INCI non utilisée — ouvre `percent-claim` pass.

---

## 3. Dette résiduelle ex-§8

Historique : [`../../../db/seed/docs/_archive/auto-tags-roadmap.md`](../../../db/seed/docs/_archive/auto-tags-roadmap.md). Comment ça marche : [`AUTO-TAGS.md`](./AUTO-TAGS.md).

- [ ] **O3** — audit dédié `actif-class` (étendre `runners/audit.ts` à la passe 2, stats hit/agree/new par cluster). Effort S.
- [ ] **F5** — pipeline Brier/ECE pour passe 1 (concerns / skin types / absence) si on calibre les seuils algo-derm un jour. Defer sinon. Effort XS.
- [ ] **`texture-mousse` / `texture-stick`** — non dérivables INCI seul. Bloqué par `products.texture = NULL` (~3 700 produits) — pipeline d'extraction texture à inventer (description/notes parsing, pas admin UI).
- [ ] **`peau-mixte`** — Tier 3, débloqué par `products.texture` populé (pattern : T-zone gel-cream + niacinamide top 8).

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
