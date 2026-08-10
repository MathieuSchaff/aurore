import type { PreferenceStance } from '@aurore/shared'

// "Sans X" / "Avec X": labels state the effect on the product list, not a
// feeling. Exclude removes rows containing X, require keeps only rows
// containing at least one required X.
export const STANCE_LABEL: Record<PreferenceStance, string> = {
  exclude: 'Sans',
  require: 'Avec',
}

// Each heading carries its own effect, so both lists read even when empty.
export const STANCE_GROUP_LABEL: Record<PreferenceStance, string> = {
  exclude: 'Sans — retirés de vos recherches',
  require: 'Avec — seuls les produits qui en contiennent au moins un',
}

export const MARK_ADDED_CONFIRMATION = 'Ajouté à vos repères'

// Product page, "exclude" side only. Elsewhere a declared avoid removes rows;
// on the page of a product that contains one, silence is the confusing state:
// the product is missing from the user's searches and nothing here says why.
// States the rule the user set, never a recommendation about the product.
export const AVOIDED_HEADING = 'Vos repères'
export const avoidedInFormulaPhrase = (names: readonly string[]): string =>
  names.length === 1
    ? `Cette formule contient ${names[0]}, que vous retirez de vos recherches.`
    : `Cette formule contient ${names.slice(0, -1).join(', ')} et ${names.at(-1)}, que vous retirez de vos recherches.`
