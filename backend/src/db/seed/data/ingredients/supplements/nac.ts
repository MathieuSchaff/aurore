import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const NAC: IngredientInput[] = [
  {
    name: 'NAC (N-Acetylcysteine)',
    slug: INGREDIENT_SLUGS.NAC,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.ACIDE_AMINE,
    description:
      "Derive synthetique de la cysteine, precurseur du glutathion (principal antioxydant endogene). Medicament essentiel OMS, utilise en pneumologie, toxicologie et psychiatrie.",
    content: `
# NAC (N-Acetylcysteine)

## Identite et biochimie

La N-acetylcysteine (NAC) est un derive acetyle de l'acide amine L-cysteine. Utilisee en medecine depuis plus de 60 ans, elle figure sur la liste des medicaments essentiels de l'OMS.

**Mecanisme principal :** precurseur de la cysteine, substrat limitant de la biosynthese du glutathion (GSH), le principal antioxydant intracellulaire. Une etude en spectroscopie IRM a 7 Tesla a confirme qu'une dose unique de NAC IV augmente directement le glutathion cerebral.

**Biodisponibilite orale :** faible (3-6%), identique a celle des autres precurseurs de cysteine. Les hautes doses orales compensent cette faible absorption.

**Decouverte recente :** la NAC est aussi convertie en sulfure d'hydrogene (H2S) et en especes soufrees polysulfures, ce qui pourrait expliquer certains effets attribues au glutathion.

## Mecanismes d'action

### Precurseur du glutathion

Fournit la cysteine necessaire a la synthese du GSH intracellulaire. Le glutathion neutralise les radicaux libres, regenere les vitamines C et E, et participe a la detoxification hepatique.

### Modulation du glutamate

Stimule l'echangeur cysteine-glutamate (systeme Xc-), augmentant la clairance synaptique du glutamate. Induit l'expression du transporteur GLT-1. Ce mecanisme explique les applications en psychiatrie.

### Proprietes mucolytiques

Clive les ponts disulfures des mucines, reduisant la viscosite du mucus. Usage approuve en pneumologie.

### Anti-inflammatoire

Reduit le TNF-alpha, l'IL-6 et l'IL-1beta en supprimant l'activite du NF-kappaB.

## Indications approuvees

### Intoxication au paracetamol (niveau de preuve : tres eleve)

Quasi 100% efficace si administree dans les 8 heures post-ingestion. Restaure le pool hepatique de GSH et neutralise le metabolite toxique NAPQI. Protocole IV : 200 mg/kg en 4h, puis 100 mg/kg en 16h.

### Maladies respiratoires (niveau de preuve : eleve)

Pneumonie, bronchite, mucoviscidose, complications pulmonaires postoperatoires. Effet mucolytique par clivage des ponts disulfures des mucines.

## Utilisations off-label documentees

### Schizophrenine (niveau de preuve : fort)

Meta-analyse de 6 essais (n=701) : amelioration significative de la psychopathologie totale en adjuvant aux antipsychotiques. Posologie : 1 200-2 400 mg/jour pendant 24+ semaines.

### BPCO (niveau de preuve : modere a fort, dose-dependant)

600 mg/jour : pas d'impact significatif. 1 200 mg/jour : amelioration significative de la fonction des petites voies respiratoires et reduction des exacerbations. L'efficacite est dose-dependante.

### Trouble bipolaire - depression (niveau de preuve : modere, resultats mixtes)

Meta-analyse de 6 essais (n=248) : taille d'effet moderee favorisant la NAC. Resultats heterogenes. Posologie : 1 000-3 000 mg/jour pendant 10-24 semaines.

### Sante cardiovasculaire (niveau de preuve : modere)

Essai NACIAM : NAC IV a haute dose combinee a la nitroglycerine reduit la taille de l'infarctus aigu chez les patients STEMI.

## Posologie en supplementation

### Doses courantes

- **Usage general (antioxydant) :** 600-1 200 mg/jour en 2-3 prises
- **Indications psychiatriques :** 1 200-2 400 mg/jour pendant 24+ semaines
- **BPCO :** 1 200 mg/jour minimum
- **Dose maximale testee sans effets indesirables significatifs :** jusqu'a 8 000 mg/jour oralement

### Forme et timing

Gelules ou poudre. Prendre a jeun ou avec un repas leger (pas de restriction stricte). Fractionner en 2-3 prises quotidiennes.

## Securite

### Profil general

Sure et bien toleree oralement. Profil de securite etabli jusqu'a 3 000 mg/jour. Etudes avec 8 000 mg/jour sans reactions cliniquement significatives.

### Effets secondaires oraux

- **Troubles GI (frequents, jusqu'a 23%) :** nausees, vomissements, diarrhee, dyspepsie
- **Odeur soufree** desagreable (semblable a des oeufs pourris)
- **Prurit, erytheme** (peu frequents)

### Effets secondaires IV (plus rares)

Reactions anaphylactoides (3-8%) : non immunologiques, liees a la liberation d'histamine. Bronchospasme, urticaire, hypotension. L'asthme est un facteur de risque (risque 2,9x).

### Contre-indications

- Hypersensibilite a l'acetylcysteine
- Asthme (precaution, pas une contre-indication absolue)
- Troubles de la coagulation (proprietes anticoagulantes legeres)
- Utilisation concomitante de nitroglycerine (risque d'hypotension severe)

### Interactions medicamenteuses

- **Nitroglycerine :** vasodilatation additive, hypotension et cephalees severes
- **Charbon active :** interference dans le traitement des intoxications
- **Anticoagulants/antiplaquettaires :** prudence (inhibition legere de l'agregation plaquettaire)

## Populations specifiques

### Grossesse

La NAC traverse le placenta sans effets indesirables foetaux documentes. Utilisation limitee aux cas d'intoxication au paracetamol.

### Enfants

Sure a 600-2 400 mg/jour pour les enfants de plus de 2 ans. Prudence chez les nourrissons de moins de 2 ans (risque de bronchorrhee paradoxale par inhalation).

### Insuffisance renale

Intervention sure sans evenements indesirables significatifs. Pas d'ajustement posologique necessaire.

## Synergies

- Glutathion (precurseur direct)
- Vitamines C et E (regenerees par le GSH)
- Glycine (autre acide amine du glutathion)

## Limites de la recherche

- Biodisponibilite orale tres faible (3-6%) — efficacite des hautes doses orales vs. IV debattue
- Delai d'efficacite long pour les indications psychiatriques (24+ semaines)
- Recherche animale suggerant une acceleration de la croissance tumorale pulmonaire (reduction du stress oxydatif protecteur) — prudence chez les patients oncologiques
- Mecanisme exact d'action (glutathion vs. H2S) encore en cours d'elucidation
`,
  },
]
