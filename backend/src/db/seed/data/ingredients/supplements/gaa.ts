import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const GAA: IngredientInput[] = [
  {
    name: 'GAA (Acide guanidinoacétique)',
    slug: INGREDIENT_SLUGS.GAA,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.ACIDE_AMINE,
    description:
      "Précurseur direct de la créatine, avec l'avantage de traverser la barrière hémato-encéphalique via plusieurs transporteurs, augmentant la créatine cérébrale plus efficacement que la créatine elle-même.",
    content: `
# GAA (Acide guanidinoacétique)

## Identité

L'acide guanidinoacétique (GAA, ou guanidinoacétate) est le précurseur immédiat de la créatine. Dans l'organisme, il est synthétisé à partir de l'arginine et de la glycine (enzyme AGAT), puis méthylé par la GAMT via la S-adénosylméthionine (SAM) pour former la créatine.

En supplémentation, le GAA est administré directement pour augmenter les réserves de créatine, avec un avantage particulier pour le cerveau.

## Avantage principal : accès cérébral

### Pourquoi le GAA plutôt que la créatine pour le cerveau

La créatine ne dispose que d'un seul transporteur (SLC6A8) pour entrer dans les cellules. Dans le cerveau, les astrocytes expriment très peu de SLC6A8, ce qui limite la pénétration de la créatine exogène.

Le GAA utilise **plusieurs transporteurs** :
- SLC6A8 (transporteur de créatine)
- Transporteur de taurine
- Transporteur de GABA

Cela lui permet de contourner les limitations du transport de créatine et d'augmenter plus efficacement la créatine intracérébrale après conversion locale en créatine.

Ce point est particulièrement pertinent pour le déficit en transporteur de créatine (SLC6A8), une maladie génétique rare où la créatine ne peut pas entrer dans les cellules — le GAA peut partiellement compenser via les transporteurs alternatifs.

## Mécanisme et demande en groupes méthyle

### Le cycle de méthylation

La conversion GAA → créatine consomme un groupe méthyle de la SAM, produisant de l'homocystéine. Avec 3 g de GAA/jour, la demande en groupes méthyle est importante.

**Sans compensation, cela entraîne :**
- Accumulation d'homocystéine (facteur de risque cardiovasculaire)
- Réduction de la SAM disponible pour d'autres fonctions (méthylation de l'ADN, synthèse de phosphatidylcholine, recyclage des neurotransmetteurs)
- Diminution de l'incorporation de méthyle dans la phosphatidylcholine (membranes cellulaires fragilisées)

### Co-supplémentation obligatoire

**Bétaïne (TMG) — indispensable :**
Recycle rapidement et directement l'homocystéine en méthionine, régénérant la SAM. Dose : 2-3 g/jour (proportionnelle au GAA). Chez le rat, la bétaïne supprime totalement l'hyperhomocystéinémie induite par le GAA.

**Choline — fortement recommandée :**
La choline est convertie en bétaïne dans le foie (renouvellement des stocks) ET assure ses propres fonctions irremplaçables :
- Synthèse de phosphatidylcholine (membranes cellulaires)
- Synthèse d'acétylcholine (mémoire, apprentissage)
- Signalisation cellulaire

Sans choline suffisante, la bétaïne seule épuise progressivement les stocks, entraînant déficit membranaire et neurologique.

**Les deux ensemble :** la bétaïne éteint l'homocystéine immédiatement, la choline reconstitue les réserves et maintient les fonctions membranaires et cholinergiques. Le système est alors durable.

**Vitamines B (B12, folates) :** voie complémentaire (plus lente) de recyclage de l'homocystéine. Recommandées en appoint.

## Posologie

### Protocole type

| Moment | GAA | Bétaïne | Choline |
|--------|-----|---------|---------|
| Matin (avec glucides) | 1,5 g | 1-1,5 g | 250-500 mg |
| Soir (avec repas) | 1,5 g | 1-1,5 g | 250-500 mg |

**Dose totale :** 3 g/jour de GAA, 2-3 g/jour de bétaïne, 500-1000 mg/jour de choline.

Prendre avec des glucides améliore l'absorption (l'insuline stimule le transporteur SLC6A8). L'exercice physique augmente également l'expression de SLC6A8.

## Optimisation du transport

Le transporteur SLC6A8 est sodium- et chlorure-dépendant (2 Na⁺ + 1 Cl⁻ par molécule transportée). Une alimentation normalement salée couvre ces besoins. Supplémentation en sel généralement inutile sauf régime très pauvre en sodium, exercice intense avec forte sudation, ou régime cétogène strict.

## Sécurité

- Profil de sécurité favorable aux doses étudiées (2-3 g/jour)
- **Risque principal : hyperhomocystéinémie** si prise sans bétaïne — d'où la co-supplémentation obligatoire
- La bétaïne + choline + vitamines B éliminent ce risque
- Les conséquences à long terme d'une demande accrue en groupes méthyle sur l'homéostasie des protéines et de la phosphatidylcholine nécessitent encore des recherches

## Limites de la recherche

- Moins d'études cliniques que la créatine monohydrate
- Données de sécurité à long terme (>6 mois) limitées
- Impact exact sur la créatine cérébrale chez l'humain en cours de caractérisation
- Conséquences à long terme de la compétition pour les groupes méthyle insuffisamment étudiées
- Nécessité d'une co-supplémentation complexe (bétaïne + choline) vs simplicité de la créatine seule
`,
  },
]
