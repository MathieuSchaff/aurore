import type { ArticleInput } from '../seed-articles'

export const fruitsBenchmark: ArticleInput = {
  title: "Fruits : tier list par densité nutritionnelle",
  slug: 'fruits-benchmark',
  category: 'nutrition',
  excerpt:
    "Classement des 30+ fruits courants par densité en antioxydants, fibres, vitamines et composés bioactifs. Du S-tier (avocat, baies, grenade) au D-tier (fruits secs très sucrés). Angle nutritionnel, pas médical.",
  publishedAt: null,
  content: `Tous les fruits ne se valent pas sur le plan nutritionnel. Certains combinent densité en micronutriments, fibres et polyphénols **bioactifs** ; d'autres sont surtout sources de sucres avec peu de cofacteurs. Ce benchmark classe 30+ fruits courants sur une échelle **S → D**.

Principe : plus un fruit combine **plusieurs familles d'actifs** (anthocyanes, caroténoïdes, enzymes, acides gras spécifiques) avec une **charge glycémique raisonnable**, plus il monte dans le classement.

## Échelle

| Tier | Signification |
|---|---|
| **S** | Densité exceptionnelle, bénéfices uniques |
| **A** | Excellent profil, bénéfices spécifiques marqués |
| **B** | Bon et solide, sans être parmi les plus denses |
| **C** | Correct mais moins dense que le reste |
| **D** | À limiter : trop sucré, sec, ou bénéfices faibles |

## S-tier

### Avocat
- **Pour** : acides gras mono-insaturés (oléique, oméga-9), fibres, vitamine K, folate, B5, B6, potassium, lutéine, glutathion. Profil unique parmi les fruits.
- **Contre** : densité calorique élevée — ½ à 1 par jour est un bon repère.

### Mûres
- **Pour** : anthocyanes, vitamine C, manganèse, vitamine K, fibres. Un des meilleurs scores ORAC par kcal.
- **Contre** : saison courte, prix élevé hors saison.

### Myrtilles
- **Pour** : anthocyanes, ptérostilbène, quercétine, myricétine. Profil le plus étudié en santé cognitive et vasculaire.
- **Contre** : myrtilles cultivées = moins denses que la variété sauvage.

### Goyave
- **Pour** : teneur extrême en vitamine C (~230 mg/100g, ~3× l'orange), fibres, quercétine.
- **Contre** : peu disponible en France fraîche.

### Grenade
- **Pour** : **punicalagines** (antioxydants uniques), anthocyanes, urolithine A (via microbiote — marqueur mitochondrial).
- **Contre** : sucrée, peu pratique à manger.

### Kiwi
- **Pour** : vitamine C, K, E, actinidine (enzyme protéolytique), sérotonine, polyphénols. Régule la tension.
- **Contre** : peut provoquer des picotements / allergies croisées (latex).

### Ananas
- **Pour** : manganèse, vitamine C, **bromélaïne** (enzyme protéolytique unique — digestion, profil anti-inflammatoire).
- **Contre** : bromélaïne **détruite par la conserve et la cuisson** — frais uniquement pour l'effet enzyme. Sucré.

### Tomate (botaniquement un fruit)
- **Pour** : **lycopène** (biodisponibilité × 3-4 après cuisson avec corps gras), vitamine C, K, polyphénols.
- **Contre** : acide (reflux chez certains).

### Pamplemousse
- **Pour** : vitamine C, lycopène (variétés roses), flavonoïdes, naringénine (sensibilité à l'insuline).
- **Contre** : ⚠️ **interactions CYP3A4** majeures avec beaucoup de médicaments (statines, immunosuppresseurs, certains antihypertenseurs) — vérifier notice.

## A-tier

### Framboises
- **Pour** : fibres élevées, manganèse, vitamine C, **acide ellagique** (ellagitannins → urolithines).
- **Contre** : fragiles, chères fraîches — surgelées sont un bon compromis.

### Fraises
- **Pour** : manganèse, fibres, pelargonidine (anthocyane spécifique), acide ellagique.
- **Contre** : allergies croisées fréquentes (bouleau), pesticides si non bio (classée "dirty dozen").

### Citron, citron vert
- **Pour** : vitamine C, D-limonène, hespéridine, diosmine. Acide citrique améliore l'absorption du fer non-héminique.
- **Contre** : acidité → érosion de l'émail dentaire, reflux possible.

### Papaye
- **Pour** : vitamine C, folate, lycopène, **papaïne** (enzyme protéolytique, proche de la bromélaïne).
- **Contre** : peu disponible fraîche mûre en France.

### Cerises (griottes, Montmorency)
- **Pour** : **mélatonine naturelle** (sommeil), anthocyanes, récupération musculaire post-effort (données cliniques).
- **Contre** : saison courte, sucrées.

### Canneberges (cranberries)
- **Pour** : **proanthocyanidines de type A** uniques — prévention documentée des infections urinaires récidivantes (E. coli).
- **Contre** : imbuvables pures → versions industrielles quasi toujours sucrées. Oxalates → prudence si terrain calculs rénaux.

### Melon cantaloup
- **Pour** : bêta-carotène (plus dense que beaucoup de fruits), vitamine C, hydratation.
- **Contre** : saison courte, charge glycémique moyenne.

### Courge butternut (botaniquement un fruit)
- **Pour** : bêta-carotène, vitamine C, fibres.
- **Contre** : rarement consommée comme "fruit" dans les habitudes françaises.

### Tomate (déjà S-tier mais A-tier en cru) — voir ci-dessus.

## B-tier

### Banane
- **Pour** : B6, potassium, manganèse, tryptophane, amidon résistant (surtout verte).
- **Contre** : charge glycémique élevée à maturité, peu de polyphénols.

### Raisin (surtout noir)
- **Pour** : resvératrol, OPC des pépins, mélatonine naturelle.
- **Contre** : très sucré, résidus pesticides fréquents (bio recommandé).

### Noix de coco
- **Pour** : MCT (acide laurique) → cétones, manganèse, fibres.
- **Contre** : très calorique, graisses saturées — à modérer.

### Mangue
- **Pour** : bêta-carotène, vitamine C, mangiférine, fibres.
- **Contre** : sucre élevé, charge glycémique marquée.

### Orange
- **Pour** : vitamine C, hespéridine, folate.
- **Contre** : fruit entier > jus (fibres + index glycémique plus bas).

### Prunes
- **Pour** : polyphénols, vitamine K, bore (os).
- **Contre** : variables selon variété (sucre).

### Mandarine / clémentine
- **Pour** : vitamine C, nobilétine, tangérétine (flavonoïdes neuroprotecteurs).
- **Contre** : saison courte.

### Pastèque
- **Pour** : lycopène, **citrulline** (performance sportive, NO), hydratation.
- **Contre** : charge glycémique élevée en grosses portions.

## C-tier

### Pomme
- **Pour** : quercétine, pectine (fibres solubles, satiété, microbiote).
- **Contre** : moins dense en micronutriments que les baies. Peau = bio obligatoire pour en profiter.

### Abricot
- **Pour** : bêta-carotène, vitamines C / E.
- **Contre** : saison très courte, moins dense en multi-molécules.

### Melon honeydew
- **Pour** : vitamine C, hydratation.
- **Contre** : profil moins complet que le cantaloup.

### Olives vertes (fruit techniquement)
- **Pour** : graisses mono-insaturées, vitamine E, oléocanthal (anti-inflammatoire).
- **Contre** : très salées si en saumure, traitements industriels variables.

### Courgette
- **Pour** : caroténoïdes, faible densité calorique.
- **Contre** : densité en actifs limitée vs crucifères.

### Pêche, nectarine
- **Pour** : lutéine, acide chlorogénique.
- **Contre** : peu denses, pesticides fréquents (non bio).

### Poire
- **Pour** : fibres, procyanidines, cuivre.
- **Contre** : peu de polyphénols comparée aux baies.

## D-tier (à modérer)

### Dattes séchées
- **Pour** : fibres, potassium, antioxydants.
- **Contre** : **70 % de sucre** — à traiter comme un sucre "mieux accompagné" plutôt qu'un fruit.

### Figues séchées
- **Pour** : fibres, manganèse, vitamine K.
- **Contre** : très sucrées — même remarque.

### Fruits en conserve sirop
- **Contre** : sucre ajouté, perte des vitamines thermolabiles, pas de raison d'en consommer hors contexte.

## Tableau synthèse

| Tier | Fruits |
|---|---|
| **S** | Avocat, mûres, myrtilles, goyave, grenade, kiwi, ananas (frais), tomate (cuite + huile), pamplemousse |
| **A** | Framboises, fraises, citron, citron vert, papaye, cerises, canneberges, melon cantaloup, butternut |
| **B** | Banane, raisin (noir), noix de coco, mangue, orange, prunes, mandarine, pastèque |
| **C** | Pomme, abricot, melon honeydew, olives vertes, courgette, pêche, poire |
| **D** | Dattes, figues séchées, fruits en conserve sirop |

## Règles pratiques

- **Diversifier** > maximiser un seul "super-fruit". Une poignée de baies mélangées bat une seule variété en monotonie.
- **Peau = polyphénols** → bio si la peau est consommée (pomme, poire, raisin, prune, pêche).
- **Congélation** conserve très bien les anthocyanes — les baies surgelées restent en S/A-tier.
- **Caroténoïdes** (tomate, mangue, abricot, pastèque) : **toujours avec corps gras** pour absorption.
- **Charge glycémique** : fruits entiers > jus systématiquement (fibres, vitesse d'absorption).

## Pour aller plus loin

- [Fruits de saison : actifs clés et tips](/blog/fruits-saison-actifs) — détails par fruit avec saison FR.
- [Boissons : tier list santé](/blog/boissons-benchmark) — classement des jus et boissons (dont jus de fruits).
- [Guide des nutriments fonctionnels](/blog/guide-nutriments-fonctionnels) — cibles journalières par composé bioactif.

---

*Ce classement est nutritionnel, pas médical. Les préférences individuelles, tolérances (fructose, histamine) et contextes (grossesse, diabète, traitements) peuvent modifier les choix optimaux — un avis professionnel reste pertinent en cas de pathologie.*
`,
}
