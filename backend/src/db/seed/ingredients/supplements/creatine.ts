import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const CREATINE: IngredientInput[] = [
  {
    name: 'Créatine (Monohydrate)',
    slug: INGREDIENT_SLUGS.CREATINE,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.ACIDE_AMINE,
    description:
      "Composé azoté naturel servant de réserve énergétique rapide (phosphocréatine). Supplément ergogénique le plus étudié et le plus efficace pour la force, la masse maigre et la performance de haute intensité.",
    content: `
# Créatine (Monohydrate)

## Identité et biochimie

La créatine (acide méthylguanidine-acétique) est un composé organique azoté synthétisé dans le foie, les reins et le pancréas à partir de trois acides aminés : arginine, glycine et méthionine.

**Distribution :** 95% dans les muscles squelettiques, 5% dans le cerveau, le cœur et les testicules. Concentration musculaire normale ~120 mmol/kg de masse sèche, saturable jusqu'à ~150-160 mmol/kg par supplémentation.

**Sources alimentaires :** viande rouge et poisson (~4-5 g/kg). Alimentation omnivore typique : 1-2 g/jour. Alimentation végétarienne/végane : ~0 g (synthèse endogène uniquement).

**Turnover :** 1-2% de la créatine totale est dégradée quotidiennement en créatinine, excrétée par voie urinaire.

## Mécanisme d'action principal

### Système phosphocréatine — tampon énergétique

La créatine est phosphorylée par la créatine kinase (CK) en phosphocréatine (PCr), qui régénère l'ATP à partir de l'ADP plus rapidement que tout autre système énergétique.

- Au repos : l'ATP excédentaire phosphoryle la créatine en PCr
- Effort intense : la PCr libère son phosphate pour régénérer l'ATP
- Capacité : ~10-15 secondes d'effort maximal (les réserves d'ATP seul durent 1-2 secondes)

### Effets cellulaires additionnels

- **Tampon de pH :** la resynthèse d'ATP via PCr consomme des ions H⁺, retardant l'acidification musculaire
- **Hydratation cellulaire :** effet osmotique augmentant le volume intracellulaire, stimulant la synthèse protéique
- **Cellules satellites :** augmentation du nombre de myonoyaux, accroissant le potentiel de croissance musculaire
- **Expression génique :** régulation à la hausse de gènes impliqués dans la synthèse protéique, la réparation de l'ADN et la prolifération des cellules satellites

## Bénéfices démontrés

### Performance physique (niveau de preuve : élevé)

Position ISSN 2017 : « Le monohydrate de créatine est le supplément ergogénique nutritionnel le plus efficace actuellement disponible pour les athlètes. »

- Force musculaire : augmentation significative
- Masse maigre : gains supérieurs vs entraînement seul
- Sprints répétés et exercices de haute intensité : amélioration documentée
- Récupération : réduction du temps entre séries

**Limitations :** efficacité diminuée pour l'endurance prolongée. 20-30% de « non-répondeurs » (niveaux baseline déjà élevés).

### Fonction cognitive (niveau de preuve : modéré)

Méta-analyse 2024 (Frontiers in Nutrition) : amélioration de la mémoire, de la vitesse de traitement et des fonctions exécutives. Une étude (Scientific Reports 2024) montre que la créatine contrecarre les effets négatifs de la privation de sommeil sur la cognition, avec des modifications mesurables des phosphates cérébraux à haute énergie (31P-MRS).

### Dépression (niveau de preuve : préliminaire)

Étude pilote 2024 (100 participants, RCT double aveugle, 8 semaines) : créatine + TCC → réduction du score PHQ-9 significativement supérieure au placebo + TCC (Δ = -5,12). Résultats prometteurs nécessitant confirmation par des essais plus larges.

### Autres applications étudiées

Sarcopénie chez les personnes âgées, diabète de type 2, traumatisme crânien, maladies neuromusculaires. Preuves préliminaires.

## Posologie

### Protocole de charge (optionnel)

20-25 g/jour pendant 5-7 jours, divisés en 4-5 prises. Saturation musculaire rapide (+20-40% PCr en une semaine). Inconvénients : prise de poids rapide (~2% du poids, eau), troubles GI possibles.

L'absorption est améliorée de ~60% avec des glucides (~1 g/kg).

### Protocole de maintenance (standard)

**3-5 g/jour en continu.** Atteint les mêmes niveaux de saturation que la charge, mais en 3-4 semaines. Moins d'effets secondaires.

### Timing et forme

- Le timing (pré/post-entraînement) n'est pas critique — la consistance quotidienne prime
- Prendre avec un repas contenant des glucides si possible
- **Monohydrate de créatine :** forme la plus étudiée (>1000 publications), meilleur rapport efficacité/coût
- Aucune autre forme n'a démontré de supériorité
- Pas de nécessité de cyclage — supplémentation continue possible pendant des années
- Stable sous forme de poudre ; préparer en solution juste avant consommation

## Sécurité

### Profil global

Position ISSN 2025 : « Pas de preuve convaincante que l'usage court ou long terme de monohydrate de créatine (jusqu'à 30 g/jour pendant 5 ans) ait des effets délétères chez les individus sains. »

### Effets secondaires

- **Rétention d'eau intracellulaire (fréquent) :** 1-3 kg, principalement musculaire, bénigne
- **Troubles GI (occasionnels) :** nausées, diarrhée, crampes — surtout en phase de charge ou à jeun

### Mythes réfutés

- **Crampes musculaires :** aucune augmentation documentée, certaines études montrent une réduction
- **Déshydratation :** la créatine améliore la rétention d'eau cellulaire, pas de perte d'eau
- **Perte de cheveux :** une seule étude (2009) a montré une augmentation de la DHT, jamais répliquée. L'étude 2025 (première à mesurer directement la santé capillaire) n'a trouvé aucun effet sur DHT ni sur les paramètres folliculaires
- **Masse grasse :** la prise de poids est de l'eau et du muscle, pas du gras
- **Stéroïde :** la créatine n'est pas un stéroïde ni une hormone — légale dans toutes les compétitions (WADA)

### Créatinine sérique

La supplémentation élève modestement la créatinine sérique (turnover métabolique normal). Cela ne reflète PAS une atteinte rénale. Le DFG mesuré reste inchangé. Informer le médecin lors des bilans sanguins ; la cystatine C est un marqueur rénal alternatif non affecté.

### Fonction rénale

Méta-analyses 2019 et 2025 : aucune altération du DFG. Études chez des populations à risque (diabétiques, personnes âgées, rein unique) : aucune preuve de dommage rénal aux doses recommandées.

### Contre-indications

- **Maladie rénale chronique (DFG <60 mL/min)** — contre-indication absolue
- **Médicaments néphrotoxiques** (AINS chroniques, aminosides) — éviter la combinaison
- **Grossesse/allaitement** — données insuffisantes, éviter par précaution
- **Enfants <12 ans** — données insuffisantes

## Populations spécifiques

### Végétariens et véganes

Meilleurs répondeurs à la supplémentation (niveaux baseline inférieurs, 0 g alimentaire). Gains de performance et de masse maigre potentiellement supérieurs. La créatine peut être considérée comme quasi-essentielle pour les athlètes végétariens.

### Femmes

Mêmes protocoles que les hommes. Bénéfices documentés sur la performance et la masse maigre. Gains de force potentiellement légèrement inférieurs (niveaux baseline musculaires plus élevés chez certaines femmes).

### Personnes âgées (>65 ans)

Amélioration de la masse musculaire, de la force et de la fonction physique (sarcopénie). Bilan rénal préalable recommandé. Position ISSN : bénéfices thérapeutiques démontrés.

## Synergies

- Protéines / glucides (améliore absorption et synthèse)
- Bêta-alanine (mécanismes complémentaires)
- Caféine (effets indépendants, pas d'interférence documentée)

## Limites de la recherche

- Majorité des études sur des jeunes adultes masculins en bonne santé
- Données au-delà de 5 ans limitées
- Variabilité inter-individuelle importante (20-30% de non-répondeurs)
- Populations spécifiques (grossesse, MRC) insuffisamment étudiées
- Effets cognitifs : preuves encore modérées, surtout chez les sujets sains jeunes
`,
  },
]
