# Seed & Taxonomie — Roadmap

> **À propos :** TODO list du seed (produits, INCI, images). La dette auto-tag a son propre fichier : [`../../features/auto-tagging/docs/ROADMAP.md`](../../features/auto-tagging/docs/ROADMAP.md).

Dette et tâches ouvertes. Pour l'architecture actuelle (stable), voir
[`STATE.md`](./STATE.md). Historique des items livrés : `git log`.

Règle : **une étape = une session = un commit propre.** Pas de chaînage.

---

## 0. Ordre d'attaque recommandé (2026-05-12)

| Priorité | Item | Effort | Risque |
|---|---|---|---|
| ✅ | ~~**§0.5 Domain-consistency — 779 violations haircare/skincare**~~ | M | Faible |
| ✅ | ~~**§1 Dédup intra-source produits scrapés**~~ | M | Faible |
| 2 | **Auto-tagging — primary auto + couverture** → `features/auto-tagging/docs/ROADMAP.md` | L | Moyen |
| ✅ | ~~**§2 INCI quality**~~ — plateau atteint (78.5%/75.2%/80.2%). Parser fix M.2 livré. | S | Faible |
| 4 | **§3 Images CDN — gaps résiduels** (dernière prio) | M | Faible |

---

## 0.5 Domain-consistency ✅ LIVRÉ (2026-05-12)

779 violations supprimées. Pipeline auto-tag patché (`write.ts` + `backfill/main.ts`) pour ne plus recréer de violations. `just audit-db` → 0 violation.

---

## 1. Produits

### 1.1 Doublons produits scrapés ✅

> Mis à jour 2026-05-12 après review manuelle complète des 150 paires restantes.

Snapshot 2026-05-12 :

- **Cross-source : 0 paire**. Résolu 2026-04-30.
- **Intra-source : 150 paires détectées** → **0 vrai doublon** après review.
  - 119 paires avec flag (`num-diff`, `color-diff`, `size-mm`, `model-variant`, `tint-diff`) = variantes quantité/couleur/taille/modèle légitimes.
  - 31 paires sans flag = faux positifs INCI (fragrances Klorane gel douche à INCI identique, elmex blancheur vs base, cire visage vs corps, etc.).
  - Règle de décision DEDUP.md appliquée : aucune fusion justifiée.

- [x] Filtrer le rapport intra-source par flags pour isoler les **vrais doublons**.
- [x] Review marque par marque dans l'ordre du tableau « Review Priority » du rapport, après filtrage.
- [x] Pour chaque marque : appliquer les règles de décision de l'ancien `DEDUP.md` (cf archive — sameSize → fusion, sinon variantes à conserver).

---

## 2. INCI quality — suite (algo-derm) — ✅ PLATEAU DÉFINITIF

Bench final : **FR skincare 78.5% / FR other 75.2% / non-FR 80.2%** (2026-05-12).
Plus aucun levier parser à ROI positif.
Contexte complet + commandes : [`audits/NEXT-SESSION-PROMPT.md`](./audits/NEXT-SESSION-PROMPT.md).

- [x] **Worst-match produits — prose marketing (2026-05-12)** : 5 worst-match fixés (medicube=NULL, mary-may=NULL, eucerin-preamble, mixsoon×2 post-Ingrédients). Restant : `power-repair` (terminologie non-standard).
- [x] **Worst-match produits — parse artifacts (2026-05-12)** : `separators.ts` étendu — en-dash (Erborian ranks 13-14) + no-space period (Avène rank 7). 22 produits mis à jour. Restant : Clinique concat tokens (`WATERAQUAEAU`), `ETHYLHEXYL METHOXYCINNAMATE- DIPROPYLENE` (hyphen-space separator).
- [x] **Single-token / no-comma (2026-05-12)** : `resplit-single-token.ts` — 9 produits récupérés (2 trivial ` - `, 7 longest-match). 65→55 single-token, 66→56 no-comma. Restant irréductibles : voir packaging ou re-scrape.
- [x] **Top unmatched FR + non-FR (2026-05-12)** : 30 tokens ajoutés à `curated.generated.json` (FR ≥14 occ : malachite extract, maris sal, copolymere pvm ma, acetyl tetrapeptide-2, potassium chloride, polyquaternium-67, alumine, beheneth-25, sodium acetate, pca de sodium… ; non-FR 29 occ : glyceryl linoleate, hydrolyzed rice protein, dimethyl isosorbide, steareth-20, carrageenan, aspartic acid, palmitoyl tripeptide-38, sodium dna, camelina sativa). Bench : FR skincare 77.5→78.5%, FR other 74.5→75.2%, non-FR 79.6→80.2%. Plateau ROI (tokens restants ≤14 occ ≈ <0.03 pt/token).
- [x] **Parser fix M.2 (2026-05-13)** : `splitINCI` — post-merge bare-digit + token suivant chiffre. Token `1` (29 occ non-FR, = `1,2-hexanediol` scraped avec espace `"1, 2-Hexanediol"`) éliminé. Gain sub-rounding (0.037% sur 77K). Restant non adressé : `1 2 hexanediol` (27 occ, scraper sans tiret) — data quality, pas parser.
- [x] **Top unmatched FR restants (2026-05-12)** : 6 nouvelles entrées + 2 aliases (ectoin/sodium stearoyl glutamate). Gain +0.3/0.2/0.1 pt (FR skincare 78.8% / FR other 75.4% / non-FR 80.3%). Plateau définitif.

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
