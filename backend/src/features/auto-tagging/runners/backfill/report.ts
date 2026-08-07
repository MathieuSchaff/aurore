import type { AutoTagSource } from '../../orchestrator'
import { mulberry32 } from '../rng'
import type { Candidate, ClassifyResult } from './classify'

const DETAIL_LIMIT = 50

export interface BackfillReportProduct {
  id: string
  slug: string
  name: string | null
  inci: string | null
}

export interface EczemaReviewItem {
  slug: string
  name: string
  description: string
}

export interface BackfillSampleRow {
  candidate: Candidate
  productName: string
  inci: string
}

interface BackfillPageReport {
  products: readonly BackfillReportProduct[]
  noInci: number
  candidateCount: number
  result: ClassifyResult
  eczemaReviewQueue: readonly EczemaReviewItem[]
}

export interface BackfillReportSnapshot {
  pages: number
  products: number
  noInci: number
  candidateCount: number
  skipped: number
  insertCount: number
  upsertCount: number
  avoidUpserts: number
  primaryPromotions: number
  sourceCountInsert: Record<AutoTagSource, number>
  tagInsertCounts: Map<string, number>
  insertDetails: Candidate[]
  planDetails: { action: 'INSERT' | 'UPSERT'; candidate: Candidate }[]
  sample: BackfillSampleRow[]
  eczemaReviewCount: number
  eczemaReviewSample: EczemaReviewItem[]
}

export function createBackfillReport(options: { sampleSize: number | null; seed: number }) {
  const sourceCountInsert: Record<AutoTagSource, number> = {
    'algo-derm': 0,
    'actif-class': 0,
    kind: 0,
    formula: 0,
    'cross-signal': 0,
    interaction: 0,
    concentration: 0,
    brand: 0,
    'percent-claim': 0,
  }
  const tagInsertCounts = new Map<string, number>()
  const insertDetails: Candidate[] = []
  const planDetails: { action: 'INSERT' | 'UPSERT'; candidate: Candidate }[] = []
  const sample: BackfillSampleRow[] = []
  const eczemaReviewSample: EczemaReviewItem[] = []
  const rng = mulberry32(options.seed >>> 0)
  let pages = 0
  let products = 0
  let noInci = 0
  let candidateCount = 0
  let skipped = 0
  let insertCount = 0
  let upsertCount = 0
  let avoidUpserts = 0
  let primaryPromotions = 0
  let sampleCandidatesSeen = 0
  let eczemaReviewCount = 0

  function addPage(page: BackfillPageReport): void {
    const productsById = new Map(page.products.map((product) => [product.id, product]))
    pages++
    products += page.products.length
    noInci += page.noInci
    candidateCount += page.candidateCount
    skipped += page.result.skipped
    insertCount += page.result.toInsert.length
    upsertCount += page.result.toUpsert.length
    avoidUpserts += page.result.toUpsert.length - page.result.primaryUpserts
    primaryPromotions += page.result.primaryInserts + page.result.primaryUpserts

    for (const candidate of page.result.toInsert) {
      sourceCountInsert[candidate.source]++
      tagInsertCounts.set(candidate.tagSlug, (tagInsertCounts.get(candidate.tagSlug) ?? 0) + 1)
      if (insertDetails.length < DETAIL_LIMIT) insertDetails.push(candidate)
      if (planDetails.length < DETAIL_LIMIT) planDetails.push({ action: 'INSERT', candidate })

      if (options.sampleSize !== null && options.sampleSize > 0) {
        sampleCandidatesSeen++
        const product = productsById.get(candidate.productId)
        const row = {
          candidate,
          productName: product?.name ?? '',
          inci: product?.inci ?? '',
        }
        if (sample.length < options.sampleSize) {
          sample.push(row)
        } else {
          const index = Math.floor(rng() * sampleCandidatesSeen)
          if (index < options.sampleSize) sample[index] = row
        }
      }
    }

    for (const candidate of page.result.toUpsert) {
      if (planDetails.length < DETAIL_LIMIT) planDetails.push({ action: 'UPSERT', candidate })
    }

    eczemaReviewCount += page.eczemaReviewQueue.length
    for (const item of page.eczemaReviewQueue) {
      if (eczemaReviewSample.length >= DETAIL_LIMIT) break
      eczemaReviewSample.push(item)
    }
  }

  function snapshot(): BackfillReportSnapshot {
    return {
      pages,
      products,
      noInci,
      candidateCount,
      skipped,
      insertCount,
      upsertCount,
      avoidUpserts,
      primaryPromotions,
      sourceCountInsert: { ...sourceCountInsert },
      tagInsertCounts: new Map(tagInsertCounts),
      insertDetails: [...insertDetails],
      planDetails: [...planDetails],
      sample: [...sample],
      eczemaReviewCount,
      eczemaReviewSample: [...eczemaReviewSample],
    }
  }

  return { addPage, snapshot }
}
