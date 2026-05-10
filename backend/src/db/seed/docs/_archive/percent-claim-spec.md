# Intégration des pourcentages d'actifs dans l'auto-tagging

## Objectif
Exploiter les pourcentages d'actifs structurés (`product_ingredients`) pour corriger des faux négatifs quand l'INCI est fragile, sans perdre la précision acquise sur le gold set.

## Décision produit
- Source autorisée: données structurées internes uniquement.
- Stratégie: fallback strict.
- Priorité de vérité: INCI fiable > claim `%`.

## Ce que cela débloque
1. Réduction ciblée des faux négatifs du gold set quand l'INCI est alphabétique, tronqué, ou précédé de prose marketing.
2. Amélioration de recall sur des tags concentration-dépendants (`retinoids`, `vitamin-c`, `aha`, `bha`, `tyrosinase-inhibitors`).
3. Aucune extension aux tags sensoriels (hors mécanisme concentration-effet).

## Design algorithmique
### 1) Détection de fragilité INCI
Un INCI est "fragile" si:
- vide/non exploitable,
- ordre alphabétique détecté,
- préambule marketing ("Ingredients/Ingrédients:"),
- marqueur explicite de troncature (`...`, `…`, `truncated`, `inci tronqu`).

Si l'INCI n'est pas fragile, la voie `%` est ignorée.

### 2) Mapping strict `% -> tags`
Règles v1:
- `retinol`, `retinal`, `retinaldehyde` -> `retinoids`.
- `salicylic-acid`, `betaine-salicylate` -> `bha`.
- `glycolic-acid`, `lactic-acid`, `mandelic-acid` -> `aha`.
- `azelaic-acid`, `tranexamic-acid` -> `tyrosinase-inhibitors`.
- `ascorbic-acid`, `ethyl-ascorbic-acid`, `sodium-ascorbyl-phosphate` -> `vitamin-c`.

Garde-fous:
- unité obligatoire `%`,
- valeur numérique > 0,
- bornes plausibles par famille d'actifs (min/max),
- absence de parsing libre de texte marketing en v1.

### 3) Placement dans l'orchestrateur
Ajout d'un canal `percent-claim` en `secondary`:
- passe activée après `cross-signal`,
- même déduplication que les autres sources,
- compatible seed/backfill/audit.

## Validation
- Tests unitaires sur:
  - fragilité INCI,
  - mapping `%`,
  - refus hors unité `%`,
  - fallback strict (pas d'émission si INCI fiable).
- Test orchestrateur d'intégration: source `percent-claim` visible uniquement en contexte INCI fragile.

## Limites connues (v1)
- Pas de NLP sur nom/description.
- Pas d'override sur INCI fiable, même avec `%` élevé.
- Les produits sans `product_ingredients` structurés ne gagnent rien.

## Extension v2 possible
- Ajouter un score de confiance par claim (source éditoriale, date, niveau de vérification).
- Ajouter un rapport gold-set "delta FN corrigés par `%`" pour piloter les élargissements de mapping.
