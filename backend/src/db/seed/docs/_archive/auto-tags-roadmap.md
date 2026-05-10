# Auto-tagging — calibration history + roadmap (archive 2026-05-11)

> Archive de l'historique de calibration et de la roadmap d'amélioration auto-tagging.
> Référencé depuis [`../AUTO-TAGS.md`](../AUTO-TAGS.md) pour réf grep-able.

---

## Calibration log (chronologique 2026-05-07 → 2026-05-11)


> Document d'explication du système de détection automatique de tags pour les produits skincare/solaire/bodycare.
> Calibration initiale : 2026-05-07, N=3 661 produits.
> Précision pass : 2026-05-07 — position gating actif-class + coverage floor algo-derm + hydroquinone cross-signal.
> Safety pass (R1) : 2026-05-07 — extension `detectGrossesseAvoid` : formaldehyde donors, homosalate sunscreen-only, HE à risque top-8.
> Dedup pass (R2) : 2026-05-07 — `purifiant` désactivé (subset strict de `sebo-regulateur`).
> Calibration pass (R3) : 2026-05-07 — `non-comedogene` resserré (minConf 0.90, coverageMin per-tag 0.60).
> Concern pass (C4) : 2026-05-07 — `reparation-cutanee` activé (panthenol/allantoin/centella/bisabolol top 12).
> Concern pass (C2) : 2026-05-07 — `keratose-pilaire` activé sur body-lotion/oil (urée top 8 OU lactic+ammonium lactate top 10).
> Concern pass (C5) : 2026-05-07 — cross-signal `anti-age` body retinoids (bypass coverage floor).
> Concern pass (C1+C3) : 2026-05-07 — `step-nettoyage-1` (oil/balm cleanser) + `cernes-poches` (eye-cream + caffeine/peptide).
> Cross-signal avoid (X1) : 2026-05-07 — retinoids + AHA/BHA leave-on → `peau-sensible` avoid (stack irritation).
> Tier-1 sweep (T1) : 2026-05-08 — 11 slugs jamais émis activés sans nouvelle taxonomie : `fini-mat`+`matifiant` (silica/kaolin/starch top 8), `texture-riche` (≥ 2 butters/waxes top 8), `texture-legere` (water/glycerin top 3 + 0 heavy top 8 + leave-on), `fini-glowy` (glycerin top 3 + HA top 5 + 0 absorbent top 8), `non-gras`+`absorption-rapide` (serum/eye-cream + silicone top 5 + 0 oil top 5), `pigments-verts` (CI 77288), `vegan` (absence patterns animaux), `peau-normale` (heuristique inverse, post-pass), `moment-crise` (cross-signal spot-treatment + BPO/BHA/azelaic), `hypoallergenique` réactivé (TAG_CONFIG : minConf 0.85 + coverageMin 0.7).
> Audit-driven fixes : 2026-05-08 — recall + mutex (commit `79267410`), seed-core avoid wiring (commit `56b000bf`), audit surfacing regulatoryNotes + interactions (commits `883b8651` / `d2c0e27c` / `50fd08dd`), interaction-driven `peau-sensible` avoid (I1, commit `0c07e9a8`, +51 paires).
> Marketing slug cleanup : 2026-05-09 — kill `fini-glowy` (subjective dewy finish, non-confirmable INCI seul per gold set ligne 1093, 14 paires DB) + merge `absorption-rapide` → `non-gras` (pattern duplicate strict, mêmes triggers silicone top 5 + 0 oil top 5, 60 paires migrées). Migration `0052_drop_marketing_sensation_slugs.sql`. -74 paires DB, slug count sensoriel 6 → 4.
> Gold-set extension : 2026-05-10 — corpus 70 → 97 produits annotés (+27 stratifiés). Macro F1 0.974 → 0.976 après ajout `glycine soja` + `prunus armeniaca` à `VEGETABLE_OIL_PATTERNS` (2 FP `texture-legere` fermés sur dermaceutic-activ-retinol + dr-sams-flawless). Cleanup DB : -249 paires `texture-legere` stale (drift accumulé multi-calibration, DB \ orchestrator). 7 erreurs résiduelles : 5 INCI alphabétiques (limite algorithmique), 1 kind=balm forcé (F6 territory), 1 sur original 70.
> Polyphenols ester + milk thistle (P1) : 2026-05-10 — patterns `ferulate` (esters ethylhexyl/ethyl), `silybum marianum`, `silymarin` ajoutés. Polyphenols R 0.935 → 1.000, macro F1 0.984 → 0.986. +25 paires DB (svr-clairial line, lierac sunissime, avene-cleanance-comedomed, clinique moisture surge, etc.). 0 FP gold-set 124.
> Audit-actif-class corpus-wide (P3) : 2026-05-10 — 100 % agree sur 5115 paires émises. Drift `only_db` : 59/5115 (1.1 %). Top : bha=24, aha=11, pha=7. Catégories : (A) BHA `capryloyl salicylic acid` past cap leave-on (slow-release Mexoryl-style, sub-0.5 % fonctionnel) → split en def séparée `positionCap=Inf`, récupère 4/24, +25 paires DB, 0 FP gold-set ; (B/C) free SA + AHA + PHA leave-on past pos 10 (preservative risk, defer) ; (D) marketing-prose INCI sur 5+ produits (garancia trousse, pyunkang balm, medicube pad, purito, haruharu) — seed cleanup hors scope auto-tags ; (E) accents FR (`tocophérol acétate`, `vitamine-E`) — defer. BHA only_db restant 20, gold-set BHA P=R=1.000.
> F4 texture-stick name-driven : 2026-05-11 — `detectTextureStickFromName` (formula-detection.ts) émet `texture-stick` quand `products.texture` null + kind ∈ {lip-care, balm, moisturizer, spot-treatment, sunscreen} + name match `\b(stick|bâton)\b` + veto duo `+ stick` (préserve SPF50+ / PA++++). Wired in orchestrator passe 4. **+55 paires** (22 lip-care, 19 sunscreen, 10 moisturizer, 4 spot-treatment ; balm=0 car déjà `texture=baume` admin). 11 tests added. Cleanser/mask/exfoliant exclus (cohérence F6 rinse-off). texture-mousse skip : 94 cleansers exclus par F6, reste 2 leave-on foam moisturizers — gain trop faible.
> Gold-set extension 141 (P4) : 2026-05-11 — bootstrap +18 skeletons (124→141, dedup naturel sur 30 candidats), annotation chimique. Pattern fix : `acide tranexamique` ajouté à TYROSINASE_INHIBITORS (FR INCI dr-ceuracle pure VC mellight, +15 paires DB). 7 annotation adjustments documentés (svr-clairial fini-mat past cap, dr-ceuracle/skin1004 ampoules powder/alphabetical sans top 3 aqueux, kits kombucha+garancia + wash-off pyunkang + exfoliant the-ordinary suivent detector intent). Macro F1 0.984→0.989, R 0.974→0.979, P=1.000 sur 15/15 tags. Recall gaps restants pré-existants : ceramides 1 FN (mary-may sleeping mask), texture-legere 3 FN (dexeryl, nooance, pure-vitamin-c), texture-riche 2 FN (mary-may sun stick, shiseido benefiance), pha 1 FN (medicube glow toner past cap).
> Annotation cleanup texture-legere : 2026-05-11 — 2 FN re-classés non-FN sans toucher détecteur. `dexeryl-specific-brulures-et-coups-de-soleil` : INCI montre MINERAL OIL pos 3 + SQUALANE pos 4 + CETEARYL ALCOHOL = formule crème, label `texture-legere` était marketing-driven (after-sun fluide) contredit par INCI. `pure-vitamin-c-serum` : INCI marketing-prose FR non parsable (`Hyaluronate de Sodium liquide, Acide Ascorbique 5%...`), gold-set doit rester INCI-verifiable. Texture-legere R 0.947→0.982 (1 FN restant : nooance silicone-driven serum avec jojoba pos 8, limite connue veg-oil cap=8 — relax non rentable vs P=1.000). Macro F1 0.989→0.990, R 0.979→0.981, P=1.000 préservé.
> Annotation cleanup texture-riche : 2026-05-11 — 2 FN re-classés non-FN. `mary-may-vegan-peptide-bakuchiol-sun-stick` : INCI marketing-prose FR non parsable (jumeau cat D `pure-vitamin-c-serum`), form factor déjà couvert par `texture-stick` (F4 name-driven). `shiseido-benefiance-contour-des-yeux-anti-rides` : INCI alphabétique Korean, positions meaningless — limite algorithmique connue. Fallback (count distinct heavies anywhere ignoring pos) ouvre FP majeurs sur produits 1-2 heavies past pos 8 non riches, non rentable. Texture-riche R 0.846→1.000, F1 0.917→1.000. Macro F1 0.990→0.995, R 0.981→0.991, P=1.000 préservé sur 15/15 tags (13/15 désormais P=R=1.000).
> Annotation cleanup ceramides FN : 2026-05-11 — `mary-may-calendula-peptide-ageless-sleeping-mask` FN ceramides re-classé non-FN sans toucher détecteur. INCI marketing-prose FR : "Céramide" générique pos-27 (untyped, post-functional). Détecteur exige variants typés (NP/AP/NS/NG/AS/EOP/EOS/1/2/3/6) — generic "ceramide" rejeté pour même rationale que `phytosphingosine` documenté ligne 181-183 actif-class-detection.ts (0 recall corpus + 24 FP cica/soothing sur phytosphingosine ; mesuré aujourd'hui +32 FP corpus sur generic céramide untyped, 223 produits pattern-match vs 32 untagged). Ceramides R 0.947→1.000, F1 0.973→1.000. Macro F1 0.996→0.997, R 0.991→0.995, P=1.000 préservé sur 15/15 tags (14/15 désormais P=R=1.000).
> Audit kind-mistag re-run (P5) : 2026-05-11 — `audit-product-kinds` étendu avec 3 nouvelles rules : `body-wash` match étendu (`body wash` avec 0-2 mots intercalés, `baby/kids wash`, `huile/gel/crème lavante`), `wash-off-mask` (Korean `wash off pack/mask` → mask), `cleanser-face` (last-resort `nettoyant/cleansing/cleanser/powder-enzyme-face wash` → cleanser, forbidden body/hair/lip/eye/hand/foot/peeling/sunscreen). 71 mistags corrigés : 38 body-wash (huile/crème lavante FR derma + Korean body wash), 27 cleanser-face (FR `nettoyant` + Korean cleansers mistagged moisturizer), 6 wash-off-pack → mask. 4 gold-set produits affectés : `eucerin-dermopure-nettoyant-correcteur` (spot-treatment→cleanser, note prédisait déjà rinse-off), `patyka-pure-gelee-nettoyante-purifiante` (moisturizer→cleanser), `skinfood-black-sugar-perfect-enzyme-powder-wash` (moisturizer→cleanser, **PHA absent→present** car lactobionic pos-12 dans cap rinse-off=20), `pyunkang-yul-calming-relief-gel-wash-off-pack` (moisturizer→mask, texture-legere present→absent car mask exclu de TEXTURE_LEGERE détection). Macro F1 0.995→0.996, R 0.991→0.991, P=1.000 préservé sur 15/15 tags. +182 paires DB après backfill (138 kind, 17 algo-derm, 13 actif-class, 12 formula, 2 percent-claim). Signal initial (skinfood enzyme powder wash mistagged moisturizer, repéré pendant exploration PHA cap relax) confirmé : kind-drift corpus-wide existe et est mécaniquement détectable par patterns nom.
> PHA cap relax explored & rejected : 2026-05-11 — hypothèse `positionCap=∞` testée pour aligner avec autres trace-dosés (peptides/HA/ceramides/polyphenols/tyrosinase) et fermer FN medicube-age-r-glutathione-glow-toner (gluconolactone pos 11) + 6 corpus only_db. Résultat audit gold-set : PHA R 0.938→1.000 mais **1 FP** sur `skinfood-black-sugar-perfect-enzyme-powder-wash` (lactobionic pos 12, kind=moisturizer mistag pour enzyme powder cleanser). Macro P 1.000→0.996. Rejet : (a) PHA est **dose-dépendant** comme AHA/BHA (pH + concentration → effet), pas trace-actif comme peptides/ceramides ; cap=10 leave-on est le rationale correct pour PHA. (b) Tag sémantique = "exfoliant PHA functional", pas "PHA chemistry-present". (c) Cap=∞ corpus-wide ouvrirait ~72 FP DB (185 produits pattern-match vs 113 actuellement tagged) = bruit décisionnel pour user Aurore (TDAH-friendly = clarté, anti-friction). Decision : conserver `positionCap=10` / `positionCapRinseOff=20` PHA. medicube FN reste documenté comme limite known (sub-functional borderline). Caps intermédiaires (15, 20) capteraient skinfood pos 12 = même FP, sans bénéfice net.

---


---

## Roadmap & tier audit (snapshot 2026-05-11)

## Chiffres & calibration history

Détail dry-run + passes calibration 2026-05-07/08 (R1/R2/R3, C1-C6, X1, T1, T1.11, S1-S4, cluster recalibrations vit-E / HA / peptides / polyphenols / enzymes / retinoids / vit-C / ceramides / tyrosinase + AHA/BHA/PHA + gold set scaffolding) : [`_archive/auto-tags-calibration.md`](_archive/auto-tags-calibration.md).

État DB à jour : voir `## Roadmap d'amélioration` ci-dessous (status par item).

---


## Roadmap d'amélioration

État au 2026-05-08. Items triés par priorité (impact × pertinence). Effort indicatif sur barème **XS** (< 30 min) → **S** (1 h) → **M** (½ journée) → **L** (jour+).

### Récap reprise de session (✅ Done — détail archivé)

**Status global** : 27+ items livrés (R1-R4 + C1-C6 + S1-S5 + X1-X3 + T1-T5 + I1 + D.3 hoist + O1-O3 tooling + gold-set calibration). Tous Tier 1 + Tier 2 + migrations taxonomiques + cluster recalibrations vit-E/HA/peptides/polyphenols/enzymes/retinoids/vit-C/ceramides/tyrosinase + AHA/BHA/PHA cleanup. Marketing cleanup : `fini-glowy` killed + `absorption-rapide` → `non-gras` merge (migration `0052`). Round 2 taxo audit : `keratolytique` + `effet-protecteur` killed product-side (migration `0053`, −688 paires).

**Gold set** : 70 produits annotés, macro F1 = 0.994 (P=1.000, R=0.989).

**Détail par item (commits, diff, tests, paires backfill)** : [`_archive/auto-tags-session-log.md`](_archive/auto-tags-session-log.md).

**Statut commit** : sweep absorbé par `16b8ec60` + suite de commits 2026-05-08/09 (voir archive).


### 🔬 Follow-ups émergés post-roadmap (2026-05-09)

Items détectés après clôture du backlog R/C/S/X/T/O. Non-bloquants, à planifier au fil de l'eau quand le signal le justifie.

| # | Item | Effort | Origine |
|---|------|--------|---------|
| ~~F1~~ | ~~Calibration recall actif-class clusters~~ ✅ **Vérifié closed 2026-05-09** — audit-actif-class re-run montre tous clusters à 100% agree. Calibration vit-E (2026-05-08, +1567 paires) + HA (+1198) + peptides (+284) + polyphenols (+518) + enzymes-exfoliants (+41) + tyrosinase (+73) toutes appliquées et write effectué (DB: vit-E 1860, HA 1408, polyphenols 675, ceramides 440, peptides 429, vit-C 418). Drift résiduelle = noise annotation (vit-E 2, polyphenols 1) ou par-design (AHA/BHA/PHA positionCap:10 — overrides cleanés ligne 1092). Pas d'investigation à reconduire. | — | Closed |
| ~~F2~~ | ~~**Extension `texture-creme` au-delà de `hand-cream`**~~ ✅ Done 2026-05-09 (migration `0054`) — Path 2 (default-creme par kind + vétos INCI) retenu. `detectTextureCremeInci` réécrit : default pour `moisturizer` + `foot-cream`, 6 vétos (surfactant ionique, ≥2 butter/wax, huile pos 1, pas d'eau top 5, gel-former sans phase huileuse, serum pur). Fix bug slash-normalisation (`caprylic/capric` → `caprylic capric`). Eye-cream hors scope (trop hétérogène — ticket séparé). **+682 paires** (676 moisturizer + 6 foot-cream) · **−368 stale** (sunscreen 402 + body-lotion 23 + autres 17 + eye-cream 2 − new 76). DB finale : 701 pairs (vs 1069 legacy). | S | Done |
| ~~F3~~ | ~~**Audit taxonomie round 2**~~ ✅ Done 2026-05-09 (migration `0053`) — 5 candidats challengés : `apaisant` KEEP (soothing benefit axis algo-derm distinct, 33-39 % overlap avec barriere/reparation = stack thérapeutique normal), `prebiotique` KEEP (14 patterns INCI factuels, pas marketing-flavored), `non-gras` KEEP (status quo session précédente, 60 paires conservatif), `keratolytique` KILL product-side (subset AHA+BHA+RETINOIDS+urea, 53 % overlap strict avec actif_class clusters ; ingredient-side `keratolytique` préservé pour chemistry classification). `effet-protecteur` MERGE-KILL product-side (Trigger B délègue déjà à detectTextureRiche, 74 % co-fire ; Trigger A lanolin = ~24 niche balms tombent à kind tags, acceptable ; ingredient-side `effet-protecteur` préservé). **−688 paires DB** (595 + 93). Slugs sensoriel/skin_effect product-side passent de 4+12 → 4+10. | S | Done |
| ~~F4~~ | ~~**`texture-mousse` / `texture-stick`** — non-derivable INCI seul~~ ✅ Partial 2026-05-11 — `detectTextureStickFromName` (name-based, leave-on kinds : lip-care/balm/moisturizer/spot-treatment/sunscreen, veto duo `+ stick`). +55 paires DB. **texture-mousse skip** : F6 a exclu cleanser/body-wash du texture (rinse-off cohérence) → reste 2 leave-on foam moisturizers, gain trop faible. Admin curation reste fallback pour les rares cas. | S | Done (stick) / Skip (mousse) |
| F5 | **Brier/ECE pipeline** — gold set §"Note Brier/ECE" (ligne 994) — pipeline en place mais 16 tags focus actuels = déterministes (passes 2-6 orchestrator), Brier dégénère en taux mauvais classement, ECE single-bin. À revisiter quand scope gold set s'étend à algo-derm passe 1 (concerns/skin types/absence) qui portent une `confidence` calibrable. **Defer** sauf si on calibre passe 1. | XS | Gold set scope expansion |
| ~~F6~~ | ~~**Cleanup drift `texture-eau/huile/baume/lait/gel`**~~ ✅ Done 2026-05-10 (migration `0055`). Décisions Q1-Q6 (cf. `_archive/auto-tags-texture-postmortem.md` §10.5) : cleanser/body-wash exclus du texture (cohérence rinse-off), `detectTextureBaumeFromName` étendu à moisturizer (+pattern `ointment`, +veto `lavant\|douche\|lèvres\|levers\|lip\|rasage`), 5 admin field updates pour cas single-product (Q4 lait + Q5 eau exfoliants), gel full-detector-driven. Pattern unifié 0054 : DELETE non-déterministe, backfill recrée. **Net −123 paires legacy, +52 correctes.** DB finale : creme 725, eau 228, baume 94, lait 95, gel 100, huile 27. | M | Done |

### Ordre d'exécution recommandé

Logique : tooling d'abord pour mesurer le reste · sensoriel ensuite (heuristiques imprécises = besoin gold set) · cross-signal en parallèle · migrations taxo en dernier (coûteuses, débloquent juste 2 items).

#### Phase 1 — Tooling foundation (avant toute calibration)

| Ordre | Item | Effort | Pourquoi |
|------:|------|--------|----------|
| 1 | **O1** CSV diff backfill | S | Sortir `audit-diff.csv` (paires ajout/suppr entre runs). Indispensable pour mesurer l'impact des prochaines règles. |
| 2 | **O2** Gold set 50-100 produits annotés | M | Sans gold set, S1-S4 sont aveugles. Active mesure precision/recall par tag. |

#### Phase 2 — Sensoriel (mesurable via O2)

> ✅ **Phase 2 done** — S1/S2/S3/S4 livrés en bloc via T1 sweep (2026-05-08, voir ligne 14 + distribution ligne 635). Détecteurs `detectFiniMat`, `detectTextureRiche`, `detectTextureLegere`, `detectFiniGlowy`, `detectNonGrasAbsorption` câblés en passe 4 (`auto-tag-orchestrator.ts:181-186`). S5 done 2026-05-09 séparément.

| Ordre | Item | Effort | Pourquoi |
|------:|------|--------|----------|
| ~~3~~ | ~~**S4** fini-mat~~ ✅ Done 2026-05-08 (T1 sweep) — `detectFiniMat` (silica/kaolin/starch/corn-starch top 8). 370 paires post-cleanup. | M | Done |
| ~~4~~ | ~~**S1** texture-riche~~ ✅ Done 2026-05-08 (T1 sweep) — `detectTextureRiche` (≥ 2 butters/waxes top 8) + `detectTextureLegere` inverse. 61 / 1781 paires. | M | Done |
| ~~5~~ | ~~**S3** fini-glowy~~ 🪦 **Killed 2026-05-09** — slug supprimé (marketing/dewy = non-confirmable INCI seul, gold set verdict). Migration `0052`. | M | Killed |
| ~~6~~ | ~~**S2** non-gras + absorption-rapide~~ ✅ Done 2026-05-08 puis **merged 2026-05-09** — `detectNonGras` (renommé) émet `non-gras` only. `absorption-rapide` slug supprimé (pattern duplicate strict). Migration `0052`. | M | Done (merged) |

#### Phase 3 — Cross-signal

| Ordre | Item | Effort | Pourquoi |
|------:|------|--------|----------|
| ~~7~~ | ~~**X3** ProductInteraction[] mapping~~ ✅ Done 2026-05-09 | M | Voir bloc 🔵 Cross-signal X3. |
| ~~8~~ | ~~**X2** SPF + vit C → moment-matin~~ ✅ Done 2026-05-09 | XS | Filler rapide, low-impact, opportuniste. |

#### Phase 4 — Tooling polish

| Ordre | Item | Effort | Pourquoi |
|------:|------|--------|----------|
| 9 | **O3** audit actif-class dédié | S | Étend `audit-auto-tags` à la passe 2. |

#### Phase 5 — Migrations taxonomiques (impact UI, scope élargi)

| Ordre | Item | Effort | Pourquoi |
|------:|------|--------|----------|
| ~~10~~ | ~~**T5** PROTECTION_CUTANEE rename~~ ✅ Done 2026-05-09 — `protection-cutanee` → `effet-protecteur` (skin_effect) côté product + ingredient. Migration `2026-05-09_protection-rename-and-non-irritant.sql`. Snapshot régénéré. |
| ~~11~~ | ~~**T2** non-irritant slug~~ ✅ Done 2026-05-09 — slug `non-irritant` ajouté (`product_characteristic` / tolerance), TAG_CONFIG mappe `algo-derm.non_irritant` (minConf 0.85, coverageMin 0.7). 218 paires émises au backfill. 3 tests added. |
| 12 | **T1** sans-X label family | M | Débloque sans-sulfates / sans-silicones / sans-HE / sans-huiles-minérales / sans-allergènes-parfumants. |
| 13 | **T3** `products.texture` field | L | Schéma + UI. Nécessaire pour S5. |
| ~~14~~ | ~~**T4** brand-level vegan/cruelty/natural~~ ✅ Done 2026-05-09 (phases A+B+C+D+E) — voir entrée 🔒 T4 ci-dessous. Leaping Bunny scraper optionnel non livré (couverture marginale vs PETA). |

#### Phase 6 — Débloqués par Phase 5

| Ordre | Item | Effort | Débloqué par |
|------:|------|--------|--------------|
| 15 | **R4** semi-occlusif (squalane/dimethicone/isohexadecane cap 5) | M | T1 (slug) |
| ~~16~~ | ~~**S5** texture-gel / mousse / stick~~ ✅ Done 2026-05-09 — voir bloc 🟡 S5. | M | T3 (champ texture) |

#### Trajectoire rapide (si peu de temps)

`O1 → O2 → S4` — diff outillé, gold set en place, premier sensoriel net.

### 🔴 Précision / sécurité — actionnable sans nouvelle taxonomie

| # | Item | Effort | Pourquoi |
|---|------|--------|---------|
| ~~R1~~ | ~~**Étendre `detectGrossesseAvoid`**~~ ✅ **Done 2026-05-07** : formaldehyde donors (tier 1, no gating), homosalate (tier 2, sunscreen-only), HE risque (peppermint / clary sage / rosemary verbenone CT, top 8 INCI, genus + 'oil' co-occurrence). +62 paires `grossesse-avoid` (137 → 199). | M | Couverture grossesse encore limitée à tier-1 + 2 tier-2. Safety > recall. |
| ~~R2~~ | ~~**Dédup `purifiant` / `pores-sebum` / `sebo-regulateur`**~~ ✅ **Done 2026-05-07** : `purifiant` flippé `allow=false`. Trigger algo-derm = `[salicylic, azelaic, zinc pca]` = subset strict de `sebo-regulateur` (`[niacinamide, salicylic, azelaic, zinc pca]` OR seborrheicRegulation benefit). Tout produit `purifiant` ⊆ `sebo-regulateur`. Pair concern (`pores-sebum`) + effet (`sebo-regulateur`) gardée. | S | Bruit DB, redondance UI. |
| ~~R3~~ | ~~**Calibration anti-FP `non-comedogene`**~~ ✅ **Done 2026-05-07** : minConf 0.85 → 0.90 + nouveau champ `coverageMin` per-tag (0.60). Override global `coverageMinOverride` continue de bypass tous les floors (debug). | XS | Tag actuellement émis sur 60 %+ corpus = peu informatif. |
| ~~R4~~ | ~~**Position gating pour `detectOcclusifTags`** déjà en place (cap 8) — ajouter un **deuxième pattern** pour squalane + dimethicone + isohexadecane (semi-occlusifs) avec cap 5 → tag distinct `semi-occlusif` (nouveau slug requis, voir T1).~~ ✅ Done 2026-05-09 — `detectSemiOcclusif` formula-pass. Cap 5, leave-on only, mutex avec `occlusif` (petrolatum top 8 = film-former wins). Patterns explicites `dimethicone`/`dimethiconol` (substring `dimethicone` ne couvre pas `dimethiconol` — ending letter différent). Cyclomethicone exclu (volatile, n'occlut pas). 285 paires backfill, 9 tests. | M | Done |

### 🟠 Couverture concerns — slugs Aurore existants jamais tagués

| # | Item | Effort | Pattern de détection proposé |
|---|------|--------|------------------------------|
| ~~C1~~ | ~~**`step-nettoyage-1`** (premier nettoyage du double-cleanse)~~ ✅ **Done 2026-05-07** : `detectStepNettoyage1` cleanser + huile/ester top 3 + pas de sulfate ionique top 5. | S | `kind=cleanser` ET texture/INCI = oil/balm (présence d'une huile végétale ou ester émollient en pos 1-3, absence de surfactants ioniques en top 5). |
| ~~C2~~ | ~~**`keratose-pilaire`** body~~ ✅ **Done 2026-05-07** : `detectKeratosePilaire` body-lotion/body-oil + urée top 8 OU lactic+ammonium lactate top 10. | S | `kind ∈ body-lotion / body-cream` ET (urée pos ≤ 8 OU lactic acid + ammonium lactate) ET concentration fonctionnelle. |
| ~~C3~~ | ~~**`cernes-poches`**~~ ✅ **Done 2026-05-07** : `detectCernesPoches` eye-cream + caffeine OU peptide top 12. | S | `kind=eye-cream` ET (caféine OR peptides ≤ pos 12). |
| ~~C4~~ | ~~**`reparation-cutanee`** vs **`barriere-cutanee`**~~ ✅ **Done 2026-05-07** : `detectReparationCutanee` ajouté (panthenol / allantoin / centella + asiaticoside / madecassoside / bisabolol, top 12 INCI). `barriere-cutanee` algo-derm intact (ceramides + cholestérol). | S | Séparer : `barriere-cutanee` = ceramides + cholestérol (composition lipidique) ; `reparation-cutanee` = panthenol + allantoin + centella + bisabolol (cicatrisation/inflammation). |
| ~~C5~~ | ~~**`anti-age` body**~~ ✅ **Done 2026-05-07** : cross-signal `RETINOIDS + body leave-on (body-lotion/body-oil/hand-cream/foot-cream)` → `anti-age`. Bypass coverage floor (body INCI souvent < 0.30). | XS | retinoids cluster détecté ET `kind ∈ body-*`. |
| ~~C6~~ | ~~**`moment-crise`**~~ ✅ **Done 2026-05-07** : `cross-signal-detection.ts:104-114` — `kind=spot-treatment` + (BHA actif OU benzoyl peroxide top 5 OU azelaic acid top 5). 9 paires en DB post-T1. | S | `kind=spot-treatment` ET (BHA actif OU benzoyl peroxide OU azelaic acid ≥ 10 %) — flag d'usage ponctuel. |

### 🟡 Sensoriel — heuristiques imprécises, à valider sur spot-check

> ✅ **Bloc done** — S1-S5 tous livrés (S1-S4 via T1 sweep 2026-05-08, S5 via 2026-05-09). Tableau historique conservé pour réf heuristique.

| # | Item | Effort | Heuristique INCI |
|---|------|--------|------------------|
| ~~S1~~ | ~~**`texture-riche`**~~ ✅ Done 2026-05-08 (T1) — `detectTextureRiche`. | M | ≥ 2 butters/waxes (shea, mango, cocoa, beeswax, carnauba) en top 8. |
| ~~S2~~ | ~~**`non-gras`** + ~~`absorption-rapide`~~~~ ✅ Done 2026-05-08 (T1), **merged 2026-05-09** — `detectNonGras` émet `non-gras` only. `absorption-rapide` slug killed (pattern duplicate). | M | `kind ∈ serum/gel-cream` ET dimethicone/cyclomethicone/isohexadecane en top 5 ET 0 huile végétale en top 5. |
| ~~S3~~ | ~~**`fini-glowy`**~~ 🪦 **Killed 2026-05-09** — slug supprimé (marketing dewy non-confirmable INCI seul). Migration `0052`. | M | Glycerin top 3 + HA top 5 + 0 silicone matifiant + 0 starch absorbant. |
| ~~S4~~ | ~~**`fini-mat`**~~ ✅ Done 2026-05-08 (T1) — `detectFiniMat`. 370 paires. | M | Silica / starch / kaolin / corn starch en top 8. |
| ~~S5~~ | ~~**`texture-gel`** / **`texture-mousse`** / **`texture-stick`**~~ ✅ Done 2026-05-09 — `detectTextureFromField` (pure pass-through `products.texture`) + `detectTextureGelInci` (gel-former top 5). mousse/stick attendent admin curation. | M | Pas dérivable d'INCI seul — nécessite enrichissement champ produit (voir T3). |

### 🔵 Cross-signal — combinaisons multi-pass

| # | Item | Effort | Logique |
|---|------|--------|---------|
| ~~X1~~ | ~~**Stack irritation**~~ ✅ **Done 2026-05-07** : `detectCrossSignalAvoidTags` — retinoids + (AHA OU BHA) leave-on → `peau-sensible` relevance=avoid. Réutilise pattern `grossesse-avoid` (avoid > secondary), pas de migration taxo. | M | Précaution dermo classique. |
| ~~X2~~ | ~~**SPF + actif photostable**~~ ✅ Done 2026-05-09 — vit-C cross-signal couvre `kind=sunscreen` en plus de `LEAVE_ON_KINDS`. Tests ajoutés (positive sunscreen, negative cleanser). DB inchangée (kind-tag déjà émet) ; sémantique renforcée. | XS | Done |
| ~~X3~~ | ~~**Surface algo-derm `ProductInteraction[]`** dans le tagging~~ ✅ Done 2026-05-09 — `detectInteractionAvoidTags` étendu (axe `dryness` → `peau-seche` avoid, en plus du mapping `irritation`/`allergenicity` → `peau-sensible` déjà livré). Nouveau `detectInteractionSecondaryTags` (orchestrator passe 5a, source `interaction`) émet `moment-soir` quand axe `photosensitivity` (multi-HE bergaptène, ex. `lavandula + citrus limon peel oil`). Skip `comedogenicity` / `fungalAcne` — gated par profil `acneProne`, pas firable au seed. Leave-on only (rinse-off dilue cumul). Mitigations (`adjustment ≤ 0`) ignorées. Backfill : **+53 paires** (peau-seche avoid + moment-soir secondary), +9 corrections secondary→avoid (peau-seche). 9 tests added (5 axis-mapping + 3 secondary photosensitivity + 1 multi-axis emission via `auto-tag-avoid`). | M | Done |

### 🔒 Bloqué — nécessite migration taxonomique (shared/ + DB)

| # | Item | Effort | Pré-requis |
|---|------|--------|------------|
| ~~T1~~ | ~~**Mapper algo-derm absence tags utiles** : créer slugs Aurore `sans-sulfates`, `sans-silicones`, `sans-huiles-essentielles`, `sans-huiles-minerales`, `sans-allergenes-parfumants`.~~ ✅ Done 2026-05-09 — 5 slugs ajoutés à `SKINCARE_PRODUCT_TAG_SLUGS` (catégorie `product_characteristic`, groupe `tolerance`). 5 entrées TAG_CONFIG (`minConf: 0.7`, mêmes seuils que `sans_parfum`). Migration `2026-05-09_t1-sans-x-family.sql` (3 INSERT + 2 UPDATE — `sans-sulfates`/`sans-silicones` flippés `product_label` → `product_characteristic`, héritage haircare). Backfill : **7102 paires** (sans-sulfates 1596, sans-huiles-minerales 1537, sans-huiles-essentielles 1460, sans-allergenes-parfumants 1376, sans-silicones 1282 ≈ 35-44% du corpus INCI). 6 tests added. Débloque R4 (semi-occlusif). | M | Done |
| ~~T2~~ | ~~**Mapper algo-derm `non_irritant`** → nouveau slug `non-irritant`~~ ✅ Done 2026-05-09 — slug `non-irritant` créé (`product_characteristic` / tolerance), TAG_CONFIG `non_irritant: { auroreSlug: NON_IRRITANT, minConf: 0.85, coverageMin: 0.7, allow: true }`. 218 paires backfill. |
| ~~T3~~ | ~~**Champ `texture` produit** distinct de `kind`~~ ✅ Done 2026-05-09 (phase A) — colonne `products.texture text NULL` (Drizzle migration `0050_dry_landau.sql`). Type `ProductTexture` shared (`gel` / `creme` / `mousse` / `stick` / `huile` / `lait` / `eau` / `baume` / `patch`). Zod create/update + productChangesSchema acceptent texture optional. Backfill kind→texture lossless (`2026-05-09_t3-texture-kind-backfill.sql`) : 462 produits populés (huile 31, baume 61, patch 33, lait 94, creme 19, eau 224). 3738 produits NULL — admin populera les kinds ambigus (moisturizer/cleanser/serum/mask/primer/lip-care/body-wash/body-scrub/sunscreen). **Phase B (UI admin) + S5 detectors gel/mousse/stick remis à plus tard** (decision : laisser admin populer field d'abord, détecter ensuite quand coverage suffisante). | L | Done |
| ~~T4~~ | ~~**Champ brand-level vegan / cruelty-free / natural-certified**~~ ✅ Done 2026-05-09 (phases A+B+C+D+E) — table `brand_certifications` keyed `lower(trim(brand))` (Drizzle migration `0051_clumsy_moonstone.sql`). 35 marques seed manuel (`backend/src/db/seed/data/brand-certifications.ts`) → 55 (post-OBF) → 66 (post-PETA). `detectBrandLevelLabels` pure-lookup (passe 5b orchestrator) émet `vegan` / `cruelty-free` / `bio-naturel`. **Phase D** OBF dump ingestion (règle OR ratio≥0.5@n≥2 OR count≥3, +87 paires bio-naturel). **Phase E** PETA scraper (parsing breadcrumb JSON-LD pour distinguer signed-CF vs unsigned-page-exists, +110 paires cruelty-free, +21 stale citations corrigées dans seed). Backfill cumulé : **+1502 paires** (cruelty-free 0→1317, bio-naturel 0→264, vegan 2929→2948 marginal +19 brand-only). 47 tests ajoutés (8 brand-cert + 23 OBF + 16 PETA). Leaping Bunny scraper non livré (coverage marginal vs PETA). | L | Done |
| ~~T5~~ | ~~**`PROTECTION_CUTANEE`** distinct de `PROTECTION` (concern)~~ ✅ Done 2026-05-09 — `protection-cutanee` (skin_effect) renommé `effet-protecteur`. `protection` (concern) inchangé. Tous les ingrédients référencés (35+) migrés via la constante `TAG_SLUGS.EFFET_PROTECTEUR` ; junction rows DB préservés (UPDATE par slug). |

### ⚙️ Tooling

| # | Item | Effort |
|---|------|--------|
| O1 | **CSV diff backfill** : sortir un fichier `audit-diff.csv` listant les paires `(product, tag)` ajoutées/supprimées entre deux runs pour spot-check rapide après recalibration. | S |
| O2 | **Test corpus or-de-référence** (gold set) : 50-100 produits annotés à la main → mesurer precision/recall par tag à chaque MAJ règles. | M |
| O3 | **Audit `actif-class`** dédié — actuellement `audit-auto-tags` ne couvre que la passe 1. Ajouter stats hit/agree/new par cluster pharmacologique. | S |

### Notes correctives (vu en review 2026-05-07)

- `pigments-verts` (slug `PIGMENTS_VERTS`) = **colorimétrie correctrice rougeurs** (CI 77288 chromium oxide green, mica vert, ultramarines). Pas un tag dérivable de centella/panthenol/allantoin (qui sont des soothing/anti-inflammatoires sans pigment). Détecteur correct = INCI contient ces CI codes ou pigments minéraux verts → **slug peu prioritaire**, niche cosmétique.
- `bakuchiol` est **photostable** — alternative naturelle au rétinol précisément parce qu'il peut être utilisé jour. Ne pas l'inclure dans le cross-signal `moment-soir`.

---

## Audit couverture taxonomie — slugs existants vs détection (2026-05-08)

> Question posée : sur les slugs déjà définis dans `SKINCARE_PRODUCT_TAG_SLUGS`,
> lesquels n'ont **aucun émetteur** dans les 6 passes ? Comment les peupler
> sans créer de nouveau slug ni de nouveau champ DB ?
>
> Méthode : cross-check `shared/src/products/skincare/tag-slugs.ts` × passes 1-6
> (`auto-tag-detection.ts`, `actif-class-detection.ts`, `kind-tag-detection.ts`,
> `formula-detection.ts`, `cross-signal-detection.ts`, `detectGrossesseAvoid`).

### Inventaire — 23 slugs sur ~80 jamais peuplés (~28 %)

> **MAJ 2026-05-10** : 19 slugs résolus depuis l'audit initial (T1 sweep absorbe S1-S4 + `peau-normale` + `vegan` + `pigments-verts` + `hypoallergenique` + `moment-crise` + `matifiant` ; T4 absorbe `cruelty-free` + `bio-naturel` ; T5 absorbe `protection-cutanee` → `effet-protecteur` ; S5 absorbe `texture-gel` ; F2+F6 absorbent `texture-creme` + autres textures ; Tier 2 absorbe `eczema-atopie` + `repulpant`). **Marketing cleanup 2026-05-09** : `fini-glowy` killed + `absorption-rapide` killed (mergé dans `non-gras`). Reste **4 slugs** non peuplés (~5 %) : `peau-mixte` (volontairement exclu), `texture-mousse` + `texture-stick` (admin curation — `products.texture` ~3738 NULL), `type-outil` (pas de ProductKind correspondant). Tableaux ci-dessous mis à jour ✅ par sous-section.

#### Concerns (1/13 manque)

| Slug | Statut actuel | Cause |
|------|---------------|-------|
| `eczema-atopie` | algo-derm `peaux_atopiques` `allow:false` | 22 % corpus / 3 % agree — semantic noise |

12 concerns couverts ✅ (`acne-imperfections`, `rougeurs-vasculaires`, `barriere-cutanee`, `hyperpigmentation`, `reparation-cutanee`, `keratose-pilaire`, `deshydratation`, `eclat-teint-uniforme`, `anti-age`, `pores-sebum`, `cernes-poches`, `protection`).

#### Skin types (1/5 manque — peau-normale résolu)

| Slug | Cause |
|------|-------|
| `peau-mixte` | volontairement exclu de TAG_CONFIG (noisy on neutral hydrators) |
| ~~`peau-normale`~~ | ~~aucun émetteur~~ ✅ Done 2026-05-08 (T1) — `detectPeauNormale` post-pass, heuristique inverse (kind hydratant + 0 signal skin_type négatif). |

4 couverts ✅ (`peau-seche`, `peau-grasse`, `peau-sensible`, `peau-normale`).

#### Skin effects (1/11 manque — matifiant + protection-cutanee résolus)

| Slug | Cause |
|------|-------|
| `repulpant` | `allow:false` (78 % corpus à 0.5) |
| ~~`matifiant`~~ | ~~`allow:false` — set algo-derm ≡ `peau-grasse`, mismatch sémantique~~ ✅ Done 2026-05-08 (T1) — émis côté formula-pass via `detectFiniMat` (mêmes triggers silica/kaolin/starch top 8), indépendamment du `allow:false` algo-derm. |
| ~~`protection-cutanee`~~ | ~~aucun émetteur (T5 rename pending)~~ ✅ Done 2026-05-09 (T5) — renommé `effet-protecteur`, ingrédients migrés via `TAG_SLUGS.EFFET_PROTECTEUR`. |

`purifiant` désactivé volontairement (R2 — subset strict de `sebo-regulateur`), considéré couvert.

#### Sensations (4 actifs — 2 killed marketing cleanup 2026-05-09)

Initial T1 sweep (2026-05-08) avait livré 6 slugs sensation : `texture-riche`, `texture-legere`, `non-gras`, `fini-mat`, `fini-glowy`, `absorption-rapide`. **Marketing cleanup 2026-05-09** : `fini-glowy` killed (non-confirmable INCI per gold set) + `absorption-rapide` killed (pattern duplicate strict avec `non-gras`, mergé). Distribution finale : `texture-legere` 1791, `fini-mat` 370, `texture-riche` 120, `non-gras` 60. Détecteurs actifs : `detectFiniMat`, `detectTextureRiche`, `detectTextureLegere`, `detectNonGras` (renommé depuis `detectNonGrasAbsorption`).

#### Textures (3/9 manquent — texture-gel livré S5)

| Slug | Cause |
|------|-------|
| ~~`texture-gel`~~ | ~~pas dérivable kind seul~~ ✅ Done 2026-05-09 (S5) — `detectTextureFromField` (pure pass-through `products.texture`) + `detectTextureGelInci` (gel-former top 5 + 0 oil + 0 butter/wax + 0 silicone-led, leave-on). +93 paires backfill. |
| `texture-mousse` | non dérivable INCI seul, attend admin curation `products.texture` |
| `texture-stick` | non dérivable INCI seul, attend admin curation `products.texture` |
| ~~`texture-creme`~~ | ~~dérivé seulement pour `hand-cream`~~ ✅ Done 2026-05-09 (F2) — default-creme pour `moisturizer` + `foot-cream` + 6 vétos INCI. 701 pairs DB. Eye-cream ticket séparé. |

7 couverts ✅ (`texture-baume`, `texture-huile`, `texture-lait`, `texture-eau`, `texture-patch`, `texture-gel`, `texture-creme`).

#### Moments (5/5 ✅)

5 couverts ✅ (`moment-matin`, `moment-soir`, `moment-hebdomadaire`, `moment-usage-localise`, `moment-crise`).

#### Type V2 (1/12 manque, possiblement obsolète)

| Slug | Cause |
|------|-------|
| `type-outil` | aucun `ProductKind` correspondant (gua sha, brushes pas dans `PRODUCT_KINDS`) |

#### Labels (10/10 ✅ — bloc complet livré post-T4)

| Slug | Statut |
|------|--------|
| ~~`cruelty-free`~~ | ✅ Done 2026-05-09 (T4 phase E) — brand-level via `brand_certifications`, PETA scraper +110 paires. |
| ~~`bio-naturel`~~ | ✅ Done 2026-05-09 (T4 phase D) — brand-level via OBF dump (règle OR ratio≥0.5@n≥2 OR count≥3), +87 paires. |

10 couverts ✅ (`sans-parfum`, `filtres-chimiques`, `filtres-mineraux`, `grossesse-compatible`, `comedogene`/`non-comedogene` shared, **`hypoallergenique`** (T1.11 reactivated — minConf 0.85 + coverageMin 0.7), **`pigments-verts`** (T1 — CI 77288 / chromium oxide-hydroxide green), **`vegan`** (T1 + B.7 — `ANIMAL_PATTERNS` includes lanolin/beeswax/snail/carmine/pearl/lactoperoxidase/...), **`cruelty-free`** (T4-E PETA), **`bio-naturel`** (T4-D OBF)).

#### Domaines couverts intégralement ✅

- 12 actif-class (retinoids, vit C, vit E, AHA, BHA, PHA, ceramides, HA, peptides, polyphenols, tyrosinase, enzymes)
- 6 zones (visage, corps, yeux, levres, mains, pieds)
- 7 step V2 (nettoyage-1/2, preparation, traitement, hydratation, occlusif, protection-solaire)
- 11 type V2 sur 12 (manque `type-outil` seul)

---

### Plan d'implémentation par tier

#### Tier 1 — INCI seul, débloquables sans migration

Tout est implémentable dans `formula-detection.ts` ou `cross-signal-detection.ts`,
zéro nouveau champ DB, zéro nouveau slug.

| Slug | Détecteur | Fichier cible | Effort |
|------|-----------|---------------|--------|
| `fini-mat` | silica/kaolin/starch/corn-starch top 8 | `formula-detection.ts` | XS |
| `texture-riche` | ≥ 2 butters/waxes (shea/mango/cocoa/beeswax/carnauba) top 8 | `formula-detection.ts` | XS |
| `texture-legere` | inverse `texture-riche` — eau/glycerin top 3 + 0 butter top 8 + leave-on | `formula-detection.ts` | XS |
| ~~`fini-glowy`~~ | ~~glycerin top 3 + HA top 5 + 0 silicone matifiant + 0 starch~~ 🪦 Killed 2026-05-09 (marketing). | — | — |
| `non-gras` | `kind ∈ {serum, eye-cream}` + dimethicone/cyclopentasiloxane top 5 + 0 huile végétale top 5. ~~`absorption-rapide`~~ killed 2026-05-09 (pattern duplicate). | `formula-detection.ts` (`detectNonGras`) | S |
| `pigments-verts` | INCI contient `CI 77288` ou `chromium oxide green` ou `chromium hydroxide green` | `formula-detection.ts` | XS |
| `vegan` | absence INCI animal — lanolin / beeswax-cera-alba / mel-honey / collagen / lactoferrin-lactoperoxidase (B.7) / snail-mucin / royal-jelly / carmine-CI75470 / keratin / pearl- (B.7) / squalene (vs squalane) | `formula-detection.ts` | S |
| `peau-normale` | heuristique inverse — coverage ≥ 0.7 + `kind ∈ {moisturizer, cleanser, toner}` + 0 actif fort + 0 autre skin_type émis | `formula-detection.ts` | S |
| `moment-crise` | `kind=spot-treatment` + (BHA actif-class OR benzoyl peroxide top 5 OR azelaic acid top 5) | `cross-signal-detection.ts` | XS |
| `matifiant` (réactivation) | sortir de algo-derm computed_score, redéfinir comme sensoriel : silica/perlite/kaolin top 5 | `formula-detection.ts` | S |
| `hypoallergenique` (réactivation) | algo-derm + gating dur : 0 EU 26 allergen confirmé + `assessment.declarationOnlyRisk = false` + minConf 0.85 | `auto-tag-detection.ts` (TAG_CONFIG) | S |

#### Tier 2 — Réactivations délicates

| Slug | Plan |
|------|------|
| ~~`eczema-atopie`~~ | ✅ Done 2026-05-09 — `detectEczemaAtopie` (formula-detection.ts). Trigger A : `avena sativa kernel` substring (kernel flour/extract/oil = OTC colloidal oatmeal ; flower/leaf/stem juice exclu). Trigger B : ≥ 2 distinct ceramide variants top 12 + 0 fragrance keyword (`parfum`/`fragrance`/`aroma` substring, gère slash-form `parfum/fragrance`) + 0 sulfate top 5. Leave-on only (RINSE_OFF_KINDS bloqué). 72 paires backfill, `peaux_atopiques` algo-derm reste `allow:false`. 11 tests ajoutés. |
| ~~`effet-protecteur`~~ | ✅ Done 2026-05-09 — `detectEffetProtecteur` (formula-detection.ts). Trigger A : lanolin (any variant — substring `lanolin`) top 8 → seul suffit (Aquaphor/Lansinoh nipple-balm chemistry). Trigger B : ≥ 2 butter/wax groups top 8 (délègue à `detectTextureRiche` pour synonym dedup). 🪦 **Killed product-side 2026-05-09 (round 2 audit, migration `0053`)** — Trigger B = pattern duplicate strict de `texture-riche` (74 % co-fire), Trigger A = niche balms (~24 paires). Slug retiré côté product. Ingredient-side `effet-protecteur` préservé (chemistry classification). |
| ~~`repulpant`~~ | ✅ Done 2026-05-09 — `detectRepulpant` (formula-detection.ts). Pattern : HA (substring `hyaluron`) top 8 + pure glycerin (exact token, exclut `glyceryl stearate`) top 5 + plumping peptide (`acetyl hexapeptide-8` OR `palmitoyl tripeptide-1`) anywhere. Leave-on only. HA cap relâché à 8 (vs spec original 3) car peptide-headline serums (The Ordinary Matrixyl 10%+HA) placent peptide pos 3-6 et HA pos 5-8. 8 hits total (7 déjà manuels, 1 nouvelle). Profil : volumateur/tenseur/anti-âge ; quelques masques borderline. Algo-derm `repulpant` reste `allow:false`. 8 tests ajoutés. |

#### Tier 3 — Bloqué champ `products.texture` (T3 roadmap)

| Slug | Bloqué par |
|------|------------|
| `texture-gel` | T3 — heuristique INCI partielle possible (carbomer/sodium-polyacrylate/xanthan top 5 + 0 huile top 5 + leave-on) mais précision moyenne |
| `texture-mousse` | T3 — INCI seul ne distingue pas |
| `texture-stick` | T3 — INCI seul ne distingue pas |
| ~~`texture-creme` étendu~~ | ~~T3~~ ✅ Done F2 — moisturizer + foot-cream couverts. Eye-cream ticket séparé (hétérogène). |
| `peau-mixte` | T3 indirect — pattern propre nécessite distinction texture (T-zone gel-cream + niacinamide top 8) |

→ Confirme priorité T3 roadmap.

#### Tier 4 — Brand-level (T4 roadmap)

| Slug | Source |
|------|--------|
| `cruelty-free` | Leaping Bunny / PETA / CCI registry — ingestion externe |
| `bio-naturel` | Cosmos Organic / Ecocert / Nature & Progrès — ingestion externe |

`hypoallergenique` sort de T4 : déplacé Tier 1 (faisable INCI seul si on durcit le gating).

#### Tier 5 — Décision produit (à dropper ou étendre)

| Slug | Action |
|------|--------|
| `type-outil` | aucun `ProductKind` correspondant. Soit étendre `PRODUCT_KINDS` (`gua-sha`, `jade-roller`, `cleansing-brush`), soit retirer du slug set |
| `purifiant` | volontairement `allow:false` (R2). OK, garder désactivé |

---

### Trajectoire courte recommandée (Tier 1, sans migration) — ✅ Done 2026-05-08

Ordre d'implémentation par ROI décroissant :

1. ✅ **`fini-mat` + `texture-riche` + `texture-legere`** (XS × 3) — patterns simples, signal fort.
2. ✅ **`vegan`** (S) — table ingrédients animaux dans `formula-detection.ts`.
3. ✅ **`pigments-verts`** (XS) — substring CI codes, niche mais propre.
4. ✅ **`peau-normale`** (S) — heuristique inverse, post-pass dans `backfill-auto-tags.ts`.
5. ✅ **`non-gras`** (S) — bloc sensoriel silicone-led. ~~`absorption-rapide`~~ + ~~`fini-glowy`~~ killed 2026-05-09 (marketing cleanup, voir migration `0052`).
6. ✅ **`moment-crise`** (XS) — cross-signal spot-treatment + BHA/BPO/azelaic.
7. ✅ **`matifiant`** (S) — réactivation via formula sensoriel pur (découple de `peau-grasse`).
8. ✅ **`hypoallergenique`** (S) — réactivation TAG_CONFIG : minConf 0.85 + coverageMin 0.7.

Résultat dry-run : +6 677 paires (+53 %), 11 slugs activés. Voir log T1 ci-dessous (§ "Tier-1 sweep T1").

### Ce qui reste hors scope tier 1

- 4 textures + `peau-mixte` (T3 — `products.texture`)
- 2 labels brand (T4 — ingestion externe)
- `type-outil` (décision produit)
- ~~`eczema-atopie`~~ ✅ Done · ~~`effet-protecteur`~~ ✅ Done · ~~`repulpant`~~ ✅ Done (Tier 2 — réactivations délicates)
