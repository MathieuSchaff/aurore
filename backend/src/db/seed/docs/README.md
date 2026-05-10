# Seed docs — index

> **À propos :** Index des docs du seed. Répond à « je veux faire X, qu'est-ce que je lis en premier ? ».

---

## Je veux…

| Tâche | Fichier | Pourquoi |
|---|---|---|
| **Ajouter un produit** | [`SEED_FORMAT.md`](./SEED_FORMAT.md) | 2 workflows : DB-first (skincare/solaire/bodycare) vs JS seed (haircare/dental/supplement) |
| **Insérer 1 produit en SQL** (page scrapée) | [`QUICK_SQL_INSERT.md`](./QUICK_SQL_INSERT.md) | Cheat sheet enums + template INSERT + pièges |
| **Ajouter un ingrédient** | [`../data/ingredients/GUIDE.md`](../data/ingredients/GUIDE.md) | Type, category, slug, contenu, tag |
| Comprendre **où** vivent les données (paths, schéma DB, taxonomie) | [`STATE.md`](./STATE.md) | Archi stable. Glossaire champs → [`STATE-GLOSSARY.md`](./STATE-GLOSSARY.md). Pipeline images → [`IMAGES.md`](./IMAGES.md). |
| Comprendre **comment on auto-tag** | [`AUTO-TAGS.md`](./AUTO-TAGS.md) | 6 passes détection · gating · cross-signal · seed/backfill wiring (roadmap : `ROADMAP.md` §9) |
| **Dédupliquer les produits scrapés** | [`DEDUP.md`](./DEDUP.md) | Workflow détection/review + [`DEDUP_DROPS.md`](./DEDUP_DROPS.md) backlog actif |
| Savoir **ce qui reste à faire** | [`ROADMAP.md`](./ROADMAP.md) | Dette ouverte + corrections récentes (SHAs) |
| Consulter un **audit ponctuel** | [`audits/`](./audits/) | INCI quality + dental ingredients |

---

## Arborescence

```
docs/
├── README.md              ← tu es ici
├── STATE.md               archi seed/taxo — source vérité
├── STATE-GLOSSARY.md      sémantique des champs (type / category / kind / tagType)
├── IMAGES.md              pipeline images produit (S3 + CDN Bunny)
├── ROADMAP.md             dette + à faire
├── AUTO-TAGS.md           comment on tag (architecture seule — roadmap dans ROADMAP §9)
├── SEED_FORMAT.md         ajout produit (workflow A/B)
├── QUICK_SQL_INSERT.md    recette SQL produit unique
├── DEDUP.md               workflow dédup
├── DEDUP_DROPS.md         backlog dédup + log produits droppés
├── audits/                inventaires ponctuels — extraire dette vers ROADMAP
│   ├── INCI-QUALITY-AUDIT.md       dette INCI (prose, separators, etc.)
│   ├── dental-ingredients.md       ingrédients dental manquants
│   └── NEXT-SESSION-PROMPT.md      handoff session INCI Phase 4
└── _archive/              référence longue, jamais lu en daily
    ├── auto-tags-audit.md               audit ChatGPT+Claude pipeline (digéré dans roadmap)
    ├── auto-tags-calibration.md         dry-run 2026-05-07/08 + cluster recalibrations
    ├── auto-tags-roadmap.md             calibration log + tier audit + roadmap historique (2026-05-07 → 2026-05-11)
    ├── auto-tags-session-log.md         détail session 2026-05-08/09
    ├── auto-tags-texture-postmortem.md  taxonomie texture-* (F2/F6 clos 2026-05-10)
    ├── dedup-drops-rounds.md            7 rounds Phase 6 (137 produits droppés)
    ├── INCI-ALPHABETICAL-AUDIT.md       368 produits INCI alpha (décision figée 2026-05-11)
    ├── algo-derm-fr-inci-handoff.md     handoff FR INCI parser (clos 2026-05-11)
    └── percent-claim-spec.md            spec % actifs (sur ROADMAP §8)
```

---

## Flux recommandé pour une modif seed

1. **Choisir le workflow** : `SEED_FORMAT.md` §1.
2. **Lire** `STATE.md §<section>` pour le contexte.
3. **Modifier** code ou DB.
4. **Vérifier** : `make ts-verify` + `make test-dev ARGS="seed-data-integrity"` + `ARGS="shared-schemas-vs-tags"`.
5. **Snapshot** (workflow A) ou `make db-reset && make db-snapshot` (workflow B). Commit `data.sql`.
6. **MAJ doc** : `STATE.md` si archi bougée, `ROADMAP.md` si dette bougée, `AUTO-TAGS.md` si règles tagging.

---

## Conventions

- **1 fichier = 1 rôle.** STATE = archi, ROADMAP = dette, AUTO-TAGS = règles tag, SEED_FORMAT = guide contrib.
- Chaque doc commence par `> **À propos :** …` pour rôle clair.
- `audits/` = snapshot à date, extraire la dette actionnable vers ROADMAP avant d'archiver.
- `_archive/` = log historique grep-able, ne pas relire en daily.
