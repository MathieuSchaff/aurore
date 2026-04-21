import type { ArticleInput } from '../seed-articles'

export const shampoingsCheveuxBouclesBenchmark: ArticleInput = {
  title: 'Shampoings cheveux bouclés : benchmark 14 produits (douceur, INCI, prix au litre)',
  slug: 'shampoings-cheveux-boucles-benchmark',
  category: 'haircare',
  excerpt:
    "Comparatif de 14 shampoings cheveux bouclés/ondulés/crépus : analyse des tensioactifs (sulfates vs doux), classement par douceur, prix au litre, et recommandations selon la fréquence de lavage. Inclut Les Secrets de Loly, Olaplex, L'Oréal Pro, Hairlust, Énergie Fruit, Kérastase et + le conditioner Olaplex N°5.",
  publishedAt: null,
  content: `## Comment lire un INCI de shampoing

Le **tensioactif principal** (en 2ᵉ ou 3ᵉ position après l'eau) détermine la douceur globale. Du plus doux au plus décapant :

| Famille | Exemples INCI | Douceur |
|---|---|---|
| **Aminés / amphotères doux** | Sodium Cocoamphoacetate, Disodium Cocoyl Glutamate, Sodium Lauroyl Methyl Isethionate, Sodium Cocoyl Isethionate | ⭐⭐⭐⭐⭐ |
| **Glucosides** | Lauryl Glucoside, Decyl Glucoside, Coco-Glucoside | ⭐⭐⭐⭐ |
| **Bétaïnes** | Cocamidopropyl Betaine, Coco-Betaine | ⭐⭐⭐ (co-tensioactifs) |
| **Oléfines sulfonates** | Sodium C14-16 Olefin Sulfonate | ⭐⭐ |
| **Sulfates** | **Sodium Laureth Sulfate (SLES)**, Sodium Lauryl Sulfate (SLS) | ⭐ (décapant) |

**Indicateurs bonus** : Guar Hydroxypropyltrimonium Chloride (film anti-friction), Panthenol (réparation), extraits botaniques (nutrition).

---

## 🟢 Les plus doux (2 lavages/semaine ou plus)

### Hairlust — Grow Perfect (250 ml, 26 € → 104 €/L)

INCI très court, 100 % tensioactifs doux + aloe vera + huile de romarin. Pas de silicones. **Un des plus cleans du marché**, mais le prix/L est élevé.

### Volume Wizard™ (250 ml, 30 € → 120 €/L)

Base Malus Domestica Fruit Water + Lauryl Glucoside + Disodium Cocoyl Glutamate. Hydrolyzed Wheat Protein + inuline + avena sativa. Bio. Le plus cher de la sélection.

### Les Secrets de Loly — Perfect Match (250 ml, 17 € → 68 €/L)

Base Sodium Cocoamphoacetate + Lauryl Glucoside + Disodium Cocoyl Glutamate. Hydrolyzed Wheat Protein (fixation sur zones endommagées) + extraits de banane, cacao, ananas. **Meilleur compromis qualité/prix** des cleans.

### Yves Rocher — Shampooing Définissant Boucles sans sulfate (300 ml, 4,99 € → 16,6 €/L)

Base Sodium Methyl Cocoyl Taurate + Cocamidopropyl Betaine + Sodium Cocoyl Isethionate. Fructooligosaccharides + inuline + Hydrolyzed Linseed Extract. **Imbattable niveau prix** pour un sans-sulfate correct.

### Wella Nutricurls (~250 ml, 13 €)

Cocamidopropyl Betaine + Sodium Methyl Oleoyl Taurate. Panthénol + huile de jojoba + germe de blé + thé vert. Correct pour une marque pro.

### Biolage R.A.W. Nourish

Base Sodium Cocoyl Isethionate. Chenopodium quinoa + miel. ~22-25 € / 250 ml (~100 €/L).

---

## 🟡 Intermédiaires (alternance, plus techniques)

### Énergie Fruit — Coco & Karité sans sulfate (250 ml, 4 € → 16 €/L)

Base Sodium Lauroyl Methyl Isethionate + Caprylyl/Capryl Glucoside + Coco-Betaine. Beurre de karité + huile de coco bio. **Rapport prix imbattable**, petit bémol = conservateur Glyoxal.

### Olaplex (250 ml, 24-32 € → 96-128 €/L)

Sodium Lauroyl Methyl Isethionate + Cocamidopropyl Hydroxysultaine + Potassium Cocoyl Glycinate. Contient la **Bis-Aminopropyl Diglycol Dimaleate** (molécule signature Olaplex, réparation des ponts disulfure). Panthénol + huile d'argan + thé vert + grenade. Technique, réparateur, riche. **Cher mais valeur ajoutée si cheveux abîmés**.

### L'Oréal Pro — Curl Expression (300 ml, 15,90 € → 53 €/L)

Sodium Cocoyl Isethionate + Disodium Laureth Sulfosuccinate + Sodium Lauryl Sulfoacetate + Sodium Lauroyl Sarcosinate. Base mixte. Hibiscus + salicylic acid. Correct pour du pro.

### L'Oréal Pro — Metal Detox (1 500 ml, 39,43 € → 26 €/L)

Même base que Curl Expression. Cheveux colorés / post-traitement chimique. **Très économique par litre** grâce au format 1,5 L.

---

## 🔴 Les plus agressifs (clarifiants ou à éviter en routine)

### Kérastase — Curl Manifesto (250 ml, 28 € → 112 €/L)

**Sodium C14-16 Olefin Sulfonate** (fort pouvoir lavant). Cher + pas si doux. À réserver clarifiant.

### John Frieda — Frizz Ease (~250 ml, 9 €)

Sodium C14-16 Olefin Sulfonate + **Methylchloroisothiazolinone / Methylisothiazolinone** (conservateurs irritants, sensibilisants connus). Décapant.

### Redken — Curvaceous High Foam (~300 ml, ~20 € → 66 €/L)

Sodium Cocoyl Isethionate + Disodium Laureth Sulfosuccinate + Cocamidopropyl Betaine + SLSA + Sodium Lauroyl Sarcosinate + **Methylchloroisothiazolinone**. Mousse, plutôt agressif.

### Garnier — Ultra Doux Avocat & Karité (600 ml, 8,99 € → 14,9 €/L)

Base **Sodium Laureth Sulfate**. Très économique mais décapant (le nom "Ultra Doux" est trompeur).

### L'Oréal Elseve — Boucles Sublimes (250 ml, 4,42 € → 17,6 €/L)

**SLES + colorants + parfum**. Pas cher, agressif.

---

## Synthèse

| Objectif | Choix |
|---|---|
| **Usage quotidien / doux** | Hairlust, Volume Wizard, Les Secrets de Loly, Yves Rocher Boucles sans sulfate |
| **Prix plancher + acceptable** | Yves Rocher (16,6 €/L), Énergie Fruit (16 €/L) |
| **Réparation (cheveux abîmés)** | Olaplex |
| **Usage ponctuel / clarifiant** | Garnier, Elseve, John Frieda, Redken |
| **À éviter en routine** | Tout SLES + MIT/MCI |

---

## Bonus — Olaplex N°5 Bond Maintenance Conditioner

Après-shampoing Olaplex (250 ml, 32 €). Compléte le shampooing N°4 sur le volet conditionnement.

**Actifs clés** :

- **Bis-Aminopropyl Diglycol Dimaleate** — signature Olaplex, répare les ponts disulfure cassés par la chaleur ou les colorations.
- **Panthénol + phospholipides** — réparation fibre + hydratation cortex.
- **Behentrimonium Chloride + Cetrimonium Chloride** — conditionneurs cationiques qui lissent la cuticule.
- **Hyaluronate de sodium hydrolysé** — hydratation profonde.
- **Huile d'argan fermentée + thé vert fermenté + açaï + grenade + noni + bardane** — actifs nutritifs et antioxydants.

**À considérer si** : cheveux colorés, décolorés, chauffés régulièrement, ou fragilisés par traitements chimiques.

---

## Règles pratiques

1. **Fréquence** : 1-2 lavages/semaine pour cheveux bouclés/secs, 3×/semaine max pour cheveux mixtes.
2. **Doux en quotidien, clarifiant occasionnel** : alterner, ne pas laver tous les jours avec un décapant.
3. **Chercher sur l'INCI** : pas de SLS/SLES en tête, pas de MIT/MCI, bonus pour le guar HPTC + panthénol.
4. **Prix au litre** > prix nominal : le 4 € / 300 ml bat souvent le 28 € / 250 ml en rapport qualité/€.
`,
}
