import type { ForgotPasswordErrorCode, VerifyEmailErrorCode } from '@aurore/shared'

export const FORGOT_ERRORS: Record<ForgotPasswordErrorCode, string> = {
  server_error: 'Une erreur est survenue, réessayez plus tard',
}

export const VERIFY_EMAIL_ERRORS: Record<VerifyEmailErrorCode, string> = {
  invalid_token: 'Ce lien de vérification est invalide.',
  token_expired: 'Ce lien de vérification a expiré.',
  server_error: 'Ce lien de vérification est invalide.',
}
