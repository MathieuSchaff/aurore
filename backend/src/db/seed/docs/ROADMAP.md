# Seed & Taxonomie — Roadmap

> **À propos :** TODO list du seed + historique. Sections : dette ouverte (Ingrédients / Produits / Tags / Filtres / Images / INCI / Auto-tags). Répond à « qu'est-ce qui reste à faire ? » et « ça, c'est déjà fait ? ».

Dette et tâches ouvertes. Pour l'architecture actuelle (stable), voir
[`STATE.md`](./STATE.md).

Règle : **une étape = une session = un commit propre.** Pas de chaînage.

---

## 0. Ordre d'attaque recommandé (2026-05-11)

Du plus simple au plus risqué. S'arrêter dès qu'un item bloque.

| Priorité | Item | Effort | Risque | Note |
|---|---|---|---|---|
| 1 | ~~**§3.2 deux produits** — Bioderma Sebium Global + Pigmentbio C-Concentrate (2026-05-11)~~ ✅ | XS | Nul | Actinica Lotion reste en §3.2 |
| 2 | ~~**§9 M.2** — fix parser `1,2-hexanediol` dans algo-derm (`src/parser.ts`) (2026-05-02, commit `440b896`)~~ ✅ | XS | Faible | Déjà fixé : `splitINCI` regex `/,(?!\d)/` + tests `parser.test.mjs:282` & `matching.test.mjs:35` |
| 3 | ~~**§1.1 Zod** — `superRefine` type×category dans `createIngredientSchema` (2026-05-11)~~ ✅ | S | Faible | Wired sur create + update, tests `ingredients.schemas.test.ts` |
| 4 | ~~**§1.2 CHECK constraint** — migration DB `(type, category)` (2026-05-12, `0057_ingredients_type_category_check`)~~ ✅ | M | Moyen | Drizzle `check()` inline + SQL `IS NULL OR (type AND category IN …)` |
| 5 | ~~**§4.3 avoid_for ingrédients** — backend schema + service + frontend (2026-05-12)~~ ✅ | M | Moyen | Cross-couches |
| 6 | ~~**§4.1 haircare/supplement product tags** — taxonomie + seed + frontend (2026-05-12, audit obsolète)~~ ✅ | L | Moyen | Déjà livré : taxos (97 + 39 slugs), META, `productTagData` 4 domaines, drawer frontend câblé (`useProductTagFilterGroups`). Seed haircare enrichi commit `7afbf805`. Smoke UI OK. Reste data dette : supplement n'a qu'une marque (nutripure). |
| 7 | **§7 images CDN — gaps résiduels** | M | Faible | 7.1 + 7.2 ✅ (infra + upload livrés). Restes : §7.3 (Skinsafe 403, sans image, pending bioderma), §7.4 (`build-image-mapping.ts` en TS). |
| 8 | **§3.2 142 produits sans primary** | L | Nul | Curation manuelle |

---

## 1. Ingrédients

### 1.1 Cohérence `type → category` en Zod

`category` est `z.string()` free-form dans les schémas ingrédient. Un
ingrédient `type: 'skincare'` peut avoir `category: 'vitamine'` sans erreur
côté API. La vérification n'existe qu'en test seed.

- [x] Ajouter un `superRefine` dans `createIngredientSchema` /
      `updateIngredientSchema` croisant `type` × `category` avec les 4 sets
      (`SKINCARE_INGREDIENT_CATEGORY_VALUES`, `HAIRCARE_INGREDIENT_CATEGORY_VALUES`,
      `DENTAL_INGREDIENT_CATEGORY_VALUES`, `SUPPLEMENT_CATEGORY_VALUES`).
      Livré 2026-05-11 (`shared/src/ingredients/schemas.ts` + tests `backend/src/features/ingredients/tests/ingredients.schemas.test.ts`).
      Sur update partiel, validation seulement quand `type` ET `category` présents — sinon le service merge avec le `type` stocké.

### 1.2 CHECK constraint DB sur `ingredients.category`

Actuellement `text` nullable sans contrainte. Un `category: 'foobar'` passe en
DB sans erreur (seul `type` a une CHECK constraint depuis migration `0027`).

- [x] Migration CHECK constraint croisée sur `(type, category)` livrée 2026-05-12
      (`drizzle/0057_ingredients_type_category_check.sql`). Valeurs dupliquées
      en littéral dans `backend/src/db/schema/ingredients/ingredients.ts` (commentaire
      pointe vers `shared/src/ingredients/*/categories.ts` à garder en sync).
      Audit dev DB pré-migration : 0 violation (25 paires distinctes, toutes
      dans les sets). Smoke insert `'vitamine'` sur `type=skincare` rejeté.


---

## 3. Produits


### 3.2 Tags produits — data quality résiduelle

Contexte auto-tag avril 2026 : 1 017 produits traités, 875 OK / 142 sans primary (INCI absent ou ingrédient inconnu).

- [ ] **142 produits sans primary** — traitement manuel par lot via description/notes.
- [ ] **Toners (6 restants)** — aucun retinol/filtre chimique détecté en scan auto. Revue manuelle.
- [x] **Bioderma** — Sebium Global + Pigmentbio C-Concentrate ajoutés 2026-05-11 (DB-first). Restes : tags via auto-tags pass, INCI à normaliser (séparateur `- ` → `, ` + `AQUA/WATER/EAU` → `WATER`), images CDN (cf §7.3).
- [ ] **Solaires absents** (Actinica Lotion, Colibri Daily SPF50) — vérifier `grossesse-compatible` (avoid) sur filtres chimiques quand ajoutés.

Règles de rattrapage `avoid` (rappel) :
- Rétinoïde → `peau-reactive` + `barriere-cutanee-alteree` + `grossesse-compatible`
- AHA fort (>8%) → `peau-reactive` + `barriere-cutanee-alteree`
- BHA 2% → `peau-sensible`
- Acide azélaïque 10%+ → `peau-reactive` + `barriere-cutanee-alteree` (sauf rosacée validée cliniquement)
- Filtres chimiques → `grossesse-compatible` (solaires)

### 3.3 Doublons produits scrapés

> Mis à jour 2026-04-30 après le merge `0c477591` (fusion des `*.atida/.pharmashop.seed.ts` dans des `<brand>.seed.ts` unifiés) + cleanup cross-source. Détection : `scripts/audit-imported-products.ts` (archivé) ; workflow + règles : `DEDUP.md` (archivé dans `~/Mathieu/Vault/aurore-archive/seed-docs/`).

Snapshot 2026-04-30 :

- **Cross-source : 1 paire** (review, faux positif vichy `dercos-psolution` ↔ `neovadiol-meno` — produits distincts, signal commun parasite). Plus rien à traiter sur cet axe.
- **Intra-source : 1 051 paires** (336 auto-merge / 401 review / 314 weak). Tout est désormais intra-fichier. Beaucoup de faux positifs légitimes (variantes format `100ml`/`400ml`, lots `x2`/`x3`, couleurs/tailles brossettes).

- [ ] Filtrer le rapport intra-source par flags pour isoler les **vrais doublons** (exclure `num-diff` quand seule la quantité change, `kind-diff` informatifs).
- [ ] Review marque par marque dans l'ordre du tableau « Review Priority » du rapport, après filtrage.
- [ ] Pour chaque marque : appliquer les règles de décision de l'ancien `DEDUP.md` (cf archive — sameSize → fusion, sinon variantes à conserver).

---

## 4. Tags

### 4.1 Vocabulaire haircare / supplement — produits (seed DB)

Audit 2026-05-12 : section déjà livrée, roadmap périmé. Détail :

- [x] **haircare produits** — `HAIRCARE_PRODUCT_TAG_TAXONOMY` (97 slugs, 6 cat : concern,
      hair_type, product_type, routine_step, hair_effect, product_label),
      `HAIRCARE_PRODUCT_TAG_CATEGORY_META`, `productTagData` étend haircare,
      `DOMAIN_PRODUCT_FILTER_CATEGORIES.haircare` câblé, drawer frontend live
      via `useProductTagFilterGroups`. Seed enrichi 51 marques (commit `7afbf805`).
- [x] **supplement produits** — `SUPPLEMENT_PRODUCT_TAG_TAXONOMY` (39 slugs, 5 cat :
      goal, moment, restriction, product_type, product_label), META + filter cat,
      `DOMAIN_PRODUCT_FILTER_CATEGORIES.complement` câblé. Smoke UI OK 2026-05-12.
- [ ] **Data dette supplement** — 1 seule marque seedée (nutripure). Pas dette
      taxonomie, dette curation produit (hors scope §4.1).

### 4.3 Feature exclusion par profil — ingrédients

La feature `avoid_for` existe côté produits. Hors scope de son itération
initiale : l'appliquer également aux ingrédients.

- [x] `listIngredientsSearchSchema.avoid_for` (2026-05-12, `shared/src/ingredients/helpers.ts`).
- [x] `backend/src/features/ingredients/service.ts` — `profileMatches`
      post-fetch via `tag_ingredients` × `relevance='avoid'`. Mirror produits :
      ne filtre pas, signale. Tests `ingredients.test.ts` describe `avoid_for filter`.
- [x] Frontend `IngredientsPage` — toggle "Selon mon profil" dans drawer
      (skincare + user logged in), fetch `profileQueries.dermo()`, badge
      « Éviter » sur cartes.

---

## 5. Problèmes connus — pipeline filtres

| ID | Sévérité | Problème | Piste |
|----|---|---|---|
| P1 | 🟡 Moyen | Couverture tags faible sur produits seed — partiellement résolu (auto-tag avril 2026 : 875/1017 produits primary rempli, 142 restants sans primary). Points ouverts : skin_type peu rempli, labels absents (sans-parfum, etc.), concentration INCI non utilisée. | 142 produits restants ; curation manuelle par lot via description/notes |
| P2 | 🔴 Bloquant | `products.kind` : 25 valeurs hétérogènes → inutilisable en filtre. | Remplacer par `product_type` tag |
| P5 | 🟡 Moyen | Recherche texte incohérente : fuzzy (produits, pg_trgm) vs simple ILIKE (ingrédients) | Harmoniser |
| P6 | 🟢 Faible | Tri popularité absent. `price_asc`/`price_desc`/`newest`/`name`/`random` livrés (STATE §5.5). | Ajouter tri popularité si métrique disponible |
| ~~P10~~ | ✅ Résolu | Tabs `haircare` / `complement` / `dental` — taxonomies remplies + drawer câblé via `useProductTagFilterGroups` (2026-05-12). Reste data : supplement 1 marque seedée. | — |

---

## 6. Design debt noté — pas d'action immédiate

- `shared/dist/` ne contient pas de JS → drizzle-kit ne peut pas importer
  de valeurs runtime depuis shared. Décision : laisser ainsi, drizzle-kit
  tourne via Bun qui charge le TS source (`"bun": "./src/index.ts"`).
  Duplication manuelle nécessaire si pgEnum construit depuis shared.
- `ingredients.category` Drizzle column sans `.$type<>()` — retiré après avoir
  cassé les spreads dans les seeds. Laissé sans cast, sécurisé par tests seed
  + futur CHECK constraint (§1.2).
- `product.category`, `product.kind`, `product.unit` : pas de check constraint
  DB (typage TS + validation Zod suffisent en pratique, shared/dist sans JS
  rend la migration coûteuse — décision : accepter). Pas d'index sur
  `products.category` — filtrages par catégorie sur grande table feront un
  seq scan.
- Pas de doc frontend pour les composants `Filter/` (FilterDrawer,
  FilterAccordion, SearchSelect, ActiveFiltersBar) ni pour les hooks
  `useListFilters` / `useTagFilterGroups`. `STATE.md` §5.5 liste les clés de
  filtre par page mais n'explique pas les props/variants. `docs/frontend/CSS_GUIDE.md`
  référencé dans `CLAUDE.md` n'existe pas. Décision : laisser tant que le code
  reste auto-explicatif, ajouter une page dédiée si un 3ᵉ consommateur de
  FilterDrawer apparaît.

---

## 7. Images & CDN

État du pipeline image : voir [`IMAGES.md`](./IMAGES.md).

### 7.1 Provisionnement infra ✅

Audit 2026-05-12 : livré (roadmap périmé).

- [x] Bunny Storage Zone provisionnée + Pull Zone configurée. Vars dans `.env.dev`
      (`BUNNY_STORAGE_ZONE`, `BUNNY_STORAGE_HOSTNAME`, `BUNNY_STORAGE_PASSWORD`,
      `BUNNY_STORAGE_READONLY_PASSWORD`, `IMAGE_CDN_BASE`) + `.env.example` template.

### 7.2 Premier upload ✅

Audit 2026-05-12 : livré.

- [x] `backend/src/db/seed/scripts/upload-images.ts` exécuté (Bunny HTTP native
      API, AccessKey header, 16 uploads parallèles).
- [x] `patch-image-urls.ts` exécuté : **80/81 `*.seed.ts`** référencent `b-cdn.net`.

### 7.3 Couverture image — gaps connus

État : **2700 / 3303 (82%)** après DL Atida + Skinsafe.

- [ ] **119 PNG Skinsafe en 403** — nécessite browser automation (cookies session) via `scrapper-para`. Liste dans `output/image-download-failures.json`.
- [ ] **Sans image** (~603 produits) — `the-ordinary` (35), résidus svr/avene/bioderma, etc. Mix de marques jamais scrappées + variantes hors scope Pharmashop. Scrap source à choisir (sites marques, Yesstyle…).
- [x] **Pending CDN upload** — `bioderma-sebium-global` + `bioderma-pigmentbio-c-concentrate` (2026-05-12) : pages bioderma.fr ajoutées à `data/image-fetchers/bioderma.ts`, scrape via `fetch-images-bioderma.ts`, upload Bunny, patch `snapshot/data.sql` (`imageUrl` colonne).

### 7.4 Outils

- [ ] Scripter `build-image-mapping.ts` (actuellement Python one-shot). Ré-runnable à chaque update du scrap.
- [ ] Optionnel : route backend `/seed-images/<slug>.webp` servant `output/images-normalized/` en dev pour découpler test du CDN prod.

---

## 8. Auto-tagging — dette résiduelle

Historique complet (calibration log + tier audit + roadmap absorbée) : [`_archive/auto-tags-roadmap.md`](./_archive/auto-tags-roadmap.md). Comment ça marche aujourd'hui : [`AUTO-TAGS.md`](./AUTO-TAGS.md).

- [ ] **O3** — audit dédié `actif-class` (étendre `audit-auto-tags` à la passe 2, stats hit/agree/new par cluster). Effort S.
- [ ] **F5** — pipeline Brier/ECE pour passe 1 (concerns / skin types / absence) si on calibre les seuils algo-derm un jour. Defer sinon. Effort XS.
- [ ] **`texture-mousse` / `texture-stick` admin curation** — non dérivables INCI seul. Attendent que les ~3 700 produits `products.texture = NULL` soient peuplés via admin UI (T3 phase B).
- [ ] **`peau-mixte`** — Tier 3, débloqué par `products.texture` populé (pattern : T-zone gel-cream + niacinamide top 8).

---

## 9. INCI quality — suite (algo-derm)

Plateau evidence atteint. Deux pistes restantes ; contexte + commandes dans [`audits/NEXT-SESSION-PROMPT.md`](./audits/NEXT-SESSION-PROMPT.md).

- [x] **M.2 — parser fix `1,2-hexanediol`** (2026-05-02, commit `440b896`) : `splitINCI` regex passée à `/,(?!\d)/` (lookahead seule, le lookbehind cassait `Polysorbate 60, Sorbitan…`). Couvert par `parser.test.mjs:282` + `matching.test.mjs:35`.
- [ ] **Worst-match produits** : re-générer audit avec `INCI_AUDIT_FULL=1`, cibler §3/§4 (scrapes cassés, INCI appareil). Résoudre cas par cas plutôt que tokens haute fréquence.
