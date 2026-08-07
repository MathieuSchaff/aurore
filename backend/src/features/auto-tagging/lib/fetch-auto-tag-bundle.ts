// Batch-loads the AutoTagFetchBundle (brand certs, tag defs, percent claims, known
// concentrations) for a set of products. One loader for intake and the batch runners so the
// fetch set cannot drift per caller (brand certs used to be fetched 4x, two callers missed inputs).

import type { DbOrTransaction } from '../../../db'
import { brandCertifications, products, productTagTypes } from '../../../db/schema'
import { fetchKnownConcentrationsByProduct } from '../../../lib/fetch-known-concentrations'
import { fetchPercentClaimsByProduct } from '../../../lib/fetch-percent-claims'
import type { AutoTagFetchBundle } from './orchestrator-input'

// Drizzle column set matching `OrchestratorProductFields`: the one select
// shape every DB-backed caller spreads (`{ id: products.id, ...COLUMNS }`), so
// adding an orchestrator input field is one edit, not one per call site.
export const ORCHESTRATOR_PRODUCT_COLUMNS = {
  name: products.name,
  description: products.description,
  brand: products.brand,
  kind: products.kind,
  inci: products.inci,
  category: products.category,
  texture: products.texture,
}

// Shared with the formula preview so its resolveTagRows input cannot drift
// from the tag-def shape the writers persist with.
export async function loadTagSlugToInfo(
  database: DbOrTransaction
): Promise<AutoTagFetchBundle['tagSlugToInfo']> {
  const tagDefs = await database
    .select({
      id: productTagTypes.id,
      slug: productTagTypes.slug,
      tagType: productTagTypes.tagType,
    })
    .from(productTagTypes)
  return new Map(tagDefs.map((t) => [t.slug, { id: t.id, tagType: t.tagType }]))
}

export async function loadAutoTagFetchBundle(
  productIds: readonly string[],
  database: DbOrTransaction
): Promise<AutoTagFetchBundle> {
  // Reads stay sequential on purpose. bun-sql serializes statements on a single tx connection
  // today (verified 0/300 misroute), but a Bun/driver downgrade could reintroduce the
  // concurrent-tx misroute: a misrouted empty tag-defs read drops every tag while intake's
  // DELETE still wipes existing rows. Reconcile passes a tx (withAdminRls); intake uses the pool.
  const certRows = await database.select().from(brandCertifications)
  const percentClaimsByProduct = await fetchPercentClaimsByProduct(productIds, database)
  const knownConcentrationsByProduct = await fetchKnownConcentrationsByProduct(productIds, database)
  const tagSlugToInfo = await loadTagSlugToInfo(database)

  return {
    brandCertifications: new Map(certRows.map((r) => [r.brandNormalized, r])),
    tagSlugToInfo,
    percentClaimsByProduct,
    knownConcentrationsByProduct,
  }
}
