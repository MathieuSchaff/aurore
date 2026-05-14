# Prompt de reprise — Auto-tagging primary V2 (concern + haircare/dental)

```
Session de continuité — projet Aurore, branche auto-tags.

CONTEXTE PROJET
Aurore = habit tracker TDAH, fullstack Bun/Docker (monorepo).
Répertoire : ~/Mathieu/projets/aurore/
Stack : Hono RPC backend, TanStack Router frontend, Drizzle ORM, PostgreSQL.

ÉTAT À LA REPRISE

Précédente session V1 (Option A — kind-derived type-* primary) : LIVRÉE.
  - Orchestrator extend : AutoTagRelevance = 'primary' | 'secondary' | 'avoid'.
    Précédence : avoid > primary > secondary.
    Post-pass promeut `detectKindPrimaryType(kind)` à primary.
  - Backfill runner V1-gate : promotion only si produit a 0 primary en DB
    (préserve curation manuelle, n'écrase pas les chips ProductCard).
  - Résultat : skincare/bodycare/solaire = 0 no_primary.
    Résiduel : haircare 23 + dental 5 = 28 produits.

ITEM À TRAITER — V2 (deux pistes possibles)

Piste B — Étendre primary auto aux haircare/dental (28 produits)
  - Actuellement AUTO_TAG_ELIGIBLE_CATEGORIES = ['skincare','solaire','bodycare']
    → orchestrator no-op sur haircare/dental.
  - Besoin d'un mapping `ProductKind → HAIRCARE_PRODUCT_TAG_SLUGS / DENTAL_*`
    pour shampooing/dentifrice/etc. (slugs ≠ TYPE_* skincare).
  - Voir backend/src/db/seed/data/products/haircare/ledNoreva/ledNoreva.seed.ts
    pour exemples curés manuellement (HAIRCARE_PRODUCT_TAG_SLUGS.SHAMPOOING).
  - Approche : nouveau passe `kind-primary-non-cosmetic.ts` ou extension
    KIND_TO_TAGS + relâcher la gate AUTO_TAG_ELIGIBLE_CATEGORIES uniquement
    pour la sous-route kind-primary (ne pas activer les passes INCI sur
    haircare/dental — algo-derm non calibré pour ces catégories).

Piste C — Enrichir primary skincare/bodycare avec concern + routine_step
  - Aujourd'hui chaque produit V1 a UN primary (type-*). Existant curé
    skincare = médiane 2-3 primaries (concern + step + effect).
  - Objectif : faire pareil automatiquement pour les 1118 produits remplis
    en V1 (et tout nouveau produit créé).
  - Règles à définir (cf docs/audits/NEXT-SESSION-PROMPT antérieur, Option C
    de la planning session 2026-05-13) :
      • Top-1 concern algo-derm si confidence ≥ 0.70 ET coverage ≥ 0.50
      • Routine_step_v2 kind-derived (step-traitement pour serum, etc.)
  - Risque : faux positifs concern si seuil mal calibré → audit gold-set
    OBLIGATOIRE avant WRITE.
  - Préférer Piste C SEULEMENT si on accepte de mettre à jour la gate V1
    (aujourd'hui : skip si produit a déjà 1 primary). V1-gate empêcherait
    Piste C de tourner sur les 1118 produits déjà touchés.

Recommandation : Piste B d'abord (28 produits, risque nul, déterministe),
puis Piste C (1118 produits, calibration nécessaire).

FICHIERS CLÉS

  backend/src/features/auto-tagging/
    orchestrator.ts                      (post-pass detectKindPrimaryType ligne ~261)
    passes/kind-tag-detection.ts         (detectKindPrimaryType + KIND_TO_TAGS)
    runners/backfill/main.ts             (V1-gate productsWithPrimary)
    docs/ROADMAP.md §1                   (item original)
    docs/AUTO-TAGS.md                    (archi 6 passes)

  shared/src/products/
    haircare-tags.ts (?)                 (HAIRCARE_PRODUCT_TAG_SLUGS — vérifier)
    dental-tags.ts (?)                   (DENTAL_PRODUCT_TAG_SLUGS — vérifier)

  backend/src/db/seed/data/products/haircare/ledNoreva/ledNoreva.seed.ts
    (exemple primary haircare curé)

INVARIANTS

  - Commits : Conventional Commits ≤ 72 chars, JAMAIS Co-Authored-By Claude.
  - just audit-db → 0 violation avant tout commit.
  - just audit-gold-set inchangé (F1=0.995 baseline 2026-05-13).
  - just test-dev "auto-tag" → 444 pass baseline.
  - Snapshot DB avant WRITE destructif.

ENVIRONNEMENT

  Re-count no_primary :
    docker exec -e PGPASSWORD=devpassword app_db psql -U app -d appdb -c "
      SELECT p.category, COUNT(*) AS no_primary
      FROM products p
      WHERE NOT EXISTS (
        SELECT 1 FROM tag_products tp
        WHERE tp.product_id=p.id AND tp.relevance='primary'
      )
      GROUP BY 1 ORDER BY 2 DESC;"

  Backfill : just backfill-auto-tags (dry) / WRITE=1 just backfill-auto-tags

ITEMS SUIVANTS

  - Après V2 : ROADMAP §2 (skin_type sous-rempli, labels absents)
  - ROADMAP §4 P2 (products.kind hétérogène → product_type tag auto-derivé)

PIÈGES

  - V1-gate : si tu modifies l'orchestrator pour émettre concern primary,
    la gate "skip si déjà 1 primary" du runner va l'absorber. Adapter la
    gate par tagType si tu veux Piste C (e.g. "skip si déjà primary DE CE
    tagType").
  - Haircare/dental n'ont PAS d'INCI calibré pour algo-derm — ne pas
    activer les passes 1/2/4/5/6 sur ces catégories.
```
