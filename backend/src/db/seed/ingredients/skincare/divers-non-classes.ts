import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import { INGREDIENT_CATEGORIES } from '@habit-tracker/shared'
import type { IngredientInput } from '../seed-ingredients'

export const DIVERS_NON_CLASSES: IngredientInput[] = [
  {
    name: 'NMN (Nicotinamide Mononucléotide)',
    slug: INGREDIENT_SLUGS.NMN,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Un nucléotide précurseur du NAD+ qui booste l’énergie cellulaire et répare les dommages à l’ADN pour un effet anti-âge systémique.',
    content: `
# NMN : Le Carburant de la Jeunesse Cellulaire

Le **Nicotinamide Mononucléotide (NMN)** est la nouvelle frontière de la cosmétique "Longevity". Il intervient directement dans la production de NAD+, une coenzyme vitale qui décline avec l'âge.

---

## 🔬 L'Action sur l'Horloge Biologique
* **Boost d'Énergie (ATP)** : En relançant les niveaux de NAD+, il redynamise les mitochondries, les "centrales énergétiques" de nos cellules cutanées.
* **Réparation de l'ADN** : Active les sirtuines (protéines de longévité) qui réparent les dommages causés par les UV et la pollution.
* **Optimisation de la Barrière** : Améliore la qualité de la couche cornée pour une peau plus résistante et mieux hydratée.

---

## ⚖️ Transparence Scientifique & Limites
* **Pénétration** : Bien que très efficace en supplémentation, son absorption topique nécessite une formulation stable pour garantir qu'il atteigne les couches vivantes de l'épiderme.
* **Actif Émergent** : C'est l'un des ingrédients les plus documentés actuellement dans la recherche sur le vieillissement, dépassant le cadre de la cosmétique classique.

---

## 🛡️ Précautions & Sécurité
* **Sécurité Cutanée** : Très bien toléré, il ne présente pas les effets irritants (flush) que peut parfois provoquer la niacine à haute dose.
`,
  },

  {
    name: 'Myrte Commun (Myrtus Communis Leaf Extract)',
    slug: INGREDIENT_SLUGS.MYRTUS_COMMUNIS_LEAF_EXTRACT,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Un extrait végétal méditerranéen qui stimule les protéines de longévité cellulaire et limite la glycation des tissus.',
    content: `
# Myrte Commun : Le Secret de Longévité Méditerranéen

L'extrait de feuilles de **Myrte** est un actif puissant qui agit sur les marqueurs biologiques du vieillissement, notamment en favorisant la synthèse des sirtuines.

---

## 🔬 L'Action Régénératrice
* **Stimulation des Sirtuines** : Augmente l'expression de SIRT-1, surnommée la "protéine de longévité", pour prolonger la vie des cellules saines.
* **Anti-Glycation** : Aide à prévenir le durcissement des fibres de collagène (phénomène de glycation), préservant ainsi la souplesse de la peau.
* **Purifiant & Astringent** : Ses propriétés naturelles aident à resserrer les pores et à affiner le grain de peau.

---

## ⚖️ Transparence Scientifique & Limites
* **Action Globale** : C'est un excellent ingrédient de fond pour les soins anti-âge globaux, mais il est moins "spectaculaire" à court terme qu'un exfoliant acide.
* **Origine** : Privilégier les extraits obtenus par distillation douce pour conserver la richesse des polyphénols.

---

## 🛡️ Précautions & Sécurité
* **Sécurité Cutanée** : Très bonne tolérance. Son profil riche en antioxydants en fait un allié de choix pour les peaux matures et urbaines.
`,
  },

  {
    name: 'Vigne du Tonnerre (Tripterygium Wilfordii Callus Extract)',
    slug: INGREDIENT_SLUGS.TRIPTERYGIUM_WILFORDII_CALLUS_EXTRACT,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Un extrait de culture cellulaire (callus) utilisé en médecine traditionnelle pour ses propriétés anti-inflammatoires puissantes et sa capacité de régénération.',
    content: `
# Tripterygium Wilfordii : La Biotechnologie de Résilience

Cet extrait issu de la culture de cellules souches (callus) de la "Vigne du Tonnerre" est une prouesse biotechnologique visant à calmer les inflammations chroniques cutanées (inflamm-aging).

---

## 🔬 L'Action de Défense Avancée
* **Anti-Inflammatoire Puissant** : Aide à réduire les cytokines pro-inflammatoires, responsables du vieillissement accéléré et des rougeurs chroniques.
* **Protection du Capital Cellulaire** : Les cellules souches de callus offrent une concentration en actifs protecteurs supérieure à la plante sauvage.
* **Réparation Cutanée** : Soutient les processus d'auto-réparation de la peau face aux agressions majeures.

---

## ⚖️ Transparence Scientifique & Limites
* **Innovation Callus** : L'utilisation de cellules souches (callus) garantit un actif pur, sans les toxines parfois présentes dans la plante entière à l'état sauvage.
* **Coût** : C'est un ingrédient de haute technologie, souvent réservé aux formulations premium.

---

## 🛡️ Précautions & Sécurité
* **Sécurité Cutanée** : L'extrait de callus est spécifiquement purifié pour la cosmétique afin d'éliminer tout risque de toxicité, offrant ainsi une sécurité optimale pour les peaux sensibles.
`,
  },
  {
    name: 'Laminaire (Laminaria Digitata)',
    slug: INGREDIENT_SLUGS.LAMINARIA_DIGITATA,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Une algue brune riche en alginates et sels minéraux, idéale pour revitaliser la barrière cutanée et maintenir l’équilibre osmotique.',
    content: `
# Laminaria Digitata : Le Concentré de Mer

Surnommée "fouet des sorcières", cette algue brune concentre les oligo-éléments de l'océan pour offrir une recharge minérale intense aux peaux fatiguées.

---

## 🔬 L'Action Reminéralisante
* **Équilibre Hydrique** : Grâce à ses alginates, elle aide la peau à retenir l'eau et à maintenir son hydratation.
* **Revitalisation** : Apporte du magnésium, du potassium et de l'iode, essentiels au métabolisme cellulaire.
* **Apaisement** : Aide à calmer les sensations d'échauffement après une exposition environnementale.

---

## ⚖️ Transparence Scientifique & Limites
* **Usage Polyvalent** : Très efficace pour les peaux déshydratées, mais son action sur les rides profondes est indirecte (via l'hydratation).
* **Pureté** : Comme toutes les grandes algues, la qualité de l'extrait dépend de la pureté des eaux de récolte.

---

## 🛡️ Précautions & Sécurité
* **Sécurité Cutanée** : Excellente tolérance. C’est un ingrédient de base sûr pour les peaux mixtes à sèches.
`,
  },

  {
    name: 'Fucus (Fucus Vesiculosus)',
    slug: INGREDIENT_SLUGS.FUCUS_VESICULOSUS,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Une algue brune riche en iode et polyphénols, utilisée pour drainer les tissus et décongestionner les zones gonflées comme le contour des yeux.',
    content: `
# Fucus Vesiculosus : L'Allié Détox

Le Fucus est une algue de bord de mer qui contient des fucoïdanes, des molécules reconnues pour leurs propriétés anti-inflammatoires et décongestionnantes.

---

## 🔬 L'Action Drainante
* **Anti-Poches** : Favorise la microcirculation, aidant ainsi à réduire l'apparence des poches sous les yeux.
* **Détoxification** : Aide à l'élimination des toxines pour une peau plus saine et un teint moins terne.
* **Élasticité** : Combat la dégradation du collagène induite par les enzymes cutanées.

---

## ⚖️ Transparence Scientifique & Limites
* **Ciblage Précis** : Particulièrement efficace dans les soins contour des yeux ou les soins silhouette (corps).
* **Odeur** : L'extrait brut peut avoir une note marine terreuse typique.

---

## 🛡️ Précautions & Sécurité
* **Sécurité Cutanée** : Très sûr en application locale. Idéal pour les peaux présentant des signes de fatigue ou de congestion.
`,
  },

  {
    name: 'Alaria (Alaria Esculenta)',
    slug: INGREDIENT_SLUGS.ALARIA_ESCULENTA,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Une algue brune surnommée "Wakamé de l’Atlantique", capable de booster la synthèse de collagène et de protéger l’élasticité de la peau.',
    content: `
# Alaria Esculenta : Le Booster de Fermeté

Cette algue survit dans des courants forts, développant des molécules de résistance qui, appliquées sur la peau, stimulent la structure dermique.

---

## 🔬 L'Action Anti-Âge
* **Boost de Collagène** : Stimule la production d'acide hyaluronique et de collagène pour une peau plus ferme.
* **Action Anti-Élastase** : Empêche la dégradation des fibres élastiques, luttant ainsi contre le relâchement.
* **Protection Antioxydante** : Riche en omégas 3, 6 et 9 pour renforcer la barrière lipidique.

---

## ⚖️ Transparence Scientifique & Limites
* **Alternative Bio** : Souvent utilisée comme alternative naturelle aux actifs anti-âge synthétiques.
* **Résultats** : Demande une application régulière pour voir un effet "tenseur" réel.

---

## 🛡️ Précautions & Sécurité
* **Sécurité Cutanée** : Ingrédient haut de gamme très doux, recommandé pour les soins anti-âge préventifs et curatifs.
`,
  },

  {
    name: 'Wakamé (Undaria Pinnatifida)',
    slug: INGREDIENT_SLUGS.UNDARIA_PINNATIFIDA,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Une algue brune emblématique qui protège la matrice extracellulaire et réactive les gènes de jeunesse de la peau.',
    content: `
# Undaria Pinnatifida : L'Architecte Cutané

Le Wakamé contient du fucose sulfaté, une molécule qui aide à maintenir l'architecture de la peau en protégeant son capital d'élastine.

---

## 🔬 L'Action Structurelle
* **Protection du Collagène** : Aide à maintenir l'intégrité des fibres de soutien de la peau.
* **Hydratation** : Riche en polysaccharides qui captent l'eau en surface.
* **Antioxydant** : Protège contre le stress oxydatif causé par l'environnement.

---

## ⚖️ Transparence Scientifique & Limites
* **Sourcing** : Très prisé en "Blue Beauty" pour son aspect renouvelable et sa culture durable.
* **Action Globale** : Un excellent actif de soutien qui travaille sur la densité plutôt que sur un effet de surface immédiat.

---

## 🛡️ Précautions & Sécurité
* **Sécurité Cutanée** : Très bien toléré, convient parfaitement aux peaux matures et déshydratées.
`,
  },

  {
    name: "Mousse d'Irlande (Chondrus Crispus)",
    slug: INGREDIENT_SLUGS.CHONDRUS_CRISPUS,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Une algue rouge filmogène qui protège la peau de la déshydratation et apporte un fini soyeux naturel aux formules.',
    content: `
# Chondrus Crispus : Le Bouclier Naturel

Cette algue rouge, source de carraghénanes, est la référence pour créer un film protecteur non occlusif à la surface de l'épiderme.

---

## 🔬 L'Action Protectrice
* **Hydratation "Seconde Peau"** : Forme un voile respirant qui limite la perte d'eau tout au long de la journée.
* **Texture Soyeuse** : Apporte un glissant exceptionnel aux produits sans utiliser de silicones.
* **Minéralisation** : Contient des oligo-éléments qui fortifient la peau.

---

## ⚖️ Transparence Scientifique & Limites
* **Action de Surface** : Agit principalement sur la barrière cutanée. C'est un excellent protecteur mais pas un correcteur de rides profond.
* **Rôle Formulateur** : Souvent utilisé pour améliorer la sensorialité du produit fini.

---

## 🛡️ Précautions & Sécurité
* **Sécurité Cutanée** : Ingrédient inerte et très sûr, idéal pour toutes les peaux, même les plus réactives.
`,
  },

  {
    name: 'Dulse (Palmaria Palmata)',
    slug: INGREDIENT_SLUGS.PALMARIA_PALMATA,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Une algue rouge reconnue pour ses propriétés tonifiantes qui favorisent une peau lumineuse et unifiée.',
    content: `
# Palmaria Palmata : L'Activateur d'Éclat

La Dulse est riche en vitamines (A, B12) et en minéraux. Elle est utilisée pour stimuler la vitalité de la peau et clarifier le teint.

---

## 🔬 L'Action Éclat
* **Microcirculation** : Aide à tonifier les capillaires cutanés, réduisant ainsi les rougeurs et le teint terne.
* **Nutrition** : Apporte les nutriments nécessaires à la régénération cellulaire.
* **Action Unifiante** : Aide à retrouver un teint plus homogène et moins congestionné.

---

## ⚖️ Transparence Scientifique & Limites
* **Éclat Immédiat** : Très efficace pour un effet "bonne mine" après quelques jours d'utilisation.
* **Complémentarité** : Gagne à être associée à des antioxydants comme la Vitamine C.

---

## 🛡️ Précautions & Sécurité
* **Sécurité Cutanée** : Très douce. C’est l’algue idéale pour les peaux fatiguées ou urbaines.
`,
  },

  {
    name: 'Jania Rubens (Algue Rouge Calcaire)',
    slug: INGREDIENT_SLUGS.JANIA_RUBENS,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Une algue rouge rare à structure calcaire, capable de recharger les cellules en énergie et d’offrir une hydratation ultra-ciblée.',
    content: `
# Jania Rubens : La Recharge Énergétique

Cette algue pompon est unique par sa concentration en minéraux et sa capacité à stimuler les aquaporines (canaux d'hydratation de la peau).

---

## 🔬 L'Action Cellulaire
* **Anti-Fatigue** : Aide à augmenter l'ATP cellulaire (énergie) pour une peau qui récupère plus vite.
* **Hydratation Intense** : Favorise la circulation de l'eau entre les cellules de l'épiderme.
* **Lissage** : Contribue à réduire les marques de fatigue et les ridules de déshydratation.

---

## ⚖️ Transparence Scientifique & Limites
* **Culture Durable** : Souvent cultivée en photobioréacteurs pour préserver les ressources marines naturelles.
* **Spécificité** : Très efficace sur les signes de fatigue passagers.

---

## 🛡️ Précautions & Sécurité
* **Sécurité Cutanée** : Excellente. Ingrédient très pur et hautement compatible avec les peaux sensibles.
`,
  },

  {
    name: 'Laitue de Mer (Ulva Lactuca)',
    slug: INGREDIENT_SLUGS.ULVA_LACTUCA,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Une algue verte riche en magnésium et acides aminés, qui aide à maintenir l’élasticité de la peau en limitant sa dégradation.',
    content: `
# Ulva Lactuca : Le Ressort de l'Épiderme

La Laitue de Mer est une algue verte qui possède des propriétés "élastine-like", essentielles pour garder une peau souple et rebondie.

---

## 🔬 L'Action Souplesse
* **Protection de l'Élastine** : Inhibe les enzymes qui dégradent les fibres élastiques de la peau.
* **Reminéralisation** : Apporte du magnésium, un cofacteur clé pour la réparation cutanée.
* **Énergie** : Stimule le métabolisme des cellules pour un teint plus frais.

---

## ⚖️ Transparence Scientifique & Limites
* **Prévention** : Idéale pour prévenir les premiers signes du relâchement.
* **Texture** : Souvent utilisée pour son côté rafraîchissant dans les gels et sérums.

---

## 🛡️ Précautions & Sécurité
* **Sécurité Cutanée** : Ingrédient très doux et naturel, adapté à tous les âges.
`,
  },

  {
    name: 'Chlorelle (Chlorella Vulgaris)',
    slug: INGREDIENT_SLUGS.CHLORELLA_VULGARIS,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Une micro-algue verte riche en chlorophylle et peptides, utilisée pour réduire la visibilité des vaisseaux (cernes) et raffermir la peau.',
    content: `
# Chlorella Vulgaris : Le Correcteur Vert

La Chlorelle est une micro-algue reconnue pour sa capacité à stimuler la synthèse du collagène et à améliorer l'aspect des imperfections vasculaires.

---

## 🔬 L'Action Correctrice
* **Effet Anti-Cernes** : Aide à masquer et réduire la visibilité des petits vaisseaux sanguins (cernes bleus).
* **Fermeté** : Stimule la régénération des tissus dermiques.
* **Détox** : Aide la peau à se débarrasser des polluants accumulés.

---

## ⚖️ Transparence Scientifique & Limites
* **Ciblage Vasculaire** : Très efficace pour la zone du regard, moins sur les taches de soleil pigmentaires.
* **Richesse Nutritionnelle** : Une source incroyable d'acides aminés.

---

## 🛡️ Précautions & Sécurité
* **Sécurité Cutanée** : Ingrédient très sûr, fréquemment utilisé dans les soins contour des yeux.
`,
  },

  {
    name: 'Spiruline (Spirulina Platensis)',
    slug: INGREDIENT_SLUGS.SPIRULINA_PLATENSIS,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Une micro-algue bleue (cyanobactérie) considérée comme un super-aliment, offrant une dose massive de protéines et d’antioxydants.',
    content: `
# Spiruline : Le Concentré Vital

La Spiruline est l'un des ingrédients les plus complets pour nourrir la peau et lutter contre le stress oxydatif.

---

## 🔬 L'Action Revitalisante
* **Nutrition Intense** : Apporte des protéines (70%), des vitamines et du fer pour réparer la peau.
* **Antioxydant** : La phycocyanine protège les cellules contre le vieillissement prématuré.
* **Éclat** : Redonne de la vitalité aux teints ternes et asphyxiés.

---

## ⚖️ Transparence Scientifique & Limites
* **Sensoricité** : Sa couleur bleu-vert intense et son odeur marine sont typiques et marquent souvent les formules.
* **Usage** : Excellente en cure pour "recharger" la peau.

---

## 🛡️ Précautions & Sécurité
* **Sécurité Cutanée** : Très sûre, idéale pour les peaux fatiguées, stressées ou après une exposition solaire.
`,
  },

  {
    name: 'Dunaliella Salina (Micro-algue Orangée)',
    slug: INGREDIENT_SLUGS.DUNALIELLA_SALINA,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Une micro-algue qui survit dans les milieux hypersalins en produisant une quantité phénoménale de bêta-carotène.',
    content: `
# Dunaliella Salina : L'Éclat Solaire

Cette micro-algue produit des caroténoïdes pour se protéger des UV intenses. En cosmétique, elle offre un effet protecteur et unificateur de teint.

---

## 🔬 L'Action Protectrice
* **Bouclier UV** : Aide la peau à lutter contre les radicaux libres générés par le soleil.
* **Effet Bonne Mine** : Sa richesse en bêta-carotène aide à illuminer le teint naturellement.
* **Régénération** : Favorise le renouvellement cellulaire pour une peau plus lisse.

---

## ⚖️ Transparence Scientifique & Limites
* **Photo-protection** : C'est un complément antioxydant précieux, mais elle ne remplace en aucun cas une crème solaire (SPF).
* **Couleur** : Donne souvent une légère teinte dorée/orangée naturelle aux soins.

---

## 🛡️ Précautions & Sécurité
* **Sécurité Cutanée** : Très bien tolérée. Parfaite pour les sérums de jour et les soins préparateurs au soleil.
`,
  },
  {
    name: 'Algue Bleue (Aphanizomenon Flos-aquae)',
    slug: INGREDIENT_SLUGS.APHANIZOMENON_FLOS_AQUAE,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
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


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
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


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
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
    slug: INGREDIENT_SLUGS.HUILE_BABASSU,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
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


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
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


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
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
    category: INGREDIENT_CATEGORIES.EMOLLIENT,
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


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
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


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
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
    category: INGREDIENT_CATEGORIES.EXCIPIENT,
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


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description: "Chaînes d'acides aminés qui boostent le collagène et raffermissent.",
    content: `# Peptides

Signalent à la peau de produire plus de collagène, élastine et acide hyaluronique. Très utilisés en anti-âge.

## INCI
varie (Palmitoyl Tripeptide-1, Copper Tripeptide-1, Matrixyl…)

## Concentration typique
variable selon le type (souvent 1-5%).`,
  },
  {
    name: 'Spinacia Oleracea (Spinach) Leaf Extract',
    slug: INGREDIENT_SLUGS.SPINACIA_OLERACEA,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Extrait de feuilles d\'épinard riche en antioxydants (flavonoïdes, caroténoïdes), protège la peau des agressions environnementales et de la pollution.',
    content: `
# Spinacia Oleracea (Extrait d'Épinard)

Extrait aqueux ou glycériné des feuilles d'épinard, riche en flavonoïdes (lutéine, quercétine), caroténoïdes et chlorophylle.

## INCI
**SPINACIA OLERACEA LEAF EXTRACT**

## Bienfaits
- **Antioxydant anti-pollution** : Piège les particules fines (PM2.5) et les radicaux libres
- **Protection UV complémentaire** : Complète l'action des filtres solaires
- **Teint** : Améliore l'éclat et l'uniformité du teint
- **Tolérance** : Bien toléré, adapté aux peaux sensibles
    `,
  },
  {
    name: 'Taraxacum Officinale (Dandelion) Leaf Extract',
    slug: INGREDIENT_SLUGS.TARAXACUM_OFFICINALE,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Extrait de pissenlit aux propriétés détoxifiantes et antioxydantes, aide à purifier la peau des toxines environnementales.',
    content: `
# Taraxacum Officinale (Extrait de Pissenlit)

Extrait issu des feuilles et racines de pissenlit, plante aux vertus dépuratives traditionnelles reconnues.

## INCI
**TARAXACUM OFFICINALE (DANDELION) LEAF EXTRACT**

## Bienfaits
- **Détoxifiant** : Aide à éliminer les toxines cutanées et les dépôts de pollution
- **Antioxydant** : Riche en flavonoïdes et acides phénoliques
- **Anti-âge** : Protège les fibres de collagène et d'élastine
- **Peau nette** : Contribue à l'éclat du teint
    `,
  },
  {
    name: 'Aristotelia Chilensis (Maqui Berry) Fruit Extract',
    slug: INGREDIENT_SLUGS.ARISTOTELIA_CHILENSIS,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Extrait de maqui berry du Chili, l\'un des antioxydants les plus puissants connus, protège contre le stress oxydatif et la pollution.',
    content: `
# Aristotelia Chilensis (Maqui Berry)

Le **Maqui Berry** (Aristotelia chilensis) est un superfruit chilien avec l'un des scores ORAC (capacité antioxydante) les plus élevés au monde.

## INCI
**ARISTOTELIA CHILENSIS FRUIT EXTRACT**

## Composition
- **Delphinidines** : Anthocyanines spécifiques, antioxydants très puissants
- Polyphénols, proanthocyanidines

## Bienfaits
- **Antioxydant puissant** : Neutralise les radicaux libres, protège contre la pollution
- **Anti-vieillissement** : Préserve le collagène et l'élastine
- **Anti-pollution** : Réduit les dommages des particules fines et de l'ozone
- **Éclat** : Améliore l'uniformité et la luminosité du teint
    `,
  },
  {
    name: 'Tephrosia Purpurea Seed Extract',
    slug: INGREDIENT_SLUGS.TEPHROSIA_PURPUREA,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Extrait de graines de Tephrosia purpurea aux propriétés anti-pollution et protectrices contre les facteurs environnementaux.',
    content: `
# Tephrosia Purpurea Seed Extract

Actif d'origine botanique issu d'une légumineuse utilisée dans la médecine ayurvédique, reconnu pour ses propriétés anti-pollution en cosmétique moderne.

## INCI
**TEPHROSIA PURPUREA SEED EXTRACT**

## Bienfaits
- **Anti-pollution urbaine** : Forme un bouclier contre les particules fines et les métaux lourds
- **Antioxydant** : Riche en flavonoïdes (orobol, tectorigenin)
- **Protection UV complémentaire** : Réduit les dommages photo-induits
- **Peau sensible** : Bonne tolérance, adapté aux formules apaisantes
    `,
  },
  {
    name: 'Eau Thermale Avène (Avène Thermal Spring Water)',
    slug: INGREDIENT_SLUGS.AVENE_THERMAL_SPRING_WATER,


    type: 'skincare',
    category: INGREDIENT_CATEGORIES.ACTIF,
    description:
      'Eau thermale unique d\'Avène (Hérault), reconnue pour ses propriétés apaisantes et anti-irritantes exceptionnelles sur les peaux sensibles et réactives.',
    content: `
# Eau Thermale Avène

L'**Eau Thermale d'Avène** est captée à la source Saint-Odile, dans le village d'Avène (Hérault, France). Elle est l'actif signature de toute la gamme Avène.

## INCI
**AVÈNE THERMAL SPRING WATER** (ou AVENE AQUA)

## Composition spécifique
- Faiblement minéralisée (TDS ~260 mg/L), pH neutre ~7.5
- Riche en silicates et calcium, pauvre en sodium
- Microbiome unique étudié (Aquaphilus dolomiae, maintenant base de I-modulia)

## Bienfaits prouvés (études cliniques)
- **Apaisant** : Calme les démangeaisons, les tiraillements et l'inconfort
- **Anti-irritant** : Réduit la réactivité cutanée
- **Tolérance** : Adaptée aux peaux les plus sensibles, atopiques, allergiques
- **Barrière cutanée** : Soutient la restauration du film hydrolipidique

## Utilisation
- Brume directement sur le visage pour calmer une peau irritée
- Ingrédient base dans la quasi-totalité des soins Avène
- Convient grossesse, bébés, peaux post-actes (laser, peelings, chirurgie)
    `,
  },
]
