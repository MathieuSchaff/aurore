import { QueryClient } from '@tanstack/react-query'
import { act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockCreateProductMutateAsync = vi.fn()
const mockAddUserProductMutateAsync = vi.fn()
const mockAddPurchaseMutateAsync = vi.fn()

vi.mock('@/lib/queries/products', () => ({
  useCreateProduct: () => ({ mutateAsync: mockCreateProductMutateAsync, isPending: false }),
  productQueries: {
    checkDuplicate: () => ({
      queryKey: ['products', 'checkDuplicate'],
      queryFn: vi.fn().mockResolvedValue([]),
    }),
  },
}))

vi.mock('@/lib/queries/user-products', () => ({
  useCreateUserProduct: () => ({ mutateAsync: mockAddUserProductMutateAsync, isPending: false }),
}))

vi.mock('@/lib/queries/purchases', () => ({
  useAddPurchase: () => ({ mutateAsync: mockAddPurchaseMutateAsync, isPending: false }),
}))

vi.mock('@/hooks/useScrollLock', () => ({
  useScrollLock: vi.fn(),
}))

vi.mock('@/lib/observability/faro', () => ({
  captureFrontendError: vi.fn(),
}))

vi.mock('react-hot-toast', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

import { toast } from 'react-hot-toast'

import { ApiError } from '@/lib/helpers/apiError'
import { captureFrontendError } from '@/lib/observability/faro'
import { renderHookWithProviders } from '@/test/utils'
import { useQuickAdd } from '../useQuickAdd'

describe('useQuickAdd', () => {
  let queryClient: QueryClient
  const onClose = vi.fn()

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    onClose.mockReset()
    mockCreateProductMutateAsync.mockReset()
    mockAddUserProductMutateAsync.mockReset()
    mockAddPurchaseMutateAsync.mockReset()
    vi.mocked(toast.success).mockReset()
    vi.mocked(toast.error).mockReset()
    vi.mocked(captureFrontendError).mockReset()
  })

  afterEach(() => {
    queryClient.clear()
  })

  it('initializes with default state', () => {
    const { result } = renderHookWithProviders(() => useQuickAdd({ onClose }), { queryClient })

    expect(result.current.activeTab).toBe('existing')
    expect(result.current.selectedProduct).toBeNull()
    expect(result.current.selectedStatus).toBe('in_stock')
    expect(result.current.newName).toBe('')
    expect(result.current.newBrand).toBe('')
    expect(result.current.isPending).toBe(false)
  })

  it('handleAddExisting adds a product with wishlist status', async () => {
    mockAddUserProductMutateAsync.mockResolvedValue({ id: 'up1' })

    const { result } = renderHookWithProviders(() => useQuickAdd({ onClose }), { queryClient })

    act(() => {
      result.current.setSelectedProduct({
        id: 'p1',
        name: 'Sérum',
        brand: 'La Roche',
        slug: 'serum',
      })
      result.current.setSelectedStatus('wishlist')
    })

    await act(() => result.current.handleAddExisting())

    expect(mockAddUserProductMutateAsync).toHaveBeenCalledWith({
      productId: 'p1',
      status: 'wishlist',
    })
    expect(mockAddPurchaseMutateAsync).not.toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it('handleAddExisting with in_stock also creates a purchase', async () => {
    mockAddUserProductMutateAsync.mockResolvedValue({ id: 'up1' })
    mockAddPurchaseMutateAsync.mockResolvedValue({})

    const { result } = renderHookWithProviders(() => useQuickAdd({ onClose }), { queryClient })

    act(() => {
      result.current.setSelectedProduct({
        id: 'p1',
        name: 'Sérum',
        brand: 'La Roche',
        slug: 'serum',
      })
      result.current.setSelectedStatus('in_stock')
    })

    await act(() => result.current.handleAddExisting())

    expect(mockAddUserProductMutateAsync).toHaveBeenCalledWith({
      productId: 'p1',
      status: 'in_stock',
    })
    expect(mockAddPurchaseMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ userProductId: 'up1' })
    )
    expect(onClose).toHaveBeenCalled()
  })

  it('reports a purchase failure without denying the completed collection add', async () => {
    mockAddUserProductMutateAsync.mockResolvedValue({ id: 'up1' })
    mockAddPurchaseMutateAsync.mockRejectedValue(new Error('purchase failed'))

    const { result } = renderHookWithProviders(() => useQuickAdd({ onClose }), { queryClient })

    act(() => {
      result.current.setSelectedProduct({
        id: 'p1',
        name: 'Sérum',
        brand: 'La Roche',
        slug: 'serum',
      })
      result.current.setSelectedStatus('in_stock')
    })

    await act(() => result.current.handleAddExisting())

    expect(toast.error).toHaveBeenCalledWith(
      "Sérum a été ajouté à votre collection, mais l'achat n'a pas été enregistré."
    )
    expect(toast.success).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledOnce()
    expect(captureFrontendError).not.toHaveBeenCalled()
  })

  it('handleAddExisting does nothing without a selected product', async () => {
    const { result } = renderHookWithProviders(() => useQuickAdd({ onClose }), { queryClient })

    await act(() => result.current.handleAddExisting())

    expect(mockAddUserProductMutateAsync).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('handleAddExisting shows error toast on failure', async () => {
    mockAddUserProductMutateAsync.mockRejectedValue(new Error('fail'))

    const { result } = renderHookWithProviders(() => useQuickAdd({ onClose }), { queryClient })

    act(() => {
      result.current.setSelectedProduct({
        id: 'p1',
        name: 'Sérum',
        brand: 'La Roche',
        slug: 'serum',
      })
    })

    await act(() => result.current.handleAddExisting())

    expect(captureFrontendError).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('does not recapture an ApiError from handleAddExisting', async () => {
    mockAddUserProductMutateAsync.mockRejectedValue(new ApiError('server_error', 500))

    const { result } = renderHookWithProviders(() => useQuickAdd({ onClose }), { queryClient })

    act(() => {
      result.current.setSelectedProduct({
        id: 'p1',
        name: 'Sérum',
        brand: 'La Roche',
        slug: 'serum',
      })
    })

    await act(() => result.current.handleAddExisting())

    expect(captureFrontendError).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalled()
  })

  it('handleCreateAndAdd creates a product then adds it to collection', async () => {
    mockCreateProductMutateAsync.mockResolvedValue({ id: 'new-p1' })
    mockAddUserProductMutateAsync.mockResolvedValue({ id: 'up1' })
    mockAddPurchaseMutateAsync.mockResolvedValue({})

    const { result } = renderHookWithProviders(() => useQuickAdd({ onClose }), { queryClient })

    act(() => {
      result.current.setNewName('Mon Sérum')
      result.current.setNewBrand('Bioderma')
      result.current.setSelectedStatus('in_stock')
    })

    await act(() => result.current.handleCreateAndAdd())

    expect(mockCreateProductMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Mon Sérum', brand: 'Bioderma' })
    )
    expect(mockAddUserProductMutateAsync).toHaveBeenCalledWith({
      productId: 'new-p1',
      status: 'in_stock',
    })
    expect(mockAddPurchaseMutateAsync).toHaveBeenCalled()
    expect(toast.success).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it('reports a purchase failure after creating and adding a new product', async () => {
    mockCreateProductMutateAsync.mockResolvedValue({ id: 'new-p1' })
    mockAddUserProductMutateAsync.mockResolvedValue({ id: 'up1' })
    mockAddPurchaseMutateAsync.mockRejectedValue(new Error('purchase failed'))

    const { result } = renderHookWithProviders(() => useQuickAdd({ onClose }), { queryClient })

    act(() => {
      result.current.setNewName('Mon Sérum')
      result.current.setNewBrand('Bioderma')
      result.current.setSelectedStatus('in_stock')
    })

    await act(() => result.current.handleCreateAndAdd())

    expect(toast.error).toHaveBeenCalledWith(
      "Mon Sérum a été créé et ajouté, mais l'achat n'a pas été enregistré."
    )
    expect(toast.success).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledOnce()
    expect(captureFrontendError).not.toHaveBeenCalled()
  })

  it('makes a created product retryable when adding it to the collection fails', async () => {
    mockCreateProductMutateAsync.mockResolvedValue({
      id: 'new-p1',
      name: 'Mon Sérum',
      brand: 'Bioderma',
      slug: 'mon-serum',
    })
    mockAddUserProductMutateAsync.mockRejectedValue(new Error('collection add failed'))

    const { result } = renderHookWithProviders(() => useQuickAdd({ onClose }), { queryClient })

    act(() => {
      result.current.setNewName('Mon Sérum')
      result.current.setNewBrand('Bioderma')
      result.current.setActiveTab('new')
    })

    await act(() => result.current.handleCreateAndAdd())

    expect(toast.error).toHaveBeenCalledWith(
      "Mon Sérum a été créé, mais pas ajouté à votre collection. Réessayez l'ajout."
    )
    expect(result.current.activeTab).toBe('existing')
    expect(result.current.selectedProduct).toEqual({
      id: 'new-p1',
      name: 'Mon Sérum',
      brand: 'Bioderma',
      slug: 'mon-serum',
    })
    expect(onClose).not.toHaveBeenCalled()
    expect(captureFrontendError).not.toHaveBeenCalled()
  })

  it('handleCreateAndAdd shows error toast on failure', async () => {
    mockCreateProductMutateAsync.mockRejectedValue(new Error('duplicate'))

    const { result } = renderHookWithProviders(() => useQuickAdd({ onClose }), { queryClient })

    act(() => {
      result.current.setNewName('Sérum')
      result.current.setNewBrand('La Roche')
    })

    await act(() => result.current.handleCreateAndAdd())

    expect(captureFrontendError).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith('Impossible de créer le produit.')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('does not recapture an ApiError from handleCreateAndAdd', async () => {
    mockCreateProductMutateAsync.mockRejectedValue(new ApiError('product_already_exists', 409))

    const { result } = renderHookWithProviders(() => useQuickAdd({ onClose }), { queryClient })

    act(() => {
      result.current.setNewName('Sérum')
      result.current.setNewBrand('La Roche')
    })

    await act(() => result.current.handleCreateAndAdd())

    expect(captureFrontendError).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalled()
  })
})
