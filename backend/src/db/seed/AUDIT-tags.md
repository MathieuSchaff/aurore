# Seed Audit — Tags

## Références — réflexions antérieures

Avant de modifier quoi que ce soit sur les tags, lire ces fichiers. Ils documentent des
décisions de conception, des règles sémantiques et des problèmes connus réfléchis avant
cet audit. Ce ne sont pas des plans d'action — c'est l'historique de la pensée du projet.

- **`idee/02_ARCHI/tag-system/tag-semantique.md`** — référence sémantique complète :
  sens de chaque `tagType`, règles sur `relevance`/`avoid`, pièges classiques,
  corrections passées à ne pas défaire, exemples concrets (niacinamide).

- **`idee/02_ARCHI/tag-system/architecture-filtres.md`** — pipeline de bout en bout
  (DB → shared → route → hook → query → service SQL). Documente aussi deux problèmes
  bloquants connus : couverture tags trop faible sur les produits CSV (P1),
  et champ `kind` trop hétérogène pour être utilisé comme filtre (P2).

- **`idee/02_ARCHI/tag-system/exclusion-profil-implementation.md`** — détail
  d'implémentation du filtre d'exclusion par profil (`avoid_for`).

---

## Structure d'un tag

Un tag = 3 champs en DB (`ingredient_tags` / `product_tags`) :
- `slug` — identifiant unique (`anti-acne`, `peau-grasse`…)
- `label` — texte affiché à l'utilisateur (`"Anti-acné"`)
- `tagType` — **nature** du tag (aussi appelé `category` dans la taxonomie shared)

La table de jointure (`tag_ingredients` / `tag_products`) ajoute `relevance` (`primary` / `secondary`) :
indique si le tag est l'usage principal de l'ingrédient/produit ou un effet secondaire.

### 5 natures de tags ingrédients skincare

| `tagType` | Sens | Exemples |
|---|---|---|
| `concern` | Problématique ciblée | `anti-acne`, `anti-age`, `eclat` |
| `skin_type` | Type de peau compatible | `peau-seche`, `peau-grasse` |
| `ingredient_attribute` | Ce que fait la molécule | `humectant`, `filtre-uv`, `apaisant` |
| `skin_effect` | Effet rendu sur la peau | `occlusif`, `matifiant`, `repulpant` |
| `shared_label` | Label transversal | `comedogene`, `grossesse-compatible` |

---

## État actuel (après étape 4)

Fichiers dans `shared/src/` après refacto :

| Fichier | Constante | État |
|---|---|---|
| `shared/src/skincare/ingredient-tag-slugs.ts` | `SKINCARE_INGREDIENT_TAG_SLUGS` | ✅ complet |
| `shared/src/skincare/ingredient-tag-taxonomy.ts` | `SKINCARE_INGREDIENT_TAG_TAXONOMY` | ✅ complet |
| `shared/src/skincare/product-tag-slugs.ts` | `SKINCARE_PRODUCT_TAG_SLUGS` | ✅ complet |
| `shared/src/skincare/product-tag-taxonomy.ts` | `SKINCARE_PRODUCT_TAG_TAXONOMY` | ✅ complet |
| `shared/src/haircare/ingredient-tag-slugs.ts` | `HAIRCARE_INGREDIENT_TAG_SLUGS` | ❌ vide |
| `shared/src/haircare/product-tag-slugs.ts` | `HAIRCARE_PRODUCT_TAG_SLUGS` | ❌ vide |
| `shared/src/dental/ingredient-tag-slugs.ts` | `DENTAL_INGREDIENT_TAG_SLUGS` | ❌ vide |
| `shared/src/dental/product-tag-slugs.ts` | `DENTAL_PRODUCT_TAG_SLUGS` | ❌ vide |
| `shared/src/supplement/ingredient-tag-slugs.ts` | `SUPPLEMENT_INGREDIENT_TAG_SLUGS` | ❌ vide |
| `shared/src/supplement/product-tag-slugs.ts` | `SUPPLEMENT_PRODUCT_TAG_SLUGS` | ❌ vide |

Legacy re-exports (`shared/src/ingredients/tag-slugs.ts`, `shared/src/products/tag-slugs.ts`) toujours actifs — à supprimer quand tous les consommateurs sont migrés.

---

## Ce qui manque — à faire

Tags ingrédients et produits **inexistants** pour haircare, dental, supplement.
Conséquence : aucun ingrédient/produit hors skincare ne peut être taggé aujourd'hui.

**À définir par domaine :**

- `haircare` : concerns cheveux (chute, sécheresse, brillance…), types cheveux (fins, bouclés…), attributs (conditionneur, filmogène…)
- `dental` : concerns dentaires (caries, sensibilité, blanchiment…), attributs (reminéralisant, abrasif…)
- `supplement` : concerns/bénéfices (énergie, immunité, sommeil…), attributs (vitamine, adaptogène…)

**À faire également :**
- Taxonomies associées (`*-tag-taxonomy.ts`) pour chaque domaine
- Seed data (`ingredientTagMap` / `productTagMap`) pour ces domaines
- Tests d'intégrité couvrant les nouveaux slugs
- Supprimer les re-exports legacy

---

## Impact de la refacto (déjà évalué, étape 4)

Ce qui casse si on supprime les legacy re-exports :

- `backend/src/db/seed/data/ingredient-tags/index.ts` (`ingredientTagMap`) → à migrer vers `SKINCARE_INGREDIENT_TAG_SLUGS`
- `backend/src/db/seed/data/products/` (tous les `*TagsMap`) → à migrer vers `SKINCARE_PRODUCT_TAG_SLUGS`
- `backend/src/db/seed/data/tags/index.ts` → à refactorer
- Tests `seed-data-integrity.test.ts` → à mettre à jour
- Routes API qui filtrent/retournent des tags → à auditer
- Frontend (filtres, affichage des tags) → à auditer
