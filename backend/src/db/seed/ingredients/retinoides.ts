import { INGREDIENT_SLUGS } from './ingredient-slugs'
import type { IngredientInput } from './seed-ingredients'

export const RETINOIDES: IngredientInput[] = [
  {
    name: 'Retinyl Acetate',
    slug: INGREDIENT_SLUGS.RETINYL_ACETATE,
    category: 'initiation douce au renouvellement',
    description:
      'Ester de vitamine A stable et discret, offrant une introduction tout en douceur au monde des rétinoïdes pour les peaux qui privilégient la sérénité et la constance.',
    content: `
# Retinyl Acetate

Parmi les esters de rétinol les plus stables et les plus couramment employés, le Retinyl Acetate se distingue par sa résistance exemplaire à l’oxydation et à la lumière. Il incarne l’approche alpine patiente : un soutien discret qui accompagne le renouvellement cutané sans jamais imposer de virage brusque.

## INCI
**Retinyl Acetate**

## Points forts
- **Stabilité hors pair** : Excellente résistance à la dégradation, parfait pour les formulations exposées ou les soins longue conservation.
- **Tolérance élevée** 🛡️ : Parmi les formes les plus douces, quasi inexistante irritation, idéal pour peaux sensibles ou réactives.
- **Effet nourrissant subtil** : Contribue à l’éclat et à la douceur quotidienne sans perturber l’équilibre cutané.
- **Accessibilité** : Excellent dans les soins grand public ou les routines d’initiation.

## Limites et transparence ⚖️
La conversion en acide rétinoïque nécessite trois étapes enzymatiques, rendant son efficacité très modeste et progressive. Les preuves cliniques d’impact significatif sur les rides, la fermeté ou les taches restent faibles et souvent inférieures à celles des esters comme le propionate ou du rétinol libre. Il agit plus comme un préventif doux que comme un actif restructurant profond ; des études rigoureuses supplémentaires sont nécessaires pour confirmer un bénéfice mesurable à long terme.

## Rôle dans les soins
Ingrédient discret mais fiable dans les crèmes jour, les laits corporels et les formules « premiers gestes » en vitamine A, où la stabilité prime sur la puissance immédiate.

## Utilisation
- **Cible** : Peaux très sensibles, routines maintenance douce, peaux matures préférant la lenteur et la sécurité.
- **Type de soin** : Crèmes hydratantes quotidiennes, soins corps, émulsions légères, formules anti-âge basiques.
`,
  },
  {
    name: 'Retinyl Linoleate',
    slug: INGREDIENT_SLUGS.RETINYL_LINOLLEATE,
    category: 'initiation douce au renouvellement',
    description:
      'Ester rare et raffiné de vitamine A, lié à l’acide linoléique pour une touche de confort lipidique et une douceur renforcée dans les soins les plus attentifs.',
    content: `
# Retinyl Linoleate

Forme moins répandue des esters de rétinol, le Retinyl Linoleate associe la vitamine A à l’acide linoléique essentiel, apportant une dimension nourrissante et apaisante. Il est choisi par les formulateurs qui souhaitent allier subtilité rétinoidique et renforcement de la barrière lipidique.

## INCI
**Retinyl Linoleate**

## Points forts
- **Tolérance optimale** 🛡️ : Très faible potentiel irritant, adapté aux peaux les plus délicates ou sujettes à la sécheresse.
- **Soutien barrière** : L’acide linoléique contribue à restaurer les lipides cutanés, renforçant confort et hydratation.
- **Stabilité satisfaisante** : Bonne résistance en formulation, compatible avec des soins quotidiens.
- **Approche équilibrée** : Effet doux sur l’éclat et la texture sans compromettre la sérénité cutanée.

## Limites et transparence ⚖️
Comme les autres esters, sa conversion en forme active est lente et limitée (trois étapes). Les données cliniques spécifiques sur son efficacité anti-âge ou anti-imperfections sont rares et modestes ; il est souvent considéré comme l’un des plus faibles de la famille des rétinoïdes esters. Son usage reste plus traditionnel que transformateur, avec un besoin persistant d’études comparatives robustes.

## Rôle dans les soins
Présent dans certaines crèmes premium ou formules « clean beauty » qui valorisent les acides gras essentiels, il offre un voile protecteur et préventif.

## Utilisation
- **Cible** : Peaux sèches à très sèches, sensibles, routines douces et nourrissantes.
- **Type de soin** : Crèmes riches, baumes réparateurs, soins corps, émulsions anti-âge progressives.
`,
  },
  {
    name: 'Isotretinoin (topique)',
    slug: INGREDIENT_SLUGS.ISOTRETINOIN,
    category: 'action ciblée & prescription',
    description:
      'Isomère 13-cis de l’acide rétinoïque, utilisé en topique pour des indications spécifiques sévères, sous contrôle médical strict.',
    content: `
# Isotretinoin (topique)

Forme topique de l’isotretinoin (13-cis-acide rétinoïque), ce rétinoïde puissant est principalement connu par voie orale mais existe en applications locales pour des cas ciblés. Il agit avec précision sur les mécanismes de kératinisation et d’inflammation, mais reste réservé à un usage encadré.

## INCI
**Isotretinoin** (souvent en combinaison, ex. avec érythromycine)

## Points forts
- **Efficacité sur acné sévère** : Réduit comédons, inflammation et séborrhée dans les formes résistantes (études limitées topiques).
- **Action kératolytique** : Favorise le renouvellement et désobstrue les pores avec force.
- **Potentiel anti-inflammatoire** : Peut atténuer les lésions inflammatoires localisées.

## Limites et transparence ⚖️
La forme topique est beaucoup moins courante et étudiée que l’orale (Accutane®). Irritation locale fréquente (sécheresse, rougeurs, desquamation). Risque tératogène majeur → strictement contre-indiqué en grossesse (catégorie X). Usage prescription uniquement, souvent en combinaison antibiotique. Les preuves d’efficacité topique restent limitées comparées à la trétinoïne ou l’adapalène ; la majorité des données concernent la voie orale avec effets systémiques importants (sécheresse extrême, impacts lipidiques, hépatiques, psychologiques possibles).

## Rôle dans les soins
Actif médical rare en topique, principalement pour acné nodulaire ou conglobata réfractaire, sous surveillance dermatologique étroite.

## Utilisation
- **Cible** : Acné sévère localisée, cas résistants aux traitements conventionnels.
- **Type de soin** : Gels ou crèmes sur ordonnance, souvent combinés, cures courtes et supervisées.
`,
  },
  {
    name: 'Alitretinoin',
    slug: INGREDIENT_SLUGS.ALITRETINOIN,
    category: 'régénération & apaisement ciblé',
    description:
      'Rétinoïde pan-agoniste (9-cis-acide rétinoïque), référence systémique pour l’eczéma chronique sévère des mains, avec un profil d’efficacité reconnu.',
    content: `
# Alitretinoin

Alitretinoin, ou 9-cis-acide rétinoïque, est un rétinoïde endogène-like qui module avec finesse la différenciation kératinocytaire et l’inflammation. Il s’impose comme l’un des rares traitements systémiques spécifiquement indiqués pour l’eczéma chronique des mains réfractaire.

## INCI
**Alitretinoin**

## Points forts
- **Efficacité démontrée sur eczéma des mains** 🔬 : Réduit significativement signes et symptômes (hyperkératose, fissures, prurit) dans les formes sévères réfractaires aux corticoïdes topiques puissants (essais pivots BACH).
- **Action immunomodulatrice** : Améliore la réponse TH2 et apaise l’inflammation chronique.
- **Rémission possible** : Jusqu’à 48 % de patients « clair ou presque clair » à 30 mg/j dans les études.
- **Profil relativement maîtrisé** : Moins d’effets systémiques sévères que certains rétinoïdes plus anciens.

## Limites et transparence ⚖️
Usage exclusivement oral et sur ordonnance (pas topique courant en skincare anti-âge). Effets secondaires fréquents : céphalées, flush, hyperlipidémie, hypothyroïdie, sécheresse cutanée/muqueuse. Contre-indiqué en grossesse (tératogène). Adhésion limitée dans la vraie vie (durée médiane ~3-4 mois dans certaines cohortes). Efficace surtout sur les formes hyperkératosiques ; résultats variables sur les phénotypes vésiculeux ou non-hyperkératosiques. Besoin de monitoring biologique régulier.

## Rôle dans les soins
Traitement de recours dermatologique pour eczéma chronique des mains invalidant, non contrôlé par les soins locaux classiques.

## Utilisation
- **Cible** : Eczéma chronique sévère des mains (hyperkératosique, dyshidrosique, fingertip), réfractaire.
- **Type de soin** : Capsules orales sur prescription, cures de 12-24 semaines avec suivi médical.
`,
  },
  {
    name: 'Retinyl Palmitate',
    slug: INGREDIENT_SLUGS.RETINYL_PALMITATE,
    category: 'initiation douce au renouvellement',
    description:
      'Ester de vitamine A le plus doux et stable, entrée élégante et progressive dans l’univers des rétinoïdes pour les peaux sensibles en quête d’éclat subtil et de texture affinée.',
    content: `
  # Retinyl Palmitate

  Forme esterifiée la plus courante de la vitamine A en cosmétique, le Retinyl Palmitate incarne la douceur alpine : stable, apaisant et respectueux des barrières cutanées les plus délicates. Il offre un voile protecteur qui accompagne lentement le renouvellement cellulaire sans jamais brusquer la peau.

  ## INCI
  **Retinyl Palmitate**

  ## Points forts
  - **Tolérance exceptionnelle** 🛡️ : Quasi aucune irritation, parfait pour les débutants, peaux réactives ou sensibles.
  - **Stabilité remarquable** : Résiste bien à la lumière et à l’oxydation, idéal dans les formules du quotidien.
  - **Effet nourrissant & hydratant** : Contribue au confort cutané tout en soutenant subtilement l’éclat et la douceur.
  - **Synergie accessible** : Excellent compagnon des actifs hydratants et apaisants dans les soins d’entrée de gamme.

  ## Limites et transparence ⚖️
  Sa conversion en acide rétinoïque actif est très lente et limitée (souvent < 5 %). Les preuves cliniques d’efficacité anti-âge significative restent modestes comparées aux formes plus directes (rétinol, HPR ou rétinoïdes sur ordonnance). Il agit davantage comme un soutien doux et préventif que comme un actif transformateur puissant. Des études supplémentaires rigoureuses sont encore nécessaires pour quantifier son impact à long terme.

  ## Rôle dans les soins
  Ingrédient de choix dans les crèmes jour, laits corporels et soins « premiers pas » en rétinoides, il initie la peau avec bienveillance et constance.

  ## Utilisation
  - **Cible** : Peaux très sensibles, débutants, routine maintenance douce, peaux matures qui préfèrent la progressivité.
  - **Type de soin** : Crèmes hydratantes anti-âge basiques, soins quotidiens tout public, formules solaires et corps.
  `,
  },
  {
    name: 'Hydroxypinacolone Retinoate (HPR)',
    slug: INGREDIENT_SLUGS.HYDROXYPINACOLONE_RETINOATE,
    category: 'renouvellement cellulaire & anti-âge',
    description:
      'Rétinoïde de nouvelle génération à action directe, alliant efficacité prouvée et tolérance exceptionnelle pour un renouvellement cutané harmonieux et sans compromis.',
    content: `
  # Hydroxypinacolone Retinoate (HPR)

  Issu de l’innovation en biotechnologie des rétinoïdes, l’Hydroxypinacolone Retinoate représente l’une des formes les plus sophistiquées de vitamine A topique. Contrairement aux formes classiques, il se lie directement aux récepteurs rétinoïdes sans nécessiter de conversion enzymatique, offrant une action ciblée, rapide et élégante sur la peau.

  ## INCI
  **Hydroxypinacolone Retinoate** (souvent commercialisé sous le nom Granactive Retinoid™)

  ## Points forts
  - **Renouvellement cellulaire optimisé** 🔬 : Stimule la prolifération des kératinocytes et la synthèse de collagène avec une grande efficacité.
  - **Tolérance remarquable** 🛡️ : Significativement moins irritant que le rétinol classique ou la trétinoïne, idéal pour les peaux sensibles ou les débutants.
  - **Action anti-âge globale** : Améliore rides, texture, élasticité et éclat selon des études cliniques récentes (2024-2026).
  - **Stabilité supérieure** : Résiste mieux à l’oxydation, permettant des formules plus durables et performantes.

  ## Limites et transparence ⚖️
  Les études cliniques sont prometteuses et montrent des résultats comparables au rétinol à des concentrations plus faibles, avec une excellente tolérance. Cependant, le corpus de données reste plus modeste que pour la trétinoïne historique (gold standard depuis des décennies). Comme tous les rétinoïdes, il est déconseillé pendant la grossesse et l’allaitement (usage externe uniquement). Des essais à plus long terme sur des populations diverses sont encore souhaitables.

  ## Rôle dans les soins
  Actif premium pour les sérums et crèmes anti-âge quotidiens, particulièrement apprécié dans les formulations modernes recherchant le juste équilibre entre performance et douceur.

  ## Utilisation
  - **Cible** : Peaux matures, perte de fermeté, texture irrégulière, premières rides, peaux sensibles aux rétinoïdes traditionnels.
  - **Type de soin** : Sérums légers, crèmes de nuit, traitements anti-âge progressifs, routines complètes sans ordonnance.
  `,
  },
  {
    name: 'Tazarotene',
    slug: INGREDIENT_SLUGS.TAZAROTENE,
    category: 'puissance prescription & régénération intense',
    description:
      'Rétinoïde de synthèse ultra-puissant, reconnu pour son action ciblée et profonde sur l’acné sévère, le psoriasis et le photo-vieillissement marqué.',
    content: `
  # Tazarotene

  Forme prodrug de l’acide tazaroténique, ce rétinoïde de troisième génération incarne la puissance contrôlée. Il agit directement sur les récepteurs RAR-β et RAR-γ pour une régénération cutanée spectaculaire, tout en restant un allié de confiance sous supervision dermatologique.

  ## INCI
  **Tazarotene**

  ## Points forts
  - **Action anti-acné puissante** : Efficace sur les comédons, l’inflammation et les cicatrices post-acné.
  - **Effet anti-âge supérieur** : Stimule fortement le collagène et l’élastine, atténue rides profondes et taches solaires.
  - **Sélectivité ciblée** : Meilleure efficacité sur certains aspects que la trétinoïne selon plusieurs études comparatives.
  - **Résultats visibles rapides** : Transformation cutanée souvent remarquée en 4 à 12 semaines.

  ## Limites et transparence ⚖️
  Irritation cutanée très marquée au début (rougeurs, desquamation, sécheresse). Fortement contre-indiqué pendant la grossesse (catégorie X). Usage exclusivement sur ordonnance et sous suivi médical. Les preuves sont solides pour l’acné et le photo-vieillissement, mais la tolérance limite son usage quotidien chez les peaux sensibles.

  ## Rôle dans les soins
  Actif médical de référence pour les cas sévères où les formes OTC ne suffisent plus. Il redonne densité et clarté à la peau lorsqu’il est bien maîtrisé.

  ## Utilisation
  - **Cible** : Acné sévère, psoriasis, photo-vieillissement avancé, peaux résistantes.
  - **Type de soin** : Traitements dermatologiques sur ordonnance, cures courtes ou alternées.
  `,
  },
  {
    name: 'Trifarotene',
    slug: INGREDIENT_SLUGS.TRIFAROTENE,
    category: 'régénération sélective & anti-acné corps',
    description:
      'Rétinoïde de 4e génération ultra-sélectif (RAR-γ), conçu pour une action précise sur l’acné du visage et du corps avec une tolérance améliorée.',
    content: `
  # Trifarotene

  Premier rétinoïde de quatrième génération, le Trifarotene est le fruit d’une ingénierie moléculaire sophistiquée. Sa sélectivité extrême pour le récepteur RAR-γ lui permet d’agir là où la peau en a le plus besoin, tout en limitant les effets secondaires systémiques.

  ## INCI
  **Trifarotene**

  ## Points forts
  - **Sélectivité intelligente** 🔬 : Cible spécifiquement le récepteur impliqué dans l’acné et le renouvellement cutané.
  - **Efficacité visage + corps** : Idéal pour l’acné du dos, des épaules et du torse.
  - **Tolérance relative** : Moins irritant que la trétinoïne ou le tazarotène chez de nombreux patients.
  - **Action anti-inflammatoire et anti-comédonienne** : Résultats cliniques rapides et durables.

  ## Limites et transparence ⚖️
  Toujours sur ordonnance. Irritation initiale possible (bien que généralement mieux tolérée). Contre-indiqué pendant la grossesse. Les études pivot (2019-2026) sont robustes pour l’acné, mais les données à très long terme sur l’anti-âge pur restent en cours d’accumulation.

  ## Rôle dans les soins
  Actif révolutionnaire pour traiter l’acné sur de grandes surfaces corporelles tout en préservant la qualité de vie du patient.

  ## Utilisation
  - **Cible** : Acné modérée à sévère du visage et du corps, peaux adultes, adolescents.
  - **Type de soin** : Crèmes ou gels dermatologiques sur prescription, application large surface.
  `,
  },
  {
    name: 'Retinyl Propionate',
    slug: INGREDIENT_SLUGS.RETINYL_PROPIONATE,
    category: 'initiation douce au renouvellement',
    description:
      'Ester de rétinol plus stable et légèrement plus actif que le palmitate, offrant un équilibre subtil entre douceur et efficacité progressive.',
    content: `
  # Retinyl Propionate

  Variante raffinée des esters de vitamine A, le Retinyl Propionate allie la stabilité légendaire des formes esterifiées à une conversion enzymatique un peu plus fluide. Il est le choix discret des formulateurs qui recherchent une touche d’efficacité supplémentaire sans sacrifier la tolérance.

  ## INCI
  **Retinyl Propionate**

  ## Points forts
  - **Stabilité renforcée** : Excellent en formulations exposées à la lumière ou à l’air.
  - **Tolérance élevée** 🛡️ : Idéal pour peaux sensibles ou routines longues durée.
  - **Effet progressif** : Soutient l’éclat et la texture avec une douceur incomparable.
  - **Synergie naturelle** : Se marie parfaitement avec niacinamide, céramides et antioxydants.

  ## Limites et transparence ⚖️
  Conversion toujours limitée (plus rapide que le palmitate mais bien inférieure au rétinol libre). Preuves d’efficacité anti-âge restent modestes et souvent issues d’études combinées. Ne remplace pas les formes plus puissantes pour des résultats spectaculaires.

  ## Rôle dans les soins
  Parfait dans les crèmes de jour, les sérums légers et les soins « everyday luxury » pour une routine anti-âge douce et durable.

  ## Utilisation
  - **Cible** : Peaux sensibles, routines maintenance, peaux qui tolèrent mal le rétinol pur.
  - **Type de soin** : Crèmes jour/nuit, émulsions légères, soins corps et visage quotidiens.
  `,
  },
  {
    name: 'Granactive Retinoid (HPR)',
    slug: INGREDIENT_SLUGS.GRANACTIVE_RETINOID,
    category: 'Anti-Âge & Imperfections',
    description:
      'Un ester d’acide rétinoïque direct qui offre les bénéfices de la vitamine A avec un risque d’irritation proche de zéro.',
    content: `
# Granactive Retinoid : La Douceur Puissante

Le **Granactive Retinoid** (Hydroxypinacolone Retinoate) est une forme de vitamine A qui se lie directement aux récepteurs de la peau sans avoir besoin de transformation enzymatique, contrairement au rétinol.

---

## ✨ Points Forts & Bénéfices
* **Anti-Acné & Anti-Âge** : Aide à réguler le sébum, resserrer les pores et lisser les rides simultanément.
* **Zéro Irritation** : Offre une alternative sérieuse pour ceux qui ne supportent pas le rétinol traditionnel (rougeurs, sécheresse).
* **Teint Homogène** : Très efficace sur les taches post-acné et l'hyperpigmentation.

---

## ⚖️ Transparence Scientifique & Limites
* **Confusion de nom** : Le "Granactive" est un complexe ; la concentration réelle en actif (HPR) est souvent plus faible que le pourcentage affiché sur le flacon.
* **Sensibilité** : Bien que moins irritant, il reste un actif puissant qui nécessite une introduction progressive.

---

## 🛡️ Précautions & Sécurité
* **Protection Solaire** : L'utilisation de rétinoïdes rend la peau plus sensible au soleil. L'application d'un SPF 30 ou 50 le lendemain matin est indispensable.
`,
  },
  {
    name: 'Sodium Retinoyl Hyaluronate',
    slug: INGREDIENT_SLUGS.SODIUM_RETINOYL_HYALURONATE,
    category: 'Hydratation & Renouvellement',
    description:
      'Un ingrédient innovant liant l’acide hyaluronique à l’acide rétinoïque pour hydrater tout en lissant le grain de peau.',
    content: `
# Sodium Retinoyl Hyaluronate : L'Hybride Repulpant

Cette molécule intelligente fusionne l'effet repulpant de l'**Acide Hyaluronique** avec l'action régénératrice des **Rétinoïdes**. Elle permet de traiter simultanément la déshydratation et les signes de l'âge.

---

## ✨ Points Forts & Bénéfices
* **Double Action** : Hydrate intensément les couches supérieures tout en accélérant le renouvellement cellulaire.
* **Amélioration du Grain de Peau** : Lisse les irrégularités et réduit l'apparence des pores sans assécher l'épiderme.
* **Vecteur de Pénétration** : L'acide hyaluronique sert de "cheval de Troie" pour amener le rétinoïde plus efficacement dans la peau.

---

## ⚖️ Transparence Scientifique & Limites
* **Action Ciblée** : Moins puissant sur les rides très profondes que le rétinol pur, mais bien supérieur pour l'éclat et la texture.
* **Nouveauté** : Ingrédient récent qui bénéficie de moins de recul historique que le rétinol classique.

---

## 🛡️ Précautions & Sécurité
* **Barrière Cutanée** : Très sûr, il est conçu pour ne pas altérer la barrière cutanée, limitant les risques de "purge" de début de traitement.
`,
  },
  {
    name: 'Rétinyl Rétinoate',
    slug: INGREDIENT_SLUGS.RETINYL_RETINOATE,
    category: 'Anti-Âge Révolutionnaire',
    description:
      'Une molécule hybride de nouvelle génération, plus puissante que le rétinol classique mais beaucoup mieux tolérée par la peau.',
    content: `
# Rétinyl Rétinoate : La Nouvelle Frontière de la Vitamine A

Le **Rétinyl Rétinoate** est une molécule brevetée combinant l'acide rétinoïque et le rétinol. Sa force réside dans sa capacité à délivrer des résultats anti-âge exceptionnels sans les effets secondaires habituels des rétinoïdes.

---

## ✨ Points Forts & Bénéfices
* **Synthèse de Collagène** : Stimule massivement la production de collagène pour réduire les rides et raffermir la peau.
* **Haute Tolérance** : Contrairement au rétinol, il ne provoque quasiment pas de desquamation ni d'irritation, idéal pour les peaux réactives.
* **Stabilité à la Lumière** : Fait rare pour un rétinoïde, il est photostable et peut techniquement être utilisé de jour.

---

## ⚖️ Transparence Scientifique & Limites
* **Coût** : C'est un ingrédient premium, souvent présent dans des soins haut de gamme en raison de sa technologie de synthèse complexe.
* **Patience** : Bien que plus rapide que le rétinol, les effets sur le remodelage profond demandent 8 à 12 semaines d'utilisation.

---

## 🛡️ Précautions & Sécurité
* **Grossesse** : Par principe de précaution, l'usage de dérivés de Vitamine A est déconseillé aux femmes enceintes ou allaitantes.
`,
  },
  {
    name: 'Rétinol',
    slug: INGREDIENT_SLUGS.RETINOL,
    category: 'actif',
    description:
      'Dérivé de la vitamine A, puissant anti-âge qui accélère le renouvellement cellulaire.',
    content: `
     # Rétinol

     Ingrédient star anti-âge et anti-acné, dérivé de la vitamine A. Il accélère le renouvellement cellulaire, stimule la production de collagène et d’élastine, réduit rides et ridules, affine le grain de peau, régule le sébum et unifie le teint pour une peau plus lisse, ferme et éclatante.

     ## INCI
     RETINOL

     ## Concentration typique
     0,1 à 0,3 % maximum dans les produits non rincés selon la réglementation européenne (SCCS).
     Débuter à **0,1-0,2 %** pour les peaux débutantes ou sensibles.
     Les formes micro-encapsulées ou stabilisées permettent parfois d’atteindre 0,5-1 % avec une meilleure tolérance.
     Augmenter progressivement après 4-8 semaines d’adaptation (période de « rétinisation »).

     ## Mécanisme d’action
     Le rétinol est une forme précurseur de la vitamine A. Une fois appliqué, il pénètre les couches cutanées et se convertit en deux étapes :
     1. Rétinol → Rétinaldéhyde
     2. Rétinaldéhyde → Acide rétinoïque (forme active)

     Il se lie alors aux récepteurs nucléaires des kératinocytes et des fibroblastes, boostant la synthèse de collagène, d’élastine et d’acide hyaluronique, accélérant le turnover cellulaire (effet kératolytique) et régulant la mélanine et la production de sébum.

     ## Bienfaits prouvés
     - **Anti-âge** : réduit visiblement rides et ridules, améliore fermeté et élasticité.
     - **Anti-acné & pores** : désobstrue les pores, diminue la production de sébum, action antibactérienne et anti-inflammatoire.
     - **Éclat & homogénéité** : atténue taches pigmentaires, cicatrices d’acné et hyperpigmentation, affine le grain de peau.
     - **Global** : effet antioxydant, prévient le photovieillissement, redonne luminosité et rebondi.

     Résultats visibles dès 4-6 semaines, optimaux après 3-6 mois d’utilisation régulière.

     ## Comment l’utiliser (guide débutant)
     - **Soir uniquement** (photosensibilisant).
     - Peau propre et parfaitement sèche.
     - Quantité : taille d’un petit pois pour tout le visage (éviter contour des yeux, ailes du nez et lèvres sauf produit spécifique).
     - **Protocole d’introduction** :
       Semaines 1-2 → 1-2 soirs/semaine
       Semaines 3-4 → 3 soirs/semaine
       Puis quotidien si tolérance bonne.
     - Technique « sandwich » pour minimiser les irritations : crème hydratante → rétinol → crème hydratante.
     - Le matin : toujours SPF 30+ large spectre (obligatoire !).
     - Compatible avec niacinamide, peptides, céramides, acide hyaluronique. Éviter dans un premier temps les AHA/BHA forts et la vitamine C pure (les utiliser le matin).

     ## Effets secondaires & précautions
     - **Effets temporaires courants** (1-6 semaines) : rougeurs, sécheresse, desquamation, picotements, légère purge (pour les peaux acnéiques).
     - **Photosensibilité** accrue → risque de coups de soleil et taches si pas de SPF.
     - **Contre-indiqué** pendant la grossesse et l’allaitement (principe de précaution – risque tératogène).
     - Test patch recommandé 24-48 h avant première utilisation.
     - Ne pas utiliser sur peau lésée, brûlée ou eczémateuse.
     - Conserver à l’abri de la lumière, chaleur et air (flacon opaque, pompe airless idéal).

     ## Rétinol vs autres rétinoïdes
     - **Esters de rétinol** (palmitate, acétate…) → très doux, pour peaux ultra-sensibles, mais moins puissants.
     - **Rétinal (rétinaldéhyde)** → 1 seule étape de conversion, jusqu’à 11× plus efficace que le rétinol, excellente tolérance.
     - **Acide rétinoïque (trétinoïne)** → forme active pure, sur ordonnance uniquement, très puissante mais très irritante.

     Le rétinol reste le meilleur compromis efficacité / tolérance / accessibilité en cosmétique libre.

     **Conseil expert** : associez-le à des actifs apaisants (centella, bisabolol, panthénol) et à une routine barrière cutanée renforcée pour un confort optimal.
     `,
  },
  {
    name: 'Bakuchiol',
    slug: INGREDIENT_SLUGS.BAKUCHIOL,
    category: 'actif',
    description: 'Alternative végétale douce au rétinol, anti-âge sans irritation.',
    content: `
     # Bakuchiol

     Alternative végétale douce au rétinol, extraite des graines de Psoralea corylifolia (plante babchi). Il mime les effets anti-âge du rétinol (stimulation du collagène, renouvellement cellulaire, réduction des rides) sans irritation, sans rougeurs, sans desquamation et sans photosensibilisation. Idéal pour peaux sensibles, réactives, débutants en actifs puissants, ou pendant la grossesse/allaitement (sous avis médical).

     ## INCI
     BAKUCHIOL

     ## Concentration typique
     0,5 à 1 % (le plus souvent 0,5–1 % dans les sérums et crèmes efficaces).
     Études cliniques majeures ont utilisé 0,5 % deux fois par jour avec d’excellents résultats et très bonne tolérance.
     Pas de limite réglementaire stricte en UE (contrairement au rétinol limité à 0,3 % depuis 2025–2027), ce qui permet des formules plus concentrées si stabilisées.

     ## Mécanisme d’action
     Bakuchiol n’est **pas** un dérivé de vitamine A, mais un meroterpène végétal. Il active des voies génétiques similaires à celles du rétinol (expression de gènes impliqués dans la production de collagène I/III, élastine, et inhibition des MMP-1), sans se lier aux récepteurs RAR/RXR du rétinol.
     Résultat :
     - Augmente la synthèse de collagène et d’élastine
     - Accélère le renouvellement cellulaire
     - Réduit l’inflammation et l’oxydation
     - Inhibe la mélanogenèse (action anti-taches)
     Le tout avec une stabilité photochimique excellente (pas de dégradation au soleil) et sans altérer la barrière cutanée.

     ## Bienfaits prouvés (études cliniques)
     - **Anti-âge** : réduit rides et ridules, améliore fermeté, élasticité et densité cutanée (études 12 semaines : résultats comparables au rétinol 0,5 %).
     - **Éclat & teint** : atténue hyperpigmentation, taches solaires et post-inflammatoires.
     - **Texture** : affine le grain de peau, lisse les irrégularités.
     - **Antioxydant & apaisant** : protège contre le stress oxydatif, réduit l’inflammation.
     Étude clé (British Journal of Dermatology, 2019 & revues 2024–2025) : bakuchiol 0,5 % = efficacité quasi identique au rétinol sur photo-vieillissement, mais **significativement moins irritant** (pas de scaling, stinging, rougeurs rapportés).

     Résultats visibles dès 4–8 semaines, optimaux après 12 semaines d’utilisation régulière.

     ## Comment l’utiliser (guide pratique)
     - **Matin et/ou soir** (pas photosensibilisant → utilisable en journée).
     - Peau propre, sèche ou légèrement humide.
     - Quantité : 2–3 gouttes de sérum ou quantité d’un petit pois pour le visage.
     - **Débutants** : commencez tous les soirs (ou 3–4 soirs/semaine), puis quotidien. Pas besoin de phase d’adaptation longue.
     - **Technique** : appliquez après sérum hydratant (acide hyaluronique), avant crème.
     - **Routine du matin** : bakuchiol → hydratant → SPF 30+ (recommandé même sans photosensibilisation).
     - **Routine du soir** : nettoyage → bakuchiol → hydratant riche.

     ## Compatibilités & associations gagnantes
     - **Parfait avec** : niacinamide, peptides, céramides, acide hyaluronique, centella asiatica, panthénol (apaisant).
     - **Vitamine C** (stable) : matin ou soir, super combo antioxydant + éclat.
     - **AHA/BHA doux** (lactique, mandélique, salicylique faible %) : possible le soir, surveillez la tolérance.
     - **Rétinol / rétinoïdes** : oui ! Beaucoup combinent bakuchiol le matin + rétinol le soir, ou alternent les jours pour booster les résultats tout en minimisant irritations.
     - **Éviter en layering agressif** : très forts AHA/BHA en même temps si peau sensible (risque cumulatif de sécheresse).

     ## Effets secondaires & précautions
     - Très rare : légère sécheresse ou picotements transitoires chez peaux ultra-réactives (quasi inexistant vs rétinol).
     - **Pas de photosensibilité** confirmée en études cliniques.
     - **Grossesse & allaitement** : considéré comme sûr par la majorité des experts (pas de risque tératogène connu, structure chimique différente du rétinol). Souvent recommandé comme alternative. **Toujours consulter un médecin** avant utilisation (données limitées mais rassurantes).
     - Test patch 24–48 h conseillé si peau très réactive.
     - Conserver à température ambiante, à l’abri de la chaleur extrême (stable à la lumière).

     ## Bakuchiol vs Rétinol – comparatif rapide
     | Critère              | Bakuchiol                          | Rétinol                              |
     |----------------------|------------------------------------|--------------------------------------|
     | Origine              | Végétale (Psoralea corylifolia)   | Dérivé vitamine A                   |
     | Irritation           | Très faible                        | Moyenne à élevée (surtout début)    |
     | Photosensibilisation | Non                                | Oui (SPF obligatoire)               |
     | Utilisation          | Matin + soir                       | Soir uniquement                     |
     | Grossesse            | Généralement OK (avis médical)     | Contre-indiqué                      |
     | Concentration typique| 0,5–1 %                            | 0,1–0,3 % (UE max 0,3 %)            |
     | Vitesse résultats    | Progressive (4–12 semaines)        | Plus rapide mais avec purge         |
     | Peaux cibles         | Sensibles, réactives, enceintes    | Tous (avec précautions)             |

     **Conseil expert** : le bakuchiol est le choix n°1 pour introduire un actif anti-âge puissant sans stresser la barrière cutanée. Il peut même potentialiser un rétinol plus tard en routine mixte. Associez-le à une bonne hydratation et protection solaire pour des résultats durables et glowy !
     `,
  },
  {
    name: 'Adapalène (Adapalene)',
    slug: INGREDIENT_SLUGS.ADAPALENE,
    category: 'actif pharmaceutique',
    description:
      'Rétinoïde de troisième génération hautement ciblé, utilisé pour réguler la kératinisation et traiter les lésions acnéiques.',
    content: `
      # Adapalène (Adapalene)

      L'adapalène est un dérivé de l'acide naphtoïque possédant une activité biologique similaire à celle de la trétinoïne (Vitamine A acide), mais avec une stabilité chimique et une tolérance cutanée nettement supérieures. C'est un ingrédient de référence en dermatologie pour le traitement de l'acné vulgaire, car il cible spécifiquement les récepteurs nucléaires de l'acide rétinoïque (RAR-β et RAR-γ) sans irriter inutilement la surface de la peau.

      ## INCI
      **ADAPALENE** (Molécule synthétique pure, classée comme substance active médicamenteuse)

      ## Composition chimique
      - **Dérivé d'acide naphtoïque** : Structure polyaromatique plane qui lui confère une grande stabilité à la lumière (non photosensible) et à l'oxygène.

      ## Mécanisme d’action
      1. **Action Comédolytique** : Normalise la différenciation des cellules épithéliales folliculaires, empêchant la formation du micro-comédon.
      2. **Action Kératolytique** : Facilite l'évacuation des bouchons de sébum existants.
      3. **Action Anti-inflammatoire** : Inhibe les réponses chimiotactiques et chimiocinétiques des leucocytes polymorphonucléaires.
      4. **Sélectivité Réceptoriale** : Se lie préférentiellement aux récepteurs RAR gamma de l'épiderme, minimisant les effets secondaires classiques des rétinoïdes.

      ## Bienfaits
      - **Réduction des lésions** : Diminue significativement le nombre de **comédons** (points noirs) et de papulo-pustules.
      - **Affinement du grain de peau** : Lisse la texture cutanée et resserre les pores dilatés par l'hyperkératose.
      - **Prévention des cicatrices** : En traitant l'inflammation précocement, il limite le risque de marques post-acnéiques.
      - **Stabilité** : Contrairement au rétinol classique, il peut être associé au peroxyde de benzoyle dans certaines formules hybrides.

      ## Utilisation
      - **Cible** : Peaux acnéiques, peaux à imperfections sévères, hyperkératose.
      - **Moment** : Exclusivement le soir, sur une peau parfaitement propre et sèche.
      - **Type de soin** : Médicaments topiques (gels ou crèmes) ou soins dermatologiques encadrés (ex: gamme Differine).

      ## Note technique
      L'adapalène représente une avancée majeure par rapport aux rétinoïdes de première génération. Sa structure est lipophile, ce qui lui permet de pénétrer facilement dans le follicule pilo-sébacé. Bien qu'il soit mieux toléré que la trétinoïne, il nécessite une phase d'adaptation et l'utilisation systématique d'une protection solaire la journée.
    `,
  },
  {
    name: 'Trétinoïne (Acide rétinoïque all-trans)',
    slug: INGREDIENT_SLUGS.TRETINOINE,
    category: 'actif pharmaceutique',
    description:
      "L'actif de référence absolue en dermatologie pour le traitement de l'acné sévère et le photo-vieillissement cutané profond.",
    content: `
      # Trétinoïne (Acide rétinoïque)

      La trétinoïne est la forme acide de la vitamine A. Contrairement au rétinol qui doit être converti par la peau, la trétinoïne est directement active sur les récepteurs cellulaires. C'est l'ingrédient "Gold Standard" de la prescription dermatologique depuis les années 1970. Initialement utilisée pour l'acné, elle a révolutionné le traitement du vieillissement cutané grâce à sa capacité unique à reprogrammer le métabolisme cellulaire.

      ## INCI
      **RETINOIC ACID** (Substance active médicamenteuse, interdite en cosmétique pure sans encadrement médical)

      ## Composition chimique
      - **Acide rétinoïque all-trans** : Molécule de petite taille à haute pénétration cutanée.
      - **Structure active** : Se lie directement aux récepteurs nucléaires RAR (Retinoic Acid Receptors) pour modifier l'expression des gènes.

      ## Mécanisme d’action
      1. **Accélération du turnover** : Réduit le cycle de renouvellement cellulaire de 28 jours à environ 10-14 jours.
      2. **Stimulation fibroblastique** : Relance massivement la synthèse de collagène de type I et III et d'élastine.
      3. **Action comédolytique puissante** : Empêche l'hyperkératose folliculaire, éliminant les comédons à la source.
      4. **Inhibition des MMP** : Freine les métalloprotéinases matricielles, les enzymes qui dégradent le collagène sous l'effet des UV.

      ## Bienfaits
      - **Correction des rides** : Réduit visiblement la profondeur des rides et ridules par une densification du derme.
      - **Traitement de l'acné** : Induit une rémission des lésions inflammatoires et rétentionnelles.
      - **Uniformité du teint** : Estompe les taches pigmentaires et améliore l'éclat en régulant la distribution de la mélanine.
      - **Texture de peau** : Affine le grain de peau et réduit l'apparence des pores dilatés.

      ## Utilisation
      - **Cible** : Acné vulgaire, héliodermie (vieillissement solaire), rides profondes.
      - **Moment** : Exclusivement le soir, sur peau sèche. Une phase d'initiation progressive est obligatoire.
      - **Type de soin** : Médicaments topiques (ex: Ketrel, Locacid, Retin-A).

      ## Note technique
      La trétinoïne est un ingrédient d'une efficacité redoutable mais qui nécessite une éducation thérapeutique stricte. Elle peut provoquer une "rétinisation" (rougeurs, desquamation) en début de traitement. Son utilisation impose l'arrêt de gommages mécaniques et l'application d'un **SPF 50+** quotidien, car elle affine la couche cornée et augmente la photosensibilité.
    `,
  },
  {
    name: 'Rétinal',
    slug: INGREDIENT_SLUGS.RETINAL,
    category: 'actif',
    description:
      'Précurseur direct de l’acide rétinoïque, jusqu’à 11 fois plus rapide que le rétinol pour transformer la texture de la peau.',
    content: `
       # Rétinal (Rétinaldéhyde)

       Le rétinaldéhyde est le grand frère "haute performance" du rétinol. Situé à une seule étape de conversion de la forme active (l'acide rétinoïque), il offre des résultats nettement plus rapides sur les rides et l'éclat, tout en étant étonnamment mieux toléré par la peau. C'est l'actif de choix pour ceux qui veulent passer au niveau supérieur de l'anti-âge.

       ## INCI
       RETINAL

       ## Concentration typique
       0,01 % à 0,1 % (le maximum autorisé en cosmétique libre est généralement de 0,1 %).
       Une concentration de **0,05 %** de rétinal est souvent comparée en efficacité à **0,5 %** de rétinol.

       ## Mécanisme d’action
       Le rétinal suit un chemin de conversion plus court que le rétinol :
       1. **Rétinal → Acide rétinoïque (forme active)**

       Parce qu'il ne nécessite qu'une seule transformation enzymatique, il délivre la forme active plus efficacement aux cellules. Il agit sur le renouvellement de l'épiderme, booste la synthèse de collagène et possède une propriété unique parmi les rétinoïdes : une action **antibactérienne directe**, ce qui le rend exceptionnel pour les peaux sujettes aux imperfections à l'âge adulte.

       ## Bienfaits prouvés
       - **Anti-âge ultra-rapide** : Lisse les rides profondes et améliore la fermeté plus vite que le rétinol classique.
       - **Action Anti-acné** : Grâce à ses propriétés antibactériennes, il réduit les boutons et purifie les pores.
       - **Texture & Grain de peau** : Affine le grain de peau et réduit l'apparence des pores dilatés.
       - **Éclat** : Homogénéise le teint et traite l'hyperpigmentation avec une grande efficacité.

       ## Comment l’utiliser (guide débutant)
       - **Soir uniquement** : Molécule instable à la lumière et photosensibilisante.
       - **Application** : Sur peau propre et sèche. Sa couleur naturelle est jaune vif, ce qui est un gage de qualité et de concentration.
       - **Fréquence** : Comme pour le rétinol, introduire progressivement (2 fois par semaine, puis augmenter selon tolérance).
       - **Le matin** : Application obligatoire d'un SPF 30 ou 50.

       ## Différence avec le Rétinol
       Le **Rétinal** est environ **10 à 11 fois plus efficace** que le rétinol en termes de vitesse de conversion. Malgré cette puissance accrue, il provoque souvent moins d'irritations et de sécheresse que le rétinol à haute dose, car la peau régule mieux sa conversion finale. De plus, seul le rétinal possède une activité antibactérienne, là où le rétinol est purement métabolique.

       ## Effets secondaires & précautions
       - **Teinte jaune** : Sa couleur peut légèrement teinter la peau ou les draps blancs lors de l'application (s'estompe au lavage).
       - **Précautions classiques** : Éviter le contour des yeux (sauf formule spécifique) et les muqueuses.
       - **Contre-indiqué** : Comme tous les rétinoïdes, par principe de précaution, il est déconseillé pendant la grossesse et l'allaitement.

       **Conseil expert** : Si vous avez une peau mature à tendance acnéique (acné hormonale), le rétinal est votre meilleur allié. Il traite simultanément les signes du temps et les imperfections inflammatoires sans l'agressivité des traitements dermatologiques classiques.
       `,
  },
]
