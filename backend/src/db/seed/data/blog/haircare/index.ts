import type { ArticleInput } from '../article-data'
import { PRODUITS_CAPILLAIRES_EFFICACES_GUIDE_SERIEUX } from './bons-produits'
import { chuteDensiteIrritationDifferences } from './chute-perte-densite-irritation-cheveux-difference'
import { ingredientsApaisantsCuirChevelu } from './cuir-chevelu-sensibilise-ingredients-apaisants'
import { HUILE_ROMARIN_CHEVEUX } from './huile-romarin'
import { LUMIERE_ROUGE_CHEVEUX } from './IR-hair'
import { leaveInsCheveuxBouclesBenchmark } from './leave-ins-cheveux-boucles-benchmark'
import { cuirCheveluManipulationFollicules } from './manipulation-repetee-cheveux-cuir-chevelu-follicules'
import { microInflammationCuirChevelu } from './micro-inflammation-cuir-chevelu-reconnaitre-comprendre'
import { MINOXIDIL_GUIDE_COMPLET } from './minoxidil'
import { secretsDeLolyAnalyse } from './secrets-de-loly-analyse'
import { serumsCapillairesActifsChoisir } from './serums-capillaires-actifs-choisir-probleme'
import { shampoingsCheveuxBouclesBenchmark } from './shampoings-cheveux-boucles-benchmark'

export const haircareArticles: ArticleInput[] = [
  shampoingsCheveuxBouclesBenchmark,
  leaveInsCheveuxBouclesBenchmark,
  secretsDeLolyAnalyse,
  cuirCheveluManipulationFollicules,
  microInflammationCuirChevelu,
  ingredientsApaisantsCuirChevelu,
  chuteDensiteIrritationDifferences,
  serumsCapillairesActifsChoisir,
  HUILE_ROMARIN_CHEVEUX,
  LUMIERE_ROUGE_CHEVEUX,
  MINOXIDIL_GUIDE_COMPLET,
  PRODUITS_CAPILLAIRES_EFFICACES_GUIDE_SERIEUX,
]
