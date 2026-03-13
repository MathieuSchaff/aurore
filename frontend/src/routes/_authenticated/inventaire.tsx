import { createFileRoute } from '@tanstack/react-router'

import { InventairePage } from '../../component/pages/Inventaire/Inventaire'

export const Route = createFileRoute('/_authenticated/inventaire')({
  component: RouteComponent,
})

function RouteComponent() {
  return <InventairePage />
}
