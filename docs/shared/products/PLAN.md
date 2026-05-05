# Mission : refonte progressive de la taxonomie skincare Aurore

## Objectif

Refactorer la taxonomie des tags skincare sans supprimer brutalement la richesse existante.

Le but est de séparer :

1. les tags techniques existants, utilisés en base / scraping / scoring ;
2. les facettes UX visibles par l’utilisateur ;
3. les clusters de recherche qui regroupent plusieurs tags proches ;
4. les tags dépréciés, gardés temporairement pour compatibilité.

Important : ne pas casser l’existant.

---

# Philosophie produit

Aujourd’hui, la taxonomie est riche mais trop exposée à l’utilisateur.

Exemple :

- Anti-rougeurs
- Rosacée
- Couperose
- Flushs
- Peau réactive
- Peau sensible
- Barrière cutanée
- Apaisant
- Réparateur

Ces tags sont utiles, mais un utilisateur moyen veut surtout trouver :

> une crème pour rougeurs peau sensible

Donc :

- la DB doit rester riche ;
- l’UI doit être simple ;
- la recherche doit comprendre les intentions ;
- certains tags doivent être fusionnés côté UX, mais pas forcément supprimés de la DB.

---

# Décisions de conception (Q1-Q7 résolues)

Avant écriture du code, 7 questions de design tranchées :

## Q1 — Scope : pilote skincare assumé

Phase 1 implémente uniquement le domaine **skincare**. Les helpers et fichiers ont une signature **`(domain, …)`** dès le jour 1 pour préparer l'extension haircare / dental / complement sans refacto cassante.

## Q2 — `tier` (category) ⊥ `visibility` (slug)

Les deux concepts cohabitent : granularités distinctes, questions distinctes. Voir Étape 4 § « Coexistence avec `tier` ».

## Q3 — Cluster routing : expansion au clic, URL contient les slugs

Quand l'user clique un bouton cluster, le frontend **expand au clic** : l'URL state contient les slugs explicites (`concern=anti-rougeurs,rosacee,couperose,flushs`). Pas de paramètre `cluster=` dans l'URL. Backend reste agnostic — zéro modif de `listProductsQuery` en Phase 1.

Conséquences :
- Pas de helper `expandTagsWithClusters` côté serveur.
- Cluster button = composant UI qui toggle un set de slugs.
- Partage URL fonctionne sans serveur qui connaisse les clusters.
- Perte minime : on ne sait pas distinguer en analytics « user a cliqué cluster » vs « user a coché les 5 slugs un par un ». Acceptable Phase 1.

## Q4 — Aliases : type plat, import des `cluster.includes` (DRY)

Type des aliases : `Record<string, readonly TagSlug[]>`. Quand un alias pointe vers un cluster, **importer `CLUSTERS.<key>.includes`** au lieu de copier la liste de slugs. Mono-slug = littéral inline.

```ts
import { SKINCARE_TAG_CLUSTERS } from './tag-clusters';

const REDNESS   = SKINCARE_TAG_CLUSTERS.redness.includes;
const BLEMISHES = SKINCARE_TAG_CLUSTERS.blemishes.includes;

export const SKINCARE_SEARCH_ALIASES = {
  rougeurs:  REDNESS,
  rouge:     REDNESS,
  rosacée:   REDNESS,
  couperose: REDNESS,
  flushs:    REDNESS,
  boutons:   BLEMISHES,
  acné:      BLEMISHES,
  matifiant: ['matifiant'] as const,   // standalone, pas de cluster
} as const;
```

Bénéfices :
- Source unique pour la liste de slugs (le cluster).
- **Drift bouton-vs-search impossible** : même array ref consommée par UI button et par search bar.
- Consumer trivial : `ALIASES[query] ?? []` retourne directement les slugs à OR.
- Pas de fake clusters mono-tag.

## Q5 — Slugs cités existent ✅

Slugs référencés dans le PLAN (`PIGMENTS_VERTS`, `BARRIERE_CUTANEE_ALTEREE`, `PEAU_REACTIVE`, `KERATOLYTIQUE`, `PEAU_RUGUEUSE`, `SEBO_REGULATEUR`, `PROTECTION_CUTANEE`, `MATIFIANT`, etc.) confirmés présents dans `tag-slugs.ts`.

## Q6 — Facets : vues UX, pas autorité data

`tag-taxonomy.ts` reste **source de vérité catégorielle**. `tag-search-facets.ts` = curation UI hand-picked (top-N slugs par groupe pour la home / drawer principal). Les deux coexistent sans recouvrement : facets ne **remplacent** pas la taxonomy, elles en sont une vue.

## Q7 — Helpers minimaux (YAGNI)

Le fichier `tag-search-helpers.ts` n'est **pas créé** en Phase 1. Sont supprimés du PLAN :

- `getPrimaryTags()` / `getAdvancedTags()` / `getInternalTags()` / `getVisibleTags()` → inline `Object.entries(VISIBILITY).filter(([_, v]) => v === 'primary').map(([k]) => k)`. Pas de wrapper.
- `getClusterIncludedTags(k)` → accès direct `CLUSTERS[k].includes`.
- `resolveSearchAlias(q)` → `ALIASES[q] ?? []`. Lookup direct.
- `expandTagsWithClusters(...)` → inutile (Q3 fait l'expansion au clic, pas serveur).

Ajouter un helper **uniquement** quand un consumer concret existe et que la logique se duplique 3+ fois.

---

# Étape 1 — Garder la taxonomie actuelle comme couche technique

Conserver le fichier actuel :

- `tag-slugs.ts`
- `tag-taxonomy.ts`

Ne pas supprimer les slugs existants pour l’instant.

La taxonomie actuelle continue de répondre à :

> “Quels tags possède ce produit ?”

---

# Étape 2 — Ajouter une couche Facets UX

Créer un fichier :

```txt
src/.../skincare/tags/tag-search-facets.ts
```

````

But : définir les groupes de filtres visibles dans l’UI principale.

Exemple :

```ts
import { SKINCARE_PRODUCT_TAG_SLUGS } from "./tag-slugs";

export const SKINCARE_SEARCH_FACETS = {
  needs: {
    label: "Je veux traiter",
    description: "Les problèmes ou objectifs principaux.",
    tags: [
      SKINCARE_PRODUCT_TAG_SLUGS.ANTI_ACNE,
      SKINCARE_PRODUCT_TAG_SLUGS.ANTI_ROUGEURS,
      SKINCARE_PRODUCT_TAG_SLUGS.ANTI_TACHES,
      SKINCARE_PRODUCT_TAG_SLUGS.DESHYDRATATION,
      SKINCARE_PRODUCT_TAG_SLUGS.PORES_DILATES,
      SKINCARE_PRODUCT_TAG_SLUGS.ANTI_AGE,
      SKINCARE_PRODUCT_TAG_SLUGS.ECLAT,
      SKINCARE_PRODUCT_TAG_SLUGS.BARRIERE_CUTANEE,
    ],
  },

  product: {
    label: "Type de produit",
    description: "La forme ou catégorie du soin.",
    tags: [
      SKINCARE_PRODUCT_TAG_SLUGS.SERUM,
      SKINCARE_PRODUCT_TAG_SLUGS.CREME_HYDRATANTE,
      SKINCARE_PRODUCT_TAG_SLUGS.CREME_SOLAIRE,
      SKINCARE_PRODUCT_TAG_SLUGS.GEL_NETTOYANT,
      SKINCARE_PRODUCT_TAG_SLUGS.HUILE_DEMAQUILLANTE,
      SKINCARE_PRODUCT_TAG_SLUGS.EXFOLIANT_CHIMIQUE,
      SKINCARE_PRODUCT_TAG_SLUGS.CONTOUR_YEUX,
      SKINCARE_PRODUCT_TAG_SLUGS.SOIN_LEVRES,
    ],
  },

  skin: {
    label: "Ma peau",
    description: "Le type ou état général de peau.",
    tags: [
      SKINCARE_PRODUCT_TAG_SLUGS.PEAU_SECHE,
      SKINCARE_PRODUCT_TAG_SLUGS.PEAU_GRASSE,
      SKINCARE_PRODUCT_TAG_SLUGS.PEAU_MIXTE,
      SKINCARE_PRODUCT_TAG_SLUGS.PEAU_SENSIBLE,
      SKINCARE_PRODUCT_TAG_SLUGS.PEAU_NORMALE,
    ],
  },

  preferences: {
    label: "Préférences",
    description: "Contraintes ou préférences de formulation.",
    tags: [
      SKINCARE_PRODUCT_TAG_SLUGS.SANS_PARFUM,
      SKINCARE_PRODUCT_TAG_SLUGS.NON_COMEDOGENE,
      SKINCARE_PRODUCT_TAG_SLUGS.GROSSESSE_COMPATIBLE,
      SKINCARE_PRODUCT_TAG_SLUGS.VEGAN,
      SKINCARE_PRODUCT_TAG_SLUGS.FILTRES_MINERAUX,
      SKINCARE_PRODUCT_TAG_SLUGS.TEXTURE_LEGERE,
      SKINCARE_PRODUCT_TAG_SLUGS.TEXTURE_RICHE,
    ],
  },
} as const;
```

Ces facettes sont la couche affichée par défaut dans le front.

---

# Étape 3 — Ajouter des clusters de recherche

Créer un fichier :

```txt
src/.../skincare/tags/tag-search-clusters.ts
```

But : regrouper plusieurs tags internes derrière une intention utilisateur.

Exemple :

```ts
import { SKINCARE_PRODUCT_TAG_SLUGS } from "./tag-slugs";

export const SKINCARE_TAG_CLUSTERS = {
  redness: {
    label: "Rougeurs & rosacée",
    description: "Rougeurs, rosacée, couperose, flushs et camouflage vert.",
    primaryTag: SKINCARE_PRODUCT_TAG_SLUGS.ANTI_ROUGEURS,
    includes: [
      SKINCARE_PRODUCT_TAG_SLUGS.ANTI_ROUGEURS,
      SKINCARE_PRODUCT_TAG_SLUGS.ROSACEE,
      SKINCARE_PRODUCT_TAG_SLUGS.COUPEROSE,
      SKINCARE_PRODUCT_TAG_SLUGS.FLUSHS,
      SKINCARE_PRODUCT_TAG_SLUGS.PIGMENTS_VERTS,
    ],
  },

  sensitivity: {
    label: "Peau sensible / réactive",
    description: "Peaux sensibles, réactives ou barrière cutanée fragilisée.",
    primaryTag: SKINCARE_PRODUCT_TAG_SLUGS.PEAU_SENSIBLE,
    includes: [
      SKINCARE_PRODUCT_TAG_SLUGS.PEAU_SENSIBLE,
      SKINCARE_PRODUCT_TAG_SLUGS.PEAU_REACTIVE,
      SKINCARE_PRODUCT_TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
      SKINCARE_PRODUCT_TAG_SLUGS.APAISANT,
      SKINCARE_PRODUCT_TAG_SLUGS.SANS_PARFUM,
    ],
  },

  pigmentation: {
    label: "Taches & marques",
    description: "Taches brunes, hyperpigmentation et marques post-acné.",
    primaryTag: SKINCARE_PRODUCT_TAG_SLUGS.ANTI_TACHES,
    includes: [
      SKINCARE_PRODUCT_TAG_SLUGS.ANTI_TACHES,
      SKINCARE_PRODUCT_TAG_SLUGS.HYPERPIGMENTATION,
      SKINCARE_PRODUCT_TAG_SLUGS.POST_ACNE,
      SKINCARE_PRODUCT_TAG_SLUGS.TEINT_TERNE,
    ],
  },

  hydration: {
    label: "Hydratation / déshydratation",
    description: "Peau qui manque d’eau, tiraille ou paraît déshydratée.",
    primaryTag: SKINCARE_PRODUCT_TAG_SLUGS.DESHYDRATATION,
    includes: [
      SKINCARE_PRODUCT_TAG_SLUGS.DESHYDRATATION,
      SKINCARE_PRODUCT_TAG_SLUGS.HYDRATATION,
      SKINCARE_PRODUCT_TAG_SLUGS.REPULPANT,
      SKINCARE_PRODUCT_TAG_SLUGS.PEAU_SECHE,
    ],
  },

  blemishes: {
    label: "Boutons & imperfections",
    description: "Acné, boutons, pores visibles, excès de sébum et brillance.",
    primaryTag: SKINCARE_PRODUCT_TAG_SLUGS.ANTI_ACNE,
    includes: [
      SKINCARE_PRODUCT_TAG_SLUGS.ANTI_ACNE,
      SKINCARE_PRODUCT_TAG_SLUGS.PORES_DILATES,
      SKINCARE_PRODUCT_TAG_SLUGS.BRILLANCE,
      SKINCARE_PRODUCT_TAG_SLUGS.PURIFIANT,
      SKINCARE_PRODUCT_TAG_SLUGS.SEBO_REGULATEUR,
      SKINCARE_PRODUCT_TAG_SLUGS.PEAU_GRASSE,
    ],
  },

  texture: {
    label: "Texture irrégulière",
    description: "Grain de peau, rugosité, pores et exfoliation.",
    primaryTag: SKINCARE_PRODUCT_TAG_SLUGS.GRAIN_PEAU,
    includes: [
      SKINCARE_PRODUCT_TAG_SLUGS.GRAIN_PEAU,
      SKINCARE_PRODUCT_TAG_SLUGS.PORES_DILATES,
      SKINCARE_PRODUCT_TAG_SLUGS.KERATOLYTIQUE,
      SKINCARE_PRODUCT_TAG_SLUGS.EXFOLIANT_CHIMIQUE,
      SKINCARE_PRODUCT_TAG_SLUGS.PEAU_RUGUEUSE,
    ],
  },

  barrierRepair: {
    label: "Barrière abîmée",
    description:
      "Barrière cutanée fragilisée, irritation, besoin de réparation.",
    primaryTag: SKINCARE_PRODUCT_TAG_SLUGS.BARRIERE_CUTANEE,
    includes: [
      SKINCARE_PRODUCT_TAG_SLUGS.BARRIERE_CUTANEE,
      SKINCARE_PRODUCT_TAG_SLUGS.BARRIERE_CUTANEE_ALTEREE,
      SKINCARE_PRODUCT_TAG_SLUGS.REPARATEUR,
      SKINCARE_PRODUCT_TAG_SLUGS.APAISANT,
      SKINCARE_PRODUCT_TAG_SLUGS.PROTECTION_CUTANEE,
      SKINCARE_PRODUCT_TAG_SLUGS.SANS_PARFUM,
    ],
  },
} as const;
```

---

# Étape 4 — Ajouter un statut de visibilité / dépréciation

Créer un fichier :

```txt
src/.../skincare/tags/tag-visibility.ts
```

But : éviter de supprimer les tags mais contrôler où ils apparaissent.

Statuts proposés :

```ts
export type TagVisibilityStatus =
  | "primary"
  | "advanced"
  | "internal"
  | "deprecated"
  | "hidden";
```

Exemple :

```ts
import { SKINCARE_PRODUCT_TAG_SLUGS } from "./tag-slugs";

export const SKINCARE_TAG_VISIBILITY = {
  [SKINCARE_PRODUCT_TAG_SLUGS.ANTI_ACNE]: "primary",
  [SKINCARE_PRODUCT_TAG_SLUGS.ANTI_ROUGEURS]: "primary",
  [SKINCARE_PRODUCT_TAG_SLUGS.ANTI_TACHES]: "primary",
  [SKINCARE_PRODUCT_TAG_SLUGS.DESHYDRATATION]: "primary",
  [SKINCARE_PRODUCT_TAG_SLUGS.PORES_DILATES]: "primary",
  [SKINCARE_PRODUCT_TAG_SLUGS.ANTI_AGE]: "primary",
  [SKINCARE_PRODUCT_TAG_SLUGS.ECLAT]: "primary",
  [SKINCARE_PRODUCT_TAG_SLUGS.BARRIERE_CUTANEE]: "primary",

  [SKINCARE_PRODUCT_TAG_SLUGS.ROSACEE]: "advanced",
  [SKINCARE_PRODUCT_TAG_SLUGS.COUPEROSE]: "advanced",
  [SKINCARE_PRODUCT_TAG_SLUGS.FLUSHS]: "advanced",
  [SKINCARE_PRODUCT_TAG_SLUGS.HYPERPIGMENTATION]: "advanced",
  [SKINCARE_PRODUCT_TAG_SLUGS.POST_ACNE]: "advanced",
  [SKINCARE_PRODUCT_TAG_SLUGS.CERNES_POCHES]: "advanced",
  [SKINCARE_PRODUCT_TAG_SLUGS.ECZEMA]: "advanced",
  [SKINCARE_PRODUCT_TAG_SLUGS.KERATOSE_PILAIRE]: "advanced",
  [SKINCARE_PRODUCT_TAG_SLUGS.GRAIN_PEAU]: "advanced",

  [SKINCARE_PRODUCT_TAG_SLUGS.MICROBIOME]: "internal",
  [SKINCARE_PRODUCT_TAG_SLUGS.PREBIOTIQUE]: "internal",
  [SKINCARE_PRODUCT_TAG_SLUGS.LUMIERE_BLEUE]: "internal",
  [SKINCARE_PRODUCT_TAG_SLUGS.POLLUTION]: "internal",
  [SKINCARE_PRODUCT_TAG_SLUGS.PHOTO_VIEILLISSEMENT]: "internal",
  [SKINCARE_PRODUCT_TAG_SLUGS.PHOTO_PROTECTION]: "internal",

  [SKINCARE_PRODUCT_TAG_SLUGS.OUTIL_MASSAGE]: "hidden",
} as const;
```

Règle :

- `primary` : visible dans filtres principaux
- `advanced` : visible dans “Filtres avancés”
- `internal` : jamais visible comme filtre principal, mais utilisable pour scoring/recherche/SEO
- `deprecated` : ne plus utiliser pour nouveaux produits, mais conserver pour compatibilité
- `hidden` : invisible partout sauf admin/debug

## Coexistence avec `tier` (category-level)

`tag-filters.ts` expose déjà `tier` dans `{DOMAIN}_PRODUCT_TAG_CATEGORY_META` (cf `shared/src/products/STATE.md` §8). Les deux concepts cohabitent **sans recouvrement** : granularités et questions différentes.

| Champ        | Niveau      | Question répondue                                                              |
|--------------|-------------|-------------------------------------------------------------------------------|
| `tier`       | catégorie   | La catégorie ouvre-t-elle le drawer par défaut ou est-elle cachée derrière « Filtres avancés » ? |
| `visibility` | slug        | Ce slug est-il visible / advanced / internal / hidden **au sein de sa catégorie** ? |

Exemple concret :

- Catégorie `concern` → `tier: 'primary'` (drawer ouvert par défaut).
- Slug `anti-acne` ∈ `concern` → `visibility: 'primary'` (checkbox affichée directement).
- Slug `microbiome` ∈ `concern` → `visibility: 'internal'` (jamais filtre UI, conservé pour scoring/SEO/admin).

Règle :

- Ne **pas** dériver l'un depuis l'autre. Ce sont deux décisions produit indépendantes.
- Documenter cette séparation en JSDoc sur les types (`TagVisibilityStatus`, `CategoryTier`) pour éviter dérive future.
- Frontend filtre en deux passes : (1) catégories où `tier === 'primary'`, (2) à l'intérieur, slugs où `visibility ∈ {primary, advanced selon disclosure}`.

---

# Étape 5 — Ajouter des alias de recherche

Créer :

```txt
src/.../skincare/tags/tag-search-aliases.ts
```

But : mapper les mots tapés par l’utilisateur vers des tags ou clusters.

Exemple :

```ts
export const SKINCARE_SEARCH_ALIASES = {
  boutons: ["blemishes"],
  acne: ["blemishes"],
  acné: ["blemishes"],
  imperfections: ["blemishes"],

  rougeurs: ["redness"],
  rouge: ["redness"],
  rosacee: ["redness"],
  rosacée: ["redness"],
  couperose: ["redness"],

  taches: ["pigmentation"],
  marques: ["pigmentation"],
  hyperpigmentation: ["pigmentation"],
  cicatrices: ["pigmentation"],

  tiraillements: ["hydration", "barrierRepair"],
  déshydratée: ["hydration"],
  seche: ["hydration"],
  sèche: ["hydration"],

  sensible: ["sensitivity"],
  reactive: ["sensitivity"],
  réactive: ["sensitivity"],
  irritation: ["sensitivity", "barrierRepair"],

  pores: ["blemishes", "texture"],
  brillance: ["blemishes"],
  gras: ["blemishes"],
  matifiant: [SKINCARE_PRODUCT_TAG_SLUGS.MATIFIANT],
} as const;
```

Attention : certains alias pointent vers un cluster, d’autres vers un slug direct.

---

# Étape 6 — Créer des helpers

Créer :

```txt
src/.../skincare/tags/tag-search-helpers.ts
```

Fonctions attendues :

```ts
getPrimaryTags();
getAdvancedTags();
getInternalTags();
getVisibleTags();
getClusterIncludedTags(clusterKey);
resolveSearchAlias(query);
expandTagsWithClusters(tagsOrClusterKeys);
```

Exemple de comportement :

```ts
expandTagsWithClusters(["redness"]);
```

retourne :

```ts
["anti-rougeurs", "rosacee", "couperose", "flushs", "pigments-verts"];
```

---

# Étape 7 — Stratégie de migration / dépréciation

Ne pas supprimer immédiatement les anciens tags.

## Phase 1 — Compatibilité

- Garder tous les slugs existants.
- Ajouter `visibility`.
- Ajouter `clusters`.
- L’UI utilise les facets/clusters.
- La DB continue de fonctionner comme avant.

## Phase 2 — Normalisation progressive

Quand un produit reçoit :

- `rosacee`
- `couperose`
- `flushs`

on peut automatiquement ajouter aussi le cluster logique `redness` côté recherche, sans forcément l’écrire en DB.

## Phase 3 — Dépréciation

Marquer comme `deprecated` uniquement les tags vraiment redondants ou trop ambigus.

Exemples possibles :

- `PHOTO_PROTECTION` si déjà couvert par `CREME_SOLAIRE` + `PROTECTION_SOLAIRE`
- `PEAU_TOUS_TYPES` si utilisé comme fourre-tout peu informatif
- `OUTIL_MASSAGE` si ce n’est pas un produit skincare cosmétique

Mais ne pas les supprimer tant qu’ils existent dans des produits.

## Phase 4 — Nettoyage éventuel

Plus tard seulement :

- migration SQL ;
- remplacement des tags dépréciés ;
- suppression des tags inutilisés ;
- vérification qu’aucun produit ne référence encore ces slugs.

---

# Étape 8 — Règles UX recommandées

Dans le front :

## Par défaut

Afficher uniquement :

- Besoin
- Type de produit
- Type de peau
- Préférences

## Dans “Filtres avancés”

Afficher :

- effets précis
- routine step
- zones
- labels secondaires
- problèmes dermatologiques spécifiques

## Ne jamais afficher par défaut

- microbiome
- prébiotique
- lumière bleue
- pollution
- photo-vieillissement
- occlusif
- émollience
- occlusion finale

---

# Étape 9 — Logique de recherche recommandée

Quand l’utilisateur recherche :

> crème rougeurs sans parfum peau sensible

Le moteur doit détecter :

```ts
product_type: creme_hydratante;
cluster: redness;
label: sans_parfum;
cluster: sensitivity;
```

Puis étendre :

```ts
redness -> anti-rougeurs, rosacee, couperose, flushs, pigments verts
sensitivity -> peau sensible, peau reactive, barriere alteree, apaisant, sans parfum
```

Ensuite scorer les produits :

- match exact type produit : +5
- match besoin principal : +5
- match préférence : +4
- match cluster secondaire : +2
- match tag interne : +1

---

# Étape 10 — Tests à ajouter

Ajouter des tests unitaires pour vérifier :

- tous les slugs des facets existent ;
- tous les slugs des clusters existent ;
- tous les slugs de visibility existent ;
- aucun slug actif n’est oublié sans statut ;
- `expandTagsWithClusters(['redness'])` retourne les bons tags ;
- `resolveSearchAlias('rougeurs')` retourne `redness` ;
- aucun tag `hidden` n’apparaît dans les facets UX.

---

# Résultat attendu

À la fin, on doit avoir :

```txt
tag-slugs.ts                # existant, inchangé
tag-taxonomy.ts             # existant, inchangé (autorité catégorielle)
tag-visibility.ts           # NEW — statut par slug (primary/advanced/internal/deprecated/hidden)
tag-clusters.ts             # NEW — clusters d'intention (multi-slug)
tag-search-facets.ts        # NEW — vues UX hand-picked (top-N par groupe)
tag-search-aliases.ts       # NEW — Record<string, readonly TagSlug[]> (cf Q4)
```

Pas de `tag-search-helpers.ts` en Phase 1 (cf Q7 — YAGNI).

Et une architecture où :

- la data reste riche ;
- l’UI devient simple ;
- la recherche devient intelligente ;
- les anciens tags ne cassent rien ;
- les futurs produits peuvent être mieux tagués ;
- les tags redondants peuvent être dépréciés progressivement.

---

# Important

Ne pas tout migrer en une seule PR.

Faire une première PR limitée à :

1. ajouter les nouveaux fichiers ;
2. ajouter les helpers ;
3. ajouter les tests ;
4. ne pas modifier la DB ;
5. ne pas supprimer de slug existant.

La refonte UI peut venir ensuite.

---

# Annexe — Candidats clusters par domaine

## Critère de cluster

Cluster utile **si** plusieurs tags techniques répondent à une intention floue côté user. User moyen ignore la nuance, tape un mot, veut tout.

| Cas | Cluster ? |
|-----|-----------|
| Tag self-contained suffit (`peau_grasse`) | NON |
| Distinction importante pour user (huile démaquillante ≠ gel nettoyant) | NON — regrouper trompe |
| Préférence binaire (`sans_parfum`, `vegan`) | NON |
| Symptôme / intention floue → N tags techniques | OUI |

Règle : cluster les **symptômes / intentions**, pas les **catégories / préférences**.

## Skincare

1. **Rougeurs** — anti-rougeurs, rosacée, couperose, flushs, pigments-verts, peau-réactive
2. **Imperfections** — anti-acné, points-noirs, pores-dilatés, brillance, sébo-régulateur, peau-grasse
3. **Taches** — anti-taches, hyperpigmentation, post-acné, mélasma, teint-terne
4. **Sensibilité** — peau-sensible, peau-réactive, barrière-altérée, apaisant
5. **Hydratation** — peau-sèche, déshydratation, tiraillements, repulpant
   *(cluster justifié : user confond type `peau_sèche` vs état `déshydratation`)*
6. **Anti-âge** — rides, fermeté, élasticité, photo-vieillissement, éclat
7. **Texture irrégulière** — grain-peau, pores, kératose-pilaire, peau-rugueuse, kératolytique

## Haircare

1. **Cheveux abîmés** — secs, cassants, pointes-fourchues, après-coloration, sur-traités
2. **Pellicules** — pellicules, cuir-chevelu-sec, démangeaisons
3. **Volume / fins** — cheveux-fins, manque-volume, racines-grasses
4. **Boucles** — bouclés, frisottis, définition

## Dental

1. **Sensibilité** — dents-sensibles, gencives-sensibles, émail-fragilisé
2. **Blanchiment** — taches, jaunissement, blanchiment
3. **Gencives** — gingivite, saignements, recul-gencives

## Complement (domaine à plus haute valeur cluster)

Tags = molécules. Intentions user = objectifs. Mismatch DB/user total → cluster indispensable.

1. **Sommeil** — mélatonine, magnésium-bisglycinate, valériane, L-théanine
2. **Stress** — ashwagandha, rhodiola, magnésium, B6
3. **Énergie** — vit-D, fer, B12, ginseng, Q10
4. **Digestion** — probiotiques, prébiotiques, fibres, transit
5. **Immunité** — vit-C, zinc, vit-D, sureau, échinacée
6. **Peau / ongles / cheveux** — biotine, kératine, zinc, silice, collagène

## Anti-clusters (à ne pas faire)

- Type de peau (grasse / sèche / mixte) — distinctions utiles, pas de fusion
- Routine step — ordre, pas symptôme
- Format / texture (riche, légère, gel, crème) — préférence consciente
- Labels formulation (vegan, bio, cruelty-free) — binaires

## Placement UI proposé

1. **Top du drawer** — 6-8 cartes « Pourquoi cherchez-vous ? ». Click = pré-sélection slugs derrière. Style Yuka.
2. **Search bar autocomplete** — tape `rougeurs` → suggestion cluster.
3. **Section « Filtres rapides »** au-dessus des tags techniques. Tags techniques restent pour power user.

Reco Phase 1 : option 1 seule. Les autres après.

## Test rapide pour valider un candidat

Pour chaque cluster proposé, demander : *« le user moyen tape quoi dans la barre de recherche ? »*

- Réponse ≈ nom du cluster → bon candidat
- Réponse = tag technique précis → cluster inutile

Exemples :

- `rétinol` → ingredient lookup, pas cluster
- `rides` → cluster Anti-âge ✅
- `vegan` → label binaire, pas cluster
````

---

# Revue critique — 2026-04-28

## Synthèse

La direction produit est saine : garder une taxonomie technique riche, exposer une vue UX plus simple, ajouter des clusters d'intention et contrôler la visibilité des slugs sans casser la DB ni le scoring existant.

`STATE.md` décrit une base cross-layer déjà plutôt propre :

- `tag-taxonomy.ts` reste la source de vérité catégorielle.
- `listProductsQuery` est une discriminated union par `category`.
- `DOMAIN_PRODUCT_FILTER_CATEGORIES` centralise les clés de filtres par domaine.
- Le frontend isole déjà les filtres par domaine via `buildProductsApiFilters`.
- Le backend dispatch les filtres tag par domaine depuis les catégories de taxonomie partagées.

Le point principal : le plan cible est bon, mais `PLAN.md` contient encore des restes d'une version précédente. Avant implémentation, il faut aligner toutes les étapes sur les décisions Q1-Q7.

## Incohérences internes à corriger

### 1. Helpers : Q7 contredit Étape 6 et Important

Q7 dit explicitement :

- ne pas créer `tag-search-helpers.ts` en Phase 1 ;
- pas de `getPrimaryTags`;
- pas de `resolveSearchAlias`;
- pas de `expandTagsWithClusters`;
- lookup direct `ALIASES[q] ?? []`;
- expansion au clic côté frontend, pas serveur.

Mais plus bas :

- Étape 6 demande encore de créer `tag-search-helpers.ts`.
- Étape 10 demande encore de tester `expandTagsWithClusters` et `resolveSearchAlias`.
- Section `Important` liste encore "ajouter les helpers" dans la première PR.

Décision recommandée : supprimer Étape 6 du scope Phase 1, supprimer les tests helpers correspondants, et remplacer "ajouter les helpers" par "ajouter les fichiers de données + tests d'intégrité".

### 2. Aliases : Q4 contredit l'exemple d'Étape 5

Q4 tranche :

```ts
export const SKINCARE_SEARCH_ALIASES: Record<string, readonly TagSlug[]>
```

Un alias doit retourner directement des slugs, avec réutilisation des arrays `cluster.includes` quand il pointe vers un cluster.

Mais l'Étape 5 montre encore :

```ts
boutons: ["blemishes"],
rougeurs: ["redness"],
tiraillements: ["hydration", "barrierRepair"],
```

Ces valeurs sont des clés de clusters, pas des slugs. Cela réintroduit le besoin d'un resolver/helper et contredit Q4/Q7.

Décision recommandée : réécrire l'exemple d'Étape 5 pour importer les `includes` des clusters :

```ts
const REDNESS = SKINCARE_TAG_CLUSTERS.redness.includes;

export const SKINCARE_SEARCH_ALIASES = {
  rougeurs: REDNESS,
  rosacee: REDNESS,
  matifiant: [SKINCARE_PRODUCT_TAG_SLUGS.MATIFIANT],
} as const;
```

### 3. Chemins de fichiers

Le plan utilise plusieurs fois :

```txt
src/.../skincare/tags/...
```

Mais l'état réel du code est un dossier plat :

```txt
shared/src/products/skincare/
  index.ts
  schemas.ts
  tag-filters.ts
  tag-slugs.ts
  tag-taxonomy.ts
```

Décision recommandée : créer les nouveaux fichiers directement dans `shared/src/products/skincare/` :

```txt
tag-clusters.ts
tag-search-facets.ts
tag-search-aliases.ts
tag-visibility.ts
```

Puis les exporter depuis `shared/src/products/skincare/index.ts`.

### 4. Nom de fichier cluster

Le plan mentionne parfois :

- `tag-search-clusters.ts`
- `tag-clusters.ts`

Le résultat attendu retient `tag-clusters.ts`, et Q4 importe depuis `./tag-clusters`.

Décision recommandée : standardiser sur `tag-clusters.ts`.

## Risque majeur : clusters cross-category vs backend actuel

Le backend actuel filtre les tags par `tagType`.

La logique est :

```ts
exists tag where slug IN (...) AND tagType = currentCategory
```

Puis chaque catégorie active est ajoutée dans `conditions`, combinées ensuite en `AND`.

Conséquence :

- plusieurs slugs dans un même paramètre, par exemple `concern=anti-rougeurs,rosacee`, font un OR dans `concern`;
- plusieurs catégories, par exemple `concern=anti-rougeurs&product_label=sans-parfum`, font un AND entre catégories.

Donc une expansion frontend en "liste plate de slugs" n'a pas de sémantique suffisante si le cluster mélange plusieurs catégories de tags.

Exemples problématiques dans les clusters proposés :

- `redness` contient `ANTI_ROUGEURS`, `ROSACEE`, `COUPEROSE`, `FLUSHS` en `concern`, mais aussi `PIGMENTS_VERTS` en `product_label`.
- `sensitivity` contient `PEAU_SENSIBLE` / `PEAU_REACTIVE` en `skin_type`, `BARRIERE_CUTANEE_ALTEREE` en `concern`, `APAISANT` en `skin_effect`, `SANS_PARFUM` en `product_label`.
- `hydration` mélange `DESHYDRATATION` en `concern`, `HYDRATATION` en `routine_step`, `REPULPANT` en `skin_effect`, `PEAU_SECHE` en `skin_type`.
- `blemishes` mélange `ANTI_ACNE`, `PORES_DILATES`, `BRILLANCE` en `concern`, `PURIFIANT` / `SEBO_REGULATEUR` en `skin_effect`, `PEAU_GRASSE` en `skin_type`.
- `barrierRepair` mélange `BARRIERE_CUTANEE` / `BARRIERE_CUTANEE_ALTEREE` en `concern`, `REPARATEUR` / `APAISANT` / `PROTECTION_CUTANEE` en `skin_effect`, `SANS_PARFUM` en `product_label`.

Si le frontend clique un cluster et envoie tous ces slugs dans un seul paramètre `concern`, les slugs hors `concern` seront ignorés par le `tagType = concern`.

S'il répartit les slugs dans leurs catégories respectives, la requête devient beaucoup plus stricte à cause du `AND` inter-catégories. Exemple :

```txt
concern=barriere-cutanee,barriere-cutanee-alteree
skin_effect=reparateur,apaisant,protection-cutanee
product_label=sans-parfum
```

Cela signifie "produits qui matchent au moins un concern ET au moins un skin_effect ET sans parfum", pas "produits qui matchent n'importe quel slug du cluster".

Décision recommandée pour Phase 1 : limiter les clusters cliquables backend-agnostic à un seul `tagType`, idéalement `concern`, ou bien accepter explicitement une sémantique AND par groupe et la nommer autrement.

Si le besoin produit est un vrai OR cross-category, il faut une évolution API dédiée, par exemple :

- un paramètre `intent=redness` côté API ;
- ou un paramètre `any_tag=slug1,slug2,...` qui ignore `tagType`;
- ou un moteur de recherche/scoring séparé de `listProductsQuery`.

Ce n'est pas compatible avec la contrainte Q3 "backend agnostic" si on veut préserver la sémantique "match n'importe quel slug du cluster".

## Recommandation de découpage PR

### PR 1 — Données shared uniquement

Créer :

```txt
shared/src/products/skincare/tag-visibility.ts
shared/src/products/skincare/tag-clusters.ts
shared/src/products/skincare/tag-search-facets.ts
shared/src/products/skincare/tag-search-aliases.ts
```

Exporter depuis :

```txt
shared/src/products/skincare/index.ts
```

Ne pas modifier :

- DB ;
- backend ;
- scoring ;
- `listProductsQuery` ;
- UI de production.

Tests à ajouter :

- tous les slugs des facets existent dans `SKINCARE_PRODUCT_TAG_SLUGS`;
- tous les slugs des clusters existent ;
- tous les slugs de visibility existent ;
- aucun slug actif n'est oublié sans statut, sauf décision documentée ;
- aucun tag `hidden` n'apparaît dans les facets UX ;
- les aliases retournent uniquement des vrais slugs, pas des clés de clusters ;
- les aliases qui réutilisent un cluster restent synchronisés avec `cluster.includes`.

Ne pas tester :

- `expandTagsWithClusters`, sauf si un helper est finalement réintroduit ;
- `resolveSearchAlias`, sauf si un helper est finalement réintroduit.

### PR 2 — UI filtres simples

Brancher `tag-search-facets.ts` dans le drawer/home pour réduire l'exposition des tags techniques.

Règle :

- `tag-taxonomy.ts` reste autorité data ;
- `tag-search-facets.ts` reste une vue UX hand-picked ;
- `tag-visibility.ts` filtre les slugs affichables.

### PR 3 — Clusters cliquables

Deux options possibles :

1. Version backend-agnostic stricte : clusters mono-`tagType`, expansion au clic vers le bon paramètre URL.
2. Version intention réelle : évolution API/recherche pour supporter OR cross-category.

Ne pas mélanger ces deux options dans une même PR.

### PR 4 — Search intelligente / scoring

Traiter la recherche type :

```txt
crème rougeurs sans parfum peau sensible
```

comme un pipeline séparé :

- parsing produit / type / labels / intentions ;
- expansion d'intentions ;
- scoring pondéré ;
- éventuellement retour de raisons de match.

Ce n'est pas le même problème que les filtres de liste actuels.

## Décisions produit à clarifier avant code

1. Un cluster doit-il signifier "match n'importe quel slug inclus" ou "appliquer plusieurs filtres par catégorie" ?
2. Les clusters Phase 1 doivent-ils être limités à skincare `concern` ?
3. Les tags de préférence comme `SANS_PARFUM` doivent-ils appartenir à un cluster, ou rester des filtres binaires séparés ?
4. `visibility` doit-il couvrir tous les slugs skincare dès la PR 1, ou autoriser temporairement une liste d'exceptions ?
5. Les clusters sont-ils seulement UI, ou aussi search/scoring/SEO ?

## Ajustement concret conseillé du plan

Pour rendre `PLAN.md` actionnable :

- supprimer ou marquer hors scope Phase 1 l'Étape 6 ;
- corriger l'Étape 5 pour que les aliases retournent des slugs ;
- corriger l'Étape 10 pour retirer les tests de helpers ;
- corriger `Important` : remplacer "ajouter les helpers" par "ajouter les exports + tests d'intégrité" ;
- standardiser le chemin sur `shared/src/products/skincare/`;
- standardiser le fichier cluster sur `tag-clusters.ts`;
- ajouter une contrainte explicite : "Phase 1 clusters cliquables = mono-`tagType` sauf évolution API".

## Conclusion

Architecture cible validée, mais le document doit être nettoyé avant exécution. Le risque le plus coûteux serait d'implémenter des clusters cross-category en pensant que l'expansion frontend suffit, alors que la sémantique backend actuelle transforme soit une partie des slugs en no-op, soit le cluster en filtre beaucoup plus restrictif.

---

# Remise à plat idéale — tags, filtres, intentions, AND/OR

## Position tranchée

Le problème principal n'est pas "comment implémenter les clusters". Le vrai sujet est la sémantique de recherche :

- qu'est-ce qu'un tag affirme sur un produit ?
- qu'est-ce qu'un filtre utilisateur exige strictement ?
- qu'est-ce qu'une intention utilisateur suggère sans forcément exiger ?
- comment combiner `AND`, `OR`, `NOT` et scoring ?

Si on ne sépare pas ces concepts, les clusters deviennent un pansement dangereux. Ils ont l'air de simplifier l'UX, mais ils cachent une logique floue qui finit soit en résultats trop larges, soit en résultats trop stricts, soit en comportement impossible à expliquer.

Architecture cible recommandée :

- garder les tags atomiques, car ils modélisent la réalité produit ;
- ne pas stocker les clusters comme tags DB ;
- ne pas remplacer la taxonomie par des clusters ;
- transformer les "clusters" en **intentions de recherche typées** ;
- garder les filtres stricts séparés des intentions ;
- faire porter au backend la responsabilité de la sémantique AND/OR/scoring ;
- laisser le frontend afficher, composer et expliquer l'état de recherche.

En bref : les tags disent "ce produit est X", les filtres disent "je veux obligatoirement X", les intentions disent "je cherche probablement quelque chose autour de X".

## Les trois couches à ne pas confondre

### 1. Tags atomiques DB

Un tag DB doit rester une information atomique sur le produit.

Exemples :

```txt
anti-rougeurs
rosacee
couperose
peau-sensible
sans-parfum
apaisant
pigments-verts
creme-hydratante
```

Un tag ne doit pas vouloir dire "intention utilisateur complète". Il doit être une propriété, un claim, un usage, un type de peau, un type de produit ou une contrainte formulation.

Règle : ne pas créer de tags composites du type :

```txt
rougeurs-peau-sensible
routine-anti-acne-complete
hydratation-peau-seche-barriere
```

Ces concepts sont des intentions ou des plans de recherche, pas des faits produit atomiques.

### 2. Filtres stricts

Un filtre strict est une contrainte volontaire de l'utilisateur.

Sémantique recommandée :

- `AND` entre catégories différentes ;
- `OR` à l'intérieur d'une même catégorie ;
- `NOT` pour les exclusions explicites ;
- pas de scoring implicite.

Exemple :

```txt
product_type=creme-hydratante,gel-creme
product_label=sans-parfum
skin_type=peau-sensible
```

Signifie :

```txt
(creme-hydratante OR gel-creme)
AND sans-parfum
AND peau-sensible
```

C'est strict, prévisible, explicable et stable.

### 3. Intentions de recherche

Une intention représente ce que l'utilisateur veut résoudre, même s'il ne connaît pas les tags techniques.

Exemples :

```txt
redness
sensitivity
blemishes
barrier-repair
hydration
texture
anti-aging
```

Une intention n'est pas une catégorie de tags. Une intention peut traverser plusieurs catégories, mais avec une sémantique explicite :

- tags coeur obligatoires ou fortement prioritaires ;
- tags secondaires en boost ;
- préférences suggérées mais non obligatoires ;
- exclusions éventuelles ;
- raisons de match affichables.

Donc le mot "cluster" est utile conceptuellement, mais trop pauvre techniquement. Le nom plus juste est `search-intent`.

## Ce que doit devenir un cluster

Un cluster ne devrait pas être :

```ts
redness: [
  'anti-rougeurs',
  'rosacee',
  'couperose',
  'flushs',
  'pigments-verts',
  'peau-reactive',
]
```

Cette liste plate perd l'information essentielle : les slugs ne jouent pas tous le même rôle.

Un cluster propre devrait ressembler à une intention typée :

```ts
export const SKINCARE_SEARCH_INTENTS = {
  redness: {
    label: 'Rougeurs & rosacée',
    description: 'Rougeurs, rosacée, couperose, flushs et peau réactive.',

    requireAny: [
      {
        tagType: 'concern',
        slugs: ['anti-rougeurs', 'rosacee', 'couperose', 'flushs'],
      },
    ],

    boost: [
      {
        tagType: 'skin_type',
        slugs: ['peau-reactive', 'peau-sensible'],
        weight: 2,
      },
      {
        tagType: 'product_label',
        slugs: ['pigments-verts'],
        weight: 1,
      },
      {
        tagType: 'skin_effect',
        slugs: ['apaisant'],
        weight: 1,
      },
    ],

    suggestedFilters: [
      {
        tagType: 'product_label',
        slug: 'sans-parfum',
        reason: 'Souvent recherché avec les peaux réactives.',
      },
    ],
  },
} as const;
```

Ici, `anti-rougeurs` et `pigments-verts` ne sont plus faussement équivalents.

- `anti-rougeurs`, `rosacee`, `couperose`, `flushs` sont le coeur de l'intention.
- `peau-reactive` aide à classer les résultats.
- `pigments-verts` est pertinent, mais plutôt comme boost ou explication.
- `sans-parfum` est une suggestion ou un filtre explicite, pas une obligation implicite.

## Modèle de données recommandé pour les intentions

Type cible conceptuel :

```ts
type TagPredicate = {
  tagType: SkincareProductTagCategory;
  slugs: readonly SkincareProductTagSlug[];
};

type WeightedTagPredicate = TagPredicate & {
  weight: number;
};

type SearchIntent = {
  label: string;
  description: string;

  /**
   * Le produit doit matcher au moins un de ces groupes.
   * OR cross-category assumé et implémenté côté backend.
   */
  requireAny?: readonly TagPredicate[];

  /**
   * Le produit doit matcher tous ces groupes.
   * À utiliser rarement, car cela rend l'intention restrictive.
   */
  requireAll?: readonly TagPredicate[];

  /**
   * N'exclut pas les produits, mais augmente leur score.
   */
  boost?: readonly WeightedTagPredicate[];

  /**
   * Exclusions sémantiques éventuelles.
   */
  exclude?: readonly TagPredicate[];

  /**
   * Filtres proposés à l'utilisateur, mais pas appliqués automatiquement.
   */
  suggestedFilters?: readonly {
    tagType: SkincareProductTagCategory;
    slug: SkincareProductTagSlug;
    reason: string;
  }[];
};
```

Point clé : `requireAny` doit pouvoir faire un OR entre catégories.

Exemple :

```txt
match concern=barriere-cutanee
OR skin_type=peau-sensible
OR skin_effect=reparateur
```

Ce n'est pas représentable proprement avec l'URL actuelle en simples paramètres de filtres, car les paramètres actuels impliquent `AND` entre catégories.

## Comportement frontend idéal

Le frontend doit distinguer visuellement et techniquement trois actions.

### 1. Cocher un filtre

Quand l'utilisateur coche une checkbox dans le drawer, il applique une contrainte stricte.

URL :

```txt
/products?category=skincare&product_label=sans-parfum&skin_type=peau-sensible
```

Sémantique :

```txt
sans-parfum AND peau-sensible
```

Le frontend doit présenter cela comme des filtres actifs supprimables individuellement.

### 2. Cliquer une carte d'intention

Quand l'utilisateur clique "Rougeurs & rosacée", il n'applique pas une liste plate de slugs. Il active une intention.

URL recommandée :

```txt
/products?category=skincare&intent=redness
```

Sémantique :

```txt
appliquer le plan de recherche redness côté backend
```

Le frontend affiche une puce active :

```txt
Intention : Rougeurs & rosacée
```

Il peut aussi afficher des suggestions :

```txt
Ajouter sans parfum
Ajouter peau sensible
Ajouter crème hydratante
```

Mais il ne doit pas appliquer ces suggestions silencieusement.

### 3. Taper dans la search bar

Quand l'utilisateur tape :

```txt
crème rougeurs sans parfum peau sensible
```

Le frontend ne devrait pas deviner seul toute la logique. Il peut faire de l'autocomplete, mais la résolution canonique doit être partagée ou backend.

La recherche devrait produire un plan explicable :

```txt
product_type=creme-hydratante
intent=redness
product_label=sans-parfum
skin_type=peau-sensible
```

Puis le frontend affiche :

```txt
Recherche interprétée comme :
Crème hydratante + Rougeurs & rosacée + Sans parfum + Peau sensible
```

L'utilisateur doit pouvoir retirer chaque morceau.

## Comportement backend idéal

Le backend doit devenir le propriétaire de la sémantique de recherche.

### 1. Parser les filtres stricts

Les filtres actuels restent valides :

```txt
concern=anti-acne,pores-dilates
product_label=sans-parfum
```

Le backend construit :

```txt
(concern IN anti-acne,pores-dilates)
AND (product_label IN sans-parfum)
```

Ce comportement doit rester simple et prévisible.

### 2. Résoudre les intentions

Si l'URL contient :

```txt
intent=redness,sensitivity
```

Le backend charge les définitions d'intentions partagées et construit une expression SQL qui respecte `requireAny`, `requireAll`, `boost` et `exclude`.

Important : `requireAny` doit produire un vrai OR cross-category.

Exemple conceptuel :

```sql
WHERE (
  EXISTS(tag concern IN ('anti-rougeurs', 'rosacee', 'couperose', 'flushs'))
  OR EXISTS(tag skin_type IN ('peau-reactive', 'peau-sensible'))
)
```

Et pas :

```sql
WHERE
  EXISTS(tag concern IN (...))
  AND EXISTS(tag skin_type IN (...))
```

### 3. Combiner filtres stricts et intentions

Règle recommandée :

```txt
strict filters AND intent required clauses
```

Puis le scoring classe les produits à l'intérieur de ce périmètre.

Exemple :

```txt
intent=redness
product_label=sans-parfum
```

Signifie :

```txt
produits pertinents pour rougeurs
AND obligatoirement sans parfum
```

Le filtre explicite gagne toujours sur le boost implicite.

### 4. Scorer les résultats

Le backend devrait calculer un score quand `q` ou `intent` est présent.

Exemple de pondération :

```txt
match product_type explicite     +5
match tag coeur intention        +5
match filtre explicite           pas un boost, déjà obligatoire
match tag secondaire intention   +2
match label suggéré              +1
match nom/brand textuel          +1 à +3
```

Le score ne remplace pas les filtres stricts. Il sert seulement à ordonner les résultats pertinents.

### 5. Retourner les raisons de match

Pour que l'UX soit compréhensible, le backend devrait pouvoir retourner des raisons :

```ts
{
  id: '...',
  name: '...',
  score: 12,
  matchReasons: [
    { type: 'intent', label: 'Ciblé rougeurs' },
    { type: 'tag', label: 'Sans parfum' },
    { type: 'tag', label: 'Peau sensible' },
  ],
}
```

Cela évite l'effet boîte noire.

## URL cible

Séparer les dimensions dans l'URL.

Filtres stricts :

```txt
/products?category=skincare&skin_type=peau-sensible&product_label=sans-parfum
```

Intentions :

```txt
/products?category=skincare&intent=redness
```

Recherche texte :

```txt
/products?category=skincare&q=creme%20rougeurs%20sans%20parfum
```

Combinaison :

```txt
/products?category=skincare&intent=redness&product_label=sans-parfum&product_type=creme-hydratante
```

Règle :

- `intent` = sémantique de recherche ;
- `q` = texte brut à interpréter ;
- `product_label`, `skin_type`, `concern`, etc. = filtres stricts ;
- ne pas expandre silencieusement une intention en paramètres stricts, sauf mode explicitement legacy.

## Alias de recherche idéaux

Dans l'architecture parfaite, les aliases ne devraient pas retourner seulement des slugs.

Ils devraient retourner des significations :

```ts
type SearchMeaning =
  | { kind: 'intent'; key: keyof typeof SKINCARE_SEARCH_INTENTS }
  | { kind: 'tag'; tagType: SkincareProductTagCategory; slug: SkincareProductTagSlug; mode: 'required' | 'boost' }
  | { kind: 'product_type'; slug: SkincareProductTagSlug; mode: 'required' };
```

Exemples :

```ts
export const SKINCARE_SEARCH_ALIASES = {
  rougeurs: [{ kind: 'intent', key: 'redness' }],
  rosacee: [{ kind: 'intent', key: 'redness' }],
  couperose: [{ kind: 'intent', key: 'redness' }],

  'sans parfum': [
    {
      kind: 'tag',
      tagType: 'product_label',
      slug: 'sans-parfum',
      mode: 'required',
    },
  ],

  creme: [
    {
      kind: 'product_type',
      slug: 'creme-hydratante',
      mode: 'required',
    },
  ],
} as const;
```

Cela permet de distinguer :

- "rougeurs" = intention ;
- "sans parfum" = contrainte explicite ;
- "crème" = type de produit ;
- "apaisant" = effet recherché ou boost selon contexte.

Pour une Phase 1 backend-agnostic, `Record<string, readonly TagSlug[]>` peut suffire. Mais pour une architecture propre long terme, alias vers slugs est trop limité.

## Faut-il simplifier les tags ?

Réponse : oui sur l'exposition UX, non sur la donnée brute.

Il ne faut pas supprimer la richesse juste parce qu'elle est difficile à afficher. La complexité existe réellement :

- rougeurs n'est pas strictement rosacée ;
- peau sèche n'est pas strictement déshydratation ;
- sans parfum n'est pas strictement apaisant ;
- pigments verts n'est pas strictement anti-rougeurs ;
- réparateur n'est pas strictement barrière altérée.

Mais il faut nettoyer les tags qui ne portent pas une information claire.

### Garder

Garder les tags atomiques qui répondent à une question claire :

```txt
Quel problème ?
Quel type de peau ?
Quel type de produit ?
Quel effet revendiqué ?
Quelle contrainte formulation ?
Quelle étape de routine ?
```

### Déprécier progressivement

Déprécier les tags :

- trop génériques ;
- redondants sans nuance utile ;
- ambigus entre plusieurs catégories ;
- impossibles à expliquer à l'utilisateur ou à un admin ;
- jamais utilisés ou utilisés comme fourre-tout.

Exemples à auditer :

```txt
peau-tous-types
photo-protection
hydratation
barriere-cutanee vs barriere-cutanee-alteree
outil-massage
```

Ne pas supprimer sans audit DB.

### Ajouter rarement

Ajouter un tag seulement si :

- il représente une propriété produit stable ;
- il sera utilisé par plusieurs produits ;
- il améliore le filtrage, le scoring ou l'explication ;
- il n'est pas juste une intention utilisateur composite.

Ne pas ajouter un tag pour compenser une faiblesse du moteur de recherche.

## Catégories de tags recommandées

Chaque catégorie doit répondre à une seule question.

### `concern`

Question : quel problème ou objectif principal le produit adresse-t-il ?

Exemples :

```txt
anti-acne
anti-rougeurs
anti-taches
deshydratation
barriere-cutanee
pores-dilates
anti-age
eclat
```

### `skin_type`

Question : pour quel type ou état général de peau ?

Exemples :

```txt
peau-seche
peau-grasse
peau-mixte
peau-sensible
peau-reactive
peau-atopique
```

Attention : `peau-sensible` peut participer à l'intention `sensitivity`, mais reste un `skin_type`.

### `product_type`

Question : quelle forme ou famille produit ?

Exemples :

```txt
serum
creme-hydratante
gel-nettoyant
huile-demaquillante
exfoliant-chimique
creme-solaire
```

### `skin_effect`

Question : quel effet fonctionnel ou claim ?

Exemples :

```txt
apaisant
reparateur
matifiant
sebo-regulateur
keratolytique
repulpant
protection-cutanee
```

### `product_label`

Question : quelle contrainte, label ou caractéristique formulation ?

Exemples :

```txt
sans-parfum
non-comedogene
vegan
filtres-mineraux
grossesse-compatible
pigments-verts
```

### `routine_step`

Question : quand ou comment le produit s'insère-t-il dans la routine ?

Exemples :

```txt
nettoyant
traitement
hydratation
protection-solaire
exfoliation
masque-hebdo
```

Point d'attention : `hydratation` en `routine_step` ne doit pas être traité comme un synonyme de l'intention hydratation/déshydratation. C'est une étape de routine, pas un problème de peau.

## Exemple complet : "crème rougeurs sans parfum peau sensible"

Texte utilisateur :

```txt
crème rougeurs sans parfum peau sensible
```

Interprétation idéale :

```ts
{
  strictFilters: [
    {
      tagType: 'product_type',
      slugs: ['creme-hydratante', 'gel-creme'],
      operator: 'any',
    },
    {
      tagType: 'product_label',
      slugs: ['sans-parfum'],
      operator: 'any',
    },
    {
      tagType: 'skin_type',
      slugs: ['peau-sensible'],
      operator: 'any',
    },
  ],
  intents: ['redness'],
}
```

Plan backend :

```txt
MUST product_type IN (creme-hydratante, gel-creme)
AND product_label IN (sans-parfum)
AND skin_type IN (peau-sensible)
AND requireAny(redness)
ORDER BY relevance(redness)
```

`redness` peut lui-même dire :

```txt
requireAny:
  concern IN (anti-rougeurs, rosacee, couperose, flushs)

boost:
  skin_type IN (peau-reactive)
  skin_effect IN (apaisant)
  product_label IN (pigments-verts)
```

Résultat : on a bien un mix strict + sémantique.

Ce que le système ne doit pas faire :

```txt
concern=anti-rougeurs,rosacee,couperose,flushs,peau-sensible,sans-parfum,apaisant
```

Cette requête est fausse, car elle écrase les catégories.

Ce qu'il ne doit pas faire non plus :

```txt
concern=anti-rougeurs,rosacee,couperose,flushs
skin_type=peau-sensible
product_label=sans-parfum
skin_effect=apaisant
```

Sauf si l'utilisateur a explicitement demandé toutes ces contraintes, car cela devient beaucoup plus restrictif.

## Exemple : clic sur "Rougeurs & rosacée"

Quand l'utilisateur clique seulement la carte :

```txt
Rougeurs & rosacée
```

URL :

```txt
/products?category=skincare&intent=redness
```

Backend :

```txt
requireAny:
  concern IN (anti-rougeurs, rosacee, couperose, flushs)

boost:
  skin_type IN (peau-reactive, peau-sensible)
  skin_effect IN (apaisant)
  product_label IN (pigments-verts)
```

Frontend :

```txt
Puce active : Rougeurs & rosacée
Suggestions : Sans parfum, Peau sensible, Crème hydratante
```

Le clic ne doit pas automatiquement rendre `sans-parfum` obligatoire.

## Exemple : clic sur "Peau sensible / réactive"

Cette intention est naturellement cross-category.

Elle pourrait être :

```txt
requireAny:
  skin_type IN (peau-sensible, peau-reactive, peau-atopique)
  concern IN (barriere-cutanee-alteree, eczema)
  skin_effect IN (apaisant, reparateur)

boost:
  product_label IN (sans-parfum, hypoallergenique)
```

Ici, `sans-parfum` ne doit pas être obligatoire par défaut. Beaucoup de produits adaptés aux peaux sensibles sont sans parfum, mais l'utilisateur doit pouvoir choisir si c'est une contrainte stricte.

## Backend : deux modes possibles

### Mode browse

Utilisé quand il n'y a que des filtres stricts.

Caractéristiques :

- comportement actuel conservé ;
- pagination stable ;
- tri par nom, prix, nouveauté ou random ;
- pas forcément de score.

### Mode semantic

Activé quand il y a `q` ou `intent`.

Caractéristiques :

- résolution des intentions ;
- OR cross-category ;
- scoring ;
- raisons de match ;
- tri par pertinence par défaut ;
- filtres stricts toujours respectés.

Le backend peut garder un seul endpoint `GET /products`, mais il doit distinguer ces deux modes dans le service.

Alternative possible :

```txt
GET /products           browse strict
GET /products/discover  semantic search
```

Mais attention : `GET /products/search` existe déjà pour l'autocomplete name/brand. Ne pas surcharger ce endpoint sans le renommer clairement.

## Frontend : règles UX

### Ne pas masquer la différence filtre/intention

Une puce de filtre strict et une puce d'intention ne doivent pas avoir exactement le même comportement.

Exemples de labels :

```txt
Filtre : Sans parfum
Filtre : Peau sensible
Intention : Rougeurs & rosacée
```

### Ne pas appliquer des contraintes invisibles

Si l'intention `sensitivity` booste `sans-parfum`, l'utilisateur ne doit pas voir les produits parfumés disparaître sans explication.

Si `sans-parfum` devient obligatoire, il doit apparaître comme filtre actif.

### Expliquer les suggestions

Pour une intention `redness`, afficher :

```txt
Souvent utile avec rougeurs :
Sans parfum
Peau sensible
Apaisant
```

Mais laisser l'utilisateur décider.

### Garder les filtres avancés pour power users

Les tags techniques restent utiles :

- admin ;
- recherche avancée ;
- debug ;
- SEO ;
- scoring ;
- utilisateurs experts.

Le problème n'est pas leur existence. Le problème est leur exposition brute par défaut.

## Faut-il garder les clusters ?

Oui, mais pas sous forme de listes plates de slugs.

Les clusters sont nécessaires parce que la réalité utilisateur est floue :

- l'utilisateur ne sait pas toujours distinguer rougeurs, rosacée, couperose et flushs ;
- il confond souvent peau sèche et déshydratation ;
- il mélange sensibilité, irritation, barrière altérée et sans parfum ;
- il cherche un résultat, pas une taxonomie.

Mais cette complexité doit vivre dans une couche `search-intents`, pas dans la DB produit ni dans les filtres stricts.

Donc :

- garder les tags atomiques ;
- garder des intentions/clusters ;
- changer leur forme ;
- ne pas les utiliser comme tags ;
- ne pas les expandre naïvement dans l'URL ;
- les exécuter via un query planner backend.

## Migration idéale

### Phase A — Clarifier la sémantique

Avant tout code UI :

- décider que `filters` = strict ;
- décider que `intent` = sémantique/scoring ;
- décider que `q` = texte à interpréter ;
- décider que les intentions ne sont pas des tags DB ;
- documenter `AND` inter-catégories et `OR` intra-catégorie pour les filtres stricts ;
- documenter `requireAny`, `requireAll`, `boost`, `exclude` pour les intentions.

### Phase B — Nettoyer les fichiers shared

Créer :

```txt
tag-visibility.ts
tag-search-facets.ts
tag-search-intents.ts
tag-search-aliases.ts
```

Remplacer mentalement `tag-clusters.ts` par `tag-search-intents.ts` si on accepte le changement de vocabulaire.

Sinon garder `tag-clusters.ts`, mais son contenu doit être un modèle d'intention typée, pas une liste plate.

### Phase C — Ajouter tests d'intégrité

Tester :

- tous les slugs référencés existent ;
- chaque predicate d'intention porte un `tagType` valide ;
- chaque slug d'un predicate appartient bien au `tagType` annoncé ;
- aucun alias ne pointe vers une clé inexistante ;
- aucun tag `hidden` n'apparaît dans les facets ;
- les intentions ne contiennent pas de préférence obligatoire sans justification explicite.

### Phase D — Backend planner

Ajouter un planner qui produit une structure intermédiaire :

```ts
type ProductQueryPlan = {
  strict: readonly TagPredicate[];
  intentRequireAny: readonly TagPredicate[];
  intentRequireAll: readonly TagPredicate[];
  boosts: readonly WeightedTagPredicate[];
  excludes: readonly TagPredicate[];
  text?: string;
  sort: 'relevance' | 'name' | 'price_asc' | 'price_desc' | 'newest' | 'random';
};
```

Le SQL doit être généré depuis ce plan, pas directement depuis les query params.

### Phase E — Frontend UI

Brancher progressivement :

- facets simplifiées dans le drawer ;
- intentions en cartes rapides ;
- search bar qui affiche l'interprétation ;
- raisons de match dans les cards produit.

## Conclusion architecture idéale

Il ne faut pas choisir entre "tags simples" et "clusters complexes".

Le bon modèle est :

```txt
tags atomiques riches
+ filtres stricts simples
+ intentions typées pour la complexité utilisateur
+ backend planner pour AND/OR/scoring
+ frontend explicite sur ce qui est obligatoire vs suggéré
```

Les tags restent riches parce que la réalité produit est riche. L'UX devient simple parce qu'elle n'expose pas toute cette richesse au même niveau. Les clusters restent utiles parce qu'ils représentent le langage utilisateur, mais ils doivent devenir des intentions exécutables, pas des raccourcis de slugs.
