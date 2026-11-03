# Convention dates

Toutes les dates qui traversent une frontière (DB et backend, backend et API,
API et frontend) sont des **strings ISO 8601 UTC**. Aucun objet `Date` JS ne
voyage hors d'un site d'usage local.

> Si tu te poses la question "Date ou string ?" : c'est string.

---

## 1. Pourquoi cette règle

- Un `Date` JS conserve un instant à la milliseconde, pas la précision microseconde
  de PostgreSQL. Sa sérialisation ISO est UTC ; lui ajouter un offset local sans
  convertir l’heure change l’instant.
- Drizzle en mode par défaut renvoie tantôt `Date`, tantôt string selon le
  driver et la colonne : code défensif `instanceof Date` partout sinon.
- ISO 8601 UTC est lexicographiquement triable, donc `compareInstant` = string
  compare, zéro allocation `Date` dans les hot lists.
- Une seule représentation = une seule règle à connaître.

---

## 2. Couches

### 2.1 DB (Drizzle)

Toutes les colonnes `timestamp` et `date` déclarent `mode: 'string'`.

```typescript
// timestamp avec timezone (audit, instants)
createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
  .notNull()
  .defaultNow()

updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date().toISOString())

// date pur (calendar dates : achats, snooze)
purchasedAt: date('purchased_at', { mode: 'string' }).notNull()
```

- ISO 8601 UTC (`"2026-05-07T14:23:10.000Z"`) est le contrat de sortie Aurore,
  pas une garantie du driver ou de `mode: 'string'` : voir le piège Bun/Drizzle ci-dessous.
- `date` revient en `"YYYY-MM-DD"` (pas de timezone : c'est une date
  calendaire, pas un instant).
- `.$onUpdate(() => new Date().toISOString())` plutôt que `new Date()` :
  mode `string` n'accepte pas un objet `Date`.

### 2.2 Schémas Zod (`shared/`)

Toutes les dates utilisent `z.iso.datetime()`. Pas de `z.date()`, pas de
`z.coerce.date()`, pas de `z.string().regex(/^\d{4}-\d{2}-\d{2}$/)`.

```typescript
// Instants (audit timestamps, doneAt, publishedAt, etc.)
createdAt: z.iso.datetime()
publishedAt: z.iso.datetime().nullable()

// Calendar dates (purchasedAt, openedAt, snoozedUntil, etc.)
// Sur le wire = ISO datetime UTC à minuit (`"2026-05-07T00:00:00.000Z"`).
purchasedAt: z.iso.datetime()
snoozedUntil: z.iso.datetime().nullable().optional()
```

Une calendar date voyage en plein ISO datetime UTC pour rester homogène.
Le backend tronque à `YYYY-MM-DD` à la frontière (cf. « Backend services »).

### 2.3 Backend services

Pour les colonnes `date` (calendar dates), conversion à la frontière du
service via `backend/src/utils/dates.ts` :

```typescript
import { calendarToInstant, instantToCalendar } from '../../utils/dates'

// Read (DB → API) : YYYY-MM-DD → ISO datetime UTC
function toApiPurchase(row: PurchaseRow): Purchase {
  return {
    ...row,
    purchasedAt: calendarToInstant(row.purchasedAt),
    openedAt: row.openedAt ? calendarToInstant(row.openedAt) : null,
    // ...
  }
}

// Write (API → DB) : ISO datetime UTC → YYYY-MM-DD
await db.insert(purchases).values({
  purchasedAt: instantToCalendar(input.purchasedAt),
})
```

Pour les comparaisons chronologiques en JS, **ne pas** utiliser le compare
string direct sur des valeurs venant du driver PG : le format peut différer
(`"2026-05-07 14:23:10+00"` vs `"2026-05-07T14:23:10.000Z"`). Utiliser
`Date.parse()` pour obtenir un timestamp numérique :

```typescript
const graceCutoffMs = Date.now() - 24 * 60 * 60 * 1000
if (Date.parse(user.createdAt) < graceCutoffMs) {
  return err('grace_expired')
}
```

Helpers backend (`backend/src/utils/dates.ts`) :

| Helper | Usage |
|--------|-------|
| `nowISO()` | timestamp ISO maintenant (UTC) |
| `todayCalendarUTC()` | `"YYYY-MM-DD"` aujourd'hui (UTC) |
| `instantToCalendar(iso)` | extraction de la portion date UTC |
| `calendarToInstant(yyyymmdd)` | promotion à minuit UTC |
| `normalizeInstant(value)` | force un timestamptz Drizzle vers ISO 8601 UTC |

**DB `now()` (le tag `sql` de Drizzle) vs `nowISO()` (horloge JS).** `nowISO()` rend une string JS,
à utiliser dès qu'on a besoin de l'instant comme *valeur* : calcul d'expiry/cutoff, retour dans une
réponse ou un export, comparaison, réutilisation sur plusieurs colonnes/branches. Un `now()` SQL nu
(le tag `sql`) est un fragment utilisable seulement dans une requête (`.set()` / `.values()` /
`where`) ; il ne se matérialise jamais en JS. Le préférer pour une simple estampille de colonne quand la valeur
n'est pas réutilisée, surtout quand le même statement (ou la même transaction) écrit déjà d'autres
colonnes en `now()`, pour que tous les timestamps d'un même événement partagent l'unique instant de
début de transaction (PG `now()` = horloge de début de tx). Ce n'est **pas** l'antipattern
`new Date().toISOString()` de la section « Antipatterns à éviter » : celui-ci bannit la forme JS côté app, alors que `now()` DB est la
même source que le `.defaultNow()` béni en « DB (Drizzle) ».

> **Bun SQL 1.4.3 et Drizzle 0.45.4 patché, correction du 2026-11-03** : Bun décode
> un `timestamptz` natif en objet `Date`, donc à la milliseconde. Le décodeur Drizzle
> d’origine associait l’heure UTC de `toISOString()` à l’offset local de
> `getTimezoneOffset()`, sans convertir l’heure. À Paris, une date de novembre reculait
> ainsi d’une heure, une date de juillet de deux heures. La normalisation ISO en aval
> produisait un instant toujours faux ; un schéma ISO ne détectait pas ce décalage.
>
> Aucune option du client Bun ne livre du texte : requête préparée, `prepare: false`,
> `.simple()` et `.values()` rendent tous un `Date`. Les conteneurs n’imposent pas de
> fuseau et tournent donc en UTC : l’instant y restait juste, mais la valeur sortait en
> `2026-07-03 00:08:07.032+00`, pas en ISO `Z`. Le décalage touchait les processus lancés
> sur l’hôte, tests et scripts compris. Forcer `TZ=UTC` partout masquerait le décalage
> sans corriger ce format.
>
> Le [patch de dépendance](../../patches/README.md#utc-timestamp-mapping-in-drizzle-orm-0454)
> retourne maintenant directement l’ISO UTC pour une entrée `Date` avec timezone. Les
> entrées string, les timestamps sans timezone et les dates calendaires sont conservés.
> ESM et CommonJS sont corrigés, sans migration, changement de règle métier ou réécriture
> des données. Conserver `patchedDependencies`, le patch et le lock dans toute installation.
>
> `normalizeInstant` reste la frontière API de mise en forme ISO ; il ne reconstitue ni
> les microsecondes perdues par `Date`, ni un ancien instant déjà décalé. Les transports
> `Date` ont une précision milliseconde. Un journal d’appartenance exact doit relire les
> horodatages en texte/JSON côté PostgreSQL, par exemple
> `to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')`,
> puis comparer ces strings sans conversion en `Date`. `::text` préserve aussi la précision,
> mais suit le fuseau de session. Le journal natif existant conserve cette garantie.
>
> La régression `backend/src/tests/integration/timestamp-transport.test.ts` lance de vrais
> processus UTC et Paris, plus un fuseau fractionnaire. Elle exerce le pool applicatif sur
> PostgreSQL de test, les valeurs été/hiver, SELECT, les trois RETURNING mutants et le vrai
> mapper achats. Les schémas ISO vérifient la forme ; l’égalité à l’instant attendu est
> assertée séparément. Référence native : [Bun SQL](https://bun.sh/docs/runtime/sql).
>
> Les mappers avec `devAssertSchema` (purchases, tasks, blog) valident aussi en dev/test.
> Les endpoints sans mapper de forme (users, ingredients) normalisent sans
> `devAssertSchema` : pas de schéma Zod `UserPublic`, et `ingredientResponseSchema`
> a des nullabilités qui ne correspondent pas exactement au schéma DB.
> D’autres services renvoient la valeur Drizzle sans `normalizeInstant`, par exemple les
> posts sociaux et les comparaisons : leur forme ISO tient au patch seul.

### 2.4 Frontend

Helpers `frontend/src/lib/dates.ts` :

| Helper | Usage |
|--------|-------|
| `formatInstant(iso, style)` | affichage locale FR forcée : styles `'short' \| 'medium' \| 'long' \| 'monthYear'`. **À n'utiliser que quand l'interpolation impose une string** (template literal, attribut HTML). Sinon préférer `<Time>` (cf. « Composant `<Time>` »). |
| `formatRelative(iso)` | "il y a 3 jours" / "demain" / "dans 2 heures" via `Intl.RelativeTimeFormat('fr-FR', { numeric: 'auto' })` natif (zéro dépendance : date-fns retiré du frontend). `numeric: 'auto'` donne "hier"/"la semaine dernière" quand c'est plus naturel. Idem, préférer `<Time relative>` côté JSX. |
| `compareInstant(a, b)` | tri chronologique (string compare) |
| `toDateInputValue(iso)` | extraction `YYYY-MM-DD` pour `<input type="date">` |
| `fromDateInputValue(yyyymmdd)` | conversion vers ISO datetime UTC avant POST |
| `todayDateInputValue()` | `YYYY-MM-DD` aujourd'hui |
| `nowInstant()` | ISO datetime UTC maintenant. À utiliser pour tout write côté composant (`finishedAt: nowInstant()`) plutôt que `new Date().toISOString()`. |
| `parseDatetimeLocalAsUTC(value)` | reinterprète une valeur `<input type="datetime-local">` (tz-naive) en UTC sans appliquer la tz du navigateur : évite le bug où le ban d'un admin en Asie expirait 9 h plus tard que prévu. |

Tri descendant (le plus récent d'abord) :
```typescript
items.sort((a, b) => compareInstant(b.createdAt, a.createdAt))
```

### 2.4.1 Composant `<Time>` : affichage canonique

**Toute date qui apparaît dans le DOM** passe par `frontend/src/component/DataDisplay/Time/Time.tsx`. Le composant émet un `<time dateTime={iso}>` (a11y / SEO gratuits) et délègue à `formatInstant`/`formatRelative`.

```tsx
import { Time } from '@/component/DataDisplay/Time/Time'

// Absolu : date complète localisée FR
<Time iso={user.createdAt} style="medium" />
// → <time dateTime="2026-05-22T...Z">22 mai 2026</time>

// Relatif + tooltip absolu
<Time iso={ban.createdAt} relative />
// → <time dateTime="..." title="22 mai 2026">il y a 3 heures</time>

// className optionnel
<Time iso={article.publishedAt} style="medium" className="blog-card__date" />
```

Styles : `'short' | 'medium' | 'long' | 'monthYear'` (défaut `'medium'`). En mode `relative`, le `style` contrôle le tooltip absolu (défaut `'long'`).

**Interdits côté composant** (catchés par lefthook) :
- `import ... from 'date-fns'` hors helpers (frontend n'en dépend plus ; backend = `demo-seed.ts` uniquement : `utils/dates.ts` n'importe pas date-fns)
- `new Intl.DateTimeFormat(...)` / `new Intl.RelativeTimeFormat(...)` hors `frontend/src/lib/dates.ts`
- `value.toLocaleDateString(...)`, `value.toLocaleString(...)` partout
- `<time dateTime={...}>...</time>` à la main : passer par `<Time>`
- `new Date().toISOString()` hors helpers/schema/seed : utiliser `nowISO()` (backend) ou `nowInstant()` (frontend)

Exceptions tolérées :
- `formatInstant` / `formatRelative` appelés en string (template literal, attribut `title` quand `<Time>` ne convient pas).
- `new Date().toISOString()` dans les fixtures `vi.mock` factories (pas d'imports possibles, contrainte du runtime).

### 2.5 Validation runtime (paranoia mode)

`backend/src/utils/dev-validate.ts` expose `devAssertSchema(schema, value, ctx)` :

- en `NODE_ENV=production` : no-op, retourne la valeur telle quelle
- en dev/test : `safeParse` et throw si la forme dérive (avec log structuré)

Branché sur les boundary mappers calendar dates (`toApiPurchase`,
`toApiTask`), points où la conversion entre `date` et instant est la plus
sujette aux erreurs.

```typescript
function toApiPurchase(row: PurchaseRow): Purchase {
  const mapped: Purchase = { /* … */ }
  return devAssertSchema(purchaseSchema, mapped, 'toApiPurchase')
}
```

---

## 3. Antipatterns à éviter

| Antipattern | Remplacer par |
|---|---|
| `z.date()`, `z.coerce.date()` | `z.iso.datetime()` |
| `value.toISOString()` côté front sur une valeur d'API | `value` (déjà ISO) |
| `new Date(value).toLocaleDateString()` | `<Time iso={value} style="short" />` |
| `value.toLocaleDateString('fr-FR', { ... })` | `<Time iso={value} style="<style>" />` |
| `new Intl.DateTimeFormat('fr-FR', ...).format(new Date(iso))` | `<Time iso={iso} style="..." />` |
| `<time dateTime={iso}>{formatInstant(iso, style)}</time>` à la main | `<Time iso={iso} style="<style>" />` |
| `value.split('T')[0]` | `toDateInputValue(value)` |
| `new Date(a).getTime() - new Date(b).getTime()` (tri) | `compareInstant(a, b)` |
| `instanceof Date` sur une row typée Drizzle | rien : c'est une string. Seul `db.execute` rend la row Bun brute, avec des `Date` |
| `value < new Date(...).toISOString()` (compare driver vs JS) | `Date.parse(value) < cutoffMs` |
| `.set({ updatedAt: new Date() })` Drizzle | `.set({ updatedAt: nowISO() })` |
| `new Date().toISOString()` dans un service backend | `nowISO()`, ou un `now()` SQL pour estampiller une colonne (cf. « Backend services ») ; (exempt : `$onUpdate` en schema, seed, scripts `audit/`) |
| `new Date().toISOString()` dans un composant frontend | `nowInstant()` |
| `new Date(datetimeLocalInput).toISOString()` (leak tz local) | `parseDatetimeLocalAsUTC(input)` |

---

## 4. Tests

Fixtures envoient des strings ISO :

```typescript
// correct
createdAt: new Date().toISOString()
purchasedAt: '2026-03-22T00:00:00.000Z'

// incorrect
createdAt: new Date()
purchasedAt: '2026-03-22'  // (sauf à passer par instantToCalendar avant Drizzle)
```

Assertions :

```typescript
// correct
expect(typeof row.createdAt).toBe('string')
expect(row.purchasedAt).toBe('2026-03-22T00:00:00.000Z')
expect(Date.parse(row.expiresAt)).toBeGreaterThan(before)

// incorrect
expect(row.createdAt).toBeInstanceOf(Date)
expect(row.createdAt.getTime()).toBeGreaterThan(...)
```

---

## 5. Références

- DB schemas : `backend/src/db/schema/**/*.ts`
- Helpers backend : `backend/src/utils/dates.ts`
- Helpers frontend : `frontend/src/lib/dates.ts`
- Composant affichage : `frontend/src/component/DataDisplay/Time/Time.tsx`
- Mappers boundary calendar dates : `backend/src/features/user-products/purchase.service.ts` (`toApiPurchase`), `backend/src/features/tasks/service.ts` (`toApiTask`)
- Schémas Zod : `shared/src/{purchases,tasks,profile,blog,ingredients,auth}/...`
