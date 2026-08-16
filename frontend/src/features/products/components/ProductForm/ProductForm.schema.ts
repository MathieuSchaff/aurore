import {
  type CreateProductInput,
  PRODUCT_AMOUNT_UNIT_VALUES,
  PRODUCT_CATEGORY_VALUES,
  PRODUCT_TEXTURE_VALUES,
  PRODUCT_UNIT_VALUES,
  type ProductAmountUnit,
  type ProductTexture,
  type ProductUnit,
  type UpdateProductInput,
} from '@aurore/shared'

import { z } from 'zod'

import type { ProductDetail } from '@/lib/queries/products'

const productEditFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Le nom du produit est obligatoire.')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères.'),
  slug: z
    .string()
    .trim()
    .max(100, 'Le slug ne peut pas dépasser 100 caractères.')
    .refine((v) => v === '' || /^[a-z0-9-]+$/.test(v), {
      message: 'Slug invalide : minuscules, chiffres et tirets uniquement.',
    }),
  brand: z
    .string()
    .trim()
    .min(1, 'La marque est obligatoire.')
    .max(200, 'La marque ne peut pas dépasser 200 caractères.'),
  category: z.enum(PRODUCT_CATEGORY_VALUES),
  kind: z.string().trim().min(1, 'La catégorie est obligatoire.').max(100),
  unit: z
    .string()
    .trim()
    .min(1, "L'unité est obligatoire.")
    .refine((v) => (PRODUCT_UNIT_VALUES as readonly string[]).includes(v), {
      message: 'Unité invalide.',
    }),
  priceEuros: z
    .string()
    .trim()
    .refine((v) => v === '' || (!Number.isNaN(parseFloat(v)) && parseFloat(v) >= 0), {
      message: 'Prix invalide.',
    }),
  totalAmount: z
    .string()
    .trim()
    .refine((v) => v === '' || (/^\d+$/.test(v) && parseInt(v, 10) >= 1), {
      message: 'Quantité invalide.',
    }),
  amountUnit: z
    .string()
    .trim()
    .refine((v) => v === '' || (PRODUCT_AMOUNT_UNIT_VALUES as readonly string[]).includes(v), {
      message: 'Unité de contenance invalide.',
    }),
  // Empty = unset. Backend stores ProductTexture | null.
  texture: z
    .string()
    .trim()
    .refine((v) => v === '' || (PRODUCT_TEXTURE_VALUES as readonly string[]).includes(v), {
      message: 'Texture invalide.',
    }),
  inci: z.string().max(5000, 'La liste INCI ne peut pas dépasser 5000 caractères.'),
  description: z.string().max(5000, 'La description ne peut pas dépasser 5000 caractères.'),
  notes: z.string().max(5000, 'Les notes ne peuvent pas dépasser 5000 caractères.'),
  // Empty = cleared, otherwise must be a valid URL.
  url: z.union([
    z.literal(''),
    z.url('URL invalide.').max(2000, 'Le lien produit ne peut pas dépasser 2000 caractères.'),
  ]),
  imageUrl: z.union([
    z.literal(''),
    z
      .url('URL image invalide.')
      .max(2000, "L'URL de l'image ne peut pas dépasser 2000 caractères."),
  ]),
})

export type ProductEditFormInput = z.infer<typeof productEditFormSchema>

export function emptyProductEditForm(): ProductEditFormInput {
  return {
    name: '',
    slug: '',
    brand: '',
    category: PRODUCT_CATEGORY_VALUES[0],
    kind: '',
    unit: '',
    priceEuros: '',
    totalAmount: '',
    amountUnit: '',
    texture: '',
    inci: '',
    description: '',
    notes: '',
    url: '',
    imageUrl: '',
  }
}

export function productToEditForm(p: ProductDetail): ProductEditFormInput {
  return {
    name: p.name ?? '',
    slug: p.slug ?? '',
    brand: p.brand ?? '',
    category: (p.category ?? PRODUCT_CATEGORY_VALUES[0]) as ProductEditFormInput['category'],
    kind: p.kind ?? '',
    unit: p.unit ?? '',
    priceEuros: p.priceCents != null ? (p.priceCents / 100).toFixed(2) : '',
    totalAmount: p.totalAmount != null ? String(p.totalAmount) : '',
    amountUnit: p.amountUnit ?? '',
    texture: p.texture ?? '',
    inci: p.inci ?? '',
    description: p.description ?? '',
    notes: p.notes ?? '',
    url: p.url ?? '',
    imageUrl: p.imageUrl ?? '',
  }
}

// Submit-time validation is scoped to the fields the author actually touched, mirroring
// `clearOrOmit` below: a value the PATCH will not carry must not block an unrelated edit.
// Seed rows predate today's bounds (inci over 5000 chars, totalAmount at 0), and validating
// them full-form made an untouched field reject a sane note change.
// `original` null = create mode, where every field is submitted and so validated.
export function firstBlockingIssue(
  form: ProductEditFormInput,
  original: ProductDetail | null
): string | null {
  const parsed = productEditFormSchema.safeParse(form)
  if (parsed.success) return null

  const pristine = original ? productToEditForm(original) : null
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof ProductEditFormInput | undefined
    if (pristine && field != null && form[field] === pristine[field]) continue
    return issue.message
  }
  return null
}

// Wire format for POST /api/products: empty = omit (undefined).
export function productEditFormToCreateInput(form: ProductEditFormInput): CreateProductInput {
  const priceEuros = form.priceEuros.trim()
  const totalAmount = form.totalAmount.trim()
  const slug = form.slug.trim()
  return {
    name: form.name.trim(),
    slug: slug === '' ? undefined : slug,
    brand: form.brand.trim(),
    category: form.category,
    kind: form.kind.trim(),
    unit: form.unit.trim() as ProductUnit,
    priceCents: priceEuros === '' ? undefined : Math.round(parseFloat(priceEuros) * 100),
    totalAmount: totalAmount === '' ? undefined : parseInt(totalAmount, 10),
    amountUnit: form.amountUnit.trim() ? (form.amountUnit.trim() as ProductAmountUnit) : undefined,
    texture: form.texture.trim() ? (form.texture.trim() as ProductTexture) : undefined,
    inci: form.inci.trim() || undefined,
    description: form.description.trim() || undefined,
    notes: form.notes.trim() || undefined,
    url: form.url.trim() || undefined,
    imageUrl: form.imageUrl.trim() || undefined,
  }
}

// PATCH /api/products/:id: empty + previously set becomes null (clear); empty + was empty becomes undefined.
export function productEditFormToUpdateInput(
  form: ProductEditFormInput,
  original: ProductDetail
): UpdateProductInput {
  const clearOrOmit = <T>(trimmed: string, value: T | null, originalValue: unknown) => {
    // A column already holding '' has nothing to clear: sending null would drag an
    // untouched field into the PATCH, and the backend 500s parsing '' as the `old`
    // side of an enum diff (seed rows carry '' in amountUnit).
    if (trimmed === '') return originalValue != null && originalValue !== '' ? null : undefined
    // Unchanged values are omitted. Sending an untouched value again validates it, which
    // rejects legacy data that predates a stricter rule (e.g. a long
    // space-separated inci) and 400s an unrelated edit.
    if (value === originalValue) return undefined
    return value
  }
  const priceEuros = form.priceEuros.trim()
  const totalAmount = form.totalAmount.trim()
  // Backend never auto-regenerates slug from name; omitting keeps URL stable.
  const slug = form.slug.trim()
  return {
    name: form.name.trim(),
    slug: slug !== '' && slug !== original.slug ? slug : undefined,
    brand: form.brand.trim(),
    category: form.category,
    kind: form.kind.trim(),
    unit: form.unit.trim() as ProductUnit,
    priceCents: clearOrOmit(
      priceEuros,
      priceEuros === '' ? null : Math.round(parseFloat(priceEuros) * 100),
      original.priceCents
    ),
    totalAmount: clearOrOmit(
      totalAmount,
      totalAmount === '' ? null : parseInt(totalAmount, 10),
      original.totalAmount
    ),
    amountUnit: clearOrOmit(
      form.amountUnit.trim(),
      form.amountUnit.trim() as ProductAmountUnit,
      original.amountUnit
    ),
    texture: clearOrOmit(
      form.texture.trim(),
      form.texture.trim() as ProductTexture,
      original.texture
    ),
    inci: clearOrOmit(form.inci.trim(), form.inci.trim(), original.inci),
    description: clearOrOmit(
      form.description.trim(),
      form.description.trim(),
      original.description
    ),
    notes: clearOrOmit(form.notes.trim(), form.notes.trim(), original.notes),
    url: clearOrOmit(form.url.trim(), form.url.trim(), original.url),
    imageUrl: clearOrOmit(form.imageUrl.trim(), form.imageUrl.trim(), original.imageUrl),
  }
}
