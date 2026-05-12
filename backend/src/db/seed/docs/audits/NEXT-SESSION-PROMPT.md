# Prompt de reprise — post-session 2026-05-13 (#16 + #19 livrés)

```
Session de continuité — projet Aurore, branche auto-tags.

CONTEXTE PROJET
Aurore = habit tracker TDAH, fullstack Bun/Docker (monorepo).
Répertoire : ~/Mathieu/projets/aurore/
Stack : Hono RPC backend, TanStack Router frontend, Drizzle ORM, PostgreSQL.
Lib dermo locale : algo-derm (tarball vendoré dans vendor/algo-derm.tgz).

ÉTAT POST-SESSION 2026-05-13

Livré pendant cette session (commits sur disque) :

1. #17 algo-derm parser FR esters Vit-C  (commit bd876e4 algo-derm)
   - RE_ACIDE_HEAD_TRAILING_MOD + RE_BARE_ACID_TRAILING.
   - +3 tests, suite parser 44/44 ✅.
   - Recovered : anua-peach-70-niacin-serum (vit-C drift).

2. #16 algo-derm parser FR `Acide X de Y`  (même commit bd876e4)
   - RE_ACIDE_DE_MOD : `acide <stem>ic de <mod>` → `<mod> <stem>ic acid`.
   - Stem restreint au suffixe `-ic` (post `RE_IQUE_TO_IC`) pour ne pas
     avaler des FR phrases comme `acide gras de coco`.
   - +3 tests, suite parser 44/44 ✅.
   - Recovered : jumiso-waterfull-hyaluronic-acid-cleansing-foam (BHA).

3. #18 Aurore aliases parens-stripped  (commit 06f3326e Aurore)
   - vitamin-e : `vitamin e`, `vitamine-e`.
   - polyphenols : `green tea`.
   - Rejetés par audit precision : `cocoa`/`cacao`/`theobroma cacao*`
     (cocoa butter emollient ubiquitaire → 62-198 over-tags).
   - Recovered : deliverance-serum, beauty-of-joseon-red-bean-water-gel,
     isispharma-xerolan-spray.

4. #19 Aurore raw-INCI scan ferment substrate  (même commit 06f3326e)
   - `RAW_SCAN_SLUGS = {polyphenols}` : 2e passe scanne la chaîne raw
     INCI lowercased contre les patterns du cluster.
   - Contourne `applyCompositeFerment` qui strippe le substrate par
     design (`LACTOBACILLUS/PUNICA GRANATUM FRUIT FERMENT EXTRACT` →
     `lactobacillus ferment extract`).
   - polyphenols only_db 10 → 0 (recall +10, 0 over-tag, 100 % agree).
   - Recovered : mixsoon-bean-essence, mixsoon-bean-cleansing-oil,
     garancia-marabout-l-elixir, garancia-marabout-coffret, missha-time-
     revolution-night-repair-ampoule + probio, missha-pure-source-cell-
     sheet-mask-pomegranate, numbuzin-no3, respire-gelee, dr-ceuracle-
     pro-balance.

DRIFT ACTIF-CLASS — bilan session

Avant session : 17 false-pos + 42 pos-cap + 2 parse-fail (= 61)
Après #16     : 16 false-pos (-1 jumiso BHA)
Après #19     : 6 false-pos (-10 polyphenols cluster fully resolved)
Total session : drift global 61 → 50 (-11 false-pos).

Reste : 6 false-pos singletons (retinoids ×1, vitamin-c ×2, hyaluronic
×1, peptides ×1, tyrosinase ×1). Case-by-case ou data quality.

ITEMS OUVERTS — par ROI décroissant

1. §5.2 Overrides AHA/BHA/PHA (FULL-AUDIT) :
   42 produits pos-cap (acide past position cap, légitime miss algo).
   Décision politique ouverte :
   - A. Relax cap leave-on 10 → 12-15 (risque over-tag)
   - B. Accepter drift (manual = source de vérité si dermato a flaggé)
   - C. Au cas par cas via review manuelle
   AHA 13, BHA 21, PHA 8.

2. 6 false-pos résiduels :
   - retinoids : 1 (garancia-trousse-voyage-2025-303627 ?)
   - vitamin-c : 2
   - hyaluronic-acid : 1 (garancia idem)
   - peptides : 1 (garancia idem)
   - tyrosinase-inhibitors : 1 (anua-soothing-pad-azelaic)
   Probable : produits coffret/trousse (INCI manquant ou agrégé) +
   cluster `azelaic acid` non géré (anua azelaic).

3. §7 Gaps archi (FULL-AUDIT) :
   CHECK CONSTRAINT Postgres sur products.category/kind/unit.

4. Priorité 2 — Auto-tagging primary (gros chantier différé) :
   1101 produits sans tag primary.
   Doc : backend/src/features/auto-tagging/docs/ROADMAP.md §1.

TREE NON-COMMIT (working tree au moment de la reprise)

- frontend/src/lib/queries/products.ts (M)
- frontend/src/lib/queries/user-products.ts (M)
- frontend/src/lib/queries/optimistic.ts (??)
- backend/src/db/seed/docs/audits/_archive/inci-audit-2026-05-12-after-prose-fix.txt (??)

Le refacto TanStack Query optimistic helpers est uncommitted, non lié
auto-tags. À investiguer si pas vu dans une autre branche.

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
= source de vérité produits. Avant UPDATE products → just db-backup.

PIÈGE precision actif-class

Tout alias ajouté à actif-class-detection.ts doit être benchmarké :
  docker exec -w /app/backend \
    -e DATABASE_URL='postgres://app:devpassword@app_db:5432/appdb' \
    app_api bun src/features/auto-tagging/runners/audit/actif-class.ts
Vérifier `new` (auto sans manual) ≤ recall gagné. Cocoa butter / cacao
butter / autres emollients courants → aliases trop génériques causent des
dizaines à centaines de over-tags. Privilégier patterns avec qualifier
`extract` ou Latin complet.

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
- backend/src/features/auto-tagging/runners/audit/drift-classify.ts
- backend/src/features/auto-tagging/runners/audit/drift-cleanup.ts
- backend/src/features/auto-tagging/runners/audit/actif-class.ts
- backend/src/db/seed/docs/audits/FULL-AUDIT.md §5.1
- docs/algo/algo-derm-aurore-integration.md §3.6 (gitignored — tickets)
- ~/Mathieu/projets/algo-derm/src/parser.ts

---
Autonome : tout pour reprendre sans relire les commits de session.
Pièges bun.lock (hash algo-derm) + seedCore(true) + audit precision =
points critiques.
```
