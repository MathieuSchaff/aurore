import type { ProductKind, SkinConcern, SkinType } from '@habit-tracker/shared'

import type { ProductContext, UserProfile } from 'algo-derm'

const SENSITIVE_SKIN_TYPES: ReadonlyArray<SkinType> = [
  'peau-sensible',
  'peau-reactive',
  'peau-atopique',
]

const ROSACEA_CONCERNS: ReadonlyArray<SkinConcern> = [
  'rosacee',
  'couperose',
  'flushs',
  'anti-rougeurs',
]

const ACNE_CONCERNS: ReadonlyArray<SkinConcern> = [
  'anti-acne',
  'post-acne',
  'pores-dilates',
  'brillance',
]

export function mapToAlgoDermProfile(
  skinTypes: ReadonlyArray<SkinType>,
  skinConcerns: ReadonlyArray<SkinConcern>
): UserProfile {
  return {
    sensitiveSkin: skinTypes.some((t) => SENSITIVE_SKIN_TYPES.includes(t)),
    acneProne: skinConcerns.some((c) => ACNE_CONCERNS.includes(c)),
    rosacea: skinConcerns.some((c) => ROSACEA_CONCERNS.includes(c)),
    pregnant: false,
  }
}

type AlgoDermFormulaType = NonNullable<ProductContext['formulaType']>

// Aurore ProductKind covers categories beyond skincare (haircare, dental, etc).
// algo-derm only knows skincare formula types — non-skincare kinds get undefined,
// which falls back to the engine's neutral prior.
const KIND_TO_FORMULA: Partial<Record<ProductKind, AlgoDermFormulaType>> = {
  serum: 'serum',
  moisturizer: 'cream',
  cleanser: 'cleanser',
  toner: 'lotion',
  exfoliant: 'serum',
  'eye-cream': 'cream',
  mask: 'cream',
  mist: 'lotion',
  essence: 'serum',
  'spot-treatment': 'serum',
  balm: 'cream',
  oil: 'serum',
  primer: 'cream',
}

// Rinse-off changes the exposure multiplier inside algo-derm.
// Masks are kept leave-on by default (skincare bias); rinse-off masks are rare.
const RINSE_OFF_KINDS: ReadonlySet<ProductKind> = new Set<ProductKind>([
  'cleanser',
  'shampoo',
  'conditioner',
  'body-wash',
  'body-scrub',
  'mouthwash',
])

export function mapKindToContext(kind: ProductKind): ProductContext {
  return {
    leaveOn: !RINSE_OFF_KINDS.has(kind),
    formulaType: KIND_TO_FORMULA[kind],
  }
}
