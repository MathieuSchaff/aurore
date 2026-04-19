# Seed Audit — Ingrédients

## Rappel : structure des ingrédients

### Axe `type` — domaine d'usage

Déclaré dans `shared/src/ingredients/ingredient-types.ts` (`INGREDIENT_TYPES`) :

| Valeur | Sens |
|---|---|
| `skincare` | Soins visage/corps |
| `haircare` | Cheveux |
| `dental` | Soins dentaires |
| `supplement` | Compléments alimentaires |

**Problème DB (à corriger plus tard) :** `type` est déclaré `text NOT NULL DEFAULT 'skincare'`
dans `backend/src/db/schema/ingredients/ingredients.ts`. Le défaut masque les insertions
incorrectes — devrait être NOT NULL sans défaut pour forcer l'appelant à être explicite.
En Zod (`createIngredientSchema`), `type` est `.optional()` pour la même raison.

### Axe `category` — rôle fonctionnel

Valeurs dépendantes du `type` :

- **`skincare | haircare | dental`** → `INGREDIENT_CATEGORIES` :
  `actif | humectant | emollient | filtre-uv | tensioactif | excipient`
  → `shared/src/ingredients/categories.ts`, exporté comme `INGREDIENT_CATEGORY_VALUES`

- **`supplement`** → `SUPPLEMENT_CATEGORIES` :
  `vitamine | mineral | acide-amine | acide-gras | antioxydant | carotenoide | plante | adaptogene | champignon | probiotique | prebiotique | peptide | collagene | polyphenol | neuroactif | longevite | enzyme | autre`
  → `shared/src/ingredients/supplement-categories.ts`, exporté comme `SUPPLEMENT_CATEGORY_VALUES`

**Problèmes structurels (à corriger plus tard) :**

1. **Schéma DB non typé** (`ingredients/ingredients.ts`) : `type` et `category` sont déclarés
   comme `text` brut. Ils devraient utiliser les types importés de `shared` :
   - `type` → `pgEnum` ou au moins un check constraint basé sur `INGREDIENT_TYPE_VALUES`
   - `category` → idem avec `INGREDIENT_CATEGORY_VALUES` / `SUPPLEMENT_CATEGORY_VALUES`
   Actuellement un `type: 'foobar'` passe en DB sans erreur.

2. **120 ingrédients skincare sans `type` explicite** : ils n'ont pas `type: 'skincare'`
   dans leurs données seed et s'appuient sur le `DEFAULT 'skincare'` de la DB.
   Catégories concernées : `actif` (67), `excipient` (46), `tensioactif` (6), `emollient` (1).
   Si on supprime ce DEFAULT (prévu, cf. point 1), le seed casse silencieusement.
   → **Fix** : injecter `type: 'skincare'` par défaut au niveau de l'agrégation dans
     `data/ingredients/index.ts` :
     ```ts
     ...skincareIngredients.map(i => ({ type: 'skincare' as const, ...i })),
     ```
     (le spread `...i` après écrase si l'entrée a déjà un `type` explicite)
   → **Test à ajouter** : every ingredient has a non-empty `type` that is a valid `IngredientType`.

3. **Cohérence `type → category` non vérifiée** : `category` est `z.string()` free-form en Zod,
   pas de validation croisée côté API. Un ingrédient `type: 'skincare'` pourrait avoir
   `category: 'vitamine'` sans erreur. La vérification n'existe qu'en test seed (et encore,
   seulement que `category` est dans l'union des deux sets, pas que c'est le bon set pour le type).
   → **Test à ajouter** dans `seed-data-integrity.test.ts` (à mettre à jour après point 4) :
   - `type === 'skincare'` → `category` ∈ `INGREDIENT_CATEGORY_VALUES`
   - `type === 'supplement'` → `category` ∈ `SUPPLEMENT_CATEGORY_VALUES`
   - `type === 'dental'` → `category` ∈ `DENTAL_INGREDIENT_CATEGORY_VALUES`
   - `type === 'haircare'` → `category` ∈ `HAIRCARE_INGREDIENT_CATEGORY_VALUES`

4. **`haircare` et `dental` sans catégories propres** : décision prise (avril 2026).

   **`dental`** → 6 catégories : `actif`, `abrasif`, `aromatisant`, `humectant`, `tensioactif`, `excipient`
   - `actif` : fluorure, hydroxyapatite, peroxyde, chlorhexidine, nitrate de potassium
   - `abrasif` : silice, carbonate de calcium
   - `aromatisant` : menthol, arômes

   **`haircare`** → 6 catégories : `actif`, `conditionneur`, `filmogene`, `humectant`, `tensioactif`, `excipient`
   - `conditionneur` : silicones, huiles, BTMS, protéines (coat + démêle)
   - `filmogene` : polymères coiffants, fixants

   **Implémenté — commit `cd05aab` (avril 2026) :**

   - ✅ `shared/src/dental/ingredient-categories.ts` — `DENTAL_INGREDIENT_CATEGORIES` + `DENTAL_INGREDIENT_CATEGORY_VALUES`
   - ✅ `shared/src/haircare/ingredient-categories.ts` — `HAIRCARE_INGREDIENT_CATEGORIES` + `HAIRCARE_INGREDIENT_CATEGORY_VALUES`
   - ✅ Exportés depuis `shared/src/index.ts`
   - ✅ Test `ingredient type and category are consistent` : 4 branches séparées par domaine
     (avant : skincare/haircare/dental partageaient `INGREDIENT_CATEGORY_VALUES`)
   - ✅ Test `every ingredient category is a valid category for its domain` : union des 4 sets
   - ✅ Seed haircare : `INGREDIENT_CATEGORIES.EMOLLIENT` → `HAIRCARE_INGREDIENT_CATEGORIES.CONDITIONNEUR`
     dans 4 fichiers (`beurres-vegetaux`, `conditionneurs`, `huiles-minerales`, `huiles-vegetales`)

   **Pourquoi `emollient` → `conditionneur` dans haircare :**
   `emollient` décrit un mécanisme chimique (lisse une surface en comblant les aspérités).
   `conditionneur` décrit la fonction dans le contexte capillaire (coat + démêlage).
   Les huiles, beurres et silicones haircare sont classifiés comme `conditionneur`
   car leur rôle est fonctionnel (confort du cheveu), pas seulement mécanique.

Les données seed sont dans `backend/src/db/seed/data/ingredients/`.

---

## 1. Catégorie `APAISANT` utilisée mais inexistante — corrigé

**Statut : corrigé dans cette session.**

**Ce qui s'est passé :** Le fichier
`backend/src/db/seed/data/ingredients/skincare/apaisants-anti-inflammatoires.ts`
utilisait `INGREDIENT_CATEGORIES.APAISANT` pour ~6 ingrédients. Ce champ n'existe
pas dans `INGREDIENT_CATEGORIES` — TypeScript ne détecte pas l'accès à une propriété
inexistante sur un `const` objet, donc la valeur était `undefined` silencieusement.

**Correction appliquée :** Toutes les occurrences remplacées par
`INGREDIENT_CATEGORIES.ACTIF` (valeur la plus proche sémantiquement).

**Leçon :** Ce type d'erreur ne remonte pas à la compilation. C'est le test
`every ingredient category is a valid skincare or supplement category`
(dans `seed-data-integrity.test.ts`) qui le détecte.

---

## 2. Audit de cohérence complet des ingrédients — fait (avril 2026)

**Résultats de l'audit :**

- **Champs name/slug vides** : 0 problème trouvé (595 ingrédients tous valides).
- **Doublons de slug** : 12 slugs haircare dupliquent des entrées skincare/supplements/dental.
  Comportement intentionnel — `dedupeBySlug()` dans `ingredients/index.ts` conserve
  la première occurrence (skincare wins). Les haircare stubs sont silencieusement ignorés.
  Avertissement affiché à l'exécution (normal).
- **Ingrédients skincare sans tag primaire** : 2 trouvés et corrigés (voir section 3 ci-dessous).
- **Ingrédients non-skincare sans tag** : 209 (supplements, dental, haircare) — normal,
  le `ingredientTagMap` ne couvre que le domaine skincare.

**Ce qui existe comme filet de sécurité (tests actuels, 22 tests) :**

- `ingredientTagMap` : slugs valides, tags valides, pas de duplicates (lignes 17–56)
- `allProductTagsMap` : cohérence slugs produits et tags (lignes 58–92)
- `allIngredientProductTags` : références valides (lignes 94–116)
- `INGREDIENT_SLUGS vs ingredientData` : tout slug a une entrée, pas de doublons (lignes 118–132)
- `TAG_SLUGS vs seed tag data` : couverture complète (lignes 134–145)
- `allProductData` : pas de doublons, champs name/brand, kinds valides, tag primaire présent (lignes 147–192)
- `ingredientData field completeness` :
  - `name` et `slug` non vides pour tous les ingrédients ✅ (ajouté avril 2026)
  - tag primaire obligatoire pour chaque ingrédient **skincare** ✅ (ajouté avril 2026)
  - `category` valide (`INGREDIENT_CATEGORY_VALUES` ou `SUPPLEMENT_CATEGORY_VALUES`)
- `TAG_LABELS coverage` : chaque tag a un label lisible

**Ce qui n'est toujours pas testé :**

- Cohérence entre la catégorie d'un ingrédient et ses tags associés
  (ex : un ingrédient `filtre-uv` sans tag `filtre-uv` dans `ingredientTagMap`)

---

## 3. Ingrédients skincare sans tag primaire — corrigé (avril 2026)

**Statut : corrigé dans cette session.**

Deux actifs skincare n'avaient aucune entrée dans `ingredientTagMap` :

- `propolis-extract` (`INGREDIENT_SLUGS.PROPOLIS`) — apaisant / antibactérien / antioxydant
  → primary: `apaisant`, `anti-bacterien`
  → secondary: `anti-acne`, `cicatrisation`, `anti-oxydant`

- `galactomyces-ferment-filtrate` (`INGREDIENT_SLUGS.GALACTOMYCES_FERMENT_FILTRATE`) — postbiotique brightening
  → primary: `eclat`, `barriere-cutanee`
  → secondary: `grain-peau`, `anti-age`

**Correction appliquée :** entrées ajoutées à la fin de
`backend/src/db/seed/data/ingredient-tags/index.ts`.

**Leçon :** Le test `every skincare ingredient has at least one primary tag in
ingredientTagMap` (ajouté dans cette session) détecte ce cas. Il importe
`skincareIngredients` directement depuis `data/ingredients/skincare` pour ne
pas contaminer la vérification avec les ingrédients dental/haircare/supplements
qui n'ont pas vocation à être taggés.
