# Audit des Filtres - Features Ingrédients

Ce document audite l'implémentation et le fonctionnement des filtres dans le module des ingrédients.

## 1. Architecture Multi-Domaines (Taxonomie Partagée)

La taxonomie des ingrédients est structurée par domaine d'application dans `@habit-tracker/shared/src/ingredients/`. Chaque domaine possède sa propre logique de catégories, de tags et de méta-données de filtrage.

### Domaines disponibles
- **`skincare/`** : Peau (type de peau, problèmes, rôles actifs).
- **`haircare/`** : Cheveux (type de cheveux, cuir chevelu, effets).
- **`dental/`** : Dents (problèmes, public, effets dentaires).
- **`supplement/`** : Compléments alimentaires (objectifs, moment de prise, restrictions).

### Structure commune par domaine
Chaque sous-dossier de domaine (ex: `skincare/`, `dental/`) suit un pattern identique :
- **`categories.ts`** : Définit les types fonctionnels (ex: `ABRASIF`, `CONDITIONNEUR`).
- **`tag-taxonomy.ts`** : Définit les catégories de tags spécifiques au domaine.
- **`tag-filters.ts`** : Pilote l'UI (labels, tiers `essential`/`advanced`, ordre).

## 2. Implémentation Backend

Le backend (`backend/src/features/ingredients/`) expose les routes nécessaires au filtrage et à la recherche.

### Routes API (`routes.ts`)
- **`GET /filter-options`** : Appelle `getIngredientFilterOptions` pour renvoyer la liste des tags disponibles par catégorie.
- **`GET /`** : Appelle `listIngredients` avec les filtres passés en query params. Utilise actuellement la validation Zod de **Skincare** (`skincareIngredientsSearchSchema`).

### Logique de Service (`service.ts`)
- **`listIngredients`** : 
    - Reçoit les filtres (concerns, skin_types, etc.) sous forme de chaînes séparées par des virgules.
    - Construit dynamiquement des clauses `WHERE` en utilisant des sous-requêtes sur la table `tag_ingredients`.
    - **Note critique** : La logique actuelle est **hardcodée pour le domaine Skincare**. Elle mappe explicitement les colonnes de l'API vers les types de tags `concern`, `skin_type`, `ingredient_attribute`, `skin_effect`, et `shared_label`.
- **`getIngredientFilterOptions`** : Agrège les tags existants en base qui correspondent aux catégories définies dans le domaine Skincare.

### Schéma Base de Données (`db/schema/`)
- **Table `ingredients`** : Contient une colonne `type` (`skincare`, `haircare`, `dental`, `supplement`) et une colonne `category` (texte libre).
- **Table `ingredient_tags`** : Stocke les définitions de tags de manière générique avec une colonne `type` pour la catégorie (ex: `concern`).

## 3. Implémentation Frontend

Bien que le `shared` et la base de données supportent plusieurs domaines, le frontend est actuellement configuré pour le domaine **Skincare**.

- **`frontend/src/features/ingredients/filters.ts`** : Importe et exporte spécifiquement les clés et méta-données de `skincare`.
- **`IngredientsPage.tsx`** : Utilise `SKINCARE_INGREDIENT_TAG_CATEGORY_META` pour générer les groupes de filtres.

## 4. Flux de données et État

L'état des filtres est **entièrement synchronisé avec l'URL** via les "Search Params" de TanStack Router.

- **Lecture** : `routeApi.useSearch()` récupère les filtres appliqués depuis l'URL.
- **Hooks Clés** :
    - `useListFilters` : Orchestre la navigation et la mise à jour de l'URL.
    - `useTagFilterGroups` : Prépare les données pour le `FilterDrawer`.

## 6. Problèmes Identifiés et Améliorations

### 🔴 Limitation majeure : Hardcoding "Skincare"
Bien que l'architecture soit "pensée" pour être multi-domaines, l'implémentation actuelle est verrouillée sur la peau (skincare) à plusieurs niveaux :
- **Backend (`service.ts`)** : La fonction `listIngredients` construit ses clauses SQL en dur pour les catégories `concern`, `skin_type`, etc. Si on ajoute des ingrédients de type `dental`, leurs tags (ex: `age_group`) seront ignorés car non prévus dans la boucle de filtrage.
- **Backend (`routes.ts`)** : La route principale `/` utilise `skincareIngredientsSearchSchema`. Toute recherche avec des filtres spécifiques à un autre domaine (ex: `goal` pour les compléments) échouera à la validation Zod.
- **Frontend (`IngredientsPage.tsx`)** : Les composants de filtrage et les méta-données injectées sont importés directement de la taxonomie skincare.

### 🟡 Problèmes de Robustesse et UX
- **Collisions de filtres dans l'URL** : Si un utilisateur filtre par `skin_type=gras` puis change de catégorie d'ingrédient (via un futur sélecteur), le filtre `skin_type` restera probablement dans l'URL, ce qui n'a aucun sens pour des ingrédients dentaires ou capillaires.
- **Performance des sous-requêtes** : La méthode actuelle utilise une sous-requête `IN (...)` par groupe de filtres. Pour un grand nombre d'ingrédients, une jointure classique ou une table de recherche optimisée pourrait être nécessaire.
- **Mise à jour de la taxonomie** : Ajouter une nouvelle catégorie de tags nécessite des modifications manuelles dans :
    1. `@shared` (Taxonomie + Meta)
    2. `backend` (Service `listIngredients`)
    3. `frontend` (Fichier `filters.ts`)
    Il n'y a pas de "Single Source of Truth" totalement dynamique.

### 🟢 Améliorations suggérées
1. **Généralisation du Backend** : Modifier `listIngredients` pour qu'il itère sur les catégories de tags fournies par le schéma du domaine concerné, plutôt que d'avoir des variables `concerns`, `skinTypes` en dur.
2. **Dynamic Filter Schema** : Utiliser le paramètre `ingredient_type` dans l'URL pour déterminer quel schéma Zod de validation et quelles méta-données de filtres charger (côté backend et frontend).
3. **Nettoyage des filtres** : Implémenter une logique de "reset" automatique des filtres de catégories lors du changement de `ingredient_type` pour éviter les paramètres orphelins dans l'URL.

## 7. Résumé du cycle de vie d'un filtre
1. **Action Utilisateur** : Sélection d'un tag dans le `FilterDrawer`.
2. **Navigation** : `useNavigate` met à jour l'URL (ex: `?concern=anti-acne,anti-age`).
3. **Réaction React** : `IngredientsPage` re-render suite au changement d'URL.
4. **Appel API** : `useQuery` déclenche un `GET /` avec les nouveaux paramètres.
5. **Traitement Backend** : `listIngredients` décompose les paramètres et effectue une jointure SQL entre `ingredients` et `tag_ingredients` pour filtrer les résultats.
6. **Affichage** : La liste des cartes ingrédients est mise à jour.

