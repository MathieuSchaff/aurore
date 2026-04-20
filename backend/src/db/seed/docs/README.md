# Seed docs — index

> **À propos :** Index des docs du seed. Répond à « je veux faire X, qu'est-ce que je lis en premier ? ». Les docs en aval sont triées par fréquence d'usage.

---

## Je veux…

| Tâche | Fichier à lire | Pourquoi |
|---|---|---|
| Comprendre **où** les données vivent (paths shared, layout seed, schéma DB) | [`STATE.md`](./STATE.md) | Architecture complète, source de vérité stable |
| Comprendre **ce qu'un champ veut dire** (`type`, `category`, `kind`, `tagType`) | [`AUDIT.md`](./AUDIT.md) | Glossaire sémantique — les mêmes mots ont des sens différents selon l'entité |
| Savoir **ce qui reste à faire** ou **ce qui est déjà fait** | [`ROADMAP.md`](./ROADMAP.md) | Dette ouverte + tableau des corrections récentes avec SHAs |
| **Ajouter un ingrédient** au seed | [`../data/ingredients/GUIDE.md`](../data/ingredients/GUIDE.md) | Guide contributeur ingrédients (type, category, slug, contenu, tag) |
| **Ajouter un produit / une marque** | [`SEED_FORMAT.md`](./SEED_FORMAT.md) | Guide contributeur produits (`UnifiedProductSeed`, champs, exemples) |
| Comprendre le **problème des doublons** CSV (EN) vs seed manuel (FR) | [`probleme-doublons.md`](./probleme-doublons.md) | Note d'analyse, pistes de solutions |
| **Backfiller les concentrations** d'ingrédients dans un seed produit | [`prompts/backfill-concentrations.md`](./prompts/backfill-concentrations.md) | Prompt réutilisable à donner à Claude |

---

## Flux recommandé pour une modif seed

1. **Lire** `STATE.md` (§ concerné).
2. **Consulter** `AUDIT.md` si un champ est ambigu.
3. **Suivre** le guide contributeur adapté (ingrédients → `GUIDE.md`, produits → `SEED_FORMAT.md`).
4. **Modifier** le code.
5. **Vérifier** avec les tests : `make test-dev ARGS="seed-data-integrity"` et `make test-dev ARGS="shared-schemas-vs-tags"`.
6. **Mettre à jour** `STATE.md` si l'architecture a bougé, `ROADMAP.md` si la dette a bougé.

---

## Conventions

- **1 fichier = 1 rôle.** Ne pas mélanger architecture (STATE) et dette (ROADMAP).
- Chaque doc commence par une ligne `> **À propos :** …` pour que le rôle soit clair au premier coup d'œil.
- Les noms hard-codés dans le code (paths, constantes, commits SHAs) doivent être validés contre le codebase avant d'écrire dans la doc.
