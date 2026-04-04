import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useFocusTrap } from '../useFocusTrap'

function createContainer() {
  const container = document.createElement('div')
  const btn1 = document.createElement('button')
  btn1.textContent = 'First'
  const btn2 = document.createElement('button')
  btn2.textContent = 'Middle'
  const btn3 = document.createElement('button')
  btn3.textContent = 'Last'
  container.append(btn1, btn2, btn3)
  document.body.appendChild(container)
  return { container, btn1, btn2, btn3 }
}

describe('useFocusTrap', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('focuses the first focusable element on activation', () => {
    const { container, btn1 } = createContainer()
    const ref = { current: container }

    renderHook(() => useFocusTrap(true, ref))

    expect(document.activeElement).toBe(btn1)
  })

  it('does not focus anything when inactive', () => {
    const { container, btn1 } = createContainer()
    const ref = { current: container }

    renderHook(() => useFocusTrap(false, ref))

    expect(document.activeElement).not.toBe(btn1)
  })

  it('wraps Tab from last to first element', () => {
    const { container, btn1, btn3 } = createContainer()
    const ref = { current: container }

    renderHook(() => useFocusTrap(true, ref))

    // Focus last element
    btn3.focus()
    expect(document.activeElement).toBe(btn3)

    const focusSpy = vi.spyOn(btn1, 'focus')
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    container.dispatchEvent(event)

    expect(focusSpy).toHaveBeenCalled()
  })

  it('wraps Shift+Tab from first to last element', () => {
    const { container, btn1, btn3 } = createContainer()
    const ref = { current: container }

    renderHook(() => useFocusTrap(true, ref))

    // First element is already focused by the hook
    expect(document.activeElement).toBe(btn1)

    const focusSpy = vi.spyOn(btn3, 'focus')
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })
    container.dispatchEvent(event)

    expect(focusSpy).toHaveBeenCalled()
  })

  it('cleans up the event listener on unmount', () => {
    const { container } = createContainer()
    const ref = { current: container }
    const removeSpy = vi.spyOn(container, 'removeEventListener')

    const { unmount } = renderHook(() => useFocusTrap(true, ref))
    unmount()

    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
  })

  it('handles null ref gracefully', () => {
    const ref = { current: null }

    // Should not throw
    expect(() => {
      renderHook(() => useFocusTrap(true, ref))
    }).not.toThrow()
  })
})
