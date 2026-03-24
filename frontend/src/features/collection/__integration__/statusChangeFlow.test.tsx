/** @vitest-environment jsdom */
import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { makeUserProduct, renderWithProviders } from '../../../test/utils'
import { CollectionCard } from '../components/card/CollectionCard'
import { StatusSelector } from '../components/filters/StatusSelector'

describe('Flow : changement de statut', () => {
  afterEach(() => {
    cleanup()
  })
  it('la card affiche le statut initial', () => {
    const item = makeUserProduct({ status: 'in_stock' })
    renderWithProviders(<CollectionCard item={item} />)
    expect(screen.getByLabelText('Statut : En stock')).toBeInTheDocument()
  })

  it('le sélecteur de statut appelle le callback avec le nouveau statut', async () => {
    const onChange = vi.fn()
    renderWithProviders(<StatusSelector value="in_stock" onChange={onChange} />)
    await userEvent.click(screen.getByText('Archivé'))
    expect(onChange).toHaveBeenCalledWith('archived')
  })

  it('après changement de statut, la card reflète le nouveau statut', () => {
    const item = makeUserProduct({ status: 'archived' })
    renderWithProviders(<CollectionCard item={item} />)
    expect(screen.getByLabelText('Statut : Archivé')).toBeInTheDocument()
    expect(screen.queryByLabelText('Statut : En stock')).not.toBeInTheDocument()
  })
})
