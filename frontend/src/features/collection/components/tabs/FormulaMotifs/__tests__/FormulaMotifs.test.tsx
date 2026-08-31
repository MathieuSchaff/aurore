import type { ApiFailure } from '@aurore/shared'

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import type { FormulaMotifs as FormulaMotifsData } from '@/lib/queries/collection'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'
import { FormulaMotifs } from '../FormulaMotifs'

const emptyMotifs = {
  productsAnalyzed: 0,
  benefits: [],
  notes: [],
} satisfies FormulaMotifsData

const serverFailure = {
  success: false,
  error: 'server_error',
} satisfies ApiFailure<'server_error'>

describe('FormulaMotifs', () => {
  it('shows a retryable error when formula motifs cannot load', async () => {
    let requests = 0
    server.use(
      http.get('*/api/collection/formula-motifs', () => {
        requests++
        if (requests === 1) {
          return HttpResponse.json(serverFailure, { status: 500 })
        }
        return HttpResponse.json({ success: true, data: emptyMotifs })
      })
    )

    renderWithProviders(<FormulaMotifs />)

    expect(
      await screen.findByRole('heading', {
        name: /L'analyse des formules n'a pas pu se charger/i,
      })
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /réessayer/i }))

    expect(
      await screen.findByText(/Ajoutez quelques produits avec leur composition/i)
    ).toBeInTheDocument()
    expect(requests).toBe(2)
  })

  it('shows progress while formula motifs are loading', () => {
    server.use(
      http.get('*/api/collection/formula-motifs', async () => {
        await delay('infinite')
        return HttpResponse.json({ success: true, data: emptyMotifs })
      })
    )

    renderWithProviders(<FormulaMotifs />)

    expect(screen.getByRole('status', { name: /chargement/i })).toBeInTheDocument()
  })

  // The names used to live in a title attribute: present for a mouse hover, absent for a finger,
  // a keyboard and a screen reader that does not hover
  it('opens a motif on the products behind it', async () => {
    server.use(
      http.get('*/api/collection/formula-motifs', () =>
        HttpResponse.json({
          success: true,
          data: {
            productsAnalyzed: 2,
            benefits: [
              {
                axis: 'hydrating',
                count: 2,
                products: [
                  { name: 'Crème réparatrice', slug: 'creme-reparatrice' },
                  { name: 'Sérum hydratant', slug: 'serum-hydratant' },
                ],
              },
            ],
            notes: [],
          } satisfies FormulaMotifsData,
        })
      )
    )

    renderWithProviders(<FormulaMotifs />)

    const summary = await screen.findByText(/2 produits/i)
    // The destination is not asserted here: the global setup renders Link as its children alone,
    // and `to="/products/$slug"` is already checked at compile time by the route tree
    expect(screen.getByText('Crème réparatrice')).not.toBeVisible()

    await userEvent.click(summary)

    expect(screen.getByText('Crème réparatrice')).toBeVisible()
    expect(screen.getByText('Sérum hydratant')).toBeVisible()
  })
})
