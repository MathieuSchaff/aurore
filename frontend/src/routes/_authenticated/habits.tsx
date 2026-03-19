import { createFileRoute } from '@tanstack/react-router'

import { HabitsPage } from '../../features/habits/components/HabitsPage/HabitsPage'

export const Route = createFileRoute('/_authenticated/habits')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <HabitsPage />
    </div>
  )
}
