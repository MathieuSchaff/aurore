# CollectionTab — Styling Report

## Context

This file documents the color and styling system for the **CollectionTab** feature of Aurore, a habit-tracker app for ADHD users. The CollectionTab lets users manage their skincare/supplement products organized in "shelves" by status (in stock, wishlist, archived, etc.).

### Component tree (simplified)

```
CollectionPage
└── CollectionTab
    └── ShelfView                      ← renders one ShelfSection per status
        └── ShelfSection               ← droppable zone, wraps a status group
            ├── ShelfHeader            ← clickable header bar with status color
            └── ShelfGrid
                └── ProductCardCondensed  ← one card per user product
```

### Key domain concepts

- **`product.kind`** — the category of the product (e.g. `"skincare"`, `"huile"`, `"vitamine"`, `"complément"`). Determines the card accent color.
- **`userProduct.status`** — the lifecycle status of a product in the user's collection. Possible values: `in_stock`, `wishlist`, `watched`, `holy_grail`, `archived`, `avoided`. Determines the shelf header color and card visual modifiers.
- **CSS custom properties (`var(--...)`)** — the entire color system is token-based. Colors are never hardcoded in components; they reference design tokens defined in `frontend/src/styles/tokens/`.

### Styling architecture

- All styles use **Vanilla CSS** (no CSS-in-JS, no Tailwind).
- Styles are scoped with `@layer components { ... }` to control cascade order.
- **Two-level token system:**
  1. Primitive tokens (`--color-success`, `--color-primary`, etc.) — defined per theme in `colors-light.css` / `colors-dark.css`.
  2. Semantic/component tokens (`--shelf-color-*`, `--status-color-*`, `--card-accent`) — defined at `:root` level, referencing primitives.
- **Inline styles** are used intentionally on components to inject CSS custom properties (e.g. `--card-accent`, `borderLeftColor`) that CSS rules then consume. This is the standard pattern in this codebase for dynamic, data-driven colors.

---

## 1. ShelfSection — Where are colors defined?

The `ShelfSection` container itself (`.shelf-section`) has **no color-coding** — it uses generic tokens
(`--bg-card`, `--border-default`). The color comes from the **header's left border**, driven by the
product status.

### Data flow

```
constants.ts → statusLabels[status].color
             → "var(--status-color-{status})"
             → ShelfHeader.tsx  (inline style: borderLeftColor)
             → .shelf-header { border-left: 3px solid; }
```

`statusLabels` is a plain object in `constants.ts` that maps each status string to a CSS token name.
`ShelfHeader.tsx` reads that token name and applies it as an inline `style` prop — this is intentional
because the color is data-driven and cannot be expressed with a static CSS class.

### Token definitions

**File:** `frontend/src/styles/tokens/colors-root.css` (lines 44–49)

These tokens live in `colors-root.css`, not in the theme files, because they are **status colors** that
don't change between light/dark mode — they are fixed identity colors for each status.

```css
--status-color-in-stock:   oklch(65% 0.18 145deg);  /* green */
--status-color-wishlist:   oklch(58% 0.18 250deg);  /* blue */
--status-color-watched:    oklch(72% 0.15 60deg);   /* yellow */
--status-color-holy-grail: oklch(58% 0.22 25deg);   /* orange-red */
--status-color-archived:   oklch(52% 0.03 220deg);  /* grey-blue */
--status-color-avoided:    oklch(20% 0.02 220deg);  /* dark grey */
```

The badge count in the header also uses the same color inline
(`color: cfg.color; background: color-mix(... cfg.color 12% ...)`).

---

## 2. ProductCardCondensed — Border, icon, and color system

All visual color on the card flows from a **single CSS custom property**: `--card-accent`.
This variable is injected via inline style on the card's root element and consumed throughout the CSS
for border, icon background, icon color, chip borders, hover shadows, etc.

### 2a. Why is the border left green (for skincare)?

**Chain:**

```
product.kind = "skincare"
  → kindColorTokens["skincare"]          (constants.ts:29)
  = "var(--shelf-color-skincare)"
  → --shelf-color-skincare               (ProductCardCondensed.css:4)
  = var(--color-success)
  → --color-success (light mode)         (colors-light.css:61)
  = oklch(50% 0.2 var(--h-lime))        ← green/lime
```

`kindColorTokens` (in `constants.ts`) is a lookup table from `kind` string → CSS token string.
The result is passed as `--card-accent` on the card root div:

```tsx
// ProductCardCondensed.tsx
style={{ '--card-accent': kindColor } as React.CSSProperties}
```

Then in CSS:
```css
/* ProductCardCondensed.css */
border-left: 6px solid var(--card-accent, var(--color-primary));
```

### 2b. Where are the `--shelf-color-*` tokens defined?

**File:** `ProductCardCondensed.css` lines 3–9, inside `@layer components { :root { ... } }`

These tokens are declared inside the component's own CSS file (not in a global token file) because
they are specific to this component's color semantics.

```css
--shelf-color-skincare:   var(--color-success);   /* green */
--shelf-color-complement: var(--color-primary);   /* theme primary */
--shelf-color-huile:      var(--color-warning);   /* yellow/amber */
--shelf-color-vitamine:   var(--color-info);      /* blue */
--shelf-color-default:    var(--color-accent);    /* fallback for unknown kinds */
```

Unknown kinds fall back to `DEFAULT_KIND_COLOR_TOKEN = "var(--shelf-color-default)"` (also in
`constants.ts`).

To add a new `kind` color: add the token here, then add an entry to `kindColorTokens` in
`constants.ts`.

### 2c. Why is the icon green?

`.prod-icon-box` uses the same `--card-accent`:
```css
color: var(--card-accent, var(--color-primary));
background: oklch(from var(--card-accent, var(--color-primary)) 96% 0.02 h);
```

The icon component (`<ProductIcon>`) renders an SVG that uses `currentColor`, so it inherits whatever
`color` is set on `.prod-icon-box` — which is `--card-accent`.

### 2d. Why is the border sometimes dashed?

**File:** `ProductCardCondensed.css` lines 215–217

```css
.prod-card.status-wishlist {
  border-left-style: dashed;
}
```

The class `status-wishlist` is added by `getStatusClass(p.status)` in `ProductCardCondensed.tsx`.
The dashed style is intentional: wishlist items are "not yet owned", so they look visually lighter/
tentative compared to owned items.

---

## 3. Full color override summary for the card

Both `kind` and `status` can affect the card's appearance, and **status overrides kind** for accent
color in some cases (e.g. `avoided` hardcodes a red accent regardless of kind).

| Situation | What changes | CSS rule / source |
|---|---|---|
| `kind = skincare` | accent = green | `--shelf-color-skincare → --color-success` |
| `kind = complément/complement` | accent = primary | `--shelf-color-complement → --color-primary` |
| `kind = huile` | accent = amber | `--shelf-color-huile → --color-warning` |
| `kind = vitamine` | accent = blue | `--shelf-color-vitamine → --color-info` |
| `kind = unknown` | accent = default accent | `DEFAULT_KIND_COLOR_TOKEN → --shelf-color-default` |
| `status = avoided` | accent overridden to red-brown | `.prod-card.status-avoided { --card-accent: oklch(55% 0.2 25) }` |
| `status = wishlist` | border-left dashed | `.prod-card.status-wishlist { border-left-style: dashed }` |
| `status = archived` | card desaturated + faded | `.prod-card.status-archived { filter: saturate(0.4); opacity: 0.65 }` |
| `status = holy_grail` | golden border | `.prod-card.status-holy-grail { border-color: oklch(80% 0.15 85) }` |

Score-based decorations (independent of kind/status):

| Score | Corner ribbon | Chip style |
|---|---|---|
| ≥ 17 (gold) | gold triangle top-right | `.score-gold` — warm yellow bg |
| ≥ 14 (rare) | purple triangle top-right | `.score-rare` — purple tones |
| ≥ 10 (good) | none | `.score-good` — success green bg |
| < 10 or no score | none | `.score-none` — muted grey |

---

## 4. Design decision — card accent axis (status vs kind)

### Problem

The original design used `product.kind` to drive `--card-accent` on each card (the left border color).
This worked in theory but broke in practice: **all current products are `skincare`**, so every card
gets the same green border. No visual variety, the color conveys nothing useful.

Additionally, the neon theme (`colors-root-test.css`) defines 6 status tokens and an orange accent
(`--hue-accent: 35deg`) that were barely appearing in the collection UI — orange only showed up in
the header/navbar, never on cards.

### Decision — use status as the card accent axis

**`--card-accent` now follows `--status-color-{status}` instead of kind.**

```tsx
// ProductCardCondensed.tsx — was:
const kindColor = kindColorTokens[p.kind] ?? DEFAULT_KIND_COLOR_TOKEN
style={{ '--card-accent': kindColor }}

// now:
const statusColor = statusLabels[p.status].color
style={{ '--card-accent': statusColor }}
```

No CSS changes needed — everything that consumes `--card-accent` stays the same.

### Why this is better

| Concern | Kind-based | Status-based |
|---|---|---|
| Visual variety now | None (all skincare = all green) | 6 distinct colors |
| Semantic value | Low (kind is also shown by the icon) | High (status = where it is in your lifecycle) |
| Neon theme orange usage | Never on cards | Appears on `holy_grail` cards |
| Cohesion with shelf header | No relation | Shelf header + cards share the same status color |

The shelf header already uses status color for its left border. With this change, the cards inside
a shelf echo the same color — creating a unified visual group per status.

In the neon theme, the orange accent (`--status-color-holy-grail ≈ oklch(58% 0.22 25deg)`) now
appears naturally on your best products. Semantically ideal: the brand accent marks your holy grails.

### What happens to kind colors

The `--shelf-color-*` tokens and `kindColorTokens` map are **kept** for future use. When the
collection grows to include vitamins, oils, and supplements, kind can reappear as a **secondary
visual** (icon background tint, a small dot, a chip color) rather than the dominant left border.

For now: **kind = communicated by the icon shape. Status = communicated by the border color.**

---

## 5. File index

| File | Role |
|---|---|
| `ProductCardCondensed.css` | Defines `--shelf-color-*` tokens + all card visual rules |
| `ProductCardCondensed.tsx` | Resolves `kindColor` and injects `--card-accent` via inline style |
| `ShelfView.css` | Styles for `.shelf-section`, `.shelf-header`, `.shelf-grid`, `.shelf-drop-indicator` |
| `ShelfSection.tsx` | Droppable container; applies `is-over` class + status-color border on drag-over |
| `ShelfHeader.tsx` | Applies `borderLeftColor` inline from `statusLabels[status].color` |
| `constants.ts` | Maps `product.kind` → `--shelf-color-*` token; maps `status` → `--status-color-*` token |
| `tokens/colors-root.css` | Defines `--status-color-*` (fixed, theme-independent status identity colors) |
| `tokens/colors-light.css` | Defines `--color-success`, `--color-primary`, `--color-warning`, etc. for light mode |
| `tokens/colors-dark.css` | Same semantic tokens for dark mode |
