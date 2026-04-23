import type { ArticleInput } from '../seed-articles'

export const axeIntestinCerveau: ArticleInput = {
  title: 'Axe intestin-cerveau : SCFA, nerf vague et neurotransmetteurs',
  slug: 'axe-intestin-cerveau',
  category: 'science',
  excerpt:
    "Comprendre comment l'intestin communique avec le cerveau : acides gras à chaîne courte (butyrate, propionate, acétate), activation du nerf vague, voies tryptophane / glutamate / tyrosine, et frontière claire entre ce qui traverse la barrière hémato-encéphalique et ce qui reste local.",
  publishedAt: null,
  content: `L'idée que "90 % de la sérotonine est produite dans l'intestin" circule beaucoup — et se traduit vite, à tort, par "mangez X pour booster votre sérotonine cérébrale". La réalité est plus fine : **la sérotonine intestinale ne traverse pas la barrière hémato-encéphalique (BHE)**. Ce qui passe de l'intestin au cerveau, c'est un **signal** — nerveux, métabolique, immunitaire — pas la molécule elle-même.

Cet article pose les briques de ce signal : ce que produit le microbiote, par quelles voies il parle au cerveau, et ce qui distingue un effet **local** d'un effet **central**.

## Le circuit principal : fibres → SCFA → signal

\`\`\`
FIBRES (légumes, légumineuses, céréales complètes)
   ↓
FERMENTATION par le microbiote colique
   ↓
SCFA (acides gras à chaîne courte)
   ├── Butyrate
   ├── Propionate
   └── Acétate
   ↓
EFFETS
   ├── Réduction de l'inflammation
   ├── Renforcement de la barrière intestinale
   └── Augmentation du BDNF (via le nerf vague)
   ↓
NERF VAGUE (communication bidirectionnelle)
   ↓
CERVEAU : humeur stable, stress réduit, sommeil amélioré
\`\`\`

Les **SCFA** (*short-chain fatty acids*) sont le carburant privilégié des colonocytes (cellules du côlon) et des signaux reconnus par des récepteurs sur le nerf vague, les cellules immunitaires et les cellules entéroendocrines.

## Les 4 mécanismes d'action

### 1. Métabolites bactériens (SCFA)

- **Butyrate** — carburant principal des colonocytes, activité anti-inflammatoire (inhibition de HDAC), effets documentés sur la neuroprotection et la plasticité.
- **Propionate** et **acétate** — régulation de la glycémie, du cholestérol, signal de satiété via le nerf vague.

### 2. Neurotransmetteurs locaux

Le microbiote et les cellules entérochromaffines produisent sérotonine, GABA et dopamine **dans l'intestin**. Ces molécules n'atteignent pas le cerveau directement : elles agissent localement sur les récepteurs intestinaux, qui relaient l'information au nerf vague.

### 3. Nerf vague — le câble bidirectionnel

\`\`\`
Microbiote → Métabolites → Récepteurs intestinaux → Nerf vague → Cerveau
\`\`\`

Effets mesurés d'une stimulation vagale "positive" (alimentation, respiration lente, exposition au froid, méditation) :

- Baisse d'activité de l'**amygdale** (circuit de la peur / stress).
- Hausse d'**acétylcholine** parasympathique (état de calme).
- Hausse de la **variabilité de la fréquence cardiaque** (HRV) — marqueur indirect du tonus vagal.

### 4. Voie immunitaire

\`\`\`
Microbiote équilibré → Tolérance immunitaire maintenue
Microbiote appauvri → Perméabilité intestinale ↑ → Inflammation systémique
\`\`\`

L'inflammation chronique de bas grade augmente les cytokines pro-inflammatoires (**IL-6**, **TNF-α**, **IL-1β**). Ces cytokines peuvent traverser partiellement la BHE et **perturber la neurotransmission** — mécanisme central dans la recherche actuelle sur dépression inflammatoire et fatigue chronique.

## Les 3 voies de neurotransmetteurs

### Voie 1 — Tryptophane → sérotonine

\`\`\`
Tryptophane (œufs, volaille, poisson, soja, noix, graines)
   ↓
Cellules entérochromaffines + microbiote
   ↓
SÉROTONINE (5-HT)
\`\`\`

- ~90 % de la sérotonine corporelle est **produite dans l'intestin**.
- Cette sérotonine périphérique ne traverse **pas** la BHE — elle régule le transit, la motilité et active les récepteurs vagaux localement.
- En revanche, le **tryptophane** traverse la BHE et sert de substrat à la synthèse de sérotonine **cérébrale**.

**Effet fonctionnel** : calme, régulation émotionnelle, transit.

### Voie 2 — Glutamate → GABA

\`\`\`
Glutamate (protéines alimentaires)
   ↓
Bactéries intestinales (Lactobacillus, Bifidobacterium)
   ↓
GABA (acide gamma-aminobutyrique)
\`\`\`

- Le **GABA** est le principal neurotransmetteur inhibiteur du système nerveux central.
- Produit par certaines bactéries intestinales, il n'atteint pas non plus directement le cerveau.
- Son effet "apaisant" central passe par l'activation du nerf vague et la modulation de l'inflammation.

**Effet fonctionnel** : relaxation, baisse de l'anxiété, calme du système nerveux.

### Voie 3 — Tyrosine → dopamine / noradrénaline

\`\`\`
Tyrosine (viandes, produits laitiers, œufs, légumineuses)
   ↓
DOPAMINE → NORADRÉNALINE → ADRÉNALINE
\`\`\`

- Certaines bactéries intestinales produisent de la dopamine localement.
- La **tyrosine**, elle, traverse la BHE et sert à la synthèse dopaminergique **cérébrale**.
- Effet local + effet central.

**Effet fonctionnel** : motivation, vigilance, régulation du stress.

## Ce qui traverse la BHE (et ce qui reste local)

| Molécule | Traverse la BHE ? | Action |
|---|---|---|
| Sérotonine | Non | Active le nerf vague localement |
| GABA | Non | Active le nerf vague localement |
| Dopamine (périphérique) | Non | Effet intestinal local |
| **Tryptophane** | Oui | Devient sérotonine cérébrale |
| **Tyrosine** | Oui | Devient dopamine cérébrale |
| Butyrate | Partiellement | Effets anti-inflammatoires centraux |
| Cytokines inflammatoires | Partiellement | Perturbent la neurotransmission |

**Règle pratique** : pour moduler la neurochimie cérébrale par l'alimentation, ce sont les **précurseurs** (acides aminés, vitamines B cofacteurs) et l'**inflammation systémique** qu'il faut viser — pas les neurotransmetteurs finis produits dans l'intestin.

## Leviers alimentaires concrets

### Nourrir les bactéries productrices de SCFA

- **Fibres solubles fermentescibles** : avoine, orge, légumineuses, pomme, poireau, oignon, ail, asperge, topinambour, banane verte.
- **Amidon résistant** : riz / pâtes / pommes de terre **refroidis** (après cuisson puis réfrigération — l'amidon se recristallise).
- **Polyphénols** : baies, thé vert, cacao, olives — substrats secondaires du microbiote.

### Apporter les précurseurs

- **Tryptophane** → œufs, volaille, poisson, soja, noix, graines de courge.
- **Tyrosine** → volaille, œufs, produits laitiers, légumineuses, graines.
- **Cofacteurs** : B6, B9 (folate), B12, magnésium, fer, zinc — indispensables à la synthèse des neurotransmetteurs.

### Réduire ce qui agresse l'axe

- Sucres raffinés et aliments ultra-transformés (dysbiose, inflammation).
- Alcool (perméabilité intestinale, neuroinflammation).
- Antibiotiques à large spectre quand évitables (appauvrissement du microbiote).

### Leviers non alimentaires qui modulent le nerf vague

- Respiration lente (≤ 6 respirations/min) — augmente la HRV.
- Exposition brève au froid (douche froide, immersion).
- Activité physique régulière d'endurance modérée.
- Sommeil suffisant et régulier.

## Schéma de synthèse

\`\`\`
ALIMENTATION (fibres, tryptophane, glutamate, tyrosine, polyphénols)
   ↓
MICROBIOTE INTESTINAL (fermentation + biosynthèse)
   ↓
   ├── SCFA (butyrate, propionate, acétate)
   ├── Sérotonine locale
   ├── GABA local
   └── Dopamine locale + précurseurs pour le cerveau
   ↓
   ├── Activation du NERF VAGUE → cerveau plus calme
   ├── ↓ INFLAMMATION → neurotransmission plus stable
   ├── ↑ BDNF → plasticité neuronale
   └── ↓ CORTISOL → résilience au stress
   ↓
EFFETS CÉRÉBRAUX
   ├── Humeur stabilisée
   ├── Anxiété réduite
   ├── Sommeil amélioré
   └── Meilleure résilience au stress
\`\`\`

## À retenir

- Le microbiote agit comme un **organe endocrinien et immunitaire**, pas comme une usine qui envoie directement des neurotransmetteurs au cerveau.
- Les **SCFA**, le **nerf vague**, la **régulation de l'inflammation** et les **précurseurs d'acides aminés** sont les quatre canaux de communication principaux.
- Distinguer *signal local* (sérotonine, GABA, dopamine intestinaux) et *signal central* (via tryptophane / tyrosine qui traversent la BHE) évite les raccourcis commerciaux.
- Sur le terrain, ça se résume à trois choses : **fibres variées**, **protéines de qualité**, **inflammation basse**.

## Pour aller plus loin

- L'article [Alimentation et cerveau : guide des 8 piliers](/blog/alimentation-cerveau-guide) donne les aliments concrets par pilier cérébral.
- L'article [Humectants, émollients, occlusifs](/blog/humectants-emollients-occlusifs) couvre un autre type de "barrière" — la peau, comparable dans son rôle sélectif.

---

*Ce guide est un panorama scientifique général. Pour tout trouble digestif, cognitif ou psychiatrique, l'évaluation par un professionnel de santé reste indispensable.*
`,
}
