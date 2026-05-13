# Auto-tagging — Roadmap

> **À propos :** dette ouverte du sous-système `features/auto-tagging/`. Pour
> l'architecture (6 passes + orchestrator + runners), voir [`AUTO-TAGS.md`](./AUTO-TAGS.md).
> Pour le contexte général du seed, voir [`../../../db/seed/docs/ROADMAP.md`](../../../db/seed/docs/ROADMAP.md).

**Principe directeur** : tagging produit 100 % automatique. Aucune curation manuelle marque par marque. Toute couverture insuffisante = défaut pipeline, pas tâche de saisie.

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
| §6 retinoid/BHA seul leave-on → `peau-sensible` avoid | algo-derm `detectInteractionAvoidTags` couvre déjà via `interactions[].axes ∋ irritation`. Variante aggressive mis-tag dermo-friendly (Avène Retrinal, LRP Retinol B3) | N/A (skip définitif) |
| §6 AHA / azélaïque fort | Bloqué : azélaïque hors actif-class algo-derm + `products.percent_claims` partiel | Ajout azelaic actif-class côté algo-derm + % data |

---

## Cas spécifiques tag — solaires & avoid actifs (§6)

**Pipeline référence** : `peau-reactive` / `barriere-cutanee-alteree` existent en `SKINCARE_INGREDIENT_TAG_SLUGS` uniquement (taxonomie ingrédient), **pas** en `SKINCARE_PRODUCT_TAG_SLUGS`. Proxy product-side = `peau-sensible`. Concentration data absente de `products.inci` (uniquement `products.percent_claims` partiel).

| Règle | Pipeline | Statut |
| --- | --- | --- |
| Rétinoïde → `grossesse-compatible` (avoid) | `passes/formula/grossesse-avoid.ts` Tier 1 | ✅ |
| Rétinoïde → `peau-sensible` avoid (proxy reactive) | `passes/cross-signal-detection.ts` — uniquement rétinoïde + AHA/BHA leave-on | ⚠️ Partial — skip définitif |
| BHA leave-on top 10 → `grossesse-compatible` avoid | `grossesse-avoid.ts` Tier 2 (salicylic top 10) | ✅ |
| BHA → `peau-sensible` avoid | Combo retinoid+BHA seulement | ⚠️ Partial — skip définitif |
| AHA fort (>8%) → `peau-sensible` + `barriere-cutanee-alteree` | Pas de % data | ❌ Bloqué |
| Azélaïque 10%+ → reactive + alteree | Hors actif-class algo-derm + pas de % data | ❌ Bloqué |
| Filtres chimiques → `grossesse-compatible` (solaires) | `grossesse-avoid.ts` Tier 2 — oxybenzone + homosalate uniquement | ⚠️ Evidence-based (SCCS 2022) |

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
