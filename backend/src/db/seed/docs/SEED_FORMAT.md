# Seed produits — Guide complet

> **À propos :** Guide contributeur pour ajouter une marque/un produit dans le seed. Décrit le format `UnifiedProductSeed`, les champs requis, les conventions de tags et d'ingrédients, avec exemples. Répond à « comment j'ajoute un produit ? ».
>
> **Audience** : Claude Code (contexte CLAUDE.md)
> **Format** : Unified seed — un seul fichier `.seed.ts` par marque

---

## 1. Vue d'ensemble

Chaque marque est représentée par **un seul fichier** :

```
backend/src/db/seed/products/<brand>/<brand>.seed.ts
```

Ce fichier contient les données produit, les tags et les ingrédients clés. Il est enregistré dans `unified.ts`.

---

## 2. Type `UnifiedProductSeed`

```ts
interface UnifiedProductSeed {
  slug: string; // unique, kebab-case
  name: string; // nom du produit (sans marque, sans volume)
  brand: string; // nom exact de la marque, PascalCase
  kind: string; // type de produit (voir §6)
  unit: string; // type de contenant (voir §7)
  totalAmount: number; // volume/poids numérique
  amountUnit: string; // 'ml' | 'g' | 'oz'
  priceCents: number; // prix en centimes, 0 si inconnu
  description: string; // 1-2 phrases en français, bénéfice principal
  notes?: string; // notes cosmétiques : compatibilités, contre-indications
  inci?: string; // liste INCI complète, MAJUSCULES, séparateur `, `
  url?: string; // URL fiche produit (https://...)
  imageUrl?: string; // URL image produit (https://...)
  tags: {
    primary: string[]; // 1-3 tags — problème traité / bénéfice signature
    secondary: string[]; // type produit, étape routine, peau cible, zone, labels
    avoid: string[]; // profils déconseillés (vide si aucun)
  };
  keyIngredients?: {
    slug: string; // INGREDIENT_SLUGS.XXX
    notes?: string; // rôle ou concentration si notable
  }[];
}
```

---

## 3. Squelette du fichier `.seed.ts`

```ts
import { TAG_SLUGS } from "../../tags/seed-tags";
import { INGREDIENT_SLUGS } from "../../ingredients/ingredient-slugs";
import type { UnifiedProductSeed } from "../unified-types";

export const BRAND_SEED: UnifiedProductSeed[] = [
  {
    slug: "brand-product-name",
    name: "Product Name",
    brand: "Brand",
    kind: "serum",
    unit: "pump",
    totalAmount: 30,
    amountUnit: "ml",
    priceCents: 0,
    description: "Description courte en français.",
    notes: "Notes cosmétiques optionnelles.",
    inci: "WATER, NIACINAMIDE, GLYCERIN, ...",
    url: "https://...",
    imageUrl: "https://...",
    tags: {
      primary: [TAG_SLUGS.HYDRATATION],
      secondary: [
        TAG_SLUGS.SERUM,
        TAG_SLUGS.MATIN,
        TAG_SLUGS.SOIR,
        TAG_SLUGS.PEAU_SENSIBLE,
        TAG_SLUGS.ZONE_VISAGE,
      ],
      avoid: [],
    },
    keyIngredients: [
      {
        slug: INGREDIENT_SLUGS.NIACINAMIDE,
        notes: "Sébo-régulateur, anti-taches",
      },
      { slug: INGREDIENT_SLUGS.GLYCERIN },
    ],
  },
];
```

---

## 4. Enregistrement dans `unified.ts`

Deux lignes à ajouter :

```ts
import { BRAND_SEED } from "./<brand>/<brand>.seed";

const allUnified: UnifiedProductSeed[] = [
  // ... autres marques ...
  ...BRAND_SEED,
];
```

---

## 5. Workflow de Migration (Format Legacy → Unifié)

Lors de la conversion d'une marque existante vers le format unifié, suivez ces étapes :

1.  **Extraction** : Consolider les données de `brand.ts`, `brand-ingredients-tags.ts` et `brand-product-tags.ts`.
2.  **Création** : Créer `brand.seed.ts` avec les données nettoyées.
3.  **Enregistrement** : Ajouter la marque dans `unified.ts`.
4.  **Nettoyage Central** : Supprimer l'import et l'entrée de la marque dans les fichiers suivants :
    *   `backend/src/db/seed/products/index.ts`
    *   `backend/src/db/seed/products/products-slugs.ts`
    *   `backend/src/db/seed/products/product-tags.ts`
    *   `backend/src/db/seed/products/ingredients-products-tags.ts`
5.  **Suppression** : Supprimer les anciens fichiers `.ts` de la marque (ne garder que le `.seed.ts`).
6.  **Vérification** : Lancer `make ts-verify`.

---

## 6. Sources de données et transformation

### 6a. Depuis un CSV (skinsafeproducts.com)

| Colonne CSV    | → Champ seed                | Transformation                                            |
| -------------- | --------------------------- | --------------------------------------------------------- |
| `product_name` | `name`                      | Retirer la marque et le volume                            |
| `brand`        | `brand`                     | PascalCase                                                |
| `category`     | `kind`                      | Mapping (voir §7)                                         |
| `ingredients`  | `inci`                      | Tout en MAJUSCULES, séparateur `, `                       |
| `product_url`  | `url`                       | Tel quel si présent                                       |
| `image_url`    | `imageUrl`                  | Tel quel si présent, omettre si vide                      |
| —              | `slug`                      | Générer en kebab-case depuis brand + name                 |
| —              | `unit`                      | Déduire du type de produit ou du packaging                |
| —              | `totalAmount`, `amountUnit` | Extraire du `product_name` si présent, sinon `0` / `'ml'` |
| —              | `description`, `notes`      | Rédiger en français                                       |
| —              | `tags`, `keyIngredients`    | Analyse de l'INCI et du type de produit                   |

### 6b. Depuis une saisie manuelle

L'utilisateur fournit un nom de marque + une liste de produits (noms, volumes, types). Remplir chaque champ en suivant les règles ci-dessous. Si l'INCI n'est pas fourni, omettre le champ `inci`.

### 6c. Depuis du texte brut (Copier-coller web)

- **Priorité INCI** : Toujours chercher la liste complète. Si absente, omettre le champ `inci` mais remplir le reste des métadonnées.
- **Inférence du `unit`** : Si non précisé explicitement, déduire du nom ou de la description ("Spray hydratant" → `'spray'`, "Pot" → `'jar'`, "Flacon-pompe" → `'pump'`).
- **Nettoyage du nom** : Extraire le nom commercial pur. Supprimer les mentions parasites type "Nouveauté", "Promo", "Lot de 2", "Vente Flash".
- **Prix** : Si plusieurs prix sont présents (ex: prix barré), prendre le prix actuel le plus bas.

---

## 7. Valeurs `kind` (type de produit)

### Skincare

| Valeur             | Usage                                                           |
| ------------------ | --------------------------------------------------------------- |
| `'cleanser'`       | Nettoyant (gel, mousse, eau micellaire, huile, pain)            |
| `'toner'`          | Toner, lotion tonique, toner pad                                |
| `'essence'`        | Essence légère                                                  |
| `'serum'`          | Sérum ou ampoule à actifs concentrés                            |
| `'moisturizer'`    | Crème, gel-crème, lotion hydratante                             |
| `'eye-cream'`      | Soin contour des yeux                                           |
| `'exfoliant'`      | Exfoliant chimique ou physique                                  |
| `'mask'`           | Masque tissu, wash-off, pad masque                              |
| `'mist'`           | Brume visage                                                    |
| `'oil'`            | Huile visage ou nettoyante                                      |
| `'balm'`           | Baume (réparateur, lèvres)                                      |
| `'spot-treatment'` | Traitement ciblé (acné, taches)                                 |
| `'lip-care'`       | Soin des lèvres                                                 |
| `'patch'`          | Patch (acné, yeux, nez)                                         |
| `'primer'`         | Base de teint                                                   |
| `'skincare'`       | Générique — **uniquement si aucun kind spécifique ne convient** |

### Solaire

`'sunscreen'` · `'after-sun'` · `'self-tanner'`

### Corps

`'body-lotion'` · `'body-oil'` · `'body-scrub'` · `'body-wash'` · `'deodorant'` · `'hand-cream'` · `'foot-cream'`

### Cheveux

`'shampoo'` · `'conditioner'` · `'hair-mask'` · `'hair-serum'` · `'hair-oil'` · `'styling'`

### Compléments

`'gelule'` · `'capsule'` · `'ampoule'` · `'poudre'` · `'sirop'` · `'gummy'` · `'huile'`

### Dental

`'toothpaste'` · `'mouthwash'` · `'teeth-whitening'` · `'floss'`

---

## 8. Valeurs `unit` (contenant)

| Valeur        | Usage                               |
| ------------- | ----------------------------------- |
| `'pump'`      | Flacon avec pompe                   |
| `'bottle'`    | Flacon sans pompe (toner, essence…) |
| `'tube'`      | Tube souple                         |
| `'jar'`       | Pot                                 |
| `'dropper'`   | Flacon pipette                      |
| `'spray'`     | Spray, brume                        |
| `'pack'`      | Pack (masques tissu, patches)       |
| `'bar'`       | Pain solide                         |
| `'aerosol'`   | Aérosol pressurisé                  |
| `'roller'`    | Applicateur roller                  |
| `'cartridge'` | Cartouche rechargeable              |

---

## 9. Règles de nettoyage des champs

### `name`

- **Sans** le nom de la marque : ~~"COSRX Low pH Cleanser"~~ → `"Low pH Cleanser"`
- **Sans** le volume : ~~"Moisturizer 50ml"~~ → `"Moisturizer"`
- **Alias de Marché** : Si un produit a deux noms (ex: Sensibio / Créaline), privilégiez le nom français (Créaline) ou conservez les deux si les slugs legacy diffèrent.

### `brand`

- PascalCase : `'Cosrx'`, `'Anua'`, `'La Roche-Posay'`
- Pas tout en majuscules sauf si officiel (ex: `'SVR'`).

### `slug`

- Format : `brand-product-name` en kebab-case strict.
- **Doit être unique**.

### `inci`

- Tout en **MAJUSCULES**.
- Séparateur : `, `.
- **Normalisation Eau** : `WATER/AQUA/EAU`, `AQUA/WATER/EAU` ou `AQUA` → `WATER`.
- `ETHYLHEXYL GLYCERIN` → `ETHYLHEXYLGLYCERIN`.

### `url` et `imageUrl`

- Doivent commencer par `https://`.
- Omettre si vide.

---

## 10. Règles de tagging (`tags`)

### `primary` — 1 à 3 tags max

Le problème principal traité. Ex: `ANTI_ACNE`, `HYDRATATION`.

### `secondary` — tags descriptifs complets

Inclure systématiquement :
- **Type de produit** : `SERUM`, `TONIQUE`...
- **Étape routine** : `MATIN`, `SOIR`, `TRAITEMENT`...
- **Type de peau cible** : `PEAU_SENSIBLE`, `PEAU_TOUS_TYPES`...
- **Zone** : `ZONE_VISAGE`, `ZONE_CORPS`...
- **Labels** : `SANS_PARFUM`, `NON_COMEDOGENE`...

---

## 11. Règles ingrédients clés (`keyIngredients`)

- **Source de vérité** : Utiliser uniquement les slugs définis dans l'objet `INGREDIENT_SLUGS` du fichier `backend/src/db/seed/ingredients/ingredient-slugs.ts`.
- **Slug manquant** : Si un actif important n'a pas de slug existant, **ne pas l'inventer**. Demandez à l'utilisateur de l'ajouter au fichier des slugs ou omettez-le pour cette fois.
- **Inclure** : Actifs fonctionnels (acides, peptides, vitamines), extraits végétaux signatures, humectants principaux.
- **Exclure** : WATER, conservateurs (benzoate, phenoxyethanol), émulsifiants basiques, parfums, agents de texture neutres (dimethicone seul).
- **Ordre** : Par importance décroissante ou concentration.
- **Notes** : Utilisez le champ `notes` pour préciser la concentration (ex: `'10%'`) ou le rôle spécifique.

---

## 12. Mise à jour et Vérification

Quand l'utilisateur demande de vérifier, compléter ou mettre à jour une marque :

1.  **Audit comparatif** : Comparer les données fournies (texte brut, CSV) avec le fichier `.seed.ts` existant.
2.  **Champs prioritaires** : Si la nouvelle source contient un prix, un volume ou un INCI plus récent/précis, mettre à jour le produit existant.
3.  **Préservation** : Ne pas supprimer les produits existants dans le fichier sauf instruction explicite. Ajouter les nouveaux produits à la suite de la liste.
4.  **Audit Qualité** : Vérifier systématiquement la cohérence du `kind`, de l'`unit`, et du format INCI selon les règles des sections 7, 8 et 9.
5.  **Rapport de modification** : Lister brièvement les actions effectuées (ex: "Ajout de 2 produits, mise à jour du prix pour 3 produits, normalisation INCI").

---

## 13. Checklist de fin de session

- [ ] Fichier `<brand>.seed.ts` créé.
- [ ] Tous les `name` sans marque ni volume.
- [ ] INCI normalisé (WATER, MAJUSCULES, `, `).
- [ ] Anciens fichiers legacy supprimés.
- [ ] Imports et exports centralisés nettoyés (`index.ts`, `products-slugs.ts`, etc.).
- [ ] Marque enregistrée dans `unified.ts`.
- [ ] `make ts-verify` lancé (0 erreur).
