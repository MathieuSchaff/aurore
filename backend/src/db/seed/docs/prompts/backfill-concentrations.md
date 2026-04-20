# Prompt — Backfill concentrations dans un seed produit

> **À propos :** Prompt réutilisable à donner à Claude. Pour chaque produit d'un fichier seed de marque, Claude extrait les concentrations d'ingrédients mentionnées en texte libre (name/description/notes) et les matérialise dans `keyIngredients[n].concentrationValue/Unit`. Pas de la doc — un outil exécutable.
>
> Usage : fournir le chemin d'un seed file (`<brand>/<brand>.seed.ts`) et exécuter ce prompt.
> Ex : « applique `_PROMPT_backfill-concentrations.md` sur `theOrdinary/theOrdinary.seed.ts` »

## Objectif

Pour chaque produit du fichier seed, extraire les concentrations d'ingrédients mentionnées en texte libre et les matérialiser dans `keyIngredients[n]` sous forme :

```ts
concentrationValue: <number>,
concentrationUnit: "%" | "mg/ml" | "ppm" | "UI" | ...,
```

## Sources à scanner (par ordre de priorité)

Pour chaque produit :
1. `name` — ex : `"Retinol 0.5% in Squalane"` → RETINOL = 0.5%
2. `description` — ex : `"Sérum à 10% niacinamide + 1% zinc"` → NIACINAMIDE=10, ZINC=1
3. `notes` (niveau produit) — ex : `"Contient 7% de Squalane et 0.1% de Céramide 2"`
4. `keyIngredients[n].notes` — ex : `"10% - éclaircissant"` → cet ingrédient = 10%

La recherche se fait pour chaque `keyIngredient` présent dans la liste. Pas d'ajout d'ingrédient manquant.

## Unités supportées

Extraire toute valeur numérique explicitement attachée à un ingrédient, quelle que soit l'unité :
- `%` (pourcentage, cas majoritaire)
- `mg/ml`, `mg/g`, `mg`
- `ppm`
- `UI` / `IU`
- `µg/ml`, `µg`
- Toute autre unité de concentration citée dans la formule

Ignorer : pH, SPF, volumes totaux (50 ml), prix, quantités (dropper). Ces valeurs ne sont pas des concentrations d'ingrédient.

## Règles d'attribution

Matcher **valeur ↔ ingrédient** uniquement quand la paire est explicite dans le texte :
- Le nom de l'ingrédient (ou son synonyme INCI / français) apparaît à ≤ ~30 caractères de la valeur.
- Le slug de l'ingrédient doit exister dans `keyIngredients` du produit courant.
- Une note `keyIngredients[n].notes` qui commence par `"X% -"` ou `"X% –"` attribue X à cet ingrédient **n** directement (la note est rattachée à son ingrédient par position).

Ne **pas** inventer d'attribution quand :
- La valeur flotte sans ingrédient clair (`"pH 3.5"`, `"50 ml"`).
- Plusieurs ingrédients de keyIngredients sont candidats et le texte ne tranche pas.
- Ingrédient cité en texte libre mais absent de `keyIngredients`.

## Conflits

Si `concentrationValue` existe déjà sur un `keyIngredient` :
- **Ne pas overwrite.**
- Émettre un warning listant : `product.slug`, `ingredient.slug`, valeur existante, valeur trouvée dans le texte, source (name/description/notes/keyIngredient.notes).

À la fin de la passe, rassembler tous les warnings dans un résumé final.

## Cleanup des notes

Après extraction depuis `keyIngredients[n].notes`, supprimer le préfixe qui portait la valeur si et seulement si le reste de la note garde du sens :
- Avant : `notes: '10% - éclaircissant, anti-imperfections'`
- Après : `notes: 'éclaircissant, anti-imperfections'`

Patterns à retirer en début de note (après extraction) :
- `"<N><unit> - "`, `"<N><unit> – "`, `"<N><unit> — "`
- `"<N><unit> "` suivi d'un mot minuscule

Ne pas toucher aux notes pour les extractions depuis `name`, `description`, ou `notes` produit (pas de cleanup au-delà du champ source même).

## Pas de modification des autres champs

- Ne jamais modifier `name`, `description`, `notes` produit. Seulement `keyIngredients[n].notes` comme décrit ci-dessus.
- Ne jamais ajouter/retirer d'ingrédients.
- Ne jamais modifier `tags`, `inci`, `priceCents`, etc.

## Checklist d'exécution

1. Lire le fichier seed fourni.
2. Pour chaque produit dans l'array exporté :
   a. Parcourir `name`, `description`, `notes`, puis chaque `keyIngredients[n].notes`.
   b. Extraire toutes les paires (valeur, unité, ingrédient candidat).
   c. Pour chaque match valide : ajouter `concentrationValue` + `concentrationUnit` sur le bon `keyIngredient`.
   d. Si conflit avec valeur existante : warning, skip.
   e. Cleanup du préfixe dans `keyIngredients[n].notes` si extraction faite depuis cette note.
3. Valider : `make ts-verify`.
4. Résumer : nombre d'ingrédients backfillés, nombre de warnings, liste des conflits.

## Exemples

### Avant

```ts
{
  slug: 'the-ordinary-niacinamide-10-zinc-1',
  name: 'Niacinamide 10% + Zinc 1%',
  description: 'Sérum 10% niacinamide et 1% zinc PCA.',
  notes: 'pH 5.50-6.50.',
  keyIngredients: [
    { slug: INGREDIENT_SLUGS.NIACINAMIDE, notes: '10% - vitamine B3' },
    { slug: INGREDIENT_SLUGS.ZINC_PCA },
  ],
}
```

### Après

```ts
{
  slug: 'the-ordinary-niacinamide-10-zinc-1',
  name: 'Niacinamide 10% + Zinc 1%',
  description: 'Sérum 10% niacinamide et 1% zinc PCA.',
  notes: 'pH 5.50-6.50.',
  keyIngredients: [
    {
      slug: INGREDIENT_SLUGS.NIACINAMIDE,
      concentrationValue: 10,
      concentrationUnit: '%',
      notes: 'vitamine B3',
    },
    {
      slug: INGREDIENT_SLUGS.ZINC_PCA,
      concentrationValue: 1,
      concentrationUnit: '%',
    },
  ],
}
```

### Conflit (warning, pas d'overwrite)

Si `NIACINAMIDE` a déjà `concentrationValue: 5` et le texte dit 10% :
```
WARN the-ordinary-niacinamide-10-zinc-1 / niacinamide : existing=5%, found=10% (source: name)
```

## Fin de session

Après application :
- `make ts-verify` (doit passer)
- `make lint-fix` (seeds ignorés par Biome mais rien ne doit péter ailleurs)
- Résumer : N ingrédients backfillés, M warnings, liste produits touchés.
