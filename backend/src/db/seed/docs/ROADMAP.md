# Seed & Taxonomie — Roadmap

> **À propos :** TODO list du seed (produits, INCI, images). La dette auto-tag a son propre fichier : [`../../features/auto-tagging/docs/ROADMAP.md`](../../features/auto-tagging/docs/ROADMAP.md).

Dette et tâches ouvertes. Pour l'architecture actuelle (stable), voir
[`STATE.md`](./STATE.md). Historique des items livrés : `git log`.

Règle : **une étape = une session = un commit propre.** Pas de chaînage.

---

## Ordre d'attaque

| Priorité | Item | Effort | Risque |
|---|---|---|---|
| 1 | **Auto-tagging** → [`../../features/auto-tagging/docs/ROADMAP.md`](../../features/auto-tagging/docs/ROADMAP.md) | L | Moyen |
| 2 | **§1 Images CDN — gaps résiduels** | M | Faible |
| 3 | **§2 Design debt** (pas d'action immédiate) | — | — |

---

## 1. Images & CDN

État du pipeline image : voir [`IMAGES.md`](./IMAGES.md).

### 1.1 Couverture image — gaps connus

État DB live 2026-05-12 : **4014 / 4202 patchés CDN (95.5 %)**.

- [ ] **59 URL Skinsafe externes en DB** (failures JSON archivé : 119 PNG en `http 403`, 60 produits dédupliqués/supprimés depuis). Browser automation via `scrapper-para` (`.browser_session/` setup).
- [ ] **127 produits sans `image_url`** — top marques : nutripure (16), mustela (9), avène (7), svr (7), eucerin (6), sulwhasoo (6). Workflow : `SLUG=… URL=… just image-upload` (ou `FILE=…`).
- [ ] **2 URL Atida en 404** — source disparue. NULL ou trouver alt.

### 1.2 Outils — optionnel

- [ ] Route backend `/seed-images/<slug>.webp` servant `output/images-normalized/` en dev pour découpler test du CDN prod.

---

## 2. Design debt — pas d'action immédiate

- `shared/dist/` ne contient pas de JS → drizzle-kit ne peut pas importer
  de valeurs runtime depuis shared. Décision : laisser ainsi, drizzle-kit
  tourne via Bun qui charge le TS source (`"bun": "./src/index.ts"`).
  Duplication manuelle nécessaire si pgEnum construit depuis shared.
- `ingredients.category` Drizzle column sans `.$type<>()` — retiré après avoir
  cassé les spreads dans les seeds. Laissé sans cast, sécurisé par tests seed
  + CHECK constraint (`0057_ingredients_type_category_check`).
- `product.category`, `product.kind`, `product.unit` : CHECK constraints DB
  ajoutées (commit `283f181c`). Pas d'index sur `products.category` —
  filtrages par catégorie sur grande table feront un seq scan.
- Pas de doc frontend pour les composants `Filter/` (FilterDrawer,
  FilterAccordion, SearchSelect, ActiveFiltersBar) ni pour les hooks
  `useListFilters` / `useTagFilterGroups`. `STATE.md` §5.5 liste les clés de
  filtre par page mais n'explique pas les props/variants. Décision : laisser
  tant que le code reste auto-explicatif, ajouter une page dédiée si un 3ᵉ
  consommateur de FilterDrawer apparaît.

---

## Historique livré (compressé)

- **§0.5 Domain-consistency (2026-05-12)** — 779 violations supprimées. Pipeline auto-tag patché (`write.ts` + `backfill/main.ts`) pour ne plus recréer de violations. `just audit-db` → 0 violation.
- **§1 Dédup produits scrapés (2026-05-12)** — cross-source : 0 paire (résolu 2026-04-30). Intra-source : 150 paires détectées → 0 vrai doublon après review (119 variantes légitimes via flags `num-diff` / `color-diff` / `size-mm` / `model-variant` / `tint-diff` ; 31 faux positifs INCI). Aucune fusion justifiée.
- **§2 INCI quality plateau définitif (2026-05-12/13)** — FR skincare 78.5% / FR other 75.2% / non-FR 80.2%. Plus aucun levier parser à ROI positif. Livrés : worst-match prose marketing (5 fixés), parse artifacts (en-dash + no-space period, `separators.ts`), single-token resplit (9 produits, `resplit-single-token.ts`), top unmatched FR + non-FR (30+6 tokens `curated.generated.json`), parser fix M.2 (`splitINCI` post-merge bare-digit). Contexte : [`audits/NEXT-SESSION-PROMPT.md`](./audits/NEXT-SESSION-PROMPT.md).
