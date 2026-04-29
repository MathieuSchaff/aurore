# Import produits scrapés — Pipeline simple

> **À propos :** Vue simple du pipeline qui transforme les données scrapées Atida/Pharmashop en fichiers seed produits. Répond à « quel script fait quoi ? », « où sont les fichiers ? », et « comment relancer proprement l'import ? ».
>
> **Audience** : humain + IA qui reprend le chantier.
> **Important** : `backend/src/db/seed/output/` est généré et ignoré par Git. Les rapports Markdown dedans servent d'audit local, pas de documentation stable.

---

## Résumé court

Le pipeline ne fusionne pas les produits scrapés dans les fichiers curés existants.

Il crée des fichiers seed séparés à côté des fichiers curés :

```txt
backend/src/db/seed/data/products/skincare/aDerma/
  aDerma.seed.ts              # fichier curé, source de vérité manuelle
  aDerma.atida.seed.ts        # fichier généré depuis Atida
  aDerma.pharmashop.seed.ts   # fichier généré depuis Pharmashop
```

Puis `data/products/index.ts` agrège tout :

```ts
const allUnified = [
  ...ADERMA_SEED,
  ...A_DERMA_ATIDA_SEED,
  ...A_DERMA_PHARMASHOP_SEED,
]
```

Commande unique pour tout reconstruire :

```bash
bun run backend/src/db/seed/scripts/rebuild-imported-products.ts --apply
```

Sans `--apply`, la commande lance les dry-runs :

```bash
bun run backend/src/db/seed/scripts/rebuild-imported-products.ts
```

---

## Ce que fait la commande unique

`rebuild-imported-products.ts --apply` lance ces scripts dans cet ordre :

| Étape | Script | Rôle |
|---|---|---|
| 1 | `reset-imported-products.ts --apply` | Supprime les anciens fichiers générés `*.atida.seed.ts` / `*.pharmashop.seed.ts` et retire leurs imports/spreads de `index.ts`. Ne touche pas aux fichiers curés `*.seed.ts`. |
| 2 | `migrate-output.ts --apply --force` | Relit les sources Atida dans `output/seeds/*.ts` et recrée les candidats Atida dans `output/candidates/`. |
| 3 | `migrate-pharmashop.ts --apply --force` | Relit les fiches Pharmashop dans `output/product-details/*/description.txt` et recrée les candidats Pharmashop dans `output/candidates/`, avec descriptions. |
| 4 | `auto-tag.ts --candidates --write` | Remplit les tags des candidats quand les heuristiques savent le faire. |
| 5 | `infer-key-ingredients.ts --apply` | Remplit `keyIngredients` à partir des listes INCI des candidats. |
| 6 | `import-candidates.ts --apply` | Copie les candidats valides vers `data/products/.../*.atida.seed.ts` ou `*.pharmashop.seed.ts`, puis met à jour `data/products/index.ts`. |
| 7 | `audit-imported-products.ts --write` | Écrit les rapports locaux `output/imported-products-audit.{json,md}`. |

Le script s'arrête au premier échec.

---

## Sources et sorties

| Zone | Contenu | Statut |
|---|---|---|
| `output/seeds/*.ts` | Sources Atida déjà prétraitées. INCI, URL, images et prix souvent présents. Descriptions généralement vides dans ce flux. | Entrée |
| `output/product-details/*/description.txt` | Sources Pharmashop détaillées. Descriptions et INCI parsables. Pas d'image URL finale. | Entrée |
| `output/candidates/**/*.seed.ts` | Quarantaine temporaire. Les scripts de migration écrivent ici avant import final. | Généré, ignoré |
| `data/products/**/<brand>.seed.ts` | Fichiers curés manuels. Ne doivent pas être écrasés par le pipeline. | Source de vérité |
| `data/products/**/*.atida.seed.ts` | Fichiers finaux générés depuis Atida. | Généré, versionné |
| `data/products/**/*.pharmashop.seed.ts` | Fichiers finaux générés depuis Pharmashop. | Généré, versionné |
| `data/products/index.ts` | Agrège fichiers curés + fichiers générés dans `allUnified`. | Versionné |
| `output/*.md` | Rapports locaux et anciens suivis. Utiles pour audit ponctuel, pas source stable. | Généré, ignoré |

---

## État observé après le dernier rebuild

Ces chiffres viennent de `output/imported-products-audit.md` après rebuild :

| Métrique | Valeur |
|---|---:|
| Produits actifs | 3958 |
| Fichiers importés générés | 140 |
| Produits importés générés | 2039 |
| Descriptions vides | 678 |
| `keyIngredients` manquants | 396 |
| Casing suspect des noms | 0 |
| Doublons sémantiques candidats | 16 |
| Fichiers importés non indexés | 0 |

Répartition :

| Source | Fichiers | Produits | Descriptions vides |
|---|---:|---:|---:|
| Atida | 96 | 672 | 672 |
| Pharmashop | 44 | 1367 | 6 |

Interprétation : Pharmashop fournit bien les descriptions dans les fichiers seed finaux. Les descriptions vides restantes viennent presque toutes du flux Atida, dont la source actuelle ne les porte pas.

---

## Règles importantes pour une IA

1. Ne considère jamais `output/` comme une source de vérité versionnée. C'est une zone de travail générée.
2. Ne modifie pas à la main les fichiers `*.atida.seed.ts` ou `*.pharmashop.seed.ts` si l'objectif est un import rerunnable. Corrige plutôt les scripts, puis relance `rebuild-imported-products.ts --apply`.
3. Ne merge pas automatiquement un produit généré dans le fichier curé `<brand>.seed.ts`. Les fichiers curés restent manuels.
4. Si un slug existe déjà dans les produits actifs, `import-candidates.ts` skip le candidat. Il ne remplace pas le produit curé.
5. Le reset supprime seulement les fichiers générés avec suffixe `.atida.seed.ts` ou `.pharmashop.seed.ts`. Il ne supprime pas `<brand>.seed.ts`.
6. Les tags et `keyIngredients` auto-remplis sont des heuristiques. Pour une migration qualitative, il faut encore une review marque par marque.
7. Après un rebuild, lance au minimum :

```bash
make ts-verify
make lint
make test-dev ARGS="seed-data-integrity"
```

`seed-data-integrity` peut encore échouer sur des ingrédients skincare sans primary tag dans `ingredientTagMap`. Ce défaut est séparé du pipeline produits.

---

## Que lire selon la tâche

| Tâche | Fichier |
|---|---|
| Comprendre le pipeline complet rapidement | `docs/IMPORT_PIPELINE.md` |
| Comprendre le format attendu d'un produit seed | `docs/SEED_FORMAT.md` |
| Comprendre l'état global du seed | `docs/STATE.md` |
| Voir la dette ouverte | `docs/ROADMAP.md` |
| Voir le dernier audit local des imports générés | `output/imported-products-audit.md` |
| Voir l'ancien détail technique des migrations Atida/Pharmashop | `output/MIGRATION.md` |

---

## Détail rapide des scripts

### `reset-imported-products.ts`

Nettoie le lot généré final. En dry-run, affiche combien de fichiers/imports/spreads seraient retirés. En `--apply`, supprime les fichiers générés et nettoie `index.ts`.

### `migrate-output.ts`

Pipeline Atida. Lit `output/seeds/*.ts`, nettoie slug/nom/INCI, infère `kind`, `category`, `unit`, détecte les produits hors-scope, puis écrit des candidats dans `output/candidates/`.

### `migrate-pharmashop.ts`

Pipeline Pharmashop. Lit `output/product-details/*/description.txt`, parse URL, titre, marque, prix, format, description et INCI, puis écrit des candidats `*.pharmashop.seed.ts` dans `output/candidates/`.

### `auto-tag.ts`

Ajoute des tags candidats depuis le nom, le type produit et l'INCI. Avec `--candidates`, travaille sur `output/candidates/`. Avec `--write`, modifie les fichiers.

### `infer-key-ingredients.ts`

Transforme certains tokens INCI en `INGREDIENT_SLUGS.*`. Réécrit les `keyIngredients` vides ou auto-inférés, mais préserve les reviews humaines.

### `import-candidates.ts`

Prend les candidats avec au moins un tag primaire, skip les collisions de slug avec les produits actifs, normalise les noms, écrit les fichiers générés finaux dans `data/products/`, puis ajoute imports et spreads dans `index.ts`.

### `audit-imported-products.ts`

Analyse le lot final généré : descriptions vides, `keyIngredients` manquants, casing suspect, doublons sémantiques, fichiers non indexés. Écrit `output/imported-products-audit.{json,md}` avec `--write`.

### `rebuild-imported-products.ts`

Wrapper opérationnel. Lance toutes les étapes ci-dessus dans le bon ordre. C'est la commande à utiliser pour repartir de zéro et recréer les fichiers corrigés.
