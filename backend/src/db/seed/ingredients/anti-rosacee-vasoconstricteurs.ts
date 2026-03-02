import { IngredientInput } from "./seed-ingredients";
import { INGREDIENT_SLUGS } from "./ingredient-slugs";

export const ANTI_ROSACEE_VASOCONSTRICTEURS: IngredientInput[] = [
  {
    name: "Endothelyol®",
    slug: INGREDIENT_SLUGS.ENDOTHELYOL,
    category: "actif",
    description: "Complexe biotechnologique breveté ciblant les micro-vaisseaux et l’inflammation pour réduire les rougeurs chroniques et passagères.",
    content: `
  # Endothelyol®
  L'Endothelyol® est un ingrédient de pointe issu de la recherche SVR, spécifiquement conçu pour répondre aux problématiques des peaux sujettes à la couperose et à la rosacée. Contrairement aux apaisants classiques, il agit directement sur les facteurs de vascularisation cutanée.
  ## INCI
  **CAFFEYL GLUCOSIDE, ROSMARINYL GLUCOSIDE, GOSSYPIUM HERBACEUM (COTTON) SEED OIL** (Note : Le complexe est souvent identifié par ses dérivés de polyphénols).
  ## Composition
  - **Dérivés de l'acide caféique et rosmarinique** : Molécules stabilisées pour une meilleure pénétration et efficacité antioxydante.
  - **Action ciblée** : Agit sur les médiateurs de l'inflammation (interleukines) et les facteurs de croissance endothéliaux.
  ## Mécanisme d'action
  1. **Anti-angiogénique** : Limite la formation de nouveaux petits capillaires sanguins (néovascularisation) qui rendent les rougeurs permanentes.
  2. **Amélioration de la microcirculation** : Aide à décongestionner les tissus et réduit l'apparence des vaisseaux déjà visibles.
  3. **Apaisement immédiat** : Stoppe la cascade inflammatoire responsable des sensations de brûlure et de "flush".
  ## Bienfaits
  - Réduction prouvée de l'intensité des rougeurs.
  - Teint plus uniforme et moins réactif aux changements de température.
  - Action préventive contre l'aggravation de la rosacée.
  ## Utilisation
  - **Cible** : Peaux avec rougeurs, couperose, rosacée, flushs, peaux hypersensibles.
  - **Type de soin** : Crèmes anti-rougeurs, sérums apaisants, soins post-actes dermatologiques.
`,
  },
  {
    name: "Brimonidine",
    slug: INGREDIENT_SLUGS.BRIMONIDINE,
    category: "actif",
    description: "Vasoconstricteur topique agoniste α2-adrénergique (prescription), traitement de l'érythème facial persistant de la rosacée. Réduction rapide des rougeurs en ~30 minutes.",
    content: `
  # Brimonidine
  La brimonidine est un agoniste sélectif des récepteurs α2-adrénergiques utilisé en application topique pour réduire l'érythème facial persistant de la rosacée. Commercialisée sous le nom Mirvaso® (gel 0,33%), elle est l'un des deux seuls vasoconstricteurs topiques ayant une AMM spécifique pour la rosacée.
  ## INCI
  **BRIMONIDINE TARTRATE**
  ## Mécanisme d'action
  1. **Agonisme α2-adrénergique sélectif** : Se lie aux récepteurs α2 des muscles lisses vasculaires dermiques → vasoconstriction des vaisseaux superficiels → réduction visible de l'érythème.
  2. **Sélectivité α2** : Contrairement à l'oxymétazoline, la brimonidine est hautement sélective pour les récepteurs α2, ce qui limite les effets systémiques et le rebond.
  3. **Pas d'action sur les papules/pustules** : Agit uniquement sur la composante vasculaire (érythème), sans effet sur les lésions inflammatoires.
  ## Bienfaits
  - **Réduction rapide de l'érythème** : Effet visible en 30 minutes, durée ~8-12h.
  - **Meilleure tolérance** que l'oxymétazoline sur le plan du rebond vasculaire.
  - **AMM rosacée** : Seul traitement topique approuvé spécifiquement pour l'érythème facial persistant.
  ## Effets indésirables
  - **Érythème de rebond** : Décrit chez ~10-20% des patients (vasodilatation réactionnelle en fin d'effet).
  - Flush, sensation de brûlure locale à l'application.
  - Risque de tachyphylaxie à l'usage quotidien prolongé.
  ## Utilisation
  - **Statut** : Médicament sur ordonnance (prescription obligatoire).
  - **Forme** : Gel 0,33% (Mirvaso®).
  - **Moment** : Matin, une application par jour sur les zones concernées.
  - **Conseil** : Réserver aux événements ponctuels plutôt qu'à un usage quotidien au long cours pour limiter le rebond et la tachyphylaxie.
  ## Note technique
  La brimonidine est préférée en première intention par rapport à l'oxymétazoline pour son profil de sélectivité α2 plus favorable et un rebond moins marqué. Elle n'a aucun effet sur la composante inflammatoire (papules, pustules) ni sur la couperose (vaisseaux dilatés permanents) — son action est purement fonctionnelle et temporaire sur la vasodilatation réactive.
`,
  },
  {
    name: "Oxymétazoline",
    slug: INGREDIENT_SLUGS.OXYMETAZOLINE,
    category: "actif",
    description: "Vasoconstricteur topique agoniste α1/α2-adrénergique (prescription), traitement de l'érythème facial persistant de la rosacée. Effet rapide mais rebond vasculaire plus marqué que la brimonidine.",
    content: `
  # Oxymétazoline
  L'oxymétazoline est un agoniste des récepteurs α1 et α2-adrénergiques utilisé en application topique pour réduire l'érythème facial persistant de la rosacée. Commercialisée sous le nom Rhofade® (crème 1%), elle partage le même mécanisme vasoconstricteur que la brimonidine mais avec un profil de sélectivité différent.
  ## INCI
  **OXYMETAZOLINE HYDROCHLORIDE**
  ## Mécanisme d'action
  1. **Agonisme α1 et α2-adrénergique** : Se lie aux récepteurs α1 (principalement) et α2C des muscles lisses vasculaires → vasoconstriction → réduction de l'érythème.
  2. **Moindre sélectivité** : Le profil mixte α1/α2 est responsable d'un rebond vasculaire plus marqué que la brimonidine en fin d'effet — même classe pharmacologique que les décongestionnants nasaux (Rhinospray®), dont la dépendance/rebond est bien documentée.
  3. **Pas d'action sur les papules/pustules** : Effet purement vasculaire, sans activité anti-inflammatoire ou antiparasitaire.
  ## Bienfaits
  - **Réduction rapide de l'érythème** : Effet en ~30 minutes, durée ~8-12h.
  - **AMM rosacée** : Approuvée pour l'érythème facial persistant.
  - Texture crème potentiellement mieux tolérée localement que le gel brimonidine chez certains patients.
  ## Effets indésirables
  - **Érythème de rebond plus marqué** que la brimonidine : vasodilatation réactionnelle significative en fin d'effet.
  - Risque de dépendance fonctionnelle à l'usage répété (tachyphylaxie).
  - Flush, prurit, sensation de brûlure locale.
  ## Utilisation
  - **Statut** : Médicament sur ordonnance (prescription obligatoire).
  - **Forme** : Crème 1% (Rhofade®).
  - **Moment** : Matin, une application par jour.
  - **Conseil** : Usage ponctuel fortement recommandé — le risque de rebond et de dépendance contre-indique l'usage quotidien au long cours.
  ## Note technique
  L'oxymétazoline est généralement considérée en deuxième intention après la brimonidine en raison de son rebond plus prononcé. Son développement spécifique pour la rosacée (vs usage nasal historique) a permis une formulation cutanée optimisée, mais la classe pharmacologique reste la même. À ne pas confondre avec les traitements de fond de la rosacée (ivermectine, métronidazole) : l'oxymétazoline ne traite que le symptôme érythémateux et n'agit pas sur l'évolution de la maladie.
`,
  },
  {
    name: "Métronidazole",
    slug: INGREDIENT_SLUGS.METRONIDAZOLE,
    category: "actif",
    description: "Antibiotique et antiparasitaire topique (prescription), traitement de référence de la rosacée papulo-pustuleuse. Anti-inflammatoire cutané avec une longue histoire d'efficacité clinique.",
    content: `
  # Métronidazole
  Le métronidazole est un agent antimicrobien et anti-inflammatoire topique utilisé depuis les années 1980 dans le traitement de la rosacée papulo-pustuleuse. Disponible en gel ou crème à 0,75% (Rozex®, Metrogel®), il reste un traitement de référence bien documenté, bien que son mécanisme exact dans la rosacée ne soit pas entièrement élucidé.
  ## INCI
  **METRONIDAZOLE**
  ## Mécanisme d'action
  1. **Anti-inflammatoire** : Inhibe la migration des leucocytes polymorphonucléaires et réduit la production de radicaux libres oxygénés → diminution de l'inflammation cutanée.
  2. **Antiparasitaire** : Activité contre Demodex folliculorum (acarien impliqué dans la rosacée), bien que moins puissante que l'ivermectine.
  3. **Antibactérien** : Actif sur les anaérobies, rôle possible dans la régulation du microbiome cutané.
  4. **Mécanisme rosacée** : Probablement multifactoriel — l'effet anti-inflammatoire prédomine sur l'effet antimicrobien dans ce contexte.
  ## Bienfaits
  - **Réduction des papules et pustules** : Efficacité prouvée sur la composante inflammatoire de la rosacée (sous-type II).
  - **Réduction de l'érythème** : Effet modéré sur les rougeurs en traitement de fond (≠ vasoconstricteurs).
  - **Long recul clinique** : Utilisé depuis >40 ans, profil de sécurité bien établi.
  - **Bonne tolérance locale** : Peu irritant, adapté aux peaux sensibles.
  ## Effets indésirables
  - Sécheresse, légères irritations locales possibles.
  - Goût métallique si contact avec les lèvres (rare en application faciale soigneuse).
  - Photosensibilité légère possible.
  ## Utilisation
  - **Statut** : Médicament sur ordonnance (prescription obligatoire).
  - **Forme** : Gel ou crème 0,75% (Rozex®, Metrogel®) ; crème 1% disponible dans certains pays.
  - **Moment** : Matin et/ou soir selon prescription, en traitement de fond.
  - **Durée** : Traitement continu sur plusieurs semaines/mois — pas un traitement ponctuel.
  ## Note technique
  Le métronidazole est souvent comparé à l'ivermectine (Soolantra®) dans la rosacée papulo-pustuleuse. Les études comparatives tendent à montrer une supériorité de l'ivermectine sur les lésions inflammatoires, notamment via son action anti-Demodex plus ciblée. Cependant, le métronidazole reste une option valide en première ligne, moins coûteuse et avec un recul clinique plus long. Les deux peuvent être utilisés en association ou en alternance selon la réponse clinique.
`,
  },
  {
    name: "Ivermectine",
    slug: INGREDIENT_SLUGS.IVERMECTINE,
    category: "actif",
    description: "Antiparasitaire topique anti-Demodex (prescription), traitement de référence de la rosacée papulo-pustuleuse. Action combinée antiparasitaire et anti-inflammatoire supérieure au métronidazole dans les études comparatives.",
    content: `
  # Ivermectine
  L'ivermectine topique (Soolantra® 1% crème) est aujourd'hui considérée comme le traitement de fond de référence de la rosacée papulo-pustuleuse. Issue de la classe des avermectines, elle cible directement Demodex folliculorum — l'acarien dont la surpopulation est fortement impliquée dans la physiopathologie de la rosacée inflammatoire — tout en exerçant un effet anti-inflammatoire propre.
  ## INCI
  **IVERMECTIN**
  ## Mécanisme d'action
  1. **Anti-Demodex** : Potentialise les canaux chlorure glutamate-dépendants des arthropodes → paralysie et mort de Demodex folliculorum, dont la densité est anormalement élevée dans la rosacée papulo-pustuleuse.
  2. **Anti-inflammatoire direct** : Inhibe les cytokines pro-inflammatoires (IL-1β, TNF-α, IL-6) et la production de ROS indépendamment de son action antiparasitaire.
  3. **Dual action** : La combinaison des deux mécanismes explique sa supériorité clinique sur le métronidazole (action anti-inflammatoire seule) dans les études head-to-head.
  ## Bienfaits
  - **Réduction supérieure des papules/pustules** : Supériorité démontrée vs métronidazole 0,75% dans deux études de phase III.
  - **Action sur la cause** : Seul traitement topique ciblant directement Demodex, facteur étiologique majeur.
  - **Effet durable** : Rechute plus lente après arrêt vs métronidazole.
  - **Bonne tolérance** : Peu irritant, adapté aux peaux sensibles et réactives.
  ## Effets indésirables
  - Sécheresse, légère irritation ou sensation de brûlure initiale (transitoire).
  - Très faible absorption systémique en application topique → sécurité systémique excellente.
  ## Utilisation
  - **Statut** : Médicament sur ordonnance (prescription obligatoire).
  - **Forme** : Crème 1% (Soolantra®), une application par jour.
  - **Moment** : Soir de préférence.
  - **Durée** : Traitement de fond continu (minimum 12 semaines pour évaluer l'efficacité complète).
  ## Note technique
  L'ivermectine topique ne doit pas être confondue avec l'ivermectine orale (antiparasitaire systémique, hors AMM rosacée). En cas de rosacée sévère ou résistante, une association ivermectine topique + doxycycline orale (Oracea® 40mg) est la stratégie la mieux documentée. L'ivermectine n'agit pas sur l'érythème vasculaire (pour lequel brimonidine ou oxymétazoline sont indiquées) — les deux approches sont complémentaires et non interchangeables.
`,
  },
  {
    name: "Angiopausine™ (Extrait de Silybum marianum)",
    slug: INGREDIENT_SLUGS.ANGIOPAUSINE,
    category: "actif",
    description: "Actif breveté d'origine naturelle qui réduit la néovascularisation pour traiter les rougeurs installées et la couperose.",
    content: `
    # Angiopausine™ (Extrait de Silybum marianum)
    L'Angiopausine™ est un actif de rupture issu de la Recherche Pierre Fabre, spécifiquement développé pour le soin des peaux sujettes aux rougeurs chroniques. Extrait de manière éco-responsable des graines de Chardon-marie, cet ingrédient cible pour la première fois les mécanismes biologiques profonds de la microcirculation cutanée.
    ## INCI
    **SILYBUM MARIANUM FRUIT EXTRACT**
    (Fraction spécifique purifiée de l'extrait de fruit de Chardon-marie)
    ## Composition chimique
    - **Flavonolignanes purifiés** : Molécules actives stabilisées pour une pénétration optimale.
    - **Silybine** : Molécule de référence pour ses propriétés protectrices vasculaires.
    ## Mécanisme d’action
    1. **Inhibition de la néovascularisation** : Freine la formation de nouveaux micro-vaisseaux sanguins (angiogenèse).
    2. **Stabilisation des capillaires** : Renforce la paroi des vaisseaux existants pour limiter leur dilatation permanente.
    3. **Action anti-inflammatoire ciblée** : Réduit les médiateurs responsables de la vasodilatation réflexe.
    4. **Protection de la matrice extra-cellulaire** : Préserve les tissus de soutien autour des vaisseaux pour éviter leur fragilisation.
    ## Bienfaits
    - **Réduction des rougeurs** : Diminue visiblement l'intensité des rougeurs installées dès **15 jours**.
    - **Action anti-récidive** : Limite la réapparition des vaisseaux apparents (télangiectasies).
    - **Apaisement thermique** : Calme instantanément les sensations d'échauffement et les flushes.
    - **Amélioration du teint** : Uniformise la carnation en neutralisant les zones de congestion.
    ## Utilisation
    - **Cible** : Peaux à tendance couperosique, rosacée ou présentant des rougeurs diffuses.
    - **Moment** : Application bi-quotidienne (matin et soir) sur les zones concernées.
    - **Type de soin** : Actif phare de la gamme **Antirougeurs ROSAMED**.
    ## Note technique
    L'Angiopausine™ représente une innovation majeure car elle ne se contente pas de masquer la rougeur par des pigments verts : elle traite l'origine vasculaire du problème. Ce brevet exclusif Pierre Fabre garantit une efficacité clinique démontrée sous contrôle dermatologique sur les peaux les plus sensibles et réactives.
  `,
  },
];
