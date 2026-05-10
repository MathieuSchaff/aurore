# Insérer un produit en SQL direct — Quickstart

> **À propos :** recette rapide pour insérer 1 produit dans `products` via SQL brut, à partir d'une page produit scrapée. Pour le workflow complet (tags, ingrédients, snapshot, migration versionnée), voir [`SEED_FORMAT.md`](./SEED_FORMAT.md) §A.

---

## 1. Prérequis

```bash
docker ps --format '{{.Names}}' | grep app_db   # vérifier que la DB tourne
```

Récupérer l'uuid du user seed (créateur par défaut) :

```bash
docker exec app_db psql -U app -d appdb -c \
  "SELECT DISTINCT created_by FROM products LIMIT 1;"
```

(Pour rappel — DB dev : user `app`, db `appdb`, password `devpassword`. Pas besoin si on passe par `docker exec`.)

---

## 2. Cheat sheet enums (champs `NOT NULL`)

Source de vérité : `shared/src/products/kinds.ts` + `shared/src/products/units.ts`.

| Champ      | Valeurs                                                                 |
|------------|-------------------------------------------------------------------------|
| `category` | `skincare` · `solaire` · `complement` · `haircare` · `bodycare` · `dental` |
| `kind` (skincare)  | `serum` · `moisturizer` · `cleanser` · `toner` · `exfoliant` · `eye-cream` · `mask` · `mist` · `essence` · `spot-treatment` · `lip-care` · `balm` · `oil` · `primer` · `patch` |
| `unit` (skincare)  | `pump` · `dropper` · `jar` · `tube` · `bottle` · `spray` · `pack` · `roller` · `bar` |

(Pour `solaire` / `complement` / etc. : `shared/src/products/{kinds,units}.ts`.)

---

## 3. Template INSERT

Écrire dans `/tmp/insert-<slug>.sql` (heredoc inline `docker exec` est capricieux, fichier = fiable) :

```sql
INSERT INTO products (
  created_by, name, brand, category, kind, unit,
  inci, description, total_amount, amount_unit,
  slug, url, image_url, price_cents
) VALUES (
  '<user-uuid>',
  '<Nom Produit>',
  '<Marque>',
  'skincare',
  'moisturizer',
  'pump',
  'Aqua, Glycerin, ...',                       -- INCI complète, séparateur ', '
  'Description courte FR ou EN, 1-2 phrases.',
  50,
  'ml',
  '<brand-slug>-<product-slug>',               -- kebab-case, unique
  'https://marque.com/products/x',             -- page source
  'https://aurore-cdn.b-cdn.net/products/<slug>.webp',  -- ou URL CDN d'origine en attendant l'upload Bunny
  3895                                         -- prix en cents
)
RETURNING id, name, brand, slug;
```

Exécution :

```bash
docker cp /tmp/insert-<slug>.sql app_db:/tmp/
docker exec app_db psql -U app -d appdb -f /tmp/insert-<slug>.sql
```

---

## 4. Pièges

- **Heredoc `<<EOF` via `docker exec` peut échouer silencieusement** → préférer `docker cp` + `psql -f`.
- **Unicité** : `(lower(name), lower(brand))` et `slug` sont uniques. Vérifier avant insert :
  ```sql
  SELECT id FROM products
  WHERE lower(brand) = lower('<Marque>')
     OR slug = '<brand-slug>-...';
  ```
- **`id` est auto** (uuidv7), ne pas le fournir.
- **`image_url`** : convention finale = `https://aurore-cdn.b-cdn.net/products/<slug>.webp` (Bunny CDN). Si pas encore uploadé, on peut stocker l'URL d'origine et migrer plus tard via les scripts de `backend/src/db/seed/scripts/upload-images.ts`. Voir `IMAGES.md`.
- **INCI** : un seul champ `text`, pas de `product_ingredients` automatiquement. Pour la relation typée → pipeline d'extraction séparé.
- **Tags** : aucun rattachement ici. Pour `tag_products` voir `SEED_FORMAT.md` §A.2.

---

## 5. Insérer un ingrédient (`ingredients`)

Source de vérité champs : `backend/src/db/schema/ingredients/ingredients.ts`.

| Champ         | Notes                                                                  |
|---------------|------------------------------------------------------------------------|
| `slug`        | **anglais**, kebab-case, unique. Ex: `vitamin-c`, `ceramide-np`. Pas de `vitamine-*`. |
| `name`        | FR avec parenthèses INCI si utile : `Panthenol (Provitamine B5)`.      |
| `type`        | enum CHECK : `skincare` · `haircare` · `dental` · `supplement`.        |
| `category`    | free text. Skincare : `actif`, `humectant`, `emollient`, `filtre-uv`, `tensioactif`, `excipient`. |
| `description` | court, NOT NULL DEFAULT `''`. 1-2 phrases.                             |
| `content`     | wiki markdown long, NOT NULL DEFAULT `''`. Peut rester vide pour seed quick. |
| `created_by`  | uuid user seed (cf §1).                                                |

Avant d'ajouter, **chercher tous les noms possibles** (INCI, INN/BAN, trade name) — un actif peut exister sous plusieurs slugs :

```sql
SELECT slug, name, type, category FROM ingredients
WHERE slug = '<slug>' OR name ILIKE '%<keyword>%';
```

Doublons connus historiquement → cf §8.

Template :

```sql
INSERT INTO ingredients (created_by, name, slug, type, category, description, content)
VALUES (
  '<user-uuid>',
  'Acide Glycyrrhétinique (Glycyrrhetinic Acid)',
  'glycyrrhetinic-acid',
  'skincare',
  'actif',
  'Triterpène extrait de la racine de réglisse, anti-inflammatoire topique. Bloque la 11-bêta-HSD et apaise les rougeurs.',
  ''
)
RETURNING id, slug;
```

Pour un **wiki long** (`content`), passer par fichier (`docker cp` + `psql -f`) — les guillemets et apostrophes en heredoc inline cassent vite.

Voir aussi `backend/src/db/seed/data/ingredients/GUIDE.md` pour la convention de fond (taxonomie, descriptions, exemples).

---

## 6. Lier produit ↔ ingrédients (`product_ingredients`)

Schéma : `(product_id, ingredient_id)` unique. Concentration optionnelle (`value`/`unit`/`per`).

### 6.1 Lien simple, 1 ingrédient

```sql
INSERT INTO product_ingredients (product_id, ingredient_id, concentration_value, concentration_unit)
VALUES (
  (SELECT id FROM products    WHERE slug = 'regimen-lab-cream'),
  (SELECT id FROM ingredients WHERE slug = 'panthenol'),
  5, '%'
);
```

### 6.2 Lien bulk, plusieurs ingrédients sans concentration

`INSERT … SELECT` croise produit et liste de slugs ingrédients :

```sql
INSERT INTO product_ingredients (product_id, ingredient_id)
SELECT
  (SELECT id FROM products WHERE slug = 'regimen-lab-cream'),
  i.id
FROM ingredients i
WHERE i.slug IN (
  'ceramide-eop', 'ceramide-np', 'cholesterol',
  'bisabolol', 'allantoin', 'avena-sativa',
  'colloidal-oatmeal', 'palmitamide-mea', 'linoleic-acid',
  'glycyrrhetinic-acid', 'panthenol'
)
ON CONFLICT (product_id, ingredient_id) DO NOTHING;
```

`ON CONFLICT` permet de rejouer le script sans casser. Vérifier ensuite :

```sql
SELECT i.slug, i.category, pi.concentration_value, pi.concentration_unit
FROM product_ingredients pi
JOIN ingredients i ON i.id = pi.ingredient_id
WHERE pi.product_id = (SELECT id FROM products WHERE slug = 'regimen-lab-cream')
ORDER BY i.slug;
```

### 6.3 Concentrations connues

Si la marque publie les % (ex: « 5% Dexpanthenol, 1% Bisabolol, 0.5% Allantoin »), faire un INSERT par ingrédient avec `concentration_value` + `'%'`. Pour des doses par unité (compléments) : `concentration_per` reçoit `'goutte'`, `'gélule'`, `'mL'`.

### 6.4 Pièges

- **Slug ingrédient en anglais** (`vitamin-c`, pas `vitamine-c`).
- **Variantes haircare** : `panthenol-hair`, `ceramide-np-hair` ≠ skincare. Ne pas mélanger avec produit `category='skincare'`.
- **Composite `ceramides`** existe mais quand l'INCI liste `Ceramide EOP` + `Ceramide NP` séparément, lier les deux slugs spécifiques (`ceramide-eop`, `ceramide-np`) plutôt que le composite.
- **Pas de cascade automatique INCI → product_ingredients**. Le champ `inci` text reste la source brute ; cette table ne contient que les actifs qu'on **veut indexer** (filtres front, dermo-signal, recherche).

---

## 7. Produits insérés via ce workflow

| # | slug                                  | id                                     |
|---|---------------------------------------|----------------------------------------|
| 1 | `regimen-lab-cream`                   | `019e0737-5f9c-7f1f-9bf6-50ede76002b8` |
| 2 | `regimen-lab-glycolide-lipid-repair`  | `019e0752-d1bd-7200-a257-1181b0405a0a` |
| 3 | `regimen-lab-azelaic-advanced`        | `019e0752-d1c7-712c-8967-3db06ebaaa21` |
| 4 | `regimen-lab-level-serum`             | `019e0752-d1c7-7e61-82b4-c2e68701e5d9` |
| 5 | `regimen-lab-vitamin-x`               | `019e0752-d1c8-701a-bc04-32c664d6af7a` |
| 6 | `regimen-lab-tabula-rasa`             | `019e0752-d1c8-722d-972f-387c644eba4e` |
| 7 | `regimen-lab-wave-serum`              | `019e0752-d1c8-7443-9a59-d6eb5444ce1f` |

---

## 8. Modifs DB / taxonomie

### 8.1 Migrations (doublons résolus)

| date       | from                | to                            | liens repointés |
|------------|---------------------|-------------------------------|-----------------|
| 2026-05-08 | `enoxolone`         | `glycyrrhetinic-acid`         | 3               |
| 2026-05-08 | `thd-ascorbate`     | `ascorbyl-tetraisopalmitate`  | 27              |

Slug + entrée TS supprimés à chaque fois. Mêmes molécules sous 2 noms (INCI vs INN/BAN, alias trade).

### 8.2 Doublons restants à surveiller

- `green-tea` (Camellia Sinensis Leaf Extract) vs `epigallocatechin-gallate` (EGCG isolé) — actuellement on lie au `green-tea` quand l'INCI mentionne EGCG, pas de slug séparé créé.

### 8.3 Ingrédients ajoutés (skincare)

21 ingrédients créés (DB + TS + tag mapping) le 2026-05-08 — actives Regimen Lab :

| slug                              | category    |
|-----------------------------------|-------------|
| `glycyrrhetinic-acid`             | actif       |
| `acetyl-zingerone`                | actif       |
| `genistein`                       | actif       |
| `quercetin`                       | actif       |
| `silybin`                         | actif       |
| `hesperidin-methyl-chalcone`      | actif       |
| `dimethylmethoxychromanol`        | actif       |
| `tetrahydrodiferuloylmethane`     | actif       |
| `naringenin`                      | actif       |
| `glucosylrutin`                   | actif       |
| `rutin`                           | actif       |
| `swertia-chirata`                 | actif       |
| `salicornia-herbacea`             | actif       |
| `azelamide-mea`                   | actif       |
| `azelamidopropyl-dimethyl-amine`  | actif       |
| `myrothamnus-flabellifolia`       | actif       |
| `glycolide`                       | actif       |
| `10-hydroxystearic-acid`          | emollient   |
| `passiflora-edulis`               | emollient   |
| `acetamidoethoxyethanol`          | humectant   |
| `cocamidopropyl-hydroxysultaine`  | tensioactif |

Compteur `ingredientTagMap` final : **653** (était 634 avant migrations + ajouts).

---

## 9. Après l'insert

1. **Snapshot** (workflow A) si on veut persister dans `data.sql` :
   ```bash
   make db-snapshot
   ```
2. **Commit** : `backend/src/db/snapshot/data.sql`.
3. Pour une **brand entière**, basculer sur une **migration versionnée** (`SEED_FORMAT.md §A.3`).
