import type { ArticleInput } from '../seed-articles'

export const complementsPrecautionsVigilance: ArticleInput = {
  title: 'Compléments alimentaires : précautions et vigilance',
  slug: 'complements-precautions-vigilance',
  category: 'supplements',
  excerpt:
    'Naturel ne veut pas dire sans risque. Les compléments qui méritent une vigilance particulière : hépatotoxicité documentée, interactions médicamenteuses, mégadosages problématiques. Millepertuis, kava, extraits concentrés, B6 et B3 à fortes doses, timing post-exercice.',
  publishedAt: null,
  content: `Beaucoup de compléments sont utiles ou neutres à dose physiologique. Certains, en revanche, cumulent des signalements cliniques récurrents — hépatotoxicité, interactions médicamenteuses, effets neurologiques à long terme — qui justifient une vigilance particulière.

Ce guide fait le tri. Il ne dit pas "jamais" mais "à connaître avant" : certains produits sont réservés à un contexte précis, d'autres demandent un suivi, d'autres encore n'apportent rien à la plupart des gens.

> ⚠️ Rappel : **"naturel" ≠ "sans danger"**. Un extrait concentré n'a pas le même profil qu'un aliment entier.

## Produits à éviter ou fortement encadrer

### Millepertuis (*St. John's Wort*)

Plante utilisée pour l'humeur, mais **inducteur puissant du cytochrome CYP3A4**, qui métabolise un grand nombre de médicaments. Les interactions documentées concernent :

- pilules contraceptives (perte d'efficacité) ;
- anticoagulants ;
- antirétroviraux (VIH) ;
- immunosuppresseurs (risque de rejet de greffe) ;
- antidépresseurs (risque de syndrome sérotoninergique).

En France, la vente en libre-service est **encadrée** pour cette raison. Usage uniquement avec supervision médicale et en l'absence de traitement concomitant.

### Kava

Plante calmante traditionnelle, mais associée à des cas d'**atteinte hépatique sévère**, parfois fulminante. Les préparations aqueuses traditionnelles auraient un profil plus sûr que les extraits alcooliques concentrés, mais la majorité des produits du marché sont des extraits.

Interactions aggravées avec alcool et médicaments hépatotoxiques. À éviter en cas d'atteinte hépatique préexistante ou de traitement en cours.

### Extrait concentré de thé vert

Distinguer clairement :
- **Thé vert en boisson** : consommation traditionnelle, profil de sécurité rassurant.
- **Extraits concentrés en gélule** (EGCG à haute dose) : signalements récurrents d'**hépatite aiguë**, surtout à jeun et après plusieurs semaines d'usage.

Si l'objectif est les catéchines, la voie "infusion" reste la plus raisonnable.

### Levure de riz rouge

Contient de la **monacoline K**, qui est chimiquement identique à la **lovastatine** (statine de prescription). Elle en partage donc les effets secondaires potentiels (musculaires, hépatiques, rénaux) — mais sans standardisation, avec une teneur très variable entre lots, et sans encadrement médical.

Si un traitement du cholestérol est indiqué, une statine sur ordonnance est mieux dosée, mieux suivie, et souvent moins chère.

### Spiruline

Produit un **analogue inactif de la vitamine B12** : les dosages sanguins peuvent afficher des valeurs "normales" qui ne reflètent pas un apport fonctionnel. Peut donc **masquer une carence réelle en B12** chez les personnes à risque (régime végétalien notamment).

Pour la B12 réelle, s'orienter vers les formes méthyl- / adénosyl- / hydroxocobalamine.

### Suppléments multi-ingrédients "brûle-graisse" / perte de poids

Mélanges complexes, souvent à base de caféine + extraits végétaux concentrés, régulièrement pointés dans les séries de cas d'atteinte hépatique d'origine médicamenteuse. L'impossibilité d'identifier l'ingrédient en cause fait partie du problème.

## Mégadosages à surveiller

### Vitamine B6 au-delà de 50 mg/jour

- Apport recommandé : 1,3-1,7 mg/jour. Limite haute : 25-100 mg selon sources.
- **Neuropathie périphérique** (picotements, engourdissements, douleurs) documentée à hautes doses sur plusieurs mois.
- Le risque est variable selon les individus — certaines personnes développent des symptômes bien en-dessous de la limite officielle.
- À surveiller : la B6 est souvent cachée dans les complexes magnésium et les multivitamines.

### Vitamine B3 / niacine à hautes doses

- Apport recommandé : ~16 mg EN/jour.
- **Acide nicotinique** : flush dès 30-50 mg, effets hépatiques à hautes doses prolongées, signaux sur la glycémie.
- **Nicotinamide et NR** : mieux tolérés, mais la littérature récente recommande de ne pas dépasser les limites EFSA (900 mg/jour) sans indication.
- NMN, NR, nicotinamide : tous convertis en niacine dans l'organisme — même vigilance.

### Acide folique synthétique à haute dose

- Limite recommandée : 1000 µg/jour.
- Au-delà, **peut masquer une carence en B12** chez les personnes âgées, et modifier l'immunité (réduction documentée de l'activité NK à très fortes doses).
- Préférer le **5-MTHF (méthylfolate)**, qui ne s'accumule pas sous forme non métabolisée.

## Produits à risque hépatique — usage prudent

Plusieurs extraits végétaux sont régulièrement retrouvés dans les listes de cas d'atteinte hépatique d'origine complément :

- **Curcuma / curcumine** à haute dose, particulièrement formulée avec poivre noir (la pipérine multiplie l'absorption ×20).
- **Ashwagandha** à dosage élevé sur des périodes prolongées.
- **Black cohosh** (actée à grappes) : élévation d'enzymes hépatiques rapportée — à éviter si antécédent hépatique.
- **Garcinia cambogia**.

L'usage occasionnel et à dose raisonnable reste le plus souvent sans incident. Les cas graves concernent plutôt des extraits très concentrés, des combinaisons multiples, ou des durées prolongées sans suivi.

## À utiliser uniquement en cas de besoin documenté

### Fer

L'excès de fer est **pro-oxydant** et peut aggraver un stress oxydatif chronique. La supplémentation se fait sur preuve (ferritine + CRP pour éliminer l'inflammation), pas "au cas où".

### Calcium isolé

Les sources alimentaires restent prioritaires. La supplémentation isolée de calcium (en particulier sans K2 ni magnésium) a montré des signaux cardiovasculaires défavorables dans plusieurs études — les sources alimentaires et un bon statut en D3 + K2 + magnésium couvrent la grande majorité des besoins.

### Metformine hors diabète

Utilisée hors indication pour la longévité, elle reste un médicament, pas un complément. Les effets à long terme chez un sujet sain ne sont pas établis ; la balance bénéfice/risque ne se pose pas comme pour un patient diabétique.

### Resvératrol

Battage médiatique important, mais les bénéfices chez l'humain restent modestes — les doses efficaces chez l'animal sont très difficiles à reproduire par voie orale. Plutôt privilégier des sources alimentaires de polyphénols variés.

## Timing à connaître : post-exercice

### Antioxydants directs (A, C, E) juste après l'effort

Pris dans les 1-2 heures après un entraînement de résistance ou d'endurance, les antioxydants à fortes doses **émoussent l'adaptation bénéfique** (biogenèse mitochondriale, sensibilité à l'insuline). Ce n'est pas un danger, mais un gâchis d'adaptation.

### Anti-inflammatoires après l'effort

Même logique pour les AINS et certains anti-inflammatoires naturels à hautes doses : ils **bloquent des signaux nécessaires à la récupération et à l'hypertrophie**. À garder pour les cas où la douleur justifie un arrêt de l'entraînement, pas comme routine.

Le réflexe inverse — antioxydants en dehors des fenêtres péri-exercice, apports anti-inflammatoires via l'alimentation — préserve les adaptations.

## Risques transverses de l'industrie

- **Étiquetage approximatif** et adultération régulièrement signalés, particulièrement dans les segments perte de poids et performance sportive.
- **Contamination** : métaux lourds (plomb, arsenic), médicaments synthétiques non déclarés, mycotoxines.
- **Mégadosage** : dépassement des apports recommandés sans indication clinique — particulièrement risqué pour les liposolubles (A, D, E, K), qui s'accumulent.

## Qui doit être particulièrement prudent

- Atteinte hépatique ou rénale préexistante.
- Grossesse ou allaitement.
- Traitement médicamenteux au long cours (anticoagulants, antidépresseurs, immunosuppresseurs, antirétroviraux, traitement thyroïdien).
- Personnes qui cumulent plusieurs compléments en parallèle.

→ Dans ces contextes, **toute supplémentation se décide avec le médecin ou le pharmacien**.

## Repères pour choisir

1. **Alimentation d'abord** : les nutriments entiers sont la première source logique.
2. **Un complément à la fois** quand possible — les causalités sont plus faciles à identifier.
3. **Marques avec contrôle tiers** (USP, NSF, Informed Choice).
4. **Informer son médecin** de ce qu'on prend, surtout en cas de traitement.
5. **Écouter les signaux** : troubles digestifs, changement d'humeur, fatigue inhabituelle → arrêter et consulter.
6. **Se méfier des promesses spectaculaires** et des formules à 20 ingrédients.

## Pour aller plus loin

- [Vitamines et minéraux : dosages, synergies et cofacteurs](/blog/vitamines-mineraux-dosages-synergies-cofacteurs) — les repères de base sur les apports.
- [Bien choisir la forme de son complément](/blog/complement-formes-bioactives) — quelle forme prendre quand on décide de supplémenter.

---

*Ce guide est informatif. Il ne remplace pas un avis médical, en particulier en cas de traitement en cours, de pathologie chronique, de grossesse ou d'allaitement.*
`,
}
