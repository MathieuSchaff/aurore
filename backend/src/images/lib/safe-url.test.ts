import { describe, expect, it } from 'bun:test'

import { assertPublicHttpUrl, fetchPublicHttpUrl } from './safe-url'

const resolvesTo =
  (...addresses: string[]) =>
  async () =>
    addresses

describe('assertPublicHttpUrl', () => {
  it('accepts a public host', async () => {
    const url = await assertPublicHttpUrl(
      'https://cdn.example.com/a.jpg',
      resolvesTo('93.184.216.34')
    )
    expect(url.hostname).toBe('cdn.example.com')
  })

  it('accepts a public IP literal without resolving', async () => {
    const url = await assertPublicHttpUrl('https://93.184.216.34/a.jpg', resolvesTo('127.0.0.1'))
    expect(url.hostname).toBe('93.184.216.34')
  })

  it('refuses a scheme that is not http(s)', async () => {
    expect(assertPublicHttpUrl('file:///etc/passwd', resolvesTo())).rejects.toThrow('file:')
  })

  it('refuses a string that is not a URL', async () => {
    expect(assertPublicHttpUrl('not a url', resolvesTo())).rejects.toThrow('not a URL')
  })

  it.each([
    ['loopback', 'http://127.0.0.1:5432/'],
    ['any address', 'http://0.0.0.0/'],
    ['private class A', 'http://10.0.0.1/'],
    ['private class B', 'http://172.16.0.1/'],
    ['private class C', 'http://192.168.1.50/'],
    ['carrier NAT', 'http://100.64.0.1/'],
    ['cloud metadata', 'http://169.254.169.254/latest/meta-data/'],
    ['IPv6 loopback', 'http://[::1]/'],
    ['IPv6 unique local', 'http://[fd00::1]/'],
    ['IPv6 link local', 'http://[fe80::1]/'],
    ['IPv4-mapped loopback', 'http://[::ffff:127.0.0.1]/'],
    ['decimal-encoded loopback', 'http://2130706433/'],
  ])('refuses %s', async (_label, raw) => {
    expect(assertPublicHttpUrl(raw, resolvesTo())).rejects.toThrow('internal address')
  })

  it('refuses a public-looking host that resolves to an internal address', async () => {
    expect(
      assertPublicHttpUrl('http://images.example.com/a.jpg', resolvesTo('127.0.0.1'))
    ).rejects.toThrow('internal address')
  })

  it('refuses when one of several answers is internal', async () => {
    expect(
      assertPublicHttpUrl(
        'http://images.example.com/a.jpg',
        resolvesTo('93.184.216.34', '10.1.2.3')
      )
    ).rejects.toThrow('internal address')
  })

  it('refuses a host that resolves to nothing', async () => {
    expect(assertPublicHttpUrl('http://void.example.com/a.jpg', resolvesTo())).rejects.toThrow(
      'resolves to nothing'
    )
  })
})

const START = 'https://cdn.example.com/a.jpg'

const respondsWith = (routes: Record<string, () => Response>) => {
  const calls: { url: string; redirect?: RequestInit['redirect'] }[] = []
  const fetch = async (url: URL, init: RequestInit) => {
    calls.push({ url: url.href, redirect: init.redirect })
    const route = routes[url.href]
    if (!route) throw new Error(`unexpected fetch ${url.href}`)
    return route()
  }
  return { fetch, calls }
}

const redirectTo = (location: string) => () =>
  new Response(null, { status: 302, headers: { location } })

describe('fetchPublicHttpUrl', () => {
  const dns = async (host: string) =>
    host === 'internal.example.com' ? ['127.0.0.1'] : ['93.184.216.34']

  it('follows a redirect to a public host without letting fetch follow it', async () => {
    const { fetch, calls } = respondsWith({
      [START]: redirectTo('https://img.example.net/a.jpg'),
      'https://img.example.net/a.jpg': () => new Response('image'),
    })
    const res = await fetchPublicHttpUrl(START, {}, { dns, fetch })
    expect(await res.text()).toBe('image')
    expect(calls).toEqual([
      { url: START, redirect: 'manual' },
      { url: 'https://img.example.net/a.jpg', redirect: 'manual' },
    ])
  })

  it('resolves a relative Location against the hop that sent it', async () => {
    const { fetch, calls } = respondsWith({
      [START]: redirectTo('/b.jpg'),
      'https://cdn.example.com/b.jpg': () => new Response('image'),
    })
    await fetchPublicHttpUrl(START, {}, { dns, fetch })
    expect(calls[1]?.url).toBe('https://cdn.example.com/b.jpg')
  })

  it.each([
    ['an internal address', 'http://169.254.169.254/latest/meta-data/'],
    ['a protocol relative internal address', '//10.0.0.1/a.jpg'],
    ['a host that resolves to an internal address', 'https://internal.example.com/a.jpg'],
  ])('refuses a redirect to %s before fetching it', async (_label, location) => {
    const { fetch, calls } = respondsWith({ [START]: redirectTo(location) })
    expect(fetchPublicHttpUrl(START, {}, { dns, fetch })).rejects.toThrow('internal address')
    expect(calls.map((call) => call.url)).toEqual([START])
  })

  it('refuses a chain longer than 5 redirects', async () => {
    const fetch = async (url: URL) => redirectTo(`${url.href}x`)()
    expect(fetchPublicHttpUrl(START, {}, { dns, fetch })).rejects.toThrow('more than 5 redirects')
  })
})
