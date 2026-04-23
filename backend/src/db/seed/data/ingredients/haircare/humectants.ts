import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_HUMECTANTS: IngredientInput[] = [
  {
    name: 'Aqua (Water)',
    slug: INGREDIENT_SLUGS.AQUA_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.EXCIPIENT,
    description:
      'Base universelle de toute formulation cosmétique, solvant principal des actifs hydrophiles.',
    content: `
# Aqua (Water)

L'eau purifiée est l'ingrédient de base de la quasi-totalité des formulations capillaires. Sa qualité (osmose inverse, déionisation) conditionne la stabilité et l'efficacité de la formule.

## INCI
**AQUA** (CAS: 7732-18-5)

## Rôle formulatoire

- **Solvant universel** : dissout les actifs hydrophiles (glycérine, panthénol, extraits)
- **Vecteur de délivrance** : porte les actifs jusqu'à la fibre et le cuir chevelu
- **Régulateur de texture** : ajuste viscosité et phase aqueuse

## Qualité requise

L'eau cosmétique est déionisée ou traitée par osmose inverse pour éliminer minéraux, bactéries et impuretés. Une eau non traitée déstabilise les émulsions et favorise la prolifération microbienne.
`,
  },
  {
    name: 'Glycérine (Glycerin)',
    slug: INGREDIENT_SLUGS.GLYCERIN_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      "Humectant polyol de référence, attire et retient l'eau atmosphérique dans la fibre capillaire et sur le cuir chevelu.",
    content: `
# Glycérine (Glycerin)

La glycérine (glycérol) est un triester d'alcool naturellement présent dans les huiles végétales et animales. C'est l'humectant le plus utilisé en cosmétique capillaire, produit soit par saponification des corps gras végétaux, soit par fermentation.

## INCI
**GLYCERIN** (CAS: 56-81-5 | COSING: 34159)

## Composition chimique

Molécule tri-hydroxylée (C₃H₈O₃) de faible poids moléculaire (92 Da), hydrophile, miscible à l'eau en toutes proportions.

## Mécanisme d'action

### 1. Hygroscopicité
Les trois groupes hydroxyle forment des liaisons hydrogène avec les molécules d'eau. La glycérine capte l'humidité atmosphérique et la retient dans les couches superficielles de la fibre.

### 2. Osmolyte cellulaire
Protège les kératinocytes du cuir chevelu contre le stress osmotique — rôle similaire aux NMF (Natural Moisturizing Factors) endogènes.

### 3. Plastifiant de la fibre
À concentration ≥3%, réduit la fragilité et l'électricité statique en maintenant un film hydrique superficiel autour de la cuticule.

## Concentration d'usage

- Shampoings : 1–5%
- Après-shampooings / masques : 2–8%
- Leave-ins : 2–6%

> ⚠️ À concentration trop élevée (>8%) dans air sec (<40% HR), la glycérine peut extraire l'eau de la fibre vers l'extérieur — effet inverse. Toujours associer à un occlusif.
`,
  },
  {
    name: 'Propylène Glycol (Propylene Glycol)',
    slug: INGREDIENT_SLUGS.PROPYLENE_GLYCOL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      'Diol synthétique humectant et solvant, favorise la pénétration des actifs dans la fibre capillaire.',
    content: `
# Propylène Glycol (Propylene Glycol)

Diol à deux carbones (1,2-propanediol) d'origine pétrochimique ou biosourcée (fermentation du glucose). Très polyvalent en formulation capillaire : humectant, co-solvant et agent de pénétration.

## INCI
**PROPYLENE GLYCOL** (CAS: 57-55-6 | COSING: 56139)

## Mécanisme d'action

### 1. Humectance
Deux groupes hydroxyle assurent une rétention hydrique modérée — moins hygroscopique que la glycérine mais plus pénétrant.

### 2. Co-solvant
Solubilise des actifs peu hydrosolubles (parfums, conservateurs, extraits lipophiles) dans la phase aqueuse.

### 3. Pénétration corticale
Son faible poids moléculaire (76 Da) lui permet de traverser la cuticule et d'atteindre le cortex, entraînant les actifs associés.

### 4. Effet conservateur partiel
À concentrations >10%, renforce l'activité antimicrobienne des systèmes conservateurs.

## Concentration d'usage
1–5% dans la plupart des formulations capillaires.

> ⚠️ Peut être irritant pour les cuirs chevelus sensibles à haute concentration. Souvent remplacé par le butylène glycol dans les formules "doux".
`,
  },
  {
    name: 'Butylène Glycol (Butylene Glycol)',
    slug: INGREDIENT_SLUGS.BUTYLENE_GLYCOL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      'Humectant diol doux C4, pénètre la fibre capillaire avec moins de risque irritant que le propylène glycol.',
    content: `
# Butylène Glycol (Butylene Glycol)

Le 1,3-butanediol est un diol à quatre carbones, d'origine pétrochimique ou biosourcée. Très courant dans les formules capillaires modernes, il est considéré comme mieux toléré que le propylène glycol.

## INCI
**BUTYLENE GLYCOL** (CAS: 107-88-0 | COSING: 30805)

## Mécanisme d'action

### 1. Humectance douce
Deux groupes OH assurent une rétention hydrique similaire au propylène glycol, avec un profil d'innocuité légèrement supérieur.

### 2. Pénétration corticale
Poids moléculaire modéré (90 Da) — traverse la cuticule et améliore la biodisponibilité des actifs lipophiles et hydrophiles co-formulés.

### 3. Propriétés sensorielles
Confère un toucher légèrement soyeux et une texture fluide aux après-shampooings et leave-ins.

### 4. Co-conservateur
Potentialise l'action des conservateurs classiques, permettant de réduire leurs concentrations.

## Concentration d'usage
1–5% dans shampoings, après-shampooings, masques et leave-ins.
`,
  },
  {
    name: 'Pentylène Glycol (Pentylene Glycol)',
    slug: INGREDIENT_SLUGS.PENTYLENE_GLYCOL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      'Humectant diol C5 à double action : hydratation et renforcement du système conservateur, compatible formules naturelles.',
    content: `
# Pentylène Glycol (Pentylene Glycol)

Le 1,2-pentanediol est un diol à cinq carbones, biosourcé (fermentation) ou pétrochimique. De plus en plus utilisé dans les formules capillaires naturelles et clean beauty en raison de sa double fonction humectant/conservateur.

## INCI
**PENTYLENE GLYCOL** (CAS: 5343-92-0 | COSING: 75751)

## Mécanisme d'action

### 1. Humectance
Deux groupes hydroxyle maintiennent l'hydratation de la fibre et du cuir chevelu.

### 2. Activité antimicrobienne intrinsèque
Propriété rare pour un humectant : le pentylène glycol inhibe la croissance bactérienne et fongique à des concentrations ≥2%. Permet de réduire ou remplacer les conservateurs traditionnels.

### 3. Fluidifiant de formule
Améliore l'étalement et la pénétration des actifs, offre un toucher léger non collant.

## Avantage formulatoire
Compatible certification Cosmos/Ecocert. Très utilisé dans les shampooings et leave-ins naturels comme conservateur doux de substitution.

## Concentration d'usage
1–3% pour l'humectance ; jusqu'à 5% pour l'effet conservateur.
`,
  },
  {
    name: 'Sorbitol',
    slug: INGREDIENT_SLUGS.SORBITOL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      'Polyol sucre naturel hautement hygroscopique, doux et non fermentescible, humectant de la fibre et du cuir chevelu.',
    content: `
# Sorbitol

Polyol à six carbones naturellement présent dans les fruits (pomme, prune, cerise). Produit industriellement par hydrogénation catalytique du glucose. Très utilisé en formulation capillaire pour sa douceur et sa stabilité.

## INCI
**SORBITOL** (CAS: 50-70-4 | COSING: 57256)

## Mécanisme d'action

### 1. Hygroscopicité élevée
Six groupes hydroxyle captent et retiennent l'eau avec une efficacité proche de la glycérine. Maintient la souplesse et la flexibilité de la fibre kératinisée.

### 2. Osmolyte protecteur
Protège les protéines kératiniques contre la dénaturation par stress thermique ou osmotique.

### 3. Plasticité de la fibre
Réduit la rigidité et l'électricité statique — bénéfice particulièrement notable sur cheveux secs ou fragilisés chimiquement.

## Avantages formulatoires
- Non fermentescible (contrairement au glucose brut)
- Compatible Cosmos/Ecocert (origine naturelle)
- Bon profil tolérance cuir chevelu sensible

## Concentration d'usage
2–10% selon le type de formule.
`,
  },
  {
    name: 'Sodium PCA',
    slug: INGREDIENT_SLUGS.SODIUM_PCA_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      "Composant clé du facteur naturel d'hydratation (NMF), hygroscopique puissant identique à celui produit naturellement dans le cortex capillaire.",
    content: `
# Sodium PCA (Sodium L-Pyroglutamate)

Le sodium PCA (pyrrolidone carboxylate de sodium) est le sel sodique de l'acide pyroglutamique. Il constitue environ 12% du NMF (Natural Moisturizing Factor) de la peau et se retrouve naturellement dans la fibre capillaire comme osmolyte endogène.

## INCI
**SODIUM PCA** (CAS: 28874-51-3 | COSING: 57248)

## Mécanisme d'action

### 1. Hygroscopicité exceptionnelle
Parmi les humectants les plus hygroscopiques (>1,5× glycérine). Retient l'eau à des taux d'humidité relative très faibles — idéal pour cheveux exposés à la climatisation ou au vent.

### 2. Biomimétisme capillaire
Identique au NMF endogène de la fibre — assimilé sans perturbation du microenvironnement cortical. Ne crée pas d'effet film artificiel.

### 3. Régulation osmotique du cuir chevelu
Protège les kératinocytes et cellules folliculaires contre le stress hydrique, contribuant à un cuir chevelu sain.

## Concentration d'usage
0,5–3% dans shampoings, masques et leave-ins. Souvent associé à la glycérine et au panthénol pour un effet humectant synergique.
`,
  },
  {
    name: 'Panthénol (Pro-Vitamine B5)',
    slug: INGREDIENT_SLUGS.PANTHENOL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      'Pro-vitamine B5 qui pénètre le cortex capillaire, forme des liaisons hydrogène avec la kératine et améliore résistance, hydratation et brillance.',
    content: `
# Panthénol (Pro-Vitamine B5 / D-Panthenol)

Le panthénol (D-panthénol) est le précurseur alcoolique de l'acide pantothénique (vitamine B5). En formulation capillaire, c'est l'un des actifs les mieux documentés scientifiquement : il pénètre la fibre, se convertit en acide pantothénique et y exerce des effets structurels mesurables.

## INCI
**PANTHENOL** (CAS: 81-13-0 | COSING: 75098)

## Mécanisme d'action

### 1. Pénétration corticale
Son faible poids moléculaire (205 Da) et son caractère amphiphile lui permettent de traverser la cuticule et d'atteindre le cortex — là où se trouvent les chaînes de kératine.

### 2. Liaisons hydrogène avec la kératine
Une fois dans le cortex, le panthénol forme des liaisons hydrogène avec les groupes amide (-CO-NH-) de la kératine. Ce mécanisme :
- Augmente la teneur en eau de la fibre
- Améliore l'élasticité et la résistance à la traction
- Réduit les cassures et les pointes fourchues

### 3. Lissage de la cuticule
En leave-in (contact prolongé), le panthénol remplit partiellement les espaces entre les écailles cuticulaires, réduisant la rugosité de surface et améliorant la brillance.

### 4. Apaisement du cuir chevelu
Propriétés anti-inflammatoires légères — réduit les démangeaisons et l'irritation post-shampooing.

## Efficacité prouvée
Des études in vitro (microscopie électronique) montrent une réduction significative des cassures capillaires après 4 semaines d'utilisation d'une formule à 1% de panthénol.

## Concentration d'usage
- Shampoing : 0,5–1%
- Après-shampoing / masque : 1–3%
- Leave-in : 1–2% (contact prolongé = effet maximal)
`,
  },
  {
    name: 'Aloe Vera (Aloe Barbadensis Leaf Juice)',
    slug: INGREDIENT_SLUGS.ALOE_VERA_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      "Jus de feuille d'aloe vera riche en acemannane, vitamines et minéraux — hydratant, apaisant le cuir chevelu et anti-inflammatoire.",
    content: `
# Aloe Vera (Aloe Barbadensis Leaf Juice)

Le jus de feuille d'Aloe barbadensis est obtenu par pression à froid ou extraction aqueuse du gel interne des feuilles. Utilisé depuis l'Antiquité pour ses propriétés cicatrisantes et adoucissantes, c'est aujourd'hui un actif de référence en cosmétique capillaire.

## INCI
**ALOE BARBADENSIS LEAF JUICE** (CAS: 85507-69-3 | COSING: 71561)

## Composition

### Polysaccharides
- **Acemannane (acémannane)** : β-(1,4)-mannane acétylé, principal actif. Forme un film protecteur sur cuticule et cuir chevelu, retient l'eau, stimule la régénération cellulaire.
- **Glucomannanes** : hydratants structuraux

### Vitamines
- A (bêta-carotène), C, E, B1, B2, B3, B6, B12, acide folique — antioxydants, soutien métabolique kératinocytes

### Minéraux & enzymes
- Calcium, magnésium, zinc, sélénium
- Bradykinase : enzyme anti-inflammatoire, réduit inflammation cuir chevelu

### Acides aminés
20 acides aminés dont 7 essentiels — nutrition directe de la fibre et du follicule

## Mécanisme d'action

### 1. Humectance
L'acemannane retient l'eau jusqu'à 200× son poids. Film hygroscopique sur la cuticule.

### 2. Apaisement cuir chevelu
La bradykinase et les stérols végétaux inhibent les médiateurs inflammatoires (prostaglandines). Efficace sur cuirs chevelus irrités, sujets aux pellicules ou à la dermite séborrhéique légère.

### 3. Renforcement de la cuticule
Le film polysaccharidique lisse les écailles et réduit la porosité — amélioration brillance et résistance à la friction.

## Formes d'usage
- Jus frais (stabilisé) : forme la plus active
- Poudre lyophilisée (*Aloe Barbadensis Leaf Juice Powder*) : plus stable, réhydratée en formule
`,
  },
  {
    name: 'Acide Hyaluronique (Hyaluronic Acid)',
    slug: INGREDIENT_SLUGS.HYALURONIC_ACID_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      "Biopolymère capable de retenir jusqu'à 1 000× son poids en eau, hydrate la fibre capillaire en profondeur selon son poids moléculaire.",
    content: `
# Acide Hyaluronique (Hyaluronic Acid)

L'acide hyaluronique (HA) est un glycosaminoglycane naturellement présent dans les tissus conjonctifs, les cartilages et le cuir chevelu. En cosmétique, il est produit par fermentation bactérienne (Streptococcus equi ou Bacillus subtilis) ou par extraction animale (crêtes de coq). Son efficacité dépend directement de son poids moléculaire.

## INCI
**HYALURONIC ACID** (CAS: 9004-61-9 | COSING: 37809)

## Poids moléculaires et pénétration

| PM | Taille | Pénétration fibre | Effet |
|---|---|---|---|
| >1 MDa (haut PM) | >1000 kDa | Surface cuticule | Film humectant protecteur |
| 50–200 kDa (moyen PM) | 50–200 kDa | Intercellulaire cuticule | Hydratation durable |
| <10 kDa (bas PM / oligo-HA) | <10 kDa | Cortex | Hydratation profonde, réparation |

## Mécanisme d'action

### 1. Rétention hydrique
Chaque unité disaccharidique fixe des molécules d'eau via liaisons hydrogène. 1g d'HA retient jusqu'à 6L d'eau — capacité hydratante sans équivalent.

### 2. Film viscoélastique
Le haut-PM forme un réseau gel à la surface de la cuticule, protège contre déshydratation et friction mécanique.

### 3. Pénétration corticale (bas-PM)
Les fragments oligomériques traversent la cuticule et hydratent le cortex de l'intérieur, réduisant la porosité et l'électricité statique.

## Concentration d'usage
0,05–1% selon le PM et l'effet recherché.
`,
  },
  {
    name: 'Sodium Hyaluronate',
    slug: INGREDIENT_SLUGS.SODIUM_HYALURONATE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      "Sel sodique de l'acide hyaluronique, plus stable en formule et mieux pénétrant dans la fibre capillaire que la forme acide.",
    content: `
# Sodium Hyaluronate

Le sodium hyaluronate est la forme saline (sel sodique) de l'acide hyaluronique. C'est la forme cosmétique la plus couramment utilisée car elle est plus stable en pH aqueux et présente une meilleure affinité avec la kératine chargée négativement.

## INCI
**SODIUM HYALURONATE** (CAS: 9067-32-7 | COSING: 57470)

## Différences avec l'acide hyaluronique libre

| Propriété | Acide hyaluronique | Sodium hyaluronate |
|---|---|---|
| Stabilité pH | Variable | Excellente (pH 4–8) |
| Charge ionique | Négative (faible) | Négative forte |
| Affinité kératine | Modérée | Élevée (liaisons ioniques) |
| Solubilité | Bonne | Très bonne |

## Mécanisme d'action capillaire

### 1. Dépôt substantif sur la fibre
La charge anionique du sodium hyaluronate interagit avec les résidus cationiques de surface de la kératine (arginine, lysine) — dépôt durable même après rinçage.

### 2. Hydratation profonde (bas PM)
Le sodium hyaluronate de bas poids moléculaire (<50 kDa) diffuse dans les espaces inter-microfibrillaires du cortex, hydratant la fibre de l'intérieur et réduisant la porosité.

### 3. Réduction de la friction
Le film hygroscopique formé en surface lisse la cuticule et réduit les nœuds et la casse mécanique lors du démêlage.

## Concentration d'usage
0,05–1% ; souvent associé au panthénol et à la glycérine pour un effet synergique.
`,
  },
  {
    name: 'Bétaïne (Betaine)',
    slug: INGREDIENT_SLUGS.BETAINE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      'Osmolyte naturel extrait de la betterave sucrière, humectant doux et non irritant, protège la fibre et le cuir chevelu du stress osmotique.',
    content: `
# Bétaïne (Betaine / Trimethylglycine)

La bétaïne (triméthylglycine, TMG) est un osmolyte naturel présent dans la betterave sucrière (*Beta vulgaris*), les algues marines et de nombreux organismes vivants. Distincte de la cocamidopropyl bétaïne (tensioactif), la bétaïne pure est un actif humectant et protecteur.

## INCI
**BETAINE** (CAS: 107-43-7 | COSING: 30615)

## Mécanisme d'action

### 1. Osmolyte compatible
La bétaïne est un "osmolyte compatible" — elle s'accumule dans les cellules sous stress hydrique (déshydratation, osmose) sans perturber les fonctions enzymatiques. Protège les kératinocytes du cuir chevelu contre le stress thermique et chimique.

### 2. Humectance douce
Retient l'eau sans effets collants. Sa charge zwitterionique (neutre) lui confère une excellente tolérance, y compris sur cuirs chevelus sensibles et irrités.

### 3. Réduction de la friction
Forme un film lubrifiant léger sur la cuticule, réduisant l'électricité statique et les nœuds.

### 4. Stabilisateur de formule
Améliore la solubilité des actifs dans les phases aqueuses et stabilise les protéines hydrolysées en formule.

## Avantages
- Origine naturelle certifiable Cosmos
- Non irritant, non comédogène
- Compatible avec tous types de tensioactifs

## Concentration d'usage
0,5–3% dans shampoings, après-shampooings et leave-ins.
`,
  },
  {
    name: 'Fructose',
    slug: INGREDIENT_SLUGS.FRUCTOSE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      "Monosaccharide naturel hygroscopique, humectant doux d'origine végétale apportant souplesse et brillance à la fibre capillaire.",
    content: `
# Fructose

Le fructose (lévulose) est un monosaccharide cétosique naturellement présent dans les fruits et le miel. En cosmétique capillaire, il est utilisé comme humectant doux et agent de brillance d'origine naturelle.

## INCI
**FRUCTOSE** (CAS: 57-48-7 | COSING: 35176)

## Mécanisme d'action

### 1. Hygroscopicité
Cinq groupes hydroxyle captent et retiennent l'eau atmosphérique. Légèrement moins hygroscopique que la glycérine mais très bien toléré.

### 2. Film brillant
Le fructose forme un film légèrement réfractif sur la cuticule qui améliore la brillance et l'aspect lissé des cheveux.

### 3. Osmolyte sucré
Protège les protéines kératiniques contre la déshydratation — effet "cryoprotection" biologique.

## Avantages formulatoires
- Certifiable naturel/Cosmos
- Douceur sensorielle (légère sucrosité bénigne)
- Compatible shampooings sans sulfates et formules naturelles

## Concentration d'usage
1–5% dans shampoings, après-shampooings et masques.
`,
  },
  {
    name: 'Tréhalose (Trehalose)',
    slug: INGREDIENT_SLUGS.TREHALOSE_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      'Disaccharide osmolyte produit par les organismes résistants à la dessiccation, stabilise les protéines kératiniques et protège la fibre capillaire du stress thermique.',
    content: `
# Tréhalose (Trehalose)

Le tréhalose est un disaccharide non réducteur (α-D-glucopyranosyl α-D-glucopyranoside) produit par les organismes capables de résister à la dessiccation totale (bactéries, levures, plantes de résurrection). C'est l'un des osmolytes les plus efficaces identifiés en biologie.

## INCI
**TREHALOSE** (CAS: 99-20-7 | COSING: 58831)

## Mécanisme d'action

### 1. Vitrification protectrice
Le tréhalose remplace les molécules d'eau autour des protéines lors de la déshydratation, formant une matrice vitreuse qui maintient leur conformation native. Appliqué à la kératine : préserve la structure secondaire et tertiaire des chaînes protéiques sous stress thermique (brushing, lissage).

### 2. Stabilisation des membranes lipidiques
Protège les lipides intercellulaires de la cuticule contre la peroxydation et la fusion lipidique induite par la chaleur.

### 3. Humectance durable
Retient l'eau avec une efficacité comparable à la glycérine, avec l'avantage supplémentaire d'une protection structurelle.

### 4. Antioxydant indirect
Inhibe la réaction de Maillard (brunissement non enzymatique) entre sucres et protéines — protège la couleur et la qualité de la fibre.

## Concentration d'usage
0,5–3% dans masques, leave-ins et soins thermiques.
`,
  },
  {
    name: 'Allantoïne (Allantoin)',
    slug: INGREDIENT_SLUGS.ALLANTOIN_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      'Métabolite purique apaisant et kératolytique doux, soulage les irritations du cuir chevelu et favorise le renouvellement cellulaire.',
    content: `
# Allantoïne (Allantoin)

L'allantoïne est un métabolite de l'acide urique (oxydation de la purine) naturellement présent dans la consoude (*Symphytum officinale*), le son de blé et l'urine fœtale. En cosmétique, elle est produite par synthèse chimique (oxydation de l'acide urique) ou extraction végétale.

## INCI
**ALLANTOIN** (CAS: 97-59-6 | COSING: 28460)

## Mécanisme d'action

### 1. Action kératolytique douce
Hydrolyse les liaisons inter-cornéocytaires superficielles, facilitant le détachement des cellules mortes du cuir chevelu sans agressivité — prévention des squames, amélioration de l'absorption des actifs co-formulés.

### 2. Apaisement et cicatrisation
Stimule la prolifération des fibroblastes et l'épithélialisation. Réduit l'inflammation, les démangeaisons et les micro-irritations du cuir chevelu dues au grattage ou aux résidus de formule.

### 3. Hydratation indirecte
En favorisant le renouvellement cellulaire et en améliorant la fonction barrière du cuir chevelu, l'allantoïne améliore indirectement la rétention hydrique cutanée.

### 4. Compatibilité pH
Stable sur une large gamme de pH (4–8), compatible avec la plupart des systèmes de conservation et actifs capillaires.

## Concentration d'usage
0,1–0,5% — active dès 0,1%. Présente dans de nombreux shampoings apaisants, soins post-coloration et formules cuir chevelu sensible.
`,
  },
  {
    name: 'Aquaxyl (Xylitylglucoside + Anhydroxylitol + Xylitol)',
    slug: INGREDIENT_SLUGS.AQUAXYL_COMPLEX,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      'Complexe humectant breveté Sederma combinant trois dérivés du xylitol, réduit la perte en eau transépidermique et améliore la rétention hydrique de la fibre capillaire.',
    content: `
# Aquaxyl™ (Xylitylglucoside + Anhydroxylitol + Xylitol)

Aquaxyl est un complexe humectant biomimétique breveté par Sederma (groupe Croda). Il associe trois dérivés biosourcés du xylitol, eux-mêmes issus du bois de hêtre (*Fagus sylvatica*) par hydrolyse enzymatique. Présent dans les formulations haut-de-gamme de marques comme Olaplex (N°9) et Les Secrets de Loly (Boost Curl, Kurl Fusion).

## INCI
**XYLITYLGLUCOSIDE (ET) ANHYDROXYLITOL (ET) XYLITOL**

## Composition du complexe

| Composant | Rôle principal |
|---|---|
| Xylitylglucoside | Précurseur métabolique, active la synthèse de lipides lamellaires |
| Anhydroxylitol | Régulateur de la fluidité lipidique inter-cellulaire |
| Xylitol | Humectant osmotique, substrat énergétique cellulaire |

## Mécanisme d'action

### 1. Activation de la voie des aquaporines
Des études in vitro (Sederma) montrent qu'Aquaxyl augmente l'expression des aquaporines-3 (AQP3) dans les kératinocytes — canaux protéiques régulant le transport transmembranaire de l'eau. Résultat : amélioration de 35% de la rétention hydrique vs. témoin.

### 2. Réduction de la perte en eau
Aquaxyl stimule la synthèse de lipides lamellaires de la couche cornée (céramides, cholestérol, acides gras libres), renforçant la fonction barrière et réduisant la TEWL (TransEpidermal Water Loss).

### 3. Humectance directe du xylitol
Le xylitol libre agit comme osmolyte humectant classique, retenant l'eau dans les couches superficielles.

## Données cliniques
Études Sederma (28 jours, n=20) : +35% hydratation vs placebo ; –18% TEWL.

## Concentration d'usage
1–3% dans leave-ins, gels coiffants et sérums capillaires.
`,
  },
  {
    name: 'Xylitylglucoside',
    slug: INGREDIENT_SLUGS.XYLITYLGLUCOSIDE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      'Composant actif du complexe Aquaxyl, stimule la synthèse des lipides lamellaires et active les aquaporines pour améliorer la rétention hydrique.',
    content: `
# Xylitylglucoside

Le xylitylglucoside est un glycoside hémiacétal formé par condensation du xylitol et du glucose. Il est l'un des trois composants du complexe Aquaxyl™ (Sederma/Croda), issu de la hydrolyse enzymatique du bois de hêtre.

## INCI
**XYLITYLGLUCOSIDE** (CAS: 247015-07-2)

## Mécanisme d'action

Précurseur métabolique actif du complexe Aquaxyl : pénètre les kératinocytes et active la voie de synthèse des lipides intercellulaires de la cuticule (céramides, acides gras libres). Stimule également l'expression des aquaporines-3, augmentant le flux d'eau transmembranaire.

> Généralement formulé dans le complexe complet Aquaxyl (avec anhydroxylitol + xylitol) plutôt qu'en usage isolé.
`,
  },
  {
    name: 'Anhydroxylitol',
    slug: INGREDIENT_SLUGS.ANHYDROXYLITOL,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      'Dérivé cyclique du xylitol, composant du complexe Aquaxyl, régule la fluidité des lipides intercellulaires de la cuticule capillaire.',
    content: `
# Anhydroxylitol

L'anhydroxylitol (1,4-anhydroxylitol) est un dérivé cyclique du xylitol formé par déshydratation intramoléculaire. Il constitue le composant "régulateur lipidique" du complexe Aquaxyl™ (Sederma/Croda).

## INCI
**ANHYDROXYLITOL** (CAS: 5754-35-8)

## Mécanisme d'action

Régule la fluidité et l'organisation lamellaire des lipides intercellulaires de la cuticule. En interaction avec le xylitylglucoside et le xylitol, il maintient l'intégrité de la barrière lipidique de la fibre et réduit la TEWL (perte en eau transépidermique).

> Composant du complexe Aquaxyl — rarement utilisé seul en formulation capillaire.
`,
  },
  {
    name: 'Xylitol',
    slug: INGREDIENT_SLUGS.XYLITOL_HAIR,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.HUMECTANT,
    description:
      'Polyol sucre à cinq carbones, humectant osmotique direct et substrat énergétique cellulaire, composant du complexe Aquaxyl.',
    content: `
# Xylitol

Le xylitol est un polyol pentitol (5 carbones) naturellement présent dans les fruits, les légumes et le bouleau (*Betula spp.*). Produit industriellement par hydrogénation du xylose, il est surtout connu en alimentation pour ses propriétés anti-cariogènes, et en cosmétique comme humectant doux.

## INCI
**XYLITOL** (CAS: 87-99-0 | COSING: 60404)

## Mécanisme d'action

### 1. Humectance osmotique
Cinq groupes hydroxyle captent et retiennent l'eau. Effet humectant proche du sorbitol — douceur sensorielle supérieure à la glycérine (sans effet collant).

### 2. Substrat énergétique
Pénètre les kératinocytes et entre dans la voie des pentoses phosphates, fournissant de l'énergie aux cellules folliculaires et du cuir chevelu.

### 3. Activité antimicrobienne légère
Inhibe la croissance de certains pathogènes cutanés (notamment *Staphylococcus aureus*), contribuant à l'équilibre du microbiome du cuir chevelu.

## Dans le complexe Aquaxyl
Associé au xylitylglucoside et à l'anhydroxylitol, le xylitol constitue le volet "humectance directe" du complexe, pendant que les deux autres composants agissent sur la barrière lipidique.

## Concentration d'usage
Seul : 1–5% ; dans Aquaxyl : ~1–3% total du complexe.
`,
  },
]
