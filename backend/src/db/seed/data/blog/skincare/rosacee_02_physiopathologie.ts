import type { ArticleInput } from '../article-data'

export const ROSACEE_02_PHYSIOPATHOLOGIE: ArticleInput = {
  title: 'Rosacée : ce qui se passe vraiment dans la peau (2/7)',
  slug: 'rosacee-02-physiopathologie',
  category: 'skincare',
  coverImageUrl:
    'https://images.unsplash.com/photo-1714845596426-b794e7b56ae1?auto=format&fit=crop&w=1200&q=80',
  publishedAt: new Date().toISOString(),
  content: `
# 02 — Physiopathologie de la rosacée

## Introduction
La rosacée n'est pas simplement un problème de rougeur ou de vaisseaux visibles.

C'est une maladie complexe impliquant plusieurs systèmes biologiques qui interagissent en permanence :

- le système immunitaire inné
- les nerfs sensoriels cutanés
- les vaisseaux sanguins
- la barrière cutanée
- le microbiome cutané

Ces systèmes ne fonctionnent pas de façon isolée. Ils forment des boucles de rétroaction qui s'amplifient mutuellement, ce qui explique le caractère chronique et progressif de la maladie.

Le sous-type érythémato-télangiectasique (ETR) est particulièrement lié aux mécanismes neurovasculaires. La forme papulo-pustuleuse implique davantage le recrutement de neutrophiles et la voie Th17. La forme phymateuse fait intervenir la prolifération fibroblastique et l'hypertrophie des glandes sébacées.

---

# 1. Dysfonction de l'immunité innée

La peau rosacéique est souvent en état d'alerte permanent.

Au lieu de réagir uniquement face à une vraie menace, elle peut sur-réagir à :

- la chaleur
- les UV
- certains produits cosmétiques
- des micro-organismes
- le stress physiologique

---

## TLR2 : le détecteur immunitaire
TLR2 (Toll-Like Receptor 2) est un récepteur membranaire qui agit comme un capteur d'alerte de l'immunité innée. Il reconnaît des motifs moléculaires associés aux agents pathogènes (fragments bactériens, acariens, molécules de stress) et déclenche une réponse inflammatoire.

Dans la rosacée, TLR2 est souvent surexprimé dans les kératinocytes et les cellules dendritiques cutanées.

Conséquences de cette surexpression :
- activation de la voie de signalisation NF-κB
- production accrue de cytokines pro-inflammatoires : IL-1β, IL-6, IL-8, TNF-α
- recrutement de cellules immunitaires dans le derme
- upregulation de KLK5

Déclencheurs connus :
- UV
- Demodex et ses bactéries associées
- fragments bactériens (LPS, acylpeptides)
- irritation ou rupture de la barrière cutanée

---

## KLK5 : l'enzyme clé
KLK5 (Kallikrein 5) est une sérine protéase naturellement présente dans la peau. Son rôle normal est de participer à la desquamation et à la régulation de l'épiderme.

Dans la rosacée, son activité est souvent augmentée — en partie sous l'effet de TLR2.

Ses deux rôles principaux dans la maladie :

**1. Clivage de hCAP18 en LL-37**
KLK5 coupe la pro-forme hCAP18 pour libérer le peptide actif LL-37, qui est au cœur de la cascade inflammatoire.

**2. Activation des récepteurs PAR-2**
KLK5 active les récepteurs PAR-2 (Protease-Activated Receptor 2) présents sur les kératinocytes et les terminaisons nerveuses. Cette activation :
- amplifie localement la production de cytokines
- stimule la libération de neuropeptides pro-inflammatoires
- contribue à l'hypersensibilité cutanée

---

## LL-37 : peptide pro-inflammatoire majeur
LL-37 est une cathélicidine antimicrobienne normalement utile contre les infections. Mais dans la rosacée, il est produit en quantité anormalement élevée — ce qui a été confirmé par des biopsies cutanées comparatives (peau rosacéique vs peau saine).

Effets dans la rosacée :

- inflammation locale via les récepteurs FPRL-1
- recrutement de neutrophiles, macrophages et mastocytes
- activation et dégranulation des mastocytes
- stimulation de l'angiogenèse via l'induction de VEGF
- polarisation de la réponse immunitaire vers Th1 et Th17
- augmentation de la perméabilité vasculaire
- sensibilisation des récepteurs TRPV1 et TRPA1 sur les fibres nerveuses

Cette cascade est considérée comme centrale dans la maladie. LL-37 est à l'interface de l'immunité, du système nerveux et du système vasculaire.

---

# 2. Mastocytes

Les mastocytes sont des cellules immunitaires résidentes présentes dans le derme, à proximité immédiate des vaisseaux sanguins et des terminaisons nerveuses.

Dans la rosacée, ils sont souvent plus nombreux et plus facilement activables.

**Ce qui les active :**
- LL-37
- neuropeptides (CGRP, substance P)
- CRH (corticotrophin-releasing hormone), libérée lors du stress
- IgE (mécanismes allergiques associés)
- stimuli thermiques

**Quand ils se dégranulent, ils libèrent :**
- histamine → vasodilatation, démangeaisons, œdème
- tryptase → activation de PAR-2, dégradation de la matrice extracellulaire
- prostaglandines et leucotriènes → inflammation et vasodilatation prolongées
- cytokines (TNF-α, IL-4, IL-5) → inflammation chronique
- facteurs de croissance vasculaire (VEGF, SCF)

**Conséquences cliniques :**
- rougeur et chaleur
- picotements et sensations de brûlure
- gonflement transitoire
- inflammation persistante entretenue entre les poussées

Les mastocytes occupent une place stratégique : ils font le lien entre l'immunité innée, les nerfs sensoriels et les vaisseaux sanguins, formant un nœud central dans la boucle inflammatoire de la rosacée.

---

# 3. Dysfonction neurovasculaire

La composante neurogène est particulièrement importante dans la rosacée ETR et explique une large part des symptômes les plus invalidants (flushings, brûlures, hypersensibilité).

Chez beaucoup de patients, la peau réagit de manière excessive aux stimuli qui, chez une peau normale, seraient bien tolérés.

Exemples :
- chaleur modérée
- stress émotionnel
- alcool
- effort physique
- aliments épicés ou boissons chaudes

Cela implique notamment les canaux sensoriels suivants.

---

## TRPV1
TRPV1 (Transient Receptor Potential Vanilloid 1) est un canal ionique sensoriel activé par :

- la chaleur (> 43 °C)
- la capsaïcine (principe actif du piment)
- les pH acides
- certains lipides inflammatoires (endocannabinoïdes, acide arachidonique)

Dans la rosacée, TRPV1 est surexprimé dans les fibres nerveuses C de la peau du visage. Sa sensibilisation est amplifiée par LL-37 et par les prostaglandines libérées lors des poussées.

Quand il s'active :
- influx de calcium dans la cellule nerveuse
- libération de CGRP et de substance P
- vasodilatation neurogénique
- sensation de brûlure ou de chaleur

---

## TRPA1
TRPA1 (Transient Receptor Potential Ankyrin 1) réagit notamment à :

- froid extrême
- irritants chimiques (aldéhydes, acroléine, isothiocyanates)
- pollution atmosphérique et particules fines
- molécules pro-inflammatoires endogènes

Il peut amplifier le flushing chez certaines personnes, notamment en réponse à des expositions environnementales. Son activation libère également des neuropeptides pro-inflammatoires.

---

## CGRP et substance P

**CGRP (Calcitonin Gene-Related Peptide)** :
- libéré par les fibres nerveuses C et Aδ en réponse à l'activation de TRPV1/TRPA1
- puissant vasodilatateur : dilate les artérioles cutanées en quelques secondes
- augmente la perméabilité vasculaire
- active directement les mastocytes dermiques
- taux élevés mesurés dans la peau rosacéique en période de poussée

**Substance P** :
- co-libérée avec le CGRP depuis les terminaisons nerveuses
- provoque l'œdème et la douleur neuropathique
- active les mastocytes (dégranulation) et les macrophages
- stimule la libération de cytokines pro-inflammatoires

Ces deux neuropeptides participent fortement aux flushings et à la sensation de chaleur pulsatile qui les accompagne. Leur libération répétée entretient l'inflammation locale même en dehors des poussées apparentes.

---

## La boucle neuro-immune-vasculaire

L'interaction entre ces trois systèmes forme une boucle auto-amplificatrice :

- les nerfs libèrent des neuropeptides → qui activent les mastocytes
- les mastocytes libèrent de l'histamine et des cytokines → qui sensibilisent davantage les nerfs
- l'inflammation vasculaire attire de nouvelles cellules immunitaires → qui amplifient la réponse nerveuse

Cette boucle explique pourquoi la peau rosacéique peut rester dans un état d'hyperréactivité chronique, même en l'absence de déclencheur évident.

---

# 4. Dysfonction vasculaire

Dans la rosacée ETR, les vaisseaux sanguins du derme superficiel deviennent progressivement hyperréactifs.

Ils peuvent :
- se dilater plus facilement et pour des stimuli moindres
- rester dilatés plus longtemps que dans une peau normale
- perdre leur capacité normale à se revasoconstricter

Conséquences cliniques :
- rougeur persistante (érythème de fond)
- flushings répétés et prolongés
- télangiectasies (capillaires visibles permanents)

---

## VEGF et angiogenèse

VEGF (Vascular Endothelial Growth Factor) est le principal facteur de croissance des vaisseaux sanguins.

Dans la rosacée, il peut être augmenté sous l'effet de :
- LL-37
- hypoxie locale secondaire à l'inflammation
- mastocytes activés

Effets dans la maladie :
- formation de nouveaux capillaires (angiogenèse)
- augmentation de la perméabilité vasculaire
- persistance et extension des rougeurs

Ces nouveaux vaisseaux, une fois formés, ne régressent pas spontanément. C'est le mécanisme par lequel les rougeurs intermittentes deviennent des télangiectasies permanentes.

---

## Dysfonction lymphatique

Les vaisseaux lymphatiques jouent normalement un rôle dans le drainage de l'œdème et des cellules immunitaires.

Dans certaines formes de rosacée, une dysfonction lymphatique a été mise en évidence :
- drainage insuffisant du derme inflammé
- accumulation de cytokines et de cellules immunitaires dans les tissus
- contribution à l'œdème facial et à l'aspect diffus des rougeurs

Cette composante est particulièrement discutée dans la rosacée phymateuse, où elle pourrait favoriser l'épaississement tissulaire.

---

# 5. Barrière cutanée altérée

La peau rosacéique présente souvent une altération structurelle de la barrière épidermique, qui est à la fois une conséquence et un facteur aggravant de la maladie.

Anomalies observées :
- perte en eau augmentée (TEWL élevée)
- déficit en céramides et en acides gras essentiels constitutifs du ciment intercellulaire
- altération des jonctions serrées (tight junctions) entre les kératinocytes
- réponse inflammatoire des kératinocytes face aux irritants

Conséquences :
- déshydratation chronique de l'épiderme
- brûlures et picotements au contact d'agents normalement bien tolérés
- intolérance aux cosmétiques (alcool, parfums, acides)
- pénétration facilitée des antigènes environnementaux et des molécules de Demodex
- aggravation des poussées inflammatoires

Cette barrière fragilisée crée un cercle vicieux :
l'inflammation abîme la barrière → la barrière abîmée laisse entrer davantage d'agents irritants et immunogènes → ce qui entretient l'inflammation.

C'est pourquoi la restauration de la barrière cutanée est un objectif thérapeutique à part entière, au même titre que le traitement de l'inflammation.

---

# 6. Microbiome et Demodex

## Demodex folliculorum

Demodex folliculorum est un acarien microscopique (~0,3 mm) qui vit naturellement dans les follicules pilo-sébacés de presque tous les adultes. Il est normalement non pathogène à faible densité.

Dans certains cas de rosacée — en particulier la forme papulo-pustuleuse — sa densité est anormalement élevée (> 5 acariens/cm² en dermoscopie).

**Mécanismes d'action dans la rosacée :**

1. **Via Bacillus oleronius** : Demodex héberge à sa surface la bactérie *Bacillus oleronius*, qui libère des protéines immunogènes. Ces protéines activent TLR2 sur les kératinocytes et déclenchent la cascade KLK5 → LL-37. Des études ont montré que les patients rosacéiques présentent des anticorps anti-*B. oleronius* à des taux significativement plus élevés que les témoins sains.

2. **Obstruction folliculaire** : en forte densité, Demodex peut obstruer mécaniquement les follicules, entraînant une rétention de sébum, une prolifération bactérienne locale et une inflammation périfolliculaire.

3. **Activation directe de l'immunité** : les fragments chitineux de la cuticule de Demodex et ses protéines de surface activent directement les mastocytes et les cellules présentatrices d'antigènes.

4. **Synergie avec les sérine protéases** : les molécules libérées par Demodex potentialisent l'activité de KLK5, amplifiant encore la production de LL-37.

L'ivermectine topique (Soolantra®), qui réduit la densité de Demodex, est d'ailleurs l'un des traitements les plus efficaces dans la forme papulo-pustuleuse — ce qui confirme le rôle pathogène de cet acarien.

---

## Microbiome cutané

La peau saine abrite un microbiome diversifié dominé par des espèces commensales bénéfiques (Cutibacterium acnes à faible virulence, Staphylococcus epidermidis, etc.).

Dans la rosacée, plusieurs études ont mis en évidence :
- une réduction de la diversité microbienne cutanée
- une augmentation relative de certaines espèces pro-inflammatoires
- une diminution des espèces productrices de molécules anti-inflammatoires

Ces déséquilibres peuvent :
- activer TLR2 et l'immunité innée via des fragments bactériens
- perturber davantage la barrière cutanée
- amplifier la réponse inflammatoire locale
- augmenter la sensibilité aux déclencheurs extérieurs

Le microbiome intestinal est également évoqué dans certaines études : une prévalence plus élevée de *Helicobacter pylori* et de SIBO (Small Intestinal Bacterial Overgrowth) a été rapportée chez des patients rosacéiques, avec une possible voie gut-skin axis. Ces associations restent néanmoins à confirmer par des études plus robustes.

---

# 7. Différences physiopathologiques selon les sous-types

Les mécanismes décrits ne s'expriment pas de façon identique dans chaque forme clinique.

## Rosacée érythémato-télangiectasique
Dominée par la dysfonction neurovasculaire :
- hyperréactivité de TRPV1 et TRPA1
- libération excessive de CGRP
- vasodilatation chronique et angiogenèse (VEGF)
- mastocytes abondants autour des vaisseaux dermiques

## Rosacée papulo-pustuleuse
Davantage marquée par l'immunité innée :
- forte activation TLR2 → LL-37
- recrutement de neutrophiles (responsables des pustules)
- polarisation Th1/Th17 de la réponse immune adaptative
- rôle majeur de Demodex et de *B. oleronius*

## Rosacée phymateuse
Implique en plus des mécanismes de remodelage tissulaire :
- activation de TGF-β (Transforming Growth Factor beta) → stimulation des fibroblastes
- hypertrophie et hyperplasie des glandes sébacées
- dépôt de collagène et fibrose dermique
- possible dysfonction lymphatique contribuant à l'œdème et à l'épaississement

## Rosacée oculaire
Mécanismes proches de la rosacée cutanée :
- inflammation des bords des paupières (blépharite)
- hyperactivité des glandes de Meibomius → sébum anormal → film lacrymal instable
- présence de Demodex dans les follicules des cils
- LL-37 détecté dans les sécrétions lacrymales de patients atteints

---

# 8. Les cercles vicieux de la chronification

La rosacée est une maladie chronique précisément parce que ses mécanismes s'auto-entretiennent.

**Cercle vicieux inflammatoire :**
Déclencheur → TLR2 → KLK5 → LL-37 → mastocytes → cytokines → inflammation → activation TLR2 → …

**Cercle vicieux neuro-immunitaire :**
Neuropeptides → mastocytes → histamine + cytokines → sensibilisation nerveuse → libération accrue de neuropeptides → …

**Cercle vicieux barrière-inflammation :**
Inflammation → dégradation de la barrière → pénétration d'antigènes → activation immunitaire → davantage d'inflammation → …

**Chronification vasculaire :**
Flushings répétés → VEGF → angiogenèse → vaisseaux permanents → rougeur stable → … (les télangiectasies ne régressent pas sans traitement ciblé)

---

# Modèle d'ensemble

\`\`\`
Déclencheur (UV, chaleur, Demodex, stress, irritants)
        ↓
    TLR2 (surexprimé)
        ↓
    KLK5 (sérine protéase activée)
     ↙        ↘
 LL-37        PAR-2
   ↓              ↓
Mastocytes     Neuropeptides (CGRP, SP)
   ↓              ↓
Cytokines + VEGF + Histamine
   ↓              ↓
Vaisseaux ← → Nerfs sensoriels (TRPV1, TRPA1)
        ↓
Rougeur + inflammation + flushing + télangiectasies
\`\`\`

---

# À retenir

- La rosacée est une maladie multifactorielle avec plusieurs systèmes biologiques impliqués simultanément.
- Le trio **immunité innée (TLR2/KLK5/LL-37) + nerfs sensoriels (TRPV1/CGRP) + vaisseaux (VEGF)** explique la grande majorité des symptômes.
- Les mastocytes sont un nœud central : ils reçoivent les signaux immunitaires et nerveux, et amplifient la réponse vasculaire.
- Le sous-type ETR est particulièrement neurovasculaire ; la forme papulo-pustuleuse est davantage liée à l'immunité innée et à Demodex.
- La barrière cutanée altérée n'est pas qu'une conséquence : elle est aussi un facteur aggravant actif.
- Demodex joue un rôle pathogène via *Bacillus oleronius* et l'activation de TLR2, justifiant l'usage de l'ivermectine.
- La chronification s'explique par des boucles de rétroaction qui s'auto-entretiennent, même sans déclencheur externe apparent.
- La réparation de la barrière cutanée reste essentielle, même en présence de traitements médicaux efficaces.
`,
}
