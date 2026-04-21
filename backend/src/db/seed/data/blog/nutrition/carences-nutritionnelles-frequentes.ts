import type { ArticleInput } from '../seed-articles'

export const carencesNutritionnellesFrequentes: ArticleInput = {
  title: "Carences nutritionnelles fréquentes en France",
  slug: 'carences-nutritionnelles-frequentes',
  category: 'nutrition',
  excerpt:
    "Les 15 carences les plus courantes en France : prévalence, rôles, sources alimentaires, populations à risque. Magnésium, vitamine D, oméga-3, iode, fer, zinc, sélénium, calcium, B9, B12, K2, choline, fibres, caroténoïdes, oligo-éléments.",
  publishedAt: null,
  content: `Les apports nutritionnels en France restent marqués par des **carences récurrentes**, souvent sous-évaluées parce qu'elles ne produisent pas de symptôme aigu. La majorité se jouent sur des mécanismes lents : fatigue, immunité faible, qualité du sommeil, métabolisme osseux.

Ce guide liste les 15 plus fréquentes, leurs rôles, leurs sources concrètes et les populations particulièrement à risque. Les chiffres de prévalence sont des ordres de grandeur issus des études françaises (SU.VI.MAX, ENNS, Esteban).

> ⚠️ **Attention** : prévalence élevée ne signifie pas que *vous* êtes carencé. Un dosage sanguin reste le seul moyen de le confirmer, notamment pour fer, B12, D, zinc, sélénium.

## 1. Magnésium

- **Prévalence** : ~75 % de la population française sous les apports recommandés.
- **Rôle** : transmission neuromusculaire, sommeil, régulation du stress, métabolisme énergétique (cofacteur de 300+ enzymes).
- **Sources** : noix, graines (courge, tournesol, sésame), légumes verts à feuilles, chocolat noir 70 %+, céréales complètes, légumineuses.
- **À risque** : stress chronique, sportifs, consommation élevée d'alcool.

## 2. Vitamine D

- **Prévalence** : 80-90 % en dessous des seuils optimaux en hiver en France métropolitaine.
- **Rôle** : immunité, humeur, métabolisme osseux (absorption calcium), fonction musculaire.
- **Sources** : exposition solaire (avril-septembre), foie de morue, poissons gras. Supplémentation **D3 huileuse** souvent nécessaire entre octobre et avril.
- **À risque** : peaux foncées, personnes peu exposées au soleil, personnes âgées.

## 3. Oméga-3 (EPA / DHA)

- **Prévalence** : ~70 % en dessous des recommandations.
- **Rôle** : structure des membranes neuronales (DHA), régulation de l'inflammation, santé cardiovasculaire.
- **Sources** : poissons gras 2-3×/semaine (sardines, maquereau, saumon, hareng), huile de poisson, algues (DHA vegan).
- **À noter** : oméga-3 végétaux (ALA des graines de lin, chia, noix) ne se convertissent que partiellement en EPA/DHA (< 10 %).

## 4. Iode

- **Prévalence** : ~40 %.
- **Rôle** : synthèse des hormones thyroïdiennes (T3/T4), métabolisme, cognition, développement fœtal.
- **Sources** : poissons marins, fruits de mer, algues (nori, dulse, wakamé), sel iodé.
- **À risque** : femmes enceintes ou allaitantes, végétariens/végétaliens stricts, personnes évitant le sel iodé.

## 5. Fer

- **Prévalence** : 15-20 % en population générale, **25-30 % chez les femmes** en âge de procréer.
- **Rôle** : transport de l'oxygène (hémoglobine), énergie, cognition.
- **Symptômes** : fatigue, essoufflement à l'effort, pâleur, ongles cassants, baisse de concentration, chute de cheveux.
- **Sources** : viandes rouges, abats, lentilles, pois chiches, épinards, céréales enrichies. Associer à la **vitamine C** pour l'absorption du fer non-héminique.
- **À risque** : femmes réglées, femmes enceintes, végétariens/végétaliens, sportifs d'endurance.

## 6. Zinc

- **Prévalence** : 30-40 %.
- **Rôle** : immunité, cicatrisation, peau, spermatogenèse, testostérone, cognition, sens du goût.
- **Sources** : huîtres (très concentrées), viande, œufs, graines de courge, noix de cajou, légumineuses.
- **À risque** : végétariens/végétaliens, personnes âgées, stress chronique, consommation élevée d'alcool.

## 7. Sélénium

- **Prévalence** : 25-30 %.
- **Rôle** : antioxydant (glutathion peroxydase), soutien de la thyroïde (conversion T4→T3), immunité.
- **Problème structurel** : les **sols européens sont naturellement pauvres** en sélénium, contrairement aux sols nord-américains.
- **Sources** : noix du Brésil (1-2 par jour suffisent — **ne pas dépasser**, risque de toxicité chronique > 400 µg/j), poissons, œufs, céréales.

## 8. Calcium

- **Rôle** : santé osseuse, contraction musculaire, coagulation.
- **Impact d'une carence prolongée** : ostéopénie, ostéoporose, fragilité osseuse.
- **Sources** : produits laitiers (lait, yaourts, fromages), amandes, légumes verts (brocoli, kale), sardines en conserve (arêtes), eaux minérales calciques.
- **À risque** : adolescents en croissance, seniors, personnes évitant les produits laitiers sans substitut enrichi.

## 9. Vitamine B9 (folates)

- **Prévalence** : 20-25 %.
- **Rôle** : synthèse de l'ADN, méthylation, système nerveux (particulièrement critique chez la femme enceinte — prévention des anomalies de fermeture du tube neural).
- **Sources** : légumes verts à feuilles frais, légumineuses, foie, œufs.
- **À noter** : les folates sont sensibles à la chaleur et à l'oxydation — les légumes trop cuits en perdent une grande partie.

## 10. Vitamine B12

- **Rôle** : synthèse de l'ADN, méthylation, myéline (système nerveux), formation des globules rouges.
- **Sources** : exclusivement **produits animaux** (viande, poisson, œufs, produits laitiers).
- **À risque** : végétaliens (carence quasi systématique sans supplémentation), personnes âgées (baisse d'absorption gastrique), sujets sous IPP ou metformine au long cours.
- **Supplémentation** : forme **méthylcobalamine** ou **hydroxycobalamine** recommandée, plutôt que cyanocobalamine pour certains profils.

## 11. Vitamine K2

- **Rôle** : orientation du calcium (os plutôt qu'artères), santé osseuse, santé cardiovasculaire.
- **À noter** : la **vitamine K1** (légumes verts) est peu convertie en K2 active chez l'humain.
- **Sources** : natto (soja fermenté, de très loin la plus riche), fromages affinés (surtout pâtes dures), jaunes d'œufs, foie, beurre de vaches à l'herbe.

## 12. Choline

- **Prévalence** : > 50 % en dessous de l'apport adéquat.
- **Rôle** : méthylation, santé hépatique, précurseur de l'acétylcholine (mémoire, attention), structure des membranes cellulaires.
- **Sources** : œufs (jaune surtout, ~150 mg/œuf), foie, soja, quinoa, poisson.
- **Référence** : 400-550 mg/j — 3 à 4 œufs par jour couvrent une grande partie du besoin.

## 13. Fibres alimentaires

- **Prévalence** : ~80 % en dessous des 25-30 g/j recommandés (apport moyen français : ~17 g/j).
- **Rôle** : microbiote, satiété, digestion, régulation de la glycémie, santé cardiovasculaire.
- **Impact** : dysbiose intestinale, inflammation de bas grade, association épidémiologique avec maladies cardiovasculaires et diabète de type 2.
- **Sources** : céréales complètes, légumes, fruits (avec peau), légumineuses, graines de lin / chia.

## 14. Caroténoïdes

Souvent sous-consommés, les caroténoïdes se répartissent en trois familles principales :

### Lycopène (pigment rouge)
- **Sources** : tomates et dérivés (concentré, sauce — mieux absorbé après cuisson), pastèque, pamplemousse rose, papaye, goyave.

### Lutéine et zéaxanthine (pigments jaune-orange)
- **Sources** : épinards, kale, brocoli, laitue, chou vert, maïs, courgettes, poivrons jaunes et oranges, œufs (jaune).
- **Rôle particulier** : protection rétinienne (prévention de la DMLA à long terme).

### Bêta-carotène (précurseur vitamine A)
- **Sources** : carottes, patates douces, courges, potirons, abricots, mangue, melon.

> **Astuce absorption** : les caroténoïdes sont **liposolubles** — les consommer avec un corps gras (huile d'olive, avocat, noix, jaune d'œuf) multiplie leur biodisponibilité.

## 15. Oligo-éléments (cuivre, manganèse, chrome)

- **Rôle** : cofacteurs d'enzymes antioxydantes, métabolisme énergétique, métabolisme du glucose.
- **Problème fréquent** : **déséquilibre avec le zinc** en cas de supplémentation non encadrée (excès de zinc chronique → déficit en cuivre).
- **Sources** : fruits de mer, abats, noix, céréales complètes, cacao (cuivre, manganèse).

## Matrice récapitulative

| Nutriment | Prévalence carence | À risque prioritaire | Source simple |
|---|---|---|---|
| Magnésium | ~75 % | Stress, sport | Graines de courge, chocolat noir |
| Vitamine D | 80-90 % (hiver) | Tous l'hiver | Supplément D3 |
| Oméga-3 | ~70 % | Peu de poisson | Sardines, maquereau 2×/sem |
| Iode | ~40 % | Enceintes, véganes | Poissons de mer, algues |
| Fer | 25-30 % ♀ | Femmes réglées, véganes | Lentilles + vitamine C |
| Zinc | 30-40 % | Véganes, seniors | Graines de courge, huîtres |
| Sélénium | 25-30 % | Toute la population | 1 noix du Brésil / jour |
| Calcium | — | Ados, seniors | Yaourt nature, amandes |
| B9 | 20-25 % | Enceintes | Légumes verts frais |
| B12 | — | Véganes, seniors | Supplément si vegan |
| K2 | — | Peu de fermentés | Natto, fromages affinés |
| Choline | > 50 % | Peu d'œufs | 3-4 œufs / jour |
| Fibres | ~80 % | Régime "blanc" | Légumineuses, complets |
| Caroténoïdes | — | Peu de légumes colorés | Carotte + huile d'olive |
| Cuivre / Mn / Cr | — | Sup zinc non encadrée | Fruits de mer, cacao |

## Priorités pratiques

Sur les 15, quatre ressortent comme **leviers à fort impact** pour la majorité des adultes français :

1. **Vitamine D** — supplémentation D3 d'octobre à avril (1000-2000 UI/j courant, à ajuster sur dosage).
2. **Oméga-3** — 2-3 portions de poisson gras par semaine ou supplément EPA/DHA qualité.
3. **Magnésium** — 30-60 g de graines de courge + chocolat noir 70 %+ au quotidien.
4. **Fibres** — atteindre 25-30 g/j en variant légumineuses, complets et légumes.

## Pour aller plus loin

- [Guide des nutriments fonctionnels](/blog/guide-nutriments-fonctionnels) — cibles journalières pour les composés bioactifs (sulforaphane, polyphénols, etc.).
- [Alimentation et cerveau](/blog/alimentation-cerveau-guide) — focus sur les nutriments impliqués dans la santé cérébrale.
- [Aliments pour la peau](/blog/aliments-pour-peau-guide) — angle cutané, recoupements nombreux (zinc, caroténoïdes, oméga-3).

---

*Ces données sont des ordres de grandeur issus d'études de population. Un dosage biologique et un avis médical restent nécessaires pour toute suspicion de carence individuelle, en particulier avant supplémentation à dose élevée.*
`,
}
