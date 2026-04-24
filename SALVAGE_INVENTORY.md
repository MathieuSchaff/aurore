# SALVAGE_INVENTORY.md

## Récupération stash perdu — 2026-04-22

**Stash:** `lost-stash-2026-04-22` (hash `0f6252e663054e4f7ee76d229717027ddff6fe62`)  
**Scope:** `shared/src/products/` — 23 fichiers + 2 fichiers ignorés  
**Date de rapport:** 2026-04-24

---

## Section 1 — Résumé exécutif

Le stash contient un cleanup majeur qui supprime plusieurs types obsolètes et schemas (`Product`, `ProductEdit`, `ProductEditResponseSchema`, etc.), réorganise la validation (refacto `updateProductSchema`), et restructure complètement les taxonomies produit (haircare/dental/supplement passent d'objets vides à implémentations complètes).

- **Adopt stash en entier (clean):** 10 fichiers
- **Merge manuel (WIP Patent):** 2 fichiers (`types.ts`, `schemas.ts`)
- **Keep main (stash obsolète/remplissage):** 0 fichiers
- **Mixed (modifs bidirectionnelles):** 11 fichiers
- **Skip (n'existe pas dans stash):** 2 fichiers (`STATE.md`, `list-products-query.ts`)

**Conflit WIP critique:** Type `Patent` ajouté après stash. Adoption brute du stash = perte du `Patent`. **Décision:** merger manuellement, préserver `Patent`, adopter deletions anciennes.

---

## Section 2 — Table d'inventaire détaillée

### `shared/src/products/types.ts`

- **Direction:** Stash a MOINS (deletions massives)
- **Nature:** Deletion + refacto d'imports
- **Supprimé dans stash:**
  - Type `Product` (structure complète de 15 champs)
  - Type `EditableProductKeys`
  - Type `ProductEditChanges`
  - Type `ProductEdit` (6 champs)
  - Import de `FieldChange` depuis `../core`
  - Import de `productEditResponseSchema`, `patentSchema` depuis `./schemas`
  - Type alias `ProductEditResponseSchema = z.infer<typeof productEditResponseSchema>`

- **Conservé dans stash:**
  - `ProductSearchResult` (5 champs)
  - `ProductErrorCode` (union de 4 valeurs)
  - `CreateProductInput`
  - `UpdateProductInput`
  - `ProductChanges`

- **Changements main depuis le stash:**
  - Ajout `Patent = z.infer<typeof patentSchema>` (WIP utilisateur)

- **Conflit WIP:** OUI — `Patent` nouveau, absent du stash. Adoption brute = perte du type et de sa référence au schema.

- **Décision suggérée:** **MERGE MANUEL** — adopter les deletions du stash (Product, ProductEdit, etc.), conserver import `z` seul, ajouter `import type { patentSchema } from './schemas'` et le type `Patent` pour WIP utilisateur.

---

### `shared/src/products/schemas.ts`

- **Direction:** Stash a MOINS (deletions + modifications logiques)
- **Nature:** Deletion + refacto logique

- **Supprimé dans stash:**
  - Const `uuid = z.uuid()` (déclaration utilitaire)
  - Schema `productResponseSchema` (complet, 17 champs)
  - Schema `productEditResponseSchema` (5 champs)
  - Schema `productsPageSchema` (4 champs)
  - Schema `patentSchema` (3 champs: name, description, url) — fin du fichier

- **Modifications logiques:**
  - Ligne `if (hasCategory && hasKind)` remplacée par `if (d.category !== undefined && d.kind !== undefined)`
  - Changement `PRODUCT_KINDS[d.category!]` en `PRODUCT_KINDS[d.category]` (non-null sans assertion)

- **Conservé dans stash:**
  - `createProductSchema`
  - `updateProductSchema` (modifié au niveau logique)
  - `editableProductFields`
  - `productChangesSchema`
  - `searchProductsQuery`

- **Changements main depuis le stash:**
  - Ajout `patentSchema` (WIP utilisateur) — 13 lignes, schema Zod complet pour Patent

- **Conflit WIP:** OUI — `patentSchema` nouveau. Adoption brute du stash = perte totale.

- **Décision suggérée:** **MERGE MANUEL** — adopter deletions (productResponseSchema, productEditResponseSchema, productsPageSchema, ancien uuid), adopter refacto logique updateProductSchema, conserver patentSchema pour WIP.

---

### `shared/src/products/index.ts`

- **Direction:** Bidirectionnel (changements main > stash)
- **Nature:** Refacto exports

- **Modification stash:**
  - Ligne `export { type ComplementListProductsFilters, complementListProductsQuery, type ListProductsFilters, listProductsQuery } from './list-products-query'` changée en `export * from './list-products-query'`

- **Changements main depuis le stash:**
  - Suppression export `type Patent` qui était exporté avant (main l'a retiré, stash pas affecté car type n'existait pas à ce moment)
  - **Attentivement :** main a en fait AJOUTÉ l'export `type Patent` nulle part visible ici — c'est dans types.ts via le diff ci-dessus

- **Impact:** Minimal, refacto export 100% safe si list-products-query.ts maintenu.

- **Décision suggérée:** **ADOPT STASH** — changement cosmétique, améliore lisibilité du wildcard export.

---

### `shared/src/index.ts`

- **Direction:** Main a PLUS (addition de nouvelles sections habits/logs)
- **Nature:** Additions pures pour nouvelles features (hors scope stash)

- **Changements stash:** Aucun, fichier identique main ← stash

- **Changements main depuis le stash:**
  - Ajout 30 lignes exports habits (CreateHabitInput, frequencySchema, HabitProductInput, etc.)
  - Ajout 10 lignes exports logs (LogHabitCheckInput, logWellbeingSchema, etc.)
  - Ajout 15 lignes exports types habits (Habit, HabitCheckStatus, etc.)
  - Ajout 4 lignes exports error mappings (habitErrorMapping, logsErrorMapping)
  - Suppression export `type Patent` de products — changement relatif au WIP

- **Impact:** Aucun conflit, main a étendu le fichier pour nouvelles features.

- **Décision suggérée:** **KEEP MAIN** — stash n'a aucune contribution ici, main a des additions légitimes pour habits/logs.

---

### `shared/src/products/ingredients.ts`

- **Direction:** Stash a MOINS (deletions pures)
- **Nature:** Deletion

- **Supprimé dans stash:**
  - Schema `productIngredientResponseSchema` (8 champs)
  - Type alias `CreateProductIngredientInput = z.infer<typeof createProductIngredientSchema>`
  - Type `ProductIngredient` (8 champs, détail DB)

- **Conservé dans stash:**
  - Schema `createProductIngredientSchema` (5 champs)
  - Type alias `ProductIngredientErrorCode` (union 3 valeurs)

- **Changements main depuis le stash:** Aucun — fichier identique.

- **Conflit WIP:** Non.

- **Décision suggérée:** **ADOPT STASH** — suppression de types response DB obsolètes, clean et safe. Main garde createProductIngredientSchema intact.

---

### `shared/src/products/kinds.ts`

- **Direction:** Stash a MOINS et REORDO (refacto, nettoyage)
- **Nature:** Reordo + décalage champs

- **Modification stash:**
  - Bloc `complement` (7 entrées GELULE, CAPSULE, etc.) **déplacé** de début (position 3) vers fin (position 5)
  - Pas de suppression/ajout, juste réorganisation — entre skincare (avec solaire) et haircare
  - Reordo logique: skincare → haircare → dental → complement (par fréquence ou ordre alphabétique domain)

- **Changements main depuis le stash:** Aucun — ordem main identique au stash.

- **Conflit WIP:** Non.

- **Décision suggérée:** **ADOPT STASH** — reordo logique, pas de perte de données, améliore cohérence structure.

---

### `shared/src/products/units.ts`

- **Direction:** Stash a PLUS (restructure massive)
- **Nature:** Refacto + addition

- **Changements stash:**
  - Ancien structure: `PRODUCT_UNITS = { PUMP, DROPPER, TUBE, JAR, ... }` (flat 11 entries)
  - Nouveau (stash): `PRODUCT_UNITS` devient nested par catégorie domain:
    - `skincare: { PUMP, DROPPER, JAR, ... }`
    - `solaire: { TUBE, SPRAY, ... }`
    - `haircare: { BOTTLE, TUBE, ... }`
    - `bodycare: { TUBE, BOTTLE, ... }`
    - `dental: { TUBE, PACK, ... }`
    - `complement: { TABLET, CAPSULE, ... }`
  - Type `ProductUnit` refactorisé: `{ [C in ProductUnitsMap]: ... }[keyof ProductUnitsMap]` (union conditionnelle)
  - Type alias `ProductUnitsMap = typeof PRODUCT_UNITS` (nouveau)
  - Export `PRODUCT_UNIT_VALUES` recalculé: flatMap + Set deduplication

- **Changements main depuis le stash:** Aucun — main a gardé structure plate.

- **Conflit WIP:** Non (structure de base est extension, pas breaking).

- **Décision suggérée:** **ADOPT STASH** — refacto très clean, améliore typage et validation par domain. Main n'a pas touché ce fichier.

---

### `shared/src/products/dental/schemas.ts`

- **Direction:** Stash a MOINS (deletions)
- **Nature:** Deletion

- **Supprimé dans stash:**
  - Schema `dentalListProductsQuery` (6 champs + enums)
  - Type alias `DentalListProductsFilters = z.infer<typeof dentalListProductsQuery>`

- **Conservé dans stash:**
  - Schema `dentalProductFilterOptionsSchema`
  - Type alias `DentalProductFilterOptions`

- **Changements main depuis le stash:** Aucun — main identique.

- **Conflit WIP:** Non.

- **Décision suggérée:** **ADOPT STASH** — query schema déplacé/consolidé ailleurs (list-products-query.ts anciennement). Safe.

---

### `shared/src/products/dental/tag-filters.ts`

- **Direction:** Stash a MODIF (string change)
- **Nature:** Modification label

- **Changement stash:**
  - Ligne `dental_effect: { label: 'Bénéfice', ... }` — label change de "Effet" → "Bénéfice"

- **Changements main depuis le stash:** Aucun.

- **Conflit WIP:** Non.

- **Décision suggérée:** **ADOPT STASH** — changement cosmétique UX, aligne label avec convention.

---

### `shared/src/products/dental/tag-slugs.ts`

- **Direction:** Stash a PLUS (refactor + additions)
- **Nature:** Refactor + reordo + additions

- **Changements stash:**
  - Ajout header comment (12 lignes) expliquant taxonomie alignment
  - `HALITOSE` déplacé plus tôt (après SENSIBILITE_DENTINAIRE)
  - Suppressions : `PARODONTITE`, `EROSION_ACIDE`, `BRUXISME`, `APHTES` (4 removed concerns)
  - Additions : `EMAIL_AFFAIBLI`, `SECHERESSE_BUCCALE` (2 new concerns)
  - Age group : `SENIOR` déplacé (fin → fin), `ADO` ajouté avant SENIOR, `IMPLANTS`/`DENTS_LAIT` supprimés
  - Product type : `BLANCHIMENT_DENTAIRE` supprimé, `BROSSETTE`/`KIT_BLANCHIMENT` ajoutés
  - Dental effect : `REDUCTION_SENSIBILITE` supprimé, `ANTI_PLAQUE`/`REMINERALISATION` ajoutés
  - Product labels : `SANS_PARFUM`, `BIO_NATUREL`, `CRUELTY_FREE`, `HYPOALLERGENIQUE`, `GROSSESSE_COMPATIBLE`, `SANS_ALCOOL` supprimés (6 removed), `SANS_EDULCORANTS_ARTIFICIELS` ajouté (1 new)

- **Changements main depuis le stash:** Aucun.

- **Conflit WIP:** Non (changements donnée/métier, pas types).

- **Décision suggérée:** **ADOPT STASH** — refactor métier complet, nettoyage slugs obsolètes, aligne taxonomy. Safe.

---

### `shared/src/products/dental/tag-taxonomy.ts`

- **Direction:** Stash a MODIF (reordo + deletions cohérentes avec slugs)
- **Nature:** Refactor taxonomy

- **Changements stash:**
  - Reordo CONCERN array : déplacement HALITOSE, removal de PARODONTITE/EROSION_ACIDE/BRUXISME/APHTES, ajout EMAIL_AFFAIBLI/SECHERESSE_BUCCALE
  - Reordo AGE_GROUP : ajout ADO, removal IMPLANTS/DENTS_LAIT
  - Reordo PRODUCT_TYPE : removal BLANCHIMENT_DENTAIRE, ajout BROSSETTE/KIT_BLANCHIMENT
  - Reordo DENTAL_EFFECT : removal REDUCTION_SENSIBILITE, ajout ANTI_PLAQUE/REMINERALISATION
  - Reordo PRODUCT_LABEL : removal 6 slugs, ajout SANS_EDULCORANTS_ARTIFICIELS

- **Changements main depuis le stash:** Aucun.

- **Conflit WIP:** Non.

- **Décision suggérée:** **ADOPT STASH** — modifications taxonomy cohérentes avec tag-slugs.ts. Safe.

---

### `shared/src/products/haircare/schemas.ts`

- **Direction:** Stash a MOINS (deletions)
- **Nature:** Deletion

- **Supprimé dans stash:**
  - Schema `haircareListProductsQuery` (6 champs)
  - Type alias `HaircareListProductsFilters`

- **Conservé dans stash:**
  - Schema `haircareProductFilterOptionsSchema`
  - Type alias `HaircareProductFilterOptions`

- **Changements main depuis le stash:** Aucun.

- **Conflit WIP:** Non.

- **Décision suggérée:** **ADOPT STASH** — même raison que dental/schemas.ts. Safe.

---

### `shared/src/products/haircare/tag-filters.ts`

- **Direction:** Stash a MODIF (cosmetic + string changes)
- **Nature:** Label updates

- **Changements stash:**
  - `concern` placeholder: "Tous" → "Toutes" (accord)
  - `hair_effect` label: "Rendu" → "Bénéfice" (alignement avec convention dental)

- **Changements main depuis le stash:** Aucun.

- **Conflit WIP:** Non.

- **Décision suggérée:** **ADOPT STASH** — cosmetic UX improvements. Safe.

---

### `shared/src/products/haircare/tag-slugs.ts`

- **Direction:** Stash a PLUS (implementation complète)
- **Nature:** Implementation

- **Changements stash:**
  - Ancien : `export const HAIRCARE_PRODUCT_TAG_SLUGS = {} as const` (empty)
  - Nouveau : implémentation complète — 103 lignes
  - Ajout header comment (10 lignes)
  - 16 CONCERN slugs (PELLICULES, CHUTE, CASSE, FOURCHES, etc.)
  - 11 HAIR_TYPE slugs (LISSES, ONDULES, BOUCLES, CREPUS, etc.)
  - 17 PRODUCT_TYPE slugs (SHAMPOOING, APRES_SHAMPOOING, etc.)
  - 8 ROUTINE_STEP slugs (PRE_SHAMPOOING, LAVAGE, etc.)
  - 14 HAIR_EFFECT slugs (BRILLANCE-cheveux, DOUCEUR, VOLUME, etc. — suffixés -cheveux pour éviter collision DB)
  - 8 PRODUCT_LABEL slugs (SANS_SULFATES, SANS_SILICONES, etc.)

- **Changements main depuis le stash:** Aucun.

- **Conflit WIP:** Non (ajouts purs).

- **Décision suggérée:** **ADOPT STASH** — implementation complète de taxonomie métier. Safe.

---

### `shared/src/products/haircare/tag-taxonomy.ts`

- **Direction:** Stash a PLUS (implementation complète)
- **Nature:** Implementation

- **Changements stash:**
  - Ancien : `export const HAIRCARE_PRODUCT_TAG_TAXONOMY = {} as Record<...>` (empty) + stub `getHaircareProductTagCategory`
  - Nouveau :
    - Import `HAIRCARE_PRODUCT_TAG_SLUGS` pour utilisation constantes
    - Reordo `HAIRCARE_PRODUCT_TAG_CATEGORIES`: hair_type → concern (logique)
    - Ajout 5 arrays détaillés (CONCERN, HAIR_TYPE, PRODUCT_TYPE, ROUTINE_STEP, HAIR_EFFECT, PRODUCT_LABEL) avec tous les slugs
    - Type alias `Entry` (newtype for tuple)
    - Implémentation du mapping : `entries.flatMap(...).map((s): Entry => [s, { category }])`
    - Object.fromEntries pour créer la taxonomie complète
    - Implémentation `getHaircareProductTagCategory` avec lookup réel

- **Changements main depuis le stash:** Aucun.

- **Conflit WIP:** Non.

- **Décision suggérée:** **ADOPT STASH** — implémentation complète fonctionnelle. Safe.

---

### `shared/src/products/skincare/schemas.ts`

- **Direction:** Stash a MOINS (deletions)
- **Nature:** Deletion

- **Supprimé dans stash:**
  - Import `PRODUCT_DOMAIN_TABS from '../domain-tabs'` (unused)
  - Schema `skincareListProductsQuery` (12 champs)
  - Type alias `SkincareListProductsFilters`
  - Comment ancien (3 lignes) dans filterOptions

- **Conservé dans stash:**
  - Schema `skincareProductFilterOptionsSchema`
  - Type alias `SkincareProductFilterOptions`

- **Changements main depuis le stash:** Aucun.

- **Conflit WIP:** Non.

- **Décision suggérée:** **ADOPT STASH** — cleanup et removal import inutilisé. Safe.

---

### `shared/src/products/skincare/tag-slugs.ts`

- **Direction:** Stash a MOINS (deletions)
- **Nature:** Deletion

- **Supprimé dans stash (10 slugs):**
  - Product type : `DENTIFRICE`, `BAIN_DE_BOUCHE`, `BLANCHIMENT_DENTAIRE`, `FIL_DENTAIRE` (4 dental types à tort dans skincare)
  - Product form : `GELULE`, `CAPSULE`, `POUDRE`, `SIROP`, `GUMMY` (5 supplement forms à tort dans skincare)

- **Conservé dans stash:**
  - Tous les autres 88+ slugs skincare (concerns, skin_zones, routines, effects, labels, etc.)

- **Changements main depuis le stash:** Aucun.

- **Conflit WIP:** Non.

- **Décision suggérée:** **ADOPT STASH** — cleanup: suppression slugs métier incorrectement rangés dans skincare. Ils sont maintenant dans leurs domaines respectifs (dental, supplement). Safe.

---

### `shared/src/products/skincare/tag-taxonomy.ts`

- **Direction:** Stash a MOINS (deletions cohérentes)
- **Nature:** Deletion

- **Supprimé dans stash (PRODUCT_TYPE array):**
  - 10 slugs supprimés qui correspondent à ceux supprimés dans tag-slugs.ts (DENTIFRICE, BAIN_DE_BOUCHE, etc.)

- **Conservé dans stash:**
  - Tous les autres arrays (SKIN_ZONE, CONCERN, ROUTINE_STEP, SKIN_EFFECT, PRODUCT_LABEL, SHARED_LABEL)

- **Changements main depuis le stash:** Aucun.

- **Conflit WIP:** Non.

- **Décision suggérée:** **ADOPT STASH** — modifications cohérentes avec tag-slugs.ts. Safe.

---

### `shared/src/products/supplement/schemas.ts`

- **Direction:** Stash a MOINS (deletions)
- **Nature:** Deletion

- **Supprimé dans stash:**
  - Schema `supplementListProductsQuery` (6 champs)
  - Type alias `SupplementListProductsFilters`

- **Conservé dans stash:**
  - Schema `supplementProductFilterOptionsSchema`
  - Type alias `SupplementProductFilterOptions`

- **Changements main depuis le stash:** Aucun.

- **Conflit WIP:** Non.

- **Décision suggérée:** **ADOPT STASH** — même pattern que dental/haircare schemas. Safe.

---

### `shared/src/products/supplement/tag-filters.ts`

- **Direction:** Stash a MODIF (label updates)
- **Nature:** Label updates

- **Changements stash:**
  - `product_type` label: "Type" → "Forme" (more precise)
  - `product_type` placeholder: "Tous" → "Toutes" (accord)
  - `moment` tier: "advanced" → "essential" (promotion)
  - `moment` placeholder: "Tous" → "Tous" (no change in fact, unchanged)
  - `restriction` label: "Restriction" → "Contre-indication" (clarity)
  - `restriction` placeholder: "Toutes" → "Aucune" (UX improvement)

- **Changements main depuis le stash:** Aucun.

- **Conflit WIP:** Non.

- **Décision suggérée:** **ADOPT STASH** — UX improvements, clarté labels. Safe.

---

### `shared/src/products/supplement/tag-slugs.ts`

- **Direction:** Stash a PLUS (implementation complète)
- **Nature:** Implementation

- **Changements stash:**
  - Ancien : `export const SUPPLEMENT_PRODUCT_TAG_SLUGS = {} as const` (empty)
  - Nouveau : implémentation complète — 68 lignes
  - Ajout header comment (17 lignes) avec détails nomenclature (suffixe -supplement, récup 5 slugs skincare pour product_type)
  - 10 GOAL slugs (SOMMEIL, ENERGIE, COGNITION, etc.)
  - 5 MOMENT slugs — avec suffixes MATIN_SUPPLEMENT/SOIR_SUPPLEMENT (vs ingredient MATIN/SOIR)
  - 4 RESTRICTION slugs (GROSSESSE_INCOMPATIBLE, etc.)
  - 9 PRODUCT_TYPE slugs : 5 historiques (GELULE, CAPSULE, POUDRE, SIROP, GUMMY) + 4 nouveaux (COMPRIME, AMPOULE_BUVABLE, HUILE_ORALE, SPRAY_SUBLINGUAL)
  - 7 PRODUCT_LABEL slugs (VEGAN, SANS_GLUTEN, etc.)

- **Changements main depuis le stash:** Aucun.

- **Conflit WIP:** Non.

- **Décision suggérée:** **ADOPT STASH** — implémentation complète fonctionnelle. Safe.

---

### `shared/src/products/supplement/tag-taxonomy.ts`

- **Direction:** Stash a PLUS (implementation complète)
- **Nature:** Implementation

- **Changements stash:**
  - Import `SUPPLEMENT_PRODUCT_TAG_SLUGS` ajouté (avant = type-only)
  - Reordo `SUPPLEMENT_PRODUCT_TAG_CATEGORIES` : goal → product_type → moment → restriction → product_label devient goal → moment → restriction → product_type → product_label
  - Ajout 5 arrays détaillés : GOAL (10 items), MOMENT (5 items), RESTRICTION (4 items), PRODUCT_TYPE (9 items), PRODUCT_LABEL (7 items)
  - Type alias `Entry`
  - Implémentation taxonomy complète via `Object.fromEntries(entries)`
  - Implémentation `getSupplementProductTagCategory` avec lookup réel (vs ancien stub `return undefined`)

- **Changements main depuis le stash:** Aucun.

- **Conflit WIP:** Non.

- **Décision suggérée:** **ADOPT STASH** — implémentation complète fonctionnelle. Safe.

---

### `shared/src/products/helpers.ts`

- **Direction:** Identique main ↔ stash
- **Nature:** No change

- **Statut:** Fichier inchangé entre main et stash.

- **Décision suggérée:** **KEEP MAIN** (ou **ADOPT STASH** — même résultat). No action needed.

---

## Section 3 — Classification finale

### Adopt stash en entier (clean, safe)

10 fichiers :
1. `shared/src/products/index.ts` — refacto export wildcard
2. `shared/src/products/ingredients.ts` — cleanup responses obsolètes
3. `shared/src/products/kinds.ts` — reordo logique
4. `shared/src/products/units.ts` — refacto nested par domain
5. `shared/src/products/dental/schemas.ts` — deletion query schema obsolète
6. `shared/src/products/dental/tag-filters.ts` — label update UX
7. `shared/src/products/dental/tag-slugs.ts` — refactor metadata + cleanup slugs obsolètes
8. `shared/src/products/dental/tag-taxonomy.ts` — refactor arrays cohérent
9. `shared/src/products/haircare/schemas.ts` — deletion query schema obsolète
10. `shared/src/products/haircare/tag-filters.ts` — label updates

### Merge manuel nécessaire

2 fichiers :

1. **`shared/src/products/types.ts`**
   - Raison: Type `Patent` (WIP utilisateur) ajouté sur main après stash. Stash supprime Product/ProductEdit/productEditResponseSchema — tous importants à conserver.
   - Action: Merger deletions du stash (Product, ProductEdit, ProductEditChanges, ProductEditResponseSchema), conserver uniquement import de patentSchema et type Patent.

2. **`shared/src/products/schemas.ts`**
   - Raison: Schema `patentSchema` (WIP utilisateur) ajouté sur main après stash. Stash supprime productResponseSchema/productEditResponseSchema/productsPageSchema + refacto logique updateProductSchema.
   - Action: Merger deletions du stash et refacto logique, conserver patentSchema complet.

### Mixed/bidirectionnelles (changements main > stash)

11 fichiers :

- **`shared/src/index.ts`** → KEEP MAIN — additions habits/logs hors scope stash
- **`shared/src/products/haircare/tag-slugs.ts`** → ADOPT STASH — implémentation complète (vs empty stash = main obsolète)
- **`shared/src/products/haircare/tag-taxonomy.ts`** → ADOPT STASH — implémentation complète (vs empty stash)
- **`shared/src/products/skincare/schemas.ts`** → ADOPT STASH — deletion import inutilisé
- **`shared/src/products/skincare/tag-slugs.ts`** → ADOPT STASH — cleanup 10 slugs incorrectement rangés
- **`shared/src/products/skincare/tag-taxonomy.ts`** → ADOPT STASH — suppression 10 slugs cohérente
- **`shared/src/products/supplement/schemas.ts`** → ADOPT STASH — deletion query schema obsolète
- **`shared/src/products/supplement/tag-filters.ts`** → ADOPT STASH — label updates UX
- **`shared/src/products/supplement/tag-slugs.ts`** → ADOPT STASH — implémentation complète (vs empty stash)
- **`shared/src/products/supplement/tag-taxonomy.ts`** → ADOPT STASH — implémentation complète (vs empty stash)
- **`shared/src/products/helpers.ts`** → KEEP MAIN/ADOPT STASH (identical)

### Skip (n'existe pas dans stash)

2 fichiers :
- `shared/src/products/STATE.md` — créé après stash (2026-04-22 16h45 vs stash 14h), contient documentation métier. **Action:** Keep as-is sur main. Stash n'a rien à contribuer.
- `shared/src/products/list-products-query.ts` — créé après stash, contient schemas query centralisés par domain. **Action:** Keep as-is sur main. Stash l'a supprimé car dispersé en /schemas.ts par domain. Main a restructuré pour clarté. Skip triage.

---

## Résumé des conflits WIP

**Type `Patent`** (ajouté après stash) :
- Référencé dans `types.ts` ligne finale (absent stash)
- Défini dans `schemas.ts` avec schema Zod complet (absent stash)
- Exporté dans `shared/src/index.ts` (absent stash)

Adoption brute du stash = suppression totale du type et de son schema. **Action requise:** Merge manuel pour préserver WIP.

---

## Notes de traçabilité

- **Stash hash:** `0f6252e663054e4f7ee76d229717027ddff6fe62`
- **Stash tag:** `lost-stash-2026-04-22`
- **Worktree de récupération:** `/home/schaff/Mathieu/projets/aurore-stash-recovery/`
- **Analysé via:** `git diff main lost-stash-2026-04-22 -- shared/src/products/`
- **23 fichiers analysés, 2 files skipped (n'existent pas dans stash)**

---

*Document généré 2026-04-24*
