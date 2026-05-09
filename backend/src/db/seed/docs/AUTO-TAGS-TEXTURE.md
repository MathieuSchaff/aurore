# AUTO-TAGS-TEXTURE.md — Taxonomie `texture-*` / F2 post-mortem

**Statut** : ✅ F2 livré 2026-05-09 · migration `0054` · 701 pairs DB · eye-cream ticket séparé.
**Date d'ouverture** : 2026-05-09 · **Date de clôture** : 2026-05-09
**Branche** : `products-branch`

Document de référence pour la décision d'architecture F2 et les éléments utiles
aux futures évolutions `texture-*`. Les §1-6 sont historiques (analyse pré-décision).
Les §7-10 reflètent l'état livré.

---

## 1. Contexte — pourquoi F2 a été complexe

F2 (audit AUTO-TAGS.md ligne 1119) demandait l'extension de `texture-creme` au-delà
de `hand-cream`. L'implémentation d'un détecteur INCI strict a exposé un problème
plus large : le drift entre DB legacy (1069 pairs blanket) et le détecteur (244 pairs
strict). La question est devenue **"quel modèle taxonomique pour les textures dérivées
de kind"** avant même de coder.

---

## 2. Chiffres clés

### 2.1 État DB avant/après F2

| Slug | Avant F2 (legacy) | Après F2 (2026-05-09) | Δ |
|------|------------------:|---------------------:|--:|
| `texture-creme` | 1069 | **701** | -368 |
| `texture-legere` | 1791 | 1791 | 0 (non touché F2) |
| `texture-gel` | 177 | 177 | 0 (non touché F2) |
| `texture-riche` | 120 | 120 | 0 |
| `texture-patch` | 33 | 33 | 0 |
| `texture-mousse` | 33 | 33 | 0 |
| `texture-eau` | 252 | 252 | 0 |
| `texture-huile` | 57 | 57 | 0 |
| `texture-baume` | 76 | 76 | 0 |
| `texture-lait` | 105 | 105 | 0 |

### 2.2 `texture-creme` par kind — avant/après

| Kind | Avant F2 | Après F2 | Note |
|------|--------:|---------:|------|
| `moisturizer` | 600 | **676** | +76 (Path 2 default, vetos nettoyent les serums/gels) |
| `sunscreen` | 402 | **0** | Hors scope, variable (fluide/lait/crème/stick) |
| `body-lotion` | 23 | **0** | Hors scope, `texture-lait` exclusif via kind-tag |
| `hand-cream` | 19 | 19 | Inchangé (kind-tag deterministic) |
| `foot-cream` | 6 | 6 | Inchangé (Path 2 default, pas de nouveaux FP) |
| `eye-cream` | 2 | **24** | Hors scope F2 → ticket §9.1 livré (backfill 2026-05-09) |
| Autres mistags | 17 | **0** | Cleanser, balm, serum, mask… |

---

## 3. Origine du drift — chronologie

1. **Avant T1** (avant 2026-05-08) — `_archive/auto-tag.ts` tagguait par
   mapping kind → tags blanket (tout `moisturizer` → `texture-creme`
   indépendamment de l'INCI).

2. **T1 sweep (2026-05-08)** — refacto orchestrator. Seul `hand-cream`
   émettait `texture-creme` (kind-tag deterministic). Les 1069 pairs legacy
   persistaient via backfill insert-only (`onConflictDoNothing`).

3. **F2 analyse (2026-05-09)** — détecteur strict exposait le drift -825.
   Spot-check : ~25-30 % des 825 droppés = vraies crèmes ratées. Choix
   architectural discuté, Path 2 retenu.

4. **F2 livraison (2026-05-09)** — Path 2 implémenté + bug slash-normalisation
   fixé + migration 0054 (delete stale) + backfill (insert 683). DB finale : 701.

---

## 4. Spot-check pré-décision (15 moisturizers DB-creme / strict-non-fire)

Conservé comme référence — illustre pourquoi Path 1 strict était insuffisant.

**Legit drops (~8/15)** : shampoings mistaggés comme moisturizer (SLES top 5),
pain de toilette, INCI vide, produits dont le nom indique déjà `texture-baume`
/ `texture-lait` / `texture-riche`.

**Faux négatifs (~5/15)** : vraies crèmes ratées à cause du bug slash-normalisation
(`caprylic/capric` avec slash non matché) et du mutex ≥2 butter/wax trop strict
(Ducray Dexyane med = crème-baume hybride envoyé sur `texture-riche`).

**Borderline (~2/15)** : INCI alphabétique (Shiseido Benefiance) — positions de
concentration inconnues, détecteur ne peut pas trancher.

**Implication** : Path 1 strict trop conservateur (≥40 % de FN sur INCI alphabétique
/ sparse). Path 2 (default + veto) choisi.

---

## 5. Décision d'architecture : Path 2 retenu

**Sémantique tranchée** : `texture-creme` = catégorie **hybride** (option c) —
kind-driven + INCI veto sur cas extrêmes. `moisturizer` = "Crème hydratante" dans
`PRODUCT_KIND_LABELS`, le tag texture doit aligner avec l'attente UX, pas auditer
la chimie.

Path 1 (strict INCI) rejeté : trop de FN sur INCI sparse/alphabétique, maintenance
continue de la liste émulsifiants, jamais parfaitement aligné avec le naming produit.

---

## 6. Implémentation livrée

### 6.1 Logique `detectTextureCremeInci` (Path 2)

```
Kind ∈ {moisturizer, foot-cream} + texture null → fire par défaut, sauf veto :

Veto 1 : surfactant ionique top 5       → cleanser mistag
Veto 2 : ≥ 2 butter/wax top 8          → texture-riche gagne
Veto 3 : huile végétale ou butter pos 1 → face-oil mistag
Veto 4 : pas d'eau dans top 5          → formule oil-led
Veto 5 : gel-former top 5 + 0 phase huileuse top 8  → texture-gel
Veto 6 : eau pos 1 + 0 émulsifiant + 0 phase huileuse → serum/essence

INCI absent ou < 4 ingrédients → trust kind → fire
```

Eye-cream exclu du kind set : sous-corpus trop hétérogène (patches, hydrogels,
sérums, vraies crèmes). Ticket séparé.

### 6.2 Bug slash-normalisation (résolu)

`normalize()` dans `algo-derm/src/parser.ts` convertit les slashes en espaces.
`CREAM_OILY_EXTRA_PATTERNS` contenait `'caprylic/capric triglyceride'` (slash
conservé) → pattern ne matchait jamais les ingrédients normalisés → FN sur toutes
les crèmes avec caprylic/capric comme seule phase huileuse.

Fix : `'caprylic/capric triglyceride'` → `'caprylic capric triglyceride'`.

**Note algo-derm** : `normalize` vient de `/home/schaff/Mathieu/projets/algo-derm`
(repo MIT indépendant). Dans `aurore`, importé via tarball vendored
(`vendor/algo-derm.tgz`). Ne jamais modifier `node_modules/algo-derm` directement.
Le fix était côté `aurore/formula-detection.ts`, pas dans algo-derm.

### 6.3 Migration 0054

```sql
DELETE FROM "tag_products"
WHERE "product_tag_id" = (SELECT "id" FROM "product_tags" WHERE "slug" = 'texture-creme')
  AND "product_id" IN (
    SELECT "id" FROM "products" WHERE "kind" != 'hand-cream'
  );
```

Supprime 1050 pairs stale (tout sauf hand-cream deterministic). Backfill re-crée
683 pairs correctes (676 moisturizer + 6 foot-cream + 1 foot-cream déjà présent).

---

## 7. Décisions (toutes closes)

- [x] **Approche** : Path 2 retenu (default-creme + vétos INCI).
- [x] **Eye-cream** : hors scope F2 — ticket séparé.
- [x] **Sunscreen** : hors scope. 402 pairs → drop migration.
- [x] **Body-lotion** : hors scope. `texture-lait` exclusif. 23 pairs → drop.
- [x] **Mutex `texture-creme` ↔ `texture-riche`** : exclusif (veto 2).
- [x] **Drift autres `texture-*`** : migration séparée F6 (non spot-checkés).
- [x] **Bug slash-normalisation** : fixé (`caprylic capric triglyceride`).
- [x] **Cleanup migration F2** : migration 0054 appliquée + backfill --write.

---

## 8. Références code

- `backend/src/db/seed/utils/formula-detection.ts` —
  `detectTextureCremeInci` (Path 2 default + veto) · `detectTextureGelInci` ·
  `detectTextureRiche` · `detectTextureLegere` · `detectTextureFromField`
- `backend/src/db/seed/utils/kind-tag-detection.ts:39` — `hand-cream` →
  `[TYPE_HYDRATANT, TEXTURE_CREME, ZONE_MAINS]` (kind-tag deterministic)
- `backend/src/db/seed/utils/auto-tag-orchestrator.ts` — pass 4 wiring
- `backend/drizzle/0054_cleanup_texture_creme_stale_pairs.sql` — migration cleanup
- `backend/src/db/seed/docs/AUTO-TAGS.md` §F2 — item fermé

---

## 9. Tickets issus de F2

### 9.1 Eye-cream `texture-creme` / `texture-baume` — ✅ livré 2026-05-09

**Contexte** : eye-cream (`kind = 'eye-cream'`) exclu de `TEXTURE_CREME_DEFAULT_KINDS`
en F2 — sous-corpus trop hétérogène (patches, hydrogels, sérums, vraies crèmes, baumes).

**État DB avant implémentation (2026-05-09)** :

| Tag | Count | Note |
|-----|------:|------|
| `texture-legere` | 70 | Couvert — formules légères/sérum-like |
| aucun tag texture | **43** | Cible — vraies crèmes + baumes sans tag |
| `texture-riche` | 4 | Couvert |
| `texture-gel` | 3 | Couvert |
| `texture-mousse` | 1 | Couvert (admin `products.texture = 'mousse'`) |
| **Total** | **121** | |

---

#### Implémentation livrée

**Deux nouveaux détecteurs** dans `formula-detection.ts` :

**`detectTextureCremeEyeInci`** — Path 1 relaxé + cross-check nom :

```
Gate positif (eau top 3 + émulsifiant top 8) requis — pas de default-fire aveugle.

Logique :
1. hint = textureHintFromName(name)
2. hint = 'abstain' (sérum, patch, ampoule, hydrogel, pencil…) → []
3. INCI sparse (< 4) :
   - hint = 'creme' → fire
   - sinon → [] (unsafe de faire confiance au kind seul)
4. Veto 1 : surfactant ionique top 5 → []
5. Veto 2 : ≥ 2 butter/wax top 8 → texture-riche gagne
6. Veto 3 : gel-former top 5 → texture-gel gagne
7. Gate : eau top 3 + émulsifiant top 8 requis
8. hint = 'baume' ou 'gel' → conflit nom/INCI → [] (admin curation)
9. → TEXTURE_CREME
```

**`detectTextureBaumeFromName`** — nom uniquement pour eye-cream :

```
kind = 'eye-cream' + !texture admin + "baume"/"balm" dans le nom → TEXTURE_BAUME
```

**`textureHintFromName(name)` → `'creme' | 'baume' | 'gel' | 'abstain' | null`** :

| Pattern | Hint |
|---------|------|
| patch, hydrogel, masque, sérum/serum, ampoule, pencil, liner, fluide… | `'abstain'` |
| baume, balm | `'baume'` |
| gel | `'gel'` |
| crème, creme, cream | `'creme'` |
| (rien) | `null` — INCI gate fait foi |

**Pourquoi pas "trust kind" pour l'INCI sparse** : le kind `eye-cream` couvre patches,
hydrogels, ampoules, sérums. Contrairement à `moisturizer`, le kind seul ne confirme
pas une texture crème. Le nom est requis comme signal positif.

**Cas de conflit** (INCI gate passe mais nom dit baume/gel) : `detectTextureCremeEyeInci`
retourne `[]`; `detectTextureBaumeFromName` émet `texture-baume` si applicable.
Si aucun des deux ne fire → admin set `products.texture`.

---

#### Résultat du spot-check (43 produits sans tag texture)

| Comportement | Produits (exemples) | Résultat |
|-------------|---------------------|----------|
| `texture-creme` ✓ | Avène Hyaluron Activ ×2, Embryolisse Anti-Âge, Lierac Premium Crème Regard, Medik8 Crystal Retinal Eye ×3, SVR Densitium | gate + nom = creme |
| `texture-baume` ✓ | L'Occitane Baume Regard Immortelle Divine, SVR Palpebral Baume | nom = baume |
| `abstain` ✓ correct | Beauty of Joseon Revive Eye **Serum**, Erborian Eye Seve de Bamboo **Gel** | nom / gate abstient |
| `abstain` corrigé | Abib Collagen Eye **Patch**, Dr. Ceuracle Hydrogel Eye **Mask**, MISSHA Bee Pollen Eye **Ampouler**, MIXSOON Bean Hydrogel Eye **Patch**, MISSHA Eyeliner | abstain via nom |
| FN acceptables | COSRX ×2, Haruharu, Purito ×2, SKIN1004… (INCI alphabétique) | gate abstient — admin ou backfill futur |

**Backfill** : appliqué 2026-05-09 (`make backfill-auto-tags WRITE=1`).
Résultat : **24 `texture-creme` + 3 `texture-baume`** créés (estimation 9-11 / 2 dépassée —
détecteur fire plus large sur INCI non-alphabétique). 43 - 27 = 16 FN acceptables (INCI alphabétique).

---

#### Références code

- `formula-detection.ts` — `detectTextureCremeEyeInci` · `detectTextureBaumeFromName` · `textureHintFromName`
- `auto-tag-orchestrator.ts` — pass 4 wiring + `name` dans `OrchestratorInput`
- `formula-detection.test.ts` — suites `detectTextureCremeEyeInci` + `detectTextureBaumeFromName` (212 tests)

---

### 9.2 F6 — drift autres `texture-*`

Pairs stale à nettoyer — audit complet en §10.

---

## 10. F6 — Audit drift `texture-gel/eau/huile/baume/lait`

**Statut** : 🔴 En cours d'analyse · 2026-05-09 · décisions architecturales ouvertes (§10.4).

---

### 10.1 Émetteurs légitimes — état des détecteurs (2026-05-09)

Avant tout audit, il faut savoir **qui émet quoi aujourd'hui**. Deux sources :

**A — kind-tag déterministe** (`kind-tag-detection.ts`) :

| Kind | Tags texture émis |
|------|-------------------|
| `toner` | `texture-eau` |
| `mist` | `texture-eau` |
| `balm` | `texture-baume` + `texture-riche` |
| `oil` | `texture-huile` |
| `body-oil` | `texture-huile` |
| `body-lotion` | `texture-lait` |
| `hand-cream` | `texture-creme` |

Tous les mappings kind-tag sont pour des produits **leave-on**. Aucun rinse-off.

**B — admin field** (`detectTextureFromField`) :
Émet le slug correspondant si `products.texture` est set. Source de vérité admin — prioritaire sur tout.

**C — INCI fallback** (`detectTextureGelInci`) :
Uniquement pour `texture-gel`. Skip si `products.texture` est set. SKIP_KINDS = `{cleanser, body-wash, body-scrub, balm, oil, body-oil, hair-oil, patch}`.

**Aucun INCI fallback pour `texture-eau`, `texture-huile`, `texture-baume`, `texture-lait`.**

---

### 10.2 Chiffres DB (2026-05-09) et décomposition par kind

#### Vue globale

| Slug | DB total | Kind-tag couvre | Suspects (kind hors kind-tag) | = doc delta |
|------|--------:|----------------:|------------------------------:|-------------|
| `texture-eau` | 252 | toner 190 + mist 34 = **224** | **28** | -28 ✓ |
| `texture-huile` | 57 | oil 20 + body-oil 7 = **27** | **30** | -30 ✓ |
| `texture-baume` | 76 | balm 61 + eye-cream 3 = **64** | **12** (hors eye-cream) | ~-15 ✓ |
| `texture-lait` | 105 | body-lotion 94 = **94** | **11** | -11 ✓ |
| `texture-gel` | 177 | aucun kind-tag | **177** (tous INCI ou legacy) | -69 estimé |

**Résultat SQL clé** : tous les suspects des 4 premiers tags ont `products.texture IS NULL`.
Aucun admin field set sur ces pairs. Confirmation : la seule source de ces pairs = legacy blanket
(`_archive/auto-tag.ts`, avant T1, 2026-05-08).

---

#### Spot-check par tag — produits réels

##### `texture-eau` — suspects (28 pairs)

| Kind | Count | Produits exemples | Nature |
|------|------:|-------------------|--------|
| `cleanser` | 15 | Bioderma Créaline H2O, Bioderma Sébium H2O, COSRX Low pH Niacinamide Micellar Cleansing Water, Garancia Source Micellaire ×3, Isispharma Sensylia ×2, SVR Sebiaclear Eau Micellaire, Vichy Purete Thermale… | **Toutes eaux micellaires** — genuinement texture eau |
| `moisturizer` | 5 | Aestura Atobarrier 365 Lotion, Beauty of Joseon Rice Milk, COSRX Birch Sap Lotion, Round Lab Dokdo Lotion, Garancia Trousse Voyage | Lotions légères (3-4 légitimes ?), 1 kit → stale |
| `exfoliant` | 4 | Geek & Gorgeous Calm Down / Cheer Up / Smooth Out, SVR Sebiaclear Micro-Peel | **Liquid exfoliants** — genuinement texture eau |
| `essence` | 1 | Beauty of Joseon Ginseng Essence Water | "Water" dans le nom → légitime |
| `mask` | 1 | SKIN1004 Quick Calming Pad | Pad mask → stale |
| `sunscreen` | 1 | La Roche-Posay Anthelios Brume SPF50+ | "Brume" → borderline |
| `serum` | 1 | Nooance Sérum en Brume | "Brume" → borderline |

##### `texture-huile` — suspects (30 pairs)

| Kind | Count | Produits exemples | Nature |
|------|------:|-------------------|--------|
| `cleanser` | 26 | Anua Heartleaf Cleansing Oil ×2, Bioderma Créaline Huile micellaire, Beauty of Joseon Ginseng Cleansing Oil, COSRX Cica Clear Cleansing Oil, Dermalogica Precleanse, La Roche-Posay Lipikar Huile Lavante, L'Occitane Huile Démaquillante, Purito Green Cleansing Oil… | **Toutes huiles nettoyantes** — genuinement texture huile |
| `body-wash` | 3 | A-Derma Exomega Control Huile Lavante, Même Huile Lavante, SVR Topialyse Huile Lavante | **"Huile lavante"** — genuinement texture huile |
| `serum` | 1 | Aroma-Zone Sérum Bakuchiol | Possible sérum huileux — borderline |

##### `texture-baume` — suspects hors eye-cream (12 pairs)

| Kind | Count | Produits | Nature | Décision |
|------|------:|----------|--------|----------|
| `cleanser` | 8 | Beauty of Joseon Radiance Cleansing Balm, COSRX Cica Smoothing Cleansing Balm, Dr.Althea Pure Grinding Cleansing Balm, Geek & Gorgeous Mighty Melt, L'Occitane Baume Démaquillant, Même Gelée Fondante, Remedy Science Derm Dissolve Cleansing Balm, SVR Sensifine Baume démaquillant | **Tous baumes nettoyants** — genuinement baume | ❓ Q1 |
| `moisturizer` | 3 | CeraVe Baume Hydratant, Prequel Skin Utility Balm, Prequel Skin Utility Ointment | Genuinement baumes (nom = "Baume/Balm/Ointment"), texture=NULL | ❓ Q3 |
| `body-lotion` | 2 | Eucerin AtopiControl Baume, SVR Topialyse Baume Protect+ | `products.texture = 'lait'` — **admin contredit le tag** | ✅ STALE CERTAIN |
| `hand-cream` | 1 | DermEden Crème Mains Action Globale | `products.texture = 'creme'` — **admin contredit le tag** | ✅ STALE CERTAIN |
| `serum` | 1 | Theramid Ceramide Treatment | Aucun hint baume | ✅ STALE CERTAIN |

##### `texture-lait` — suspects (11 pairs)

| Kind | Count | Produits | Nature | Décision |
|------|------:|----------|--------|----------|
| `cleanser` | 6 | COSRX Low pH First Cleansing Milk Gel, DermEden Démaquillant Total Lait-Lotion, Isispharma Ruboril Lotion, IsNtree Yam Root Vegan Milk Cleanser, Round Lab Dokdo Cleansing Milk, Weleda Gentle Cleansing Milk | **Tous laits nettoyants** — genuinement texture lait | ❓ Q1 |
| `moisturizer` | 4 | Garancia Fée-Moi Fondre Boostée (Mousse), Garancia Fée-Moi Fondre La Nuit (Mousse), Garancia Duo Pack Fée-Moi, Prequel Urea Advance Moisturizing Milk | 3 Garancia = mousse (stale), 1 Prequel = lait légitime | ❓ Q4 |
| `spot-treatment` | 1 | Theramid Zitback | Aucun hint lait | ✅ STALE CERTAIN |

##### `texture-gel` — état

177 pairs, **aucun** avec admin `texture` field set. Sources = `detectTextureGelInci` (légitime) + legacy blanket.

| Kind | Count | Décision |
|------|------:|----------|
| `moisturizer` | 66 | INCI-dépendant — gel-former top 5 possible |
| `cleanser` | 41 | **STALE CERTAIN** — SKIP_KINDS, texture=NULL |
| `serum` | 30 | INCI-dépendant |
| `mask` | 12 | INCI-dépendant |
| `sunscreen` | 11 | INCI-dépendant |
| `spot-treatment` | 5 | INCI-dépendant |
| `eye-cream` | 3 | INCI-dépendant (pas dans SKIP_KINDS) |
| `body-wash` | 3 | **STALE CERTAIN** — SKIP_KINDS, texture=NULL |
| `body-lotion` | 2 | `products.texture = 'lait'` → **STALE CERTAIN** |
| `exfoliant` | 2 | INCI-dépendant |
| `essence` | 1 | INCI-dépendant |
| `primer` | 1 | INCI-dépendant |

Gel SQL-certains : cleanser 41 + body-wash 3 + body-lotion 2 = **46 stale**.
Gel INCI-dépendants : ~131 pairs à vérifier par reverse backfill.
Doc estimait -69 total → ~23 stale supplémentaires hors SKIP_KINDS.

---

### 10.3 Questions ouvertes — décisions à prendre

#### Q1 (CRITIQUE — débloque tout) : Les `cleanser` reçoivent-ils des tags `texture-*` ?

**Contexte** : 15 eaux micellaires + 26 huiles nettoyantes + 8 baumes nettoyants + 6 laits nettoyants
= **55 pairs cleanser** avec un tag texture genuinement correct sur le produit, mais aucun émetteur actuel.

`detectTextureGelInci` exclut déjà `cleanser` de son SKIP_KINDS, signalant une intention
d'exclusion des rinse-off de la taxonomie texture.

**Argument pour exclusion complète** :
- Texture = concept leave-on dans Aurore (tous les kind-tag texture pointent sur du leave-on).
- Pour un cleanser, la texture est rincée → non pertinente pour le signal skin-feel UX.
- Maintenabilité : pas de détecteur à construire, pas de cas limite.
- Si on veut ces produits, c'est via le kind (`cleanser`) pas le tag texture.

**Argument pour inclusion partielle** :
- Les eaux micellaires ne se rincent pas — elles sont leave-on par usage.
- Product discovery : filtrer "cleansing oils" via `texture-huile` pourrait être utile.
- Ces 55 products ont genuinement la texture indiquée.

**Si exclusion → 55 stale SQL-certains supplémentaires, zero code à écrire.**
**Si inclusion → besoin d'un détecteur nom-based pour chaque sous-type.**

#### Q2 : `body-wash` reçoit-il `texture-huile` ?

3 produits "Huile Lavante" (body-wash). Même enjeu que Q1 mais pour body-wash.
Si rinse-off exclus → 3 stale supplémentaires. Si inclus → cas particulier.

#### Q3 : `moisturizer` baume sans admin field (3 pairs)

CeraVe Baume Hydratant, Prequel Skin Utility Balm, Prequel Skin Utility Ointment.
Genuinement des baumes (nom clair). Actuellement taggés via legacy blanket. Aucun émetteur actuel.

Options :
- A) Fixer `products.texture = 'baume'` manuellement (3 produits, faisable) → `detectTextureFromField` prend le relais.
- B) Étendre `detectTextureBaumeFromName` aux `moisturizer` (pattern "baume/balm/ointment" dans le nom).
- C) Laisser pour F8, supprimer maintenant, admin les fixe quand il voit le gap.

#### Q4 : `moisturizer` + `texture-lait` — 1 légitime sur 4

Prequel Urea Advance Moisturizing Milk : genuinement lait. Les 3 Garancia Mousse : stale évident.
Même options que Q3 : admin field ou détecteur nom ?

#### Q5 : `exfoliant` + `texture-eau` — liquid exfoliants (4 pairs)

Geek & Gorgeous ×3 + SVR Sebiaclear Micro-Peel. INCI = vraiment eau. Genuins.
`exfoliant` n'est pas dans kind-tag pour texture-eau. Aucun émetteur actuel.
Option : ajouter `exfoliant` comme kind candidat à `texture-eau` dans kind-tag ? Ou admin ?

#### Q6 : Scope gel Phase 2b dans F6 ou ticket séparé F7 ?

F6a (SQL-certain) = cleanser 41 + body-wash 3 + body-lotion×lait 2 = **46 stale** → migration simple.
F6b (INCI-dépendant) = ~23 stale supplémentaires → nécessite un script reverse-backfill
(parcourir les 131 pairs restantes, faire tourner `detectTextureGelInci`, collecter ceux où ça ne fire pas).
Séparer F6b en F7 ou le faire maintenant ?

---

### 10.4 Plan de migration (ébauche — conditionnel aux décisions Q1-Q6)

#### Scénario A : cleanser exclu de la taxonomie texture (recommandé)

| Migration | Cible | Pairs supprimées | Condition |
|-----------|-------|----------------:|-----------|
| eau-stale | cleanser×15 + mask×1 + moisturizer borderline + serum borderline | ~20-22 | Q1=exclu |
| huile-stale | cleanser×26 + body-wash×3 + serum borderline | ~29-30 | Q1=exclu, Q2=exclu |
| baume-stale | cleanser×8 + body-lotion×2 + hand-cream×1 + serum×1 | 12 | Q1=exclu |
| lait-stale | cleanser×6 + moisturizer Garancia×3 + spot-treatment×1 | 10 | Q1=exclu |
| gel-stale-F6a | cleanser×41 + body-wash×3 + body-lotion×2 | 46 | toujours |
| gel-stale-F6b | ~23 INCI-dépendants | ~23 | reverse backfill |
| **Total** | | **~140-143** | |

Restent non-couverts après cleanup (FN acceptables) :
- moisturizer baume ×3 → Q3 (admin ou détecteur nom)
- moisturizer lait ×1 → Q4
- exfoliant eau ×4 → Q5
- moisturizer eau borderline ×3-4 → Q5 ou admin
- essence eau ×1 → admin
- sunscreen/serum brume ×2 → admin ou ignore

#### Scénario B : inclusion partielle (eaux micellaires leave-on)

Même chose + nouveau détecteur pour cleanser eau micellaire (pattern nom "micellaire/micellar").
Ajoute de la complexité pour 15 produits.

---

### 10.5 Décisions (à compléter)

- [ ] **Q1** : `cleanser` inclus ou exclu de la taxonomie `texture-*` ?
- [ ] **Q2** : `body-wash` inclus ou exclu ?
- [ ] **Q3** : moisturizer baume → admin field ou détecteur nom ?
- [ ] **Q4** : moisturizer lait légitime → admin field ou détecteur nom ?
- [ ] **Q5** : liquid exfoliants + eau → ajouter `exfoliant` au kind-tag ou admin ?
- [ ] **Q6** : gel Phase 2b dans F6 ou F7 ?
