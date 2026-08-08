export interface BackfillPageQuery {
  afterId: string | null
  limit: number
  slug: string | null
}

export interface BackfillPaginationOptions {
  pageSize: number
  limit: number | null
  slug: string | null
}

export interface BackfillPaginationResult {
  pages: number
  products: number
  lastCursor: string | null
}

interface BackfillPageDependencies<TProduct extends { id: string }> {
  fetchPage(query: BackfillPageQuery): Promise<readonly TProduct[]>
  processPage(products: readonly TProduct[]): Promise<void>
}

export async function runBackfillPages<TProduct extends { id: string }>(
  options: BackfillPaginationOptions,
  dependencies: BackfillPageDependencies<TProduct>
): Promise<BackfillPaginationResult> {
  if (!Number.isSafeInteger(options.pageSize) || options.pageSize < 1) {
    throw new Error(`pageSize must be a positive integer, got "${options.pageSize}"`)
  }
  if (options.limit !== null && (!Number.isSafeInteger(options.limit) || options.limit < 0)) {
    throw new Error(`limit must be a non-negative integer, got "${options.limit}"`)
  }

  let lastCursor: string | null = null
  let pages = 0
  let products = 0
  let remaining = options.limit

  while (remaining === null || remaining > 0) {
    const pageLimit = remaining === null ? options.pageSize : Math.min(options.pageSize, remaining)
    const page = await dependencies.fetchPage({
      afterId: lastCursor,
      limit: pageLimit,
      slug: options.slug,
    })
    if (page.length === 0) break
    if (page.length > pageLimit) {
      throw new Error(`Backfill page exceeded its requested limit (${page.length} > ${pageLimit})`)
    }

    let previousId = lastCursor
    for (const product of page) {
      if (previousId !== null && product.id <= previousId) {
        throw new Error(`Backfill page cursor did not advance after "${previousId}"`)
      }
      previousId = product.id
    }

    await dependencies.processPage(page)
    pages++
    products += page.length
    remaining = remaining === null ? null : remaining - page.length
    lastCursor = page.at(-1)?.id ?? lastCursor

    if (options.slug !== null) break
  }

  return { pages, products, lastCursor }
}
