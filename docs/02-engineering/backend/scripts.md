# Backend scripts & runners — guide

> Tu débarques sur le projet ? Ce doc te dit **ce qui existe**, **quand le lancer** et **comment**. Lis la section "Carte mentale" en premier.

---

## Carte mentale

Le backend exécute du code de trois façons :

1. **Automatique** — déclenché par un autre code (le serveur, les tests, le seed). Tu n'as rien à faire.
2. **Routinier via `just`** — recettes pré-câblées (`just db-seed`, `just dev`, etc.). Tu connais le nom, tu tapes.
3. **Manuel via `bun run`** — scripts one-shot ou rares, lancés à la main par leur chemin complet (`bun run backend/src/db/seed/inci/cleanup/preamble.ts`). Tu vas chercher la doc du script (commentaire en tête de fichier).

Le but de ce doc : **savoir quand tu es dans quelle catégorie** et où regarder.

---

## Layout — où vit quoi

```
backend/src/
├── features/
│   ├── auto-tagging/       ← pipeline runtime des tags produit (auto-tag à createProduct)
│   │   ├── orchestrator.ts       (le cerveau, 6 passes)
│   │   ├── passes/               (1 fichier par règle de détection)
│   │   └── runners/
│   │       ├── audit/            (audits read-only, comparent vs gold-set)
│   │       ├── backfill/         (réapplique le pipeline sur la DB existante)
│   │       └── gold-set-bootstrap.ts  (sample stratifié pour calibration)
│   └── …                   ← autres features applicatives (auth, products, etc.)
│
├── db/
│   ├── schema/             ← définitions Drizzle (tables)
│   ├── migrations/         ← SQL versionné
│   ├── seed/               ← TOUT ce qui peuple/nettoie la DB hors runtime
│   │   ├── data/                 (input — JSON/TS d'ingrédients, produits, tags)
│   │   ├── seeders/              ← scripts qui INSÈRENT la data canonique
│   │   ├── ingest/               ← scripts qui IMPORTENT depuis sources EXTERNES
│   │   │   ├── peta-cruelty-free/    (status cruelty-free brand-level)
│   │   │   ├── obf-brand-labels/     (labels Open Beauty Facts)
│   │   │   └── incidecoder/          (scrape INCI depuis incidecoder.com)
│   │   ├── maintenance/          ← cleanup / dédup / audits data (one-shot, on-demand)
│   │   ├── inci/                 ← parser INCI + audits qualité + cleanups texte
│   │   │   ├── index.ts                (lib parser, utilisée au seed)
│   │   │   ├── audit-quality.ts        (audit qualité corpus INCI)
│   │   │   ├── benchmark-fr-parser.ts  (bench parser FR)
│   │   │   └── cleanup/                (5 one-shots qui réparent products.inci)
│   │   ├── tests/                ← vrais .test.ts (intégrité seed-data)
│   │   ├── utils/                ← helpers internes (batch, id-maps, markdown-validator)
│   │   ├── docs/                 ← STATE.md, ROADMAP.md, etc.
│   │   ├── output/               (gitignored — résultats audits, images temp)
│   │   ├── VRAC/                 (staging — docs/data non-transformés en attente de tri)
│   │   └── _archive/             (scripts/code obsolète gardé en référence)
│   ├── audit/              ← audit-db.ts (intégrité relationnelle, lancé via just audit-db)
│   └── bench/              ← rls-init-plan.sh (bench perf RLS, ponctuel)
│
└── images/                 ← TOUT le pipeline images CDN (séparé de seed/)
    ├── fetchers/                 (1 fichier par marque-source, gitignored — one-shot)
    ├── upload/                   (main.ts CLI, lib.ts API, batch.ts, dry-run.ts)
    ├── audit/                    (bunny.ts, analyze-orphans.ts, dump-orphans.ts)
    └── maintenance/              (patch-urls, fix-broken-refs, delete-bunny, build-mapping)
```

**Trois règles pour s'y retrouver :**

- `features/<X>/runners/` = code **lié à une feature applicative** (ex. auto-tagging). Touche au pipeline métier.
- `db/seed/` = tout ce qui concerne **alimenter ou nettoyer la DB hors runtime**. Le seed canonique + les imports externes + les nettoyages.
- `images/` = pipeline **CDN images** (orthogonal au seed même si historiquement lié).

---

## Niveau 1 — Automatique (tu ne lances rien)

Ces choses s'exécutent toutes seules, déclenchées par autre chose :

| Quoi | Déclencheur |
|---|---|
| **Auto-tag à la création produit** | Appelé inline dans `createProduct` (commit `564fe0fc`). Quand l'user ou un script ajoute un produit, l'orchestrator d'auto-tagging s'exécute pour générer les tags. Fail-soft (échec silencieux). |
| **Seed-core invoque l'auto-tag** | `seed-core.ts` (lancé par `just db-seed`) appelle `detectAllAutoTags` en fin de seed pour générer les tags des produits canoniques. |
| **Tests d'intégrité seed** | `seed/tests/*.test.ts` tournent dans `just test` — vérifient invariants taxonomie. |
| **Tests INCI parser** | `inci/index.test.ts` tourne dans `just test`. |

**Tu n'as rien à invoquer.** Si quelque chose casse ici, c'est dans le code applicatif ou le seeder, pas un script à relancer.

---

## Niveau 2 — Routinier via `just`

Tout ce qui a une recette `just`. Tape `just --list` pour le menu complet. Catégorisé ci-dessous.

### Dev quotidien

| Commande | Quand l'utiliser |
|---|---|
| `just dev` | Démarre Docker (api + db + frontend). Boucle de dev. |
| `just dev-fresh` | Première fois, ou après changement deps/schéma majeur. Nettoie tout et rebuild. |
| `just dev-down` | Stoppe les conteneurs. |
| `just ts-check` | Watch TypeScript (hôte, hors Docker). À laisser tourner pendant le dev. |
| `just ts-verify` | One-shot type-check. À lancer avant de commit. |
| `just lint-fix` | Format + lint auto-fix. |

### DB & seed (le pain quotidien)

Les recettes marquées 🌐 supportent `TARGET=dev|prod` (env var). Voir section "Prod" plus bas.

| Commande | TARGET | Quand l'utiliser |
|---|---|---|
| `just db-seed` | 🌐 | (Re-)applique le seed canonique. Idempotent. |
| `just db-seed-reset` | 🌐⚠️ | **Wipe + re-seed**. DESTRUCTIF. Confirmation `I DESTROY PROD` sur prod. |
| `just db-reset` | 🌐⚠️ | Composite : `db-clean` + `db-migrate` + `db-seed`. Reset complet (3 prompts sur prod). |
| `just db-clean` | 🌐⚠️ | TRUNCATE tables public. DESTRUCTIF. |
| `just db-migrate` | 🌐 | Applique les migrations Drizzle en attente. |
| `just db-generate` | dev-only | Génère une migration depuis le diff schema → DB. |
| `just db-push` | dev-only | ⚠️ Bypass migrations (perd RLS). |
| `just db-studio` | dev-only | Drizzle Studio (UI localhost). |
| `just db-snapshot` | dev-only | Dump DB dev → `backend/src/db/snapshot/data.sql` (committable). |
| `just db-snapshot-load` | dev-only | Recharge le snapshot. Rapide pour reset dev. |
| `just db-snapshot-reset` | dev-only | `db-clean` + `db-migrate` + load snapshot. |
| `just db-stats` | 🌐 | Stats produits/ingrédients/tags/users. Read-only. |
| `just db-backup` | 🌐 | Backup SQL. Prod = gzipped. |
| `just db-restore /path.sql` | 🌐⚠️ | Restaure depuis fichier (gz auto-détecté). Confirmation prod. |
| `just db-seed-safe` | 🌐 | Composite : `db-seed` + `audit-db`. |
| `just db-seed-merge-safe` | 🌐 | Composite : `db-backup` + `db-seed` + `audit-db`. |
| `just db-backup-prod` | (prod) | Alias de `TARGET=prod just db-backup`. Conservé pour cron. |
| `just audit-db` | 🌐 | Vérifie intégrité relationnelle. Read-only. |

### Tests

| Commande | Quand l'utiliser |
|---|---|
| `just test` | Suite complète backend (cycle full, DB éphémère). |
| `just test-dev "pattern"` | Tests ciblés en DB persistante (rapide pour itérer). |
| `just test-db-up` | Démarre la DB de test persistante (à laisser tourner pendant `test-dev`). |
| `just test-frontend` | Vitest frontend. |
| `just test-all` | Backend + frontend. |
| `just e2e-up` puis `just e2e` | Playwright E2E (cf `docs/frontend/e2e.md`). |

### Auto-tagging (audits + backfill)

Toutes les options passent par **env vars** (préfixées avant `just`). Read-only par défaut, `WRITE=1` ou `APPLY=1` pour appliquer.

| Commande | Ce qu'elle fait | Env vars |
|---|---|---|
| `just audit-auto-tags` | Dry-run orchestrator algo-derm. Stats par tag. | `CONF_OVERRIDE`, `CSV_OUT`, `LIMIT`, `INCLUDE_DROPPED`, `DUMP_BUDGETS`, `DUMP_BENEFITS`, `BENEFITS_OUT`, `DISABLE_FLOORS` |
| `just audit-auto-tags-check` | `CHECK=1` wrapper — valide hit rates vs `TAG_HIT_RATE_BUDGET`, exit 1 si FAIL. Câblé en CI. | — |
| `WRITE=1 just backfill-auto-tags` | Ré-applique pipeline sur DB. Idempotent. | `SLUG`, `WRITE`, `LIMIT`, `CONF_OVERRIDE`, `INCLUDE_DROPPED` |
| `CSV_OUT=/tmp/o.csv just audit-orchestrator-diff` | Snapshot/diff orchestrator. `CSV_OUT` requis. | `CSV_OUT`, `BASELINE`, `LIMIT` |
| `just audit-actif-class` | Audit passe 2 (cluster pharmacologique). | `LIMIT` |
| `just audit-aha-bha-pha` | Audit AHA/BHA/PHA + overrides. `APPLY=1` destructif. | `CSV_OUT`, `CSV_DIR`, `LIMIT`, `APPLY`, `APPLY_FROM_CSV` |
| `WRITE=1 just audit-product-kinds` | `products.kind` mistagués (auto-fix avec `WRITE`). | `SLUG`, `WRITE` |
| `just gold-set-bootstrap` | Échantillonne 60-80 produits → `annotations.json`. | `SAMPLE_SIZE`, `POSITIVES_PER_TAG`, `NEGATIVES_PER_TAG`, `SEED`, `GOLD_SET_PATH` |
| `just audit-gold-set` | Bench orchestrator vs gold-set. | `GOLD_SET_PATH`, `CSV_OUT`, `STRICT` |

Exemples :
```bash
LIMIT=50 just audit-actif-class
SLUG=la-roche-posay-effaclar WRITE=1 just audit-product-kinds
TARGET=prod WRITE=1 just backfill-auto-tags          # confirmation requise
CSV_OUT=/tmp/orch.csv BASELINE=/tmp/old.csv just audit-orchestrator-diff
```

Voir détails dans `backend/src/features/auto-tagging/docs/AUTO-TAGS.md`.

### Ingest data externe

Read-only par défaut, `WRITE=1` (env var) pour appliquer.

| Commande | Ce qu'elle fait | Env vars |
|---|---|---|
| `REFRESH=1 WRITE=1 just ingest-peta` | Importe statut cruelty-free PETA (brand-level). | `REFRESH`, `WRITE`, `STRICT_PRUNE` |
| `DOWNLOAD=1 WRITE=1 just ingest-obf` | Importe labels Open Beauty Facts depuis dump CSV.gz. | `DOWNLOAD`, `WRITE`, `THRESHOLD`, `NO_WHITELIST` |
| `just ingest-incidecoder crawl` | Scrape INCIDecoder. Phase positionnelle : `crawl\|match\|fetch\|apply`. | — |

### Maintenance & dédup produits

| Commande | Ce qu'elle fait | Env vars |
|---|---|---|
| `WRITE=1 just audit-imported-products` | Détecte doublons post-import. `WRITE=1` écrit `output/imported-products-audit.{json,md}`. | `WRITE` |
| `APPLY=1 just dedupe-product-variants` | Fusionne variants même slug-base. Dry-run par défaut. | `APPLY` |
| `just scan-db-duplicates /path/to/backup.sql` | Diagnostic offline doublons depuis backup SQL (arg positionnel). | — |

### INCI & images

| Commande | Ce qu'elle fait | Env vars |
|---|---|---|
| `FULL=1 just audit-inci-quality` | Audit corpus INCI : tokens non matchés + INCI pathologiques. | `FULL` |
| `SLUG=… URL=… just image-upload` | Upload une image vers Bunny CDN + update DB. | `SLUG`, `URL`, `FILE`, `BATCH`, `DRY`, `NO_DB`, `NO_STAGED`, `CONCURRENCY` |
| `just image-upload-batch` | Batch depuis `output/images-source/`. | — |
| `APPLY=1 just image-patch-urls` | Force `products.image_url` vers convention CDN. Dry par défaut. | `APPLY` |
| `BRAND=uriage TOP=50 just image-analyze-orphans` | Images CDN sans produit DB matchant. | `BRAND`, `TOP` |
| `just image-dump-orphans` | Dump JSON orphelins (consommable par `delete-bunny.ts` manuel). | — |

---

## Niveau 3 — Manuel via `bun run`

Pas de recette `just` — c'est volontaire. Ces scripts sont **des one-shots** (data cleanup unique post-incident), **des diagnostics exploratoires**, ou **des benchmarks rares**. Pas la peine d'encombrer le menu `just`.

**Règle :** si tu lances un de ces scripts plus de 2× par mois, propose-le pour devenir une recipe `just`.

### 🌱 Seeders complémentaires (rare, appelés par seed-core)

```bash
bun run src/db/seed/seeders/seed-blog.ts                 # articles de blog
bun run src/db/seed/seeders/seed-brand-certifications.ts # certifs vegan/cruelty-free statiques
bun run src/db/seed/seeders/seed-user-collection.ts      # collection seed-user
bun run src/db/seed/seeders/create-user.ts               # créer un user à la main
```

### 🛠 One-shots data — résolus, gardés pour archive

```bash
bun run src/db/seed/maintenance/canonicalize-volume-variants.ts --dry
bun run src/db/seed/maintenance/disambiguate-product-names.ts --dry
bun run src/db/seed/maintenance/fix-tag-domain-consistency.ts          # --write pour apply
```

Ces scripts ont été lancés une fois lors de cleanups historiques (`fix-tag-domain-consistency` = post multi-domain migration April 2026, supprime les `tag_products` dont le `tagType` est invalide pour le domaine du produit). Si la situation se représente, dry-run puis apply.

### 🔍 Diagnostics seed-data (exploratoires)

```bash
bun run src/db/seed/maintenance/audit-ingredients-sync.ts             # sync config↔data
bun run src/db/seed/maintenance/audit-ingredient-tags-coverage.ts     # distribution tags
bun run src/db/seed/maintenance/audit-product-tags-coverage.ts        # tags par produit
bun run src/db/seed/maintenance/audit-products-missing-ingredients.ts # produits orphelins
```

À lancer si tu suspectes une dérive après gros refacto seed.

### 🧪 INCI — cleanups one-shot + bench

```bash
# Bench parser FR (avant/après refacto algo-derm)
bun run src/db/seed/inci/benchmark-fr-parser.ts

# Cleanups one-shot — s'utilisent dans cet ordre si le scraper a tout cassé.
# (Tous ont déjà tourné une fois ; relancer seulement après un mauvais import massif.)
bun run src/db/seed/inci/cleanup/preamble.ts          # strip "Ingrédients :" intro
bun run src/db/seed/inci/cleanup/prose.ts             # strip prose avant INCI
bun run src/db/seed/inci/cleanup/separators.ts        # normalise séparateurs cassés
bun run src/db/seed/inci/cleanup/trailing-prose.ts    # strip légal/marketing après
bun run src/db/seed/inci/cleanup/resplit-single-token.ts  # re-tokenize blob unique
```

Voir `backend/src/db/seed/docs/audits/INCI-QUALITY-AUDIT.md` pour le workflow complet.

### 🖼 Images CDN — opérations manuelles

```bash
# Fetchers (gitignored, jetés après usage — code spécifique par marque)
bun run src/images/fetchers/<brand>.ts                # ex: shopify.ts, deciem.ts

# Upload : `just image-upload` pour le workflow standard.
# `src/images/upload/lib.ts` = fonction réutilisable, PAS un script à lancer.
bun run src/images/upload/dry-run.ts                  # preview d'un upload

# Audit / maintenance
bun run src/images/audit/bunny.ts                     # liste fichiers sur Bunny CDN
bun run src/images/maintenance/fix-broken-refs.ts     # répare URLs cassées
bun run src/images/maintenance/delete-bunny.ts        # ⚠️ destructif, manuel only
bun run src/images/maintenance/build-mapping.ts       # construit mapping slug→fichier
```

Voir `backend/src/db/seed/docs/IMAGES.md` pour le workflow images complet (CDN, S3, conventions).

### 🏋 Benchmarks DB (rares)

```bash
backend/src/db/bench/rls-init-plan.sh    # bench RLS init-plan optimization
```

Ponctuel, lancé quand on touche aux policies RLS.

---

## Workflows typiques

### Tu débarques sur le projet

```bash
just init           # installe deps + hooks lefthook
just dev-fresh      # premier docker up + DB + seed complet
just ts-check       # à laisser tourner pour types live
just dev            # boucle de dev quotidienne
```

### Tu as modifié le schéma DB

```bash
just db-generate    # crée une migration depuis le diff
# (relis la migration générée dans backend/src/db/migrations/)
just db-migrate     # applique en local
just test           # vérifie pas de régression
```

### Tu as modifié les données seed (ingrédients, tags, produits canoniques)

```bash
just db-seed        # idempotent, ajoute le nouveau sans wipe
# si tu as supprimé/renommé des slugs :
just db-seed-reset  # wipe + reseed (perd la data manuelle en DB dev)
```

### Tu débugues une régression auto-tag

```bash
just audit-auto-tags                            # vue d'ensemble dry-run
CSV_OUT=/tmp/a.csv just audit-orchestrator-diff   # snapshot
# (modifies le code)
CSV_OUT=/tmp/b.csv BASELINE=/tmp/a.csv just audit-orchestrator-diff   # diff
just audit-gold-set                             # check vs ground truth
```

### Tu importes une nouvelle marque

1. Crée le fichier seed dans `backend/src/db/seed/data/products/<categorie>/<brand>.ts` (cf `docs/SEED_FORMAT.md`)
2. `just db-seed` pour insérer
3. Si INCI manquant : `just ingest-incidecoder crawl` puis `match` puis `fetch`
4. Si images manquantes : crée un fetcher dans `src/images/fetchers/<brand>.ts`, lance-le, puis `BATCH=output/<brand>-jobs.json just image-upload`
5. `just audit-db` pour vérifier intégrité
6. `WRITE=1 just backfill-auto-tags` pour générer les tags (ou wait — `seed-core` les a déjà créés au step 2)

### Tu nettoies la DB après un mauvais import

```bash
just audit-imported-products           # détecte (console)
WRITE=1 just audit-imported-products   # écrit output/imported-products-audit.{json,md}
# (relis output/imported-products-audit.md)
just dedupe-product-variants           # dry-run
APPLY=1 just dedupe-product-variants   # apply
just audit-db                          # check final
```

### Tu refresh la data brand-level (cruelty-free, labels OBF)

```bash
REFRESH=1 just ingest-peta             # dry-run avec re-fetch
REFRESH=1 WRITE=1 just ingest-peta     # apply

DOWNLOAD=1 just ingest-obf             # dry-run avec re-download
DOWNLOAD=1 WRITE=1 just ingest-obf     # apply
```

---

## Conventions de nommage

- **`main.ts`** dans un sous-dossier = le runner CLI principal (entry point).
- **`lib.ts`** = code réutilisable, **pas** un script lançable.
- **`*.test.ts`** = test unitaire/intégration (découvert par bun:test).
- **`audit-*`** = read-only par défaut, write avec flag.
- **`backfill-*`** = applique sur la DB existante, idempotent.
- **`fetch-*`** (legacy) / **fetchers/`** = scrape depuis source externe.
- **`cleanup-*`** = répare une dégradation data (one-shot).
- **`ingest-*`** (legacy) / **ingest/`** = import data externe → DB.

---

## Quand quelque chose te semble manquant

- **Pas de recette `just` pour un script** → c'est un one-shot ou diagnostic. Lance via `bun run <chemin>`. Si tu te retrouves à le lancer ≥2× par mois, propose-le pour entrer dans le justfile :
  - Ingest / maintenance produits / dédup → `just/data.just`
  - Images CDN → `just/images.just`
  - INCI corpus / parser → `just/inci.just`
  - Auto-tag pipeline → `just/audit.just`
- **Tu trouves un script qui n'a aucun rapport avec son dossier** → probablement un reliquat de refacto. Ouvre une issue ou propose-le-toi.
- **Le commentaire en tête de fichier indique l'usage exact** — toujours commencer par là avant d'inventer des flags.

---

## Prod

Toutes les recettes `data.just` / `images.just` / `inci.just` acceptent la variable d'environnement `TARGET=dev|prod` (default `dev`).

> ⚠️ **Important** : `TARGET` est une **env var**, pas un paramètre. Préfixe la commande, ne la passe pas en argument (just 1.x interprète `target=prod` comme positionnel et tu te retrouves silencieusement en `dev`).

### Audit sur prod (read-only, safe)

```bash
TARGET=prod just audit-imported-products    # liste doublons en DB prod
TARGET=prod just audit-inci-quality         # qualité INCI corpus prod
TARGET=prod just image-analyze-orphans      # images CDN orphelines prod
TARGET=prod just image-dump-orphans
TARGET=prod just dedupe-product-variants    # dry-run sur prod (pas apply)
```

Ces commandes lisent la prod DB et impriment des stats. Aucun risque.

### Écriture sur prod

Tout `WRITE=1`, `APPLY=1`, ou écriture implicite (`image-upload` sans `DRY=1` ni `NO_DB=1`) avec `TARGET=prod` **déclenche une confirmation interactive** :

```
⚠ PROD WRITE (dedupe variants) — tape 'PROD' pour confirmer
> _
```

Tu dois taper exactement `PROD`. Tout autre input abandonne.

```bash
# Exemples production-write
TARGET=prod REFRESH=1 WRITE=1 just ingest-peta
TARGET=prod DOWNLOAD=1 WRITE=1 just ingest-obf
TARGET=prod just ingest-incidecoder apply
TARGET=prod APPLY=1 just dedupe-product-variants
TARGET=prod APPLY=1 just image-patch-urls
TARGET=prod SLUG=brand-product URL=… just image-upload
TARGET=prod WRITE=1 just backfill-auto-tags
TARGET=prod WRITE=1 just audit-product-kinds
```

### Avant un write prod

1. **Backup** : `just db-backup-prod` (existe déjà dans `db.just`).
2. **Dry-run d'abord** : lance sans `write=1` / `apply=1` pour voir l'impact.
3. **Audit après** : `just audit-db` pour vérifier intégrité (note : `audit-db` ne supporte pas encore TARGET).

### Confirmations prod par niveau de danger

| Type | Phrase à taper |
|---|---|
| Write idempotent (`WRITE=1`, `APPLY=1`, ingest) | `PROD` |
| Migration schéma (`db-migrate`) | `PROD` |
| TRUNCATE / wipe (`db-clean`, `db-seed-reset`, `db-restore`) | `I DESTROY PROD` |

Les composites héritent du `TARGET` et déclenchent chaque sous-confirmation séquentiellement. Exemple : `TARGET=prod just db-reset` demande 3 confirmations (clean → migrate → seed).

### Recettes dev-only par design

Restent dev-only (concept ou outil purement local) :
- `db-push` — bypass migrations, jamais sur prod
- `db-generate` — génère des fichiers locaux
- `db-studio` — GUI sur localhost
- `db-snapshot`, `db-snapshot-load`, `db-snapshot-reset` — le snapshot est la source de vérité **dev** (`backend/src/db/snapshot/data.sql`, committé)

---

## Liens vers doc plus profonde

- Architecture globale : `docs/archi/architecture.md`
- Seed & taxonomie : `backend/src/db/seed/docs/STATE.md`
- Auto-tagging : `backend/src/features/auto-tagging/docs/AUTO-TAGS.md`
- Dédup : `backend/src/db/seed/docs/DEDUP.md`
- Images CDN : `backend/src/db/seed/docs/IMAGES.md`
- INCI quality : `backend/src/db/seed/docs/audits/INCI-QUALITY-AUDIT.md`
- E2E tests : `docs/frontend/e2e.md`
- Runbook prod : `docs/ops/runbook.md`
