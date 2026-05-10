# Pipeline images produit — seed ↔ S3 ↔ CDN

> Où vivent les images produit, mapping seed↔image, pipeline upload S3 → CDN Bunny.

> **Architecture seed** : voir [`STATE.md`](./STATE.md). **Roadmap images** : [`ROADMAP.md §7`](./ROADMAP.md#7-images--cdn).

---

## 1. Trois stores

| Store | Rôle | Origine | Naming | Résolution | Taille |
|---|---|---|---|---|---|
| `output/images/<slug>.{jpg,png}` | Thumbnails listing Pharmashop | scrap field `imageUrl` (URL CDN Pharmashop) | slug dérivé du `link` Pharmashop | 198×198 | ~71 MB, 3272 fichiers |
| `output/product-details/<dir>/img_NN.{jpg,png}` | Pages détail (HD) | scrap fiche produit Pharmashop | dir = path URL `/`→`_`, fichier = `img_01..N` | 600×600 (parfois plus) | ~212 MB, 2304 images sur 1918 dirs |
| `output/images-downloaded/<slug>.{jpg,png}` | DL externe (Atida + Skinsafe) | `scrapper-para/scripts/download-external-images.ts` | slug seed canonique | source CDN (variable) | ~47 MB, 471 fichiers |
| `output/images-normalized/<slug>.webp` | **Sortie pipeline** prête S3 | conversion hybride detail → thumb fallback → atida → skinsafe | slug seed canonique, flat | source-natif (pas d'upscale) | ~65 MB, 2700 fichiers |

Originaux laissés intacts. Seul `images-normalized/` est uploadé.

---

## 2. Mapping seed ↔ image

### 2.1 Stratégie

Le mapping `slug seed → fichier image` vit dans `output/image-mapping.json`. Il est généré en cherchant pour chaque slug :

1. **Detail prioritaire** — si un dossier `product-details/<dir>` contient `img_01.jpg` et que le suffixe du dirname matche le slug seed (bidirectionnel : slug suffixe-of-dir, ou dir suffixe-of-slug), on prend le HD.
2. **Thumb fallback** — sinon on cherche dans `output/images/` par préfixe bidirectionnel (image = `<slug>-<format>` ou seed = `<image>-<id-atida>`).
3. **Atida / Skinsafe DL** — pour les seeds sans match local mais avec un `imageUrl` externe (`assets.atida.com` ou `cdn1.skinsafeproducts.com`), `scrapper-para/scripts/download-external-images.ts` télécharge l'image et l'ajoute au mapping.
4. **Pas de fuzzy aveugle** — token-reorder et token-set matching ont été testés mais produisent des faux positifs (ex: `aderma-exomega-huile-500` ≠ `aderma-exomega-control-huile-lavante-emolliente-200ml`). On ne match que par préfixe bidirectionnel exact.

### 2.2 État (snapshot)

| Niveau | Seeds couverts | Source |
|---|---:|---|
| Detail HD 600×600 | 1168 | `product-details/` |
| Thumb fallback LR 198×198 | 1061 | `images/` |
| Atida DL | 58 | `images-downloaded/` |
| Skinsafe DL | 413 | `images-downloaded/` |
| **Total mappé** | **2700 / 3303** (82%) | |
| Sans image (mapping) | 603 | K-beauty + résidus pharma (cf. §3) |

Format du mapping :

```json
{
  "mapping": {
    "avene-cicalfate-creme-protectrice": {
      "source": "detail",
      "dir": "fr_beaute_avene_avene_cicalfate_creme_protectrice_40_ml_html",
      "file": "img_01.jpg"
    },
    "klorane-quinine-edelweiss-shampoing-fortifiant": {
      "source": "thumb",
      "file": "klorane-quinine-edelweiss-shampoing-fortifiant-200ml.jpg"
    }
  },
  "summary": { "total": 2229, "detail": 1168, "thumb": 1061 }
}
```

---

## 3. Classification des produits seed par source d'image

| Bucket | Nb | Action patch CDN |
|---|---:|---|
| LOCAL only (pas d'imageUrl actuel) | 1172 | insert `imageUrl` |
| LOCAL + Atida (URL `assets.atida.com` existante) | 977 | replace → CDN |
| LOCAL sans ligne `imageUrl` | 76 | insert |
| LOCAL + Skinsafe | 4 | replace → CDN |
| Atida DL (résidus) | 58 | replace → CDN |
| Skinsafe DL (K-beauty récupérables) | 413 | replace → CDN |
| **Total mappé = 2700** ✅ | | patché |
| Skinsafe externe (PNG protégés 403) | 119 | **non touché** (URL Skinsafe préservée) |
| Atida externe (404) | 2 | non touché |
| Sans image (vide/absent) | 636 | non touché |
| Shopify-only (remedy) | 13 | non touché |

### Skinsafe — état après DL (avril 2026)

Sur 532 produits Skinsafe-only, **413 récupérés** (78%) via `download-external-images.ts`. Les 119 restants sont des PNG en 403 Forbidden (probablement protection per-asset Skinsafe). Atida 58/60 (97%, 2 × 404).

Pour récupérer les 119 PNG bloqués il faudra browser automation (cookies session, scrapper-para). Cf. ROADMAP §7.3.

### Brands sans image du tout (636)

svr (35 résidus / 177 catalogue), the-ordinary (35), bioderma (31), theramid (29), avene (24 résidus / 146), dermeden (22), geek (19), nutripure (16), nooance (16), loccitane (16)…
Mix de marques jamais scrappées (the-ordinary, bioderma) + résidus de marques scrappées (variantes/références particulières).

---

## 4. Pipeline complet

```
scrape Pharmashop ──┬──> output/images/<slug>.jpg               (thumb listing)
                    └──> output/product-details/<dir>/img_NN.jpg (detail HD)

[script]    download-external-images.ts ──> output/images-downloaded/<slug>.{jpg,png}
                                              (Atida + Skinsafe URLs from seeds)

[hors-script] ── build-image-mapping.py ──> output/image-mapping.json
[script]    download-external-images.ts (idempotent) ──> output/images-normalized/<slug>.webp
                                                          + merge mapping

[script]    upload-images.ts ──> S3 bucket → Bunny CDN edge
                                  └──> https://${IMAGE_CDN_BASE}/products/<slug>.webp

[script]    patch-image-urls.ts (env IMAGE_CDN_BASE) ──> data/products/**/*.seed.ts
                                                          └── imageUrl: '<absolute-cdn-url>'
```

### 4.1 Scripts

| Script | Rôle |
|---|---|
| `scrapper-para/scripts/download-external-images.ts` | Pour chaque slug ∉ mapping avec `imageUrl` Atida/Skinsafe : fetch parallèle (8 workers, UA banal, 10s timeout), save dans `images-downloaded/`, convert webp dans `images-normalized/`, merge mapping. Idempotent (skip si webp existe). Failures → `output/image-download-failures.json`. `--dry` pour preview. |
| `scripts/upload-images.ts` | Upload `output/images-normalized/*.webp` → S3 (Bun.S3Client, parallèle). Idempotent côté S3 (noms stables). DRY_RUN=1 pour preview. |
| `scripts/patch-image-urls.ts` | Pour chaque slug ∈ mapping, écrit `imageUrl: '${IMAGE_CDN_BASE}/products/<slug>.webp'` dans le `<brand>.seed.ts`. Replace si présent, insert sinon (après `url:` ou avant `tags:`). Slugs hors mapping → laissés intacts. `--dry` pour preview. |

### 4.2 Env vars

**upload-images.ts** (Bunny Storage HTTP native API) :

| Var | Default | Notes |
|---|---|---|
| `BUNNY_STORAGE_ZONE` | — | requis. Nom du Storage Zone (ex: `aurore-images`). |
| `BUNNY_STORAGE_PASSWORD` | — | requis. Storage Zone → FTP & API Access → Password. |
| `BUNNY_STORAGE_HOSTNAME` | `storage.bunnycdn.com` | hostname régional (DE par défaut, sinon `ny.storage.bunnycdn.com`, etc.). |
| `BUNNY_STORAGE_PREFIX` | `products/` | trailing slash auto |
| `DRY_RUN` | `0` | `1` = preview |
| `CONCURRENCY` | `16` | uploads parallèles |

**patch-image-urls.ts** :

| Var | Default | Notes |
|---|---|---|
| `IMAGE_CDN_BASE` | — | requis sauf `--dry`. Ex : `https://aurore-cdn.b-cdn.net`. URL absolue résolue au patch-time. |

### 4.3 Workflow

```bash
# 1. (re)build mapping & normaliser webp si scrap a bougé — ad hoc, pas de script versionné
#    voir §6 pour les commandes manuelles

# 2. compléter avec downloads externes (Atida / Skinsafe)
(cd ../scrapper-para && bun run scripts/download-external-images.ts)

# 3. upload Bunny Storage (env vars depuis .env.dev)
set -a; source .env.dev; set +a
bun run backend/src/db/seed/scripts/upload-images.ts

# 4. patch seeds (IMAGE_CDN_BASE déjà dans .env.dev)
bun run backend/src/db/seed/scripts/patch-image-urls.ts

# 5. vérif
make ts-verify
```

Re-runnable : changer `IMAGE_CDN_BASE` et relancer le patch ré-écrit toutes les URL gérées par le mapping.

---

## 5. Décisions design

- **Format `.webp` uniforme** — gain ~30 % sur thumbs jpg, ~50 % sur PNG. Bunny CDN sait servir des fallbacks au besoin.
- **Flat `products/<slug>.<ext>`** — pas de hiérarchie marque (lookup direct depuis le slug, pas de jointure).
- **URL absolue dans seed** — l'env var est résolue au patch-time, pas runtime. Évite import d'un module config dans 80+ seeds.
- **Pas de variantes contenance dans le slug** — un produit seed = une image. Si plusieurs formats du produit existent (ex: `-100ml` et `-400ml`), le matcher choisit le format le plus court (heuristique « base »).
- **Originaux préservés** — `output/images/` et `output/product-details/` restent intacts, on n'écrit que dans `images-normalized/`. Re-build idempotent.

---

## 6. Re-générer mapping et webp (ad hoc)

Pas encore scripté en TS — le mapping a été construit en Python one-shot. À scripter quand le scrap bougera. Étapes manuelles :

1. Lister slugs seed et image filenames, faire le matching bidirectionnel detail-priority/thumb-fallback.
2. Écrire `output/image-mapping.json`.
3. Pour chaque entrée, convertir source → `output/images-normalized/<slug>.webp` via `magick <src> -quality 85 <dst>`.

Voir aussi `output/image-mapping-detail.json` (mapping detail-only, sert au debug).

---

## 7. Tâches futures (cf. ROADMAP §7)

- 119 PNG Skinsafe en 403 — récupérables via browser automation (scrapper-para).
- ~636 produits sans image (the-ordinary, bioderma résidus, etc.) — scrap source à choisir.
- Scripter le pipeline mapping+normalize en TS (`build-image-mapping.ts`) — actuellement Python one-shot.
- Optionnel : route backend `/seed-images/<slug>.webp` (servir local en dev avant CDN).

---

## 8. Liens

- Pipeline import scrap amont : `~/Mathieu/Vault/aurore-archive/seed-docs/IMPORT_PIPELINE.md` (archivé)
- Format seed produit : [`SEED_FORMAT.md`](./SEED_FORMAT.md) §3 (workflow B)
- État global seed : [§3.3 Source de données seed](#33-source-de-données-seed)
- Roadmap : [`ROADMAP.md`](./ROADMAP.md)

