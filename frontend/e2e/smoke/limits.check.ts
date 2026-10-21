import assert from 'node:assert/strict'
import { connect } from 'node:http2'

const client = connect('https://localhost', { rejectUnauthorized: false })

function get(path: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const request = client.request({ ':path': path })
    let status = 0
    let body = ''
    request.setEncoding('utf8')
    request.on('response', (headers) => {
      status = Number(headers[':status'])
    })
    request.on('data', (chunk) => {
      body += chunk
    })
    request.on('end', () => resolve({ status, body }))
    request.on('error', reject)
    const timeout = setTimeout(() => request.destroy(new Error(`Request timed out: ${path}`)), 5000)
    request.once('close', () => clearTimeout(timeout))
    request.end()
  })
}

async function burst(path: string, batches: number) {
  const statuses: number[] = []
  for (let batch = 0; batch < batches; batch++) {
    const responses = await Promise.all(Array.from({ length: 50 }, () => get(path)))
    statuses.push(...responses.map((response) => response.status))
  }
  assert(
    statuses.every((status) => status === 200 || status === 429),
    `Unexpected statuses: ${statuses}`
  )
  return statuses
}

try {
  const document = await get('/')
  assert.equal(document.status, 200)
  const asset = document.body.match(/(?:src|href)="(\/assets\/[^"?]+\.js)"/)?.[1]
  assert(asset, 'The profile must serve the production build')

  const assetStatuses = await burst(asset, 6)
  assert(
    assetStatuses.every((status) => status === 200),
    'Cold assets must fit their own budget'
  )
  assert.equal((await get('/')).status, 200, 'Assets must not consume the page budget')
  assert.equal((await get('/api/health')).status, 200, 'Assets must not consume the API budget')

  // The cheap favicon uses the page location without flooding the SSR renderer
  const pageStatuses = await burst('/favicon.svg', 4)
  assert(pageStatuses.includes(429), 'The page limit must remain active')
  assert.equal((await get(asset)).status, 200, 'Page throttling must not block assets')
  const apiStatuses = await burst('/api/health', 2)
  assert(apiStatuses.includes(429), 'The API limit must remain active')
  assert.equal((await get('/api/auth/refresh')).status, 429, 'Auth must keep the API limit')
  console.log(
    JSON.stringify({
      assets: assetStatuses.length,
      pageRejections: pageStatuses.filter((status) => status === 429).length,
      apiRejections: apiStatuses.filter((status) => status === 429).length,
      pass: true,
    })
  )
} finally {
  client.destroy()
}
