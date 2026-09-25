import {
  type EventEvent,
  type ExceptionEvent,
  type LogEvent,
  LogLevel,
  type MeasurementEvent,
  type TransportItem,
  TransportItemType,
} from '@grafana/faro-react'
import { describe, expect, it, vi } from 'vitest'

import { installCspViolationReporting, isDeclaredTelemetry, scrubUrl } from '../faro'

const BASE = 'https://aurore-app.fr'

describe('scrubUrl', () => {
  it('strips a reset-password token', () => {
    expect(scrubUrl(`${BASE}/auth/reset-password?token=abc123`)).toBe(`${BASE}/auth/reset-password`)
  })

  it('strips concern (RGPD art.9 health data)', () => {
    expect(scrubUrl(`${BASE}/feed?concern=eczema`)).toBe(`${BASE}/feed`)
  })

  it('strips code and state (oauth)', () => {
    expect(scrubUrl(`${BASE}/auth/callback?code=xyz&state=nonce`)).toBe(`${BASE}/auth/callback`)
  })

  it('strips sensitive params but keeps the rest', () => {
    expect(scrubUrl(`${BASE}/feed?concern=eczema&page=2`)).toBe(`${BASE}/feed?page=2`)
  })

  it('strips concerns from the encoded login destination', () => {
    // The login page carries the original feed query inside its redirect
    const raw = `${BASE}/auth/login?redirect=%2Ffeed%3Fconcern%3Deczema%26page%3D2&lang=fr`
    const result = new URL(scrubUrl(raw))
    expect(result.pathname).toBe('/auth/login')
    expect(result.searchParams.get('redirect')).toBe('/feed?page=2')
    expect(result.searchParams.get('lang')).toBe('fr')
  })

  it('scrubs repeated destinations and sensitive parameters', () => {
    const raw = new URL(`${BASE}/auth/login?lang=fr`)
    raw.searchParams.append('redirect', '/feed?concern=eczema&concern=acne&page=2')
    raw.searchParams.append('redirect', `${BASE}/auth/callback?code=secret&state=nonce&lang=fr`)
    const result = new URL(scrubUrl(raw.toString()))
    expect(result.searchParams.getAll('redirect')).toEqual([
      '/feed?page=2',
      `${BASE}/auth/callback?lang=fr`,
    ])
    expect(result.searchParams.get('lang')).toBe('fr')
  })

  it('scrubs a destination nested through another login page', () => {
    const nested = '/auth/login?redirect=%2Ffeed%3Fconcern%3Deczema%26page%3D2&lang=fr'
    const raw = `${BASE}/auth/login?redirect=${encodeURIComponent(nested)}`
    const result = new URL(scrubUrl(raw))
    expect(result.searchParams.get('redirect')).toBe(
      '/auth/login?lang=fr&redirect=%2Ffeed%3Fpage%3D2'
    )
  })

  it('discards deeper destinations without retaining their sensitive values', () => {
    let destination = '/feed?concern=eczema'
    for (let i = 0; i < 8; i++) {
      destination = `/auth/login?redirect=${encodeURIComponent(destination)}`
    }
    const raw = `${BASE}/auth/login?lang=fr&redirect=${encodeURIComponent(destination)}`
    const result = scrubUrl(raw)
    expect(result).not.toContain('eczema')
    expect(new URL(result).searchParams.get('lang')).toBe('fr')
  })

  it('discards an invalid destination while preserving the current page', () => {
    const raw = `${BASE}/auth/login?redirect=http%3A%2F%2F%5B&lang=fr`
    expect(scrubUrl(raw)).toBe(`${BASE}/auth/login?lang=fr`)
  })

  it('leaves a clean url untouched', () => {
    expect(scrubUrl(`${BASE}/products?page=2`)).toBe(`${BASE}/products?page=2`)
  })

  it('does not match too broadly on keys containing a sensitive substring', () => {
    expect(scrubUrl(`${BASE}/x?estate=1&geocode=2`)).toBe(`${BASE}/x?estate=1&geocode=2`)
  })

  it('fails safe on a relative url by dropping the whole query', () => {
    expect(scrubUrl('/feed?token=abc')).toBe('/feed')
  })
})

describe('CSP violation reporting', () => {
  it('pushes a scrubbed, bounded event to Faro', () => {
    const pushEvent = vi.fn()
    const removeListener = installCspViolationReporting(document, pushEvent)
    const violation = Object.assign(new Event('securitypolicyviolation'), {
      blockedURI: `${BASE}/auth/reset-password?token=secret`,
      columnNumber: 12,
      disposition: 'enforce',
      documentURI: `${BASE}/auth/login?redirect=%2Ffeed%3Fconcern%3Deczema%26page%3D2`,
      effectiveDirective: 'img-src',
      lineNumber: 42,
      sourceFile: `${BASE}/assets/app.js?token=secret`,
      statusCode: 200,
      violatedDirective: 'img-src',
    })

    document.dispatchEvent(violation)
    removeListener()

    expect(pushEvent).toHaveBeenCalledWith(
      'csp_violation',
      {
        blocked_uri: `${BASE}/auth/reset-password`,
        column_number: '12',
        disposition: 'enforce',
        document_uri: `${BASE}/auth/login?redirect=%2Ffeed%3Fpage%3D2`,
        effective_directive: 'img-src',
        line_number: '42',
        source_file: `${BASE}/assets/app.js`,
        status_code: '200',
        violated_directive: 'img-src',
      },
      'security'
    )
  })
})

describe('isDeclaredTelemetry', () => {
  const timestamp = '2026-09-15T12:00:00.000Z'
  const exception = {
    type: TransportItemType.EXCEPTION,
    payload: { type: 'Error', value: 'Network request failed', timestamp },
    meta: {},
  } satisfies TransportItem<ExceptionEvent>
  const log = {
    type: TransportItemType.LOG,
    payload: { context: undefined, level: LogLevel.ERROR, message: 'Request failed', timestamp },
    meta: {},
  } satisfies TransportItem<LogEvent>
  const measurement = {
    type: TransportItemType.MEASUREMENT,
    payload: { type: 'web-vitals', values: { lcp: 200 }, timestamp },
    meta: {},
  } satisfies TransportItem<MeasurementEvent>
  const event = (name: string) =>
    ({
      type: TransportItemType.EVENT,
      payload: { name, timestamp },
      meta: {},
    }) satisfies TransportItem<EventEvent>

  it('keeps page errors, console logs and csp violations', () => {
    expect(isDeclaredTelemetry(exception)).toBe(true)
    expect(isDeclaredTelemetry(log)).toBe(true)
    expect(isDeclaredTelemetry(event('csp_violation'))).toBe(true)
  })

  it('drops web-vitals and every automatic navigation-bound event', () => {
    expect(isDeclaredTelemetry(measurement)).toBe(false)
    for (const name of [
      'session_start',
      'view_changed',
      'faro.performance.navigation',
      'faro.performance.resource',
    ]) {
      expect(isDeclaredTelemetry(event(name))).toBe(false)
    }
  })
})
