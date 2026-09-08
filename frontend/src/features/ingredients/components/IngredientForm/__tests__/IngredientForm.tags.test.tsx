import { screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'

import type { SessionView } from '@/lib/auth/session'
import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'
import { IngredientForm } from '../IngredientForm'

vi.mock('@/lib/auth/session', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/auth/session')>()),
  useSession: (): SessionView => ({
    status: 'authenticated',
    credential: 'present',
    user: {
      id: 'user-id',
      email: 'user@example.test',
      createdAt: '2026-01-01T00:00:00.000Z',
      role: 'user',
      emailVerified: true,
      isDemo: false,
    },
  }),
}))

function tagRow(id: string, label: string, tagType: string) {
  return { id, slug: label.toLowerCase(), label, tagType, createdAt: '2026-01-01T00:00:00.000Z' }
}

// The PUT behind the picker links ingredient_tag_types rows: a product tag id
// offered here would fail the foreign key on save
describe('IngredientForm tag picker', () => {
  it('offers the ingredient tag definitions, not the product ones', async () => {
    server.use(
      http.get('*/api/ingredient-tags', () =>
        HttpResponse.json({ success: true, data: [tagRow('it1', 'Apaisant', 'skin_effect')] })
      ),
      http.get('*/api/product-tags', () =>
        HttpResponse.json({ success: true, data: [tagRow('pt1', 'Vegan', 'claim')] })
      )
    )

    renderWithProviders(<IngredientForm mode="create" onSuccess={vi.fn()} />)

    expect(await screen.findByRole('option', { name: /Apaisant/ })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /Vegan/ })).not.toBeInTheDocument()
  })
})
