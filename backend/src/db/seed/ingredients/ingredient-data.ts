import { ACTIFS_ANTI_AGE_REPARATEURS } from './actifs-anti-age-reparateurs'
import { ANTI_ACNE_SEBUM } from './anti-acne-sebum'
import { ANTI_ROSACEE_VASOCONSTRICTEURS } from './anti-rosacee-vasoconstricteurs'
import { ANTIOXYDANTS_VITAMINES } from './antioxydants-vitamines'
import { APAISANTS_ANTI_INFLAMMATOIRES } from './apaisants-anti-inflammatoires'
import { BARRIERE_EMOLLIENTS_OCCLUSIFS } from './barriere-emollients-occlusifs'
import { CIRCULATOIRE_DRAINAGE } from './circulatoire-drainage'
import { DIVERS_NON_CLASSES } from './divers-non-classes'
import { ECLAIRCISSANTS_DEPIGMENTANTS } from './eclaircissants-depigmentants'
import { EXFOLIANTS } from './exfoliants'
import { FILTRES_UV } from './filtres-uv'
import { HUMECTANTS } from './humectants'
import { PEPTIDES } from './peptides'
import { PROBIOTIQUES_PREBIOTIQUES_POSTBIOTIQUES } from './probiotiques-prebiotiques-postbiotiques'
import { RETINOIDES } from './retinoides'
import { TENSIOACTIFS_NETTOYANTS } from './tensioactifs-nettoyants'
import { TEXTURANTS_FONCTIONNELS } from './texturants-fonctionnels'

export type IngredientInput = {
  name: string
  description: string
  slug: string
  content: string
  category: string
}
export const ingredientData: IngredientInput[] = [
  ...ACTIFS_ANTI_AGE_REPARATEURS,
  ...ANTI_ACNE_SEBUM,
  ...ANTI_ROSACEE_VASOCONSTRICTEURS,
  ...ANTIOXYDANTS_VITAMINES,
  ...APAISANTS_ANTI_INFLAMMATOIRES,
  ...BARRIERE_EMOLLIENTS_OCCLUSIFS,
  ...CIRCULATOIRE_DRAINAGE,
  ...DIVERS_NON_CLASSES,
  ...ECLAIRCISSANTS_DEPIGMENTANTS,
  ...EXFOLIANTS,
  ...FILTRES_UV,
  ...HUMECTANTS,
  ...PEPTIDES,
  ...PROBIOTIQUES_PREBIOTIQUES_POSTBIOTIQUES,
  ...RETINOIDES,
  ...TENSIOACTIFS_NETTOYANTS,
  ...TEXTURANTS_FONCTIONNELS,
]
console.log(ingredientData.length)
