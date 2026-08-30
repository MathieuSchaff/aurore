import type { UserDermoProfile } from '@aurore/shared'

// One definition for "every axis of the portrait, flattened". Products and ingredients both
// read it to decide what a viewer should be warned about; two inline copies drifted apart once
// already, and nothing failed loudly when they did.
export function portraitSlugs(dermo: UserDermoProfile | null | undefined): string[] {
  if (!dermo) return []
  return [...(dermo.skinTypes ?? []), ...dermo.skinConcerns]
}
