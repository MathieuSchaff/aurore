import { INGREDIENT_SLUGS } from './ingredient-slugs'
import type { IngredientInput } from './seed-ingredients'

export const DIVERS_NON_CLASSES: IngredientInput[] = [
  {
    name: 'Algue Bleue (Aphanizomenon Flos-aquae)',
    slug: INGREDIENT_SLUGS.APHANIZOMENON_FLOS_AQUAE,
    category: 'Rétinol-Like & Vitalité',
    description:
      'Une cyanobactérie sauvage du lac Klamath, considérée comme un "super-aliment" cutané offrant un effet lissant comparable au rétinol sans l’irritation.',
    content: `
# AFA (Algue Bleue) : Le Super-Aliment du Lac Klamath

L’**Aphanizomenon Flos-aquae (AFA)** est l'une des formes de vie les plus anciennes sur Terre. Cette algue bleue-verte regorge de 60 minéraux, 12 vitamines et une concentration unique de protéines, ce qui en fait un actif de revitalisation cellulaire hors pair.

---

## 🔬 L'Action "Rétinol-Like"
* **Lissage des Rides** : Elle stimule la différenciation des kératinocytes, offrant un effet lissant et régénérant comparable aux rétinoïdes.
* **Densité & Éclat** : Sa richesse en acides aminés aide à reconstruire la matrice extracellulaire.
* **Détoxification** : Grâce à sa chlorophylle, elle aide la peau à lutter contre le stress oxydatif environnemental.

---

## ⚖️ Transparence Scientifique & Limites
* **Alternative Douce** : Contrairement au rétinol, l'AFA n'est ni photosensibilisante ni irritante. Cependant, son action lissante est généralement **plus lente** et moins marquée sur les rides très profondes.
* **Pureté Critique** : Provenant de milieux naturels, elle doit être scrupuleusement testée pour garantir l'absence de microcystines (toxines naturelles de certaines algues).

---

## 🛡️ Précautions & Sécurité
* **Sécurité Cutanée** : Excellente tolérance, convient parfaitement aux peaux sensibles et aux femmes enceintes cherchant une alternative aux actifs puissants de synthèse.
`,
  },
  {
    name: 'Vétiver (Vetiveria Zizanoides)',
    slug: INGREDIENT_SLUGS.VETIVERIA_ZIZANOIDES,
    category: 'Régénération & Équilibre',
    description:
      'Une racine d’ancrage aux propriétés cicatrisantes et apaisantes, reconnue pour favoriser la régénération tissulaire tout en équilibrant le sébum.',
    content: `
# Vétiver : L'Ancrage de la Peau

Le **Vetiveria Zizanoides** est une racine profonde dont l'huile essentielle est un joyau de la phytothérapie. Au-delà de son parfum hypnotique, elle possède des vertus régénératrices et toniques circulatoires exceptionnelles pour les peaux stressées.

---

## ✨ Points Forts & Bénéfices
* **Régénération Tissulaire** : Favorise le renouvellement cellulaire et aide à atténuer l'apparence des vergetures et cicatrices.
* **Équilibre Séborrhéique** : Aide à réguler les peaux grasses sans les agresser.
* **Anti-inflammatoire** : Calme les peaux sujettes à l'échauffement.

---

## ⚖️ Transparence Scientifique & Limites
* **Complexité Moléculaire** : Ses effets dépendent de la présence de molécules comme les vétivols. La qualité de l'extraction est cruciale pour l'efficacité thérapeutique.
* **Usage de niche** : Son coût élevé en fait souvent un ingrédient secondaire utilisé pour son parfum plutôt que pour son action dermo-cosmétique active.

---

## 🛡️ Précautions & Sécurité
* **Allergies** : Risque faible, mais présent chez les personnes sensibles aux huiles essentielles.
* **Grossesse** : Par mesure de prudence, à éviter durant le premier trimestre de grossesse.
`,
  },
  {
    name: 'Huile de Pin des Marais (Pinus Palustris)',
    slug: INGREDIENT_SLUGS.PINUS_PALUSTRIS,
    category: 'Énergie & Purification',
    description:
      'Un extrait résineux aux vertus tonifiantes et purifiantes, apportant la force des forêts boréales pour revitaliser les peaux ternes et fatiguées.',
    content: `
# Pinus Palustris : Le Souffle de la Forêt

L'huile de **Pin des Marais** est reconnue pour ses propriétés aromatiques et dynamisantes. Riche en terpènes, elle est traditionnellement utilisée pour son action antiseptique douce et son effet stimulant sur la micro-circulation cutanée.

---

## ✨ Points Forts & Bénéfices
* **Tonique Cutané** : Aide à "réveiller" le teint et à raffermir les tissus par son action astringente.
* **Purification** : Particulièrement adaptée aux peaux sujettes aux imperfections pour assainir l'épiderme.
* **Bien-être Holistique** : Son parfum boisé favorise la relaxation et la sensation de pureté.

---

## ⚖️ Transparence Scientifique & Limites
* **Risque Oxydatif** : Comme toutes les huiles riches en terpènes, elle peut s'oxyder rapidement. Une huile oxydée devient fortement irritante.
* **Preuves Scientifiques** : Son usage est essentiellement basé sur l'ethnobotanique et l'aromathérapie ; les études cliniques dermatologiques de haut niveau restent limitées.

---

## 🛡️ Précautions & Sécurité
* **Sensibilisation** : Contient du limonène et d'autres allergènes naturels. **Contre-indiquée chez les femmes enceintes et les enfants de moins de 6 ans** en raison de sa teneur en huiles essentielles.
`,
  },
  {
    name: 'Huile de Babassu (Orbignya Oleifera)',
    slug: INGREDIENT_SLUGS.ORBIGNYA_OLEIFERA,
    category: 'Protection & Nutrition',
    description:
      'Une huile précieuse d’Amazonie, alternative légère à l’huile de coco, offrant une nutrition intense et une action protectrice sans fini gras.',
    content: `
  # L'Huile de Babassu : Le Trésor de l'Amazonie

  L’huile d’**Orbignya Oleifera**, extraite des noix du palmier Babassu, est une merveille de sensorialité. Riche en acide laurique et myristique, elle possède la particularité de fondre instantanément au contact de la peau, créant un film protecteur invisible et velouté.

  ---

  ## 🌿 Propriétés Remarquables
  * **Régulation Hydrique** : Forme une barrière non occlusive qui prévient la déshydratation.
  * **Apaisement** : Naturellement rafraîchissante, elle calme les sensations d'inconfort liées au froid ou au calcaire.
  * **Équilibre** : Contrairement à d'autres beurres végétaux, elle ne bouche pas les pores, convenant ainsi aux peaux mixtes.

  ---

  ## ⚖️ Transparence Scientifique & Limites
  * **Données Lipidiques** : Ses propriétés émollientes sont largement documentées, mais ses vertus "cicatrisantes" parfois revendiquées sont principalement dues à la protection de la barrière plutôt qu'à une activité pharmacologique directe.
  * **Éthique** : Son exploitation doit être rigoureusement contrôlée pour éviter la déforestation et soutenir les communautés locales (collecte sauvage traditionnelle).

  ---

  ## 🛡️ Précautions & Sécurité
  * **Comédogénicité** : Très faible (indice 1), ce qui la rend plus sûre que l'huile de coco pour le visage.
  `,
  },
  {
    name: 'Acides Aminés de Riz (Rice Amino Acids)',
    slug: INGREDIENT_SLUGS.RICE_AMINO_ACIDS,
    category: 'Nutrition & Force',
    description:
      'Un cocktail de micro-nutriments essentiels issus de la protéine de riz, agissant comme des briques élémentaires pour reconstruire la barrière cutanée et fortifier la fibre capillaire.',
    content: `
  # Les Acides Aminés de Riz : La Quintessence de la Céréale Sacrée

  Utilisés depuis des millénaires dans les rituels de beauté asiatiques, les **Rice Amino Acids** sont obtenus par l'hydrolyse enzymatique des protéines de riz. Ce procédé permet de fragmenter les protéines en peptides de petite taille, capables d'interagir avec la kératine et le collagène pour une action revitalisante profonde.

  ---

  ## ✨ Points Forts & Bénéfices
  * **Hydratation de Précision** : En tant que composants naturels du NMF (*Natural Moisturizing Factor*), ils retiennent l'humidité au sein de la couche cornée.
  * **Volume & Gainage** : En soin capillaire, ils s'attachent à la cuticule pour donner du corps aux cheveux fins sans les alourdir.
  * **Soutien Métabolique** : Fournissent les précurseurs nécessaires à la synthèse des protéines cutanées.

  ---

  ## ⚖️ Transparence Scientifique & Limites
  * **Action de Surface vs Profondeur** : Bien que biodisponibles, leur pénétration au-delà de l'épiderme reste limitée. Ils agissent davantage comme des protecteurs et des agents de texture que comme des agents de modification structurelle.
  * **Variabilité** : L'efficacité dépend de la taille des peptides (poids moléculaire) obtenue lors de l'hydrolyse.

  ---

  ## 🛡️ Précautions & Sécurité
  * **Innocuité** : Exceptionnellement bien tolérés, ils sont le choix de prédilection pour les peaux allergiques ou réactives.
  `,
  },
  {
    name: 'Isosorbide Dicaprylate',
    slug: INGREDIENT_SLUGS.ISOSORBIDE_DICAPRYLATE,
    category: 'Hydratation Intelligente',
    description:
      'Un "boosteur" d’hydratation bio-sourcé qui régule l’expression des aquaporines pour optimiser la circulation de l’eau entre les couches de la peau.',
    content: `
  # Isosorbide Dicaprylate : L'Hydratation Intelligente

  L'**Isosorbide Dicaprylate** n'est pas un simple agent hydratant passif. C'est un actif intelligent issu de la chimie verte qui stimule les canaux naturels d'hydratation de la peau (Aquaporine-3) pour une répartition homogène de l'eau.

  ---

  ## 🔬 Mécanisme d'Action
  * **Régulation Hydrique** : Optimise le flux d'eau du derme vers l'épiderme, évitant les zones de sécheresse localisées.
  * **Renforcement de la Barrière** : Stimule la production de protéines clés comme la filaggrine pour une peau plus forte.
  * **Toucher Sec** : Offre une texture élégante, non grasse, idéale pour les soins quotidiens.

  ---

  ## ⚖️ Transparence Scientifique & Limites
  * **Concept Avancé** : Bien que la stimulation des aquaporines soit une piste sérieuse en dermatologie, l'efficacité réelle dépend de la concentration utilisée et de la capacité de l'actif à atteindre les couches cibles.
  * **Besoin de Régularité** : Son action régulatrice nécessite une application continue pour maintenir les bénéfices sur la barrière cutanée.

  ---

  ## 🛡️ Précautions & Sécurité
  * **Origine** : Produit à partir de maïs et d'acides gras végétaux. Excellente biodégradabilité.
  `,
  },
  {
    name: 'Amarante (Amaranthus Caudatus)',
    slug: INGREDIENT_SLUGS.AMARANTHUS_CAUDATUS,
    category: 'nourrissant & protecteur',
    description:
      'Source exceptionnelle de squalène naturel et d’acides gras, elle renforce la barrière lipidique et adoucit la peau.',
    content: `
# Amarante (Amaranthus Caudatus)
L'extrait ou l'huile d'amarante est un trésor nutritionnel pour la peau, particulièrement riche en lipides protecteurs.

## INCI
**AMARANTHUS CAUDATUS SEED EXTRACT**

## Points forts
- **Richesse en Squalène** : Contient l'un des taux les plus élevés de squalène végétal, un composant naturel du sébum qui maintient l'hydratation.
- **Réparateur** : Restaure le film hydrolipidique des peaux sèches et agressées.
- **Anti-inflammatoire** : Calme les irritations grâce à sa teneur en vitamine E et peptides.
- **Toucher soyeux** : Apporte de la souplesse et un fini velouté sans effet gras excessif.

## Rôle dans les soins
Utilisé pour nourrir intensément et protéger la peau contre la déshydratation et les agressions extérieures.

## Utilisation
- **Cible** : Peaux sèches, déshydratées, barrières cutanées altérées.
- **Type de soin** : Huiles de soin, crèmes riches, baumes réparateurs.
`,
  },
  {
    name: 'Extrait de Graines de Roucou (Bixa Orellana Seed Extract)',
    slug: INGREDIENT_SLUGS.BIXA_ORELLANA,
    category: 'actif',
    description:
      "L'actif 'Sun-Prep' et perfecteur : un concentré de caroténoïdes pour une protection antioxydante naturelle et un effet flouteur de pores immédiat.",
    content: `# Le Roucou (Urucum) : L'Actif Protecteur et Sublimateur du Teint

L'extrait de graines de **Bixa Orellana**, plus connu sous le nom de Roucou ou Urucum, est un trésor de la biodiversité amazonienne. En formulation dermo-cosmétique de pointe, cet ingrédient est plébiscité pour sa double action : un bouclier antioxydant puissant face au stress environnemental et un agent de perfection cutanée capable de réguler la brillance et de minimiser l'apparence des pores.

---

## 🌎 Histoire et Ethnobotanique : Le "Trésor des Peaux-Rouges"
Utilisé depuis des millénaires par les populations autochtones d'Amérique latine pour leurs peintures corporelles rituelles, le Roucou est à l'origine de l'appellation "Peaux-Rouges". Au-delà du pigment, ces peuples l'utilisaient pour se protéger des brûlures solaires et des agressions du milieu tropical. Aujourd'hui, la recherche (type R&D ethno-botanique) exploite sa fraction active pour la préparation et la réparation solaire.

## 🔬 Profil Moléculaire : Une Richesse en Caroténoïdes
Le Roucou est l'une des sources naturelles les plus concentrées en provitamine A et en caroténoïdes :

* **Bixine & Norbixine :** Pigments caroténoïdes puissants qui agissent comme des piégeurs de radicaux libres, protégeant ainsi l'ADN cellulaire contre les dommages induits par les UV.
* **Tocotriénols (Vitamine E) :** Présents en concentrations exceptionnelles, ils luttent contre la peroxydation lipidique et préservent la souplesse des membranes cellulaires.
* **Oligo-éléments (Magnésium, Sélénium) :** Essentiels à l'homéostasie cutanée et au renforcement des barrières de défense naturelles.

## 🌿 Sourcing & Éco-Extraction : La Haute Technologie Tropicale
La qualité de l'extrait dépend de la préservation de ses molécules thermosensibles :
1.  **Récolte Durable :** Filières de sourcing éthique en Amazonie ou en Afrique de l'Ouest, garantissant un revenu juste aux producteurs et le respect de la biodiversité.
2.  **Extraction au CO2 Supercritique ou Macération Oléique :** Permet d'isoler la bixine sans solvants chimiques, offrant un extrait pur et hautement biodisponible.
3.  **Titrage en Caroténoïdes :** Standardisation indispensable pour garantir l'efficacité antioxydante d'un lot à l'autre.

## ⚖️ Preuves d'Efficacité : "Blur" Naturel et Photo-Protection
L'extrait de Bixa Orellana agit comme un véritable filtre de beauté biologique :
* **Action Pore-Refiner :** Des études cliniques ont démontré une réduction significative du diamètre des pores et une baisse de la production de sébum.
* **Préparation Solaire (Tan-Booster) :** En stimulant la mélanogenèse de manière douce, il prépare la peau à l'exposition et prolonge naturellement le bronzage.
* **Effet Anti-Pollution :** Forme un voile antioxydant qui neutralise les micro-particules de métaux lourds avant qu'elles ne déclenchent une cascade inflammatoire.

> **Le saviez-vous ?** Le Roucou contient 100 fois plus de caroténoïdes que la carotte, ce qui en fait l'un des meilleurs actifs pour l'éclat "bonne mine" immédiat.

## 🤝 Synergies en Formulation
* **Huile de Buriti :** Pour une huile solaire "Gold" ultra-protectrice et régénérante.
* **Zinc PCA :** Pour une action synergique sur la réduction des pores et la matité des peaux mixtes.
* **Vitamine C stable :** Pour un cocktail antioxydant global luttant contre le photo-vieillissement.

## 🛡️ Sécurité & Tolérance
* **Innocuité :** Actif naturel parfaitement toléré, sans potentiel sensibilisant connu.
* **Usage :** Idéal dans les soins de jour, les huiles solaires, les BB crèmes et les soins après-soleil.
* **Non-Photo-sensibilisant :** Contrairement à certains huiles essentielles, il est sécuritaire en pleine exposition solaire.

---
*Fiche technique scientifique rédigée pour les experts en innovation dermo-cosmétique et maquillage traitant.*`,
  },
  {
    name: 'Ophiopogon japonicus',
    slug: INGREDIENT_SLUGS.OPHIOPOGON_JAPONICUS,
    category: 'actif',
    description:
      'Extrait racinaire utilisé pour ses propriétés hydratantes, apaisantes et sa capacité à réguler les sensations d’échauffement.',
    content: `
       # Ophiopogon Japonicus

       L'Ophiopogon japonicus, également appelé "Muguet du Japon" ou "Mai Men Dong" dans la pharmacopée traditionnelle asiatique, est une plante vivace dont on extrait les tubercules. En cosmétique, cet extrait est valorisé pour sa richesse en fructosanes (polysaccharides), qui agissent sur la fonction barrière et l'équilibre hydrique de la peau.

       ## INCI
       OPHIOPOGON JAPONICUS ROOT EXTRACT

       ## Composition chimique
       - **Fructosanes** : Sucres complexes qui captent l'eau et renforcent la cohésion de la couche cornée.
       - **Saponines et Flavonoïdes** : Composés aux propriétés anti-inflammatoires et antioxydantes.

       ## Mécanisme d’action
       1. **Régulation du "Flush"** : Il agit sur les récepteurs impliqués dans la microcirculation cutanée, aidant à limiter l'afflux sanguin responsable des rougeurs soudaines et de la sensation de chaleur.
       2. **Synthèse lipidique** : Stimule la production de lipides épidermiques (céramides), renforçant ainsi l'étanchéité de la barrière cutanée.
       3. **Équilibre du Microbiome** : Favorise la diversité bactérienne de la peau, ce qui limite la prolifération de micro-organismes opportunistes responsables d'irritations.

       ## Bienfaits
       - **Effet Thermorégulateur** : Aide à abaisser la température ressentie des peaux sujettes aux bouffées de chaleur (rosacée, émotions, changements de température).
       - **Hydratation Longue Durée** : Améliore la capacité de stockage de l'eau dans l'épiderme.
       - **Réduction de la sensibilité** : Diminue les sensations de tiraillements et d'inconfort dès l'application.

       ## Utilisation
       - **Cible** : Particulièrement recommandé pour les peaux réactives, couperosées ou souffrant de dermatite atopique.
       - **Type de soin** : On le retrouve fréquemment dans les brumes apaisantes, les crèmes anti-rougeurs et les soins post-actes dermatologiques.
       - **Moment** : Utilisable matin et soir.

       ## Note technique
       Cet actif est souvent sélectionné dans les formulations de dermo-cosmétique pour sa capacité à mimer les fonctions d'une barrière cutanée saine, permettant de restaurer l'homéostasie des peaux fragilisées. Contrairement à des agents purement occlusifs, il travaille sur la biologie de l'hydratation naturelle de la peau.
       `,
  },
  {
    name: 'Humectants, émollients et occlusifs',
    slug: INGREDIENT_SLUGS.HUMECTANTS_EMOLLIENTS_OCCLUSIFS,
    category: 'concept',
    description:
      "Les trois piliers de l'hydratation cutanée. Les humectants attirent l'eau, les émollients lissent et renforcent la barrière, les occlusifs scellent l'hydratation et limitent la TEWL.",
    content: `## Les trois catégories

### Humectants
Attirent l'eau depuis l'environnement ou les couches profondes vers le stratum corneum. En air très sec, peuvent paradoxalement déshydrater sans occlusif.
**Exemples** : Glycérine, Acide hyaluronique, Urée, Aloe vera, Propylène glycol

### Émollients
Comblent les espaces entre cellules de la couche cornée, lissent la surface, restaurent la souplesse. Renforcent la barrière sans attirer d'eau supplémentaire.
**Exemples** : Squalane, Beurre de karité, Huiles végétales (jojoba, argan), Cholestérol, Céramides

### Occlusifs
Forment un film protecteur limitant la perte d'eau transépidermique (TEWL). Peuvent sembler lourds ou gras — moins adaptés aux peaux grasses/acnéiques.
**Exemples** : Pétrolatum (vaseline), Cire d'abeille, Huile minérale, Diméthicone

## Layering recommandé
1. Nettoyage (peau légèrement humide)
2. Sérum
3. **Humectants** (sur peau encore humide)
4. **Émollients**
5. **Occlusifs** (soir / hiver)

## Conseils selon la peau
- **Peau sèche / très sèche** : équilibre des trois
- **Peau mixte à grasse** : humectants + émollients légers, sans occlusifs lourds
- **Peau sensible / atopique** : occlusifs + émollients riches + humectants doux
- **Climat sec / hiver** : ajouter un occlusif en dernière étape`,
  },
  {
    name: 'Peptides',
    slug: INGREDIENT_SLUGS.PEPTIDES,
    category: 'actif',
    description: "Chaînes d'acides aminés qui boostent le collagène et raffermissent.",
    content: `# Peptides

Signalent à la peau de produire plus de collagène, élastine et acide hyaluronique. Très utilisés en anti-âge.

## INCI
varie (Palmitoyl Tripeptide-1, Copper Tripeptide-1, Matrixyl…)

## Concentration typique
variable selon le type (souvent 1-5%).`,
  },
]
