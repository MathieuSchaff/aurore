// fallow-ignore-file unused-file
import type { UserPublic } from '@aurore/shared'

import type { ClientAuthSession } from './auth'

declare const user: UserPublic

// @ts-expect-error Anonymous sessions cannot carry an identity
const anonymousWithUser: ClientAuthSession = { status: 'anonymous', user }

// @ts-expect-error Pending sessions cannot carry a credential
const pendingWithBearer: ClientAuthSession = { status: 'pending', bearer: 'token' }

// @ts-expect-error Authenticated sessions require both identity and credential state
const authenticatedWithoutUser: ClientAuthSession = {
  status: 'authenticated',
  credential: { status: 'restoring', bearer: null, expiresAt: null },
}

void [anonymousWithUser, pendingWithBearer, authenticatedWithoutUser]
