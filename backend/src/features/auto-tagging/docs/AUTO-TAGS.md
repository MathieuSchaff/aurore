# Auto-tagging des produits — comment ça marche

> Doc d'explication du système de détection automatique de tags (produits skincare/solaire/bodycare). 6 passes de détection branchées sur l'INCI + `kind`.

> **Roadmap / dette ouverte** : voir [`ROADMAP.md`](./ROADMAP.md). **Historique calibration + tier audit** : [`../../../db/seed/docs/_archive/auto-tags-roadmap.md`](../../../db/seed/docs/_archive/auto-tags-roadmap.md).

---

## L'idée générale

On a une base de produits. Chaque produit a :
- un **INCI** (liste d'ingrédients officielle, ordonnée par concentration décroissante)
- un **`kind`** (type : `serum`, `cleanser`, `sunscreen`, `body-lotion`…)
- une **`category`** (`skincare`, `solaire`, `bodycare`)

On veut remplir automatiquement la table `tag_products` en DB avec des tags pertinents, sans avoir à le faire à la main pour 3 000+ produits.

Pour ça on a **6 passes de détection** qui fonctionnent en parallèle, chacune avec une logique différente. En gros :

```
INCI du produit
    │
    ├─► [Passe 1] algo-derm tagProduct()  → concerns, types de peau, comédogénicité,
    │                                        vegan (absent. animaux), grossesse_risque (avoid)
    ├─► [Passe 2] actif-class             → clusters pharmacologiques (retinoids, AHA, vit C…)
    ├─► [Passe 3] kind → tags             → TYPE_*, ZONE_*, STEP_*, MOMENT_*
    ├─► [Passe 4] formula patterns        → occlusif, filtres solaires, prébiotique
    ├─► [Passe 5] cross-signal            → MOMENT_SOIR/MATIN depuis actif × kind
    └─► [Passe 6] cross-signal-avoid      → stack irritation (retinoid+AHA/BHA) → peau-sensible avoid

        ↓
    Déduplication (avoid > secondary)
        ↓
    INSERT dans tag_products
```

---

## Ce qu'on utilise d'algo-derm

`algo-derm` est une lib locale (vendored dans `vendor/algo-derm.tgz`). Elle expose 3 fonctions qu'on utilise :

### `analyzeINCI(inci, { context })` → `ProductAssessment`

C'est le moteur principal. Tu lui donnes une chaîne INCI et elle te retourne une analyse complète :
- des **axes de risque** (`irritation.risk`, `allergenicity.risk`, `comedogenicity.risk`)
- des **axes de bénéfice** (`hydrating.benefit`, `soothing.benefit`, `brightening.benefit`…)
- la **couverture** (`coverage.ratio` : proportion de l'INCI qu'elle a pu identifier dans sa base)
- des **flags heuristiques** (`fragrance`, `essential_oil`, `sulfate_surfactant`…)

### `tagProduct(assessment, rawIngredients)` → `ProductTag[]`

Prend le résultat de `analyzeINCI` et retourne une liste de tags avec :
- `id` : identifiant du tag (ex: `"acne-imperfections"`, `"sans_parfum"`)
- `present` : `true` si le tag s'applique, `false` sinon
- `confidence` : score entre 0 et 1
- `source` : `"detected_absence"` ou `"computed_score"`

Il y a 3 familles de tags qu'il peut émettre :
- **ABSENCE_TAGS** — `sans_parfum`, `sans_savon`, `sans_sulfates`… (vrai si l'ingrédient est *absent*)
- **COMPUTED_TAGS** — `hypoallergenique`, `peaux_sensibles`… (calculé depuis les axes de risque)
- **MAPPED_TAGS** — `acne-imperfections`, `anti-age`, `peau-grasse`, `vegan`, `grossesse_risque`… (combinaison INCI + axes)

Depuis **TAG_DEFS v7** (2026-05-14), deux nouveaux MAPPED_TAGS sont émis :
- **`vegan`** (`present: true` si aucun ingrédient animal détecté ET INCI ≥ 5 ingrédients)
- **`grossesse_risque`** (`present: true` si contraindication grossesse détectée — retinoids, hydroquinone, formaldehyde donors, BHA leave-on top 10, oxybenzone/homosalate en sunscreen, HE risque top 8). Aurore mappe ce tag en `GROSSESSE_COMPATIBLE` avec `relevance='avoid'` via `TAG_CONFIG.grossesse_risque`.

Ces tags utilisent `assessment.context` (champ ajouté en v7) pour les checks context-dépendants (ex: `leaveOn` pour BHA, `formulaType === "sunscreen"` pour les filtres UV).

### `splitINCI(inci)` + `normalize(ingredient)` → parsing INCI

- `splitINCI` coupe la chaîne INCI en tableau d'ingrédients (gère les virgules, les points, les parenthèses INCI style `AQUA (WATER)`)
- `normalize` met en lowercase, enlève les accents et la ponctuation → utile pour faire des `includes()` fiables

---

## Les 6 passes de détection

### Passe 1 — `passes/auto-tag-detection.ts`

**Fichier :** `backend/src/features/auto-tagging/passes/auto-tag-detection.ts`
**Fonction exportée :** `detectAutoTags(inci, kind, options?)`

C'est la passe la plus "intelligente" : elle délègue à algo-derm et filtre les résultats selon notre config.

```
detectAutoTags("Aqua, Niacinamide, Retinol, ...", "serum")
    │
    ├─ analyzeINCI(inci)         → assessment (risques, bénéfices, couverture)
    ├─ splitINCI(inci)           → liste d'ingrédients bruts
    ├─ tagProduct(assessment, …) → 27 tags candidats avec confidence
    │
    └─ Pour chaque candidat :
         if (tag.present == false) → skip
         if (TAG_CONFIG[tag.id] n'existe pas) → skip
         if (TAG_CONFIG[tag.id].allow == false) → skip
         if (coverage.ratio < coverageFloor effectif) → skip   ← coverage floor
         if (source=='computed_score' ET confidence < confidenceFloor) → skip
         if (tag.id est comedogenicity ET produit est rinse-off) → skip
         → émettre le slug Aurore correspondant
```

**Deux floors orthogonaux** : `TagRule` a deux champs indépendants.

- `coverageFloor` (number, optionnel) — floor sur `assessment.coverage.ratio`.
  - Pour `source='detected_absence'` (sans-parfum, sans-sulfates, …) : c'est le seul gate qui compte. Algo-derm pose `confidence = min(coverage, 0.95)`, donc la coverage *est* le signal de confiance.
  - Pour `source='computed_score'` : floor additionnel, overrides le défaut global `COMPUTED_COVERAGE_FLOOR` (0.30) quand set.
- `confidenceFloor` (number, optionnel) — floor sur `candidate.confidence` (confidence d'axe émise par algo-derm). N'a de sens que pour `source='computed_score'` — ignoré sur absence tags (confidence ≡ coverage par construction).

**Coverage floor global (0.30)** : les tags `computed_score` (`acne-imperfections`, `pores-sebum`, `anti-age`…) tirent sur un seul pattern ingrédient. Si l'INCI est à >70 % d'ingrédients non identifiés par algo-derm (formules exotiques, parfumeries indé), un seul `niacinamide` ne doit pas étiqueter le produit comme "anti-acné" sur la base d'inférences à confiance basse. Les tags `detected_absence` (`sans-parfum`, etc.) ne sont pas concernés par ce défaut — ils fixent leur propre `coverageFloor` explicitement.

**Floors stackés (`non-comedogene`, `hypoallergenique`, `non_irritant`)** : un tag computed_score peut combiner `confidenceFloor` ET `coverageFloor`. Ex : `non-comedogene` exige `confidence ≥ 0.90` ET `coverage ≥ 0.60` (algo-derm fire sur `comedogenicity.risk ≤ 0.25`, très permissif — sans coverage haute, l'absence d'évidence n'est pas évidence d'absence).

**Debug overrides — sémantique symétrique (raise-only)** :

| Option | Effet | Cible |
|---|---|---|
| `confOverride: number` | **Raise** : `effectiveFloor = max(rule.confidenceFloor, confOverride)`. Ne baisse jamais un floor existant. | `computed_score` uniquement (absence tags n'ont pas de `confidenceFloor`). |
| `coverageMinOverride: number` | **Raise** : `effectiveFloor = max(baseFloor, coverageMinOverride)`. Symétrique avec `confOverride`. | Tous les tags. |
| `disableFloors: true` | Bypass total : ignore `coverageFloor` ET `confidenceFloor` (per-tag + global + les deux overrides ci-dessus). | Tous les tags. Reserved for audits — n'affecte pas les autres gates (`allow`, `excludeRinseOff`, `skipIf`, `not_present`, `unmapped`). |

Les deux overrides ne peuvent que tightening ; pour relâcher, utiliser `disableFloors`.

**Predicate `skipIf`** : `TagRule.skipIf?: (a: ProductAssessment) => boolean`. Disqualifieur tardif, appliqué après les floors. Évite les hard-codes `auroreSlug === S.X` qui breakent silencieusement à un rename. Exemple : `hypoallergenique` skip si `assessment.declarationOnlyRisk` (allergènes Annex III en trace position). Drop reason agrégé : `skip_if`.

`TAG_CONFIG` = source de vérité des tags acceptés et leurs seuils. Calibré sur dry-run corpus (~3600 produits skincare/solaire/bodycare).

Exemple d'entrées dans `TAG_CONFIG` :
```
'acne-imperfections'  → auroreSlug: ACNE_IMPERFECTIONS, confidenceFloor: 0.50, allow: true
'grossesse-compatible' → auroreSlug: GROSSESSE_COMPATIBLE, confidenceFloor: 0.75, allow: true
'sans_parfum'         → auroreSlug: SANS_PARFUM, coverageFloor: 0.70, allow: true
'non-comedogene'      → confidenceFloor: 0.90, coverageFloor: 0.60, excludeRinseOff: true
'repulpant'           → confidenceFloor: 1.0, allow: false   ← désactivé (78 % du corpus à 0.5)
'purifiant'           → confidenceFloor: 1.0, allow: false   ← désactivé R2 (subset strict de sebo-regulateur)
```

**Ce que ça tag (exemples) :**
- Niacinamide dans le top 5 → `acne-imperfections`, `pores-sebum`, `sebo-regulateur`
- Pas de parfum détecté + coverage ≥ 0.70 → `sans-parfum`
- Pas de retinoids/hydroquinone + coverage ≥ 0.75 → `grossesse-compatible` (secondary)
- Acide salicylique → `keratolytique`, `peau-sensible` (avoid), `acne-imperfections`

---

### Passe 2 — `passes/actif-class-detection.ts`

**Fichier :** `backend/src/features/auto-tagging/passes/actif-class-detection.ts`
**Fonction exportée :** `detectActifClasses(inci, hoistedIngredients?, kind?)`

Détecte les **clusters pharmacologiques** du produit. Substring matching sur l'INCI normalisé, **gaté par position INCI**.

```
detectActifClasses("Aqua, Retinol, Tocopherol, ...")
    │
    ├─ splitINCI(inci).map(normalize)   → ['aqua', 'retinol', 'tocopherol', ...]
    │
    └─ Pour chaque cluster défini dans ACTIF_CLASS_DEFS :
         cluster RETINOIDS : patterns = ['retinol', 'retinal', 'tretinoin', ...]
                             positionCap = ∞
         window = ingrédients.slice(0, positionCap)
         → si UN des ingrédients dans window contient UN des patterns → émettre le slug
```

**Position cap par cluster** — un actif pH-dépendant (AHA/BHA/PHA) au-delà de pos 10 (leave-on) est presque toujours un ajusteur de pH, pas un exfoliant. Tous les autres actifs sont fonctionnels même en zone trace : le corpus manuel les tague indépendamment de la position INCI.

| Cluster | Cap | Pourquoi |
|---------|----:|----------|
| AHA / BHA / PHA | 10 (leave-on) / 20 (rinse-off) | Acide pH-dépendant. Lactic acid pos 25 = pH adjuster. Cap rinse-off looser : surfactants déplacent l'acide vers pos 12-18 (CeraVe SA cleanser, Etude House AHA peel gel). |
| Capryloyl salicylic acid (ester BHA slow-release) | ∞ | Anchored sur la peau, fonctionnel à 0.05-0.1 % en pos 13-20. |
| Tous les autres (retinoids, vitamin-c, vitamin-e, ceramides, hyaluronic-acid, peptides, polyphenols, tyrosinase-inhibitors, enzymes-exfoliants) | ∞ | Dosages mg-range / antioxydant / signaling — fonctionnels même sub-1 %, le corpus manuel les tague à toute position. |

**Tentative `concentrationEstimate.belowBreakpoint` (rejetée 2026-05-14)** — pass 2 a brièvement consommé `assessment.matchedEvidenceByName.<ing>.concentrationEstimate.belowBreakpoint` (algo-derm flagge la zone EU <1 %) pour remplacer les position caps. Macro F1 chute 0.995 → 0.930 : vitamin-e / HA / ceramides fonctionnels en zone trace sont taggés par les annotateurs manuels malgré belowBreakpoint=true, et le breakpoint d'algo-derm contredit le gold même sur AHA/BHA/PHA (3 FN AHA + 2 FN BHA + 1 FP BHA + 2 FN PHA). Le champ `matchedEvidenceByName` reste exposé côté algo-derm pour de futurs consommateurs ; pass 2 n'en dépend pas.

Les clusters définis :
- `retinoids` — retinol, retinal, tretinoin, HPR, adapalene…
- `vitamin-c` — ascorbic acid, ascorbyl glucoside, SAP, MAP…
- `vitamin-e` — tocopherol, tocopheryl acetate, `vitamin e` / `vitamine-e` (marketing forms post parens-strip)
- `aha` — glycolic acid, lactic acid, mandelic acid…
- `bha` — salicylic acid, capryloyl salicylic acid, betaine salicylate
- `pha` — gluconolactone, lactobionic acid
- `ceramides` — ceramide np, ceramide ap, ceramide eop…
- `hyaluronic-acid` — sodium hyaluronate, HA, hydrolyzed HA…
- `peptides` — peptide, matrixyl, argireline…
- `polyphenols` — resveratrol, ferulic acid, camellia sinensis, `green tea` (marketing form post parens-strip), punica granatum. Scan dédoublé : patterns aussi appliqués à la chaîne raw INCI lowercased (via `RAW_SCAN_SLUGS`) pour catch les substrates fermentés stripés par algo-derm (`lactobacillus/punica granatum ferment`).
- `tyrosinase-inhibitors` — kojic acid, arbutin, tranexamic acid…
- `enzymes-exfoliants` — papain, bromelain, subtilisin

---

### Passe 3 — `shared/products/kind-to-tags.ts`

**Fichier :** `shared/src/products/kind-to-tags.ts` (déplacé depuis backend le 2026-05-13 pour partage filter pipeline P2).
**Fonctions exportées :** `detectKindTags(kind)` · `detectKindPrimaryType(kind)` · `kindsForTypeSlug(typeSlug)` · `availableTypeSlugs()`

Rien d'algo-derm ici. On regarde juste le `kind` du produit et on retourne les tags structurels qui vont avec. Zéro INCI.

```
detectKindTags("serum")  →  ['type-serum', 'step-traitement', 'zone-visage']
detectKindTags("sunscreen")  →  ['type-solaire', 'step-protection-solaire', 'moment-matin', 'zone-visage']
detectKindTags("body-lotion")  →  ['type-hydratant', 'texture-lait', 'zone-corps']
detectKindTags("eye-cream")  →  ['type-traitement', 'zone-yeux']
```

C'est un simple dictionnaire `kind → [slugs]`. Couvre : skincare (15 kinds), solaire (3 kinds), bodycare (7 kinds).

---

### Passe 4 — `passes/formula/`

**Dossier :** `backend/src/features/auto-tagging/passes/formula/` (14 fichiers + `index.ts`)

Détecteurs via patterns INCI / texte pour les signaux qu'algo-derm ne couvre pas nativement. `vegan` et `grossesse_risque` ont été migrés dans algo-derm (TAG_DEFS v7) — ce dossier ne les contient plus.

| Fichier | Slugs émis |
|---------|------------|
| `film-former.ts` | `occlusif`, `step-occlusif`, `semi-occlusif` |
| `solaire.ts` | `filtres-chimiques`, `filtres-mineraux` |
| `prebiotique.ts` | `prebiotique` |
| `reparation-cutanee.ts` | `reparation-cutanee` |
| `eczema-atopie.ts` | `eczema-atopie` |
| `repulpant.ts` | `repulpant` |
| `keratose-pilaire.ts` | `keratose-pilaire` |
| `step-nettoyage-1.ts` | `step-nettoyage-1` |
| `cernes-poches.ts` | `cernes-poches` |
| `fini-mat.ts` | `fini-mat`, `matifiant` |
| `pigments-verts.ts` | `pigments-verts` |
| `peau-normale.ts` | `peau-normale` (post-pass, abstient si autre skin-type fired) |
| `absence-claims.ts` | `sans-parfum` (name/description-based override quand coverage INCI < 0.7) |
| `texture.ts` | `texture-creme`, `texture-gel`, `texture-riche`, `texture-legere`, `texture-baume`, `texture-stick`, `non-gras` (+ champ `products.texture` direct mapping) |

#### Occlusif

Un produit est occlusif s'il contient un film-former physique en position significative (top 8 INCI).

```
detectOcclusifTags("Petrolatum, Lanolin, Glycerin, ...")
    │
    ├─ splitINCI → prendre les 8 premiers ingrédients max
    └─ Pour chaque ingrédient des 8 premiers :
         normalize(ingrédient).includes('petrolatum' | 'lanolin' | 'beeswax' | 'paraffin' | ...)
         → si match → émettre ['occlusif', 'step-occlusif']
```

Pourquoi top 8 ? Parce que le pétrolatum en position 25 dans un sérum à niacinamide c'est juste un émollient de texture, pas un vrai film-former.

#### Filtres solaires

```
detectSolaireTags(inci, kind, category)
    │
    ├─ if (kind pas dans ['sunscreen', 'after-sun', 'self-tanner'] ET category ≠ 'solaire') → return []
    │    // Zinc oxide peut apparaître dans des crèmes cica ou des dentifrices — on ne veut
    │    // pas tagger un soin visage comme filtre solaire juste parce qu'il contient du ZnO
    │
    ├─ normalize chaque ingrédient INCI
    ├─ si 'avobenzone' | 'octocrylene' | 'drometrizole' | 'tinosorb' | 'mexoryl'... → 'filtres-chimiques'
    └─ si 'zinc oxide' | 'titanium dioxide' → 'filtres-mineraux'
         // Un produit peut avoir les deux (formule hybride)
```

#### Prébiotique

Pattern matching sur les ingrédients connus : inuline, fructooligosaccharides, bifida ferment lysate, lactobacillus ferment, bifidobacterium…

#### Reparation-cutanee

Pattern matching sur les actifs cicatrisation / anti-inflammation en top 12 INCI : panthenol (provitamin B5), allantoin, centella asiatica (et ses isolés asiaticoside / madecassoside), bisabolol.

```
detectReparationCutanee("Aqua, Glycerin, Panthenol, Allantoin, ...")
    │
    ├─ splitINCI + normalize
    └─ Pour chaque ingrédient des 12 premiers :
         match contre [panthenol, allantoin, centella asiatica, asiaticoside,
                       madecassoside, bisabolol]
         → si match → émettre 'reparation-cutanee'
```

**Distinct de `barriere-cutanee`** (algo-derm) : ce dernier fire sur composition lipidique (ceramides + cholestérol OU benefit `barrierSupport ≥ 0.35`). `reparation-cutanee` couvre l'axe cicatrisation/inflammation, pas la barrière lipidique. Un produit peut avoir les deux (ex: cica cream avec ceramides ET panthenol).

#### Keratose-pilaire

KP-specific signal pour produits **corps leave-on uniquement** (body-lotion, body-oil).

```
detectKeratosePilaire(inci, kind)  →  ['keratose-pilaire'] | []
    │
    ├─ if (kind ∉ {body-lotion, body-oil}) → return []
    │   (exclusions : body-wash/scrub = rinse-off ; hand-cream/foot-cream =
    │    domaine concern différent — fissures vs bumps perifolliculaires)
    │
    ├─ Trigger A : urée en top 8 INCI
    │   (≥ 10 % keratolytic ; pos ≥ 9 = humectant trace, n'aide pas KP)
    │
    └─ Trigger B : lactic acid ET ammonium lactate ensemble en top 10
        (formule clinique AmLactin / Lac-Hydrin buffered-lactate ;
         lactic seul = pH adjuster, pas keratolytic)
```

#### Step-nettoyage-1

Premier nettoyage du double-cleanse — formules **oil/balm** uniquement.

```
detectStepNettoyage1(inci, kind)
    │
    ├─ if (kind ≠ cleanser) → return []
    │
    ├─ Trigger A : huile végétale OU ester émollient en top 3 INCI
    │   (caprylic/capric triglyceride, mineral oil, olea europaea, jojoba,
    │    butyrospermum parkii, ethylhexyl palmitate, squalane, etc.)
    │
    └─ Trigger B (exclusion) : pas de surfactant ionique en top 5
        (lauryl sulfate, laureth sulfate, olefin sulfonate
         → si présent → c'est un foaming gel cleanser = step-nettoyage-2)
```

#### Cernes-poches

Aire péri-orbitaire — caféine (vasoconstricteur, decongestionnant) ou peptides (microcirculation, fermeté).

```
detectCernesPoches(inci, kind)
    │
    ├─ if (kind ≠ eye-cream) → return []
    │   (gating strict pour éviter de tagger des serums/moisturizers
    │    avec peptides utilisés pour autre chose)
    │
    └─ caffeine OU peptide/matrixyl/argireline en top 12 INCI
       → 'cernes-poches'
```

#### Vegan et grossesse (déplacés dans algo-derm)

Depuis TAG_DEFS v7, les détections `vegan` et `grossesse_risque` sont dans algo-derm. Voir la section **Passe 1** ci-dessus pour la logique complète.

---

### Passe 5 — `passes/cross-signal-detection.ts`

**Fichier :** `backend/src/features/auto-tagging/passes/cross-signal-detection.ts`
**Fonction exportée :** `detectCrossSignalTags(actifClasses, kind)`

Ici on combine les résultats de la passe 2 (actif classes) avec le `kind` pour déduire des tags de **moment d'utilisation**. Ni algo-derm, ni l'INCI seul ne peuvent faire ça — il faut les deux.

```
detectCrossSignalTags(['retinoids', 'vitamin-c'], 'serum', inci)
    │
    ├─ RETINOIDS dans actifs ET serum est leave-on → 'moment-soir'
    │   (les rétinoïdes sont photosensibilisants — utilisation nocturne recommandée)
    │
    ├─ AHA ou BHA dans actifs ET leave-on → 'moment-soir'
    │   (même logique de photosensibilisation)
    │
    ├─ AHA/BHA/ENZYMES ET exfoliant/mask → 'moment-hebdomadaire'
    │   (peelings, masques exfoliants = utilisation périodique)
    │
    ├─ VITAMIN_C dans actifs ET leave-on → 'moment-matin'
    │   (vitamine C = antioxydant synergique avec la protection UV)
    │
    ├─ HYDROQUINONE dans INCI ET leave-on → 'moment-soir'
    │   (hydroquinone = depigmentant Rx-only EU, photodégradable, augmente
    │    la sensibilité UV ; détecté inline car pas un actif-class à part entière)
    │
    └─ RETINOIDS dans actifs ET body leave-on (body-lotion/body-oil/hand-cream/foot-cream) → 'anti-age'
        (algo-derm fire `anti-age` via tagProduct mais body INCI souvent à
         coverage < 0.30, gating le computed_score floor — re-émission ici)
```

**Cross-signal avoid (X1)** — règles émettant un slug existant en `relevance='avoid'` (même précédence que `grossesse_risque` algo-derm : avoid > secondary) :

```
detectCrossSignalAvoidTags(actifClasses, kind)
    │
    └─ RETINOIDS ET (AHA OU BHA) ET leave-on → 'peau-sensible' (avoid)
        (stack irritation classique : combo dérivés vitamine-A + exfoliants
         chimiques en routine quotidienne = irritation cumulative ; pas
         safe pour peaux sensibles sans supervision dermato)
```

Les kinds "rinse-off" (cleanser, body-wash, mask) sont exclus des signaux de photosensibilisation et de stack irritation — le produit ne reste pas en contact assez longtemps.

---

## Le runner : `runners/backfill/main.ts`

**Fichier :** `backend/src/features/auto-tagging/runners/backfill/main.ts`

C'est lui qui orchestre tout et écrit en DB. Il ne contient pas de logique de détection — il appelle juste les 6 fonctions dans l'ordre.

```
main()
    │
    ├─ Lit tous les produits eligibles (skincare + solaire + bodycare)
    ├─ Charge `brand_certifications` (map brandNormalized → certifications, pour pass 5b brand)
    ├─ Charge `product_ingredients JOIN ingredients` pour les concentrations (pour pass 5x percent-claim)
    ├─ Charge le dictionnaire slug → ID depuis product_tags en DB
    ├─ Charge les paires (productId, tagId, relevance) déjà présentes en DB
    │
    └─ Pour chaque produit :
         propose('acne-imperfections', 'secondary', 'algo-derm')
         propose('retinoids', 'secondary', 'actif-class')
         propose('type-serum', 'secondary', 'kind')
         propose('occlusif', 'secondary', 'formula')
         propose('moment-soir', 'secondary', 'cross-signal')
         propose('retinoids-tag', 'secondary', 'percent-claim')
         propose('moment-soir', 'secondary', 'interaction')
         propose('vegan', 'secondary', 'algo-derm')       ← via grossesse_risque TAG_CONFIG
         propose('grossesse-compatible', 'AVOID', 'algo-derm')  ← via grossesse_risque TAG_CONFIG
         
         // La fonction propose() déduplique en mémoire :
         // si le même (produit, tag) est émis deux fois, AVOID gagne sur SECONDARY
    │
    ├─ Classe chaque candidat :
    │   - Déjà en DB avec la bonne relevance → SKIP
    │   - Pas en DB → INSERT (onConflictDoNothing — les tags manuels gagnent)
    │   - En DB en 'secondary' mais on détecte 'avoid' → UPSERT (les avoid gagnent toujours)
    │
    └─ Stats et écriture en DB
```

**Usage :**
```bash
just backfill-auto-tags                           # dry-run (lecture seule, affiche les stats)
WRITE=1 just backfill-auto-tags                   # applique
SLUG=<slug> just backfill-auto-tags               # dry-run sur un seul produit (debug)
LIMIT=50 WRITE=1 just backfill-auto-tags          # applique sur 50 produits (test progressif)
TARGET=prod WRITE=1 just backfill-auto-tags       # prod (demande confirmation "PROD")
CONF_OVERRIDE=0.7 just backfill-auto-tags         # rehausse confidenceFloor (computed_score only)
```

---

## Le runner d'audit : `runners/audit/main.ts`

**Fichier :** `backend/src/features/auto-tagging/runners/audit/main.ts`

Similaire au backfill mais **lecture seule** et plus verbeux. Il montre pour chaque tag algo-derm :
- `hit` : combien de produits le recevraient
- `agree` : combien l'ont déjà manuellement (= recall sur le gold set)
- `new` : combien seraient des ajouts purs
- `avg_conf` / `min` / `max` : distribution de la confidence

Utile pour recalibrer les seuils dans `TAG_CONFIG`. Commande : `just audit-auto-tags`.

### Calibration drift detection — `TAG_HIT_RATE_BUDGET`

Le runner d'audit expose deux modes additionnels pour détecter la dérive de calibration entre baseline figée et corpus courant. Source de vérité : `passes/tag-budgets.ts`.

| Mode | Env var | Effet |
|---|---|---|
| Dump | `DUMP_BUDGETS=1` | Émet en fin de run un bloc TS `TAG_HIT_RATE_BUDGET` prêt-à-coller dans `passes/tag-budgets.ts`. Auto baseline : `max = min(1, ceil(hit_rate × 1.5, 0.05))`. |
| Check | `CHECK=1` (ou `just audit-auto-tags-check`) | Valide `hit_rate = hit / withInci(category)` par `(slug, category)` contre `TAG_HIT_RATE_BUDGET`. Exit 1 si au moins un FAIL. |

**Sémantique CHECK :**

- `hit_rate > max` → **FAIL** (régression — le tag s'élargit hors budget)
- `min` défini et `hit_rate < min` → **FAIL** (tag structurel qui disparaît)
- Tag émis mais sans entrée budget → **FAIL** (durci 2026-05-13 ; tout nouveau emitter doit déclarer son budget avant merge)
- Sinon → **OK**

**Pourquoi per-category :** skincare/solaire/bodycare ont des distributions INCI distinctes (filtres UV sur solaires, surfactants sur bodycare). Un budget global accepterait du bruit sur une catégorie ou ferait FAIL faussement sur une autre.

**Sensibles à tightener manuellement après un `DUMP_BUDGETS` :**

- `comedogene` — leave-on safety, doit rester rare
- `non-comedogene` — claim fort, ne doit pas creep sur INCI bruité
- `peau-sensible` — proxy reactive-skin dans les avoid flows
- `hypoallergenique` — claim regulatory-adjacent

**Workflow recalibration :**

1. `DUMP_BUDGETS=1 just audit-auto-tags > /tmp/dump.log`
2. Paster le bloc dans `passes/tag-budgets.ts`, capper > 1.0 si besoin
3. Tightener les 4 sensibles ci-dessus (~ current × 2 au lieu de × 1.5)
4. Vérifier : `just audit-auto-tags-check` → 0 FAIL attendu

CI : job `audit-auto-tags` dans `.github/workflows/ci.yml` (Postgres service → drizzle-kit migrate → load `backend/src/db/snapshot/data.sql` → `CHECK=1`).

---

## Comment les tags arrivent à un produit

Trois chemins, tous via l'orchestrator partagé (`features/auto-tagging/orchestrator.ts`) → output identique pour un même input produit :

1. **Création API runtime** — `features/products/service.ts createProduct()` appelle `writeTagsForProduct(product.id)` après l'insert. Inline, fail-soft (une erreur tagging log warn, ne bloque pas la création).
2. **Seed initial** — `db/seed/seeders/seed-core.ts` appelle `detectAllAutoTags` pendant le reseed depuis zéro. Les produits du seed JSON ont leurs tags auto-générés dès le premier insert.
3. **Backfill** — `features/auto-tagging/runners/backfill/main.ts` ré-applique sur les produits **déjà en DB** (e.g. produits ajoutés avant que des règles existent, ou recalibration des seuils).

La parité des trois chemins est garantie par `tests/auto-tag-orchestrator-parity.test.ts`.

---

## Gold set — benchmark de précision/rappel

### Ce que c'est

Un corpus de **60-80 produits annotés à la main** qui sert d'oracle pour mesurer la qualité de détection des passes 2 et 4. Pour chaque produit, on note quels tags sont confirmés présents et quels tags sont confirmés absents — les autres restent non évalués (les métriques les ignorent).

Fichiers :
- `data/gold-set/annotations.json` — corpus actif (schéma `2026-05-08`)
- `gold-set/fixtures.ts` — constantes, validation, sérialisation
- `gold-set/metrics.ts` — primitives de calcul (Brier, ECE, P/R/F1)
- `runners/gold-set-bootstrap.ts` — sampler stratifié (lecture seule)

### Scope — 16 tags focus

Le gold set couvre uniquement les passes **déterministes** (pattern matching + position cap). La passe 1 (algo-derm, scores [0,1]) n'est pas dans le scope actuel.

| Famille | Tags |
|---------|------|
| Clusters actifs (passe 2) | `retinoids`, `vitamin-c`, `vitamin-e`, `hyaluronic-acid`, `peptides`, `polyphenols`, `enzymes-exfoliants`, `ceramides`, `tyrosinase-inhibitors` |
| Acides (passe 2) | `aha`, `bha`, `pha` |
| Sensoriels (passe 4) | `fini-mat`, `texture-legere`, `texture-riche` |

Ces tags utilisent uniquement la **position INCI comme proxy de concentration** — aucune donnée de concentration réelle exploitée. Les caps varient par cluster (AHA/BHA/PHA : top 10 ; ceramides : top 15 ; autres : top 12).

### Schéma `annotations.json`

```json
{
  "schemaVersion": "2026-05-08",
  "rulesetVersion": "products-branch@c0f5b16c",
  "annotations": [
    {
      "productSlug": "la-roche-posay-effaclar-duo-plus",
      "kind": "moisturizer",
      "category": "skincare",
      "present": ["bha", "niacinamide"],
      "absent": ["retinoids", "aha"],
      "annotatedAt": "2026-05-09",
      "sampledFor": ["bha"],
      "notes": "salicylic acid pos 6, no glycolic"
    }
  ]
}
```

- `present` : tags que l'annotateur confirme (INCI vérifié)
- `absent` : tags que l'annotateur confirme absents
- non listé = non évalué → **ignoré par les métriques**
- `sampledFor` : quel focus tag a causé l'inclusion dans le corpus (info bootstrap)

### Workflow

```
1. Bootstrap (une fois / quand on veut élargir le corpus)
   just gold-set-bootstrap
   → sampler stratifié : 4 positifs + 2 négatifs par focus tag
   → écrit des squelettes dans annotations.json (idempotent)

2. Annotation manuelle
   → ouvrir annotations.json
   → pour chaque produit : inspecter l'INCI, remplir present[] et absent[]
   → ne pas forcer l'exhaustivité — annoter seulement ce qu'on est sûr

3. Benchmark
   just audit-gold-set
   → orchestre chaque produit annoté → compare output vs annotations
   → affiche P/R/F1 + Brier/ECE par tag + macro/micro averages
   STRICT=1 just audit-gold-set   # fail si des annotations sont vides
```

### Métriques — `gold-set/metrics.ts`

Primitives pures (pas de DB, testables en isolation). Input : tableau `{ p, y }` où `p ∈ [0,1]` est la confiance prédite et `y ∈ {0,1}` est la vérité terrain.

| Métrique | Formule | Interprétation |
|----------|---------|----------------|
| **Brier** | `mean((p - y)²)` | 0 = parfait, 0.25 = aléatoire. Pour passes déterministes (p ∈ {0,1}) : réduit au taux de mauvaise classification. |
| **ECE** | `Σ (n_bin/N) × \|avg_conf_bin - accuracy_bin\|` | Calibration : à quel point la confiance prédit la précision réelle. Signal utile uniquement si `p ∉ {0,1}`. |
| **Precision** | `TP / (TP + FP)` | Parmi les tags émis, combien sont corrects. |
| **Recall** | `TP / (TP + FN)` | Parmi les vrais positifs, combien sont détectés. |
| **F1** | `2 × P × R / (P + R)` | Harmonie P/R. Métrique principale pour passes déterministes. |
| **Macro avg** | Moyenne non pondérée par tag | Tous les tags comptent pareil — tags rares pas noyés. |
| **Micro avg** | Pool TP/FP/FN sur tous tags | Pondéré par volume — tags fréquents dominent. |

Pour les passes 2-6 (déterministes), Brier et ECE n'apportent pas de signal de calibration supplémentaire au-delà de F1. Ils deviendraient utiles si on ajoutait la passe 1 (algo-derm, scores continus) au gold set.

---

## Gold set × Calibration — deux outils distincts

Le sous-système de qualité utilise **deux mécanismes complémentaires** qui ne répondent pas à la même question.

### Gold set — oracle de régression

> "Cette règle est-elle correcte sur des produits connus ?"

- Corpus **figé** d'~80 produits annotés manuellement.
- Se déclenche après une modif de règle : `just audit-gold-set`.
- Mesure P/R/F1 par tag → détecte FP/FN introduits par un changement de pattern ou de cap.
- Risque : **overfitting** si on optimise les règles directement sur le corpus (80 produits = petit). Le gold set doit servir de garde-fou, pas de cible d'optimisation.
- Signal de rulesetVersion : quand un détecteur change, `rulesetVersion` dans `annotations.json` devient périmé → ré-annoter les produits affectés.

### `TAG_HIT_RATE_BUDGET` — dérive sur corpus complet

> "Ce tag s'applique-t-il à une proportion réaliste de produits ?"

- Baseline figée de hit rates par `(slug, category)` dans `passes/tag-budgets.ts`.
- Se déclenche en CI : `CHECK=1 just audit-auto-tags` → exit 1 si un tag dépasse son budget.
- Mesure la **dérive de couverture** sur les ~3600 produits, pas la justesse sur un sous-ensemble annoté.
- Ne détecte pas les FP/FN individuels — un tag qui rate un produit connu mais tient son hit rate global passerait CHECK sans problème.

### Quand utiliser lequel

| Situation | Outil |
|-----------|-------|
| Ajout/modif d'un pattern de détection | Gold set en premier (P/R sur annotés) + CHECK ensuite (budget global) |
| Bump `TAG_DEFS_VERSION` algo-derm | CHECK (hit rates peuvent changer) + gold set si passe 1 impactée |
| Nouveau tag sans annotations gold set | CHECK uniquement (déclarer budget avant merge) |
| Recalibration des seuils confidence/coverage | Gold set (impact direct sur FP/FN) + CHECK |
| Ajout de produits au corpus DB | CHECK (distribution change) — gold set inchangé |

---

## Résumé des fichiers

| Fichier | Rôle | Utilise algo-derm ? |
|---------|------|---------------------|
| `orchestrator.ts` | Lance toutes les passes dans l'ordre, déduplique (avoid > secondary), hoist `analyzeINCI` + `stripMarketingPreamble` une fois | `analyzeINCI` + `splitINCI` + `normalize` |
| `lib/ingredient-resolver.ts` | `stripMarketingPreamble` — supprime le prose marketing avant l'INCI (589 produits K-beauty / EU) | Non |
| `passes/auto-tag-detection.ts` | Passe 1 — concerns, skin type, comédogénicité, sans-parfum, grossesse-compatible secondary | `analyzeINCI` + `tagProduct` + `splitINCI` |
| `passes/tag-budgets.ts` | A3 — `TAG_HIT_RATE_BUDGET` per-category, lu par `CHECK=1` du runner d'audit | Non |
| `passes/actif-class-detection.ts` | Passe 2 — clusters pharmacologiques | `splitINCI` + `normalize` |
| `shared/products/kind-to-tags.ts` (Passe 3) | TYPE_*, ZONE_*, STEP_*, MOMENT_*, TEXTURE_* + reverse lookup `kindsForTypeSlug` (P2 filter) | Non |
| `passes/formula/` | Passe 4 — 14 fichiers (occlusif, semi-occlusif, solaires, prébiotique, eczema, repulpant, KP, step-nettoyage, cernes, fini-mat, pigments-verts, peau-normale, reparation-cutanee, absence-claims, texture). `vegan` et `grossesse-avoid` supprimés — migrés dans algo-derm v7. | `splitINCI` + `normalize` |
| `passes/cross-signal-detection.ts` | Passe 5 — MOMENT_SOIR/MATIN depuis actif × kind ; `detectInteractionSecondaryTags` (passe 5a) — photosensibilité multi-HE depuis assessment | `analyzeINCI` (passe 5a) |
| `passes/percent-claim-detection.ts` | Passe 5x — fallback `% INCI structuré` quand INCI fragile | `splitINCI` |
| `passes/brand-cert-detection.ts` | Passe 5b — labels brand (vegan / cruelty-free / bio-naturel) depuis `brand_certifications` | Non |
| `passes/auto-tag-avoid.ts` | Passe 6 — agrégateur avoid (grossesse + cross-signal + interactions algo-derm) | Via les passes ci-dessus |
| `write.ts` | API runtime — `writeTagsForProduct(productId)` consommé par `createProduct()` | Via orchestrator |
| `runners/backfill/main.ts` | Runner batch — ré-applique l'orchestrator sur toute la DB | Via orchestrator |
| `runners/audit/main.ts` | Runner audit — dry-run avec stats par tag (passe 1 uniquement) | Via `auto-tag-detection.ts` |

---
