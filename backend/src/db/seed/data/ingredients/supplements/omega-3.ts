import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const OMEGA_3: IngredientInput[] = [
  {
    name: 'Omega-3 (EPA + DHA)',
    slug: INGREDIENT_SLUGS.OMEGA_3,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.ACIDE_GRAS,
    description:
      "Acides gras polyinsatures essentiels impliques dans la structure des membranes neuronales (DHA) et la resolution de l'inflammation (EPA). Benefices cardiovasculaires et cognitifs documentes.",
    content: `
# Omega-3 (EPA + DHA)

## Identite et biochimie

Les omega-3 sont des acides gras polyinsatures essentiels (non synthetises par l'organisme en quantite suffisante). Les deux formes biologiquement actives sont :

- **EPA (acide eicosapentaenoique, C20:5) :** precurseur de resolvines et protectines anti-inflammatoires
- **DHA (acide docosahexaenoique, C22:6) :** composant structural majeur des membranes neuronales et retiniennes (~40% des acides gras des phospholipides cerebraux)

**ALA (acide alpha-linolenique, C18:3) :** precurseur vegetal (lin, chia, noix). Conversion en EPA/DHA tres faible (~5-10% en EPA, <1% en DHA). Non suffisant comme seule source.

**Sources alimentaires :** poissons gras (saumon, maquereau, sardine, hareng : 1-2 g EPA+DHA/100g), algues (source de DHA pour les vegetaliens), huile de foie de morue.

## Mecanismes d'action

### Structure membranaire (DHA)

Le DHA confere souplesse et fluidite aux membranes neuronales, facilitant la transmission synaptique, la signalisation cellulaire et l'activite des recepteurs membranaires. Il represente ~97% des omega-3 du cerveau.

### Resolution de l'inflammation (EPA)

L'EPA est le precurseur des resolvines de la serie E et des prostaglandines anti-inflammatoires de la serie 3. Il entre en competition avec l'acide arachidonique (omega-6) pour les enzymes COX et LOX, reduisant la production de mediateurs pro-inflammatoires.

### Synergie avec les vitamines B

Les omega-3 ne fonctionnent de maniere optimale que si les taux de vitamines B (B6, B9, B12) sont adequats. Etude VITACOG : vitamines B + bons omega-3 = -40% de retrecissement cerebral. Vitamines B + faibles omega-3 = aucun effet. Le transport du DHA dans le cerveau depend de la phosphatidylcholine, dont la synthese necessite les vitamines B.

## Benefices documentes

### Sante cardiovasculaire (niveau de preuve : eleve)

Reduction des triglycerides (effet dose-dependant, significatif a partir de 2 g/jour). Effet anti-arythmique (reduction de la fibrillation auriculaire a doses moderees). Reduction modeste de la pression arterielle. Amelioration de la fonction endotheliale.

### Fonction cognitive (niveau de preuve : modere)

Meta-analyse (25 essais) : petit effet positif sur la memoire, surtout chez les personnes ne consommant pas de poisson. Benefice cognitif dependant du statut en vitamines B (pas de benefice si carence en B-vitamines). DHA essentiel au developpement cerebral foetal et neonatal.

### Anti-inflammatoire (niveau de preuve : eleve)

Reduction documentee de la CRP, IL-6 et TNF-alpha. Benefices dans les conditions inflammatoires chroniques (polyarthrite rhumatoide, maladies inflammatoires de l'intestin).

### Sante mentale (niveau de preuve : modere)

EPA montre une efficacite moderee comme adjuvant dans la depression majeure (meta-analyses). Rapport EPA/DHA eleve (>60% EPA) semble plus efficace pour la depression.

## Posologie

### Doses recommandees

- **Population generale :** 500 mg-1 g EPA+DHA/jour (ou 2-3 portions de poissons gras/semaine)
- **Triglycerides eleves :** 2-4 g/jour sous supervision medicale
- **Depression (adjuvant) :** 1-2 g/jour (ratio EPA eleve)
- **Grossesse :** 200-300 mg DHA/jour minimum

### Forme et qualite

- Huile de poisson (forme la plus courante et etudiee)
- Huile d'algue (source vegetale de DHA, parfois DHA+EPA)
- Privilegier les formes triglycerides ou phospholipides (meilleure absorption que les esters ethyliques)
- Prendre avec un repas gras (ameliore l'absorption)
- Verifier la purete (absence de metaux lourds, PCB, dioxines)

## Securite

### Effets secondaires

- Troubles GI (eructations de poisson, nausees, diarrhee) — attenues par les formes enterosolubles
- Gout de poisson persistant
- Legere augmentation du temps de saignement (non cliniquement significative aux doses standard)

### Risques a hautes doses

**> 3 g/jour : risque accru de fibrillation auriculaire** (paradoxe — l'effet anti-arythmique a dose moderee s'inverse a haute dose). Augmentation modeste du LDL-cholesterol chez certains patients (surtout avec les huiles riches en DHA).

### Contre-indications

- Allergie aux poissons/fruits de mer (utiliser huile d'algue)
- Anticoagulants a haute dose (surveillance INR si warfarine)
- Chirurgie programmee (arreter 1-2 semaines avant, par precaution)

## Synergies

- Vitamines B6, B9, B12 (synergie majeure pour les effets cognitifs et cardiovasculaires)
- Phosphatidylserine (integration DHA dans les membranes neuronales)
- Vitamine D (absorption amelioree avec les graisses)

## Limites de la recherche

- Mega-doses (> 3 g) : rapport benefice/risque defavorable (fibrillation auriculaire)
- Conversion ALA -> EPA/DHA tres faible — les sources vegetales ne remplacent pas les sources marines
- Resultats cognitifs dependants du statut en B-vitamines — les etudes ne controlant pas ce facteur montrent des resultats inconsistants
- Variabilite interindividuelle importante (genetique, statut omega-6)
`,
  },
]
