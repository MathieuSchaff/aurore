import { isSentimentValue, type SentimentValue } from '@aurore/shared'

// Level 6 = Holy Grail. Folded into sentiment so HG isn't a status.
// Labels stay gentle: the bottom of the scale is "not for me", never a verdict.
export const sentimentLabels: Record<SentimentValue, string> = {
  1: 'Pas pour moi',
  2: 'Bof',
  3: 'Neutre',
  4: 'Ça me va',
  5: "J'adore",
  6: 'Saint Graal',
}

// The wire carries a plain integer, so the scale is checked again here rather than assumed
export function getSentimentLabel(value: number | null | undefined): string | null {
  if (value == null || !isSentimentValue(value)) return null
  return sentimentLabels[value]
}
