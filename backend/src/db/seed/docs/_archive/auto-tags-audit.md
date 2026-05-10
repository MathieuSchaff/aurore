# Audit complet auto-tagging (Aurore ↔ algo-derm)

Date: 2026-05-08
Périmètre: `backend/src/db/seed/docs/AUTO-TAGS.md`, implémentation seed/backfill/tests dans Aurore, comparaison avec `/home/schaff/Mathieu/projets/algo-derm`.

## 1) Résumé exécutif

Le système actuel est globalement solide: vous utilisez bien `analyzeINCI`, `tagProduct`, `splitINCI`, `normalize`, avec des garde-fous pertinents (coverage floor, minConf per-tag, exclusion rinse-off, avoid > secondary).

Le principal manque n’est pas la qualité des règles, mais la **cohérence d’exécution**: le seed principal (`seed-core.ts`) n’applique qu’une partie des passes, alors que le runner `backfill-auto-tags.ts` applique la version complète.

Côté potentiel `algo-derm`, vous exploitez bien le bloc "tags produit", mais vous sous-exploitez:
- les interactions (`assessment.interactions`) hors grossesse,
- les tags absence disponibles (`sans_sulfates`, `sans_silicones`, etc.),
- la couche regulatory (`ingredientTags`) pour signalétique sécurité.

## 2) Ce qui est bien fait

- Architecture multi-pass claire et défensive (`algo-derm` + classif actif + kind + formula + cross-signal + avoid).
- Gating de précision mature dans `auto-tag-detection.ts`:
  - `COMPUTED_COVERAGE_FLOOR` + `coverageMin` per-tag,
  - `excludeRinseOff` sur comédogénicité,
  - dédup sémantique (`purifiant` désactivé),
  - `hypoallergenique` réactivé avec garde-fous.
- Priorité de relevance correcte (`avoid` écrase `secondary`) dans le backfill.
- Tests utiles sur les zones risquées (coverage, grossesse, position gating, etc.).

## 3) Problèmes / risques identifiés

## 3.1 Écart d’orchestration entre seed et backfill (important)

`seed-core.ts` ne lance que:
- `detectActifClasses`
- `detectAutoTags`

Il ne lance pas:
- `detectKindTags`
- `formula-detection` (occlusif, solaire, prébiotique, vegan, etc.)
- `detectCrossSignalTags`
- `detectGrossesseAvoid`

Conséquence: selon le flux d’initialisation, vous pouvez avoir un tagging partiel tant que `backfill-auto-tags.ts` n’a pas tourné.

## 3.2 Pipeline en double (ancien script "brut")

`backend/src/db/seed/scripts/auto-tag.ts` contient une logique heuristique historique en parallèle (mapping maison INCI→tags), différente de la pipeline actuelle.

Risque:
- confusion opératoire,
- divergences de résultats selon le script utilisé,
- maintenance inutilement coûteuse.

## 3.3 Sous-utilisation d’algo-derm (potentiel non exploité)

Vous utilisez surtout `tagProduct`, mais pas (ou peu) les outputs suivants:
- `assessment.interactions` (autres signaux cliniques utiles que grossesse),
- `ingredientTags(assessment)` (tags heuristiques + regulatory),
- plusieurs absence tags algo-derm déjà prêts (`sans_sulfates`, `sans_silicones`, etc.) non mappés à votre taxonomie produit.

## 3.4 Heuristiques formula "substring" indépendantes de l’evidence DB

`formula-detection.ts` repose sur des listes `includes()` locales. C’est pragmatique, mais ça duplique partiellement la connaissance d’`algo-derm` et peut dériver dans le temps.

Ce n’est pas "faux" aujourd’hui, mais c’est fragile à moyen terme si la base alias/evidence d’`algo-derm` évolue.

## 3.5 Couplage versionnel implicite avec algo-derm vendored

Aurore dépend d’un `file:../vendor/algo-derm.tgz`. Si le repo `algo-derm` évolue sans refresh du `.tgz`, vous perdez des améliorations (aliases, rules, tag logic) sans visibilité immédiate.

## 4) Question clé: "rate-t-on des ingrédients faute de mapping ?"

Réponse courte: **oui, potentiellement sur certaines passes heuristiques locales**, mais pas sur le cœur `analyzeINCI/tagProduct`.

- Cœur algo-derm: plutôt robuste grâce au `buildAliasIndex` + `common_name_aliases.json` + normalisation parser.
- Passes locales (`actif-class`, `formula-detection`): matching direct par patterns substring; donc moins riches que l’alias index/evidence DB.

Exemple de risque réel:
- un ingrédient reconnu par algo-derm via alias/evidence peut ne pas déclencher une règle locale si son synonyme n’est pas dans la liste pattern locale.

## 5) Recommandations (priorisées)

1. Unifier le point d’entrée auto-tagging
- Créer un orchestrateur unique réutilisé par `seed-core`, `backfill-auto-tags`, audit.
- Objectif: zéro divergence de passes selon le runner.

2. Déprécier `scripts/auto-tag.ts`
- Le marquer legacy (ou supprimer) pour éviter les exécutions accidentelles de l’ancienne logique.

3. Exploiter davantage `algo-derm` au lieu de recoder
- Ajouter un mapping explicite de `assessment.interactions` vers certains tags/warnings Aurore.
- Évaluer l’ajout de slugs produit pour absence tags utiles déjà fournis par algo-derm.
- Étudier l’utilisation de `ingredientTags()` pour enrichir sécurité/réglementaire (au moins en audit interne).

4. Réduire la "brutalité" des heuristiques locales
- Quand possible, baser les règles formula sur sorties `assessment.matchedEvidence`/flags plutôt que seulement `includes()`.
- Garder les règles spécifiques sensorielles (fini-mat, texture…) en local, mais adosser les règles safety/actifs au moteur algo-derm.

5. Mettre un contrôle de dérive versionnelle
- Ajouter un check CI/documenté: version/sha d’`algo-derm` attendu vs vendored `.tgz`.
- Rendre explicite la procédure de refresh du vendor package.

## 6) Plan d’amélioration concret (court terme)

- Étape A: extraire une fonction unique `detectAllAutoTags(product)` (6 passes + precedence) dans `utils/`.
- Étape B: faire appeler cette fonction par `seed-core` et `backfill-auto-tags`.
- Étape C: ajouter un test d’intégration qui compare `seed-core` vs `backfill` sur un mini set produit et vérifie l’égalité des tags.
- Étape D: ouvrir un lot "algo-derm leverage":
  - mapping interactions,
  - mapping absence tags,
  - POC sur `ingredientTags` en mode audit.

## 7) Conclusion

Vous utilisez déjà `algo-derm` correctement sur le noyau de tagging. Le plus gros levier n’est pas de "changer les règles", mais:
- d’éliminer les chemins parallèles,
- de brancher tous les runners sur la même orchestration,
- d’absorber plus d’outputs natifs d’`algo-derm` (interactions, absence, regulatory) pour éviter les heuristiques redondantes.


## 8) Audit maintenabilité / lisibilité (approfondi)

Cette section complète l’audit avec un angle "qualité du code" pur.

### 8.1 Problèmes de structure

- **Orchestration dispersée**: la logique métier est répartie entre `seed-core.ts`, `backfill-auto-tags.ts`, `audit-auto-tags.ts` et un script legacy `scripts/auto-tag.ts`.
- **Source de vérité multiple**: l’ordre des passes et la precedence relevance sont codés dans `backfill-auto-tags.ts`, pas dans un module orchestrateur réutilisable.
- **Risque de régression silencieuse**: un ajout de détecteur dans un runner peut être oublié dans un autre.

Amélioration:
- Créer `backend/src/db/seed/utils/auto-tag-orchestrator.ts` avec:
  - `detectAllTagsForProduct(product, options)`
  - `mergeByRelevance(candidates)`
  - `AutoTagSource` typé
- Faire consommer cet orchestrateur par seed/backfill/audit.

### 8.2 Problèmes de typage et contrats

- Cast récurrent `product.kind as ProductKind` dans les runners.
- `category` manipulé en strings libres selon les fichiers.
- Plusieurs listes de kind (leave-on/rinse-off/eligible) dupliquées selon modules.

Amélioration:
- Introduire des types utilitaires partagés:
  - `type SkincareEligibleCategory = 'skincare' | 'solaire' | 'bodycare'`
  - `isSkincareKind(kind): kind is ProductKind` (guard runtime)
- Centraliser les ensembles métier dans un seul module `tagging-domain.ts`.

### 8.3 Duplication de connaissance métier

- Listes d’ingrédients et seuils recodés dans plusieurs détecteurs.
- Certaines familles (ex: filtres, actifs exfoliants) existent à la fois dans `actif-class`, `formula-detection`, `cross-signal`.

Amélioration:
- Introduire un `rules catalog` versionné (JSON/TS) pour:
  - patterns,
  - caps positionnels,
  - kind gating,
  - rationale.
- Chaque détecteur consomme ce catalogue au lieu de constantes locales.

### 8.4 Lisibilité des détecteurs

Points actuels:
- `formula-detection.ts` est volumineux (beaucoup de détecteurs dans un fichier unique).
- Le fichier reste lisible grâce aux commentaires, mais le coût cognitif monte vite.

Amélioration:
- Split en modules:
  - `formula/occlusive.ts`
  - `formula/filters.ts`
  - `formula/sensorial.ts`
  - `formula/safety.ts`
  - `formula/skin-type.ts`
- Garder un `formula/index.ts` qui expose une API stable.

### 8.5 Convention de nommage

- Mélange FR/EN dans les IDs, fonctions et commentaires (ex: `detectGrossesseAvoid`, `detectFiniMat`, `relevance`, `source`).
- Cela reste compréhensible pour l’équipe actuelle, mais ralentit l’onboarding.

Amélioration:
- Choisir une convention unique pour le code (EN recommandé) et garder FR uniquement dans les docs métier.
- Exemple:
  - `detectPregnancyAvoidTags`
  - `detectMatteFinishTags`
- Conserver les slugs métier actuels (pas besoin de migration de taxonomie).

### 8.6 Testabilité

Forces:
- Bonne couverture unitaire par détecteur.

Gaps:
- Peu de tests "pipeline end-to-end" qui valident la composition des 6 passes + precedence.
- Pas de test de non-régression entre `seed-core` et `backfill`.

Amélioration:
- Ajouter un test d’intégration `auto-tag-orchestrator.test.ts` avec fixtures produits.
- Ajouter un snapshot test par "profil produit" (serum retinoid, cleanser BHA, SPF minéral, etc.).
- Ajouter un test de parité: `seed-core` vs `backfill` doivent produire le même set de tags pour une fixture.

### 8.7 Observabilité / auditabilité

Actuellement:
- Le backfill log des compteurs globaux utiles.

Manques:
- Pas de "raison d’émission" standardisée par tag pour debug fin.
- Pas de mode explain structuré.

Amélioration:
- Étendre le modèle candidat avec:
  - `reasonCode` (ex: `RETINOID_TOP12`, `COVERAGE_BELOW_FLOOR`, `RINSE_OFF_EXCLUDED`),
  - `detectorVersion`.
- En mode dry-run, exporter un CSV/JSON d’explication pour QA produit.

### 8.8 Gestion de versions des règles

- Les calibrations sont bien documentées dans `AUTO-TAGS.md`, mais la version active des règles n’est pas encapsulée en objet/version formel.

Amélioration:
- Introduire `AUTO_TAG_RULESET_VERSION = '2026-05-08-r3-t1-x1'`.
- L’inclure dans les logs, rapports d’audit et snapshots tests.

### 8.9 Dette technique opérationnelle

- Script legacy `scripts/auto-tag.ts` reste présent et peut être invoqué par erreur.
- Dépendance `algo-derm` vendored non synchronisée automatiquement.

Amélioration:
- Mettre un avertissement runtime explicite dans `scripts/auto-tag.ts` (deprecated, pointer vers backfill/orchestrateur).
- Ajouter un script CI qui compare version `algo-derm` attendue vs package vendored.

## 9) Roadmap de refacto (sans big-bang)

### Phase 1 (faible risque)

- Extraire orchestrateur unique sans changer les règles.
- Brancher `backfill` dessus.
- Ajouter tests de parité.

### Phase 2 (moyen risque)

- Brancher `seed-core` sur le même orchestrateur.
- Déprécier `scripts/auto-tag.ts`.
- Split `formula-detection.ts` en sous-modules.

### Phase 3 (valeur algo-derm)

- Intégrer mapping `assessment.interactions`.
- Intégrer une partie des absence tags manquants.
- Introduire mode explain standardisé.

## 10) Gains attendus

- Moins de bugs de divergence entre runners.
- Onboarding plus rapide (surface code plus petite par module).
- Debug produit plus simple (raisons d’émission explicites).
- Meilleure réutilisation d’`algo-derm` et moins de logique dupliquée.

---

# AUDIT DE CLAUDE CODE

Date : 2026-05-08
Modèle : Claude Opus 4.7 (1M context)
Méthode : lecture intégrale des sources Aurore (`backend/src/db/seed/utils/*`, `runners/backfill-auto-tags.ts`, `runners/seed-core.ts`, `runners/audit-auto-tags.ts`, `scripts/auto-tag.ts`, `features/dermo-score/profile-mapping.ts`) + algo-derm (`src/index.ts`, `src/analyzer.ts`, `src/parser.ts`, `src/engine/{tags,interactions,matching,types,productAssessment}.ts`, `data/rules/*.json`). Cross-check des affirmations du rapport ChatGPT ci-dessus.

## A) Verdict sur l'audit ChatGPT

### A.1 Affirmations confirmées (justes)

| Claim ChatGPT | Vérification | Verdict |
|---|---|---|
| `seed-core.ts` ne lance que les passes 1+2 (algo-derm + actif-class) | `runners/seed-core.ts:235,259` — seuls `detectActifClasses` et `detectAutoTags` sont appelés ; pas un seul `import` des autres détecteurs | ✅ exact |
| `scripts/auto-tag.ts` est une pipeline parallèle obsolète | Aucune référence dans `Makefile`, `package.json`, ou autre runner. Cité uniquement dans `STATE.md`/`ROADMAP.md` (docs historiques) et l'audit ChatGPT lui-même | ✅ exact, et c'est même pire : code mort, jamais invoqué |
| `assessment.interactions` sous-utilisé hors grossesse | `grep -rn "assessment.interactions"` dans `backend/src` → 0 hit | ✅ exact |
| `ingredientTags()` jamais appelé par Aurore | `grep -rn "ingredientTags\b"` (l'export d'algo-derm) → 0 hit dans le code applicatif | ✅ exact |
| `assessment.coverage.ratio < 0.30` floor + `coverageMin` per-tag | Bien présent dans `auto-tag-detection.ts:132,162-163` | ✅ exact |
| Précédence `avoid > secondary` correcte dans le backfill | `backfill-auto-tags.ts:73,191` (`RELEVANCE_RANK`) | ✅ exact |
| Listes ingrédients dupliquées entre détecteurs | Vérifié, voir §C.4 ci-dessous | ✅ exact (mais ChatGPT minimise l'impact) |

### A.2 Affirmations imprécises ou incomplètes

#### Sur les "absence tags non mappés"
ChatGPT écrit (§3.3, §T1) : « plusieurs absence tags algo-derm déjà prêts (`sans_sulfates`, `sans_silicones`…) non mappés à votre taxonomie produit ».

Cadrage incomplet : ce n'est pas un bug de code, c'est un **choix taxonomique délibéré**. Les slugs Aurore correspondants n'existent pas encore dans `shared/src/products/skincare/tag-slugs.ts` (le ticket T1 dans `AUTO-TAGS.md` est explicitement bloqué sur cette migration). Les tags algo-derm sont émis mais filtrés par `TAG_CONFIG[tag.id]` qui retourne `undefined` → skip silencieux à la passe 1 (`auto-tag-detection.ts:169`). Ce n'est pas « non mappé » par oubli, c'est gating volontaire.

#### Sur les interactions hors grossesse
ChatGPT recommande de mapper `assessment.interactions` plus largement. Vérification du `interaction_rules.json` d'algo-derm (15 règles) :
- 5 règles **inconditionnées** ou conditionnées seulement sur leaveOn/pH : `alcohol+fragrance`, `alcohol+allergen`, `acid+alcohol`, `multiple-essential-oils`, `mitigation-niacinamide+glycerin`, `isothiazolinone-leave-on`. Ces règles **peuvent firer au seed-time** et c'est ce surface utile.
- 4 règles avec `contextCondition.estimatedPH` : silent quand pH inconnu (`interactions.ts:67`). Aurore ne capture pas le pH des produits → ces règles ne firent **jamais**. C'est inerte et ne le sera pas tant qu'on n'aura pas un champ `products.estimated_ph`.
- 5 règles avec `profileCondition` (`pregnant`, `sensitiveSkin`, `acneProne`) : silent au seed-time car `auto-tag-detection.ts:155` appelle `analyzeINCI(inci, { context: mapKindToContext(kind) })` **sans profile**. Donc `retinoid-pregnancy`, `hydroquinone-pregnant`, `retinoid-sensitive-skin-leave-on`, `comedogenic-leave-on-acne-prone`, `isothiazolinone-rinse-off-sensitive` ne firent jamais via algo-derm dans la pipeline auto-tag.

**Conséquence non triviale** : la fonction `tagProduct` d'algo-derm, dans son test `grossesse-compatible`, fait `hasPregnancyContraindication` qui inspecte `assessment.interactions` (`tags.ts:146`). Comme cette liste est vide pour les contraindications grossesse, **le check tombe sur le seul `includesAny([retinol, retinal, retinaldehyde, retinyl, adapalene, tretinoin, hydroquinone])`** — liste plus courte que celle d'Aurore (`formula-detection.ts:397-413`). Aurore compense via son propre `detectGrossesseAvoid` (passe 4) avec une liste rétinoïde étendue. Ce n'est pas un bug, mais c'est un détail que ChatGPT n'a pas tracé.

Donc le potentiel d'exploitation des interactions est réel mais **plus étroit que suggéré** : essentiellement les 5 règles inconditionnées. Pour exploiter le reste, il faudrait soit des données pH au niveau produit (T3 backlog), soit un appel `analyzeINCI` au runtime (côté `dermo-score/service.ts` qui *passe* le profile, pas côté seed).

#### Sur la "robustesse du noyau via `buildAliasIndex`"
ChatGPT écrit (§4) : « Cœur algo-derm : plutôt robuste grâce au `buildAliasIndex` + `common_name_aliases.json` ».

Cadrage à nuancer. Le `common_name_aliases.json` fait **44 lignes**, principalement des noms vernaculaires anglais (`vitamin c → ascorbic acid`, `argan oil → argania spinosa kernel oil`). En pratique, l'INCI Aurore (corpus `data/products/*` + Korean skincare imports) est déjà en forme INCI normalisée → l'alias index sert peu. La vraie valeur de `buildAliasIndex` est `stripBotanicalParts` (`matching.ts:44-50` — drop des suffixes `leaf/seed/root/extract`), qui **n'a aucun équivalent dans les détecteurs Aurore locaux**. Un produit avec `Centella Asiatica Leaf Extract` est résolu via algo-derm vers la même evidence que `Centella Asiatica Extract`, mais le `detectReparationCutanee` Aurore matche par substring `'centella asiatica'` → ça passe car le substring est présent. Si l'evidence DB renomme un jour la canonical en `Hydrocotyle Asiatica`, algo-derm continue à matcher via aliases, Aurore non. La fragilité est latente, pas active aujourd'hui.

### A.3 Recommandations ChatGPT à pondérer

- **« Unifier le point d'entrée auto-tagging »** (§5.1) → bon principe mais surdimensionné comme refacto big-bang. Voir §D ci-dessous pour version progressive.
- **« Mode explain standardisé »** (§8.7, `reasonCode`) → utile mais à coût élevé pour valeur diagnostique seulement. À reporter après les bugs concrets §B-C.
- **« Convention nommage EN »** (§8.5) → cosmétique, faible ROI vs gold set / tests parité.

## B) Bugs concrets et risques que ChatGPT n'a pas identifiés

### B.1 Au seed initial, AUCUN tag d'avoid n'est calculé

`runners/seed-core.ts:230-269` — le seed initial appelle uniquement `detectActifClasses` et `detectAutoTags`. **Aucune** des sources avoid n'est invoquée :
- pas de `detectGrossesseAvoid` (passe 4)
- pas de `detectCrossSignalAvoidTags` (passe 5, le stack irritation X1)
- l'appel `detectAutoTags` n'émet que des tags `relevance: 'secondary'` (`auto-tag-detection.ts:191`)

Conséquence : un `make dev-fresh` produit une DB où **aucun produit n'est marqué avoid pour la grossesse ou pour le stack rétinoïde+exfoliant**. Toute la couche safety dépend du runner `backfill-auto-tags` exécuté ensuite. Si quelqu'un seed et déploie sans backfill, les avertissements UI grossesse disparaissent silencieusement.

ChatGPT mentionne « tagging partiel » mais minimise le périmètre. La vérité est : **0 tag avoid**, pas « partiel ».

Action : appeler `detectGrossesseAvoid` et `detectCrossSignalAvoidTags` depuis `seed-core.ts` également, ou (mieux) consolider tous les détecteurs dans un orchestrateur partagé (cf §D).

### B.2 Liste rétinoïde divergente entre `actif-class-detection` et `formula-detection`

- `actif-class-detection.ts:38-55` (cluster RETINOIDS) inclut `'sodium retinoyl hyaluronate'`.
- `formula-detection.ts:397-413` (`RETINOID_PATTERNS` pour grossesse-avoid) **ne l'inclut pas**.

Conséquence : un produit contenant `Sodium Retinoyl Hyaluronate` reçoit le tag cluster `retinoids` mais **n'est pas marqué `grossesse-compatible/avoid`**. C'est un dérivé rétinoïque (rétinoyl ester sur HA backbone) → contre-indiqué grossesse au même titre que les autres retinyl esters. **Bug safety net**.

Fix immédiat : ajouter `'sodium retinoyl hyaluronate'` à `formula-detection.ts:RETINOID_PATTERNS`. Plus durable : exporter une seule constante `RETINOID_INCI_PATTERNS` partagée par les deux détecteurs.

### B.3 `detectFiniGlowy` n'exclut pas les beurres/cires

`formula-detection.ts:676-697` : exige glycerin top 3 + HA top 5 + zéro absorbent powder top 8. Mais **aucune exclusion de beurres/cires** (shea, cocoa, beeswax, etc.). Asymétrique avec `detectTextureLegere:636-660` qui les exclut explicitement via `HEAVY_EXCLUSION_PATTERNS`.

Conséquence : un cica cream lourd avec glycerin pos 1 + HA pos 4 + shea butter pos 5 firera `fini-glowy` ET `texture-riche`. Cohérence sémantique douteuse (un finish dewy n'est pas un baume riche). C'est exactement le genre de mutex viol qui a déjà été corrigé manuellement en T1 (cf `AUTO-TAGS.md` §T1 application — 31 produits avec `texture-legere` + `texture-riche` ensemble, cleanup post-WRITE).

Fix : appliquer la même `HEAVY_EXCLUSION_PATTERNS` que `detectTextureLegere`. Anticipe la régression similaire et évite un cleanup manuel ad hoc en run suivant.

### B.4 Recall manquant dans `SILICONE_LIGHT_PATTERNS`

`formula-detection.ts:707-714` (pour `detectNonGrasAbsorption`) liste : `dimethicone`, `cyclopentasiloxane`, `cyclomethicone`, `cyclohexasiloxane`, `isohexadecane`, `phenyl trimethicone`.

Algo-derm `silicone` heuristic (`heuristic_rules.json:86-91`) : `dimethicone`, `dimethiconol`, `amodimethicone`, `trimethicone`, `cyclomethicone`, `siloxane` (catch-all), `silanol`, `trimethylsiloxysilicate`, `silicone`.

Manquent côté Aurore : `dimethiconol`, `amodimethicone`, `trimethicone` (sec, pas seulement `phenyl trimethicone`), `siloxane` catch-all, `silanol`. Un sérum à `dimethiconol` top 5 + 0 huile végétale → ne firera pas `non-gras`/`absorption-rapide`. Recall raté.

Fix simple : aligner la liste sur `heuristic_rules.json:silicone.patterns` ou — meilleur — lire `assessment.heuristicFlags` et tester `flags.has('silicone')`.

### B.5 Recall manquant dans `IONIC_SURFACTANT_PATTERNS`

`formula-detection.ts:294-298` : `'lauryl sulfate'`, `'laureth sulfate'`, `'olefin sulfonate'`.

Algo-derm `sulfate_surfactant` (`heuristic_rules.json:48-55`) : groups `[lauryl, laureth, myreth, coco, cetearyl, coceth] × [sulfate]`. Aurore manque `myreth sulfate`, `coco sulfate`, `cetearyl sulfate`, `coceth sulfate`.

Conséquence : un cleanser à `Sodium Coco-Sulfate` top 3 + jojoba oil top 2 → est tagué `step-nettoyage-1` (oil cleanser) à tort. C'est un foaming gel, pas un balm cleanser. **Faux positif sémantique.**

Fix : aligner la liste sur la règle algo-derm ou utiliser `flags.has('sulfate_surfactant')`.

### B.6 Recall manquant dans `HA_PATTERNS` de `detectFiniGlowy`

`formula-detection.ts:668-674` : 5 patterns HA. `actif-class-detection.ts:122-130` (cluster HYALURONIC_ACID) : 7 patterns dont `hydroxypropyltrimonium hyaluronate`, `potassium hyaluronate`, `sodium hyaluronate crosspolymer`. **Diverge.**

Fix : extraire une constante `HA_INCI_PATTERNS` partagée.

### B.7 `detectVegan` à 80 % du corpus est probablement sur-permissif

`AUTO-TAGS.md` §T1 application : « `vegan` 2 929 (80 %) ». La méthode est *absence d'animal patterns* avec ≥ 5 ingrédients. Conceptuellement OK, mais la liste `ANIMAL_PATTERNS` (`formula-detection.ts:798-840`) ne couvre pas, par exemple :
- `gelatin` / gélatine (collagène hydrolysé d'origine animale possible)
- `keratin amino acids`
- `tallowate` (saponifié → soap)
- `stearic acid` (peut être animal ou plant — ambigu)
- `lactose` est listé mais `lactalbumin`, `lactoperoxidase`, `colostrum extract` ne le sont pas.

Le commentaire du code revendique « precision-first », mais le résultat à 80 % suggère que la liste de patterns animaux est trop courte pour être discriminante. Spot-check recommandé sur 30 produits aléatoires marqués vegan.

Recommandation : soit resserrer (ajouter les patterns ci-dessus), soit dégrader le tag à `secondary` pseudo-confidentiel et ne donner `vegan` ferme qu'à la ligne marque (ticket T4 backlog : champ `is_vegan` certifié). Préférer T4 → précision auto = 0 garantie.

### B.8 `regulatoryNotes` et `findRegulatoryAlerts` du `ProductAssessment` jamais lus

L'assessment retourné par `analyzeINCI` (cf `productAssessment.ts:175`) contient `regulatoryNotes: string[]` peuplé via `collectRegulatoryNotes(evidence)` + `findRegulatoryAlerts(ingredients)`. Ces notes incluent les hits CELEX (Reg UE 1223/2009) — précisément la raison pour laquelle le tarball `algo-derm.tgz` embarque le 1.2 MB `CELEX_*.regulatory.json` (cf memory `algo-derm tarball needs CELEX`).

**Aucun consommateur Aurore** ne lit ce champ. Le poids inclus dans le bundle est dead weight côté tagging actuel.

Quick win : exporter ces notes dans le rapport `audit-auto-tags` (mode dry-run uniquement, audit interne) pour avoir une visibilité sur les ingrédients restricted/prohibited dans le corpus.

### B.9 Conflits potentiels non testés entre slugs sensoriels mutuellement exclusifs

Pairs mutuellement exclusives par sémantique :
- `fini-mat` ⊥ `fini-glowy` (matte vs dewy)
- `texture-riche` ⊥ `texture-legere` (déjà cleanupé en T1, mais pas de test automatisé)
- `non-gras` ⊥ `texture-riche` (silicone-driven léger vs butter-driven lourd)

`AUTO-TAGS.md` mentionne le cleanup manuel post-T1 sur le couple `texture-legere/texture-riche` (« 31 produits viol → DELETE + re-WRITE »). Aucun test n'empêche la régression. Le couple `fini-mat/fini-glowy` n'a jamais été audité.

Fix proposé : test d'invariant dans `tests/formula-detection.test.ts` : pour chaque pair mutex, sur un fixture de 50 produits réels, asserter que les deux slugs ne sont jamais émis ensemble.

### B.10 Documentation `AUTO-TAGS.md` un peu désynchronisée

- §C6 dit « Skip — refusé en session précédente » mais `cross-signal-detection.ts:104-114` implémente `moment-crise` (et T1 l'a écrit en DB : « `moment-crise` 9 »). La ligne « Skip » est stale.
- §détecteurs Roadmap (T1) liste `non-irritant` comme bloqué taxonomie ; algo-derm a déjà le tag `non_irritant` prêt à être mappé une fois le slug Aurore créé. État correct, mais worth flagging que c'est immédiat dès slug créé.

Pas un bug de code, juste de la dette de doc. Une passe de mise à jour serait propre.

## C) Refacto / qualité

### C.1 Travail dupliqué : `analyzeINCI` peut être hoisté

Aujourd'hui chaque passe re-fait `splitINCI` + `normalize` indépendamment :
- `auto-tag-detection.ts:152-155` (passe 1, dont `analyzeINCI` complet)
- `actif-class-detection.ts:164` (passe 2, `splitINCI + normalize`)
- `cross-signal-detection.ts:90,107` (passe 5, `splitINCI + normalize`)
- `formula-detection.ts` (passe 4, **chaque** détecteur fait son `splitINCI + normalize`).

Pour 3 668 produits × ~7 détecteurs = ~25 000 appels `splitINCI`. Pas un blocker perf mais c'est gaspillé. Surtout, ça **empêche la réutilisation des `assessment.heuristicFlags`** déjà calculés par le pass 1 (cf §B.4, B.5 : on pourrait remplacer `IONIC_SURFACTANT_PATTERNS` et `SILICONE_LIGHT_PATTERNS` locaux par des lectures directes sur `flags.has(...)`).

Refacto progressif : signature commune `(inci: string, kind: ProductKind, assessment: ProductAssessment, ingredientsNormalized: string[]) => Slug[]`. Passe 1 calcule l'assessment en premier, les autres passes le consomment.

### C.2 Le mapping ChatGPT « pipeline duplicate » mérite précision

`scripts/auto-tag.ts` (742 lignes) :
- Logique custom : `INCI_TO_SKINCARE` (mapping main maison), `NAME_PATTERNS` (regex sur nom français), `KIND_*_PRIMARY` (mapping kind→tag par domaine).
- **Génère du code** (probablement écrit dans des fichiers `data/products/*.ts` du seed) — usage one-shot pour bootstrap historique du seed. ChatGPT le qualifie de « legacy heuristic », ce qui est juste, mais ne mentionne pas son rôle de **générateur de fichiers seed**, distinct du runtime DB write des autres runners.

Décision : soit le supprimer (ses outputs sont dans le seed depuis 2026-04, ne resservira pas), soit le tagger explicitement comme dead bootstrap script en l'isolant (ex : déplacer vers `scripts/_archive/`). Le maintenir « au cas où » sans warning est le pire des trois.

### C.3 `auto-tag-detection.ts` mélange filtrage et émission

Le code `auto-tag-detection.ts:166-196` mélange : (a) skip if !allow, (b) skip if coverage < floor, (c) skip if conf < minConf, (d) skip if rinse-off, (e) skip if declarationOnlyRisk. Les conditions sont toutes au même niveau, sans sortie de log par cause.

Pour le mode debug (`audit-auto-tags`), savoir « combien de candidats `acne-imperfections` ont été dropped à cause de coverage » nécessiterait actuellement de relire le code et tracer manuellement.

Fix léger (pas de refacto big-bang) : compter par cause de drop dans une `Map<string, number>` exportée lorsqu'un flag debug est passé. C'est un sous-ensemble de la « mode explain » de ChatGPT, mais focused sur la friction réelle d'audit.

### C.4 Sources de vérité ingrédient à dédupliquer

Listes dupliquées identifiées :
- Rétinoïdes : `actif-class-detection.ts` ↔ `formula-detection.ts:RETINOID_PATTERNS` (cf §B.2)
- HA : `actif-class-detection.ts` ↔ `formula-detection.ts:HA_PATTERNS` (cf §B.6)
- Beurres/cires : `formula-detection.ts:OCCLUSIVE_PATTERNS` ↔ `BUTTER_WAX_PATTERNS` ↔ `HEAVY_EXCLUSION_PATTERNS` ↔ `OIL_BALM_PATTERNS` (chevauchements partiels intentionnels mais à clarifier)
- Formaldehyde donors : `formula-detection.ts:FORMALDEHYDE_DONOR_PATTERNS` ↔ algo-derm `heuristic_rules.json:formaldehyde_donor` (à dériver de l'assessment)

Refacto : extraire un module `ingredient-patterns.ts` exportant ces listes, avec relations explicites (`ALL_RETINOIDS = [...PRESCRIPTION_RETINOIDS, ...COSMETIC_RETINOIDS]`). Permet d'évoluer une fois quand une nouvelle molécule sort.

### C.5 Tests : couverture par module mais pas de parité runners

Les tests `formula-detection.test.ts`, `auto-tag-detection.test.ts`, `actif-class-detection.test.ts`, `cross-signal-detection.test.ts` testent chaque fonction en isolation. **Aucun test** ne vérifie que `seed-core` et `backfill-auto-tags` produisent le même set de tags pour un produit donné — ce qui est précisément la divergence §B.1.

Fix : un test d'intégration `tests/seed-vs-backfill-parity.test.ts` qui :
1. Run `seed-core` sur un fixture (ou un mini DB de test).
2. Run `backfill-auto-tags --write` immédiatement après.
3. Asserter que `backfill` ajoute 0 paire (sinon → divergence).

C'est la garantie automatique que les deux runners sont alignés. Très peu coûteux à écrire vu l'infra `make test-db-up` existante.

## D) Plan d'action priorisé

### D.1 Priorité 🔴 — Bugs concrets safety / correctness

| Action | Fichier | Effort |
|---|---|---|
| Ajouter `sodium retinoyl hyaluronate` à `RETINOID_PATTERNS` (B.2) | `formula-detection.ts:397-413` | XS — 1 ligne |
| Ajouter `HEAVY_EXCLUSION_PATTERNS` dans `detectFiniGlowy` (B.3) | `formula-detection.ts:676-697` | XS |
| Aligner `SILICONE_LIGHT_PATTERNS` sur l'heuristique algo-derm (B.4) | `formula-detection.ts:707-714` | XS |
| Aligner `IONIC_SURFACTANT_PATTERNS` sur `sulfate_surfactant` group rule (B.5) | `formula-detection.ts:294-298` | XS |
| Aligner `HA_PATTERNS` (`detectFiniGlowy`) sur le cluster HYALURONIC_ACID (B.6) | `formula-detection.ts:668-674` | XS |
| Tests mutex `fini-mat/fini-glowy`, `texture-riche/texture-legere`, `non-gras/texture-riche` (B.9) | `tests/formula-detection.test.ts` | S |

Bundle ces 6 dans un seul commit `fix(seed/auto-tags): close recall and mutex gaps in formula detectors`. Re-run `make backfill-auto-tags WRITE=1` après.

### D.2 Priorité 🟠 — Cohérence runners

| Action | Effort | Statut |
|---|---|---|
| Faire appeler `detectGrossesseAvoid` + `detectCrossSignalAvoidTags` par `seed-core.ts` (B.1) | S | ✅ Done (commit `56b000bf`, helper `auto-tag-avoid.ts`) |
| Test parité seed-vs-backfill (C.5) | S | ✅ Done — orchestrator `auto-tag-orchestrator.ts` + 16 tests `auto-tag-orchestrator-parity.test.ts`. Couvre aussi §3.1 (kind/formula/cross-signal secondary désormais émis sur solaire/bodycare au fresh seed) et §6 A-C (orchestrateur + branchement deux runners + test intégration). |
| Décider sort de `scripts/auto-tag.ts` (suppression ou archivage explicite) (C.2) | XS | ✅ Done (commit `146b8fa6`, archivé `_archive/`) |

### D.3 Priorité 🟡 — Exploitation algo-derm

| Action | Effort | Statut |
|---|---|---|
| Mapper les 5 interactions inconditionnées (`alcohol+fragrance`, `alcohol+allergen`, `acid+alcohol`, `multiple-essential-oils`, `mitigation-niacinamide+glycerin`) vers tags Aurore ou warnings audit (A.2) | M | Partiel — `detectInteractionAvoidTags` (peau-sensible avoid) déjà câblé via `auto-tag-avoid.ts` ; mapping explicite par règle reste à faire si on veut des warnings finer-grained. |
| Surfacer `regulatoryNotes` et `findRegulatoryAlerts` dans `audit-auto-tags` (B.8) | S | ✅ Done (commit `883b8651` / `d2c0e27c` / `50fd08dd`) |
| Hoister `analyzeINCI` une fois par produit, faire transiter `assessment` aux autres détecteurs (C.1) | M | Partiel — orchestrator hoist `analyzeINCI` une fois par produit (`auto-tag-orchestrator.ts`). `assessment` propagé à `detectAutoTags` (passe 1) et `computeAvoidCandidates` (passe 6, interaction). Détecteurs formula/actif-class/cross-signal-secondary recalculent encore `splitINCI`/`normalize` localement — substitution patterns→`flags.has(...)` reste à faire. |
| Substituer `formaldehyde_donor` / `silicone` / `sulfate_surfactant` locaux par `flags.has(...)` (B.4-5, C.4) — dépend de C.1 | S après C.1 | Pending — débloqué par l'orchestrator (assessment disponible), reste à passer `assessment` en option à chaque détecteur formula. |

### D.4 Priorité 🔵 — Qualité diagnostic

| Action | Effort | Statut |
|---|---|---|
| Compteurs de cause de drop dans `detectAutoTags` debug mode (C.3) | S | ✅ Done — option `dropCounts?: Map<string, number>` sur `DetectAutoTagsOptions`, key `${reason}:${tagId}` (7 reasons : `not_present` / `unmapped` / `disallowed` / `coverage_floor` / `low_confidence` / `rinse_off_excluded` / `declaration_only_risk`). `audit-auto-tags.ts` agrège sur tout le corpus + nouveau bloc « 🪦 Candidats droppés » top 15 par raison. Hot path zéro overhead si `dropCounts` non passé. |
| Audit du `vegan` corpus à 80 % (B.7) — spot-check 30 produits, décider resserrement vs deferral T4 | M | ✅ Done — runner `audit-vegan-corpus.ts` (Tier A clearly-animal × Tier B ambig animal/plant). Sample 30 → 0 Tier A, sample 200/300 + grep corpus complet → **11 vrais FP** (`pearl powder` 8, `pearl extract` 1, `lactoperoxidase` 2). Patterns `pearl `/`lactoperoxidase` ajoutés à `ANIMAL_PATTERNS` + 4 tests. Prune ciblé `PRUNE=1` + snapshot regen → 11 paires `(productId, vegan)` supprimées de `data.sql`. Re-run audit post-prune : Tier A = 0/300. Tier B (stearic/palmitic/cetyl alcohol) → ambigu plant/animal sans INCI distinction → deferral T4 (`is_vegan` brand-level) confirmé. |
| Cleanup `AUTO-TAGS.md` §C6 stale + sync taxonomie roadmap T1/T2 (B.10) | XS | ✅ Done — §C6 « Skip — refusé » déjà cleaned (le row est ✅ Done depuis 2026-05-07). Sync : « Labels (5/10 manquent) » → (2/10), `hypoallergenique` / `pigments-verts` / `vegan` déplacés en couverts ✅ ; T2 row enrichie d'une note d'immédiateté (mapping `non_irritant` = 1 ligne dans `TAG_CONFIG` dès slug créé) ; row `vegan` Tier 1 sync avec `ANIMAL_PATTERNS` post-B.7 (pearl-/lactoperoxidase) ; row `moment-crise` sync avec le code réel (`BHA actif-class` ≠ « salicylic top 5 »). |

### D.4.1 Note sur D.3 #4 (substitution `flags.has(...)`)

Découvert pendant la session 2026-05-08 : `assessment.heuristicFlags` est **incomplet par design** (algo-derm `productAssessment.ts:98-104` filtre `if (!matchedSet.has(ingredient))`). Les ingrédients curated dans `ingredient_evidence.merged.json` (incl. `dimethicone`, `dimethiconol`, `sodium lauryl sulfate`, `diazolidinyl urea`, `dmdm hydantoin`, `quaternium-15`, `imidazolidinyl urea`, `sodium hydroxymethylglycinate`) flow vers `matchedEvidence`, **pas** `heuristicFlags`. `tagProduct` interne contourne via `rawIngredients.flatMap(detectHeuristicFlags)` mais **`detectHeuristicFlags` n'est pas exporté dans `algo-derm/src/index.ts`** (seulement re-exported par `productAssessment.ts`).

Conséquence : substitution naïve `flags.has('silicone')` raterait dimethicone curated → **recall pire qu'aujourd'hui**.

Pour exécuter D.3 #4 proprement, il faut :
1. PR upstream algo-derm : exporter `detectHeuristicFlags` depuis `index.ts` + bump version + `make vendor-algo-derm`.
2. Construire un `Map<HeuristicName, Set<rawIngredient>>` côté orchestrator par re-run sur tous ingrédients (mêmé approche que `tagProduct`).
3. Substituer **uniquement** où Aurore n'a pas de sémantique spécifique :
   - ✅ `formaldehyde_donor` (no Aurore-specific narrowing — mais Aurore a 2 patterns extras `benzylhemiformal`/`bronidox` à pousser upstream).
   - ❌ `silicone` (Aurore exclut `amodimethicone`/`siloxane`/`silanol` intentionnellement — texture-carrier subset, audit B.4 comment l.736-738).
   - ⚠ `sulfate_surfactant` (Aurore ajoute `olefin sulfonate` non-sulfate — augmenter, pas remplacer).

Pour l'instant, les patterns locaux post-D.1 (`SILICONE_LIGHT_PATTERNS`, `IONIC_SURFACTANT_PATTERNS`, `FORMALDEHYDE_DONOR_PATTERNS`) sont déjà alignés sur `heuristic_rules.json` (voir commit `79267410`). La dette résiduelle = "stay in sync going forward" (les listes algo-derm peuvent évoluer). À reprendre quand la prochaine évolution algo-derm justifiera le upstream PR.

### D.5 Hors scope (validations stratégiques de ChatGPT)

- ~~« Orchestrateur unique » (ChatGPT §5.1, §8.1)~~ ✅ Done dans D.2 (orchestrator livré après D.1, audit §6 A-C complet). Architecture désormais alignée sur la recommandation ChatGPT.
- « Ruleset version + reasonCode » (ChatGPT §8.7-8.8) : intéressant mais valeur surtout post-gold set (O2).
- « Convention nommage EN » : on gardera le mélange FR/EN actuel ; impact onboarding < impact d'un test parité manquant.

## E) Conclusion

L'audit ChatGPT est **globalement juste sur les diagnostics structurels** (seed/backfill divergence, script legacy, sous-utilisation algo-derm), mais :
- **Sous-estime** le périmètre exact de la divergence seed/backfill : ce n'est pas « partiel », c'est zéro avoid au seed (B.1).
- **N'identifie pas** plusieurs bugs de recall concrets dans les listes locales (B.2-B.6).
- **Sur-estime** ce que les interactions algo-derm peuvent apporter sans données pH ou profile (A.2).
- **Manque** la cohérence latente sur les slugs mutex et l'absence de tests de parité (B.9, C.5).

Le système n'est pas cassé — la calibration R3+T1 a fait gagner +53 % de paires propres et la précision est sérieusement gardée. Mais il y a quelques bugs de recall ciblés (D.1) à fixer avant l'orchestrateur grand format. Une fois D.1+D.2 livrés et validés via test de parité (C.5), le refacto orchestrateur de ChatGPT prend son sens et peut être attaqué sereinement.
