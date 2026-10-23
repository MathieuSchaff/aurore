import { type EnrichedComparison, err, ok, type UpdateComparisonInput } from '@aurore/shared'

import { act, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  useBlocker: vi.fn(),
}))

import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'
import { ComparisonNameEditor } from '../components/ComparisonNameEditor'

const id = '11111111-1111-4111-8111-111111111111'
const response = (name: string | null): EnrichedComparison => ({
  id,
  name,
  createdAt: '2026-10-23T00:00:00.000Z',
  products: [],
})

describe('ComparisonNameEditor', () => {
  it.each(['Dernier', 'Avant'])(
    'retains newer typing across acknowledgement and refetch (%s)',
    async (nextDraft) => {
      const release = Promise.withResolvers<void>()
      const started = Promise.withResolvers<void>()
      const names: (string | null)[] = []
      server.use(
        http.patch('*/api/product-comparisons/:id', async ({ request }) => {
          const input = (await request.json()) as UpdateComparisonInput
          names.push(input.name ?? null)
          started.resolve()
          await release.promise
          return HttpResponse.json(ok(response(input.name ?? null)))
        })
      )
      const { rerender } = renderWithProviders(
        <ComparisonNameEditor id={id} savedName="Avant" count={2} />
      )
      const input = screen.getByRole('textbox', { name: /nom de la comparaison/i })
      const save = screen.getByRole('button', { name: /enregistrer le nom/i })
      await userEvent.clear(input)
      await userEvent.type(input, 'Premier')
      expect(names).toEqual([])
      await userEvent.click(save)
      await started.promise
      await userEvent.clear(input)
      await userEvent.type(input, nextDraft)
      fireEvent.submit(screen.getByRole('form', { name: /nom de la comparaison/i }))
      expect(names).toEqual(['Premier'])
      rerender(<ComparisonNameEditor id={id} savedName="Premier" count={3} />)
      expect((input as HTMLInputElement).value).toBe(nextDraft)
      await act(async () => release.resolve())
      await screen.findByText(/nom modifié, non enregistré/i)
      expect((input as HTMLInputElement).value).toBe(nextDraft)
      expect(names).toEqual(['Premier'])
      await userEvent.click(save)
      await screen.findByText(/nom enregistré\./i)
      expect(names).toEqual(['Premier', nextDraft])
    }
  )

  it('preserves a failed draft, retries it and sends null when the optional name is cleared', async () => {
    const names: (string | null)[] = []
    server.use(
      http.patch('*/api/product-comparisons/:id', async ({ request }) => {
        const input = (await request.json()) as UpdateComparisonInput
        names.push(input.name ?? null)
        return names.length === 1
          ? HttpResponse.json(err('server_error'), { status: 500 })
          : HttpResponse.json(ok(response(input.name ?? null)))
      })
    )
    renderWithProviders(<ComparisonNameEditor id={id} savedName="Avant" count={2} />)
    const input = screen.getByRole('textbox', { name: /nom de la comparaison/i })
    const save = screen.getByRole('button', { name: /enregistrer le nom/i })
    await userEvent.clear(input)
    await userEvent.type(input, '  Nouveau  ')
    await userEvent.click(save)
    await screen.findByText(/votre saisie est conservée/i)
    expect((input as HTMLInputElement).value).toBe('  Nouveau  ')
    await userEvent.click(save)
    await screen.findByText(/nom enregistré\./i)
    expect((input as HTMLInputElement).value).toBe('Nouveau')
    await userEvent.clear(input)
    await userEvent.type(input, '   ')
    await userEvent.click(save)
    await screen.findByText(/nom enregistré\./i)
    expect(names).toEqual(['Nouveau', 'Nouveau', null])
    expect((input as HTMLInputElement).value).toBe('')
  })

  it('follows server changes only when clean and cancels back to the current confirmed name', async () => {
    const { rerender } = renderWithProviders(
      <ComparisonNameEditor id={id} savedName="Avant" count={2} />
    )
    const input = screen.getByRole('textbox', { name: /nom de la comparaison/i })
    rerender(<ComparisonNameEditor id={id} savedName="Serveur" count={2} />)
    expect((input as HTMLInputElement).value).toBe('Serveur')
    await userEvent.clear(input)
    await userEvent.type(input, 'Brouillon')
    rerender(<ComparisonNameEditor id={id} savedName="Autre onglet" count={2} />)
    expect((input as HTMLInputElement).value).toBe('Brouillon')
    await userEvent.click(screen.getByRole('button', { name: /annuler/i }))
    expect((input as HTMLInputElement).value).toBe('Autre onglet')
  })
})
