import type { UserProductStatus, UserPublic } from '@aurore/shared'

import { useNavigate, useRouterState } from '@tanstack/react-router'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import toast from 'react-hot-toast'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { statusLabels } from '@/features/collection/constants'
import type { SessionView } from '@/lib/auth/session'
import { ApiError } from '@/lib/helpers/apiError'
import { captureFrontendError } from '@/lib/observability/faro'
import { productQueries } from '@/lib/queries/products'
import { useCreateUserProduct } from '@/lib/queries/user-products'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'
import { ProductCollectionAction } from '../ProductCollectionAction'

const { readClientSessionMock, useSessionMock } = vi.hoisted(() => ({
  readClientSessionMock: vi.fn<() => SessionView>(),
  useSessionMock: vi.fn<() => SessionView>(),
}))

vi.mock('@tanstack/react-router', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-router')>('@tanstack/react-router')),
  useNavigate: vi.fn(),
  useRouterState: vi.fn(),
}))

vi.mock('@/lib/auth/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/auth/session')>()),
  readClientSession: readClientSessionMock,
  useSession: useSessionMock,
}))

vi.mock('@/lib/queries/user-products', () => ({ useCreateUserProduct: vi.fn() }))

vi.mock('@/features/products/components/AddToCollectionModal/AddToCollectionModal', () => ({
  AddToCollectionModal: ({ currentStatus }: { currentStatus?: UserProductStatus | null }) => (
    <div role="dialog" data-current-status={currentStatus ?? 'none'}>
      Détails de la collection
    </div>
  ),
}))

vi.mock('@/lib/observability/faro', () => ({ captureFrontendError: vi.fn() }))

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

const product = {
  id: 'product-1',
  slug: 'produit-test',
  name: 'Produit test',
  brand: 'Aurore Lab',
  priceCents: 1990,
}

const authenticatedUser: UserPublic = {
  id: '019c0000-0000-7000-8000-000000000001',
  email: 'aurore@example.test',
  createdAt: '2026-08-16T10:00:00.000Z',
  emailVerified: true,
  role: 'user',
  isDemo: false,
}
const navigate = vi.fn()
const mutateAsync = vi.fn()
let session: SessionView

function renderAction(status: UserProductStatus | null = null) {
  const queryClient = createTestQueryClient()

  renderWithProviders(<ProductCollectionAction product={product} userStatus={status} />, {
    queryClient,
  })
  return queryClient
}

describe('ProductCollectionAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    session = {
      status: 'authenticated',
      user: authenticatedUser,
      credential: 'present',
    }
    useSessionMock.mockImplementation(() => session)
    readClientSessionMock.mockImplementation(() => session)
    mutateAsync.mockResolvedValue({ id: 'user-product-1', status: 'watched' })
    vi.mocked(useNavigate).mockReturnValue(navigate)
    vi.mocked(useRouterState).mockReturnValue('/products/produit-test' as never)
    vi.mocked(useCreateUserProduct).mockReturnValue({
      mutateAsync,
      isPending: false,
    } as never)
  })

  it('saves an uncollected product as watched without opening the details dialog', async () => {
    const user = userEvent.setup()
    const queryClient = renderAction()
    const setQueryData = vi.spyOn(queryClient, 'setQueryData')

    await user.click(
      screen.getByRole('button', { name: 'Sauvegarder ce produit dans Garde un œil' })
    )

    expect(mutateAsync).toHaveBeenCalledWith({ productId: product.id, status: 'watched' })
    expect(setQueryData).toHaveBeenCalledWith(
      productQueries.detailPage(product.slug, authenticatedUser.id).queryKey,
      expect.any(Function)
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(toast.success).toHaveBeenCalledWith('Sauvegardé dans « Garde un œil »')
  })

  it('does not recapture an ApiError from the quick save mutation', async () => {
    const user = userEvent.setup()
    mutateAsync.mockRejectedValue(new ApiError('server_error', 500))
    renderAction()

    await user.click(
      screen.getByRole('button', { name: 'Sauvegarder ce produit dans Garde un œil' })
    )

    expect(captureFrontendError).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith("Impossible de sauvegarder ce produit pour l'instant.")
  })

  it('captures an orchestration error after the quick save mutation', async () => {
    const user = userEvent.setup()
    const error = new Error('cache update failed')
    const queryClient = renderAction()
    vi.spyOn(queryClient, 'setQueryData').mockImplementation(() => {
      throw error
    })

    await user.click(
      screen.getByRole('button', { name: 'Sauvegarder ce produit dans Garde un œil' })
    )

    expect(captureFrontendError).toHaveBeenCalledWith(error, {
      flow: 'product-detail-quick-save',
      productId: product.id,
    })
    expect(toast.error).toHaveBeenCalledWith("Impossible de sauvegarder ce produit pour l'instant.")
  })

  it('keeps the detailed status and purchase flow behind the split-button chevron', async () => {
    const user = userEvent.setup()
    renderAction()

    await user.click(screen.getByRole('button', { name: 'Ajouter avec un statut ou un achat' }))

    expect(mutateAsync).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toHaveAttribute('data-current-status', 'none')
  })

  it('shows the existing shelf status and opens the edit flow without overwriting it', async () => {
    const user = userEvent.setup()
    renderAction('in_stock')

    expect(
      screen.getByRole('button', { name: /Dans votre collection : En stock/ })
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Sauvegarder ce produit/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Dans votre collection : En stock/ }))

    expect(mutateAsync).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toHaveAttribute('data-current-status', 'in_stock')
  })

  it('shows the seeded shelf status while the known viewer restores its credential', () => {
    session = {
      status: 'authenticated',
      user: authenticatedUser,
      credential: 'restoring',
    }
    renderAction('wishlist')

    const statusButton = screen.getByRole('button', {
      name: new RegExp(`Dans votre collection : ${statusLabels.wishlist.label}`),
    })
    expect(statusButton).toBeInTheDocument()
    expect(statusButton).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Chargement de votre collection' })).toBeNull()
  })

  it('shows a neutral loading action while the viewer is still unknown', () => {
    session = { status: 'pending' }

    renderAction('wishlist')

    expect(
      screen.getByRole('button', {
        name: 'Chargement de votre collection',
      })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: new RegExp(`Dans votre collection : ${statusLabels.wishlist.label}`),
      })
    ).not.toBeInTheDocument()
  })

  it('keeps a known viewer action visible but locked while the credential restores', () => {
    session = {
      status: 'authenticated',
      user: authenticatedUser,
      credential: 'restoring',
    }

    renderAction()

    expect(
      screen.getByRole('button', { name: 'Sauvegarder ce produit dans Garde un œil' })
    ).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Chargement de votre collection' })).toBeNull()
  })

  it('redirects anonymous save and detail intents to login with the current product URL', async () => {
    const user = userEvent.setup()
    session = { status: 'anonymous' }
    renderAction()

    await user.click(
      screen.getByRole('button', { name: 'Sauvegarder ce produit dans Garde un œil' })
    )
    await user.click(screen.getByRole('button', { name: 'Ajouter avec un statut ou un achat' }))

    expect(mutateAsync).not.toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledTimes(2)
    expect(navigate).toHaveBeenNthCalledWith(1, {
      to: '/auth/login',
      search: { redirect: '/products/produit-test' },
    })
    expect(navigate).toHaveBeenNthCalledWith(2, {
      to: '/auth/login',
      search: { redirect: '/products/produit-test' },
    })
  })
})
