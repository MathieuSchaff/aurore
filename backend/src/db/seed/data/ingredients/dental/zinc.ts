import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const DENTAL_ZINC: IngredientInput[] = [
  {
    name: 'Citrate de Zinc (Zinc Citrate)',
    slug: INGREDIENT_SLUGS.ZINC_CITRATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Forme organique du zinc très utilisée en dentifrice pour inhiber la formation du tartre et réduire la plaque bactérienne.',
    content: `
# Citrate de Zinc

Le citrate de zinc est le sel de zinc le plus courant dans les formules dentaires (Fluocaril, Parogencyl). Sa forme organique lui confère une bonne solubilité et une biodisponibilité buccale optimale.

## INCI
**ZINC CITRATE**

## Mécanisme d'action
- **Anti-tartre** : chélate les ions calcium libres dans la salive, empêchant leur précipitation sous forme de cristaux de tartre (hydroxyapatite secondaire).
- **Anti-plaque** : inhibe les métallo-enzymes bactériennes impliquées dans la formation du biofilm, notamment chez *Streptococcus mutans* et *Fusobacterium nucleatum*.
- **Anti-halitose légère** : les ions Zn²⁺ complexent les composés soufrés volatils (VSC) responsables de la mauvaise haleine.

## Profil de sécurité
Bien toléré sur les muqueuses buccales à doses usuelles (0,3–1 %). Aucune cytotoxicité aux concentrations formulation standard. Compatible avec les fluorures.

## Produits représentatifs
Fluocaril Bi-Fluoré, Parogencyl Gencives — souvent associé au monofluorophosphate de sodium.
`,
  },
  {
    name: 'Lactate de Zinc (Zinc Lactate)',
    slug: INGREDIENT_SLUGS.ZINC_LACTATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Forme organique du zinc à haute biodisponibilité buccale, anti-gingivite et anti-tartre, présente notamment chez Meridol.',
    content: `
# Lactate de Zinc

Le lactate de zinc est la forme organique de référence dans les formules anti-gingivite haut de gamme (Meridol). Sa solubilité élevée et sa bonne tolérance muqueuse en font un actif privilégié pour les soins gingival.

## INCI
**ZINC LACTATE**

## Mécanisme d'action
- **Anti-gingivite** : les ions Zn²⁺ inhibent la production de lipopolysaccharides (LPS) par les bactéries gram-négatives parodontales, réduisant la réponse inflammatoire gingivale.
- **Anti-tartre** : même mécanisme de chélation calcique que le citrate (voir Zinc Citrate).
- **Anti-halitose** : neutralisation des VSC (H₂S, CH₃SH) par formation de sulfures de zinc insolubles.

## Avantage sur le citrate
Légèrement mieux toléré en formule sans SLS grâce à son pH neutre, souvent utilisé dans les dentifrices pour gencives sensibles.

## Produits représentatifs
Meridol Dentifrice — combiné au fluorure stanneux pour une double action anti-gingivite/anti-caries.
`,
  },
  {
    name: 'Acétate de Zinc (Zinc Acetate)',
    slug: INGREDIENT_SLUGS.ZINC_ACETATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Actif anti-halitose à action rapide par neutralisation directe des composés soufrés volatils, signature de CB12.',
    content: `
# Acétate de Zinc

L'acétate de zinc est l'actif principal du bain de bouche CB12, reconnu cliniquement comme l'un des agents anti-halitose les plus efficaces disponibles sans prescription.

## INCI
**ZINC ACETATE**

## Mécanisme d'action
- **Anti-VSC** : les ions Zn²⁺ forment des complexes insolubles avec les composés soufrés volatils (VSC) — sulfure d'hydrogène (H₂S), méthylmercaptan (CH₃SH), sulfure de diméthyle ((CH₃)₂S) — neutralisant leur odeur à la source.
- **Synergie chlorhexidine** : dans CB12, l'acétate de zinc est associé à la chlorhexidine diacétate (0,025 %) pour une action simultanée sur les VSC *et* les bactéries productrices.
- Efficacité démontrée jusqu'à 12 heures dans les études cliniques sur l'halitose.

## Sécurité
Tolérance muqueuse excellente aux doses buccales (<0,5 %). L'ion acétate est métabolisé sans toxicité.

## Produits représentatifs
CB12 Bain de Bouche — formule brevetée zinc acetate + chlorhexidine.
`,
  },
  {
    name: 'Chlorure de Zinc (Zinc Chloride)',
    slug: INGREDIENT_SLUGS.ZINC_CHLORIDE,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Sel inorganique du zinc à action antiseptique et astringente, utilisé principalement dans les bains de bouche anti-gingivite.',
    content: `
# Chlorure de Zinc

Le chlorure de zinc est la forme inorganique la plus ancienne du zinc en usage buccal. Plus astringente que les formes organiques, elle est surtout utilisée dans les bains de bouche (Parodontax).

## INCI
**ZINC CHLORIDE**

## Mécanisme d'action
- **Antiseptique** : les ions Zn²⁺ dénaturent les protéines membranaires bactériennes à concentrations élevées, réduisant la charge microbienne supra-gingivale.
- **Astringent** : resserre les tissus gingivaux enflammés et réduit le saignement lors des gingivites légères.
- **Anti-tartre** : chélation calcique identique aux autres formes de zinc.

## Limites
Peut provoquer une légère sensation de brûlure aux concentrations élevées. Les formes organiques (citrate, lactate) sont généralement préférées dans les dentifrices pour leur meilleure tolérance.

## Produits représentatifs
Parodontax Bain de Bouche Protection Quotidienne.
`,
  },
  {
    name: 'Phosphate de Zinc (Zinc Phosphate)',
    slug: INGREDIENT_SLUGS.ZINC_PHOSPHATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Actif anti-tartre qui précipite directement dans la plaque dentaire pour bloquer sa minéralisation, en synergie avec les fluorures.',
    content: `
# Phosphate de Zinc

Le phosphate de zinc opère selon un mécanisme anti-tartre distinct des autres sels de zinc : il ne chélate pas le calcium en solution mais forme des précipités insolubles *dans* la plaque, bloquant sa calcification.

## INCI
**ZINC PHOSPHATE**

## Mécanisme d'action
- **Anti-tartre structurel** : Zn₃(PO₄)₂ se dépose préférentiellement dans la matrice organique de la plaque bactérienne, inhibant sa minéralisation en tartrate calcique.
- **Synergie fluorure** : dans les formules Elmex, associé au fluorure d'amine (Olaflur) et au fluorure de sodium pour une protection combinée anti-tartre / anti-caries.
- Pas de chélation calcique salivaire : n'interfère pas avec la reminéralisation naturelle de l'émail.

## Produits représentatifs
Elmex Sensitive Plus, Elmex Anti-Caries Expert — combinaison zinc phosphate + fluorure d'amine.
`,
  },
  {
    name: 'Sulfate de Zinc (Zinc Sulfate)',
    slug: INGREDIENT_SLUGS.ZINC_SULFATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Forme inorganique classique du zinc en bain de bouche, anti-tartre et légèrement anti-inflammatoire gingival.',
    content: `
# Sulfate de Zinc

Le sulfate de zinc est la forme inorganique utilisée historiquement dans les bains de bouche (Fluocaril). Sa solubilité élevée en fait un actif efficace en solution aqueuse, bien que moins doux que les formes organiques.

## INCI
**ZINC SULFATE**

## Mécanisme d'action
- **Anti-tartre** : chélation des ions Ca²⁺ salivaires, réduisant la précipitation du tartre supra-gingival.
- **Anti-inflammatoire gingival léger** : les ions Zn²⁺ modulent la production de cytokines pro-inflammatoires (IL-1β, TNF-α) par les fibroblastes gingivaux.
- **Astringent léger** : action sur les tissus gingivaux enflammés.

## Sécurité
À doses buccales standard, bien toléré. L'ion sulfate est inerte. Peut laisser un goût légèrement métallique à forte concentration.

## Produits représentatifs
Fluocaril Bain de Bouche Bi-Fluoré.
`,
  },
]
