import clsx from 'clsx'

import { sentimentEmojis } from '@/utils/sentimentMap'

type SentimentValue = 1 | 2 | 3 | 4 | 5

interface SentimentPickerProps {
  value: number | null | undefined
  onChange: (value: SentimentValue) => void
}

export function SentimentPicker({ value, onChange }: SentimentPickerProps) {
  return (
    <>
      <span className="pds-section-title">Ressenti rapide</span>
      <fieldset className="pds-sentiment-row" aria-label="Ressenti rapide">
        {([1, 2, 3, 4, 5] as const).map((val) => (
          <button
            key={val}
            type="button"
            className={clsx('pds-sentiment-btn', value === val && 'active')}
            aria-label={`Ressenti ${val} sur 5`}
            aria-pressed={value === val}
            onClick={() => onChange(val)}
          >
            <span className="pds-emoji">{sentimentEmojis[val]}</span>
          </button>
        ))}
      </fieldset>
    </>
  )
}
