// Gold-set annotations for auto-tag precision/recall measurement.
// Hand-maintained corpus; `present`/`absent` are explicit annotator judgments,
// everything else is `unrated` and excluded from per-tag metrics.
// Schema is narrow on purpose: no confidence, no relevance. Gold targets
// `secondary` membership; `avoid` correctness is checked by safety-net tests instead.

import path from 'node:path'

import { PRODUCT_KIND_LABELS, type ProductKind, type SkincareProductTagSlug } from '@aurore/shared'

export const GOLD_SET_SCHEMA_VERSION = '2026-05-08' as const

// Default annotations file, resolved from THIS file so consumers at different
// directory depths (audit runners, bootstrap) cannot drift on the path.
export const DEFAULT_GOLD_SET_PATH = path.resolve(
  import.meta.dir,
  '..',
  'data',
  'gold-set',
  'annotations.json'
)

// Focus tags for this benchmark. Acid clusters keep positionCap=10 drift by design.
// `satisfies` catches slug renames at compile time instead of skewing metrics at runtime.
export const GOLD_SET_FOCUS_TAGS = [
  'retinoids',
  'vitamin-c',
  'vitamin-e',
  'hyaluronic-acid',
  'peptides',
  'polyphenols',
  'enzymes-exfoliants',
  'ceramides',
  'tyrosinase-inhibitors',
  'fini-mat',
  'texture-legere',
  'texture-riche',
  // formula-pass concern layer
  'keratose-pilaire',
  'eczema-atopie',
  'reparation-cutanee',
  'reparateur',
  'cernes-poches',
  'aha',
  'bha',
  'pha',
  // algo-derm concern layer
  'acne-imperfections',
  'anti-age',
  'hyperpigmentation',
  'barriere-cutanee',
  'apaisant',
  'deshydratation',
  'pores-sebum',
  'rougeurs-vasculaires',
  'eclat-teint-uniforme',
  'protection',
  'hypoallergenique',
  'non-comedogene',
  'non-irritant',
] as const satisfies readonly SkincareProductTagSlug[]

export type GoldSetFocusTag = (typeof GOLD_SET_FOCUS_TAGS)[number]

const FOCUS_TAG_SET: ReadonlySet<string> = new Set(GOLD_SET_FOCUS_TAGS)

export function isGoldSetFocusTag(slug: string): slug is GoldSetFocusTag {
  return FOCUS_TAG_SET.has(slug)
}

// Keys of a Record the compiler already forces to be exhaustive, so a new kind reaches this guard
// without a second list to keep in step
const PRODUCT_KIND_SET: ReadonlySet<string> = new Set(Object.keys(PRODUCT_KIND_LABELS))

function isProductKind(value: unknown): value is ProductKind {
  return typeof value === 'string' && PRODUCT_KIND_SET.has(value)
}

export interface GoldSetAnnotation {
  productSlug: string
  kind: ProductKind
  category: string
  present: GoldSetFocusTag[]
  // Tag in neither `present` nor `absent` is `unrated`: excluded from metrics.
  absent: GoldSetFocusTag[]
  // Bootstrap stamps "" until the annotator fills `present`/`absent`.
  annotatedAt: string
  // Which focus tag(s) caused this product to be sampled. Not authoritative.
  sampledFor?: GoldSetFocusTag[]
  notes?: string
}

export interface GoldSetFile {
  schemaVersion: typeof GOLD_SET_SCHEMA_VERSION
  // Pinned at bootstrap time so benchmark reports can be tied to a rule version.
  rulesetVersion?: string
  annotations: GoldSetAnnotation[]
}

export class GoldSetValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GoldSetValidationError'
  }
}

// Validates: schema version, no duplicate productSlug, every tag ∈ FOCUS_TAGS, present ∩ absent = ∅.
export async function loadGoldSet(path: string): Promise<GoldSetFile> {
  const file = Bun.file(path)
  if (!(await file.exists())) {
    throw new GoldSetValidationError(`Gold-set file not found: ${path}`)
  }
  const raw = await file.text()
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch (e) {
    throw new GoldSetValidationError(
      `Gold-set file is not valid JSON: ${path} — ${e instanceof Error ? e.message : String(e)}`
    )
  }
  return validateGoldSet(parsed, path)
}

export function validateGoldSet(value: unknown, path: string): GoldSetFile {
  if (!value || typeof value !== 'object') {
    throw new GoldSetValidationError(`Gold-set root must be an object (${path})`)
  }
  const root = value as Record<string, unknown>
  if (root.schemaVersion !== GOLD_SET_SCHEMA_VERSION) {
    throw new GoldSetValidationError(
      `Gold-set schemaVersion mismatch (${path}): expected "${GOLD_SET_SCHEMA_VERSION}", got "${String(root.schemaVersion)}"`
    )
  }
  if (!Array.isArray(root.annotations)) {
    throw new GoldSetValidationError(`Gold-set "annotations" must be an array (${path})`)
  }

  const seen = new Set<string>()
  const annotations: GoldSetAnnotation[] = []
  for (let i = 0; i < root.annotations.length; i++) {
    const annotation = root.annotations[i] as Record<string, unknown>
    const where = `${path} #${i}`
    if (!annotation || typeof annotation !== 'object') {
      throw new GoldSetValidationError(`Annotation must be an object at ${where}`)
    }
    const slug = annotation.productSlug
    if (typeof slug !== 'string' || slug.length === 0) {
      throw new GoldSetValidationError(`Missing or empty "productSlug" at ${where}`)
    }
    if (seen.has(slug)) {
      throw new GoldSetValidationError(`Duplicate productSlug "${slug}" at ${where}`)
    }
    seen.add(slug)

    // The only field that used to enter on a bare cast: an invented kind then reached the metrics
    // as a bucket of its own, silently, while every neighbouring field was checked
    if (!isProductKind(annotation.kind)) {
      throw new GoldSetValidationError(
        `Unknown "kind" "${String(annotation.kind)}" for "${slug}" at ${where}`
      )
    }

    const present = checkTagList(annotation.present, 'present', where)
    const absent = checkTagList(annotation.absent, 'absent', where)
    const overlap = present.filter((t) => absent.includes(t))
    if (overlap.length > 0) {
      throw new GoldSetValidationError(
        `Tag(s) appear in both "present" and "absent" for "${slug}" at ${where}: ${overlap.join(', ')}`
      )
    }
    const sampledFor =
      annotation.sampledFor === undefined
        ? undefined
        : (checkTagList(annotation.sampledFor, 'sampledFor', where) as GoldSetFocusTag[])

    annotations.push({
      productSlug: slug,
      kind: annotation.kind,
      category: typeof annotation.category === 'string' ? annotation.category : '',
      present,
      absent,
      annotatedAt: typeof annotation.annotatedAt === 'string' ? annotation.annotatedAt : '',
      ...(sampledFor !== undefined ? { sampledFor } : {}),
      ...(typeof annotation.notes === 'string' && annotation.notes.length > 0
        ? { notes: annotation.notes }
        : {}),
    })
  }

  return {
    schemaVersion: GOLD_SET_SCHEMA_VERSION,
    ...(typeof root.rulesetVersion === 'string' ? { rulesetVersion: root.rulesetVersion } : {}),
    annotations,
  }
}

function checkTagList(value: unknown, field: string, where: string): GoldSetFocusTag[] {
  if (!Array.isArray(value)) {
    throw new GoldSetValidationError(`"${field}" must be an array at ${where}`)
  }
  const out: GoldSetFocusTag[] = []
  for (const v of value) {
    if (typeof v !== 'string') {
      throw new GoldSetValidationError(
        `"${field}" entries must be strings at ${where}, got ${typeof v}`
      )
    }
    if (!isGoldSetFocusTag(v)) {
      throw new GoldSetValidationError(
        `"${field}" entry "${v}" is not in GOLD_SET_FOCUS_TAGS at ${where}`
      )
    }
    out.push(v)
  }
  return out
}

// Deterministic serializer for diff-friendly writes: sorts by productSlug,
// sorts present/absent/sampledFor alphabetically, omits undefined fields.
export function serializeGoldSet(file: GoldSetFile): string {
  const sorted = [...file.annotations].sort((a, b) => a.productSlug.localeCompare(b.productSlug))
  const out = {
    schemaVersion: file.schemaVersion,
    ...(file.rulesetVersion ? { rulesetVersion: file.rulesetVersion } : {}),
    annotations: sorted.map((a) => ({
      productSlug: a.productSlug,
      kind: a.kind,
      category: a.category,
      present: [...a.present].sort(),
      absent: [...a.absent].sort(),
      annotatedAt: a.annotatedAt,
      ...(a.sampledFor ? { sampledFor: [...a.sampledFor].sort() } : {}),
      ...(a.notes ? { notes: a.notes } : {}),
    })),
  }
  return `${JSON.stringify(out, null, 2)}\n`
}
