import type {
  CreateReplyInput,
  CreateThreadInput,
  DiscussionReply,
  DiscussionThread,
} from '@aurore/shared'

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw/http'
import { describe, expect, it } from 'vitest'

import { server } from '@/test/msw/server'
import { renderWithProviders } from '@/test/utils'
import { ReplyForm } from '../components/ReplyForm'
import { ThreadForm } from '../components/ThreadForm'

const thread = {
  id: 'thread-1',
  productId: 'product-1',
  ingredientId: null,
  authorId: 'author-1',
  authorName: 'lea',
  title: 'Mon expérience',
  content: 'Texte simple',
  replyCount: 0,
  createdAt: '2026-10-23T08:00:00.000Z',
} satisfies DiscussionThread

describe('discussion validation feedback', () => {
  it('explains a rejected thread and keeps the draft for correction', async () => {
    const user = userEvent.setup()
    const correctedContent = 'Mon expérience détaillée. '.repeat(100)
    let submittedContent: unknown
    server.use(
      http.post('*/api/products/creme/discussions', async ({ request }) => {
        const body = (await request.json()) as CreateThreadInput
        submittedContent = body.content
        if (body.content === correctedContent.trim()) {
          return HttpResponse.json(
            {
              success: true,
              data: { ...thread, content: body.content } satisfies DiscussionThread,
            },
            { status: 201 }
          )
        }
        return HttpResponse.json({ success: false, error: 'invalid_input' }, { status: 400 })
      })
    )
    renderWithProviders(<ThreadForm entityType="product" slug="creme" />)
    await user.click(screen.getByRole('button', { name: /ouvrir une discussion/i }))
    await user.type(screen.getByRole('textbox', { name: /sujet/i }), thread.title)
    const content = screen.getByRole('textbox', { name: /votre message/i })
    await user.click(content)
    await user.paste('pH <5 et >4')
    await user.click(screen.getByRole('button', { name: /publier la discussion/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/sans balises HTML/i)
    expect(screen.getByRole('alert')).toHaveTextContent(/inférieur à/i)
    expect(content).toHaveValue('pH <5 et >4')
    expect(screen.getByRole('textbox', { name: /sujet/i })).toHaveValue(thread.title)

    await user.clear(content)
    await user.paste(correctedContent)
    await user.click(screen.getByRole('button', { name: /publier la discussion/i }))
    await screen.findByRole('button', { name: /ouvrir une discussion/i })
    expect(submittedContent).toBe(correctedContent.trim())
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('explains a rejected ingredient reply and submits the corrected text intact', async () => {
    const user = userEvent.setup()
    const correctedContent = 'Une réponse détaillée. '.repeat(100)
    let submittedContent: unknown
    server.use(
      http.post('*/api/ingredients/glycerin/discussions/thread-1/replies', async ({ request }) => {
        const body = (await request.json()) as CreateReplyInput
        submittedContent = body.content
        if (body.content === correctedContent.trim()) {
          const reply = {
            id: 'reply-1',
            threadId: thread.id,
            authorId: thread.authorId,
            authorName: thread.authorName,
            content: body.content,
            createdAt: thread.createdAt,
          } satisfies DiscussionReply
          return HttpResponse.json({ success: true, data: reply }, { status: 201 })
        }
        return HttpResponse.json({ success: false, error: 'invalid_input' }, { status: 400 })
      })
    )
    renderWithProviders(<ReplyForm entityType="ingredient" slug="glycerin" threadId={thread.id} />)
    const content = screen.getByRole('textbox', { name: /votre réponse/i })
    await user.click(content)
    await user.paste('<b>Mon retour</b>')
    await user.click(screen.getByRole('button', { name: /^répondre$/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/sans balises HTML/i)
    expect(content).toHaveValue('<b>Mon retour</b>')

    await user.clear(content)
    await user.paste(correctedContent)
    await user.click(screen.getByRole('button', { name: /^répondre$/i }))
    await waitFor(() => expect(content).toHaveValue(''))
    expect(submittedContent).toBe(correctedContent.trim())
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
