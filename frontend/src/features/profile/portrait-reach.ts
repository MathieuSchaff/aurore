import type { UserDermoProfile } from '@aurore/shared'

import { PROFILE_RELEVANT_AXES } from '@/constants/derm'

export type PortraitSurfaceKey =
  | 'formulas'
  | 'catalogue'
  | 'motifs'
  | 'ingredients'
  | 'feed'
  | 'people'

type Portrait = {
  types: readonly string[]
  concerns: readonly string[]
  fitzpatrick: number | null
}

// The score and the motifs run through algo-derm, which only knows sensitive / acne-prone /
// rosacea, so most of a portrait moves nothing there. PROFILE_RELEVANT_AXES lists exactly those
// slugs, so reuse it rather than restate the mapping.
function movesAlgoDerm(p: Portrait): boolean {
  return [...p.types, ...p.concerns].some((slug) => PROFILE_RELEVANT_AXES[slug] !== undefined)
}

function hasTypesOrConcerns(p: Portrait): boolean {
  return p.types.length > 0 || p.concerns.length > 0
}

// Ordered as the sentence reads. Each entry must be true of THIS portrait: a
// fixed list would lie for the majority of them, which is the promise/effect gap
// that killed the previous attempt.
const REACTS: ReadonlyArray<[PortraitSurfaceKey, (p: Portrait) => boolean]> = [
  ['formulas', movesAlgoDerm],
  // Same door as the reading above; named only when the reading is not.
  ['catalogue', (p) => hasTypesOrConcerns(p) && !movesAlgoDerm(p)],
  ['motifs', movesAlgoDerm],
  ['ingredients', hasTypesOrConcerns],
  ['feed', (p) => p.concerns.length > 0],
  ['people', (p) => hasTypesOrConcerns(p) || p.fitzpatrick !== null],
]

export const PORTRAIT_SURFACE_LABEL: Record<PortraitSurfaceKey, string> = {
  formulas: 'la lecture des formules',
  catalogue: 'le catalogue',
  motifs: 'vos motifs',
  ingredients: 'les ingrédients',
  feed: 'le fil',
  people: 'des gens comme vous',
}

export function derivePortraitReach(
  dermo: UserDermoProfile | null | undefined
): PortraitSurfaceKey[] {
  if (!dermo) return []
  const portrait: Portrait = {
    types: dermo.skinTypes ?? [],
    concerns: dermo.skinConcerns ?? [],
    fitzpatrick: dermo.fitzpatrickType,
  }
  return REACTS.filter(([, reacts]) => reacts(portrait)).map(([key]) => key)
}
