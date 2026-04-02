import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/component/Button/Button'
import { PageHeader } from '@/component/Layout/PageHeader/PageHeader'
import { type TabOption, Tabs } from '@/component/Tabs/Tabs'
import { HabitDetail } from '../HabitDetail'
import { HabitFormDialog } from '../HabitFormDialog'
import { HabitListView } from '../HabitListView'
import { JournalView } from '../JournalView'
import { TodayView } from '../TodayView'

type View = 'today' | 'all' | 'journal'

const viewTabs: TabOption<View>[] = [
  { id: 'today', label: "Aujourd'hui" },
  { id: 'all', label: 'Toutes' },
  { id: 'journal', label: 'Journal' },
]

export function HabitsPage() {
  const [view, setView] = useState<View>('today')
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  return (
    <div className="habits-page">
      <PageHeader
        title="Habitudes"
        actionsClassName="list-header__actions-group"
        actions={
          <Button type="button" variant="primary" size="md" onClick={() => setShowCreateForm(true)}>
            <Plus size={14} />
            <span>Nouvelle habitude</span>
          </Button>
        }
      />

      <div className="habits-tabs-wrapper">
        <Tabs options={viewTabs} activeTab={view} onTabChange={setView} />
      </div>

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
