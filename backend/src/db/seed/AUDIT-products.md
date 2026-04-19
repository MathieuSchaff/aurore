# Seed Audit — Produits

## Rappel : structure category / kind

Chaque produit a une `category` (large) et un `kind` (spécifique à la catégorie).
Défini dans `shared/src/products/kinds.ts`.

| Category | Kinds valides |
|----------|--------------|
| `skincare` | serum, moisturizer, cleanser, toner, exfoliant, eye-cream, mask, mist, essence, spot-treatment, lip-care, balm, oil, primer, patch |
| `solaire` | sunscreen, after-sun, self-tanner |
| `complement` | gelule, capsule, ampoule, poudre, sirop, gummy, huile |
| `haircare` | shampoo, conditioner, hair-mask, hair-serum, hair-oil, styling |
| `bodycare` | body-lotion, body-oil, body-scrub, body-wash, deodorant, hand-cream, foot-cream |
| `dental` | toothpaste, mouthwash, teeth-whitening, floss |

---

## 1. `category` absente de tous les produits seed (~992 produits)

**Problème :** La colonne `products.category` est `NOT NULL` depuis la migration
`backend/drizzle/0025_yielding_sumo.sql`. Mais le champ n'existe pas dans le type
seed ni dans aucun fichier de données.

**Fichiers à modifier :**

- `backend/src/db/seed/data/products/types.ts` — interface `UnifiedProductSeed` (ligne 17)
  → ajouter `category: ProductCategory` (champ obligatoire)

- `backend/src/db/seed/data/products/**/*.seed.ts` (et `noreva.ts`, etc.) — tous les
  fichiers de données produits (~80 fichiers, ~992 produits)
  → renseigner `category` sur chaque produit

**Valeurs valides :** `skincare | solaire | complement | haircare | bodycare | dental`
(type `ProductCategory` dans `shared/src/products/kinds.ts`, exporté depuis `shared/src/index.ts`)

---

## 2. Test de validation `category` manquant

**Fichier :** `backend/src/db/seed/tests/seed-data-integrity.test.ts`

**Problème :** Le test `allProductData field completeness` (ligne 155) ne vérifie pas
`category`. Un produit sans `category` ou avec une valeur invalide passe tous les tests.

**À ajouter :** Un test `every product has a valid category` similaire au test
`every product kind is a valid ProductKind` (ligne 163) — vérifie que chaque produit
a une `category` appartenant à `PRODUCT_CATEGORY_VALUES`.

`PRODUCT_CATEGORY_VALUES` est déjà importé dans le fichier de test (ligne 3).

---

## 3. `category` désynchronisée entre DB et schémas Zod

**Problème :** `category` est `NOT NULL` en DB (migration 0025) mais les schémas Zod
l'acceptent encore comme `null` ou `undefined`.

**Fichier :** `shared/src/products/schemas.ts`

- Ligne 11 — `createProductSchema` : `category: z.enum(PRODUCT_CATEGORY_VALUES).nullable().optional()`
  → doit devenir obligatoire : `z.enum(PRODUCT_CATEGORY_VALUES)`

- Ligne 29 — `updateProductSchema` : `category: z.enum(PRODUCT_CATEGORY_VALUES).nullable().optional()`
  → `.optional()` OK (patch partiel), mais pas `.nullable()` — retirer `.nullable()`

- Ligne 50 — `productResponseSchema` : `category: z.enum(PRODUCT_CATEGORY_VALUES).nullable()`
  → retirer `.nullable()` — la DB garantit que c'est jamais null

---

## 4. `unit` — type défini dans shared mais non enforced nulle part

**Type disponible :** `ProductUnit` dans `shared/src/products/units.ts` (ligne 17)
Valeurs : `pump | dropper | tube | jar | spray | aerosol | bottle | roller | pack | cartridge | bar`
Exporté depuis `shared/src/index.ts` (ligne 153).

**Problème :** Ce type existe mais n'est appliqué à aucune couche.

**Fichiers concernés :**

- `shared/src/products/units.ts` — `PRODUCT_UNIT_VALUES` n'existe pas encore
  (contrairement à `PRODUCT_CATEGORY_VALUES` dans `kinds.ts`)
  → créer `export const PRODUCT_UNIT_VALUES = Object.values(PRODUCT_UNITS) as [ProductUnit, ...ProductUnit[]]`
  → exporter depuis `shared/src/index.ts`

- `shared/src/products/schemas.ts`
  - Ligne 13 — `createProductSchema` : `unit: z.string().min(1).max(50)` → `z.enum(PRODUCT_UNIT_VALUES)`
  - Ligne 31 — `updateProductSchema` : idem
  - Ligne 52 — `productResponseSchema` : `unit: z.string()` → `z.enum(PRODUCT_UNIT_VALUES)`
  - Ligne 129 — `productChangesSchema` : `unit: fieldChangeSchema(z.string())` → `z.enum(PRODUCT_UNIT_VALUES)`

- `backend/src/db/schema/products/products.ts` — ligne 35
  `unit: text('unit').notNull()` → ajouter `.$type<ProductUnit>()`

- `backend/src/db/seed/data/products/types.ts` — ligne 22
  `unit: string` → `unit: ProductUnit`

- `backend/src/db/seed/data/products/types.ts` — ligne 14 (interface `Ingredient`)
  `unit?: string` — ce `unit` est une unité de concentration (ml, %, mg…), différent
  de `ProductUnit` — ne pas confondre, ne pas typer avec `ProductUnit`

- `backend/src/db/seed/data/products/**/*.seed.ts` — vérifier que toutes les valeurs
  `unit:` utilisées dans les ~992 produits sont bien dans les 11 valeurs valides
  → ajouter un test d'intégrité dans `seed-data-integrity.test.ts`

---

## 5. Validation category → kind cohérent

### État actuel (avril 2026)

**`createProductSchema` : ✅ réglé.** `.refine()` en place (lignes 26–32) :
```ts
.refine(
  (d) => {
    const validKinds = PRODUCT_KINDS[d.category as keyof typeof PRODUCT_KINDS]
    return validKinds ? Object.values(validKinds).includes(d.kind as never) : false
  },
  { message: 'kind is not valid for the given category' }
)
```

**`updateProductSchema` : ⚠️ pas de validation croisée.** `category` et `kind` sont
optionnels indépendants — un PATCH `{ kind: 'shampoo' }` sans `category` passe sans erreur.

**Seed test : ✅ actif.** `every product kind is consistent with its category`
(ligne 204 de `seed-data-integrity.test.ts`) couvre toute la data seed depuis étape 2.

**Check constraint DB : ❌ absent.** Pas de contrainte niveau Postgres. Basse priorité
car shared/dist n'émet pas de JS (cf. §6), donc duplication manuelle nécessaire.

### Solution décidée pour `updateProductSchema`

Forcer `category` et `kind` à voyager **ensemble** : si l'un est présent, l'autre est
obligatoire. Le reste des champs reste optionnel.

```ts
.superRefine((d, ctx) => {
  const hasCategory = d.category !== undefined
  const hasKind = d.kind !== undefined
  if (hasCategory !== hasKind) {
    ctx.addIssue({
      code: 'custom',
      message: 'category and kind must be updated together',
      path: [hasCategory ? 'kind' : 'category'],
    })
    return
  }
  if (hasCategory && hasKind) {
    const validKinds = PRODUCT_KINDS[d.category!]
    if (!validKinds || !Object.values(validKinds).includes(d.kind as never)) {
      ctx.addIssue({ code: 'custom', message: 'kind is not valid for the given category', path: ['kind'] })
    }
  }
})
```

**Impact frontend :** toute mutation qui change `kind` doit inclure `category` dans le body.
À vérifier dans les forms de modification produit avant d'implémenter.

---

## 6. Imports runtime shared → schémas Drizzle ✅ pas de problème

**Vérifié avril 2026.**

`make db-generate` utilise `bun x drizzle-kit` — drizzle-kit tourne donc via Bun,
qui exécute le TypeScript source de shared directement (`"bun": "./src/index.ts"`).
Les imports runtime depuis shared fonctionnent sans compilation préalable.

**Usages existants qui marchent :**
- `BLOG_CATEGORY_VALUES` → `pgEnum('blog_category', ...)` dans `blog/articles.ts`
- `repurchaseFlag`, `userProductStatus` → `pgEnum(...)` dans `products/user-products.ts`
- `relevanceValues` → `pgEnum('relevance', ...)` dans `tags/tags.ts`

**`.$type<>()` :** TypeScript-only (aucun runtime), toujours safe peu importe l'environnement.

**Aucune action requise.** Le problème ne se poserait que si drizzle-kit était migré vers Node.js.
