import { useStartDemo } from '../../../auth/hooks/useStartDemo'
import { Entries } from '../../components/marketing/Entries'
import { FounderNote } from '../../components/marketing/FounderNote'
import { Opening } from '../../components/marketing/Opening'
import { ProductJournal } from '../../components/marketing/ProductJournal'
import { Refusals } from '../../components/marketing/Refusals'

// Anonymous landing (ADR 0011: same "/", auth only swaps content).
// Shaped as a letter, not a funnel; the one-click demo is the only ask.
export function HomeMarketing() {
  const { startDemo, isPending: demoPending } = useStartDemo()

  return (
    <>
      <Opening onStartDemo={startDemo} demoPending={demoPending} />
      <ProductJournal />
      <Refusals />
      <Entries />
      <FounderNote onStartDemo={startDemo} demoPending={demoPending} />
    </>
  )
}
