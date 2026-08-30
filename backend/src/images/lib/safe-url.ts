import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

export type DnsLookup = (hostname: string) => Promise<string[]>

const resolveHost: DnsLookup = async (hostname) =>
  (await lookup(hostname, { all: true })).map((record) => record.address)

function isInternalIpv4(ip: string): boolean {
  const [a, b] = ip.split('.').map(Number)
  if (a === 0 || a === 10 || a === 127) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a === 100 && b >= 64 && b <= 127) return true
  return a >= 224
}

function isInternalIpv6(ip: string): boolean {
  const addr = ip.toLowerCase().split('%')[0]
  // Every ::-prefixed form is special (unspecified, loopback, v4-mapped, v4-compatible), and the
  // URL parser rewrites ::ffff:127.0.0.1 to ::ffff:7f00:1, so match the prefix, not the tail.
  if (addr.startsWith('::')) return true
  return /^(f[cd]|fe[89ab]|ff)/.test(addr)
}

function isInternal(ip: string): boolean {
  const family = isIP(ip)
  if (family === 4) return isInternalIpv4(ip)
  if (family === 6) return isInternalIpv6(ip)
  return true
}

/**
 * Anyone with product_create writes image_url and an operator fetches it later from inside
 * the network, so an unvalidated host turns these CLIs into a deferred SSRF (docs/adr/0022).
 * Residual gap: fetch resolves DNS again, so a rebinding zone answers public here, internal there
 */
export async function assertPublicHttpUrl(raw: string, dns: DnsLookup = resolveHost): Promise<URL> {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new Error(`refusing ${raw}: not a URL`)
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`refusing ${raw}: ${url.protocol} is not http(s)`)
  }

  const host = url.hostname.replace(/^\[|\]$/g, '')
  const addresses = isIP(host) ? [host] : await dns(host)
  if (addresses.length === 0) throw new Error(`refusing ${raw}: ${host} resolves to nothing`)
  for (const address of addresses) {
    if (isInternal(address)) {
      throw new Error(`refusing ${raw}: ${host} resolves to the internal address ${address}`)
    }
  }
  return url
}

export interface FetchDeps {
  dns?: DnsLookup
  fetch?: (url: URL, init: RequestInit) => Promise<Response>
}

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308])
const MAX_REDIRECTS = 5

/**
 * fetch follows redirects on its own, so a public host answering 302 to 10.0.0.1 walks
 * straight past assertPublicHttpUrl. Follow each hop by hand and judge it again.
 * Location can be relative or protocol relative, so resolve it against the hop that sent it
 */
export async function fetchPublicHttpUrl(
  raw: string,
  init: RequestInit = {},
  deps: FetchDeps = {}
): Promise<Response> {
  const doFetch = deps.fetch ?? fetch
  let url = await assertPublicHttpUrl(raw, deps.dns)
  for (let hop = 0; ; hop++) {
    const res = await doFetch(url, { ...init, redirect: 'manual' })
    const location = res.headers.get('location')
    if (!REDIRECT_STATUSES.has(res.status) || location === null) return res
    if (hop === MAX_REDIRECTS)
      throw new Error(`refusing ${raw}: more than ${MAX_REDIRECTS} redirects`)
    url = await assertPublicHttpUrl(new URL(location, url).href, deps.dns)
  }
}
