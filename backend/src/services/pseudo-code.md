recalculateSignalForUser(userId, userProductId):

┌─────────────────────────────────────────────────────┐
│ ÉTAPE 1 — Trouver le produit concerné │
└─────────────────────────────────────────────────────┘

Chercher dans user_products :
WHERE id = userProductId AND userId = userId

→ Récupérer productId
→ Si introuvable : stop, on ne peut rien faire

┌─────────────────────────────────────────────────────┐
│ ÉTAPE 2 — Quels ingrédients scorer ? │
└─────────────────────────────────────────────────────┘

Chercher dans product_ingredients :
WHERE productId = productId

LEFT JOIN ingredient_dermo_profiles :
pour récupérer is_filler de chaque ingrédient

→ Garder uniquement ceux où is_filler ≠ true
(null = pas encore de profil = traité comme non-filler)

→ Si liste vide : stop

┌─────────────────────────────────────────────────────┐
│ ÉTAPE 3 — Charger toute la collection de l'user │
└─────────────────────────────────────────────────────┘

Chercher dans user_products :
WHERE userId = userId

Pour chaque produit, ramener : - status (avoided, holy_grail, in_stock...) - review.tolerance (1-5, peut être null si pas de review) - liste des ingredient_id du produit

→ On a maintenant un tableau de tous les produits
de l'user avec tout ce qu'il faut pour calculer

┌─────────────────────────────────────────────────────┐
│ ÉTAPE 4 — Partitionner en mauvais / bons │
└─────────────────────────────────────────────────────┘

Pour chaque produit de la collection :

    mauvais si :
      status = 'avoided'
      OU tolerance ≤ 2

    bon si :
      status = 'holy_grail'
      OU tolerance ≥ 4

⚠️ Un produit peut être dans les deux groupes
ex: status = 'avoided' ET tolerance = 5
(l'user a bien toléré mais évite pour une autre raison)

→ totalMauvais = nb de produits mauvais
→ totalBons = nb de produits bons

Construire pour chaque groupe un Set d'ingredient_id :
mauvaisIngredientSets = [ Set{ing1, ing2...}, Set{...}, ... ]
bonsIngredientSets = [ Set{ing1, ing2...}, Set{...}, ... ]

(un Set par produit — pour compter combien de produits
contiennent un ingrédient donné)

┌─────────────────────────────────────────────────────┐
│ ÉTAPE 5 — Calculer le signal pour chaque ingrédient │
└─────────────────────────────────────────────────────┘

Pour chaque ingredientId de la liste (étape 2) :

    countInMauvais = nb de Sets mauvais qui contiennent cet ingredientId
    countInBons    = nb de Sets bons qui contiennent cet ingredientId

    — Garde-fous —
    si countInMauvais < 2 → mauvaisRatio = 0  (pas assez de données)
    sinon                 → mauvaisRatio = countInMauvais / totalMauvais

    si countInBons < 2    → bonsRatio = 0     (pas assez de données)
    sinon                 → bonsRatio = countInBons / totalBons

    si totalMauvais = 0   → mauvaisRatio = 0  (division par zéro)
    si totalBons = 0      → bonsRatio = 0     (division par zéro)

    — Signal brut —
    signal = mauvaisRatio - bonsRatio

    — Séparation suspicion / favori —
    suspicionScore = max(0, signal)   → positif = sur-représenté dans les mauvais
    favoriteScore  = max(0, -signal)  → positif = sur-représenté dans les bons

    — Flags booléens —
    isSuspect  = countInMauvais ≥ 2 ET suspicionScore > 0
    isFavorite = countInBons    ≥ 2 ET favoriteScore  > 0

┌─────────────────────────────────────────────────────┐
│ ÉTAPE 6 — Sauvegarder │
└─────────────────────────────────────────────────────┘

Pour chaque ingrédient scoré :

    UPSERT dans user_ingredient_analysis_score :
      si la ligne (userId, ingredientId) existe → UPDATE
      si elle n'existe pas → INSERT

    Champs sauvegardés :
      userId, ingredientId,
      suspicionScore, favoriteScore,
      isSuspect, isFavorite,
      updatedAt = maintenant
