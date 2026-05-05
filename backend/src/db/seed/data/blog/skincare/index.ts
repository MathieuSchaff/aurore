import type { ArticleInput } from '../article-data'
import { SIX_ERREURS_VIEILLISSEMENT_PEAU } from './6-erreurs-vieillissement'
import { CENTELLA_ROUGEURS_ROSACEE } from './centella'
import { keratosePilaire } from './keratose-pilaire'
import { LASER_ANTI_AGE_NON_ABLATIF } from './laser'
import { RETINOID } from './retinoids'
import { ROSACEE_01_COMPRENDRE } from './rosacee_01_comprendre_la_rosacee'
import { ROSACEE_02_PHYSIOPATHOLOGIE } from './rosacee_02_physiopathologie'
import { ROSACEE_03_DECLENCHEURS } from './rosacee_03_declencheurs_et_facteurs_aggravants'
import { ROSACEE_04_BARRIERE_CUTANEE } from './rosacee_04_barriere_cutanee'
import { ROSACEE_05_ROUTINE_SKINCARE } from './rosacee_05_routine_skincare'
import { ROSACEE_06_INGREDIENTS } from './rosacee_06_ingredients_utiles_vs_a_eviter'
import { ROSACEE_07_LIRE_INCI } from './rosacee_07_lire_une_liste_inci'
import { ROSACEE_SKILL } from './skill-rosacee'

export const skincareArticles: ArticleInput[] = [
  ROSACEE_01_COMPRENDRE,
  ROSACEE_02_PHYSIOPATHOLOGIE,
  ROSACEE_03_DECLENCHEURS,
  ROSACEE_04_BARRIERE_CUTANEE,
  ROSACEE_05_ROUTINE_SKINCARE,
  ROSACEE_06_INGREDIENTS,
  ROSACEE_07_LIRE_INCI,
  CENTELLA_ROUGEURS_ROSACEE,
  RETINOID,
  LASER_ANTI_AGE_NON_ABLATIF,
  SIX_ERREURS_VIEILLISSEMENT_PEAU,
  keratosePilaire,
  ROSACEE_SKILL,
]
