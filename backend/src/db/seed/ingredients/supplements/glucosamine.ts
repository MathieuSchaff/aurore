import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const GLUCOSAMINE: IngredientInput[] = [
  {
    name: 'Glucosamine',
    slug: INGREDIENT_SLUGS.GLUCOSAMINE,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.AUTRE,
    description:
      "Aminosaccharide naturellement présent dans le cartilage, étudié pour le soutien articulaire et associé dans des études observationnelles à une réduction de la mortalité cardiovasculaire.",
    content: `
# Glucosamine

## Identité

La glucosamine est un aminosaccharide (acide aminé-sucre) naturellement présent dans le cartilage, les tendons, la peau et les vaisseaux. L'organisme la synthétise à partir du glucose et de la glutamine, mais cette production décline avec l'âge.

Les compléments sont généralement sous forme de **glucosamine sulfate** (la plus étudiée) ou **glucosamine HCl** (plus stable, moins de preuves). Sources : crustacés ou fermentation végétale (alternative vegan).

## Fonctions principales

### Soutien articulaire

Stimule la production de protéoglycanes et de collagène dans le cartilage, améliorant la lubrification articulaire et réduisant la raideur.

### Anti-inflammatoire

Inhibe NF-κB et réduit les cytokines pro-inflammatoires (IL-1β, TNF-α), contribuant à la réduction de l'inflammation chronique de bas grade.

### Métabolisme cellulaire

Active l'AMPK et réduit la glycolyse, produisant un effet « mimétique du jeûne » : augmentation de l'autophagie, amélioration du métabolisme lipidique, activation des voies SIRT1/6 et augmentation du NAD⁺.

## Efficacité clinique

### Articulations (niveau de preuve : modéré)

Méta-analyses Cochrane : la glucosamine sulfate à 1500 mg/jour améliore légèrement la mobilité et réduit la douleur dans l'arthrose du genou. Effet lent (8-12 semaines avant résultats) mais réel et sans danger.

### Longévité et mortalité (niveau de preuve : observationnel)

**Études animales :** Weimer et al. (Nature Communications, 2014) — la glucosamine augmente la durée de vie des souris d'environ 10% via stimulation AMPK et réduction de la glycolyse.

**Études humaines observationnelles :** cohorte EPIC-Norfolk (466 000 adultes, suivi 10 ans) — la prise de glucosamine est associée à une réduction de 15% de la mortalité cardiovasculaire et de 9% de la mortalité globale. Association cohérente biologiquement, mais pas de preuve de causalité.

### Mécanismes anti-âge proposés

La glucosamine converge avec d'autres interventions de longévité (Ca-AKG, SIRT6) sur un axe commun : réduction de l'inflammation, métabolisme « sobre » (AMPK, NAD⁺) et stabilité cellulaire.

## Posologie

| Forme | Dose efficace | Note |
|-------|---------------|------|
| Glucosamine sulfate | 1500 mg/jour | Forme la plus étudiée, meilleure biodisponibilité |
| Glucosamine HCl | 1500-2000 mg/jour | Plus stable, moins de preuves cliniques |
| Végétale (fermentation) | 1500 mg équivalent | Alternative vegan |

Prendre avec un repas. Effet perceptible après 8-12 semaines de prise régulière.

**Synergies étudiées :** chondroïtine (1200 mg), collagène, vitamine C (soutien matriciel complet).

## Sécurité

Profil de sécurité favorable. Effets secondaires légers et rares : ballonnements, gêne digestive.

**Précautions :**
- **Allergie aux crustacés :** certaines formes sont d'origine marine — choisir une version vegan si allergie
- **Diabète :** peut légèrement modifier la glycémie chez de rares personnes — surveiller
- **Anticoagulants (warfarine) :** interaction possible (augmentation de l'INR) — éviter sans avis médical
- **Infection aiguë / phase inflammatoire :** certains auteurs recommandent de suspendre temporairement (comme pour les oméga-3 et le curcuma)

## Limites

- Effet articulaire modeste (pas de régénération du cartilage, soulagement symptomatique)
- Preuves de longévité uniquement observationnelles chez l'humain (pas d'essai randomisé)
- Hétérogénéité des formulations entre études (sulfate vs HCl, dosages, pureté)
- Mécanisme AMPK/longévité surtout caractérisé chez la souris
`,
  },
]
