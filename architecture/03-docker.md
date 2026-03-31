# 03 — Docker & Build

## Structure des fichiers Docker

```
docker-compose.yml          ← base commune (services, réseau, volumes persistants)
docker-compose.dev.yml      ← surcharges dev (bind mounts, ports, nginx désactivé)
docker-compose.prod.yml     ← surcharges prod (restart, healthchecks, nginx actif)
docker-compose.test.yml     ← DB de test isolée sur port 5433

backend/Dockerfile          ← multi-stage : deps / dev / prod
frontend/Dockerfile         ← prod uniquement (build Vite → Nginx static)
frontend/Dockerfile.dev     ← dev uniquement (Vite dev server)
```

Les compose files s'empilent avec `-f` :
```bash
# Dev
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Prod
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```

Le second fichier **surcharge** le premier. Ce qui n'est pas redéfini reste identique.

---

## Ce que fait `make dev` étape par étape

```
make dev
  │
  ├─ 1. ts-build (sur l'HÔTE, pas dans Docker)
  │     ├─ bunx @tanstack/router-cli generate   → frontend/src/routeTree.gen.ts
  │     └─ bunx tsc -b                          → shared/dist/*.d.ts
  │                                             → backend/dist/*.d.ts
  │                                             → vérifie le frontend (noEmit)
  │
  └─ 2. docker compose up --build
        │
        ├─ db (postgres:18)
        │   └─ healthcheck pg_isready → attend que la DB soit prête
        │
        ├─ api (attend db healthy)
        │   ├─ build: backend/Dockerfile target=dev
        │   └─ start: bun --watch src/index.ts
        │
        └─ frontend (attend api)
            ├─ build: frontend/Dockerfile.dev
            └─ start: vite dev --host 0.0.0.0 (port 5173)
```

Nginx et Certbot sont désactivés en dev (`profiles: ["disabled"]`).

---

## Pourquoi `ts-build` tourne sur l'hôte (pas dans Docker)

Le frontend a besoin de `shared/dist/` et `backend/dist/` pour type-checker.
Ces dossiers sont montés en bind mount `:ro` dans le conteneur frontend.

Si on ne les génère pas sur l'hôte avant `docker compose up`, le conteneur
frontend démarre avec des imports non résolus.

Le backend (`api`) recompile lui-même `shared/tsconfig.json` au démarrage du
conteneur (dans le Dockerfile `dev` stage) — mais uniquement pour avoir les types
disponibles dans son propre contexte. Il ne rebuild pas le `backend/dist/`.

---

## Backend Dockerfile — les 3 stages

```dockerfile
# Stage 1 : deps
# Installe toutes les dépendances (exploite le cache Docker si package.json ne change pas)
FROM oven/bun:1.3.10-debian AS deps
COPY package.json bun.lock tsconfig.json bunfig.toml ./
COPY backend/package.json backend/
COPY shared/package.json shared/
COPY frontend/package.json frontend/
RUN bun install --frozen-lockfile

# Stage 2 : dev
# Copie node_modules depuis deps, compile shared, lance avec --watch
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY backend/ ./backend/
COPY shared/ ./shared/
RUN bunx tsc -b shared/tsconfig.json   # génère shared/dist/ dans le conteneur
WORKDIR /app/backend
CMD ["bun", "--watch", "src/index.ts"]

# Stage 3 : prod
# Installe les deps en mode prod, compile shared, lance sans --watch
FROM oven/bun:1.3.10-debian AS prod
...
RUN cd /app/shared && bun run build    # génère shared/dist/
USER bun
CMD ["bun", "backend/src/index.ts"]
```

Pourquoi copier `frontend/package.json` dans le stage backend ?
Parce que `bun install` au niveau racine lit tous les `package.json` du workspace.
Si `frontend/package.json` est absent, bun échoue.

### Pourquoi `bunfig.toml` doit être copié

`bunfig.toml` contient `linker = "hoisted"`. Sans ce fichier dans le contexte Docker,
`bun install` utiliserait le linker par défaut (isolé) et la structure `node_modules`
serait différente — les volumes nommés ne fonctionneraient plus.

---

## Frontend Dockerfile.dev — simplifié

```dockerfile
FROM oven/bun:1.3.11-alpine AS dev
WORKDIR /app
COPY package.json bun.lock bunfig.toml ./
COPY frontend/package.json frontend/
COPY shared/package.json shared/
COPY backend/package.json backend/
RUN bun install --frozen-lockfile
WORKDIR /app/frontend
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]
```

Le code source n'est **pas** copié ici — il est monté en bind mount par compose.
Le Dockerfile ne fait qu'installer les deps au moment du `docker build`.

### Pourquoi `bunfig.toml` est obligatoire ici aussi

Sans `bunfig.toml`, bun utilise le linker isolé et installe les packages dans
`/app/frontend/node_modules/`. Ce dossier est ensuite écrasé par le volume nommé
`frontend_node_modules` (vide au premier démarrage). Les packages disparaissent.

Avec `bunfig.toml` (linker hoisted), tout va dans `/app/node_modules/` (volume
`root_node_modules`), cohérent avec le reste du setup. Les outils comme PostCSS
trouvent les plugins via la remontée standard de Node : `/app/frontend/node_modules/`
(vide) → `/app/node_modules/` (complet).

---

## Frontend prod — build Vite → Nginx

```dockerfile
# Stage builder : compile le frontend
FROM oven/bun:1.3.11-alpine AS builder
# Copie tout, build shared et backend (pour les types Hono RPC)
RUN cd /app/shared && bun run build
RUN cd /app/backend && bun run build
RUN bun run build   # vite build → dist/

# Stage final : Nginx sert les fichiers statiques
FROM nginx:1.27-alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
```

En prod, le frontend n'est pas un serveur Node.js — c'est Nginx qui sert les
fichiers HTML/JS/CSS générés par Vite.

---

## La stratégie des volumes en dev

```yaml
# docker-compose.dev.yml — conteneur api
volumes:
  - root_node_modules:/app/node_modules          # volume nommé
  - backend_node_modules:/app/backend/node_modules  # volume nommé
  - /app/shared/node_modules                     # volume anonyme (masque)

  - ./backend:/app/backend                       # bind mount (code source)
  - ./shared/src:/app/shared/src                 # bind mount (code source)
  - ./shared/dist:/app/shared/dist               # bind mount (types générés)
```

### Volumes nommés pour node_modules

Les binaires npm sont compilés pour le système où `bun install` a tourné.
Sur WSL ou Mac, les binaires hôte sont incompatibles avec le conteneur Linux.

Volume nommé = les `node_modules` vivent **dans Docker**, jamais écrasés par l'hôte.
Docker les préfixe avec le nom du projet : `habit-tracker_root_node_modules`.

### Bind mounts pour le code source

Le code source (`./backend`, `./shared/src`) est monté en bind mount pour que
les modifications sur l'hôte soient immédiatement visibles dans le conteneur.
`bun --watch` détecte les changements et redémarre automatiquement.

### Volume anonyme `/app/shared/node_modules`

Sans cette ligne, le bind mount `./shared/src` exposerait aussi `shared/node_modules`
de l'hôte (qui peut être vide ou incompatible). Le volume anonyme "masque" ce
sous-dossier et l'isole.

---

## Dev vs Prod — tableau récapitulatif

| | Dev | Prod |
|---|---|---|
| Frontend | Vite dev server (5173, HMR) | Nginx static (80) |
| API | `bun --watch` (hot reload) | `bun src/index.ts` |
| Nginx | Désactivé | Actif (80/443 + SSL Certbot) |
| DB port | Exposé sur 5432 (accès DBeaver) | Fermé (réseau interne) |
| Code source | Bind mount (modifiable à chaud) | COPY dans l'image |
| node_modules | Volumes nommés Docker | Installés dans l'image |
| Healthchecks | Aucun (sauf frontend) | Tous les services |
| Restart policy | Aucune | `unless-stopped` |
| Vite proxy `/api` | `http://api:3000` (nom Docker) | N/A (Nginx gère le routing) |
