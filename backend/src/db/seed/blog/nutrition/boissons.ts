import type { ArticleInput } from '../seed-articles'

export const boissonsBenchmark: ArticleInput = {
  title: "Boissons : tier list santé (de l'eau aux sodas)",
  slug: 'boissons-benchmark',
  category: 'nutrition',
  excerpt:
    "Classement des boissons courantes par intérêt nutritionnel, du S-tier (eau) au F-tier (sodas, energy drinks) : avantages, limites, pièges d'étiquettes. Angle nutritionnel pragmatique, pas médical.",
  publishedAt: null,
  content: `Toutes les boissons ne se valent pas : certaines hydratent en apportant des micronutriments intéressants, d'autres sont essentiellement des vecteurs de sucre ou d'alcool. Ce benchmark classe 26 boissons courantes sur une échelle S → F, avec pour chacune **apports réels** et **limites**.

**Attention aux étiquettes** : pour les jus, la différence entre "100 % pur jus", "nectar" et "boisson aromatisée" change radicalement la position dans ce classement. À apport en sucre comparable, un "jus" industriel peut basculer de B-tier à D-tier.

## Échelle

| Tier | Signification |
|---|---|
| **S** | À privilégier sans condition |
| **A** | Très bon rapport apports / inconvénients, consommation régulière |
| **B** | Apports intéressants mais charge en sucre à surveiller |
| **C** | Occasionnel, apports limités ou dilués |
| **D** | À limiter : alcool, sucre ajouté, ou apports faibles |
| **F** | À éviter ou contexte spécifique uniquement |

## S-tier

### Eau
- **Pour** : hydratation, 0 calorie, aucun additif, compatible toutes situations.
- **Contre** : aucun apport nutritionnel — mais ce n'est pas sa fonction.

## A-tier

### Jus de tomate (100 % pur jus, sans sel ajouté)
- **Pour** : vitamine C, **lycopène** (caroténoïde liposoluble, mieux assimilé après cuisson / avec un corps gras).
- **Contre** : versions industrielles souvent salées ou sucrées — vérifier étiquette.

### Jus de carotte
- **Pour** : **caroténoïdes** (vitamine A), vitamines K / C / B6 / E, potassium.
- **Contre** : calories modérées, peu de fibres (vs carotte entière).

### Jus de betterave
- **Pour** : **nitrates** (précurseurs de NO, vasodilatateur), fer, folate, potassium, bétaïne.
- **Contre** : naturellement peu sucré mais certains mélanges industriels ajoutent du jus de pomme.

### Café
- **Pour** : caféine (éveil, performance), **acide chlorogénique** (antioxydant), associations épidémiologiques favorables sur foie / système cardiovasculaire.
- **Contre** : dépendance, anxiété, perturbation du sommeil chez les métaboliseurs lents de la caféine. Éviter après 14 h si sensible.

### Thé noir
- **Pour** : polyphénols (théaflavines, théarubigines), flavonoïdes, manganèse.
- **Contre** : caféine (moins que café), peut gêner si sensible ou bu tard.

### Thé vert
- **Pour** : **EGCG** (catéchine majeure), **L-théanine** (aminé associé à calme + focus), peu de caféine.
- **Contre** : peut déranger l'estomac à jeun (tanins).

### Lait entier (si toléré)
- **Pour** : protéines complètes (whey + caséine), calcium, phosphore, vitamines B2 / B12 / D.
- **Contre** : lactose (intolérance fréquente), densité calorique, allergies rares aux protéines de lait de vache.

## B-tier

### Jus d'orange (100 % pur jus)
- **Pour** : vitamine C, flavonoïdes (hespéridine), caroténoïdes.
- **Contre** : charge glycémique élevée, souvent sucre ajouté, fibres absentes vs orange entière.

### Jus de pamplemousse
- **Pour** : vitamine C, bêta-carotène, lycopène, flavonoïdes (naringine).
- **Contre** : ⚠️ **interaction médicamenteuse** importante avec de nombreux traitements (statines, certains antihypertenseurs, immunosuppresseurs) — consulter notice ou pharmacien.

### Jus de canneberge (cranberry)
- **Pour** : **proanthocyanidines de type A** (association étudiée avec la prévention des infections urinaires récidivantes), vitamine C / K / E.
- **Contre** : très souvent sucre ajouté (la baie pure est imbuvable). Privilégier versions "sans sucre ajouté".

### Jus de grenade
- **Pour** : **punicalagines**, **anthocyanes**, un des jus les plus denses en antioxydants mesurés (ORAC).
- **Contre** : sucré, souvent coupé à d'autres jus.

### Jus de cerise acidulée (tart cherry)
- **Pour** : anthocyanes, données cliniques sur **récupération musculaire** après efforts d'endurance, mélatonine naturelle (sommeil).
- **Contre** : sucre ajouté très fréquent.

### Eau de coco
- **Pour** : potassium, manganèse, vitamine C, hydratation isotonique naturelle (intéressante à l'effort).
- **Contre** : apports modestes hors contexte sportif, prix élevé.

## C-tier

### Jus de pomme
- **Pour** : quelques polyphénols, procyanidines.
- **Contre** : nettement moins nutritif que la pomme entière (fibres disparues), charge glycémique élevée.

### Jus de raisin
- **Pour** : manganèse, flavonoïdes, resvératrol (surtout peau du raisin noir).
- **Contre** : naturellement très sucré, souvent sucre additionnel.

### Jus d'ananas
- **Pour** : manganèse, vitamine C, **bromélaïne** (enzyme protéolytique, aide digestion des protéines).
- **Contre** : charge glycémique élevée.

### Jus de pruneau
- **Pour** : B6, vitamine C, potassium, manganèse, fer, fibres résiduelles — **efficace contre la constipation** (sorbitol, fibres solubles).
- **Contre** : très riche en sucres naturels.

### Boissons de l'effort (*sports drinks*)
- **Pour** : sucres rapides + électrolytes, utiles **pendant effort long et intense** (> 1 h).
- **Contre** : hors sport = simple eau sucrée, aucun intérêt.

## D-tier

### Bière
- **Pour** : quelques micronutriments (silicium, B), associations épidémiologiques ambiguës en consommation modérée.
- **Contre** : **alcool** (7 kcal/g), risque de dépendance, impact hépatique, gain de poids, interactions sommeil.

### Chocolat chaud (au lait + sucre)
- **Pour** : nutriments du lait, flavanols si cacao non alcalinisé.
- **Contre** : sucre ajouté important, densité calorique.

### Limonade industrielle
- **Pour** : un peu de vitamine C.
- **Contre** : charge en sucre très élevée (sauf version maison peu sucrée).

### Thé sucré (sweet tea / bubble tea)
- **Pour** : manganèse, polyphénols.
- **Contre** : le sucre ajouté annule largement l'intérêt du thé.

### Vin
- **Pour** : polyphénols (resvératrol du rouge), associations épidémiologiques en consommation modérée — de plus en plus contestées.
- **Contre** : **alcool**. Position actuelle de l'OMS : **aucune dose d'alcool n'est sans risque** pour la santé.

## F-tier

### Soda (classique)
- **Pour** : éventuelle légère caféine.
- **Contre** : charge en sucre massive (souvent sirop de glucose-fructose), zéro micronutriment, impact métabolique reconnu.

### Soda light / zero
- **Pour** : 0 kcal.
- **Contre** : édulcorants artificiels (données mixtes), érosion de l'émail dentaire (acide phosphorique / citrique), effet possible sur le microbiote et la régulation de l'appétit.

### Energy drinks
- **Pour** : caféine + vitamines B + taurine pour un coup de fouet court.
- **Contre** : sucre très élevé (ou édulcorants), données de pharmacovigilance défavorables (cardiovasculaire, hépatique), effet rebond marqué.

## Synthèse

| Règle | Version courte |
|---|---|
| Hydratation de base | **Eau** + thé ou café selon préférence |
| Jus | Privilégier **légumes** (tomate, carotte, betterave) sur les fruits |
| Lire l'étiquette | "Sucre ajouté : 0" change tout dans le B/C-tier |
| Alcool | Aucune dose sans risque — les placer en D minimum |
| Sodas et energy drinks | F-tier, pas d'équivalent nutritionnel |

## Cas particuliers

- **Sport long** (> 1 h) : boissons de l'effort justifiées pour apports rapides.
- **Traitement médicamenteux** : pamplemousse interdit avec beaucoup de médicaments — vérifier notice.
- **Sensibilité caféine** : thé vert ou infusions sans caféine (rooibos, verveine) pour l'après-midi.
- **Intolérance lactose** : lait A2, fermentés (kéfir), ou boissons végétales enrichies en calcium.

---

*Ce classement est une grille nutritionnelle générale, pas une recommandation individuelle. Pour toute pathologie (diabète, insuffisance rénale, troubles hépatiques…), l'avis d'un professionnel de santé prime.*
`,
}
