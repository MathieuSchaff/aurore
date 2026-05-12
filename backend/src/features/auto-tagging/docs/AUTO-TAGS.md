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

### Passe 2 — `passes/actif-class-detection.ts`

**Fichier :** `backend/src/features/auto-tagging/passes/actif-class-detection.ts`
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

### Passe 3 — `passes/kind-tag-detection.ts`

**Fichier :** `backend/src/features/auto-tagging/passes/kind-tag-detection.ts`
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

### Passe 4 — `passes/formula/`

**Dossier :** `backend/src/features/auto-tagging/passes/formula/` (15 fichiers + `index.ts`)

23 détecteurs via patterns INCI (que algo-derm ne couvre pas), un fichier par famille de slug émis. Le détail des détecteurs ci-dessous couvre les plus représentatifs ; consulter chaque fichier pour les patterns exacts.

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
| `vegan.ts` | `vegan` |
| `peau-normale.ts` | `peau-normale` (post-pass, abstient si autre skin-type fired) |
| `grossesse-avoid.ts` | `grossesse-compatible` (relevance=`avoid`) |
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
         propose('vegan', 'secondary', 'brand')
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
just backfill-auto-tags                           # dry-run (lecture seule, affiche les stats)
WRITE=1 just backfill-auto-tags                   # applique
SLUG=<slug> just backfill-auto-tags               # dry-run sur un seul produit (debug)
LIMIT=50 WRITE=1 just backfill-auto-tags          # applique sur 50 produits (test progressif)
TARGET=prod WRITE=1 just backfill-auto-tags       # prod (demande confirmation "PROD")
CONF_OVERRIDE=0.7 just backfill-auto-tags         # rehausse le floor algo-derm minConf
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

---

## Comment les tags arrivent à un produit

Trois chemins, tous via l'orchestrator partagé (`features/auto-tagging/orchestrator.ts`) → output identique pour un même input produit :

1. **Création API runtime** — `features/products/service.ts createProduct()` appelle `writeTagsForProduct(product.id)` après l'insert. Inline, fail-soft (une erreur tagging log warn, ne bloque pas la création).
2. **Seed initial** — `db/seed/seeders/seed-core.ts` appelle `detectAllAutoTags` pendant le reseed depuis zéro. Les produits du seed JSON ont leurs tags auto-générés dès le premier insert.
3. **Backfill** — `features/auto-tagging/runners/backfill/main.ts` ré-applique sur les produits **déjà en DB** (e.g. produits ajoutés avant que des règles existent, ou recalibration des seuils).

La parité des trois chemins est garantie par `tests/auto-tag-orchestrator-parity.test.ts`.

---

## Résumé des fichiers

| Fichier | Rôle | Utilise algo-derm ? |
|---------|------|---------------------|
| `orchestrator.ts` | Lance toutes les passes dans l'ordre, déduplique (avoid > secondary), hoist `analyzeINCI` + `stripMarketingPreamble` une fois | `analyzeINCI` + `splitINCI` + `normalize` |
| `lib/ingredient-resolver.ts` | `stripMarketingPreamble` — supprime le prose marketing avant l'INCI (589 produits K-beauty / EU) | Non |
| `passes/auto-tag-detection.ts` | Passe 1 — concerns, skin type, comédogénicité, sans-parfum, grossesse-compatible secondary | `analyzeINCI` + `tagProduct` + `splitINCI` |
| `passes/actif-class-detection.ts` | Passe 2 — clusters pharmacologiques | `splitINCI` + `normalize` |
| `passes/kind-tag-detection.ts` | Passe 3 — TYPE_*, ZONE_*, STEP_*, MOMENT_*, TEXTURE_* | Non |
| `passes/formula/` | Passe 4 — 16 fichiers (occlusif, semi-occlusif, solaires, prébiotique, eczema, repulpant, KP, step-nettoyage, cernes, fini-mat, pigments-verts, vegan, peau-normale, grossesse-avoid, reparation-cutanee, texture) | `splitINCI` + `normalize` |
| `passes/cross-signal-detection.ts` | Passe 5 — MOMENT_SOIR/MATIN depuis actif × kind ; `detectInteractionSecondaryTags` (passe 5a) — photosensibilité multi-HE depuis assessment | `analyzeINCI` (passe 5a) |
| `passes/percent-claim-detection.ts` | Passe 5x — fallback `% INCI structuré` quand INCI fragile | `splitINCI` |
| `passes/brand-cert-detection.ts` | Passe 5b — labels brand (vegan / cruelty-free / bio-naturel) depuis `brand_certifications` | Non |
| `passes/auto-tag-avoid.ts` | Passe 6 — agrégateur avoid (grossesse + cross-signal + interactions algo-derm) | Via les passes ci-dessus |
| `write.ts` | API runtime — `writeTagsForProduct(productId)` consommé par `createProduct()` | Via orchestrator |
| `runners/backfill/main.ts` | Runner batch — ré-applique l'orchestrator sur toute la DB | Via orchestrator |
| `runners/audit/main.ts` | Runner audit — dry-run avec stats par tag (passe 1 uniquement) | Via `auto-tag-detection.ts` |

---
