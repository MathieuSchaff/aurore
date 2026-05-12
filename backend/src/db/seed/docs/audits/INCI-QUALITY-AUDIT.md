# INCI quality — audit complet du corpus seed

> Audit conduit 2026-05-11. Complète [`INCI-ALPHABETICAL-AUDIT.md`](./INCI-ALPHABETICAL-AUDIT.md) qui couvre la dérive d'ordre Skinsafe. Script source : [`backend/src/db/seed/inci/audit-quality.ts`](../../../scripts/audit-inci-quality.ts).
>
> **Objectif** : identifier *tout* ce qui empêche les détecteurs auto-tags / le score dermo de fonctionner sur un INCI, avant d'élargir le périmètre auto-tags.

---

## TL;DR

Sur 4 075 produits avec INCI :

| Famille de problème | Produits | Gravité | Effort |
|---|---|---|---|
| Préambule `"Ingrédients :"` mal strippé | 168 | Faible (1 token pourri / liste) | XS |
| INCI sans virgules (single-token) | 216 | **Critique** (toute la liste invalidée) | M (re-split lookahead-based) |
| Marketing prose dans le champ INCI | ~50-80 | **Critique** (paragraphe entier collé) | M (re-scrape ou clean manuel) |
| INCI très court / non-INCI | 39 | Mineur (vrais produits dégradés) | S (flag isMinimalINCI) |
| Parser FR — gaps connus | ~30-40 ingrédients × 50-200 occ | Moyen | S (3 suffixes à ajouter) |
| Evidence DB — gaps communs | 4 tokens × 320 + 260 + 73 + 71 = 724 occ | Élevé | M (ajouts manuels evidence) |
| Alphabetical Skinsafe | 368 | Moyen (mitigé) | Voir audit dédié |

**Recommandation d'ordre d'attaque** :

1. **Préambule strip** (XS, fix bug seed) — gain immédiat 168 produits, 1 token pourri en moins par liste.
2. **Parser FR gaps** (S, fix algo-derm 3 patterns) — gain ~300 occurrences, calque iter 3.
3. **Single-token re-split** (M, seed runner) — gain 216 produits, dont plusieurs gros sellers pharma FR (A-Derma Exomega, ACM Boréade, etc.).
4. **Evidence DB ajouts** (M, algo-derm data curation) — top 10 unmatched non-FR ouvre ~3-5 pts de match-rate.
5. **Marketing prose** (M, par marque, re-scrape ciblé) — korean-skincare.fr, ~50-80 produits avec paragraphes collés.

---

## 1. Pathologies structurelles

### 1.1 Préambule `"Ingrédients :"` (168 produits)

L'INCI commence par `Ingrédients :` / `Ingredients :` / `Composition :` que le scraper n'a pas strippé. Le token apparaît collé au premier ingrédient :

```
Ducray Keracnyl :
  Ingrédients : Water (aqua),alcohol,hamamelis virginiana (witch hazel) leaf water
```

Conséquence : le premier token `ingredients water` ou `ingrédients : water (aqua)` ne matche pas l'alias index (76 occurrences `ingredients water` dans le top-unmatched non-FR). Cascade : index position 1 pollué → tous les caps position-based décalés.

**Sources principales** : Bioderma, Avène, Ducray, A-derma, ISDIN — l'ensemble du pipeline pharma FR. Commit `55df5932` (`strip INCI preamble`) a probablement été ajouté mais pas rétroactivement appliqué aux seeds déjà committées.

**Fix** : ajouter une passe de normalisation au seed time qui strippe `^(ingrédients?|ingredients?|composition|inci)\s*[:\-]\s*` (insensitive). Soit appliquer le strip lors du `seed-core` (un-shot, idempotent), soit dans les utils de chargement avant d'écrire en DB.

**Liste exhaustive** : générée par `backend/src/db/seed/inci/audit-quality.ts` section 1, regex `PREAMBLE_RX`.

### 1.2 INCI sans virgules — single-token (216 produits)

Le scraper a perdu les virgules. L'INCI complet tient sur 1 ligne avec les ingrédients séparés par des espaces seulement. `splitINCI()` ne split que sur `,` / `;` → tout collé en un mega-token.

Exemples :

```
A-Derma Exomega Control Baume :
  "WATER (AQUA) CAPRYLIC CAPRIC TRIGLYCERIDE GLYCERIN CETEARYL ALCOHOL NIACINAMIDE
   10 HYDROXYDECENOIC ACID AVENA SATIVA (OAT) LEAF STEM EXTRACT ..."

ACM Boréade Sérum :
  "AQUA WATER LACTIC ACID PROPANEDIOL GLYCERIN CAPRYLIC CAPRIC TRIGLYCERIDE
   ORYZA SATIVA RICE STARCH CETEARYL ALCOHOL BUTYL AVOCADATE DICAPRYLYL CARBONATE ..."
```

Le contenu **est** un INCI valide — juste mal scrappé. Récupérable.

**Sources** : pharma FR (A-Derma, ACM, Ducray sur certains produits), aussi quelques pots K-beauty.

**Fix possible — re-split lookahead-based** :
- Construire un dictionnaire de tokens INCI canoniques connus (~626 evidence entries + ~2-3000 alias).
- Parcourir l'INCI single-token, glouton longest-match : à chaque position, chercher le plus long INCI canonique qui match → insérer une virgule après.
- Couverture évaluée : sur l'A-Derma, ~80-90% des tokens devraient être identifiés. Le reste (multi-word non-canoniques type "10 HYDROXYDECENOIC ACID") nécessite un fallback heuristique (séparer aux frontières maj/min, ou laisser collé pour curation manuelle).

Option fast-path : seul faire le re-split pour les 30-50 produits pharma FR à forte valeur d'usage (Bioderma/Avène/A-Derma cleansers + crèmes barrière). Le reste reste cassé mais l'impact détecteur est ciblé.

### 1.3 INCI très court / non-INCI (39 produits)

```
Lanolin, Ceramide NP
Microfibre.
Nitrizinc Complex.
Fibres de Tynex, plastique
Pour la liste des ingrédients et des allergènes se référer à l'image produit.
```

Mix de :
- Vrais produits avec INCI minimaliste (sticks à lèvres pharma, ampoules verrucides).
- Objets non-cosmétiques (brossettes Crinex PHB, lingettes Klorane).
- INCI manquant remplacé par un message ("se référer à l'image produit").

**Action** : aucun fix automatique pertinent. À envisager :
- Champ `inci_quality` enum (`full | minimal | absent | non-cosmetic`) sur products pour que les détecteurs skip les non-`full`.
- Ou simplement laisser, les détecteurs n'émettront pas de tag → comportement attendu.

---

## 2. Marketing prose contamination

Plusieurs produits ont leur champ INCI rempli avec **la description marketing complète**, suivie en queue par les ingrédients réels. Le scraper a confondu deux blocs HTML.

### Top 10 (ratio match < 25 %, prose marketing évidente)

| Slug | Match | Source probable |
|---|---|---|
| cosrx-acne-pimple-master-patches | 0 % | korean-skincare.fr |
| medicube-age-r-booster-pro-mini | 0 % | korean-skincare.fr |
| mixsoon-vegan-melting-lip-balm | 5.6 % | korean-skincare.fr |
| isntree-mugwort-calming-powder-wash | 9.1 % | korean-skincare.fr |
| abib-airy-sunstick-smoothing-bar | 16.2 % | korean-skincare.fr |
| numbuzin-no-3-radiance-glowing-jumbo-essence-pad | 17.5 % | korean-skincare.fr |
| fig-cleansing-balm (I'm From) | 19.4 % | korean-skincare.fr |
| avene-xeracalm-nutrition-lait-hydratant | 20.0 % | retailer pharma FR |
| dear-klairs-gentle-black-fresh-cleansing-oil | 20.0 % | korean-skincare.fr |
| haruharu-wonder-black-rice-facial-oil | 21.1 % | korean-skincare.fr |

Pattern type :

```
"Sa formule contient des extraits botaniques. Ce baume, disponible en Clear
 et Dry Rose, se targue d'une formule 100% vegan et est cruelty-free. Enrichi
 en beurre d'Illipe nourrissant et en beurre de karité, il exfolie délicatement
 les cellules mortes ... Conseils d'utilisation : Applique une quantité ...
 Ingrédients : 01. Clear : Polyglycéryl-2 Triisostéarate, Dibenzoate de
 propylène glycol, ..."
```

**Fix possible** :
- **Détecteur** : un INCI qui contient `Conseils d'utilisation` / `Recommandé pour` / `Applique` / `Découvre` est marketing-contaminé. Le vrai INCI commence après le dernier `Ingrédients :` / `Ingredients :` (apparaît parfois en double).
- **Strip rétroactif** : au seed time, si pattern détecté, garder uniquement la sous-chaîne après le dernier match du préambule.
- **Re-scrape** : alternative, refetch ces produits depuis une source propre (INCIDecoder, sites marques).

Recommandation : strip rétroactif d'abord (gain XS-S sur ~50-80 produits korean-skincare.fr), re-scrape ciblé après si la qualité résiduelle reste insuffisante.

### Marques affectées (skincare, ratio < 50 %)

| Marque | Produits | Match | Hypothèse |
|---|---|---|---|
| Numbuzin | 21 | 41.4 % | korean-skincare.fr scrape |
| Holika Holika | 7 | 44.2 % | idem |
| LANEIGE | 17 | 45.6 % | idem |
| MIXSOON | 49 | 46.6 % | idem |
| Dr.Jart+ | 16 | 47.0 % | idem |
| I'm From | 32 | 47.1 % | idem |
| Dr. Ceuracle | 64 | 47.3 % | idem (+ alphabetical Skinsafe) |
| AXIS-Y | 21 | 47.7 % | idem |
| ETUDE | 27 | 49.0 % | idem |
| Dear Klairs | 32 | 49.2 % | idem |
| ISNTREE | 40 | 49.6 % | idem (+ alphabetical Skinsafe) |

Cluster K-beauty FR-scrape. Le bas du tableau (Numbuzin 41 %) est dominé par la prose marketing, pas par des parser gaps.

---

## 3. Parser FR — gaps identifiés

Le bench `benchmark-fr-parser.ts` rapporte 51 % match-rate sur FR skincare. Les 49 % restants se répartissent entre evidence DB gaps (cf. §4), parser gaps (cette section), et prose marketing (cf. §2).

### Top tokens FR non-matchés (parser gaps)

Sur les unmatched FR, les patterns systématiques :

| Token brut | Occ | Cause | Fix algo-derm |
|---|---|---|---|
| `acetate de tocopheryl` | 65 | `acetate` absent de `CHEM_SUFFIXES` → pas inversé en `tocopheryl acetate` | Ajouter `acetate` à `CHEM_SUFFIXES` |
| `ethylhexanoate de cetyl` | 52 | `ethylhexanoate` absent | Ajouter `ethylhexanoate` |
| `glycyrrhizate dipotassic` | 67 | `dipotassique` → `dipotassic` (passé par `-ique → -ic`) mais reste en queue, pas inversé en cation devant | Pattern trailing cation FR : `(\w+ate) (dipotassic|trisodium|disodium|magnesium)` → swap |
| `glycyrrhizate de dipotassium` | 50 | Variante FR : `glycyrrhizate de dipotassium` → devrait inverser via CHEM_SUFFIXES si `glycyrrhizate` ajouté | Ajouter `glycyrrhizate` à CHEM_SUFFIXES |
| `polyacrylate de sodium` | 47 | `polyacrylate` absent | Ajouter `polyacrylate` |
| `sodium hyaluronate reticule` | 46 | `réticulé` → `reticule` — pas mappé vers `crosspolymer` ou non couvert dans evidence | Réfléchir : `hyaluronate de sodium réticulé` est un INCI marketing FR commun ; mapper `réticulé → crosspolymer` |
| `gomme de cellulose` | 48 | `gomme de X → X gum` non implémenté | Étendre `applyFrHeadPatterns` avec `gomme` head |

**Effort estimé** : 1-2 heures côté algo-derm. Calque de l'iter 2 (CHEM_SUFFIXES expansion) + ajout d'un pattern trailing cation. Gain attendu : +200-300 occurrences matchées (≈ +0.5-1 pt match-rate FR skincare).

### Tokens FR à la frontière parser ↔ evidence

Certains tokens unmatched sont **bien parsés** mais absents de l'evidence DB :

| Token (normalisé) | Occ FR | Présent evidence ? |
|---|---|---|
| `curcuma longa root extract` | 65 | Non |
| `portulaca oleracea extract` | 62 | Non |
| `macadamia ternifolia seed oil` | 60 | Non |
| `ocimum sanctum leaf extract` | 57 | Non |
| `ulmus davidiana root extract` | 49 | Non |

Ces extraits botaniques sont normalisés correctement mais le dataset `ingredient_evidence.merged.json` (626 entrées) ne les couvre pas → cf. §4.

---

## 4. Evidence DB — gaps communs (non-FR + FR-après-parse)

Le **plus gros gain potentiel** sur le match-rate global est l'ajout de quelques ingrédients très communs absents du dataset evidence algo-derm.

### Top 10 unmatched non-FR (alias index miss)

| Token | Occ | Type | Recommandation |
|---|---|---|---|
| `propylene glycol` | 320 | Humectant ubiquitaire | **Ajout prio 1** evidence + alias |
| `dipropylene glycol` | 260 | Solvant courant | Ajout prio 1 |
| `avene thermal spring water` | 88 | Marketing INCI Avène | Alias → `aqua` |
| `dibutyl adipate` | 77 | Emollient | Ajout prio 2 |
| `ingredients water` | 76 | Artefact préambule non strippé | Fix §1.1 |
| `iron oxides` | 73 | Pigment (CI 77491/77492/77499) | Alias → mapper sur `iron oxide` ou ajouter |
| `cyclohexasiloxane` | 71 | Silicone D6 | Ajout prio 1 (très commun) |
| `carthamus tinctorius seed oil` | 64 | Huile carthame | Ajout prio 2 |
| `aroma` | 63 | Parfum alimentaire | Alias → `fragrance` |
| `centella asiatica leaf extract` | 58 | Actif K-beauty signature | **Ajout prio 1** |

Effort : `propylene glycol` + `dipropylene glycol` + `cyclohexasiloxane` + `centella asiatica leaf extract` couvrent à eux 4 **709 occurrences** (≈ 1 % du corpus). À curer manuellement dans `algo-derm/data/ingredient_evidence.merged.json` ou via le pipeline de build evidence.

### Alias FR vers Latin canonique

Quelques tokens FR sont déjà normalisés correctement par le parser mais leur forme canonique manque comme alias :

| Token normalisé | Occ FR | Forme canonique |
|---|---|---|
| `alcool` | 59 | `alcohol` |
| `dioxyde de titane` | 58 | `titanium dioxide` |
| `ceramide` | 57 | `ceramide np` (ou famille) |
| `glutathion` | 47 | `glutathione` |

→ Ces 4 ajouts à `common_name_aliases.json` couvrent ~220 occurrences. XS effort.

---

## 5. Alphabetical drift (rappel)

Voir [`INCI-ALPHABETICAL-AUDIT.md`](./INCI-ALPHABETICAL-AUDIT.md) — 368 produits Skinsafe en ordre alphabétique. Distinct des problèmes ci-dessus : ces produits ont un INCI **propre et complet**, c'est juste l'ordre concentration qui est cassé. Mitigation actuelle (position-cap relax) → macro F1 0.997 sur gold-set.

Pas d'action additionnelle nécessaire en l'état.

---

## 6. Ordre d'attaque recommandé

### Phases 1-3 — résumé (fait 2026-05-11)

> **Source de vérité** : la normalisation INCI (regex préambule, suffixes chimiques, aliases FR→Latin, splitINCI) vit dans `algo-derm`. Aurore importe via `import { splitINCI, stripPreamble, lookupIngredient } from 'algo-derm'`. Modifs parser/aliases/evidence se font dans `~/Mathieu/projets/algo-derm` (branche `feat/simplex-solver`), puis `just vendor-algo-derm && just reinstall-backend` côté Aurore. `splitINCI` reste single-responsibility (split pur) — composer `splitINCI(stripPreamble(inci))` explicitement (auto-strip régresse gold-set F1 0.997→0.985).

| Phase | Livrable | Bench cumulé FR sk / FR other / non-FR | Détail |
|-------|----------|-----------------------------------------|--------|
| 1 | Strip préambule rétroactif (168 prods) + 3 aliases FR canoniques (`alcool`, `dioxyde de titane`, `glutathion`) + parser FR suffixes/trailing-cation/`alcool X-ique` | **53.9 %** / – / – | Snapshot `_archive/inci-audit-2026-05-11-after-phase1-3.txt` |
| 2 | Fix bug audit `stripBotanicalParts` + 32 entries CSV (660→678) + 18 aliases + parser FR rd 2 (`RE_TRAILING_FR_ADJ`, `RE_ACIDE_TRAILING_ADJ`, `RE_GLYCOL_INVERT`, etc.) | **67.0 %** / **68.9 %** / **74.8 %** | Snapshot `_archive/inci-audit-2026-05-11-after-phase2.txt` |
| 3 | Single-token re-split (150 prods, bucket 216→66, +3000 ings matchés absolus) + prose-prefix strip (`cleanup-inci-prose.ts`, 386 prods) + evidence tail + parser `RE_TRIPLE_HEAD` (25 entries, 678→703) | **73.1 %** / **71.1 %** / **76.3 %** | Snapshot [`audits/inci-audit-2026-05-11-after-phase3-full.txt`](./audits/inci-audit-2026-05-11-after-phase3-full.txt) (baseline Phase 4) |

Gold-set macro F1 **0.997** stable sur toute la séquence.

### Phase 4 — log compact (items D→Mc, 2026-05-11)

Détail verbose archivé : [`audits/_archive/phase4-log.md`](./audits/_archive/phase4-log.md). Snapshots intermédiaires : `audits/_archive/inci-audit-2026-05-11-after-phase4-*.txt`. Source des décisions = commits git.

Bench cumulé Phase 4 (vs 73.1/71.1/76.3 post-Phase 3) : **FR skincare 77.4 %** (+4.3), **FR other 74.5 %** (+3.4), **non-FR 79.5 %** (+3.2). Gold-set macro F1 **0.997** stable. 782 evidence entries (vs 703). Tests algo-derm **193 pass** sur toute la phase.

| # | Item | Cible | Δ FR sk / FR other / non-FR |
|---|------|-------|------------------------------|
| 13 | **D** parser + evidence | 6 suffixes CHEM + `acetylé de`/`microcristalline`/`tripeptide de cuivre` + 16 entries (703→719) | +1.7 / +0.5 / +0.6 |
| 14 | **B** separators | `cleanup-inci-separators.ts` UPDATE 274 prods (pipe/middle-dot/period/underscore/glued-chem/prefix/tail). no-comma 136→64. +811 ings matchés absolus | = / +0.2 / −0.2 |
| 15 | **A** K-beauty ferments | parser `applyCompositeFerment` (15 organismes, drop substrat) + 6 entries + 14 aliases (719→725). Numbuzin 58→61 % | +0.3 / +0.3 / +0.4 |
| 16 | **C** INCIDecoder scrape | `scrape-incidecoder-targeted.ts` 62 UPDATE sur 10 brands weak. cosrx/medicube/missha/skin1004/mixsoon/BoJ +1-3 pts | +0.6 / +0.2 / = |
| 17 | **E** CI composite + methylglucose + botaniques | parser `ci NNNNN/NOM` slash-drop + `RE_CHEM_*METHYLGLUCOSE_DE` + 15 botaniques tail (725→740) | +1.1 / +1.0 / +0.4 |
| 18 | **F** evidence non-FR | 5 entries inulin/cyclodextrin/c14-22 alcohols/peg-30 dipoly/peg-120 (740→745). +alias FR `fructane`/`cyclodextrine` | +0.1 / +0.3 / +0.3 |
| 19 | **B'+C'** parser poly() + Tinosorb M | pré-pass `poly\(X\)` → `poly X` (Hydrogenated Poly(C6-14 Olefin)) + alias `methylene bis-benzotriazolyl…nano` (745→746) | = / = / +0.1 |
| 20 | **H** evidence non-FR | 5 entries HP-cyclodextrin/rosa damascena water/hydrog veg glycerides citrate/HSH/PMMA (746→751) | +0.1 / +0.1 / +0.2 |
| 21 | **I** evidence non-FR | 5 entries apricot kernel oil/pentaerythrityl tetraethylhex/polyacrylamide/isodecyl neopentanoate/polyethylene (751→756) | +0.1 / +0.1 / +0.2 |
| 22 | **J** evidence non-FR | 5 entries sodium acrylate AMPS copolymer/avena leaf-stem/laureth-7/zinc coceth sulfate/dimethicone crosspolymer (756→761) | +0.1 / = / +0.3 |
| 23 | **K** evidence non-FR + FR-other | 5 entries sodium phosphate/boron nitride/talc/menthol/paraffin (761→766) | +0.1 / +0.3 / +0.2 |
| 24 | **L** evidence non-FR | 5 entries PEG-200 hydrog glyc palmate/sodium polyacryloyldimethyl taurate (Aristoflex)/caprylhydroxamic/lauroyl lysine/MAS (766→771) | = / +0.1 / +0.2 |
| 25 | **N** evidence non-FR | 5 entries glycyrrhiza inflata/laureth-3/phospholipids/c12-16 alcohols/theobroma grandiflorum (771→776) | = / = / +0.2 |
| 26 | **O** evidence ≥30 occ | 5 entries trihydroxystearin/sodium fluoride/chondrus crispus/peg-6 cap-cap glyc/aluminum starch octenylsuccinate (776→781). **Frontière 30 occ atteinte** | +0.1 / +0.3 / +0.2 |
| 27 | **M.1** cleanup prose | `cleanup-inci-trailing-prose.ts` strip disclaimer L'Oréal-family 30 prods (Redken/LRP/Vichy). Boilerplate hors top-40 | = / = / = |
| 28 | **Mb** alias TiO2 nano | 3 aliases sur entrée existante (1874→1877 keys, 781 entries stable) | = / = / +0.1 |
| 29 | **Mc** Linalyl Acetate | 1 entry SCCS List B fragrance allergen (781→782) | = / = / = |

**Cibles ouvertes (post-Mc)** : voir [`audits/NEXT-SESSION-PROMPT.md`](./audits/NEXT-SESSION-PROMPT.md).

---

## 7. Reproduire l'audit

```bash
# Version condensée (top 8 par catégorie)
docker exec -w /app/backend -e DATABASE_URL='postgres://app:devpassword@app_db:5432/appdb' \
  app_api bun src/db/seed/inci/audit-quality.ts

# Version exhaustive (listes complètes)
docker exec -w /app/backend -e DATABASE_URL='postgres://app:devpassword@app_db:5432/appdb' \
  -e INCI_AUDIT_FULL=1 app_api bun src/db/seed/inci/audit-quality.ts
```

Sections :
1. INCI pathologies (preamble, mojibake, truncated, very-short, single-token, no-comma)
2. Top 40 unmatched tokens (FR + non-FR)
3. Worst-match skincare products (≥10 ings, sorted ratio asc)
4. Brand-level match-rate (≥5 products)

### Annexes — snapshots actifs

- [`audits/inci-audit-2026-05-11-after-phase3-full.txt`](./audits/inci-audit-2026-05-11-after-phase3-full.txt) — baseline Phase 4 (post-Phase 3, 703 entries, 73.1/71.1/76.3)
- [`audits/inci-audit-2026-05-11-after-phase4-Mc.txt`](./audits/inci-audit-2026-05-11-after-phase4-Mc.txt) — état actuel (post-Mc, 782 entries, 77.4/74.5/79.5)

Snapshots intermédiaires (24 dumps Phase 1/2/3 + items A→Mb) archivés dans [`audits/_archive/`](./audits/_archive/) avec le log verbose Phase 4.

---

## 8. Références

- `backend/src/db/seed/inci/audit-quality.ts` — script source
- `backend/src/db/seed/inci/benchmark-fr-parser.ts` — bench complémentaire (legacy vs new parser)
- `backend/src/db/seed/docs/audits/INCI-ALPHABETICAL-AUDIT.md` — audit dérive ordre Skinsafe
- `algo-derm/src/parser.ts` — couche FR→Latin, à étendre §3
- `algo-derm/data/ingredient_evidence.merged.json` — evidence DB, à enrichir §4
- `algo-derm/data/rules/common_name_aliases.json` — aliases, à compléter §4 fin
