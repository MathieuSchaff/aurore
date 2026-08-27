import type { RoleRequestStatus } from '@aurore/shared'

import { apiErrorMessage } from '@/lib/helpers/apiError'

// Admin UI wording, centralized so tests and production import the same string.
// A copy tweak then cannot make a test pass against stale text.
export const adminLabels = {
  statOpenReports: 'Signalement(s) ouvert(s)',
  statActiveBans: 'Ban(s) actif(s)',
  statHiddenContent: 'Contenu(s) masqué(s)',
  statForcedPrivate: 'Profil(s) forcé(s) privé(s)',
  emptyReports: 'Aucun signalement.',
  emptyBans: 'Aucune mise en pause.',
  emptyUsersFiltered: 'Aucun email ne correspond.',
  emptyUsers: 'Aucun utilisateur.',
  userNotFound: 'Utilisateur introuvable.',
  pillForced: 'Forcé',
  emptySuggestedEdits: 'Aucune correction proposée.',
  navSuggestedEdits: 'Corrections',
  navCatalog: 'Catalogue',
  emptyCatalogQueue: 'Aucune fiche dans cette vue.',
  navRoleRequests: 'Demandes modérateur',
  statPendingRoleRequests: 'Demande(s) modérateur en attente',
  emptyRoleRequests: 'Aucune demande dans cette vue.',
  navSecurity: 'Sécurité',
  emptySecurityEvents: 'Aucun événement dans cette vue.',
} as const

type UserRole = 'user' | 'admin' | 'contributor'

export const roleRequestStatusLabels: Record<RoleRequestStatus, string> = {
  pending: 'En attente',
  approved: 'Acceptée',
  rejected: 'Refusée',
  cancelled: 'Annulée',
}

export const hiddenContentKindLabels = {
  reviews: { singular: 'avis', plural: 'avis' },
  threads: { singular: 'discussion', plural: 'discussions' },
  replies: { singular: 'réponse', plural: 'réponses' },
} as const

export function formatAdminCount(
  count: number,
  labels: { singular: string; plural: string }
): string {
  return `${count} ${count > 1 ? labels.plural : labels.singular}`
}

// 'contributor' surfaces as "Modérateur" in the UI; the code/DB role keeps its name.
export const roleLabels: Record<UserRole, string> = {
  user: 'Utilisateur',
  admin: 'Administrateur',
  contributor: 'Modérateur',
}

const adminErrorMessages = {
  not_a_contributor: "Ce compte n'est pas modérateur.",
  cannot_self_demote: 'Vous ne pouvez pas vous rétrograder vous-même.',
  cannot_self_ban: 'Vous ne pouvez pas vous mettre en pause.',
  already_banned: 'Ce compte est déjà en pause sur cette portée.',
  not_pending: "Cette demande n'est plus en attente.",
  not_found: 'Utilisateur introuvable.',
  forbidden: 'Action non autorisée.',
  invalid_input: 'Données invalides.',
  server_error: 'Erreur serveur. Réessayer.',
  rate_limit_exceeded: 'Trop de tentatives. Réessayer plus tard.',
} as const

export function getAdminErrorMessage(err: unknown): string {
  return apiErrorMessage(err, adminErrorMessages, 'Une erreur est survenue.')
}

// Pill colour per role; plain user keeps the neutral base, no modifier.
const rolePillModifier: Record<UserRole, string> = {
  user: '',
  admin: 'admin-pill--admin',
  contributor: 'admin-pill--contributor',
}

export function rolePillClass(role: UserRole): string {
  return `admin-pill ${rolePillModifier[role]}`.trim()
}
