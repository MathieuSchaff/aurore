import { describe, expect, it } from 'vitest'

import type { ProductDetail } from '@/lib/queries/products'
import {
  emptyProductEditForm,
  firstBlockingIssue,
  productEditFormToCreateInput,
  productEditFormToUpdateInput,
  productToEditForm,
} from '../ProductForm.schema'

function makeProductDetail(overrides: Partial<ProductDetail> = {}): ProductDetail {
  return {
    id: 'p1',
    slug: 'product-x',
    name: 'Product X',
    brand: 'Brand X',
    category: 'skincare',
    kind: 'serum',
    unit: 'pump',
    priceCents: 1299,
    totalAmount: 30,
    amountUnit: 'ml',
    texture: null,
    inci: null,
    description: null,
    notes: null,
    url: null,
    imageUrl: null,
    ingredients: [],
    patents: [],
    ...overrides,
  } as unknown as ProductDetail
}

describe('productToEditForm', () => {
  it('coerces nullable DB fields to empty strings so DOM inputs stay controlled', () => {
    const result = productToEditForm(
      makeProductDetail({
        texture: null,
        inci: null,
        description: null,
        notes: null,
        url: null,
        imageUrl: null,
      })
    )
    expect(result.texture).toBe('')
    expect(result.inci).toBe('')
    expect(result.description).toBe('')
    expect(result.notes).toBe('')
    expect(result.url).toBe('')
    expect(result.imageUrl).toBe('')
  })

  it('formats priceCents into a fixed-2 euro string', () => {
    expect(productToEditForm(makeProductDetail({ priceCents: 1299 })).priceEuros).toBe('12.99')
    expect(productToEditForm(makeProductDetail({ priceCents: 500 })).priceEuros).toBe('5.00')
  })

  it('renders empty priceEuros when priceCents is null', () => {
    expect(productToEditForm(makeProductDetail({ priceCents: null })).priceEuros).toBe('')
  })

  it('serializes totalAmount as string and null as empty', () => {
    expect(productToEditForm(makeProductDetail({ totalAmount: 30 })).totalAmount).toBe('30')
    expect(productToEditForm(makeProductDetail({ totalAmount: null })).totalAmount).toBe('')
  })
})

describe('productEditFormToCreateInput', () => {
  const baseForm = {
    ...emptyProductEditForm(),
    name: 'Test',
    brand: 'BrandX',
    kind: 'serum',
    unit: 'pump',
  }

  it('omits optional fields when their string value is empty', () => {
    const result = productEditFormToCreateInput(baseForm)
    expect(result.slug).toBeUndefined()
    expect(result.priceCents).toBeUndefined()
    expect(result.totalAmount).toBeUndefined()
    expect(result.amountUnit).toBeUndefined()
    expect(result.texture).toBeUndefined()
    expect(result.inci).toBeUndefined()
    expect(result.description).toBeUndefined()
    expect(result.notes).toBeUndefined()
    expect(result.url).toBeUndefined()
    expect(result.imageUrl).toBeUndefined()
  })

  it('converts priceEuros to cents via Math.round (handles float fuzz)', () => {
    expect(productEditFormToCreateInput({ ...baseForm, priceEuros: '12.99' }).priceCents).toBe(1299)
    expect(productEditFormToCreateInput({ ...baseForm, priceEuros: '5' }).priceCents).toBe(500)
    expect(productEditFormToCreateInput({ ...baseForm, priceEuros: '0.10' }).priceCents).toBe(10)
  })

  it('parses totalAmount as base-10 integer', () => {
    expect(productEditFormToCreateInput({ ...baseForm, totalAmount: '30' }).totalAmount).toBe(30)
  })

  it('trims string fields so accidental whitespace never reaches the API', () => {
    const result = productEditFormToCreateInput({
      ...baseForm,
      name: '  Spaced  ',
      brand: '  Brand  ',
      inci: '  aqua, glycerin  ',
    })
    expect(result.name).toBe('Spaced')
    expect(result.brand).toBe('Brand')
    expect(result.inci).toBe('aqua, glycerin')
  })
})

describe('productEditFormToUpdateInput', () => {
  const original = makeProductDetail({
    priceCents: 1299,
    totalAmount: 30,
    amountUnit: 'ml',
    texture: null,
    inci: 'water, glycerin',
  })

  function form(overrides: Partial<ReturnType<typeof emptyProductEditForm>> = {}) {
    return { ...productToEditForm(original), ...overrides }
  }

  it('omits a field when it stays empty AND original is null (nothing to clear)', () => {
    const result = productEditFormToUpdateInput(form({ texture: '' }), original)
    // texture: '' + original null gives undefined (omit)
    expect(result.texture).toBeUndefined()
  })

  // Seed rows hold '' in nullable columns. Emitting null there put an untouched field
  // in the PATCH, and the backend 500s parsing '' as the `old` side of an enum diff.
  it('omits a field whose original is already an empty string (nothing to clear)', () => {
    const emptyStrings = makeProductDetail({ amountUnit: '', inci: '', notes: '' })
    const result = productEditFormToUpdateInput(productToEditForm(emptyStrings), emptyStrings)
    expect(result.amountUnit).toBeUndefined()
    expect(result.inci).toBeUndefined()
    expect(result.notes).toBeUndefined()
  })

  it('sends null when a previously-set field is cleared (explicit unset)', () => {
    const result = productEditFormToUpdateInput(form({ priceEuros: '' }), original)
    // priceEuros cleared + original had priceCents gives null
    expect(result.priceCents).toBeNull()
  })

  it('keeps slug undefined when value is unchanged so the URL stays stable', () => {
    const result = productEditFormToUpdateInput(form({ slug: original.slug }), original)
    expect(result.slug).toBeUndefined()
  })

  it('sends slug only when explicitly changed', () => {
    const result = productEditFormToUpdateInput(form({ slug: 'new-slug' }), original)
    expect(result.slug).toBe('new-slug')
  })

  it('sends the new priceCents (rounded) when priceEuros changes', () => {
    const result = productEditFormToUpdateInput(form({ priceEuros: '19.99' }), original)
    expect(result.priceCents).toBe(1999)
  })
})

describe('firstBlockingIssue', () => {
  // Both seed shapes that used to block a sane edit: an inci past the cap, and a
  // totalAmount under the min.
  const legacy = makeProductDetail({
    inci: 'a'.repeat(8059),
    totalAmount: 0,
    notes: null,
  })

  function editForm(overrides: Partial<ReturnType<typeof emptyProductEditForm>> = {}) {
    return { ...productToEditForm(legacy), ...overrides }
  }

  it('lets an edit through when only untouched fields are out of bounds', () => {
    expect(firstBlockingIssue(editForm({ notes: 'une note saine' }), legacy)).toBeNull()
  })

  it('blocks when the author actually touched the out-of-bounds field', () => {
    const touched = editForm({ inci: `${'a'.repeat(8059)} et une virgule de plus` })
    expect(firstBlockingIssue(touched, legacy)).toBe(
      'La liste INCI ne peut pas dépasser 5000 caractères.'
    )
  })

  it('names the field in French rather than leaking the Zod default', () => {
    const clean = makeProductDetail()
    expect(
      firstBlockingIssue({ ...productToEditForm(clean), notes: 'x'.repeat(5001) }, clean)
    ).toBe('Les notes ne peuvent pas dépasser 5000 caractères.')
    expect(firstBlockingIssue({ ...productToEditForm(clean), url: 'pas-une-url' }, clean)).toBe(
      'URL invalide.'
    )
  })

  it('validates every field in create mode, where nothing is omitted from the payload', () => {
    const form = { ...emptyProductEditForm(), name: 'Test', brand: 'BrandX', kind: 'serum' }
    expect(firstBlockingIssue({ ...form, unit: 'pump' }, null)).toBeNull()
    expect(firstBlockingIssue({ ...form, unit: 'pump', inci: 'a'.repeat(5001) }, null)).toBe(
      'La liste INCI ne peut pas dépasser 5000 caractères.'
    )
  })

  it('still blocks a required field the author cleared', () => {
    expect(firstBlockingIssue(editForm({ name: '' }), legacy)).toBe(
      'Le nom du produit est obligatoire.'
    )
  })

  // A blank-but-not-empty name only fails once trim() runs before min(1). The empty-string
  // case above passes even without the trim, so it cannot catch losing it.
  it('blocks a name made only of whitespace', () => {
    expect(firstBlockingIssue(editForm({ name: '   ' }), legacy)).toBe(
      'Le nom du produit est obligatoire.'
    )
  })
})
