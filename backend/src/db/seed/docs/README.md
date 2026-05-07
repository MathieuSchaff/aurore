# Seed docs — index

> **À propos :** Index des docs du seed. Répond à « je veux faire X, qu'est-ce que je lis en premier ? ».

---

## Je veux…

| Tâche | Fichier | Pourquoi |
|---|---|---|
| **Ajouter un produit** (n'importe quelle catégorie) | [`SEED_FORMAT.md`](./SEED_FORMAT.md) | Guide contributeur avec les 2 workflows : DB-first (skincare/solaire/bodycare) vs JS seed (haircare/dental/supplement) |
| **Insérer 1 produit en SQL** (depuis page scrapée) | [`QUICK_SQL_INSERT.md`](./QUICK_SQL_INSERT.md) | Recette express : cheat sheet enums + template INSERT + pièges (heredoc, unicité, CDN) |
| **Ajouter un ingrédient** | [`../data/ingredients/GUIDE.md`](../data/ingredients/GUIDE.md) | Guide contributeur ingrédients (type, category, slug, contenu, tag) |
| Comprendre **où** les données vivent (paths, layout, schéma DB) | [`STATE.md`](./STATE.md) §1-9 | Architecture complète, source de vérité stable |
| Comprendre **ce qu'un champ veut dire** (`type`, `category`, `kind`, `tagType`) | [`STATE.md`](./STATE.md) §10 | Glossaire sémantique cross-entité (ex-AUDIT.md) |
| Gérer les **images produit** (CDN, S3, mapping) | [`STATE.md`](./STATE.md) §11 | Pipeline images Bunny CDN (ex-IMAGES.md) |
| Savoir **ce qui reste à faire** ou **ce qui est déjà fait** | [`ROADMAP.md`](./ROADMAP.md) | Dette ouverte + tableau corrections récentes avec SHAs |
| Consulter un **audit ponctuel** (INCI vs seed, etc.) | [`audits/`](./audits/) | Inventaires de référence ; la dette actionnable extraite est portée dans ROADMAP |

---

## Flux recommandé pour une modif seed

1. **Choisir le workflow** : `SEED_FORMAT.md` §1 (DB-first vs JS seed selon la catégorie).
2. **Lire** `STATE.md §<section>` pour le contexte (archi, taxonomie tags, etc.).
3. **Modifier** code ou DB selon workflow.
4. **Vérifier** : `make ts-verify` + `make test-dev ARGS="seed-data-integrity"` + `ARGS="shared-schemas-vs-tags"`.
5. **Snapshot** (workflow A) ou `make db-reset && make db-snapshot` (workflow B). Commit `data.sql`.
6. **MAJ doc** : `STATE.md` si l'archi a bougé, `ROADMAP.md` si la dette a bougé.

---

## Conventions

- **1 fichier = 1 rôle.** STATE = archi, ROADMAP = dette, SEED_FORMAT = guide contrib.
- Chaque doc commence par `> **À propos :** …` pour rôle clair.
- Noms hard-codés (paths, constantes, SHAs) validés contre le codebase avant écriture.

---

## Archive

Docs déplacées vers `~/Mathieu/Vault/aurore-archive/seed-docs/` (référence locale) :
- `IMPORT_PIPELINE.md` — pipeline scrap Atida/Pharmashop, code archivé (cf STATE.md §1.3)
- `DEDUP.md` — workflow dédup intra/inter-source, scripts archivés
- `prompts/` — prompts one-shot
- `AUDIT.md` — fusionné dans `STATE.md §10`
- `IMAGES.md` — fusionné dans `STATE.md §11`
