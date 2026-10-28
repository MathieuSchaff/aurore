export const SIGNALS_LABELS = {
  actives: 'Actifs renseignés',
  facts: 'Parfum et alcool dénaturé',
  factsHint: 'Mentions de parfum, composants parfumants et alcool dénaturé repérés dans l’INCI.',
  activesHint: 'Repérés dans les listes INCI et les familles d’actifs du catalogue.',
  rolesSource: 'Fonctions cosmétiques :',
  rolesScope: 'Elles ne décrivent pas l’efficacité du produit.',
  unknownRole: 'Rôle non renseigné.',
  empty: 'Aucun repère détecté dans les données renseignées.',
  scope:
    'Ces repères décrivent les ingrédients renseignés et leur présence par produit. Le repérage n’est pas exhaustif et les listes peuvent être incomplètes.',
} as const

export const FORMULA_MARKER_LABELS = {
  fragrance: 'Mention de parfum',
  'fragrance-component': 'Composant parfumant',
  'denatured-alcohol': 'Alcool dénaturé',
} as const

const COSMETIC_ROLES: Record<string, string> = {
  HUMECTANT: 'Maintien de l’humidité',
  MOISTURISING: 'Hydratation de la peau',
  SOOTHING: 'Apaisement de la peau',
  SMOOTHING: 'Lissage de la peau',
  'SKIN PROTECTING': 'Protection de la peau',
  EMOLLIENT: 'Assouplissement de la peau',
  'SKIN CONDITIONING': 'Soin de la peau',
  'SKIN CONDITIONING - MISCELLANEOUS': 'Soin de la peau',
  'HAIR CONDITIONING': 'Soin des cheveux',
  ANTIOXIDANT: 'Protection de la formule contre l’oxydation',
  BUFFERING: 'Stabilisation du pH de la formule',
}

export function activeRole(functions: string[]): string {
  const roles = Object.entries(COSMETIC_ROLES)
    .filter(([name]) => functions.includes(name))
    .map(([, label]) => label)
  return [...new Set(roles)].slice(0, 2).join(' · ') || SIGNALS_LABELS.unknownRole
}
