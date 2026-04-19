import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const CDP_CHOLINE: IngredientInput[] = [
  {
    name: 'CDP-Choline (Citicoline)',
    slug: INGREDIENT_SLUGS.CDP_CHOLINE,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.NEUROACTIF,
    description:
      "Intermédiaire naturel de la biosynthèse de la phosphatidylcholine, fournissant choline et uridine au cerveau pour soutenir les membranes neuronales et la neurotransmission.",
    content: `
# CDP-Choline (Citicoline)

## Identité

La CDP-choline (cytidine-5'-diphosphocholine), ou citicoline, est un composé naturellement présent dans l'organisme. C'est un intermédiaire essentiel dans la biosynthèse de la phosphatidylcholine, phospholipide majeur des membranes cellulaires neuronales.

**Statut réglementaire :** complément alimentaire aux États-Unis, médicament en Europe et au Japon.

## Métabolisme

Après ingestion orale, la citicoline est hydrolysée en deux molécules :

1. **Choline** — précurseur d'acétylcholine et de phosphatidylcholine
2. **Cytidine** — convertie en uridine chez l'humain

Les deux traversent séparément la barrière hémato-encéphalique, puis sont recombinées en CDP-choline dans le cerveau. C'est cette double contribution (choline + uridine) qui distingue la citicoline des autres formes de choline.

**Biodisponibilité orale :** >90%. Pic plasmatique ~1h après ingestion. Hydrosoluble, absorption quasi-complète au niveau intestinal.

## Mécanismes d'action

### Synthèse des membranes neuronales

Précurseur direct de la phosphatidylcholine, elle accélère la biosynthèse des phospholipides structurels et stimule la réparation des membranes cellulaires endommagées.

### Neurotransmission

- Augmente les niveaux de dopamine et noradrénaline dans le SNC
- Source de choline pour la synthèse d'acétylcholine (mémoire, concentration)
- Augmentation de la sérotonine

### Énergie cérébrale

- Restaure l'activité de l'ATPase mitochondriale
- Augmente la production d'ATP d'environ 14%

### Neuroprotection

- Inhibe la phospholipase A2 (réduit l'inflammation neuronale)
- Diminue le stress oxydatif et l'apoptose neuronale
- Protège contre l'excitotoxicité glutamatergique

### Effets structurels

- Stimule la neurogenèse (hippocampe, zone sous-ventriculaire)
- Favorise la synaptogenèse et la plasticité synaptique
- Augmente la complexité dendritique et la densité des épines dendritiques
- Stimule l'angiogenèse cérébrale

## Efficacité clinique

### Résultats positifs

**Déclin cognitif lié à l'âge :**
- RCT (n=100, 50-85 ans) : 500 mg/jour pendant 12 semaines → amélioration significative de la mémoire épisodique et globale
- Méta-analyse 2023 (7 études) : effets positifs sur les fonctions cognitives
- Revue Cochrane : effet positif à court-moyen terme sur mémoire et comportement (différence moyenne standardisée : 0,19)

**AVC ischémique :** amélioration fonctionnelle (index de Barthel, échelle de Rankin), réduction du déficit neurologique.

**Traumatisme crânien :** amélioration des déficits de mémoire, effet neuroprotecteur (réduction des volumes lésionnels).

**Attention chez les jeunes adultes :** amélioration de l'attention et de la vitesse psychomotrice.

### Résultats négatifs ou mixtes

- Pas d'effet démontré sur la maladie d'Alzheimer ou la démence vasculaire avancée
- Essai ICTUS (AVC aigu à grande échelle) : résultats décevants

**Conclusion :** plus efficace pour le déclin cognitif lié à l'âge et les troubles cognitifs légers que pour les démences établies. Les résultats dépendent de la population, la dose, la durée et la pathologie.

## Posologie

| Contexte | Dose |
|----------|------|
| Complément standard | 250-500 mg/jour |
| Dose optimale identifiée | 500 mg/jour (en 1 ou 2 prises) |
| Doses thérapeutiques (médical) | 1000-2000 mg/jour |

**Dose minimale efficace :** 250 mg/jour.

Une étude dose-réponse a identifié 500 mg comme dose optimale — plus efficace que 1000 ou 2000 mg pour certains paramètres.

**Timing :** matin ou début d'après-midi (peut causer de l'agitation si pris le soir chez certaines personnes). Peut être pris avec ou sans nourriture. Durée minimale : 12 semaines.

## Comparaison avec d'autres formes de choline

| Forme | Avantage principal | Limite principale |
|-------|-------------------|-------------------|
| **CDP-choline** | Fournit choline + uridine, biodisponibilité >90% | Plus coûteuse |
| **Alpha-GPC** | Haute biodisponibilité, traverse bien la BHE | Ne fournit pas d'uridine |
| **Choline bitartrate** | Économique | Faible biodisponibilité, produit du TMA |
| **Phosphatidylcholine** | Composant membranaire direct | Ne fournit pas d'uridine, biodisponibilité variable |

La CDP-choline est la seule forme fournissant les deux précurseurs (choline + uridine) nécessaires à la resynthèse de phosphatidylcholine cérébrale.

## Sécurité

**Profil excellent.** Très faible toxicité, bien tolérée dans les essais cliniques. Aucun événement indésirable grave rapporté.

**Effets secondaires (rares et légers) :** troubles gastro-intestinaux, maux de tête transitoires, agitation/nervosité, rarement hypotension ou troubles du rythme cardiaque.

**Précautions :**
- Grossesse et allaitement (données insuffisantes)
- Dépression sévère (déconseillé)
- Maladie de Parkinson (interaction possible avec lévodopa — augmentation des effets dopaminergiques)

**Interactions :** interaction possible avec la lévodopa. Pas d'interaction majeure documentée avec d'autres médicaments.

## Synergies potentielles

- **Oméga-3 (EPA/DHA) :** complémentarité sur la santé membranaire neuronale
- **Vitamines B :** soutien du métabolisme de la choline
- **Magnésium :** fonction neuronale
- **Exercice physique :** potentialise la neuroplasticité

## Limites de la recherche

- Résultats inconsistants entre études, fortement dépendants de la population cible
- Inefficace sur les démences avancées
- Manque d'études à grande échelle et à long terme
- La plupart des études positives portent sur des populations âgées avec déclin cognitif existant — peu de données sur la prévention chez les sujets sains jeunes
`,
  },
]
