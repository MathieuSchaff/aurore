import { IngredientInput } from "./seed-ingredients";
import { INGREDIENT_SLUGS } from "./ingredient-slugs";

export const ANTI_ACNE_SEBUM: IngredientInput[] = [
  {
    name: "Arbre à thé",
    slug: INGREDIENT_SLUGS.TEA_TREE,
    category: "purifiant & apaisant",
    description: "Huile essentielle réputée pour ses propriétés antibactériennes et assainissantes, idéale pour les peaux à imperfections.",
    content: `
# Arbre à thé (Tea Tree)
L'huile de Tea Tree est extraite des feuilles de l'arbre Melaleuca alternifolia, originaire d'Australie.

## INCI
**MELALEUCA ALTERNIFOLIA LEAF OIL**

## Points forts
- **Purifiant** : Aide à assainir la peau et à réduire les imperfections.
- **Antibactérien** : Cible les bactéries responsables de l'acné.
- **Anti-inflammatoire** : Aide à calmer les rougeurs liées aux boutons.
- **Régulateur** : Aide à équilibrer les peaux sujettes aux excès de sébum.

## Rôle dans les soins
C'est l'ingrédient phare des routines pour peaux acnéiques ou à imperfections pour son action ciblée sans être trop décapant.

## Utilisation
- **Cible** : Peaux grasses, peaux à tendance acnéique, imperfections localisées.
- **Type de soin** : Gels nettoyants, lotions toniques, soins ciblés "spot treatments".
`,
  },
  {
    name: "Copper Gluconate",
    slug: INGREDIENT_SLUGS.COPPER_GLUCONATE,
    category: "antibactérien & réparateur",
    description: "Un sel de cuivre essentiel qui aide à purifier la peau tout en favorisant la régénération des tissus.",
    content: `
# Copper Gluconate (Gluconate de Cuivre)
Le cuivre est un oligo-élément indispensable à la santé de la peau. Il intervient dans la synthèse de l'élastine et possède des vertus assainissantes naturelles.

## INCI
**COPPER GLUCONATE**

## Points forts
- **Action purifiante** : Limite la prolifération bactérienne sur les zones irritées.
- **Soutien du collagène** : Aide à la formation de l'élastine pour une peau plus souple.
- **Antioxydant** : Protège les cellules contre les radicaux libres.

## Rôle dans les soins réparateurs
Souvent associé au Zinc, il assainit la zone lésée pour éviter les infections secondaires tout en accélérant la remise en état de l'épiderme.

## Utilisation
- **Cible** : Zones irritées suintantes ou sèches, peaux à imperfections, cicatrices.
- **Type de soin** : Crèmes barrières, gels nettoyants purifiants, soins ciblés "cuivre-zinc".
`,
  },
  {
    name: "Zinc PCA",
    slug: INGREDIENT_SLUGS.ZINC_PCA,
    category: "actif",
    description: "Actif séborégulateur et antibactérien combinant zinc et PCA pour équilibrer les peaux grasses à imperfections, tout en hydratant sans assécher.",
    content: `
    # Zinc PCA
    Le Zinc PCA est un actif cosmétique très apprécié en dermatologie pour son action ciblée sur les peaux grasses, mixtes et à tendance acnéique. Il associe les propriétés régulatrices du zinc à l'hydratation apportée par l'acide pyrrolidone carboxylique (PCA), un composant naturel du NMF (Natural Moisturizing Factor) de la peau.

    ## INCI
    **ZINC PCA**

    (Sel de zinc de l'acide pyrrolidone carboxylique / Zinc salt of PCA)

    ## Composition chimique
    - **Combinaison synergique** : Zinc (oligo-élément essentiel) + L-PCA (dérivé d'acide aminé, issu souvent de la cyclisation thermique de l'acide glutamique végétal).
    - **Haute biodisponibilité** : Le PCA améliore l'absorption cutanée du zinc et apporte une hydratation intrinsèque.
    - **Forme hydrosoluble** : Contrairement au zinc oxide (insoluble), il est parfaitement soluble et non blanchissant.

    ## Mécanisme d’action
    1. **Régulation du sébum** : Inhibe partiellement l'enzyme 5-alpha réductase et normalise l'activité des glandes sébacées → réduction significative de la production de sébum (études in vivo à 1 % montrent -20-30 % après 28 jours).
    2. **Action antibactérienne** : Limite la prolifération de *Cutibacterium acnes* (ex-Propionibacterium acnes) et d'autres bactéries impliquées dans l'acné (efficace dès 0,1-0,25 % in vitro).
    3. **Anti-inflammatoire** : Apaise les rougeurs, réduit l'inflammation post-boutons et accélère la cicatrisation.
    4. **Hydratation et renforcement de la barrière** : Le PCA agit comme humectant NMF → maintient l'hydratation sans effet gras, évite l'effet rebond de sébum.

    ## Bienfaits
    - **Anti-imperfections** : Réduit boutons, points noirs et brillance excessive sans assécher.
    - **Matifiant naturel** : Contrôle l'excès de sébum pour un teint plus net et durable.
    - **Apaisant et réparateur** : Calme les peaux irritées, sensibles ou post-traitements (rétinoïdes, acides).
    - **Prévention des marques** : Favorise une meilleure cicatrisation et limite l'hyperpigmentation post-inflammatoire.
    - **Innocuité élevée** : Non comédogène, très bien toléré (même peaux sensibles/réactives), score EWG bas et autorisé sans restriction majeure.

    ## Utilisation
    - **Cible** : Peaux grasses, mixtes, à imperfections, acné légère à modérée, peaux déshydratées grasses.
    - **Moment** : Matin et/ou soir, dans les routines anti-imperfections.
    - **Type de soin** : Sérums, crèmes, lotions, nettoyants, masques (ex. : The Ordinary Niacinamide 10% + Zinc 1%, Typology sérum imperfections, La Roche-Posay Effaclar, etc.).

    ## Note technique
    Le Zinc PCA est aujourd'hui un ingrédient star des formules anti-acné modernes, souvent associé à la niacinamide, au zinc gluconate ou à des acides doux. Il offre une approche équilibrée : contrôle du sébum + antibactérien + hydratation, sans les inconvénients des formes de zinc plus astringentes (comme le sulfate). Efficace dès 0,1-1 %, il est recommandé par les dermatologues pour les routines quotidiennes des peaux à imperfections.
  `,
  },
  {
    name: "Extrait de lentille (Lens esculenta seed extract)",
    slug: INGREDIENT_SLUGS.LENS_ESCULENTA_SEED_EXTRACT,
    category: "actif",
    description: "Actif d'origine naturelle riche en oligosaccharides, conçu pour resserrer les pores et affiner durablement le grain de peau.",
    content: `
    # Extrait de lentille (Lens esculenta seed extract)
    L'extrait de lentille est un ingrédient d'origine végétale sélectionné pour son action ciblée sur la structure du pore. Particulièrement utilisé dans les soins correcteurs pour peaux grasses, cet actif allie naturalité et performance dermatologique pour restaurer l'aspect lisse et mat de l'épiderme.
    ## INCI
    **LENS ESCULENTA (LENTIL) SEED EXTRACT**
    (Extrait de graines de lentille cultivée)
    ## Composition chimique
    - **Oligosaccharides** : Sucres complexes agissant sur la maturation des kératinocytes.
    - **Acides aminés** : Participent à la restructuration du derme.
    - **Minéraux** : Soutiennent le métabolisme cellulaire cutané.
    ## Mécanisme d’action
    1. **Régulation de la kératinisation** : Normalise le renouvellement cellulaire pour éviter l'obstruction des pores.
    2. **Renforcement de la paroi du pore** : Stimule la synthèse de collagène pour limiter la distension des pores liée au relâchement.
    3. **Action astringente** : Aide à resserrer les tissus cutanés de manière immédiate et durable.
    4. **Contrôle du flux sébacé** : Contribue indirectement à limiter l'aspect luisant de la zone T.
    ## Bienfaits
    - **Pores resserrés** : Réduction visible du diamètre des pores dilatés dès les premières applications.
    - **Grain de peau affiné** : Lisse les irrégularités de surface pour une peau plus douce.
    - **Effet flouteur naturel** : Améliore l'éclat du teint en uniformisant la réflexion de la lumière.
    - **Matité durable** : Aide la peau à rester nette tout au long de la journée.
    ## Utilisation
    - **Cible** : Peaux mixtes à grasses, peaux présentant des pores dilatés ou un grain de peau irrégulier.
    - **Moment** : Matin et/ou soir avant le soin hydratant.
    - **Type de soin** : Ingrédient clé des gammes **Cleanance (Oil Control)** et soins perfecteurs de peau.
    ## Note technique
    L'extrait de lentille est privilégié pour sa capacité à traiter la cause structurelle de la dilatation des pores (perte de tonus) plutôt que de simplement masquer l'imperfection. Sa haute tolérance en fait un allié précieux pour les peaux sensibles qui ne supportent pas les actifs astringents trop agressifs ou alcoolisés.
  `,
  },
  {
    name: "Comedoclastin™ (Extrait de Silybum marianum)",
    slug: INGREDIENT_SLUGS.COMEDOCLASTIN,
    category: "actif",
    description: "Actif végétal breveté issu du Chardon-marie qui réduit les imperfections et limite leur réapparition en agissant à la racine.",
    content: `
    # Comedoclastin™ (Extrait de Silybum marianum)
    La Comedoclastin™ est une innovation de rupture issue de la Recherche Pierre Fabre. Cet actif végétal "intelligent" est extrait des graines de Chardon-marie (*Silybum marianum*) selon un procédé breveté. Il constitue le cœur de l'expertise de la marque Avène pour le traitement des peaux à tendance acnéique.
    ## INCI
    **SYLIBUM MARIANUM FRUIT EXTRACT**
    (Extrait de fruit/graine de Chardon-marie titré et purifié)
    ## Composition chimique
    - **Silybiine** : Molécule active spécifique hautement purifiée.
    - **Polyphénols** : Propriétés antioxydantes protégeant le sébum de l'oxydation.
    - **Lipides végétaux** : Assurent une excellente affinité avec le film hydrolipidique.
    ## Mécanisme d’action
    1. **Action sur le micro-comédon** : Agit dès l'origine de l'imperfection pour la stopper avant qu'elle ne devienne visible.
    2. **Régulation du sébum** : Normalise la production excessive de sébum (hyperséborrhée) par les glandes sébacées.
    3. **Action anti-comédogène** : Prévient la formation des points noirs et des boutons de manière durable.
    4. **Inhibition de la différenciation des sébocytes** : Limite le processus de kératinisation du canal pilo-sébacé.
    ## Bienfaits
    - **Efficacité anti-imperfections** : Réduction visible des boutons dès **7 jours** d'utilisation.
    - **Action anti-récidive** : Limite la réapparition des imperfections sur le long terme (effet rebond limité).
    - **Resserre les pores** : Améliore significativement le grain de peau par son effet matifiant et lissant.
    - **Excellente tolérance** : Respecte les peaux fragilisées par les traitements desséchants.
    ## Utilisation
    - **Cible** : Peaux grasses à tendance acnéique, adolescents et adultes.
    - **Moment** : Matin et soir sur l'ensemble du visage.
    - **Type de soin** : Ingrédient central de la gamme **Cleanance Comedomed**.
    ## Note technique
    La Comedoclastin™ représente un changement de paradigme en dermatologie : au lieu de traiter uniquement le bouton visible, elle traite le stade invisible de l'imperfection. Elle est produite via une filière de production éco-responsable certifiée, garantissant une traçabilité totale et une pureté maximale de l'actif.
  `,
  },
  {
    name: "Copper Sulfate",
    slug: INGREDIENT_SLUGS.COPPER_SULFATE,
    category: "actif",
    description: "Sulfate de cuivre aux propriétés antimicrobiennes, astringentes et séborégulatrices, utilisé en faible concentration dans les soins purifiants, anti-acné et assainissants pour peaux grasses à imperfections.",
    content: `
    # Copper Sulfate (Sulfate de Cuivre)

    Sel minéral inorganique de cuivre (CuSO₄·5H₂O), connu depuis des siècles pour ses vertus antiseptiques et astringentes. En cosmétique moderne, il est employé à très faible concentration (souvent < 0,1 %) pour ses effets purifiants ciblés. Présent dans certaines formules anti-acné ou assainissantes de marques dermo-cosmétiques (ex: certains produits purifiants Pierre Fabre ou autres laboratoires spécialisés), il est apprécié pour son action rapide sur les excès de sébum et les bactéries cutanées sans perturber excessivement la flore.

    ## INCI

    **Copper Sulfate**

    ## Composition chimique

    - Sulfate de cuivre pentahydraté : CuSO₄·5H₂O
    - Source minérale, pureté pharmaceutique ou cosmétique
    - Très faible concentration d'utilisation (0,01–0,2 % typiquement)

    ## Mécanisme d’action

    1. **Antimicrobien** : Libère des ions Cu²⁺ qui perturbent les membranes bactériennes (Propionibacterium acnes, Staphylococcus) et inhibent leur prolifération.
    2. **Astringent** : Ressert les pores et réduit l'excès de sébum par effet vasoconstricteur léger et coagulation des protéines.
    3. **Séchage et purifiant** : Favorise l'assèchement des lésions inflammatoires et limite la formation de comédons.
    4. **Antioxydant modéré** : Le cuivre joue un rôle dans les enzymes antioxydantes (superoxyde dismutase), bien que l'effet soit mineur à ces doses.
    5. Action séborégulatrice : Diminue la production excessive de sébum sans assécher excessivement.

    ## Bienfaits

    - **Anti-acné** : Réduit l'inflammation et limite la prolifération bactérienne sur peaux à imperfections.
    - **Purifiant** : Assainit le cuir chevelu et la peau grasse, diminue l'aspect luisant.
    - **Astringent** : Ressert les pores dilatés et affine le grain de peau.
    - **Séchage ciblé** : Accélère la disparition des boutons inflammatoires.
    - **Tolérance contrôlée** : Efficace à très faible dose, mais réservé aux peaux grasses / mixtes (non recommandé sur peaux sensibles ou atopiques sans test préalable).

    ## Utilisation

    - **Cible** : Peaux grasses, mixtes, à imperfections, acné légère à modérée, cuir chevelu gras.
    - **Moment** : 1 à 2 fois par jour maximum, en phase de traitement localisé ou en soin purifiant.
    - **Type de soin** : Lotions ou gels purifiants, soins anti-imperfections ciblés, shampoings antipelliculaires/assainissants, formules anti-acné non agressives (présent dans certains produits Pierre Fabre ou marques spécialisées anti-acné minérales).

    ## Note technique

    Ingrédient minéral historique, utilisé en très faible concentration pour éviter tout risque de sensibilisation ou de coloration. Stabilité excellente, mais nécessite un pH acide pour rester en solution. Profil de tolérance bon aux doses cosmétiques, mais évité sur peaux très sensibles ou lésées. Actif d'appoint dans les formules purifiantes, souvent combiné à zinc PCA, acide salicylique ou extraits végétaux pour une action anti-imperfections équilibrée et non desséchante.
  `,
  },
  {
    name: "Zinc Sulfate (sulfate de zinc)",
    slug: INGREDIENT_SLUGS.ZINC_SULFATE,
    category: "actif",
    description: "Sel minéral astringent et antimicrobien, régule le sébum et apaise les peaux à imperfections.",
    content: `
    # Zinc Sulfate (sulfate de zinc)

    Le Zinc Sulfate est un sel minéral hydrosoluble reconnu pour ses propriétés astringentes et antimicrobiennes. Utilisé en dermatologie depuis de nombreuses décennies, il est intégré aux formules dermo-cosmétiques destinées aux peaux grasses, à tendance acnéique ou sujettes aux rougeurs.

    ## INCI
    **Zinc Sulfate**
    (sel inorganique de zinc et d’acide sulfurique)

    ## Composition chimique
    - Ion **Zn²⁺** biologiquement actif
    - Forme hydrosoluble facilitant l’incorporation en phase aqueuse
    - Propriétés antimicrobiennes documentées
    - Stable en formulation aqueuse contrôlée

    ## Mécanisme d’action
    1. **Action astringente** : resserre visiblement les pores.
    2. **Effet antimicrobien** : limite la prolifération bactérienne impliquée dans les imperfections.
    3. **Régulation sébacée** : contribue à réduire l’excès de sébum.
    4. **Apaisement cutané** : diminue rougeurs et inflammations légères.

    ## Bienfaits
    - **Séborégulateur** : aide à matifier les peaux grasses.
    - **Anti-imperfections** : réduit boutons et micro-inflammations.
    - **Effet purifiant** : améliore la netteté du teint.
    - **Apaisant** : utile sur peaux irritées ou sujettes aux rougeurs.
    - **Bonne tolérance** : adapté aux peaux sensibles à tendance acnéique.

    ## Utilisation
    - **Cible** : peaux mixtes à grasses, acnéiques, adolescentes ou adultes.
    - **Moment** : 1 à 2 fois par jour selon concentration.
    - **Type de soin** : lotions purifiantes, gels nettoyants, soins anti-acné, sprays apaisants.

    ## Note technique
    Le Zinc Sulfate est un actif dermatologique historique dont l’efficacité repose sur la biodisponibilité de l’ion zinc. Sa forme hydrosoluble en fait un ingrédient privilégié des formules purifiantes aqueuses, notamment pour les peaux grasses sensibles nécessitant régulation et apaisement simultanés.
  `,
  },
  {
    name: "Piroctone Olamine",
    slug: INGREDIENT_SLUGS.PIROCTONE_OLAMINE,
    category: "actif",
    description: "Agent antifongique puissant ciblant Malassezia, efficace contre pellicules, démangeaisons et irritations du cuir chevelu, très bien toléré même par les peaux sensibles.",
    content: `
    # Piroctone Olamine

    Ingrédient antifongique de synthèse développé dès 1979, le piroctone olamine est largement reconnu pour son efficacité contre les levures du genre Malassezia, responsables des pellicules et de la dermatite séborrhéique. Très utilisé par Pierre Fabre (notamment dans les gammes Ducray), il combine une action ciblée et une excellente tolérance cutanée, même sur peaux sensibles et atopiques.

    ## INCI

    **Piroctone Olamine**

    ## Composition chimique

    - Sel d’éthanolamine de la 1-hydroxy-4-méthyl-6-(2,4,4-triméthylpentyl)-2(1H)-pyridone
    - Formule moléculaire : C₁₄H₂₃NO₂ · C₂H₇NO
    - Pureté élevée, absence d’allergènes majeurs listés (sans paraben, sans fragrance ajoutée dans la plupart des formulations)

    ## Mécanisme d’action

    1. Inhibe fortement la synthèse de l’ergostérol, composant essentiel de la membrane fongique
    2. Chélate les ions fer (Fe²⁺/Fe³⁺) indispensables au métabolisme des levures Malassezia
    3. Perturbe la respiration cellulaire fongique en formant des complexes stables
    4. Possède une activité anti-inflammatoire modérée et réduit la libération de médiateurs pro-inflammatoires
    5. Limite la prolifération bactérienne secondaire sur le cuir chevelu

    ## Bienfaits

    - **Anti-pelliculaire** : réduit significativement les pellicules grasses et sèches (efficacité démontrée jusqu’à -70 % dans les études cliniques)
    - **Apaisant** : diminue rapidement les démangeaisons, rougeurs et irritations
    - **Antifongique ciblé** : action spécifique contre Malassezia spp., principal agent causal de la dermatite séborrhéique
    - **Anti-inflammatoire léger** : soulage l’inconfort du cuir chevelu sensible
    - **Tolérance exceptionnelle** : adapté aux peaux sensibles, atopiques, intolérantes et même aux cuirs chevelus de bébé (sous contrôle médical)
    - **Prévention des récidives** : maintient l’équilibre microbien à long terme

    ## Utilisation

    - **Cible** : cuirs chevelus pelliculaires, irrités, démangeaisons, dermatite séborrhéique, peaux sensibles / atopiques, tous âges
    - **Moment** : 2 à 3 fois par semaine en phase d’attaque, puis 1 fois par semaine en entretien
    - **Type de soin** : shampoings antipelliculaires intensifs (Ducray Kelual DS, Squanorm), lotions ou gels apaisants cuir chevelu, soins dermo-cosmétiques anti-irritations

    ## Note technique

    Ingrédient de référence dans les traitements anti-Malassezia depuis plus de 40 ans, souvent associé au ciclopirox olamine dans des brevets Pierre Fabre pour une synergie renforcée. Sa très bonne tolérance (score irritant très faible) et sa stabilité dans les formulations aqueuses en font un actif signature des gammes anti-pelliculaires des laboratoires dermatologiques français. Traçabilité pharmaceutique et absence de risques systémiques confirmés par de nombreuses études de sécurité post-commercialisation.
  `,
  },
  {
    name: "Gluconate de Zinc (Zinc Gluconate)",
    slug: INGREDIENT_SLUGS.ZINC_GLUCONATE,
    category: "actif",
    description: "L'oligo-élément régulateur de l'homéostasie cutanée : une action sébo-régulatrice, purifiante et cicatrisante incontournable pour les peaux à imperfections.",
    content: `# Le Gluconate de Zinc : Le Gardien de la Pureté Cutanée

Le **Gluconate de Zinc** est le sel de zinc de l'acide gluconique. En dermo-cosmétique de pointe (référencé dans les gammes Cleanance d'Avène ou Effaclar de La Roche-Posay), il est l'actif de choix pour traiter les désordres des peaux mixtes à grasses. Sa forme "gluconate" offre une biodisponibilité et une tolérance cutanée bien supérieures aux sels de zinc classiques.

---

## 🔬 Profil Moléculaire : Une Action Multi-Cible
Le zinc est un cofacteur essentiel pour plus de 300 enzymes dans l'organisme. Au niveau cutané, son action est triple :

* **Inhibition de la 5α-Réductase :** Le zinc bloque l'enzyme responsable de la transformation de la testostérone en dihydrotestostérone, le principal stimulus de la production de sébum. Résultat : une peau durablement matifiée.
* **Activité Antibactérienne (C. acnes) :** Il limite la prolifération de *Cutibacterium acnes*, la bactérie impliquée dans la genèse de l'acné, sans les effets secondaires des antibiotiques topiques.
* **Modulation des Cytokines :** Il freine la libération de médiateurs pro-inflammatoires, réduisant ainsi les rougeurs et le gonflement des imperfections.

## 🧪 Sourcing & Biodisponibilité : L'Atout de l'Acide Gluconique
Le choix du gluconate comme vecteur n'est pas anodin :
1.  **Haute Solubilité :** Contrairement à l'oxyde de zinc (pigment blanc insoluble), le gluconate est parfaitement hydrosoluble, permettant une intégration homogène dans les lotions et sérums aqueux.
2.  **Affinité Biologique :** L'acide gluconique est un composé organique naturellement présent dans les cellules, ce qui facilite le transport du zinc à travers la barrière cutanée.
3.  **Tolérance :** Cette forme limite les sensations de picotements ou de sécheresse parfois associées au chlorure ou au sulfate de zinc.

## ⚖️ Preuves d'Efficacité : Cicatrisation et Régulation
L'efficacité du Zinc Gluconate est cliniquement documentée, notamment dans les protocoles de soins dermatologiques :
* **Accélération de la Réparation Tissulaire :** Le zinc stimule la synthèse d'ADN et la division cellulaire, favorisant une cicatrisation rapide des marques post-imperfections.
* **Réduction de l'Index de Sébum :** Des études cliniques montrent une diminution moyenne de **20% à 30%** de la sécrétion sébacée après 28 jours d'application biquotidienne.
* **Effet Apaisant :** Particulièrement efficace pour réduire l'inflammation neurogène associée aux poussées d'acné adulte.

> **Le Savoir-Faire R&D :** Dans les formules pour peaux sensibles, le zinc est souvent couplé à des eaux thermales pour neutraliser les radicaux libres et renforcer les défenses antioxydantes (superoxyde dismutase).

## 🤝 Synergies en Formulation
* **Acide Salicylique (BHA) :** Le duo d'excellence pour les peaux acnéiques (exfoliation + régulation du sébum).
* **Niacinamide (Vitamine B3) :** Une synergie puissante pour réduire l'inflammation et uniformiser le grain de peau.
* **Cuivre Gluconate :** Souvent associé (trio Cu-Zn-Mn) pour son action régénératrice et assainissante complémentaire (type "Cica-crèmes").

## 🛡️ Sécurité & Tolérance
Le Gluconate de Zinc présente un excellent profil d'innocuité :
* **Non-Photosensibilisant :** Peut être utilisé en soin de jour sans risque.
* **Sécurité Post-Acte :** Idéal pour assainir la peau après une extraction de comédons ou un soin esthétique.
* **Usage Polyvalent :** Convient aux adolescents comme aux adultes, ainsi que dans les poudres de soins pour le corps.

---
*Fiche technique destinée aux experts R&D et aux chefs de produits dermo-cosmétiques.*`,
  },
  {
    name: "Acide azélaïque",
    slug: INGREDIENT_SLUGS.AZELAIC_ACID,
    category: "actif",
    description: "Acide dicarboxylique naturel approuvé FDA pour l'acné et la rosacée. Très efficace sur l'hyperpigmentation, le melasma et l'érythème post-inflammatoire. Excellent profil de tolérance, safe grossesse.",
    content: `## Qu'est-ce que c'est ?
  Acide faible (diacide dicarboxylique) naturellement présent dans le blé, l'orge, et produit par la levure *Malassezia furfur* sur la peau elle-même. Ce n'est **pas** un exfoliant chimique classique — il n'agit pas directement sur la cohésion des cornéocytes comme l'acide glycolique.

  Non photosensibilisant, sans risque de résistance bactérienne, sûr à long terme.

  ## Mécanismes d'action

  ### Anti-inflammatoire
  Inhibe les voies IL-1β, IL-6, TNF-α (principaux médiateurs inflammatoires cutanés). Base de son efficacité sur l'acné inflammatoire et la rosacée. Peut même aider contre les dommages UV (en complément du SPF).

  ### Antimicrobien (sans résistance)
  Tue les bactéries de l'intérieur, notamment *Cutibacterium acnes* et *S. aureus*, **sans induire de résistance bactérienne** — contrairement aux antibiotiques topiques ou oraux. Intérêt majeur pour l'usage prolongé.
  - Étude in vitro à 20 % : réduction de *C. acnes* de **96,7 %** et *S. aureus* de **99,6 %**.
  - L'absorption bactérienne augmente fortement quand le pH baisse (×14 pour *C. acnes* entre pH 6 et 4) → **synergie avec les acides** (glycolique, vitamine C) qui acidifient l'environnement cutané. Le pH naturel de la peau est ~4,5–5,5.

  ### Normalisation de la kératinisation (comédolytique)
  Ralentit la différenciation terminale des kératinocytes → réduit l'hyperkératose folliculaire, l'épaississement du stratum corneum et les comédons (points noirs/blancs). Effet similaire à un exfoliant, mais par un mécanisme différent → excellente combinaison avec AHA/BHA.

  ### Inhibiteur de la tyrosinase
  Bloque la synthèse de mélanine de manière **sélective** sur les mélanocytes hyperactifs, sans détruire les mélanocytes sains. Ne touche pas les grains de beauté ou taches de vieillesse normales.
  - Étude cobaye (années 80, 15 %) : après 6 semaines, nombre de mélanocytes stable — contrairement à l'hydroquinone 2 % qui le fait chuter de ~900 à 52 en 3 semaines.
  - In vitro sur cellules humaines : rupture mitochondriale surtout dans les mélanocytes malins/hyperactifs, effet atténué sur les mélanocytes sains.
  - Avantage majeur pour les **peaux foncées (Fitzpatrick III–VI)** : pas de risque de dépigmentation paradoxale, halo dépigmenté ou ochronose.

  ### Antioxydant
  Piège les radicaux libres, contribue à la protection contre le stress oxydatif.

  ## Indications
  Acné vulgaire (mild to moderate), rosacée papulo-pustuleuse, hyperpigmentation post-inflammatoire (PIH), melasma, érythème post-inflammatoire (PIE), dermatite séborrhéique, dermatite périorale/périorificielle.

  ## Concentrations et efficacité

  | Concentration | Statut | Usage |
  |---|---|---|
  | 10 % | OTC / cosmétique | Soutien acné légère, actif secondaire |
  | 15 % | OTC+ / quasi-Rx | Rosacée, acné, hyperpigmentation |
  | 20 % | Prescription | Melasma, acné modérée, gold standard clinique |

  ### Ce que 10 % peut (et ne peut pas) faire
  Très peu d'études directes sur 10 % — l'essentiel des données cliniques portent sur 15–20 %.
  - **Étude iranienne (2011)** : deux gels 10 % (hydroalcoolique vs sans alcool) sur acné mild-moderate → réduction significative des lésions inflammatoires et non-inflammatoires en 8 semaines. Les deux bases équivalentes, sauf supériorité hydroalcoolique sur peaux grasses.
  - **Pas de données solides** pour hyperpigmentation ou rosacée à 10 % seul.
  - Conclusion : à 10 %, l'acide azélaïque est un **actif de soutien**, pas un actif principal. Insuffisant seul pour acné modérée/sévère, mélasma marqué ou rosacée franche. Pour l'hyperpigmentation, combinaison obligatoire.

  ## Efficacité clinique prouvée (15–20 %)

  ### Acné
  - 20 % crème ≈ 0,05 % trétinoïne sur réduction des comédons (deux études : 92 et 289 patients, 3–6 mois), avec **meilleure tolérance**.
  - Comparable à 5 % peroxyde de benzoyle sur 2 mois, 2 % érythromycine, voire antibiotiques oraux dans certaines études.
  - Réduit significativement lésions inflammatoires et non-inflammatoires.
  - **Double action** unique : traite l'acné + prévient/fade les taches post-acné (PIH) simultanément → avantage majeur pour peaux foncées.
  - Observation fréquente : peau **moins grasse** après 1–2 mois (pas de mécanisme clair établi, mais rapportée régulièrement en pratique).
  - **Pas de purging** : pas d'augmentation temporaire des boutons au début (contrairement aux rétinoïdes).

  ### Rosacée
  - 15 % gel ou mousse → réduit érythème, lésions inflammatoires, améliore la sévérité globale.
  - La mousse (Finacea) est encore moins irritante que le gel — moins de sécheresse et de desquamation. Véhicule recommandé pour rosacée.
  - Bon profil également pour **dermatite séborrhéique** (anti-inflammatoire sur zones grasses/rouges).

  ### Hyperpigmentation / Mélasma
  Comparé à l'hydroquinone 4 % (gold standard) — méta-analyse (6 études randomisées, peaux asiatiques/moyen-orientales/iraniennes) :
  - Réduction du score MASI très proche entre les deux.
  - Grande étude (240 sujets, 24 semaines) :
    - Résultat bon/excellent : ~65 % (azélaïque) vs ~73 % (hydroquinone)
    - Réduction >50 % de la taille des lésions : ~60 % vs ~66 %
  - Hydroquinone légèrement supérieure pour les cas très marqués, mais l'écart reste faible.
  - Azélaïque idéal en **maintenance après hydroquinone** ou pour peaux foncées (Fitzpatrick IV–VI).

  | Critère | Acide azélaïque 20 % | Hydroquinone 4 % |
  |---|---|---|
  | Efficacité globale | ★★★★ | ★★★★★ |
  | Sécurité peaux foncées | Excellent | Risqué |
  | Risque ochronose | Non | Oui (long terme) |
  | Dépigmentation paradoxale | Rare | Possible |
  | Irritation | Modérée (transitoire) | Faible |
  | Usage long terme | Oui, indéfiniment | Limité |
  | Grossesse | Safe (catégorie B) | Déconseillé |

  > ⚠️ Malgré sa réputation « douce », l'acide azélaïque 20 % se révèle légèrement **plus irritant** que l'hydroquinone 4 % dans ces études (picotements, brûlures, démangeaisons, desquamation). Souvent transitoire, mais peut persister chez certains.

  ## Formulation : pourquoi ça compte énormément

  L'acide azélaïque est une molécule **très peu soluble** (longue chaîne carbonée + deux groupes acides) → ni hydrophile ni lipophile → souvent en suspension à 20 % (texture épaisse, pâteuse).

  - **Pénétration cutanée faible** : ~3 % pour la crème 20 % classique.
  - 15 % gel (Finacea) → pénétration ~8 % (×2–3 vs crème 20 %).
  - 15 % mousse → encore moins irritante, meilleure tolérance.

  Une bonne solubilisation/dispersion est donc plus efficace qu'une concentration brute élevée. Éviter les formulations « gritty » (grains non dissous = mauvaise pénétration).

  **Produits prescription US** : Azelex (20 % crème), Finacea (15 % gel ou mousse).

  ### Produits OTC 10 % — notes pratiques
  - **Inkey List, Naturium** : textures émulsion légères, moins irritantes, bien tolérées.
  - **Paula's Choice Azelaic Acid Booster** : 10 % + acide salicylique + réglisse — confiance clinique, texture pâteuse, plus de picotements initiaux.
  - **The Ordinary** : souvent gritty (grains non dissous → pénétration compromise).
  - Stinging fréquent au début — acclimatation normale, introduire lentement.

  ## Dérivé : Potassium Azéloyl Diglycinate (PAD / Azeloglycine)

  ### Pourquoi ce dérivé existe
  L'acide azélaïque est un cauchemar en formulation (suspension pâteuse, gritty, stinging, pénétration faible). Le PAD est créé en attachant deux groupes glycine à la molécule → **solubilité explosive** (jusqu'à 30–40 % en solution claire). Résultat : textures légères et fluides, pH neutre, moins irritant, meilleure compatibilité avec d'autres actifs.

  ### Mécanismes théoriques
  Similaires à l'acide azélaïque (anti-inflammatoire, antimicrobien, inhibition de la tyrosinase, régulation du sébum). Inhibition de la tyrosinase confirmée in vitro. Mais les **preuves cliniques humaines sont bien plus faibles**.

  ### Données cliniques (très limitées)

  **Rosacée légère à modérée** (meilleure étude disponible) : étude randomisée double-aveugle placebo-contrôlée (2012), 5 % PAD + 1 % hydroxypropyl chitosan vs placebo, 42 patients, 28 jours + suivi J42. Réduction significative de l'érythème (Mexameter + évaluation clinique) sur joues et menton, amélioration de l'hydratation, effet persistant 2 semaines après arrêt. → Meilleure preuve pour PAD : **anti-rougeurs en rosacée légère**.

  **Hyperpigmentation + sébum** (étude fournisseur, faible qualité) : 3 % PAD, 5 volontaires. ~12 % amélioration des taches (sans barre d'erreur, n=5 → non significatif). ~30 % réduction du sébum en 3 semaines (plus convaincant). → Intéressant pour sébum/acné légère, preuves anecdotiques.

  Pas d'études head-to-head vs acide azélaïque 15–20 %. Pas de grosses études sur acné modérée ou mélasma marqué.

  ### PAD vs Acide azélaïque

  | Critère | Acide azélaïque | PAD |
  |---|---|---|
  | Preuves cliniques | Solides (15–20 %) | Faibles (3–5 %) |
  | Texture | Pâteuse / gritty | Légère, fluide |
  | Irritation | Modérée | Faible |
  | Solubilité | Mauvaise | Excellente |
  | Peaux sensibles | Correct | Excellent |
  | Acné modérée / mélasma | Efficace | Non prouvé |

  ### Position dans la routine
  - **Tier 3 (nice to have)**, pas un actif principal.
  - Utile comme soutien (acné légère, rosacée sensible) ou alternative quand l'acide azélaïque irrite trop.
  - Concentrations efficaces dans les études : 3–5 %. Les produits à 10–20 % (Beauty of Joseon, Naturium) sont potentiellement plus forts mais sans données solides → patch test recommandé.
  - Préférer un produit isolé à 5–10 %+ (Naturium, Beauty of Joseon) plutôt qu'un multi-actifs « kitchen sink » pour vraiment évaluer l'effet.

  ## Combinaisons

  ### Cliniquement testées
  **Azélaïque 10 % + Trétinoïne 0,05 %** (étude, 50 femmes indiennes, 24 semaines) : réduction moyenne MASI ~80 %. Meilleure réponse sur mélasma épidermique que dermique. La trétinoïne accélère le renouvellement cellulaire et améliore la pénétration.

  **Azélaïque 20 % + Acide glycolique (15 % → 20 %)** : efficacité inférieure à l'hydroquinone seule sur mélasma modéré à sévère + PIH. Illustre la résistance du mélasma même avec des combos actifs.

  ### Synergies logiques
  - **AHA/BHA (glycolique, salicylique)** : acidifient l'environnement cutané → boostent l'activité antimicrobienne + mécanismes exfoliants complémentaires.
  - **Rétinol / rétinoides** : renouvellement cellulaire, améliore la pénétration, combo excellent pour acné et hyperpigmentation. Pas d'inactivation mutuelle.
  - **Niacinamide** : inhibe le transfert des mélanosomes vers les kératinocytes (mécanisme différent et complémentaire).
  - **Vitamine C** : antioxydant + inhibiteur de tyrosinase, compatible matin.
  - **Acide tranexamique** : très étudié seul contre mélasma, synergie probable sur voies complémentaires.
  - **Hydroquinone** : compatible, combo possible pour cas résistants (résultats visibles seulement après 8–16 semaines même avec 5 % HQ + 20 % azélaïque). Azélaïque excellent en maintenance après cure d'hydroquinone.

  ## Sécurité et tolérance

  **Catégorie B (FDA)** — considéré sûr pendant la grossesse et l'allaitement. Absorption systémique faible (~3–8 %). Meilleur profil que la plupart des actifs anti-acné (rétinoïdes, peroxyde de benzoyle, antibiotiques topiques). Option de premier choix pour acné ou mélasma gestationnel (quand on arrête spironolactone, contraceptifs oraux, rétinoïdes) — toujours valider avec un médecin au 1er trimestre.

  **Pas d'effets adverses à long terme** : pas d'atrophie cutanée, pas de rebond hyperpigmentation, pas de blanchiment des zones saines, pas de résistance bactérienne.

  **Contre-indication** : allergie au **propylène glycol** (présent dans toutes les formes prescription).

  ### Gestion de l'irritation initiale
  Sécheresse, picotements, brûlures, démangeaisons sont fréquents les premières semaines — souvent transitoires (2–4 semaines). Plus fréquents sur peaux sensibles, peaux matures (moins de lipides/céramides), ou en association avec d'autres irritants.

  - Choisir le **véhicule adapté** : mousse (Finacea) mieux tolérée pour rosacée ; gel plus sec ; crème plus lente mais hydratante.
  - Appliquer sur **peau sèche**, moisturizer après.
  - Si pilling avec trétinoïne gel : attendre 20–30 min entre les deux, ou alterner les soirs.
  - Si irritation persistante : changer de véhicule ou ajuster avec un dermatologue.

  ## Intégration routine
  **2×/jour** (matin + soir) une fois toléré. Quantité : **taille d'un petit pois** pour tout le visage — épargner le contour des yeux. Laver les mains après (éviter yeux/bouche).

  - Introduire **lentement** : 1×/jour les 1–2 premières semaines, puis 2×/jour si toléré.
  - **SPF obligatoire** tous les jours — indispensable, sans quoi les résultats sur l'hyperpigmentation sont compromis.
  - **Patience** : acné 4–12 semaines, rosacée 12+ semaines, mélasma/PIH 8–16 semaines minimum, optimum à 6 mois.
  - Photos avant/après recommandées — les changements sont graduels et difficiles à percevoir au quotidien.
  - Compatible avec superposition : crème solaire, maquillage, rétinoïdes, BPO, AHA/BHA — pas d'inactivation.

  ## Efficacité selon les préoccupations
  | Problème | Niveau |
  |---|---|
  | Acné | Très bon |
  | Rosacée | Excellent |
  | Hyperpigmentation / PIH | Excellent |
  | Mélasma | Très bon (avec patience) |
  | Érythème post-inflammatoire | Excellent |
  | Dermatite séborrhéique | Bon |
  | Dermatite périorale | Bon |
  | Exfoliation | Modéré |
  | Anti-âge | Faible |`,
  },
  {
    name: "Acide hypochloreux",
    slug: INGREDIENT_SLUGS.HYPOCHLOROUS_ACID,
    category: "actif",
    description: "Composé naturellement produit par les globules blancs via la myéloperoxydase. Antimicrobien puissant à large spectre et anti-inflammatoire, mais extrêmement doux. Idéal pour peaux réactives, acnéiques, rosacée, eczéma et post-procédures.",
    content: `## Qu'est-ce que c'est ?
  Substance naturellement produite par les neutrophiles (globules blancs) pour combattre infections et inflammation. Formulé en skincare par électrolyse d'une solution saline, c'est un acide faible (pH ~3–6) appliqué en spray ou toner. Ce pH bas est ce qui le distingue de l'eau de Javel classique : à ce pH, on obtient du HOCl pur, beaucoup plus doux et contrôlé. Il agit en détruisant l'intégrité des membranes microbiennes — y compris les **biofilms** bactériens résistants — sans irriter ni laisser de résidus toxiques.

  Utilisé depuis la Première Guerre mondiale pour nettoyer les plaies, il est reconnu comme **dispositif médical** depuis ~2016 et couramment utilisé en dermatologie avant les procédures (Botox, fillers, laser, microneedling) pour réduire le risque infectieux.

  ## Bénéfices

  **Antimicrobien à large spectre**
  Tue bactéries (*C. acnes*, *S. aureus*, *P. aeruginosa*), virus (dont COVID) et champignons (*Candida albicans*). Pénètre les biofilms bactériens qui ralentissent la cicatrisation. Particulièrement utile pour les peaux eczémateuses (surcolonisation à *S. aureus*) et acnéiques. Pas de résistance microbienne connue, contrairement aux antibiotiques.

  **Anti-inflammatoire**
  Inhibe histamine, leucotriènes et IL-2 → réduit rougeurs, irritations et démangeaisons. Utile pour rosacée, dermatite séborrhéique, eczéma, psoriasis.

  **Cicatrisation**
  Favorise la réépithélialisation et le dépôt de collagène. Supérieur au peroxyde d'hydrogène et à l'alcool (qui endommagent les cellules saines). Non allergisant (contrairement à néomycine/bacitracine). Sûr autour des yeux et oreilles (contrairement à la chlorhexidine). Indiqué post-laser, microneedling, Botox/fillers, piercings, tatouages, plaies mineures, coupures, éraflures, brûlures légères.

  **Barrière cutanée & microbiome**
  Régule le microbiome cutané et contribue à restaurer/maintenir la barrière.

  ## Preuves cliniques
  - **Acné inflammatoire** : comparable au peroxyde de benzoyle dans une étude comparative (BPO agit peut-être plus vite). Logique via double action antimicrobienne + anti-inflammatoire.
  - **Eczéma / prurit** : amélioration rapide des démangeaisons en 3–14 jours dans plusieurs études (attention : certaines sans placebo, effet hydratation/occlusion possible).
  - **Cicatrisation / plaies** : preuves les plus solides, y compris ulcères diabétiques.
  - **Cicatrices hypertrophiques** : meilleur que silicone dans certaines études (2025).
  - **Blépharite / orgelet** : efficace et sûr autour des paupières, utilisé en ophtalmologie.
  - **Anti-âge** : données très faibles, souvent anecdotiques ou issues de posters d'entreprises. Risque pro-oxydant théorique probablement minime aux concentrations skincare.

  ## Mode d'utilisation
  1. Nettoyer la peau
  2. Vaporiser directement (peau sèche de préférence pour efficacité optimale)
  3. Laisser sécher **complètement** (30 s–2 min) avant la suite de la routine
  4. Pas de rinçage
  5. Appliquer crème/sérum/SPF par-dessus normalement

  **Usages pratiques :**
  - **Acné mécanique / maskné** : vaporiser *avant* de mettre masque, casque, filet à cheveux → réduit la charge bactérienne en amont
  - **Post-entraînement** : corps, aisselles (odeurs liées aux bactéries qui décomposent la sueur), zones sujettes à l'eczéma (la sueur déclenche itch/inflammation)
  - **Sanitizer mains** : non desséchant, ne pique pas sur les coupures, pas de rinçage nécessaire
  - **Barbe** : réduit la transmission bactérienne (ex. impétigo)
  - **On-the-go** : post-maquillage en début de soirée, réapplication en journée sans décaper la peau

  ## Fréquence
  1–2×/jour ou plus selon les besoins — la réapplication fréquente est bien tolérée, sans effet strippant. Mieux comme produit **au besoin** que comme permanent si pas de problème microbien/inflammatoire actif.

  ## Incompatibilités & précautions

  **Interactions à connaître**
  Oxydant → peut inactiver vitamine C, rétinol et autres antioxydants (la vitamine C est détruite en ~10 min au contact direct). Laisser sécher **complètement** avant application des autres actifs, ou espacer dans la routine (ex. HOCl le matin, vitamine C/rétinol le soir).

  **Stabilité fragile — point critique**
  Le HOCl se dégrade rapidement avec :
  - La lumière (UV → destruction en quelques heures)
  - L'air/oxygène (ouvrir le flacon = perte rapide)
  - La chaleur (éviter voiture chaude, congélation)
  - Un pH inadapté
  - Les métaux et certaines molécules
  - L'eau du robinet (préférer eau pure)

  Même les produits du commerce peuvent perdre leur efficacité assez rapidement après ouverture. Conserver au frigo, à l'abri de la lumière, dans un flacon hermétique opaque. Ne pas stocker en gros ni transvaser. Privilégier des lots récents.

  ## Pour qui ?
  ✅ Peaux acnéiques, réactives, sensibles, rosacée, eczéma, dermatite atopique
  ✅ Post-procédures (laser, microneedling, injections)
  ✅ Sportifs (sueur → inflammation/odeurs/itch)
  ✅ Peaux irritées par lavages fréquents ou sanitizers
  ✅ Blépharite, orgelet
  ⛔ Peau saine sans problème particulier → pas de bénéfice prouvé en préventif long terme

  ## Produits recommandés
  Privilégier des formules **ultra-simples** (< 5 ingrédients, sans parfum ni additifs), dans des flacons opaques hermétiques.

  - **Briotech** : grand flacon abordable (<15€), formule minimaliste
  - **Tower 28 SOS Spray** : a popularisé l'ingrédient en skincare grand public, certifié National Eczema Association
  - **Prequel Universal Skin Solution** : transparent (pH et % HOCl indiqués sur l'emballage), <15€
  - **SkinSmart Antimicrobial** : abordable, utilisé en cabinet dermatologique
  - **Active Skin Repair** : multi-usage (visage, corps, post-coupure, animaux)`,
  },
  {
    name: "Niacinamide",
    slug: INGREDIENT_SLUGS.NIACINAMIDE,
    category: "actif",
    description: "Dérivé amide de la vitamine B3 (nicotinamide). Ingrédient hydrosoluble, ultra-stable, \"jack-of-all-trades\" avec des centaines d'études. Agit sur la barrière cutanée, l'hyperpigmentation, les rougeurs, le sébum, les pores et les rides. Excellent support qui rend les autres actifs plus performants et tolérables. Sur la liste des médicaments essentiels de l'OMS.",
    content: `## Nature et origine
  Forme amide de l'acide nicotinique (niacine), découverte entre 1935 et 1937. Hydrosoluble, stable, naturellement présente dans l'organisme et l'alimentation (viande, poisson, légumineuses, noix, champignons, levure, lait, légumes verts, café). Précurseur de **NAD+/NADH** et **NADPH** → rôle central dans le métabolisme cellulaire, la réparation ADN et la production d'ATP.

  Le corps peut aussi synthétiser du NAD+ à partir du tryptophane (acide aminé) et de la niacine, sans ingestion directe de niacinamide (voie de sauvetage vs voie de novo).

  À ne pas confondre avec la **niacine** (acide nicotinique) qui provoque un flush (rougeur/chaleur) et agit sur le cholestérol — la niacinamide n'a aucun de ces effets.

  ## Mécanismes d'action
  - **Barrière cutanée** : augmente la synthèse in vivo de céramides, acides gras et cholestérol (ratio idéal ~50/25/15 % dans la couche cornée) → réduit la TEWL (perte d'eau transépidermique)
  - **Hyperpigmentation** : inhibe le transfert des mélanosomes des mélanocytes vers les kératinocytes (voie différente des inhibiteurs classiques de tyrosinase comme la vitamine C)
  - **Anti-inflammatoire** : inhibe NF-κB, PARP-1 et production de monoxyde d'azote (NO). Empêche l'activation du toll-like receptor 2 par C. acnes → down-régulation de l'interleukine-8 pro-inflammatoire
  - **Sébum** : diminue la sécrétion des sébocytes → régulation production d'huile
  - **Antioxydant** : régénère NADPH → neutralise radicaux libres (UV, pollution)
  - **Anti-glycation** : réduit le jaunissement cutané (rigidité collagène/élastine)
  - **Immunité cutanée** : augmente production de kératine → couche cornée plus intacte
  - **Inhibition PARP-1** : enzymes impliquées dans la réparation des cassures ADN induites par radiation/chimiothérapie → rôle potentiel en photoprotection et chimioprévention

  ## Bénéfices prouvés cliniquement (études randomisées, double-aveugle)
  - Renforce la barrière cutanée (hydratation +35 %, TEWL −24 % à 2 %)
  - Réduit la production de sébum (−20 à 40 %) et l'apparence des pores
  - Atténue l'hyperpigmentation / PIH / melasma (−35 à 68 % transfert mélanosomes)
  - Diminue les rougeurs et l'inflammation (acné, rosacée, érythème post-UV)
  - Améliore ridules (−18 à 23 %) et élasticité (+16 %)
  - Unifie le teint, réduit le jaunissement cutané
  - Anti-acné inflammatoire comparable à clindamycine topique 2 % (études à 4 %)

  ## Bénéfices systémiques (voie orale)
  - **Chimioprévention cutanée** : 500–1000 mg/jour oral réduit le risque de cancers cutanés non-mélanome et kératoses actiniques chez les personnes à haut risque
  - **Santé oculaire** : résultats prometteurs pour ralentir la perte de vision liée au glaucome (protection des cellules ganglionnaires rétiniennes — recherche en cours, pas encore approuvé)
  - **Psoriasis** : données préliminaires suggérant un bénéfice potentiel
  - **Dermatite atopique / pemphigoïde bulleuse** : preuves préliminaires
  - **Modulateur GABAA** : allostérique positif (pourrait contribuer à l'effet calmant/anxiolytique rapporté)

  ## Concentration recommandée (topique)
  - **2 %** : excellent pour barrière, hydratation, sébum modéré, peaux sensibles/irritées
  - **4–5 %** : le **sweet spot** le plus documenté — résultats solides sur tous les bénéfices ci-dessus
  - **10 %** : populaire (The Ordinary), toléré par certains mais **aucune étude ne montre un avantage clair vs 5 %**
  - **Au-delà de 10 %** : marketing pur, pas de dose-réponse linéaire prouvée, risque d'irritation ×3

  **Formule > concentration** : un 5 % bien formulé (pH 5–7, texture pénétrante, adjuvants comme zinc/panthénol) bat un 15 % mal fichu.

  ## Mode d'utilisation
  Appliquer sur tout le visage, **leave-on** (rinse-off = effet limité). Assez doux pour **2×/jour**.

  **Layering** (fin → épais, aqueux → occlusif) :
  1. Nettoyant doux
  2. Toner (optionnel)
  3. Sérum niacinamide ← placement typique
  4. Crème / moisturizer
  5. SPF (matin)

  **Fréquence** : quotidienne AM + PM. Commencer 3–4×/semaine si peau réactive, puis augmenter.
  **Patience** : résultats visibles 4–8 semaines, optimaux 3–6 mois. Constance > concentration haute.

  ## Compatibilités et associations
  - **Rétinol / rétinoïdes** → excellent ensemble (niacinamide calme l'irritation du rétinol et renforce la barrière)
  - **Vitamine C** → pas d'incompatibilité chimique prouvée (mythe ancien démenti). Souvent vit C d'abord, puis niacinamide
  - **Acides (AHA/BHA)** → réduit souvent l'irritation. Peut alterner ou superposer
  - **Acide azélaïque** → synergie puissante (anti-rougeurs + anti-inflammatoire + PIH)
  - **Hyaluronique / peptides / céramides** → complémentarité parfaite pour hydratation
  - **Bakuchiol** → synergie sans risque

  ## Meilleurs pairings selon objectif
  | Objectif | Combo recommandé |
  |---|---|
  | **Taches / hyperpigmentation / PIH** | Niacinamide + rétinoïde + inhibiteur tyrosinase (vit C, azélaïque, kojique, tranexamique, arbutine) + SPF teinté |
  | **Contrôle sébum / pores** | Niacinamide + acide salicylique (BHA) |
  | **Acné / imperfections** | Niacinamide + rétinoïde (adapalène) ou acide azélaïque |
  | **Barrière / hydratation / sécheresse** | Niacinamide + céramides + hyaluronique |
  | **Rougeurs / rosacée** | Niacinamide + acide azélaïque |
  | **Anti-âge global** | Niacinamide + vitamine C (matin) + rétinol (soir) + SPF |
  | **Grossesse** | Niacinamide + acide azélaïque (combo sûr et puissant) |

  ## Précautions
  - **Cumul à surveiller** : nettoyant + sérum + crème + SPF tous avec niacinamide → total peut dépasser 15–20 % → irritation paradoxale (rougeurs, sécheresse, picotements, boutons). Vérifier les listes INCI
  - **Irritation possible** : rare mais existe (surtout hautes doses, barrière déjà faible, routine surchargée). Si rougeurs/picotements/boutons → baisser % ou fréquence. **Pas de "purge" avec la niacinamide**
  - **Éviter les poudres pures** à mélanger soi-même : risque de surdosage, inutile
  - Irritation plus fréquente dans les **nettoyants** (rinse-off)
  - **Interactions médicamenteuses potentielles** : inhibiteur CYP2D6 et CYP3A4 (à considérer en cas de traitements oraux métabolisés par ces voies)

  ## Sécurité
  - Effets secondaires minimaux jusqu'à 5–10 % topique (pas irritant, pas sensibilisant, pas photosensibilisant)
  - **Safe pendant grossesse et allaitement**
  - Tous types de peau : grasse, sèche, mixte, sensible, jeune, mature, claire, foncée
  - Toxicité hépatique aiguë documentée uniquement au-delà de **3 g/jour oral** (adultes)
  - Pas de contre-indication majeure connue

  ## Qui en a vraiment besoin ?
  - **Dès 35–40 ans** : très intéressant → boost céramides + soutien anti-âge (chute naturelle des céramides avec l'âge)
  - **Peaux grasses/acnéiques** : complément utile (sébum ↓ + anti-inflammatoire), mais pas miracle seul
  - **Peaux sensibles / rosacée** : introduire tôt → renforce tolérance pour les actifs suivants
  - **Hyperpigmentation** : aide en prévention/combo, pas suffisant seul pour taches tenaces
  - **Haut risque cancer cutané** : 500–1000 mg/jour oral réduit les récurrences (sous avis médical)
  - **Jeunes avec bonne routine** : facultatif, pas indispensable

  ## Niacine vs niacinamide (rappel)
  | | Niacine (acide nicotinique) | Niacinamide (nicotinamide) |
  |---|---|---|
  | Flush | Oui (intense, dès 30–50 mg) | Non |
  | Cholestérol / lipides | Réduit LDL/TG, augmente HDL | Aucun effet |
  | Usage skincare topique | Impraticable (flush) | Star en cosmétique |
  | Hépatotoxicité | Risque à hautes doses (>500–2000 mg/j, surtout sustained-release) | Très sûr (toxicité >3 g/j) |
  | Indication principale | Dyslipidémie, stéatose hépatique | Peau, anti-inflammatoire, anxiété |

  ## Comparaison vitamine C vs niacinamide
  | | Vitamine C (L-ascorbique) | Niacinamide |
  |---|---|---|
  | Collagène | Co-facteur direct (effet puissant) | Boost via NAD (effet modéré) |
  | Pigmentation | Inhibe tyrosinase (rapide, puissant) | Inhibe transfert mélanosomes (progressif, meilleur pour PIH) |
  | Photoprotection | Anti-radicaux libres directs | Réparation ADN post-UV + chimioprévention orale |
  | Acné / rosacée | Aide indirecte | Avantage net (sébum, anti-C. acnes via TLR2, anti-inflammatoire) |
  | Barrière | Peut augmenter TEWL (formules acides) | Renforce (céramides, hydratation) |
  | Stabilité | Instable, sensible oxydation/lumière/pH | Ultra-stable, facile à formuler |
  | Tolérance | Peut irriter (pH bas) | Excellente |
  | **Verdict** | Brightening rapide, collagène, photoprotection | Barrière, acné, rougeurs, tolérance, multifonction |
  | **Meilleure option** | **Les deux ensemble** (synergie prouvée) | |

  ## Déficience en B3 (pellagre)
  Rare en pays développés. Causée par manque de niacine/tryptophane (alimentation pauvre, alcoolisme, régime maïs non nixtamalisé). Symptômes : les "4 D" → **Dermatite** (photosensible), **Diarrhée**, **Démence**, **Death**. La niacinamide est le traitement de référence (sans le flush de la niacine).`,
  },
  {
    name: "Soufre (Sulfur)",
    slug: INGREDIENT_SLUGS.SULFUR,
    category: "ingredient",
    description: "Actif anti-acné parmi les plus anciens en dermatologie. Kératolytique, séborégulateur et antibactérien, il cible comédons, points noirs et inflammations — particulièrement efficace sur les peaux grasses et acnéiques.",
    content: `## Contexte historique & réglementaire
  Le soufre est l'un des plus anciens ingrédients actifs en dermatologie, utilisé depuis l'Antiquité (époque de Cléopâtre) et même employé historiquement contre la peste. Aujourd'hui, il est classé comme **médicament en vente libre (OTC)** aux États-Unis, au même titre que l'acide salicylique ou le peroxyde de benzoyle. Après avoir perdu en popularité face à ces actifs modernes, il connaît un **regain d'intérêt** notable.

  ## Nature & formulation
  Le soufre est un **minéral non métallique** d'origine naturelle, reconnaissable à son odeur caractéristique (souvent comparée à l'œuf pourri). C'est un ingrédient **difficile à formuler** :
  - Non soluble dans l'eau ni dans la plupart des supports cosmétiques classiques
  - Se présente généralement sous forme de **suspension** ou sédimente au fond des flacons
  - La **taille des particules** est cruciale : plus elles sont fines, plus le produit est efficace. Un produit granuleux est souvent le signe d'une mauvaise formulation

  ## Mécanisme d'action
  Le soufre agit sur plusieurs fronts simultanément :
  - **Kératolytique** (action la plus documentée) : dissout les liaisons entre kératinocytes en interagissant avec la cystéine de la peau, favorise l'élimination des cellules mortes et désincruste les pores
  - **Séborégulateur** : absorbe l'excès de sébum (mécanisme similaire aux argiles), réduit la production par action sur les glandes sébacées — bien que ce volet soit moins documenté scientifiquement
  - **Antimicrobien** : inhibe la prolifération de *Cutibacterium acnes* (anciennement *P. acnes*), mais son action spécifique sur cette bactérie est **moins prouvée** que celle du peroxyde de benzoyle
  - **Antifongique** (point fort) : très efficace contre *Malassezia* et les champignons — utilisé pour les pellicules, infections fongiques et fungal acne
  - **Anti-inflammatoire léger** : réduit rougeurs et gonflements des lésions actives

  ## Ce que dit la science
  Les données cliniques modernes sur le soufre utilisé seul sont **limitées** :
  - La plupart des études datent des **années 60–70**
  - Une étude récente de J&J sur une lotion asséchante (10 % soufre + 4 % niacinamide) a montré une **réduction de la rougeur et de la taille des boutons en 1 à 3 jours**
  - Les conclusions de la recherche actuelle (2020) qualifient les preuves d'efficacité du soufre de **"faibles à très faibles"** par rapport à d'autres actifs comme l'acide azélaïque
  - Le soufre reste néanmoins un actif OTC reconnu par la FDA

  > *Source : podcast Chemist Confessions — épisode dédié au soufre*

  ## Bienfaits
  - Traitement des comédons ouverts et fermés
  - Réduction des papules et pustules
  - Contrôle du brillant et du sébum en excès
  - Traitement de la dermite séborrhéique (squames, pellicules)
  - Efficace sur le "fungal acne" (folliculite à Malassezia)
  - Atténuation des points noirs

  ## Concentrations courantes
  - **2 – 5 %** : formules douces, usage quotidien, peaux mixtes
  - **5 – 10 %** : efficacité renforcée, usage ciblé ou en masque
  - **10 %+** : usage clinique / prescriptions dermatologiques

  ## Formes & formats
  - **Masque point noir / clay mask** : usage 1–2x/semaine, laissé 5–15 min
  - **Spot treatment** : application ciblée sur les lésions actives — **usage idéal** selon les experts
  - **Nettoyant** : contrôle sébum sans résidu occlusif
  - **Crème de nuit** : usage régulier sur zones problématiques

  ## Layering (routine soir recommandée)
  1. Nettoyage doux
  2. Toner équilibrant (optionnel)
  3. **Soufre** (spot treatment ou couche fine sur zones ciblées)
  4. Hydratant non comédogène (le soufre peut assécher — compenser)

  > En masque : appliquer après nettoyage, rincer, puis reprendre la routine habituelle.

  ## Compatibilités
  - ✅ Niacinamide : complémentaire, renforce la séborrégulation (combo validé par l'étude J&J : 10 % soufre + 4 % niacinamide)
  - ✅ Zinc : synergie anti-acné et anti-inflammatoire
  - ✅ Argile (kaolin, bentonite) : association classique en masque
  - ✅ Acide salicylique (BHA) : kératolyse complémentaire — mais surveiller la tolérance
  - ⚠️ Rétinol : utiliser en alternance, pas simultanément (risque de sur-irritation)
  - ❌ Peroxyde de benzoyle : **incompatibilité majeure** — réaction chimique produisant des composés irritants, éviter absolument
  - ❌ AHA forts + soufre en même application : sur-exfoliation

  ## Précautions & effets secondaires
  - **Odeur** caractéristique (œuf, soufre) — normale, varie selon la formule
  - **Assèchement** important : ingrédient très desséchant, **non recommandé en usage quotidien sur tout le visage**, surtout sur peaux sèches ou mixtes. Toujours hydrater après
  - **Acanthose** : une étude ancienne suggère qu'un usage prolongé pourrait causer un épaississement/noircissement de la peau — renforce l'idée d'un usage **ponctuel** plutôt que préventif à long terme
  - **Décoloration** : peut jaunir certains textiles — rincer les mains après application
  - **Peau sensible** : commencer par faible concentration, fréquence réduite
  - Éviter contour des yeux et muqueuses

  ## Verdict
  Le soufre est un actif de **secours** plutôt qu'un soin préventif quotidien. Son usage idéal reste le **spot treatment ponctuel** pour calmer rapidement un bouton inflammatoire. Les preuves scientifiques modernes restent faibles comparées à celles de l'acide azélaïque ou du peroxyde de benzoyle, mais son profil kératolytique + antifongique en fait un choix pertinent dans certaines situations (fungal acne, dermite séborrhéique).

  ## Conseils selon le profil
  - **Acné légère à modérée** : spot treatment 5 % soir + niacinamide matin
  - **Peau grasse / comédons** : masque soufre 1–2x/semaine
  - **Fungal acne** : soufre seul ou avec zinc pyrithione, éviter les huiles comédogènes
  - **Dermite séborrhéique** : formule soufre + acide salicylique en nettoyant`,
  },
  {
    name: "Acide Salicylique",
    slug: INGREDIENT_SLUGS.SALICYLIC_ACID,
    category: "actif",
    description: "BHA liposoluble, pénètre les pores pour lutter contre l'acné et les points noirs.",
    content: `
    # Acide Salicylique

    BHA (beta-hydroxy acid) liposoluble, exfoliant chimique qui pénètre au cœur des pores pour dissoudre le sébum, les cellules mortes et les impuretés. Idéal pour peaux grasses, mixtes, acnéiques, points noirs, pores dilatés et texture irrégulière. Action anti-inflammatoire, antibactérienne et kératolytique → réduit boutons, comédons, rougeurs et brillance excessive.

    ## INCI
    SALICYLIC ACID

    ## Concentration typique
    - **Exfoliant / anti-acné** : 0,5 à 2 % (2 % est la concentration la plus courante et efficace en OTC pour usage quotidien ; au-delà souvent localisé ou rinse-off).
    - **Conservateur** : jusqu’à 0,5 % (selon SCCS et réglementation UE).
    - **Localisé / spot treatment** : jusqu’à 5 % (crèmes ou patchs ciblés).
    En UE (2026) : max 2 % pour produits non rincés sur le visage/corps adulte ; limite plus stricte (0,1-0,5 %) pour enfants/enfants en bas âge selon usages. Pas de restriction majeure pour adultes si bien formulé.

    ## Mécanisme d’action
    L’acide salicylique est lipophile → il pénètre facilement les follicules pileux et les pores obstrués. Il :
    - Dissout le « ciment » intercellulaire (kératolytique) → exfolie en profondeur sans frotter.
    - Fluidifie le sébum accumulé → désobstrue et réduit la taille des pores.
    - Inhibe la production de prostaglandines → anti-inflammatoire (réduit rougeurs et gonflements).
    - A une légère action antimicrobienne contre Cutibacterium acnes (bactérie acnéique).
    - Améliore la forme interne des pores sur le long terme → moins de comédons futurs.

    ## Bienfaits prouvés (études cliniques)
    - **Anti-acné** : réduit comédons ouverts/fermés, boutons inflammatoires, microkystes (efficace dès 2-4 semaines).
    - **Pores & texture** : affine l’apparence des pores dilatés, lisse la peau rugueuse.
    - **Anti-inflammatoire** : apaise rougeurs, post-boutons et irritation.
    - **Exfoliation douce** : élimine cellules mortes, prévient accumulation de sébum.
    - **Prévention** : régule production de sébum, diminue brillance et risque de nouvelles poussées.

    Résultats optimaux après 4-12 semaines ; souvent une « purge » initiale (voir ci-dessous) accélère la clarté cutanée.

    ## Comment l’utiliser (guide pratique)
    - **Soir de préférence** (photosensibilisant léger → SPF matin obligatoire).
    - Peau propre et sèche.
    - Quantité : 2-3 gouttes de sérum ou petit pois pour le visage ; localisé sur zones touchées.
    - **Débutants / peaux sensibles** : commencez 2-3 soirs/semaine, puis quotidien si toléré.
    - **Protocole** : nettoyage → acide salicylique → hydratant riche (céramides, niacinamide, hyaluronique).
    - **Technique sandwich** (si irritation) : hydratant → BHA → hydratant.
    - **Matin** : possible si toléré, mais toujours suivi de SPF 30+ large spectre.
    - Éviter contour yeux, lèvres, zones lésées.

    ## Compatibilités & associations gagnantes
    - **Parfait avec** : niacinamide (apaisant + régule sébum), acide hyaluronique/céramides (renforce barrière), centella/panthénol (anti-rougeurs).
    - **Vitamine C** : oui (matin C, soir BHA) ou alterner.
    - **Bakuchiol** : excellent combo (matin bakuchiol, soir BHA).
    - **Rétinol / rétinoïdes** : possible mais prudence → alterner les soirs (ex. BHA lundi/mercredi/vendredi, rétinol autres soirs) pour éviter irritation cumulée. Commencer lentement.
    - **AHA (glycolique, lactique)** : alterner ou utiliser faible % ; risque irritation si layering agressif.
    - **Éviter layering immédiat** : très forts AHA + BHA même soir si peau sensible ; attendre 15-30 min si combo.

    ## Effets secondaires & précautions
    - **Effets courants** (surtout début) : sécheresse, desquamation, picotements, rougeurs transitoires.
    - **Purge cutanée** : poussée temporaire d’imperfections (4-8 semaines) → microkystes et comédons remontent plus vite → signe que ça marche ! Persévérez avec hydratation renforcée.
    - **Photosensibilité** : légère → SPF quotidien indispensable.
    - **Grossesse & allaitement** : prudence recommandée. Faibles concentrations (<2 %) topiques considérées généralement sûres par beaucoup d’experts (pas absorbé systémiquement en quantité significative), mais principe de précaution : éviter ou limiter (surtout >2 % ou grandes surfaces). Alternatives : niacinamide, azélaïque, acide hyaluronique. **Toujours consulter un médecin/dermatologue**.
    - Test patch 24-48 h conseillé.
    - Éviter sur peau très sèche, eczémateuse, lésée ou post-peeling.
    - Conserver à température ambiante, flacon opaque.

    ## Acide Salicylique vs autres exfoliants – comparatif rapide
    | Critère              | Acide Salicylique (BHA)            | AHA (glycolique, lactique)         | PHA (gluconolactone)               |
    |----------------------|------------------------------------|------------------------------------|------------------------------------|
    | Solubilité           | Liposoluble (pénètre pores)        | Hydrosoluble (surface)             | Hydrosoluble (très doux)           |
    | Action principale    | Désobstrue pores, anti-acné        | Exfolie surface, anti-âge          | Exfolie + hydrate, antioxydant     |
    | Irritation           | Moyenne (purge possible)           | Moyenne à élevée                   | Très faible                        |
    | Peaux cibles         | Grasses, acnéiques, pores dilatés  | Sèches, matures, taches            | Sensibles, réactives               |
    | Concentration typique| 0,5-2 %                            | 5-10 %                             | 5-15 %                             |
    | Utilisation          | Soir (idéal)                       | Soir                               | Matin + soir                       |
    | Photosensibilité     | Légère                             | Oui                                | Faible                             |

    **Conseil expert** : l’acide salicylique est l’actif n°1 pour transformer une peau acnéique/grasse en peau nette et mate. Introduisez-le progressivement, hydratez intensément et protégez du soleil pour éviter irritation et maximiser les bénéfices. Associez à niacinamide pour booster tolérance et résultats anti-imperfections. Patience pendant la purge → la peau en sort plus belle et équilibrée !
    `,
  },
];
