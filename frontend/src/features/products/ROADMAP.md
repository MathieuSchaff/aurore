# Roadmap — Products

## Architecture

| Fichier / dossier | Rôle |
|---|---|
| `pages/ProductsPage/` | Orchestration liste + filtres + pagination |
| `pages/ProductLayout/` | Wrapper détail (tabs) |
| `pages/ProductInfoTab/` | Fiche produit : ingrédients, tags, purchase log |
| `pages/ProductCreate/EditPage/` | Wrappers form création/édition |
| `components/ProductCard/` | Card (slug, brand, price, tags, view transitions) |
| `components/ProductForm/` | Form création/édition + `IngredientRow` inline |
| `components/ProductsHeader/` | Search + sort + filter button + create |
| `components/ProductsActiveBar/` | Chips filtres actifs + remove |
| `components/ProductsFilterDrawerContent/` | Wrapper composition du drawer |
| `components/SortControl/` | Dropdown tri (relevance, price, newest, random) |
| `components/BrandCombobox/` | Combobox brand async |
| `components/IngredientSearch/` | Single-add ingrédient (dans le form, ≠ `AsyncSearchSelect`) |
| `components/PriceRangeFilter/` + `PriceFilterAccordion/` | Slider prix + wrapper `<details>` |
| `hooks/useProductsFilterGroups.ts` | Dérive la structure des groupes de filtres depuis le domaine |
| `hooks/useProductsExtraChips.ts` | Construit les chips actifs (prix, profil, q) |
| `filters.ts` | Schéma Zod de l'URL search params |
| `helpers.ts` | `buildProductsApiFilters()` + helpers domaine |

---

## 🚧 Actif

### Seed haircare
- [ ] **Enrichir tags haircare** : ajouter `hair_type` / `concern` / `routine_step` / `hair_effect` / `product_label` sur chaque produit haircare (≥1 tag par axe pertinent). Phase sémantique.
- [ ] **DB cleanup** : `DELETE FROM product_tags WHERE slug IN ('shampoing', 'apres-shampoing', 'masque-cheveux', 'serum-cheveux', 'huile-cheveux', 'produit-coiffant') AND type = 'product_type'` — rows orphelines.
- [ ] **db-seed non relancé** — relancer après haircare pour valider (diff labels attendu nul).

**Flag** : `cinqSurCinq` mal catégorisé (pediculicide). Reclasser en `traitement-cuir-chevelu` ou exclure du domaine haircare.

---

## ✅ Terminé

| # | Chantier | Fichiers clés | Limitations / dette |
|---|----------|---------------|---------------------|
| 1 | Champs libres contraints (`unit`, `amountUnit`, `concentrationUnit`) | `shared/src/products/units.ts`, `ProductForm.tsx` (IngredientRow), `ProductForm.schema.ts` | — |
| 2 | Tags filtrés par catégorie (formulaires + validation backend) | `ProductForm.tsx:99-113`, `backend/product-tags/domain-validation.ts` (`assertTagsMatchProductDomain`) | `tagQueries.list()` charge tous les tags, filtrage client. Optimisation : passer `category` à la query. Seed contourne la validation API (direct service). |
| 3 | Glitch tab switch (`/products`) | `ProductsPage.tsx:146-153` (`startTransition`), `PageHeader.css:55-66` (slot fixed-width 8px) | INP mesuré 328ms, cible 200ms. `content-visibility: auto` sur les cards = levier non activé. |
| 4 | `AddToCollectionModal` — statuts possédés + étape date/prix | `AddToCollectionModal.tsx`, constante `OWNED_STATUSES` | Pas de colonne `in_stock` booléenne. Le stock = le statut (enum). Décision UX si orthogonalité nécessaire. |
| 5 | Dropdown flip (ingrédient / brand / drawer) | `component/Search/useFlipPlacement.ts` → `ComboboxPrimitive`, `AsyncSearchSelect`, `SearchSelect` | — |
| 6 | Scroll parasite drawer (brand / ingredient) | `scrollIntoView` supprimé de `SearchSelect.tsx` + `AsyncSearchSelect.tsx` | — |
| 7 | Filtres brand + ingredient transmis à l'API | `helpers.ts:53-61` (`buildProductsApiFilters`) | — |
| 8 | Limit search 8 → 20 + pagination infinie | `productQueries.search` → `infiniteQueryOptions`, sentinel `IntersectionObserver` dans `ComboboxPrimitive` | — |
| 9 | Header search multi-facettes (D1 ingrédient · D2 Enter · D3 `q` · D4 sections) | `SearchCombobox`, `ComboboxPrimitive`, `ProductsHeader`, `text-fold.ts` ; backend : param `q` list endpoint | Match alphabétique (pas de scoring). `q` couvre name+brand uniquement (pas les tags). Pas d'empty state spécifique mode `q`. |
| 10 | Flash dropdown au re-fetch | `SearchCombobox.tsx` : `placeholderData: prev`, spinner premier fetch seulement | — |

---

## Issues ouverts (audit 2026-04-26)

*Baseline : 19 fails préexistants (Toggle, FilterDrawer resync, CollectionPage, PurchaseFlow, ProductDetailSheet, Layout/Card) — antérieurs à cet audit, orthogonaux.*

| Sévérité | Fichier | Ligne(s) | Problème | Fix |
|---|---|---|---|---|
| CRITICAL | `lib/queries/products.ts` | 252-255 | `useUpdateProductTags.onSuccess` n'invalide pas `bySlug` ni `lists()` → tags périmés dans `ProductInfoTab`. | Invalider `productKeys.bySlug(slug)` + `productKeys.lists()`. Passer `slug` dans le payload mutation. |
| CRITICAL | `lib/queries/products.ts` | 277-278, 298-299 | `useAddProductIngredient` / `useRemoveProductIngredient` n'invalident pas `bySlug` → ingrédients périmés dans `ProductInfoTab`. | Invalider `productKeys.bySlug(slug)`. |
| CRITICAL | `lib/queries/products.ts` | 220-230 | `useDeleteProduct.onSuccess` n'invalide pas `bySlug` ni brands → phantom brand dans combobox. | `removeQueries(bySlug)` + invalider liste brands. |
| HIGH | `pages/ProductEditPage/ProductEditPage.tsx` | 14-15 | Waterfall : `bySlug` puis `tags(product.id)`. | `useSuspenseQueries` ou inclure les tags dans `bySlug`. |
| HIGH | `pages/ProductInfoTab/ProductInfoTab.tsx` | 31, 36-44 | `profileQueries.dermo()` attend la barrière suspense `bySlug`. | Précharger `dermo()` dans le loader de route. |
| HIGH | `pages/ProductsPage/ProductsPage.tsx` | 117-125 | Flash "tous produits" au toggle profil si `dermoProfile` absent du cache. | Précharger `dermo()` au boot (utilisateur connecté). |
| HIGH | `components/ProductForm/ProductForm.tsx` | 89-93 | `useState(initialForm)` non resync après mutation. | `key={product.id ?? 'create'}` sur le form. |
| MEDIUM | `pages/ProductsPage/ProductsPage.tsx` | 127-161 | `filters`, `apiFilters`, `avoidFor` recréés à chaque render (object literals). | `useMemo` sur chacun, keyed sur `[search]`. |
| MEDIUM | `pages/ProductsPage/ProductsPage.tsx` | 176 | `staleTime` deux branches avec valeur identique. | `sort === 'random' \|\| hasFilters ? BROWSING_STALE_TIME : 0`. |
| MEDIUM | `pages/ProductInfoTab/ProductInfoTab.tsx` | 5, 86 | `react-markdown` chargé eagerly (~50 KB gzip). | `lazy(() => import('react-markdown'))` + `<Suspense>`. |
| MEDIUM | `components/ProductForm/ProductForm.tsx` | 117-120 | `checkDuplicate` re-keye à chaque frappe, pas de réutilisation cache. | Normaliser cache key (lowercase + trim). |
| MEDIUM | `components/ProductForm/ProductForm.tsx` | 215, 426-436 | Trash button bloque toute la liste en edit mode pendant une suppression. | Optimistic `setQueryData(bySlug)` dans `onMutate` ; désactiver uniquement la row via `variables.ingredientId`. |
| MEDIUM | `components/AddToCollectionModal/AddToCollectionModal.tsx` | 38 | `new Date()` dans le body → drift si modale ouverte à minuit. | `useState(() => new Date().toISOString().split('T')[0])`. |
| LOW | `components/BrandCombobox/BrandCombobox.tsx` | 38-41 | `useEffect` miroir prop → state, bidirectionnel intentionnel. | Acceptable. Documenter le binding bidirectionnel. |
| LOW | `components/PriceRangeFilter/PriceRangeFilter.tsx` | 33-38 | Deux `useEffect` miroirs `min`/`max`. | Fusionner en un seul. |
| LOW | `pages/ProductsPage/ProductsPage.tsx` | 122-125 | `avoidFor` array literal recréé à chaque render. | `useMemo([profile_filter, dermoProfile])`. |
| LOW | `pages/ProductsPage/ProductsPage.tsx` | 249-281 | `extraChips` impératif, non mémoïsé. | `useMemo`. |
| LOW | `pages/ProductsPage/ProductsPage.tsx` | 442-446 | `style={{ viewTransitionName }}` inline par card par render. | `useMemo(slug)` ou `data-slug` + CSS custom property. |
| LOW | `lib/queries/tags.ts` | 19-25 | `select` re-alloue le mapping à chaque read. | Passer `select` une couche plus profonde pour que React Query cache le résultat mappé. |
| LOW | `pages/ProductLayout/ProductLayout.tsx` | 42-46 | `useRouterState` souscrit à toute location (re-render sur hash/search/pathname). | `select: s => s.location.pathname.includes('/discussions')`. |
| LOW | `pages/ProductsPage/ProductsPage.tsx` | 89-92 | `unit?.toLowerCase().trim()` alloue par card par render. | `unitToClass` Map module-level. Coût actuel négligeable. |
| LOW | `pages/ProductsPage/ProductsPage.tsx` | 67 | `as Record<string, string[]>` perd le type discriminé. | `as FilterValues<TagFilterKey>`. |
| LOW | `lib/queries/products.ts` | 30-61 | `buildListProductsQuery` traite brand/ingredient/kind différemment des tag categories. | Dériver des deux listes depuis `FILTER_KEYS` pour symétrie. |

### Priorités

1. **CRITICAL cache** — Invalider `productKeys.bySlug` dans les 4 mutations (`useUpdateProductTags`, `useAddProductIngredient`, `useRemoveProductIngredient`, `useDeleteProduct`) dans `lib/queries/products.ts`. Élimine la classe entière de données périmées silencieuses.
2. **HIGH waterfall** — `ProductEditPage` + `ProductInfoTab` : paralléliser les queries indépendantes.
3. **MEDIUM memoize** — `filters` / `apiFilters` / `avoidFor` dans `ProductsPage.tsx` : stabiliser les refs, prépare la memoization des sous-composants.
