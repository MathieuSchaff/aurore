// Pass wrapper around `detectPeauNormale`, ADR-0001.
//
// Reads `prior` to satisfy the detector's `alreadyProposedSkinTypes` argument
// (abstain when any skin_type that is not neutral already fired). The orchestrator no
// longer maintains a `seenSlugs` set; the dedup'd accumulator is the channel.

import { tagProduct } from 'algo-derm'

import { asProposals, priorSlugSet } from '../../lib/pass-helpers'
import type { Pass } from '../../lib/pass-types'
import { detectPeauNormale } from './peau-normale'

export const peauNormalePass: Pass = {
  name: 'formula:peau-normale',
  run: (ctx, prior) => {
    // Missing tolerance evidence must not become a positive skin type by fallback
    if (
      !ctx.assessment ||
      tagProduct(ctx.assessment, [...ctx.ingredients]).some(
        (tag) => tag.id === 'peaux-sensibles' && tag.state === 'insufficient_data'
      )
    ) {
      return []
    }
    return asProposals(
      detectPeauNormale(ctx.inci, ctx.kind, priorSlugSet(prior), ctx.normalizedIngredients),
      'formula'
    )
  },
}
