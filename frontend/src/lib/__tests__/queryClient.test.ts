import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('react-hot-toast', () => ({
  toast: { error: vi.fn() },
}))

vi.mock('../observability/faro', () => ({
  captureFrontendError: vi.fn(),
}))

import { toast } from 'react-hot-toast'

import { ApiError } from '../helpers/apiError'
import { captureFrontendError } from '../observability/faro'
import { handleMutationError } from '../queryClient'

const mutationStub = (
  meta?: { errorMessage?: string; handledErrorCodes?: readonly string[] },
  mutationKey?: readonly unknown[]
) => ({ meta, options: { mutationKey } })

describe('handleMutationError', () => {
  beforeEach(() => {
    vi.mocked(toast.error).mockClear()
    vi.mocked(captureFrontendError).mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reports + toasts when meta.errorMessage is set', () => {
    const err = new Error('boom')
    handleMutationError(err, mutationStub({ errorMessage: 'Échec.' }, ['user-products', 'update']))

    expect(captureFrontendError).toHaveBeenCalledTimes(1)
    expect(captureFrontendError).toHaveBeenCalledWith(err, {
      source: 'mutation',
      mutationKey: ['user-products', 'update'],
    })
    expect(toast.error).toHaveBeenCalledWith('Échec.', { id: 'Échec.' })
  })

  it('reports without toasting when meta.errorMessage is absent', () => {
    handleMutationError(new Error('silent'), mutationStub({}))
    expect(captureFrontendError).toHaveBeenCalledTimes(1)
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('skips reporting an ApiError code handled by the mutation while keeping its toast', () => {
    handleMutationError(
      new ApiError('product_already_exists', 409),
      mutationStub({
        handledErrorCodes: ['product_already_exists'],
        errorMessage: 'Conflit.',
      })
    )

    expect(captureFrontendError).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith('Conflit.', { id: 'Conflit.' })
  })

  it('reports a 500 from the same mutation with its API context', () => {
    const error = new ApiError('server_error', 500)
    handleMutationError(
      error,
      mutationStub({ handledErrorCodes: ['product_already_exists'] }, ['products', 'create'])
    )

    expect(captureFrontendError).toHaveBeenCalledWith(error, {
      source: 'mutation',
      errorCode: 'server_error',
      status: 500,
      mutationKey: ['products', 'create'],
    })
  })

  it('reports a network error from a mutation with handled API codes', () => {
    const error = new TypeError('Failed to fetch')
    handleMutationError(
      error,
      mutationStub({ handledErrorCodes: ['product_already_exists'] }, ['products', 'create'])
    )

    expect(captureFrontendError).toHaveBeenCalledWith(error, {
      source: 'mutation',
      mutationKey: ['products', 'create'],
    })
  })

  it('skips banned without hiding other 403 errors', () => {
    const banned = new ApiError('banned', 403)
    const forbidden = new ApiError('forbidden', 403)
    const mutation = mutationStub(undefined, ['profile', 'update'])

    handleMutationError(banned, mutation)
    handleMutationError(forbidden, mutation)

    expect(captureFrontendError).toHaveBeenCalledTimes(1)
    expect(captureFrontendError).toHaveBeenCalledWith(forbidden, {
      source: 'mutation',
      errorCode: 'forbidden',
      status: 403,
      mutationKey: ['profile', 'update'],
    })
  })

  it.each([
    'rate_limit_exceeded',
    'too_many_requests',
    'ingredient_rate_limited',
    'product_rate_limited',
  ])('skips the globally handled %s rate-limit error', (code) => {
    handleMutationError(new ApiError(code, 429), mutationStub(undefined, ['catalog', 'create']))

    expect(captureFrontendError).not.toHaveBeenCalled()
  })

  it('reports an undeclared 4xx error', () => {
    const error = new ApiError('invalid_input', 400)
    handleMutationError(
      error,
      mutationStub({ handledErrorCodes: ['product_already_exists'] }, ['products', 'create'])
    )

    expect(captureFrontendError).toHaveBeenCalledWith(error, {
      source: 'mutation',
      errorCode: 'invalid_input',
      status: 400,
      mutationKey: ['products', 'create'],
    })
  })

  it('uses the message as the toast id so parallel failures collapse to one', () => {
    const err = new Error('boom')
    handleMutationError(err, mutationStub({ errorMessage: 'Échec.' }))
    handleMutationError(err, mutationStub({ errorMessage: 'Échec.' }))
    handleMutationError(err, mutationStub({ errorMessage: 'Échec.' }))

    expect(toast.error).toHaveBeenCalledTimes(3)
    for (const call of vi.mocked(toast.error).mock.calls) {
      expect(call[1]).toEqual({ id: 'Échec.' })
    }
  })
})
