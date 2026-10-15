import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'bun:test'

import { trace } from '@opentelemetry/api'
import { tracing } from '@opentelemetry/sdk-node'
import { Hono } from 'hono'

import type { AppEnv } from '../../app-env'
import { otelTracingMiddleware } from './hono-tracing'

const exporter = new tracing.InMemorySpanExporter()
const provider = new tracing.BasicTracerProvider({
  spanProcessors: [new tracing.SimpleSpanProcessor(exporter)],
})

beforeAll(() => {
  trace.setGlobalTracerProvider(provider)
})

beforeEach(() => {
  exporter.reset()
})

afterAll(async () => {
  trace.disable()
  await provider.shutdown()
})

describe('OTel tracing middleware', () => {
  it.each([
    'email=private@example.test token=fixture-token',
    { message: 'email=private@example.test token=fixture-token' },
    null,
    42,
  ])('redacts a non-Error rejection without changing the rejected value: %p', async (thrown) => {
    const app = new Hono<AppEnv>()
    app.use(otelTracingMiddleware)
    app.get('/fixture', () => Promise.reject(thrown))

    await expect(app.request('http://localhost/fixture')).rejects.toBe(thrown)
    await provider.forceFlush()

    const spans = exporter.getFinishedSpans()
    expect(spans).toHaveLength(1)
    expect(spans[0].status.message).toBe('Unhandled internal error')
    expect(spans[0].events[0]?.attributes?.['exception.message']).toBe('Unhandled internal error')
    const recorded = JSON.stringify(spans.map(({ status, events }) => ({ status, events })))
    expect(recorded).not.toContain('private@example.test')
    expect(recorded).not.toContain('fixture-token')
  })
})
