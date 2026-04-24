# AUDIT — Stash perdu `0f6252e` (2026-04-22 21:15)

Dangling git stash orphelin retrouvé via `git fsck --dangling`. Résultat du WIP
**jamais committé** sur main, droppé pendant les resets du 23 avril matin
(7 `reset: moving to HEAD` consécutifs dans le reflog). Explique pourquoi
`shared/src/products/STATE.md` §12 marque ✅ des deletions qui n'ont jamais
atterri dans le code.

Probablement la cause du seed produits à refaire : le stash contient aussi
une grosse passe de refactor sur `backend/src/db/seed/data/products/`
(87 fichiers de seeds retouchés).

## Meta

| Champ | Valeur |
|-------|--------|
| Hash complet | `0f6252e663054e4f7ee76d229717027ddff6fe62` |
| Type | `Merge:` — stash WIP (parent1 = main, parent2 = index state) |
| Parent 1 | `d7e852488` — `feat(products/page): dispatch useTagFilterGroups and buildProductsApiFilters by domain` |
| Parent 2 | `a969744a9` — stash index snapshot |
| Date | 2026-04-22 21:15:06 +0200 |
| Message | `WIP on main: d7e8524 feat(products/page): …` |
| Total | 260 fichiers modifiés, ~17 692 insertions / ~8 148 deletions |

## Répartition

| Zone | Fichiers |
|------|---------:|
| backend/src/db/seed/data/products/ | 87 |
| backend/src/db/seed/data/ingredients/ | 70 |
| backend/src/db/seed/data/blog/ | 31 |
| backend/src/db/seed/ (autres : runners, tests, utils, docs, otherdata, tags, ingredient-tags) | 21 |
| shared/src/products/ | 22 |
| shared/src/ (index) | 1 |
| frontend/src/ | 16 |
| backend/src/ (hors seed) | 9 |
| Racine (.gitignore, Makefile, nginx/) | 3 |
| **Total** | **260** |

---

## Commandes utiles

```bash
# Diff complet vs main actuel
git diff d7e8524 0f6252e

# Extraire un fichier précis depuis le stash
git checkout 0f6252e -- <path>

# Voir le stash entier
git show 0f6252e
```

⚠️ **Ne PAS** cherry-pick ni merger le stash en entier : la plupart des
fichiers seed ont été re-committés sur main depuis (commits Apr 23–24).
Extraction chirurgicale uniquement.

---

## Fichiers — liste exhaustive

### 1. Racine (3)

```
.gitignore
Makefile
nginx/conf.d/default.conf
```

### 2. `shared/src/` (23)

Le cœur du cleanup types/schemas que STATE.md §12 prétend fait :

```
shared/src/index.ts
shared/src/products/index.ts
shared/src/products/types.ts
shared/src/products/schemas.ts
shared/src/products/ingredients.ts
shared/src/products/helpers.ts
shared/src/products/kinds.ts
shared/src/products/units.ts
shared/src/products/dental/schemas.ts
shared/src/products/dental/tag-filters.ts
shared/src/products/dental/tag-slugs.ts
shared/src/products/dental/tag-taxonomy.ts
shared/src/products/haircare/schemas.ts
shared/src/products/haircare/tag-filters.ts
shared/src/products/haircare/tag-slugs.ts
shared/src/products/haircare/tag-taxonomy.ts
shared/src/products/skincare/schemas.ts
shared/src/products/skincare/tag-slugs.ts
shared/src/products/skincare/tag-taxonomy.ts
shared/src/products/supplement/schemas.ts
shared/src/products/supplement/tag-filters.ts
shared/src/products/supplement/tag-slugs.ts
shared/src/products/supplement/tag-taxonomy.ts
```

Deletions concrètes dans ces fichiers (vs HEAD actuel) :
- `types.ts` : `Product`, `EditableProductKeys`, `ProductEdit`, `ProductEditResponseSchema`
- `schemas.ts` : `productResponseSchema`, `productEditResponseSchema`, `productsPageSchema`
- `ingredients.ts` : `productIngredientResponseSchema`, `CreateProductIngredientInput`, `ProductIngredient`

### 3. Backend — hors seed (9)

```
backend/drizzle/meta/_journal.json
backend/src/db/schema/auth/users.ts
backend/src/features/auth/demo-seed.ts
backend/src/features/auth/routes.ts
backend/src/features/products/routes.ts
backend/src/features/products/service.ts
backend/src/features/products/tests/products.routes.test.ts
backend/src/features/products/tests/products.test.ts
backend/src/utils/errors/error-handler.ts
```

### 4. Frontend (16)

```
frontend/vite.config.ts
frontend/src/component/Header/BottomNav/BottomNav.tsx
frontend/src/component/Header/NavItem/NavItem.tsx
frontend/src/component/Layout/AppLayout/AppLayout.tsx
frontend/src/component/Layout/PageHeader/PageHeader.css
frontend/src/component/Typography/RichText/RichText.css
frontend/src/features/blog/components/BlogArticlePage.css
frontend/src/features/collection/components/tabs/CollectionTab/ShelfView/FirstTimeEmpty.css
frontend/src/features/collection/components/tabs/CollectionTab/ShelfView/FirstTimeEmpty.tsx
frontend/src/features/products/components/DomainTabs/DomainTabs.css          [DELETED in stash]
frontend/src/features/products/components/DomainTabs/DomainTabs.tsx          [DELETED in stash]
frontend/src/features/products/components/DomainTabs/__tests__/DomainTabs.test.tsx  [DELETED in stash]
frontend/src/features/products/components/ProductLayout.tsx
frontend/src/features/products/components/ProductsPage.css
frontend/src/features/products/filters.ts
frontend/src/features/products/helpers.ts
```

### 5. Seed — produits (87)

```
backend/src/db/seed/data/products/index.ts
backend/src/db/seed/data/products/types.ts
backend/src/db/seed/data/products/products-slugs.ts

backend/src/db/seed/data/products/aDerma/aDerma.seed.ts
backend/src/db/seed/data/products/abib/abib.seed.ts
backend/src/db/seed/data/products/acm/acm.seed.ts
backend/src/db/seed/data/products/aestura/aestura.seed.ts
backend/src/db/seed/data/products/alliesOfSkin/alliesOfSkin.seed.ts
backend/src/db/seed/data/products/amlactin/amlactin.seed.ts
backend/src/db/seed/data/products/anua/anua.seed.ts
backend/src/db/seed/data/products/aromaZone/aromaZone.seed.ts
backend/src/db/seed/data/products/avene/avene.seed.ts
backend/src/db/seed/data/products/azelaique/azelaique.seed.ts
backend/src/db/seed/data/products/azelaique/todo.md                          [DELETED in stash]
backend/src/db/seed/data/products/beautyOfJoseon/beautyOfJoseon.seed.ts
backend/src/db/seed/data/products/bioderma/bioderma.seed.ts
backend/src/db/seed/data/products/byoma/byoma.seed.ts
backend/src/db/seed/data/products/cerave/cerave.seed.ts
backend/src/db/seed/data/products/colibri/colibri.seed.ts
backend/src/db/seed/data/products/cosrx/cosrx.seed.ts
backend/src/db/seed/data/products/cyla/cyla.seed.ts
backend/src/db/seed/data/products/dermaceutic/dermaceutic.seed.ts
backend/src/db/seed/data/products/dermalogica/dermalogica.seed.ts
backend/src/db/seed/data/products/dermeden/dermeden.seed.ts
backend/src/db/seed/data/products/dieux/dieux.seed.ts
backend/src/db/seed/data/products/dr-g/dr-g.seed.ts
backend/src/db/seed/data/products/dr-jart/dr-jart.seed.ts
backend/src/db/seed/data/products/drAlthea/drAlthea.seed.ts
backend/src/db/seed/data/products/drIdriss/drIdriss.seed.ts
backend/src/db/seed/data/products/ducray/ducray.seed.ts
backend/src/db/seed/data/products/eqqualberry/eqqualberry.seed.ts
backend/src/db/seed/data/products/etude-house/etude-house.seed.ts
backend/src/db/seed/data/products/eucerin/eucerin.seed.ts
backend/src/db/seed/data/products/filorga/filorga.seed.ts
backend/src/db/seed/data/products/garancia/garancia.seed.ts
backend/src/db/seed/data/products/geekAndGorgeous/geekAndGorgeous.seed.ts
backend/src/db/seed/data/products/haruharu/haruharu.seed.ts
backend/src/db/seed/data/products/im-from/im-from.seed.ts
backend/src/db/seed/data/products/innisfree/innisfree.seed.ts
backend/src/db/seed/data/products/isdin/isdin.seed.ts
backend/src/db/seed/data/products/isispharma/isispharma.seed.ts
backend/src/db/seed/data/products/isntree/isntree.seed.ts
backend/src/db/seed/data/products/iunik/iunik.seed.ts
backend/src/db/seed/data/products/labBiarritz/labBiarritz.seed.ts
backend/src/db/seed/data/products/laRochePosay/laRochePosay.seed.ts
backend/src/db/seed/data/products/madAboutSkin/madAboutSkin.seed.ts
backend/src/db/seed/data/products/medicube/medicube.seed.ts
backend/src/db/seed/data/products/medik8/medik8.seed.ts
backend/src/db/seed/data/products/memeCancer/memeCancer.seed.ts
backend/src/db/seed/data/products/missha/missha.seed.ts
backend/src/db/seed/data/products/mixa/mixa.seed.ts
backend/src/db/seed/data/products/mixsoon/mixsoon.seed.ts
backend/src/db/seed/data/products/nineLess/nineLess.seed.ts
backend/src/db/seed/data/products/niod/niod.seed.ts
backend/src/db/seed/data/products/nooance/nooance.seed.ts
backend/src/db/seed/data/products/noreva/noreva-ingredients-tags.ts
backend/src/db/seed/data/products/noreva/noreva-product-tags.ts
backend/src/db/seed/data/products/noreva/noreva.seed.ts
backend/src/db/seed/data/products/numbuzin/numbuzin.seed.ts
backend/src/db/seed/data/products/occitane/occitane.seed.ts
backend/src/db/seed/data/products/pai/pai.seed.ts
backend/src/db/seed/data/products/paulasChoice/paulasChoice.seed.ts
backend/src/db/seed/data/products/prequel/prequel.seed.ts
backend/src/db/seed/data/products/purito/purito.seed.ts
backend/src/db/seed/data/products/remedy/remedy.seed.ts
backend/src/db/seed/data/products/riemann/riemann.seed.ts
backend/src/db/seed/data/products/roundlab/roundlab.seed.ts
backend/src/db/seed/data/products/sephora/sephora.seed.ts
backend/src/db/seed/data/products/shiseido/shiseido.seed.ts
backend/src/db/seed/data/products/skII/skII.seed.ts
backend/src/db/seed/data/products/skin1004/skin1004.seed.ts
backend/src/db/seed/data/products/skinCeuticals/skinCeuticals.seed.ts
backend/src/db/seed/data/products/sol-de-janeiro/sol-de-janeiro.seed.ts
backend/src/db/seed/data/products/somebymi/somebymi.seed.ts
backend/src/db/seed/data/products/sulwhasoo/sulwhasoo.seed.ts
backend/src/db/seed/data/products/svr/svr.seed.ts
backend/src/db/seed/data/products/theInkeyList/theInkeyList.seed.ts
backend/src/db/seed/data/products/theOrdinary/theOrdinary.seed.ts
backend/src/db/seed/data/products/theramid/theramid.seed.ts
backend/src/db/seed/data/products/tirtir/tirtir.seed.ts
backend/src/db/seed/data/products/topicrem/topicrem.seed.ts
backend/src/db/seed/data/products/torriden/torriden.seed.ts
backend/src/db/seed/data/products/typology/typology.seed.ts
backend/src/db/seed/data/products/uriage/uriage.seed.ts
backend/src/db/seed/data/products/vichy-laboratories/vichy-laboratories.seed.ts
backend/src/db/seed/data/products/vt/vt.seed.ts
backend/src/db/seed/data/products/weleda/weleda.seed.ts
```

### 6. Seed — ingrédients (70)

```
backend/src/db/seed/data/ingredients/index.ts
backend/src/db/seed/data/ingredients/ingredient-slugs.ts

# Dental (7)
backend/src/db/seed/data/ingredients/dental/abrasifs.ts
backend/src/db/seed/data/ingredients/dental/anti-sensibilite.ts
backend/src/db/seed/data/ingredients/dental/antimicrobiens.ts
backend/src/db/seed/data/ingredients/dental/blanchissants.ts
backend/src/db/seed/data/ingredients/dental/divers.ts
backend/src/db/seed/data/ingredients/dental/excipients.ts
backend/src/db/seed/data/ingredients/dental/remineralisation.ts

# Haircare (17)
backend/src/db/seed/data/ingredients/haircare/agents-nacrants.ts
backend/src/db/seed/data/ingredients/haircare/antipelliculaires.ts
backend/src/db/seed/data/ingredients/haircare/beurres-vegetaux.ts
backend/src/db/seed/data/ingredients/haircare/ceramides-lipides.ts
backend/src/db/seed/data/ingredients/haircare/chelateurs.ts
backend/src/db/seed/data/ingredients/haircare/conditionneurs.ts
backend/src/db/seed/data/ingredients/haircare/divers.ts
backend/src/db/seed/data/ingredients/haircare/epaississants-texturants.ts
backend/src/db/seed/data/ingredients/haircare/huiles-minerales.ts
backend/src/db/seed/data/ingredients/haircare/huiles-vegetales.ts
backend/src/db/seed/data/ingredients/haircare/humectants.ts
backend/src/db/seed/data/ingredients/haircare/proteines-keratine.ts
backend/src/db/seed/data/ingredients/haircare/stimulants-croissance.ts
backend/src/db/seed/data/ingredients/haircare/tensioactifs-amphoteres.ts
backend/src/db/seed/data/ingredients/haircare/tensioactifs-anioniques.ts
backend/src/db/seed/data/ingredients/haircare/tensioactifs-cationiques.ts
backend/src/db/seed/data/ingredients/haircare/tensioactifs-non-ioniques.ts

# Skincare (18)
backend/src/db/seed/data/ingredients/skincare/actifs-anti-age-reparateurs.ts
backend/src/db/seed/data/ingredients/skincare/anti-acne-sebum.ts
backend/src/db/seed/data/ingredients/skincare/anti-rosacee-vasoconstricteurs.ts
backend/src/db/seed/data/ingredients/skincare/antioxydants-vitamines.ts
backend/src/db/seed/data/ingredients/skincare/apaisants-anti-inflammatoires.ts
backend/src/db/seed/data/ingredients/skincare/barriere-emollients-occlusifs.ts
backend/src/db/seed/data/ingredients/skincare/circulatoire-drainage.ts
backend/src/db/seed/data/ingredients/skincare/divers-non-classes.ts
backend/src/db/seed/data/ingredients/skincare/eclaircissants-depigmentants.ts
backend/src/db/seed/data/ingredients/skincare/exfoliants.ts
backend/src/db/seed/data/ingredients/skincare/fillers.ts
backend/src/db/seed/data/ingredients/skincare/filtres-uv.ts
backend/src/db/seed/data/ingredients/skincare/humectants.ts
backend/src/db/seed/data/ingredients/skincare/peptides.ts
backend/src/db/seed/data/ingredients/skincare/probiotiques-prebiotiques-postbiotiques.ts
backend/src/db/seed/data/ingredients/skincare/retinoides.ts
backend/src/db/seed/data/ingredients/skincare/tensioactifs-nettoyants.ts
backend/src/db/seed/data/ingredients/skincare/texturants-fonctionnels.ts

# Supplements (26)
backend/src/db/seed/data/ingredients/supplements/astaxanthine.ts
backend/src/db/seed/data/ingredients/supplements/berberine.ts
backend/src/db/seed/data/ingredients/supplements/beta-carotene.ts
backend/src/db/seed/data/ingredients/supplements/cdp-choline.ts
backend/src/db/seed/data/ingredients/supplements/choline.ts
backend/src/db/seed/data/ingredients/supplements/creatine.ts
backend/src/db/seed/data/ingredients/supplements/ergothioneine.ts
backend/src/db/seed/data/ingredients/supplements/gaa.ts
backend/src/db/seed/data/ingredients/supplements/glucosamine.ts
backend/src/db/seed/data/ingredients/supplements/glycine.ts
backend/src/db/seed/data/ingredients/supplements/luteine.ts
backend/src/db/seed/data/ingredients/supplements/magnesium.ts
backend/src/db/seed/data/ingredients/supplements/nac.ts
backend/src/db/seed/data/ingredients/supplements/omega-3.ts
backend/src/db/seed/data/ingredients/supplements/phosphatidylethanolamine.ts
backend/src/db/seed/data/ingredients/supplements/phosphatidylinositol.ts
backend/src/db/seed/data/ingredients/supplements/phosphatidylserine.ts
backend/src/db/seed/data/ingredients/supplements/psyllium.ts
backend/src/db/seed/data/ingredients/supplements/spiruline.ts
backend/src/db/seed/data/ingredients/supplements/taurine.ts
backend/src/db/seed/data/ingredients/supplements/tmg.ts
backend/src/db/seed/data/ingredients/supplements/vitamine-b12.ts
backend/src/db/seed/data/ingredients/supplements/vitamine-c.ts
backend/src/db/seed/data/ingredients/supplements/vitamine-d.ts
backend/src/db/seed/data/ingredients/supplements/vitamine-k.ts
backend/src/db/seed/data/ingredients/supplements/zeaxanthine.ts
```

### 7. Seed — blog (31)

```
backend/src/db/seed/data/blog/article-data.ts

backend/src/db/seed/data/blog/haircare/leave-ins-cheveux-boucles-benchmark.ts
backend/src/db/seed/data/blog/haircare/secrets-de-loly-analyse.ts

backend/src/db/seed/data/blog/nutrition/alimentation-cerveau.ts
backend/src/db/seed/data/blog/nutrition/carences-nutritionnelles-frequentes.ts
backend/src/db/seed/data/blog/nutrition/fruits-saison-actifs.ts
backend/src/db/seed/data/blog/nutrition/fruits.ts
backend/src/db/seed/data/blog/nutrition/graines-legumineuses-nutrition.ts
backend/src/db/seed/data/blog/nutrition/index.ts
backend/src/db/seed/data/blog/nutrition/nutriments-fonctionnels.ts
backend/src/db/seed/data/blog/nutrition/ppo-smoothies-biodisponibilite.ts

backend/src/db/seed/data/blog/phytotherapie/ail.ts
backend/src/db/seed/data/blog/phytotherapie/arnica.ts
backend/src/db/seed/data/blog/phytotherapie/aubepine.ts
backend/src/db/seed/data/blog/phytotherapie/bacopa-monnieri.ts
backend/src/db/seed/data/blog/phytotherapie/cumin-noir.ts
backend/src/db/seed/data/blog/phytotherapie/gingembre.ts
backend/src/db/seed/data/blog/phytotherapie/ginkgo-biloba.ts
backend/src/db/seed/data/blog/phytotherapie/gotu-kola.ts
backend/src/db/seed/data/blog/phytotherapie/plantes-circulatoires-cerveau.ts
backend/src/db/seed/data/blog/phytotherapie/plantes-respiratoires.ts
backend/src/db/seed/data/blog/phytotherapie/reglisse-licorice.ts
backend/src/db/seed/data/blog/phytotherapie/safran.ts

backend/src/db/seed/data/blog/science/antioxydants-science.ts
backend/src/db/seed/data/blog/science/axe-intestin-cerveau.ts
backend/src/db/seed/data/blog/science/index.ts

backend/src/db/seed/data/blog/skincare/rosacee.ts

backend/src/db/seed/data/blog/supplements/benchmark-supplements.ts
backend/src/db/seed/data/blog/supplements/collagenes-benchmark.ts
backend/src/db/seed/data/blog/supplements/complements-precautions-vigilance.ts
backend/src/db/seed/data/blog/supplements/vitamines-mineraux-cofacteurs.ts
```

### 8. Seed — autres (21)

```
# Other data
backend/src/db/seed/data/ingredient-tags/index.ts
backend/src/db/seed/data/otherdata/product-associations.ts
backend/src/db/seed/data/otherdata/tag-associations.ts
backend/src/db/seed/data/tags/index.ts

# Docs seed
backend/src/db/seed/docs/ROADMAP.md
backend/src/db/seed/docs/STATE.md
backend/src/db/seed/docs/probleme-doublons.md

# Runners
backend/src/db/seed/runners/seed-blog.ts
backend/src/db/seed/runners/seed-core.ts
backend/src/db/seed/runners/seed-skincare.ts

# Tests
backend/src/db/seed/tests/dataSlugs.ts
backend/src/db/seed/tests/ingredient-slugs-split.test.ts
backend/src/db/seed/tests/ingredient-tags-split.test.ts
backend/src/db/seed/tests/product-ingredients.ts
backend/src/db/seed/tests/seed-data-integrity.test.ts
backend/src/db/seed/tests/shared-schemas-vs-tags.test.ts
backend/src/db/seed/tests/test-global.ts
backend/src/db/seed/tests/verify-ingredient-slugs.ts

# Utils
backend/src/db/seed/utils/batch.ts
backend/src/db/seed/utils/csv.ts
backend/src/db/seed/utils/markdown-validator.ts
```

---

## Recommandation

1. **Ne pas merger le stash.** Le backend/seed a beaucoup évolué depuis le
   23 avril (reformating data architecture, category splits, etc.).
2. **Extraction chirurgicale** fichier-par-fichier uniquement là où le
   stash porte une valeur non re-committée ailleurs. Cible principale :
   le cleanup `shared/src/products/{types,schemas,ingredients}.ts` qui
   matche ce que STATE.md §12 prétend fait.
3. **Corriger STATE.md §12** après décision : soit marquer `[ ]` à faire,
   soit faire la suppression et laisser `✅`.
