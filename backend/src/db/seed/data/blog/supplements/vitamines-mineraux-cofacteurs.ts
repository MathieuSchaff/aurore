import type { ArticleInput } from '../seed-articles'

export const vitaminesMinerauxCofacteurs: ArticleInput = {
  title: 'Vitamines et minéraux : dosages, synergies et cofacteurs',
  slug: 'vitamines-mineraux-dosages-synergies-cofacteurs',
  category: 'supplements',
  excerpt:
    'Guide de référence : apports recommandés, limites de sécurité, et surtout cofacteurs et synergies indispensables pour que chaque vitamine ou minéral soit réellement utilisable. A, D, E, K, C, complexe B, oméga-3, magnésium, zinc, sélénium, fer, cuivre, iode, bore.',
  publishedAt: null,
  content: `Une vitamine prise isolément n'est pas toujours bien utilisée. Chaque nutriment dépend d'autres — pour être activé, transporté, régénéré ou protégé de l'oxydation. Ce guide rassemble les **apports recommandés**, les **limites de sécurité** et surtout les **cofacteurs** qui conditionnent l'efficacité réelle.

Les chiffres correspondent aux références EFSA / ANSES pour les adultes. Ce sont des repères généraux, pas des prescriptions individuelles.

## Vitamines liposolubles (A, D, E, K)

Les quatre liposolubles ont un point commun : elles ont besoin de **graisses alimentaires** pour être absorbées. Les prendre au cours d'un repas contenant un minimum de lipides (huile d'olive, avocat, œufs, poisson) change tout.

### Vitamine A

- **Apport recommandé** : 750-800 µg ER/jour.
- **Limite maximale** : 3000 µg ER/jour.
- **Formes** : rétinol (préformé, animal) ou bêta-carotène (provitamine, végétal — converti selon besoins, pas de toxicité reconnue hormis une coloration cutanée temporaire).
- **Cofacteurs** : **zinc** (conversion bêta-carotène → rétinol), **protéines** (synthèse de la RBP qui transporte le rétinol), graisses alimentaires.
- **Sources** : foie, carottes, patates douces, épinards, œufs.

### Vitamine D

- **Apport recommandé** : 15 µg (600 UI)/jour.
- **Limite maximale** : 100 µg (4000 UI)/jour.
- **Formes** : D3 (cholécalciférol, plus efficace) préférée à D2 (ergocalciférol).
- **Cofacteurs clés** :
  - **Magnésium** (activation en calcitriol, forme active) — 200-400 mg/jour (citrate, glycinate, malate).
  - **Vitamine K2** (MK-7, 45-200 µg/jour) : oriente le calcium vers les os plutôt que les artères.
  - **Bore** : réduit l'excrétion de vitamine D.
  - Calcium, phosphore, graisses alimentaires.
- **Sources** : synthèse cutanée (soleil), poissons gras, œufs, champignons.

### Vitamine E

- **Apport recommandé** : 12-15 mg α-TE/jour.
- **Limite maximale** : 300-1000 mg/jour selon les sources.
- **Formes** : d-alpha-tocophérol naturel mieux absorbé que le dl-alpha synthétique ; les tocophérols mixtes (+ tocotriénols) offrent un spectre antioxydant plus complet.
- **Cofacteurs** : **vitamine C** (régénère la vitamine E oxydée), **sélénium** (synergie via la glutathion peroxydase), graisses.
- **Sources** : huiles végétales, noix, graines, avocat.

### Vitamine K

- **Apport recommandé** : 70-120 µg/jour.
- **Limite maximale** : non établie.
- **Formes** : K1 (phylloquinone, coagulation) ; K2 (ménaquinone, os + artères) — MK-7 préférée à MK-4 pour sa demi-vie longue.
- **Cofacteurs** : graisses, flore intestinale saine (production endogène partielle de K2), calcium (K2 active les protéines qui le fixent : ostéocalcine, matrice GLA).
- **Sources** : K1 → légumes verts ; K2 → natto, fromages fermentés, jaune d'œuf.

> ⚠️ La vitamine K interfère avec les anticoagulants de type AVK (warfarine). À évoquer avec son médecin si traitement en cours.

## Vitamine C

- **Apport recommandé** : 110 mg/jour.
- **Limite maximale** : 2000 mg/jour.
- **Formes** : acide ascorbique ou ascorbates tamponnés (mieux tolérés par l'estomac).
- **Cofacteurs et interactions** :
  - **Fer non-héminique** : vitamine C multiplie son absorption.
  - **Cuivre** : synergie pour la synthèse du collagène.
  - Protège vitamine E, folate et oméga-3 de l'oxydation.
- **Sources** : agrumes, poivrons, kiwi, brocoli, fraises.

## Complexe B (B1, B2, B3, B5, B6, B8, B9, B12)

Les vitamines B fonctionnent en réseau. Les prendre ensemble reflète leur biologie — c'est pourquoi un "complexe B" a souvent plus de sens qu'une B isolée (sauf indication ciblée).

### B1 (thiamine)

- **Apport** : 1,2-1,3 mg/jour. Pas de limite établie.
- **Cofacteur clé** : magnésium (activation en thiamine pyrophosphate).
- L'alcool épuise les réserves.
- **Sources** : céréales complètes, légumineuses, porc, graines.

### B2 (riboflavine)

- **Apport** : 1,3-1,6 mg/jour.
- **Rôle transverse** : active B6 et B9 en formes utilisables. Urine jaune fluo = excrétion normale, sans risque.
- **Sources** : produits laitiers, œufs, viandes, légumes verts.

### B3 (niacine)

- **Apport** : 14-16 mg EN/jour. Facilement couvert par alimentation + tryptophane.
- **Limites max** : 10-35 mg (acide nicotinique) ; jusqu'à 900 mg (nicotinamide).
- **Formes** :
  - **Acide nicotinique** → effet sur cholestérol mais *flush* (rougeurs) dès 30-50 mg.
  - **Nicotinamide** → énergie, peau, système nerveux, pas de flush.
  - **Nicotinamide riboside (NR)** → boost direct du NAD+ ; doses 250-300 mg/jour dans les compléments longévité.
- Toutes convergent vers NAD/NADP dans le corps.
- **Cofacteurs** : tryptophane (précurseur), B1/B2/B6, fer, oméga-3.

### B5 (acide pantothénique)

- **Apport** : 5-6 mg/jour. Toxicité très faible.
- Synthèse du coenzyme A, métabolisme énergétique global.

### B6 (pyridoxine)

- **Apport** : 1,3-1,7 mg/jour.
- **Limite maximale** : 25-100 mg/jour — au-delà, risque documenté de **neuropathies périphériques**.
- **Forme active** : P5P (pyridoxal-5-phosphate).
- **Cofacteurs** : zinc, magnésium.
- Précurseur direct des neurotransmetteurs (sérotonine, dopamine).

### B8 / B7 (biotine)

- **Apport** : 30-50 µg/jour. Très bonne tolérance.
- Production endogène partielle par la flore intestinale.
- **À savoir** : le blanc d'œuf cru contient de l'avidine, qui bloque son absorption (cuire les blancs règle le problème).

### B9 (folates)

- **Apport** : 330-400 µg EFA/jour.
- **Limite** : 1000 µg/jour.
- **Formes** : **5-MTHF (méthylfolate)** directement utilisable — préférée à l'acide folique synthétique chez les personnes avec variant MTHFR (40-60 % de la population).
- **Cofacteurs** : B12 (indissociable pour la synthèse d'ADN), B2 (conversion en forme active), zinc, C.
- **Attention** : l'acide folique à forte dose peut masquer une carence en B12.

### B12 (cobalamine)

- **Apport** : 2,4-4 µg/jour. Toxicité très faible.
- **Formes** : méthyl- et adénosylcobalamine (actives) préférées à la cyanocobalamine synthétique.
- **Cofacteurs** : B9, facteur intrinsèque gastrique, pH gastrique acide (les IPP gênent son absorption).
- **Populations à risque** : végétaliens, plus de 60 ans, utilisateurs chroniques d'IPP ou de metformine.

## Oméga-3 (EPA, DHA, ALA)

La conversion végétale (ALA → EPA → DHA) est limitée chez l'humain (~5 % pour EPA, <1 % pour DHA). Une source directe (poissons gras, huile d'algue) reste la voie royale.

**Cofacteurs de conversion** : B6, B3, magnésium, zinc, B8.
**Cofacteurs de protection** : vitamine C, vitamine E, sélénium.
**Synergies** : B9 + B12 (baisse de l'homocystéine), vitamine D (santé cognitive et cardiovasculaire).

## Minéraux clés

### Magnésium

Activateur universel : vitamine D, B1, B6, conversion des oméga-3, 300+ réactions enzymatiques.
**Formes recommandées** : citrate, glycinate, malate (200-400 mg/jour).

### Zinc

Métabolisme vitamine A, B6, B9, conversion oméga-3, immunité.
**Sources** : huîtres, viandes, légumineuses, graines de courge.

### Sélénium

Synergie antioxydante avec vitamine E (glutathion peroxydase). Fonction thyroïdienne avec iode.
**Sources** : noix du Brésil (1-2/jour suffisent), poissons, œufs.

### Fer

Absorption améliorée par la vitamine C ; nécessaire à la conversion tryptophane → B3.
**Sources** : viande rouge (héminique, absorption ~25 %), légumineuses, épinards (non-héminique, absorption ~5-15 %, à associer à la C).
À supplémenter **uniquement en cas de carence documentée** (ferritine + CRP).

### Cuivre

Formation du collagène (avec vitamine C), utilisation du fer.
**Sources** : foie, fruits de mer, noix, cacao.

### Iode

Synergie avec sélénium pour les hormones thyroïdiennes.
**Sources** : poissons, algues, sel iodé.

### Bore

Réduit l'excrétion de vitamine D, métabolisme calcium/magnésium.
**Sources** : fruits secs, avocat, noix.

## Tableau récapitulatif

| Vitamine | Apport/jour | Limite max/jour | Signal d'alerte |
|---|---|---|---|
| A (rétinol) | 750-800 µg ER | 3000 µg | Excès en grossesse (tératogène) |
| D | 15 µg (600 UI) | 100 µg (4000 UI) | Hypercalcémie, calcifications |
| E | 12-15 mg α-TE | 300-1000 mg | Saignements à fortes doses |
| K | 70-120 µg | Non établie | Interaction anticoagulants |
| C | 110 mg | 2000 mg | Diarrhée, calculs rénaux |
| B1 | 1,2-1,3 mg | Non établie | — |
| B2 | 1,3-1,6 mg | Non établie | — |
| B3 | 16 mg EN | 10-35 (nicotinique) / 900 (nicotinamide) | Flush, foie, glycémie |
| B5 | 5-6 mg | Non établie | — |
| B6 | 1,3-1,7 mg | 25-100 mg | Neuropathies périphériques |
| B8 | 30-50 µg | Non établie | — |
| B9 | 400 µg EFA | 1000 µg | Peut masquer carence B12 |
| B12 | 2,4-4 µg | Non établie | — |

## Principes d'optimisation

1. **Liposolubles (A, D, E, K)** : toujours avec un repas contenant des lipides.
2. **Vitamine D** : associer **magnésium + K2** (et idéalement bore, calcium, phosphore).
3. **Fer végétal** : toujours avec vitamine C ; éviter thé/café simultanés (tanins).
4. **Oméga-3** : s'assurer d'un apport en B (B6, B3), magnésium, zinc, antioxydants.
5. **Complexe B** : pris ensemble pour la synergie.
6. **Digestion saine** : pH gastrique et flore intestinale conditionnent l'absorption de la B12, du magnésium, du calcium, des vitamines B.

## Ce qui nuit à l'absorption

- **Alcool** → vitamines B, magnésium.
- **IPP et antiacides** → B12, magnésium, calcium.
- **Blanc d'œuf cru** → biotine.
- **Stress chronique** → magnésium, B.
- **Café / thé pendant le repas** → fer.

## Pour aller plus loin

- [Choisir la bonne forme de son complément](/blog/complement-formes-bioactives) détaille pour chaque nutriment les formes à privilégier et celles à éviter.
- [Compléments : précautions et vigilance](/blog/complements-precautions-vigilance) passe en revue les produits qui méritent une attention particulière.
- [Carences nutritionnelles fréquentes en France](/blog/carences-nutritionnelles-frequentes) donne les prévalences réelles et les populations concernées.

---

*Ce guide est informatif. Un bilan sanguin reste le meilleur moyen d'identifier une carence ciblée, et un avis médical est indispensable en cas de traitement en cours ou de pathologie.*
`,
}
