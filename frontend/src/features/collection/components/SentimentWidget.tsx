import clsx from 'clsx'
import { sentimentEmojis } from '../../../utils/sentimentMap'

interface SentimentWidgetProps {
  value: number | null
  onChange: (value: number) => void
}

const sentimentTitles: Record<number, string> = {
  1: 'Horrible',
  2: 'Pas convaincu',
  3: 'Neutre',
  4: 'Bien',
  5: 'Coup de cœur',
}

export function SentimentWidget({ value, onChange }: SentimentWidgetProps) {
  return (
    <div className="sentiment-widget" role="group" aria-label="Ressenti">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          className={clsx('sentiment-option', value === s && 'active')}
          aria-pressed={value === s}
          onClick={() => onChange(s)}
          title={sentimentTitles[s]}
        >
          <span role="img" aria-label={sentimentTitles[s]}>
            {sentimentEmojis[s]}
          </span>
        </button>
      ))}
    </div>
  )
}
