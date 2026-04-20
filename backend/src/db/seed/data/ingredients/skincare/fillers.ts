import { FILLERS as FILLER_SLUGS } from '../ingredient-slugs'
import { SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'
import type { IngredientInput } from '../seed-ingredients'

export const FILLERS: IngredientInput[] = [
  // ─── Solvants aqueux ────────────────────────────────────────────────────────
  {
    name: 'Aqua (Water)',
    slug: FILLER_SLUGS.AQUA,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Solvant universel et phase aqueuse de base de la quasi-totalité des formules cosmétiques.',
    content: `# Aqua (Water)

## INCI
**AQUA**

## Rôle
Solvant universel. Constitue la phase aqueuse des émulsions et dissout les actifs hydrophiles.

## Ce que c'est
Eau purifiée (déminéralisée ou osmosée) utilisée comme base de formulation. Inerte, sans action pharmacologique propre.

## Tolérance
Inerte. Aucune contre-indication connue.`,
  },
  {
    name: 'Propanediol',
    slug: FILLER_SLUGS.PROPANEDIOL,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      "Solvant et véhicule d'origine végétale (maïs), alternatif naturel au propylène glycol.",
    content: `# Propanediol

## INCI
**PROPANEDIOL**

## Rôle
Solvant, humectant léger et co-solvant pour actifs. Améliore la pénétration et la texture.

## Ce que c'est
Diol biosourcé issu du glucose de maïs. Très bien toléré, même sur peaux sensibles.

## Tolérance
Excellente. Non irritant, non comédogène.`,
  },

  // ─── Ajusteurs de pH & chélateurs ───────────────────────────────────────────
  {
    name: 'Citric Acid',
    slug: FILLER_SLUGS.CITRIC_ACID,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Acide organique naturel utilisé en traces pour ajuster le pH des formules.',
    content: `# Citric Acid

## INCI
**CITRIC ACID**

## Rôle
Ajusteur de pH. Présent en quantités infimes (0,01–0,1 %) pour stabiliser le pH de la formule.

## Ce que c'est
Acide tricarboxylique issu de la fermentation de sucres. À ces concentrations, il n'a pas d'effet exfoliant.

## Tolérance
Inerte aux concentrations d'usage. Ne pas confondre avec un usage exfoliant (nécessite >5 %).`,
  },
  {
    name: 'Sodium Hydroxide',
    slug: FILLER_SLUGS.SODIUM_HYDROXIDE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Base forte utilisée pour neutraliser les acides et ajuster le pH dans les formules.',
    content: `# Sodium Hydroxide

## INCI
**SODIUM HYDROXIDE**

## Rôle
Ajusteur de pH (neutralisant). Réagit avec les acides de la formule pour former des sels neutres.

## Ce que c'est
Soude caustique à l'état pur — mais entièrement neutralisée et inerte dans le produit fini. Sa présence en INCI ne signifie pas que le produit est basique ou corrosif.

## Tolérance
Sans risque dans un produit fini correctement formulé.`,
  },
  {
    name: 'Potassium Hydroxide',
    slug: FILLER_SLUGS.POTASSIUM_HYDROXIDE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Base forte utilisée pour ajuster le pH, notamment dans les crèmes et savons.',
    content: `# Potassium Hydroxide

## INCI
**POTASSIUM HYDROXIDE**

## Rôle
Ajusteur de pH, neutralisant. Souvent utilisé pour saponifier des huiles ou neutraliser des acides gras dans les émulsions.

## Ce que c'est
Analogue potassique de la soude. Entièrement neutralisé dans le produit fini.

## Tolérance
Inerte dans le produit formulé.`,
  },
  {
    name: 'Triethanolamine',
    slug: FILLER_SLUGS.TRIETHANOLAMINE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Base organique classique pour ajuster le pH des formules gélifiées au carbomer.',
    content: `# Triethanolamine (TEA)

## INCI
**TRIETHANOLAMINE**

## Rôle
Ajusteur de pH. Indispensable pour activer les gélifiants comme le carbomer (neutralisation du gel).

## Ce que c'est
Aminoalcool tertiaire. Très répandu mais de moins en moins utilisé au profit de bases alternatives (arginine, NaOH).

## Tolérance
Bonne à l'usage normal. Des questions sur son potentiel allergisant existent à haute concentration.`,
  },
  {
    name: 'Tromethamine',
    slug: FILLER_SLUGS.TROMETHAMINE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Base organique douce utilisée pour neutraliser les gélifiants et ajuster le pH.',
    content: `# Tromethamine (TRIS)

## INCI
**TROMETHAMINE**

## Rôle
Ajusteur de pH, alternative à la triéthanolamine pour neutraliser le carbomer.

## Ce que c'est
2-Amino-2-(hydroxyméthyl)-1,3-propanediol. Considérée plus tolérée et plus stable que la TEA.

## Tolérance
Excellente. Non irritant, non sensibilisant aux concentrations d'usage.`,
  },
  {
    name: 'Sodium Citrate',
    slug: FILLER_SLUGS.SODIUM_CITRATE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      "Sel de sodium de l'acide citrique utilisé comme tampon pour stabiliser le pH.",
    content: `# Sodium Citrate

## INCI
**SODIUM CITRATE**

## Rôle
Tampon pH. Maintient le pH stable face aux variations externes.

## Ce que c'est
Sel sodique de l'acide citrique. Inerte, très bien toléré.

## Tolérance
Inerte. Aucune contre-indication.`,
  },
  {
    name: 'Disodium EDTA',
    slug: FILLER_SLUGS.DISODIUM_EDTA,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Chélateur séquestrant les ions métalliques pour stabiliser les formules.',
    content: `# Disodium EDTA

## INCI
**DISODIUM EDTA**

## Rôle
Chélateur. Capture les ions métalliques (Ca²⁺, Mg²⁺, Fe²⁺) qui déstabiliseraient la formule ou favoriseraient l'oxydation.

## Ce que c'est
Sel disodique de l'acide éthylènediaminetétraacétique. Présent en traces (0,01–0,1 %).

## Tolérance
Inerte aux concentrations d'usage. Aucune action pharmacologique sur la peau.`,
  },
  {
    name: 'Tetrasodium EDTA',
    slug: FILLER_SLUGS.TETRASODIUM_EDTA,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: "Version tétrabasique de l'EDTA, chélateur de métaux dans les formules aqueuses.",
    content: `# Tetrasodium EDTA

## INCI
**TETRASODIUM EDTA**

## Rôle
Chélateur. Même fonction que le Disodium EDTA, légèrement plus soluble.

## Ce que c'est
Sel tétrasodique de l'EDTA. Utilisé dans les formules à pH neutre/basique.

## Tolérance
Inerte aux concentrations d'usage.`,
  },

  // ─── Épaississants / gélifiants ─────────────────────────────────────────────
  {
    name: 'Carbomer',
    slug: FILLER_SLUGS.CARBOMER,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Polymère acrylique inerte qui forme des gels transparents une fois neutralisé.',
    content: `# Carbomer

## INCI
**CARBOMER**

## Rôle
Gélifiant. Crée la texture gel des sérums et crèmes légères après neutralisation par une base (NaOH, TEA…).

## Ce que c'est
Polymère d'acide acrylique réticulé. Inerte, sans action biologique propre.

## Tolérance
Excellente. L'un des gélifiants les mieux tolérés, y compris sur peaux sensibles et atopiques.`,
  },
  {
    name: 'Xanthan Gum',
    slug: FILLER_SLUGS.XANTHAN_GUM,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Polysaccharide naturel issu de la fermentation, utilisé pour épaissir et texturer.',
    content: `# Xanthan Gum

## INCI
**XANTHAN GUM**

## Rôle
Gélifiant et épaississant naturel. Stabilise les émulsions et améliore la texture.

## Ce que c'est
Hétéropolysaccharide produit par fermentation de Xanthomonas campestris. Certifiable COSMOS.

## Tolérance
Excellente. Non irritant, non sensibilisant. Convient aux peaux sensibles.`,
  },
  {
    name: 'Acrylates/C10-30 Alkyl Acrylate Crosspolymer',
    slug: FILLER_SLUGS.ACRYLATES_CROSSPOLYMER,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Gélifiant polymère permettant des textures légères, non grasses, très tolérées.',
    content: `# Acrylates/C10-30 Alkyl Acrylate Crosspolymer

## INCI
**ACRYLATES/C10-30 ALKYL ACRYLATE CROSSPOLYMER**

## Rôle
Gélifiant émulsifiant. Permet de formuler des gels-crèmes légers et stables sans corps gras supplémentaire.

## Ce que c'est
Copolymère acrylique modifié à chaînes alkyles. Stable sur une large plage de pH après neutralisation.

## Tolérance
Très bonne. Couramment utilisé dans les soins pour peaux sensibles et acnéiques.`,
  },
  {
    name: 'Hydroxyethylcellulose',
    slug: FILLER_SLUGS.HYDROXYETHYLCELLULOSE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: "Épaississant cellulosique d'origine naturelle, inerte et très bien toléré.",
    content: `# Hydroxyethylcellulose

## INCI
**HYDROXYETHYLCELLULOSE**

## Rôle
Épaississant pour phases aqueuses. Donne de la viscosité aux lotions et gels sans modifier le pH.

## Ce que c'est
Éther de cellulose hydrosoluble. Origine semi-synthétique (cellulose végétale modifiée).

## Tolérance
Inerte. Aucun potentiel irritant ou sensibilisant connu.`,
  },
  {
    name: 'Hydroxypropyl Methylcellulose',
    slug: FILLER_SLUGS.HYDROXYPROPYL_METHYLCELLULOSE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Épaississant cellulosique utilisé pour texturer les formules aqueuses.',
    content: `# Hydroxypropyl Methylcellulose (HPMC)

## INCI
**HYDROXYPROPYL METHYLCELLULOSE**

## Rôle
Épaississant, filmogène léger. Améliore le glissant à l'application.

## Ce que c'est
Éther de cellulose méthylé et hydroxypropylé. Très utilisé dans les formules pour peaux sensibles.

## Tolérance
Inerte. Hypoallergénique.`,
  },
  {
    name: 'Sodium Polyacrylate',
    slug: FILLER_SLUGS.SODIUM_POLYACRYLATE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Super-absorbant polymérique utilisé pour les textures gel aériennes et légères.',
    content: `# Sodium Polyacrylate

## INCI
**SODIUM POLYACRYLATE**

## Rôle
Épaississant et super-absorbant. Crée des textures eau-gel ultra-légères.

## Ce que c'est
Sel de sodium d'un polymère acrylique. Inerte, sans action biologique.

## Tolérance
Très bonne. Utilisé dans les soins pour peaux sensibles et les gels anti-âge légers.`,
  },
  {
    name: 'Sclerotium Gum',
    slug: FILLER_SLUGS.SCLEROTIUM_GUM,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Polysaccharide issu de la fermentation fongique, alternatif naturel au carbomer.',
    content: `# Sclerotium Gum

## INCI
**SCLEROTIUM GUM**

## Rôle
Gélifiant et épaississant naturel. Forme des textures veloutées et lisses.

## Ce que c'est
Bêta-glucane obtenu par fermentation de Sclerotium rolfsii. Compatible COSMOS, très bien toléré.

## Tolérance
Excellente. Non irritant.`,
  },

  // ─── Alcools gras & émulsifiants structurels ────────────────────────────────
  {
    name: 'Cetyl Alcohol',
    slug: FILLER_SLUGS.CETYL_ALCOHOL,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Alcool gras solide structurant les émulsions, émollient doux et non asséchant.',
    content: `# Cetyl Alcohol

## INCI
**CETYL ALCOHOL**

## Rôle
Émulsifiant co-tensioactif et épaississant. Stabilise les émulsions huile-dans-eau, apporte de la consistance.

## Ce que c'est
Alcool gras saturé en C16, dérivé de la cire de cétacés (aujourd'hui synthétique ou issu de coprah/palme).

## Tolérance
Très bonne. Non irritant, non comédogène. Rare sensibilisation possible chez les peaux très réactives.`,
  },
  {
    name: 'Stearyl Alcohol',
    slug: FILLER_SLUGS.STEARYL_ALCOHOL,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Alcool gras en C18 structurant les crèmes épaisses, émollient léger.',
    content: `# Stearyl Alcohol

## INCI
**STEARYL ALCOHOL**

## Rôle
Co-émulsifiant structurel. Apporte consistance et douceur au toucher des crèmes.

## Ce que c'est
Alcool gras saturé en C18, souvent associé au cetyl alcohol (mélange cetearyl alcohol).

## Tolérance
Très bonne. Même profil de tolérance que le cetyl alcohol.`,
  },
  {
    name: 'Behenyl Alcohol',
    slug: FILLER_SLUGS.BEHENYL_ALCOHOL,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Alcool gras en C22 utilisé dans les crèmes riches et les soins capillaires.',
    content: `# Behenyl Alcohol

## INCI
**BEHENYL ALCOHOL**

## Rôle
Co-émulsifiant, épaississant et émollient. Apporte une texture plus épaisse et un toucher soyeux.

## Ce que c'est
Alcool gras saturé en C22, issu du colza ou de l'huile d'arachide.

## Tolérance
Excellente. Non comédogène, non irritant.`,
  },
  {
    name: 'PEG-100 Stearate',
    slug: FILLER_SLUGS.PEG_100_STEARATE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Émulsifiant non ionique classique pour émulsions H/E stables et douces.',
    content: `# PEG-100 Stearate

## INCI
**PEG-100 STEARATE**

## Rôle
Émulsifiant non ionique. Stabilise les émulsions huile-dans-eau, souvent associé au Glyceryl Stearate.

## Ce que c'est
Ester de polyéthylène glycol (PEG-100) et d'acide stéarique. Ubiquitaire dans les crèmes hydratantes.

## Tolérance
Très bonne. Inerte aux concentrations d'usage.`,
  },
  {
    name: 'Ceteareth-20',
    slug: FILLER_SLUGS.CETEARETH_20,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: "Émulsifiant éthoxylé pour émulsions stables, souvent associé à l'alcool cétéarylique.",
    content: `# Ceteareth-20

## INCI
**CETEARETH-20**

## Rôle
Émulsifiant non ionique. Stabilise les émulsions H/E, améliore la consistance et la stabilité.

## Ce que c'est
Alcool gras éthoxylé (20 unités OE). Souvent utilisé en association avec le cetearyl alcohol.

## Tolérance
Bonne. Inerte cutanément. La présence potentielle de 1,4-dioxane (impureté de fabrication) est une préoccupation réglementaire, mais les formules conformes respectent des limites strictes.`,
  },

  // ─── Silicones véhicules ─────────────────────────────────────────────────────
  {
    name: 'Dimethiconol',
    slug: FILLER_SLUGS.DIMETHICONOL,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Silicone hydroxylé apportant lissage et protection de surface.',
    content: `# Dimethiconol

## INCI
**DIMETHICONOL**

## Rôle
Agent lissant et protecteur de surface. Apporte brillance et effet soyeux.

## Ce que c'est
Polydiméthylsiloxane à terminaisons hydroxyles. Proche du diméthicone, souvent utilisé en capillaire.

## Tolérance
Inerte. Non comédogène aux concentrations habituelles.`,
  },
  {
    name: 'Cyclopentasiloxane (D5)',
    slug: FILLER_SLUGS.CYCLOPENTASILOXANE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: "Silicone cyclique volatil vecteur d'actifs, texture ultra-légère.",
    content: `# Cyclopentasiloxane (D5)

## INCI
**CYCLOPENTASILOXANE**

## Rôle
Véhicule volatil. S'évapore après application, ne laisse aucun résidu. Porte les actifs et améliore l'étalement.

## Ce que c'est
Silicone cyclique D5. Fait l'objet de restrictions réglementaires croissantes (persistance environnementale).

## Tolérance
Excellente sur la peau. Préoccupations environnementales (bioaccumulation) entraînent sa limitation.`,
  },
  {
    name: 'Cyclohexasiloxane (D6)',
    slug: FILLER_SLUGS.CYCLOHEXASILOXANE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Silicone cyclique volatil similaire au D5, vecteur léger.',
    content: `# Cyclohexasiloxane (D6)

## INCI
**CYCLOHEXASILOXANE**

## Rôle
Véhicule volatil, similaire au cyclopentasiloxane (D5). Moins utilisé.

## Ce que c'est
Silicone cyclique D6. Même profil que D5 en termes de propriétés et de préoccupations réglementaires.

## Tolérance
Inerte cutanément.`,
  },
  {
    name: 'Phenyl Trimethicone',
    slug: FILLER_SLUGS.PHENYL_TRIMETHICONE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Silicone non volatil apportant brillance et protection occlusive légère.',
    content: `# Phenyl Trimethicone

## INCI
**PHENYL TRIMETHICONE**

## Rôle
Agent conditionneur et filmogène. Apporte brillance et toucher soyeux non gras.

## Ce que c'est
Silicone phénylé non volatil. Plus réfractif que le diméthicone, prisé dans les soins "éclat".

## Tolérance
Excellente. Inerte, non irritant.`,
  },

  // ─── Huiles minérales & hydrocarbures inertes ────────────────────────────────
  {
    name: 'Mineral Oil (Paraffinum Liquidum)',
    slug: FILLER_SLUGS.MINERAL_OIL,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Huile minérale occlusive inerte, protège la barrière cutanée en limitant la TEWL.',
    content: `# Mineral Oil (Paraffinum Liquidum)

## INCI
**MINERAL OIL / PARAFFINUM LIQUIDUM**

## Rôle
Occlusif. Forme un film imperméable à la surface de la peau qui limite la perte en eau transépidermique (TEWL).

## Ce que c'est
Huile hydrocarbonée issue de la distillation du pétrole, hautement purifiée pour usage cosmétique. Totalement inerte biologiquement.

## Tolérance
Excellente. C'est l'un des ingrédients les mieux tolérés en dermatologie. Non comedogène aux grades cosmétiques.`,
  },
  {
    name: 'Petrolatum',
    slug: FILLER_SLUGS.PETROLATUM,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Occlusif de référence (vaseline), le plus efficace pour limiter la perte en eau.',
    content: `# Petrolatum (Vaseline)

## INCI
**PETROLATUM**

## Rôle
Occlusif de référence. Le plus efficace pour réduire la TEWL, réparation de la barrière cutanée.

## Ce que c'est
Mélange semi-solide d'hydrocarbures (huiles minérales + cires). Gold standard pour les peaux atopiques et sèches sévères.

## Tolérance
Excellente. Inerte, hypoallergénique. Recommandé en dermatologie pédiatrique.`,
  },
  {
    name: 'Isohexadecane',
    slug: FILLER_SLUGS.ISOHEXADECANE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Hydrocarbure isoparaffinique léger, véhicule non gras pour actifs lipophiles.',
    content: `# Isohexadecane

## INCI
**ISOHEXADECANE**

## Rôle
Véhicule léger, solvant pour phases huileuses. Apporte texture fluide et non grasse.

## Ce que c'est
Isoparaffine synthétique en C16. Très léger, non occlusif à faible concentration.

## Tolérance
Excellente. Inerte, non comédogène.`,
  },
  {
    name: 'Isododecane',
    slug: FILLER_SLUGS.ISODODECANE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Solvant volatile léger utilisé dans les produits de maquillage et les fonds de teint.',
    content: `# Isododecane

## INCI
**ISODODECANE**

## Rôle
Véhicule volatile. Améliore l'étalement, réduit le film gras, sèche rapidement.

## Ce que c'est
Isoparaffine synthétique en C12. Très utilisé dans les produits de maquillage longue tenue.

## Tolérance
Inerte. Non irritant aux concentrations habituelles.`,
  },

  // ─── Esters synthétiques véhicules ──────────────────────────────────────────
  {
    name: 'Dicaprylyl Carbonate',
    slug: FILLER_SLUGS.DICAPRYLYL_CARBONATE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Émollient ester léger à toucher sec, alternative aux silicones pour textures fluides.',
    content: `# Dicaprylyl Carbonate

## INCI
**DICAPRYLYL CARBONATE**

## Rôle
Émollient et véhicule. Texture ultra-légère, toucher sec non gras.

## Ce que c'est
Ester de carbonate et d'alcool caprilique/caprylique. Souvent utilisé comme substitut des silicones cycliques.

## Tolérance
Excellente. Non comédogène, bien toléré.`,
  },
  {
    name: 'Coco-Caprylate/Caprate',
    slug: FILLER_SLUGS.COCO_CAPRYLATE_CAPRATE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: "Ester naturel d'huile de coco, émollient léger à toucher sec et soyeux.",
    content: `# Coco-Caprylate/Caprate

## INCI
**COCO-CAPRYLATE/CAPRATE**

## Rôle
Émollient et vecteur. Toucher sec et soyeux, favorise l'étalement.

## Ce que c'est
Ester d'alcool coco et d'acides caprylique/caprique. Issu de la noix de coco.

## Tolérance
Excellente. Non comédogène, certifiable COSMOS.`,
  },

  // ─── Sels ioniques inertes ───────────────────────────────────────────────────
  {
    name: 'Sodium Chloride',
    slug: FILLER_SLUGS.SODIUM_CHLORIDE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Sel de table. Ajuste la viscosité et la tonicité des formules aqueuses.',
    content: `# Sodium Chloride

## INCI
**SODIUM CHLORIDE**

## Rôle
Ajusteur de viscosité et d'osmolarité. Épaissit certains tensioactifs, module la texture.

## Ce que c'est
Chlorure de sodium (sel de cuisine). Inerte, omniprésent.

## Tolérance
Inerte. Aucune contre-indication.`,
  },
  {
    name: 'Potassium Chloride',
    slug: FILLER_SLUGS.POTASSIUM_CHLORIDE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description: 'Sel de potassium utilisé pour ajuster la tonicité des formules.',
    content: `# Potassium Chloride

## INCI
**POTASSIUM CHLORIDE**

## Rôle
Ajusteur d'osmolarité. Utilisé dans les formules isotoniques (collyres, soins yeux, solutions nasales).

## Ce que c'est
Chlorure de potassium. Sel inorganique inerte.

## Tolérance
Inerte. Aucune contre-indication.`,
  },
]
