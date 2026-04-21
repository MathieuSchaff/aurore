import type { ArticleInput } from '../seed-articles'
import { leaveInsCheveuxBouclesBenchmark } from './leave-ins-cheveux-boucles-benchmark'
import { secretsDeLolyAnalyse } from './secrets-de-loly-analyse'
import { shampoingsCheveuxBouclesBenchmark } from './shampoings-cheveux-boucles-benchmark'

export const haircareArticles: ArticleInput[] = [
  shampoingsCheveuxBouclesBenchmark,
  leaveInsCheveuxBouclesBenchmark,
  secretsDeLolyAnalyse,
]
