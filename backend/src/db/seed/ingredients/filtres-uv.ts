import { INGREDIENT_SLUGS } from './ingredient-slugs'
import type { IngredientInput } from './seed-ingredients'

export const FILTRES_UV: IngredientInput[] = [
  {
    name: 'Drometrizole Trisiloxane (Mexoryl XL)',
    slug: INGREDIENT_SLUGS.DROMETRIZOLE_TRISILOXANE,
    category: 'Protection Solaire & Photostabilité',
    description:
      'Un système filtrant lipophile breveté, offrant une protection à large spectre contre les UVA et UVB avec une photostabilité exceptionnelle.',
    content: `
# Drometrizole Trisiloxane : Le Bouclier Large Spectre

Plus connu sous le nom de **Mexoryl XL**, le **Drometrizole Trisiloxane** est une molécule de pointe dans l'ingénierie solaire. Ce filtre organique "intelligent" a été conçu pour absorber l'énergie des rayonnements UVA et UVB, prévenant ainsi les dommages cellulaires et le photo-vieillissement prématuré.

---

## 🔬 Expertise en Photoprotection
* **Large Spectre** : Couvre efficacement une large bande de rayons UV, protégeant à la fois contre les coups de soleil (UVB) et les dommages profonds (UVA).
* **Photostabilité** : Contrairement à certains filtres qui se dégradent sous l'effet du soleil, il conserve son efficacité protectrice tout au long de l'exposition.
* **Affinité Lipophile** : Sa structure lui permet de s'intégrer parfaitement aux phases huileuses des crèmes, garantissant une répartition homogène sur la peau.

---

## ⚖️ Transparence Scientifique & Limites
* **Données de Référence** : C'est l'un des filtres les plus étudiés et validés par la recherche dermatologique mondiale pour sa sécurité et son efficacité.
* **Impact Environnemental** : Bien que considéré comme sûr pour la santé humaine, son impact sur les écosystèmes marins fait l'objet d'une surveillance continue, incitant à des formulations de plus en plus éco-responsables.
* **Limites** : Son efficacité est maximale lorsqu'il est combiné à d'autres filtres (comme le Mexoryl SX) pour une couverture totale.

---

## 🛡️ Précautions & Sécurité
* **Haute Tolérance** : Très bien toléré par les peaux sensibles, il ne présente pas de potentiel allergisant majeur comparativement aux anciens filtres solaires.
`,
  },

  {
    name: 'Avobenzone (Butyl Methoxydibenzoylmethane)',
    slug: INGREDIENT_SLUGS.BUTYL_METHOXYDIBENZOYLMETHANE,
    category: 'Protection UVA',
    description:
      'Le filtre de référence pour l’absorption des UVA longs, protégeant les structures profondes de la peau contre le vieillissement actinique.',
    content: `
# Avobenzone : L'Absorbant UVA de Référence

L'**Avobenzone** est l'un des rares filtres organiques capables d'absorber l'intégralité du spectre UVA (jusqu'à 400 nm). C'est l'ingrédient clé pour prévenir l'apparition des taches pigmentaires, la perte de fermeté et la dégradation de l'ADN induites par le soleil.

---

## ✨ Points Forts & Bénéfices
* **Défense Anti-Âge** : Cible spécifiquement les rayons responsables du vieillissement prématuré.
* **Standard Mondial** : Utilisé dans les formulations solaires les plus performantes à travers le globe.

---

## ⚖️ Transparence Scientifique & Limites
* **Instabilité Naturelle** : L'Avobenzone pure est instable à la lumière et perd 36% de sa capacité d'absorption après une heure d'exposition si elle n'est pas stabilisée.
* **Nécessité de Stabilisation** : Pour être efficace, elle doit impérativement être couplée à des stabilisateurs (comme l'Octocrylene ou le Mexoryl) dans la formule finale.
* **Taches sur les textiles** : Peut laisser des traces jaunâtres indélébiles sur les vêtements clairs.

---

## 🛡️ Précautions & Sécurité
* **Potentiel Irritant** : Peut être légèrement irritant pour les yeux et les peaux extrêmement réactives.
`,
  },

  {
    name: 'Octocrylene',
    slug: INGREDIENT_SLUGS.OCTOCRYLENE,
    category: 'Stabilisateur & Protection UVB',
    description:
      'Un filtre UVB liquide qui joue un rôle crucial de stabilisateur pour les autres filtres solaires, tout en renforçant la résistance à l’eau des formules.',
    content: `
# Octocrylene : Le Stabilisateur de Protection

L'**Octocrylene** est un filtre organique polyvalent. Bien qu'il protège contre les rayons UVB et les UVA courts, son rôle principal en formulation est de servir de "garde du corps" aux filtres plus fragiles comme l'Avobenzone, garantissant une protection durable.

---

## ✨ Points Forts & Bénéfices
* **Photostabilisation** : Empêche la dégradation précoce des autres filtres solaires sous l'effet des UV.
* **Résistance à l'Eau** : Aide à maintenir l'efficacité du produit lors de la baignade ou de la sudation.
* **Texture** : Apporte une certaine émollience à la crème solaire.

---

## ⚖️ Transparence Scientifique & Limites
* **Controverse Environnementale** : Des études récentes suggèrent une accumulation potentielle dans les coraux, ce qui conduit certains labels à limiter son usage.
* **Dégradation dans le temps** : Avec le vieillissement du produit (au-delà de la date de péremption), il peut se dégrader en benzophénone, une substance sous surveillance.

---

## 🛡️ Précautions & Sécurité
* **Allergies de contact** : Des cas d'allergies cutanées ont été rapportés, particulièrement chez les enfants ou les personnes ayant déjà fait une réaction au Kétoprofène (anti-inflammatoire).
`,
  },

  {
    name: 'Homosalate',
    slug: INGREDIENT_SLUGS.HOMOSALATE,
    category: 'Protection UVB',
    description:
      'Un filtre organique liquide spécialisé dans l’absorption des rayons UVB, souvent utilisé pour ajuster la fluidité des protections solaires.',
    content: `
# Homosalate : La Base de la Protection UVB

L'**Homosalate** est un ingrédient classique des formulations solaires. Sa nature liquide lui permet de dissoudre facilement d'autres filtres solides tout en assurant une protection de base contre les coups de soleil.

---

## ✨ Points Forts & Bénéfices
* **Fluidité** : Aide à obtenir des textures légères et faciles à étaler, évitant l'effet "masque blanc".
* **Protection UVB** : Absorbe les rayons responsables des brûlures directes de l'épiderme.

---

## ⚖️ Transparence Scientifique & Limites
* **Puissance Modeste** : Utilisé seul, il ne fournit pas une protection suffisante ; il doit toujours être intégré dans un système de filtres complexes.
* **Débat Endocrinien** : Des études *in vitro* ont soulevé des questions sur un potentiel effet perturbateur endocrinien. Bien que les concentrations en cosmétique soient strictement réglementées (plafonné à 10% ou 7,34% selon les régions), il reste sous l'œil vigilant des autorités sanitaires.

---

## 🛡️ Précautions & Sécurité
* **Usage** : À privilégier dans les produits rincés ou les protections solaires occasionnelles.
`,
  },

  {
    name: 'Ethylhexyl Salicylate (Octisalate)',
    slug: INGREDIENT_SLUGS.ETHYLHEXYL_SALICYLATE,
    category: 'Protection UVB & Boosteur de SPF',
    description:
      'Un filtre UVB complémentaire qui agit également comme un solvant pour stabiliser et homogénéiser les mélanges de filtres solaires.',
    content: `
# Ethylhexyl Salicylate : L'Allié du SPF

L'**Ethylhexyl Salicylate** (ou Octisalate) est un ester d'acide salicylique. S'il n'est pas le filtre le plus puissant du marché, il est indispensable pour optimiser l'efficacité globale d'un soin solaire grâce à ses propriétés solvantes uniques.

---

## ✨ Points Forts & Bénéfices
* **Solubilisant d'Actifs** : Permet de dissoudre les filtres en poudre (comme l'Avobenzone) pour une protection sans grumeaux ni zones blanches.
* **Renfort UVB** : Complète la protection contre les coups de soleil.
* **Résistance** : Très stable, il ne se dégrade pas facilement à la chaleur.

---

## ⚖️ Transparence Scientifique & Limites
* **Efficacité Limitée** : Son pouvoir d'absorption est relativement faible comparativement aux filtres de nouvelle génération. Son rôle est principalement celui d'un adjuvant.
* **Absorption Cutanée** : Comme beaucoup de salicylates, une infime partie peut être absorbée par la peau, ce qui en fait un ingrédient très encadré par les normes de sécurité.

---

## 🛡️ Précautions & Sécurité
* **Sécurité** : Utilisé depuis des décennies avec un excellent profil de sécurité globale. Non photosensibilisant.
`,
  },
  {
    name: 'Ethylhexyl Triazone',
    slug: INGREDIENT_SLUGS.ETHYLHEXYL_TRIAZONE,
    category: 'filtre uv',
    description:
      'L’un des filtres UVB les plus puissants et les plus stables au monde, permettant d’atteindre des indices SPF élevés avec une excellente tolérance cutanée.',
    content: `
  # Ethylhexyl Triazone (Uvinul T 150)
  L'Ethylhexyl Triazone est un filtre "haute capacité" utilisé pour construire la protection UVB des produits solaires. Il est insoluble dans l'eau, ce qui lui confère une excellente rémanence sur la peau.
  ## INCI
  **ETHYLHEXYL TRIAZONE**
  ## Points forts
  - **Efficacité record** : Une petite concentration suffit pour augmenter significativement le SPF d'une formule.
  - **Stabilité** : Très résistant à la lumière et à la chaleur.
  - **Affinité avec la peau** : Se fixe bien à la kératine, ce qui améliore la résistance à la sueur et à l'eau.
  ## Rôle dans la gamme Sensifine AR
  Il assure la protection contre les coups de soleil (UVB). Pour une peau souffrant de rougeurs, une brûlure solaire est une catastrophe car elle provoque une inflammation violente et durable. Ce filtre garantit l'indice SPF50+.
  ## Sécurité environnementale
  C'est l'un des filtres préférés des marques "éco-responsables" car il présente un profil de biodégradabilité plus favorable et n'est pas associé au blanchiment des coraux.
  ## Utilisation
  - **Cible** : Protection contre les brûlures solaires, peaux claires, peaux sujettes aux inflammations liées aux UV.
  - **Type de soin** : Crèmes solaires SPF30/50/50+, soins de jour protecteurs.
`,
  },
  {
    name: 'Diethylamino Hydroxybenzoyl Hexyl Benzoate',
    slug: INGREDIENT_SLUGS.DIETHYLAMINO_HYDROXYBENZOYL_HEXYL_BENZOATE,
    category: 'filtre uv',
    description:
      'Filtre solaire organique de nouvelle génération, extrêmement stable, offrant une protection haute performance contre les rayons UVA responsables du photovieillissement.',
    content: `
  # Diethylamino Hydroxybenzoyl Hexyl Benzoate (Uvinul A Plus)
  Ce filtre solaire moderne est une référence en formulation européenne et asiatique pour sa sécurité et son efficacité. Il est particulièrement apprécié pour sa capacité à filtrer les UVA longs, ceux qui pénètrent le plus profondément dans le derme.
  ## INCI
  **DIETHYLAMINO HYDROXYBENZOYL HEXYL BENZOATE**
  ## Propriétés techniques
  - **Photostabilité exceptionnelle** : Ne se dégrade pas sous l'action du soleil, garantissant une protection constante durant l'exposition.
  - **Absorption UVA** : Couvre efficacement la plage des 320 à 400 nm.
  - **Texture** : Permet de formuler des produits moins gras et sans effet blanc, contrairement aux filtres minéraux.
  ## Pourquoi dans un soin anti-rougeurs ?
  Le soleil est le premier facteur déclenchant des crises de rosacée. Les UVA endommagent les parois des vaisseaux sanguins et dégradent le collagène qui les soutient. En bloquant ces rayons, ce filtre empêche l'aggravation des rougeurs structurelles.
  ## Sécurité
  - **Haute Tolérance** : Très faible potentiel allergisant, idéal pour les peaux intolérantes.
  - **Non-perturbateur** : Contrairement à certains anciens filtres (comme l'oxybenzone), il n'est pas suspecté d'être un perturbateur endocrinien.
  ## Utilisation
  - **Cible** : Protection solaire quotidienne, prévention des taches et des rides, peaux sensibles au soleil.
  - **Type de soin** : Crèmes de jour SPF, protections solaires haute performance.
`,
  },
  {
    name: 'Dioxyde de titane (Titanium Dioxide)',
    slug: INGREDIENT_SLUGS.TITANIUM_DIOXIDE,
    category: 'actif',
    description:
      'Filtre minéral physique offrant une protection solaire large spectre UVB et UVA courts, opacifiant et apaisant, particulièrement adapté aux peaux sensibles et aux formulations minérales.',
    content: `
  # Dioxyde de titane (Titanium Dioxide)
  Le dioxyde de titane est l'un des filtres UV minéraux les plus utilisés au monde. Pigment blanc inerte et insoluble, il agit en surface de la peau pour réfléchir et diffuser les rayons UV sans pénétration cutanée. Très bien toléré, il est la base de la majorité des crèmes solaires minérales et des maquillages couvrants.
  ## INCI
  **TITANIUM DIOXIDE**
  (CI 77891 pour la forme pigmentaire ; noté [NANO] si particules nanométriques)
  ## Composition chimique
  - **Composé minéral** : TiO₂, existant sous deux formes cristallines principales utilisées en cosmétique : rutile (plus stable, meilleure résistance UV) et anatase.
  - **Formes disponibles** : Non-nano (effet couvrant, voile blanc marqué) vs micronisé/nano (textures légères, voile blanc réduit).
  - **Insoluble** : Film stable en surface, non absorbé systémiquement (consensus scientifique actuel).
  ## Mécanisme d'action
  1. **Protection UV physique** : Réfléchit et diffuse les UVB et UVA courts (UVA II) — couverture UVA moins complète que l'oxyde de zinc sur les UVA longs (UVA I).
  2. **Opacifiant** : Forte capacité couvrante (indice de réfraction élevé), utilisé comme pigment blanc dans les fonds de teint et correcteurs.
  3. **Barrière inerte** : Protège mécaniquement la peau des agressions extérieures sans réaction chimique.
  4. **Apaisant** : Tolérance cutanée excellente, non irritant, non allergisant, adapté aux peaux réactives et aux bébés.
  ## Bienfaits
  - **Protection solaire UVB puissante** : Référence pour la protection UVB, souvent associé à ZnO pour compléter la couverture UVA.
  - **Couvrant et matifiant** : Idéal pour les formulations teintées, fond de teint minéral, poudres couvrants.
  - **Tolérance maximale** : Non comédogène, non irritant, approuvé pour peaux sensibles, bébés, femmes enceintes.
  - **Stabilité en formulation** : Très stable chimiquement, compatible avec la plupart des actifs.
  ## Utilisation
  - **Cible** : Tous types de peau, en particulier peaux sensibles, réactives, bébés, femmes enceintes, personnes intolérantes aux filtres chimiques.
  - **Moment** : Matin (protection solaire, base de maquillage).
  - **Type de soin** : Crèmes solaires minérales, fonds de teint minéraux, poudres couvrantes, baumes réparateurs opaques (cicatrices, érythème fessier).
  ## Note technique
  Le TiO₂ est souvent combiné avec l'oxyde de zinc pour une protection broad-spectrum optimale : TiO₂ excelle sur les UVB et UVA courts, ZnO couvre les UVA longs. Seul, il ne suffit pas pour une protection UVA complète (critère PA++++ ou ratio UVA/UVB ≥ 1/3). La controverse CIRC (classé 2B cancérogène possible par inhalation) concerne uniquement la forme en poudre inhalée, pas l'application cutanée topique. Version nano : sûreté cutanée confirmée par le SCCS européen (2021).
`,
  },
  {
    name: 'Oxyde de zinc (Zinc Oxide)',
    slug: INGREDIENT_SLUGS.ZINC_OXIDE,
    category: 'actif',
    description:
      'Filtre minéral physique offrant une protection solaire large spectre UVA/UVB, apaisant et protecteur pour les peaux sensibles, irritées ou à imperfections.',
    content: `
    # Oxyde de zinc (Zinc Oxide)
    L'oxyde de zinc est un ingrédient minéral inerte et multifonctionnel star en dermatologie et cosmétique. Largement utilisé comme filtre UV physique, il forme une barrière protectrice à la surface de la peau tout en apaisant les irritations et en offrant des propriétés antibactériennes et anti-inflammatoires.

    ## INCI
    **ZINC OXIDE**

    (Souvent noté [NANO] si particules nanométriques ; CI 77947 pour la forme pigmentaire)

    ## Composition chimique
    - **Composé minéral** : ZnO (oxyde de zinc pur), issu naturellement de la zincite ou synthétisé pour haute pureté.
    - **Formes disponibles** : Micronisées ou nanométriques (pour textures légères et sans voile blanc) vs non-nano (plus couvrant, effet barrière prononcé).
    - **Insoluble dans l'eau et les huiles** : Crée un film protecteur stable sur la peau, non absorbé.

    ## Mécanisme d’action
    1. **Protection UV physique** : Réfléchit, diffuse et absorbe les rayons UVA (large spectre, excellent contre UVA I et II) et UVB → protection broad-spectrum sans pénétration cutanée.
    2. **Barrière protectrice** : Forme un bouclier inert sur l'épiderme, renforce la fonction barrière et protège contre les agressions externes (vent, froid, irritants).
    3. **Apaisant et anti-inflammatoire** : Réduit les rougeurs, calme les irritations (eczéma, rosacée, post-actes) via inhibition des médiateurs pro-inflammatoires.
    4. **Antibactérien et anti-acné** : Limite la prolifération bactérienne (y compris Cutibacterium acnes), aide à prévenir et traiter les imperfections sans assécher excessivement.

    ## Bienfaits
    - **Protection solaire optimale** : Large spectre UVA/UVB, recommandé pour peaux sensibles, enfants, phototypes élevés ou troubles pigmentaires.
    - **Apaisant immédiat** : Soulage irritations, rougeurs, érythème fessier, coups de soleil légers ou post-traitements dermatologiques.
    - **Anti-imperfections** : Matifiant doux, antibactérien, idéal pour peaux grasses/acnéiques en complément d'autres actifs.
    - **Renforcement barrière cutanée** : Améliore l'hydratation et la résilience, non comédogène et très bien toléré.
    - **Innocuité maximale** : Inerte, non irritant, non allergisant ; autorisé jusqu'à 25 % en protection solaire (FDA/EU), score EWG bas.

    ## Utilisation
    - **Cible** : Peaux sensibles/réactives, peaux à imperfections, bébés/enfants, tous phototypes, peaux sujettes aux irritations ou nécessitant une protection minérale.
    - **Moment** : Matin (protection solaire), ou selon besoin (soins apaisants jour/soir).
    - **Type de soin** : Crèmes solaires minérales (La Roche-Posay Anthelios Mineral, Avène Solaire Minéral, Bioderma Photoderm Mineral), crèmes pour érythème fessier, baumes réparateurs, maquillages minéraux teintés (fond de teint, poudres).

    ## Note technique
    L'oxyde de zinc est aujourd'hui la référence des filtres minéraux "clean" et non controversés, souvent préféré au dioxyde de titane pour sa meilleure couverture UVA. En version micronisée/nano (non absorbée), il offre des textures élégantes sans voile blanc, même sur peaux mates. Synergique avec TiO₂ pour une protection SPF élevée et large spectre. Recommandé par les dermatologues pour les peaux intolérantes aux filtres chimiques, les routines anti-UV quotidiennes et les soins post-actes (laser, peelings).
  `,
  },
  {
    name: 'Oxydes de fer (Iron oxides)',
    slug: INGREDIENT_SLUGS.IRON_OXIDE,
    category: 'actif',
    description:
      'Pigments minéraux naturels assurant la coloration des soins et offrant une protection complémentaire contre la lumière bleue.',
    content: `
    # Oxydes de fer (Iron oxides)
    Les oxydes de fer sont des pigments minéraux d'origine naturelle largement utilisés en dermatologie pour leur parfaite innocuité. Au-delà de leur fonction colorante permettant d'unifier le teint, ils jouent un rôle biologique crucial dans la protection solaire moderne en agissant comme un bouclier physique contre les rayonnements visibles.
    ## INCI
    **IRON OXIDES (CI 77491, CI 77492, CI 77499)**
    (Oxydes de fer rouge, jaune et noir)
    ## Composition chimique
    - **Composés minéraux** : Mélanges de fer et d'oxygène.
    - **Haute pureté** : Pigments purifiés pour éliminer toute trace de métaux lourds, garantissant une tolérance optimale.
    ## Mécanisme d’action
    1. **Opacité et réflexion** : Créent une barrière physique qui réfléchit et diffuse les rayons lumineux à la surface de la peau.
    2. **Absorption de la lumière bleue** : Contrairement aux filtres solaires classiques, ils absorbent spécifiquement le spectre de la lumière visible de haute énergie (HEV).
    3. **Correction colorimétrique** : Le mélange précis des teintes jaune, rouge et noire permet de mimer toutes les carnations humaines.
    4. **Stabilité chromatique** : Ne s'oxydent pas et ne virent pas de couleur au contact du sébum ou de l'air.
    ## Bienfaits
    - **Protection contre l'hyperpigmentation** : Indispensables pour prévenir le mélasma (masque de grossesse) et les taches pigmentaires induites par la lumière visible.
    - **Unification du teint** : Camouflent instantanément les rougeurs, les cicatrices d'acné et les irrégularités pigmentaires.
    - **Effet bonne mine** : Apportent une coloration naturelle et sur-mesure aux crèmes teintées et fonds de teint dermatologiques.
    - **Innocuité totale** : Ingrédients inertes, non comédogènes et parfaitement tolérés par les peaux les plus sensibles ou réactives.
    ## Utilisation
    - **Cible** : Peaux sujettes aux taches, peaux sensibles nécessitant un maquillage correcteur, tous phototypes.
    - **Moment** : Application le matin, idéalement dans un soin de jour ou une protection solaire.
    - **Type de soin** : Central dans les gammes **Avène Solaire Teinté**, **Couvrance** et les soins SPF anti-taches.
    ## Note technique
    L'intégration des oxydes de fer est aujourd'hui une recommandation dermatologique forte pour les patients souffrant de troubles pigmentaires. En synergie avec des filtres comme le TriAsorB™, ils offrent la protection la plus complète du marché (UV + Lumière Bleue), tout en permettant des textures sensorielles et esthétiques.
  `,
  },
  {
    name: 'TriAsorB™ (Phénylène Bis-Diphényltriazine)',
    slug: INGREDIENT_SLUGS.TRIASORB,
    category: 'actif',
    description:
      'Filtre solaire ultra-large spectre protégeant contre les rayons UVB, UVA et la lumière bleue haute énergie.',
    content: `
    # TriAsorB™ (Phénylène Bis-Diphényltriazine)
    Le TriAsorB™ est le premier filtre solaire organique au monde capable de bloquer non seulement les rayons UV (UVB, UVA courts et longs), mais aussi la lumière bleue haute énergie (HEV). Issu de la Recherche Pierre Fabre, ce filtre breveté représente une avancée majeure dans la protection solaire dermatologique et la prévention du photovieillissement.
    ## INCI
    **PHENYLENE BIS-DIPHENYLTRIAZINE**
    (Filtre organique de nouvelle génération)
    ## Composition chimique
    - **Structure triazine** : Molécule de grande taille offrant une photostabilité exceptionnelle.
    - **Filtre hybride** : Combine les propriétés d'absorption des filtres organiques et de réflexion des poudres minérales.
    ## Mécanisme d’action
    1. **Absorption des photons** : Absorbe les photons de haute énergie pour empêcher leur interaction avec l'ADN cutané.
    2. **Réflexion et diffusion** : Agit comme un miroir microscopique pour dévier une partie du rayonnement incident.
    3. **Couverture spectrale** : Étend la protection au-delà des UV traditionnels jusqu'à **450 nm** (spectre visible).
    4. **Maintien de l'efficacité** : Reste stable sous l'exposition solaire prolongée sans se dégrader.
    ## Bienfaits
    - **Protection ultra-large** : Offre une barrière inédite contre la **lumière bleue** solaire, responsable de l'hyperpigmentation.
    - **Prévention du vieillissement** : Réduit de **95%** les dommages cellulaires induits par le rayonnement solaire.
    - **Fini invisible** : Garantit une absence totale de traces blanches, même sur les phototypes foncés.
    - **Éco-conception** : Filtre testé sans impact sur la biodiversité marine (coraux, phytoplancton).
    ## Utilisation
    - **Cible** : Toutes peaux, particulièrement les peaux sensibles au soleil et sujettes aux taches.
    - **Moment** : Avant chaque exposition solaire ; à renouveler toutes les 2 heures.
    - **Type de soin** : Coeur de la gamme **Avène Solaire** (Crèmes SPF50+, Intense Protect).
    ## Note technique
    Inspiré du pouvoir protecteur de la mélanine naturelle, le TriAsorB™ a nécessité 20 ans de recherche. Sa structure moléculaire unique lui permet d'être intégré à des formules à haute tolérance, minimisant la pénétration cutanée tout en assurant une sécurité oculaire optimale (ne pique pas les yeux).
  `,
  },
  {
    name: 'Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine',
    slug: INGREDIENT_SLUGS.BIS_ETHYLHEXYLOXYPHENOL_METHOXYPHENYL_TRIAZINE,
    category: 'actif',
    description:
      "Filtre UV chimique organique large spectre breveté (Tinosorb® S / Bemotrizinol), photostable et efficace contre UVA/UVB, protège durablement contre le photo-vieillissement et les dommages solaires tout en stabilisant d'autres filtres comme l'avobenzone.",
    content: `
    # Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine

    Filtre UV chimique de nouvelle génération (Bemotrizinol, Tinosorb® S), développé par BASF, c'est l'un des filtres les plus performants et photostables disponibles en cosmétique. Liposoluble, il offre une protection large spectre UVA/UVB (pics à ~310 nm et ~345 nm) sans pénétration cutanée significative. Très utilisé dans les solaires haut de gamme et dermo-cosmétiques (y compris chez Pierre Fabre/Avène pour des protections solaires tolérance élevée), il excelle par sa stabilité exceptionnelle et sa capacité à booster l'efficacité globale des formules.

    ## INCI

    **Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine**

    (Bemotrizinol / Tinosorb® S)

    ## Composition chimique

    - 2,4-Bis[(4-(2-éthylhexyloxy)-2-hydroxyphenyl]-6-(4-méthoxyphenyl)-1,3,5-triazine
    - Formule moléculaire : C₃₈H₄₉N₃O₅
    - Poids moléculaire élevé (~628 g/mol), pureté cosmétique, absence d'allergènes majeurs, très faible absorption systémique

    ## Mécanisme d’action

    1. Absorbe fortement les rayonnements **UVA** (320-400 nm) et **UVB** (280-320 nm) en convertissant l'énergie en chaleur inoffensive.
    2. **Photostabilité exceptionnelle** : ne se dégrade pas sous irradiation UV prolongée (stable jusqu'à doses élevées).
    3. Stabilise d'autres filtres photosensibles comme l'**avobenzone** (BM-DBM) et l'octinoxate via transfert d'énergie et quenching.
    4. Offre une couverture large spectre : protège efficacement contre UVA-I, UVA-II et UVB, réduisant photo-vieillissement et risque de dommages cutanés.
    5. Faible pénétration cutanée grâce à son haut poids moléculaire, minimisant tout risque systémique.

    ## Bienfaits

    - **Protection large spectre** : Efficace contre UVA et UVB, prévient coups de soleil, photo-vieillissement et dommages oxydatifs.
    - **Photostabilité maximale** : Maintient l'efficacité tout au long de l'exposition solaire (jusqu'à 30 MED prouvé).
    - **Stabilisateur de formules** : Améliore la stabilité et l'SPF/UVA-PF des écrans contenant avobenzone ou cinnamates.
    - **Tolérance cutanée élevée** : Non irritant, non sensibilisant, adapté aux **peaux sensibles**, **atopiques** et **enfants**.
    - **Texture agréable** : Liposoluble, permet des textures légères sans effet gras ou blanchissant.
    - **Protection durable** : Réduit efficacement les radicaux libres et la dégradation du collagène induite par UV.

    ## Utilisation

    - **Cible** : Tous types de peaux, y compris sensibles, réactives, atopiques, enfants dès 6 mois, phototypes élevés ou exposés.
    - **Moment** : Quotidien avant exposition solaire, réapplication toutes les 2 heures ou après baignade.
    - **Type de soin** : Crèmes, fluides, sprays solaires large spectre, soins anti-âge protecteurs, produits dermo-cosmétiques SPF (ex: gammes Avène Haute Protection, Pierre Fabre solaires, formules tolérance élevée).

    ## Note technique

    Filtre UV référence (Tinosorb® S), hautement photostable et photoprotecteur (études depuis 2001 démontrant stabilisation avobenzone et maintien SPF/UVA après irradiation). Breveté, autorisé mondialement (Europe, Asie, Australie ; en attente GRASE US), très faible risque d'allergie ou perturbation endocrinienne. Actif signature des solaires modernes haute performance, souvent associé à Tinosorb M, avobenzone ou filtres minéraux pour une protection optimale et textures innovantes.
  `,
  },
]
