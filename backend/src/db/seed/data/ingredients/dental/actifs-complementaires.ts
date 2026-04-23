import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const DENTAL_ACTIFS_COMPLEMENTAIRES: IngredientInput[] = [
  {
    name: 'Arginine',
    slug: INGREDIENT_SLUGS.ARGININE_DENTAL,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Acide aminé basique qui obstrue les tubules dentinaires par dépôt de phosphate de calcium, réduisant la sensibilité dentinaire par occlusion physique.',
    content: `
# Arginine

L'arginine est un acide aminé basique (pKa ~12,5) exploité en dentisterie pour son action anti-sensibilité via un mécanisme d'occlusion tubulaire — différent de celui du nitrate de potassium ou du fluorure stanneux.

## INCI
**ARGININE**

## Mécanisme d'action
- **Occlusion tubulaire** : à pH buccal légèrement basique, l'arginine se dépose sur les surfaces dentinaires chargées négativement. Elle attire les ions phosphate et calcium de la salive, formant un précipité de phosphate de calcium qui bouche physiquement les tubules dentinaires exposés.
- **Différence avec le nitrate de potassium** : le K⁺ bloque la transmission nerveuse (mécanisme neurologique) ; l'arginine crée une barrière mécanique (mécanisme physico-chimique). Les deux approches sont complémentaires.
- **Technologie Pro-Argin (Colgate/Elmex)** : l'arginine est associée au carbonate de calcium pour former un complexe plus stable sur la surface dentinaire.

## Efficacité clinique
Plusieurs études RCT (randomized controlled trials) démontrent une réduction significative de la sensibilité dès 2 semaines d'utilisation, avec effet cumulatif sur 8 semaines.

## Produits représentatifs
Elmex Sensitive Professional (Pro-Argin), CB12 Boost.
`,
  },
  {
    name: 'Calcium Sodium Phosphosilicate (Novamin)',
    slug: INGREDIENT_SLUGS.CALCIUM_SODIUM_PHOSPHOSILICATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      "Biocéramique synthétique qui libère des ions calcium, sodium et phosphate au contact de la salive pour former de l'hydroxyapatite directement sur l'émail.",
    content: `
# Calcium Sodium Phosphosilicate (Novamin)

Le Novamin est une biocéramique bioactive — initialement développée pour la reconstruction osseuse — reconvertie avec succès en actif dentaire. C'est la technologie différenciante de la gamme Sensodyne Répare et Protège.

## INCI
**CALCIUM SODIUM PHOSPHOSILICATE**

## Mécanisme d'action
- **Libération ionique contrôlée** : au contact de la salive (milieu aqueux légèrement acide), le Novamin libère Ca²⁺, Na⁺, PO₄³⁻ et Si⁴⁺.
- **Formation d'hydroxyapatite** : ces ions précipitent spontanément sous forme d'hydroxyapatite carbonatée (Ca₁₀(PO₄)₆(OH)₂), minéral constitutif de l'émail — reminéralisation directe sans intermédiaire.
- **Occlusion tubulaire** : le dépôt d'hydroxyapatite dans les tubules dentinaires exposés réduit la sensibilité par obstruction physique.
- **Tampon acide** : la libération de Na⁺ augmente le pH local, créant un environnement propice à la reminéralisation.

## Différence avec l'hydroxyapatite nano
L'hydroxyapatite pré-formée se dépose passivement ; le Novamin se forme *in situ* à partir d'une matrice soluble, avec une meilleure intégration à la surface de l'émail.

## Produits représentatifs
Sensodyne Répare et Protège (toute la gamme R&P).
`,
  },
  {
    name: 'Chlorure de Cétylpyridinium (CPC)',
    slug: INGREDIENT_SLUGS.CETYLPYRIDINIUM_CHLORIDE,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Tensioactif cationique quaternaire à large spectre antiseptique, utilisé en bain de bouche anti-gingivite comme alternative moins contraignante à la chlorhexidine.',
    content: `
# Chlorure de Cétylpyridinium (CPC)

Le CPC est un antiseptique buccal de référence, présent dans de nombreux bains de bouche anti-gingivite (Gum Paroex, certaines formules Meridol). Il offre un compromis efficacité/tolérance supérieur à la chlorhexidine pour un usage quotidien.

## INCI
**CETYLPYRIDINIUM CHLORIDE**

## Mécanisme d'action
- **Désorganisation membranaire** : le groupement cationique quaternaire du CPC s'adsorbe sur les membranes bactériennes chargées négativement, déstabilisant leur intégrité par modification de la perméabilité sélective.
- **Spectre** : actif sur les bactéries gram+, gram-, certains virus enveloppés et levures (*Candida albicans*).
- **Substantivité** : adhère aux surfaces buccales (muqueuses, émail), prolongeant l'effet antimicrobien 3–5 heures après le rinçage.

## Avantages vs chlorhexidine
- Pas de coloration des dents (inconvénient majeur de la CHX à long terme).
- Peut être utilisé quotidiennement sans restriction de durée.
- Goût plus acceptable.

## Limites
Moins puissant que la chlorhexidine (CHX 0,12–0,2 % reste le gold standard clinique). Concentration efficace : ≥ 0,05 %.

## Produits représentatifs
Gum Paroex Bain de Bouche, Meridol Bain de Bouche Protection Gencives.
`,
  },
  {
    name: 'Pyrophosphate de Tétrasodium (Tetrasodium Pyrophosphate)',
    slug: INGREDIENT_SLUGS.TETRASODIUM_PYROPHOSPHATE,
    type: INGREDIENT_TYPES.DENTAL,
    category: SKINCARE_INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Chélateur de calcium puissant qui empêche la minéralisation de la plaque en tartre en séquestrant les ions Ca²⁺ avant leur cristallisation.',
    content: `
# Pyrophosphate de Tétrasodium

Le pyrophosphate de tétrasodium (Na₄P₂O₇) est un agent anti-tartre chimiquement distinct du zinc : là où le zinc inhibe les enzymes bactériennes, le pyrophosphate agit directement par séquestration ionique.

## INCI
**TETRASODIUM PYROPHOSPHATE**

## Mécanisme d'action
- **Chélation calcique** : l'anion pyrophosphate (P₂O₇⁴⁻) forme des complexes solubles stables avec Ca²⁺ (log K ≈ 5,0), réduisant drastiquement la concentration en calcium libre disponible pour cristalliser.
- **Inhibition de la croissance cristalline** : même à faible concentration, le pyrophosphate s'adsorbe sur les sites de croissance des cristaux d'hydroxyapatite, bloquant leur expansion.
- **Sans effet abrasif** : contrairement à la silice, n'enlève pas le tartre déjà formé — action purement préventive.

## Synergie formulaire
Souvent associé aux fluorures dans les formules "protection complète" (Elmex Anti-Caries Expert). Le fluorure protège l'émail ; le pyrophosphate empêche le tartre de s'y former.

## Sécurité
pH basique en solution concentrée — les formules dentaires sont tamponnées. Bien toléré aux concentrations usuelles (0,5–2 %).

## Produits représentatifs
Elmex Anti-Caries Expert, Elmex Protection Email Professional.
`,
  },
]
