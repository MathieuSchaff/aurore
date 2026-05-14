# Auto-tagging — Roadmap

> **À propos :** dette ouverte du sous-système `features/auto-tagging/`. Pour
> l'architecture (6 passes + orchestrator + runners), voir [`AUTO-TAGS.md`](./AUTO-TAGS.md).
> Pour le contexte général du seed, voir [`../../../db/seed/docs/ROADMAP.md`](../../../db/seed/docs/ROADMAP.md).

**Principe directeur** : tagging produit 100 % automatique. Aucune curation manuelle marque par marque. Toute couverture insuffisante = défaut pipeline, pas tâche de saisie.

---

## Questions ouvertes — gold set & calibration

Questions non tranchées sur le sous-système de validation. Aucune urgente, mais elles conditionnent comment on fait évoluer le gold set.

### Q1 — Scope : faut-il élargir les 16 tags focus ?

Tags avec détecteur actif mais **zéro mesure de qualité** aujourd'hui :
`grossesse-compatible` (Tier 1/2 bien défini, annoter = vérifier INCI), `vegan` (pattern matching, facile à annoter), `fini-mat` (passe 4, partiellement dans focus — mais les 3 sensoriels couverts sont texture, pas mat), `occlusif`, `reparation-cutanee`, `sans-parfum`, `peau-sensible` avoid.

Trade-off : plus de tags = corpus plus grand à maintenir. Options :
- Élargir aux tags avoid (`grossesse-compatible` Tier 1 au moins) — haute valeur métier, critères stricts, annotation rapide.
- Laisser les passes 4 non-focus comme "non calibrées" et l'assumer explicitement.

### Q2 — Séparer corpus régression et corpus calibration ?

Actuellement un seul corpus fait les deux : régression (oracle figé) et calibration (cible pour ajuster les règles). Sur 80 produits, optimiser les règles directement sur le corpus = **overfitting structurel** : les règles passent le gold set mais peuvent sur-ajuster à ce sous-ensemble.

Option simple : split 60/20 — 60 produits non touchés pour régression, 20 pour tester des ajustements de règles avant merge. Nb : bootstrap stratifié doit respecter le split.

### Q3 — Produits orphelins non détectés par défaut

Si un slug dans `annotations.json` disparaît de la DB (seed changé, slug renommé), le benchmark **ignore silencieusement** ce produit. `STRICT=1` détecte ça, mais n'est pas le mode CI.

Option : passer `STRICT=1` en mode CI par défaut, ou ajouter une validation séparée `just gold-set-validate` (lecture seule, exit 1 sur orphelins) sans lancer le benchmark complet.

### Q4 — Déclencheur de re-benchmark automatique

Aujourd'hui `just audit-gold-set` est manuel. Quand un pattern change dans `actif-class-detection.ts` ou dans `passes/formula/`, rien n'oblige à relancer le benchmark.

Option : hook pre-push (ou job CI séparé) qui, si `passes/` ou `gold-set/` est modifié, exécute `just audit-gold-set` et fail si F1 macro < seuil baseline. Nécessite de stocker le baseline F1 quelque part (fichier JSON commité, ou `tag-budgets.ts` étendu avec F1 floors par tag).

---

## Open items — tous defer

Aucun chantier actionnable court terme.

| Item | Raison defer | Trigger pour reprendre |
| --- | --- | --- |
| §4 F5 — pipeline Brier/ECE passe 1 | XS, utile seulement si recalib seuils algo-derm planifiée | Recalibration seuils algo-derm |
| §4 `texture-mousse` | Rinse-off cleansers exclus by design des `texture-*`. ~6 leave-on candidates par nom | Curation admin élargit corpus leave-on mousse |
| §4 `peau-mixte` Aurore-side | algo-derm B6 (0.4/0.4) fire sur 2 produits seul du corpus skincare | Calibration B3 élargit, ou texture data dispo |
| §5 P6 — tri popularité | `user_products` RLS-isolé + Aurore solo-user → 0-1 ajout/produit, signal nul | N/A (drop si confirmé) |
| §6 `peau-reactive` / `barriere-cutanee-alteree` product slugs | Proxy `peau-sensible` côté product suffit. Concept barrière reste ingrédient-only | Décision design produit explicite |
| §6 retinoid/BHA seul leave-on → `peau-sensible` avoid (dose-gated) | Shipped 2026-05-14 via `detectConcentrationAvoidTags` : retinol ≥ 0.25 %, salicylic ≥ 1.5 %. Skip définitif retiré — dose-gating sépare high-dose des dermo-friendly (LRP Retinol B3 0.3 %, Cicaplast trace) | ✅ Shipped |
| §6 AHA / azélaïque fort | Glycolic / azelaic Class B audit (MAE 3-4 %) : solver biaisé bas sur high-dose. C1.b tuning `max_concentration_pct` testé 2026-05-14 sur 7 actifs : urea −0.93 MAE, vit-C −0.72 (kept), azelaic/glycolic/lactic/mandelic regressions (reverted — bimodal claim distributions). Plafond per-ingredient priors atteint. | **C2 — pass `product_ingredients.concentration_value` as `context.knownConcentrations`** : Aurore a 507 claims DB, algo-derm support déjà le pinning solver. Plus prometteur que tuner les priors. |
| **Pass 2 V2 — solver calibration debt** | Solver QP overshoot zone trace sur actifs uncapped (retinal pos 11/14 → 2.58 %). Bloque retinal / HPR / bakuchiol dose-gating. C1.a non démarré — déprio post-C2 (claims pinning peut suffire). | Algo-derm C1.a — fix solver pseudo-counts pour actifs uncapped trace + variance posterior preservation (CI shrunk de 51 → 42 % post-solver). À retester après C2 ship. |

---

## Cas spécifiques tag — solaires & avoid actifs (§6)

**Pipeline référence** : `peau-reactive` / `barriere-cutanee-alteree` existent en `SKINCARE_INGREDIENT_TAG_SLUGS` uniquement (taxonomie ingrédient), **pas** en `SKINCARE_PRODUCT_TAG_SLUGS`. Proxy product-side = `peau-sensible`. Concentration data absente de `products.inci` (uniquement `products.percent_claims` partiel).

| Règle | Pipeline | Statut |
| --- | --- | --- |
| Rétinoïde → `grossesse-compatible` (avoid) | algo-derm `grossesse_risque` MAPPED_TAG (TAG_DEFS v7) | ✅ Migré algo-derm |
| Formaldehyde donors → `grossesse-compatible` (avoid) | algo-derm `grossesse_risque` (flag `formaldehyde_donor`) | ✅ Migré algo-derm |
| BHA leave-on top 10 → `grossesse-compatible` avoid | algo-derm `grossesse_risque` Tier 2 (`context.leaveOn`) | ✅ Migré algo-derm |
| Oxybenzone/homosalate → `grossesse-compatible` (solaires) | algo-derm `grossesse_risque` Tier 2 (`context.formulaType === "sunscreen"`) | ✅ Migré algo-derm |
| HE risque (peppermint/clary sage/rosemary oil) → `grossesse-compatible` avoid | algo-derm `grossesse_risque` Tier 2 (genus + "oil" top 8) | ✅ Migré algo-derm |
| Rétinoïde → `peau-sensible` avoid (combo retinoid + AHA/BHA) | `passes/cross-signal-detection.ts:detectCrossSignalAvoidTags` | ✅ |
| Rétinol standalone leave-on dose → `peau-sensible` avoid | `detectConcentrationAvoidTags` — `retinol.solverMeanPct ≥ 0.25` (cap EU 0.3, catches at-cap = high-dose retinol while skipping LRP Retinol B3-style trace) | ✅ dose-gated (Pass 2 V2) |
| BHA standalone leave-on dose → `peau-sensible` avoid | `detectConcentrationAvoidTags` — `salicylic.solverMeanPct ≥ 1.5` (cap EU 2, skips Cicaplast Baume B5 trace) | ✅ dose-gated (Pass 2 V2) |
| Retinal / HPR dose → `peau-sensible` avoid | Solver QP overshoot en zone trace sur actifs uncapped (retinal pos 11/14 → solver 2.58 % alors que concentration réelle ≈ 0.05 %) | ❌ Bloqué — débloque-able post C1 (algo-derm calibration solver pseudo-counts) |
| AHA fort (>8%) → `peau-sensible` + `barriere-cutanee-alteree` | Glycolic-acid Class B (MAE 3.21, CI 71 %) — biais bas systématique sur high-dose | ⚠️ Débloque-able post C1 + ajout barriere-cutanee-alteree au taxonomy product-side |
| Azélaïque 10%+ → reactive + alteree | Azelaic-acid Class B (MAE 4.03, CI 71 %) — biais bas (azelaic 30 % → solver 11 %) | ⚠️ Débloque-able post C1 + ajout azelaic actif-class côté algo-derm |

**Note evidence-based** : `oxybenzone`/`homosalate` seuls retenus (consensus dermo). Avobenzone/octocrylene/Tinosorb/Mexoryl sans recommandation grossesse. Rule roadmap "tous les filtres chimiques" plus conservatif que guidance pro — garder Tier 2 actuel.

---

## Boucle dev & tests

**Modif Aurore seule** :

```bash
just ts-verify
just test-dev "auto-tag"
```

**Modif algo-derm** :

```bash
# Dans /home/schaff/Mathieu/projets/algo-derm
npm run build && node --test test/*.test.mjs

# Retour dans aurore
just vendor-algo-derm
just ts-verify
just test-dev "auto-tag"
```

**Si `bun install` plante avec `IntegrityCheckFailed extracting tarball from algo-derm`** : `npm pack` produit un tarball mtime-dépendant, `bun.lock` peut stocker un hash périmé. Recovery :

```bash
rm bun.lock
rm -rf node_modules backend/node_modules shared/node_modules frontend/node_modules
bun install
just reinstall-backend
```

**Piège silencieux post-vendor** : après `just vendor-algo-derm`, `bun install --force` n'a pas toujours re-extrait le tarball — `node_modules/algo-derm/dist/engine/tags.d.ts` reste sur l'ancienne `TAG_DEFS_VERSION`. Symptôme : `just ts-verify` casse au pin `CALIBRATED_FOR_TAG_DEFS_VERSION` alors que source et tarball sont OK. Recovery :

```bash
rm bun.lock
rm -rf node_modules backend/node_modules shared/node_modules frontend/node_modules
bun pm cache rm
bun install
```

**Tests préexistants à ignorer** (non liés auto-tagging algo-derm) :

- `Product Service > writes auto-tags when matching defs exist`
- `ingredient-slugs split refactor`

---

## Calibration drift — recipes

Modes via `just audit-auto-tags` (env vars). Lecture seule, no INSERT.

**Détecter drift** :

```bash
just audit-auto-tags-check          # CHECK=1 — exit 1 si FAIL vs TAG_HIT_RATE_BUDGET
```

**Re-baseliner `TAG_HIT_RATE_BUDGET`** (après bump `TAG_DEFS_VERSION` ou nouveau corpus) :

```bash
DUMP_BUDGETS=1 just audit-auto-tags    # bloc TS prêt-à-coller
# 1. coller dans passes/tag-budgets.ts
# 2. retighten manuellement les 4 sensibles (comedogene / non-comedogene /
#    peau-sensible / hypoallergenique) ~× 2 au lieu du × 1.5 auto
# 3. just audit-auto-tags-check → 0 FAIL
```

**Re-calibrer `AXIS_BENEFIT_THRESHOLDS`** (B3 — si distribution benefits dérive) :

```bash
DUMP_BENEFITS=1 just audit-auto-tags
BENEFITS_OUT=/tmp/benefits.csv DUMP_BENEFITS=1 just audit-auto-tags
# 1. relever P85 par axis
# 2. éditer AXIS_BENEFIT_THRESHOLDS dans algo-derm src/engine/tags.ts
# 3. bump TAG_DEFS_VERSION + just vendor-algo-derm
# 4. bump CALIBRATED_FOR_TAG_DEFS_VERSION (Aurore)
# 5. re-baseliner budgets (recette précédente)
```

---

## Archive

Historique calibration + tier audit pré-2026-05-13 (V1/V2 primary coverage, A1–A6, B1–B7, §2 skin_type + sans-parfum, §5 P2/P5) :
[`../../../db/seed/docs/_archive/auto-tags-roadmap.md`](../../../db/seed/docs/_archive/auto-tags-roadmap.md).
