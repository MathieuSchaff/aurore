# 02 — TypeScript dans le Monorepo

## Vue d'ensemble des 4 tsconfigs

```
tsconfig.json              ← root : orchestre les 3 projets, ne compile rien lui-même
shared/tsconfig.json       ← fournisseur : génère des .d.ts
backend/tsconfig.json      ← consommateur de shared, fournisseur pour le frontend
frontend/tsconfig.json     ← délègue à tsconfig.app.json et tsconfig.node.json
frontend/tsconfig.app.json ← consommateur de shared + backend
frontend/tsconfig.node.json ← couvre uniquement vite.config.ts
```

---

## `composite` — le passeport d'un projet référençable

Pour qu'un projet puisse être **référencé** par un autre (via `references`),
il doit avoir `"composite": true`.

`composite` active automatiquement :
- `declaration: true` — génère les `.d.ts`
- la création d'un fichier `.tsbuildinfo` — cache de build incrémental

`shared` et `backend` ont `composite: true`. Le frontend n'en a pas besoin
car personne ne le référence (c'est la feuille finale).

---

## `emitDeclarationOnly` — générer les types sans le JS

`shared/tsconfig.json` et `backend/tsconfig.json` ont :
```json
"emitDeclarationOnly": true
```

Ça signifie : TypeScript génère uniquement les fichiers `.d.ts` dans `dist/`,
**pas de JS**. Bun exécute le TypeScript directement — il n'a pas besoin de JS compilé.

Le `dist/` sert uniquement au type-checker, pas au runtime.

```
shared/src/index.ts   →   tsc   →   shared/dist/index.d.ts   (types uniquement)
                                         ↑
                                   consommé par le frontend via tsconfig paths
```

### Exception : `shared/package.json` exports

```json
"exports": {
  ".": {
    "bun": "./src/index.ts",     ← Bun lit le .ts directement (runtime)
    "types": "./dist/index.d.ts", ← TypeScript lit les .d.ts (type-checking)
    "default": "./src/index.ts"
  }
}
```

La condition `"bun"` dit : quand le runtime est Bun, importe le `.ts` source.
Quand c'est TypeScript qui vérifie les types, il lit le `.d.ts`.

---

## `references` — la chaîne de dépendances TypeScript

`references` dans un tsconfig crée un lien de dépendance **déclaré** entre projets.

```json
// backend/tsconfig.json
"references": [{ "path": "../shared" }]
```

Effets :
1. `tsc -b` compile `shared` en premier, puis `backend`
2. Si `shared` n'a pas changé, `backend` n'est pas recompilé (cache `.tsbuildinfo`)
3. `tsc -b --watch` rebuild `backend` automatiquement quand `shared` change

### Le root tsconfig orchestre tout

```json
// tsconfig.json (racine)
"references": [
  { "path": "./shared" },
  { "path": "./backend" },
  { "path": "./frontend" }
]
```

L'ordre déclare implicitement la dépendance : shared d'abord, backend ensuite
(qui dépend de shared), frontend en dernier.

---

## `paths` — alias de résolution pour le type-checker

`paths` est différent de `references` : c'est juste un mapping d'alias.

```json
// frontend/tsconfig.app.json
"paths": {
  "@habit-tracker/shared": ["../shared/dist/index.d.ts"],
  "@habit-tracker/backend": ["../backend/dist/index.d.ts"],
  "@/*": ["./src/*"]
}
```

Quand le frontend écrit `import type { AppType } from '@habit-tracker/backend'`,
TypeScript cherche les types dans `backend/dist/index.d.ts`.

### `paths` vs `references` — deux mécanismes différents

| | `paths` | `references` |
|---|---|---|
| Rôle | Alias de chemin pour la résolution | Dépendance entre projets |
| Rebuild auto | Non | Oui (avec `--watch`) |
| Lit depuis | Ce que tu pointes (dist ou src) | Le projet référencé (son outDir) |
| Nécessite `composite` | Non | Oui dans le projet cible |

Le frontend utilise `paths` pointant vers `dist/` plutôt que `references` car
ajouter des références au frontend changerait la résolution de dist vers source,
ce qui peut exposer des erreurs d'inférence non détectées jusque-là.

---

## `baseUrl` dans le backend — les imports bare

```json
// backend/tsconfig.json
"baseUrl": "."
```

`baseUrl: "."` permet d'écrire des imports sans `./` ni `../` :

```typescript
// Sans baseUrl : obligé d'écrire
import { googleService } from './features/auth/google.service'

// Avec baseUrl: "." (résolu depuis backend/)
import { googleService } from 'src/features/auth/google.service'
```

TypeScript résout `'src/features/auth/google.service'` comme
`backend/src/features/auth/google.service.ts`.

Supprimer `baseUrl` casserait tous ces imports — le compilateur ne saurait plus
où chercher `'src/...'`.

---

## Pourquoi `shared/dist` doit exister avant le build frontend

Le frontend pointe via `paths` vers `shared/dist/index.d.ts` et
`backend/dist/index.d.ts`. Si ces fichiers n'existent pas :

```
❌ error TS2307: Cannot find module '@habit-tracker/shared'
```

C'est pourquoi `make dev` commence par `ts-build` sur l'hôte :

```bash
make dev
  → ts-build (hôte)
      → bunx @tanstack/router-cli generate   # génère routeTree.gen.ts
      → bunx tsc -b                          # génère shared/dist/ et backend/dist/
  → docker compose up --build               # lit les dist/ via bind mount :ro
```

Le conteneur frontend monte `./shared/dist` et `./backend/dist` en `:ro`.
Il ne les regénère pas — il les consomme depuis l'hôte.

---

## `tsc -b` vs `tsc -b --noEmit`

`tsc -b` : compile et génère les `.d.ts` (c'est ce que `make ts-build` utilise)

`tsc -b --noEmit` : vérifie les types sans rien générer. Problème connu : le flag
`--noEmit` se propage aux projets référencés et entre en conflit avec leur
`emitDeclarationOnly: true`, produisant l'erreur `TS6310`.

C'est pour ça que `make ts-verify` (`bunx tsc -b --noEmit`) retourne une erreur
sur le backend — c'est un bug de TypeScript avec les project references, pas
un problème du code.
