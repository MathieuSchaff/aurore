# Prompt de reprise — INCI Phase 4 post-Mc (frontière 29 occ)

```
Session de continuité — Phase 4 INCI-QUALITY-AUDIT.md, items D→Mc livrés
2026-05-11 (table compacte §6, log verbose archivé _archive/phase4-log.md).

ÉTAT POST-Mc

- 782 evidence entries (vs 703 baseline Phase 4)
- Bench : FR skincare 77.4 % / FR other 74.5 % / non-FR 79.5 %
- Gold-set macro F1 0.997, tests algo-derm 193 pass
- Top-40 non-FR vidé jusqu'à frontière 29 occ
- Snapshot actuel : audits/_archive/inci-audit-2026-05-11-after-phase4-Mc.txt

PLATEAU EVIDENCE ATTEINT

ROI evidence <30 occ ≈ <0.05 pt par entry. Continuer le tail ≥29 occ
(13 entries dispersées : glyceryl linoleate, hydrolyzed rice protein,
dimethyl isosorbide, steareth-20, carrageenan, aspartic acid,
palmitoyl tripeptide-38, sodium dna, camelina sativa seed oil, etc.)
ne rendra pas un gain mesurable au bench display.

DEUX PISTES DE PIVOT

**Piste A — Parser fix M.2 (singleton `1`, 29 occ)**
Cause probable : split sur virgule à l'intérieur de `1,2-hexanediol` /
`1,3-butylene glycol` → côté gauche `1`, côté droit `2-hexanediol`.
Modif côté algo-derm parser : protéger la virgule dans `\d,\d-` du split
(remplacer `1,2-` par `1·2-` middle-dot temporaire avant le split, puis
restore). Touche `splitINCI` — vérifier gold-set F1 0.997 conservé,
auto-strip dans splitINCI a déjà régressé F1 par le passé. Plus délicat
qu'un evidence batch ; +1 entry parser-side ne fait pas progresser bench
visible mais débloque ~30 produits non-FR avec `\d,\d-` polyols (corrige
le numérateur ET le dénominateur du ratio).

**Piste B — Pivot axe qualité (worst-match products / brand-level)**
Si l'objectif passe de "ratio corpus-wide" à "produits weak résolus" :
- Re-générer audit avec INCI_AUDIT_FULL=1 et lire §3 (worst-match
  skincare ≥10 ings ratio asc) + §4 (brand-level ratio).
- Cibler les ≤30 produits worst (souvent appareil sans INCI réel ou
  scrape cassé) plutôt que les tokens haute fréquence.
- Worst-match #1 historique post-Phase 3 : `medicube-age-r-booster-pro-
  mini` (appareil LED sans INCI). Vérifier le top actuel.

RECO : commencer par regen audit FULL et lire les buckets §3-§4 avant de
choisir. Si rien d'évident en worst-match, basculer sur M.2.

INVARIANTS

- Modifs chirurgicales, expliquer POURQUOI pas QUOI.
- Commits Conventional ≤72 chars sujet, JAMAIS Co-Authored-By Claude.
- Si modif algo-derm → vendor regen + tarball + bun.lock force-reset.
- snapshot DB obligatoire si UPDATE products.
- Documenter dans §6 Phase 4 table (1 ligne par item), pas wall-of-text.

À LIRE

- backend/src/db/seed/docs/audits/INCI-QUALITY-AUDIT.md §6 (table compacte)
- backend/src/db/seed/docs/audits/_archive/phase4-log.md si besoin du
  détail historique
- backend/scripts/cleanup-inci-trailing-prose.ts (modèle script DB-side)
- algo-derm/src/parser.ts (cible si M.2)

ENVIRONNEMENT

- Stack Docker actif : just dev-d (app_db, app_api, app_frontend)
- Bench : docker exec -w /app/backend -e DATABASE_URL='postgres://app:devpassword@app_db:5432/appdb' app_api bun scripts/benchmark-fr-parser.ts
- Audit FULL : ajouter -e INCI_AUDIT_FULL=1 ; redirect > audits/inci-audit-YYYY-MM-DD-<tag>.txt
- Tests algo-derm : cd ~/Mathieu/projets/algo-derm && npm run check:all
```
