import { useQuery } from '@tanstack/react-query'

import { Button } from '@/component/Button/Button'
import { FormMessage } from '@/component/Feedback/ui/FormMessage/FormMessage'
import { comparisonQueries } from '@/lib/queries/comparisons'
import { ComparisonBody } from './ComparisonBody'

export function ComparisonPreview({ productIds }: { productIds: string[] }) {
  const preview = useQuery(comparisonQueries.preview(productIds))

  if (preview.isPending) {
    return <p role="status">Chargement du comparatif…</p>
  }
  if (preview.isError) {
    return (
      <div>
        <FormMessage variant="error">
          Impossible de charger le comparatif. Votre sélection est conservée.
        </FormMessage>
        <Button
          variant="outline"
          onClick={() => void preview.refetch()}
          disabled={preview.isFetching}
        >
          Réessayer
        </Button>
      </div>
    )
  }

  return <ComparisonBody products={preview.data} />
}
