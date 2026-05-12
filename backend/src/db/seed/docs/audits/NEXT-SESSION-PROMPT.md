# Prompt de reprise — post-session 2026-05-13 (drift 0 FP / 0 parse-fail / tyrosinase 100%)

```
Session de continuité — projet Aurore, branche auto-tags.

CONTEXTE PROJET
Aurore = habit tracker TDAH, fullstack Bun/Docker (monorepo).
Répertoire : ~/Mathieu/projets/aurore/
Stack : Hono RPC backend, TanStack Router frontend, Drizzle ORM, PostgreSQL.
Lib dermo locale : algo-derm (tarball vendoré dans vendor/algo-derm.tgz).

ÉTAT À LA REPRISE (HEAD = a1842b64)

Drift actif-class :
  - 0 false-positive
  - 0 parse-fail
  - 42 pos-cap résiduels (AHA 13 / BHA 21 / PHA 8 — légitimes algo miss)
  - 13 clusters, agree 100 % sauf pos-cap susmentionnés

Tous les FP, parse-fail et drift baseline ont été clos sur la branche
auto-tags. La taxonomie actif-class est stable. Prochains chantiers
listés dans ITEMS OUVERTS ci-dessous.

TRAJECTOIRE DRIFT (historique court)

  - 2026-05-12      : 17 FP → 6 FP (#16/#17/#18/#19 — parser algo-derm
                      FR esters Vit-C, `Acide X de Y`, aliases parens-
                      stripped + raw-INCI scan ferments)
  - 2026-05-13 (1)  : 6 FP → 0 FP — azelaic ajouté à tyrosinase
                      cluster (+45 new), `acide ascorbic` FR résiduel
                      Vit-C, drift-cleanup +4 (cosrx-retinol-01-cream,
                      garancia-trousse coffret, etc.)
  - 2026-05-13 (2)  : parse-fail 2 → 0, tyrosinase 76 % → 100 %
                      - mary-may-blackberry INCI re-scrape INCIDecoder
                      - 45 azelaic-line products promus baseline manuel

ITEMS OUVERTS — par ordre simple → complexe

1. §7 Gaps archi (FULL-AUDIT) — CHECK CONSTRAINT Postgres
   sur products.category/kind/unit. Migration Drizzle + valider données
   existantes avant. ~2-3h.

2. §5.2 Overrides AHA/BHA/PHA (FULL-AUDIT) — 42 produits pos-cap.
   Acide past position cap = légitime miss algo. Décision politique
   pendante :
     A. Relax cap leave-on 10 → 12-15 (risque over-tag)
     B. Accepter drift (manual = source de vérité si dermato a flaggé)
     C. Au cas par cas via review manuelle
   ~3-5h selon option.

3. Priorité 2 — Auto-tagging primary (gros chantier différé).
   1101 produits sans tag primary.
   Doc : backend/src/features/auto-tagging/docs/ROADMAP.md §1.

TREE NON-COMMIT (working tree au moment de la reprise)

- frontend/src/lib/queries/products.ts (M)
- frontend/src/lib/queries/user-products.ts (M)
- frontend/src/lib/queries/optimistic.ts (??)
- backend/src/db/seed/docs/audits/_archive/inci-audit-2026-05-12-after-prose-fix.txt (??)

Refacto TanStack Query optimistic helpers uncommitted, non lié auto-tags.
À investiguer si pas vu dans une autre branche.

PIÈGE CRITIQUE algo-derm (ne pas répéter)

JAMAIS modifier ingredient_evidence.merged.json directement — c'est un
build output. Séquence correcte pour modif algo-derm :
  1. Éditer code algo-derm/src/* ou data/sources/curated.generated.json
  2. (Si evidence) cd ~/Mathieu/projets/algo-derm && npm run merge:dataset
  3. cd ~/Mathieu/projets/aurore && just vendor-algo-derm
  4. Vérifier bun.lock (hash algo-derm vidé → bun install régénère)
  5. just reinstall-backend
  6. (Si parser) re-run tests parser dans algo-derm + drift-classify Aurore
JAMAIS npm run check:all (écrase curated.generated.json via build:dataset).

PIÈGE seed (mémoire)

seedCore(true) wipe la dev DB. Snapshot ./backend/src/db/snapshot/data.sql
= source de vérité produits. Avant UPDATE products → just db-backup,
après → just db-snapshot + commit data.sql.

PIÈGE precision actif-class

Tout alias ajouté à actif-class-detection.ts doit être benchmarké :
  docker exec -w /app/backend \
    -e DATABASE_URL='postgres://app:devpassword@app_db:5432/appdb' \
    app_api bun src/features/auto-tagging/runners/audit/actif-class.ts
Vérifier `new` (auto sans manual) ≤ recall gagné. Cocoa butter / cacao
butter / autres emollients courants → aliases trop génériques causent des
dizaines à centaines de over-tags. Privilégier patterns avec qualifier
`extract` ou Latin complet.

Exception : actif spécifique fonctionnel (azelaic acid clinical, kojic
acid, arbutin, etc.) peut révéler du sous-tagging manuel légitime ; ratio
new/recall > seuil acceptable si tous les nouveaux produits ont l'actif
en INCI et un kind leave-on cohérent.

PIÈGE algo-derm normalize FR

algo-derm normalize fait `-ique` → `-ic` (acide ascorbique → acide
ascorbic). Le swap FR→EN word order (`acide X-ic` → `X-ic acid`) peut
échouer si une phrase marketing trailing dans le token casse la regex.
Pour les patterns FR dans actif-class : tester d'abord en DB ce que
splitINCI+normalize renvoie, puis matcher le résidu réel.

INVARIANTS

- Commits : Conventional Commits ≤72 chars, JAMAIS Co-Authored-By Claude.
- Modif algo-derm → séquence complète ci-dessus obligatoire.
- just audit-db → 0 violation avant tout commit seed.
- Snapshot DB avant tout UPDATE products.
- docs/ gitignored → tickets §3.6 sur disque uniquement, pas de commit step.

ENVIRONNEMENT

Drift classifier (Aurore) :
  docker exec -w /app/backend \
    -e DATABASE_URL='postgres://app:devpassword@app_db:5432/appdb' \
    app_api bun src/features/auto-tagging/runners/audit/drift-classify.ts

Audit actif-class (Aurore) :
  docker exec -w /app/backend \
    -e DATABASE_URL='postgres://app:devpassword@app_db:5432/appdb' \
    app_api bun src/features/auto-tagging/runners/audit/actif-class.ts

Drift cleanup (Aurore, idempotent) :
  docker exec -w /app/backend \
    -e DATABASE_URL='postgres://app:devpassword@app_db:5432/appdb' \
    -e APPLY=1 \
    app_api bun src/features/auto-tagging/runners/audit/drift-cleanup.ts

Tests parser algo-derm :
  cd ~/Mathieu/projets/algo-derm && node --test test/parser.test.mjs

Tests actif-class Aurore :
  just test-db-up && just test-dev "actif-class-detection"

Stack Docker : just dev-d  (ou just dev pour les logs)
Types check : just ts-verify
Lint : just lint-fix

FICHIERS CLÉS

- backend/src/features/auto-tagging/passes/actif-class-detection.ts
- backend/src/features/auto-tagging/lib/ingredient-resolver.ts
- backend/src/features/auto-tagging/runners/audit/drift-classify.ts
- backend/src/features/auto-tagging/runners/audit/drift-cleanup.ts
- backend/src/features/auto-tagging/runners/audit/actif-class.ts
- backend/src/db/seed/docs/audits/FULL-AUDIT.md §5.1, §5.2, §7
- docs/algo/algo-derm-aurore-integration.md §3.6 (gitignored — tickets)
- ~/Mathieu/projets/algo-derm/src/parser.ts

---
Autonome : tout pour reprendre sans relire les commits de session.
Pièges bun.lock (hash algo-derm) + seedCore(true) + audit precision +
algo-derm normalize FR = points critiques.
```
