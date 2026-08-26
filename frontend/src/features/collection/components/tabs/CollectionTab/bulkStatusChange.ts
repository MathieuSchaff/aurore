import type { UserProductStatus } from '@aurore/shared'

import type { UpdateUserProductVariables } from '@/lib/queries/user-products'

type UpdateStatus = (variables: UpdateUserProductVariables) => Promise<unknown>
type Announce = (message: string) => void

export async function moveProductsToStatus(
  productIds: string[],
  status: UserProductStatus,
  updateStatus: UpdateStatus,
  announce: Announce
): Promise<string[]> {
  const results = await Promise.allSettled(
    productIds.map((id) => updateStatus({ id, input: { status } }))
  )
  const movedIds = productIds.filter((_, index) => results[index]?.status === 'fulfilled')
  const failedCount = productIds.length - movedIds.length

  if (failedCount === 0) {
    const count = movedIds.length
    announce(`${count} produit${count > 1 ? 's' : ''} déplacé${count > 1 ? 's' : ''}`)
  } else if (movedIds.length === 0) {
    announce(`Déplacement impossible pour ${failedCount} produit${failedCount > 1 ? 's' : ''}`)
  } else {
    const movedCount = movedIds.length
    announce(
      `${movedCount} produit${movedCount > 1 ? 's' : ''} déplacé${movedCount > 1 ? 's' : ''}, ${failedCount} échec${failedCount > 1 ? 's' : ''}`
    )
  }

  return movedIds
}
