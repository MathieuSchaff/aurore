# Notes harmonisation couleurs — Thèmes Light

---

---

## Analyse architecture CSS — Ce qu'il faut changer et où

### Structure actuelle
- Les composants utilisent bien les variables CSS (pas de valeurs hardcodées). L'architecture est saine.
- Chaque thème définit ses variables dans `frontend/src/styles/tokens/colors-light-[thème].css`

### Niveau 1 — Fixable en modifiant les variables seulement

| Variable | Problème | Thèmes concernés |
|---|---|---|
| `--border-default` | Trop saturé, trop présent (vert vif, bleu vif…) | Tous — surtout Forêt, Bleu |
| `--bg-page` vs `--bg-card` | Trop proches en lightness → "flou", pas de contraste carte/fond | Terra, Forêt, Ardoise |
| `--color-sidebar-bg` | Rose (`oklch(44% 0.22 8)`) sur Forêt → horrible | Forêt |
| `--shadow-card` | Forêt utilise une ombre colorée (`oklch(40% 0.2 140)`) au lieu de neutre | Forêt |

### Niveau 2 — Nécessite de toucher les composants

| Composant | Fichier | Problème |
|---|---|---|
| `ProductCard` | `ProductCardCondensed.css` | 4 borders différentes dans la même règle CSS (left=6px, right=default, top/bottom=opacity 0.1) → asymétrique structurellement |
| `ChipGroup / .chip` | `ChipGroup.css` | Fond = `color-mix(primary 6%, transparent)` + texte dérivé de primary → si primary est sombre (Forêt), tout est dans la même gamme de couleur, illisible |

### Stratégie recommandée
1. D'abord corriger les variables (impact large, peu de risque)
2. Ensuite corriger les composants structurellement défaillants

---

## Problèmes globaux (page Produit — cartes)

- **Manque de contraste général** : les cartes ne "sautent" pas aux yeux, on ne sait pas où poser le regard
- **Hiérarchie visuelle faible** : tout se vaut, rien ne ressort

---

## Page Ingrédients (liste de cartes ingrédients)

**Problème transversal** : manque de contraste entre les cartes et le background → impression de "buée", tout se fond, illisible.

**Piste de solution** : passer le background à blanc pur, pour créer une séparation nette entre fond et cartes.

- **Bleu** : pas trop mal, mais contraste insuffisant entre cartes et fond → à améliorer
- **Terra Cotta** : fond crème/beige + cartes crème → tout se confond, effet "buée/flou", moche
- **Forêt** : aucun contraste du tout → vraiment pas beau
- **Ardoise** : un peu mieux, mais contraste encore insuffisant → à améliorer

> Solution à trouver plus tard — noter pour y revenir.

---

## Page Profil

### Problème global
- Boutons blancs sur fond blanc/crème → aucun contraste, tout se confond
- **Borders** : même problème que Collection — délimitations omniprésentes, artificielles, "faites main"
- Piste : trouver d'autres moyens de délimiter les sections (espace, ombre douce, background légèrement différent…) plutôt que des borders systématiques

### Chips (onglet Profil)
- **Chip "Type de peau"** : ne va pas du tout
- **Chip "Problématiques"** : pareil, pas beau

---

## Page Collection

**Problème transversal** : même problème de contraste cartes/fond que partout ailleurs (bleu, terra, forêt, ardoise).

### Borders anarchiques
- Les cartes produits dans la collection ont des borders gauche + droite mais **pas en haut ni en bas** → incohérent, moche
- Les sections (Wishlist, "Surveiller", "À éviter", etc.) ont des borders dans tous les sens → vraiment pas beau, à nettoyer complètement

### Bugs UI / Layout
- **Input de recherche** : il semble y avoir un élément parasite au-dessus de l'input → bug visuel à investiguer
- **Boutons "Filtrer" et "Trier"** :
  - Trop petits
  - Pas centrés
  - À revoir (taille, alignement, cohérence avec le reste)

---

## Bleu
- **Cartes produit (liste)** : pas très belles
- **Bas de carte** (zone "Ajouter" etc.) : fond gris, aspect carré/bloc → moche, manque de finesse
- **Page slug produit** :
  - Chip (ex: "Skincare") : texte bleu sur fond bleu → aucun relief, illisible
  - Contenance, ingrédients : titres peu visibles, rien ne ressort, hiérarchie floue
  - Les onglets : **bien** ✓ (point positif à conserver)

## Terra Cotta
- **Palette trop fade (cartes liste)** : tout est crème/beige/vert marron beige → manque de punch
- **Besoin de couleurs plus vives / contrastées**
- **Page slug produit** :
  - Chip : **bien** ✓ (c'est le seul thème où ça marche — à prendre comme référence)
  - Reste : même problème que les autres, manque de hiérarchie visuelle

## Forêt
- **Navbar** : couleur rose → horrible, à changer
- **Fond des cartes** : vert → "du verre sur du verre sur du verre", aucune profondeur, tout se fond, moche
- **Cartes produit (liste)** : tout est vert, pas de contraste → moche
- **Page slug produit** :
  - Background vert en fond → horrible
  - Chip (ex: "Skincare") : pas belle, texte bleu sur fond bleu → manque de relief, illisible
  - Textes (contenance, ingrédients, titres de section) : couleurs des écritures pas belles, impression de flou, rien ne saute aux yeux

## Ardoise
- **Fond (background général du contenu)** : légèrement bleu → moche, à corriger
- **Navbar** : couleur marron → à changer, couleur à trouver plus tard
- **Cartes produit (liste)** : background bleu sur les cartes + présence de vert incohérente (le vert n'a rien à faire là — bug ou héritage CSS ?)
- **Page slug produit** :
  - Chip : pas mal
  - Contenance, ingrédients, titres de section : couleurs des textes pas belles, manque de lisibilité
