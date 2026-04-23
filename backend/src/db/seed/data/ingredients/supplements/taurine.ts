import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const TAURINE: IngredientInput[] = [
  {
    name: 'Taurine',
    slug: INGREDIENT_SLUGS.TAURINE,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.ACIDE_AMINE,
    description:
      "Acide amine soufre semi-essentiel, abondant dans le cerveau, le coeur et les muscles. Implique dans l'osmoregulation, la neuroprotection, la fonction cardiovasculaire et la performance physique.",
    content: `
# Taurine

## Identite et biochimie

La taurine (acide 2-aminoethanesulfonique) est un acide amine soufre semi-essentiel. Contrairement aux autres acides amines, elle n'entre pas dans la synthese des proteines — elle agit comme molecule libre avec de multiples fonctions regulatrices.

**Synthese endogene :** produite dans le foie et le pancreas a partir de la cysteine et de la methionine. Cofacteurs necessaires : vitamine B6 (essentiel), fer, cuivre. Un deficit en B6 peut entrainer une depletion en taurine.

**Distribution :** cerveau (particulierement le tronc cerebral), coeur, retine, muscles squelettiques, foie, reins, plaquettes sanguines.

**Apport alimentaire :** 40-400 mg/jour dans un regime occidental. Sources principales : fruits de mer (coquilles Saint-Jacques ~827 mg/100g, moules ~655 mg), volaille (dinde viande foncee ~306 mg), viandes rouges (~40-50 mg/100g). Quasi absente des vegetaux (sauf algues nori ~227-1300 mg/100g).

## Mecanismes d'action

### Osmoregulation

Agent osmolyte majeur : maintient le volume cellulaire et l'equilibre electrolytique par efflux dependant ou independant du volume.

### Homeostasie du calcium

Modulation des concentrations de Ca2+ intracellulaire. Inhibition de l'influx calcique via les canaux voltage-dependants (types L, N, P/Q). Prevention de la surcharge calcique induite par le glutamate.

### Proprietes antioxydantes et anti-inflammatoires

Neutralisation de l'acide hypochloreux (HOCl). Formation de taurine chloramine (elle-meme anti-inflammatoire). Reduction du stress oxydatif mitochondrial et de la peroxydation lipidique.

### Neuroprotection

Action comme neuromodulateur inhibiteur (similaire au GABA). Protection contre l'excitotoxicite du glutamate. Reduction de l'apoptose neuronale.

### Fonction mitochondriale

Protection contre le dysfonctionnement du complexe I. Amelioration de l'efficacite du cycle ATP dans les cellules musculaires. Reduction de la production de ROS mitochondriaux.

## Benefices documentes

### Longevite (niveau de preuve : animal solide, humain preliminaire)

Etude Science 2023 : +10-12% de duree de vie chez les souris, +10-23% chez les vers. Chez les souris agees supplementees : reduction du poids lie a l'age, augmentation de la masse osseuse, amelioration de l'endurance musculaire, reduction des comportements depressifs et anxieux. Les concentrations de taurine diminuent significativement avec l'age chez les mammiferes.

### Sante cardiovasculaire (niveau de preuve : modere)

Meta-analyse 2024 : reduction significative de la pression arterielle systolique et diastolique (1-6 g/jour). Reduction des triglycerides et du cholesterol total. Amelioration de la fonction ventriculaire gauche dans l'insuffisance cardiaque (classes II-IV NYHA).

### Sante metabolique (niveau de preuve : modere)

Reduction de la glycemie a jeun et de l'HbA1c (-0,33% chez les personnes obeses). Reduction de l'insuline a jeun (-2,15 uU/mL) et du HOMA-IR. Amelioration de la sensibilite a l'insuline.

### Performance physique (niveau de preuve : modere)

Amelioration de la puissance de pointe (+13%), de la puissance moyenne (+4%) et de la puissance minimale (+8%). Augmentation du temps jusqu'a l'epuisement. Reduction des dommages musculaires et du stress oxydatif induit par l'exercice. Augmentation de l'oxydation des graisses pendant l'effort (dose-dependant).

### Neuroprotection (niveau de preuve : observationnel)

Etudes observationnelles : taux eleves de taurine associes a -26% de risque de demence/Alzheimer. Protection contre l'excitotoxicite et l'ischemie cerebrale dans les modeles animaux.

## Posologie

### Doses etudiees

- **Sante cardiovasculaire :** 1,5 g/jour (500 mg x 3)
- **Performance sportive :** 50 mg/kg de poids corporel, 1-3h avant l'exercice (~3,5 g pour 70 kg)
- **Sante metabolique :** 3 g/jour
- **Equivalent humain de l'etude longevite :** 3-6 g/jour

### Limites de securite

- EFSA (2012) : jusqu'a 6 g/jour considere comme sur
- Limite superieure toleree : 3 g/jour (basee sur les essais cliniques)
- Plus longue etude a 3 g/jour : seulement 4 mois — donnees long terme limitees

### Forme et timing

Poudre ou gelules (500-1000 mg). Pic plasmatique : 1,5-2 heures apres ingestion. Pour le sport : 1-3 heures avant l'exercice.

## Securite

### Effets secondaires

- **Troubles GI (hautes doses) :** nausees, diarrhee, douleurs abdominales — surtout a jeun
- **Hypotension :** possible baisse de tension chez les personnes deja hypotendues
- **Cephalees, etourdissements :** rares, a doses elevees

### Contre-indications

- Hypotension
- Insuffisance renale (elimination renale)
- Epilepsie (resultats contradictoires, prudence)
- Grossesse/allaitement (donnees insuffisantes)
- Medicaments metabolises par le cytochrome P450 (inhibition enzymatique)
- Anticoagulants, antihypertenseurs (effets additifs)

## Populations specifiques

### Vegetariens et veganes

Risque de deficit (quasi aucune source vegetale sauf algues). Supplementation a considerer, surtout en cas de besoins eleves (stress, exercice intense).

### Personnes agees

Declin naturel lie a l'age. Resultats prometteurs sur les parametres de vieillissement dans les modeles animaux.

## Synergies

- Cafeine (amelioration de la puissance et du temps de reaction)
- Creatine (mecanismes complementaires pour la performance)
- Magnesium taurate (combinaison courante)

## Limites de la recherche

- Donnees humaines a long terme limitees (>1 an)
- Dose optimale non etablie pour la plupart des indications
- Effet reel sur la longevite humaine inconnu
- Qualite moyenne de nombreuses etudes existantes
- Securite a long terme a hautes doses encore incertaine
`,
  },
]
