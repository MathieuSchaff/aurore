import { INGREDIENT_TYPES, SKINCARE_INGREDIENT_CATEGORIES } from '@habit-tracker/shared'

import { INGREDIENT_SLUGS } from '../ingredient-slugs'
import type { IngredientInput } from '../types'

export const HAIR_TENSIOACTIFS_CATIONIQUES: IngredientInput[] = [
  {
    name: 'Behentrimonium Chloride',
    slug: INGREDIENT_SLUGS.BEHENTRIMONIUM_CHLORIDE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Tensioactif cationique C22 à longue chaîne, conditionneur puissant qui se dépose substantivement sur la fibre kératinique chargée négativement, réduisant la friction et les nœuds.',
    content: `
# Behentrimonium Chloride (BTAC-22)

Le behentrimonium chloride (chlorure de béhényltriméthylammonium) est un tensioactif quaternaire ammonium à chaîne béhénique (C22). Sa longue chaîne aliphatique lui confère un ancrage fort sur la kératine et des propriétés conditionnantes profondes.

## INCI
**BEHENTRIMONIUM CHLORIDE** (CAS: 17301-53-0 | COSING: 30610)

## Mécanisme d'action

### 1. Dépôt substantif électrostatique
La kératine capillaire est chargée négativement à pH physiologique. Le behentrimonium chloride, fortement cationique (charge quaternaire permanente), s'adsorbe par attraction électrostatique sur la fibre — dépôt durable, résistant au rinçage.

### 2. Effet conditionneur
La chaîne C22 déployée entre les écailles cuticulaires crée un film lubrifiant qui :
- Réduit le coefficient de friction de la fibre (–30 à –50% mesurable par tribologie)
- Facilite le démêlage, réduit la casse mécanique
- Apporte brillance et douceur tactile

### 3. Stabilisation de l'émulsion conditionnante
En association avec des alcools gras (cétéaryl alcool), le behentrimonium chloride forme des cristaux liquides lamellaires — structure gel qui stabilise les émulsions des après-shampooings et y libère progressivement les actifs.

### 4. Activité antimicrobienne modérée
Comme tous les quaternaires d'ammonium, antimicrobien à concentration élevée (>0,5%). À concentration cosmétique, cet effet est négligeable.

## Avantage vs Behentrimonium Methosulfate
Le chlorure présente une charge cationique plus marquée et une substantivité légèrement supérieure. Il peut cependant favoriser légèrement l'accumulation avec usage répété.

## Concentration d'usage
- Après-shampooings : 0,5–3%
- Masques capillaires : 1–4%
- Conditionneurs sans rinçage : 0,3–1%

> ⚠️ Incompatible avec les tensioactifs anioniques (précipitation). À utiliser exclusivement dans la phase conditionnante, jamais dans les shampoings.
`,
  },
  {
    name: 'Behentrimonium Methosulfate',
    slug: INGREDIENT_SLUGS.BEHENTRIMONIUM_METHOSULFATE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      "Tensioactif cationique C22 à contre-ion méthosulfate, conditionneur doux avec moindre risque d'accumulation que le chlorure, très utilisé dans les conditionneurs naturels et CG-friendly.",
    content: `
# Behentrimonium Methosulfate (BTMS)

Le behentrimonium methosulfate est le sel méthosulfate du béhényltriméthylammonium. Le contre-ion méthosulfate (CH₃SO₄⁻) au lieu du chlorure modifie significativement ses propriétés formulatoires et son profil d'accumulation.

## INCI
**BEHENTRIMONIUM METHOSULFATE** (CAS: 81646-13-1 | COSING: 30612)

Souvent commercialisé en mélange avec du cétéaryl alcool (INCI: **BEHENTRIMONIUM METHOSULFATE (AND) CETEARYL ALCOHOL**) — référence commerciale BTMS-50.

## Mécanisme d'action

### 1. Substantivité contrôlée
La charge cationique est légèrement moins forte que celle du chlorure en raison du contre-ion méthosulfate plus encombrant. Dépôt sur la kératine efficace mais plus facilement rincé à l'eau chaude — moins susceptible d'accumulation.

### 2. Emulsification auto-émulsifiante
Propriété distinctive : le BTMS est un émulsifiant cationique auto-émulsifiant. En présence d'alcools gras (fournis par le BTMS-50 ou ajoutés séparément), il forme spontanément des cristaux liquides lamellaires au simple mélange avec l'eau chaude — simplification formulatoire.

### 3. Conditionnement complet
Même mécanisme que le behentrimonium chloride : lubrification de la cuticule, réduction de friction, démêlage, brillance. Profil sensoriel légèrement plus léger.

## Popularité CG (Curly Girl Method)
Le BTMS est très prisé dans les formules CG-friendly car il conditionne efficacement les cheveux bouclés/crépus (qui nécessitent beaucoup de conditionneur) sans alourdir ni accumuler comme les silicones.

## Concentration d'usage
- Après-shampooings : 1–5% (BTMS seul) ou 3–10% (BTMS-50)
- Masques : 2–6%
- Leave-ins légers : 0,5–2%
`,
  },
  {
    name: 'Cetrimonium Chloride',
    slug: INGREDIENT_SLUGS.CETRIMONIUM_CHLORIDE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Tensioactif cationique C16 palmitique, conditionneur léger à déposition modérée, utilisé pour le démêlage et la douceur dans les après-shampooings et leave-ins.',
    content: `
# Cetrimonium Chloride (CTAC-16)

Le cetrimonium chloride (chlorure de cétyltriméthylammonium, CTAC) est un ammonium quaternaire à chaîne C16 cétylique. Chaîne plus courte que le behentrimonium (C22) → conditionnement plus léger, moins de risque d'accumulation.

## INCI
**CETRIMONIUM CHLORIDE** (CAS: 112-02-7 | COSING: 31676)

## Mécanisme d'action

### 1. Dépôt cationique modéré
La chaîne C16 s'adsorbe sur la kératine chargée négativement, mais avec une substantivité inférieure au C22. Le dépôt est plus superficiel et plus facilement rincé — adapté cheveux fins qui accumulent facilement.

### 2. Démêlage et réduction de friction
Film lubrifiant C16 entre les écailles : réduction de friction, facilitation du démêlage, réduction des nœuds. Moins puissant que le behentrimonium sur cheveux très secs mais suffisant pour cheveux normaux à légèrement abîmés.

### 3. Activité antimicrobienne
À concentrations >0,2%, antimicrobien documenté contre levures et bactéries — utilisé comme conservateur auxiliaire dans certaines formules.

### 4. Légèreté sensorielle
Après-rinçage léger, sans film lourd sur les cheveux fins. Idéal pour les après-shampooings "légèreté" et les démêlants en spray.

## Comparaison C16 vs C22

| Propriété | Cetrimonium (C16) | Behentrimonium (C22) |
|---|---|---|
| Dépôt | Modéré | Fort |
| Légèreté | Élevée | Faible |
| Cheveux fins | Oui | Non recommandé |
| Cheveux épais/secs | Insuffisant seul | Optimal |

## Concentration d'usage
0,1–1% dans après-shampooings et leave-ins légers ; jusqu'à 2% dans conditionneurs rincés.
`,
  },
  {
    name: 'Cetrimonium Bromide',
    slug: INGREDIENT_SLUGS.CETRIMONIUM_BROMIDE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      'Analogue bromure du cetrimonium chloride, conditionneur cationique C16 avec activité antimicrobienne marquée, utilisé dans les formules anti-pelliculaires et les défrisants.',
    content: `
# Cetrimonium Bromide (CTAB)

Le cetrimonium bromide (bromure de cétyltriméthylammonium, CTAB) est l'analogue bromure du cetrimonium chloride. Le contre-ion bromure confère une activité antimicrobienne légèrement supérieure.

## INCI
**CETRIMONIUM BROMIDE** (CAS: 57-09-0 | COSING: 31677)

## Mécanisme d'action

### 1. Conditionnement identique au CTAC
Même chaîne C16 cétylique → mécanisme de dépôt sur kératine identique. Réduction de friction, démêlage, douceur.

### 2. Antimicrobien supérieur au chlorure
Le bromure (Br⁻) favorise une déstabilisation membranaire légèrement plus efficace contre les micro-organismes que le chlorure (Cl⁻). Activité antifongique documentée contre *Malassezia furfur* (principale levure impliquée dans les pellicules) à des concentrations >0,1%.

### 3. Usage dermo-cosmétique
Plus souvent rencontré dans des formules thérapeutiques ou para-pharmaceutiques (traitements pelliculaires, lotions antifongiques) que dans les conditionneurs grand public.

## Limitation réglementaire
Concentrations cosmétiques réglementées. En UE, usage limité et concentration maximale encadrée (Annexe III du Règlement cosmétiques).

## Concentration d'usage
0,1–0,5% dans formules anti-pelliculaires ; 0,5–2% dans conditionneurs spécialisés.
`,
  },
  {
    name: 'Stearalkonium Chloride',
    slug: INGREDIENT_SLUGS.STEARALKONIUM_CHLORIDE,
    type: INGREDIENT_TYPES.HAIRCARE,
    category: SKINCARE_INGREDIENT_CATEGORIES.TENSIOACTIF,
    description:
      "Tensioactif cationique C18 benzylique (alkylbenzyl ammonium), conditionneur puissant hérité des assouplissants textiles, fort dépôt sur la fibre mais risque accru d'accumulation.",
    content: `
# Stearalkonium Chloride

Le stearalkonium chloride est un chlorure d'alkylamonium quaternaire à chaîne stéarylique (C18) et groupe benzyle. Il a été initialement développé comme agent antistatique et conditionneur pour l'industrie textile avant d'être adopté en cosmétique capillaire.

## INCI
**STEARALKONIUM CHLORIDE** (CAS: 122-19-0 | COSING: 57576)

## Mécanisme d'action

### 1. Dépôt substantif fort
La combinaison chaîne C18 + groupe benzyle génère une très forte adsorption sur la kératine. Le groupe benzyle confère une "adhérence" supplémentaire par interactions hydrophobes/aromatiques avec la matrice protéique.

### 2. Antistatique puissant
Neutralise les charges négatives de la fibre capillaire, éliminant l'électricité statique. Propriété particulièrement utile par temps sec ou après brushing.

### 3. Film conditionneur dense
Le dépôt C18 forme un film dense sur la cuticule — lissage, brillance, douceur tactile marqués. Comparé au behentrimonium, l'effet est plus "lourd" sur le cheveu.

### 4. Antimicrobien
Comme tous les quaternaires benzyle, activité antimicrobienne large spectre à concentrations >0,1%.

## Controverse formulatoire
Le stearalkonium chloride a une longue histoire de critiques :
- Utilisé comme substitut bon marché aux protéines hydrolysées dans les conditionneurs bas de gamme des années 1980–2000
- Peut alourdir les cheveux et s'accumuler avec usage répété
- Moins présent dans les formules modernes haut de gamme, remplacé par behentrimonium methosulfate ou cationiques naturels

## Concentration d'usage
0,2–2% dans après-shampooings et masques. Rarement au-delà de 2% dans les formules modernes.
`,
  },
]
