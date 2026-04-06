import clsx from 'clsx'
import { Pencil } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/component/Button/Button'
import './EditableSection.css'

type EditableSectionProps = {
  title: string
  isEditing: boolean
  onEdit: () => void
  readContent: ReactNode
  editContent: ReactNode
  className?: string
}

export function EditableSection({
  title,
  isEditing,
  onEdit,
  readContent,
  editContent,
  className,
}: EditableSectionProps) {
  return (
    <section
      className={clsx('editable-section', isEditing && 'editable-section--editing', className)}
    >
      <div className="editable-section__header">
        <h3 className="editable-section__title">{title}</h3>
        {!isEditing && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="editable-section__edit-btn"
            onClick={onEdit}
            aria-label={`Modifier ${title}`}
          >
            <Pencil size={16} aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="editable-section__body">{isEditing ? editContent : readContent}</div>
    </section>
  )
}
