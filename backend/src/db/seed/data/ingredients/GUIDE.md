# Guide : Ajouter des Ingredients (seed)

Ce guide explique comment creer de nouveaux ingredients dans le seed.
A lire **en entier** avant de commencer.

---

## 1. Arborescence

```
ingredients/
├── ingredient-slugs.ts    # Agregat `INGREDIENT_SLUGS` + re-export des groupes par domaine
├── seed-ingredients.ts    # Type IngredientInput (NE PAS MODIFIER)
├── index.ts               # Re-exporte ingredientData (tous types confondus)
├── GUIDE.md               # Ce fichier
├── skincare/              # Ingredients topiques peau
│   ├── index.ts           # exporte skincareIngredients
│   ├── ingredient-slugs.ts  # Groupes de slugs skincare (HUMECTANTS, RETINOIDES, …)
│   ├── humectants.ts
│   ├── retinoides.ts
│   └── ...
├── supplements/           # Complements alimentaires oraux
│   ├── index.ts           # exporte supplementIngredients
│   ├── ingredient-slugs.ts  # Groupes de slugs supplements (SUPPLEMENTS_VITAMINES, …)
│   ├── astaxanthine.ts
│   ├── berberine.ts
│   ├── beta-carotene.ts
│   ├── cdp-choline.ts
│   ├── choline.ts
│   ├── creatine.ts
│   ├── ergothioneine.ts
│   ├── gaa.ts
│   ├── glucosamine.ts
│   ├── glycine.ts
│   ├── luteine.ts
│   ├── magnesium.ts
│   ├── zeaxanthine.ts
│   └── ...
├── haircare/              # Ingredients capillaires
│   ├── index.ts           # exporte haircareIngredients
│   └── ingredient-slugs.ts  # Groupes de slugs haircare (HAIR_CONDITIONNEURS, …)
└── dental/                # Ingredients bucco-dentaires
    ├── index.ts           # exporte dentalIngredients
    └── ingredient-slugs.ts  # Groupes de slugs dental (DENTAL_ABRASIFS, …)
```

**Regle** : chaque fichier seed va dans le dossier correspondant a son `type`.
Les fichiers partages (`ingredient-slugs.ts`, `seed-ingredients.ts`) restent a la racine.

---

## 2. Structure d'un ingredient

Chaque ingredient est un objet `IngredientInput` :

```ts
{
  name: 'Biotine',
  slug: INGREDIENT_SLUGS.BIOTINE,
  type: INGREDIENT_TYPES.SUPPLEMENT,
  category: SUPPLEMENT_CATEGORIES.VITAMINE,
  description: 'Courte description (1-2 phrases).',
  content: `
# Titre
Contenu markdown detaille.
`,
}
```

### Champs

| Champ | Role | Obligatoire |
|-------|------|-------------|
| `name` | Nom affiche (FR) | oui |
| `slug` | Identifiant URL unique, enregistre dans `ingredient-slugs.ts` | oui |
| `type` | Domaine : `skincare`, `haircare`, `dental`, `supplement` | oui |
| `category` | Role fonctionnel (depend du `type`, voir section 4) | oui |
| `description` | Resume court, 1-2 phrases | oui |
| `content` | Article wiki complet en markdown | oui |

---

## 3. Le champ `type`

Import : `import { INGREDIENT_TYPES } from '@habit-tracker/shared'`

| Valeur | Usage |
|--------|-------|
| `INGREDIENT_TYPES.SKINCARE` | Ingredients topiques pour la peau |
| `INGREDIENT_TYPES.HAIRCARE` | Ingredients capillaires |
| `INGREDIENT_TYPES.DENTAL` | Ingredients bucco-dentaires |
| `INGREDIENT_TYPES.SUPPLEMENT` | Complements alimentaires oraux |

**Un ingredient = un seul type.** Si un meme actif (ex: niacinamide) existe en skincare ET en supplement, creer **deux entrees distinctes** avec des slugs differents (ex: `niacinamide` skincare, `niacinamide-supplement` supplement).

---

## 4. Le champ `category`

Le `category` depend du `type`.

### Pour `type: skincare` (et `haircare`, `dental`)

Import : `import { INGREDIENT_CATEGORIES } from '@habit-tracker/shared'`

| Valeur | Role en formulation |
|--------|---------------------|
| `ACTIF` | Principe actif (retinol, niacinamide, AHA...) |
| `HUMECTANT` | Attire l'eau (glycerine, acide hyaluronique...) |
| `EMOLLIENT` | Adoucit la peau (ceramides, squalane...) |
| `FILTRE_UV` | Protection solaire |
| `TENSIOACTIF` | Nettoyant / moussant |
| `EXCIPIENT` | Support de formulation (sans effet actif) |

### Pour `type: supplement`

Import : `import { SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'`

Valeurs : `VITAMINE`, `MINERAL`, `ACIDE_AMINE`, `ACIDE_GRAS`, `ANTIOXYDANT`, `CAROTENOIDE`, `PLANTE`, `ADAPTOGENE`, `CHAMPIGNON`, `PROBIOTIQUE`, `PREBIOTIQUE`, `PEPTIDE`, `COLLAGENE`, `POLYPHENOL`, `NEUROACTIF`, `LONGEVITE`, `ENZYME`, `AUTRE`.

---

## 5. Etapes pour ajouter des ingredients

### Etape 1 : Enregistrer les slugs

Fichier : `ingredients/<domaine>/ingredient-slugs.ts` (domaine = `skincare`, `supplements`, `dental` ou `haircare`).

Ajouter une nouvelle section const ou completer une existante dans le fichier de domaine. Le fichier racine `ingredients/ingredient-slugs.ts` re-exporte automatiquement tous les groupes de chaque sous-dossier — pas besoin d'y toucher pour ajouter un slug a un groupe existant.

Si vous creez un *nouveau* groupe de slugs, il faut en plus :
1. Importer le nouveau groupe dans le bloc `import { ... } from './<domaine>/ingredient-slugs'` du fichier racine.
2. Ajouter `...NOUVEAU_GROUPE` dans l'agregat `INGREDIENT_SLUGS` (en bas du fichier racine).

```ts
export const SUPPLEMENTS_VITAMINES = {
  BIOTINE: 'biotine',
  VITAMINE_D3: 'vitamine-d3',
} as const
```

### Etape 2 : Creer le fichier seed

Creer un fichier dans le **sous-dossier correspondant au type**.
Ex : `ingredients/supplements/vitamines.ts`

```ts
import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const SUPPLEMENTS_VITAMINES: IngredientInput[] = [
  {
    name: 'Biotine (Vitamine B8)',
    slug: INGREDIENT_SLUGS.BIOTINE,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.VITAMINE,
    description: 'Vitamine hydrosoluble impliquee dans le metabolisme...',
    content: `
# Biotine
...
`,
  },
]
```

### Etape 3 : Brancher dans le index.ts du sous-dossier

Chaque sous-dossier a son propre `index.ts` qui exporte un tableau nomme.
Ex : `ingredients/supplements/index.ts`

```ts
import type { IngredientInput } from '../seed-ingredients'
import { SUPPLEMENTS_VITAMINES } from './vitamines'

export const supplementIngredients: IngredientInput[] = [
  ...SUPPLEMENTS_VITAMINES,
]
```

### Etape 4 : Brancher dans le index.ts racine

Fichier : `ingredients/index.ts`

Ajouter l'import et spreader dans `ingredientData` :

```ts
import { supplementIngredients } from './supplements'

export const ingredientData: IngredientInput[] = [
  ...skincareIngredients,
  ...supplementIngredients,  // <-- ajouter
]
```

---

## 6. Regles de contenu

- **Langue** : Francais pour le contenu visible (name, description, content). Anglais pour le code (slug, noms de variables).
- **Pas de claims medicaux** : Ne pas ecrire "traite", "guerit", "soigne". Preferer "apaise", "soutient", "contribue a".
- **Content markdown** : Commencer par `# Titre`, structurer avec `##`. Pas de blocs de commentaires IA. Garder factuel et concis.
- **Slug** : kebab-case, lowercase, pas d'accents. Ex : `vitamine-d3`, `acide-hyaluronique`.
- **Description** : 1-2 phrases max. Resume l'interet principal de l'ingredient.

---

## 7. Fichiers a NE PAS MODIFIER

| Fichier | Raison |
|---------|--------|
| `seed-ingredients.ts` | Type `IngredientInput` — source de verite |
| `ingredient-slugs.ts` (racine) | Re-export + agregat. Pour ajouter un slug, editer `<domaine>/ingredient-slugs.ts` a la place. |

---

## 8. Verification

Apres ajout, lancer depuis la racine du projet :

```bash
make ts-verify   # verifie les types
make lint-fix    # formate
```
