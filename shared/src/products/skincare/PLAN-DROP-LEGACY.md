# Drop legacy skincare tag axes

> Drop séquentiel des 2 axes legacy déjà remplacés par leur split v2.
> Phase A (soft tier=internal) **skip** — direct hard drop.

---

## Contexte

Deux refactors v2 sont landés sur `products-branch` (2026-05-02) :

| Axe legacy      | Slugs | V2 cible                                       | Backfill         |
|-----------------|-------|------------------------------------------------|------------------|
| `product_type`  | 42    | `product_type_v2` (12) + `texture` (9) + `skin_zone` (+pieds) | 4145 rows / 2585 paires |
| `routine_step`  | 15    | `routine_step_v2` (7) + `routine_moment` (5)    | 5379 rows / 4851 paires |

Les 2 legacy filtres restent visibles UI (`tier='essential'/'advanced'` avec label "(legacy)") en attendant ce drop.

---

## Audit pré-drop (à exécuter avant Phase B de chaque axe)

### A.1 Couverture v2

Vérifier que **tout produit skincare/solaire/bodycare** a au moins un tag v2 sur l'axe :

```sql
-- product_type_v2 coverage
SELECT COUNT(*) FROM products p
WHERE p.category IN ('skincare','solaire','bodycare')
  AND NOT EXISTS (
    SELECT 1 FROM tag_products tp
    JOIN product_tags pt ON pt.id = tp.product_tag_id
    WHERE tp.product_id = p.id AND pt.type = 'product_type_v2'
  );
-- target: < 30 orphelins

-- routine_step_v2 coverage (note : un produit "universel" n'a peut-être
-- aucun tag étape — soft target, accepter coverage plus faible)
SELECT COUNT(*) FROM products p
WHERE p.category IN ('skincare','solaire','bodycare')
  AND NOT EXISTS (
    SELECT 1 FROM tag_products tp
    JOIN product_tags pt ON pt.id = tp.product_tag_id
    WHERE tp.product_id = p.id AND pt.type = 'routine_step_v2'
  );
```

### A.2 Grep references

```bash
# scraping / auto-tag
grep -n "product_type\|routine_step" backend/src/db/seed/scripts/auto-tag.ts

# scoring
grep -rn "product_type\|routine_step" backend/src/features/dermo-score/

# MetaStrip + ProductEditPage
grep -rn "product_type\|routine_step" frontend/src/features/products/

# usages slugs spécifiques (BAUME, GEL_NETTOYANT, MATIN, NETTOYANT, ...)
grep -rn "TAG_SLUGS.\(BAUME\|MATIN\|NETTOYANT\|HUILE_DEMAQUILLANTE\)" backend/src/db/seed/data/products/
```

### A.3 algo-derm

Lib externe scope ingrédient → a priori aucune référence à `product_type`/`routine_step` (qui sont des tags produit). À confirmer rapidement :

```bash
grep -rn "product_type\|routine_step" /home/schaff/Mathieu/projets/algo-derm/src/
```

---

## Drop axe 1 — `product_type` legacy

### Phase B — code drop

#### B.1 Retirer catégorie + slugs + labels
- `shared/src/products/skincare/tag-taxonomy.ts` :
  - retirer `'product_type'` de `SKINCARE_PRODUCT_TAG_CATEGORIES`
  - retirer les 42 entries `[SKINCARE_PRODUCT_TAG_SLUGS.X]: 'Y'` du bloc Product types
  - retirer le tableau `PRODUCT_TYPE` (ligne `BAUME_DEMAQUILLANT`…`OUTIL_MASSAGE`)
  - retirer la clé `product_type:` du call `buildTagTaxonomy`
- `shared/src/products/skincare/tag-slugs.ts` : retirer les 42 lignes du bloc `// ── Product types ──` (BAUME_DEMAQUILLANT à OUTIL_MASSAGE)
- `shared/src/products/skincare/tag-filters.ts` : retirer entry `product_type:` du record meta (et renuméroter `order:`)
- `shared/src/products/skincare/schemas.ts` : retirer `product_type: z.array(tagItemSchema),` du filterOptions
- `shared/src/products/list-products-query.ts` : retirer `product_type: z.string().optional(),` de `skincareListProductsQuery`

#### B.2 Migrer consommateurs

- `backend/src/db/seed/scripts/auto-tag.ts` : `INCI_TO_SKINCARE` + `NAME_PATTERNS` produisent des slugs legacy → mapper vers v2 via `SKINCARE_LEGACY_TYPE_TO_V2`/`_TEXTURE`/`_ZONE` (ou réécrire en sortie v2 directe).
- `backend/src/db/seed/data/products/**/*.seed.ts` : remplacer slugs legacy dans `tags.{primary,secondary,avoid}` par leurs équivalents v2.
  - Approche script : `bun run scripts/migrate-seeds-to-v2.ts` (à écrire) qui lit `SKINCARE_LEGACY_TYPE_TO_V2` et applique sur les fichiers TS.
  - Approche manuelle : 80 fichiers, faisable mais long.
- `frontend/src/features/products/comparison/MetaStrip.tsx` : si affiche `product_type`, basculer sur `product_type_v2` + `texture`.
- `frontend/src/features/products/pages/ProductEditPage/` : idem, formulaire édition tags.

#### B.3 Drop fichier mapping

- `shared/src/products/skincare/tag-type-mapping.ts` : **delete** post-drop (jamais utilisé après backfill).
- Re-exports : retirer de `index.ts` + `shared/src/index.ts`.

### Phase C — DB drop

Migration Drizzle `backend/drizzle/00XX_drop_skincare_product_type_legacy.sql` :

```sql
DELETE FROM tag_products WHERE product_tag_id IN (
  SELECT id FROM product_tags WHERE type = 'product_type'
);
DELETE FROM product_tags WHERE type = 'product_type';
```

Génération : `make db-generate` (Drizzle Kit pourra ne pas générer un DELETE auto — fallback : créer manuellement le fichier `.sql` dans `drizzle/` et MAJ `_journal.json` + meta snapshot).

Run : `make db-migrate`.

### Phase D — doc

- Fermer STATE.md §11.bis Phase 3 (marquer "DONE 2026-XX-XX")
- Update §5.1 tableau filter keys : retirer `product_type` de la branche skincare

---

## Drop axe 2 — `routine_step` legacy

Mêmes phases B/C/D que axe 1, adapté.

### Phase B — code drop

- `tag-taxonomy.ts` : retirer `'routine_step'` de `SKINCARE_PRODUCT_TAG_CATEGORIES`, retirer 15 labels (MATIN, SOIR, NETTOYANT, DOUBLE_NETTOYAGE_1/2, PREPARATION, TRAITEMENT, HYDRATATION, EMOLLIENCE, PROTECTION_SOLAIRE, OCCLUSION, SOIN_YEUX, SOIN_LOCALISE, EXFOLIATION, MASQUE_HEBDO), retirer tableau `ROUTINE_STEP`, retirer clé du `buildTagTaxonomy`
- `tag-slugs.ts` : retirer les 15 lignes du bloc `// ── Routine steps (legacy) ──`
- `tag-filters.ts` : retirer entry `routine_step:` (et renuméroter `order:`)
- `schemas.ts` : retirer `routine_step: z.array(tagItemSchema),`
- `list-products-query.ts` : retirer `routine_step: z.string().optional(),`

### Phase B.2 — migrer consommateurs

- `auto-tag.ts` : mêmes patterns que axe 1, basculer slugs `MATIN`/`SOIR`/`NETTOYANT`/etc. vers `MOMENT_*`/`STEP_*`.
- Seeds : remplacer dans `tags.{primary,secondary}`. **Attention** : `NETTOYANT` legacy → ne mappe pas à `STEP_*` direct (couvert par `TYPE_NETTOYANT`) → potentiellement supprimer le tag (déjà redondant avec product_type_v2).
- Frontend : idem axe 1, basculer affichage sur `routine_step_v2` + `routine_moment`.

### Phase B.3

- `tag-routine-mapping.ts` : **delete** post-drop (même logique que axe 1).

### Phase C — DB drop

```sql
DELETE FROM tag_products WHERE product_tag_id IN (
  SELECT id FROM product_tags WHERE type = 'routine_step'
);
DELETE FROM product_tags WHERE type = 'routine_step';
```

### Phase D — doc

- Fermer STATE.md §11.ter Phase 3
- Update §5.1 tableau filter keys : retirer `routine_step` de la branche skincare

---

## Risques / atténuations

- **Liens externes / partages URL** : **non applicable** (pas encore en prod). Skip middleware de redirection.
- **Scraping résiduel** qui produit du legacy → erreur Zod sur `skincareListProductsQuery`. Atténuation : couvert par audit A.2 si exhaustif.
- **Tests fixtures** qui hardcodent legacy slugs. Mitigation : grep `'baume-demaquillant'\|'gel-nettoyant'\|...` dans `backend/src/features/products/tests/` + frontend tests.
- **algo-derm** : à vérifier (a priori aucune ref).

---

## Pré-vol checklist

Avant lancer Phase B axe 1 :

- [ ] Audit A.1 product_type_v2 coverage exécuté, < 30 orphelins
- [ ] Audit A.2 grep effectué et listé
- [ ] Audit A.3 algo-derm clean

Après axe 1 done, mêmes checks pour axe 2 (routine_step).
