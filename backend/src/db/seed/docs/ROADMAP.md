# Seed & Taxonomie — Roadmap

> **À propos :** TODO list du seed + historique. Sections : dette ouverte (Ingrédients / Produits / Tags / Filtres / Images / INCI / Auto-tags). Répond à « qu'est-ce qui reste à faire ? » et « ça, c'est déjà fait ? ».

Dette et tâches ouvertes. Pour l'architecture actuelle (stable), voir
[`STATE.md`](./STATE.md).

Règle : **une étape = une session = un commit propre.** Pas de chaînage.

---

## 2. Ingrédients

### 2.1 Cohérence `type → category` en Zod

`category` est `z.string()` free-form dans les schémas ingrédient. Un
ingrédient `type: 'skincare'` peut avoir `category: 'vitamine'` sans erreur
côté API. La vérification n'existe qu'en test seed.

- [ ] Ajouter un `superRefine` dans `createIngredientSchema` /
      `updateIngredientSchema` croisant `type` × `category` avec les 4 sets
      (`SKINCARE_INGREDIENT_CATEGORY_VALUES`, `HAIRCARE_INGREDIENT_CATEGORY_VALUES`,
      `DENTAL_INGREDIENT_CATEGORY_VALUES`, `SUPPLEMENT_CATEGORY_VALUES`).

### 2.2 CHECK constraint DB sur `ingredients.category`

Actuellement `text` nullable sans contrainte. Un `category: 'foobar'` passe en
DB sans erreur (seul `type` a une CHECK constraint depuis migration `0027`).

- [ ] Migration CHECK constraint croisée sur `(type, category)`. Dupliquer
      manuellement les valeurs (drizzle-kit tourne via Bun qui charge les TS
      source de shared, mais seules les valeurs constantes s'importent —
      simple à maintenir).


### 2.5 Cohérence catégorie ingrédient ↔ tags associés

Ex : un ingrédient `filtre-uv` sans tag `filtre-uv` dans `ingredientTagMap` —
non détecté aujourd'hui.

- [ ] Ajouter test dans `shared-schemas-vs-tags.test.ts` : cohérence
      catégorie → `ingredient_attribute` correspondant.

### 2.6 Dental — ingrédients absents du seed (audit INCI 2026)

Audit INCI vs seed sur 25 produits dentaires / 18 marques. Inventaire
complet archivé dans `seed/docs/audits/dental-ingredients.md`. Manques
actionnables :

- [ ] **Arginine** — anti-sensibilité (Elmex Sensitive Pro, CB12). Bloque les tubules par dépôt phosphate de calcium.
- [ ] **Calcium Sodium Phosphosilicate (Novamin)** — reminéralisant bioactif (Sensodyne Répare & Protège).
- [ ] **Cetylpyridinium Chloride (CPC)** — antiseptique buccal fréquent (Gum, Meridol).
- [ ] **Cellulose Gum** — épaississant très répandu, manquant côté excipients.
- [ ] **Cocamidopropyl Bétaïne** — tensioactif doux, alternative SLS.
- [ ] **Tetrasodium Pyrophosphate** — anti-tartre (Elmex).

Ingrédients définis en seed mais sans usage produit actuel (à conserver
ou retirer après revue) : Tea Tree Oil, Thymol, Carbamide Peroxide.

---

## 3. Produits

### 3.1 `productResponseSchema.category` encore `.nullable()`

Sans impact concret : Hono RPC type les réponses depuis le handler, ce schema
n'est utilisé dans aucune route. À nettoyer par cohérence quand on touche.

- [ ] Retirer `.nullable()` sur `productResponseSchema.category` + aligner
      `Product.category` sur `ProductCategory` (non nullable) dans `shared/src/products/types.ts`.

### 3.2 Tags produits — data quality résiduelle

Contexte auto-tag avril 2026 : 1 017 produits traités, 875 OK / 142 sans primary (INCI absent ou ingrédient inconnu).

- [ ] **142 produits sans primary** — traitement manuel par lot via description/notes.
- [ ] **Toners (6 restants)** — aucun retinol/filtre chimique détecté en scan auto. Revue manuelle.
- [ ] **Bioderma** — ajouter Sebium Global (niacinamide 5/10%) et Pigmentbio C-Concentrate (AA 10%) avant concentrations.
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

`ingredientTagData` agrège les 4 domaines (skincare + supplement + dental + haircare).
`productTagData` agrège skincare + dental (`DENTAL_PRODUCT_TAG_TAXONOMY` livré 2026-05-07,
36 slugs, 5 catégories). Haircare et supplement produits restent des stubs vides.

Le drawer frontend sur les tabs haircare/dental/complement est minimal (kind + brand +
ingredient seulement) — même si dental product tags sont en DB, le frontend ne les
consomme pas encore (STATE §5.6).

- [ ] **haircare produits** — remplir `HAIRCARE_PRODUCT_TAG_TAXONOMY` + `HAIRCARE_PRODUCT_TAG_SLUGS`,
      étendre `productTagData`, câbler drawer haircare frontend
- [ ] **supplement produits** — idem pour supplement / complement

### 4.2 `TAG_SLUGS` legacy dans `data/tags/index.ts`

`TAG_SLUGS` est un agrégat non typé (skincare ingrédient + skincare produit +
supplement ingrédient) encore consommé par `noreva-product-tags.ts` et les 12
entries haircare dans `haircare/ingredient-tags.ts` (qui réutilisent des slugs
skincare). Les re-exports shared (`shared/src/ingredients/tag-slugs.ts`,
`shared/src/products/tag-slugs.ts`) ont déjà été supprimés — il ne reste que
la constante locale dans `data/tags/index.ts`.

- [ ] Migrer `noreva-product-tags.ts` vers `SKINCARE_PRODUCT_TAG_SLUGS` typés,
      puis fusionner le fichier dans `noreva.seed.ts`
- [ ] Décider du sort des 12 entries haircare dual-domain : les conserver sur
      les slugs skincare (intentionnel) ou créer des slugs haircare équivalents
- [ ] Supprimer `TAG_SLUGS` une fois zéro consommateur
- [ ] Routes API qui filtrent/retournent des tags → audit
- [ ] Frontend (filtres, affichage) → audit

### 4.3 Feature exclusion par profil — ingrédients

La feature `avoid_for` existe côté produits. Hors scope de son itération
initiale : l'appliquer également aux ingrédients.

- [ ] `ingredientsSearchSchema.avoid_for`
- [ ] `backend/src/features/ingredients/service.ts` — clause `notInArray`
      équivalente
- [ ] Frontend `IngredientsPage` — toggle + fetch profil dermo

---

## 5. Problèmes connus — pipeline filtres

| ID | Sévérité | Problème | Piste |
|----|---|---|---|
| P1 | 🟡 Moyen | Couverture tags faible sur produits seed — partiellement résolu (auto-tag avril 2026 : 875/1017 produits primary rempli, 142 restants sans primary). Points ouverts : skin_type peu rempli, labels absents (sans-parfum, etc.), concentration INCI non utilisée. | 142 produits restants ; curation manuelle par lot via description/notes |
| P2 | 🔴 Bloquant | `products.kind` : 25 valeurs hétérogènes → inutilisable en filtre. | Remplacer par `product_type` tag |
| P5 | 🟡 Moyen | Recherche texte incohérente : fuzzy (produits, pg_trgm) vs simple (ingrédients) | Harmoniser |
| P6 | 🟢 Faible | Tri popularité absent. `price_asc`/`price_desc`/`newest`/`name`/`random` livrés (STATE §5.5). | Ajouter tri popularité si métrique disponible |
| P7 | 🟡 Moyen | camelCase `skinType` (ingrédients) vs snake_case `skin_type` (produits) | Harmoniser |
| P10 | 🟡 Moyen | Tabs `haircare` / `complement` — taxonomie tag produit vide (cf. §4.1). Drawer minimal seulement. Dental product tags en DB mais non câblés frontend. | Remplir `HAIRCARE_PRODUCT_TAG_TAXONOMY`, câbler drawer dental + haircare |

---

## 6. Design debt noté — pas d'action immédiate

- `shared/dist/` ne contient pas de JS → drizzle-kit ne peut pas importer
  de valeurs runtime depuis shared. Décision : laisser ainsi, drizzle-kit
  tourne via Bun qui charge le TS source (`"bun": "./src/index.ts"`).
  Duplication manuelle nécessaire si pgEnum construit depuis shared.
- `ingredients.category` Drizzle column sans `.$type<>()` — retiré après avoir
  cassé les spreads dans les seeds. Laissé sans cast, sécurisé par tests seed
  + futur CHECK constraint (§2.2).
- `ProductWithIngredients.category` encore optionnel dans
  `frontend/src/features/products/components/ProductForm/ProductForm.tsx`
  (`backend/dist/index.d.ts` stale pas rebuild en isolation). À rendre
  obligatoire après rebuild backend dist.
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

### 7.1 Provisionnement infra

- [ ] Créer le bucket S3 (Bunny Edge Storage ou Backblaze B2 + Bunny CDN devant). Décider : `aurore-images` flat ou par env (`aurore-images-prod` / `-dev`).
- [ ] Configurer Bunny pull zone (origin → bucket). Vérifier transformation à la volée (resize/format) si on veut servir du `?width=200` etc.
- [ ] Stocker `S3_ENDPOINT` / `IMAGE_CDN_BASE` (et keys pour CI) dans le secret manager.

### 7.2 Premier upload

- [ ] Lancer `bun run scripts/upload-images.ts` (2229 webp, ~51 MB).
- [ ] Lancer `IMAGE_CDN_BASE=… bun run scripts/patch-image-urls.ts`. Commit le diff sur les 80+ `*.seed.ts`.
- [ ] `make ts-verify` + `make test-dev ARGS="seed-data-integrity"`.

### 7.3 Couverture image — gaps connus

État : **2700 / 3303 (82%)** après DL Atida + Skinsafe.

- [ ] **119 PNG Skinsafe en 403** — nécessite browser automation (cookies session) via `scrapper-para`. Liste dans `output/image-download-failures.json`.
- [ ] **Sans image** (~603 produits) — `the-ordinary` (35), résidus svr/avene/bioderma, etc. Mix de marques jamais scrappées + variantes hors scope Pharmashop. Scrap source à choisir (sites marques, Yesstyle…).

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
- [ ] **`type-outil`** — décision produit : soit étendre `PRODUCT_KINDS` (`gua-sha`, `jade-roller`, `cleansing-brush`), soit retirer le slug.

---

## 9. INCI quality — suite (algo-derm)

Plateau evidence atteint. Deux pistes restantes ; contexte + commandes dans [`audits/NEXT-SESSION-PROMPT.md`](./audits/NEXT-SESSION-PROMPT.md).

- [ ] **M.2 — parser fix `1,2-hexanediol`** : split virgule coupe `1,2-hexanediol` → `1` + `2-hexanediol`. Protéger `\d,\d-` dans `splitINCI` (algo-derm `src/parser.ts`). Vérifier F1 0.997 conservé.
- [ ] **Worst-match produits** : re-générer audit avec `INCI_AUDIT_FULL=1`, cibler §3/§4 (scrapes cassés, INCI appareil). Résoudre cas par cas plutôt que tokens haute fréquence.
