import { BLOG_CATEGORY_VALUES } from '@aurore/shared'

import { act, cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw/http'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { ApiData, api } from '@/lib/api'
import { server } from '@/test/msw/server'
import { createTestQueryClient, renderWithProviders } from '@/test/utils'
import { BlogListPage } from '../BlogListPage'

beforeEach(() => {
  const data = { items: [], total: 0 } satisfies ApiData<typeof api.articles.$get>
  server.use(
    http.get('*/api/articles/categories', () =>
      HttpResponse.json({
        success: true,
        data: Object.fromEntries(BLOG_CATEGORY_VALUES.map((category) => [category, 0])),
      })
    ),
    http.get('*/api/articles', () => HttpResponse.json({ success: true, data }))
  )
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

async function renderSearch() {
  const onSearchChange = vi.fn()
  const props = { page: 1, onPageChange: vi.fn(), onSearchChange }
  const queryClient = createTestQueryClient()
  const view = renderWithProviders(<BlogListPage {...props} />, { queryClient })
  await screen.findByText(/aucun article/i)
  await waitFor(() => expect(queryClient.isFetching()).toBe(0))
  vi.useFakeTimers()
  return { ...view, props, onSearchChange }
}

describe('BlogListPage: pending search', () => {
  it('cancels navigation when the page unmounts before the debounce expires', async () => {
    const { unmount, onSearchChange } = await renderSearch()
    // fireEvent keeps the debounce clock frozen; userEvent's async wrapper waits on that clock
    fireEvent.change(screen.getByRole('searchbox', { name: /rechercher/i }), {
      target: { value: 'retinol' },
    })

    unmount()
    await act(() => vi.advanceTimersByTimeAsync(400))

    // A stale search callback would navigate after the user has left the blog
    expect(onSearchChange).not.toHaveBeenCalled()
  })
  it.each([{ q: 'ceramide' }, { category: BLOG_CATEGORY_VALUES[0] }])(
    'cancels a pending search when navigation changes props to %j',
    async (next) => {
      const { rerender, props, onSearchChange } = await renderSearch()
      fireEvent.change(screen.getByRole('searchbox', { name: /rechercher/i }), {
        target: { value: 'retinol' },
      })

      rerender(<BlogListPage {...props} {...next} />)
      await act(() => vi.advanceTimersByTimeAsync(400))

      expect(onSearchChange).not.toHaveBeenCalled()
      expect(screen.getByRole('searchbox', { name: /rechercher/i })).toHaveValue(next.q ?? '')
    }
  )

  it('submits only the latest input after the debounce delay', async () => {
    const { onSearchChange } = await renderSearch()
    const input = screen.getByRole('searchbox', { name: /rechercher/i })
    fireEvent.change(input, { target: { value: 'retinol' } })
    await act(() => vi.advanceTimersByTimeAsync(200))
    fireEvent.change(input, { target: { value: 'retinal' } })
    await act(() => vi.advanceTimersByTimeAsync(399))
    expect(onSearchChange).not.toHaveBeenCalled()

    await act(() => vi.advanceTimersByTimeAsync(1))

    expect(onSearchChange).toHaveBeenCalledExactlyOnceWith('retinal')
  })
})
