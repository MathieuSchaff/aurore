import { useState } from 'react'

import { Button } from '@/component/Button/Button'
import { FormMessage } from '@/component/Feedback/ui/FormMessage/FormMessage'
import { Textarea } from '@/component/Input/Textarea/Textarea'
import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import { useAnnounce } from '@/hooks/useAnnounce'
import { isApiErrorCode } from '@/lib/helpers/apiError'
import { type DiscussionEntityType, useCreateReply } from '@/lib/queries/discussions'

interface ReplyFormProps {
  entityType: DiscussionEntityType
  slug: string
  threadId: string
}

export function ReplyForm({ entityType, slug, threadId }: ReplyFormProps) {
  const [content, setContent] = useState('')
  const { mutate, isPending, error } = useCreateReply(entityType, slug, threadId)
  const announce = useAnnounce()

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    if (!content.trim()) return
    mutate(
      { content: content.trim() },
      {
        onSuccess: () => {
          setContent('')
          announce('Réponse publiée')
        },
      }
    )
  }

  return (
    <form className="ui-form-panel" onSubmit={handleSubmit}>
      {isApiErrorCode(error, 'invalid_input') && (
        <FormMessage variant="error">
          Écrivez en texte simple, sans balises HTML. Pour les comparaisons, utilisez « inférieur à
          » ou « supérieur à ».
        </FormMessage>
      )}
      <SectionHeader title="Répondre" as="h3" />
      <Textarea
        label="Votre réponse"
        placeholder="Votre réponse…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        required
      />
      <Button type="submit" variant="primary" loading={isPending}>
        Répondre
      </Button>
    </form>
  )
}
