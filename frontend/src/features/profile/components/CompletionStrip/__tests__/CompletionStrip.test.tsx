import { render, screen, waitFor, within } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it } from 'vitest'

import { CompletionStrip } from '../CompletionStrip'

const incompleteProfile = { username: '', bio: null }

beforeEach(() => {
  window.localStorage.clear()
})

describe('CompletionStrip', () => {
  it('keeps the server snapshot visible when dismissal is stored in the browser', () => {
    window.localStorage.setItem('profile-completion-dismissed', '1')

    const container = document.createElement('div')
    container.innerHTML = renderToString(
      <CompletionStrip profile={incompleteProfile} dermo={undefined} onEditSection={() => {}} />
    )

    expect(
      within(container).getByRole('complementary', { name: /compléter le profil/i })
    ).toHaveClass('completion-strip')
  })

  it('restores the dismissed state after mounting', async () => {
    window.localStorage.setItem('profile-completion-dismissed', '1')

    render(
      <CompletionStrip profile={incompleteProfile} dermo={undefined} onEditSection={() => {}} />
    )

    await waitFor(() => {
      expect(
        screen.queryByRole('complementary', { name: /compléter le profil/i })
      ).not.toBeInTheDocument()
    })
  })
})
