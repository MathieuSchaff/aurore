# INCI quality — audit complet du corpus seed

> Audit conduit 2026-05-12. Complète [`INCI-ALPHABETICAL-AUDIT.md`](./INCI-ALPHABETICAL-AUDIT.md) qui couvre la dérive d'ordre Skinsafe. Script source : [`backend/src/db/seed/inci/audit-quality.ts`](../../../scripts/audit-inci-quality.ts).
>
> **Objectif** : identifier *tout* ce qui empêche les détecteurs auto-tags / le score dermo de fonctionner sur un INCI, avant d'élargir le périmètre auto-tags.

---

## TL;DR

Sur **4 077** produits avec INCI :

| Famille de problème | Produits | Gravité | État |
|---|---|---|---|
| Préambule `"Ingrédients :"` mal strippé | 0 | Faible | ✅ **RÉSOLU** |
| INCI sans virgules (single-token) | 65 | **Critique** | 🟠 En progrès (216 → 65) |
| Marketing prose dans le champ INCI | ~30-50 | **Critique** | 🟠 En progrès |
| INCI très court / non-INCI | 39 | Mineur | 🟡 Stable (objets dentaires) |
| Parser FR — gaps connus | ~20 patterns | Moyen | 🟠 Iter 4 en cours |
| Evidence DB — gaps communs | ~10 tokens | Élevé | 🟠 Iter 4 en cours (782 entries) |

**Recommandation d'ordre d'attaque actualisée** :

1. **Single-token re-split restant** (M, seed runner) — Les 65 produits restants (SVR, Bioderma, Erborian) bloquent encore le parser.
2. **Marketing prose** (M, re-scrape ciblé) — Medicube, Mixsoon et Mary&May présentent encore des blocs de texte descriptifs.
3. **Evidence DB ajouts** (M) — Top unmatched : `malachite extract`, `glyceryl linoleate`, `dimethyl isosorbide`.

---

## 1. Pathologies structurelles

### 1.1 Préambule `"Ingrédients :"` (0 produits)

**Statut : RÉSOLU.** Le commit `55df5932` a été appliqué rétroactivement. Les 168 produits précédemment affectés (Bioderma, Avène, Ducray) sont désormais propres.

### 1.2 INCI sans virgules — single-token (65 produits)

Le nombre de produits affectés est passé de **216 à 65**.
Les "bloqueurs" restants sont principalement des produits **SVR** (gamme Densitium) et **Bioderma** (gamme Pigmentbio).

**Exemples restants** :
```
SVR Densitium Bi-Sérum :
  "AQUA WATER EAU DICAPRYLYL CARBONATE ISONONYL ISONONANOATE HEXYLDECYL STEARATE OL..."
```

**Action** : Relancer `resplit-single-token.ts` sur ces 65 slugs spécifiques.

### 1.3 INCI très court / non-INCI (39 produits)

**Statut : Stable.**
Il s'agit majoritairement de brossettes interdentaires (GUM, Inava) ou d'accessoires (Forever Eye Mask) qui n'ont pas de liste d'ingrédients cosmétiques standard.

---

## 2. Marketing prose contamination

### Résolus (2026-05-12, `worst-match-prose.ts`)

| Slug | Fix appliqué |
|---|---|
| medicube-age-r-booster-pro-mini | `inci = NULL` — appareil LED, pas de liste d'ingrédients cosmétiques |
| mary-may-blackberry-complex-glow-wash-off-pack | `inci = NULL` — prose pure, aucun INCI récupérable |
| eucerin-aquaphor-baume-reparateur | Preamble `SANS CONSERVATEUR, SANS COLORANT, NON COMÉDOGÈNE, CLINIQUEMENT PROUVÉ` strippé (hors `MARKETING_PREFIX_RX`) |
| mixsoon-melting-collagen-cheek-film | Extrait après `Ingrédients :` — `prose.ts` excluait car `< 5 commas` post-strip |
| mixsoon-melting-collagen-eye-film | Idem |

### Restants

| Slug | Match | Cause | Prochaine action |
|---|---|---|---|
| power-repair-hydrating-soothing-facial-toner | 25.0 % | Terminologie non-standard ("Organic herbal...") + evidence manquante | Re-scrape ou evidence |

---

## 3. Parser FR — gaps identifiés

Le bench `benchmark-fr-parser.ts` rapporte désormais un meilleur match-rate suite aux itérations du 11 mai.

### Top tokens FR non-matchés (restants)

| Token brut | Occ |
|---|---|
| `malachite extract` | 20 |
| `acetyl tetrapeptide-2` | 16 |
| `glutamate de stearoyl de sodium` | 14 |
| `polyacryloyldimethyl taurate de sodium` | 14 |

---

## 4. Evidence DB — gaps communs (non-FR + FR-après-parse)

### Top 5 unmatched non-FR (alias index miss)

| Token | Occ |
|---|---|
| `glyceryl linoleate` | 29 |
| `hydrolyzed rice protein` | 29 |
| `dimethyl isosorbide` | 29 |
| `steareth-20` | 29 |
| `carrageenan` | 29 |

---

## 5. Alphabetical drift (rappel)

Voir [`INCI-ALPHABETICAL-AUDIT.md`](./INCI-ALPHABETICAL-AUDIT.md) — 368 produits Skinsafe en ordre alphabétique. Mitigation actuelle (position-cap relax) → macro F1 0.997 sur gold-set.

---

## 6. Reproduire l'audit

```bash
just audit-inci-quality
```

Sections :
1. INCI pathologies (preamble, mojibake, truncated, very-short, single-token, no-comma)
2. Top 40 unmatched tokens (FR + non-FR)
3. Worst-match skincare products (≥10 ings, sorted ratio asc)
4. Brand-level match-rate (≥5 products)

---

## 7. Références

- `backend/src/db/seed/inci/audit-quality.ts` — script source
- `backend/src/db/seed/docs/audits/INCI-QUALITY-AUDIT.md` — ce document
- `algo-derm/src/parser.ts` — couche FR→Latin
- `algo-derm/data/ingredient_evidence.merged.json` — evidence DB
