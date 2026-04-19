import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { SUPPLEMENTS_ACIDES_AMINES } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

// Supplement-specific slug ('glycine-supplement') — skincare already owns
// 'glycine' as the humectant amino-acid entry.
export const GLYCINE: IngredientInput[] = [
  {
    name: 'Glycine',
    slug: SUPPLEMENTS_ACIDES_AMINES.GLYCINE,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.ACIDE_AMINE,
    description:
      "Acide aminé conditionnellement essentiel (synthèse endogène insuffisante), composant majeur du collagène et co-agoniste des récepteurs NMDA, avec des effets documentés sur le sommeil, le collagène et le métabolisme.",
    content: `
# Glycine

## Identité

La glycine est le plus petit acide aminé, traditionnellement classé « non essentiel » car l'organisme la synthétise. Cependant, la synthèse endogène (~3 g/jour) ne couvre pas les besoins métaboliques (~15 g/jour), ce qui en fait un acide aminé **conditionnellement essentiel**.

**Déficit structurel :** un adulte de 70 kg présente un déficit quotidien d'environ 10 g de glycine. Les besoins se répartissent entre collagène (~12 g), glutathion (~1,5 g) et autres fonctions (~1,5 g). L'alimentation moderne n'apporte que 2-3 g/jour.

**Goût :** naturellement sucré (60-70% du pouvoir sucrant du sucre), ce qui facilite l'intégration en poudre dans les boissons.

## Rôles physiologiques

### Collagène

La glycine représente 33% des acides aminés du collagène. Le collagène constitue un tiers des protéines corporelles, avec un renouvellement quotidien de ~96,5 g. In vitro, augmenter la concentration de glycine de 1,0 à 7,0 mM stimule la synthèse de collagène de type II de 60-75% dans les chondrocytes articulaires.

### Sommeil

La glycine améliore le sommeil via plusieurs mécanismes documentés :

- **Thermorégulation :** dilate les vaisseaux périphériques, augmente le flux sanguin cutané et abaisse la température corporelle centrale (signal physiologique d'endormissement)
- **Récepteurs NMDA :** agit via les récepteurs NMDA du noyau suprachiasmatique (SCN), modulant l'horloge circadienne
- **Co-agoniste NMDA obligatoire :** sans glycine, les récepteurs NMDA ne s'activent pas même en présence de glutamate — rôle clé dans la plasticité synaptique

Traverse passivement la barrière hémato-encéphalique.

### Glutathion

La glycine représente 38% du flux nécessaire à la synthèse de glutathion, principal antioxydant intracellulaire. La disponibilité en glycine peut être le facteur limitant de cette synthèse.

### Métabolisme

- Améliore la sensibilité à l'insuline
- Réduit les marqueurs inflammatoires (IL-6, TNF-α, IL-1β)
- Équilibre le ratio méthionine/glycine (pertinent pour la longévité)
- Pourrait mimer partiellement les effets de la restriction en méthionine via la glycine-N-méthyltransférase (GNMT)

## Efficacité clinique

### Sommeil (études humaines)

**Yamadera et al. 2007 :** 3 g avant le coucher — amélioration subjective et objective (polysomnographie), réduction de la latence d'endormissement, accès plus rapide au sommeil profond.

**Bannai et al. 2012 :** 3 g sur 3 nuits avec restriction de sommeil — réduction significative de la fatigue diurne et amélioration de la vigilance psychomotrice.

**Kawai et al. 2015 :** confirmation du mécanisme via récepteurs NMDA du SCN, augmentation dose-dépendante du flux sanguin cutané.

### Longévité (études animales)

**Miller et al. 2019 (ITP/NIA) :** glycine à 8% de la diète → augmentation de 4-6% de la longévité médiane chez les souris mâles et femelles, résultat reproductible sur 3 sites indépendants. Réduction de la mortalité par adénocarcinome pulmonaire.

**Kumar et al. 2022 (GlyNAC) :** combinaison glycine + N-acétylcystéine → augmentation significative de la durée de vie chez la souris, correction du déficit en glutathion et amélioration de la fonction mitochondriale.

### Collagène

**de Paz-Lugo et al. 2018 :** augmentation de 60-75% de la synthèse de collagène de type II in vitro. Effet supérieur et plus persistant que la proline ou la lysine seules.

## Posologie

**Dose cible :** 10 g/jour (comble le déficit métabolique).

| Moment | Dose | Objectif |
|--------|------|----------|
| Matin | 3-4 g | Soutien métabolique, collagène, glutathion |
| Milieu de journée | 3-4 g | Maintien des niveaux |
| Soir (30-60 min avant coucher) | 3 g | Amélioration du sommeil |

Prise en poudre dans du café, thé, yaourt, smoothie ou tisane. Pas besoin de capsules.

**Synergie sommeil :** glycine 3 g + magnésium bisglycinate (250 mg Mg élémentaire, apportant ~1,5 g de glycine supplémentaire) + mélatonine faible dose (300 µg).

## Sécurité

**Profil excellent.** Statut GRAS (FDA).

**Doses testées chez l'humain :**
- 3 g/jour : aucun effet secondaire (études sommeil)
- 15-60 g/jour : bien toléré (études schizophrénie)
- Jusqu'à 90 g/jour : testé sans effets graves

**Effets secondaires rares (à >9-15 g/jour) :** inconfort digestif léger, selles molles, légère sédation possible. Commencer par 3-5 g/jour et augmenter progressivement.

**Contre-indication :** clozapine (Clozaril) — la glycine peut réduire son efficacité. Prudence avec les médicaments affectant les récepteurs NMDA.

**Réponse paradoxale rare :** certaines personnes peuvent ressentir anxiété ou agitation (variations génétiques des sous-unités NMDA). Réduire ou arrêter si symptômes.

## Chronologie des effets

| Période | Effets attendus |
|---------|-----------------|
| Jours/semaines | Endormissement plus rapide, sommeil plus profond, meilleure énergie au réveil |
| 1-3 mois | Amélioration de la peau, meilleure gestion glycémique, réduction de l'anxiété |
| 6+ mois | Diminution des rides fines, protection antioxydante (glutathion), santé cardiovasculaire |

## Sources alimentaires

| Aliment | Glycine (g/100 g) |
|---------|-------------------|
| Gélatine | ~25 |
| Porc | ~3,5 |
| Poulet | ~1,8 |
| Bouillon d'os | Variable, riche |
| Peau de poisson/poulet | Riche (collagène) |

Même avec une alimentation équilibrée, l'apport dépasse rarement 2-3 g/jour — bien en deçà des 15 g optimaux.

## Limites

- Effets sur la longévité uniquement démontrés chez la souris (pas d'essai randomisé humain)
- Études sommeil sur de petits échantillons et de courte durée
- Le « déficit métabolique de 10 g » est un calcul théorique — la dose optimale individualisée n'est pas établie
- Effets sur le collagène in vivo chez l'humain insuffisamment documentés (surtout données in vitro)
- Interaction potentielle avec les médicaments modulant les récepteurs NMDA
`,
  },
]
