# Refonte taxonomie "Routine d'utilisation" skincare

> Suivant le pattern Phase 1+2 du split Type/Zone/Texture (voir `STATE.md` §11.bis).
> Statut : **non démarré**, à exécuter après stabilisation Phase 2 (≥ 4 semaines).

---

## Contexte

Le tag `routine_step` actuel mélange deux axes orthogonaux :

- **Ordonnancement** dans la routine (où ce produit s'utilise dans la séquence)
- **Moment** d'usage (quand l'utiliser)

Aujourd'hui, les 15 slugs du `routine_step` legacy (`matin`, `soir`, `nettoyant`, `double-nettoyage-1`, `preparation`, `traitement`, `hydratation`, `protection-solaire`, `exfoliation`, `masque-hebdo`, …) sont sur un seul axe → l'utilisateur ne peut pas filtrer "produit du soir" sans aussi cocher tous les ordonnancements.

---

## Cible

### Axe 1 — `routine_step_v2` (Étape — ordonnancement)

7 valeurs :

- 1er nettoyage
- 2e nettoyage
- Préparation
- Traitement
- Hydratation
- Occlusif
- Protection solaire

### Axe 2 — `routine_moment` (Moment — quand l'utiliser)

5 valeurs :

- Matin
- Soir
- Hebdomadaire
- Usage localisé
- En cas de crise

---

## Mapping legacy → v2

Slugs `routine_step` actuels (cf `tag-slugs.ts`) :

| Legacy slug         | → `routine_step_v2`      | → `routine_moment`     |
|---------------------|--------------------------|------------------------|
| `matin`             | —                        | Matin                  |
| `soir`              | —                        | Soir                   |
| `nettoyant`         | 1er nettoyage *(default)* | —                      |
| `double-nettoyage-1` | 1er nettoyage           | —                      |
| `double-nettoyage-2` | 2e nettoyage             | —                      |
| `preparation`       | Préparation              | —                      |
| `traitement`        | Traitement               | —                      |
| `hydratation`       | Hydratation              | —                      |
| `emollience`        | Hydratation *(merge)*    | —                      |
| `protection-solaire` | Protection solaire      | Matin                  |
| `occlusion`         | Occlusif                 | Soir *(default)*       |
| `soin-yeux`         | Traitement               | —                      |
| `soin-localise`     | Traitement               | Usage localisé         |
| `exfoliation`       | Traitement               | Hebdomadaire           |
| `masque-hebdo`      | —                        | Hebdomadaire           |

Notes :
- Certains legacy slugs sont **purement temporels** (`matin`/`soir`/`masque-hebdo`) → migrent uniquement vers `routine_moment`.
- Certains sont **purement séquentiels** (`preparation`/`traitement`/`hydratation`) → migrent uniquement vers `routine_step_v2`.
- Quelques cas mixtes (`protection-solaire` = étape ET moment) → produisent 2 nouveaux tags depuis 1 legacy.

---

## Plan d'exécution

Mêmes phases que Type/Zone/Texture :

### Phase 1 — Code (chirurgical, zéro casse seed)

- Ajouter slugs `STEP_*` × 7 et `MOMENT_*` × 5 dans `skincare/tag-slugs.ts`.
- Ajouter labels FR dans `tag-taxonomy.ts`.
- Ajouter catégories `'routine_step_v2'` et `'routine_moment'` dans `SKINCARE_PRODUCT_TAG_CATEGORIES`.
- Meta UI dans `tag-filters.ts` : `routine_step_v2` tier=advanced, `routine_moment` tier=advanced (ou essential ? à trancher selon usage user).
- Schéma : ajouter `routine_step_v2` et `routine_moment` dans `skincareListProductsQuery` + `skincareProductFilterOptionsSchema`.
- Mapping dans nouveau fichier `tag-routine-mapping.ts` (mêmes shape que `tag-type-mapping.ts`).
- Export depuis `skincare/index.ts` + root `shared/src/index.ts`.

### Phase 2 — Backfill

Script `backend/src/db/seed/scripts/backfill-skincare-routine-v2.ts` calqué sur `backfill-skincare-tags-v2.ts` :

- Insère les 12 nouveaux defs (idempotent).
- Lit `tag_products` WHERE `tagType='routine_step'` AND product ∈ skincare/solaire/bodycare.
- Pour chaque ligne, dérive via mapping → INSERT `routine_step_v2` et/ou `routine_moment` avec `onConflictDoNothing`.

Target Makefile : `backfill-skincare-routine-v2 ARGS=--write`.

### Phase 3 — Drop legacy `routine_step`

Mêmes pré-requis que pour `product_type` legacy (cf `STATE.md` §11.bis Phase 3) :

- Couverture v2 ≥ 99 % (requête SQL équivalente).
- Audit scraping / `auto-tag.ts` / scoring.
- Soak 2 semaines en `tier='internal'` avant hard drop.

---

## Décisions à trancher avant Phase 1

1. **Granularité ordonnancement** — actuel = 7 buckets. Suffisant ?
   Alternative : ajouter `Sérum` comme étape distincte (entre Préparation et Traitement) → 8 buckets.
2. **Tier UI** — `routine_step_v2` et `routine_moment` essential (toujours visibles) ou advanced (collapsed) ?
   Argument essential : utile pour filtrer "produit du matin" rapidement.
   Argument advanced : la majorité des users skim par Type+Concern, pas par moment.
3. **`routine_moment` multi-valuable ?** — un produit peut être Matin **ET** Soir (ex: hydratant universel).
   Tag-junction PK déjà multi-valued, donc OK techniquement. UI doit autoriser plusieurs sélections (déjà le cas, chips).
4. **Defaults sur mapping ambigu** — `nettoyant` legacy → `1er nettoyage` par défaut. Vérifier sur corpus si majorité sont vraiment 1er ou si certains sont 2e (gel après huile démaquillante). Possible heuristique : si produit a aussi `huile-demaquillante` ou `baume-demaquillant`, alors `nettoyant` → `2e nettoyage`.

---

## Hors scope

- Cross-domain : haircare / dental / complement ont leur propre `routine_step` (haircare) ou pas du tout. Refonte routine = skincare uniquement Phase 1.
- Discriminated union `routine_step ↔ category` côté Zod : pas nécessaire, la branche `skincareListProductsQuery` isole déjà.
