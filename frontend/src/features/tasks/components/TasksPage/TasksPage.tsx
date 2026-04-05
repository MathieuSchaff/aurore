import { useQuery } from '@tanstack/react-query'
import { CheckSquare, Plus } from 'lucide-react'
import { useState } from 'react'

import { EmptyState } from '@/component/Feedback/EmptyState/EmptyState'
import { Spinner } from '@/component/Feedback/Spinner/Spinner'
import { PageHeader } from '@/component/Layout/PageHeader/PageHeader'
import { SectionHeader } from '@/component/Typography/SectionHeader/SectionHeader'
import { taskQueries, useCreateTask } from '../../../../lib/queries/tasks'
import { TaskItem } from '../TaskItem'

import './TasksPage.css'

export function TasksPage() {
  const { data: tasks, isLoading } = useQuery(taskQueries.list())
  const { data: todayTasks } = useQuery(taskQueries.today())
  const createTask = useCreateTask()
  const [newTitle, setNewTitle] = useState('')

  const handleCreateTask = (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    createTask.mutate(
      { title: newTitle.trim() },
      {
        onSuccess: () => setNewTitle(''),
      }
    )
  }

  if (isLoading) return <div className="tasks-page__loading"><Spinner /></div>

  const pendingCount = tasks?.length ?? 0

  return (
    <div className="tasks-page">
      <PageHeader
        title="Mes Tâches"
        meta={`${pendingCount} tâche${pendingCount > 1 ? 's' : ''} à faire`}
        className="tasks-page__header"
      />

      <form className="tasks-page__add-form" onSubmit={handleCreateTask}>
        <input
          id="new-task"
          name="new-task"
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Ajouter une nouvelle tâche..."
          className="tasks-page__add-input"
        />
        <button type="submit" disabled={createTask.isPending} className="tasks-page__add-btn">
          <Plus size={14} />
        </button>
      </form>

      <main className="tasks-page__main">
        <section className="tasks-section">
          <SectionHeader title="À faire" variant="primary" />
          {tasks && tasks.length > 0 ? (
            <div className="tasks-list">
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CheckSquare size={24} />}
              title="Toutes les tâches sont terminées !"
              subtitle="Profite de ce moment 🎉"
            />
          )}
        </section>

        {todayTasks && todayTasks.length > 0 && (
          <section className="tasks-section tasks-section--done">
            <SectionHeader title="Terminées aujourd'hui" variant="primary" />
            <div className="tasks-list">
              {todayTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
