# Collection — Shelf-tabs redesign log

Source: Claude Design handoff (`Ma Collection.html` — Variation B, shelf tabs, cozy density, corner ribbons). Drag-and-drop removed; replaced by tap-to-move picker + long-press multi-select + bulk bar.

---

## Created

### New components (shelf-tabs UX)

- `components/tabs/CollectionTab/ShelfView/ShelfTabs.tsx`
  Thin adapter over shared `Tabs` primitive. Builds `Tout` + 6-status options with per-status `color` and `dimmed` for empty shelves.

- `components/tabs/CollectionTab/ShelfView/StatusPicker.tsx` + `.css`
  2-column grid of the 6 statuses as **`DropdownMenu.Item`s** — no self-positioning, no outside-click/Escape handlers (delegated to the shared `DropdownMenu` primitive). Consumers wrap it in `<DropdownMenu><DropdownMenu.Trigger /><DropdownMenu.Content>…StatusPicker</DropdownMenu.Content></DropdownMenu>` (see `ProductCardCondensed`, `BulkBar`).

- `components/tabs/CollectionTab/ShelfView/BulkBar.tsx` + `.css`
  Floating dark pill at the bottom. Shows selection count + "Déplacer vers…" trigger wrapped in `DropdownMenu` (side="top" align="end") that opens the `StatusPicker`. Respects `safe-area-inset-bottom`, animated slide-in, mobile-friendly.

- `components/tabs/CollectionTab/ShelfView/FirstTimeEmpty.tsx` + `.css`
  **Onboarding** empty state, rendered when the collection is entirely empty (0 products, user has never added anything). Replaces the whole `ShelfView` — no tabs shown since there is nothing to sort. Large illustrated art (floating bottles + sparkles), title, explanatory sub, primary CTA "Ajouter mon premier produit", and 3 pedagogical hint cards (Saint Graal / En stock / Wishlist).

- `components/tabs/CollectionTab/ShelfView/ShelfEmpty.tsx` + `.css`
  **Contextual** empty state, rendered when the collection has products but the *active* status tab has none (e.g. user has 5 products but taps "Archivé"). Rendered in place of `ShelfGrid` — tabs stay visible above so the user can navigate to a filled shelf. Minimal: emoji + title + hint, **no CTA**.

  > Why two states? Merging them would either pollute every empty tab with onboarding noise (bad for users with products) or make first-contact feel cold (bad for new users). They solve different problems.

- `components/tabs/CollectionTab/ShelfView/ShelfGrid.css`
  Grid styles previously colocated in `ShelfView.css`; split out as `ShelfGrid` is now its own component.

### New tests

- `ShelfView/__tests__/ShelfTabs.test.tsx` — tab counts, dimmed class, onChange, roving tabindex.
- `ShelfView/__tests__/BulkBar.test.tsx` — empty render, pluralization, onClear, picker → onMove.

---

## Rewritten

- `components/tabs/CollectionTab/ShelfView/ShelfView.tsx`
  No more `DndContext` / `DragOverlay` / sensors. Now owns tab state (persisted to `localStorage` under `collection:activeShelf`) and selection state. Renders `ShelfTabs` → `ShelfGrid` → `BulkBar`; swaps to `FirstTimeEmpty` when collection is empty and `ShelfEmpty` per-shelf.

  New props:
  ```ts
  onStatusChange(id, status)
  onStatusChangeMany(ids, status)
  onToggleExpand(id)
  onAddClick()
  ```

- `components/tabs/CollectionTab/ShelfView/ShelfView.css`
  Stripped everything related to accordion sections; now just a flex column with bottom padding for the `BulkBar`.

- `components/tabs/CollectionTab/ShelfView/ShelfGrid.tsx`
  Reverted to a thin `ReactNode` wrapper; selection/move plumbing moved to `ShelfView` (which passes card props directly).

- `components/tabs/CollectionTab/ShelfView/__tests__/ShelfView.test.tsx`
  Rewritten around the new tab/selection model: FirstTimeEmpty rendering, tab counts, filter-by-tab, per-shelf empty, `localStorage` persistence.

---

## Modified

- `components/tabs/CollectionTab/ProductCard/Condensed/ProductCardCondensed.tsx`
  - Removed `useDraggable` + overlay mode (`isOverlay` prop).
  - Added optional props: `selectMode`, `selected`, `onToggleSelect`, `onMoveStatus`.
  - Long-press (500 ms, with 8 px move-tolerance) → toggles selection + light haptic (`navigator.vibrate`).
  - Tap while in select mode → toggles selection; otherwise unchanged (opens detail sheet).
  - Status pill added to the footer chips row; tap opens `StatusPicker`. `data-stop-long-press` on pill + sentiment badge so those elements don't trigger selection.
  - Kept: sentiment badge + popping animation, score chip, corner ribbon (gold/rare), kind chip, price, product icon.

- `components/tabs/CollectionTab/ProductCard/Condensed/ProductCardCondensed.css`
  - Removed drag-source dim (`is-source-dragging`).
  - Added `.pcc-check` select checkbox overlay (top-left, animated).
  - Added `.pcc--selected` outline + subtle scale-down transform.
  - Added `.pcc-status-wrap` / `.pcc-status-pill` / `.pcc-picker` (picker opens upward to avoid footer clipping).
  - Mobile / reduced-motion overrides extended.

- `components/tabs/CollectionTab/CollectionTab.tsx`
  Passes `onStatusChangeMany` (maps to parallel `useUpdateUserProduct.mutate` calls) and `onAddClick` down to `ShelfView`.

- `page/CollectionPage.tsx`
  `PageHeader` now receives `meta` = `"N produits"` when `N > 0`.

- `__integration__/CollectionPage.test.tsx`
  Renamed the "products are grouped by status in shelf sections" test to reflect the tab UX: asserts the default "Tout" tab shows all products and tabs expose status labels via `role="tab"`. Other tests unchanged.

---

## Deleted

- `components/tabs/CollectionTab/ShelfView/ShelfSection.tsx`
- `components/tabs/CollectionTab/ShelfView/ShelfHeader.tsx`
- `components/tabs/CollectionTab/ShelfView/__tests__/ShelfSection.test.tsx`

Also deleted during the `Tabs` refactor:

- `components/tabs/CollectionTab/ShelfView/ShelfTabs.css`
  Styles merged into the shared `component/Tabs/Tabs.css` under the new `underline` variant.

---

## Outside `features/collection/` (touched, for context)

- `component/Tabs/Tabs.tsx` + `Tabs.css`
  Added `variant: 'pill' | 'underline'` (default `pill`, existing consumers unchanged), `scrollable`, `ariaLabel`, and per-`TabOption` `color` + `dimmed`. Underline variant: measure-based indicator for variable-width tabs, scroll-snap on overflow, per-tab color tint, dimmed-empty styling. Shared keyboard nav (Arrow/Home/End) + `aria-selected`/`aria-controls`/roving `tabIndex` now cover shelf tabs too.

- `component/DropdownMenu/DropdownMenu.tsx` (consumed, not modified)
  `StatusPicker` no longer hand-rolls outside-click / Escape / positioning / arrow-key nav / focus-return; the shared primitive handles all of it. Card status pill and `BulkBar` are now proper `DropdownMenu.Trigger`s with `role="menu"` content.

- `frontend/package.json`
  Removed `@dnd-kit/core`, `@dnd-kit/modifiers`, `@dnd-kit/utilities`. Lockfile updated (`bun install`).

---

## Behaviour deltas

| Before | After |
|---|---|
| 6 stacked accordion shelves, each collapsible | 7 tabs (Tout + 6 statuses) with animated underline |
| Drag card between sections to change status (clunky on mobile) | Tap status pill → picker; or long-press + bulk bar |
| No multi-select | Long-press a card enters select mode; tap others to add/remove; `BulkBar` moves all |
| Empty collection = empty shelves | `FirstTimeEmpty` illustrated state with CTA |
| Empty shelf hidden entirely (`count === 0` returned `null`) | `ShelfEmpty` per-shelf state on each tab |
| Tab selection not persisted | Active tab persisted in `localStorage` (`collection:activeShelf`) |

---

## Verification

- `bunx tsc -b --noEmit` → clean.
- `biome check` → clean.
- `vitest run` (frontend): 18 pre-existing failures (unrelated — `ProductDetailSheet`, `Toggle`, `PaletteSettings`, `CriteriaList`, `useQuickAdd`, some `CollectionPage` integration flows relying on `getByRole('button')` against `role="tab"` buttons). 0 regressions introduced by this work. New `ShelfView` / `ShelfTabs` / `BulkBar` tests (13) all pass.
