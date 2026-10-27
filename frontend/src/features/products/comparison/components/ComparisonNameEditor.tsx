import { useBlocker } from '@tanstack/react-router'
import { useRef, useState } from 'react'

import { FormMessage } from '@/component/Feedback/ui/FormMessage/FormMessage'
import { useUpdateComparison } from '@/lib/queries/comparisons'
import { ComparisonHeader } from './ComparisonHeader'

type Props = { id: string; savedName: string | null }

function getNameStatus(
  {
    isPending,
    isError,
    isSuccess,
  }: Pick<ReturnType<typeof useUpdateComparison>, 'isPending' | 'isError' | 'isSuccess'>,
  isDirty: boolean
): string {
  if (isPending) return 'Enregistrement du nom…'
  if (isError) return 'Nom non enregistré.'
  if (isDirty) return 'Nom modifié, non enregistré.'
  if (isSuccess) return 'Nom enregistré.'
  return 'Modifiez le nom puis enregistrez.'
}

export function ComparisonNameEditor({ id, savedName }: Props) {
  const rename = useUpdateComparison({ inlineError: true })
  const saving = useRef(false)
  const [editor, setEditor] = useState({
    sourceName: savedName,
    confirmedName: savedName ?? '',
    draft: savedName ?? '',
  })

  if (editor.sourceName !== savedName) {
    setEditor({
      sourceName: savedName,
      confirmedName: savedName ?? '',
      draft:
        !rename.isPending && editor.draft === editor.confirmedName
          ? (savedName ?? '')
          : editor.draft,
    })
  }

  const isDirty = editor.draft.trim() !== editor.confirmedName
  useBlocker({
    shouldBlockFn: () =>
      rename.isPending ||
      (isDirty && !window.confirm('Quitter sans enregistrer le nom de la comparaison ?')),
    enableBeforeUnload: () => isDirty || rename.isPending,
  })

  const save = () => {
    if (saving.current || !isDirty || editor.draft.trim().length > 120) return
    const submitted = editor.draft
    saving.current = true
    rename.mutate(
      { id, input: { name: submitted.trim() || null } },
      {
        onSuccess: (comparison) => {
          const confirmedName = comparison.name ?? ''
          setEditor((current) => ({
            ...current,
            confirmedName,
            draft: current.draft === submitted ? confirmedName : current.draft,
          }))
        },
        onSettled: () => {
          saving.current = false
        },
      }
    )
  }

  const status = getNameStatus(rename, isDirty)

  return (
    <>
      <ComparisonHeader
        name={editor.draft}
        onNameChange={(draft) => setEditor((current) => ({ ...current, draft }))}
        onSave={save}
        onCancel={
          isDirty || rename.isError
            ? () => {
                if (saving.current) return
                setEditor((current) => ({ ...current, draft: current.confirmedName }))
                rename.reset()
              }
            : undefined
        }
        canSave={isDirty}
        isPending={rename.isPending}
        isNameDisabled={false}
        submitLabel="Enregistrer le nom"
        nameStatus={status}
      />
      {rename.isError && (
        <FormMessage variant="error">
          Nom non enregistré. Votre saisie est conservée. Réessayez avec « Enregistrer le nom ».
        </FormMessage>
      )}
    </>
  )
}
