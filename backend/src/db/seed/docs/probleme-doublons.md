# Analyse du Problème de Doublons et de Langue (Seed Backend)

> **À propos :** Note d'analyse d'un problème spécifique — les produits importés du CSV (anglais) et les produits seed manuels (français) génèrent des slugs différents pour le même produit, créant des doublons visuels côté UI. Liste les pistes de solutions. Lire quand on touche à l'import CSV.

## 1. État des lieux
Le système de seeding du backend utilise deux sources de données qui entrent en conflit linguistique :
- **Source Manuelle (`seed-core.ts`)** : Données principalement en français, saisies avec soin.
- **Source CSV (`seed-skincare.ts`)** : Données massives en anglais (provenant probablement de sources comme SkinSafe).

## 2. Le mécanisme de détection des doublons
La détection repose sur le **slug** du produit, généré via `slugify(brand + "-" + name)`.

### Le problème majeur
Un même produit présent dans les deux sources aura deux noms différents à cause de la langue, et donc deux slugs différents :
- **Version Française** : "CeraVe Crème Hydratante" → `cerave-creme-hydratante`
- **Version Anglaise** : "CeraVe Moisturizing Cream" → `cerave-moisturizing-cream`

**Conséquence** : La base de données acceptera les deux entrées car les slugs sont uniques, créant ainsi des doublons "visuels" pour l'utilisateur final.

## 3. Impact sur l'application
- **Pollution du catalogue** : L'utilisateur verra le même produit apparaître deux fois (une fois en FR, une fois en EN).
- **Incohérence de l'UI** : L'interface affichera un mélange de noms et de descriptions en anglais et en français, ce qui dégrade l'expérience utilisateur et l'image de marque de l'application.
- **Données de santé/sécurité** : Les listes d'ingrédients (INCI) sont universelles, mais les conseils d'utilisation ou les catégories pourraient être mal interprétés si la langue n'est pas maîtrisée par l'utilisateur.

## 4. Ce qui fonctionne techniquement (mais ne règle pas le fond)
Le code dans `backend/src/db/seed/data/otherdata/product-associations.ts` est déjà "préparé" pour l'anglais. Il contient des maps de correspondance qui traduisent les termes anglais du CSV vers les types internes de l'application :
- `Facial Cleansers` (CSV) → `PRODUCT_KINDS.skincare.CLEANSER` (Interne)
- `Moisturizers` (CSV) → `PRODUCT_KINDS.skincare.MOISTURIZER` (Interne)
- `Jar` / `Pump` / `Tube` (CSV) → Unités internes.

Le seed ne "plante" pas techniquement, mais il importe des données "sales".

## 5. Pistes de solutions
1. **Normalisation par l'EAN/GTIN** : Si le CSV contenait les codes-barres, ce serait le seul moyen infaillible de détecter les doublons indépendamment de la langue.
2. **Traduction automatique au seed** : Utiliser une API de traduction (ou un dictionnaire de termes récurrents) pour traduire les noms de produits et catégories avant de générer le slug.
3. **Référentiel de marques** : Créer une table de correspondance pour les noms de produits très courants entre l'anglais et le français.
4. **Priorité au manuel** : Lors de l'import CSV, si un produit ressemble fortement à un produit manuel (via une recherche de similarité textuelle), l'ignorer ou demander une validation.
