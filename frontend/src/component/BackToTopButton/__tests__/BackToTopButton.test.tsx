import { render, screen, within } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it } from 'vitest'

import { BackToTopButton } from '../BackToTopButton'

const originalScrollY = window.scrollY

afterEach(() => {
  Object.defineProperty(window, 'scrollY', { value: originalScrollY, configurable: true })
})

describe('BackToTopButton', () => {
  // Browser scroll restoration can run before hydration. The server markup must
  // remain the first client snapshot instead of exposing the button immediately.
  it('keeps the server snapshot hidden regardless of browser scroll position', () => {
    Object.defineProperty(window, 'scrollY', { value: 700, configurable: true })

    const container = document.createElement('div')
    container.innerHTML = renderToString(<BackToTopButton />)

    expect(within(container).getByRole('button', { name: /revenir en haut/i })).toHaveAttribute(
      'tabindex',
      '-1'
    )
  })

  it('reads the actual scroll position after mounting', () => {
    Object.defineProperty(window, 'scrollY', { value: 700, configurable: true })

    render(<BackToTopButton />)

    expect(screen.getByRole('button', { name: /revenir en haut/i })).toHaveAttribute(
      'tabindex',
      '0'
    )
  })
})
