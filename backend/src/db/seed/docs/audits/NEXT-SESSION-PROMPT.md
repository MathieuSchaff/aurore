# Prompt de reprise — INCI §2 post-session 2026-05-12 (soir)

```
Session de continuité — INCI §2 quality, evidence batch livré 2026-05-12.

ÉTAT POST-SESSION

Bench (FR skincare / FR other / non-FR) : 78.5% / 75.2% / 80.2%
Gold-set macro F1 0.997, tests algo-derm 193 pass.
Snapshot : audits/_archive/inci-audit-2026-05-12-after-evidence-30.txt

Livré cette session (1 commit aurore + 1 commit algo-derm) :
- feat(vendor): bump algo-derm — 30 new evidence entries (812 total)
  FR ≥14 occ : malachite extract, maris sal, copolymere pvm ma,
  acetyl tetrapeptide-2, potassium chloride, polyquaternium-67,
  propylheptyl caprylate, alumine, polyglyceryl-2 stearate, triethylhexanoine,
  sterols de brassica campestris, gomme biosaccharide-1, beheneth-25,
  sodium acetate, trisiloxane, pca de sodium, vinyl dimethicone, polyglycerine-3,
  lepidium sativum sprout extract, octyldodeceth-16,
  polyglyceryl-3 polydimethylsiloxyethyl dimethicone.
  non-FR 29 occ : glyceryl linoleate, hydrolyzed rice protein, dimethyl
  isosorbide, steareth-20, carrageenan, aspartic acid, palmitoyl tripeptide-38,
  sodium dna, camelina sativa seed oil.

PIÈGE DÉCOUVERT (important pour futures sessions)

  JAMAIS modifier ingredient_evidence.merged.json directement.
  C'est un BUILD OUTPUT régénéré par `npm run merge:dataset`.
  Ajouter dans data/sources/curated.generated.json + npm run merge:dataset.
  JAMAIS npm run check:all avant vendor-regen (écrase curated.generated.json
  via build:dataset). Séquence correcte :
    1. Ajouter à curated.generated.json
    2. cd algo-derm && npm run merge:dataset
    3. cd aurore && just vendor-algo-derm
    4. Fixer bun.lock (rm hash algo-derm, bun install)
    5. just reinstall-backend
    6. bench

ITEMS OUVERTS §2 (ROADMAP.md)

1. Piste A parser fix M.2 :
   `1` (29 occ non-FR) = `1,2-hexanediol` splitté sur virgule.
   Fix dans algo-derm/src/parser.ts — attention aux effets de bord.

2. Top unmatched FR restants (≤14 occ — ROI faible) :
   `glutamate de stearoyl de sodium` (14), `collagen soluble` (14),
   `juniperus mexicana oil` (14), `ectoine` (13), `pvp` (12),
   `helichrysum italicum flower oil` (13), `tripeptide-1` (13),
   `hexapeptide-9` (13).

3. Worst-match parse artifacts restants (§3 rank 10) :
   - clinique-smart-clinical-repair-serum : `WATERAQUAEAU` (concat),
     `ASCORBYL | GLUCOSIDE` (split sur espace dans ASCORBYL GLUCOSIDE).
   - `ETHYLHEXYL METHOXYCINNAMATE- DIPROPYLENE` (hyphen-space,
     Erborian CC eye). Risqué à normaliser globalement.

PLATEAU EVIDENCE

ROI evidence ≤14 occ ≈ <0.03 pt bench. Prochaine marge non-FR :
ppg-26-buteth-26 (28), pca (28), ethyl hexanediol (28),
synthetic fluorphlogopite (28). Mais ROI < 0.1 pt total.

Meilleur levier maintenant : Piste A parser fix (1,2-hexanediol) → débloque
le token `1` à 29 occ + probablement d'autres composés similaires.

RECO ENTRÉE

1. Lire inci-audit-2026-05-12-after-evidence-30.txt §2 pour état exact.
2. Parser fix M.2 (1,2-hexanediol comma) ou §3 Images CDN.
3. Si evidence : ajouter à curated.generated.json (JAMAIS merged.json),
   puis séquence ci-dessus.

INVARIANTS

- Commits Conventional ≤72 chars, JAMAIS Co-Authored-By Claude.
- Si modif algo-derm → séquence complète (curated.generated.json →
  merge:dataset → vendor-algo-derm → fix bun.lock → reinstall-backend).
- just audit-db → 0 violation avant tout commit.
- Snapshot DB si UPDATE products.

ENVIRONNEMENT

- Stack Docker : just dev-d (app_db, app_api, app_frontend)
- Bench : docker exec -w /app/backend \
    -e DATABASE_URL='postgres://app:devpassword@app_db:5432/appdb' \
    app_api bun src/db/seed/inci/benchmark-fr-parser.ts
- Audit FULL : docker exec ... -e INCI_AUDIT_FULL=1 \
    app_api bun src/db/seed/inci/audit-quality.ts ; rediriger vers
    audits/_archive/inci-audit-YYYY-MM-DD-<tag>.txt
- Tests algo-derm : cd ~/Mathieu/projets/algo-derm && npm run typecheck
  (pas check:all — écrase curated.generated.json)
- Vendor regen : just vendor-algo-derm (depuis aurore/)

À LIRE AVANT DE TOUCHER algo-derm

- algo-derm/data/sources/curated.generated.json (source vérité evidence)
- audits/_archive/inci-audit-2026-05-12-after-evidence-30.txt §2
- NEXT-SESSION-PROMPT.md (ce fichier)
```
