# Prompt de reprise — INCI §2 post-session 2026-05-12

```
Session de continuité — INCI §2 quality, 3 items livrés 2026-05-12.

ÉTAT POST-SESSION

Bench (FR skincare / FR other / non-FR) : 77.5% / 74.5% / 79.6%
Gold-set macro F1 0.997, tests algo-derm 193 pass.
Snapshot : audits/_archive/inci-audit-2026-05-12-after-resplit.txt

Livré cette session (3 commits) :
- fc40c835 : 5 worst-match prose fixés (medicube/mary-may → NULL,
  eucerin preamble, mixsoon×2 post-Ingrédients)
- f38dd6c6 : separators.ts étendu — en-dash (Erborian ranks 13-14)
  + no-space period (Avène rank 7). 22 produits.
- 2d0dac46 : resplit-single-token — 9 produits (65→55 single-token,
  66→56 no-comma). SVR/Bioderma/Vichy/LRP/Kréme/Lierac.

ITEMS OUVERTS §2 (ROADMAP.md)

1. Top unmatched FR (algo-derm evidence) :
   `malachite extract` (20 occ), `maris sal sea salt sel marin` (18),
   `copolymere pvm ma` (18), `acetyl tetrapeptide-2` (16),
   `glutamate de stearoyl de sodium` (14).

2. Top unmatched non-FR (algo-derm evidence) :
   `glyceryl linoleate` (29), `hydrolyzed rice protein` (29),
   `dimethyl isosorbide` (29), `steareth-20` (29), `carrageenan` (29).
   Singleton `1` (29 occ) = Piste A parser fix M.2
   (`1,2-hexanediol` split sur la virgule).

3. Worst-match parse artifacts restants (§3 rank 10) :
   - clinique-smart-clinical-repair-serum : `WATERAQUAEAU` (concat),
     `ASCORBYL | GLUCOSIDE` (split sur espace dans ASCORBYL GLUCOSIDE).
   - `ETHYLHEXYL METHOXYCINNAMATE- DIPROPYLENE` (hyphen-space separator,
     Erborian CC eye). Risqué à normaliser globalement.

PLATEAU EVIDENCE

ROI evidence <30 occ ≈ <0.05 pt bench. Les 29-occ non-FR sont à la
frontière — quelques entrées peuvent débloquer plusieurs produits.

RECO ENTRÉE

1. Lire inci-audit-2026-05-12-after-resplit.txt §2 (top unmatched) pour
   état exact des tokens à ajouter.
2. Ouvrir algo-derm/data/ingredient_evidence.merged.json, ajouter les
   5-10 tokens FR + 5 non-FR les plus fréquents.
3. just vendor-algo-derm → just reinstall-backend → bench → commit.
4. Si bench plateau < 0.2 pt : passer à Piste A (parser fix M.2 dans
   algo-derm/src/parser.ts) ou §3 Images CDN.

INVARIANTS

- Commits Conventional ≤72 chars, JAMAIS Co-Authored-By Claude.
- Si modif algo-derm → vendor regen + bun install --force.
- just audit-db → 0 violation avant tout commit.
- Snapshot DB si UPDATE products.

ENVIRONNEMENT

- Stack Docker : just dev-d (app_db, app_api, app_frontend)
- Bench : docker exec -w /app/backend \
    -e DATABASE_URL='postgres://app:devpassword@app_db:5432/appdb' \
    app_api bun src/db/seed/inci/benchmark-fr-parser.ts
- Audit FULL : ajouter -e INCI_AUDIT_FULL=1 ; rediriger vers
    audits/_archive/inci-audit-YYYY-MM-DD-<tag>.txt
- Tests algo-derm : cd ~/Mathieu/projets/algo-derm && npm run check:all
- Vendor regen : just vendor-algo-derm (depuis aurore/)

À LIRE AVANT DE TOUCHER algo-derm

- algo-derm/data/ingredient_evidence.merged.json (source vérité evidence)
- audits/_archive/inci-audit-2026-05-12-after-resplit.txt §2 (top unmatched)
- NEXT-SESSION-PROMPT.md (ce fichier)
```
