import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const SPIRULINE: IngredientInput[] = [
  {
    name: 'Spiruline',
    slug: INGREDIENT_SLUGS.SPIRULINE,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.AUTRE,
    description:
      "Cyanobacterie riche en proteines, fer et phycocyanine. Source nutritionnelle dense mais controversee en raison des risques de contamination et de sa pseudo-vitamine B12 inactive.",
    content: `
# Spiruline

## Identite

La spiruline (Arthrospira platensis) est une cyanobacterie (souvent appelee improprement "algue bleue-verte") cultivee comme complement alimentaire. Elle est l'un des organismes les plus anciens sur Terre (~3,5 milliards d'annees).

**Composition typique (pour 10 g) :** 55-70% de proteines completes, fer (3-8 mg), beta-carotene, phycocyanine (pigment antioxydant specifique), vitamines B1, B2, B3, K, magnesium.

## Benefices documentes

### Profil nutritionnel dense

Source concentree de proteines vegetales completes (tous les acides amines essentiels). Riche en fer biodisponible (utile pour les carences martiales). Phycocyanine : antioxydant et anti-inflammatoire specifique.

### Effets metaboliques (niveau de preuve : modere)

Quelques etudes montrent une amelioration modeste du profil lipidique (reduction du LDL, augmentation du HDL) et une reduction de la glycemie a jeun. Effets sur la pression arterielle documentes mais modestes.

### Immunomodulation (niveau de preuve : preliminaire)

Stimulation de l'activite des cellules NK et des macrophages dans les etudes precliniques. Donnees humaines limitees.

## Risques et controverses

### Contamination (risque reel)

La spiruline cultivee en bassins ouverts peut etre contaminee par d'autres cyanobacteries toxiques. Contaminants possibles :

- **BMAA (beta-N-methylamino-L-alanine) :** neurotoxine detectee dans 4/5 poudres testees, liee a des maladies neurodegeneratives (SLA, Alzheimer) dans les etudes epidemiologiques. L'exposition chronique pourrait causer des depots amyloides.
- **Microcystines :** hepatotoxines pouvant causer des dommages hepatiques, nausees, vomissements.
- **Metaux lourds :** possibles selon la source de culture.

L'ANSES recommande de choisir des produits certifies avec controle de qualite rigoureux.

### Pseudo-vitamine B12 (piege bien documente)

La spiruline contient ~83% de pseudovitamine B12 (analogue inactif de la cobamide) et seulement ~17% de cobalamine active. Cette forme inactive n'est pas absorbee par l'intestin humain et n'a aucune activite physiologique.

**Piege diagnostique :** les tests sanguins mesurant les cobalamines totales detectent l'analogue inactif comme de la "B12", donnant l'illusion d'un statut normal. Chez les vegetaliens s'appuyant sur la spiruline, cela peut masquer une carence reelle. Utiliser les marqueurs specifiques (acide methylmalonique, homocysteine) pour evaluer le statut reel.

**La spiruline n'est pas une source fiable de B12.** Les vegetaliens doivent supplementer en B12 independamment.

## Posologie

### Doses courantes

- **Dose standard :** 3-10 g/jour
- **Debut :** commencer par 1-2 g pour evaluer la tolerance
- Disponible en poudre, comprimes ou flocons

### Qualite

Privilegier les produits certifies (bio, controles de contamination, bassin ferme). Verifier l'absence de microcystines et de metaux lourds sur les certificats d'analyse.

## Securite

### Effets secondaires

- Troubles digestifs (nausees, ballonnements) surtout en debut d'utilisation
- Cephalees (rares)
- Reactions allergiques (rares)

### Contre-indications

- Phenylcetonurie (riche en phenylalanine)
- Maladies auto-immunes (stimulation immunitaire)
- Hyperuricemie/goutte (riche en acides nucleiques)
- Grossesse/allaitement (donnees insuffisantes sur la purete des produits)

## Limites de la recherche

- Qualite et purete des produits tres variables — les resultats d'etudes dependent de la source
- Risque de contamination neurotoxique (BMAA) insuffisamment etudie a long terme
- Effet reel sur la sante : la plupart des benefices sont modestes et mieux couverts par une alimentation variee
- Les allegations "superaliment" sont souvent exagerees par rapport aux preuves disponibles
`,
  },
]
