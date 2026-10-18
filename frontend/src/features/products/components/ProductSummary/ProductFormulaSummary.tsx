import type { ProductDetail } from '@aurore/shared'

import type { ProductDermoAssessment } from '@/lib/queries/products'
import './ProductFormulaSummary.css'

const frenchListFormatter = new Intl.ListFormat('fr', { style: 'long', type: 'conjunction' })

function normalizeName(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export function ProductFormulaSummary({
  product,
  assessment,
}: {
  product: ProductDetail
  assessment: ProductDermoAssessment | null
}) {
  if (!product.inci?.trim()) {
    return (
      <p className="product-hero__summary">
        La composition de ce produit n’est pas encore renseignée.
      </p>
    )
  }

  const titleWords = normalizeName(product.name).split(/[^a-z0-9]+/)
  const namedIngredient = product.ingredients?.find((ingredient) => {
    const key = ingredient.ingredientCanonicalKey
    return (
      key &&
      normalizeName(key)
        .split(/[^a-z0-9]+/)
        .every((word) => titleWords.includes(word))
    )
  })
  const names = new Map<string, string>()
  if (namedIngredient?.ingredientCanonicalKey) {
    names.set(normalizeName(namedIngredient.ingredientCanonicalKey), namedIngredient.ingredientName)
  }
  for (const driver of assessment?.explanation.topBenefitDrivers ?? []) {
    const key = normalizeName(driver.inci ?? driver.label)
    if (!names.has(key)) names.set(key, driver.label)
  }
  const highlights = [...names.values()].slice(0, 3)
  const namedEvidence = assessment?.matchedEvidence.find(
    (evidence) =>
      normalizeName(evidence.inci) === normalizeName(namedIngredient?.ingredientCanonicalKey ?? '')
  )
  const unknownDose =
    namedIngredient &&
    !namedIngredient.concentrationValue &&
    namedEvidence?.concentrationEstimate.claimPct == null

  return (
    <div className="product-hero__summary">
      <p>
        {highlights.length > 0
          ? `La formule contient ${frenchListFormatter.format(highlights)}.`
          : 'La liste des ingrédients déclarés est disponible ci-dessous.'}
      </p>
      {unknownDose && (
        <p>
          La concentration de {namedIngredient.ingredientName} n’est pas renseignée sur cette fiche.
        </p>
      )}
    </div>
  )
}
