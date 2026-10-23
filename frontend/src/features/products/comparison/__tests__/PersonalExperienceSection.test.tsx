import { type EnrichedComparisonProduct, err, ok } from '@aurore/shared'

import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '@/test/msw/server'
import { makeUserProduct, renderWithProviders } from '@/test/utils'
import { PersonalExperienceSection } from '../components/PersonalExperienceSection'

const product = (id: string): EnrichedComparisonProduct => ({
  id,
  name: id,
  brand: 'Même marque',
  kind: 'serum',
  slug: id,
  imageUrl: null,
  totalAmount: null,
  amountUnit: null,
  priceCents: null,
  pricePer: null,
  ingredients: [],
  tags: [],
})

describe('PersonalExperienceSection', () => {
  it('attributes private notes and decisions by product without borrowing a public review', async () => {
    const first = makeUserProduct({
      id: 'entry-a',
      productId: 'a',
      status: 'avoided',
      comment: 'Ma note privée A',
      wouldRepurchase: 'no',
    })
    const second = makeUserProduct({
      id: 'entry-b',
      productId: 'b',
      status: 'archived',
      comment: '   ',
      wouldRepurchase: 'unsure',
    })
    second.review.comment = 'Commentaire public différent'
    server.use(http.get('*/api/user-products', () => HttpResponse.json(ok([second, first]))))
    renderWithProviders(
      <PersonalExperienceSection products={[product('a'), product('b'), product('c')]} />
    )

    const a = await screen.findByRole('article', { name: 'Même marque : a' })
    const b = screen.getByRole('article', { name: 'Même marque : b' })
    const c = screen.getByRole('article', { name: 'Même marque : c' })
    expect(within(a).getByText('Ma note privée A')).toBeDefined()
    expect(within(a).getByText('À éviter')).toBeDefined()
    expect(within(a).getByText('Non')).toBeDefined()
    expect(within(b).getByText('Archivé')).toBeDefined()
    expect(within(b).getByText('Peut-être')).toBeDefined()
    expect(within(b).getByText(/aucune note personnelle/i)).toBeDefined()
    expect(screen.queryByText('Commentaire public différent')).toBeNull()
    expect(within(c).getByText(/absent de votre collection/i)).toBeDefined()
    expect(within(c).getByText(/non renseignée/i)).toBeDefined()
    expect(within(c).queryByText('Ma note privée A')).toBeNull()
    expect(within(c).getByRole('button', { name: /ajouter à ma collection/i })).toBeDefined()
  })

  it('waits for collection data before describing an absent experience', async () => {
    server.use(http.get('*/api/user-products', () => HttpResponse.json(ok([]))))
    renderWithProviders(<PersonalExperienceSection products={[product('a')]} />)
    expect(screen.getByRole('status').textContent).toMatch(/chargement de votre collection/i)
    expect(screen.queryByText(/aucune note personnelle/i)).toBeNull()
    await screen.findByText(/absent de votre collection/i)
    expect(screen.getByText(/pas encore essayé \?/i)).toBeDefined()
  })

  it('reports a collection failure and recovers through retry without declaring notes absent', async () => {
    server.use(
      http.get('*/api/user-products', () => HttpResponse.json(err('server_error'), { status: 500 }))
    )
    renderWithProviders(<PersonalExperienceSection products={[product('a')]} />)
    await screen.findByText(/impossible de charger votre expérience/i)
    expect(screen.queryByText(/aucune note personnelle|absent de votre collection/i)).toBeNull()
    expect(screen.queryByRole('button', { name: /ajouter à ma collection/i })).toBeNull()
    server.use(
      http.get('*/api/user-products', () =>
        HttpResponse.json(
          ok([
            makeUserProduct({ productId: 'a', comment: 'Note retrouvée', wouldRepurchase: 'yes' }),
          ])
        )
      )
    )
    await userEvent.click(screen.getByRole('button', { name: /réessayer/i }))
    await screen.findByText('Note retrouvée')
    expect(screen.getByText('Oui')).toBeDefined()
    expect(screen.queryByText(/impossible de charger votre expérience/i)).toBeNull()
  })

  it('preserves private context when the linked catalogue product is unavailable', async () => {
    server.use(
      http.get('*/api/user-products', () =>
        HttpResponse.json(
          ok([{ ...makeUserProduct({ productId: 'a', comment: 'Note conservée' }), product: null }])
        )
      )
    )
    renderWithProviders(<PersonalExperienceSection products={[product('a')]} />)
    await screen.findByText('Note conservée')
    expect(screen.getByText(/fiche de collection indisponible/i)).toBeDefined()
    expect(screen.queryByText(/absent de votre collection/i)).toBeNull()
    expect(screen.queryByRole('button', { name: /ajouter à ma collection/i })).toBeNull()
  })
})
