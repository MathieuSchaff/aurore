# INCI alphabetical drift — audit & sources

> Audit conduit le 2026-05-11 lors d'investigation du gap détecteur position-based (texture-riche / AHA / butters top 8).
> Conclusion : ~368 produits skincare ont leur INCI **trié alphabétiquement** au lieu de **par concentration décroissante**, ce qui invalide tous les détecteurs position-based.

---

## 1. Symptôme

Les détecteurs auto-tags (`detectTextureRiche`, `detectActifClasses` AHA/BHA cap, `detectFiniMat` etc.) scannent les premiers N tokens d'un INCI sur l'hypothèse standard : **un INCI est ordonné par concentration décroissante** (norme ISO 22716 + Règlement UE 1223/2009 art. 19§1.g pour les ingrédients > 1%).

Sur 368 produits skincare, cette hypothèse est cassée — l'INCI commence par `12-hexanediol, allantoin, arginine, betaine, ...` (ordre alphabétique strict, pas concentration). Les actifs fonctionnels et butters/oils peuvent se trouver à n'importe quelle position selon leur première lettre.

Exemple :
```
COSRX AHA 7 Whitehead Power Liquid (DB) :
  1,2-HEXANEDIOL, BUTYLENE GLYCOL, ETHYL HEXANEDIOL, GLYCOLIC ACID,
  NIACINAMIDE, PANTHENOL, PYRUS MALUS (APPLE) FRUIT WATER,
  SODIUM HYALURONATE, SODIUM HYDROXIDE, XANTHAN GUM
```
1 → B → E → G → N → P → P → S → S → X. Acide glycolique en position 4 alphabétique alors que le produit affiche "AHA 7" sur l'étiquette (7% glycolic acid = ingrédient majoritaire après l'eau, position concentration ≈ 2-3).

---

## 2. Cause racine

Source de scraping : **[skinsafeproducts.com](https://www.skinsafeproducts.com)** (alias Skinsafe.com).

Skinsafe est un service américain spécialisé dans la détection d'allergènes cosmétiques (NEA Seal of Acceptance, label dermatologique). Leur interface produit affiche **l'INCI trié alphabétiquement par design** — l'utilisateur cherche un allergène spécifique dans une liste, l'ordre alphabétique facilite le scan visuel. Ce n'est pas un bug, c'est une choix UX explicite de leur part.

Le scraper aurore a fetché l'INCI directement depuis Skinsafe HTML/API, sans détecter la transformation. Les URLs source dans les seeds Aurore confirment l'origine :

```ts
// backend/src/db/seed/products/cosrx/cosrx.seed.ts (commit d1db35e3, 2026-04-11)
{
  slug: 'cosrx-low-ph-good-morning-gel-cleanser',
  inci: '1,2-HEXANEDIOL, ALLANTOIN, BETAINE SALICYLATE, BUTYLENE GLYCOL, CAPRYLYL GLYCOL, CITRIC ACID, COCAMIDOPROPYL BETAINE, CRYPTOMERIA JAPONICA LEAF EXTRACT, ...',
  url: 'https://www.skinsafeproducts.com/cosrx-low-ph-good-morning-gel-cleanser-150ml-0',
  imageUrl: 'https://cdn1.skinsafeproducts.com/photo/82C826A51257AF/large_1487718603.jpeg',
}
```

Pas un bug script de transformation côté Aurore. Pas un bug de l'auto-tag detector. Choix de source.

---

## 3. Scope

Décompte (2026-05-11) :

| Métrique | Count |
|---|---|
| Total produits Aurore sourcés Skinsafe | **541** |
| Dont skincare | **513** |
| Skincare détectés alphabetical par `isAlphabeticalINCI` | **368** |
| Reste skinsafe non-alphabetical (INCI court / cas limites du détecteur) | ~145 |

La discordance 513 vs 368 s'explique par le seuil du détecteur `isAlphabeticalINCI` (ingredient-resolver.ts:62) : 5 tokens minimum + non-décroissants + ≥3 premières lettres distinctes. Les INCI très courts (< 5 tokens) ou avec doublons de première lettre passent sous le radar.

---

## 4. Marques affectées

39 marques au total, 4 produits exemples par marque (ordre alphabétique). Total cumulé = 513.

### Top 15 (cluster K-beauty + EU modernes)

#### COSRX (65)
- AC Collection Calming Foam Cleanser
- AC Collection Calming Liquid Mild
- AC Collection Ultimate Spot Cream
- Advanced Snail Mucin Gel Cleanser

#### Medik8 (35)
- Advanced Day Eye Protect
- Advanced Night Ceramide
- Advanced Night Rejuvenating Eye Cream
- Advanced Night Restore Cream

#### Medicube (32)
- AGE-R Glutathione Glow Serum
- AGE-R Glutathione Glow Toner
- Azelaic Acid 16 BB Calming Serum
- Collagen Jelly Cream (V2)

#### Missha (29)
- Airy Fit Sheet Mask Aloe
- Airy Fit Sheet Mask Shea Butter
- Airy Fit Sheet Mask Tea Tree
- A'Pieu Icing Sweet Bar Sheet Mask Pineapple

#### SKIN1004 (28)
- Ampoule Foam Madagascar Centella
- Centella Poremizing Fresh Ampoule
- Hyalu-Cica Cloudy Mist
- Madagascar Centella Asiatica 100 Ampoule

#### Anua (27)
- 100+ PDRN + Hyaluron Serum
- Azelaic Acid 10% Hyaluron Redness Soothing Serum
- Birch 70 Moisture Boosting Toner
- Brightening Pad Niacinamide 5% + TXA

#### Mixsoon (23)
- Bean Cleansing Oil
- Bean Cream
- Bean Essence
- Bean Toner Pad

#### Beauty of Joseon (19)
- Apricot Blossom Peeling Gel
- Calming Serum Green Tea + Panthenol
- Centella Asiatica Calming Mask
- Dynasty Cream

#### Round Lab (19)
- 1025 Dokdo Cleanser
- 1025 Dokdo Cleansing Milk
- 1025 Dokdo Cleansing Oil
- 1025 Dokdo Light Cream

#### Vichy Laboratories (18)
- Aqualia Thermal Awakening Eye Cream
- Aqualia Thermal Fragrance Free Cream
- Liftactiv Collagen Specialist 16 Serum
- Liftactiv Eye Cream, 5 % Complex Pro - Collagen

#### Prequel (16)
- 5% Ectoin Cream
- AM/PM Modern Moisturizer
- Gleanser + Sa Non-drying Salicylic Acid Cleanser
- Half & Half Fluid Moisturizer

#### Purito (16)
- Bamboo Panthenol Cream
- Centella Eye Cream
- Centella Green Level Buffet Serum
- Centella Green Level Calming Toner

#### Torriden (13)
- Balanceful Centella Asiatica Mask
- Balanceful Centella Modeling Pack
- Cellmazing Brightening Vitamin C Mask
- Cellmazing Firming Gel Mask

#### Pai Skincare (12)
- All Day Hydration Moisturizer Cream, Avocado & Jojoba
- Bio Regenerate Oil, Rosehip Seed & Fruit
- Bring Sensitive Skin Back To Life Serum
- Calming Day Cream, Chamomile & Rosehip

#### Haruharu (11)
- Black Rice Bakuchiol Eye Cream
- Black Rice Facial Oil
- Black Rice Hyaluronic Cream
- Black Rice Hyaluronic Toner for Sensitive Skin

### Mid-tier (5-12 produits)

#### Some By Mi (11)
- 30 Days Miracle Clear Spot Patch
- AHA BHA PHA 14 Days Super Miracle Spot All Kill Cream
- AHA BHA PHA 30 Days Miracle Serum
- AHA BHA PHA 30 Days Miracle Toner

#### Ducray (10)
- Dexyane Med Soothing Repair Cream
- Dexyane Protective Cleansing Oil
- Dexyane Ultra-Rich Cleansing Gel
- Kelual DS Face & Body Foaming Gel

#### numbuzin (10)
- No.1 Centella Re-Leaf Green Toner Pad
- No.1 Easy Peasy Cleansing Oil
- No.1 Pantothenic B5 Active Soothing Cream
- No.1 Toner

#### Abib (9)
- Acne Heartleaf Foam Cleanser
- Collagen Gel Mask, Heart Leaf Jelly
- Glutathiosome Dark Spot Pads
- Glutathiosome Dark Spot Serum

#### Dr. Jart+ (9)
- Ceramidin Lip Balm
- Ceramidin Skin Barrier Moisturizer Face Cream
- Cicapair Intensive Soothing Repair Treatment Lotion
- Cicapair Tiger Grass Color Correcting Treatment

#### Etude House (9)
- Berry AHA Bright Peel Mild Gel
- Moistfull Collagen Cream
- SoonJung 10 Free Moist Emulsion
- SoonJung 2x Barrier Intensive Cream

#### IsNtree (9)
- Chestnut AHA Clear Essence
- Hyaluronic Acid Aqua Gel Cream
- Hyaluronic Acid Low-Ph Cleansing Foam
- Hyaluronic Acid Moist Cream

#### Iunik (9)
- Beta-Glucan 3X Barrier Cream
- Beta Glucan Daily Moisture Cream
- Beta-Glucan Power Moisture Serum
- Calendula Complete Deep Cleansing Oil

#### NIOD (9)
- Copper Amino Isolate Serum
- Ethylated L-Ascorbic Acid 30% Network
- Flavanone Mud Mask
- Fractionated Eye-Contour Concentrate

#### Dermalogica (8)
- Biolumin-C Serum
- Daily Microfoliant
- Daily Superfoliant
- Precleanse

#### Dieux (8)
- Air Angel Hydrating Facial Gel Cream
- Auracle Reviving Eye Gel
- Baptism Gentle Foaming Facial Gel Cleanser
- Barrier Blanket Restorative Balm

#### Dr.Althea (8)
- 0.1% Gentle Retinol Serum
- 345 Relief Cream
- Gentle Serum Vitamin C
- Jelly Seal Dewy Mask

#### Receutics Active Skin Repair (7)
- Acne Clearing
- Gentle Hydrating Cleanser
- Rapid Wrinkle Corrector
- Step 1: Clear Skin Cleanser

#### Innisfree (6)
- Cherry Blossom Glow Jelly Cream
- Green Tea Seed Hyaluronic Acid Cream
- Green Tea Seed Serum
- Retinol Cica Repair Ampoule

#### Shiseido (6)
- Benefiance Contour des Yeux Anti-Rides
- Benefiance Crème de Jour Lissante Anti-Rides
- Benefiance Crème Lissante Anti-Rides
- Ultimune Sérum Concentré Activateur

#### Aestura (5)
- Atobarrier 365 Bubble Cleanser
- Atobarrier 365 Cream
- Atobarrier 365 Hydro Soothing Cream
- Atobarrier 365 Lotion

### Long-tail (1-4 produits)

#### Air Repair (3)
- Complexion Boosting Moisturizer
- Rescue Balm All-Purpose Skin Salve & Lip Balm
- Super-Hydrating Eye Cream

#### Power Repair (3)
- Power Repair Hydrating and Soothing Facial Toner
- Power Repair Multi-Action Eye Lift
- Power Repair Skin Serum

#### SK-II (3)
- Brightening Derm Revival Mask
- Facial Treatment Essence
- Skinpower Cream

#### Sol de Janeiro (3)
- Brazilian Kiss Cupuaçu Lip Butter
- Bum Bum Firmeza Body Oil
- Glow Oils Color Copacabana Bronze

#### Propaira (2)
- Extra Strength Serum, Hyaluronic Acid
- Skin Defense Serum, 10% Niacinamide

#### Barrier Repair (1)
- Barrier Repair Sheet Mask

#### Lion Pair (1)
- Acne Cream

#### Repair Beauty (1)
- Under Eye Patches, Hyaluronic Acid & Niacinamide

---

## 5. Sources data propres potentielles

Inventaire des alternatives par marque, par ordre de praticité pour re-scraper :

### 5.1 Korean-skincare.fr (couverture maximale K-beauty)

Source : déjà scrappée et présente dans `backend/src/db/seed/data/korean-skincare-brands.json` (commit `7c6f70a7`, 2026-05-07, 1183 produits).

INCI en **français + ordre concentration décroissante**. 75 produits du gold-set Aurore matchent cette source ET sont alphabetical en DB → swap candidats.

**Limite** : INCI FR (eau, glycérine, beurre de butyrospermum parkii, acide hyaluronique hydrolysé, gomme xanthane…) — les détecteurs Aurore sont calibrés patterns EN-Latin. Swap brut testé en dry-run :
- +30 tags gagnés (texture-legere, texture-creme, fini-mat, vitamin-e, step-nettoyage-1)
- -140 tags perdus (famille `sans-X` : sans-parfum, sans-sulfates, sans-silicones, sans-huiles-minerales, sans-allergenes-parfumants, etc.)

Net négatif sans translation step FR→EN ou positional alignment FR↔EN.

Marques couvertes par korean-skincare.fr (alphabetical en DB ∩ JSON FR concentration) :
- Anua (27), COSRX (65), SKIN1004 (28), Round Lab (19), Mixsoon (23), Beauty of Joseon (19), Purito (16), Torriden (13), Some By Mi (11), Abib (9), Etude House (9), Haruharu (11), IsNtree (9), Iunik (9), numbuzin (10), Aestura (5), Innisfree (6), Dr.Althea (8), Some By Mi (11)

Soit ~300 produits potentiellement adressables, mais avec gap FR→EN à combler avant exploit.

### 5.2 Sites officiels marques (qualité max, scraping ad-hoc)

| Marque | URL | INCI ? | Ordre concentration ? |
|---|---|---|---|
| COSRX | cosrx.com | Oui | Oui (EN) |
| Anua | anua-cosmetic.com | Oui | Oui (EN) |
| Beauty of Joseon | beautyofjoseon.com | Oui | Oui (EN) |
| Round Lab | roundlab.us | Oui | Oui (EN) |
| Mixsoon | mixsoon.com | Oui | Oui (EN/KR) |
| SKIN1004 | skin1004.com | Oui | Oui (EN) |
| Numbuzin | numbuzin.us | Oui | Oui (EN) |
| Torriden | torriden.com | Oui | Oui (EN/KR) |
| Haruharu | haruharuwonder.com | Oui | Oui (EN) |
| Dr. Jart+ | drjart.com | Oui | Oui (EN) |
| Medicube | medicube.us | Oui | Oui (EN) |
| Medik8 | medik8.com | Oui | Oui (EN) |
| Pai Skincare | paiskincare.com | Oui | Oui (EN) |
| Vichy | vichy.fr | Oui | Oui (FR principalement) |
| Ducray | ducray.com/fr | Oui | Oui (FR) |
| Dermalogica | dermalogica.com | Oui | Oui (EN) |
| NIOD | deciem.com | Oui | Oui (EN) |
| Innisfree | innisfree.com | Oui | Oui (EN) |
| Shiseido | shiseido.com/fr | Oui | Oui (FR) |
| Etude House | etudehouse.com | Oui | Oui (EN) |

Effort : ~30 marques × patterns scraping différents = gros. ROI conditionnel à priorité fix data.

### 5.3 Cocooncenter / Pharmashop / Atida (pharma FR distribués)

Pour Vichy, Ducray, Shiseido, Bioderma, La Roche-Posay : retailers FR pharma listent INCI en français concentration order. Pipeline `import-candidates.ts` (commit `1fb76bfb`) déjà existant pour ce flux. Peut être étendu aux marques pharma de la liste alphabetical.

### 5.4 INCIBeauty / INCIDecoder (bases publiques)

| Source | URL | INCI ? | Ordre concentration ? |
|---|---|---|---|
| INCIDecoder | incidecoder.com | Oui | Oui (EN, concentration) |
| INCIBeauty | incibeauty.com | Oui | Oui (FR concentration) |

INCIDecoder est probablement la **meilleure source ciblée** pour rejouer le scrape K-beauty : couverture haute, INCI EN concentration order, structure URL prévisible (`/products/{brand}-{slug}`), API non publique mais HTML facile à parser.

### 5.5 OliveYoung (KR original)

Oliveyoung.co.kr est l'e-commerce K-beauty référent en Corée. INCI **coréen** dans la VO + traduction EN sur certains produits. Nécessite KR→EN translation step.

---

## 6. Décision actuelle (2026-05-11)

**Pas de re-fetch en cours.** L'état actuel reste :

1. **Détecteur `isAlphabeticalINCI`** (`ingredient-resolver.ts:62`) flag les 368 produits.
2. **Position-cap relax** sur les rinse-off + alphabetical (commit `87730c4b`, 2026-05-09) — caps position passent à ∞ pour ces produits, détection bascule sur substring full-scan.
3. **`positionCap = ∞`** sur tous les actifs trace-dose (ceramides, hyaluronique, peptides, polyphenols, tyrosinase, vitamins) — robuste aux INCI alphabetical.
4. **Gold-set audit ignore** les positions pour les produits alphabetical (limite documentée, voir AUTO-TAGS.md front-matter).

Macro F1 du gold-set 141 = **0.997** (P=1.000 sur 15/15, R=0.995). Le détecteur alphabetical absorbe la dégradation sur la majorité des tags. Coût résiduel principal : **texture-riche / texture-legere / fini-mat** (position-cap 8 obligatoire pour distinguer formule réellement riche/légère, pas relaxable sans FP corpus-wide).

### Quand revisiter

- Si **texture-riche / texture-legere / fini-mat** restent un gap après autres optimisations (ceramides FN cleanup, etc.).
- Si feature percent-claim (in-progress) requiert INCI fiable comme back-stop.
- Si scope élargit à >500 produits gold-set et la fraction alphabetical impacte significativement le macro F1.

### Si on revisite : recommandation tactique

1. **INCIDecoder scrape ciblé** sur les top 10 brands alphabetical (COSRX 65 + Medik8 35 + Medicube 32 + Missha 29 + SKIN1004 28 + Anua 27 + Mixsoon 23 + Beauty of Joseon 19 + Round Lab 19 + Vichy 18 = 295 produits, 57% du total). ROI le plus concentré.
2. **Positional alignment FR↔EN** sur korean-skincare.fr pour récupérer ordre concentration des produits couverts par cette source sans translation step.
3. **3b FR aliases** déprorisé : aide les 25 produits FR-INCI marketing-prose (mary-may, dexeryl, etc.), pas les 368 alphabetical.

---

## 7. Références

- Audit conduit : 2026-05-11
- Détecteur alphabetical : `backend/src/db/seed/utils/ingredient-resolver.ts:62` (`isAlphabeticalINCI`)
- Commit import K-beauty source-fr concentration : `7c6f70a7` (2026-05-07)
- Commit alphabetical detector + position relax : `87730c4b` (2026-05-09)
- Source seed Skinsafe original : commits `d1db35e3` (2026-04-11, refactor format unifié) + `1fb76bfb` (2026-04-29, bulk import scrapper)
- Front-matter AUTO-TAGS.md : limites known documentées par détecteur
