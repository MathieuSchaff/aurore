import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const CHOLINE: IngredientInput[] = [
  {
    name: 'Choline',
    slug: INGREDIENT_SLUGS.CHOLINE,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.NEUROACTIF,
    description:
      "Nutriment essentiel impliqué dans la synthèse des membranes cellulaires, de l'acétylcholine et du métabolisme des groupes méthyle.",
    content: `
# Choline

## Identité

La choline [(CH₃)₃NCH₂CH₂OH]⁺ est un nutriment essentiel. Le foie en synthétise de petites quantités, mais la production endogène est insuffisante pour couvrir les besoins — un apport alimentaire est indispensable.

## Fonctions principales

### Composant structurel des membranes

Les phosphatidylcholines représentent 40-50% des phospholipides membranaires. Elles sont présentes dans toutes les membranes cellulaires et sont essentielles à la formation des radeaux lipidiques et à la synthèse du surfactant pulmonaire.

### Synthèse de l'acétylcholine

Précurseur de l'acétylcholine, neurotransmetteur impliqué dans la contraction musculaire, la mémoire et le développement neuronal.

### Source de bétaïne (triméthylglycine)

La choline est oxydée en bétaïne, qui sert de donneur de groupes méthyle pour la synthèse de S-adénosylméthionine (SAM). La SAM participe à la méthylation de l'ADN, à la régulation de l'expression génique et au recyclage de l'homocystéine.

### Synthèse des VLDL

70-95% des phospholipides des lipoprotéines VLDL sont des phosphatidylcholines. Un déficit en choline perturbe le transport hépatique des lipides.

## Apports recommandés

| Population | Apport adéquat |
|-----------|---------------|
| Hommes adultes | 550 mg/jour |
| Femmes adultes | 425 mg/jour |
| Femmes enceintes | 450 mg/jour |
| Femmes allaitantes | 550 mg/jour |

## Sources alimentaires

| Aliment | Choline (mg/100 g) |
|---------|---------------------|
| Foie de bœuf | 418 |
| Jaune d'œuf | 251 |
| Viandes et volailles | 65-290 |
| Brocoli | 40 |
| Choux de Bruxelles | 41 |

**Exemple de couverture quotidienne :** 2 œufs (~260 mg) + 1 portion de viande (~85 mg) + lécithine de tournesol 4 g (~100 mg) = ~445 mg.

## Formes de supplémentation

| Forme | % de choline | Caractéristiques |
|-------|-------------|------------------|
| Choline chloride | 74,6% | Usage labo/animal, très concentrée |
| Choline bitartrate | 41,1% | Forme la plus courante, économique |
| Alpha-GPC | 40,5% | Haute biodisponibilité, traverse bien la BHE |
| CDP-choline (citicoline) | 21,3% | Fournit aussi de l'uridine (voir fiche dédiée) |
| Phosphatidylcholine | 13,7% | Composant membranaire direct |
| Lécithine de soja | 2-3% | Faible concentration, nécessite de gros volumes |

### Choix de forme selon l'objectif

- **Cognition / nootropique :** Alpha-GPC ou CDP-choline (meilleure pénétration cérébrale)
- **Apport nutritionnel de base :** choline bitartrate (rapport qualité/prix)
- **Santé hépatique :** phosphatidylcholine

### Note sur le TMA

La choline bitartrate et la choline libre sont métabolisées par le microbiote intestinal en triméthylamine (TMA), puis en TMAO hépatique. Des niveaux élevés de TMAO sont associés dans des études observationnelles à un risque cardiovasculaire accru. L'Alpha-GPC et la CDP-choline produisent significativement moins de TMA.

## Lien avec la bétaïne (TMG)

La choline est convertie en bétaïne par oxydation. Une supplémentation en choline importante (ex : CDP-choline 500 mg/jour) consomme des groupes méthyle. La co-supplémentation en bétaïne (500-1000 mg) peut compenser cette demande et soutenir le cycle de méthylation (recyclage de l'homocystéine, synthèse de SAM).

**Signes possibles de déficit en méthylation :** fatigue cognitive en fin de journée, irritabilité, homocystéine >9 µmol/L.

## Sécurité

- **Limite supérieure tolérable :** 3500 mg/jour (Institute of Medicine)
- **Effets secondaires à forte dose :** odeur corporelle de poisson (TMA), transpiration, troubles gastro-intestinaux, hypotension
- **Déficience :** associée à une stéatose hépatique, des dommages musculaires et des troubles neurologiques
- La majorité de la population ne couvre pas les apports recommandés par l'alimentation seule

## Limites

- Beaucoup d'adultes sont en déficit subclinique sans le savoir
- Le métabolisme de la choline est influencé par des polymorphismes génétiques (PEMT, MTHFR) qui modifient les besoins individuels
- La production de TMAO par certaines formes reste un sujet de débat scientifique
- L'interaction entre statut en choline, folates et vitamine B12 complexifie les recommandations individuelles
`,
  },
]
