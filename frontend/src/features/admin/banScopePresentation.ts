import type { BanScope } from '@aurore/shared'

export type BanScopeOption = {
  value: BanScope
  label: string
}

const banScopePresentation = {
  global: { value: 'global', label: 'Global (toutes les actions)' },
  product_create: { value: 'product_create', label: 'Création de produits' },
  product_edit: { value: 'product_edit', label: 'Édition de produits' },
  ingredient_create: { value: 'ingredient_create', label: 'Création d’ingrédients' },
  ingredient_edit: { value: 'ingredient_edit', label: 'Édition d’ingrédients' },
  discussion_post: {
    value: 'discussion_post',
    label: 'Publication dans les discussions',
  },
  review_publish: { value: 'review_publish', label: 'Publication d’avis' },
  social_post: { value: 'social_post', label: 'Publication sociale' },
} satisfies { [Scope in BanScope]: { value: Scope; label: string } }

const allBanScopeOptions: ReadonlyArray<BanScopeOption> = Object.values(banScopePresentation)

export function getBanScopeOptions(isAdmin: boolean): ReadonlyArray<BanScopeOption> {
  return isAdmin
    ? allBanScopeOptions
    : allBanScopeOptions.filter((option) => option.value !== 'global')
}

export function getBanScopeLabel(scope: BanScope): string {
  return banScopePresentation[scope].label
}
