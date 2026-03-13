import { useState } from 'react'

import { HabitDetail } from '../../Habits/HabitDetail'
import { HabitFormDialog } from '../../Habits/HabitFormDialog'
import { HabitListView } from '../../Habits/HabitListView'
import { JournalView } from '../../Habits/JournalView'
import { TodayView } from '../../Habits/TodayView'

type View = 'today' | 'all' | 'journal'

export function HabitsPage() {
  const [view, setView] = useState<View>('today')
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  return (
    <div className="habits-page">
      <header className="habits-header">
        <div>
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="habits-header__create-btn"
          >
            <div className="habits-header__create-btn__icon">+</div>
            Nouvelle habitude
          </button>
        </div>
        <div className="habits-tabs">
          <TabButton active={view === 'today'} onClick={() => setView('today')}>
            Aujourd'hui
          </TabButton>
          <TabButton active={view === 'all'} onClick={() => setView('all')}>
            Toutes
          </TabButton>
          <TabButton active={view === 'journal'} onClick={() => setView('journal')}>
            Journal
          </TabButton>
        </div>
      </header>
      <main className="habits-main">
        {view === 'today' && <TodayView onSelectHabit={setSelectedHabitId} />}
        {view === 'all' && <HabitListView onSelectHabit={setSelectedHabitId} />}
        {view === 'journal' && <JournalView date={new Date().toISOString().split('T')[0]} />}
      </main>

      {selectedHabitId && (
        <HabitDetail habitId={selectedHabitId} onClose={() => setSelectedHabitId(null)} />
      )}

      {showCreateForm && (
        <HabitFormDialog
          onClose={() => setShowCreateForm(false)}
          onCreated={() => setView('today')}
        />
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`habits-tab-btn ${active ? 'habits-tab-btn--active' : ''}`}
    >
      {children}
    </button>
  )
}
