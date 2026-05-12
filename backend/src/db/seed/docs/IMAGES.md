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

### 2.2 État (snapshot 2026-05-12 post-session §7.3, DB live)

| Niveau | Produits | Note |
|---|---:|---|
| `image_url` patché CDN Bunny | **4014** | `https://aurore-cdn.b-cdn.net/products/<slug>.webp` |
| URL externe non patchée | 61 | 59 skinsafe (PNG 403) + 2 atida (404) |
| Pas d'`image_url` (NULL/'') | 127 | top : nutripure (16), mustela (9), avène (7), svr (7) |
| **Total** | **4202** | couverture CDN **95.5 %** |

Snapshot mapping historique (`Vault/aurore-archive/seed-output/image-mapping.json`, n=2700) couvrait l'état pré-enrichissement (~3303 produits). La couverture relative s'est améliorée malgré l'ajout de ~900 produits : 82 % → 95.5 %.

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

### 3.1 Historique (build mapping initial, archivé)

Réf `Vault/aurore-archive/seed-output/image-mapping.json` (n=2700, snapshot pré-enrichissement).

| Bucket | Nb | Action patch CDN |
|---|---:|---|
| LOCAL only (pas d'imageUrl actuel) | 1172 | insert `imageUrl` |
| LOCAL + Atida (URL `assets.atida.com` existante) | 977 | replace → CDN |
| LOCAL sans ligne `imageUrl` | 76 | insert |
| LOCAL + Skinsafe | 4 | replace → CDN |
| Atida DL (résidus) | 58 | replace → CDN |
| Skinsafe DL (K-beauty récupérables) | 413 | replace → CDN |
| **Total mappé = 2700** ✅ | | patché |

### 3.2 État DB live 2026-05-12 (post-session §7.3)

| Bucket | Nb | Détail |
|---|---:|---|
| URL CDN aurore-cdn | 4014 | OK |
| Skinsafe externe (PNG protégés 403) | 59 | URL `cdn1.skinsafeproducts.com` préservée — failures JSON archivé : 119 (60 produits depuis dédupliqués/supprimés) |
| Atida externe (404) | 2 | URL `assets.atida.com` préservée |
| `image_url` NULL / vide | 127 | top : nutripure (16), mustela (9), avène (7), svr (7), eucerin (6), sulwhasoo (6) |
| **Total** | **4202** | |

### Skinsafe — gap résiduel (browser automation requise)

Failures JSON (archive) : 119 PNG en `http 403`. Cf. ROADMAP §7.3. Approche : scrapper-para session avec cookies (`.browser_session/` déjà setup).

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
bun run backend/src/images/upload/batch.ts

# 4. patch seeds (IMAGE_CDN_BASE déjà dans .env.dev)
bun run backend/src/images/maintenance/patch-urls.ts

# 5. vérif
make ts-verify
```

Re-runnable : changer `IMAGE_CDN_BASE` et relancer le patch ré-écrit toutes les URL gérées par le mapping.

### 4.4 Service unifié `upload-product-image` (recommandé pour ajouts ponctuels)

Pour publier une image isolée ou un petit lot, préférer le service au workflow §4.3 (qui exige un brand fetcher + run mass upload). Le service couvre tout en une commande : fetch URL ou fichier local → magick webp → Bunny PUT → DB UPDATE.

```bash
# single from URL (Shopify CDN, brand site, etc.)
bun run backend/src/images/upload/main.ts <slug> --url <URL>

# single from local file (manuel DL préalable)
bun run backend/src/images/upload/main.ts <slug> --file /tmp/img.jpg

# batch (JSON array of { slug, url? | file? })
bun run backend/src/images/upload/main.ts --batch jobs.json --concurrency 4

# flags : --dry  --no-db  --no-staged
```

Implémentation : `scripts/lib/upload-product-image.ts` (`uploadProductImage(input, opts)`). Le CLI `scripts/upload-product-image.ts` est un thin wrapper.

**Workflow ajout produit existant en DB sans image** :
1. Trouver URL pack-shot manuellement (page produit marque, CDN Shopify, etc.).
2. `bun run scripts/upload-product-image.ts <db-slug> --url <URL>`.
3. `just db-snapshot` puis commit `snapshot/data.sql`.

**Remplace** : `fetch-images-<brand>.ts` one-shot (chacun dupliquait HTML scrape + DL + convert + save). La couche discovery (regex HTML per-brand) n'est plus codée — l'utilisateur fournit l'URL au cas par cas.

---

## 5. Décisions design

- **Format `.webp` uniforme** — gain ~30 % sur thumbs jpg, ~50 % sur PNG. Bunny CDN sait servir des fallbacks au besoin.
- **Flat `products/<slug>.<ext>`** — pas de hiérarchie marque (lookup direct depuis le slug, pas de jointure).
- **URL absolue dans seed** — l'env var est résolue au patch-time, pas runtime. Évite import d'un module config dans 80+ seeds.
- **Pas de variantes contenance dans le slug** — un produit seed = une image. Si plusieurs formats du produit existent (ex: `-100ml` et `-400ml`), le matcher choisit le format le plus court (heuristique « base »).
- **Originaux préservés** — `output/images/` et `output/product-details/` restent intacts, on n'écrit que dans `images-normalized/`. Re-build idempotent.

---

## 6. Re-générer mapping (`build-image-mapping.ts`)

```bash
set -a && source .env.dev && set +a
bun run backend/src/images/maintenance/build-mapping.ts [--dry]
```

Source de vérité = **Bunny Storage list** (`/<zone>/products/`). Le local `output/images-normalized/` est un staging transient nettoyé après upload — il ne peut pas servir de référence. Le script :

1. Liste `products/*.webp` sur Bunny (auth `BUNNY_STORAGE_PASSWORD`).
2. Liste `products.slug` en DB (`APP_DATABASE_URL`).
3. Cross-join → `mapping[slug] = { source: 'cdn', file: '<slug>.webp', localStaged: bool }`.
4. Écrit `output/image-mapping.json` + section `gaps` (CDN orphans, local pending, produits sans CDN).

Shape compatible avec `patch-image-urls.ts` (lit `Object.keys(mapping)`) et `scrapper-para/scripts/download-external-images.ts` (lit `mapping[slug].source`).

**Cas d'usage** :
- Après ajout de fetchers brand + `upload-images.ts` → re-run pour régénérer mapping.
- Avant `patch-image-urls.ts` si nouvelles uploads.
- Debug : section `gaps.cdnOrphans` détecte webp uploadés mais produit supprimé/renommé depuis.

Mapping historique archivé (Python one-shot, intro Pharmashop) : `Vault/aurore-archive/seed-output/image-mapping.json` (n=2700, pré-enrichissement). Conservé pour comparaison historique uniquement.

---

## 7. Tâches futures (cf. ROADMAP §7)

- 59 PNG Skinsafe en 403 — browser automation (scrapper-para `.browser_session/`). Cf. failures JSON archivé.
- 127 produits sans image (nutripure 16, mustela 9, avène 7…) — workflow recommandé : `upload-product-image.ts <slug> --url <URL>` au cas par cas.
- 2 URL Atida en 404 — source disparue, NULL ou alt source.
- ~~Scripter `build-image-mapping.ts`~~ ✅ livré 2026-05-12.
- ~~Service unifié upload~~ ✅ livré 2026-05-12 (`upload-product-image.ts`, cf §4.4).
- Optionnel : route backend `/seed-images/<slug>.webp` (servir local en dev avant CDN).

---

## 8. Liens

- Pipeline import scrap amont : `~/Mathieu/Vault/aurore-archive/seed-docs/IMPORT_PIPELINE.md` (archivé)
- Format seed produit : [`SEED_FORMAT.md`](./SEED_FORMAT.md) §3 (workflow B)
- État global seed : [§3.3 Source de données seed](#33-source-de-données-seed)
- Roadmap : [`ROADMAP.md`](./ROADMAP.md)

