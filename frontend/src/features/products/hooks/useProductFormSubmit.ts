import type { ReplaceProductTagsInput } from '@aurore/shared'

import { useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'

import {
  PRODUCT_FORM_ERRORS,
  type ProductFormField,
} from '@/features/products/components/ProductForm/formErrors'
import type { IngredientItem } from '@/features/products/components/ProductForm/IngredientsFieldset'
import {
  ingredientDraftError,
  ingredientDraftPayload,
} from '@/features/products/components/ProductForm/ingredientDraft'
import {
  firstBlockingIssue,
  type ProductEditFormInput,
  productEditFormToCreateInput,
  productEditFormToUpdateInput,
} from '@/features/products/components/ProductForm/ProductForm.schema'
import { extractFormError } from '@/lib/helpers/apiError'
import {
  type ProductDetail,
  productKeys,
  productQueries,
  useCreateProduct,
  useUpdateProduct,
} from '@/lib/queries/products'

type TagPayload = ReplaceProductTagsInput['tags'][number]

type CreateArgs = {
  mode: 'create'
  product?: never
}

type EditArgs = {
  mode: 'edit'
  product: ProductDetail
}

type Args = (CreateArgs | EditArgs) & {
  form: ProductEditFormInput
  ingredients?: IngredientItem[]
  isIngredientsDirty?: boolean
  isTagsDirty: boolean
  canManageLinks: boolean
  tags: Array<{ tagId: string; relevance: TagPayload['relevance'] }>
  onSuccess: (slug: string) => void | Promise<void>
}

function firstBlockingDraftIssue(args: Args): string | null {
  const issue = firstBlockingIssue(args.form, args.mode === 'edit' ? args.product : null)
  if (issue) return issue
  if (!args.canManageLinks || !args.isIngredientsDirty) return null
  const invalid = args.ingredients?.find((item) => ingredientDraftError(item))
  return invalid ? `${invalid.ingredientName} : ${ingredientDraftError(invalid)}` : null
}

export function useProductFormSubmit(args: Args) {
  const queryClient = useQueryClient()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const submitting = useRef(false)
  const [isPending, setIsPending] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<{ field: ProductFormField; message: string } | null>(
    null
  )

  const linksPayload = () =>
    args.canManageLinks
      ? {
          ...(args.isTagsDirty
            ? { tags: args.tags.map((tag) => ({ tagId: tag.tagId, relevance: tag.relevance })) }
            : {}),
          ...(args.isIngredientsDirty
            ? { ingredients: ingredientDraftPayload(args.ingredients ?? []) }
            : {}),
        }
      : {}

  async function submitCreate(data: ProductEditFormInput): Promise<string> {
    const product = await createProduct.mutateAsync({
      ...productEditFormToCreateInput(data),
      ...linksPayload(),
    })
    return product.slug
  }

  function removeDetailCache(slug: string) {
    queryClient.removeQueries({
      queryKey: productQueries.bySlug(slug).queryKey,
      exact: true,
    })
    queryClient.removeQueries({
      queryKey: productKeys.detailPagesBySlug(slug),
    })
  }

  async function submitEdit(data: ProductEditFormInput, current: ProductDetail): Promise<string> {
    const updated = await updateProduct.mutateAsync({
      id: current.id,
      data: { ...productEditFormToUpdateInput(data, current), ...linksPayload() },
    })
    // Force a cold read on return-to-detail so the updated detail page refetches
    removeDetailCache(updated.slug)
    // Drop stale bySlug cache when slug changes, else orphaned under old key
    if (updated.slug !== current.slug) removeDetailCache(current.slug)
    return updated.slug
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting.current) return

    const blocking = firstBlockingDraftIssue(args)
    if (blocking) {
      setError(blocking)
      e.currentTarget.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }

    submitting.current = true
    setIsPending(true)
    setError(null)
    setFieldError(null)
    try {
      // Both wire converters trim every field, so sending the raw form is the same as
      // sending the parsed one
      // We have no parsed form here: the parse may fail on untouched fields
      const nextSlug =
        args.mode === 'create'
          ? await submitCreate(args.form)
          : await submitEdit(args.form, args.product)
      await args.onSuccess(nextSlug)
    } catch (err) {
      const { field, message } = extractFormError(err, PRODUCT_FORM_ERRORS)
      setError(message)
      setFieldError(field ? { field, message } : null)
    } finally {
      submitting.current = false
      setIsPending(false)
    }
  }

  return {
    handleSubmit,
    error,
    fieldError,
    clearError: () => {
      setError(null)
      setFieldError(null)
    },
    isPending,
    submitLabel: SUBMIT_LABELS[args.mode][isPending ? 'pending' : 'idle'],
  }
}

const SUBMIT_LABELS = {
  create: { idle: 'Créer le produit', pending: 'Création…' },
  edit: { idle: 'Enregistrer', pending: 'Enregistrement…' },
} as const satisfies Record<Args['mode'], { idle: string; pending: string }>
