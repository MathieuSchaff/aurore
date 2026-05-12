# Handoff: algo-derm FR INCI parser — CLÔTURÉ 2026-05-11

État final : tout livré. Conservé comme log de référence (curation FR future).

## Résultat

Parser FR ajouté à algo-derm en 3 itérations + bugfix `RE_ACIDE`. Tests verts (185/185 algo-derm smoke, 41/41 actif-class-detection Aurore).

**Bench final sur corpus Aurore (2026-05-11, 4075 produits)** :

| Bucket      | Prods | Ings   | Legacy | New   | Δ        |
|-------------|-------|--------|--------|-------|----------|
| FR skincare | 971   | 35 861 | 29.4 % | 51.0 % | +21.6 pts |
| FR other    | 199   | 5 455  | 52.1 % | 63.2 % | +11.1 pts |
| non-FR      | 2 905 | 70 789 | 67.3 % | 70.1 % | +2.8 pts  |

## Livrables

- `algo-derm/src/parser.ts` (+220 LOC) — passes FR→Latin (multiword, chemistry inversions, head/part botanique, token map)
- `algo-derm/test/parser.test.mjs` — 35 cas couvrant chaque bucket
- `algo-derm/test/matching.test.mjs` — 2 assertions pinnées MAJ
- `aurore/vendor/algo-derm.tgz` — tarball regen avec parser FR
- `aurore/backend/src/db/seed/inci/benchmark-fr-parser.ts` — bench match-rate vs legacy
- `aurore/docs/algo/algo-derm-aurore-integration.md` §2.1 — note "Parser FR→Latin"

## Carte des passes du parser (référence curation)

1. `normalizeApostrophes` : `'`, `ʼ`, `ʹ`, `′` → `'`, puis `d'X → de X`
2. `FR_MULTIWORD_REPLACEMENTS` — water-synonyms, `arbre à thé → melaleuca alternifolia`, `aloe vera → aloe barbadensis`, `cire d'abeille → cera alba`, `eau de mer → maris aqua`, etc.
3. Chemistry : `-ique → -ic` (salicylique → salicylic), `acide X → X acid`, inversions `palmitate de Y → Y palmitate` (22 suffixes), inversions double-de (`phosphate de ascorbyl de sodium → sodium ascorbyl phosphate`)
4. `applyFrHeadPatterns` — `[head] de [partie] de X → X [part] head` (extrait/huile/beurre/cire/eau/jus/poudre/amidon/hydrolat × feuille/racine/fleur/fruit/graine/écorce/bois/noyau/baie/tige/zeste/bourgeon/rhizome/amande/pulpe/peau/bulbe/son)
5. `applyFrTokenMap` — glycérine, parfum, eau, miel + 14 plantes vernaculaires
6. Adj map : `(\w+yl)e\b → \1`, aluminium → aluminum
7. Dedup post-strip : `\b(\S+)(\s+\1)+\b → \1`

## Ce qui reste à faire (différé volontairement)

- ✅ Commits algo-derm + Aurore — faits 2026-05-11.
- ✅ Extraction maps FR vers `algo-derm/data/rules/fr_*_map.json` (PART_MAP, FR_HEAD_MAP, FR_TOKEN_MAP) — faite 2026-05-11 via `require<T>()` runtime, type shim `src/types/require.d.ts`. `FR_MULTIWORD_REPLACEMENTS` (regex) + `CHEM_SUFFIXES` (array couplé aux regex) restent inline.

## Notes d'archi

- Mapping FR vit dans algo-derm (`src/parser.ts`), Aurore consomme `normalize()` via l'API publique — pas de duplication FR côté Aurore
- Bench dépend de la DB Aurore → script vit côté Aurore (`backend/scripts/`), pas dans algo-derm
- Pattern `'ascorbique'` dans `actif-class-detection.ts` mentionné dans la version précédente du TODO : **absent du fichier actuel**, soit jamais ajouté soit déjà supprimé. Les tests French INCI (`acide ascorbique`, `acide 3-O-éthyl ascorbique`) passent via le parser FR qui normalise vers `ascorbic acid` / `3-o-ethyl ascorbic acid`
