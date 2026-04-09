export type FilterKey =
  | 'brand'
  | 'concern'
  | 'skin_type'
  | 'skin_zone'
  | 'product_type'
  | 'routine_step'
  | 'skin_effect'
  | 'product_label'
  | 'shared_label'
  | 'ingredient'

export const FILTER_KEYS = [
  'brand',
  'concern',
  'skin_type',
  'skin_zone',
  'product_type',
  'routine_step',
  'skin_effect',
  'product_label',
  'shared_label',
  'ingredient',
] as const satisfies readonly FilterKey[]

export const GROUP_LABELS: Record<FilterKey, string> = {
  skin_type: 'Peau',
  skin_zone: 'Zone',
  concern: 'Objectif',
  product_type: 'Type',
  routine_step: 'Étape',
  skin_effect: 'Rendu',
  product_label: 'Label',
  shared_label: 'Comédo.',
  brand: 'Marque',
  ingredient: 'Ingr.',
}

export const TAG_CATEGORY_TO_KEY: Record<string, FilterKey> = {
  routine_step: 'routine_step',
  skin_type: 'skin_type',
  skin_zone: 'skin_zone',
  product_type: 'product_type',
  concern: 'concern',
  skin_effect: 'skin_effect',
  product_label: 'product_label',
  shared_label: 'shared_label',
}

export const LABEL_OVERRIDES: Record<string, string> = {
  'barriere-alteree': 'Peau sensibilisée',
}
