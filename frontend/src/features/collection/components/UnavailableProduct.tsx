import { useId, useState } from 'react'

import { Button, ButtonLink } from '@/component/Button/Button'
import { Select } from '@/component/Input/Select/Select'
import {
  type UserProductEntry,
  useDeleteUserProduct,
  useUpdateUserProduct,
} from '@/lib/queries/user-products'
import { statusLabels } from '../constants'
import { PdsExperienceSection } from './tabs/CollectionTab/ProductViews/Detailed/PdsExperienceSection'
import { DeleteConfirmDialog } from './tabs/CollectionTab/parts/DeleteConfirmDialog'

export function UnavailableProduct({ entry }: { entry: UserProductEntry }) {
  const titleId = useId()
  const update = useUpdateUserProduct()
  const remove = useDeleteUserProduct()
  const [confirmRemove, setConfirmRemove] = useState(false)

  return (
    <section aria-labelledby={titleId} className="coll-unavailable-product">
      <h2 id={titleId}>Produit indisponible</h2>
      <p>
        La fiche catalogue est indisponible. Vous pouvez conserver et modifier votre expérience
        personnelle.
      </p>
      <Select
        label="Statut"
        value={entry.status}
        options={Object.entries(statusLabels).map(([value, { label }]) => ({ value, label }))}
        onValueChange={(value) => {
          if (value in statusLabels)
            update.mutate({ id: entry.id, input: { status: value as UserProductEntry['status'] } })
        }}
        disabled={update.isPending}
      />
      <PdsExperienceSection p={entry} updateMutation={update} />
      <ButtonLink to="/collection/achats" variant="outline">
        Voir mes achats
      </ButtonLink>
      <Button variant="ghost" onClick={() => setConfirmRemove(true)}>
        Retirer de ma collection
      </Button>
      {confirmRemove && (
        <DeleteConfirmDialog
          isPending={remove.isPending}
          onClose={() => setConfirmRemove(false)}
          onConfirm={() => remove.mutate(entry.id, { onSuccess: () => setConfirmRemove(false) })}
        />
      )}
    </section>
  )
}
