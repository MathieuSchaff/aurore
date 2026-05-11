# Ajouter un produit — Guide

> **À propos :** Comment ajouter un produit au catalogue. Deux workflows selon la catégorie : **skincare/solaire/bodycare** = SQL direct sur DB + snapshot ; **haircare/dental/supplement** = fichier `.seed.ts`. Répond à « comment j'ajoute un produit ? ».

Voir aussi `STATE.md §1.3` (split source de vérité) et `STATE.md §3` (structure produit DB).

---

## 1. Choisir le workflow

| Catégorie cible       | Workflow             | Source de vérité                          |
|-----------------------|----------------------|-------------------------------------------|
| `skincare`            | **A — DB-first**     | `backend/src/db/snapshot/data.sql`        |
| `solaire`             | **A — DB-first**     | idem                                      |
| `bodycare`            | **A — DB-first**     | idem                                      |
| `haircare`            | **B — JS seed**      | `data/products/haircare/<brand>/*.seed.ts` |
| `dental`              | **B — JS seed**      | `data/products/dental/<brand>/*.seed.ts`   |
| `supplement`          | **B — JS seed**      | `data/products/supplement/<brand>/*.seed.ts` |

**Pourquoi le split ?** Skincare est figé (1923 produits, taxonomie tags v2 stable). Modifier 100+ fichiers TS pour un renommage de tag = trop coûteux → SQL chirurgical sur DB + re-snapshot. Les autres catégories sont en croissance active et bénéficient encore de la validation TypeScript du seed JS.

---

## 2. Workflow A — DB-first (skincare/solaire/bodycare)

### A.1 Quick add (1-2 produits, exploration)

`make db-studio` (Drizzle Studio GUI). Insert dans :
1. **`products`** — `slug`, `name`, `brand`, `category='skincare'`, `kind`, `unit`, `total_amount`, `amount_unit`, `price_cents`, `inci`, `image_url`
2. **`tag_products`** — pour chaque tag : `product_id` + `product_tag_id`
3. **`product_ingredients`** — pour chaque INCI clé : `product_id` + `ingredient_id`

Puis : `make db-snapshot` → commit `backend/src/db/snapshot/data.sql`.

### A.2 SQL direct (3-10 produits, contrôle texte)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --env-file .env.dev exec db psql -U app -d appdb
```

```sql
INSERT INTO products (slug, name, brand, category, kind, unit, total_amount, amount_unit, price_cents, inci, image_url)
VALUES ('skin1004-madagascar-centella-ampoule', 'Madagascar Centella Ampoule', 'Skin1004',
        'skincare', 'serum', 'bottle', 100, 'ml', 1990,
        'CENTELLA ASIATICA EXTRACT, WATER, ...',
        'https://aurore-cdn.b-cdn.net/products/skin1004-...webp')
RETURNING id;
-- note l'id retourné (ex: 3275)

INSERT INTO tag_products (product_id, product_tag_id)
SELECT 3275, id FROM product_tags
WHERE slug IN ('apaisant', 'barriere-cutanee', 'type-serum', 'texture-fluide', 'zone-visage');

INSERT INTO product_ingredients (product_id, ingredient_id)
SELECT 3275, id FROM ingredients WHERE slug IN ('centella-asiatica');
```

Puis `make db-snapshot` + commit.

### A.3 Migration versionnée (brand entière, doit être rejouable)

Créer `backend/drizzle/00XX_add_brand_<brand>.sql` :

```sql
-- Skin1004 brand: 5 products
INSERT INTO products (slug, name, brand, category, kind, ...) VALUES
  ('skin1004-...', '...', 'Skin1004', 'skincare', '...', ...),
  ('skin1004-...', ...);

INSERT INTO tag_products (product_id, product_tag_id)
SELECT p.id, t.id FROM products p, product_tags t
WHERE (p.slug, t.slug) IN (
  ('skin1004-madagascar-...', 'apaisant'),
  ('skin1004-madagascar-...', 'type-serum'),
  ...
);
```

MAJ `backend/drizzle/meta/_journal.json` (Drizzle Kit ne génère pas auto pour les data migrations — copier l'entry précédente, changer `idx`/`tag`/`when`).

`make db-migrate` → `make db-snapshot` → commit (`.sql` migration + `data.sql`).

---

## 3. Workflow B — JS seed (haircare/dental/supplement)

### B.1 Layout

```
backend/src/db/seed/data/products/<scope>/<brand>/<brand>.seed.ts
```

`<scope>` ∈ `haircare` / `dental` / `supplement`. Un fichier par marque, enregistré dans `data/products/index.ts`.

### B.2 Type `UnifiedProductSeed`

```ts
interface UnifiedProductSeed {
  slug: string              // unique, kebab-case
  name: string              // sans marque, sans volume
  brand: string             // PascalCase
  kind: string              // cf §4
  unit: string              // cf §5
  totalAmount: number       // valeur numérique
  amountUnit: string        // 'ml' | 'g' | 'oz'
  priceCents: number        // 0 si inconnu
  description: string       // 1-2 phrases FR
  notes?: string            // compatibilités, contre-indications
  inci?: string             // INCI complète, MAJUSCULES, séparateur ', '
  url?: string              // https://...
  imageUrl?: string         // https://...
  tags: {
    primary: string[]       // 1-3 tags — bénéfice signature
    secondary: string[]     // type, étape, peau cible, zone, labels
    avoid: string[]         // profils déconseillés
  }
  keyIngredients?: { slug: string; notes?: string }[]
}
```

### B.3 Squelette

```ts
import type { UnifiedProductSeed } from '../../types'
import { INGREDIENT_SLUGS } from '../../types'
import { HAIRCARE_PRODUCT_TAG_SLUGS } from '../../../tags'

export const BRAND_SEED: UnifiedProductSeed[] = [
  {
    slug: 'brand-product-name',
    name: 'Product Name',
    brand: 'Brand',
    kind: 'shampoo',
    unit: 'bottle',
    totalAmount: 250,
    amountUnit: 'ml',
    priceCents: 1290,
    description: 'Description courte en français.',
    inci: 'WATER, ...',
    url: 'https://...',
    imageUrl: 'https://...',
    tags: {
      primary: [HAIRCARE_PRODUCT_TAG_SLUGS.HYDRATATION],
      secondary: [HAIRCARE_PRODUCT_TAG_SLUGS.CHEVEUX_TOUS_TYPES],
      avoid: [],
    },
    keyIngredients: [{ slug: INGREDIENT_SLUGS.GLYCERIN }],
  },
]
```

### B.4 Enregistrement

Dans `backend/src/db/seed/data/products/index.ts` :

```ts
import { BRAND_SEED } from './<scope>/<brand>/<brand>.seed'

const allUnified: UnifiedProductSeed[] = [
  ...BRAND_SEED,
]
```

`category` est dérivée auto de `kind` à l'agrégation — pas besoin de la renseigner.

### B.5 Workflow complet

```bash
# 1. créer .seed.ts + ajouter au index.ts
# 2. recharger DB depuis JS seed (clean + migrate + seed)
make db-reset
# 3. snapshot la nouvelle baseline
make db-snapshot
# 4. commit (.seed.ts + index.ts + data.sql)
```

---

## 4. Valeurs `kind`

| Catégorie    | Valeurs                                                                                                                                          |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| `skincare`   | `cleanser` `toner` `essence` `serum` `moisturizer` `eye-cream` `exfoliant` `mask` `mist` `oil` `balm` `spot-treatment` `lip-care` `patch` `primer` |
| `solaire`    | `sunscreen` `after-sun` `self-tanner`                                                                                                            |
| `bodycare`   | `body-lotion` `body-oil` `body-scrub` `body-wash` `deodorant` `hand-cream` `foot-cream`                                                          |
| `haircare`   | `shampoo` `conditioner` `hair-mask` `hair-serum` `hair-oil` `styling`                                                                            |
| `dental`     | `toothpaste` `mouthwash` `teeth-whitening` `floss`                                                                                               |
| `complement` | `gelule` `capsule` `ampoule` `poudre` `sirop` `gummy` `huile`                                                                                    |

---

## 5. Valeurs `unit`

`pump` `bottle` `tube` `jar` `dropper` `spray` `pack` `bar` `aerosol` `roller` `cartridge`

---

## 6. Conventions de nettoyage

### `name`
- Sans la marque : ~~"COSRX Low pH Cleanser"~~ → `"Low pH Cleanser"`
- Sans le volume : ~~"Moisturizer 50ml"~~ → `"Moisturizer"`

### `brand`
- PascalCase : `'Cosrx'`, `'La Roche-Posay'`. Tout-majuscules seulement si officiel (`'SVR'`).

### `slug`
- `brand-product-name` kebab-case strict, **doit être unique**.

### `inci`
- Tout en MAJUSCULES, séparateur `, `.
- Eau normalisée → `WATER` (pas `AQUA`, `WATER/AQUA/EAU`, etc.).
- `ETHYLHEXYL GLYCERIN` → `ETHYLHEXYLGLYCERIN`.

### `url` / `imageUrl`
- Doivent commencer par `https://`. Omettre si vide.

---

## 7. Tagging — règles

### `primary` (1-3 tags max)
Bénéfice signature. Ex: `ANTI_ACNE`, `HYDRATATION`.

### `secondary` (descriptifs complets)
- **Type produit** : `TYPE_SERUM`, `TYPE_TONIQUE`…
- **Étape routine** : `STEP_TRAITEMENT`, `MOMENT_MATIN`, `MOMENT_SOIR`…
- **Peau cible** : `PEAU_SENSIBLE`, `PEAU_TOUS_TYPES`…
- **Zone** : `ZONE_VISAGE`, `ZONE_CORPS`…
- **Labels** : `SANS_PARFUM`, `NON_COMEDOGENE`…

### `avoid`
Profils déconseillés (skin_type ou concern). Cf `STATE-GLOSSARY.md §4.3` règle relevance.

### Scope tag (piège)
Un tag `ingredient_attribute` ou `ingredient`-only ne doit **jamais** apparaître dans les tags d'un produit. Le test `shared-schemas-vs-tags.test.ts` détecte ça.

---

## 8. `keyIngredients` — règles

- **Source de vérité** : `INGREDIENT_SLUGS` dans `data/ingredients/ingredient-slugs.ts`.
- **Slug manquant** : ne pas l'inventer. Ajouter au seed ingredients ou omettre.
- **Inclure** : actifs fonctionnels (acides, peptides, vitamines), extraits signatures, humectants principaux.
- **Exclure** : WATER, conservateurs, émulsifiants basiques, parfums, dimethicone seul.
- **Ordre** : importance décroissante ou concentration.
- **Notes** : concentration (ex: `'10%'`) ou rôle spécifique.

---

## 9. Checklist de fin

- [ ] Workflow A : `make db-snapshot` lancé + `data.sql` committé
- [ ] Workflow B : `.seed.ts` ajouté + `index.ts` MAJ + `make db-reset` + `make db-snapshot` + tout committé
- [ ] `name` sans marque ni volume
- [ ] INCI normalisé (WATER, MAJUSCULES, `, `)
- [ ] Slug unique
- [ ] `make ts-verify` (0 erreur)
- [ ] Tests : `make test-dev ARGS="seed-data-integrity"` + `ARGS="shared-schemas-vs-tags"`
