# Dédup produits scrapés — Workflow

> **À propos :** Détection et review des doublons entre fichiers seed (curated vs scrapped, et intra-fichier). Répond à « comment on attaque ce gros chantier de doublons ? ». À lire avant toute campagne de fusion.
>
> **Audience** : humain + IA qui reprend le chantier dans une nouvelle session.

---

## Pourquoi ce doc existe

Les imports `*.atida.seed.ts` et `*.pharmashop.seed.ts` génèrent des doublons :

1. **Cross-source** — un produit scrapé existe déjà dans le fichier curé `*.seed.ts` (mêmes INCI, nom différent). Ex : `Topialyse Huile Lavante` (curé) ↔ `SVR Topialyse Huile Lavante 1L` (scrap).
2. **Intra-source** — le même produit a été scrapé plusieurs fois dans le même fichier (variantes de slug, différences de format). Ex : `Topialyse Huile Lavante` apparaît 4× dans `svr.pharmashop.seed.ts`.

Égalité de chaînes ne suffit pas : noms, slugs, ordre des mots et tailles diffèrent. Le détecteur s'appuie sur **INCI Jaccard** + tokens nom + flags anti-FP.

---

## Comment lancer

```bash
# Depuis backend/
bun run src/db/seed/scripts/audit-imported-products.ts            # console only
bun run src/db/seed/scripts/audit-imported-products.ts --write    # écrit json + md dans output/
```

Sortie :
- `backend/src/db/seed/output/imported-products-audit.md` — rapport human-readable
- `backend/src/db/seed/output/imported-products-audit.json` — JSON complet (gros, gitignoré)

---

## Comment ça classe (3 tiers)

Pour chaque paire `(produit A, produit B)` de **même brand** :

| Signal | Valeur |
|---|---|
| `inci` | Jaccard sur l'INCI complet, normalisé (deburr + alphanumérique) |
| `name` | Jaccard sur tokens du nom (volumes/format/marqueurs strippés, mots ≤ 2 chars filtrés) |
| `kindEq` | `a.kind === b.kind` |
| `combined` | `0.6 × inci + 0.3 × name + 0.1 × kindEq` |

**Flags anti-FP** (poussent la paire vers `review` au lieu d'`auto-merge`) :

- `num-diff:n:30,n:50` — différence de nombre dans le nom (SPF, concentration). Ex : `Xerial 30` vs `Xerial 50`.
- `tint-diff:light,dark` — variantes de teinte (`light` / `medium` / `dark` / `clair` / `fonce` / `teinte`).
- `gamme-letter:P,K` — lettres seules disjointes (`Nodé P` vs `Nodé K`).
- `kind-diff:toothpaste/mouthwash` — informatif, ne bloque pas l'auto-merge mais signale qu'un seed importé a probablement le mauvais `kind`.

**Décision tier** :

| Tier | Condition |
|---|---|
| `auto-merge` | `inci ≥ 0.85` AND `name ≥ 0.4` AND aucun flag `num-diff`/`tint-diff`/`gamme-letter` |
| `review` | `combined ≥ 0.7` OR (`inci ≥ 0.85` avec un flag bloquant) |
| `weak` | `name ≥ 0.7` (fallback quand l'INCI est absent ou très différent) |
| `reject` | sinon |

Cf. `classifyPair()` dans `backend/src/db/seed/scripts/audit-imported-products.ts`.

---

## Workflow de review (par marque)

**Ne jamais traiter le rapport global d'un coup.** ~2300 paires au total, ingérable.

1. **Identifier la marque la plus prioritaire** dans la section *Review Priority* du rapport.
2. **Filtrer le rapport sur cette marque** : grep `brand-dir-name` dans `imported-products-audit.md` ou ouvrir le `.json` et filtrer par `a.file` / `b.file`.
3. **Traiter d'abord les intra-source** de la marque (vrais bugs : même produit 2-4× dans le même fichier).
4. **Puis les cross-source `auto-merge`** de la marque (haute confiance).
5. **Puis les `review`** de la marque (lecture humaine pair par pair).
6. Les `weak` peuvent être laissés pour une passe ultérieure.

---

## Règles de décision (par paire)

| Cas | Action |
|---|---|
| INCI ≥ 0.85, **`sameSize: yes`**, pas de flag | **Fusionner** : garder la version curée si elle existe, sinon le record le plus riche (description non vide, `keyIngredients` non vide, `imageUrl` présent). Supprimer l'autre. |
| INCI ≥ 0.85, **`sameSize: no`**, pas de flag | **Variante de format** : garder les deux. Lien logique via slug commun (préfixe partagé). Ne pas merger. |
| Flag `num-diff` (SPF/concentration) | **Produits distincts** — garder les deux. Ne pas merger même si INCI = 1.0. Ex : `Xerial 30` ≠ `Xerial 50`. |
| Flag `tint-diff` | **Variantes de teinte** — garder toutes. |
| Flag `gamme-letter` | **Sous-gammes distinctes** — garder. Ex : `Nodé P` ≠ `Nodé K`. |
| Flag `kind-diff` seul | **Bug à corriger** : un des deux a un `kind` mal classé côté import. Vérifier curé d'abord, puis fusionner. |

---

## Ce qui est INTERDIT en cours de review

- ❌ **Pas de fusion automatisée par script.** Toute fusion = decision humaine. Le détecteur propose, l'humain dispose.
- ❌ **Pas de suppression d'un slug curé** au profit d'un slug scrapé. Le curé est la source de vérité.
- ❌ **Pas de modification de `data/products/index.ts`** sans avoir validé que les exports restent cohérents (cf. test `seed-data-integrity`).

---

## État actuel

Snapshot du dernier run (`audit-imported-products.ts --write`) :

| Catégorie | Total |
|---|---:|
| Fichiers importés | 140 |
| Produits importés | 2036 |
| Cross-source `auto-merge` | 559 |
| Cross-source `review` | 245 |
| Cross-source `weak` | 300 |
| Intra-source (toutes tiers) | 1152 |
| Produits importés ayant ≥ 1 dup candidat | 1277 |

Top fichiers à reviewer (volume de dupes) :

1. `skincare/svr/svr.pharmashop.seed.ts` (87)
2. `skincare/isdin/isdin.atida.seed.ts` (85)
3. `skincare/laRochePosay/laRochePosay.pharmashop.seed.ts` (69)
4. `skincare/garancia/garancia.atida.seed.ts` (67)
5. `skincare/avene/avene.pharmashop.seed.ts` (68)

Mettre à jour ce tableau si on rerun le script et que les chiffres bougent significativement.

---

## Liens

- Script : `backend/src/db/seed/scripts/audit-imported-products.ts`
- Rapport : `backend/src/db/seed/output/imported-products-audit.{md,json}` (gitignored)
- Pipeline import amont : [`IMPORT_PIPELINE.md`](./IMPORT_PIPELINE.md)
- Format produit : [`SEED_FORMAT.md`](./SEED_FORMAT.md)
