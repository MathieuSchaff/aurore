import { useState } from 'react'

import { Button } from '@/component/Button/Button'
import { FormActions } from '@/component/Input/FormActions/FormActions'
import { Input } from '@/component/Input/Input'
import { Textarea } from '@/component/Input/Textarea/Textarea'
import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import { useAnnounce } from '@/hooks/useAnnounce'
import { useCreateThread } from '@/lib/queries/discussions'

interface ThreadFormProps {
  entityType: 'product' | 'ingredient'
  slug: string
}

export function ThreadForm({ entityType, slug }: ThreadFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useCreateThread(entityType, slug)
  const announce = useAnnounce()

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    mutate(
      { title: title.trim(), content: content.trim() },
      {
        onSuccess: () => {
          setTitle('')
          setContent('')
          setOpen(false)
          announce('Discussion publiée')
        },
      }
    )
  }

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Ouvrir une discussion
      </Button>
    )
  }

  return (
    <form className="thread-form ui-form-panel" onSubmit={handleSubmit}>
      <SectionHeader title="Nouvelle discussion" as="h3" />
      <Input
        label="Sujet"
        placeholder="Sujet (ex: Ce produit m'a fait des boutons)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={120}
        required
      />
      {/* Not "Votre expérience": PostComposer can be open on the same tab and
          accessible names must stay distinct. */}
      <Textarea
        label="Votre message"
        placeholder="Décrivez votre expérience…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        required
      />
      {/* Suffixed labels, same reason as the message label above. */}
      <FormActions
        onCancel={() => setOpen(false)}
        cancelLabel="Annuler la discussion"
        submitLabel="Publier la discussion"
        isPending={isPending}
      />
    </form>
  )
}
