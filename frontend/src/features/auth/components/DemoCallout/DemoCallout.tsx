import { Sparkles } from 'lucide-react'

import { Button } from '../../../../component/Button/Button'
import { useStartDemo } from '../../hooks/useStartDemo'

import './DemoCallout.css'

export const DemoCallout = () => {
  const { startDemo, isPending } = useStartDemo()

  return (
    <aside className="demo-callout" aria-label="Découvrir Aurore sans compte">
      <p className="demo-callout__title">Juste curieux ?</p>
      <p className="demo-callout__hint">
        Explorez Aurore avec une collection d'exemple, sans créer de compte.
      </p>
      <Button type="button" variant="primary" fullWidth loading={isPending} onClick={startDemo}>
        <Sparkles size={16} aria-hidden="true" />
        Essayer la démo
      </Button>
    </aside>
  )
}
