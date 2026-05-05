# Auth Frontend — Flow complet

## Architecture générale

L'authentification repose sur un couple **access token / refresh token** :

- **Access token (JWT)** — stocké en mémoire (Zustand), durée de vie 15 minutes. Envoyé dans le header `Authorization: Bearer <token>` à chaque requête protégée.
- **Refresh token (JWT)** — stocké dans un cookie `httpOnly`, durée de vie 7 jours, avec rotation à chaque usage. Jamais accessible par JavaScript.

Le frontend ne voit jamais le refresh token. Il se contente d'appeler `POST /auth/refresh` et le cookie part automatiquement.

---

## Fichiers et responsabilités

### `store/auth.ts` — État global (Zustand)

Stocke le token et l'utilisateur en mémoire. Fournit une heuristique d'expiration côté client.

| Champ / Méthode | Rôle |
|---|---|
| `accessToken` | Le JWT en cours, ou `null` si déconnecté |
| `tokenExpiresAt` | Timestamp d'expiration décodé du JWT (en ms) |
| `user` | `{ id, email }` de l'utilisateur connecté |
| `setAuth(token, user)` | Met à jour le token + user + décode `exp` du JWT |
| `clearAuth()` | Remet tout à `null` (déconnexion) |
| `isTokenExpired()` | Retourne `true` si le token expire dans moins de 30 secondes |

`isTokenExpired()` est une **heuristique de performance**, pas une décision de sécurité. Le serveur valide toujours le JWT indépendamment. Cette méthode sert uniquement dans les `beforeLoad` des routes pour éviter un appel réseau inutile (`GET /session` → 401 → refresh) quand on sait déjà que le token est expiré.

Dans les composants React, on utilise `!!state.accessToken` pour la réactivité (Zustand re-render quand l'état change), pas `isTokenExpired()` qui dépend de `Date.now()` et n'est pas réactif.

---

### `lib/silentRefresh.ts` — Refresh centralisé et dédupliqué

Fonction unique appelée par toutes les routes. Ne throw jamais, retourne `true` ou `false`.

```
silentRefresh(queryClient) → Promise<boolean>
```

**Responsabilités :**

1. Appelle `POST /auth/refresh` (le cookie httpOnly part automatiquement)
2. En cas de succès : met à jour Zustand (`setAuth`) et le cache React Query (`setQueryData(['session'])`)
3. En cas d'échec : retourne `false`, ne touche à rien

**Déduplication :** une variable module `inflightRefresh` garantit qu'un seul refresh part à la fois. Si `root` et `_authenticated` appellent `silentRefresh` quasi simultanément, une seule requête `POST /refresh` est envoyée. Le deuxième appelant attend la même Promise.

```
T0 : root appelle silentRefresh() → crée la Promise, l'assigne à inflightRefresh
T1 : _authenticated appelle silentRefresh() → inflightRefresh existe → retourne la même Promise
T2 : la Promise se résout → finally { inflightRefresh = null }
```

JavaScript est single-threaded : entre T0 et T2, aucun code ne peut mettre `inflightRefresh` à `null`. La variable module est partagée par tous les imports du même fichier (ESM évalue un module une seule fois).

---

### `lib/queries/auth.ts` — Queries et mutations React Query

#### Queries

**`authQueries.session()`**

- Endpoint : `GET /auth/session` (protégé par `requireJwtAuth`)
- Retourne `{ authenticated: true, userId: string }`
- `staleTime: 5 minutes` — tant que le cache a moins de 5 min, `ensureQueryData` ne refait pas d'appel réseau
- `retry: false` — un 401 signifie token expiré, pas besoin de réessayer

**`authQueries.me()`**

- Endpoint : `GET /profile`
- Retourne le profil complet de l'utilisateur
- Utilisé dans les pages qui ont besoin de plus que `id` et `email`

#### Mutations

**`useLogin()`**

- Appelle `POST /auth/login` avec `{ email, password }`
- En `onSuccess` : fait `setAuth(token, user)` + `setQueryData(['session'], ...)` — pas d'`invalidateQueries`, donc zéro appel réseau supplémentaire après le login

**`useSignup()`**

- Identique à `useLogin()` mais appelle `POST /auth/signup`

**`useLogout()`**

- Appelle `POST /auth/logout`
- En `onSuccess` : fait `clearAuth()` + `removeQueries(['session'])` + `removeQueries(['auth'])` — nettoie tout l'état

---

### `routes/__root.tsx` — Refresh silencieux au chargement

S'exécute sur **toutes les pages** (publiques et privées). Son unique rôle : tenter un refresh pour que le header sache afficher "Connexion" ou "Déconnexion".

```
beforeLoad:
  SI pas d'accessToken dans Zustand
    → silentRefresh(queryClient)
    → succès ou échec, on continue (page publique = pas de redirect)
```

Sans ce refresh dans root, un utilisateur avec un cookie valide verrait "Connexion" dans le header sur les pages publiques au lieu de "Déconnexion".

---

### `routes/_authenticated.tsx` — Protection des routes privées

S'exécute uniquement sur les routes sous `/_authenticated` (ex: `/profile`, `/habits`). Bloque l'accès et redirige vers `/login` si l'auth échoue.

```
beforeLoad:
  CAS 1 : pas de token OU token expiré (isTokenExpired)
    → silentRefresh(queryClient)
    → échec → redirect vers /login
    → succès → return (silentRefresh a déjà rempli le cache)

  CAS 2 : token présent et non expiré
    → ensureQueryData(authQueries.session())
    → succès → pass (cache ou appel serveur selon staleTime)
    → échec → silentRefresh(queryClient)
      → échec → clearAuth + removeQueries + redirect vers /login
      → succès → return
```

---

## Flows complets

### Premier chargement sur `/profile` (pas de token)

| Étape | Route | Action | Appels réseau |
|---|---|---|---|
| 1 | `__root` | `silentRefresh()` → `POST /refresh` → OK | 1 |
| 2 | `_authenticated` | token existe, `ensureQueryData` → cache frais | 0 |
| **Total** | | | **1 appel** |

### Navigation vers `/settings` après 6 min (token valide, staleTime dépassé)

| Étape | Route | Action | Appels réseau |
|---|---|---|---|
| 1 | `__root` | token existe → skip | 0 |
| 2 | `_authenticated` | `isTokenExpired()` = false → `ensureQueryData` → stale → `GET /session` → OK | 1 |
| **Total** | | | **1 appel** |

### Navigation après 16 min (token expiré)

| Étape | Route | Action | Appels réseau |
|---|---|---|---|
| 1 | `__root` | token existe → skip | 0 |
| 2 | `_authenticated` | `isTokenExpired()` = true → `silentRefresh()` → `POST /refresh` → OK | 1 |
| **Total** | | | **1 appel** |

Sans `isTokenExpired()`, ce scénario ferait : `GET /session` → 401 → `POST /refresh` → `setQueryData` = 2 appels.

### Chargement de `/` (page publique, cookie valide)

| Étape | Route | Action | Appels réseau |
|---|---|---|---|
| 1 | `__root` | pas de token → `silentRefresh()` → `POST /refresh` → OK | 1 |
| **Total** | | | **1 appel** |

### Chargement de `/` (page publique, pas de cookie)

| Étape | Route | Action | Appels réseau |
|---|---|---|---|
| 1 | `__root` | pas de token → `silentRefresh()` → `POST /refresh` → échec | 1 |
| **Total** | | | **1 appel (échoué, pas grave)** |

---

## Header — Affichage conditionnel

```tsx
const isAuthenticated = useAuthStore((state) => !!state.accessToken)
```

On utilise `!!state.accessToken` et non `isTokenExpired()` car :

- `accessToken` est un **état Zustand** → le composant re-render quand il change
- `isTokenExpired()` dépend de `Date.now()` → pas réactif, Zustand ne sait pas quand re-render
- Le header n'a pas besoin de savoir en temps réel que le token expire — c'est le `beforeLoad` de `_authenticated` qui gère le refresh à la prochaine navigation

---

## Sécurité — Répartition client / serveur

| Responsabilité | Côté |
|---|---|
| Validation du JWT (signature + expiration) | **Serveur** (`requireJwtAuth` middleware) |
| Stockage du refresh token | **Serveur** (cookie httpOnly, jamais en JS) |
| Rotation du refresh token | **Serveur** (révocation de l'ancien + création du nouveau à chaque refresh) |
| Détection de token replay | **Serveur** (révocation de tous les tokens du user si un token déjà révoqué est réutilisé) |
| Heuristique d'expiration (`isTokenExpired`) | **Client** (optimisation de routing, pas de sécurité) |
| Stockage de l'access token | **Client** (Zustand, en mémoire uniquement — perdu au refresh de page) |

Le client ne prend aucune décision de sécurité. Toute vérification côté client est une optimisation pour réduire les appels réseau. Le serveur reste l'autorité finale.
