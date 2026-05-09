# Auto-tagging des produits — comment ça marche

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
    ├─► [Passe 1] algo-derm tagProduct()  → concerns, types de peau, comédogénicité…
    ├─► [Passe 2] actif-class             → clusters pharmacologiques (retinoids, AHA, vit C…)
    ├─► [Passe 3] kind → tags             → TYPE_*, ZONE_*, STEP_*, MOMENT_*
    ├─► [Passe 4] formula patterns        → occlusif, filtres solaires, prébiotique
    ├─► [Passe 5] cross-signal            → MOMENT_SOIR/MATIN depuis actif × kind
    └─► [Passe 6] grossesse-avoid         → tag 'avoid' pour ingrédients contre-indiqués

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
- **MAPPED_TAGS** — `acne-imperfections`, `anti-age`, `peau-grasse`… (combinaison INCI + axes)

### `splitINCI(inci)` + `normalize(ingredient)` → parsing INCI

- `splitINCI` coupe la chaîne INCI en tableau d'ingrédients (gère les virgules, les points, les parenthèses INCI style `AQUA (WATER)`)
- `normalize` met en lowercase, enlève les accents et la ponctuation → utile pour faire des `includes()` fiables

---

## Les 6 passes de détection

### Passe 1 — `utils/auto-tag-detection.ts`

**Fichier :** `backend/src/db/seed/utils/auto-tag-detection.ts`
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
         if (tag.source == 'computed_score' ET coverage.ratio < 0.30) → skip   ← coverage floor
         if (tag.confidence < TAG_CONFIG[tag.id].minConf) → skip
         if (tag.id est comedogenicity ET produit est rinse-off) → skip
         → émettre le slug Aurore correspondant
```

**Coverage floor (0.30)** : les tags `computed_score` (`acne-imperfections`, `pores-sebum`, `anti-age`…) tirent sur un seul pattern ingrédient. Si l'INCI est à >70 % d'ingrédients non identifiés par algo-derm (formules exotiques, parfumeries indé), un seul `niacinamide` ne doit pas étiqueter le produit comme "anti-acné" sur la base d'inférences à confiance basse. Les tags `detected_absence` (`sans-parfum`, etc.) ne sont pas concernés — ils sont déjà gatés par `absenceConfidence = min(coverage, 0.95)`.

**Per-tag `coverageMin`** (R3) : un tag peut surcharger le floor global. `non-comedogene` exige 0.60 (algo-derm fire sur `comedogenicity.risk ≤ 0.25`, très permissif — sans coverage haute, l'absence d'évidence n'est pas évidence d'absence). Le débug `coverageMinOverride` bypass à la fois global ET per-tag.

Le `TAG_CONFIG` est la clé du fichier : c'est lui qui dit quels tags on accepte et à quel seuil de confiance. Calibré à partir d'un dry-run sur 2 912 produits skincare le 2026-05-07.

Exemple d'entrées dans `TAG_CONFIG` :
```
'acne-imperfections' → auroreSlug: ACNE_IMPERFECTIONS, minConf: 0.50, allow: true
'grossesse-compatible' → auroreSlug: GROSSESSE_COMPATIBLE, minConf: 0.75, allow: true
'sans_parfum' → auroreSlug: SANS_PARFUM, minConf: 0.70, allow: true
'repulpant' → minConf: 1.0, allow: false   ← désactivé (78 % du corpus à 0.5)
'purifiant' → minConf: 1.0, allow: false   ← désactivé R2 (subset strict de sebo-regulateur)
```

**Ce que ça tag (exemples) :**
- Niacinamide dans le top 5 → `acne-imperfections`, `pores-sebum`, `sebo-regulateur`
- Pas de parfum détecté + coverage ≥ 0.70 → `sans-parfum`
- Pas de retinoids/hydroquinone + coverage ≥ 0.75 → `grossesse-compatible` (secondary)
- Acide salicylique → `keratolytique`, `peau-sensible` (avoid), `acne-imperfections`

---

### Passe 2 — `utils/actif-class-detection.ts`

**Fichier :** `backend/src/db/seed/utils/actif-class-detection.ts`
**Fonction exportée :** `detectActifClasses(inci)`

Détecte les **clusters pharmacologiques** du produit. Plus simple que la passe 1 : juste du substring matching sur l'INCI normalisé, **gaté par position INCI**.

```
detectActifClasses("Aqua, Retinol, Tocopherol, ...")
    │
    ├─ splitINCI(inci).map(normalize)   → ['aqua', 'retinol', 'tocopherol', ...]
    │
    └─ Pour chaque cluster défini dans ACTIF_CLASS_DEFS :
         cluster RETINOIDS : patterns = ['retinol', 'retinal', 'tretinoin', ...]
                             positionCap = 12 (défaut)
         window = ingrédients.slice(0, positionCap)
         → si UN des ingrédients dans window contient UN des patterns → émettre le slug
```

**Position cap par cluster** — un actif au-delà de la position fonctionnelle est presque toujours un trace stabilizer / ajusteur de pH / antioxydant préservatif, pas un actif fonctionnel.

| Cluster | Cap | Pourquoi |
|---------|----:|----------|
| AHA / BHA / PHA | 10 | Acide pH-dépendant — concentration fonctionnelle obligatoirement tôt dans l'INCI. Lactic acid en pos 25 = pH adjuster. |
| Enzymes-exfoliants | 10 | Activité enzymatique requiert concentration fonctionnelle. |
| Hyaluronic-acid | 10 | Humectant : toujours tôt si fonctionnel. |
| Ceramides | 15 | Blends typiques < 1 % mais fonctionnels (CeraVe etc.). |
| Peptides | 15 | Dosages mg-range, souvent listés tard dans des blends complexes. |
| Retinoids / Vitamin-C / Vitamin-E / Polyphenols / Tyrosinase-inhibitors | 12 (défaut) | Tocopherol pos 30 = preservative trace, retinol pos 25 = stabilizer trace. |

Les clusters définis :
- `retinoids` — retinol, retinal, tretinoin, HPR, adapalene…
- `vitamin-c` — ascorbic acid, ascorbyl glucoside, SAP, MAP…
- `vitamin-e` — tocopherol, tocopheryl acetate
- `aha` — glycolic acid, lactic acid, mandelic acid…
- `bha` — salicylic acid, capryloyl salicylic acid, betaine salicylate
- `pha` — gluconolactone, lactobionic acid
- `ceramides` — ceramide np, ceramide ap, ceramide eop…
- `hyaluronic-acid` — sodium hyaluronate, HA, hydrolyzed HA…
- `peptides` — peptide, matrixyl, argireline…
- `polyphenols` — resveratrol, ferulic acid, camellia sinensis…
- `tyrosinase-inhibitors` — kojic acid, arbutin, tranexamic acid…
- `enzymes-exfoliants` — papain, bromelain, subtilisin

---

### Passe 3 — `utils/kind-tag-detection.ts`

**Fichier :** `backend/src/db/seed/utils/kind-tag-detection.ts`
**Fonction exportée :** `detectKindTags(kind)`

Rien d'algo-derm ici. On regarde juste le `kind` du produit et on retourne les tags structurels qui vont avec. Zéro INCI.

```
detectKindTags("serum")  →  ['type-serum', 'step-traitement', 'zone-visage']
detectKindTags("sunscreen")  →  ['type-solaire', 'step-protection-solaire', 'moment-matin', 'zone-visage']
detectKindTags("body-lotion")  →  ['type-hydratant', 'texture-lait', 'zone-corps']
detectKindTags("eye-cream")  →  ['type-traitement', 'zone-yeux']
```

C'est un simple dictionnaire `kind → [slugs]`. Couvre : skincare (15 kinds), solaire (3 kinds), bodycare (7 kinds).

---

### Passe 4 — `utils/formula-detection.ts`

**Fichier :** `backend/src/db/seed/utils/formula-detection.ts`
**Fonctions exportées :** `detectOcclusifTags`, `detectSolaireTags`, `detectPrebiotique`, `detectReparationCutanee`, `detectKeratosePilaire`, `detectStepNettoyage1`, `detectCernesPoches`, `detectGrossesseAvoid`

7 détections via patterns INCI (que algo-derm ne couvre pas) + 1 détection grossesse-avoid.

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

#### Grossesse-avoid (important)

```
detectGrossesseAvoid(inci, kind)  →  true | false
    │
    ├─ Tier 1 — TOUJOURS éviter (toute position INCI) :
    │   Rétinoïdes → retinol, retinal, retinaldehyde, HPR/granactive retinoid, tretinoin,
    │               adapalene, tazarotene, tous les retinyl-*
    │   Hydroquinone
    │   Formaldehyde donors → DMDM hydantoin, diazolidinyl urea, imidazolidinyl urea,
    │                          quaternium-15, bronopol, sodium hydroxymethylglycinate,
    │                          methenamine, benzylhemiformal, bronidox
    │                          (fonctionnels en trace = pas de gating)
    │
    ├─ Tier 2 — Éviter dans ce contexte :
    │   Oxybenzone (benzophenone-3/4, sulisobenzone) → uniquement si sunscreen/solaire
    │   Homosalate (homomenthyl salicylate) → uniquement si sunscreen/solaire
    │                                          (SCCS 2022 max 2.2 %, endocrine concern)
    │   Acide salicylique en leave-on → uniquement si kind ≠ cleanser/mask/exfoliant
    │                                    ET position ≤ 10 dans INCI (concentration fonctionnelle)
    │   HE à risque (peppermint, clary sage, rosemary verbenone CT)
    │     → token doit contenir genus latin + 'oil' (top 8 INCI uniquement)
    │     → distingue EO de leaf extract / water (extraits non flaggés)
    │
    └─ Si true → émettre 'grossesse-compatible' avec relevance='AVOID'
```

Pourquoi `avoid` et pas juste "ne pas émettre secondary" ? Parce qu'on veut pouvoir **afficher un avertissement** dans l'UI pour ces produits, pas juste les ignorer silencieusement.

---

### Passe 5 — `utils/cross-signal-detection.ts`

**Fichier :** `backend/src/db/seed/utils/cross-signal-detection.ts`
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

**Cross-signal avoid (X1)** — règles émettant un slug existant en `relevance='avoid'` (même précédence que `grossesse-avoid` : avoid > secondary) :

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

## Le runner : `runners/backfill-auto-tags.ts`

**Fichier :** `backend/src/db/seed/runners/backfill-auto-tags.ts`

C'est lui qui orchestre tout et écrit en DB. Il ne contient pas de logique de détection — il appelle juste les 6 fonctions dans l'ordre.

```
main()
    │
    ├─ Lit tous les produits eligibles (skincare + solaire + bodycare)
    ├─ Charge le dictionnaire slug → ID depuis product_tags en DB
    ├─ Charge les paires (productId, tagId, relevance) déjà présentes en DB
    │
    └─ Pour chaque produit :
         propose('acne-imperfections', 'secondary', 'algo-derm')
         propose('retinoids', 'secondary', 'actif-class')
         propose('type-serum', 'secondary', 'kind')
         propose('occlusif', 'secondary', 'formula')
         propose('moment-soir', 'secondary', 'cross-signal')
         if (grossesseAvoid) propose('grossesse-compatible', 'AVOID', 'grossesse-avoid')
         
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
make backfill-auto-tags                     # dry-run (lecture seule, affiche les stats)
make backfill-auto-tags WRITE=1             # applique
make backfill-auto-tags SLUG=<slug>         # dry-run sur un seul produit (debug)
make backfill-auto-tags LIMIT=50 WRITE=1   # applique sur 50 produits (test progressif)
```

---

## Le runner d'audit : `runners/audit-auto-tags.ts`

**Fichier :** `backend/src/db/seed/runners/audit-auto-tags.ts`

Similaire au backfill mais **lecture seule** et plus verbeux. Il montre pour chaque tag algo-derm :
- `hit` : combien de produits le recevraient
- `agree` : combien l'ont déjà manuellement (= recall sur le gold set)
- `new` : combien seraient des ajouts purs
- `avg_conf` / `min` / `max` : distribution de la confidence

Utile pour recalibrer les seuils dans `TAG_CONFIG`. Une commande `make audit-auto-tags`.

---

## Comment les tags arrivent aussi au seed initial

Le fichier `runners/seed-core.ts` appelle lui aussi `detectAutoTags` et `detectActifClasses` pendant le seed complet (reseed depuis zéro). Donc les nouveaux produits qui entrent dans le seed ont déjà leurs tags auto-générés dès le premier insert.

Le `backfill-auto-tags.ts` sert pour les produits **déjà en DB** qui n'ont pas encore ces tags, et pour ré-appliquer quand on améliore les règles.

---

## Résumé des fichiers

| Fichier | Rôle | Utilise algo-derm ? |
|---------|------|---------------------|
| `utils/auto-tag-detection.ts` | Passe 1 — concerns, skin type, comédogénicité, sans-parfum, grossesse-compatible secondary | `analyzeINCI` + `tagProduct` + `splitINCI` |
| `utils/actif-class-detection.ts` | Passe 2 — clusters pharmacologiques | `splitINCI` + `normalize` |
| `utils/kind-tag-detection.ts` | Passe 3 — TYPE_*, ZONE_*, STEP_*, MOMENT_*, TEXTURE_* | Non |
| `utils/formula-detection.ts` | Passe 4 — occlusif, filtres solaires, prébiotique, reparation-cutanee, keratose-pilaire, step-nettoyage-1, cernes-poches, grossesse-avoid | `splitINCI` + `normalize` |
| `utils/cross-signal-detection.ts` | Passe 5 — MOMENT_SOIR/MATIN depuis actif × kind | Non |
| `runners/backfill-auto-tags.ts` | Runner principal — orchestre les 6 passes, écrit en DB | Via les utils ci-dessus |
| `runners/audit-auto-tags.ts` | Runner audit — dry-run avec stats par tag (passe 1 uniquement) | Via `auto-tag-detection.ts` |

---

## Chiffres (dry-run 2026-05-07, 3 661 produits)

### Calibration initiale (avant position gating)

```
algo-derm      →  6 125 nouvelles paires
actif-class    →  2 189 nouvelles paires
kind           →  4 054 nouvelles paires
formula        →  1 065 nouvelles paires  (occlusif, filtres, prébiotique)
cross-signal   →    457 nouvelles paires  (moment-soir, moment-matin)
grossesse-avoid→    137 produits taggés avoid  (retinoids, hydroquinone, oxybenzone, BHA leave-on)
─────────────────────────────────────────
Total à insérer:  14 027 paires
Déjà en DB     :  12 881 (tags manuels ou seed précédent)
```

### Après position gating + coverage floor + hydroquinone cross-signal (2026-05-07)

```
algo-derm      →  6 125 paires      (∆ 0 — coverage floor 0.30 rarement déclenché, DB algo-derm large)
actif-class    →    334 paires      (∆ −1 855 ; −85 % — position gating supprime tocopherol pos 30,
                                     retinol stabilizer trace, lactic acid pH adjuster, etc.)
kind           →  4 054 paires      (∆ 0)
formula        →  1 065 paires      (∆ 0)
cross-signal   →    221 paires      (∆ −236 ; −52 % — découle de la baisse actif-class, plus
                                     hydroquinone leave-on ajouté)
grossesse-avoid→    137 paires      (∆ 0)
─────────────────────────────────────────
Total à insérer:  11 936 paires     (∆ −2 091 ; −15 %)
Déjà en DB     :  10 746
```

**Lecture** : la précision des actif-classes a augmenté massivement (les faux positifs trace ont été éliminés), au prix d'un volume divisé par ~6. Recall sur les vrais actifs fonctionnels est maintenu — un retinol à pos 5 reste détecté ; seuls les trace stabilizers à pos 25+ sont filtrés.

### Safety pass R1 — formaldehyde donors + homosalate + HE risque (2026-05-07)

```
algo-derm      →  6 102 paires      (∆ −23 — fluctuation marginale)
actif-class    →    334 paires      (∆ 0)
kind           →  4 054 paires      (∆ 0)
formula        →  1 065 paires      (∆ 0)
cross-signal   →    221 paires      (∆ 0)
grossesse-avoid→    199 paires      (∆ +62 ; +45 % — donors formaldéhyde courants en cosméto
                                     drugstore, homosalate dans solaires chimiques, qq HE risque)
─────────────────────────────────────────
Total à insérer:  11 975 paires
Déjà en DB     :  10 749
```

**Lecture** : safety > recall — 62 produits supplémentaires marqués `grossesse-compatible/avoid`. Les EO sont gatés top-8 pour éviter les flags sur fragrance traces ; les donors le sont sans gating car fonctionnels en concentration préservatif (~0.1-0.6 %).

### Dedup pass R2 — `purifiant` désactivé (2026-05-07)

```
algo-derm      →  5 947 paires      (∆ −155 — toutes paires `purifiant` retirées)
actif-class    →    334 paires      (∆ 0)
kind           →  4 054 paires      (∆ 0)
formula        →  1 065 paires      (∆ 0)
cross-signal   →    221 paires      (∆ 0)
grossesse-avoid→    199 paires      (∆ 0)
─────────────────────────────────────────
Total à insérer:  11 820 paires
Déjà en DB     :  10 748
Tags algo-derm allow=true : 22 → 21
```

**Lecture** : 155 produits libérés du tag redondant. `sebo-regulateur` (effet) et `pores-sebum` (concerne) couvrent le même territoire avec axes sémantiques distincts.

### Calibration pass R3 — `non-comedogene` resserré (2026-05-07)

```
algo-derm      →  5 867 paires      (∆ −80 — minConf 0.85 → 0.90 + coverageMin 0.60
                                     écarte les FP basse-couverture / basse-confiance)
actif-class    →    334 paires      (∆ 0)
kind           →  4 054 paires      (∆ 0)
formula        →  1 065 paires      (∆ 0)
cross-signal   →    221 paires      (∆ 0)
grossesse-avoid→    199 paires      (∆ 0)
─────────────────────────────────────────
Total à insérer:  11 740 paires
Déjà en DB     :  10 744
```

**Lecture** : 80 paires `non-comedogene` à confiance < 0.90 OU coverage < 0.60 retirées. Le tag reste émis pour les formules dont la non-comédogénicité est solidement étayée — humectants/silicones bien identifiés en majorité.

### Concern pass C4 — `reparation-cutanee` activé (2026-05-07)

```
algo-derm      →  5 867 paires      (∆ 0)
actif-class    →    334 paires      (∆ 0)
kind           →  4 054 paires      (∆ 0)
formula        →  1 852 paires      (∆ +787 — `reparation-cutanee` couvre les formules
                                     panthenol/allantoin/centella/bisabolol top 12)
cross-signal   →    221 paires      (∆ 0)
grossesse-avoid→    199 paires      (∆ 0)
─────────────────────────────────────────
Total à insérer:  12 527 paires
Déjà en DB     :  10 801
```

**Lecture** : 787 produits ont au moins un actif cicatrisation/inflammation en concentration fonctionnelle. Distinct de `barriere-cutanee` (lipid composition) — un cica cream avec ceramides + panthenol obtient les deux.

### Concern pass C2 — `keratose-pilaire` activé (2026-05-07)

```
algo-derm      →  5 867 paires      (∆ 0)
actif-class    →    334 paires      (∆ 0)
kind           →  4 054 paires      (∆ 0)
formula        →  1 858 paires      (∆ +6 — body-lotion/oil avec urée top 8
                                     ou combo lactate)
cross-signal   →    221 paires      (∆ 0)
grossesse-avoid→    199 paires      (∆ 0)
─────────────────────────────────────────
Total à insérer:  12 533 paires
Déjà en DB     :  10 807
```

**Lecture** : volume modeste (6 paires) car les produits KP-spécifiques sont une niche du corpus (AmLactin, Eucerin UreaRepair, CeraVe SA Body Cream type). Précision élevée : on cible les formules avec keratolytic dosing fonctionnel uniquement.

### Concern pass C5 — `anti-age` body cross-signal (2026-05-07)

```
algo-derm      →  5 867 paires      (∆ 0)
actif-class    →    334 paires      (∆ 0)
kind           →  4 054 paires      (∆ 0)
formula        →  1 858 paires      (∆ 0)
cross-signal   →    221 paires      (∆ 0 — defense-in-depth, voir lecture)
grossesse-avoid→    199 paires      (∆ 0)
```

**Lecture** : 0 paires ajoutées dans le corpus actuel. Audit DB : 4 produits body avec retinoids en INCI ; 2 ont déjà `anti-age` via algo-derm (retinoid en pos fonctionnelle), 2 ne l'ont pas (retinoid past pos 12 = trace stabilizer, **correctement non taggé**). Le cross-signal reste utile en defense-in-depth pour le cas (rare ici) retinoid en pos ≤ 12 + INCI globale à très faible coverage qui blockerait le computed_score floor d'algo-derm.

### Concern pass C1 + C3 — `step-nettoyage-1` + `cernes-poches` activés (2026-05-07)

```
algo-derm      →  5 867 paires      (∆ 0)
actif-class    →    334 paires      (∆ 0)
kind           →  4 054 paires      (∆ 0)
formula        →  1 931 paires      (∆ +73 — C1 oil/balm cleanser + C3 eye-cream caffeine/peptide)
cross-signal   →    221 paires      (∆ 0)
grossesse-avoid→    199 paires      (∆ 0)
─────────────────────────────────────────
Total à insérer:  12 606 paires
Déjà en DB     :  10 842
```

**Lecture** : 73 paires nouvelles, deux signaux activés ensemble. C1 cible les oil/balm cleansers du double-cleanse (gating sulfate strict). C3 cible exclusivement `kind=eye-cream` pour éviter de tagger des serums avec peptides utilisés à d'autres fins.

### Tier-1 sweep T1 — 11 slugs activés (2026-05-08)

```
algo-derm      →  5 954 paires      (∆ +90 — hypoallergenique réactivé,
                                     fluctuation marginale sur autres)
actif-class    →    334 paires      (∆ 0)
kind           →  4 057 paires      (∆ +3)
formula        →  8 506 paires      (∆ +6 575 — 7 nouveaux détecteurs :
                                     fini-mat/matifiant, texture-riche,
                                     texture-legere, fini-glowy,
                                     non-gras+absorption-rapide,
                                     pigments-verts, vegan, peau-normale)
cross-signal   →    233 paires      (∆ +9 — moment-crise spot-treatment)
grossesse-avoid→    199 paires      (∆ 0)
─────────────────────────────────────────
Total à insérer:  19 283 paires    (∆ +6 677 ; +53 %)
Déjà à jour    :  11 083
```

**Lecture** : explosion `formula` attendue — 11 nouveaux slugs ajoutés au volet. Le passage 0.5 → 2.3 paires formula/produit moyen reflète que 7 nouveaux détecteurs émettent sur des patterns INCI fréquents (water/glycerin top 3, silicone top 5, ≥ 5 ingrédients sans pattern animalier). Précision à valider via gold set (O2 roadmap, pending).

Distribution DB (avant T1 write) sur les 11 slugs : 6 à 0 paires (`fini-mat`, `fini-glowy`, `non-gras`, `absorption-rapide`, `moment-crise`, `texture-riche` ≈ peu de manuels), 5 avec quelques manuels existants (`peau-normale`=111, `texture-legere`=263, `hypoallergenique`=54, `matifiant`=36, `vegan`=30, `pigments-verts`=9). Les manuels seront préservés via `onConflictDoNothing`.

**Tier 1 done. Tier 2 next** (réactivations délicates) : `eczema-atopie` resserrement, `protection-cutanee` clarification T5, `repulpant` resserrement (ou drop définitif).

#### Application 2026-05-08 (commit `16b8ec60`)

- **Commit** : `feat(seed/auto-tags): calibration sweep R2+R3+T1 (+53% paires)` — 11 fichiers (auto-tag + actif-class + 4 nouveaux utils + tests + doc).
- **WRITE=1** : 19 339 paires insérées sur 3 668 produits (corpus passé +6 vs dry-run). 0 corrections avoid. Mode FK dédup : 11 083 candidats déjà à jour préservés (tags manuels intacts).
- **Cleanup mutex viol** : audit post-WRITE a détecté 31 produits avec `texture-legere` ET `texture-riche` ensemble (slugs mutuellement exclusifs sur l'axe ressenti). Cause : 163 paires stale héritées d'un run antérieur à logique plus permissive — la détection actuelle (`HEAVY_EXCLUSION_PATTERNS ⊇ BUTTER_WAX_PATTERNS`, top 8) ne peut pas émettre les deux. Résolu par `DELETE FROM tag_products WHERE slug IN ('texture-legere','texture-riche')` (2 005 paires) puis re-run WRITE=1 (1 842 ré-insérées). Conflit final : **0**.
- **Distribution post-cleanup T1** : `vegan` 2 929 (80 %), `texture-legere` 1 781 (49 %), `peau-normale` 1 237 (34 %), `texture-creme` 1 069 (29 %), `fini-mat` 370 (10 %), `hypoallergenique` 139 (4 %), `texture-riche` 61 (1.7 %), `non-gras`+`absorption-rapide` 59 chacun, `pigments-verts` 25, `fini-glowy` 14, `moment-crise` 9.

### Cross-signal avoid X1 — stack irritation (2026-05-07)

```
algo-derm      →  5 864 paires      (∆ −3 — réattribués au cross-signal source : ces 3
                                     produits ont peau-sensible promu de secondary à avoid)
actif-class    →    334 paires      (∆ 0)
kind           →  4 054 paires      (∆ 0)
formula        →  1 931 paires      (∆ 0)
cross-signal   →    224 paires      (∆ +3 — peau-sensible avoid sur 3 produits stack)
grossesse-avoid→    199 paires      (∆ 0)
─────────────────────────────────────────
Total à insérer:  12 606 paires    (inchangé — réattribution)
```

**Lecture** : 3 produits du corpus combinent retinoid + AHA/BHA en leave-on. Pour ces produits, `peau-sensible` passe de relevance secondary (algo-derm) à avoid (X1). Pattern same que `grossesse-avoid` : avoid > secondary. Volume modeste car peu de formulations dermo agressives, mais sécurité > recall.

### Recall + mutex fixes — formula detectors (2026-05-08)

Commit `79267410 fix(seed/auto-tags): close recall and mutex gaps in formula detectors`. Audit Claude §B.2-B.6, B.9. Aligne les listes locales sur les heuristiques algo-derm pour fermer 5 gaps de recall identifiés à l'audit :

- **B.2** `RETINOID_PATTERNS` (`detectGrossesseAvoid`) gagne `sodium retinoyl hyaluronate` — taggé cluster `retinoids` mais pas grossesse avoid avant le fix. Bug safety net pur.
- **B.3** `detectFiniGlowy` exclut maintenant les beurres/cires (`HEAVY_EXCLUSION_PATTERNS` partagé avec `detectTextureLegere`). Évite le couple `fini-glowy + texture-riche` (mutex sémantique).
- **B.4** `SILICONE_LIGHT_PATTERNS` (`detectNonGrasAbsorption`) : ajout `dimethiconol`, `amodimethicone`, `trimethicone`, `siloxane` catch-all, `silanol`. Aligné sur `heuristic_rules.json:silicone`.
- **B.5** `IONIC_SURFACTANT_PATTERNS` (`detectStepNettoyage1`) : ajout groups `myreth/coco/cetearyl/coceth × sulfate`. Évite faux-positif `step-nettoyage-1` sur cleanser à `Sodium Coco-Sulfate` top 3.
- **B.6** `HA_PATTERNS` (`detectFiniGlowy`) aligné sur cluster `HYALURONIC_ACID` (7 patterns vs 5).

Tests mutex ajoutés : `fini-mat ⊥ fini-glowy`, `texture-riche ⊥ texture-legere`, `non-gras ⊥ texture-riche` sur fixtures réels — empêche régression future similaire au cleanup T1.

### Seed-core avoid wiring — closing the seed/backfill gap (2026-05-08)

Commit `56b000bf feat(seed/auto-tags): wire avoid detectors in seed-core via shared helper`. Audit Claude §B.1.

Avant : `seed-core` n'appelait que `detectActifClasses` + `detectAutoTags` au seed initial — **0 tag avoid émis** sur `make dev-fresh`. Toute la couche safety dépendait du runner `backfill` exécuté ensuite. Si quelqu'un seed et déploie sans backfill → warnings UI grossesse silencieusement absents.

Fix : extraction d'un helper partagé `utils/auto-tag-avoid.ts` (`computeAvoidCandidates` + `isAvoidEligibleCategory`) consommé par `seed-core` (loop avoid après création produits) et `backfill-auto-tags` (line 226). Les deux runners ne peuvent plus diverger sur quels produits reçoivent un avoid override. Le legacy `scripts/auto-tag.ts` est archivé (`scripts/_archive/`) avec garde runtime explicite (commit `146b8fa6`).

### Audit surfacing — regulatory + interactions (2026-05-08)

Commits `883b8651` (regulatory) + `d2c0e27c` (hoist) + `50fd08dd` (interactions). Audit Claude §B.8 + §A.2 / §D.3.

`audit-auto-tags` expose désormais deux sections diagnostic supplémentaires (read-only, aucune écriture DB, dry-run uniquement) :

- **🛡 Regulatory notes** : agrégation `assessment.regulatoryNotes` (CELEX hits Reg UE 1223/2009 Annex II/III/V/VI + notes inline evidence). Snapshot 2026-05-08 (n=2876 INCI) : **2 188 produits affectés (76 %)**, **209 notes distinctes**. Top items = restrictions concentration (Phenoxyethanol max 1 % EU, Salicylic Acid max 2 %, allergènes Annex III Limonene/Linalool).
- **🔗 Interactions** : `assessment.interactions` (sous-ensemble firable de `interaction_rules.json` — règles sans profile/pH gating). 6 règles utiles : `mitigation-niacinamide+glycerin` 403, `acid+alcohol` 72, `alcohol+fragrance` 52, `alcohol+allergen` 20, `multiple-essential-oils` 7, `isothiazolinone-leave-on` 3.

Au passage : hoist de `analyzeINCI` dans le runner audit (`detectAutoTags` accepte un `assessment` pré-calculé optionnel via `DetectAutoTagsOptions`). Évite le double-pass algo-derm. Pattern réutilisé dans le commit suivant pour wirer l'interaction-avoid.

### Interaction-driven avoid I1 — peau-sensible (2026-05-08)

Commit `0c07e9a8 feat(seed/auto-tags): emit peau-sensible avoid for irritation interactions`. Audit Claude §D.3.

Nouveau détecteur `detectInteractionAvoidTags(assessment, kind)` dans `cross-signal-detection.ts` : sur leave-on, toute interaction `assessment.interactions` à `adjustment > 0` ET axe `irritation` ou `allergenicity` émet `peau-sensible` avoid. Mitigations (adj < 0, ex `niacinamide+glycerin`) ignorées — signal protection, pas risque. Rinse-off filtré (cumul effect dilué sous le seuil clinique).

Wiring : `computeAvoidCandidates` accepte un 5e arg optionnel `assessment?: ProductAssessment`. `seed-core` et `backfill-auto-tags` hoistent `analyzeINCI` une fois par produit pour le forwarder. Tests existants (sans assessment) skip silencieusement la passe interaction — backwards-compat préservée. Dedup par tagSlug : si cross-signal X1 ET interaction I1 émettent tous deux `peau-sensible` pour le même produit (retinoid+AHA + alcohol+parfum), une seule paire sort, source = first-seen (`cross-signal`).

```
interaction    →    +51 paires      (peau-sensible avoid)
─────────────────────────────────────────
Corrections (secondary→avoid) : +6
```

**Lecture** : 51 nouveaux produits (vs 154 attendus à partir de l'audit interactions) — l'écart vient de la dédup contre cross-signal X1 existant + filtres rinse-off + produits déjà à `peau-sensible avoid`. Les 6 corrections promeuvent un `peau-sensible secondary` (émis par algo-derm) à `avoid` quand l'interaction confirme le risque.

### Calibration cluster vitamin-e — full-scan + esters génériques (2026-05-08)

Audit O3 pré-calibration : `vitamin-e` 193 hit / 756 only_db (recall ~20 %) — la drift la plus large du run. Diagnostic via dump des 949 produits manuels :

- **754/756 contiennent vraiment de la vit-E** (tocopherol / tocopheryl / tocotrienol) — 2 noise (annotation manuelle sans match INCI).
- **752/754 (100 %) past pos 12** — distribution : min=8, p25=18, **median=22**, p75=29, p90=40, max=75. Le `positionCap: 12` (défaut) écartait la quasi-totalité du corpus manuel.
- Cause : vit-E est un **antioxydant trace ≤ 1 %** — toujours en queue d'INCI, mais fonctionnel cosmétiquement. Les annotateurs humains taggent à n'importe quelle position (marketing claims "vitamin E" cohérents avec dosage cosmétique habituel).

Fix `actif-class-detection.ts:VITAMIN_E` :
- `positionCap: Number.POSITIVE_INFINITY` (full-scan, aligne sur le baseline manuel).
- patterns simplifiés : `'tocopherol'` (free + alpha/beta/gamma/delta/mixed) + `'tocopheryl'` substring (catch tous esters : acetate / succinate / nicotinate / linoleate / phosphate / glucoside / ferulate) + `'tocotrienol'` (sub-family vit-E rare).

```
algo-derm      →  ?               (∆ 0)
actif-class    → vit-e: 193 → 1339 hit  (∆ +1146 sur skincare)
formula        →  ?               (∆ 0)
cross-signal   →  ?               (∆ 0 — vit-E n'a pas de cross-signal)
─────────────────────────────────────────
Diff orchestrator (toutes catégories) : +1567 paires `vitamin-e`
   ≈ 1146 skincare + 421 solaire/bodycare (tocopherol antioxydant courant en SPF)
Drift après    :  only_db = 2 (vs 756) — 754 résolus, 2 noise restants
Recall         :  20 % → ~99.85 % (946 / 948)
```

**Lecture** : remove cap = correction de calibration, pas changement sémantique. La précision reste haute (manual annotators valident le pattern). Pas de write DB déclenché — `make backfill-auto-tags WRITE=1` requis pour appliquer les +1567 paires (pending décision user). Cette session ne touche que le détecteur.

**Tests** : 3 nouveaux dans `actif-class-detection.test.ts` (full-scan tail, ester variants succinate/nicotinate, tocotrienol). 16 pass.

### Calibration cluster hyaluronic-acid — full-scan + substring unique (2026-05-08)

Audit O3 post-vit-e : `hyaluronic-acid` 179 hit / 518 only_db (recall ~26 %) — cluster #2 en drift. Diagnostic via dump des 697 produits manuels :

- **518/518 (100 %) contiennent un dérivé HA** dans l'INCI (zéro noise).
- **518/518 past pos 10** (cap actuel) — distribution : min=11, p25=15, **median=19**, p75=26, p90=34, max=71. Même profil que vit-E : humectant trace ≤ 1 %, queue d'INCI mais fonctionnel.
- Variants top : `sodium hyaluronate` 352, `hyaluronic acid` 74, `hydrolyzed hyaluronic acid` 61, `sodium acetylated hyaluronate` 12, `sodium hyaluronate crosspolymer` 7, `dimethylsilanol hyaluronate` 4. Tous catchables par un seul substring `hyaluron`.

Fix `actif-class-detection.ts:HYALURONIC_ACID` :
- `positionCap: Number.POSITIVE_INFINITY` (full-scan).
- Patterns simplifiés : `['hyaluron']` — substring unique catch tous variants y compris UK spelling (`hydrolysed`), typos (`hydrolyded`), esters glommés (`phenylbenzimidazole sulfonic acid sodium hyaluronate`), French INCI (`hyaluronate de sodium`, `acide hyaluronique hydrolyse`).

```
algo-derm      →  ?               (∆ 0)
actif-class    → HA: 179 → 1270 hit (∆ +1091 sur skincare)
formula        →  ?               (∆ 0)
cross-signal   →  ?               (∆ 0)
─────────────────────────────────────────
Diff orchestrator (toutes catégories) : +1198 paires `hyaluronic-acid`
   (1091 skincare + 107 solaire/bodycare)
Drift après    :  only_db = 0 (vs 518) — drift fermée
Recall         :  26 % → 100 %
Précision/manual : agree=696/1270 = 55 % ; 574 "new" non-manuels (annotation manuelle incomplète, pas over-tag : sample pos median=21, INCI vraiment HA).
```

**Lecture** : 574 new représentent ~16 % du corpus skincare (3690) — produits qui contiennent réellement du HA mais que les humains n'ont pas tagué (curation incomplète, pas over-tag détecteur). Décision : write recommandé via `make backfill-auto-tags WRITE=1` une fois validation user. Précision 55 % vs 71 % vit-E reflète une plus grande couverture INCI HA dans le corpus (humectant ubiquitaire).

**Tests** : 2 nouveaux (full-scan tail + variants `dimethylsilanol`/`acetylated`/`hydrolyzed`). 18 pass.

### Calibration cluster peptides — full-scan (2026-05-08)

Audit O3 post-HA : `peptides` 138 hit / 143 only_db (recall 49 %) — cluster #3 en drift. Diagnostic des 281 produits manuels :

- **143/143 contiennent un peptide** dans l'INCI (zéro noise).
- **143/143 past pos 15** (cap actuel) — distribution : min=16, **median=25**, p75=32, p90=42, max=55. Les peptides sont dosés en mg-range (`palmitoyl tripeptide-1`, `acetyl hexapeptide-8`, `hexapeptide-11`, etc.) — toujours queue d'INCI mais signaling-actif au trace.
- Variants top : `palmitoyl tripeptide-1` 14, `acetyl hexapeptide-8` 13, `acetyl dipeptide-1 cetyl ester` 9, `palmitoyl tetrapeptide-7` 6 — tous catchables par substring `peptide`.

Fix `actif-class-detection.ts:PEPTIDES` :
- `positionCap: Number.POSITIVE_INFINITY` (full-scan).
- Patterns inchangés : `[peptide, matrixyl, argireline, syn-ake, pdrn]` — `peptide` substring catch toutes longueurs de chaîne (di/tri/tetra/penta/hexa/hepta/octa/nona/deca/oligo/poly) et tous préfixes acyl (palmitoyl/acetyl/myristoyl). Brand names retenus pour INCI listant le nom marketing.

```
Diff orchestrator : +284 paires `peptides`
Drift après       : only_db = 0 (vs 143)
Recall            : 49 % → 100 %
Précision/manual  : agree=281/411 = 68 % ; 130 new (annotation manuelle incomplète).
```

**Tests** : 1 nouveau (full-scan tail `palmitoyl tripeptide-1`). 19 pass.

### Calibration cluster polyphenols — full-scan + vitis vinifera (2026-05-08)

Audit O3 post-peptides : `polyphenols` 127 hit / 135 only_db (recall 48 %) — cluster #4 en drift. Diagnostic des 262 produits manuels :

- **135/135 contiennent un polyphénol** dans l'INCI (zéro noise).
- **130/135 past pos 12** (cap par défaut) — distribution : min=3, **median=22**, p75=27, p90=35, max=51. Botaniques dosés en extract %, queue d'INCI fréquente.
- Variants top : `camellia sinensis leaf extract` 23, `rosmarinus officinalis leaf extract` 18, `curcuma longa root extract` 17, `ferulic acid` 10. Plus 8 cas `vitis vinifera` (raisin) **non couvert** par les patterns actuels.

Fix `actif-class-detection.ts:POLYPHENOLS` :
- `positionCap: Number.POSITIVE_INFINITY`.
- Patterns broadened : `'camellia sinensis'` (drop le qualifier `leaf extract` → catch aussi `seed oil`) + ajout `'vitis vinifera'`.

```
Diff orchestrator : +518 paires `polyphenols`
Drift après       : only_db = 1 (vs 135) — 1 noise marginal
Recall            : 48 % → 99.6 %
Précision/manual  : agree=261/621 = 42 % ; 360 new (botaniques ubiquitaires — alignement sur baseline manuel).
```

**Tests** : 1 nouveau (vitis vinifera + camellia seed oil tail). 20 pass.

### Calibration cluster enzymes-exfoliants — full-scan + lipase (2026-05-08)

Audit O3 post-polyphenols : `enzymes-exfoliants` 5 hit / 21 only_db (recall 19 %) — pire recall du run. Diagnostic via dump des 26 produits manuels :

- **21/21 contiennent papain / protease / subtilisin / lipase** dans l'INCI (zéro noise).
- **21/21 past pos 10** (cap actuel) — distribution : min=13, **median=20**, p75=25, p90=38, max=40. Bio-actives dosés mg-range, queue d'INCI systématique mais activité signaling-grade.
- Variants top : `papain` 13 (dont 8 `papain*` ou `papain (papaya enzyme)` annotation marketing), `protease` 5, `lipase` 4 (Dermalogica Daily Superfoliant pos 16, Prequel Multi-Acid Milk Peel pos 15, some-by-mi pos 21), `subtilisin` 1.
- **`lipase` était absent des patterns** — multi-enzyme exfoliants l'utilisent en complément de papain/protease, manqué par l'ancien détecteur même hors cap.

Fix `actif-class-detection.ts:ENZYMES_EXFOLIANTS` :
- `positionCap: Number.POSITIVE_INFINITY` (full-scan, aligne sur baseline manuel).
- Ajout `'lipase'` aux patterns. `protease` substring catch déjà les listings génériques ; `papain`/`bromelain`/`subtilisin` couvrent les variants nommés.

```
Diff orchestrator : +41 paires
   34 enzymes-exfoliants + 7 moment-hebdomadaire (cross-signal exfoliants → usage hebdo)
Drift après       : only_db = 0 (vs 21)
Recall            : 19 % → 100 %
Précision/manual  : agree=26/39 = 67 % ; 13 new (annotation manuelle incomplète,
                    moisturizers Garancia + cleansers koréens avec papain/protease tail).
```

**Lecture** : 13 new = produits skincare avec enzyme INCI past pos 10 jamais manuellement tagués. Profil : moisturizer=11, cleanser=10, exfoliant=9 — la tête `moisturizer` reflète la marque Garancia (papain marketing claim past pos 15) et plusieurs koréens utilisant papain en formule globale (pas en exfoliant primaire). Cohérent avec la décision manuelle d'inclure ces produits, donc backfill légitime.

**Tests** : 3 nouveaux (full-scan tail papain, variants `lipase` + multi-enzyme, marketing variants `papain*` / `papain (papaya enzyme)`). 25 pass.

### Calibration cluster retinoids — full-scan (2026-05-08)

Audit O3 post-enzymes : `retinoids` 46 hit / 47 only_db (recall 49 %) — recall le plus dégradé du run après enzymes. Diagnostic via dump des 93 produits manuels :

- **47/47 contiennent un retinoid** dans l'INCI (zéro noise).
- **47/47 past pos 12** (cap par défaut) — distribution : min=4, **median=26**, p75=32, p90=39, max=84. Vit-A et dérivés dosés 0.01-1 %, encapsulés/stabilisés au fond INCI (formulation hyper-courante : retinol PEG-encapsulated en pos 25-40 dans serums anti-âge).
- Variants top : `retinol` 14, `retinal` 13, `retinyl palmitate` 11, `retinal (retinaldehyde)` 4, `retinyl acetate` 3, `retinyl retinoate` 2, `hydroxypinacolone retinoate` 1. **Tous déjà couverts par les patterns existants** — c'est purement un cap problem.
- 6 produits contiennent aussi `bakuchiol` mais tous ont aussi un retinoid réel (cap removal les capture).

Fix `actif-class-detection.ts:RETINOIDS` :
- `positionCap: Number.POSITIVE_INFINITY` (full-scan).
- Patterns inchangés. `bakuchiol` et `beta-carotene` **exclus volontairement** : alternatives marketing à activité retinoid-like, mais chimiquement distincts (bakuchiol = meroterpène phénolique, beta-carotene = précurseur). Les 6 produits manuels avec bakuchiol contiennent tous aussi un retinoid réel — le cap removal seul les couvre.

```
Diff orchestrator : +125 paires
   67 retinoids + 56 moment-soir (cross-signal: retinoid → soir)
   + 4 peau-sensible (cross-signal-avoid + relevance upgrade)
Drift après       : only_db = 0 (vs 47)
Recall            : 49 % → 100 %
Précision/manual  : agree=93/112 = 83 % ; 19 new (annotation manuelle incomplète,
                    sérums et eye-cream avec retinyl palmitate/retinol pos 20-30).
```

**Lecture** : 19 new = produits skincare avec retinoid INCI past pos 12 jamais manuellement tagués. Profil : serum=58, moisturizer=22, eye-cream=14 — typique anti-âge. `moment-soir` cross-signal kicks correctly (retinoids = usage soir). `peau-sensible` × 4 = avoid + 2 relevance bumps (irritation interaction renforcée pour profils sensibles avec retinoid).

**Tests** : 3 nouveaux (full-scan tail retinol, variant `retinal (retinaldehyde)` parenthetical, bakuchiol NOT tagged retinoid). Suppression d'un test obsolète (« retinol at position 30 not detected » contredit par le nouveau design). 27 pass.

### Calibration cluster vitamin-c — full-scan + vitamin c ester (2026-05-08)

Audit O3 post-retinoids : `vitamin-c` 181 hit / 88 only_db (recall 67 %) — drift residuel le plus large. Diagnostic via dump des 269 produits manuels :

- **88/88 contiennent un dérivé vit-C** dans l'INCI (zéro noise).
- **88/88 past pos 12** (cap par défaut) — distribution : min=2, **median=25**, p75=31, p90=40, max=68. Vit-C est oxidation-prone : les formulateurs stabilisent sub-1 % en queue d'INCI sous forme estérifiée.
- Variants top : `ascorbyl palmitate` 19, `ascorbic acid` 16, `ascorbyl glucoside` 14, `tetrahexyldecyl ascorbate` 10, `ascorbyl tetraisopalmitate` 8, `magnesium ascorbyl phosphate` 7, `sodium ascorbyl phosphate` 5, `3-o-ethyl ascorbic acid` 5, `ascorbic acid polypeptide` 3. **Tous déjà couverts par les patterns existants** via substring match (`3-o-ethyl ascorbic acid` matche `ethyl ascorbic acid`, `ascorbic acid polypeptide` matche `ascorbic acid`).
- 1 cas résiduel : `vitamin c ester (ascorbyl palmitate)` (Power Repair Skin Serum) — algo-derm `normalize` semble drop le parenthetical, laissant un token `vitamin c ester` qui ne match pas `ascorbyl palmitate`. Pattern explicite ajouté.

Fix `actif-class-detection.ts:VITAMIN_C` :
- `positionCap: Number.POSITIVE_INFINITY` (full-scan).
- Ajout `'vitamin c ester'` aux patterns (edge case marketing INCI normalize-fragile).

```
Diff orchestrator : +267 paires
   157 vitamin-c + 110 moment-matin (cross-signal: vit-C antioxydant → matin)
Drift après       : only_db = 0 (vs 88)
Recall            : 67 % → 100 %
Précision/manual  : agree=266/300 = 89 % ; 34 new (annotation manuelle incomplète,
                    sérums et moisturizers avec ascorbyl palmitate/glucoside pos 15-30).
```

**Lecture** : 34 new = produits skincare avec vit-C INCI past pos 12 jamais manuellement tagués. Profil : serum=114, moisturizer=86, eye-cream=24 — typique anti-âge / éclat. `moment-matin` cross-signal kicks correctly (vit-C = antioxydant matin classique).

**Tests** : 3 nouveaux (full-scan tail ascorbyl palmitate, `3-O-ethyl ascorbic acid`, marketing `vitamin c ester (ascorbyl palmitate)`). 30 pass.

### Calibration cluster ceramides — full-scan + NG/AS (2026-05-08)

Audit O3 post-vit-c : `ceramides` 164 hit / 49 only_db (recall 77 %, cap=15). Diagnostic via dump des 213 produits manuels :

- **49/49 contiennent un dérivé ceramide** dans l'INCI (zéro noise).
- **49/49 past pos 15** (cap actuel) — distribution : min=12, **median=27**, p75=33, p90=39, max=52. Les lipides de la stratum corneum (ceramide blends, cholesterol, phytosphingosine) sont systématiquement listés sub-1 % en queue.
- Variants top : `ceramide np` 48, `cholesterol` 18, `phytosphingosine` 18, `ceramide ap` 16, `ceramide eop` 13, `ceramide ns` 10, `ceramide ng` 3, `ceramide as` 2, `ceramide eos` 1, `ceramide 3` 1, `caprooyl phytosphingosine` 1.
- **Tous les 49 produits avec phytosphingosine ont aussi un ceramide np/ap/eop/ns** dans la même formule — `phytosphingosine` testé puis rejeté : recall = 0 mais +24 over-tag sur cica/soothing products jamais classifiés ceramides par les annotateurs.

Fix `actif-class-detection.ts:CERAMIDES` :
- `positionCap: Number.POSITIVE_INFINITY` (full-scan).
- Ajout `'ceramide ng'` + `'ceramide as'` aux patterns (variants présents dans cica/relipidant blends).
- `phytosphingosine` non ajouté (justification ci-dessus).
- `cholesterol` non ajouté (chimiquement non-ceramide ; tous les produits avec cholesterol ont aussi un ceramide np/ap → déjà couverts).

```
Diff orchestrator : +288 paires `ceramides` (zéro cross-signal — pas de moment-X
                    ou peau-sensible avoid associé à ceramides).
Drift après       : only_db = 0 (vs 49)
Recall            : 77 % → 100 %
Précision/manual  : agree=211/440 = 48 % ; 229 new (annotation manuelle incomplète,
                    ceramide np très répandu sur moisturizers k-beauty).
```

**Lecture** : 229 new = produits skincare avec ceramide INCI past pos 15 jamais manuellement tagués. Profil : moisturizer=189, serum=73, mask=38 — typique barrier-repair / cica / relipidant. La bonne nouvelle : ceramide np est devenu un staple des routines coréennes (skin1004, beauty-of-joseon) et le manual tagging n'a pas suivi le rythme. Le 48 % agree reflète l'omniprésence du ceramide en skincare moderne, pas une dérive du détecteur.

**Tests** : 3 nouveaux (full-scan tail ceramide np, variants `ng`/`as`, phytosphingosine alone NOT tagged). 33 pass.

### Calibration cluster tyrosinase-inhibitors — full-scan + sepiwhite/hexylresorcinol (2026-05-08)

Audit O3 post-PHA-design : `tyrosinase-inhibitors` 49 hit / 21 only_db (recall 70 %). Diagnostic via dump des 70 produits manuels :

- **21/21 contiennent un actif pigmentation** dans l'INCI (zéro noise).
- **21/21 past pos 12** (cap par défaut) — distribution : min=3, **median=18**, p75=22, p90=33, max=42.
- Variants top : `niacinamide` 13, `tranexamic acid` 8, `dipotassium glycyrrhizate` 7, `morus alba` (bark/root/fruit) 8 cumul, `arbutin`/`alpha-arbutin` 5 cumul, `kojic acid` 2, `glycyrrhiza glabra` 3, `undecylenoyl phenylalanine` 1, `hexylresorcinol` 1.
- **Décisions d'exclusion (mécanisme / over-broadening)** :
  - `niacinamide` (13 occurrences) — inhibe le **transfert** de mélanosomes, pas la tyrosinase. Mécanisme distinct, ajouter le pattern over-broaderait à la majorité du corpus skincare. Les 13 produits avec niacinamide ont tous (sauf 0) un autre actif tyrosinase dans la même formule → cap removal seul les capture.
  - `glycyrrhiza` / `glycyrrhizate` (10 cumul) — testé : **+401 over-tags** sur produits cica/soothing (licorice ubiquitaire). Manual annotators tag glycyrrhizate comme tyrosinase **uniquement quand combiné avec un autre actif pigmentation**. Cap removal capture ces produits via l'autre actif (kojic/arbutin/morus alba/tranexamic). Pattern non ajouté.

Fix `actif-class-detection.ts:TYROSINASE_INHIBITORS` :
- `positionCap: Number.POSITIVE_INFINITY` (full-scan).
- Ajout `'undecylenoyl phenylalanine'` (Sepiwhite/melanostatin-5, competitive binder), `'hexylresorcinol'` (resorcinol-family lightener).
- `arbutin` substring catche déjà `alpha-arbutin` et `deoxyarbutin`.

```
Diff orchestrator : +73 paires `tyrosinase-inhibitors` (zéro cross-signal —
                    pas de moment-X ou peau-sensible avoid associé).
Drift après       : only_db = 0 (vs 21)
Recall            : 70 % → 100 %
Précision/manual  : agree=69/117 = 59 % ; 48 new (annotation manuelle incomplète
                    sur sérums anti-taches kojic/arbutin/tranexamic past pos 12).
```

**Lecture** : 48 new = sérums et moisturizers avec arbutin/tranexamic/morus alba en queue d'INCI jamais manuellement tagués. Profil : serum=54, moisturizer=27, toner=13 — typique anti-taches / éclat. Précision 59 % cohérente avec un cluster moins ubiquitaire que vit-c/HA mais bien représenté en routine pigmentation.

**Tests** : 4 nouveaux (full-scan tail alpha-arbutin, sepiwhite + hexylresorcinol, niacinamide alone NOT tagged, glycyrrhiza alone NOT tagged). 38 pass.

### AHA / BHA / PHA — drift conservée par design (2026-05-08)

Audit O3 post-polyphenols : `aha` 115 hit / 126 only_db, `bha` 101 / 88, `pha` 75 / 40. **Décision : ne pas modifier.**

Diagnostic AHA :
- **126/126 contiennent une AHA pattern** (`lactic acid` 67, `citric acid` 36, `glycolic acid` 10, `mandelic acid` 5, `malic acid` 4) — mais **0 sous le cap 10**.
- Distribution past-cap : min=11, median=19, p90=35.
- Cause : les acides α-hydroxy sont **pH-dépendants** — concentration fonctionnelle exfoliante exige position INCI tôt. Lactic acid en pos 19 = pH adjuster trace (~0.1 %), pas exfoliant. Citric acid en pos 22 = chélateur. **Cap 10 = précision-first chemistry-aware.**

Diagnostic BHA :
- **88/88 contiennent salicylic / capryloyl salicylic / betaine salicylate** mais **0 sous le cap 10**.
- Past-cap : min=11, median=18, p90=29.
- Salicylic acid en pos > 10 ≈ <0.5 % → anti-inflammatoire / preservative trace, pas exfoliant fonctionnel.

Diagnostic PHA (ajouté 2026-05-08 post-ceramides) :
- **40/40 contiennent gluconolactone (30) ou lactobionic acid (10)** mais **0 sous le cap 10**.
- Past-cap : min=11, **median=17**, p75=22, p90=29, max=43.
- Profil similaire à AHA/BHA : gluconolactone à pos 12-17 = humectant / chelator / pH-buffer trace dans toners CosRx-style et moisturizers cica. Pos > 20 = preservative booster (lipase, mustela cold cream, lip balms). PHA fonctionnel (4-8 %) requiert pos ≤ 10. **Cap 10 = précision-first, cohérent avec AHA/BHA.**

**Décision** : la divergence détecteur ↔ manual est **intentionnelle** pour les 3 clusters acides (AHA/BHA/PHA). Le cluster cible l'usage **exfoliant fonctionnel** (vs présence inerte de la molécule). Manual baseline est concentration-agnostic (tag tout ce qui contient l'INCI), détecteur est concentration-aware (cap 10 = top-decile concentration). Pas de fix détecteur.

Action follow-up possible (hors scope de cette session) : audit cleanup pour DELETE les paires manuelles AHA/BHA où la molécule est past pos 10 (sortir une CSV `manual-overtag-aha-bha.csv` via runner dédié, décision user case-by-case). Le tag manuel `aha`/`bha` sur `dermalogica-daily-microfoliant` (BHA exfoliant connu, salicylic pos 23) est techniquement légitime du point de vue marketing — c'est un produit BHA réputé. La règle "cap 10" l'exclut au profit de la précision algorithmique.

**Tests** : 3 (assertions explicites : lactic acid past pos 10 ≠ AHA, salicylic past pos 10 ≠ BHA, gluconolactone past pos 10 ≠ PHA). 34 pass.

#### Cleanup appliqué — 2026-05-08

Runner `audit-aha-bha-pha-overrides.ts` (read-only par défaut, opt-in `APPLY=1 APPLY_FROM_CSV=…` pour DELETE ciblé). Auto-classification heuristique en 3 buckets sur la base des marqueurs nom/slug + position INCI :

- **DELETE 143 auto** : POS≥20 (97), POS 15-19 hors acne/pigmentation (37), produits cuir chevelu / shampoing (9). Lactic/salicylic/gluconolactone à ces positions = pH adjuster, preservative trace ou humectant — pas exfoliant fonctionnel.
- **KEEP 74 auto** : produits avec marqueur exfoliant en nom (`aha`/`bha`/`pha`/`peeling`/`foliant`/`salicylic` etc.), produits anti-acne (`sebium`/`acniben`/`keracnyl`/`normaderm`/`effaclar`/`spot`) ≤ pos 19, produits anti-pigmentation (`anti-taches`/`mela b3`/`melaclear`/`depiwhite`/`brightening`) ≤ pos 19. Adjunct fonctionnel.
- **BORDERLINE 37** : revus case-by-case avec l'utilisateur (pos 11-14 ambigus). Verdict 17 KEEP / 20 DELETE :
  - KEEP : urea exfoliant (`eucerin-urea-repair`, `isdin-ureadin`), fermented essence (`missha-time-revolution`), Medik8 Surface Radiance line (lactic+mandelic stack), `nine-less-a-control` (azelaic + lactic adjunct), `uriage-ds-gel-regulateur-purifiant`, BHA pads/toners/serums (`numbuzin-no5-pad`, `dermaceutic-activabiome`, `medicube-exosome-shot-2000/7500`, `anua-niacin-essence-toner`), PHA toners/pads cosrx-style (`cosrx-ac-collection-calming`, `cosrx-one-step-moisture-up-pads`, `medicube-glutathione-glow-toner`, `theramid-even-in`, `vt-az-care-toner-pad`).
  - DELETE : cica gels anti-irritation (`a-derma-dermalibour`), masques/cleansers gentle non exfoliants (`pai-*`, `kreme-gelee`, `medik8-` only-gentle), BB creams (`avril-bb-creme-*`), serums Vit C/anti-redness (`dermalogica-biolumin-c`, `pai-instant-calm`), body emulsions (`the-ordinary-niacinamide-5-face-body`), produits non-skincare (`la-rosee-stick-levres`, `nuxe-reve-de-miel`, `mustela-cold-cream`, `lierac-creme-nuit`, `pai-double-cleanse`, `vichy-mineral-89-matte-sorbet`).

**Résultat** : 163 paires supprimées (96 AHA + 46 BHA + 21 PHA). Backup pre-cleanup : `./backups/backup_20260508_214401.sql`. Re-run audit post-cleanup : 91 overrides résiduelles (= 74 auto-keep + 17 borderline-keep) — toutes intentionnelles, alignées avec marketing/positionnement produit. Cap=10 reste la règle ; les 91 KEEP sont des `manual_only` documentés.

### Gold set — scaffolding (audit O2, livré 2026-05-08)

Corpus de référence hand-annotated (target 60-80 produits) sur 16 tags
focus calibrés 2026-05-08 (9 actif-class clusters + 4 sensoriels Tier-1
+ 3 acid clusters). Sert à mesurer precision / recall / F1 / Brier / ECE
par tag contre l'output orchestrator, pour valider les recalibrations
contre une vérité-terrain stable plutôt que de naviguer aveuglément.

**Architecture livrée** :
- Schema + loader : `backend/src/db/seed/utils/gold-set.ts` (`GoldSetFile`, `GOLD_SET_FOCUS_TAGS`, validation stricte : duplicate slug, tag hors scope, intersection présent/absent → throw).
- Métriques pures : `backend/src/db/seed/utils/gold-set-metrics.ts` (Brier, ECE 10-bin, P/R/F1/confusion, macro/micro). Testées en isolation (30 tests `gold-set-metrics.test.ts` + 12 tests `gold-set.test.ts`).
- Bootstrap : `runners/gold-set-bootstrap.ts` — sampler stratifié par tag × kind (PRNG seedable, mulberry32). Round-robin pour éviter qu'un tag à pool large ne sature le budget. Idempotent : préserve les annotations remplies, ajoute des squelettes pour les nouveaux samples. `make gold-set-bootstrap` (vars : SAMPLE_SIZE=70, POSITIVES_PER_TAG=4, NEGATIVES_PER_TAG=2, SEED=42).
- Benchmark : `runners/audit-gold-set.ts` — orchestrator vs annotations.json, report par tag (TP/FP/FN/TN, P/R/F1, Brier, ECE) + macro/micro. Drift hard-fail si productSlug annoté manque en DB. `make audit-gold-set` (vars : GOLD_SET_PATH, CSV_OUT, STRICT=1 pour fail si annotation vide).
- Annotation file : `backend/src/db/seed/data/gold-set/annotations.json` (squelette vide commit, à remplir manuellement). README dans le même dossier détaille schéma + workflow.

**Annotation sélective** : un tag est `present` si l'annotateur le confirme, `absent` s'il le rejette explicitement, sinon `unrated` (métrique l'ignore). Garde le corpus tractable sans forcer un jugement exhaustif par produit.

**Boucle calibration** :
```
edit rules → make backfill-auto-tags WRITE=1 → make audit-gold-set
```

**Note Brier/ECE** : les 16 tags focus actuels sont déterministes (passes 2-6 du orchestrator). Brier dégénère en taux de mauvais classement, ECE en single-bin. Le pipeline garde le calcul pour quand le scope s'étendra à des tags algo-derm passe 1 (concerns/skin types/absence) qui portent une confidence calibrable.

~~**À faire** : remplir 60-80 annotations manuellement → produire les premières mesures. Bloque la mesure absolue + valide T1 sensoriel post-hoc.~~ ✅ Done 2026-05-09 — 70 produits annotés, macro F1=0.994 (P=1.000, R=0.989). Voir bloc Gold set §"Calibration O2" ci-dessous.

---

## Roadmap d'amélioration

État au 2026-05-08. Items triés par priorité (impact × pertinence). Effort indicatif sur barème **XS** (< 30 min) → **S** (1 h) → **M** (½ journée) → **L** (jour+).

### Récap reprise de session

**✅ Done (27) :** R1, R2, R3, C1, C2, C3, C4, C5, X1, C6, S1, S2, S3, S4, T1, **I1** (sweep 11 slugs commit `16b8ec60` + cleanup mutex stale + interaction-driven peau-sensible avoid `0c07e9a8`) + **X2** + **Tier 2** (eczema-atopie / effet-protecteur / repulpant) + **D.3 hoist** (2026-05-09) + **T1 sans-X family** (2026-05-09) + **R4 semi-occlusif** (2026-05-09) + **T3 texture field phase A** (2026-05-09) + **T4 brand-level vegan/cruelty-free/bio-naturel phases A+B+C+D+E** (2026-05-09) + **X3 ProductInteraction[] axis mapping** (2026-05-09) + **S5 texture-gel field + INCI fallback** (2026-05-09) + **Marketing cleanup `fini-glowy` kill + `absorption-rapide` merge → `non-gras`** (2026-05-09, commit `81e7ed8c`, migration `0052`) + **Round 2 taxonomy audit — `keratolytique` + `effet-protecteur` kill (product-side)** (2026-05-09, migration `0053`). `keratolytique` algo-derm trigger = subset of AHA + BHA + RETINOIDS + urea actif_class clusters (53% strict overlap on 595 paires). `effet-protecteur` Trigger B delegated to detectTextureRiche (74% co-fire with `texture-riche`) + Trigger A (lanolin top 8) niche-only (~24 paires). 688 paires deleted (595 + 93). Ingredient-side slugs preserved (`SKINCARE_INGREDIENT_TAG_SLUGS` unchanged) — pharmacological/chemical classification keeps meaning at ingredient level.

**🔧 Session 2026-05-09 (suite) — auto-tagging Tier 2 + perf hoist :**
- **X2 vit-C × sunscreen** (`1d471c31`) — vit-C cross-signal étendu à `kind=sunscreen` ; sémantique du combo SPF+vitC réaffirmée au niveau cross-signal. 0 paire DB nouvelle (kind-tag émet déjà `moment-matin`), valeur = audit-orchestrator attribue désormais le tag au combo. 2 tests.
- **Tier 2 — `eczema-atopie`** (`ca682b56`) — `detectEczemaAtopie` formula-pass. Trigger A : `avena sativa kernel` substring (kernel flour/extract/oil = OTC colloidal oatmeal ; flower/leaf/stem juice exclu). Trigger B : ≥2 ceramides distincts top 12 + 0 fragrance keyword (`parfum`/`fragrance`/`aroma` substring, gère slash-form `parfum/fragrance`) + 0 sulfate top 5. Leave-on only. Algo-derm `peaux_atopiques` reste `allow:false` (cohabitation). 72 paires backfill, 11 tests.
- **Tier 2 — `effet-protecteur`** (`ec1eed5a`) — `detectEffetProtecteur` formula-pass. Trigger A : lanolin (any variant) top 8 (Aquaphor/Lansinoh chemistry). Trigger B : ≥2 butter/wax groups top 8 (délègue à `detectTextureRiche` pour synonym dedup). Co-fire avec `texture-riche` sur trigger B (sensoriel vs skin_effect). Distinct de `occlusif` (petrolatum) et `barriere-cutanee` (lipid mimicry). Les 11 paires manuelles post-T5 (urea/hydrocolloïde/silicones hétérogènes) ignorées — pattern privilégie cohérence chemistry. 82 paires backfill, 9 tests.
- **Tier 2 — `repulpant`** (`3a9df6bb`) — `detectRepulpant` formula-pass. Pattern restrictif : HA (substring `hyaluron`) top 8 + pure glycerin (exact token, exclut `glyceryl stearate`) top 5 + plumping peptide (`acetyl hexapeptide-8` OR `palmitoyl tripeptide-1`) anywhere. HA cap relâché de 3 → 8 car peptide-headline serums (The Ordinary Matrixyl 10%+HA) placent peptide pos 3-6 et HA pos 5-8. Leave-on only. Algo-derm `repulpant` reste `allow:false`. 8 paires émises (7 déjà manuelles, 1 nouvelle), 8 tests.
- **D.3 hoist `normalizedIngredients`** (`70f8d6ef`) — refacto interne, no behavior change. Helper `utils/ingredient-resolver.ts` (`resolveIngredients`). Orchestrateur hoist `normalizedIngredients = ingredients.map(normalize)` une fois par produit, propage en dernier arg optionnel à : `detectActifClasses`, tous les détecteurs formula (17), `detectCrossSignalTags`, `computeAvoidCandidates` → `detectGrossesseAvoid` + actifs internes. Detecteurs gardent fallback `inci` (back-compat tests). 0 paire diff sur snapshot orchestrator, parity 16/16, 290 tests verts. Élimine ~63k splitINCI redondants par snapshot run (3690 produits × 17 détecteurs INCI).

Session totale : +155 paires DB, +30 tests, gold-set macro F1 stable 0.994.

**🔧 T1 sans-X family 2026-05-09 (suite) :**
- **T1** — algo-derm absence family (`sans_sulfates` / `sans_silicones` / `sans_huiles_essentielles` / `sans_huiles_minerales` / `sans_allergenes_parfumants`) mappée vers 5 slugs Aurore (`product_characteristic` / tolerance group). TAG_CONFIG aligné sur `sans_parfum` (`minConf: 0.7`, ≡ ≥ 70 % INCI coverage — gating coverage flotant non applicable côté `detected_absence`). Migration `2026-05-09_t1-sans-x-family.sql` flippe le `type` DB des 2 slugs hérités haircare (`sans-sulfates`/`sans-silicones`, registered en `product_label` au seed initial — `productTagData` first-wins skincare aujourd'hui mais `onConflictDoNothing` n'a jamais corrigé l'existant). Backfill **7102 paires** ; couverture par slug 35-44 % du corpus INCI (3631 produits) — cohérent pour des absence tags discriminants (vs `sans-savon` à > 80 %). 6 tests ajoutés (1 positif chaîné + 5 négatifs unitaires). Débloque R4 (semi-occlusif).

**🔧 R4 semi-occlusif 2026-05-09 (suite) :**
- **R4** — `detectSemiOcclusif` formula-pass. Patterns `squalane` / `dimethicone` / `dimethiconol` / `isohexadecane` top 5 (cap plus serré que `occlusif` à top 8 — émollients à concentration plus basse). Leave-on only (RINSE_OFF_KINDS). Mutex avec `occlusif` : si pattern petrolatum/lanolin/cera/butter fire en top 8, `semi-occlusif` skip (sémantique film-former vs émollient ne mélange pas). `squalene` (animal sebum, distinct INCI) ne match pas le pattern `squalane` (substring strict, ending 'ne' attendu). `cyclomethicone` exclu — silicone volatile qui s'évapore, ne réduit pas la TEWL. Patterns `dimethicone` et `dimethiconol` listés explicitement (le premier ne contient pas le second en substring — ending letter différente). Slug `semi-occlusif` (skin_effect) inséré via migration `2026-05-09_r4-semi-occlusif.sql`. Backfill : **285 paires** (≈ 7,8 % du corpus INCI — discriminant, attendu pour un tag chimie-spécifique). 9 tests added.

**🔧 T3 texture field — phase A 2026-05-09 (suite) :**
- **T3** — colonne `products.texture text NULL` (Drizzle 0050) + type `ProductTexture` shared + Zod create/update/changes acceptent texture optional + service layer pass-through (TRACKED_FIELDS audit + getProductRow SELECT). Backfill kind→texture lossless (`2026-05-09_t3-texture-kind-backfill.sql`) sur 6 mappings 1:1 (oil/body-oil/hair-oil/huile → huile ; balm → baume ; patch → patch ; body-lotion → lait ; hand-cream → creme ; toner/mist → eau). **462 produits populés sur 4200** (≈ 11 %). Les 3738 restants (moisturizer/cleanser/serum/mask/sunscreen/primer/lip-care/body-wash/body-scrub) restent NULL — admin populera les kinds ambigus. Phase B (UI admin) + S5 detectors (gel/mousse/stick) remis à plus tard ; décision = laisser admin populer field d'abord pour avoir un signal de référence avant d'écrire un INCI fallback.

**🔧 T4 brand-level vegan/cruelty-free/bio-naturel — phases A+B+C 2026-05-09 (suite) :**
- **T4.A schema** — table `brand_certifications` keyed `lower(trim(brand))` (Drizzle migration `0051_clumsy_moonstone.sql`). Champs `is_vegan` / `is_cruelty_free` / `is_natural_certified` (default false) + `sources jsonb` (per-claim provenance : `manual` / `obf` / `peta` / `leaping-bunny` / `cosmos` / `ecocert` / `nature-progres` / `vegan-society`) + `notes text NULL` + `updated_at`. Pas de FK sur `products.brand` (free-text). `normalizeBrand(raw)` exporté du schéma file → trim + collapse whitespace + lowercase.
- **T4.B seed** — 35 marques curées dans `data/brand-certifications.ts` avec sources publiques citées per claim. Coverage : Korean PETA-listed (COSRX, Some By Mi, Skin1004, Anua, Pyunkang Yul, Mixsoon, Beauty of Joseon, Numbuzin, Round Lab, Abib, Torriden, Haruharu Wonder, Isntree, Dear Klairs, Mary&May, Axis-Y, Purito Seoul, Purito, I'm From, Jumiso, Rovectin, Innisfree, Banila Co), Deciem (The Ordinary, NIOD — PETA + LB), Caudalie (Vegan Society + PETA), Garnier (Leaping Bunny), Weleda (NATRUE + PETA), Pai Skincare (Soil Association + LB + Vegan Society), Patyka + Avril (Cosmos / Ecocert), Respire, Sol de Janeiro, Geek & Gorgeous, Prequel. **Aucune marque sold-in-China incluse** (CeraVe, La Roche-Posay, Vichy, Avène, Bioderma, Eucerin, Laneige, Aestura — exclus malgré popularité corpus, animal-testing regulatory exposure). Loader runner `seed-brand-certifications.ts` (idempotent upsert via PK).
- **T4.C détecteur** — `detectBrandLevelLabels` (passe 5b orchestrator). Pure-lookup, pas d'INCI. Orchestrator pré-charge `brand_certifications` une fois par run (seed-core et backfill), passe en option `brandCertifications: ReadonlyMap<string, BrandCertification>`. Émet `vegan` / `cruelty-free` / `bio-naturel` selon flags. `vegan` co-fire avec `detectVegan` INCI — orchestrator dédupe per-tag (relevance identique `secondary`, source winner = first proposed). `cruelty-free` et `bio-naturel` n'ont pas d'émetteur INCI ; brand est seule source.
- **Backfill** : **+1305 paires** (cruelty-free 0 → 1207, bio-naturel 0 → 177, vegan 2929 → 2948 — marginal +19 brand-only car la plupart des produits des 3 marques vegan brand-level sont déjà détectées par INCI). 8 tests added (`brand-cert-detection.test.ts`). Phases D (OBF dump ingestion CSV/JSONL) + E (PETA + Leaping Bunny scrapers HTML) restent à faire — 35 marques seed couvrent ~33 % du corpus skincare, OBF étendrait à ~80 % via `labels_tags`.

**🔧 T4.D OBF ingestion 2026-05-09 (suite) :**
- **T4.D** — runner `ingest-obf-brand-labels.ts` télécharge le dump OBF (CSV.gz, ~17 MB compressé / ~160 MB raw, ~64k cosmétiques), parse `brands_tags × labels_tags`, agrège per-brand, applique règle de claim et merge dans `brand_certifications` avec source `obf`. Cache local `backend/tmp/cache/obf/` (gitignored) — re-runs sans `--download` réutilisent le dump (refresh quotidien OBF).
- **Règle de claim — OR-combined** (cope avec sparsity OBF) : (1) **ratio rule** `matched/total ≥ ratioThreshold AND total ≥ minProducts` (défaut 0.5 + 2) — capture les marques qui taggent leur ligne entière (small organic / cosmos houses) ; (2) **count rule** `matched ≥ minLabelCount` (défaut 3) — capture les big brands où la majorité des rows OBF n'ont aucun label (Garnier 758 produits, 40 vegan = 5 % ratio mais 40 absolus = signal fort). Either-pass flips claim. False positive risque modéré sur `naturalCertified` (label `en:organic` est ambigu — A-Derma 4/38 fire) ; documentable via `sources.natural = ['obf']` pour audit ultérieur.
- **Slug match** — `brandToObfSlug(brand)` mirror la normalisation OBF (`prodsuf:get_string_id_for_lang`) : NFD + strip diacritiques + lowercase + non-alphanumeric → `-` + trim. Validé manuellement sur top 80 corpus (`L'Oréal` → `l-oreal`, `Avène` → `avene`, `La Roche-Posay` → `la-roche-posay`, `I'm From` → `i-m-from`, `Mary&May` → `mary-may`, `Dr. Jart+` → `dr-jart`).
- **Merge policy** — manual seed flags ne sont jamais écrasés (only ADD evidence). `sources jsonb` enrichi append-only avec dédup (`existing.vegan = ['vegan-society']` + OBF claim → `['vegan-society', 'obf']`). Flags `false` peuvent être lifted à `true` par OBF ; flags `true` ne sont jamais flipped à `false`.
- **Whitelist** — par défaut, on ne roll up que les marques présentes dans `products.brand` (post-slugification). 215 marques uniques corpus → 140 trouvées dans OBF post-whitelist. Switch `--no-whitelist` pour ingest large.
- **Run** : 22 nat-claims + 5 vegan + 2 cf passe le seuil. 20 nouvelles marques insert (mostly French/Euro organic — Cattier, Coslys, Melvita, Centifolia, Aroma-Zone, Florame, Sanoflore, Pranarom…). 5 existantes voient leurs sources enrichies (Weleda + Caudalie + Avril + Respire + Patyka — déjà manual seed avec flags ON, OBF ajoute juste la source `obf`). 0 flag lifted false→true (toutes les claims OBF étaient déjà `true` côté manual seed pour les marques connues).
- **Backfill** : **+87 paires** (toutes `bio-naturel` — bio-naturel 177 → 264). +0 vegan/cruelty-free car les marques OBF déjà couvertes par seed manuel. 23 tests added (`obf-brand-labels.test.ts` : slug normalisation, classification labels, aggregation rules ratio + count, merge sources, CSV parsing). Test-suites globales vertes (parity 16/16, auto-tag 67/67).
- **Limites** — coverage marginal sur `vegan`/`cruelty-free` car le corpus Aurore est skewed K-beauty + French derm (sold-in-China exclus du seed) tandis qu'OBF est skewed Euro mass-market + organic small brands. Les K-beauty PETA-listed (COSRX, Some By Mi…) sont quasi-absentes d'OBF. T4.E (PETA + Leaping Bunny scrapers) est la prochaine étape pour étendre la coverage cruelty-free aux 35+ marques K-beauty corpus.

**🔧 T4.E PETA scraper 2026-05-09 (suite) :**
- **T4.E** — runner `ingest-peta-cruelty-free.ts` sonde `https://crueltyfree.peta.org/company/<slug>/` pour chaque marque corpus + seed (~222 marques). Cache JSON `backend/tmp/cache/peta/results.json` (gitignored). Polite delay 250 ms ; ~1 min total. PETA n'a pas d'API/CSV publique → scraper ciblé est la seule option.
- **Signal cruelty-free** — IMPORTANT : HTTP 200 alone is NOT cruelty-free. PETA serves pages for every indexed brand (signed CF policy or "may not be cruelty-free"). Page body parsing requis : breadcrumb JSON-LD `"name":"Cruelty-free Companies"` (ou `Cruelty-free Companies >`) → CF, `"may not be cruelty-free"` → unsigned, neither → unknown. v1 du scraper consommait juste le HTTP code et marquait à tort 57 marques CF (dont CeraVe, Avène, Bioderma, Vichy, Eucerin — clairement non-CF). v2 (livré ici) parse le body → **23 marques réellement CF** sur 222 sondées.
- **Slug match** — `petaSlug(brand)` mirror la convention PETA WordPress permalink : NFD + strip diacritiques + lowercase + DROP apostrophes (no dash replacement) + non-alphanumeric runs → single dash + collapse + trim. `petaSlugVariants(brand)` essaie également une version avec apostrophes-as-dashes pour les rares URLs legacy. Validé manuellement : `I'm From` → `im-from` ✓, `Axis-Y` → `axis-y` ✓, `Beauty of Joseon` → `beauty-of-joseon` ✓, `COSRX` → `cosrx` ✓.
- **Audit du seed manuel** — le scraper compare les sources `peta` du seed contre le verdict PETA réel et émet une liste « stale citations » : 21 marques du seed citaient PETA mais ne sont PAS sur la liste PETA (Beauty of Joseon, Some By Mi, Respire, Purito, Torriden, Isntree, Mixsoon, Numbuzin, COSRX, Jumiso, Purito Seoul, Pyunkang Yul, Patyka, Round Lab, Geek & Gorgeous, Abib, Mary&May, Prequel, Weleda, Banila Co, Anua). **Seed corrigé** : `cruelty_free: ['peta']` → `cruelty_free: ['manual']` pour les 21 stale ; flag `is_cruelty_free=true` préservé (manual attestation reste valide). Les 11 marques seed PETA-confirmées (Skin1004, Haruharu Wonder, Dear Klairs, Axis-Y, I'm From, Rovectin, The Ordinary, NIOD, Caudalie, Innisfree, Avril) gardent `peta` source.
- **Run** : 23 marques cruelty-free PETA-confirmed sur 222 sondées. **11 nouvelles marques inserted** (Etude, Allies of Skin, Byoma, Eqqualberry, Dr. G, Dr. Jart+, Haruharu, Meme, Paula's Choice, Typology, VT, ACM — toutes corpus skincare/bodycare). 1 lift false→true. 2 enrichments. 4 brands HTTP 403 (`dermalogica`, `iunik`, `herbatint`, `sol-de-janeiro` — PETA blocked our UA, retry-able later).
- **Backfill** : **+110 paires cruelty-free** (1207 → 1317). 16 PETA-specific tests added. Total T4 cumulative : +1502 paires DB (vegan 2948, cruelty-free 1317, bio-naturel 264). Brand certifications DB : 35 (manual) → 55 (T4.D OBF) → 66 (T4.E PETA).
- **Décision** — `--strict-prune` flag implémenté mais NON utilisé en run actuel (préfère que les corrections de citation soient faites côté seed file pour rester source-of-truth). Re-run sequence : seed-brand-cert --write (overwrite sources) → ingest-obf --write (re-add `obf` à natural) → ingest-peta --write (re-add `peta` à confirmed CF).

**🔧 S5 texture-gel — field + INCI fallback 2026-05-09 (suite) :**
- **`OrchestratorInput.texture`** — nouveau champ optionnel `ProductTexture | null` propagé via passe 4. Backfill SELECT `products.texture` et le passe à `detectAllAutoTags`. Seed-core ne le câble pas (seed JS n'a pas de `texture`) — non bloquant car `data.sql` snapshot reste source de vérité et le backfill rejoue les tags après chaque dev-fresh.
- **`detectTextureFromField`** — pure pass-through. Map `products.texture` → `TEXTURE_*` slug pour les 9 textures (gel, creme, mousse, stick, huile, lait, eau, baume, patch). Authoritative : si admin set `texture='creme'` sur un kind ambigu (moisturizer/eye-cream), le slug est émis sans qu'INCI/kind ait à le deviner. Les textures déjà émises par `detectKindTags` (oil→huile, balm→baume, body-lotion→lait, hand-cream→creme, toner/mist→eau, patch→patch) sont dédupées par l'orchestrator (même slug = first source wins).
- **`detectTextureGelInci`** — INCI fallback `texture-gel` UNIQUEMENT (mousse/stick non dérivables d'INCI seul, attendent admin curation). Skip si `products.texture` set (any value — admin wins). Patterns gel-former top 5 : `carbomer`, `xanthan`, `sodium polyacrylate`, `hydroxyethylcellulose`/`hydroxyethyl cellulose`, `sclerotium gum`, pemulen (`acrylates/c10-30 alkyl acrylate crosspolymer`), `ammonium acryloyldimethyltaurate`. Exclusions : (a) huile végétale/minérale top 5 (réutilise `VEGETABLE_OIL_PATTERNS`), (b) butter/wax top 8 (réutilise `BUTTER_WAX_PATTERNS`, rich emulsion ≠ gel), (c) silicone leading top 5 (réutilise `SILICONE_LIGHT_PATTERNS`, gel-cream silicone-base déjà couvert par `non-gras`/`semi-occlusif`). Skip kinds `cleanser`, `body-wash`, `body-scrub`, `balm`, `oil`, `body-oil`, `hair-oil`, `patch` (rinse-off pour les premiers, chemistry contradictoire pour balm/oil/patch).
- **Backfill** : **+93 paires `texture-gel`** (66 → 159 secondary). Spot-check kinds éligibles : eye-creams gel (Vichy Liftactiv Eye), masques jelly/hydrogel (COSRX/Mixsoon/Torriden Dive-In), Round Lab Dokdo Lotion, COSRX Snail Mucin Essence. 0 paire detectTextureFromField nouvelle (les 462 produits T3-populated ont des textures déjà émises par `detectKindTags`, donc dédup orchestrator). 18 tests ajoutés (5 detectTextureFromField + 10 detectTextureGelInci positifs/négatifs + 3 priorité field-vs-INCI).
- **Limites connues** — `mousse` et `stick` zéro paire jusqu'à ce qu'admin populate `products.texture`. Pas d'INCI fallback prévu pour ces deux textures (foaming surfactants ne distinguent pas mousse/cleanser ; wax-stick chemistry overlap baume sans marqueur INCI fiable).

**🔧 X3 ProductInteraction[] mapping 2026-05-09 (suite) :**
- **X3** — `detectInteractionAvoidTags` étendu : axe `dryness` → `peau-seche` avoid (en plus du mapping irritation/allergenicity → `peau-sensible` déjà livré). Rationale : stacks `alcohol+parfum`, `alcohol+allergen`, `acid+alcohol` perturbent la barrière + augmentent TEWL → contre-indication explicite peau sèche, pas seulement peau sensible. Multi-axe → multi-tag (set dedup).
- **`detectInteractionSecondaryTags`** (nouveau) — orchestrator passe 5a, source `interaction`. Mapping unique aujourd'hui : axe `photosensitivity` → `moment-soir` secondary. Trigger principal : `multiple-essential-oils` rule (`lavandula angustifolia oil` + `citrus limon peel oil`) → bergaptène-class furocoumarins amplifient réactivité UV. Couvre les stacks multi-HE non détectés par AHA/BHA/retinoid cross-signal.
- **Skip** — `comedogenicity` et `fungalAcne` axes sont gated par `profileCondition.acneProne`, donc ne fire jamais au seed-time (pas de profil utilisateur). Pas de slug `fungal-acne` Aurore non plus. Axes pH-gated (`aha-low-ph`, `bha-low-ph`) n'ont pas de pH context au seed → skip silencieux côté algo-derm.
- **Leave-on only** — rinse-off dilue le cumul effect (cohérent avec `comedogene` excludeRinseOff et `detectCrossSignalAvoidTags`).
- **Mitigations** — `interaction.adjustment ≤ 0` ignoré (signal de protection, pas de risque).
- **Backfill** : **+53 paires** (peau-seche avoid + moment-soir secondary), **+9 corrections secondary→avoid** (peau-seche existant flippé). 9 tests added (5 axis-mapping `detectInteractionAvoidTags` + 3 photosensitivity `detectInteractionSecondaryTags` + 1 multi-axis emission `auto-tag-avoid`). Idempotence verifiée (re-run dry-run = 0 inserts).

**🔧 Taxonomy clarification 2026-05-09 :**
- **T5 — rename `protection-cutanee` → `effet-protecteur`** (skin_effect). Le slug `protection` (concern, anti-agressions UV/pollution) restait à côté de `protection-cutanee` (skin_effect, film-formers) → confusion bloquant l'écriture d'un détecteur. `effet-protecteur` aligne le naming avec les autres skin_effects (`apaisant` / `purifiant` / `reparateur`). Migration `2026-05-09_protection-rename-and-non-irritant.sql` (UPDATE par slug, junction rows préservées). Snapshot régénéré.
- **T2 — slug `non-irritant`** (`product_characteristic` / tolerance) + 1-line TAG_CONFIG `non_irritant: { minConf: 0.85, coverageMin: 0.7, allow: true }`. Algo-derm fire `non_irritant` quand `productAxisRisk.irritation.risk < 0.35` ; gating Aurore conservateur (mêmes seuils que `hypoallergenique`). Backfill : 218 paires émises. 3 tests added.

**🔧 Audit-driven fixes 2026-05-08 (post-Claude audit `auto-tags-audit.md`) :**
- Recall + mutex (B.2-B.6, B.9) — commit `79267410`
- Seed-core avoid wiring (B.1) — commit `56b000bf`, helper `auto-tag-avoid.ts`
- Audit surfacing regulatoryNotes + interactions (B.8, A.2) — commits `883b8651` / `d2c0e27c` / `50fd08dd`
- Legacy script archived (C.2) — commit `146b8fa6`
- **Orchestrator + parity (audit §3.1, §6 A-C, §C.5)** — `auto-tag-orchestrator.ts` unifie les 6 passes ; seed-core et backfill consomment `detectAllAutoTags`. Test parité `auto-tag-orchestrator-parity.test.ts` (16 tests). Effet : `make dev-fresh` puis `make backfill-auto-tags --write` = no-op sur paires auto-tag. Solaire/bodycare reçoivent maintenant kind/formula/cross-signal-secondary tags au fresh seed (avant : skipped, divergence §3.1 fermée).
- **Drop-reason counters (audit §C.3)** — option `dropCounts?: Map<string, number>` sur `DetectAutoTagsOptions`, key `${reason}:${tagId}` (7 reasons). `audit-auto-tags` agrège sur tout le corpus + nouveau bloc « 🪦 Candidats droppés » (top 15 par raison). Diagnostic audit : « pourquoi tag X ne fire pas sur produit Y » → réponse en agrégat, plus besoin de retracer manuellement les conditions.
- **Vegan corpus FP cleanup (audit §B.7)** — spot-check 30/200/300 produits + corpus-wide ilike grep → **11 vrais FP** identifiés (`pearl powder` 8, `pearl extract` 1, `lactoperoxidase` 2). `ANIMAL_PATTERNS` étendu (`pearl `, `lactoperoxidase`) + 4 tests precision dans `formula-detection.test.ts`. Runner `audit-vegan-corpus.ts` (read-only par défaut, opt-in `PRUNE=1` pour DELETE ciblé). Snapshot `data.sql` régénéré (11 INSERT supprimés). Tier B (stearic/palmitic/cetyl alcohol) confirmé ambigu sans champ brand-level → deferral T4 reste la bonne réponse.
- **Doc cleanup (audit §B.10)** — « Labels (5/10 manquent) » resynchronisé en (2/10) suite T1 + T1.11 + B.7 (`hypoallergenique`/`pigments-verts`/`vegan` désormais couverts) ; T2 row enrichie d'une note explicite que le mapping algo-derm `non_irritant` est immédiat (1 ligne TAG_CONFIG) une fois le slug Aurore créé ; row Tier 1 `vegan` sync avec `ANIMAL_PATTERNS` post-B.7 ; row `moment-crise` sync avec le code (`BHA actif-class` ≠ « salicylic top 5 »).
- **CSV diff orchestrator (audit O1)** — runner `audit-orchestrator-diff.ts` capture la would-emit set des 6 passes (snapshot mode) ou la compare à un baseline antérieur (diff mode) → `audit-diff.csv` avec `action,product_slug,tag_slug,relevance_before,relevance_after,source_before,source_after`. Workflow recalibration : (1) snapshot baseline avant changement, (2) éditer règles, (3) diff vs baseline. `make audit-orchestrator-diff CSV_OUT=… [BASELINE=…]` ; 7 unit tests pour `computeDiff`. Source-only changes ignorés (réattribution detector ↔ orchestrator pass = pas observable côté UI).
- **Audit actif-class (audit O3)** — runner `audit-actif-class.ts` (read-only) : per-cluster hit/agree/new + `only_db` (manual sans détection = drift signal) + top 3 kinds par cluster (catch gating). `make audit-actif-class`. Premier run a révélé drift important sur `vitamin-e` (756 only_db vs 193 hit) et `hyaluronic-acid` (518 vs 179) — patterns trop étroits, à investiguer dans une session calibration dédiée.
- **Calibration vitamin-e (cluster drift O3 #1)** — `positionCap: ∞` + patterns `[tocopherol, tocopheryl, tocotrienol]`. Drift 756 → 2 (recall 20 % → 99.85 %, +1567 paires). 3 tests added. Voir §"Calibration cluster vitamin-e".
- **Calibration hyaluronic-acid (cluster drift O3 #2)** — `positionCap: ∞` + patterns `['hyaluron']`. Drift 518 → 0 (recall 26 % → 100 %, +1198 paires). 2 tests added. Voir §"Calibration cluster hyaluronic-acid".
- **Calibration peptides (cluster drift O3 #3)** — `positionCap: ∞` + patterns `[peptide, matrixyl, argireline, syn-ake, pdrn]` inchangés. Drift 143 → 0 (recall 49 % → 100 %, +284 paires). 1 test added. Voir §"Calibration cluster peptides".
- **Calibration polyphenols (cluster drift O3 #4)** — `positionCap: ∞` + ajout `vitis vinifera` + broaden `camellia sinensis` (drop qualifier `leaf extract`). Drift 135 → 1 (recall 48 % → 99.6 %, +518 paires). 1 test added. Voir §"Calibration cluster polyphenols".
- **Calibration enzymes-exfoliants (cluster drift O3 #5)** — `positionCap: ∞` + ajout `lipase`. Drift 21 → 0 (recall 19 % → 100 %, +41 paires dont 7 cross-signal `moment-hebdomadaire`). 3 tests added. Voir §"Calibration cluster enzymes-exfoliants".
- **Calibration retinoids (cluster drift O3 #6)** — `positionCap: ∞`, patterns inchangés (déjà comprehensifs). `bakuchiol`/`beta-carotene` exclus (chimiquement non-retinoid). Drift 47 → 0 (recall 49 % → 100 %, +125 paires dont 56 cross-signal `moment-soir` + 4 `peau-sensible`). 3 tests added, 1 obsolète supprimé. Voir §"Calibration cluster retinoids".
- **Calibration vitamin-c (cluster drift O3 #7)** — `positionCap: ∞` + ajout `'vitamin c ester'` (edge case normalize-fragile sur marketing INCI). Drift 88 → 0 (recall 67 % → 100 %, +267 paires dont 110 cross-signal `moment-matin`). 3 tests added. Voir §"Calibration cluster vitamin-c".
- **Calibration ceramides (cluster drift O3 #8)** — `positionCap: ∞` + ajout `ceramide ng/as`. `phytosphingosine` testé puis rejeté (0 recall lift, 24 over-tag). Drift 49 → 0 (recall 77 % → 100 %, +288 paires, zéro cross-signal). 3 tests added. Voir §"Calibration cluster ceramides".
- **Calibration tyrosinase-inhibitors (cluster drift O3 #9)** — `positionCap: ∞` + ajout `undecylenoyl phenylalanine` + `hexylresorcinol`. `glycyrrhiza`/`glycyrrhizate` testé puis rejeté (+401 over-tag licorice ubiquitaire). `niacinamide` exclu (mécanisme transfert mélanosomes ≠ tyrosinase). Drift 21 → 0 (recall 70 % → 100 %, +73 paires, zéro cross-signal). 4 tests added. Voir §"Calibration cluster tyrosinase-inhibitors".
- **AHA / BHA / PHA — drift conservée par design (clusters acides)** — `positionCap: 10` retenu pour les 3 (chemistry-aware vs concentration-agnostic manual baseline). 254 manual tags conservés (126 AHA + 88 BHA + 40 PHA) mais détecteur ne fire pas — acide pH-dépendant past pos 10 = pH adjuster / preservative / chelator trace, pas exfoliant fonctionnel. 3 tests added. Voir §"AHA / BHA / PHA — drift conservée par design".
- **AHA / BHA / PHA cleanup (override CSV review)** — runner `audit-aha-bha-pha-overrides.ts` (read-only par défaut, opt-in `APPLY=1` pour DELETE ciblé). Auto-classifie 254 overrides en delete/keep/borderline via marqueurs nom (`aha`/`bha`/`pha`/`peeling`/`foliant`), produit anti-acne (`sebium`/`acniben`/`keracnyl`/`normaderm`/`effaclar`) et anti-pigmentation (`anti-taches`/`mela b3`/`melaclear`/`brightening`). User a validé 17 borderline KEEP (urea exfoliant, fermented essence, Medik8 Surface Radiance line, BHA pads/toners, cosrx PHA toners, multi-acid serums) sur 37 → **163 paires supprimées** (96 AHA + 46 BHA + 21 PHA). Backup pre-cleanup `./backups/backup_20260508_214401.sql`. Re-run audit post-cleanup : **91 overrides résiduelles toutes intentionnelles** (74 auto-keep marketed/acne/pigment + 17 borderline-keep). Voir §"AHA / BHA / PHA — drift conservée par design > Cleanup appliqué".
- **Gold set scaffolding (audit O2)** — schema + métriques + 2 runners + 42 tests. `gold-set.ts` (validation stricte), `gold-set-metrics.ts` (Brier/ECE/P/R/F1/macro/micro pure), `gold-set-bootstrap.ts` (sampler stratifié seedable, idempotent), `audit-gold-set.ts` (benchmark orchestrator vs annotations.json). `make gold-set-bootstrap` + `make audit-gold-set`. Annotation manuelle des 60-80 produits **reste à faire** pour produire les premières mesures absolues. Voir §"Gold set — scaffolding".
- **Gold set annotation + calibration O2 (2026-05-09)** — 70 produits annotés (15 tags focus ; `fini-glowy` unrated — sensoriel non confirmable par INCI seul). Macro F1 initial 0.936 → **0.994** (P=1.000, R=0.989) après corrections. Findings : (1) French INCI `acide ascorbique` / `acide 3-o-éthyl ascorbique` → pattern `ascorbique` ajouté (vitamin-c, 2 FN) ; (2) `melissa officinalis` ajouté (polyphenols, 1 FN) ; (3) `euphorbia cerifera` INCI botanique candelilla ajouté + groupe dédup (formula, 1 FN) ; (4) `balm` exclu de `TEXTURE_LEGERE_RINSE_OFF` — `peau` substring déclenchait `eau` water-token dans description française (1 FP) ; (5) `TEXTURE_RICHE` ajouté aux kind-tags de `balm` (1 FN). Backfill +197 paires. 5 tests added. 1 FN résiduel : cosrx gluconolactone pos-11 (hors calibration — positionCap:10 by design). Commits : `c0f5b16c` (scaffold) + `3021c214` (annotation+calibration).

**📋 Restants à faire :**

| Priorité | Item | Effort | Statut |
|----------|------|--------|--------|
| ~~🔴 R4~~ | ~~semi-occlusif (squalane/dimethicone/isohexadecane cap 5)~~ ✅ Done 2026-05-09 — `detectSemiOcclusif` (formula-detection.ts). Patterns `squalane` / `dimethicone` / `dimethiconol` / `isohexadecane` top 5. Leave-on only. **Mutex avec `occlusif`** (petrolatum-led top 8 → skip semi-occlusif, garde la distinction film-former vs émollient). Squalene (animal sebum lipid) ne match pas `squalane` (substring strict). Cyclomethicone (silicone volatile) exclu — patterns explicites `dimethicone`/`dimethiconol`. Slug `semi-occlusif` (skin_effect) inséré via migration `2026-05-09_r4-semi-occlusif.sql`. Backfill : 285 paires. 9 tests added. | M | Done |
| ~~🟡 S5~~ | ~~texture-gel/mousse/stick~~ ✅ Done 2026-05-09 — `detectTextureFromField` (pure pass-through `products.texture` → TEXTURE_*) + `detectTextureGelInci` (gel-former top 5 + 0 oil + 0 butter/wax + 0 silicone-led, leave-on only) câblés en passe 4. mousse/stick attendent admin curation (pas d'INCI fallback fiable). Backfill : +93 paires `texture-gel`. 18 tests added. | M | Done |
| ~~🔵 X2~~ | ~~SPF + vit C → moment-matin réaffirmé~~ ✅ Done 2026-05-09 — vit-C cross-signal étendu à `kind=sunscreen` (en plus de `LEAVE_ON_KINDS`). Impact DB = 0 paire (kind-tag émet déjà `moment-matin` pour sunscreen) ; valeur = sémantique + audit-orchestrator attribue désormais `moment-matin` au combo, pas seulement à kind. 2 tests added. | XS | Done |
| ~~🟠 Tier 2~~ | ~~`eczema-atopie` / `effet-protecteur` / `repulpant`~~ ✅ Done 2026-05-09 — 3 détecteurs formula-pass (`detectEczemaAtopie`, `detectEffetProtecteur`, `detectRepulpant`). Algo-derm `peaux_atopiques` / `repulpant` restent `allow:false` (cohabitation documentée). +155 paires total (72+82+1, repulpant strict yields tight set : 8 hits dont 7 déjà manuels). | M-L | Done |
| ~~⚙️ D.3 hoist~~ | ~~Propager `normalizedIngredients` aux détecteurs formula/actif-class/cross-signal pour éviter `splitINCI(inci).map(normalize)` × N par produit~~ ✅ Done 2026-05-09 — helper `utils/ingredient-resolver.ts` (`resolveIngredients`), orchestrator hoist `normalizedIngredients` once et le forward à passe 2/4/5 + Pass 6 (`computeAvoidCandidates` + `detectGrossesseAvoid` + `detectActifClasses`). Tous les détecteurs gardent un `inci` fallback (back-compat tests directs). 0 paire diff (no behavior change). 290 tests passent. | M | Done |
| ~~🔒 T3-T5~~ | ~~Migrations taxonomiques (slugs / fields produits)~~ ✅ Done 2026-05-09 — T1/T2/T3/T4/T5 tous livrés (voir entries individuelles ci-dessous). | M-L | Done |
| ⚙️ O1 | CSV diff backfill (audit-diff.csv) | S | ✅ Done — runner `audit-orchestrator-diff.ts` (snapshot mode `CSV_OUT=…` ou diff mode `CSV_OUT=… BASELINE=…`) ; `make audit-orchestrator-diff` ; 7 unit tests `audit-orchestrator-diff.test.ts`. Mesure pre/post calibration sur l'output orchestrator complet (6 passes), pas seulement passe 1. Source change ignoré, seul `(product, tag, relevance)` observable. |
| ⚙️ O2 | Gold set 50-100 produits annotés (precision/recall) | M | ✅ Done 2026-05-09 — 70 produits annotés, macro F1=0.994 (P=1.000, R=0.989). Calibration commits `c0f5b16c`+`3021c214`. |
| ⚙️ O3 | Audit dédié actif-class (passe 2 stats) | S | ✅ Done — runner `audit-actif-class.ts` (read-only) ; per-cluster hit/agree/new + `only_db` (manual sans détection = drift signal) + top 3 kinds par cluster (catch gating drift). `make audit-actif-class`. Premier run révèle drift important : `vitamin-e` 756 only_db vs 193 hit, `hyaluronic-acid` 518 vs 179 — recall à investiguer dans une session calibration. |

**Statut commit** : `16b8ec60` sur `products-branch` absorbe l'intégralité du sweep (R1 position gating + R2 + R3 + C1-C6 + X1 + T1). 11 fichiers, +3 451 / -25 lignes. Aucun changement auto-tags antérieur en historique git.

### 🔬 Follow-ups émergés post-roadmap (2026-05-09)

Items détectés après clôture du backlog R/C/S/X/T/O. Non-bloquants, à planifier au fil de l'eau quand le signal le justifie.

| # | Item | Effort | Origine |
|---|------|--------|---------|
| ~~F1~~ | ~~Calibration recall actif-class clusters~~ ✅ **Vérifié closed 2026-05-09** — audit-actif-class re-run montre tous clusters à 100% agree. Calibration vit-E (2026-05-08, +1567 paires) + HA (+1198) + peptides (+284) + polyphenols (+518) + enzymes-exfoliants (+41) + tyrosinase (+73) toutes appliquées et write effectué (DB: vit-E 1860, HA 1408, polyphenols 675, ceramides 440, peptides 429, vit-C 418). Drift résiduelle = noise annotation (vit-E 2, polyphenols 1) ou par-design (AHA/BHA/PHA positionCap:10 — overrides cleanés ligne 1092). Pas d'investigation à reconduire. | — | Closed |
| ~~F2~~ | ~~**Extension `texture-creme` au-delà de `hand-cream`**~~ ✅ Done 2026-05-09 (migration `0054`) — Path 2 (default-creme par kind + vétos INCI) retenu. `detectTextureCremeInci` réécrit : default pour `moisturizer` + `foot-cream`, 6 vétos (surfactant ionique, ≥2 butter/wax, huile pos 1, pas d'eau top 5, gel-former sans phase huileuse, serum pur). Fix bug slash-normalisation (`caprylic/capric` → `caprylic capric`). Eye-cream hors scope (trop hétérogène — ticket séparé). **+682 paires** (676 moisturizer + 6 foot-cream) · **−368 stale** (sunscreen 402 + body-lotion 23 + autres 17 + eye-cream 2 − new 76). DB finale : 701 pairs (vs 1069 legacy). | S | Done |
| ~~F3~~ | ~~**Audit taxonomie round 2**~~ ✅ Done 2026-05-09 (migration `0053`) — 5 candidats challengés : `apaisant` KEEP (soothing benefit axis algo-derm distinct, 33-39 % overlap avec barriere/reparation = stack thérapeutique normal), `prebiotique` KEEP (14 patterns INCI factuels, pas marketing-flavored), `non-gras` KEEP (status quo session précédente, 60 paires conservatif), `keratolytique` KILL product-side (subset AHA+BHA+RETINOIDS+urea, 53 % overlap strict avec actif_class clusters ; ingredient-side `keratolytique` préservé pour chemistry classification). `effet-protecteur` MERGE-KILL product-side (Trigger B délègue déjà à detectTextureRiche, 74 % co-fire ; Trigger A lanolin = ~24 niche balms tombent à kind tags, acceptable ; ingredient-side `effet-protecteur` préservé). **−688 paires DB** (595 + 93). Slugs sensoriel/skin_effect product-side passent de 4+12 → 4+10. | S | Done |
| F4 | **`texture-mousse` / `texture-stick`** — non-derivable INCI seul, dépendent admin curation `products.texture` field (T3 phase B done, 3738 NULL). Tracker quand coverage admin suffisante (~30%+) pour décider INCI fallback distinct ou rester pure pass-through. | M | S5 phase B partielle |
| F5 | **Brier/ECE pipeline** — gold set §"Note Brier/ECE" (ligne 994) — pipeline en place mais 16 tags focus actuels = déterministes (passes 2-6 orchestrator), Brier dégénère en taux mauvais classement, ECE single-bin. À revisiter quand scope gold set s'étend à algo-derm passe 1 (concerns/skin types/absence) qui portent une `confidence` calibrable. **Defer** sauf si on calibre passe 1. | XS | Gold set scope expansion |

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

> **MAJ 2026-05-09** : 16 slugs résolus depuis l'audit initial (T1 sweep absorbe S1-S4 + `peau-normale` + `vegan` + `pigments-verts` + `hypoallergenique` + `moment-crise` + `matifiant` ; T4 absorbe `cruelty-free` + `bio-naturel` ; T5 absorbe `protection-cutanee` → `effet-protecteur` ; S5 absorbe `texture-gel`). **Marketing cleanup 2026-05-09** : `fini-glowy` killed (non-confirmable INCI) + `absorption-rapide` killed (pattern duplicate, mergé dans `non-gras`). Reste **7 slugs** non peuplés (~9 %) : `eczema-atopie` (semantic noise), `peau-mixte` (volontairement exclu), `repulpant` (`allow:false`), `texture-mousse` + `texture-stick` (admin curation), `texture-creme` (gating partiel), `type-outil` (pas de ProductKind correspondant). Tableaux ci-dessous mis à jour ✅ par sous-section.

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
