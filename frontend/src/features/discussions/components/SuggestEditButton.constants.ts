import type { EditTargetType, PROPOSABLE_FIELDS } from '@aurore/shared'

/* Exported so tests assert the same string the user sees. */
export const SUGGEST_LABELS = {
  action: 'Proposer une correction',
  title: 'Proposer une correction',
  fieldLabel: 'Champ à corriger',
  valueLabel: 'Valeur proposée',
  valueRequired: 'Proposez une valeur pour aider la relecture.',
  failureMessage: 'Impossible d’envoyer la proposition. Réessayez.',
  submit: 'Envoyer',
  cancel: 'Annuler',
  successMessage:
    "Merci. La modération va relire votre proposition. Rien n'est modifié tant qu'elle n'est pas validée.",
} as const

// Keyed by the proposable field union so a field added to PROPOSABLE_FIELDS
// without a label fails the build instead of showing its raw name.
type ProposableField = (typeof PROPOSABLE_FIELDS)[EditTargetType][number]

export const FIELD_LABELS: Record<ProposableField, string> = {
  name: 'Nom',
  brand: 'Marque',
  inci: 'Composition (INCI)',
  description: 'Description',
}
