import type { CatalogQueueItem } from '@aurore/shared'

import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useModerateContent, useVerifyCatalogItem } from '@/lib/queries/admin'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'

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
  moderationStatus: 'hidden',
}

const AUTHORED_PRODUCT: CatalogQueueItem = {
  ...UNVERIFIED_PRODUCT,
  id: 'prod-authored-0000-0000-0000-000000000000',
  name: 'Fiche signée',
  authorUsername: 'mathieu',
}

// The « À vérifier » / « Masqués » tabs differ only by the status sent to the API,
// so the handler records it and a tab switch is asserted on the request itself.
let lastQueryStatus: string | undefined

function serveCatalog(items: CatalogQueueItem[]) {
  lastQueryStatus = undefined
  server.use(
    http.get('*/api/admin/moderation/catalog', ({ request }) => {
      const status = new URL(request.url).searchParams.get('status') ?? undefined
      lastQueryStatus = status
      const view = status === 'hidden' ? 'hidden' : 'visible'
      return HttpResponse.json({
        success: true,
        data: { items: items.filter((i) => i.moderationStatus === view) },
      })
    })
  )
}

function setupMutations() {
  const verify = vi.fn()
  const moderate = vi.fn()
  vi.mocked(useVerifyCatalogItem).mockReturnValue({
    mutate: verify,
    isPending: false,
  } as unknown as ReturnType<typeof useVerifyCatalogItem>)
  vi.mocked(useModerateContent).mockReturnValue({
    mutate: moderate,
    isPending: false,
  } as unknown as ReturnType<typeof useModerateContent>)
  return { verify, moderate }
}

async function confirmDialog(label: string) {
  const dialog = await screen.findByRole('alertdialog')
  await userEvent.click(
    Array.from(dialog.querySelectorAll('button')).find(
      (b) => b.textContent === label
    ) as HTMLButtonElement
  )
}

describe('AdminCatalogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders both tab bars and an unverified product row with its actions', async () => {
    serveCatalog([UNVERIFIED_PRODUCT])
    setupMutations()
    renderWithProviders(<AdminCatalogPage />)

    expect(await screen.findByRole('tab', { name: 'Produits' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByRole('tab', { name: 'Ingrédients' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'À vérifier' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Masqués' })).toBeInTheDocument()

    expect(screen.getByText('Crème mystère')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Vérifier' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Masquer' })).toBeInTheDocument()
  })

  it('renders the contributor username, falling back to a truncated authorId when absent', async () => {
    serveCatalog([AUTHORED_PRODUCT, UNVERIFIED_PRODUCT])
    setupMutations()
    renderWithProviders(<AdminCatalogPage />)

    expect(await screen.findByText('mathieu')).toBeInTheDocument()
    // UNVERIFIED_PRODUCT has no username, so it falls back to the first 8 chars of its authorId.
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

    fireEvent.click(await screen.findByRole('tab', { name: 'Masqués' }))

    expect(await screen.findByText('Fiche masquée')).toBeInTheDocument()
    expect(lastQueryStatus).toBe('hidden')
    expect(screen.getByRole('button', { name: 'Restaurer' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Vérifier' })).not.toBeInTheDocument()
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

  it('surfaces an error banner when a hide mutation fails', async () => {
    serveCatalog([UNVERIFIED_PRODUCT])
    const verify = vi.fn()
    const moderate = vi.fn((_vars, opts?: { onError?: () => void }) => opts?.onError?.())
    vi.mocked(useVerifyCatalogItem).mockReturnValue({
      mutate: verify,
      isPending: false,
    } as unknown as ReturnType<typeof useVerifyCatalogItem>)
    vi.mocked(useModerateContent).mockReturnValue({
      mutate: moderate,
      isPending: false,
    } as unknown as ReturnType<typeof useModerateContent>)
    renderWithProviders(<AdminCatalogPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Masquer' }))
    await confirmDialog('Masquer')

    expect(await screen.findByText(/action a échoué/i)).toBeInTheDocument()
  })

  it('surfaces an error banner when a verify mutation fails', async () => {
    serveCatalog([UNVERIFIED_PRODUCT])
    const verify = vi.fn((_vars, opts?: { onError?: () => void }) => opts?.onError?.())
    const moderate = vi.fn()
    vi.mocked(useVerifyCatalogItem).mockReturnValue({
      mutate: verify,
      isPending: false,
    } as unknown as ReturnType<typeof useVerifyCatalogItem>)
    vi.mocked(useModerateContent).mockReturnValue({
      mutate: moderate,
      isPending: false,
    } as unknown as ReturnType<typeof useModerateContent>)
    renderWithProviders(<AdminCatalogPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Vérifier' }))
    await confirmDialog('Vérifier')

    expect(await screen.findByText(/action a échoué/i)).toBeInTheDocument()
  })
})
