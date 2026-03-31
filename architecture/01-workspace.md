# 01 — Workspace & Dépendances

## Le problème qu'on résout

On a 3 packages (`shared`, `backend`, `frontend`) qui doivent partager du code.
Sans workspace, chaque package aurait ses propres `node_modules` et on ne pourrait
pas importer `@habit-tracker/shared` depuis le backend sans publier le package sur npm.

---

## Bun Workspaces

Le fichier `package.json` **à la racine** déclare les workspaces :

```json
{
  "name": "habit-tracker",
  "workspaces": ["backend", "frontend", "shared"]
}
```

`bun install` à la racine va :
1. Installer toutes les dépendances des 3 packages
2. Créer des symlinks pour que `@habit-tracker/shared` soit accessible depuis les autres packages

### `workspace:*` dans les package.json

Dans `backend/package.json` :
```json
"dependencies": {
  "@habit-tracker/shared": "workspace:*"
}
```

Le `workspace:*` dit à bun : "ce package vient du workspace local, pas de npm".
Bun crée un lien symbolique `node_modules/@habit-tracker/shared` → `../shared/`.

---

## bunfig.toml — Pourquoi c'est obligatoire

```toml
[install]
linker = "hoisted"
```

Par défaut, bun utilise un linker isolé ("isolated") : chaque package a ses propres
`node_modules/`. C'est propre mais ça casse Docker.

Avec `linker = "hoisted"`, bun remonte toutes les dépendances dans le `node_modules/`
**racine**. Résultat :

```
habit-tracker/
└── node_modules/         ← TOUT est ici
    ├── hono/
    ├── zod/
    ├── @habit-tracker/
    │   ├── shared/       ← symlink → ../../shared/
    │   └── backend/      ← symlink → ../../backend/
    └── ...
backend/node_modules/     ← vide ou presque
frontend/node_modules/    ← vide ou presque
shared/node_modules/      ← vide ou presque
```

### Pourquoi c'est nécessaire pour Docker

Les Dockerfiles copient les fichiers avec ce contexte :
```
context: .   ← racine du monorepo
```

Quand le conteneur fait `bun install`, il recrée la même structure hoisted.
Si on utilisait le linker isolé, chaque package aurait ses propres `node_modules/`
et les volumes Docker deviendraient impossibles à gérer.

---

## Lien avec les volumes Docker

En dev (`docker-compose.dev.yml`), les node_modules sont des **volumes nommés**,
pas des bind mounts :

```yaml
volumes:
  - root_node_modules:/app/node_modules        # les deps hoistées
  - backend_node_modules:/app/backend/node_modules
  - frontend_node_modules:/app/frontend/node_modules
```

Pourquoi des volumes nommés et pas `./node_modules:/app/node_modules` ?

- Les `node_modules` de l'hôte contiennent des binaires compilés pour Linux/macOS
- Sur WSL/Mac, les binaires hôte sont incompatibles avec le conteneur Linux
- Le volume nommé est géré par Docker : il contient les binaires compilés **dans**
  le conteneur, jamais écrasés par les fichiers de l'hôte

La ligne `/app/shared/node_modules` (sans nom) est un volume anonyme qui "masque"
le dossier shared/node_modules du bind mount pour éviter toute fuite.

---

## Flux complet lors de `bun install`

```
bun install (hôte)
  ↓
lit les 3 package.json (root + workspaces)
  ↓
installe tout dans node_modules/ racine (hoisted)
  ↓
crée les symlinks workspace:*
  ↓
résultat : @habit-tracker/shared importable depuis backend et frontend
```
