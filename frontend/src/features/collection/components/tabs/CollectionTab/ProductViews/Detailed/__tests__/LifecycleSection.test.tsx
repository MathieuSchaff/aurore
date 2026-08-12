import { cleanup, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/test/utils'
import { LifecycleSection } from '../LifecycleSection'

vi.mock('@/lib/queries/purchases', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/queries/purchases')>()
  return {
    ...actual,
    useOpenPurchase: vi.fn(() => ({ mutate: vi.fn() })),
    useFinishPurchase: vi.fn(() => ({ mutate: vi.fn() })),
  }
})

describe('LifecycleSection', () => {
  afterEach(() => {
    cleanup()
  })

  const defaultProps = {
    p: { id: 'up1' } as any,
    onAddPurchase: vi.fn(),
  }

  it('affiche un message si aucun achat disponible', async () => {
    renderWithProviders(<LifecycleSection {...defaultProps} />)
    expect(await screen.findByText(/Aucun achat enregistré/)).toBeInTheDocument()
  })
})
