# Auto-tagging — Roadmap

> **À propos :** dette ouverte du sous-système `features/auto-tagging/`. Pour
> l'architecture (6 passes + orchestrator + runners), voir [`AUTO-TAGS.md`](./AUTO-TAGS.md).
> Pour le contexte général du seed, voir [`../../../db/seed/docs/ROADMAP.md`](../../../db/seed/docs/ROADMAP.md).

**Principe directeur (2026-05-12)** : le tagging produit est **100 % automatique**. Aucune curation manuelle de tags marque par marque. Toute couverture insuffisante = défaut du pipeline auto-tag, pas tâche de saisie.

---

## Historique récent

- **2026-05-13** — Split `TagRule.minConf` → `coverageFloor` + `confidenceFloor` (Aurore commit `7021990c`). Ancien champ avait sémantique duale selon `candidate.source` (coverage pour absence, confidence pour computed) — confusion en calibration.
- **2026-05-13** — Position-aware `MAPPED_TAGS` côté algo-derm (commit `859184b` sur `feat/simplex-solver`). `MappedTagDef.check` reçoit `NormalizedIngredients` (ordered + set + `positionOf` + `hasInTop`) au lieu de `Set<string>`. Top 8 sur `comedogene` / `non-comedogene`, top 12 sur cluster niacinamide + `anti-age` + acid-class. `TAG_DEFS_VERSION = 2` exporté.
- **2026-05-13** — **A4 livré** : rows `peaux_atopiques` / `matifiant` / `repulpant` supprimées de `TAG_CONFIG`. Re-émises par `passes/formula/{eczema-atopie,fini-mat,repulpant}.ts` (chemistry-aware). Candidates algo-derm tombent en `unmapped`. Test `TAG_CONFIG counts` : `drop.length` 5 → 2 (purifiant + sans_savon restent).
- **2026-05-13** — **B4 livré** (algo-derm) : `peaux_sensibles.check` exclut `formaldehyde_donor` + `isothiazolinone` (parité `peaux_atopiques`). Fix DMDM hydantoin / MIT slippant le claim sensitive-skin.
- **2026-05-13** — **B5 livré** (algo-derm) : `COMEDOGEN_PATTERNS` enrichi 4 → 12 (Fulton ≥ 3 : octyldodecanol, lanolin alcohol, isocetyl stearate, decyl oleate, cocoa butter, isopropyl palmitate, oleyl alcohol, cetearyl alcohol). Symétrique sur `non-comedogene` (const partagée).
- **2026-05-13** — Bump `TAG_DEFS_VERSION` 2 → 3 (couvre B4 + B5). Aurore `CALIBRATED_FOR_TAG_DEFS_VERSION = 3`.
- **2026-05-13** — **B6 livré** (algo-derm) : `peau-mixte` tightened 0.25/0.25 → 0.4/0.4 sur axes seborrheicRegulation + hydrating. Bump `TAG_DEFS_VERSION` 3 → 4. Aurore `CALIBRATED_FOR_TAG_DEFS_VERSION = 4` (no-op runtime — peau-mixte hors `TAG_CONFIG`, tombe en `unmapped`).
- **2026-05-13** — **A3 livré** : `passes/tag-budgets.ts` + audit modes `DUMP_BUDGETS=1` / `CHECK=1` + target `just audit-auto-tags-check`. Per-category budget (skincare/solaire/bodycare), hit_rate vs `max`/`min`, exit 1 si FAIL. Audit corpus 3601 produits : 74/74 OK au seed.
- **2026-05-13** — **B3 livré** (algo-derm) : `AXIS_BENEFIT_THRESHOLDS: Record<BenefitAxis, number>` per-axis P85 sur corpus Aurore n=3601 (soothing 0.20 · hydrating 0.47 · barrierSupport 0.25 · antioxidant 0.19 · brightening 0.21 · seborrheicRegulation 0.20). Old uniform 0.35 était au-dessus P95 sur 5/6 axes (signal-mute) et sous P50 sur hydrating (laxiste). Eclat-teint-uniforme 0.30 override droppé (relation `hyperpigmentation ⊃ eclat` via active-list branch, plus via threshold). Peau-mixte 0.4/0.4 override conservé (intent B6). Bump `TAG_DEFS_VERSION` 4 → 5. Aurore `CALIBRATED_FOR_TAG_DEFS_VERSION = 5`. Audit modes `DUMP_BENEFITS=1` / `BENEFITS_OUT` ajoutés au runner Aurore pour ré-calibrer si drift futur. Budgets re-baselinés (81/0/0 OK).
- **Drift guard** : Aurore pin `CALIBRATED_FOR_TAG_DEFS_VERSION = 5`, fail-fast au module load si mismatch tarball.

---

## 1. Couverture `primary` — 1101 produits sans tag primary

Audit DB 2026-05-12 (après re-run `runners/backfill/main.ts --write`, 12 494 lignes secondary/avoid insérées) :

| category                      | no_primary      | total |
| ----------------------------- | --------------- | ----- |
| skincare                      | 1052            | 2850  |
| bodycare                      | 41              | 385   |
| haircare                      | 8               | 377   |
| dental / complement / solaire | 0               | 590   |
| **Total**                     | **1101 / 4202** |       |

Top marques sans primary (K-beauty scrappée, jamais curée dans `productTagData`) : Pyunkang Yul 78, MISSHA 72, SOME BY MI 69, Dr. Ceuracle 66, MIXSOON 49, COSRX 48, Mary&May 41, SKINFOOD 41, ISNTREE 40, SKIN1004 40, Anua 39, Purito 38…

**Cause racine archi** : `primary` vient uniquement de `productTagData.groups.primary` curé manuellement dans les `*.seed.ts`. Le runner `runners/backfill/main.ts` ne génère que secondary/avoid.

**Direction** : étendre `runners/backfill/main.ts` (et `orchestrator.ts`) pour générer `primary` automatiquement depuis les signaux algo-derm (top concern / category / actif-class détectés). Définir règles de promotion `secondary → primary` (ex: confiance algo-derm > seuil, premier tag par axe, etc.).

- [ ] **Spec règles de promotion `primary` auto** (concern dominant, actif-class principal, category par kind/INCI).
- [ ] **Implémenter** dans `orchestrator.ts` + `runners/backfill/main.ts`.
- [ ] **Re-run `WRITE=1 just backfill-auto-tags`**, vérifier no_primary → 0 sur skincare/bodycare/haircare.
- [ ] **Tests** seed-data-integrity + audit gold-set inchangé.

---

## 2. Couverture autres axes

Une fois `primary` auto livré, points ouverts :

- [ ] `skin_type` peu rempli — algo-derm donne signal, vérifier seuils.
- [ ] Labels absents (`sans-parfum`, etc.) — pipeline formula manque overrides.

---

## 3. Refactor & dette code

Issues identifiées lors de la revue 2026-05-13. Chaque item garde son ID (A* = Aurore, B* = algo-derm) pour référence cross-doc. Pour algo-derm : repo `/home/schaff/Mathieu/projets/algo-derm`, branche `feat/simplex-solver`. Toute modif algo-derm → bump `TAG_DEFS_VERSION` + recalibration Aurore + bump `CALIBRATED_FOR_TAG_DEFS_VERSION`.

### 3.1 Aurore — `passes/auto-tag-detection.ts`

#### A1 — Predicate `skipIf` au lieu de hard-code `auroreSlug === S.HYPOALLERGENIQUE` ✅ livré 2026-05-13

`TagRule.skipIf?: (a: ProductAssessment) => boolean` ajouté. Row `hypoallergenique` migrée (`skipIf: (a) => a.declarationOnlyRisk`). Hard-code dans `detectAutoTags` remplacé par `rule.skipIf?.(assessment)`. Drop reason `declaration_only_risk` renommé en `skip_if` (générique). Audit runner suit.

- [x] Migrer la row `hypoallergenique`.
- [x] Étudier `non_irritant` + `declarationOnlyRisk` — **décision : pas de skipIf**. `declarationOnlyRisk` est allergenicity-axis specific (déclenche quand allergenicity.risk ≥ 0.33 ET driver top en position tail). `non_irritant` keye sur l'axe irritation, distinct ; algo-derm n'expose pas d'équivalent declaration-only pour irritation. Pas de parité possible.
- **Finding annexe** : le skipIf `hypoallergenique` est défensif / unreachable aujourd'hui — algo-derm fire `hypoallergenique` sur `allergenicity.risk < 0.30`, mais `declarationOnlyRisk` nécessite `risk ≥ 0.33` (RATING_MEDIUM_THRESHOLD). Plages disjointes. Gardé en forward-protection si le threshold algo-derm se relâche au-delà de 0.33. Commenté inline dans `TAG_CONFIG`.

#### A2 — Unifier la sémantique `confOverride` / `coverageMinOverride` ✅ livré 2026-05-13

`coverageMinOverride` passe **raise** (`Math.max(baseFloor, override)`), symétrique avec `confOverride`. `disableFloors?: boolean` ajouté pour les audits qui veulent inspecter sous les seuils calibrés — bypass coverage + confidence (per-tag + global). Tests réécrits sur la nouvelle sémantique (`coverageMinOverride: 0` → `disableFloors: true`). `orchestrator.ts` propage le flag.

- [x] Aligner sémantique des deux overrides.
- [x] Documenter dans `AUTO-TAGS.md` (table debug overrides + bloc `skipIf`).

#### A3 — Audit invariant CI : "no tag fires on >X% corpus" ✅ livré 2026-05-13

Calibration figée snapshot 2026-05-07 (2912 produits). 3000+ produits ajoutés depuis, pas de garde-fou si la distribution dérive. Le + utile à livrer avant les chantiers de calibration (B2/B3) — les bumps `TAG_DEFS_VERSION` ne valent rien sans détecteur de drift.

**Impl (2026-05-13)** :

1. `passes/tag-budgets.ts` exporte `TAG_HIT_RATE_BUDGET: TagBudgetTable` per-category (`skincare`/`solaire`/`bodycare`, alignés sur `AUTO_TAG_ELIGIBLE_CATEGORIES`). Entries `{ min?, max }`.
2. Audit étendu : `eq(category='skincare')` → `inArray(category, AUTO_TAG_ELIGIBLE_CATEGORIES)`. Tracking per-category de `tagFreq`/`withInci`/`subset`. Section "Par catégorie · par tag" dans le report.
3. Mode `DUMP_BUDGETS=1` émet le bloc TS prêt-à-coller (baseline `max = min(1, ceil(hit_rate × 1.5, 0.05))`).
4. Mode `CHECK=1` (`just audit-auto-tags-check`) valide hit rates vs table, exit 1 si FAIL. Warn-only sur tags hors budget. Sensibles (`comedogene`, `non-comedogene`, `peau-sensible`, `hypoallergenique`) tightenés × 2 manuellement.
5. Doc : `AUTO-TAGS.md` section "Calibration drift detection".

**Résultat audit 2026-05-13** : 74 entries · 0 WARN · 0 FAIL. Seed cohérent avec la calibration courante.

**Reste à câbler CI** : ajouter step `just audit-auto-tags-check` dans le workflow. Le runner exige une DB seeded (lit `products` via RLS bypass) — soit prod live, soit job dédié post-`seed-core`. À discuter (defer si pas de CI auto-tag aujourd'hui).

- [x] Définir le budget par tag (hybride P75 × 1.5 + manuel × 2 sur 4 sensibles).
- [x] Implémenter `CHECK` dans audit (warn sur tags hors budget, FAIL sur dépassement).
- [ ] Câbler en CI (defer — décision sur le step et le runtime DB).
- [x] Documenter (`AUTO-TAGS.md`).
- [ ] Durcir : passer "hors budget" de WARN → FAIL après 2-3 PR sans bruit.

#### A4 — Cleanup dette `allow:false` re-implémenté en `passes/formula/` ✅ livré 2026-05-13

Trois rows dans `TAG_CONFIG` étaient `allow:false` parce que la version algo-derm était trop bruyante, et le tag est re-émis ailleurs :

- `peaux_atopiques` → `passes/formula/eczema-atopie.ts`
- `repulpant` → `passes/formula/repulpant.ts`
- `matifiant` → `passes/formula/fini-mat.ts`

Rows supprimées : les candidates algo-derm tombent en `unmapped` (drop reason). Headers des trois formula passes enrichis avec ref commits (`f3fd5e2f` détecteur eczema-atopie, `211219d5` split passes/formula/).

- [x] Supprimer les 3 rows.
- [x] Enrichir le header de chaque formula pass avec la ref historique.

#### A5 — `requireTopN` optionnel par tag ❌ closed YAGNI 2026-05-13

Algo-derm a les caps internes (top 8 / top 12) calibrés sur les patterns Fulton + niacinamide-cluster + ANTI_AGE. Aucun cas de faux positif persistant signalé dans les audits post-B5. Le besoin de paramétrer un cap par-tag côté Aurore (ex: `comedogene` top 5 sur body-care) reste spéculatif. Réouvrir si un audit corpus montre un FP cluster qui ne se résout pas avec un ajustement du cap interne algo-derm.

#### A6 — Doc cleanup `coverageMin` historique ✅ livré 2026-05-13

Commentaires `hypoallergenique` + `non_irritant` reformulés : "absence claim" supprimé (les tags sont `computed_score`, pas `detected_absence`). Rationale par tag explicite (axes allergenicity vs irritation, comportement algo-derm, motif des floors stackés). Note skipIf défensif inline pour `hypoallergenique`.

- [x] Reformuler les commentaires post-A1.

### 3.2 Algo-derm — `src/engine/tags.ts`

#### B1 — Consolider tags redondants (ou documenter le découpage) ✅ livré 2026-05-13

Décision : **garder + documenter**. Bloc `Tag relationships` inline avant `MAPPED_TAGS` dans `src/engine/tags.ts` couvre les overlaps : `purifiant ⊂ sebo-regulateur`, `matifiant ≡ peau-grasse` (signal chimie identique), `acne-imperfections ⊂ pores-sebum ⊂ sebo-regulateur` (concern/zone/effect), `barriere-cutanee ≡ reparateur`, `hyperpigmentation ⊃ eclat-teint-uniforme`. Pas de bump `TAG_DEFS_VERSION` (doc-only, aucune sémantique changée).

- [x] Doc inline + section dédiée.

#### B2 — Confidence position-weighted au lieu de `Math.min(coverage, 0.9)`

Tags concernés : `anti-age`, `purifiant`, `keratolytique`, `repulpant`, `grossesse-compatible`. Actuellement `confidence = min(coverage, 0.9)` — proxy faible.

Combiné avec les position caps livrés :

```ts
const positionConfidence = (pos: number, cap: number): number => {
  if (pos < 0) return 0
  return Math.max(0, 1 - pos / cap)  // pos 0 → 1.0, pos cap → 0
}
// confidence = min(coverage, 0.9) * positionConfidence(matchedPos, cap)
```

- [ ] Étendre `MappedTagDef.confidence` pour recevoir `NormalizedIngredients`.
- [ ] Implémenter le helper.
- [ ] Bumper `TAG_DEFS_VERSION` + recalibrer Aurore.

#### B3 — Calibrer `benefitMin` per-axis ✅ livré 2026-05-13

Constatation post-dump : l'uniforme 0.35 était au-dessus P95 sur 5/6 axes (apaisant / anti-oxydant / barriere-cutanee / hyperpigmentation / sebo-regulateur — benefit branch quasi inerte, tout passait par `hasInTop`) et sous P50 sur hydrating (laxiste). Re-calibration P85 sur corpus n=3601 :

| axis | P85 | seuil retenu |
| --- | --- | --- |
| soothing | 0.194 | 0.20 |
| hydrating | 0.474 | 0.47 |
| barrierSupport | 0.255 | 0.25 |
| antioxidant | 0.190 | 0.19 |
| brightening | 0.210 | 0.21 |
| seborrheicRegulation | 0.207 | 0.20 |

Eclat-teint-uniforme 0.30 override droppé (devenu plus strict que default 0.21, inversant la relation `hyperpigmentation ⊃ eclat` qui repose maintenant sur la branche active-list). Peau-mixte 0.4/0.4 conservé (intent B6).

Audit modes ajoutés côté Aurore : `DUMP_BENEFITS=1` (quantile table per-axis + per-category) + `BENEFITS_OUT=path.csv` (raw dump). Re-utilisables pour future re-baseline si distribution dérive.

- [x] Mode audit `DUMP_BENEFITS` + quantiles inline.
- [x] Analyse quantile P85 par axis.
- [x] `AXIS_BENEFIT_THRESHOLDS` const + benefitMin default arg.
- [x] Bump `TAG_DEFS_VERSION` 4 → 5 + Aurore `CALIBRATED_FOR_TAG_DEFS_VERSION` 5.
- [x] Re-baseline `TAG_HIT_RATE_BUDGET` (81/0/0 OK).

#### B4 — `peaux_sensibles` exclusions asymétriques (bug probable) ✅ livré 2026-05-13

```ts
// Actuel
peaux_sensibles: { ..., !flags.has("fragrance"), !flags.has("essential_oil"), !flags.has("sulfate_surfactant") }
peaux_atopiques: { ..., même + !formaldehyde_donor, !isothiazolinone, !soap, !fragrance_allergen }
```

Un produit avec DMDM hydantoin (formaldehyde donor) ne devrait jamais fire `peaux_sensibles`.

- [x] Ajouter `!formaldehyde_donor` et `!isothiazolinone` au check de `peaux_sensibles`.
- [ ] Audit avant/après pour vérifier qu'aucun produit légitime ne perd le tag (à faire au prochain `just audit-auto-tags`).

#### B5 — Enrichir `comedogene` fallback ingredient list ✅ livré 2026-05-13

Actuel : `["isopropyl myristate", "myristyl myristate", "coconut oil", "lauric acid"]` (4 entrées). Manque (Fulton scale ≥ 3) :

- `octyldodecanol`
- `lanolin alcohol`
- `isocetyl stearate`
- `decyl oleate`
- `theobroma cacao seed butter` (cocoa butter)
- `isopropyl palmitate`
- `oleyl alcohol`
- `cetearyl alcohol` (Fulton 2 mais leave-on à forte conc → 3)

Sources : Fulton et al., J Soc Cosmet Chem 1984 ; Acne.org community comedogenicity database.

- [x] Enrichir la liste (4 → 12 entrées).
- [x] Appliquer symétriquement à `non-comedogene` (const partagée).
- [x] Garder le top 8 cap (déjà appliqué).

#### B6 — Affiner ou drop `peau-mixte` ✅ livré 2026-05-13

Décision : **tighten 0.4/0.4** (deux signaux forts requis sur seborrheicRegulation + hydrating). Threshold 0.25 firait sur toute crème glycérine + niacinamide ; 0.4 demande de l'évidence réelle des deux axes (pas la présence incidentale). Bump `TAG_DEFS_VERSION` 3 → 4 + history entry. Heuristic combo (kaolin + glycerin) écartée (effort + risque calibration) ; drop entirely écarté (concept utilisateur réel à conserver pour intégration Aurore future).

- [x] Décision produit + impl.

#### B7 — Bumper `TAG_DEFS_VERSION` à chaque batch ✅ livré 2026-05-13

Convention bump documentée dans le header de `src/engine/tags.ts` (5 points) : critère "tag set/confidence différent observé en aval", triggers (ABSENCE/COMPUTED/MAPPED entries, check semantics, confidence, types exposés), workflow consumer Aurore (audit + recalib + bump `CALIBRATED_FOR_TAG_DEFS_VERSION` + `just vendor-algo-derm`), module-load fail-fast assert.

- [x] Convention documentée dans header `tags.ts`.

### 3.3 Priorisation

| Bucket                  | Items                                                        |
| ----------------------- | ------------------------------------------------------------ |
| **✅ Livré 2026-05-13** | ~~A4 (cleanup dette)~~ · ~~B4 (`peaux_sensibles` bug)~~ · ~~B5 (comedogene list)~~ · ~~A1 (`skipIf`)~~ · ~~A2 (override symmetry + `disableFloors`)~~ · ~~B1 (doc relationships)~~ · ~~A6 (cleanup comments)~~ · ~~B7 (bump convention)~~ · ~~B6 (peau-mixte tighten)~~ · ~~A3 (TAG_HIT_RATE_BUDGET + CHECK)~~ · ~~B3 (AXIS_BENEFIT_THRESHOLDS P85)~~ |
| **Medium ROI**          | — |
| **Plus gros chantier**  | B2 (position-weighted confidence) |
| **À débattre**          | — (A5 closed YAGNI) |

---

## 4. Dette résiduelle ex-§8

Historique : [`../../../db/seed/docs/_archive/auto-tags-roadmap.md`](../../../db/seed/docs/_archive/auto-tags-roadmap.md). Comment ça marche : [`AUTO-TAGS.md`](./AUTO-TAGS.md).

- [ ] **F5** — pipeline Brier/ECE pour passe 1 (concerns / skin types / absence) si on calibre les seuils algo-derm un jour. Defer sinon. Effort XS.
- [ ] **`texture-mousse`** — livré via `detectTextureFromField` uniquement quand `products.texture = 'mousse'`. Pas de fallback nom/INCI (foaming surfactants ambigus). Bloqué par `products.texture = NULL` — nécessite curation admin ou parser description/notes.
- [ ] **`peau-mixte` côté Aurore** — Tier 3, bloqué par `products.texture = NULL` (pattern visé : T-zone gel-cream + niacinamide top 8). Note : B6 livré côté algo-derm (tighten 0.4/0.4) — peau-mixte est désormais émis proprement par algo-derm si les deux benefits sont forts. Reste à l'ajouter dans `TAG_CONFIG` côté Aurore une fois texture data disponible (ou via détecteur formula).

---

## 5. Problèmes connus pipeline filtres

| ID  | Sévérité    | Problème                                                                               | Piste                                           |
| --- | ----------- | -------------------------------------------------------------------------------------- | ----------------------------------------------- |
| P2  | 🔴 Bloquant | `products.kind` : 25 valeurs hétérogènes → inutilisable en filtre.                     | Remplacer par `product_type` tag (auto-derivé). |
| P5  | 🟡 Moyen    | Recherche texte incohérente : fuzzy (produits, pg_trgm) vs simple ILIKE (ingrédients). | Harmoniser.                                     |
| P6  | 🟢 Faible   | Tri popularité absent. `price_asc`/`price_desc`/`newest`/`name`/`random` livrés.       | Ajouter tri popularité si métrique disponible.  |

---

## 6. Cas spécifiques tag — solaires & avoid actifs

**Audit pipeline 2026-05-13** : les règles historiques de cette section référençaient `peau-reactive` + `barriere-cutanee-alteree` comme slugs `avoid`. Or ces slugs **n'existent qu'en `SKINCARE_INGREDIENT_TAG_SLUGS`** (taxonomie ingrédient), pas en `SKINCARE_PRODUCT_TAG_SLUGS`. Le proxy product-side est `peau-sensible` (catch-all reactive-skin). Aucun équivalent product pour `barriere-cutanee-alteree`. Concentration data (`>8%`, `10%+`) absente de `products.inci` (uniquement `products.percent_claims` partiel).

### État actuel par règle

| Règle roadmap | Pipeline | Statut |
| --- | --- | --- |
| Rétinoïde → `grossesse-compatible` (avoid) | `passes/formula/grossesse-avoid.ts` Tier 1 — toute présence, tout format | ✅ Couvert |
| Rétinoïde → `peau-sensible` (avoid, proxy "peau-reactive") | `passes/cross-signal-detection.ts:detectCrossSignalAvoidTags` — **uniquement si rétinoïde + AHA/BHA leave-on** | ⚠️ Partial — rétinoïde seul leave-on n'émet pas peau-sensible avoid |
| Rétinoïde → `barriere-cutanee-alteree` | slug inexistant en product taxonomy | ❌ Concept ingrédient seulement, pas de proxy product |
| BHA leave-on top 10 → `grossesse-compatible` (avoid) | `grossesse-avoid.ts` Tier 2 — salicylic acid leave-on top 10 | ✅ Couvert |
| BHA → `peau-sensible` (avoid) | Couvert uniquement en combo retinoid+BHA | ⚠️ Partial — BHA seul leave-on top 10 n'émet pas peau-sensible avoid |
| AHA fort (>8%) → `peau-sensible` (proxy) + `barriere-cutanee-alteree` | Pas de % data ; pas d'avoid émis pour AHA seul | ❌ Bloqué par data + slug |
| Azélaïque 10%+ → reactive + alteree | Azélaïque hors actif-class taxonomy ; pas de % data | ❌ Gap entier |
| Filtres chimiques → `grossesse-compatible` (solaires) | `grossesse-avoid.ts` Tier 2 — oxybenzone + homosalate uniquement | ⚠️ Stance evidence-based — pas tous les filtres chimiques |

### Notes evidence-based

- **Oxybenzone / homosalate uniquement** : consensus dermo (SCCS 2022 endocrine + high absorption oxybenzone). Avobenzone / octocrylene / Tinosorb / Mexoryl n'ont pas de recommandation grossesse aux derniers updates. Le rule roadmap "tous les filtres chimiques" est plus conservatif que la guidance professionnelle — **garder le filtre Tier 2 actuel**.
- **Retinoid seul leave-on → peau-sensible avoid** : justifiable cliniquement (irritation cumulative even sans combo). À envisager si l'audit montre que des utilisateurs `peau-sensible` reçoivent des recommandations rétinoïdes pures.
- **BHA seul leave-on → peau-sensible avoid** : même rationale. Salicylic acid top 10 en leave-on flag déjà grossesse mais pas peau-sensible.

### Action items (priorité moyenne — pas trivial)

- [ ] Décision design : introduire `peau-reactive` en `SKINCARE_PRODUCT_TAG_SLUGS` (distinct de `peau-sensible`) ou continuer à utiliser `peau-sensible` comme proxy ?
- [ ] Décision design : exposer un concept product équivalent à `barriere-cutanee-alteree` (concern) ou rester ingrédient-only ?
- [ ] Implémenter retinoid seul leave-on → `peau-sensible` avoid dans `detectCrossSignalAvoidTags` (si décidé).
- [ ] Implémenter BHA seul leave-on top 10 → `peau-sensible` avoid (si décidé).
- [ ] AHA / azélaïque fort : nécessite % data ou position-based fallback (top 3 = forte concentration probable). Spec à définir.

---

## Boucle dev & tests

**Modif Aurore seule** :

```bash
just ts-verify
just test-dev "auto-tag"
```

**Modif algo-derm** :

```bash
# Dans /home/schaff/Mathieu/projets/algo-derm
npm run build && node --test test/*.test.mjs

# Retour dans aurore
just vendor-algo-derm
just ts-verify
just test-dev "auto-tag"
```

**Si `bun install` plante avec `IntegrityCheckFailed extracting tarball from algo-derm`** : `npm pack` produit un tarball avec mtime-dépendant hash, et `bun.lock` peut stocker un hash périmé entre deux vendors. Recovery :

```bash
rm bun.lock
rm -rf node_modules backend/node_modules shared/node_modules frontend/node_modules
bun install                       # régénère lock from scratch matching current tarball
just reinstall-backend            # rebuild Docker image avec nouveau lock
```

(Fix futur possible : passer `SOURCE_DATE_EPOCH` à `npm pack` pour des tarballs déterministes.)

**Tests préexistants à ignorer** (non liés à l'auto-tagging algo-derm, ne pas traiter sauf si tu touches ce qui les concerne) :

- `Product Service > writes auto-tags when matching defs exist`
- `ingredient-slugs split refactor`
