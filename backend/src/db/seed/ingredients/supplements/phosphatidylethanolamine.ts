import { INGREDIENT_TYPES, SUPPLEMENT_CATEGORIES } from '@habit-tracker/shared'
import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../seed-ingredients'

export const PHOSPHATIDYLETHANOLAMINE: IngredientInput[] = [
  {
    name: 'Phosphatidylethanolamine (PE)',
    slug: INGREDIENT_SLUGS.PHOSPHATIDYLETHANOLAMINE,
    type: INGREDIENT_TYPES.SUPPLEMENT,
    category: SUPPLEMENT_CATEGORIES.ACIDE_GRAS,
    description:
      "Phospholipide structural majeur des membranes cellulaires et mitochondriales. Implique dans l'autophagie, la fusion membranaire et la synthese de phosphatidylserine.",
    content: `
# Phosphatidylethanolamine (PE)

## Identite et biochimie

La phosphatidylethanolamine (PE) est le deuxieme phospholipide le plus abondant dans les membranes cellulaires des mammiferes (apres la phosphatidylcholine). Elle represente 20-50% des phospholipides totaux selon le tissu, avec une concentration particulierement elevee dans les membranes mitochondriales internes et le tissu nerveux.

**Structure :** squelette glycerol, deux chaines d'acides gras (souvent insatures en position sn-2), et un groupe tete ethanolamine. Sa petite tete polaire confere une geometrie conique qui favorise la courbure membranaire.

**Localisation :** principalement dans le feuillet interne de la membrane plasmique. Son externalisation sur le feuillet externe est un signal de coagulation (activation plaquettaire) et d'apoptose.

## Biosynthese

### Quatre voies principales

1. **Voie CDP-ethanolamine (Kennedy pathway) :** voie principale dans le reticulum endoplasmique. Ethanolamine → phosphoethanolamine → CDP-ethanolamine → PE.
2. **Decarboxylation de la phosphatidylserine (PSD) :** dans la membrane interne des mitochondries. PS → PE. Source majeure de PE mitochondriale.
3. **Acylation de la lysophosphatidylethanolamine**
4. **Echange calcium-dependant de base** (mineur)

La PE est aussi un precurseur de la phosphatidylserine via la PSS1 (echange de base dans le reticulum endoplasmique).

## Fonctions biologiques

### Structure et courbure membranaire

La geometrie conique de la PE cree une tension dans la bicouche lipidique, essentielle pour la courbure membranaire, la fission et la fusion des vesicules, la division cellulaire (cytocinese) et le bourgeonnement des vesicules de transport.

### Autophagie

La PE est le lipide d'ancrage de LC3/Atg8, proteine cle de la formation des autophagosomes. Sans PE suffisante, le processus d'autophagie (recyclage cellulaire) est compromis. La conjugaison LC3-PE est un marqueur standard de l'activite autophagique.

### Fonction mitochondriale

Composant majeur de la membrane interne mitochondriale. Un deficit en PE mitochondriale entraine des defauts de la chaine respiratoire, une fragmentation mitochondriale et une reduction de la production d'ATP.

### Fusion membranaire

Facilite la fusion des vesicules synaptiques (neurotransmission) et des membranes intracellulaires. Essentielle au trafic vesiculaire et a la secretion.

### Coagulation

L'externalisation de la PE sur les plaquettes activees fournit une surface catalytique pour l'assemblage des complexes de coagulation (tenase et prothrombinase).

### Precurseur metabolique

- Substrat pour la synthese de phosphatidylserine (PSS1)
- Source d'ethanolamine pour la modification post-traductionnelle de proteines (ancres GPI)
- Substrat de la N-acylethanolamine, precurseur des endocannabinoides (anandamide)

## Sources alimentaires

| Aliment (100 g) | PE (mg) |
|---|---|
| Soja | 300-400 |
| Poissons gras (maquereau, hareng, sardine) | 200-300 |
| Oeufs entiers | 200-300 |
| Viandes (boeuf, poulet, porc) | 150-250 |
| Germe de ble | ~200 |
| Noix, graines de lin | 100-200 |

L'alimentation omnivore typique fournit des quantites significatives de PE. Les abats (foie, cervelle) sont particulierement riches.

## Supplementation

### Statut

La PE n'est pas couramment supplementee de maniere isolee. Elle est presente dans les supplements de lecithine (soja, tournesol) et dans certains complexes phospholipidiques.

### Interet potentiel

- **Soutien de l'autophagie :** la PE est limitante pour la formation des autophagosomes. Un apport suffisant pourrait soutenir le recyclage cellulaire, particulierement avec l'age.
- **Fonction mitochondriale :** maintien de l'integrite des membranes mitochondriales.
- **Sante neuronale :** composant structural des membranes synaptiques.

### Donnees cliniques

Les preuves cliniques de benefices d'une supplementation isolee en PE sont tres limitees. La plupart des etudes portent sur des complexes phospholipidiques (lecithine, PS + PE) plutot que sur la PE seule.

## Securite

Bien toleree comme composant alimentaire naturel. Pas de toxicite rapportee aux doses alimentaires. Donnees sur la supplementation a haute dose limitees.

## Synergies

- Phosphatidylserine (metabolisme interconnecte via PSS1 et PSD)
- Phosphatidylcholine (equilibre phospholipidique membranaire)
- Omega-3 DHA (enrichissement des chaines acyl en position sn-2)

## Limites de la recherche

- Pas d'essais cliniques randomises sur la PE isolee
- Benefices de la supplementation vs. apport alimentaire non etablis
- Role dans l'autophagie humaine encore principalement etudie in vitro et sur modeles animaux
`,
  },
]
