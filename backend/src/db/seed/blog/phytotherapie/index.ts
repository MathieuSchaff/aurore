import type { ArticleInput } from '../seed-articles'
import { ail } from './ail'
import { arnica } from './arnica'
import { aubepine } from './aubepine'
import { bacopaMonnieri } from './bacopa-monnieri'
import { cuminNoir } from './cumin-noir'
import { curcuma } from './curcuma'
import { gingembre } from './gingembre'
import { ginkgoBiloba } from './ginkgo-biloba'
import { gotuKola } from './gotu-kola'
import { plantesCirculatoiresCerveau } from './plantes-circulatoires-cerveau'
import { plantesRespiratoires } from './plantes-respiratoires'
import { plantesVeinotoniquesCouperose } from './plantes-veinotoniques-couperose'
import { reglisseLicorice } from './reglisse-licorice'
import { safran } from './safran'

export const phytotherapieArticles: ArticleInput[] = [
  plantesVeinotoniquesCouperose,
  ail,
  aubepine,
  bacopaMonnieri,
  cuminNoir,
  curcuma,
  gingembre,
  ginkgoBiloba,
  gotuKola,
  safran,
  arnica,
  reglisseLicorice,
  plantesCirculatoiresCerveau,
  plantesRespiratoires,
]
