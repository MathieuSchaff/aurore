import type { ArticleInput } from '../seed-articles'

export const fruitsSaisonActifs: ArticleInput = {
  title: 'Fruits de saison : actifs clés, effets et tips pratiques',
  slug: 'fruits-saison-actifs',
  category: 'nutrition',
  excerpt:
    "Un guide des fruits français par famille et par saison, avec leurs composés actifs dominants (anthocyanes, resvératrol, punicalagines, bromélaïne...), leurs effets documentés et des conseils d'utilisation au quotidien. Inclut les baies sauvages souvent oubliées.",
  publishedAt: null,
  content: `Manger "des fruits" n'est pas un geste interchangeable : chaque fruit apporte un profil de **composés actifs** spécifique. Une myrtille et une banane ne remplissent pas la même fonction — l'une apporte des anthocyanes et du ptérostilbène, l'autre du tryptophane et de l'amidon résistant.

Ce guide recense les fruits courants en France par famille, avec pour chacun : **actifs clés**, **effets documentés**, **astuces pratiques** et **saison locale** (quand c'est pertinent pour le goût et le prix).

## Baies rouges et noires

Les baies sont de loin les fruits les plus **denses en polyphénols** et notamment en anthocyanes — ces pigments violets/bleus très étudiés pour leurs effets sur la mémoire et les vaisseaux.

| Fruit | Actifs clés | Effets | Tip pratique | Saison FR |
|---|---|---|---|---|
| **Myrtille sauvage** | Anthocyanes, ptérostilbène | Mémoire, santé vasculaire | Surgelée = OK (anthocyanes stables) | Juin-août |
| **Framboise** | Acide ellagique, cétones | Profil anti-inflammatoire | Bien tolérée après un repas gras | Juin-sept |
| **Fraise** (idéalement bio) | Fisétine, vitamine C | Immunité, antioxydants | Top en smoothie | Mai-juillet |
| **Mûre** | Cyanidine-3-glucoside | Régulation glycémie | Topping yaourt grec | Juil-sept |
| **Cassis** | Vitamine C (~200 mg/100g), GLA | Immunité, peau | En poudre lyophilisée concentrée | Juil-août |
| **Groseille** | Quercétine, pectine | Antihistaminique naturel | En gelée sans sucre | Juil-août |

## Pommes et poires

| Fruit | Actifs clés | Effets | Tip pratique | Saison FR |
|---|---|---|---|---|
| **Pomme** (bio avec peau) | Quercétine, acide ursolique | Anti-inflammatoire, satiété | Préférer Granny à Golden (moins sucrée, plus de polyphénols) | Sept-mars |
| **Poire** | Cuivre, fibres | Prébiotique, digestion | Goûter + noix = combo énergie | Sept-fév |
| **Coing** | Tanins, pectine | Soutien digestion | Cuit vapeur = vitamine C mieux dispo | Oct-déc |

## Fruits à noyau

| Fruit | Actifs clés | Effets | Tip pratique | Saison FR |
|---|---|---|---|---|
| **Cerise griotte** | Mélatonine, anthocyanes | Sommeil, récupération musculaire | Jus Montmorency post-effort | Juin-juil |
| **Abricot** | Bêta-carotène, potassium | Peau, électrolytes | Sec : fer ++ mais sucré | Juin-août |
| **Pêche / nectarine** | Lutéine, acide chlorogénique | Vision, régulation glycémie | En smoothie matinal | Juin-sept |
| **Prune / pruneau** | Bore, sorbitol | Os, transit | Matin à jeun si constipation | Août-oct |

## Agrumes

| Fruit | Actifs clés | Effets | Tip pratique | Saison FR |
|---|---|---|---|---|
| **Citron** | D-limonène, vitamine C, hespéridine | Soutien hépatique | Eau tiède + citron le matin | Toute l'année |
| **Orange** | Hespéridine, vitamine C | Immunité, vaisseaux | Fruit entier > jus (fibres + index glycémique) | Déc-mars |
| **Pamplemousse** | Naringénine, bergamotine | Sensibilité à l'insuline | ⚠️ **interactions CYP3A4** — contre-indiqué avec statines et nombreux médicaments | Janv-avril |
| **Mandarine / clémentine** | Nobilétine, tangérétine | Neuroprotection | Collation hivernale pratique | Nov-fév |

## Fruits exotiques

| Fruit | Actifs clés | Effets | Tip pratique | Saison / Import |
|---|---|---|---|---|
| **Kiwi** | Vitamine C, actinidine, sérotonine | Digestion (actinidine protéolytique), sommeil | Le soir : boost sérotonine | Nov-mai |
| **Figue** | Ficine, calcium, fibres | Cœur, microbiote | Sèche = fer ++ | Août-oct |
| **Grenade** | Punicalagines, urolithine A (via microbiote) | Mitochondries, endurance | ~30 mL de jus / jour suffisent | Oct-fév |
| **Ananas** | Bromélaïne, manganèse, vitamine C | Digestion des protéines | Frais uniquement (bromélaïne détruite en conserve) | Import |
| **Mangue** | Bêta-carotène, mangiférine | Immunité | À pleine maturité (bêta-carotène + biodisponible) | Import |
| **Papaye** | Papaïne, lycopène | Digestion, caroténoïdes | En fin de repas | Import |

## Fruits polyvalents

| Fruit | Actifs clés | Effets | Tip pratique | Saison |
|---|---|---|---|---|
| **Banane** | Tryptophane, amidon résistant (si verte) | Sérotonine, microbiote | Verte le matin, mûre post-sport | Toute l'année |
| **Raisin** (surtout noir) | Resvératrol, OPC, mélatonine | Antioxydants, vaisseaux | Bien mâcher les **pépins** — c'est là que sont les OPC | Sept-oct |
| **Avocat** | Acides gras monoinsaturés, lutéine, glutathion | Cerveau, cœur, peau | ½ à 1 / jour = raisonnable | Import |
| **Tomate** (botaniquement un fruit) | Lycopène, vitamine C | Cœur, peau | **Cuite avec un corps gras** = lycopène × 3-4 | Juin-sept FR |
| **Pastèque** | Citrulline, lycopène | Performance sportive, hydratation | Rafraîchissante après effort | Juin-août |

## Baies sauvages et fruits oubliés

Ceux-là passent souvent sous le radar alors que leur densité en actifs est parmi les plus élevées. Disponibles en cueillette, en bocal ou en poudre lyophilisée.

| Fruit | Actifs clés | Effets | Tip pratique | Saison |
|---|---|---|---|---|
| **Myrtille sauvage** | Anthocyanes (~10× myrtille cultivée) | Mémoire, vision | Congelée disponible en magasin bio | Été montagne |
| **Sureau noir** (cuit) | Anthocyanes, composés antiviraux | Soutien immunitaire hiver | **Toujours cuit** (toxique cru) — sirop, décoction | Août-sept |
| **Argousier** | Vitamine C (~695 mg/100g), oméga-7 | Peau, muqueuses | En purée ou huile | Oct-mars |
| **Prunelle** (fruit du prunellier) | Tanins, ORAC élevé | Hormèse, antioxydants | Cueillir **après les premières gelées** pour réduire l'astringence | Hiver |
| **Cynorrhodon** (fruit de l'églantier) | Vitamine C (~1250 mg/100g), lycopène | Articulations, peau | En infusion ou poudre (supporte mal la cuisson prolongée) | Automne-hiver |

## Règles pratiques

### Congélation = amie des anthocyanes
Les baies congelées conservent très bien leurs anthocyanes (certaines études montrent même une **meilleure extractibilité** après congélation — les cristaux de glace brisent les parois cellulaires). Acheter surgelé en gros format est économiquement pertinent.

### Caroténoïdes = avec corps gras
Tomate, carotte, mangue, papaye, abricot : leur bêta-carotène / lycopène est **liposoluble**. Les consommer avec huile d'olive, avocat, œuf ou noix multiplie leur biodisponibilité.

### Jus ≠ fruit entier
Un jus perd **fibres + effet matrice + vitesse d'absorption ralentie**. Pour la plupart des fruits, manger le fruit entier est meilleur. Exceptions justifiées : grenade (faible dose, très concentré en actifs), betterave (nitrates), tomate cuite (lycopène biodisponible).

### Peau = polyphénols
Pomme, raisin, prune, pêche : la majorité des polyphénols sont dans la **peau**. Donc **bio** quand on mange la peau, sinon éplucher et perdre une part des actifs.

### Saisonnalité
Un fruit de saison locale est :
- plus mûr → plus riche en actifs formés en fin de maturation
- moins cher
- moins carboné (pas de transport longue distance)

Pour les fruits hors saison, les versions surgelées / lyophilisées sont souvent meilleures que les versions fraîches importées pas mûres.

## Les "multi-molécules" à privilégier

Les fruits les plus intéressants sont ceux qui combinent plusieurs familles d'actifs :

- **Myrtille** : anthocyanes + catéchines + resvératrol.
- **Grenade** : punicalagines + anthocyanes + urolithine A.
- **Raisin noir** : resvératrol + anthocyanes + OPC (pépins).
- **Framboise** : anthocyanes + acide ellagique + fibres.
- **Avocat** : graisses mono-insaturées + lutéine + glutathion.
- **Tomate cuite** : lycopène + vitamine C + polyphénols.

## Pour aller plus loin

- [Guide des nutriments fonctionnels](/blog/guide-nutriments-fonctionnels) — cibles journalières pour polyphénols, caroténoïdes, etc.
- [Aliments pour la peau](/blog/aliments-pour-peau-guide) — focus peau (recoupements vitamine C, caroténoïdes, polyphénols).
- [Boissons : tier list santé](/blog/boissons-benchmark) — classement des jus et autres boissons courantes.

---

*Ce guide est un panorama nutritionnel, pas une prescription. En cas de pathologie (diabète, allergies, interactions médicamenteuses comme le pamplemousse), un avis médical reste nécessaire.*
`,
}
