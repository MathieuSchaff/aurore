import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const PHOSPHATIDYLINOSITOL: IngredientInput[] = [
  {
    name: 'Phosphatidylinositol (PI)',
    slug: INGREDIENT_SLUGS.PHOSPHATIDYLINOSITOL,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.ACIDE_GRAS,
    description:
      "Phospholipide minoritaire mais crucial pour la signalisation cellulaire. Ses derives phosphoryles (PIP2, PIP3) controlent la proliferation, le trafic membranaire et la reponse a l'insuline.",
    content: `
# Phosphatidylinositol (PI)

## Identite et biochimie

Le phosphatidylinositol (PI) est un phospholipide anionique representant 10-15% des phospholipides membranaires totaux. Malgre cette proportion minoritaire, il joue un role disproportionne dans la signalisation cellulaire grace a ses derives phosphoryles, les phosphoinositides.

**Structure :** squelette glycerol, deux chaines d'acides gras, et un groupe tete myo-inositol (cyclohexane hydroxyle). L'inositol peut etre phosphoryle sur 3 positions (3, 4, 5), generant 7 phosphoinositides distincts.

**Localisation :** present dans toutes les membranes cellulaires, mais concentre dans le feuillet interne de la membrane plasmique et les membranes du reticulum endoplasmique.

## Phosphoinositides : la cascade de signalisation

### PI(4,5)P2 (PIP2) — le pivot

PIP2 est le phosphoinositide le plus abondant dans la membrane plasmique. Il est le substrat de la phospholipase C (PLC) et de la PI3-kinase (PI3K), deux voies de signalisation majeures.

### Voie PLC (signalisation calcique)

PIP2 → PLC → IP3 + DAG
- **IP3 :** libere le calcium du reticulum endoplasmique (contraction musculaire, secretion, neurotransmission)
- **DAG :** active la proteine kinase C (PKC) (croissance, differenciation, reponse immunitaire)

### Voie PI3K (survie et metabolisme)

PIP2 → PI3K → PIP3 → activation d'Akt/PKB
- Signalisation de l'insuline et captation du glucose
- Survie cellulaire (inhibition de l'apoptose)
- Croissance et proliferation cellulaire
- Migration cellulaire

La dérégulation de cette voie (mutations PI3K, perte de PTEN) est impliquee dans de nombreux cancers.

### Trafic membranaire

Differents phosphoinositides marquent les compartiments intracellulaires (endosomes, lysosomes, Golgi) et dirigent le trafic vesiculaire. PI(3)P marque les endosomes precoces, PI(3,5)P2 les endosomes tardifs/lysosomes.

## Sources alimentaires

Le PI est present en quantites modestes dans l'alimentation, principalement dans les aliments riches en lecithine :

| Source | PI (% des phospholipides totaux) |
|---|---|
| Lecithine de soja/tournesol | 10-15% |
| Foie de boeuf, foie de porc | source importante |
| Graines oleagineuses (tournesol, colza) | sources moderees |

Les donnees quantitatives precises par aliment sont rares car le PI est generalement mesure comme fraction de la lecithine totale.

## Supplementation

### Statut

Le PI n'est pas supplemente de maniere isolee. Il est present comme composant mineur des supplements de lecithine. Le myo-inositol (la partie sucre du PI) est en revanche couramment supplemente, notamment pour le SOPK, la fertilite et la sante metabolique.

### Myo-inositol vs. phosphatidylinositol

Le myo-inositol libre supplementaire est converti en PI dans les cellules, mais c'est un processus lent et tissu-dependant. Les effets du myo-inositol (amelioration de la sensibilite a l'insuline, regulation ovarienne) passent en partie par la voie des phosphoinositides.

## Roles cliniques des derives du PI

### Signalisation de l'insuline

La voie PI3K/Akt est essentielle a la reponse insulinique. Un deficit de signalisation PI3K contribue a la resistance a l'insuline dans le diabete de type 2.

### Neurotransmission

La voie PLC/IP3 est centrale dans la liberation de neurotransmetteurs et la plasticite synaptique. Des anomalies du metabolisme des phosphoinositides sont associees a des troubles neurologiques (Alzheimer, troubles bipolaires).

### Immunite

Les phosphoinositides regulen la migration des cellules immunitaires, la phagocytose et l'activation des lymphocytes.

## Securite

Composant alimentaire naturel sans toxicite connue aux doses alimentaires. Le myo-inositol supplementaire est bien tolere jusqu'a 12-18 g/jour (etudes SOPK).

## Synergies

- Myo-inositol (precurseur de la partie inositol du PI)
- Phosphatidylcholine et phosphatidylserine (equilibre phospholipidique membranaire)
- Omega-3 (enrichissement des chaines acyl)

## Limites de la recherche

- Pas de supplementation isolee en PI etudiee cliniquement
- Benefices passes principalement par le myo-inositol libre (mieux etudie)
- Role des phosphoinositides dans les maladies chroniques surtout etudie en contexte pharmacologique (inhibiteurs de PI3K en oncologie), pas en supplementation nutritionnelle
`,
  },
]
