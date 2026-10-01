import { useQuery } from '@tanstack/react-query'

import { isAvailableUserProduct, userProductQueries } from '@/lib/queries/user-products'
import { CollectionTab } from '../components/tabs/CollectionTab/CollectionTab'
import { UnavailableProduct } from '../components/UnavailableProduct'
import { useCollectionAdd } from '../context/CollectionAddContext'

export const CollectionPage = () => {
  const openAdd = useCollectionAdd()
  const { data: userProducts } = useQuery(userProductQueries.list())

  const available = userProducts?.filter(isAvailableUserProduct)
  const unavailable = userProducts?.filter((entry) => !isAvailableUserProduct(entry)) ?? []

  return (
    <>
      {available?.length || unavailable.length === 0 ? (
        <CollectionTab userProducts={available} onAddClick={openAdd} />
      ) : null}
      {unavailable.map((entry) => (
        <UnavailableProduct key={entry.id} entry={entry} />
      ))}
    </>
  )
}
