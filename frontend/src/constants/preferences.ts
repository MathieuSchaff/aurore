import type { PreferenceStance } from '@aurore/shared'

// "Sans X" / "Avec X": labels state the effect on the product list, not a
// feeling (D8). Exclude removes rows containing X, require keeps only rows
// containing at least one required X.
export const STANCE_LABEL: Record<PreferenceStance, string> = {
  exclude: 'Sans',
  require: 'Avec',
}

// D13: each heading carries its own effect, so both lists read even when empty.
export const STANCE_GROUP_LABEL: Record<PreferenceStance, string> = {
  exclude: 'Sans — retirés de vos recherches',
  require: 'Avec — seuls les produits qui en contiennent au moins un',
}

export const MARK_ADDED_CONFIRMATION = 'Ajouté à vos repères'
