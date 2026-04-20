# Seed & Shared — Roadmap globale

Sources de vérité pour les détails :
- [`AUDIT-ingredients.md`](./AUDIT-ingredients.md)
- [`AUDIT-products.md`](./AUDIT-products.md)
- [`AUDIT-tags.md`](./AUDIT-tags.md)

Règle : **une étape = une session = un commit propre.** Pas de chaînage.

---

## ✅ Étape 1 — Corrections données ingrédients (seed only, zéro migration)

*Commit : `d0c0cd6`*

- [x] Injecter `type: 'skincare'` par défaut dans l'agrégation `data/ingredients/index.ts`
      pour les 120 ingrédients skincare sans `type` explicite
- [x] Ajouter test : every ingredient has a non-empty valid `IngredientType`
- [x] Ajouter test : cohérence `type → category`
      (supplement → `SUPPLEMENT_CATEGORY_VALUES`, skincare/haircare/dental → `INGREDIENT_CATEGORY_VALUES`)

---

## ✅ Étape 2 — Corrections données produits (seed + Zod, zéro migration)

*Commit : `c553a65`*

- [x] Ajouter `category?: string` dans `data/products/types.ts` (interface `UnifiedProductSeed`)
- [x] Injecter `category` automatiquement depuis `kind` via reverse map dans `data/products/index.ts`
      (évite de toucher les ~992 fichiers seed individuellement)
- [x] Ajouter test : every product has a valid `ProductCategory`
- [x] Fix Zod `createProductSchema` : `category` retire `.nullable()`
- [x] Fix Zod `updateProductSchema` : retire `.nullable()` sur `category`
- [x] Créer `PRODUCT_UNIT_VALUES` dans `shared/src/products/units.ts` + export depuis `shared/src/index.ts`
- [x] Typer `unit` dans Zod (`createProductSchema`, `updateProductSchema`) → `z.enum(PRODUCT_UNIT_VALUES)`
- [x] Ajouter `.$type<ProductUnit>()` sur `products.unit` dans le schéma Drizzle
- [x] Ajouter test : every product unit is a valid `ProductUnit`

**Notes :**
- `productResponseSchema.category` gardé `.nullable()` par précaution (données DB pré-migration)
- `updateProductSchema.unit` passé à `z.enum` mais garde `.optional()`

---

## ✅ Étape 3 — Schéma DB ingrédients (migration requise)

*Commit : `7505926` — migration `0026_happy_reavers.sql`*

- [x] Supprimer `DEFAULT 'skincare'` sur `ingredients.type` + NOT NULL strict
- [x] Fix Zod `createIngredientSchema` : `type` obligatoire (retire `.optional()`)
- [x] Ajouter `.$type<IngredientType>()` sur `ingredients.type` dans le schéma Drizzle
- [x] Générer + appliquer la migration

---

## ✅ Étape 4 — Refacto tags (structure domaine-par-domaine)

*Commit : `ddd35b7`*

**Fait :**
- [x] Créer les 10 fichiers dans `shared/src/{skincare,haircare,dental,supplement}/` :
      `ingredient-tag-slugs.ts` + `product-tag-slugs.ts` par domaine
      + `ingredient-tag-taxonomy.ts` + `product-tag-taxonomy.ts` pour skincare
- [x] Skincare : contenu complet (rename `INGREDIENT_TAG_SLUGS` → `SKINCARE_INGREDIENT_TAG_SLUGS`, idem products)
- [x] Haircare / dental / supplement : listes vides, à remplir progressivement
- [x] Anciens `shared/src/ingredients/tag-slugs.ts` et `tag-taxonomy.ts` → re-exports minces (backward compat)
- [x] Anciens `shared/src/products/tag-slugs.ts` et `tag-taxonomy.ts` → re-exports minces (backward compat)
- [x] Nouveaux exports `SKINCARE_*` + domaines vides dans `shared/src/index.ts`

**Hors scope (à faire progressivement) :**
- [ ] Définir le vocabulaire haircare (concerns cheveux, types cheveux, attributs haircare)
- [ ] Définir le vocabulaire dental (concerns dentaires, attributs dental)
- [ ] Définir le vocabulaire supplement (concerns/bénéfices, attributs supplement)
- [ ] Migrer `data/ingredient-tags/index.ts` → `SKINCARE_INGREDIENT_TAG_SLUGS` (TAG_SLUGS alias actif)
- [ ] Migrer les seed produits → `SKINCARE_PRODUCT_TAG_SLUGS` (TAG_SLUGS alias actif)
- [ ] Supprimer les re-exports de backward compat quand tous les consommateurs sont migrés
- [ ] Auditer et mettre à jour les routes API (filtres par tag)
- [ ] Auditer et mettre à jour le frontend (composants de filtre)

---

## Étape 4.1 — Fixes post-refacto tags (suite directe étape 4)

*Commits : `f2305a2`, `4d9d03a`, `63e337a`*

- [x] `productChangesSchema.unit` → `z.enum(PRODUCT_UNIT_VALUES)`
- [x] `ingredients.category` Drizzle column → `.$type<IngredientCategory | SupplementCategory>()`
      (retiré ensuite dans `63e337a` car casse les spreads — laissé sans `$type`)
- [x] CHECK constraint DB sur `ingredients.type` (migration `0027`) — 4 valeurs dupliquées intentionnellement
- [x] Fixtures tests mises à jour (`category`, `type`, casts `ProductKind[]` / `IngredientType[]`)

---

## Hors scope / design debt noté

- `haircare` et `dental` sans catégories propres (empruntent `INGREDIENT_CATEGORIES`)
  → à traiter si ces domaines deviennent prioritaires
- `updateProductSchema` : cohérence `category → kind` non validée — solution décidée :
  `superRefine` qui force les deux champs à voyager ensemble (cf. AUDIT-products.md §5)
  → **à implémenter** (vérifier impact frontend avant)
- `shared/dist/` ne contient pas de JS → drizzle-kit ne peut pas importer les valeurs
  runtime depuis shared → duplication manuelle si pgEnum nécessaire (décision : laisser ainsi)
  → noté dans AUDIT-products.md §6
- `productResponseSchema.category` reste `.nullable()` — sans impact (Hono RPC type les
  réponses depuis le handler, ce schema n'est utilisé dans aucune route)
