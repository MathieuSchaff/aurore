#!/usr/bin/env bun
/**
 * Analyze unmatched images vs products without image.
 * Goal: surface candidates where renaming a product slug (or fixing image filename)
 * would create a match. Helps decide whether to rename or accept as truly missing.
 *
 * Usage:
 *   bun run backend/src/images/audit/analyze-orphans.ts
 *   bun run backend/src/images/audit/analyze-orphans.ts --brand uriage
 *   bun run backend/src/images/audit/analyze-orphans.ts --top 50
 */

import { readdirSync } from 'node:fs'
import { basename, extname, join } from 'node:path'

import { allProductData } from '../../db/seed/data/products'

const args = process.argv.slice(2)
const BRAND_FILTER = (() => {
  const i = args.indexOf('--brand')
  return i >= 0 ? args[i + 1]?.toLowerCase() : null
})()
const TOP = (() => {
  const i = args.indexOf('--top')
  return i >= 0 ? Number(args[i + 1]) : 30
})()

const IMAGES_DIR = join(import.meta.dir, '..', 'output', 'images')

const VOLUME_UNITS = /^\d+(ml|cl|l|g|mg|kg)$/
const PACK_UNITS = /^\d+x\d+(ml|cl|l|g|mg|kg)$/
const BARE_UNITS = new Set(['ml', 'cl', 'l', 'g', 'mg', 'kg'])

function stripRetailerId(slug: string): string {
  return slug.replace(/-\d{5,7}$/, '')
}

function premergeTokens(input: string[]): string[] {
  const merged: string[] = []
  for (let i = 0; i < input.length; i++) {
    const t = input[i]
    const next = input[i + 1]
    if ((t === 'n' || t === 'no') && next && /^[0-9a-z]{1,4}$/.test(next)) {
      merged.push(t + next)
      i++
      continue
    }
    if ((t === 'l' || t === 'd') && next && /^[aeiouhy][a-z]+$/.test(next)) {
      merged.push(t + next)
      i++
      continue
    }
    merged.push(t)
  }
  return merged
}

function normalize(slug: string): string {
  const arr = premergeTokens(stripRetailerId(slug).split('-').filter(Boolean))
  const out: string[] = []
  for (let i = 0; i < arr.length; i++) {
    const t = arr[i]
    if (VOLUME_UNITS.test(t) || PACK_UNITS.test(t)) {
      const prev = out[out.length - 1]
      const prev2 = out[out.length - 2]
      const blockedByClaim =
        prev2 !== undefined && (prev2 === 'en' || prev2 === 'in' || prev2 === 'n' || prev2 === 'no')
      if (prev !== undefined && /^[0-9]$/.test(prev) && !blockedByClaim) {
        out.pop()
        if (out.length && out[out.length - 1] === 'x') {
          out.pop()
          if (out.length && /^[0-9]$/.test(out[out.length - 1])) out.pop()
        }
      } else if (prev === 'x' && prev2 !== undefined && /^\d+$/.test(prev2)) {
        out.pop()
        out.pop()
      }
      continue
    }
    if (BARE_UNITS.has(t) && out.length) {
      const prev = out[out.length - 1]
      if (/^\d+$/.test(prev) || /^\d+x\d+$/.test(prev)) {
        out.pop()
        continue
      }
    }
    if (t === 'lot' && arr[i + 1] === 'de') {
      let j = i + 2
      while (
        j < arr.length &&
        (/^\d+$/.test(arr[j]) ||
          arr[j] === 'x' ||
          VOLUME_UNITS.test(arr[j]) ||
          PACK_UNITS.test(arr[j]) ||
          BARE_UNITS.has(arr[j]))
      ) {
        j++
      }
      if (j > i + 2) {
        i = j - 1
        continue
      }
    }
    if (t === 'spf' && /^\d+$/.test(arr[i + 1] ?? '')) {
      out.push(`spf${arr[i + 1]}`)
      i += 1
      continue
    }
    out.push(t)
  }
  return out.join('-')
}

function tokens(slug: string): string[] {
  return normalize(slug).split('-').filter(Boolean)
}

function tokenKey(slug: string): string {
  return normalize(slug).split('-').sort().join('-')
}

function jaccard(a: Set<string>, b: Set<string>): number {
  const inter = new Set([...a].filter((x) => b.has(x)))
  const union = new Set([...a, ...b])
  return union.size === 0 ? 0 : inter.size / union.size
}

const exactLookup = new Map<string, string>()
const normLookup = new Map<string, string>()
const tokenKeyLookup = new Map<string, string>()
for (const p of allProductData) {
  exactLookup.set(p.slug, p.slug)
  const noId = stripRetailerId(p.slug)
  if (noId !== p.slug) exactLookup.set(noId, p.slug)
  const norm = normalize(p.slug)
  if (!normLookup.has(norm)) normLookup.set(norm, p.slug)
  const key = tokenKey(p.slug)
  if (!tokenKeyLookup.has(key)) tokenKeyLookup.set(key, p.slug)
}

const imageFiles = readdirSync(IMAGES_DIR)

type Orphan = { file: string; rawSlug: string; tokens: Set<string> }
const orphans: Orphan[] = []

const matched = new Set<string>()
for (const file of imageFiles) {
  const ext = extname(file)
  const rawSlug = basename(file, ext)
  const exact = exactLookup.get(rawSlug)
  const norm = normLookup.get(normalize(rawSlug))
  const key = tokenKeyLookup.get(tokenKey(rawSlug))
  if (exact) {
    matched.add(exact)
    continue
  }
  if (norm) {
    matched.add(norm)
    continue
  }
  if (key) {
    matched.add(key)
    continue
  }
  if (BRAND_FILTER && !rawSlug.startsWith(BRAND_FILTER)) continue
  orphans.push({ file, rawSlug, tokens: new Set(tokens(rawSlug)) })
}

type Candidate = {
  slug: string
  brand: string
  name: string
  tokens: Set<string>
}
const candidates: Candidate[] = allProductData
  .filter((p) => !matched.has(p.slug))
  .filter((p) => !BRAND_FILTER || p.slug.startsWith(BRAND_FILTER))
  .map((p) => ({ slug: p.slug, brand: p.brand, name: p.name, tokens: new Set(tokens(p.slug)) }))

type NearMatch = {
  orphan: string
  product: string
  brand: string
  productName: string
  score: number
  shared: string[]
  onlyImage: string[]
  onlyProduct: string[]
}
const nearMatches: NearMatch[] = []

for (const orph of orphans) {
  let best: { c: Candidate; score: number } | null = null
  for (const c of candidates) {
    // Cheap brand prefix filter: tokens[0] must match (Jaccard explodes otherwise)
    const orphBrand = [...orph.tokens][0]
    const candBrand = [...c.tokens][0]
    if (orphBrand !== candBrand) continue
    const score = jaccard(orph.tokens, c.tokens)
    if (score >= 0.5 && (!best || score > best.score)) best = { c, score }
  }
  if (best) {
    const bestTokens = best.c.tokens
    const shared = [...orph.tokens].filter((t) => bestTokens.has(t))
    const onlyImage = [...orph.tokens].filter((t) => !bestTokens.has(t))
    const onlyProduct = [...bestTokens].filter((t) => !orph.tokens.has(t))
    nearMatches.push({
      orphan: orph.rawSlug,
      product: best.c.slug,
      brand: best.c.brand,
      productName: best.c.name,
      score: best.score,
      shared,
      onlyImage,
      onlyProduct,
    })
  }
}

nearMatches.sort((a, b) => b.score - a.score)

const orphansByBrand = new Map<string, number>()
for (const o of orphans) {
  const brand = [...o.tokens][0] ?? '?'
  orphansByBrand.set(brand, (orphansByBrand.get(brand) ?? 0) + 1)
}
const candidatesByBrand = new Map<string, number>()
for (const c of candidates) {
  const brand = [...c.tokens][0] ?? '?'
  candidatesByBrand.set(brand, (candidatesByBrand.get(brand) ?? 0) + 1)
}

console.log('\n=== Image orphan analysis ===\n')
console.log(`Orphan images:           ${orphans.length}`)
console.log(`Products without image:  ${candidates.length}`)
console.log(`Near matches (≥0.5):     ${nearMatches.length}`)

console.log('\n--- Brands with most orphan images ---')
const sortedOrphBrands = [...orphansByBrand.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)
for (const [b, n] of sortedOrphBrands) {
  const without = candidatesByBrand.get(b) ?? 0
  console.log(`  ${b.padEnd(20)} orphans=${String(n).padStart(4)}  productsNoImage=${without}`)
}

console.log(`\n--- Top ${TOP} near matches (highest score first) ---`)
for (const nm of nearMatches.slice(0, TOP)) {
  console.log(
    `  [${nm.score.toFixed(2)}] ${nm.orphan}\n         → ${nm.product}  (${nm.brand} — ${nm.productName})`
  )
  if (nm.onlyImage.length || nm.onlyProduct.length) {
    console.log(
      `         imgOnly=[${nm.onlyImage.join(',')}]  prodOnly=[${nm.onlyProduct.join(',')}]`
    )
  }
}

if (BRAND_FILTER) {
  console.log(`\n--- All orphan images for brand "${BRAND_FILTER}" ---`)
  for (const o of orphans) console.log(`  ${o.file}`)
  console.log(`\n--- All products without image for brand "${BRAND_FILTER}" ---`)
  for (const c of candidates) console.log(`  ${c.slug}  (${c.name})`)
}
