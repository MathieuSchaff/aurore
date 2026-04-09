# Stratégie de découpage — commits atomiques

## 1. Vue d'ensemble des changements

**94 fichiers** touchés, 2138 insertions / 2433 suppressions.  
On peut identifier **7 grandes thématiques** dans ce diff.

| #   | Thématique                                                               | Fichiers |
| --- | ------------------------------------------------------------------------ | -------- |
| A   | Infrastructure : gitignore + migrations Drizzle                          | 8        |
| B   | Nouveaux primitives partagés (Dialog, Sheet, Modal, DropdownMenu, hooks) | 10       |
| C   | Refactoring `Card` : sous-composants                                     | 2        |
| D   | Rework des tokens couleur (tous les thèmes)                              | 10       |
| E   | CSS vivid sur tous les composants partagés                               | ~30 CSS  |
| F   | Feature `collection` : logique, layout, extraction sous-composants       | ~35      |
| G   | CSS vivid sur les features (habits, home, tasks, discussions…)           | ~10 CSS  |

---

## 2. À partir de quel commit faire le reset ?

### Option recommandée : **pas de reset nécessaire**

Tous les changements listés ci-dessous sont actuellement **dans le working tree non stagé** (`M` = modified, `??` = untracked). Ils ne font pas partie du dernier commit.

Le dernier commit `edbb856 feat(theme): add vivid variant` a ajouté les fichiers de tokens vivid. Les changements actuels dans le working tree **modifient** ces tokens en profondeur — ils ne remettent pas en cause ce commit, ils le complètent.

**Donc : pas de `git reset`. Fais directement `git add <fichiers>` par groupe.**

### Si tu veux quand même inclure le dernier commit dans le re-découpage

```bash
git reset --soft HEAD~1
```

Cela ramène les changements du commit `edbb856` dans le staging area, que tu peux ensuite re-répartir. À faire seulement si tu veux renommer/splitter ce commit.

---

## 3. Commits proposés — ordre et fichiers

### Commit 1 — Infrastructure DB

```
chore(db): add drizzle migrations and unignore migrations directory
```

**Pourquoi seul :** changement isolé, sans dépendance frontend/backend.

```
.gitignore
backend/drizzle/0000_baseline.sql
backend/drizzle/0001_powerful_pixie.sql
backend/drizzle/0002_sparkling_storm.sql
backend/drizzle/0003_pale_vindicator.sql
backend/drizzle/0004_material_tiger_shark.sql
backend/drizzle/0005_unusual_prism.sql
backend/drizzle/0006_unknown_luminals.sql
```

---

### Commit 2 — Shared hooks

```
feat(hooks): add useDebounce and useEscapeKey shared hooks
```

**Pourquoi seul :** utilitaires purs, aucun couplage. Les primitives dialog les utilisent → doit passer avant.

```
frontend/src/hooks/useDebounce.ts
frontend/src/hooks/useEscapeKey.ts
```

---

### Commit 3 — Primitives UI : Dialog, Sheet, Modal, DropdownMenu

```
feat(ui): add Dialog, Sheet, Modal and DropdownMenu primitives
```

**Pourquoi seul :** nouvelles briques réutilisables. Tous les refactorings qui les consomment (UserMenu, collection dialogs…) dépendent de ce commit.

```
frontend/src/component/Dialog/DialogPrimitive.tsx
frontend/src/component/Dialog/DialogPrimitive.css
frontend/src/component/Dialog/Modal.tsx
frontend/src/component/Dialog/Modal.css
frontend/src/component/Dialog/Sheet.tsx
frontend/src/component/Dialog/Sheet.css
frontend/src/component/DropdownMenu/DropdownMenu.tsx
frontend/src/component/DropdownMenu/DropdownMenu.css
```

---

### Commit 4 — Card : ajout des sous-composants

```
refactor(card): add Body, Title, Description, Footer and Actions sub-components
```

**Pourquoi seul :** IngredientsPage et ProductsPage utilisent `Card.Body`, `Card.Footer` etc. → doit passer avant leurs refactorings.

```
frontend/src/component/Card/Card.tsx
frontend/src/component/Card/Card.css
```

---

### Commit 5 — Rework des tokens couleur (tous les thèmes)

```
refactor(tokens): rework dark backgrounds and add per-theme CSS custom properties
```

**Nature :** complémentaires primary, nouvelle hiérarchie `bg-page/card/elevated/sunken`, ajout des variables `--toggle-*`, `--card-footer-*`, `--page-title-color` dans chaque thème.

```
frontend/src/styles/tokens/colors-dark-ardoise.css
frontend/src/styles/tokens/colors-dark-bleu.css
frontend/src/styles/tokens/colors-dark-foret.css
frontend/src/styles/tokens/colors-dark-terracota.css
frontend/src/styles/tokens/colors-dark-vivid.css
frontend/src/styles/tokens/colors-light-ardoise.css
frontend/src/styles/tokens/colors-light-bleu.css
frontend/src/styles/tokens/colors-light-foret.css
frontend/src/styles/tokens/colors-light-terracota.css
frontend/src/styles/tokens/colors-light-vivid.css
```

---

### Commit 6 — CSS vivid sur les composants partagés

```
style(components): apply vivid primary color styling across shared UI components
```

**Nature :** box-shadow colorées, gradients accent, hover basé sur `oklch(from var(--color-primary) ...)`, suppression du top accent bar du Card. Tous pure CSS, aucun changement logique.

```
frontend/src/component/Button/Button.css
frontend/src/component/DataDisplay/Badge/Badge.css
frontend/src/component/DataDisplay/Badge/Badge.tsx
frontend/src/component/Feedback/DemoBanner/DemoBanner.css
frontend/src/component/Feedback/EmptyState/EmptyState.css
frontend/src/component/Feedback/FormMessage/FormMessage.css
frontend/src/component/Feedback/GlobalError/GlobalError.css
frontend/src/component/Feedback/NavigationProgress/NavigationProgress.css
frontend/src/component/Feedback/Skeleton/Skeleton.css
frontend/src/component/Filter/ActiveFiltersBar/ActiveFiltersBar.css
frontend/src/component/Filter/FilterAccordion/FilterAccordion.css
frontend/src/component/Filter/FilterDrawer/FilterDrawer.css
frontend/src/component/Filter/SearchSelect/SearchSelect.css
frontend/src/component/Header/BottomNav/BottomNav.css
frontend/src/component/Input/Checkbox/Checkbox.css
frontend/src/component/Input/Input.css
frontend/src/component/Input/TagManager/TagManager.css
frontend/src/component/Input/Toggle/Toggle.css
frontend/src/component/Layout/AuthLayout/AuthLayout.css
frontend/src/component/Layout/PageHeader/PageHeader.css
frontend/src/component/Layout/SettingsSection/SettingsSection.css
frontend/src/component/Tabs/Tabs.css
frontend/src/component/Textarea/Textarea.css
frontend/src/component/Themetoggle/ThemeToggle.css
frontend/src/component/Typography/PageTitle/PageTitle.css
frontend/src/component/Typography/SectionHeader/SectionHeader.css
frontend/src/component/search/ComboboxPrimitive.css
frontend/src/component/search/SearchCombobox.css
frontend/src/features/auth/components/GoogleAuthButton/GoogleAuthButton.css
frontend/src/features/auth/styles/auth-shared.css
```

---

### Commit 7 — UserMenu : migration vers DropdownMenu

```
refactor(user-menu): migrate to DropdownMenu primitive
```

**Pourquoi seul :** refactoring significatif d'un composant partagé (suppression de 90 lignes de gestion manuelle du focus/keyboard → délégué au primitif). Logique propre, testable isolément.

```
frontend/src/component/Header/UserMenu/UserMenu.tsx
```

---

### Commit 8 — Collection : extraction de la logique de filtre

```
refactor(collection): extract filter logic and move search to local state
```

**Nature :** extraction de `filterLogic.ts` (applyFilters + sortProducts), migration du paramètre `q` hors URL (local state), nettoyage du FilterContext. Impact : moins de re-renders sur la recherche.

```
frontend/src/features/collection/filterLogic.ts
frontend/src/features/collection/context/CollectionFilterContext.tsx
frontend/src/routes/_authenticated/collection.tsx
frontend/src/features/collection/constants.ts
```

---

### Commit 9 — Collection : extraction des sous-composants du détail produit

```
refactor(collection): extract product detail into focused sub-components
```

**Nature :** InciPopup, RepurchasePicker, SentimentPicker, StatusChips sortis de ProductDetailSheet (qui était devenu trop long). Utilisation de la primitive `Sheet` pour l'overlay. Ajout de `useDuplicateProductCheck`.

```
frontend/src/features/collection/components/tabs/CollectionTab/parts/InciPopup.tsx
frontend/src/features/collection/components/tabs/CollectionTab/parts/RepurchasePicker.tsx
frontend/src/features/collection/components/tabs/CollectionTab/parts/SentimentPicker.tsx
frontend/src/features/collection/components/tabs/CollectionTab/parts/StatusChips.tsx
frontend/src/features/collection/components/tabs/CollectionTab/parts/ProductDetailSheet.tsx
frontend/src/features/collection/components/tabs/CollectionTab/parts/ProductDetailSheet.css
frontend/src/features/collection/components/tabs/CollectionTab/parts/LifecycleSection.css
frontend/src/features/collection/hooks/useDuplicateProductCheck.ts
frontend/src/features/collection/hooks/useQuickAdd.ts
```

---

### Commit 10 — Collection : migration des dialogs vers les primitives

```
refactor(collection): migrate dialogs and modals to shared primitives
```

**Nature :** AddPurchaseDialog, CollectionFiltersSheet, DeleteConfirmDialog, QuickAdd, AddToCollectionModal utilisent maintenant Modal/Sheet au lieu de leur propre overlay inline. Suppression de ~150 lignes de CSS dupliqué.

```
frontend/src/features/collection/components/modals/QuickAdd/QuickAdd.tsx
frontend/src/features/collection/components/modals/QuickAdd/QuickAdd.css
frontend/src/features/collection/components/tabs/CollectionTab/parts/AddPurchaseDialog.tsx
frontend/src/features/collection/components/tabs/CollectionTab/parts/AddPurchaseDialog.css
frontend/src/features/collection/components/tabs/CollectionTab/parts/CollectionFiltersSheet.tsx
frontend/src/features/collection/components/tabs/CollectionTab/parts/CollectionFiltersSheet.css
frontend/src/features/collection/components/tabs/CollectionTab/parts/CriteriaList.tsx
frontend/src/features/collection/components/tabs/CollectionTab/parts/CriteriaList.css
frontend/src/features/collection/components/tabs/CollectionTab/parts/DeleteConfirmDialog.tsx
frontend/src/features/collection/components/tabs/CollectionTab/parts/DeleteConfirmDialog.css
frontend/src/features/products/components/AddToCollectionModal/AddToCollectionModal.tsx
frontend/src/features/products/components/AddToCollectionModal/AddToCollectionModal.css
```

---

### Commit 11 — Collection : refactoring de la toolbar et du layout

```
refactor(collection): move add button to toolbar and rework tab layout
```

**Nature :** bouton "Ajouter" déplacé dans `CollectionTab` (avec sa toolbar search/sort/filter), enlevé du `PageHeader`. `CollectionPage` simplifié. ShelfView, ShelfHeader, ShelfSection retouchés.

```
frontend/src/features/collection/page/CollectionPage.tsx
frontend/src/features/collection/page/CollectionPage.css
frontend/src/features/collection/components/tabs/CollectionTab/CollectionTab.tsx
frontend/src/features/collection/components/tabs/CollectionTab/CollectionTab.css
frontend/src/features/collection/components/tabs/CollectionTab/ShelfView/ShelfView.tsx
frontend/src/features/collection/components/tabs/CollectionTab/ShelfView/ShelfView.css
frontend/src/features/collection/components/tabs/CollectionTab/ShelfView/ShelfHeader.tsx
frontend/src/features/collection/components/tabs/CollectionTab/ShelfView/ShelfSection.tsx
frontend/src/features/collection/components/tabs/CollectionTab/ShelfView/__tests__/ShelfView.test.tsx
frontend/src/features/collection/components/tabs/CollectionTab/ProductCard/Condensed/ProductCardCondensed.tsx
frontend/src/features/collection/components/tabs/CollectionTab/ProductCard/Condensed/ProductCardCondensed.css
frontend/src/features/collection/components/tabs/CollectionTab/ProductCard/Condensed/__tests__/ProductCardCondensed.test.tsx
frontend/src/features/collection/components/tabs/HistoryTab/HistoryTab.tsx
frontend/src/features/collection/components/tabs/HistoryTab/HistoryTab.css
frontend/src/features/collection/components/tabs/AnalysisTab/AnalysisTab.css
```

---

### Commit 12 — Products & Ingredients : adoption des sous-composants Card

```
refactor(products, ingredients): use Card sub-components and clean up CSS
```

**Nature :** IngredientsPage et ProductsPage remplacent leurs classes `.list-card__*` maison par `Card.Body`, `Card.Title`, `Card.Description`, `Card.Footer`. Suppression du CSS redondant.

```
frontend/src/features/ingredients/components/IngredientsPage.tsx
frontend/src/features/ingredients/components/IngredientsPage.css
frontend/src/features/products/components/ProductsPage.tsx
frontend/src/features/products/components/ProductsPage.css
frontend/src/features/products/components/ProductInfoTab.css
frontend/src/features/products/components/BrandCombobox/BrandCombobox.tsx
frontend/src/features/products/styles/kinds.css
```

---

### Commit 13 — CSS vivid sur les features (home, habits, tasks, discussions, profile)

```
style(features): apply vivid primary color styling across feature pages
```

**Nature :** même passe que le commit 6 mais sur les features. Borders primary-based, gradients filter-chip, box-shadows colorées. Pure CSS.

```
frontend/src/features/discussions/discussions.css
frontend/src/features/habits/components/styles/HabitsListView.css
frontend/src/features/habits/components/styles/TodayView.css
frontend/src/features/home/components/HomePage/HomePage.css
frontend/src/features/profile/components/ProfileAvatar/ProfileAvatar.css
frontend/src/features/profile/page/ProfileDashboard/ProfileDashboard.css
frontend/src/features/profile/tabs/OverviewTab/ProfileStats.css
frontend/src/features/tasks/components/TaskItem.css
frontend/src/features/tasks/components/TasksPage/TasksPage.css
```

---

## 4. Fichiers à décider

| Fichier             | Statut    | Recommandation                                                            |
| ------------------- | --------- | ------------------------------------------------------------------------- |
| `changement_css.md` | Non suivi | À supprimer ou à ignorer — notes de travail temporaires, pas à versionner |

---

## 5. Résumé de l'ordre

```
1.  chore(db): migrations + gitignore
2.  feat(hooks): useDebounce + useEscapeKey
3.  feat(ui): Dialog / Sheet / Modal / DropdownMenu
4.  refactor(card): sous-composants
5.  refactor(tokens): rework dark themes + variables
6.  style(components): vivid CSS sur composants partagés
7.  refactor(user-menu): DropdownMenu
8.  refactor(collection): filter logic + local search
9.  refactor(collection): extraction sous-composants détail
10. refactor(collection): migration dialogs
11. refactor(collection): toolbar + layout
12. refactor(products, ingredients): Card sub-components
13. style(features): vivid CSS features
```

**Total : 13 commits.** Chacun est indépendant, testable, et réversible.

---

## 6. Commandes git utiles

```bash
# Vérifier ce qui est stagé vs working tree
git status

# Stager des fichiers spécifiques
git add frontend/src/hooks/useDebounce.ts frontend/src/hooks/useEscapeKey.ts

# Vérifier avant de committer
git diff --cached

# Committer
git commit -m "feat(hooks): add useDebounce and useEscapeKey shared hooks"
```
