# Ajouter une route

Le chemin complet, dans l'ordre. Une ligne par geste, le fichier à ouvrir à droite. Rien d'autre.

Les règles de fond ne sont pas ici : chaque ligne renvoie au document qui les possède.

## 0. Décider où ça vit

| Question | Réponse |
|---|---|
| La donnée appartient au **catalogue** (produit, ingrédient, tag) ? | `backend/src/features/<domaine>/`. Lecture publique, écriture restreinte, deux modèles selon la table : soumission ouverte gardée par l'ownership RLS (`catalogSubmissionPolicies` : sa propre fiche tant qu'elle est `unverified`, pas de garde de rôle sur la route), ou écriture par rôle pour les liens et la taxonomie (`catalogPolicies`, plus `requireCatalogWrite` ou `requireAdmin`) |
| La donnée appartient à **un utilisateur** (collection, avis, note perso) ? | `backend/src/features/user-products/` ou une feature tenant proche, policy RLS par `auth.uid()` |
| Doute ? | Regarder qui porte la clé étrangère : c'est le propriétaire, pas le préfixe d'URL |

## 1. `shared/` : le contrat

1. Schéma Zod dans `shared/src/<domaine>/`. Un fichier `index.ts` sectionné tant que le domaine est petit, `schemas.ts` séparé au-delà. Voir `shared/README.md`.
2. Le barrel racine `shared/src/index.ts` ne change **que** si tu crées un nouveau dossier de domaine (il ne contient que des `export *`).
3. Code d'erreur : ajouter la valeur à l'union du domaine, et son statut au `xxxErrorMapping` juste à côté. Voir [`error-handling.md`](error-handling.md).
4. Texte libre utilisateur : passer par le refine `noHtml` (`shared/src/core/schemas.ts`), comme tous les champs texte de `shared/src/products/schemas.ts`.
5. Dates : string ISO 8601 UTC, `z.iso.datetime()`, jamais `z.date()`. Voir [`dates.md`](dates.md).
6. `null` contre `undefined` contre `""` : trois états distincts, ne jamais les confondre. `undefined` = jamais renseigné (`.optional()`), `null` = vidé ou inconnu explicite (`.nullable()`), `""` ne doit pas atteindre la base : `.min(1)` pour le rejeter, `z.preprocess((v) => (v === '' ? null : v), ...)` pour le normaliser. Un champ de formulaire HTML arrive toujours en `""`, jamais en `undefined`, et `transform()` tourne trop tard pour le rattraper puisqu'un schéma strict comme `z.url()` a déjà rejeté la chaîne vide. Modèle : `patentSchema` dans `shared/src/products/schemas.ts`.
7. Champ que l'écran doit **lire** : l'ajouter aussi au schéma de réponse du domaine (`shared/src/products/product-detail-page.ts`, `list-products-page.ts`). Ces schémas sont `.strict()` et le boot SSR les `parse()` au runtime : backend plus riche que le contrat, le parse jette, le client retombe sur le boot anonyme et le premier rendu personnalisé est perdu sans erreur à l'écran.

## 2. La base

1. Table dans `backend/src/db/schema/`, colonnes communes par les helpers existants (`_timestamps.ts`, `_moderation.ts`), pas à la main.
2. Policies par `tenantPolicies(...)` ou `fkTenantPolicies(...)` (`backend/src/db/schema/_policies.ts`), plus `.enableRLS()`. Jamais un `CREATE POLICY` écrit dans une migration : il sort du snapshot Drizzle et tous les rollouts suivants le ratent.
   Colonne ajoutée à une table catalogue (`products`, `ingredients`) : elle hérite de `catalogPolicies` ou `catalogSubmissionPolicies`, dont le SELECT est **public**. Jamais de donnée personnelle sur ces tables, elle va sur la table tenant du domaine.
3. Toutes les policies d'une table dans **une seule** migration, sinon fenêtre deny-all entre deux.
4. `just db-generate` puis `just db-migrate`. Jamais `db-push` : il perd `FORCE RLS` et les objets `auth.*`.
5. Après une écriture en dev : `just db-snapshot`.

Une table tenant porte **deux** policies permissives, OR'd : `<table>_tenant_isolation` (l'utilisateur ne voit que ses lignes) et `<table>_admin_bypass` (un process `app.role = admin` voit tout). Les helpers posent les deux ; une policy écrite à la main n'en pose qu'une, et les runners admin lisent vide sans erreur.

## 3. Le service

1. Un fichier par grappe de fonctions qui s'appellent entre elles, suffixé `*.service.ts`, réexporté par le barrel `service.ts` du domaine, seule porte d'entrée des autres features. Pas de dossier `services/`, pas de `utils.ts` : le suffixe dit la couche, et ranger par mécanisme éloigne `x.routes.ts` de `x.service.ts`, qui changent ensemble.
2. Le service reçoit sa connexion en paramètre, sans valeur par défaut : un appel qui l'oublie doit casser à la compilation.
3. Échec métier : `throw new XxxError(code)`. Branche attendue dont l'appelant a besoin comme valeur : `return err(code)`. Voir [`error-handling.md`](error-handling.md).
4. Contrainte DB : `translateUniqueViolation(e, () => new XxxError(code))`, qui relance tout le reste. Ne jamais avaler une erreur Postgres et continuer sur la même transaction.

## 4. La route

Ordre des gardes, tel qu'il est écrit dans `backend/src/features/products/routes.ts` :

```ts
requireJwtAuth,          // identité
withRlsContext,          // ouvre la transaction et pose app.user_id / app.role
requireNotBanned,        // ban global
requireNotBannedScope('<scope>'),  // si la surface a un scope de ban
securityScan(),          // texte libre entrant: injection HTML et URL
zValidator('json', xxxSchema),     // 400 invalid_input, ne passe pas par le handler global
```

- `withRlsContext` **après** `requireJwtAuth` et **avant** `requireNotBanned`. Un autre ordre casse le RLS en silence.
- Dans le handler : `getRlsDb(c)`, `getAuthedUserId(c)`, `getAuthedUserRole(c)`, tous dans `backend/src/utils/accessors.ts`. Jamais un `c.get('userId') as string`.
- `app.use('*', ...)` est permis **seulement si ton router est seul sur son préfixe**. Le co-montage ne se voit pas dans `backend/src/index.ts`, qui ne monte que le barrel de feature : ouvrir `backend/src/features/<domaine>/index.ts`. `/api/user-products` n'a qu'un router, donc `use('*')` y est sûr ; `products/index.ts` monte six routers sur `/products`, donc les gardes y vont par verbe, sinon elles fuient sur les routers frères.
- Réponse : `c.json(ok(data), HTTP_STATUS.X)`. Jamais un littéral.

## 5. Monter le router

Deux niveaux, tous les deux obligatoires, sinon la route est écrite mais injoignable :

1. le barrel de feature (`backend/src/features/<domaine>/index.ts`) ;
2. `backend/src/index.ts`, dans la liste des `.route(...)`.

## 6. Brancher le code d'erreur

Ajouter `xxxErrorMapping` au registre `thrownDomainErrorMappingRegistry`
(`backend/src/utils/errors/error-handler.ts`). Le test d'exhaustivité du handler vérifie que chaque
mapping exporté par `shared` est composé, ou explicitement classé comme sérialisé dans une route.

## 7. Les tests

1. Test de route : câblage, autorisation, sérialisation. La règle métier se teste au service.
2. `setupDbTests()` en tête de fichier si la DB est nécessaire, hors `describe`.
3. Isolation RLS : test dédié dans `backend/src/tests/integration/`, avec son propre pool.
4. `just test-backend "<pattern>"` (il monte la DB lui-même). Deux runs concurrents détruisent la DB de test.

Détail : [`backend-tests.md`](backend-tests.md). Les helpers partagés vivent dans `backend/src/tests/helpers/` : lire le dossier avant d'en écrire un, la surface partagée y tient entière.

## 8. Le front

1. **Avant de coder l'UI** : une spec Playwright happy-path avec l'API mockée. Skip si l'UI est triviale (moins de 10 lignes), si le changement est de la pure logique backend, ou s'il est purement visuel. Une spec qui **écrit** en base se nomme `*.mutation.spec.ts`.
2. Un fichier par domaine dans `frontend/src/lib/queries/`, seul canal Hono RPC, factory de clés hiérarchique.
3. Après une mutation : invalider **toutes** les surfaces touchées, pas seulement la sienne. Modèle : `frontend/src/lib/queries/user-products.ts`.
4. Composant utilisé par une seule feature : `features/<domaine>/components/`. Deux features ou plus : `component/<groupe>/`. Ne pas promouvoir par anticipation.
5. Textes FR : à côté de leur écran (modèle `ProductForm/formErrors.ts`), pas dans un fichier global, sauf label de domaine déjà partagé.
6. Champ **saisi** par un formulaire : le déclarer aussi dans le schéma de formulaire de l'écran et dans ses deux mappers wire (`ProductForm/ProductForm.schema.ts`). Une clé `optional()` absente d'un mapper ne casse pas la compilation : le champ s'affiche, se saisit, et n'est jamais transporté.
7. Erreur affichée : table de codes plus repli neutre, jamais de lecture de message. Voir [`error-handling.md`](error-handling.md) §Côté client.
8. CSS : tokens sémantiques seulement dans `component/**` et `features/**/components/**`.

## 9. Vérifier

`just lint-fix`, puis `just ts-verify`, puis `just test`.

Avant un push, ces trois-là ne suffisent pas : rejouer aussi les lints maison `bun backend/scripts/lint-*.ts` sur l'arbre entier (ils ne tournent qu'au `pre-commit` local, sur les fichiers staged, et jamais en CI), et `just e2e` si un écran bouge.

## Les six oublis que la compilation ne suffit pas à voir

Aucun de ces six ne casse la compilation. Le test d'exhaustivité du handler couvre le premier ; les
autres demandent leur gate ou leur preuve ciblée.

| Oubli | Ce qui arrive |
|---|---|
| `xxxErrorMapping` pas ajouté à `thrownDomainErrorMappingRegistry` | Le test du handler échoue ; sans ce gate, le code retombe en 500 |
| Garde en `use('*')` dans un router co-monté | La garde s'applique aux routers frères, ou l'inverse |
| `withRlsContext` placé avant `requireJwtAuth` | RLS anonyme, lectures vides et écritures refusées |
| Router non monté dans `backend/src/index.ts` | 404 sur une route pourtant écrite et testée en unitaire |
| `securityScan()` ou `noHtml` absents sur du texte libre | HTML et URL entrent en base |
| `FORCE RLS` non posé sur la table neuve | Le propriétaire de la table contourne toutes les policies |
