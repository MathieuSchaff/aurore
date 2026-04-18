import type { ArticleInput } from '../seed-articles'
import { alimentationCerveau } from './alimentation-cerveau'
import { alimentsPeau } from './aliments-peau'
import { boissonsBenchmark } from './boissons'
import { carencesNutritionnellesFrequentes } from './carences-nutritionnelles-frequentes'
import { fruitsBenchmark } from './fruits'
import { fruitsSaisonActifs } from './fruits-saison-actifs'
import { grainesLegumineusesNutrition } from './graines-legumineuses-nutrition'
import { nutrimentsFonctionnels } from './nutriments-fonctionnels'
import { planAlimentationOptimale } from './plan-alimentation-optimale'
import { ppoSmoothiesBiodisponibilite } from './ppo-smoothies-biodisponibilite'

export const nutritionArticles: ArticleInput[] = [
  alimentsPeau,
  nutrimentsFonctionnels,
  alimentationCerveau,
  carencesNutritionnellesFrequentes,
  planAlimentationOptimale,
  fruitsSaisonActifs,
  ppoSmoothiesBiodisponibilite,
  grainesLegumineusesNutrition,
  boissonsBenchmark,
  fruitsBenchmark,
]
