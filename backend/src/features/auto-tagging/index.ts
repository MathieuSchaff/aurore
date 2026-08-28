// Keep the public surface narrow while internal runners use concrete modules

export { loadTagSlugToInfo } from './lib/fetch-auto-tag-bundle'
export { buildOrchestratorInput, type OrchestratorProductFields } from './lib/orchestrator-input'
export type { AutoTagSource } from './lib/pass-types'
export { resolveTagRows } from './lib/resolve-tag-rows'
export { detectAllAutoTags, isAutoTagEligibleCategory } from './orchestrator'
export { partitionEczemaReview } from './passes/formula'
export { writeTagsForProductFailSoft } from './write'
