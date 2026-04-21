import type { ArticleInput } from '../seed-articles'

export const formesBioactivesVitamines: ArticleInput = {
  title: 'Bien choisir la forme de son complément : formes bioactives à privilégier',
  slug: 'complement-formes-bioactives',
  category: 'supplements',
  excerpt:
    "Toutes les formes d'un même nutriment ne se valent pas. Biodisponibilité, conversions enzymatiques, variants génétiques : ce qui distingue une forme active d'une forme bon marché. B9, B12, B6, vitamine E, K2, D, magnésium, zinc, fer, calcium.",
  publishedAt: null,
  content: `À nutriment égal, la forme chimique conditionne l'absorption, le métabolisme et parfois la tolérance. Un supplément qui ne déplace pas l'aiguille, c'est souvent la forme — pas la dose — qui est en cause.

Ce guide passe en revue les dix cas où la différence entre une forme "économique" et une forme bioactive change concrètement les résultats.

## 1. Vitamine B9 (folate)

**À éviter** : acide folique synthétique.
- Doit être converti par l'enzyme **MTHFR**, dont 40 à 60 % de la population portent un variant moins efficace.
- Peut s'accumuler sous forme non métabolisée (UMFA) et bloquer les récepteurs des folates naturels.

**À privilégier** :
- **5-MTHF (méthylfolate / L-méthylfolate)** : forme active directement utilisable. Marques de référence : *Quatrefolic®*, *Metafolin®*.
- Folate naturel via l'alimentation (légumes verts à feuilles, légumineuses, foie).

## 2. Vitamine B12 (cobalamine)

**À éviter** : cyanocobalamine.
- Forme synthétique bon marché, contient une trace de cyanure (libérée à l'activation). Nécessite une conversion hépatique.

**À privilégier** :
- **Méthylcobalamine** : forme active, biodisponible, utilisée au niveau cytoplasmique.
- **Adénosylcobalamine** : forme mitochondriale, complémentaire de la méthyl.
- **Hydroxocobalamine** : très stable, bonne alternative (forme utilisée en injectable).
- **Combinaison méthyl + adénosyl** : couvre les deux compartiments cellulaires.

## 3. Vitamine B6

**À éviter** : pyridoxine HCl en hautes doses prolongées (>100-200 mg/jour) — risque de **neuropathies périphériques**.

**À privilégier** :
- **P5P (pyridoxal-5-phosphate)** : forme active directement utilisable.
- Pyridoxine à doses modérées (<50 mg/jour) reste acceptable pour la plupart.

## 4. Vitamine E

**À éviter** : dl-alpha-tocophérol synthétique. Absorption ~50 % inférieure à la forme naturelle ; mélange de 8 isomères dont un seul est actif.

**À privilégier** :
- **d-alpha-tocophérol** (sans le "l") : forme naturelle.
- **Tocophérols mixtes** (alpha + bêta + gamma + delta) : spectre antioxydant plus complet.
- **Tocotriénols** : complémentaires des tocophérols, activité sur profil lipidique.

## 5. Vitamine K2

K1 et K2 ne sont pas interchangeables : la K1 sert surtout à la coagulation, la K2 à la santé osseuse et cardiovasculaire. La conversion K1 → K2 est limitée chez l'humain.

**Dans la famille K2, attention à la sous-forme** :

| Forme | Demi-vie | Prise | Dose typique |
|---|---|---|---|
| MK-4 | 1-2 h | 3×/jour | 45 mg |
| **MK-7** | **72 h** | **1×/jour** | **100-200 µg** |

**À privilégier** : **MK-7** (ménaquinone-7), issue du natto. Durée d'action longue, doses physiologiques, une seule prise.

## 6. Vitamine D

**À éviter** : D2 (ergocalciférol) — forme végétale, moins efficace pour augmenter les taux sanguins, demi-vie plus courte.

**À privilégier** : **D3 (cholécalciférol)** — forme animale ou végane (lichen).
- Toujours associer **K2 + magnésium** pour activer la D et bien orienter le calcium.
- Prise au cours d'un repas gras.

## 7. Vitamine A

**À surveiller** : le rétinol préformé, toxique au-delà de 3000 µg/jour sur le long terme. À éviter à hautes doses pendant la grossesse.

**À privilégier** :
- **Bêta-carotène** (provitamine A) : le corps convertit selon ses besoins, pas de toxicité à redouter hormis une coloration cutanée temporaire.
- **Mélange rétinol + bêta-carotène** : équilibre raisonnable.
- Alimentation en premier lieu (foie, carottes, patates douces, épinards).

## 8. Magnésium

**À éviter** :
- **Oxyde de magnésium** : absorption ~4 %, effet surtout laxatif.
- **Sulfate de magnésium** (sel d'Epsom) par voie orale : diarrhée.

**À privilégier — choix selon l'objectif** :

| Forme | Point fort |
|---|---|
| **Bisglycinate** | Haute absorption, doux pour l'estomac, effet relaxant |
| **Citrate** | Bonne absorption, léger effet laxatif (utile si constipation) |
| **Malate** | Énergie, cycle de Krebs |
| **Taurate** | Santé cardiovasculaire |
| **Thréonate** | Traverse la barrière hémato-encéphalique (cible cérébrale) |

## 9. Zinc

**À éviter** : oxyde de zinc — absorption <10 %.

**À privilégier** :
- **Picolinate de zinc** : biodisponibilité élevée.
- **Bisglycinate** : bien toléré digestivement.
- **Citrate** : bon compromis absorption / prix.

## 10. Fer

**À surveiller** : sulfate ferreux — effets secondaires digestifs fréquents (constipation, nausées) qui compromettent l'observance.

**À privilégier** :
- **Bisglycinate ferreux** : absorption élevée, très bien toléré.
- **Fumarate ferreux** : bon compromis.
- **Fer héminique** via l'alimentation (viande) : absorption optimale sans effets secondaires.

> ⚠️ Le fer ne se supplémente qu'en cas de carence documentée (ferritine + CRP). L'excès est pro-oxydant.

## 11. Calcium

**À éviter** : carbonate de calcium seul — nécessite une acidité gastrique élevée ; absorption limitée chez les plus de 50 ans ou sous IPP.

**À privilégier** :
- **Citrate de calcium** : absorbé avec ou sans nourriture.
- **Hydroxyapatite** : forme osseuse naturelle.
- Toujours avec **D3 + K2**.

En règle générale, les sources alimentaires (produits laitiers, sardines avec arêtes, légumes verts à feuilles, amandes, tofu pris au sulfate de calcium) restent prioritaires — la supplémentation isolée de calcium est associée à des signaux cardiovasculaires défavorables dans plusieurs études.

## Résumé

| Nutriment | ❌ À éviter | ✅ À privilégier |
|---|---|---|
| B9 | Acide folique | 5-MTHF (méthylfolate) |
| B12 | Cyanocobalamine | Méthyl- ou adénosylcobalamine |
| B6 | Pyridoxine haute dose | P5P |
| Vitamine E | dl-alpha synthétique | d-alpha + tocophérols mixtes |
| Vitamine K2 | K1 seule, MK-4 | MK-7 |
| Vitamine D | D2 | D3 (+ K2 + Mg) |
| Vitamine A | Rétinol haute dose | Bêta-carotène (ou mix) |
| Magnésium | Oxyde | Bisglycinate, citrate, malate |
| Zinc | Oxyde | Picolinate, bisglycinate |
| Fer | Sulfate (si mal toléré) | Bisglycinate |
| Calcium | Carbonate seul | Citrate (+ D3 + K2) |

## Critères pour bien choisir un complément

- **Forme bioactive** (méthylée, chélatée) quand elle existe.
- **Sans excipients douteux** : dioxyde de titane, colorants artificiels, stéarate de magnésium en quantité.
- **Certification tierce partie** : USP, NSF, Informed Choice, Clean Label Project.
- **Dosages physiologiques**, pas des méga-doses arbitraires.
- **Forme cohérente avec l'objectif** : magnésium thréonate pour la cognition, bisglycinate pour le sommeil, citrate pour la constipation.

## Pour aller plus loin

- [Vitamines et minéraux : dosages, synergies et cofacteurs](/blog/vitamines-mineraux-dosages-synergies-cofacteurs) — apports recommandés et logique des associations.
- [Compléments : précautions et vigilance](/blog/complements-precautions-vigilance) — ce qui mérite de l'attention au moment de supplémenter.

---

*Ce guide est informatif. Avant toute supplémentation prolongée, un avis médical ou nutritionnel reste préférable, en particulier en cas de traitement en cours ou de pathologie chronique.*
`,
}
