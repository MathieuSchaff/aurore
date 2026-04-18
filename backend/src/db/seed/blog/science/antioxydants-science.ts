import type { ArticleInput } from '../seed-articles'

export const antioxydantsScience: ArticleInput = {
  title: "Antioxydants : ce qui aide, ce qui éteint les signaux utiles",
  slug: 'antioxydants-science',
  category: 'science',
  excerpt:
    "Pourquoi supplémenter des antioxydants à l'aveugle peut être contre-productif. Différence entre ROS ennemis et ROS signaux, hormèse, NRF2, et classement pratique de 10 suppléments courants (glycine, NAC, astaxanthine, curcumine…).",
  publishedAt: null,
  content: `**"Antioxydant = bon, plus il y en a mieux c'est."** Ce raccourci est faux. Les espèces réactives de l'oxygène (ROS) ne sont pas un poison à éliminer : ce sont aussi des **signaux** qui déclenchent l'adaptation cellulaire à l'exercice, la réponse immunitaire, la mort des cellules précancéreuses. Les noyer sous une mégadose d'antioxydants, c'est éteindre ces signaux.

Cet article explique la différence entre **neutraliser des ROS** et **soutenir les défenses cellulaires**, pourquoi certains essais sur de fortes doses d'antioxydants ont donné des résultats *négatifs* (bêta-carotène et cancer du poumon chez fumeurs, vit. E et mortalité), et comment lire une étiquette "antioxydant" de façon utile.

> ⚠️ Article de fond, pas de prescription. Usages thérapeutiques ciblés (chimio, maladies oxydatives spécifiques) relèvent d'un médecin.

## Rappel : qu'est-ce qu'un ROS ?

Les **ROS** (*reactive oxygen species*) sont des molécules dérivées de l'oxygène avec un électron non apparié — superoxyde (O₂⁻), peroxyde d'hydrogène (H₂O₂), radical hydroxyle (•OH), etc. Ils sont produits :

- **En continu par les mitochondries** (fuite d'électrons de la chaîne respiratoire — ~1-2 % de l'O₂ consommé).
- **À l'exercice** (pic de consommation d'oxygène).
- **Par l'immunité** (neutrophiles / macrophages les utilisent pour tuer des pathogènes).
- **Par les UV, pollution, alcool, tabac, friture** (sources exogènes).

Trop de ROS → **stress oxydatif** → dommages ADN, peroxydation lipidique, dysfonction mitochondriale. C'est un facteur de vieillissement et de pathologies chroniques. **Mais** pas assez de ROS → pas d'adaptation à l'exercice, réponse immunitaire affaiblie, prolifération cellulaire mal régulée.

## Le paradoxe des mégadoses : l'hormèse

L'**hormèse** décrit une loi quasi-universelle en biologie : *une dose faible d'un stress déclenche une adaptation bénéfique ; une forte dose nuit.* L'exercice illustre parfaitement :

1. Séance intense → pic de ROS musculaires.
2. Ces ROS **activent NRF2**, facteur de transcription clé.
3. NRF2 monte dans le noyau et déclenche la synthèse **des antioxydants endogènes** : glutathion, SOD, catalase, GPx.
4. Résultat : adaptation musculaire, mitochondries plus nombreuses, meilleure défense anti-oxydative intrinsèque.

Prendre **1000 mg de vit. C + 400 UI vit. E** juste avant / après la séance **annule cette adaptation** (essais Ristow, Paulsen) : les ROS sont tamponnés, NRF2 ne s'active pas, les muscles ne progressent pas aussi bien.

**Message clé** : on ne cherche pas à **abolir** les ROS, mais à **soutenir le système endogène** et à les maintenir dans une fenêtre saine.

## Antioxydants endogènes vs exogènes

### Endogènes (produits par le corps)
- **Glutathion (GSH)** : tripeptide (glutamate-cystéine-glycine). Le "maître antioxydant" intracellulaire.
- **Superoxyde dismutase (SOD)** : convertit O₂⁻ en H₂O₂. Cofacteurs : Cu, Zn, Mn.
- **Catalase** : dégrade H₂O₂ en H₂O + O₂. Cofacteur : fer.
- **Glutathion peroxydase (GPx)** : dégrade H₂O₂ et peroxydes lipidiques. Cofacteur : **sélénium**.

Ils sont **régulés par NRF2**. Les **activateurs NRF2** (curcumine, sulforaphane, quercétine, stress thermique type sauna, exercice) sont préférables à l'apport direct d'antioxydants exogènes.

### Exogènes (apportés par l'alimentation)
- **Vitamine C** (hydrosoluble, cytosol, plasma).
- **Vitamine E** (liposoluble, membranes).
- **Caroténoïdes** (bêta-carotène, lycopène, lutéine, astaxanthine).
- **Polyphénols** (flavonoïdes, stilbènes, tanins).

Ils sont utiles à **doses alimentaires**. À **dose pharmacologique**, certains deviennent **pro-oxydants** (vit. C + fer = réaction de Fenton, par exemple).

## Les échecs retentissants des mégadoses

### ATBC + CARET (1994-1996)
Deux grands essais de supplémentation en bêta-carotène chez des **fumeurs** et travailleurs exposés à l'amiante. Résultat : **+16 à +28 % d'incidence de cancer du poumon**. L'étude CARET a été arrêtée prématurément.
→ **Conclusion** : bêta-carotène isolé à forte dose chez les fumeurs = pro-carcinogène.

### SELECT (2008)
Vitamine E + sélénium vs placebo pour prévenir le cancer de la prostate. Résultat : **+17 % de cancer de la prostate dans le bras vit. E** (α-tocophérol synthétique).
→ **Conclusion** : vit. E isolée synthétique à forte dose n'est pas neutre.

### Paulsen et al. (2014)
1000 mg vit. C + 235 mg vit. E, 11 semaines, entraînement de force. Résultat : **moins d'augmentation de la masse maigre et des capacités oxydatives** vs placebo.
→ **Conclusion** : antioxydants en chronique autour de l'exercice = anti-adaptation.

### Bjelakovic (méta-analyse 2012, Cochrane)
296 707 participants, 78 essais. Supplémentation en vit. A, bêta-carotène, vit. E → **augmentation de la mortalité totale** (+4 à +16 % selon la vitamine). Vit. C et sélénium : neutres.
→ **Conclusion** : en population générale, les mégadoses de vitamines antioxydantes ne prolongent pas la vie et peuvent la raccourcir.

## Tableau — positionnement de 10 suppléments courants

| Supplément | Type d'action | Risque d'excès antioxydant ? | Commentaire |
|---|---|---|---|
| **Glycine** | Régulateur du glutathion (soutien endogène) | ❌ Non | Soutient votre propre système, n'éteint pas les signaux. |
| **NAC** | Précurseur du glutathion (donneur cystéine) | ⚠️ Oui à forte dose (> 1200 mg/j) | À limiter en période d'infection aiguë ou de blessure (phase où les ROS sont utiles). |
| **Taurine** | Régulateur cellulaire, anti-inflammatoire léger | ❌ Non | Équilibre les ROS, ne les supprime pas. |
| **Oméga-3 (EPA/DHA)** | Anti-inflammatoire membranaire | ❌ Non | Pas antioxydant direct. Agit sur les cytokines et les membranes. |
| **Créatine** | Soutien énergétique + tampon phosphate | ❌ Non | Protège les mitochondries, pas antioxydant direct. |
| **CDP-choline** | Neuroprotecteur, précurseur phospholipides | ❌ Non | Soutien membrane neuronale. |
| **Lutéine + zéaxanthine** | Antioxydants caroténoïdes (ciblés œil / cerveau) | ⚠️ Léger si combiné à d'autres caroténoïdes | Très localisés. Pas de blocage global. |
| **Astaxanthine** | Antioxydant mitochondrial puissant | ⚠️ Possible à forte dose + NAC | 4-8 mg/j max, éviter mégadose en continu. |
| **Curcumine** | Activateur NRF2 (hormétique) | ✅ Bon profil | Stimule les défenses cellulaires sans éteindre les ROS. Limite ANSES 153 mg/j. |
| **Glucosamine sulfate** | Mimétique de jeûne (AMPK) | ✅ Neutre | Pas antioxydant direct, action métabolique. |

## Comment supplémenter proprement (si besoin)

### 1. Préférer les activateurs NRF2 aux antioxydants bruts
- **Sulforaphane** (brocoli, pousses de brocoli) : activateur NRF2 de référence.
- **Curcumine** : activateur NRF2 + anti-inflammatoire.
- **Sauna, exercice, expositon modérée au froid** : hormèse endogène, gratuite.

### 2. Soutenir le glutathion par les précurseurs, pas directement
- **Glycine 3 g + NAC 600 mg** ("GlyNAC", essais Sekhar) → augmentation du glutathion endogène mesurable et effets sur marqueurs oxydatifs chez personnes âgées.
- Glutathion oral pur : **mal absorbé**. Liposomal un peu mieux mais pas clairement supérieur à la synthèse endogène.

### 3. Respecter les cofacteurs des enzymes antioxydantes
- **Sélénium** (GPx) : noix du Brésil (1-2 par jour couvrent l'apport).
- **Zinc + cuivre + manganèse** (SOD) : alimentation variée (huîtres, foie, graines).
- **Riboflavine B2** : régénération du glutathion (GSSG → GSH).

### 4. Éviter les pièges
- **Pas de vit. E, vit. A, bêta-carotène à haute dose isolée** (surtout si fumeur pour le bêta-carotène).
- **Pas d'antioxydants massifs dans la fenêtre péri-exercice** (0 à 2 h avant, 0 à 4 h après) : attendre.
- **Vigilance association** : NAC + astaxanthine + curcumine + glycine + glutathion liposomal simultanés = saturation inutile.
- **Pas d'"anti-âge" antioxydant universel** : mieux vaut 3 activateurs NRF2 bien choisis que 15 antioxydants empilés.

## Alimentation > supplémentation

L'alimentation apporte les antioxydants dans **leurs matrices naturelles** : flavonoïdes + fibres + vitamines + minéraux, dans des proportions que l'évolution a rôdées. Les études positives sur la "nutrition antioxydante" portent presque toutes sur des **aliments** (baies, thé vert, légumes crucifères, herbes aromatiques), pas sur les extraits isolés concentrés.

Repères pratiques :

- **≥ 400 g fruits + légumes / jour**, variés en couleurs (chaque couleur = une classe de pigments).
- **Crucifères** 3-4 fois / semaine (brocoli, chou, chou-fleur, roquette) → sulforaphane.
- **Baies** aussi souvent que possible → anthocyanines.
- **Thé vert, cacao 85 %, herbes fraîches** → polyphénols.
- **Poissons gras + noix** → oméga-3 + vit. E naturelle (mix tocophérols/tocotriénols).

## À retenir

1. **Les ROS ne sont pas l'ennemi** — ils signalent l'adaptation cellulaire. L'objectif est l'équilibre, pas l'éradication.
2. **Activer NRF2** (sulforaphane, curcumine, exercice, sauna) > apporter des antioxydants bruts à forte dose.
3. **Soutenir le glutathion par les précurseurs** (glycine + NAC) > glutathion direct.
4. **Les mégadoses isolées** (bêta-carotène, vit. E, vit. A, vit. C pharmacologique) ont échoué en essais → rester aux doses alimentaires ou modérées.
5. **Ne pas tamponner les ROS autour de l'exercice** — vous sabotez vos adaptations.
6. **Alimentation variée > supplément**. Toujours.
`,
}
