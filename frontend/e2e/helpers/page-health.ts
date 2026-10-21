import type { Page } from '@playwright/test'

import { waitForHydration } from './hydration'

export function watchPageHealth(page: Page) {
  let firstFailure: Error | undefined
  let signalFailure: (error: Error) => void = () => {}
  const failure = new Promise<Error>((resolve) => {
    signalFailure = resolve
  })
  const fail = (message: string) => {
    firstFailure ??= new Error(message)
    signalFailure(firstFailure)
  }

  page.on('response', (response) => {
    if (response.status() >= 400) {
      fail(`HTTP ${response.status()} ${response.request().resourceType()} ${response.url()}`)
    }
  })
  page.on('requestfailed', (request) => {
    fail(`${request.failure()?.errorText} ${request.resourceType()} ${request.url()}`)
  })
  page.on('pageerror', (error) => fail(`JavaScript: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') fail(`Console: ${message.text()}`)
  })

  async function run<T>(action: () => Promise<T>): Promise<T> {
    if (firstFailure) throw firstFailure
    // A rejected module must fail the probe before the hydration timeout hides its cause
    const result = await Promise.race([
      action(),
      failure.then((error) => {
        throw error
      }),
    ])
    if (firstFailure) throw firstFailure
    return result
  }

  async function goto(url: string) {
    await run(async () => {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' })
      if (response?.status() !== 200) {
        throw new Error(`Document HTTP ${response?.status() ?? 'missing'} ${url}`)
      }
      await waitForHydration(page)
    })
  }

  return { goto, run }
}
