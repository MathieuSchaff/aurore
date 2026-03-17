import { useQuery } from '@tanstack/react-query'
import { CheckSquare, Plus } from 'lucide-react'
import { useState } from 'react'

import { taskQueries, useCreateTask } from '../../../lib/queries/tasks'
import { TaskItem } from '../../tasks/TaskItem'
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

  if (isLoading) return <div className="tasks-page-loading">Chargement des tâches...</div>

  return (
    <div className="tasks-page">
      <header className="tasks-page__header">
        <h1 className="tasks-page__title">Mes Tâches</h1>
      </header>

      <form className="tasks-page__add-form" onSubmit={handleCreateTask}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Ajouter une nouvelle tâche..."
          className="tasks-page__add-input"
        />
        <button type="submit" disabled={createTask.isPending} className="tasks-page__add-btn">
          <Plus size={20} />
        </button>
      </form>

      <main className="tasks-page__main">
        <section className="tasks-section">
          <h2 className="tasks-section__title">À faire</h2>
          {tasks && tasks.length > 0 ? (
            <div className="tasks-list">
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="tasks-page__empty">
              <CheckSquare size={48} className="tasks-page__empty-icon" />
              <p>Toutes les tâches sont terminées ! 🎉</p>
            </div>
          )}
        </section>

        {todayTasks && todayTasks.length > 0 && (
          <section className="tasks-section tasks-section--done">
            <h2 className="tasks-section__title">Terminées aujourd'hui</h2>
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
