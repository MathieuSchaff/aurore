# Prompt de reprise — post-session 2026-05-13

```
Session de continuité — projet Aurore, branche auto-tags.

CONTEXTE PROJET
Aurore = habit tracker TDAH, fullstack Bun/Docker (monorepo).
Répertoire : ~/Mathieu/projets/aurore/
Stack : Hono RPC backend, TanStack Router frontend, Drizzle ORM, PostgreSQL.
Lib dermo locale : algo-derm (tarball vendoré dans vendor/algo-derm.tgz).

ÉTAT POST-SESSION 2026-05-13

§2 INCI définitivement à plateau. Parser fix M.2 livré.
Bench (FR skincare / FR other / non-FR) : 78.5% / 75.2% / 80.2%
812 entrées evidence, 194 tests algo-derm pass.

Livré (commits récents) :
- feat(vendor): bump algo-derm — merge bare-digit IUPAC tokens in splitINCI
  Token `1` (29 occ non-FR) éliminé. `1, 2-Hexanediol` scraper-space variant
  désormais correctement parsé. Gain sub-rounding (<0.04% sur 77K tokens).
- Commit algo-derm : fix(parser): merge bare-digit token with following
  digit-start after split

PIÈGE CRITIQUE algo-derm (ne pas répéter)

JAMAIS modifier ingredient_evidence.merged.json directement — c'est un
build output. Séquence correcte pour ajouter de l'evidence :
  1. Éditer algo-derm/data/sources/curated.generated.json
  2. cd ~/Mathieu/projets/algo-derm && npm run merge:dataset
  3. cd ~/Mathieu/projets/aurore && just vendor-algo-derm
  4. Vérifier bun.lock (hash algo-derm vidé → bun install régénère)
  5. just reinstall-backend
  6. bench
JAMAIS npm run check:all (écrase curated.generated.json via build:dataset).

§2 INCI — FERMÉ

Plus aucun levier à ROI positif :
- Tokens restants non-FR : ppg-26-buteth-26 (28), pca (28),
  ethyl hexanediol (28), synthetic fluorphlogopite (28) — ROI < 0.1 pt total.
- `1 2 hexanediol` (27 occ) = `1,2-hexanediol` sans tiret (scraper).
  Data quality, pas parser. Pas adressable sans re-scrape.
- Tokens FR restants ≤14 occ — sub-threshold.

Ne pas rouvrir §2 sauf re-scrape majeur ou nouvelle source evidence.

ITEMS OUVERTS — par ROI décroissant

1. §4 Auto-tagging : voir features/auto-tagging/docs/ROADMAP.md

2. §3 Images CDN :
   - 59 URL Skinsafe en 403 (browser automation scrapper-para)
   - 127 produits sans image_url (top : nutripure 16, mustela 9, avène 7)
   - 2 URL Atida en 404 → NULL

INVARIANTS

- Commits : Conventional Commits ≤72 chars, JAMAIS Co-Authored-By Claude.
- Modif algo-derm → séquence complète ci-dessus obligatoire.
- just audit-db → 0 violation avant tout commit seed.
- Snapshot DB avant tout UPDATE products.

ENVIRONNEMENT

Bench :
  docker exec -w /app/backend \
    -e DATABASE_URL='postgres://app:devpassword@app_db:5432/appdb' \
    app_api bun src/db/seed/inci/benchmark-fr-parser.ts

Audit full INCI :
  docker exec -w /app/backend \
    -e DATABASE_URL='postgres://app:devpassword@app_db:5432/appdb' \
    -e INCI_AUDIT_FULL=1 \
    app_api bun src/db/seed/inci/audit-quality.ts \
    > backend/src/db/seed/docs/audits/_archive/inci-audit-YYYY-MM-DD-<tag>.txt

Stack Docker : just dev-d  (ou just dev pour les logs)
Types check : just ts-verify
Lint : just lint-fix

FICHIERS CLÉS

- backend/src/db/seed/docs/ROADMAP.md (état global seed)
- backend/src/features/auto-tagging/docs/ROADMAP.md (§4 auto-tag)
- backend/src/db/seed/docs/audits/_archive/inci-audit-2026-05-12-after-evidence-30.txt §2

---
Autonome : tout ce qu'il faut pour reprendre sans relire 50 commits.
Le piège bun.lock (hash algo-derm) est le point le plus important.
```
