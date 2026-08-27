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
})
