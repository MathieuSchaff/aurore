import type { ArticleInput } from '../seed-articles'
import { benchmarkSupplements } from './benchmark-supplements'
import { collagenesBenchmark } from './collagenes-benchmark'
import { complementsPrecautionsVigilance } from './complements-precautions-vigilance'
import { creatineGlycineTaurine } from './creatine-glycine-taurine'
import { formesBioactivesVitamines } from './formes-bioactives-vitamines'
import { magnesiumFormesPrixBenchmark } from './magnesium-formes-prix-benchmark'
import { vitaminesMinerauxCofacteurs } from './vitamines-mineraux-cofacteurs'

export const supplementsArticles: ArticleInput[] = [
  vitaminesMinerauxCofacteurs,
  formesBioactivesVitamines,
  complementsPrecautionsVigilance,
  creatineGlycineTaurine,
  benchmarkSupplements,
  collagenesBenchmark,
  magnesiumFormesPrixBenchmark,
]
