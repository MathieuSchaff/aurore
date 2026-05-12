# Seed & Taxonomie — Roadmap

> **À propos :** TODO list du seed (produits, INCI, images). La dette auto-tag a son propre fichier : [`../../features/auto-tagging/docs/ROADMAP.md`](../../features/auto-tagging/docs/ROADMAP.md).

Dette et tâches ouvertes. Pour l'architecture actuelle (stable), voir
[`STATE.md`](./STATE.md). Historique des items livrés : `git log`.

Règle : **une étape = une session = un commit propre.** Pas de chaînage.

---

## 0. Ordre d'attaque recommandé (2026-05-12)

| Priorité | Item | Effort | Risque |
|---|---|---|---|
| 1 | **Auto-tagging — primary auto + couverture** → `features/auto-tagging/docs/ROADMAP.md` | L | Moyen |
| 2 | **§1 Dédup intra-source produits scrapés** | M | Faible |
| 3 | **§2 INCI quality — worst-match** | S | Faible |
| 4 | **§3 Images CDN — gaps résiduels** (dernière prio) | M | Faible |

---

## 1. Produits

### 1.1 Doublons produits scrapés

> Mis à jour 2026-04-30 après le merge `0c477591` (fusion des `*.atida/.pharmashop.seed.ts` dans des `<brand>.seed.ts` unifiés) + cleanup cross-source. Détection : `scripts/audit-imported-products.ts` (archivé) ; workflow + règles : `DEDUP.md` (archivé dans `~/Mathieu/Vault/aurore-archive/seed-docs/`).

Snapshot 2026-04-30 :

- **Cross-source : 1 paire** (review, faux positif vichy `dercos-psolution` ↔ `neovadiol-meno` — produits distincts, signal commun parasite). Plus rien à traiter sur cet axe.
- **Intra-source : 1 051 paires** (336 auto-merge / 401 review / 314 weak). Tout est désormais intra-fichier. Beaucoup de faux positifs légitimes (variantes format `100ml`/`400ml`, lots `x2`/`x3`, couleurs/tailles brossettes).

- [ ] Filtrer le rapport intra-source par flags pour isoler les **vrais doublons** (exclure `num-diff` quand seule la quantité change, `kind-diff` informatifs).
- [ ] Review marque par marque dans l'ordre du tableau « Review Priority » du rapport, après filtrage.
- [ ] Pour chaque marque : appliquer les règles de décision de l'ancien `DEDUP.md` (cf archive — sameSize → fusion, sinon variantes à conserver).

---

## 2. INCI quality — suite (algo-derm)

Plateau evidence atteint. Contexte + commandes dans [`audits/NEXT-SESSION-PROMPT.md`](./audits/NEXT-SESSION-PROMPT.md).

- [ ] **Worst-match produits** : re-générer audit avec `INCI_AUDIT_FULL=1`, cibler §3/§4 (scrapes cassés, INCI appareil). Résoudre cas par cas plutôt que tokens haute fréquence.

---

## 3. Images & CDN (dernière priorité)

État du pipeline image : voir [`IMAGES.md`](./IMAGES.md).

### 3.1 Couverture image — gaps connus

État DB live 2026-05-12 : **4014 / 4202 patchés CDN (95.5 %)**.

- [ ] **59 URL Skinsafe externes en DB** (failures JSON archivé : 119 PNG en `http 403`, 60 produits dédupliqués/supprimés depuis). Browser automation via `scrapper-para` (`.browser_session/` setup).
- [ ] **127 produits sans `image_url`** — top marques : nutripure (16), mustela (9), avène (7), svr (7), eucerin (6), sulwhasoo (6). Workflow : `upload-product-image.ts <slug> --url <URL>` (ou `--file`).
- [ ] **2 URL Atida en 404** — source disparue. NULL ou trouver alt.

### 3.2 Outils — optionnel

- [ ] Route backend `/seed-images/<slug>.webp` servant `output/images-normalized/` en dev pour découpler test du CDN prod.

---

## 4. Design debt — pas d'action immédiate

- `shared/dist/` ne contient pas de JS → drizzle-kit ne peut pas importer
  de valeurs runtime depuis shared. Décision : laisser ainsi, drizzle-kit
  tourne via Bun qui charge le TS source (`"bun": "./src/index.ts"`).
  Duplication manuelle nécessaire si pgEnum construit depuis shared.
- `ingredients.category` Drizzle column sans `.$type<>()` — retiré après avoir
  cassé les spreads dans les seeds. Laissé sans cast, sécurisé par tests seed
  + CHECK constraint (`0057_ingredients_type_category_check`).
- `product.category`, `product.kind`, `product.unit` : pas de check constraint
  DB (typage TS + validation Zod suffisent en pratique, shared/dist sans JS
  rend la migration coûteuse — décision : accepter). Pas d'index sur
  `products.category` — filtrages par catégorie sur grande table feront un
  seq scan.
- Pas de doc frontend pour les composants `Filter/` (FilterDrawer,
  FilterAccordion, SearchSelect, ActiveFiltersBar) ni pour les hooks
  `useListFilters` / `useTagFilterGroups`. `STATE.md` §5.5 liste les clés de
  filtre par page mais n'explique pas les props/variants. `docs/frontend/CSS_GUIDE.md`
  référencé dans `CLAUDE.md` n'existe pas. Décision : laisser tant que le code
  reste auto-explicatif, ajouter une page dédiée si un 3ᵉ consommateur de
  FilterDrawer apparaît.
