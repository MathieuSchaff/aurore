import type { CatalogQueueItem, CatalogQueueResponse } from '@aurore/shared'

import type { MutationFunctionContext } from '@tanstack/react-query'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useModerateContent, useVerifyCatalogItem } from '@/lib/queries/admin'
import { server } from '@/test/msw/server'
import { makeIdleMutationResult } from '@/test/mutation'
import { createTestQueryClient, makeUserProduct, renderWithProviders } from '@/test/utils'

vi.mock('@/lib/queries/admin', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/admin')>()
  return {
    ...actual,
    useModerateContent: vi.fn(),
    useVerifyCatalogItem: vi.fn(),
  }
})

import { AdminCatalogPage } from '../components/AdminCatalogPage'
import { adminLabels } from '../constants'

const UNVERIFIED_PRODUCT: CatalogQueueItem = {
  kind: 'product',
  id: 'prod-aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  name: 'Crème mystère',
  brand: 'BrandX',
  slug: 'creme-mystere',
  catalogQuality: 'unverified',
  moderationStatus: 'visible',
  authorId: 'usr-author',
  authorUsername: null,
  createdAt: '2026-05-30T10:00:00Z',
}

const HIDDEN_PRODUCT: CatalogQueueItem = {
  ...UNVERIFIED_PRODUCT,
  id: 'prod-hidden-0000-0000-0000-000000000000',
  name: 'Fiche masquée',
  catalogQuality: 'verified',
  moderationStatus: 'hidden',
}

const UNVERIFIED_INGREDIENT: CatalogQueueItem = {
  ...UNVERIFIED_PRODUCT,
  kind: 'ingredient',
  id: 'ing-aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  name: 'Ingrédient mystère',
  brand: null,
}

const AUTHORED_PRODUCT: CatalogQueueItem = {
  ...UNVERIFIED_PRODUCT,
  id: 'prod-authored-0000-0000-0000-000000000000',
  name: 'Fiche signée',
  authorUsername: 'mathieu',
}

let lastQuery: { kind?: string; quality?: string; status?: string } = {}

type VerifyMutate = ReturnType<typeof useVerifyCatalogItem>['mutate']
type ModerateMutate = ReturnType<typeof useModerateContent>['mutate']

const MUTATION_CONTEXT = {
  client: createTestQueryClient(),
  meta: undefined,
} satisfies MutationFunctionContext

function serveCatalog(items: CatalogQueueItem[]) {
  lastQuery = {}
  server.use(
    http.get('*/api/admin/moderation/catalog', ({ request }) => {
      const search = new URL(request.url).searchParams
      const kind = search.get('kind') ?? undefined
      const quality = search.get('quality') ?? undefined
      const status = search.get('status') ?? undefined
      lastQuery = { kind, quality, status }
      const data = {
        items: items.filter(
          (item) =>
            (!kind || item.kind === kind) &&
            (!quality || item.catalogQuality === quality) &&
            (!status || item.moderationStatus === status)
        ),
      } satisfies CatalogQueueResponse
      return HttpResponse.json({
        success: true,
        data,
      })
    })
  )
}

function setupMutations() {
  const verify = vi.fn<VerifyMutate>()
  const moderate = vi.fn<ModerateMutate>()
  vi.mocked(useVerifyCatalogItem).mockReturnValue(makeIdleMutationResult(verify))
  vi.mocked(useModerateContent).mockReturnValue(makeIdleMutationResult(moderate))
  return { verify, moderate }
}

async function confirmDialog(label: string) {
  const dialog = await screen.findByRole('alertdialog')
  await userEvent.click(within(dialog).getByRole('button', { name: label }))
}

describe('AdminCatalogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders both tab bars and an unverified product row with its actions', async () => {
    serveCatalog([UNVERIFIED_PRODUCT])
    setupMutations()
    renderWithProviders(<AdminCatalogPage />)

    expect(await screen.findByRole('button', { name: 'Produits' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Ingrédients' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'À vérifier' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Masqués' })).toBeInTheDocument()
    expect(lastQuery).toEqual({ kind: 'product', quality: 'unverified', status: 'visible' })

    expect(screen.getByText('Crème mystère')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Masquer' })).toBeInTheDocument()
  })

  it('renders the contributor username, falling back to a truncated authorId when absent', async () => {
    serveCatalog([AUTHORED_PRODUCT, UNVERIFIED_PRODUCT])
    setupMutations()
    renderWithProviders(<AdminCatalogPage />)

    expect(await screen.findByText('mathieu')).toBeInTheDocument()
    // UNVERIFIED_PRODUCT has no username so it falls back to the first 8 authorId characters
    expect(screen.getByText('usr-auth')).toBeInTheDocument()
  })

  it('shows the empty state when the view has no fiches', async () => {
    serveCatalog([])
    setupMutations()
    renderWithProviders(<AdminCatalogPage />)

    expect(await screen.findByText(adminLabels.emptyCatalogQueue)).toBeInTheDocument()
  })

  it('verifies a fiche with kind+id after confirmation', async () => {
    serveCatalog([UNVERIFIED_PRODUCT])
    const { verify } = setupMutations()
    renderWithProviders(<AdminCatalogPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Vérifier' }))
    await confirmDialog('Vérifier')

    await waitFor(() => {
      expect(verify).toHaveBeenCalledWith(
        { kind: 'product', id: UNVERIFIED_PRODUCT.id },
        expect.objectContaining({ onSuccess: expect.any(Function) })
      )
    })
  })

  it('hides a fiche with target=products + status=hidden after confirmation', async () => {
    serveCatalog([UNVERIFIED_PRODUCT])
    const { moderate } = setupMutations()
    renderWithProviders(<AdminCatalogPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Masquer' }))
    await confirmDialog('Masquer')

    await waitFor(() => {
      expect(moderate).toHaveBeenCalledWith(
        { target: 'products', id: UNVERIFIED_PRODUCT.id, body: { status: 'hidden' } },
        expect.objectContaining({ onSuccess: expect.any(Function) })
      )
    })
  })

  it('queries status=hidden and shows Restaurer (no Vérifier) in the Masqués view', async () => {
    serveCatalog([HIDDEN_PRODUCT])
    setupMutations()
    renderWithProviders(<AdminCatalogPage />)

    fireEvent.click(await screen.findByRole('button', { name: 'Masqués' }))

    expect(await screen.findByText('Fiche masquée')).toBeInTheDocument()
    expect(lastQuery).toEqual({ kind: 'product', quality: undefined, status: 'hidden' })
    expect(screen.getByRole('button', { name: 'Restaurer' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Vérifier' })).not.toBeInTheDocument()
  })

  it('queries kind=ingredient when the ingredient filter is selected', async () => {
    serveCatalog([UNVERIFIED_PRODUCT, UNVERIFIED_INGREDIENT])
    setupMutations()
    renderWithProviders(<AdminCatalogPage />)

    fireEvent.click(await screen.findByRole('button', { name: 'Ingrédients' }))

    expect(await screen.findByText('Ingrédient mystère')).toBeInTheDocument()
    expect(screen.queryByText('Crème mystère')).not.toBeInTheDocument()
    expect(lastQuery).toEqual({ kind: 'ingredient', quality: 'unverified', status: 'visible' })
  })

  it('does not show feedback from a verify completed after changing filter', async () => {
    serveCatalog([UNVERIFIED_PRODUCT, UNVERIFIED_INGREDIENT])
    const { verify } = setupMutations()
    renderWithProviders(<AdminCatalogPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Vérifier' }))
    await confirmDialog('Vérifier')
    fireEvent.click(screen.getByRole('button', { name: 'Ingrédients' }))

    const call = verify.mock.calls[0]
    if (!call) throw new Error('verify mutation was not called')
    const [variables, options] = call
    options?.onSuccess?.(makeUserProduct().product, variables, undefined, MUTATION_CONTEXT)

    expect(await screen.findByText('Ingrédient mystère')).toBeInTheDocument()
    expect(screen.queryByText('Fiche vérifiée.')).not.toBeInTheDocument()
  })

  it('forwards the moderator note typed on hide as body.reason', async () => {
    serveCatalog([UNVERIFIED_PRODUCT])
    const { moderate } = setupMutations()
    renderWithProviders(<AdminCatalogPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Masquer' }))
    await userEvent.type(await screen.findByLabelText('Note du modérateur'), 'spam')
    await confirmDialog('Masquer')

    await waitFor(() => {
      expect(moderate).toHaveBeenCalledWith(
        {
          target: 'products',
          id: UNVERIFIED_PRODUCT.id,
          body: { status: 'hidden', reason: 'spam' },
        },
        expect.objectContaining({ onError: expect.any(Function) })
      )
    })
  })

  it('limits the moderator note to the shared 500 character boundary', async () => {
    serveCatalog([UNVERIFIED_PRODUCT])
    setupMutations()
    renderWithProviders(<AdminCatalogPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Masquer' }))

    expect(await screen.findByLabelText('Note du modérateur')).toHaveAttribute('maxlength', '500')
  })

  it('surfaces an error banner when a hide mutation fails', async () => {
    serveCatalog([UNVERIFIED_PRODUCT])
    const verify = vi.fn<VerifyMutate>()
    const moderate = vi.fn<ModerateMutate>((variables, options) =>
      options?.onError?.(new Error('hide failed'), variables, undefined, MUTATION_CONTEXT)
    )
    vi.mocked(useVerifyCatalogItem).mockReturnValue(makeIdleMutationResult(verify))
    vi.mocked(useModerateContent).mockReturnValue(makeIdleMutationResult(moderate))
    renderWithProviders(<AdminCatalogPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Masquer' }))
    await confirmDialog('Masquer')

    expect(await screen.findByText(/action a échoué/i)).toBeInTheDocument()
  })

  it('surfaces an error banner when a verify mutation fails', async () => {
    serveCatalog([UNVERIFIED_PRODUCT])
    const verify = vi.fn<VerifyMutate>((variables, options) =>
      options?.onError?.(new Error('verify failed'), variables, undefined, MUTATION_CONTEXT)
    )
    const moderate = vi.fn<ModerateMutate>()
    vi.mocked(useVerifyCatalogItem).mockReturnValue(makeIdleMutationResult(verify))
    vi.mocked(useModerateContent).mockReturnValue(makeIdleMutationResult(moderate))
    renderWithProviders(<AdminCatalogPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Vérifier' }))
    await confirmDialog('Vérifier')

    expect(await screen.findByText(/action a échoué/i)).toBeInTheDocument()
  })
})
