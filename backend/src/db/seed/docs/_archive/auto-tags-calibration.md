# AUTO-TAGS — Calibration history (2026-05-07 → 2026-05-08)

> Log historique des dry-run + passes calibration (R1, R2, R3, C1-C6, X1, T1, T1.11, S1-S4, cluster recalibrations vit-E/HA/peptides/polyphenols/enzymes/retinoids/vit-C/ceramides/tyrosinase + AHA/BHA/PHA + gold set scaffolding).

> Sorti de `AUTO-TAGS.md` pour réduire la surface de lecture quotidienne.

> Index résumé des résultats : voir `AUTO-TAGS.md` §"Roadmap damélioration" (status par item).

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
