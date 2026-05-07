import type { ArticleInput } from '../article-data'

export const ROSACEE_07_LIRE_INCI: ArticleInput = {
  title: '07 — Comment lire une liste INCI intelligemment',
  slug: 'rosacee-07-lire-une-liste-inci',
  category: 'skincare',
  publishedAt: new Date().toISOString(),
  content: `
# 07 — Comment lire une liste INCI intelligemment

## Introduction
Une liste INCI (International Nomenclature of Cosmetic Ingredients) peut sembler compliquée au premier regard.

Pourtant, avec quelques règles simples, on peut rapidement comprendre :

- si une formule semble cohérente avec les besoins d'une peau rosacéique
- si elle est potentiellement irritante
- si le marketing correspond à la réalité
- quels actifs sont présents à dose utile et lesquels ne sont là que pour l'étiquette

Le but n'est pas de devenir chimiste.
Le but est de prendre de meilleures décisions et d'éviter les mauvaises surprises.

**Où trouver la liste INCI ?**
- sur l'emballage du produit (obligation légale en Europe)
- sur le site du fabricant
- sur les outils en ligne : **INCIDecoder**, **CosDNA**, **SkinSort**, **INCI Beauty** (francophone)

---

# 1. La règle la plus importante : l'ordre compte

En Europe, au Canada et dans la plupart des pays réglementés, les ingrédients sont listés par **ordre décroissant de concentration** jusqu'au seuil de 1 %.

Cela signifie que le début de la liste = la base réelle du produit.

**Exemple de début de liste favorable pour une peau rosacéique :**
\`\`\`
Aqua, Glycerin, Squalane, Cetearyl Alcohol, Niacinamide, Ceramide NP...
\`\`\`
Cela indique : base aqueuse, humectant principal (glycérine), émollient doux (squalane), émulsifiant bien toléré (alcool cétéarylique), actif barrière (niacinamide), céramide de réparation.

**Exemple de début de liste problématique :**
\`\`\`
Alcohol Denat., Aqua, Fragrance, Menthol, Citrus Limon Peel Oil...
\`\`\`
L'alcool dénaturé comme premier ingrédient indique qu'il constitue probablement 40–70 % de la formule — un rouge vif pour la peau rosacéique.

---

## Le seuil de 1 % : exception importante

En dessous d'environ 1 %, l'ordre peut devenir flexible selon les réglementations. Les fabricants peuvent lister les ingrédients en dessous de ce seuil dans n'importe quel ordre.

En pratique :
- les ingrédients dans le premier tiers de la liste sont généralement présents en concentration significative
- à partir de la seconde moitié, les concentrations peuvent descendre rapidement
- parfums, colorants et conservateurs apparaissent souvent à la fin — leur faible concentration ne les rend pas inoffensifs pour autant

---

## La manipulation marketing par le positionnement

Un problème courant : certains fabricants listent des actifs "star" très en fin de liste, uniquement pour pouvoir les mentionner sur l'emballage.

**Signes d'un actif purement marketing :**
- l'ingrédient revendiqué apparaît en 18ème, 22ème position
- plusieurs actifs "vedettes" sont tous groupés en bas de liste
- la concentration réelle est probablement inférieure à 0,1 % — insuffisante pour être efficace

**Contre-exemple d'un actif bien positionné :**
\`\`\`
Aqua, Glycerin, Niacinamide, Cetearyl Alcohol...
\`\`\`
Ici, la niacinamide est en 3ème position = probablement entre 3 et 10 % = dose efficace.

---

# 2. Les 10 premiers ingrédients racontent l'histoire

C'est souvent là qu'on comprend la philosophie réelle du produit.

---

## Profil barrière / peau sensible — favorable pour rosacée

\`\`\`
Aqua, Glycerin, Squalane, Cetearyl Alcohol, Ceramide NP,
Ceramide AP, Cholesterol, Panthenol, Allantoin, Sodium Hyaluronate
\`\`\`

Ce profil suggère :
- hydratation multi-niveaux (glycérine, sodium hyaluronate)
- emollience légère (squalane)
- réparation de la barrière (céramides + cholestérol)
- apaisement (panthénol, allantoin)
- aucun ingrédient irritant visible en tête de liste

---

## Profil actif anti-rosacée ciblé

\`\`\`
Aqua, Azelaic Acid, Glycerin, Dimethicone, Cetearyl Alcohol,
Benzoic Acid, Panthenol, Allantoin, Niacinamide, Xanthan Gum
\`\`\`

Ce profil indique un produit formulé autour de l'acide azélaïque (2ème position = concentration significative), avec une base douce et des actifs complémentaires.

---

## Profil potentiellement irritant pour la rosacée

\`\`\`
Alcohol Denat., Aqua, Niacinamide, Fragrance, Menthol,
Lavandula Angustifolia Oil, Salicylic Acid, Citric Acid
\`\`\`

Malgré la niacinamide en 3ème position, l'alcool dénaturé en premier, le parfum, le menthol et l'huile essentielle de lavande rendent ce produit potentiellement problématique dans son ensemble.

**Leçon : toujours évaluer la formule entière, pas un seul ingrédient.**

---

## Profil "naturel" trompeur

\`\`\`
Aqua, Glycerin, Aloe Barbadensis Leaf Juice, Rosa Canina Fruit Oil,
Lavandula Angustifolia Oil, Melaleuca Alternifolia Leaf Oil,
Citrus Bergamia Peel Oil, Mentha Piperita Leaf Extract
\`\`\`

Un produit peut être 100 % naturel, vegan, biologique — et inadapté à la rosacée. Ici, plusieurs huiles essentielles potentiellement irritantes (lavande, tea tree, bergamote photosensibilisante, menthe) sont présentes en concentrations notables.

---

# 3. Les actifs utiles dans la rosacée : les reconnaître en INCI

Voici les formes INCI exactes des actifs les plus pertinents, avec les concentrations généralement efficaces.

| Actif | INCI exact | Concentration utile | Position attendue |
|---|---|---|---|
| Acide azélaïque | Azelaic Acid | 10–20 % | Top 5 |
| Niacinamide | Niacinamide | 2–5 % | Top 5–8 |
| Acide tranexamique | Tranexamic Acid | 2–5 % | Top 5–10 |
| Panthénol | Panthenol | 1–5 % | Variable |
| Allantoin | Allantoin | 0,1–2 % | Variable |
| Céramide NP | Ceramide NP | 0,1–1 % | Variable |
| Céramide AP | Ceramide AP | 0,1–1 % | Variable |
| Céramide EOP | Ceramide EOP | 0,1–1 % | Variable |
| Cholestérol | Cholesterol | 0,5–2 % | Variable |
| Madecassoside | Madecassoside | 0,1–0,5 % | Variable |
| Asiaticoside | Asiaticoside | 0,1–0,5 % | Variable |
| Extrait centella | Centella Asiatica Extract | Variable | Variable |
| Squalane | Squalane | 1–10 % | Top 5–10 |
| Acide hyaluronique | Sodium Hyaluronate | 0,1–2 % | Variable |
| Glycérine | Glycerin | 3–15 % | Top 3–5 |
| Réglisse | Dipotassium Glycyrrhizate / Glycyrrhiza Glabra Root Extract | 0,1–2 % | Variable |
| Extrait de thé vert | Camellia Sinensis Leaf Extract | Variable | Variable |
| Bisabolol | Alpha-Bisabolol | 0,1–0,5 % | Variable |
| Bakuchiol | Bakuchiol | 0,5–1 % | Variable |
| Soufre | Sulfur | 2–10 % | Top 5 (produits spécialisés) |

**Note sur les céramides :** leur concentration individuelle peut sembler basse (< 1 %), mais l'effet est réel car ils s'intègrent directement dans la structure lamellaire existante. Ce qui compte c'est la présence simultanée de plusieurs types de céramides + cholestérol + acides gras.

---

# 4. La base de la formule : identifier les grandes familles

Avant les actifs, la base détermine le type de produit et sa tolérance globale.

---

## Humectants — attirent et retiennent l'eau

Ces ingrédients maintiennent l'hydratation du stratum corneum en captant les molécules d'eau.

| INCI | Commentaire |
|---|---|
| Glycerin | Humectant de référence, excellent tolérance |
| Propanediol | Alternatif à la glycérine, très bien toléré |
| Butylene Glycol | Humectant + solvant doux |
| Sodium Hyaluronate | Forme sel de l'acide hyaluronique, bien toléré |
| Sodium PCA | Composant du NMF naturel, excellent |
| Urea (< 5 %) | Humectant puissant, légèrement kératolytique |
| Allantoin | Double effet : humectant + soothing |

**Pour la rosacée :** les humectants sont les bienvenus. Glycerin et Propanediol en tête de liste = bon signe.

---

## Émollients — assouplissent et protègent

Les émollients remplissent les espaces entre les cornéocytes et améliorent la texture de la peau.

| INCI | Type | Commentaire |
|---|---|---|
| Squalane | Léger, non gras | Excellent pour toutes les peaux rosacéiques |
| Caprylic/Capric Triglyceride | Léger | Dérivé de noix de coco, bien toléré |
| Isopropyl Myristate | Émollient | À surveiller : peut être comédogène chez certains |
| Cetearyl Alcohol | Alcool gras | Voir ci-dessous — à ne pas confondre avec l'alcool dénaturé |
| Stearyl Alcohol | Alcool gras | Même famille que ci-dessus, bien toléré |
| Dimethicone | Silicone | Voir section silicones |
| Coco-Caprylate/Caprate | Léger | Bien toléré |

---

## Alcools gras : un point important

**Cetearyl Alcohol, Stearyl Alcohol, Cetyl Alcohol** ne sont **pas** des alcools irritants.

Ce sont des **alcools gras** à longue chaîne — des corps solides dérivés d'huiles végétales, utilisés comme émollients et émulsifiants. Ils renforcent la barrière cutanée et sont généralement très bien tolérés, y compris par les peaux rosacéiques.

À ne surtout pas confondre avec :
- **Alcohol Denat.** (alcool dénaturé, irritant)
- **SD Alcohol** (alcool dénaturé, irritant)
- **Isopropyl Alcohol** (alcool irritant)

---

## Occlusifs — forment une barrière physique contre la TEWL

| INCI | Type | Tolérance dans la rosacée |
|---|---|---|
| Petrolatum (vaseline) | Occlusif fort | Excellent, inerte, très bien toléré |
| Dimethicone | Silicone occlusive partielle | Bien toléré en général |
| Beeswax (cire d'abeille) | Naturel | Variable selon les formulations |
| Shea Butter (Butyrospermum Parkii Butter) | Émollient + occlusif | Généralement bien toléré à concentration modérée |
| Mineral Oil (Paraffinum Liquidum) | Occlusif | Bien toléré, malgré sa mauvaise réputation injustifiée |

**Pour la rosacée :** les occlusifs sont utiles pour limiter la TEWL, surtout la nuit. Le petrolatum est parmi les ingrédients les plus inertes et les mieux tolérés qui existent.

---

## Émulsifiants — permettent de mélanger eau et huile

Indispensables dans toute émulsion (crème, lotion). Ne jouent pas de rôle actif sur la peau mais déterminent la texture du produit.

| INCI | Commentaire |
|---|---|
| Cetearyl Alcohol | Double rôle émollient + émulsifiant, bien toléré |
| Cetearyl Glucoside | Dérivé sucre, bien toléré |
| Glyceryl Stearate | Bien toléré |
| PEG-100 Stearate | Généralement bien toléré à des concentrations normales |
| Polysorbate 20/60/80 | Bien toléré dans la majorité des cas |

**Mythe à démonter :** les émulsifiants PEG ne sont pas dangereux pour la peau dans les concentrations utilisées en cosmétique. Leur mauvaise réputation sur certains forums est infondée.

---

## Texturants et stabilisants

Ingrédients qui donnent la texture et stabilisent la formule. Généralement neutres pour la peau.

| INCI | Rôle |
|---|---|
| Carbomer, Acrylates Copolymer | Gélifiant (donne la texture gel ou gel-crème) |
| Xanthan Gum | Gélifiant naturel, bien toléré |
| Hydroxyethylcellulose | Gélifiant naturel, bien toléré |
| Sodium Polyacrylate | Gélifiant, bien toléré |

---

# 5. Les ingrédients à surveiller : une lecture en 3 niveaux

## Niveau 1 : signaux d'alerte forts (à éviter quasi systématiquement)

Ces ingrédients provoquent fréquemment des réactions dans la rosacée, quelle que soit leur position dans la liste :

| INCI | Raison |
|---|---|
| Parfum / Fragrance | Irritant neurosensoriel, allergène potentiel |
| Alcohol Denat., SD Alcohol (en tête de liste) | Détruit la barrière lipidique |
| Sodium Lauryl Sulfate (SLS) | Tensioactif trop agressif, élève le pH |
| Menthol | Active TRPM8/TRPA1 → flushing retardé |
| Methylisothiazolinone (MI) | Allergisant fort, interdit dans les produits sans rinçage en UE |
| Methylchloroisothiazolinone (MCI) | Même risque que MI |
| Les 26 allergènes INCI déclarés | Limonene, Linalool, Geraniol, Eugenol, Cinnamal, Coumarin, etc. |

---

## Niveau 2 : signaux d'alerte modérés (dépendent du contexte)

| INCI | Nuance |
|---|---|
| Alcool dénaturé (en milieu ou fin de liste) | Moins problématique à faible concentration, mais à surveiller |
| Citric Acid (fin de liste) | Ajusteur de pH à faible dose = neutre. En concentration notable = irritant |
| Propylene Glycol | Bien toléré si < 5 % dans une bonne formulation |
| Parfum / Fragrance (fin de liste) | Toujours potentiellement irritant, même en trace |
| Toute huile essentielle | Quelle que soit sa position dans la liste |
| Benzoyl Peroxide | Inadapté à la rosacée |

---

## Niveau 3 : souvent bien tolérés malgré leur réputation

| INCI | Mythe associé | Réalité |
|---|---|---|
| Mineral Oil (Paraffinum Liquidum) | "Bouche les pores, toxique" | Inerte, non comédogène aux concentrations cosmétiques, bien toléré |
| Petrolatum | "Trop lourd, comédogène" | Émollient inerte parmi les plus sûrs qui existent |
| Dimethicone | "Imperméabilise la peau" | Occlusif partiel, bien toléré, ne bloque pas les échanges cutanés |
| Cetearyl Alcohol | "C'est de l'alcool" | Alcool gras = émollient réparateur, pas d'alcool irritant |
| Sodium Laureth Sulfate | "Aussi agressif que SLS" | Plus doux que SLS mais tout de même à préférer en faible concentration |
| PEG (polyéthylène glycol) | "Dangereux, pénètre la peau" | Polymères larges ne pénètrent pas dans la peau intacte, bien tolérés |

---

# 6. Les conservateurs

Sans conservateurs, un produit aqueux est un bouillon de culture microbiologique. Les conservateurs sont nécessaires — la question est de choisir les mieux tolérés.

## Conservateurs généralement bien tolérés

| INCI | Commentaire |
|---|---|
| Phenoxyethanol | Standard de l'industrie. Bien toléré à < 1 % (limite réglementaire UE) |
| Ethylhexylglycerin | Souvent associé au phenoxyethanol. Bien toléré |
| Sodium Benzoate | Bien toléré. Peut former du benzaldéhyde en présence de vitamine C acide — inoffensif en pratique aux concentrations cosmétiques |
| Potassium Sorbate | Bien toléré. Souvent utilisé avec du sodium benzoate |
| Caprylyl Glycol | Bien toléré, légèrement antimicrobien |
| Dehydroacetic Acid | Bien toléré en général |
| Benzyl Alcohol | Toléré à faible concentration. Allergène déclaré à surveiller chez les peaux atopiques |

## Conservateurs à éviter

| INCI | Raison |
|---|---|
| Methylisothiazolinone (MI) | Sensibilisant fort — interdit sans rinçage en UE depuis 2016 |
| Methylchloroisothiazolinone (MCI) | Même risque |
| Kathon CG | Mélange MI/MCI |
| DMDM Hydantoin, Imidazolidinyl Urea | Libérateurs de formaldéhyde, sensibilisants |
| Quaternium-15 | Libérateur de formaldéhyde |

---

# 7. Les extraits botaniques : lire entre les lignes

Un ingrédient végétal n'est pas automatiquement doux ni efficace.

## Extraits généralement bien tolérés et potentiellement utiles

| INCI | Actif bénéfique |
|---|---|
| Avena Sativa Kernel Extract | Avenanthramides, bêta-glucane |
| Centella Asiatica Extract | Madecassoside, asiaticoside |
| Glycyrrhiza Glabra Root Extract | Glabridine, licochalcone |
| Camellia Sinensis Leaf Extract | EGCG, polyphénols |
| Chamomilla Recutita Extract | Bisabolol, apazuléne |
| Aloe Barbadensis Leaf Juice | Polysaccharides hydratants — bien toléré mais souvent peu actif aux concentrations utilisées |
| Symphytum Officinale Extract (consoude) | Allantoïne, ester rosmarinique |

## Extraits souvent problématiques dans la rosacée

| INCI | Raison |
|---|---|
| Lavandula Angustifolia Oil | Linalool oxydé, activateur TRPA1 |
| Melaleuca Alternifolia Leaf Oil | Tea tree, terpènes irritants, allergisant |
| Citrus Limon Peel Oil | Photosensibilisant, limonène oxydé |
| Citrus Bergamia Peel Oil | Fortement photosensibilisant (bergaptène) |
| Mentha Piperita Oil | Menthol, activation TRPM8/TRPA1 |
| Eucalyptus Globulus Leaf Oil | 1,8-cinéole, activateur TRPA1 |
| Cinnamomum Oil | Cinnamaldéhyde : activateur TRPA1 très puissant |
| Rosmarinus Officinalis Oil (romarin) | Terpènes irritants |
| Clove Bud Oil (clou de girofle) | Eugénol : allergisant fort |

**Règle pratique :** si le nom d'une plante est suivi de "Oil" en INCI, il s'agit d'une huile essentielle. Si suivi de "Extract" ou "Water", c'est un extrait aqueux ou un hydrolat — généralement moins concentré et mieux toléré.

---

# 8. Les silicones

Les silicones ont une mauvaise réputation largement injustifiée, notamment dans les milieux "skincare naturel".

**Les deux grandes familles :**

| INCI | Type | Rôle | Commentaire |
|---|---|---|---|
| Dimethicone | Non volatile | Émollient occlusif, lisse le film cutané, réduit les frottements | Très bien toléré, aide à la barrière |
| Cyclopentasiloxane, Cyclohexasiloxane | Volatile | Vecteur de texture, s'évapore après application | Neutre, peut améliorer l'esthétique du produit |
| Dimethiconol | Non volatile | Propriétés proches du diméthicone | Bien toléré |

**Dans la rosacée :**
Les silicones sont généralement bien tolérés. Un léger bémol dans les formes ETR sévères avec flushings intenses : certains patients rapportent que les formules très siliconeuses et occlusives retiennent légèrement la chaleur sur la peau. Si c'est le cas, préférer les formules à base aqueuse plus légères par temps chaud.

---

# 9. Identifier les "faux amis" : les cas les plus fréquents

## Le produit "peau sensible" avec menthol

\`\`\`
Aqua, Glycerin, Allantoin, Aloe Barbadensis Leaf Juice,
Panthenol, Menthol, Chamomilla Recutita Extract...
\`\`\`
Allantoïne, aloe et panthénol semblent excellents — mais le menthol annule en grande partie ces bénéfices pour les patients rosacéiques.

---

## Le produit "naturel bio" aux huiles essentielles multiples

\`\`\`
Aqua, Rosa Damascena Flower Water, Jojoba Oil, Lavandula Angustifolia Oil,
Melaleuca Alternifolia Leaf Oil, Citrus Bergamia Peel Oil, Rosmarinus Officinalis Oil
\`\`\`
Absence totale d'alcool dénaturé et de conservateurs synthétiques — et pourtant 4 huiles essentielles potentiellement irritantes pour la rosacée.

---

## Le produit "sans parfum" avec allergènes déclarés

\`\`\`
...Limonene, Linalool, Geraniol, Citronellol, Benzyl Alcohol...
\`\`\`
La mention "sans parfum" peut être légalement vraie (pas de "Fragrance" ou "Parfum" dans la liste), mais les molécules parfumantes isolées — ici les terpènes limonène, linalool, géraniol — peuvent déclencher les mêmes réactions que le parfum complet.

---

## Le produit "riche en céramides" avec traces infimes

\`\`\`
...Panthenol, Ceramide NP, Ceramide AP, Ceramide EOP, Cholesterol...
\`\`\`
Si ces céramides apparaissent tous en 15ème, 16ème, 17ème et 18ème position d'une liste de 25 ingrédients, leur concentration individuelle est probablement inférieure à 0,05 %. Le produit n'est pas "riche en céramides" — il contient des traces de céramides.

---

## L'actif estrelle très tardif

\`\`\`
Aqua, Glycerin, Butylene Glycol, Dimethicone, Cetearyl Alcohol,
Phenoxyethanol, Ethylhexylglycerin, Carbomer, Sodium Hydroxide,
Madecassoside, Asiaticoside, Centella Asiatica Extract
\`\`\`
Les trois actifs de centella en fin de liste derrière les conservateurs et les ajusteurs de pH. Probablement en concentration trace. Le marketing peut affirmer "formulé à la centella asiatica" — techniquement vrai mais cliniquement négligeable.

---

# 10. Les ajusteurs de pH et agents chélateurs

Ces ingrédients sont fonctionnels, pas actifs, et généralement neutres.

**Ajusteurs de pH :**

| INCI | Rôle |
|---|---|
| Citric Acid (fin de liste) | Abaisse le pH de la formule vers l'acidité |
| Sodium Hydroxide (fin de liste) | Relève le pH. Caustique pur, mais en trace dans la formule finale = inoffensif |
| Lactic Acid (fin de liste) | Ajuste le pH. À concentrations utiles en milieu de liste = actif exfoliant |

**Agents chélateurs :**

| INCI | Rôle |
|---|---|
| Disodium EDTA, Tetrasodium EDTA | Capture les ions métalliques de l'eau pour stabiliser la formule. Neutre pour la peau |
| Phytic Acid | Chélateur naturel, légèrement antioxydant |

---

# La méthode de lecture en 5 étapes (version complète)

## Étape 1 — Regarder les 5 à 10 premiers ingrédients
Identifier la base : aqueuse, huileuse, alcoolique ? Humectants ou émollients en tête ?

**Question clé :** est-ce que la base me semble compatible avec une peau rosacéique ?

## Étape 2 — Scanner la liste entière pour les signaux d'alerte forts
Chercher : Parfum/Fragrance, Alcohol Denat., SLS, Menthol, MI/MCI, les 26 allergènes INCI, les huiles essentielles (mot "Oil" après un nom de plante).

**Question clé :** y a-t-il un ou plusieurs signaux d'alerte, quelle que soit leur position ?

## Étape 3 — Chercher les actifs utiles et leur position
Les actifs utiles sont-ils présents et positionnés de façon réaliste (pas tous en fin de liste) ?

**Question clé :** les actifs revendiqués en marketing sont-ils dans le premier ou second tiers de la liste ?

## Étape 4 — Évaluer la formule globalement
Une formule avec 3 actifs bien positionnés et aucun signal d'alerte vaut mieux qu'une formule avec 12 actifs dont 4 irritants.

**Question clé :** l'équilibre global penche vers la compatibilité ou vers le risque ?

## Étape 5 — Croiser avec ta tolérance réelle
Une liste INCI favorable ne garantit pas la tolérance. Et une liste imparfaite peut parfois être tolérée.

**Question clé :** est-ce que ma propre expérience avec ce produit (ou des produits similaires) confirme l'analyse ?

---

# Les outils en ligne

| Outil | Points forts | Limites |
|---|---|---|
| **INCIDecoder** (incidecoder.com) | Interface claire, explications de chaque ingrédient, score de tolérance par profil | Bases de données anglaise, parfois manque de nuances contextuelles |
| **CosDNA** | Base de données large, score acné + irritation + sécurité | Interface datée, scores peuvent être trop simplistes |
| **SkinSort** | Filtre par profil de peau, comparaisons de produits | Moins complet que INCIDecoder |
| **INCI Beauty** (inci-beauty.com) | Interface française, bon pour le marché européen | Moins exhaustif sur les mécanismes |
| **EWG Skin Deep** | Données sur la toxicologie environnementale | Critères parfois mal adaptés à la tolérance cutanée réelle |

**Recommandation :** INCIDecoder est souvent le plus utile pour analyser rapidement un produit. Ses analyses tiennent compte des concentrations probables et du contexte.

---

# Les faux raccourcis

## "Naturel" ≠ mieux
Les huiles essentielles, les extraits de plantes allergisants et les terpènes sont naturels. Ils peuvent être parmi les ingrédients les plus irritants pour la rosacée.

## "Sans alcool" ≠ forcément doux
Cette mention désigne généralement l'absence d'alcool dénaturé (alcohol denat.) — mais pas l'absence d'alcool gras (cetearyl alcohol, stearyl alcohol). Elle ne dit rien sur la présence de parfum, de menthol ou d'huiles essentielles.

## "Dermatologiquement testé" ≠ garanti pour rosacée
Cette mention signifie qu'un test de tolérance a été réalisé — généralement sur une petite population sans pathologie définie. Elle n'indique pas que le produit a été testé sur des peaux rosacéiques, ni avec quels critères.

## "Peau sensible" ≠ formulation parfaite
L'absence de définition légale de "peau sensible" permet à n'importe quel fabricant d'apposer cette mention. Toujours lire l'INCI.

## "Non comédogène" ≠ non irritant
Ce sont deux propriétés distinctes. Un produit non comédogène peut très bien contenir des parfums ou de l'alcool dénaturé.

## "Hypoallergénique" ≠ sans allergènes
Il n'existe pas de définition réglementaire de "hypoallergénique" en Europe. La mention est essentiellement un argument marketing.

---

# À retenir

- Les 5 à 10 premiers ingrédients racontent souvent la vraie formule.
- Scanner systématiquement : Parfum/Fragrance, Alcohol Denat., SLS, Menthol, MI/MCI, et les "Oil" végétaux aromatiques.
- Ne pas confondre alcool gras (Cetearyl Alcohol = bon) et alcool dénaturé (Alcohol Denat. = problématique).
- Un actif en fin de liste peut être présent en trace insuffisante — le marketing ne reflète pas toujours la concentration réelle.
- Les silicones, le petrolatum et l'huile minérale sont généralement bien tolérés malgré leur réputation.
- INCIDecoder est l'outil en ligne le plus pratique pour une analyse rapide.
- L'INCI est le meilleur outil disponible — mais il n'est fiable que si on l'associe à sa propre expérience de tolérance.
`,
}
