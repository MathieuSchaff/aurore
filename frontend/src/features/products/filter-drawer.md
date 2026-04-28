# Filter Drawer — audit UX

> Audit de l'organisation (pas du design) du drawer de filtres de la page **Products**.
> Sources : `FilterDrawer.tsx`, `ProductsFilterDrawerContent.tsx`, `useProductsFilterGroups.ts`,
> `useProductTagFilterGroups.ts`, et les `*-tag-filters.ts` par domaine dans `shared/`.

---

## 1. Ce qui est rendu, dans l'ordre

L'ordre vertical perçu par l'utilisateur quand il ouvre le drawer.

### Header
- Titre **« Filtres »** + bouton fermeture.

### Corps (form, scrollable)

1. **`children`** (passés depuis `ProductsFilterDrawerContent`) — *toujours en haut, hors accordéon* :
   - `Toggle` **« Selon mon profil »** (uniquement si skincare + utilisateur connecté).
   - `PriceRangeFilter` **« Prix (€) »** (toujours rendu).
2. **Accordéons `tier: 'essential'`** (sortés par `order`, `defaultOpen: true`).
3. **Séparateur visuel `Avancé`** + fieldset.
4. **Accordéons `tier: 'advanced'`** (`defaultOpen: false`), incluant le groupe **« Recherche précise »** (kind / brand / ingredient).

### Footer (sticky)
- `Réinitialiser` (gauche) / `Appliquer` (droite).

### Ordre concret par domaine (essentiel → avancé)

| Domaine    | Essentiels (ouverts)                                | Avancés (fermés)                                      |
|------------|-----------------------------------------------------|-------------------------------------------------------|
| skincare   | Peau · Problème · Zone · Type                       | Étape · Rendu · Label · Comédogénicité · Recherche précise |
| haircare   | Cheveux · Problème · Type                           | Étape · Bénéfice · Label · Recherche précise          |
| dental     | Problème · Âge · Type                               | Bénéfice · Label · Recherche précise                  |
| complement | Objectif · Forme · Moment                           | Contre-indication · Label · Recherche précise         |

À cela s'ajoutent **profil + prix** *avant* tout accordéon, et le toggle **« Selon mon profil »** uniquement en skincare connecté.

---

## 2. Ce qui est bien fait

- **Découpage `essential` / `advanced`** matérialisé par un séparateur étiqueté « Avancé ». Signal clair, sans cacher l'avancé derrière un sous-menu.
- **`defaultOpen` sur les essentiels** → zéro clic pour atteindre les filtres principaux.
- **`defaultOpen` aussi forcé si `totalSelected > 0`** (`FilterAccordion.tsx:28`). Bonne règle : un accordéon avancé reste ouvert si l'utilisateur y a une sélection, donc rien n'est jamais "caché alors que c'est utilisé".
- **Catégories de tags pilotées par le domaine actif** (`DOMAIN_TAG_META`). En skincare on voit « Peau », en haircare « Cheveux » : zéro bruit cross-domaine.
- **Toggle « Selon mon profil » conditionnel** (`showProfileToggle`) → invisible si non pertinent.
- **Compteur par accordéon + compteur global** dans la barre repliée au-dessus de la liste. Signal de feedback solide.
- **`Recherche précise`** (kind / brand / ingredient) regroupée dans un seul accordéon avancé : on n'occupe pas un slot "essentiel" pour des champs à forte intention mais à coût cognitif élevé.
- **Apply implicite à la fermeture** (backdrop / X / Échap → `handleClose` qui appelle `onApply`). Pas de "et là j'ai oublié de cliquer Appliquer".
- **A11y** : navigation flèches entre triggers, `inert` sur sections fermées, focus restoration vers le bouton qui a ouvert le drawer.

---

## 3. Problèmes d'organisation

### 3.1 Profile toggle + Prix flottent hors hiérarchie *(partiellement résolu)*

> ✅ Prix : promu en accordéon (`PriceFilterAccordion`), rendu via `essentialExtras` après les essentiels tag.
> ⏳ Profile toggle : toujours flottant en tête. Le CSS `.filter-drawer__body > .toggle` lui donne une allure de shelf, mais sans label « Essentiel » qui rattache l'ensemble.

Avant le fix, `children` (toggle profil + prix) étaient rendus **avant** la première section taggée, **sans en-tête ni étiquette de groupe**. Visuellement c'est :

```
[Toggle "Selon mon profil"]
[Prix (€) min — max]
[Accordéon "Peau"]   ← même niveau visuel, pas le même type d'interaction
...
```

Conséquence :
- Mélange de deux modèles mentaux : *contrôles libres (toggle / range)* et *sélection de tags*.
- Pas de label « Essentiel » pour rattacher prix/profil au reste.
- Le toggle profil a un **fort poids fonctionnel** (filtre selon dermo profile) mais aucun cadrage visuel ; il est aussi facile à manquer qu'une bordure.

→ **Recommandation** : soit envelopper prix/profil dans un sous-bloc "essentiel non-tag" identifié, soit promouvoir « Prix » et « Selon mon profil » dans des accordéons à part (cohérence du pattern). Le mode "tout est un accordéon" reste plus prévisible.

### 3.2 Hiérarchie des essentiels — Prix avant les filtres sémantiques *(résolu)*

> ✅ Prix maintenant rendu *après* les essentiels tag (via `essentialExtras` dans `FilterDrawer.tsx:165`). Profile toggle reste en tête (justifié comme super-filtre).

L'utilisateur TDAH/dermo arrive avec une intention typique : « **pour quel type de peau / quel problème ?** », pas « combien je veux dépenser ? ». Mettre **Prix** au-dessus de **Peau / Problème** privilégie un pattern e-commerce générique alors que la vision du produit est *l'outil bienveillant qui guide selon le profil dermo*.

→ **Recommandation** : descendre le bloc Prix sous les essentiels tag (ou en bas d'« Essentiel », au-dessus du séparateur « Avancé »). Garder le toggle profil tout en haut **est** justifié — c'est un super-filtre — mais alors il mérite un cadrage visuel propre (cf. 3.1).

### 3.3 Ingrédient et marque relégués en "Avancé" *(résolu)*

> ✅ Ingrédient promu en `tier: 'essential'` dans son propre accordéon (`useProductsFilterGroups.ts:35-59`), `defaultOpen: false` (l'async-search est plus lourd qu'un chip group). Marque + Kind restent dans « Recherche précise » (advanced).

Avant le fix, `Recherche précise` (kind / brand / ingredient) était marquée `tier: 'advanced'`.

- Pour un débutant : juste, ingrédient = bruit.
- Pour l'utilisateur dermo informé (cible explicite du projet) : **ingrédient est l'un des filtres à plus forte valeur** (« contient niacinamide », « éviter alcool »). Le cacher sous « Avancé » + accordéon fermé = 2 clics minimum pour atteindre le filtre clé.

→ **Recommandation à brainstormer** : promouvoir au moins **Ingrédient** en essentiel (ou créer un tier intermédiaire), tout en laissant Marque/Kind dans Recherche précise. Aligné avec le moteur dermo signal qui est au cœur du produit.

### 3.4 Quatre essentiels ouverts simultanément en skincare = pic cognitif *(résolu)*

> ✅ En skincare, seuls Peau + Problème sont `defaultOpen: true`. Type + Zone démarrent fermés (`shared/.../skincare/tag-filters.ts`). Prix démarre fermé sauf si une valeur est déjà posée. Première vue : ~2 nuages de chips, plus calme.

Avant le fix, à l'ouverture du drawer skincare : **4 nuages de chips visibles d'un coup** (Peau + Problème + Zone + Type) + Prix + Toggle. Beaucoup de scroll dès le premier regard. Contre-vision « réduction de la charge cognitive ».

→ **Pistes** :
- N'ouvrir par défaut que les 2 premiers (Peau, Problème) ; laisser Zone/Type fermés.
- Ou afficher max 6–8 chips par groupe + un « Voir tout (N) » pour rester compact.

### 3.5 Recouvrement sémantique « Type » (essentiel) vs « Étape » (avancé)

En skincare : `product_type` (sérum / crème / nettoyant…) et `routine_step` (nettoyage / traitement / hydratation…) tagguent souvent **le même produit selon deux axes proches**. Un sérum *est* un traitement. Pour un utilisateur non expert c'est confus :
- « Je veux un sérum » → coche Type.
- « Je veux un traitement » → coche Étape.
→ Deux chemins, même résultat ; ou pire, sélection croisée trop restrictive.

→ **À clarifier produit** (pas une décision drawer) : faut-il garder les deux ? Si oui, libellés/placeholders qui explicitent la différence.

### 3.6 Ordre `Zone` avant `Type` en skincare *(résolu)*

> ✅ Permuté : `product_type` order=3, `skin_zone` order=4. Hypothèse retenue : « je veux un sérum » (type) > « je veux pour les yeux » (zone) sur le flow de découverte.

### 3.7 Pas de compteur "résultats" en live *(résolu)*

> ✅ Le bouton Appliquer affiche `Voir N produit(s)` en temps réel (`FilterDrawer.tsx:204-207`). Le parent (`ProductsPage.tsx:137-143`) lance une query préview gated sur `isDrawerOpen` avec `placeholderData` pour éviter le clignotement.

### 3.8 Sémantique « Reset » vs « Apply »

- `Apply` = ferme + applique le brouillon local.
- `Reset` = reset local **et** appelle `onReset` qui navigue (commit immédiat). Le drawer reste ouvert avec un form vide.
- `X` / backdrop / Échap = applique le brouillon (`handleClose`).

Pas de chemin **« annuler les modifs locales sans appliquer »**. C'est cohérent dans la pratique (filtres = action non destructive), mais Reset commit immédiatement alors que Apply est nécessaire ailleurs : **deux logiques de commit dans le même footer**. À documenter au minimum, à uniformiser idéalement.

### 3.9 Prix non collapsible *(résolu)*

> ✅ `PriceFilterAccordion` enveloppe `PriceRangeFilter` dans un `<details>` aligné sur la même DSL CSS que `FilterAccordion`. `defaultOpen` = `hasValue` (verrouillé au mount). Espace libéré au-dessus de Peau / Problème.

---

## 4. Synthèse priorisée

| Priorité | Sujet                                                                 | État     |
|----------|-----------------------------------------------------------------------|----------|
| 🔴       | Promouvoir `Ingrédient` hors de "Avancé" (cible dermo cœur produit)    | ✅ Fait — `useProductsFilterGroups.ts:35-59` (tier `essential`, `defaultOpen: false`) |
| 🔴       | Compteur live « Voir N produits » sur Appliquer                        | ✅ Fait — `FilterDrawer.tsx:204-207` + `ProductsPage.tsx:137-143` (query préview, `enabled: isDrawerOpen`) |
| 🟠       | Homogénéiser : Prix dans un accordéon                                 | ✅ Fait — `PriceFilterAccordion.tsx`, intégré via `essentialExtras` |
| 🟠       | Réduire `defaultOpen` à 2 essentiels en skincare (charge cognitive)    | ✅ Fait — `shared/.../skincare/tag-filters.ts` (Peau + Problème ouverts, Type + Zone fermés) |
| 🟠       | Descendre Prix sous les filtres sémantiques tag                       | ✅ Fait — `essentialExtras` rendu après les essentiels dans `FilterDrawer.tsx:165` |
| 🟡       | Permuter Zone / Type en skincare                                      | ✅ Fait — `product_type` order=3, `skin_zone` order=4 |
| 🟡       | Clarifier `product_type` vs `routine_step` (libellés / décision produit) | ⏳ Pas une décision drawer (libellés / produit) |
| 🟡       | Uniformiser sémantique Reset/Apply                                    | ⏳ À débattre — Reset commit immédiatement (navigation), Apply commit local. Cohérence à clarifier produit avant refacto. |

---

## 5. Problèmes de performance — journal

### 5.1 Freeze à l'expand/collapse d'un accordéon contenant beaucoup de chips

**Symptôme** : gel visible (~100–200 ms) au moment où l'accordéon s'ouvre ou se ferme, surtout sur les catégories à beaucoup d'options (ex. `product_type` = 74 chips en skincare).

**Cause racine étape 1** : `chipTabIndex={isOpen ? 0 : -1}` était passé à `ChipGroup` depuis `FilterAccordion`. À chaque toggle, React déclenchait N mutations DOM synchrones (une `setAttribute('tabindex')` par chip). Redondant avec `inert={!isOpen}` posé sur la `<section>` parente — l'attribut HTML `inert` délègue au navigateur la mise hors-portée de tous les descendants en 1 mutation native.

**Fix étape 1** : suppression de `chipTabIndex` dans `FilterAccordion.tsx`, `SubGroupedChips.tsx`, et finalement du prop dans `ChipGroup.tsx` (devenu sans usage).

**Cause racine étape 2** : même après le fix `chipTabIndex`, l'état React `isOpen` (`useState` dans `FilterAccordion`) déclenche à chaque toggle :

1. Re-render complet du composant `FilterAccordion`.
2. Réévaluation du `subFilters.map(...)` → ré-instantiation des `ChipGroup` / `SubGroupedChips`.
3. Pour chaque chip (74 en skincare), nouvelle closure `onChange`/`onChipKeyDown` → React reconcilie chaque bouton, recalcule les props, même sans mutation DOM finale.
4. Tout ça **avant** que la transition CSS `grid-template-rows: 0fr → 1fr` ne démarre, donc gel visible.

**Fix étape 2** : passage à l'élément natif `<details>` / `<summary>`.

- L'état ouvert/fermé vit dans le DOM (browser-owned), pas dans React.
- Toggle du `<summary>` ne déclenche **aucun** re-render React — donc zéro réévaluation des chips.
- Le state initial est verrouillé via `useState(() => group.defaultOpen || totalSelected > 0)` (lazy init, stable cross-render) ; la prop `open` passée à `<details>` ne change jamais → React n'écrase pas un toggle natif.
- `<summary>` porte implicitement le rôle ARIA `button` + l'état `expanded` reflétant `details.open`. Plus besoin de gérer manuellement `aria-expanded`, `inert`, `aria-hidden` — tout est natif.
- L'animation utilise `interpolate-size: allow-keywords` + `::details-content` (Chrome 131+, Firefox 137+, Safari 18.2+) en progressive enhancement ; les anciens navigateurs snap (acceptable).
- La rotation du chevron passe de `style={{ transform }}` inline à un sélecteur CSS `.filter-accordion[open] .filter-accordion__chevron` (composite, pas de mutation React).

**Effets de bord** :
- Tests `FilterAccordion.test.tsx` adaptés : assertions sur `details.open` (booléen) au lieu de `aria-expanded` / `inert` / `aria-hidden`.
- `FilterAccordion.css` simplifié : suppression de la grille animée (`display: grid; transition: grid-template-rows`), de `.filter-accordion__inner`, de l'inline style chevron, du wrapper inert.
- `PriceFilterAccordion` aligné sur le même pattern (`<details>` + même CSS `.filter-accordion` partagé).

### 5.2 « Maximum update depth exceeded » à l'ouverture du drawer

**Symptôme** : warning React `Maximum update depth exceeded` répété en boucle dans la console dès l'ouverture du drawer (apparu après l'introduction du compteur live `Voir N produits`, cf. 3.7). UI réactive mais le main thread est saturé tant que le drawer est ouvert.

**Cause racine** — boucle de feedback à trois étages :

1. `ProductsPage.tsx` reconstruisait `filters` à chaque render :
   ```ts
   const filters = Object.fromEntries(FILTER_KEYS.map((k) => [k, search[k] ?? []]))
   ```
   → nouvelle référence d'objet à chaque render, même quand `search` ne change pas.

2. `FilterDrawer` déclarait `currentFilters` comme dépendance d'un effet de resync :
   ```ts
   useEffect(() => { if (open) setLocalFilters(currentFilters) }, [open, currentFilters])
   ```
   → la nouvelle ref de `filters` faisait re-feu l'effet à chaque render parent. `setLocalFilters` voyait une ref différente (Object.is faux), schedule un nouveau render.

3. Un second effet émettait l'état local vers le parent :
   ```ts
   useEffect(() => { if (open) onLocalFiltersChange?.(localFilters) }, [open, localFilters, onLocalFiltersChange])
   ```
   `onLocalFiltersChange` = `setDraftFilters` (utilisé pour la query preview). À chaque changement de ref de `localFilters`, l'effet appelait `setDraftFilters` → render parent → nouvelle ref `filters` → étape 2 → ∞.

**Fix** :

- **`ProductsPage.tsx`** : `filters` mémoïsé via `useMemo([search])`. Ref stable tant que les params d'URL ne bougent pas. Bonus : `useListFilters` arrête de recalculer `filterCount` / `activeTags` à chaque render.
- **`FilterDrawer.tsx`** : suppression de l'effet d'émission. Remplacé par un appel direct dans `handleToggle` et le bouton « Réinitialiser », via un helper `commitLocal(next)` qui fait `setLocalFilters(next)` + `onLocalFiltersChangeRef.current?.(next)`. Le ref `onLocalFiltersChangeRef` permet de rester sur la dernière callback sans dépendance d'effet.
- **`ProductsPage.tsx`** : `setDraftFilters(null)` ajouté dans `onClose` du drawer, pour qu'une réouverture ne reparte pas sur le brouillon précédent (sinon `previewCount` reflète des filtres déjà appliqués).

L'effet `[open, currentFilters]` reste tel quel (couvre le cas « URL modifiée pendant que le drawer est ouvert » — testé dans `FilterDrawer.test.tsx`). C'est l'absence de mémoïsation côté parent qui rendait sa dépendance instable, pas l'effet lui-même.

**Vérifications** : `bunx tsc --noEmit` clean ; `FilterDrawer.test.tsx` 13/13 ; `FilterAccordion.test.tsx` 23/23 ; `ProductsPage` + `ProductsHeader` + `useListFilters` 24/24.

### 5.3 Layout shift à l'ouverture du drawer (scrollbar gutter)

**Symptôme** : à l'ouverture du drawer, la zone scrollable du body se décale visuellement quand la scrollbar apparaît (le contenu se réajuste de ~6 px), puis re-décale au close.

**Fix** : scrollbar masquée sur `.filter-drawer__body` :

```css
scrollbar-width: none;            /* Firefox / standards */
&::-webkit-scrollbar { display: none; }   /* Chromium, WebKit */
```

Le scroll reste fonctionnel (molette, trackpad, touch). Pas de gutter à réserver puisque rien n'est rendu. Choix assumé : la cohérence visuelle prime sur l'affordance « il y a du contenu en dessous » — l'utilisateur le découvre en scrollant, et le drawer est suffisamment court pour que ce soit non bloquant.

**Alternative non retenue** : `scrollbar-gutter: stable both-edges` — réserve l'espace mais affiche quand même la barre, donc ne résout que partiellement le « c'est moche ».

---

## 6. Mécanique du compteur live (`Voir N produits`)

### 6.1 Pourquoi une query serveur et pas un calcul local

Le catalogue est **paginé** (20 produits par page). Le navigateur ne tient en mémoire que la page courante, pas les 247+ produits du catalogue. Filtrer côté client = filtrer 20 items, pas le total. Donc impossible de répondre « combien de produits matchent ces filtres ? » sans demander au serveur — qui lui interroge la DB avec les jointures de tags, `avoidFor` (exclusions dermo), etc.

### 6.2 Pourquoi le brouillon vit dans `ProductsPage` et pas dans le drawer

La query qui calcule le compteur est `productQueries.list(...)` — c'est la **même** que celle qui peuple la grille principale. Elle vit dans `ProductsPage` parce qu'elle a besoin de `category`, `sort`, `priceMin`, `priceMax`, `q` (tous dans l'URL) en plus des filtres tags. Le drawer ne connaît rien de tout ça — il est purement de l'UI.

D'où l'aller-retour : drawer émet le brouillon → `setDraftFilters` dans le parent → parent reconstruit les `previewApiFilters` → `useQuery` fetch → `previewCount` redescend en prop.

```
[click chip dans drawer]
       │
       ▼
commitLocal(next)
   ├─ setLocalFilters(next)        → drawer re-render (chip actif)
   └─ setDraftFilters(next)        → ProductsPage re-render
                                       └─ previewQuery(newKey)
                                          └─ fetch → previewCount = 23
                                             └─ drawer re-render ("Voir 23")
```

C'est le **prix** du compteur live : un re-render parent par clic. Pas un bug, juste pas infini (cf. 5.2 pour la version cassée).

### 6.3 Deux queries, deux clés, deux entries de cache

`ProductsPage.tsx` instancie deux `useQuery` distincts pendant que le drawer est ouvert :

```ts
// Grille principale — lit l'URL
const apiFilters = buildProductsApiFilters({ filters /* URL */, ... })
const { data } = useQuery(productQueries.list(apiFilters))

// Compteur preview — lit le brouillon
const previewApiFilters = buildProductsApiFilters({
  filters: draftFilters ?? filters,
  ...
})
const { data: previewData } = useQuery({
  ...productQueries.list(previewApiFilters),
  enabled: isDrawerOpen,
})
```

Tant que le brouillon ≠ URL, les `queryKey` divergent → **deux cellules** distinctes en cache :

```
Cache RAM :
  ['products','list',{concern:['acne']}]            → entry A   (grille)
  ['products','list',{concern:['acne','anti-age']}] → entry B   (preview)
```

A et B sont indépendantes : ce que B fetch ne touche pas A. La grille derrière le drawer reste figée tant que l'URL ne bouge pas.

### 6.4 Apply = convergence des clés → cache hit gratuit

Quand l'utilisateur clique `Appliquer` :

1. `applyFilters(localFilters)` → `navigate({ search: ... })` → URL change.
2. Le hook `useSearch` re-run, `filters` (memoïsé sur `[search]`) reflète le nouveau brouillon.
3. `apiFilters` est reconstruit → sa `queryKey` devient **identique** à celle qu'avait `previewApiFilters`.
4. La grille `useQuery` fait `cache.get(key)` → HIT sur l'entry B → data affichée instantanément, **zéro fetch**.

```
T0  Drawer ouvert, user coche "anti-age"
    preview useQuery(key=X) → cache vide → fetch → cache.set(X, data)
    cache : { X: data }

T1  User clique Appliquer
    URL = X
    main useQuery(key=X) → cache.get(X) → HIT, instantané
    cache : { X: data }
```

Le « prefetch » émerge de la coïncidence des clés, pas d'un appel `prefetchQuery` explicite. Deux `useQuery` qui partagent une clé partagent l'entry — la première remplit, la seconde lit.

### 6.5 Conditions pour que le cache hit fonctionne

La clé inclut **tout** ce qui est dans `buildProductsApiFilters` : `category`, `kind`, `filters`, `avoidFor`, `sort`, `priceMin`, `priceMax`, `q`, `page`, `hasFilters`. Pour que les clés convergent à l'apply, toutes ces variables doivent matcher entre preview et main au moment du commit. Aujourd'hui c'est garanti :

- `category`, `sort`, `priceMin`, `priceMax`, `q` viennent de l'URL → identiques aux deux endroits.
- `page` : preview force `1`, et `applyFilters` reset l'URL à `page: 1`. Match.
- `filters` : preview = `draftFilters ?? filters`. Apply commit `localFilters` (= `draftFilters`) dans l'URL. Match.
- `staleTime` : preview = 5 min ; main = 5 min quand `hasFilters` true. La preview reste fraîche au moment du switch.

Si on introduisait plus tard un filtre du drawer qui ne passe pas par l'URL (ou un `staleTime` court), le cache hit pourrait casser silencieusement. À surveiller.

### 6.6 Note sur `previewQuery.items` jeté

L'endpoint renvoie `{ items, total }`. Pour le compteur on n'utilise que `total`, mais la réponse charge quand même 20 items. C'est de la bande passante perdue. Optimisation possible : ajouter un endpoint `productQueries.count(filters)` qui renvoie juste `{ total }`. Trade-off : on perd l'effet prefetch (les 20 items pré-chargés ne nourriraient plus la grille à l'apply) sauf si on lance les deux requêtes en parallèle. Pas critique tant que le payload reste petit.

---

## 7. Couverture de tests — audit

État de la couverture sur le composant et son intégration. Honnête : il y a des trous, listés par criticité.

### 7.1 Couverture actuelle

| Suite | Tests | Couvre |
|---|---|---|
| `FilterDrawer.test.tsx` | 13 | open/close, modify+apply, reset, escape, backdrop click, focus restoration, scroll lock, async child, currentFilters resync |
| `FilterAccordion.test.tsx` | 23 | `<details>` natif, chips, escape inside chip, sub-groupes |
| `SubGroupedChips.test.tsx` | 9 | interactions sub-groupes |
| `useListFilters.test.ts` | 9 | hook URL ↔ filters |
| `__integration__/ProductsPage.filter.test.tsx` | 4 | drawer → URL → liste (intégration) |
| `e2e/products.spec.ts` (drawer) | 1 | open + apply chip + remove via active bar |

### 7.2 Trous identifiés

#### 🔴 7.2.1 Pas de test de régression sur la boucle « Maximum update depth »

Le bug fixé en 5.2 n'a aucun garde-fou. Si quelqu'un re-introduit l'émission via `useEffect`, **rien ne casse** dans la suite — le warning React n'échoue pas un test par défaut.

À ajouter dans `FilterDrawer.test.tsx` :

```ts
it('does not call onLocalFiltersChange just by opening', () => {
  const onChange = vi.fn()
  render(<FilterDrawer open onLocalFiltersChange={onChange} ... />)
  expect(onChange).not.toHaveBeenCalled()
})

it('emits exactly once per toggle, not in a loop', () => {
  const onChange = vi.fn()
  render(<FilterDrawer open onLocalFiltersChange={onChange} ... />)
  fireEvent.click(screen.getByRole('button', { name: /Acné/i }))
  expect(onChange).toHaveBeenCalledTimes(1)
})

it('does not warn "Maximum update depth"', () => {
  const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  render(<FilterDrawer open ... />)
  expect(errSpy).not.toHaveBeenCalledWith(
    expect.stringContaining('Maximum update depth')
  )
})
```

#### 🔴 7.2.2 Le compteur live n'a aucun test

Pas testé : le bouton `Voir N produits`, le gating `enabled: isDrawerOpen`, le reset `setDraftFilters(null)` à la fermeture, le cache hit à l'apply (cf. §6.4). Tout le path 6.x du doc est non couvert.

À ajouter dans `__integration__/ProductsPage.filter.test.tsx` :

```ts
it('shows live count on apply button as user toggles chips', ...)
it('clears draftFilters when drawer closes (no stale preview on reopen)', ...)
it('apply does not refetch when preview key matches main key (cache hit)', ...)
```

#### 🟠 7.2.3 `useMemo` sur `filters` dans ProductsPage non protégé

Si quelqu'un retire le `useMemo` (`ProductsPage.tsx:79-86`), la boucle revient. Indirectement couvert si on ajoute le test #7.2.1 au niveau intégration plutôt qu'unitaire — sinon zéro garde-fou.

#### 🟠 7.2.4 `PriceFilterAccordion` zéro test

Aucun test sur le composant : `defaultOpen` lockée au mount via `useState(() => hasValue)`, détection de `hasValue`, intégration avec `PriceRangeFilter` (qui modifie l'URL directement, hors `commitLocal`).

À créer : `PriceFilterAccordion.test.tsx`.

#### 🟡 7.2.5 Domain switch pendant que le drawer est ouvert

Que se passe-t-il si l'utilisateur change `category` (skincare → haircare) avec le drawer ouvert ? Les groupes du drawer changent ; le brouillon reste-t-il cohérent ? Le `currentFilters` change de structure. Comportement non testé, sémantique non documentée.

#### 🟡 7.2.6 Profile toggle ↔ drawer

Le toggle `Selon mon profil` modifie l'URL directement (`onProfileFilterChange` → `navigate`), pas via `commitLocal`. C'est un super-filtre hors flow brouillon. Pas testé que cette interaction reste cohérente avec le reste du drawer.

#### 🟡 7.2.7 E2E filter drawer minimal

Un seul test E2E touche le drawer (`products.spec.ts`). Pas de scénario complexe : multi-tags + preview count en live, reset commit immédiat (cf. §3.8), profile toggle, prix range, async ingredient search.

### 7.3 Priorité d'action

```
Si on ne peut ajouter qu'UNE chose : test #7.2.1 (régression boucle).
Coût : 30 min. Empêche le bug exact corrigé en §5.2 de revenir.

Ensuite : #7.2.2 (compteur live + clear draft) — feature pas couverte du tout.

Reste = nice-to-have selon le risque qu'on assigne au composant.
```

---

## 8. Hors périmètre mais noté

- Pas de recherche/filtre interne aux nuages de chips. Acceptable tant que les listes restent courtes ; à surveiller si le seed grandit.
- Pas de mémorisation de l'état d'ouverture des accordéons d'une ouverture de drawer à l'autre. Le `defaultOpen` est recalculé à chaque montée.
- Le toggle « Selon mon profil » n'a pas d'aperçu de ce qu'il va exclure (X produits déconseillés). Idée pour une V+1.
