# Changements CSS — Refonte contraste & terracota

## 1. Tokens de surfaces — tous les thèmes

Refonte initiale (avant le focus terracota) appliquée à **10 fichiers** :
- `frontend/src/styles/tokens/colors-light-{terracota,ardoise,bleu,foret,vivid}.css`
- `frontend/src/styles/tokens/colors-dark-{terracota,ardoise,bleu,foret,vivid}.css`

### Variables modifiées (présentes dans chaque fichier)

| Variable | Avant | Après (light) | Après (dark) |
|---|---|---|---|
| `--bg-page` | teinté thème | warm ivory `oklch(98.5% 0.006 75)` | warm dark `oklch(12% 0.01 60)` |
| `--bg-card` | quasi-blanc / quasi-noir | bloc teinté thème ~89% L | bloc teinté ~30% L |
| `--bg-elevated` | proche bg-card | légèrement plus saturé que card | idem |
| `--bg-sunken` | proche bg-page | plus foncé/saturé que card (~82% L) | plus foncé que card (~22% L) |
| `--bg-muted` | divers | quasi-blanc `~98% L` (interactif) | plus clair que card (~40% L) |
| `--border-default` | doux | renforcé (~75% L light / 45% L dark) | idem |
| `--shadow-card` | mou | `0 4px 16px oklch(0% 0 0 / 0.10), 0 1px 4px oklch(0% 0 0 / 0.06)` (light), alpha 0.4 (dark) | idem |
| `--color-primary` (+ hover/dark) | teinte du thème | **complémentaire** par thème (teal/amber/orange/coral) | idem |

> **Note** : pour terracota light, ces valeurs ont été partiellement écrasées dans les étapes suivantes.

---

## 2. Spécifique terracota light

Fichier : `frontend/src/styles/tokens/colors-light-terracota.css`

### Override des surfaces — cards blanches au lieu de teintées

```css
--l-page: 98.5%;
--l-card: 100%;       /* card pure white */
--l-elevated: 100%;
--l-sunken: 95%;
--l-muted: 97%;

--bg-page: oklch(var(--l-page) 0.006 75);  /* warm ivory */
--bg-card: oklch(var(--l-card) 0 0);       /* pure white */
--bg-elevated: oklch(var(--l-elevated) 0 0);
--bg-sunken: oklch(var(--l-sunken) 0.02 75);
--bg-muted: oklch(var(--l-muted) 0.008 75);
```

### Override des bordures et de l'ombre

```css
--border-default: oklch(75% 0.05 45);
--border-strong:  oklch(60% 0.08 45);
--shadow-card:    0 4px 16px oklch(0% 0 0 / 0.1), 0 1px 4px oklch(0% 0 0 / 0.06);
```

### CTA vert pétant (override final du primary)

```css
--color-primary:       oklch(68% 0.24 145);  /* vivid green */
--color-primary-hover: oklch(62% 0.26 145);
--color-primary-dark:  oklch(52% 0.22 145);
--color-primary-text:  oklch(100% 0 0);
```

### Nouvelles variables custom (terracota uniquement)

| Variable | Valeur | Usage |
|---|---|---|
| `--page-title-color` | `oklch(68% 0.2 65)` | Couleur du H1 dans `PageHeader` (Produits, Ingrédients, Collection…) — mango |
| `--product-footer-bg` | `oklch(78% 0.18 65)` | Fond du footer des cards produit — mango pronounced |
| `--product-footer-border` | `oklch(70% 0.2 65)` | Border-top du footer des cards produit |
| `--product-footer-text` | `oklch(100% 0 0)` | Texte (prix) sur le footer mango — blanc |
| `--product-footer-text-muted` | `oklch(100% 0 0 / 0.7)` | Variante prix vide |
| `--product-unit-chip-bg` | `oklch(100% 0 0)` | Fond de la chip quantité dans le footer — blanc |
| `--product-unit-chip-text` | `oklch(58% 0.2 65)` | Texte de la chip quantité — mango |
| `--product-unit-chip-border` | `oklch(100% 0 0)` | Bordure de la chip quantité — blanc (invisible) |

---

## 3. Composants modifiés (consommateurs des nouvelles variables)

### `frontend/src/component/Button/Button.css`

`.button.secondary` / `.button.default` :
- **Avant** : `background: var(--bg-card)` (collisions avec cards teintées)
- **Après** : `background: var(--bg-muted)`, `border: 1px solid var(--border-default)`

### `frontend/src/component/Layout/PageHeader/PageHeader.css`

`.page-header__title` :
- **Avant** : `color: var(--color-primary)`
- **Après** : `color: var(--page-title-color, var(--color-primary))`
- → Override possible par thème via `--page-title-color`

### `frontend/src/features/products/components/ProductsPage.css`

`.list-card--product .list-card__footer` :
- **Avant** : `background: var(--bg-sunken)`, `border-top: 1px solid var(--bg-muted)`
- **Après** :
  - `background: var(--product-footer-bg, var(--bg-sunken))`
  - `border-top: 1px solid var(--product-footer-border, var(--bg-muted))`
  - `color: var(--product-footer-text, var(--text-primary))`

`.list-card--product .list-card__price` :
- **Avant** : `color: var(--text-primary)`
- **Après** : `color: var(--product-footer-text, var(--text-primary))`

`.list-card--product .list-card__price--empty` :
- **Avant** : `color: var(--text-muted)`
- **Après** : `color: var(--product-footer-text-muted, var(--text-muted))`

`.list-card--product .list-card__unit-chip` :
- **Avant** : `color: var(--text-secondary)`, `border: 1px solid var(--bg-muted)`, pas de background
- **Après** :
  - `background: var(--product-unit-chip-bg, transparent)`
  - `color: var(--product-unit-chip-text, var(--text-secondary))`
  - `border: 1px solid var(--product-unit-chip-border, var(--bg-muted))`

---

## 4. Documentation

`frontend/docs/CSS_GUIDE.md` — section 3.8 (Backgrounds / Surfaces) réécrite pour documenter la nouvelle philosophie : page neutre, cards comme bloc teinté, sémantique interactif (`--bg-muted` quasi-blanc) vs passif (`--bg-sunken` plus foncé), pas de bordure sur les cards, ombres douces uniquement.

---

## 5. Refactoring — suppression des `[data-theme]` dans les composants

### Principe

Tous les sélecteurs `[data-theme="light"]` / `[data-theme="dark"]` ont été retirés des fichiers CSS de composants. Les couleurs sont désormais exclusivement contrôlées via les fichiers de tokens dans `frontend/src/styles/tokens/`.

### Composants modifiés

| Composant | Ce qui a changé |
|---|---|
| `Badge.css` | Opacité badge catégorie : `0.18` → `0.12` (compromis light/dark) |
| `FilterAccordion.css` | Label : `--text-muted` → `--text-secondary` ; opacités essential `0.08` → `0.05`, subgroup `0.12` → `0.08` |
| `SearchSelect.css` | Dropdown : `--bg-card` → `--bg-elevated` ; box-shadow focus ajoutée à la base |
| `ComboboxPrimitive.css` | Dropdown : `--bg-card` → `--bg-elevated` ; shadow tintée primary ; active `--bg-hover` → `oklch(…/0.08)` |
| `FilterDrawer.css` | Styles light promus en base : panel `--color-primary-subtle`, border-top 3px primary, header gradient, titre `--color-primary`, footer `--bg-page` ; media query 640px unifiée (border-left 3px primary) |
| `BottomNav.css` | Gradient indigo hardcodé supprimé — utilise `--color-sidebar-bg` du thème |
| `ThemeToggle.css` | 6 blocs `[data-theme]` remplacés par des variables `--toggle-*` |
| `ProfileDashboard.css` | Override `[data-theme="dark"]` redondant supprimé (base déjà `--text-secondary`) |

### Nouvelles variables `--toggle-*` (ThemeToggle)

Ajoutées dans les **10 fichiers de tokens** (`colors-light-*` et `colors-dark-*`) :

| Variable | Thèmes light | Thèmes dark |
|---|---|---|
| `--toggle-track-bg` | `var(--color-primary-dark)` | `oklch(from var(--color-header-action) l c h / 0.15)` |
| `--toggle-track-hover-bg` | `var(--color-primary-deeper)` | `var(--color-header-action-bg-hover)` |
| `--toggle-fg` | `oklch(100% 0 0)` | `var(--color-header-action)` |
| `--toggle-fg-opacity` | `0.85` | `0.35` |
| `--toggle-active-icon` | `var(--color-primary-dark)` | `var(--color-header-bg)` |
| `--toggle-active-filter` | `none` | `drop-shadow(0 0 3px oklch(from var(--color-header-action) l c h / 0.6))` |

---

## 6. Refactoring — bandeau footer sur toutes les cards de liste

### Principe

Toutes les cards des pages de liste (Produits, Ingrédients, Collection) ont maintenant un bandeau bas uniforme : `border-top` + `background: var(--bg-sunken)`. Ce bandeau regroupe les métadonnées secondaires et libère le corps de la card pour l'essentiel (nom, description).

### `ProductCardCondensed` — Collection

Fichier : `frontend/src/features/collection/components/tabs/CollectionTab/ProductCard/Condensed/ProductCardCondensed.tsx` + `.css`

- La card est maintenant en `flex-direction: column` au lieu de `flex-direction: row`
- Nouveau wrapper `.prod-card-top` : icône + nom/marque (layout row, `min-height: 4.75rem`)
- Nouveau `.prod-card-footer` : chips (kind + score) + prix — `border-top` + `bg-sunken`
- `margin-top: 6px` supprimé sur `.prod-chips` (hérité du contexte `.prod-body`, obsolète)
- `flex-shrink: 0; min-width: 2.5rem; text-align: right` supprimés sur `.prod-price` (inutiles en flex row dans le footer)
- Le hover scale sur l'icône cible maintenant `.prod-card:hover .prod-card-top .prod-icon-wrap`
- La card utilise désormais le composant réutilisable `Card` (via wrapper DnD transparent) au lieu d'un `<div>` avec les classes `card` en dur

### `IngredientsPage` — Ingrédients

Fichier : `frontend/src/features/ingredients/components/IngredientsPage.tsx` + `.css`

- `flex-direction: column` ajouté sur `.list-card` (était `flex` row, causait le footer à droite)
- Nouveau `.list-card__footer` : `Badge` catégorie + flèche SVG — `border-top` + `bg-sunken`
- `.list-card__body` : ne contient plus que le nom et la description
- `.list-card__header` supprimé (remplacé par `.list-card__footer`)

### Produits — inchangé

La card produit avait déjà ce pattern via `.list-card__footer` dans `ProductsPage.css`.

---

## 7. Specs et plan superpowers

- `docs/superpowers/specs/2026-04-06-ui-contrast-surfaces-design.md` — design doc complet
- `docs/superpowers/plans/2026-04-06-ui-contrast-surfaces.md` — plan d'implémentation détaillé
- `docs/superpowers/specs/2026-04-06-card-compound-component-design.md` — refonte Card en compound
- `docs/superpowers/plans/2026-04-06-card-compound-component.md` — plan d'exécution Card compound

---

## 8. Refonte `Card` en compound component

### Principe

`frontend/src/component/Card/Card.tsx` est désormais un **compound component**. La card racine est rejointe par 6 sous-composants nommés attachés via `Object.assign` (pour préserver le générique sur `as`) :

- `Card.Media` — zone visuelle haute (optionnelle)
- `Card.Body` — contenu principal (flex column, padding interne)
- `Card.Title` — titre (default `<h3>`, override via `as`)
- `Card.Description` — texte descriptif (line-clamp 2)
- `Card.Footer` — bandeau bas (`border-top` + `background` automatiques)
- `Card.Actions` — groupe d'actions aligné à droite dans un footer

Chaque sous-composant accepte `className` (mergé) et forward les props HTML. Pas de Context — simple namespace + classes CSS.

### Nouvelles classes CSS (`Card.css`)

Ajout à `.card` : `display: flex; flex-direction: column;`. Ajout de `.card__media`, `.card__body`, `.card__title`, `.card__description`, `.card__footer`, `.card__actions`. Toutes overridables via CSS variables `--card-*`.

### Nouvelles variables d'override (defaults dans `Card.css`)

| Variable | Default | Cible |
|---|---|---|
| `--card-accent` | `var(--color-primary)` | barre `::before` (override via prop `accent`) |
| `--card-title-size` | `var(--text-lg)` | `Card.Title` |
| `--card-title-color` | `var(--text-primary)` | `Card.Title` |
| `--card-title-family` | `var(--font-display)` | `Card.Title` |
| `--card-desc-size` | `var(--text-sm)` | `Card.Description` |
| `--card-desc-color` | `var(--text-secondary)` | `Card.Description` |
| `--card-desc-clamp` | `2` | `Card.Description` (lignes max) |
| `--card-body-padding` | `var(--space-4)` | `Card.Body` |
| `--card-media-padding` | `var(--space-4)` | `Card.Media` |
| `--card-media-bg` | `transparent` | `Card.Media` |
| `--card-footer-bg` | `var(--bg-sunken)` | `Card.Footer` |
| `--card-footer-border` | `var(--border-default)` | `Card.Footer` |
| `--card-footer-color` | `var(--text-primary)` | `Card.Footer` |
| `--card-footer-color-muted` | `var(--text-muted)` | texte secondaire dans footer (ex: prix vide) |
| `--card-footer-padding` | `var(--space-3) var(--space-4)` | `Card.Footer` |

### Migration des pages consommatrices

| Page | Changements |
|---|---|
| `IngredientsPage.tsx` + `.css` | Migration complète : `<Card.Body>`, `<Card.Title>`, `<Card.Description>`, `<Card.Footer>`. Classes `list-card*` supprimées, CSS local réduit à la grid + hover flèche (`~65 → 17 lignes`). |
| `ProductsPage.tsx` + `.css` | Migration partielle : `<Card.Title as="p" className="list-card__name">` et `<Card.Footer>` (sans className). Le header custom (kind + icône + brand) reste en markup ad hoc. Bloc `.list-card--product .list-card__footer` supprimé (redondant avec les defaults). `.list-card__price` passe à `color: inherit`. |
| `ProductCardCondensed.tsx` + `.css` | Migration partielle : `<Card.Footer>` (sans className). Le `prod-card-top` (deux boutons sentiment + expand) reste en markup ad hoc. Bloc `.prod-card-footer` supprimé (100% identique aux defaults). |

### Theming global du footer (Option A)

Les cards doivent être **uniformes au sein d'un même thème**. Toutes les `Card.Footer` du site utilisent les variables `--card-footer-*` définies au niveau `:root` de chaque thème — pas d'override scopé par type de card.

**Terracota light** : footer mango pour TOUTES les cards (avant : seules les cards produit via `--product-footer-*`). Les anciennes variables `--product-footer-*` ont été supprimées/renommées en `--card-footer-*` :

```css
/* colors-light-terracota.css */
--card-footer-bg: oklch(78% 0.18 65);      /* mango pronounced */
--card-footer-border: oklch(70% 0.2 65);
--card-footer-color: oklch(100% 0 0);       /* white */
--card-footer-color-muted: oklch(100% 0 0 / 0.7);
```

### Équilibrage des variables entre les 10 thèmes

Pour que chaque thème puisse customiser le footer (et le titre de page) sans ajouter de variable, les 10 fichiers de tokens (`colors-light-{terracota,ardoise,bleu,foret,vivid}.css` + `colors-dark-{…}.css`) ont maintenant **le même set** :

```css
--page-title-color
--card-footer-bg
--card-footer-border
--card-footer-color
--card-footer-color-muted
--product-unit-chip-bg
--product-unit-chip-text
--product-unit-chip-border
```

Les 9 thèmes non-terracota-light définissent ces variables avec des valeurs neutres (équivalentes aux defaults du compound) — zéro changement visuel, mais le hook est exposé pour customisation future.

### Documentation

- `frontend/docs/CSS_GUIDE.md` section 8.6 : API complète du compound et table des variables d'override.

---

## Repère rapide : où regarder pour ajuster terracota

| Je veux changer… | Fichier | Variable |
|---|---|---|
| Couleur des cards (top) | `colors-light-terracota.css` | `--bg-card` |
| Fond de page | `colors-light-terracota.css` | `--bg-page` |
| Couleur du CTA principal | `colors-light-terracota.css` | `--color-primary` (+ `-hover`, `-dark`) |
| Couleur du H1 des pages | `colors-light-terracota.css` | `--page-title-color` |
| **Couleur mango du footer** (toutes les cards) | `colors-light-terracota.css` | `--card-footer-bg` |
| **Couleur du texte dans le footer** | `colors-light-terracota.css` | `--card-footer-color` |
| **Texte secondaire du footer** (prix vide) | `colors-light-terracota.css` | `--card-footer-color-muted` |
| **Border-top du footer** | `colors-light-terracota.css` | `--card-footer-border` |
| Chip quantité (fond/texte) | `colors-light-terracota.css` | `--product-unit-chip-bg` / `--product-unit-chip-text` |
| Sidebar (oxydized iron) | inchangée | `--color-sidebar-bg` |
